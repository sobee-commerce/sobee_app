import {ProductCard} from '@/components/card';
import {Button, LabelItemList} from '@/components/common';
import {useTheme} from '@/context';
import {formatCurrency} from '@/lib';
import {IBrand, ICategory} from '@/lib/interfaces';
import {
  useCreateOrderItemMutation,
  useGetFavoriteProductsQuery,
  useGetProductByIdQuery,
  useGetRecommendedProductsQuery,
  useGetRelatedProductsQuery,
  useToggleFavoriteProduct,
} from '@/services';
import {FONT_FAMILY, TYPOGRAPHY} from '@/theme';
import {ApplicationScreenProps} from '@/types';
import {APP_CONFIG} from '@/utils';
import {Heart, Minus, Plus} from 'lucide-react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {Rating} from 'react-native-ratings';
import Animated, {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import Questions from './components/Questions';
import Reviews from './components/Reviews';

const ProductDetailScreen = ({
  navigation,
  route,
}: ApplicationScreenProps<'ProductDetail'>) => {
  const {productId, name} = route.params;
  const {colors} = useTheme();
  const {data, isLoading} = useGetFavoriteProductsQuery();
  const favoriteProducts = data?.data || [];
  const isFavorite = !!favoriteProducts.find(f => f._id === productId);

  const {mutate} = useToggleFavoriteProduct();

  const onToggleFavorite = useCallback(() => {
    mutate(productId, {
      onSuccess: ({message}) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
      },
    });
  }, [mutate, productId]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: name,
      headerTitleAlign: 'center',
      headerRight: ({tintColor}) => (
        <Pressable style={{marginRight: 20}} onPress={onToggleFavorite}>
          {isLoading ? (
            <ActivityIndicator size={'small'} color={tintColor} />
          ) : (
            <Heart
              size={24}
              color={tintColor}
              fill={isFavorite ? colors.base.danger : 'none'}
            />
          )}
        </Pressable>
      ),
    });
  }, [
    colors,
    isFavorite,
    name,
    navigation,
    productId,
    isLoading,
    onToggleFavorite,
  ]);
  const scrollRef = useRef<ScrollView>(null);
  const getProductQuery = useGetProductByIdQuery(productId);
  const getRelatedProductsQuery = useGetRelatedProductsQuery(productId);
  const getRecommendedProductsQuery = useGetRecommendedProductsQuery(productId);

  const product = getProductQuery.data?.data!;

  const images =
    product?.type === 'SIMPLE'
      ? []
      : (product?.variants || []).flatMap(variant => variant.assets);
  const category = product?.category as ICategory;
  const brand = product?.brand as IBrand;
  const relatedProducts = getRelatedProductsQuery.data?.data || [];
  const recommendedProducts = getRecommendedProductsQuery.data?.data || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({y: 0, animated: true});
    }
  }, [productId, name]);

  const calculateDiscount = useCallback(
    (price: number = 0) => {
      const discount = product?.discount || 0;
      return price - (price * discount) / 100;
    },
    [product?.discount],
  );

  const discountPrice = useMemo(() => {
    return product?.type === 'SIMPLE'
      ? [calculateDiscount(product?.displayPrice)]
      : [
          calculateDiscount(product?.minPrice),
          calculateDiscount(product?.maxPrice),
        ];
  }, [
    calculateDiscount,
    product?.displayPrice,
    product?.maxPrice,
    product?.minPrice,
    product?.type,
  ]);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState({
    size: '',
    color: '',
  });
  const [showAddToCart, setShowAddToCart] = useState(false);

  const variants = useMemo(() => product?.variants || [], [product?.variants]);

  const optimizedData = useMemo(
    () => [
      {
        name: 'size',
        values: [...new Set(variants.map(v => v.size))],
      },
      {
        name: 'color',
        values: [...new Set(variants.map(v => v.color))],
      },
    ],
    [variants],
  );

  const renderDiscountPrice = useCallback(() => {
    return discountPrice?.map(v => formatCurrency(v * quantity)).join(' - ');
  }, [discountPrice, quantity]);

  const renderPrice = useCallback(() => {
    return (
      product?.type === 'SIMPLE'
        ? [product?.displayPrice]
        : [product?.minPrice || 0, product?.maxPrice || 0]
    )
      .map(v => formatCurrency(v * quantity))
      .join(' - ');
  }, [
    product?.displayPrice,
    product?.maxPrice,
    product?.minPrice,
    product?.type,
    quantity,
  ]);

  const addToCartMutation = useCreateOrderItemMutation();

  const onPressAddToCart = useCallback(() => {
    addToCartMutation.mutate(
      {
        amount: quantity,
        product: productId,
        color: selectedVariant.color,
        size: selectedVariant.size,
      },
      {
        onSuccess: _data => {
          if (_data.success) {
            ToastAndroid.show('Added to cart', ToastAndroid.SHORT);
            setShowAddToCart(false);
          } else {
            Alert.alert('Error', _data.message);
          }
        },
        onError: (err: any) => {
          Alert.alert('Error', err?.response?.data?.message || err.message);
        },
      },
    );
  }, [addToCartMutation, productId, quantity, selectedVariant]);

  if (getProductQuery.isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={{flex: 1}}>
      <ScrollView
        style={{flex: 1}}
        ref={scrollRef}
        bounces={false}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}>
        <Image
          source={{uri: product.thumbnail}}
          style={{width: '100%', height: 300, backgroundColor: 'white'}}
          resizeMode="contain"
        />
        <FlatList
          horizontal
          data={images}
          renderItem={({item}) => (
            <View>
              <Image
                source={{uri: item}}
                style={{width: '100%', height: 300}}
                resizeMode="contain"
              />
            </View>
          )}
        />
        <View
          style={{
            padding: 20,
          }}>
          <Text
            style={{
              ...TYPOGRAPHY.h6,
              color: colors.layout.foreground,
            }}>
            {product.name}
          </Text>
          <Pressable
            onPress={() => {
              navigation.navigate('CategoryDetail', {
                categoryId: category.slug!,
                name: category.name,
              });
            }}>
            <Text
              style={{
                ...TYPOGRAPHY.body2,
                color: colors.base.primary,
                marginVertical: 8,
              }}>
              #{category.name}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate('BrandDetail', {
                brandId: brand._id!,
                name: brand.name,
              });
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}>
            <Image
              source={{uri: brand.logo}}
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
                borderWidth: 4,
                borderColor: colors.default.default100,
              }}
            />
            <Text
              style={{
                ...TYPOGRAPHY.body2,
                color: colors.layout.foreground,
              }}>
              {brand.name}
            </Text>
          </Pressable>
          <Text
            style={{
              ...TYPOGRAPHY.h5,
              color: !product.isDiscount
                ? colors.base.primary
                : colors.base.default,
              marginVertical: 8,
              textDecorationColor: colors.default.default400,
              textDecorationLine: product.isDiscount ? 'line-through' : 'none',
            }}>
            {renderPrice()}
          </Text>
          {product.isDiscount && (
            <Text
              style={{
                ...TYPOGRAPHY.h5,
                color: colors.base.success,
                marginVertical: 8,
              }}>
              {renderDiscountPrice()}
            </Text>
          )}

          <View>
            <Rating
              readonly
              ratingCount={5}
              startingValue={product.ratingValue}
            />
            <Text
              style={{
                ...TYPOGRAPHY.body2,
                color: colors.layout.foreground,
                textAlign: 'center',
              }}>
              {product.ratingCount} reviews
            </Text>
          </View>

          <Text
            style={{
              ...TYPOGRAPHY.body2,
              color: colors.layout.foreground,
              marginVertical: 16,
              textAlign: 'left',
            }}>
            {product.description}
          </Text>
          <Button
            color="primary"
            onPress={() => {
              setShowAddToCart(true);
            }}>
            <Text
              style={{
                color: colors.layout.background,
                fontFamily: FONT_FAMILY.semiBold,
                fontSize: 16,
              }}>
              Add to Cart
            </Text>
          </Button>
          <Reviews productId={productId} />
          <Questions productId={productId} />
          <LabelItemList
            label="Related Products"
            style={{marginTop: 20}}
            data={relatedProducts}
            isLoading={getRelatedProductsQuery.isLoading}
            isError={getRelatedProductsQuery.isError}
            renderItem={({item}) => (
              <ProductCard
                product={item}
                style={{
                  width: APP_CONFIG.SCREEN.WIDTH / 2 - 26,
                }}
              />
            )}
            listProps={{
              numColumns: 2,
              scrollEnabled: false,
              columnWrapperStyle: {gap: 12},
              contentContainerStyle: {gap: 12},
              style: {gap: 12},
            }}
          />
          <LabelItemList
            label="Recommended Products"
            style={{marginTop: 20}}
            data={recommendedProducts}
            isLoading={getRecommendedProductsQuery.isLoading}
            isError={getRecommendedProductsQuery.isError}
            renderItem={({item}) => (
              <ProductCard
                product={item}
                style={{
                  width: APP_CONFIG.SCREEN.WIDTH / 2 - 26,
                }}
              />
            )}
            listProps={{
              numColumns: 2,
              scrollEnabled: false,
              columnWrapperStyle: {gap: 12},
              contentContainerStyle: {gap: 12},
              style: {gap: 12},
            }}
          />
        </View>
      </ScrollView>
      {showAddToCart && (
        <Pressable
          onPress={() => setShowAddToCart(false)}
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
          ]}
        />
      )}
      {showAddToCart && (
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={{
            padding: 20,
            borderTopWidth: 1,
            borderTopColor: colors.layout.divider,
            zIndex: 100,
            backgroundColor: colors.layout.background,
          }}>
          {product?.type === 'VARIABLE' && (
            <View
              style={{
                marginBottom: 16,
                gap: 8,
              }}>
              {optimizedData.map((variant, index) => (
                <View key={index}>
                  <Text
                    style={[
                      {
                        color: colors.layout.foreground,
                      },
                      TYPOGRAPHY.body1,
                    ]}>
                    {variant.name}
                  </Text>
                  <FlatList
                    horizontal
                    data={variant.values}
                    renderItem={({item}) => (
                      <Pressable
                        onPress={() => {
                          setSelectedVariant({
                            ...selectedVariant,
                            [variant.name]: item,
                          });
                        }}
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          backgroundColor:
                            variant.name === 'color'
                              ? item
                              : colors.default.default100,
                          borderRadius: 100,
                          marginRight: 8,
                          minWidth: 60,
                          minHeight: 30,
                          borderWidth: 3,
                          borderColor:
                            //@ts-ignore
                            selectedVariant[variant.name] === item
                              ? colors.base.primary
                              : colors.default.default200,
                        }}>
                        {variant.name !== 'color' && (
                          <Text
                            style={{
                              color: colors.layout.foreground,
                              textAlign: 'center',
                              fontFamily: FONT_FAMILY.medium,
                            }}>
                            {item}
                          </Text>
                        )}
                      </Pressable>
                    )}
                  />
                </View>
              ))}
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}>
            <Text
              style={{
                ...TYPOGRAPHY.body1,
                color: colors.layout.foreground,
              }}>
              Quantity
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 20,
              }}>
              <Pressable
                onPress={() => {
                  if (quantity > 1) {
                    setQuantity(quantity - 1);
                  }
                }}
                style={{
                  padding: 8,
                  borderRadius: 100,
                  borderWidth: 2,
                  borderColor: colors.default.default200,
                }}>
                <Minus size={24} color={colors.layout.foreground} />
              </Pressable>
              <Text
                style={{
                  color: colors.layout.foreground,
                  fontFamily: FONT_FAMILY.regular,
                  fontSize: 16,
                  minWidth: 40,
                  textAlign: 'center',
                }}>
                {quantity}
              </Text>
              <Pressable
                onPress={() => {
                  if (quantity < product.quantity) {
                    setQuantity(quantity + 1);
                  }
                }}
                style={{
                  padding: 8,
                  borderRadius: 100,
                  borderWidth: 2,
                  borderColor: colors.default.default200,
                }}>
                <Plus size={24} color={colors.layout.foreground} />
              </Pressable>
            </View>
          </View>
          <Button
            color="primary"
            onPress={() => {
              onPressAddToCart();
            }}
            isDisabled={
              product.type === 'VARIABLE' &&
              (!selectedVariant.size || !selectedVariant.color)
            }>
            <Text
              style={{
                color: colors.layout.background,
                fontFamily: FONT_FAMILY.semiBold,
                fontSize: 16,
              }}>
              Add to Cart
            </Text>
          </Button>
        </Animated.View>
      )}
    </View>
  );
};

export default ProductDetailScreen;

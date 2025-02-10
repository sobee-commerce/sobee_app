import {ProductCard} from '@/components/card';
import {AppCheckbox, Button} from '@/components/common';
import {QUERY_KEY} from '@/constants';
import {useTheme} from '@/context';
import {EProductSize} from '@/lib/enum';
import {
  productService,
  useGetCategoriesQuery,
  useGetProductColorsQuery,
} from '@/services';
import {TYPOGRAPHY} from '@/theme';
import {APP_CONFIG} from '@/utils';
import {convertToQuery} from '@/utils/converter';
import {HEIGHT} from '@/utils/responsive';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {useInfiniteQuery} from '@tanstack/react-query';
import {Filter, Star} from 'lucide-react-native';
import {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import Slider from 'react-native-a11y-slider';
import {useDebounce} from 'use-debounce';
const SearchScreen = () => {
  const {colors} = useTheme();
  const [keyword, setKeyword] = useState('');
  const [value] = useDebounce(keyword, 1000);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isOnSale, setIsOnSale] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<[number, number]>([
    0, 1000,
  ]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);

  const [queries, setQueries] = useState<Record<string, any>>({});

  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
    hasNextPage,
    isFetching,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY.PRODUCT.GET_ALL, value, queries],
    queryFn: async page => {
      const _queries = {
        page: page.pageParam,
        keyword: value,
        ...queries,
      } as Record<string, any>;
      const queryString = Object.keys(_queries)
        .map(q => convertToQuery(q, _queries[q]))
        .join('&');
      console.log(queryString);
      const res = await productService.getProducts(queryString);
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasNext ? allPages.length + 1 : undefined;
    },
    enabled: value !== '',
    refetchOnMount: false,
  });
  const {data: colorData} = useGetProductColorsQuery();
  const {data: categoryData} = useGetCategoriesQuery();
  const sizes = Object.values(EProductSize);

  const flatData = data?.pages.flatMap(page => page.data);

  const onEndReached = () => {
    if (isFetchingNextPage) {
      return;
    }
    if (!isLoading && hasNextPage) {
      fetchNextPage();
    }
  };

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const onApplyFilter = () => {
    setQueries({
      isOnSale,
      priceRange: selectedPrice,
      categories: selectedCategories,
      colors: selectedColors,
      sizes: selectedSizes,
      ratings: selectedStars,
    });
    bottomSheetModalRef.current?.close();
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        bottomSheetModalRef.current?.close();
        return true;
      },
    );

    return () => backHandler.remove();
  }, []);

  return (
    <BottomSheetModalProvider>
      <View>
        <View
          style={{
            padding: 20,
            paddingBottom: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}>
          <TextInput
            style={{
              color: colors.layout.foreground,
              backgroundColor: colors.layout.background,
              borderColor: colors.layout.divider,
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 12,
              marginBottom: 8,
              flex: 1,
              ...TYPOGRAPHY.body2,
            }}
            placeholder="Clothing, Shoes, Watches, etc."
            value={keyword}
            onChangeText={setKeyword}
          />
          <Pressable
            onPress={() => {
              bottomSheetModalRef.current?.present();
            }}>
            <Filter size={24} color={colors.layout.foreground} />
          </Pressable>
        </View>

        {(isLoading || isRefetching) && <ActivityIndicator />}
        {value !== '' && (
          <FlatList
            data={flatData}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{gap: 12, padding: 20, paddingBottom: 100}}
            keyExtractor={item => item._id!}
            ListEmptyComponent={() => (
              <Text
                style={[
                  TYPOGRAPHY.body1,
                  {
                    color: colors.layout.foreground,
                    fontSize: 14,
                  },
                ]}>
                {isFetching ? 'Searching...' : 'No items found'}
              </Text>
            )}
            renderItem={({item}) => (
              <ProductCard
                product={item}
                style={{
                  width: APP_CONFIG.SCREEN.WIDTH / 2 - 26,
                }}
              />
            )}
            onEndReachedThreshold={1}
            onEndReached={onEndReached}
            numColumns={2}
            columnWrapperStyle={{gap: 12}}
            initialNumToRender={10}
            windowSize={10}
            removeClippedSubviews
            ListFooterComponent={() =>
              isFetchingNextPage && <ActivityIndicator />
            }
          />
        )}
        <StatusBar backgroundColor={colors.base.primary} />
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={[HEIGHT * 0.8]}
        enableDynamicSizing={false}
        enablePanDownToClose={false}
        containerStyle={{
          backgroundColor: colors.layout.divider,
        }}>
        <BottomSheetScrollView contentContainerStyle={{padding: 20, gap: 20}}>
          <View
            style={{
              gap: 16,
            }}>
            <Text
              style={{
                ...TYPOGRAPHY.h6,
                color: colors.layout.foreground,
              }}>
              Categories
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 12,
                alignItems: 'center',
              }}>
              {categoryData?.data?.map(category => (
                <AppCheckbox
                  key={category._id}
                  value={selectedCategories.includes(category._id!)}
                  onValueChange={v => {
                    if (v) {
                      setSelectedCategories(prev => [...prev, category._id!]);
                    } else {
                      setSelectedCategories(
                        selectedCategories.filter(
                          selectedCategory => selectedCategory !== category._id,
                        ),
                      );
                    }
                  }}
                  label={{
                    checked: category.name,
                    unChecked: category.name,
                  }}
                />
              ))}
            </View>
          </View>
          <View
            style={{
              gap: 8,
            }}>
            <Text
              style={{
                ...TYPOGRAPHY.h6,
                color: colors.layout.foreground,
              }}>
              Price $
            </Text>
            <Slider
              style={{}}
              min={0}
              max={1000}
              values={selectedPrice}
              increment={1}
              onChange={(values: any) => setSelectedPrice(values)}
            />
          </View>

          <AppCheckbox
            value={isOnSale}
            onValueChange={setIsOnSale}
            label={{
              checked: 'On sale',
              unChecked: 'On sale',
            }}
          />
          <View
            style={{
              gap: 8,
            }}>
            <Text
              style={{
                ...TYPOGRAPHY.h6,
                color: colors.layout.foreground,
              }}>
              Colors
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {colorData?.data.map(color => (
                <View
                  key={color}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                  <AppCheckbox
                    value={selectedColors.includes(color)}
                    onValueChange={v => {
                      if (v) {
                        setSelectedColors(prev => [...prev, color]);
                      } else {
                        setSelectedColors(
                          selectedColors.filter(
                            selectedColor => selectedColor !== color,
                          ),
                        );
                      }
                    }}
                  />
                  <View
                    style={{
                      width: 40,
                      height: 24,
                      backgroundColor: color,
                      borderRadius: 4,
                    }}
                  />
                </View>
              ))}
            </View>
            <View
              style={{
                gap: 8,
              }}>
              <Text
                style={{
                  ...TYPOGRAPHY.h6,
                  color: colors.layout.foreground,
                }}>
                Sizes
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 12,
                  alignItems: 'center',
                }}>
                {sizes.map(size => (
                  <AppCheckbox
                    key={size}
                    value={selectedSizes.includes(size)}
                    onValueChange={v => {
                      if (v) {
                        setSelectedSizes(prev => [...prev, size]);
                      } else {
                        setSelectedSizes(
                          selectedSizes.filter(
                            selectedSize => selectedSize !== size,
                          ),
                        );
                      }
                    }}
                    label={{
                      checked: size,
                      unChecked: size,
                    }}
                  />
                ))}
              </View>
            </View>
            <View
              style={{
                gap: 8,
              }}>
              <Text
                style={{
                  ...TYPOGRAPHY.h6,
                  color: colors.layout.foreground,
                }}>
                Ratings
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 12,
                  alignItems: 'center',
                }}>
                {[5, 4, 3, 2, 1].map(star => (
                  <View
                    key={star}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                    }}>
                    <AppCheckbox
                      value={selectedStars.includes(star)}
                      onValueChange={v => {
                        if (v) {
                          setSelectedStars(prev => [...prev, star]);
                        } else {
                          setSelectedStars(
                            selectedStars.filter(
                              selectedStar => selectedStar !== star,
                            ),
                          );
                        }
                      }}
                      label={{
                        checked: `${star}`,
                        unChecked: `${star}`,
                      }}
                    />
                    <Star
                      size={16}
                      stroke={colors.warning.warning400}
                      fill={colors.warning.warning400}
                    />
                  </View>
                ))}
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: 12,
                borderTopColor: colors.layout.divider,
                borderTopWidth: 1,
                paddingTop: 20,
                marginTop: 12,
              }}>
              <Button
                color="primary"
                style={{
                  flex: 1,
                }}
                onPress={onApplyFilter}>
                <Text
                  style={{
                    color: colors.layout.background,
                    ...TYPOGRAPHY.button,
                  }}>
                  Apply
                </Text>
              </Button>
              <Button
                color="transparent"
                onPress={() => bottomSheetModalRef.current?.close()}
                style={{
                  flex: 1,
                }}>
                <Text
                  style={{
                    ...TYPOGRAPHY.button,
                  }}>
                  Close
                </Text>
              </Button>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default SearchScreen;

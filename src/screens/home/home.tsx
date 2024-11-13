import {BrandCard, CategoryCard, ProductCard} from '@/components/card';
import {LabelItemList} from '@/components/common';
import {QUERY_KEY} from '@/constants';
import {useTheme} from '@/context';
import {
  productService,
  useGetBestSellerProductsQuery,
  useGetBrandsQuery,
  useGetCategoriesQuery,
  useGetDiscountedProductsQuery,
  useGetFeaturedProductsQuery,
  useGetPopularProductsQuery,
} from '@/services';
import {ApplicationScreenProps} from '@/types';
import {APP_CONFIG} from '@/utils';
import {useInfiniteQuery} from '@tanstack/react-query';
import React, {useMemo} from 'react';
import {ActivityIndicator, FlatList, StatusBar, View} from 'react-native';

const HomeScreen = ({navigation}: ApplicationScreenProps<'Home'>) => {
  const {colors} = useTheme();
  const featureProductsQuery = useGetFeaturedProductsQuery();
  const popularProductsQuery = useGetPopularProductsQuery();
  const bestSellerProductsQuery = useGetBestSellerProductsQuery();
  const discountedProductsQuery = useGetDiscountedProductsQuery();
  const categoriesQuery = useGetCategoriesQuery();
  const brandsQuery = useGetBrandsQuery();

  const categories = useMemo(
    () => categoriesQuery.data?.data || [],
    [categoriesQuery],
  );
  const brands = useMemo(() => brandsQuery.data?.data || [], [brandsQuery]);

  const products = useMemo(
    () => [
      {
        label: 'Featured Products',
        isLoading: featureProductsQuery.isLoading,
        data: featureProductsQuery?.data?.data || [],
        isError: featureProductsQuery.isError,
      },
      {
        label: 'Popular Products',
        isLoading: popularProductsQuery.isLoading,
        data: popularProductsQuery?.data?.data || [],
        isError: popularProductsQuery.isError,
      },
      {
        label: 'Best Seller Products',
        isLoading: bestSellerProductsQuery.isLoading,
        data: bestSellerProductsQuery?.data?.data || [],
        isError: bestSellerProductsQuery.isError,
      },
      {
        label: 'Discounted Products',
        isLoading: discountedProductsQuery.isLoading,
        data: discountedProductsQuery?.data?.data || [],
        isError: discountedProductsQuery.isError,
      },
    ],
    [
      featureProductsQuery,
      popularProductsQuery,
      bestSellerProductsQuery,
      discountedProductsQuery,
    ],
  );

  const {data, isFetchingNextPage, fetchNextPage, isLoading, hasNextPage} =
    useInfiniteQuery({
      queryKey: [QUERY_KEY.PRODUCT.GET_ALL],
      queryFn: async page => {
        const res = await productService.getProducts({
          page: page.pageParam,
        });
        return res.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.hasNext ? allPages.length + 1 : undefined;
      },
    });

  const flatData = data?.pages.flatMap(page => page.data);

  const onEndReached = () => {
    if (isFetchingNextPage) {
      return;
    }
    if (!isLoading && hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={flatData}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{gap: 12, padding: 20}}
        keyExtractor={item => item._id!}
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
        ListFooterComponent={() => isFetchingNextPage && <ActivityIndicator />}
        ListHeaderComponent={() => (
          <View style={{gap: 20}}>
            <LabelItemList
              isLoading={categoriesQuery.isLoading}
              isError={categoriesQuery.isError}
              label="Categories"
              showNavigation
              onPressNavigation={() => navigation.navigate('Category')}
              data={categories}
              renderItem={({item}) => <CategoryCard category={item} />}
              listProps={{
                horizontal: true,
              }}
            />
            <LabelItemList
              isLoading={brandsQuery.isLoading}
              isError={brandsQuery.isError}
              label="Brands"
              showNavigation
              onPressNavigation={() => navigation.navigate('Brand')}
              data={brands}
              renderItem={({item}) => <BrandCard brand={item} />}
              listProps={{
                horizontal: true,
              }}
            />
            {products.map(({label, isLoading, data}) =>
              data.length > 0 ? (
                <LabelItemList
                  key={label}
                  isLoading={isLoading}
                  data={data}
                  label={label}
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
              ) : null,
            )}
          </View>
        )}
      />
      <StatusBar backgroundColor={colors.base.primary} />
    </View>
  );
};

export default HomeScreen;

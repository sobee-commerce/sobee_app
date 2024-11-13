import {ProductCard} from '@/components/card';
import {QUERY_KEY} from '@/constants';
import {useTheme} from '@/context';
import {productService} from '@/services';
import {TYPOGRAPHY} from '@/theme';
import {APP_CONFIG} from '@/utils';
import {useInfiniteQuery} from '@tanstack/react-query';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useDebounce} from 'use-debounce';

const SearchScreen = () => {
  const {colors} = useTheme();
  const [keyword, setKeyword] = useState('');
  const [value] = useDebounce(keyword, 1000);

  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY.PRODUCT.GET_ALL, value],
    queryFn: async page => {
      const res = await productService.getProducts({
        page: page.pageParam,
        keyword: value,
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
    <View>
      <View
        style={{
          padding: 20,
          paddingBottom: 0,
        }}>
        <TextInput
          style={{
            color: colors.layout.foreground,
            backgroundColor: colors.layout.background,
            borderColor: colors.layout.divider,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 12,
            ...TYPOGRAPHY.body2,
          }}
          placeholder="Clothing, Shoes, Watches, etc."
          value={keyword}
          onChangeText={setKeyword}
        />
        <Text
          style={{
            ...TYPOGRAPHY.body2,
            color: colors.layout.foreground,
          }}>
          Enter your search query here
        </Text>
      </View>

      {isLoading && <ActivityIndicator size={'large'} />}
      <FlatList
        data={flatData}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{gap: 12, padding: 20}}
        keyExtractor={item => item._id!}
        ListEmptyComponent={() => (
          <Text
            style={[
              TYPOGRAPHY.body1,
              {
                color: colors.layout.foreground,
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
        ListFooterComponent={() => isFetchingNextPage && <ActivityIndicator />}
      />
      <StatusBar backgroundColor={colors.base.primary} />
    </View>
  );
};

export default SearchScreen;

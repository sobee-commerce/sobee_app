import {ReviewCard} from '@/components/card';
import {QUERY_KEY} from '@/constants';
import {useTheme} from '@/context';
import {reviewService} from '@/services';
import {TYPOGRAPHY} from '@/theme';
import {ApplicationScreenProps} from '@/types';
import {useInfiniteQuery} from '@tanstack/react-query';
import React, {useEffect} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';

const ProductReviewScreen = ({
  navigation,
  route,
}: ApplicationScreenProps<'ProductReview'>) => {
  const {
    params: {productId},
  } = route;

  const {colors} = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Reviews',
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  const {data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage} =
    useInfiniteQuery({
      queryKey: [QUERY_KEY.REVIEW.GET_PRODUCT_REVIEW, productId],
      queryFn: async page => {
        const res = await reviewService.getProductReviews(productId, {
          page: page.pageParam,
        });
        return res.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.hasNext ? allPages.length + 1 : undefined;
      },
    });

  const reviews = data?.pages.flatMap(page => page.data) || [];

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
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          ListEmptyComponent={() => (
            <Text
              style={{
                ...TYPOGRAPHY.body1,
                color: colors.layout.foreground,
                textAlign: 'center',
              }}>
              No questions yet
            </Text>
          )}
          showsVerticalScrollIndicator={false}
          data={reviews}
          contentContainerStyle={{gap: 12, padding: 20}}
          keyExtractor={item => item._id!}
          renderItem={({item}) => <ReviewCard review={item} />}
          onEndReached={onEndReached}
          onEndReachedThreshold={1}
          ListFooterComponent={() =>
            isFetchingNextPage && <ActivityIndicator />
          }
        />
      )}
    </View>
  );
};

export default ProductReviewScreen;

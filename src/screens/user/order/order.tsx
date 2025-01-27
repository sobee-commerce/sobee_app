import {OrderCard} from '@/components/card';
import {QUERY_KEY} from '@/constants';
import {useTheme} from '@/context';
import {EOrderStatus} from '@/lib/enum';
import {orderService} from '@/services';
import {TYPOGRAPHY} from '@/theme';
import {ApplicationScreenProps} from '@/types';
import {useInfiniteQuery} from '@tanstack/react-query';
import React, {useRef} from 'react';
import {ActivityIndicator, FlatList, Pressable, Text, View} from 'react-native';

const OrderScreen = ({navigation, route}: ApplicationScreenProps<'Order'>) => {
  const {colors} = useTheme();
  const statusRef = useRef<FlatList | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState<string>('ALL');
  const {data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading} =
    useInfiniteQuery({
      queryKey: [QUERY_KEY.ORDER.GET_ALL, selectedStatus],
      queryFn: async ({pageParam = 1}) => {
        const res = await orderService.getOrders({
          page: pageParam,
          status: selectedStatus === 'ALL' ? undefined : selectedStatus,
        });
        return res.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.hasNext ? allPages.length + 1 : undefined;
      },
    });

  const statuses = ['ALL', ...Object.values(EOrderStatus)];
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
      <FlatList
        data={statuses}
        horizontal
        contentContainerStyle={{paddingBottom: 10}}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        alwaysBounceHorizontal={false}
        bouncesZoom={false}
        renderItem={({item}) => (
          <Pressable
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              backgroundColor: colors.layout.background,
              borderRadius: 4,
              borderBottomWidth: 1,
              borderBottomColor:
                selectedStatus === item ? colors.base.primary : 'transparent',
              minWidth: 80,
            }}
            onPress={() => {
              setSelectedStatus(item);
            }}>
            <Text
              style={{
                textAlign: 'center',
                color:
                  selectedStatus === item
                    ? colors.base.primary
                    : colors.layout.foreground,
              }}>
              {item}
            </Text>
          </Pressable>
        )}
      />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          bounces={false}
          ListEmptyComponent={() => (
            <Text
              style={{
                ...TYPOGRAPHY.body1,
                color: colors.layout.foreground,
                textAlign: 'center',
              }}>
              No orders yet
            </Text>
          )}
          data={flatData}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{gap: 12, padding: 20, paddingTop: 0}}
          keyExtractor={item => item._id!}
          renderItem={({item}) => <OrderCard order={item} />}
          onEndReachedThreshold={1}
          onEndReached={onEndReached}
          removeClippedSubviews
          ListFooterComponent={() =>
            isFetchingNextPage && <ActivityIndicator />
          }
        />
      )}
    </View>
  );
};

export default OrderScreen;

import {OrderItemCard} from '@/components/card';
import {Button} from '@/components/common';
import {useTheme} from '@/context';
import {useCreateChatRoomSocket} from '@/hooks/socket-handler';
import {formatCurrency} from '@/lib';
import {EOrderStatus} from '@/lib/enum';
import {IAddress, IOrder, IOrderItem} from '@/lib/interfaces';
import {
  chatService,
  useCancelOrderMutation,
  useGetOrderByIdQuery,
  useReceiveOrderMutation,
} from '@/services';
import {FONT_FAMILY} from '@/theme';
import {ApplicationScreenProps} from '@/types';
import {useEffect, useMemo} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const OrderDetailScreen = ({
  navigation,
  route,
}: ApplicationScreenProps<'OrderDetail'>) => {
  const {orderId} = route.params;
  const {colors} = useTheme();
  const getOrderQuery = useGetOrderByIdQuery(orderId);
  const cancelOrderMutation = useCancelOrderMutation();
  const {createRoom, isLoading, isError, isSuccess, data, error} =
    useCreateChatRoomSocket();
  const receiveOrderMutation = useReceiveOrderMutation();

  const onPressCancel = () => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Cancel Order',
        style: 'destructive',
        onPress: () => {
          cancelOrderMutation.mutate(orderId, {
            onSuccess: () => {
              navigation.goBack();
            },
            onError: (err: any) => {
              Alert.alert('Error', err?.response?.data?.message || err.message);
            },
          });
        },
      },
    ]);
  };

  const order = getOrderQuery.data?.data || ({} as IOrder);
  const orderItems = (order.orderItems || []) as IOrderItem[];

  const subTotal = orderItems.reduce((acc, item) => acc + item.subTotal!, 0);

  useEffect(() => {
    if (isSuccess) {
      if (data) {
        navigation.navigate('Contact', {
          roomId: data._id!,
        });
      }
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) {
      Alert.alert('Error', error || 'An error occurred');
    }
  }, [isError, error]);

  const onChatWithSeller = async () => {
    try {
      const res = await chatService.fetchRoomById(order._id!);
      if (res.data.success) {
        navigation.navigate('Contact', {
          roomId: res.data.data._id!,
        });
      }
    } catch (err: any) {
      console.log(err?.response?.data?.message || err.message);
      createRoom(order._id!);
    }
    // if(res.)
    // navigation.navigate('Contact', {
    //   orderId: order._id!,
    // });
  };

  const onReceiveOrder = () => {
    navigation.navigate('ScanQRCode', {
      onSuccess: (value: string) => {
        // TODO: Call API to update order status
        receiveOrderMutation.mutate(value, {
          onSuccess: () => {
            Alert.alert('Success', 'Order received successfully');
          },
          onError: (err: any) => {
            Alert.alert('Error', err?.response?.data?.message || err.message);
          },
        });
      },
    });
  };

  const shippingAddress = useMemo(
    () => (order.shippingAddress || {}) as IAddress,
    [order.shippingAddress],
  );

  const addressString = useMemo(() => {
    return [
      shippingAddress.specificAddress,
      shippingAddress.ward,
      shippingAddress.district,
      shippingAddress.city,
      shippingAddress.country,
    ]
      .filter(v => v)
      .join(', ')
      .trim()
      .replace(/\n/g, ', ');
  }, [shippingAddress]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: order.orderGeneratedId,
      headerTitleAlign: 'center',
      headerRight: ({tintColor}) =>
        order.status === EOrderStatus.PENDING ? (
          <Pressable
            onPress={onPressCancel}
            style={{
              marginRight: 16,
            }}
            disabled={cancelOrderMutation.isPending}>
            <Text
              style={{
                color: tintColor,
                fontFamily: FONT_FAMILY.medium,
                fontSize: 14,
              }}>
              {cancelOrderMutation.isPending ? 'Cancelling...' : 'Cancel'}
            </Text>
          </Pressable>
        ) : null,
    });
  }, [orderId, order]);

  return getOrderQuery.isLoading ? (
    <ActivityIndicator />
  ) : (
    <View style={{flex: 1}}>
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{gap: 12, padding: 20}}>
        {/* {getOrderQuery.isRefetching && <ActivityIndicator />} */}
        <Text
          style={{
            fontSize: 20,
            fontFamily: FONT_FAMILY.bold,
            color: colors.layout.foreground,
          }}>
          {order.orderGeneratedId}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: FONT_FAMILY.medium,
            color: colors.layout.foreground,
          }}>
          Status: {order.status}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: FONT_FAMILY.medium,
            color: colors.layout.foreground,
          }}>
          Shipping Address: {addressString}
        </Text>
        <FlatList
          scrollEnabled={false}
          contentContainerStyle={{gap: 12}}
          data={orderItems}
          keyExtractor={item => item._id!}
          renderItem={({item}) => (
            <OrderItemCard
              orderItem={item}
              hideActions
              canReview={order.status === EOrderStatus.COMPLETED}
            />
          )}
        />
      </ScrollView>
      <View
        style={{
          padding: 20,
          borderTopWidth: 1,
          borderTopColor: colors.layout.divider,
        }}>
        <View style={styles.meta}>
          <Text
            style={[
              styles.metaText,
              {
                color: colors.default.default500,
              },
            ]}>
            Subtotal:
          </Text>
          <Text
            style={[
              styles.price,
              {
                color: colors.layout.foreground,
              },
            ]}>
            {formatCurrency(subTotal)}
          </Text>
        </View>

        <View style={styles.meta}>
          <Text
            style={[
              styles.metaText,
              {
                color: colors.default.default500,
              },
            ]}>
            Shipping Fee:
          </Text>
          <Text
            style={[
              styles.price,
              {
                color: colors.layout.foreground,
              },
            ]}>
            {formatCurrency(order.shippingFee || 0)}
          </Text>
        </View>

        <View style={styles.meta}>
          <Text
            style={[
              styles.metaText,
              {
                color: colors.default.default500,
              },
            ]}>
            Tax Fee:
          </Text>
          <Text
            style={[
              styles.price,
              {
                color: colors.layout.foreground,
              },
            ]}>
            {formatCurrency(order.taxFee || 0)}
          </Text>
        </View>
        <View style={styles.meta}>
          <Text
            style={[
              styles.metaText,
              {
                color: colors.base.primary,
                fontSize: 20,
                fontFamily: FONT_FAMILY.semiBold,
              },
            ]}>
            Total:
          </Text>
          <Text
            style={[
              styles.price,
              {
                color: colors.base.primary,
                fontSize: 20,
                fontFamily: FONT_FAMILY.semiBold,
              },
            ]}>
            {formatCurrency(order.total)}
          </Text>
        </View>
        <Button
          isLoading={isLoading}
          isDisabled={isLoading}
          color="primary"
          style={{marginTop: 16}}
          onPress={onChatWithSeller}>
          <Text
            style={{
              fontFamily: FONT_FAMILY.medium,
              color: colors.white,
            }}>
            Chat with seller
          </Text>
        </Button>
        {order.status === EOrderStatus.DELIVERED && (
          <Button
            isLoading={isLoading}
            isDisabled={isLoading}
            color="success"
            style={{marginTop: 16}}
            onPress={onReceiveOrder}>
            <Text
              style={{
                fontFamily: FONT_FAMILY.medium,
                color: colors.white,
              }}>
              Receive Order
            </Text>
          </Button>
        )}
      </View>
    </View>
  );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    fontFamily: FONT_FAMILY.regular,
  },
  price: {
    fontFamily: FONT_FAMILY.medium,
  },
});

import {useTheme} from '@/context';
import {formatCurrency} from '@/lib';
import {IOrderItem, IProduct} from '@/lib/interfaces';
import {
  useRemoveOrderItemMutation,
  useUpdateOrderItemQuantityMutation,
} from '@/services';
import {FONT_FAMILY} from '@/theme';
import {ApplicationNavigationProps} from '@/types';
import {useNavigation} from '@react-navigation/native';
import {Minus, Plus, Trash2} from 'lucide-react-native';
import React from 'react';
import {Alert, Image, Pressable, Text, ToastAndroid, View} from 'react-native';
import {Button} from '../common';

type Props = {
  orderItem: IOrderItem;
  hideActions?: boolean;
  canReview?: boolean;
};

const OrderItemCard = ({
  orderItem,
  hideActions = false,
  canReview = false,
}: Props) => {
  const product = orderItem.product as IProduct;
  const {colors} = useTheme();
  const navigation = useNavigation<ApplicationNavigationProps>();

  const changeOrderItemQuantity = useUpdateOrderItemQuantityMutation();
  const removeOrderItemMutation = useRemoveOrderItemMutation();

  const onChangeOrderItemQuantity = (quantity: number) => {
    if (quantity < 1) return;
    if (quantity > product.quantity) return;
    changeOrderItemQuantity.mutate(
      {
        _id: orderItem._id!,
        quantity,
      },
      {
        onSuccess: data => {
          if (data.success) {
            ToastAndroid.show('Quantity updated', ToastAndroid.SHORT);
          } else {
            ToastAndroid.show(data.message, ToastAndroid.SHORT);
          }
        },
        onError: (error: any) => {
          ToastAndroid.show(
            error?.response?.data?.message || error.message,
            ToastAndroid.SHORT,
          );
        },
      },
    );
  };

  const onRemoveFromCart = () => {
    Alert.alert('Remove from cart', 'Are you sure?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          removeOrderItemMutation.mutate(orderItem._id!, {
            onSuccess: data => {
              if (data.success) {
                ToastAndroid.show('Removed from cart', ToastAndroid.SHORT);
              } else {
                ToastAndroid.show(data.message, ToastAndroid.SHORT);
              }
            },
            onError: (error: any) => {
              ToastAndroid.show(
                error?.response?.data?.message || error.message,
                ToastAndroid.SHORT,
              );
            },
          });
        },
      },
    ]);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 12,
      }}>
      <Image
        source={{uri: product.thumbnail}}
        style={{
          width: 60,
          height: 60,
          backgroundColor: 'white',
          borderRadius: 8,
          borderWidth: 2,
          borderColor: colors.default.default200,
        }}
        resizeMode="contain"
      />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 8,
        }}>
        <View style={{flex: 1, justifyContent: 'space-between', gap: 4}}>
          <Text
            style={[
              {
                color: colors.layout.foreground,
                fontFamily: FONT_FAMILY.medium,
                fontSize: 14,
              },
            ]}>
            {product.name}
          </Text>
          <Text
            style={{
              color: colors.base.primary,
              fontFamily: FONT_FAMILY.semiBold,
              fontSize: 14,
            }}>
            {formatCurrency(orderItem.price!)}
          </Text>
          {product.isVariation && (
            <View
              style={{
                flexDirection: 'row',
                gap: 4,
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 50,
                  height: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: colors.default.default200,
                  borderRadius: 100,
                }}>
                <Text
                  style={{
                    color: colors.layout.foreground,
                    fontFamily: FONT_FAMILY.medium,
                    fontSize: 14,
                  }}>
                  {orderItem.size}
                </Text>
              </View>
              <View
                style={{
                  width: 50,
                  height: 30,
                  borderRadius: 100,
                  backgroundColor: orderItem.color,
                }}
              />
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: colors.layout.foreground,
                fontFamily: FONT_FAMILY.regular,
                fontSize: 12,
              }}>
              Quantity{!hideActions ? '' : ': ' + orderItem.amount}
            </Text>
            {!hideActions && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}>
                <Pressable
                  onPress={() => {
                    onChangeOrderItemQuantity(orderItem.amount - 1);
                  }}
                  style={{
                    padding: 8,
                    borderRadius: 100,
                    borderWidth: 2,
                    borderColor: colors.default.default200,
                  }}
                  disabled={
                    orderItem.amount === 1 || changeOrderItemQuantity.isPending
                  }>
                  <Minus size={16} color={colors.layout.foreground} />
                </Pressable>
                <Text
                  style={{
                    color: colors.layout.foreground,
                    fontFamily: FONT_FAMILY.regular,
                    fontSize: 14,
                    minWidth: 30,
                    textAlign: 'center',
                  }}>
                  {orderItem.amount}
                </Text>
                <Pressable
                  onPress={() => {
                    onChangeOrderItemQuantity(orderItem.amount + 1);
                  }}
                  style={{
                    padding: 8,
                    borderRadius: 100,
                    borderWidth: 2,
                    borderColor: colors.default.default200,
                  }}
                  disabled={
                    orderItem.amount === product.quantity ||
                    changeOrderItemQuantity.isPending
                  }>
                  <Plus size={16} color={colors.layout.foreground} />
                </Pressable>
              </View>
            )}
          </View>
          {canReview && (
            <Button
              color="success"
              size="sm"
              style={{marginTop: 16}}
              onPress={() =>
                navigation.navigate('Review', {
                  orderId: product._id!,
                })
              }>
              <Text
                style={{
                  fontFamily: FONT_FAMILY.medium,
                  color: colors.white,
                }}>
                Leave a review
              </Text>
            </Button>
          )}
        </View>
        {!hideActions && (
          <Pressable
            style={{
              marginTop: 4,
            }}
            onPress={onRemoveFromCart}>
            <Trash2 size={16} color={colors.base.danger} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default OrderItemCard;

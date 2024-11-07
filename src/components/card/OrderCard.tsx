import {useTheme} from '@/context';
import {IOrder, IOrderItem, IProduct} from '@/lib/interfaces';
import {FONT_FAMILY, TYPOGRAPHY} from '@/theme';
import {ApplicationNavigationProps} from '@/types';
import {useNavigation} from '@react-navigation/native';
import {format} from 'date-fns';
import {ChevronRight} from 'lucide-react-native';
import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

type Props = {
  order: IOrder;
};

const OrderCard = ({order}: Props) => {
  const {colors} = useTheme();
  const navigation = useNavigation<ApplicationNavigationProps>();
  return (
    <Pressable
      onPress={() => navigation.navigate('OrderDetail', {orderId: order._id!})}
      style={{
        flexDirection: 'row',
        gap: 12,
      }}>
      <View
        style={{
          width: 90,
          height: 80,
          backgroundColor: colors.white,
          padding: 10,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
          borderWidth: 2,
          borderColor: colors.primary.primary100,
        }}>
        {order.orderItems.slice(0, 3).map((item, index) => {
          const orderItem = item as IOrderItem;
          const product = orderItem.product as IProduct;
          const itemLength = order.orderItems.length;
          return (
            <Image
              key={index}
              source={{uri: product.thumbnail}}
              style={{
                width: 30,
                height: 30,
                borderRadius: itemLength > 1 ? 20 : 0,
                position: itemLength > 1 ? 'absolute' : 'relative',
                left: itemLength > 1 ? (index + 1) * 12 : 0,
              }}
              resizeMode="contain"
            />
          );
        })}
        {order.orderItems.length > 3 && (
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 20,
              backgroundColor: colors.primary.primary100,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              left: 50,
            }}>
            <Text
              style={{
                color: colors.layout.foreground,
                fontFamily: FONT_FAMILY.medium,
              }}>
              +{order.orderItems.length - 3}
            </Text>
          </View>
        )}
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <Text
          style={[
            TYPOGRAPHY.sub1,
            {
              color: colors.layout.foreground,
              fontFamily: FONT_FAMILY.semiBold,
            },
          ]}>
          {order.orderGeneratedId}
        </Text>
        <Text
          style={[
            {
              color: colors.layout.foreground,
              fontFamily: FONT_FAMILY.regular,
              fontSize: 12,
            },
          ]}>
          {format(order.createdAt!, "dd/MM/yyyy 'at' HH:mm")}
        </Text>
        <Text
          style={[
            TYPOGRAPHY.body2,
            {
              color: colors.layout.foreground,
              fontFamily: FONT_FAMILY.regular,
            },
          ]}>
          {order.orderItems.length} items
        </Text>
      </View>
      <View
        style={{
          alignSelf: 'center',
        }}>
        <ChevronRight size={24} color={colors.base.primary} />
      </View>
    </Pressable>
  );
};

export default OrderCard;

const styles = StyleSheet.create({});

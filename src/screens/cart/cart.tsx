import {OrderItemCard} from '@/components/card';
import {Button} from '@/components/common';
import {useTheme} from '@/context';
import {formatCurrency} from '@/lib';
import {IProduct, IShipping, ITax} from '@/lib/interfaces';
import {useGetOrderItemsQuery} from '@/services';
import {FONT_FAMILY} from '@/theme';
import {ApplicationScreenProps} from '@/types';
import {ChevronsDown, ChevronsUp} from 'lucide-react-native';
import {useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const CartScreen = ({navigation}: ApplicationScreenProps<'Cart'>) => {
  const {colors} = useTheme();
  const {isLoading, data} = useGetOrderItemsQuery();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const orderItems = data?.data! || [];
  const cart = orderItems;

  const subTotal = useMemo(
    () => cart.reduce((acc, item) => acc + (item.subTotal || 0), 0),
    [cart],
  );
  const fee = useMemo(() => {
    let sf = 0;
    let tf = 0;
    cart.forEach(item => {
      const product = item.product as IProduct;
      const tax = product.tax as ITax;
      const shippingFee = product.shippingFee as IShipping;
      if (!tax || !shippingFee) return;
      sf +=
        shippingFee.type === 'FIXED'
          ? shippingFee.amount
          : (shippingFee.amount * item.subTotal!) / 100;
      tf += (tax.rate * item.subTotal!) / 100;
    });
    return {sf, tf};
  }, [cart]);

  const total = subTotal + fee.sf + fee.tf;

  const onPressCheckout = () => {
    navigation.navigate('Checkout');
  };

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <View style={{flex: 1}}>
      <FlatList
        ListEmptyComponent={() => (
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              fontFamily: FONT_FAMILY.regular,
            }}>
            No items in cart
          </Text>
        )}
        contentContainerStyle={{padding: 20, gap: 12}}
        data={orderItems}
        keyExtractor={item => item._id!}
        renderItem={({item}) => <OrderItemCard orderItem={item} />}
      />
      <View
        style={{
          padding: 20,
          borderTopWidth: 1,
          borderTopColor: colors.layout.divider,
        }}>
        <Pressable
          style={{
            alignSelf: 'flex-end',
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
          onPress={() => setCollapsed(!collapsed)}>
          <Text
            style={{
              fontFamily: FONT_FAMILY.regular,
              color: colors.layout.foreground,
            }}>
            {collapsed ? 'Show' : 'Hide'} Order Summary
          </Text>
          {collapsed ? (
            <ChevronsUp size={20} color={colors.layout.foreground} />
          ) : (
            <ChevronsDown size={20} color={colors.layout.foreground} />
          )}
        </Pressable>
        {!collapsed && (
          <>
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
                {formatCurrency(fee.sf)}
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
                {formatCurrency(fee.tf)}
              </Text>
            </View>
          </>
        )}
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
            {formatCurrency(total)}
          </Text>
        </View>
        <Button
          color="primary"
          style={{marginTop: 16}}
          onPress={onPressCheckout}>
          <Text
            style={{
              fontFamily: FONT_FAMILY.medium,
              color: colors.white,
            }}>
            Checkout
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default CartScreen;

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

import {AddressCard, OrderItemCard} from '@/components/card';
import {Button, Input} from '@/components/common';
import {useTheme} from '@/context';
import {formatCurrency} from '@/lib';
import {CreateOrderFormSchema, createOrderFormSchema} from '@/lib/form-schema';
import {IProduct, IShipping, ITax} from '@/lib/interfaces';
import {
  useCreateOrderMutation,
  useGetAddressQuery,
  useGetMeQuery,
  useGetOrderItemsQuery,
} from '@/services';
import {FONT_FAMILY} from '@/theme';
import {ApplicationScreenProps} from '@/types';
import {zodResolver} from '@hookform/resolvers/zod';
import {ChevronsDown, ChevronsUp} from 'lucide-react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
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

const CheckoutScreen = ({navigation}: ApplicationScreenProps<'Checkout'>) => {
  const {colors} = useTheme();

  const {
    control,
    formState: {errors},
    setValue,
    handleSubmit,
    watch,
  } = useForm<CreateOrderFormSchema>({
    resolver: zodResolver(createOrderFormSchema),
    defaultValues: {
      paymentMethod: 'COD',
    },
  });
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const {isLoading, data} = useGetOrderItemsQuery();
  const getAddressesQuery = useGetAddressQuery();
  const createOrderMutation = useCreateOrderMutation();
  const getMeQuery = useGetMeQuery();

  useEffect(() => {
    const user = getMeQuery.data?.data?.user;
    if (!user) return;
    setValue('phoneNumber', user.phoneNumber);
    setValue('emailAddress', user.email);
  }, [getMeQuery.data, setValue]);

  const orderItems = useMemo(() => data?.data! || [], [data?.data]);
  const cart = orderItems;
  const addresses = getAddressesQuery.data?.data || [];
  const defaultAddress = addresses.find(a => a.isDefault);
  const [selectedAddress, setSelectedAddress] = React.useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (defaultAddress) {
      setSelectedAddress(defaultAddress._id);
    }
  }, [defaultAddress]);

  useEffect(() => {
    setValue(
      'orderItems',
      orderItems.map(item => item._id!),
    );
  }, [orderItems, setValue]);

  useEffect(() => {
    if (!selectedAddress) return;
    setValue('shippingAddress', selectedAddress);
  }, [selectedAddress, setValue]);

  const selectedAddressData = addresses.find(a => a._id === selectedAddress);

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

  useEffect(() => {
    setValue('shippingFee', fee.sf);
    setValue('taxFee', fee.tf);
    setValue('total', total);
  }, [fee, total, setValue]);

  const onPressCheckout = (_data: CreateOrderFormSchema) => {
    createOrderMutation.mutate(_data, {
      onSuccess: data => {
        if (data.success) {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'Main',
              },
              {name: 'OrderDetail', params: {orderId: data.data._id}},
            ],
          });
        } else {
          Alert.alert('Error', data.message);
        }
      },
      onError: (error: any) => {
        Alert.alert('Error', error.response?.data?.message || error.message);
      },
    });
  };

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <View style={{flex: 1}}>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{
          padding: 20,
          gap: 20,
        }}>
        <View
          style={{
            gap: 12,
          }}>
          <Text
            style={{
              fontFamily: FONT_FAMILY.medium,
              fontSize: 14,
              color: colors.layout.foreground,
            }}>
            Please fill in the following information to complete your order
          </Text>
          <View
            style={{
              gap: 12,
            }}>
            <Text
              style={{
                fontFamily: FONT_FAMILY.medium,
                fontSize: 16,
                color: colors.layout.foreground,
              }}>
              Contact Information
            </Text>
            <Controller
              control={control}
              name="phoneNumber"
              render={({field: {onChange, value}}) => (
                <Input
                  onChangeText={onChange}
                  value={value}
                  label="Phone number"
                  placeholder="Enter your phone number"
                  radius="sm"
                  size="sm"
                  isInvalid={!!errors.phoneNumber}
                  errorMessage={errors.phoneNumber?.message}
                  isDisabled={createOrderMutation.isPending}
                />
              )}
            />
            <Controller
              control={control}
              name="emailAddress"
              render={({field: {onChange, value}}) => (
                <Input
                  onChangeText={onChange}
                  value={value}
                  label="Email address"
                  placeholder="Enter your email address"
                  radius="sm"
                  size="sm"
                  isInvalid={!!errors.emailAddress}
                  errorMessage={errors.emailAddress?.message}
                  isDisabled={createOrderMutation.isPending}
                />
              )}
            />
          </View>
          <View
            style={{
              gap: 12,
            }}>
            <Text
              style={{
                fontFamily: FONT_FAMILY.medium,
                fontSize: 16,
                color: colors.layout.foreground,
              }}>
              Shipping Address
            </Text>
            {selectedAddressData && (
              <AddressCard address={selectedAddressData} />
            )}
            <Button
              color="primary"
              onPress={() =>
                navigation.navigate('ShippingAddress', {
                  selectedAddress: selectedAddress,
                  onChangeAddress: (newId: string) => {
                    setSelectedAddress(newId);
                  },
                })
              }>
              <Text
                style={{
                  fontFamily: FONT_FAMILY.medium,
                  color: colors.white,
                }}>
                {defaultAddress ? 'Change' : 'Select'} Address
              </Text>
            </Button>
          </View>
        </View>

        <FlatList
          ListHeaderComponent={() => (
            <Text
              style={{
                fontFamily: FONT_FAMILY.medium,
                fontSize: 16,
                color: colors.layout.foreground,
              }}>
              Order Items ({cart.length})
            </Text>
          )}
          scrollEnabled={false}
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
          contentContainerStyle={{gap: 12}}
          data={cart}
          keyExtractor={item => item._id!}
          renderItem={({item}) => <OrderItemCard orderItem={item} />}
        />
      </ScrollView>
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
          onPress={handleSubmit(onPressCheckout)}>
          <Text
            style={{
              fontFamily: FONT_FAMILY.medium,
              color: colors.white,
            }}>
            Confirm Order
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default CheckoutScreen;

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

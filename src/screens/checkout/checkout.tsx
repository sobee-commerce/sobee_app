import {AddressCard, OrderItemCard} from '@/components/card';
import {AppCheckbox, Button, Input} from '@/components/common';
import {useAuthContext, useTheme} from '@/context';
import {formatCurrency} from '@/lib';
import {EPaymentMethod} from '@/lib/enum';
import {CreateOrderFormSchema, createOrderFormSchema} from '@/lib/form-schema';
import {IProduct, IShipping, ITax} from '@/lib/interfaces';
import {
  orderService,
  useCreateOrderMutation,
  useGetAddressQuery,
  useGetOrderItemsQuery,
} from '@/services';
import {FONT_FAMILY} from '@/theme';
import {ApplicationScreenProps} from '@/types';
import {zodResolver} from '@hookform/resolvers/zod';
import {usePaymentSheet} from '@stripe/stripe-react-native';
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
      paymentMethod: EPaymentMethod.COD,
    },
  });
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const {user} = useAuthContext();
  const {isLoading, data} = useGetOrderItemsQuery();
  const getAddressesQuery = useGetAddressQuery();
  const createOrderMutation = useCreateOrderMutation();

  useEffect(() => {
    if (!user) return;
    setValue('phoneNumber', user.phoneNumber);
    setValue('emailAddress', user.email);
  }, [user, setValue]);

  const orderItems = useMemo(() => data?.data! || [], [data?.data]);
  const cart = orderItems;
  const addresses = getAddressesQuery.data?.data || [];
  const defaultAddress = addresses.find(a => a.isDefault);
  const [selectedAddress, setSelectedAddress] = React.useState<
    string | undefined
  >(undefined);
  const paymentMethod = watch('paymentMethod') || EPaymentMethod.COD;
  const {initPaymentSheet, presentPaymentSheet, loading} = usePaymentSheet();

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

  const handleOnlinePayment = async () => {
    const paymentSheetRes = await orderService.fetchPaymentSheetParams(total);
    const {paymentIntent, ephemeralKey, customer} = paymentSheetRes.data.data;
    const {error} = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      merchantDisplayName: 'Sobee',
      allowsDelayedPaymentMethods: true,
    });

    if (error) {
      Alert.alert('Error', error.message);
      return false;
    }

    const {error: presentError} = await presentPaymentSheet();

    if (presentError) {
      Alert.alert('Error', presentError.message);
      return false;
    }

    return true;
  };

  const onPressCheckout = async (_data: CreateOrderFormSchema) => {
    let isSuccessPayment = true;
    if (paymentMethod === EPaymentMethod.INTERNET_BANKING) {
      console.log('handle online payment');
      const isSuccess = await handleOnlinePayment();
      _data.isPaid = isSuccess;
      isSuccessPayment = isSuccess;
    }

    if (!isSuccessPayment) {
      return;
    }
    createOrderMutation.mutate(_data, {
      onSuccess: d => {
        if (d.success) {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'Main',
              },
              {name: 'OrderDetail', params: {orderId: d.data._id}},
            ],
          });
        } else {
          Alert.alert('Error', d.message);
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
        <View
          style={{
            gap: 8,
            borderTopColor: colors.layout.divider,
            borderTopWidth: 1,
            marginTop: 16,
            paddingTop: 16,
          }}>
          <Text
            style={{
              fontFamily: FONT_FAMILY.regular,
              fontSize: 14,
              color: colors.layout.foreground,
            }}>
            Payment Method
          </Text>
          <View style={{gap: 6}}>
            <AppCheckbox
              label={{
                checked: 'Cash on Delivery',
                unChecked: 'Cash on Delivery',
              }}
              value={paymentMethod === EPaymentMethod.COD}
              onValueChange={value => {
                setValue(
                  'paymentMethod',
                  value ? EPaymentMethod.COD : EPaymentMethod.INTERNET_BANKING,
                );
              }}
            />
            <AppCheckbox
              label={{
                checked: 'Internet Banking',
                unChecked: 'Internet Banking',
              }}
              value={paymentMethod === EPaymentMethod.INTERNET_BANKING}
              onValueChange={value => {
                setValue(
                  'paymentMethod',
                  !value ? EPaymentMethod.COD : EPaymentMethod.INTERNET_BANKING,
                );
              }}
            />
          </View>
        </View>
        <Button
          color="primary"
          style={{marginTop: 16}}
          isLoading={createOrderMutation.isPending}
          isDisabled={createOrderMutation.isPending}
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

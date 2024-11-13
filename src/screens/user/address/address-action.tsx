import {AppCheckbox, Button, Input, TextArea} from '@/components/common';
import {useTheme} from '@/context';
import {
  CreateAddressFormSchema,
  UpdateAddressFormSchema,
  createAddressFormSchema,
  updateAddressFormSchema,
} from '@/lib/form-schema';
import {
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
} from '@/services';
import {FONT_FAMILY, TYPOGRAPHY} from '@/theme';
import {ApplicationScreenProps} from '@/types';
import {zodResolver} from '@hookform/resolvers/zod';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from 'react-native';

const AddressActionScreen = ({
  navigation,
  route,
}: ApplicationScreenProps<'AddressDetail'>) => {
  const {params} = route;
  const isEdit = !!params.addressId;
  const data = params.data;
  const deleteAddressMutation = useDeleteAddressMutation();

  const onPressDelete = () => {
    Alert.alert(
      'Delete address',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteAddressMutation.mutate(data?._id!, {
              onSuccess: ({message}) => {
                ToastAndroid.show(message, ToastAndroid.SHORT);
                navigation.goBack();
              },
              onError: (error: any) => {
                ToastAndroid.show(
                  error.response?.data?.message || error.message,
                  ToastAndroid.SHORT,
                );
              },
            });
          },
        },
      ],
    );
  };

  useEffect(() => {
    navigation.setOptions({
      title: isEdit ? 'Edit Address' : 'Add Address',
      headerTitleAlign: 'center',
      headerRight: ({tintColor}) =>
        isEdit && !data?.isDefault ? (
          <Pressable
            onPress={onPressDelete}
            style={{
              marginRight: 16,
            }}>
            <Text
              style={{
                fontFamily: FONT_FAMILY.medium,
                color: tintColor,
              }}>
              Delete
            </Text>
          </Pressable>
        ) : null,
    });
  }, [isEdit]);

  const {colors} = useTheme();
  const {
    formState: {errors},
    handleSubmit,
    control,
  } = useForm<CreateAddressFormSchema | UpdateAddressFormSchema>({
    resolver: zodResolver(
      isEdit ? updateAddressFormSchema : createAddressFormSchema,
    ),
    defaultValues: data,
  });

  const [isDefault, setIsDefault] = React.useState(data?.isDefault || false);

  const addAddressMutation = useCreateAddressMutation();
  const updateAddressMutation = useUpdateAddressMutation();

  const isPending =
    addAddressMutation.isPending || updateAddressMutation.isPending;

  const onSubmit = (
    _data: UpdateAddressFormSchema | CreateAddressFormSchema,
  ) => {
    const handler = isEdit ? updateAddressMutation : addAddressMutation;

    handler.mutate(
      {
        _id: data?._id,
        ..._data,
        isDefault,
      },
      {
        onSuccess: ({message}) => {
          ToastAndroid.show(message, ToastAndroid.SHORT);
          navigation.goBack();
        },
        onError: (error: any) => {
          ToastAndroid.show(
            error.response?.data?.message || error.message,
            ToastAndroid.SHORT,
          );
        },
      },
    );
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{padding: 20}}
        showsVerticalScrollIndicator={false}>
        <View style={{gap: 12}}>
          <Controller
            control={control}
            name="name"
            render={({field: {onChange, value}}) => (
              <Input
                onChangeText={onChange}
                value={value}
                label="Name"
                placeholder="Le Van Duy"
                radius="sm"
                size="sm"
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
                isDisabled={isPending}
              />
            )}
          />

          <Controller
            control={control}
            name="phoneNumber"
            render={({field: {onChange, value}}) => (
              <Input
                onChangeText={onChange}
                value={value}
                label="Phone number"
                placeholder="0123456789"
                radius="sm"
                size="sm"
                isInvalid={!!errors.phoneNumber}
                errorMessage={errors.phoneNumber?.message}
                isDisabled={isPending}
              />
            )}
          />

          <Controller
            control={control}
            name="country"
            render={({field: {onChange, value}}) => (
              <Input
                onChangeText={onChange}
                value={value}
                label="Country"
                placeholder="Vietnam"
                radius="sm"
                size="sm"
                isInvalid={!!errors.country}
                errorMessage={errors.country?.message}
                isDisabled={isPending}
              />
            )}
          />

          <Controller
            control={control}
            name="city"
            render={({field: {onChange, value}}) => (
              <Input
                onChangeText={onChange}
                value={value}
                label="City"
                placeholder="Ho Chi Minh City"
                radius="sm"
                size="sm"
                isInvalid={!!errors.city}
                errorMessage={errors.city?.message}
                isDisabled={isPending}
              />
            )}
          />

          <Controller
            control={control}
            name="district"
            render={({field: {onChange, value}}) => (
              <Input
                onChangeText={onChange}
                value={value}
                label="District"
                placeholder="Enter your district"
                radius="sm"
                size="sm"
                isInvalid={!!errors.district}
                errorMessage={errors.district?.message}
                isDisabled={isPending}
              />
            )}
          />

          <Controller
            control={control}
            name="ward"
            render={({field: {onChange, value}}) => (
              <Input
                onChangeText={onChange}
                value={value}
                label="Ward"
                placeholder="Enter your ward"
                radius="sm"
                size="sm"
                isInvalid={!!errors.ward}
                errorMessage={errors.ward?.message}
                isDisabled={isPending}
              />
            )}
          />

          <Controller
            control={control}
            name="specificAddress"
            render={({field: {onChange, value}}) => (
              <TextArea
                onChangeText={onChange}
                value={value}
                label="Specific address"
                placeholder="Enter your specific address"
                radius="sm"
                size="sm"
                isInvalid={!!errors.specificAddress}
                errorMessage={errors.specificAddress?.message}
                isDisabled={isPending}
              />
            )}
          />

          <AppCheckbox
            onValueChange={v => {
              setIsDefault(v);
            }}
            value={isDefault}
            label={{
              checked: 'Default address',
              unChecked: 'Set as default address',
            }}
          />

          <Button
            color="primary"
            size="lg"
            isLoading={isPending}
            isDisabled={isPending}
            style={{marginTop: 20}}
            onPress={handleSubmit(onSubmit)}>
            <Text
              style={[
                TYPOGRAPHY.button,
                {
                  color: '#fff',
                },
              ]}>
              {isEdit ? 'Save' : 'Create'}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddressActionScreen;

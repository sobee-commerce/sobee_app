import {Button, Input} from '@/components/common';
import {useAuthContext} from '@/context';
import {UpdateUserFormSchema, updateUserFormSchema} from '@/lib/form-schema';
import {useUpdateUserMutation} from '@/services';
import {TYPOGRAPHY} from '@/theme';
import {ApplicationScreenProps} from '@/types';
import {zodResolver} from '@hookform/resolvers/zod';
import {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';

const EditProfile = ({navigation}: ApplicationScreenProps<'EditProfile'>) => {
  const {
    formState: {errors},
    handleSubmit,
    control,
    reset,
  } = useForm<UpdateUserFormSchema>({
    resolver: zodResolver(updateUserFormSchema),
  });

  const {user, setUser} = useAuthContext();
  const updateUserMutation = useUpdateUserMutation();
  const isPending = updateUserMutation.isPending;

  useEffect(() => {
    reset({
      name: user?.name,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
    });
  }, [user]);

  const onSubmit = (_data: UpdateUserFormSchema) => {
    updateUserMutation.mutate(_data, {
      onSuccess: data => {
        if (data.success) {
          setUser(data.data as any);
          ToastAndroid.show(data.message, ToastAndroid.SHORT);
          navigation.goBack();
        } else {
          Alert.alert('Error', data.message);
        }
      },
      onError: (error: any) => {
        Alert.alert('Error', error.response?.data?.message || error.message);
      },
    });
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{padding: 20}}>
        <View style={{gap: 12}}>
          <Controller
            control={control}
            name="name"
            render={({field: {onChange, value}}) => (
              <Input
                onChangeText={onChange}
                value={value}
                label="Name"
                placeholder="Enter your name"
                radius="sm"
                size="sm"
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
                isDisabled={isPending}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({field: {onChange, value}}) => (
              <Input
                onChangeText={onChange}
                value={value}
                label="Email"
                placeholder="Enter your email"
                radius="sm"
                size="sm"
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
                isDisabled={isPending}
                autoCapitalize="none"
                keyboardType="email-address"
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
                placeholder="Enter your phone number"
                radius="sm"
                size="sm"
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
                isDisabled={isPending}
                autoCapitalize="none"
                keyboardType="phone-pad"
              />
            )}
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
              Save
            </Text>
          </Button>
        </View>
      </ScrollView>
      <StatusBar backgroundColor={'transparent'} />
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({});

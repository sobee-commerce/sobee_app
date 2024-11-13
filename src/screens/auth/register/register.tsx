import {Button, Input} from '@/components/common';
import {useTheme} from '@/context';
import {RegisterFormSchema, registerFormSchema} from '@/lib/form-schema';
import {useRegisterMutation} from '@/services';
import {TYPOGRAPHY} from '@/theme';
import {ApplicationScreenProps} from '@/types';
import {APP_CONFIG, STORAGE} from '@/utils';
import {zodResolver} from '@hookform/resolvers/zod';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  ToastAndroid,
  View,
} from 'react-native';

const RegisterScreen = ({navigation}: ApplicationScreenProps<'Register'>) => {
  const {colors} = useTheme();
  const {
    formState: {errors},
    handleSubmit,
    control,
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      role: 'customers',
    },
  });

  const {mutate, isPending} = useRegisterMutation();

  const onSubmit = (_data: RegisterFormSchema) => {
    mutate(_data, {
      onSuccess: data => {
        ToastAndroid.show(data.message, ToastAndroid.SHORT);
        STORAGE.set(APP_CONFIG.STORAGE_KEY.ACCESS_TOKEN, data.data.accessToken);
        STORAGE.set(
          APP_CONFIG.STORAGE_KEY.REFRESH_TOKEN,
          data.data.refreshToken,
        );
        STORAGE.set(APP_CONFIG.STORAGE_KEY.USER_ID, data.data.user._id!);
        navigation.reset({
          index: 0,
          routes: [{name: 'Main'}],
        });
      },
      onError: (error: any) => {
        ToastAndroid.show(
          error.response?.data?.message || error.message,
          ToastAndroid.SHORT,
        );
      },
    });
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{padding: 20}}>
        <Text
          style={[
            TYPOGRAPHY.h4,
            {
              color: colors.layout.foreground,
              textAlign: 'center',
            },
          ]}>
          Register
        </Text>
        <Text
          style={[
            TYPOGRAPHY.caption,
            {
              textAlign: 'center',
              color: colors.layout.foreground,
            },
          ]}>
          Register to your account to explore all the features of the app.
        </Text>
        <View style={{gap: 12, marginTop: 40}}>
          <Controller
            control={control}
            name="name"
            render={({field: {onChange, value}}) => (
              <Input
                onChangeText={onChange}
                value={value}
                label="Full Name"
                placeholder="John Doe"
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
            name="email"
            render={({field: {onChange, value}}) => (
              <Input
                onChangeText={onChange}
                value={value}
                label="Email"
                placeholder="example@host.com"
                radius="sm"
                size="sm"
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
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
                placeholder="08123456789"
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
            name="password"
            render={({field: {onChange, value}}) => (
              <Input
                onChangeText={onChange}
                value={value}
                label="Password"
                placeholder="Enter your password"
                radius="sm"
                size="sm"
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
                secureTextEntry
                isDisabled={isPending}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({field: {onChange, value}}) => (
              <Input
                onChangeText={onChange}
                value={value}
                label="Confirm password"
                placeholder="Re-enter your password"
                radius="sm"
                size="sm"
                isInvalid={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword?.message}
                secureTextEntry
                isDisabled={isPending}
              />
            )}
          />

          <Button
            color="primary"
            size="lg"
            style={{marginTop: 20}}
            isDisabled={isPending}
            isLoading={isPending}
            onPress={handleSubmit(onSubmit)}>
            <Text
              style={[
                TYPOGRAPHY.button,
                {
                  color: '#fff',
                },
              ]}>
              Submit
            </Text>
          </Button>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text
              style={[
                TYPOGRAPHY.button,
                {
                  color: colors.layout.foreground,
                },
              ]}>
              Already have an account?{' '}
            </Text>
            <Pressable
              onPress={() => navigation.replace('Login')}
              disabled={isPending}>
              <Text
                style={[
                  TYPOGRAPHY.button,
                  {
                    color: colors.base.secondary,
                    textDecorationLine: 'underline',
                  },
                ]}>
                Login here
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor={'transparent'} />
    </View>
  );
};

export default RegisterScreen;

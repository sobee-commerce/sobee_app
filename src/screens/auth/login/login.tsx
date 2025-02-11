import {Button, Input} from '@/components/common';
import {useAuthContext, useTheme} from '@/context';
import {LoginFormSchema, loginFormSchema} from '@/lib/form-schema';
import {ICustomer, IUser} from '@/lib/interfaces';
import {useLoginMutation} from '@/services';
import {TYPOGRAPHY} from '@/theme';
import {ApplicationScreenProps} from '@/types';
import {APP_CONFIG, STORAGE} from '@/utils';
import {zodResolver} from '@hookform/resolvers/zod';
import {Controller, useForm} from 'react-hook-form';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import SocialAuthentication from '../components/SocialAuthentication';

const LoginScreen = ({navigation}: ApplicationScreenProps<'Login'>) => {
  const {colors} = useTheme();
  const {
    formState: {errors},
    handleSubmit,
    control,
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
  });

  const {mutate, isPending} = useLoginMutation();
  const {setUser} = useAuthContext();

  const onSubmit = (_data: LoginFormSchema) => {
    mutate(_data, {
      onSuccess: data => {
        if (data.success) {
          ToastAndroid.show(data.message, ToastAndroid.SHORT);
          STORAGE.set(
            APP_CONFIG.STORAGE_KEY.ACCESS_TOKEN,
            data.data.accessToken,
          );
          STORAGE.set(
            APP_CONFIG.STORAGE_KEY.REFRESH_TOKEN,
            data.data.refreshToken,
          );
          STORAGE.set(APP_CONFIG.STORAGE_KEY.USER_ID, data.data.user._id!);
          setUser(data.data.user as IUser<ICustomer>);
          navigation.reset({
            index: 0,
            routes: [{name: 'Main'}],
          });
        } else {
          Alert.alert('Error', data.message);
        }
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
          Login
        </Text>
        <Text
          style={[
            TYPOGRAPHY.caption,
            {
              textAlign: 'center',
              color: colors.layout.foreground,
            },
          ]}>
          Login to your account to access all the features of the app.
        </Text>
        <View style={{gap: 12, marginTop: 40}}>
          <Controller
            control={control}
            name="emailOrPhone"
            render={({field: {onChange, value}}) => (
              <Input
                onChangeText={onChange}
                value={value}
                label="Email/Phone number"
                placeholder="Enter your email or phone number"
                radius="sm"
                size="sm"
                isInvalid={!!errors.emailOrPhone}
                errorMessage={errors.emailOrPhone?.message}
                isDisabled={isPending}
                autoCapitalize="none"
                keyboardType="email-address"
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
                isDisabled={isPending}
                secureTextEntry
              />
            )}
          />

          <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
            <Text
              style={[
                TYPOGRAPHY.button,
                {
                  color: colors.base.secondary,
                  textAlign: 'right',
                  textDecorationLine: 'underline',
                },
              ]}>
              Forgot password?
            </Text>
          </Pressable>

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
              Don't have any account?{' '}
            </Text>
            <Pressable onPress={() => navigation.replace('Register')}>
              <Text
                style={[
                  TYPOGRAPHY.button,
                  {
                    color: colors.base.secondary,
                    textDecorationLine: 'underline',
                  },
                ]}>
                Register here
              </Text>
            </Pressable>
          </View>
          <Text
            style={[
              TYPOGRAPHY.body2,
              {
                textAlign: 'center',
              },
            ]}>
            or
          </Text>
          <SocialAuthentication />
        </View>
      </ScrollView>
      <StatusBar backgroundColor={'transparent'} />
    </View>
  );
};

export default LoginScreen;

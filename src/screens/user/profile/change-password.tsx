import {Button, Input} from '@/components/common';
import {
  ChangePasswordFormSchema,
  changePasswordFormSchema,
} from '@/lib/form-schema';
import {useChangePasswordMutation} from '@/services';
import {TYPOGRAPHY} from '@/theme';
import {ApplicationScreenProps} from '@/types';
import {zodResolver} from '@hookform/resolvers/zod';
import {Controller, useForm} from 'react-hook-form';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';

const ChangePassword = ({
  navigation,
}: ApplicationScreenProps<'ChangePassword'>) => {
  const {
    formState: {errors},
    handleSubmit,
    control,
    reset,
  } = useForm<ChangePasswordFormSchema>({
    resolver: zodResolver(changePasswordFormSchema),
  });

  const changePasswordMutation = useChangePasswordMutation();
  const isPending = changePasswordMutation.isPending;

  const onSubmit = (_data: ChangePasswordFormSchema) => {
    changePasswordMutation.mutate(_data, {
      onSuccess: data => {
        if (data.success) {
          ToastAndroid.show(data.message, ToastAndroid.SHORT);
          reset();
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
            name="oldPassword"
            render={({field: {onChange, value}}) => (
              <Input
                onChangeText={onChange}
                value={value}
                label="Old Password"
                placeholder="Enter your old password"
                radius="sm"
                size="sm"
                isInvalid={!!errors.oldPassword}
                errorMessage={errors.oldPassword?.message}
                isDisabled={isPending}
                autoCapitalize="none"
                secureTextEntry
              />
            )}
          />

          <Controller
            control={control}
            name="newPassword"
            render={({field: {onChange, value}}) => (
              <Input
                onChangeText={onChange}
                value={value}
                label="New Password"
                placeholder="Enter your new password"
                radius="sm"
                size="sm"
                isInvalid={!!errors.newPassword}
                errorMessage={errors.newPassword?.message}
                isDisabled={isPending}
                autoCapitalize="none"
                secureTextEntry
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
                label="Confirm Password"
                placeholder="Confirm your new password"
                radius="sm"
                size="sm"
                isInvalid={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword?.message}
                isDisabled={isPending}
                autoCapitalize="none"
                secureTextEntry
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
              Confirm
            </Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({});

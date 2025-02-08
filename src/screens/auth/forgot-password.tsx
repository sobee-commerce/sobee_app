import {Button, Input} from '@/components/common';
import {useTheme} from '@/context';
import {useSendForgotPasswordMailMutation} from '@/services';
import {TYPOGRAPHY} from '@/theme';
import {ApplicationScreenProps} from '@/types';
import {useState} from 'react';
import {Alert, ScrollView, StatusBar, Text} from 'react-native';

const ForgotPassword = ({
  navigation,
}: ApplicationScreenProps<'ForgotPassword'>) => {
  const {colors} = useTheme();

  const [emailOrPhone, setEmailOrPhone] = useState('');

  const sendForgotPasswordMutation = useSendForgotPasswordMailMutation();
  const isPending = sendForgotPasswordMutation.isPending;

  const onSubmit = () => {
    sendForgotPasswordMutation.mutate(emailOrPhone, {
      onSuccess: data => {
        if (data.success) {
          Alert.alert('Success', data.message, [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('ValidateOtp', {email: data.data});
              },
            },
          ]);
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
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{padding: 20, gap: 20}}>
      <Input
        onChangeText={setEmailOrPhone}
        value={emailOrPhone}
        label="Email/Phone number"
        placeholder="Enter your email or phone number"
        radius="sm"
        size="sm"
        isDisabled={isPending}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Button
        color="primary"
        isLoading={isPending}
        isDisabled={isPending}
        onPress={onSubmit}>
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

      <StatusBar
        backgroundColor={colors.primary.primary500}
        barStyle={'light-content'}
      />
    </ScrollView>
  );
};

export default ForgotPassword;

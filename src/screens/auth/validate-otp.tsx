import {useTheme} from '@/context';
import {useValidateForgotPasswordMutation} from '@/services';
import {ApplicationScreenProps} from '@/types';
import {useRef} from 'react';
import {ActivityIndicator, Alert, View} from 'react-native';
import {OtpInput, OtpInputRef} from 'react-native-otp-entry';

const ValidateOtp = ({
  navigation,
  route,
}: ApplicationScreenProps<'ValidateOtp'>) => {
  const email = route.params.email;
  const validateOtpMutation = useValidateForgotPasswordMutation();
  const otfRef = useRef<OtpInputRef>(null);
  const {colors} = useTheme();

  console.log(validateOtpMutation.isPending);

  const onFilled = (otp: string) => {
    validateOtpMutation.mutate(
      {email, code: otp},
      {
        onSuccess: data => {
          if (data.success) {
            Alert.alert(
              'Success',
              "We've sent you a new password on your email, please check your email",
              [
                {
                  text: 'OK',
                  onPress: () => {
                    navigation.reset({
                      index: 0,
                      routes: [{name: 'Login'}],
                    });
                  },
                },
              ],
            );
          } else {
            otfRef.current?.clear();
            Alert.alert('Error', data.message);
          }
        },
        onError: (error: any) => {
          otfRef.current?.clear();
          Alert.alert('Error', error.response?.data?.message || error.message);
        },
      },
    );
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
      }}>
      {validateOtpMutation.isPending && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255,255,255,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}>
          <ActivityIndicator size="large" color={colors.primary.primary500} />
        </View>
      )}
      <OtpInput
        ref={otfRef}
        numberOfDigits={6}
        focusColor={colors.primary.primary500}
        hideStick={true}
        placeholder="******"
        blurOnFilled={true}
        disabled={false}
        type="numeric"
        secureTextEntry={false}
        focusStickBlinkingDuration={500}
        onFilled={onFilled}
      />
    </View>
  );
};

export default ValidateOtp;

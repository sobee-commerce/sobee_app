import {Button} from '@/components/common';
import {useAuthContext} from '@/context';
import {ICustomer, IUser} from '@/lib/interfaces';
import {useGoogleLoginMutation} from '@/services';
import {ApplicationNavigationProps} from '@/types';
import {APP_CONFIG, STORAGE, TYPOGRAPHY} from '@/utils';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import {Alert, Text, ToastAndroid, View} from 'react-native';

const SocialAuthentication = () => {
  const navigation = useNavigation<ApplicationNavigationProps>();
  const {setUser} = useAuthContext();
  const googleLoginMutation = useGoogleLoginMutation();

  const onPressSignInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      if (GoogleSignin.hasPreviousSignIn()) {
        await GoogleSignin.signOut();
      }

      const {data} = await GoogleSignin.signIn();
      const email = data?.user.email;

      if (!email) {
        Alert.alert('Error', 'Email not found in your google account');
        return;
      }

      googleLoginMutation.mutate(
        email,

        {
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
          onError: (err: any) => {
            Alert.alert('Error', err?.response?.data?.message ?? err.message);
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <Button
        color="transparent"
        onPress={onPressSignInWithGoogle}
        style={[
          {
            borderWidth: 2,
            borderColor: '#D4D7DD',
          },
        ]}>
        <Text style={[TYPOGRAPHY.button]}>Sign in with Google</Text>
      </Button>
    </View>
  );
};

export default SocialAuthentication;

import {useAuthContext, useTheme} from '@/context';
import {ICustomer, IUser} from '@/lib/interfaces';
import {useGetMeQuery} from '@/services';
import {ApplicationScreenProps} from '@/types';
import {APP_CONFIG, STORAGE} from '@/utils';
import {useEffect} from 'react';
import {ActivityIndicator, Image, View} from 'react-native';

const SplashScreen = ({navigation}: ApplicationScreenProps<'Splash'>) => {
  const {theme, colors} = useTheme();
  const {setUser} = useAuthContext();

  const {isSuccess, isError, data} = useGetMeQuery();

  useEffect(() => {
    if (isError) {
      const route =
        STORAGE.getBoolean(APP_CONFIG.STORAGE_KEY.IS_FIRST_TIME) === false
          ? 'Login'
          : 'Onboarding';
      navigation.replace(route);
    }
    if (isSuccess && data?.data?.user) {
      setUser(data?.data.user as IUser<ICustomer>);
      navigation.replace('Main');
    }
  }, [data, isError, isSuccess, navigation]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image
        source={
          theme === 'light'
            ? require('@/assets/illustrations/logo_text_light.png')
            : require('@/assets/illustrations/logo_text_dark.png')
        }
        style={{
          width: 140,
          height: 60,
          alignSelf: 'center',
        }}
        resizeMode="contain"
      />
      <ActivityIndicator size="small" color={colors.base.primary} />
    </View>
  );
};

export default SplashScreen;

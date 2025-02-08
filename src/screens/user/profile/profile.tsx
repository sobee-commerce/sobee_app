import {Button} from '@/components/common';
import {DEFAULT_IMAGE} from '@/constants';
import {useAuthContext, useTheme} from '@/context';
import {useLogoutMutation} from '@/services';
import {ApplicationScreenProps} from '@/types';
import {APP_CONFIG, STORAGE, TYPOGRAPHY} from '@/utils';
import {useQueryClient} from '@tanstack/react-query';
import {LogOut, Moon, Sun} from 'lucide-react-native';
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MenuItem from './components/MenuItem';

const ProfileScreen = ({navigation}: ApplicationScreenProps<'Profile'>) => {
  const {toggleTheme, colors, theme} = useTheme();
  const {isPending, mutate} = useLogoutMutation();
  const {user} = useAuthContext();
  const queryClient = useQueryClient();

  const onPressLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        ToastAndroid.show('Logout Success', ToastAndroid.SHORT);
        STORAGE.delete(APP_CONFIG.STORAGE_KEY.ACCESS_TOKEN);
        STORAGE.delete(APP_CONFIG.STORAGE_KEY.REFRESH_TOKEN);
        STORAGE.delete(APP_CONFIG.STORAGE_KEY.USER_ID);
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
        queryClient.clear();
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
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{gap: 20}}
      showsVerticalScrollIndicator={false}>
      <LinearGradient
        style={{
          height: 160,
          width: '100%',
          justifyContent: 'flex-end',
        }}
        colors={[colors.base.primary, colors.primary.primary600]}>
        <View
          style={StyleSheet.flatten([
            {
              borderColor: colors.default.default200,
              backgroundColor: colors.layout.background,
            },
            styles.card,
          ])}>
          <Image
            resizeMode="contain"
            source={{uri: user?.avatar ?? DEFAULT_IMAGE}}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              borderWidth: 4,
              borderColor: colors.default.default100,
            }}
          />
          <View style={{flex: 1, justifyContent: 'space-between', gap: 8}}>
            <Text
              style={[
                TYPOGRAPHY.h5,
                {
                  color: colors.layout.foreground,
                },
              ]}>
              {user?.name || 'N/A'}
            </Text>
            <Text
              style={[
                TYPOGRAPHY.body2,
                {
                  color: colors.layout.foreground,
                },
              ]}>
              {user?.email || 'N/A'}
            </Text>
            <Text
              style={[
                TYPOGRAPHY.body2,
                {
                  color: colors.layout.foreground,
                },
              ]}>
              {user?.phoneNumber || 'N/A'}
            </Text>
          </View>
        </View>
      </LinearGradient>
      <View style={{marginTop: 40, gap: 16, padding: 20}}>
        <MenuItem
          label="Edit profile"
          onPress={() => navigation.navigate('EditProfile')}
        />

        <MenuItem
          label="Address"
          onPress={() => navigation.navigate('Address')}
        />

        <MenuItem
          label="Favorite products"
          onPress={() => navigation.navigate('Favorite')}
        />

        <MenuItem
          label="Saved coupons"
          onPress={() => navigation.navigate('SavedCoupon')}
        />

        <MenuItem
          label="Change password"
          onPress={() => navigation.navigate('ChangePassword')}
        />

        <MenuItem
          label="Change theme"
          onPress={toggleTheme}
          right={
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{
                  false: colors.default.default200,
                  true: colors.primary.primary200,
                }}
                thumbColor={colors.base.primary}
              />
              {theme === 'dark' ? (
                <Moon
                  size={20}
                  color={colors.layout.foreground}
                  strokeWidth={1.5}
                />
              ) : (
                <Sun
                  size={20}
                  color={colors.layout.foreground}
                  strokeWidth={1.5}
                />
              )}
            </View>
          }
        />

        <Button
          onPress={onPressLogout}
          color="transparent"
          style={{borderWidth: 0.5, borderColor: colors.base.danger}}
          isLoading={isPending}
          isDisabled={isPending}
          endContent={
            <LogOut size={20} color={colors.base.danger} strokeWidth={1.5} />
          }>
          <Text
            style={[
              TYPOGRAPHY.button,
              {
                color: colors.base.danger,
              },
            ]}>
            Log out
          </Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: -50,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 2,
    zIndex: 1,
    left: 20,
    right: 20,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
});

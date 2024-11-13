import {Button} from '@/components/common';
import {useTheme} from '@/context';
import {TYPOGRAPHY} from '@/theme';
import {ApplicationScreenProps} from '@/types';
import {APP_CONFIG, STORAGE} from '@/utils';
import React from 'react';
import {Image, Text, View} from 'react-native';

const OnboardingScreen = ({
  navigation,
}: ApplicationScreenProps<'Onboarding'>) => {
  const {colors, theme} = useTheme();

  const onPress = () => {
    STORAGE.set(APP_CONFIG.STORAGE_KEY.IS_FIRST_TIME, false);
  };

  const onPressRegister = () => {
    navigation.navigate('Register');
    onPress();
  };

  const onPressLogin = () => {
    navigation.navigate('Login');
    onPress();
  };

  return (
    <View style={{flex: 1}}>
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
      <Image
        source={require('@/assets/illustrations/onboarding.png')}
        style={{
          flex: 1,
          width: '100%',
          height: 200,
        }}
        resizeMode="contain"
      />
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
        }}>
        <Text
          style={[
            TYPOGRAPHY.h6,
            {
              color: colors.layout.foreground,
              textAlign: 'center',
            },
          ]}>
          Welcome to{' '}
          <Text
            style={{
              color: colors.base.primary,
            }}>
            Sobee
          </Text>
          . Get started by creating an account or signing in.
        </Text>
        <Button size="lg" color="primary" onPress={onPressRegister}>
          <Text
            style={[
              TYPOGRAPHY.button,
              {
                color: '#fff',
              },
            ]}>
            Register
          </Text>
        </Button>
        <Button size="lg" onPress={onPressLogin}>
          <Text
            style={[
              TYPOGRAPHY.button,
              {
                color: colors.layout.foreground,
              },
            ]}>
            Login
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default OnboardingScreen;

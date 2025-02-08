import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {CameraProvider, useTheme} from '@/context';
import {
  AddressDetailScreen,
  AddressScreen,
  AskQuestionScreen,
  BrandDetailScreen,
  BrandScreen,
  CartScreen,
  CategoryDetailScreen,
  CategoryScreen,
  ChatScreen,
  CheckoutScreen,
  CouponDetailScreen,
  FavoriteScreen,
  LoginScreen,
  MainScreen,
  OnboardingScreen,
  OrderContactScreen,
  OrderDetailScreen,
  OrderRefundScreen,
  OrderReviewScreen,
  ProductDetailScreen,
  ProductQuestionScreen,
  ProductReviewScreen,
  RegisterScreen,
  ScanQRScreen,
  ShippingAddressScreen,
  SplashScreen,
} from '@/screens';
import ForgotPassword from '@/screens/auth/forgot-password';
import SettingsScreen from '@/screens/settings/settings';
import ChangePassword from '@/screens/user/profile/change-password';
import EditProfile from '@/screens/user/profile/edit-profile';
import SavedCoupons from '@/screens/user/profile/saved-coupons';
import type {ApplicationStackParamList} from '@/types/navigation';
import {APP_CONFIG, FONT_FAMILY, navigationRef} from '@/utils';
import {StatusBar} from 'react-native';

const Stack = createStackNavigator<ApplicationStackParamList>();

function ApplicationNavigator() {
  const initialRouteName: keyof ApplicationStackParamList = 'Splash';
  const {colors, theme} = useTheme();

  const QRScanner = (props: any) => {
    return (
      <CameraProvider>
        <ScanQRScreen {...props} />
      </CameraProvider>
    );
  };

  return (
    <>
      <NavigationContainer
        ref={navigationRef}
        theme={{
          colors: {
            background: colors.layout.background,
            card: colors.base.primary,
            primary: colors.base.primary,
            text: colors.layout.foreground,
            border: colors.layout.divider,
            notification: colors.base.danger,
          },
          dark: theme === 'dark',
          fonts: {
            bold: {
              fontFamily: FONT_FAMILY.bold,
              fontWeight: 'bold',
            },
            medium: {
              fontFamily: FONT_FAMILY.medium,
              fontWeight: '500',
            },
            regular: {
              fontFamily: FONT_FAMILY.regular,
              fontWeight: '400',
            },
            heavy: {
              fontFamily: FONT_FAMILY.extraBold,
              fontWeight: '800',
            },
          },
        }}>
        <Stack.Navigator
          screenOptions={{
            headerTitleStyle: {
              color: colors.white,
              fontFamily: FONT_FAMILY.semiBold,
              fontSize: 16,
              maxWidth: APP_CONFIG.SCREEN.WIDTH - 100,
            },
            headerTintColor: colors.white,
          }}
          initialRouteName={initialRouteName}>
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{headerShown: false}}
          />
          <Stack.Group navigationKey="Auth">
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{headerShown: false}}
            />
          </Stack.Group>
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen
            name="ShippingAddress"
            component={ShippingAddressScreen}
          />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="ProductReview" component={ProductReviewScreen} />
          <Stack.Screen
            name="ProductQuestion"
            component={ProductQuestionScreen}
          />
          <Stack.Screen name="AskQuestion" component={AskQuestionScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Favorite" component={FavoriteScreen} />
          <Stack.Screen name="Brand" component={BrandScreen} />
          <Stack.Screen name="BrandDetail" component={BrandDetailScreen} />
          <Stack.Screen name="CouponDetail" component={CouponDetailScreen} />
          <Stack.Screen name="Category" component={CategoryScreen} />
          <Stack.Screen
            name="CategoryDetail"
            component={CategoryDetailScreen}
          />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
          <Stack.Screen name="Address" component={AddressScreen} />
          <Stack.Screen name="AddressDetail" component={AddressDetailScreen} />
          <Stack.Screen name="Contact" component={OrderContactScreen} />
          <Stack.Screen name="Refund" component={OrderRefundScreen} />
          <Stack.Screen name="Review" component={OrderReviewScreen} />
          <Stack.Screen name="ScanQRCode" component={QRScanner} />
          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{
              title: 'Edit Profile',
            }}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePassword}
            options={{
              title: 'Change Password',
            }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{
              title: 'Forgot Password',
            }}
          />
          <Stack.Screen
            name="SavedCoupon"
            component={SavedCoupons}
            options={{
              title: 'Saved Coupons',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
    </>
  );
}

export default ApplicationNavigator;

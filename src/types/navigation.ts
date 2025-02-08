import {IAddress, IQuestion, IReview} from '@/lib/interfaces';
import {NavigationProp} from '@react-navigation/native';
import type {StackScreenProps} from '@react-navigation/stack';

export type ApplicationStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Onboarding: undefined;
  Home: undefined;
  Cart: undefined;
  Profile: undefined;
  Search: undefined;
  Notifications: undefined;
  Category: undefined;
  CategoryDetail: {categoryId: string; name: string};
  Brand: undefined;
  BrandDetail: {brandId: string; name: string};
  Checkout: undefined;
  ShippingAddress: {
    selectedAddress: string | undefined;
    onChangeAddress: (addressId: string) => void;
  };
  Order: undefined;
  OrderDetail: {orderId: string};
  Address: undefined;
  AddressDetail: {
    addressId?: string;
    data?: IAddress;
  };
  Payment: undefined;
  Settings: undefined;
  Chat: undefined;
  Contact: {roomId: string};
  Refund: {orderId: string};
  Review: {orderId: string; data?: IReview};
  Coupon: undefined;
  CouponDetail: {couponCode: string};
  ProductDetail: {productId: string; name: string};
  ProductReview: {productId: string};
  ProductQuestion: {productId: string};
  AskQuestion: {productId: string; data?: IQuestion};
  Favorite: undefined;
  ScanQRCode?: {onSuccess?: (data: string) => void};
  ChangePassword: undefined;
  EditProfile: undefined;
  ForgotPassword: undefined;
  SavedCoupon: undefined;
  ValidateOtp: {email: string};
};

/**
 * @example
 * type Props = ApplicationScreenProps<'Onboarding'>;
 */
export type ApplicationScreenProps<T extends keyof ApplicationStackParamList> =
  StackScreenProps<ApplicationStackParamList, T>;

/**
 * @example
 * const navigation = useNavigation<ApplicationNavigationProps>();
 */
export type ApplicationNavigationProps =
  NavigationProp<ApplicationStackParamList>;

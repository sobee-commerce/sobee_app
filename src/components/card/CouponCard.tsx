import {useAuthContext, useTheme} from '@/context';
import {formatCurrency} from '@/lib';
import {ECouponStatus, ECouponType} from '@/lib/enum';
import {ICoupon} from '@/lib/interfaces';
import {useSaveCouponMutation} from '@/services';
import {FONT_FAMILY, TYPOGRAPHY} from '@/theme';
import {ApplicationNavigationProps} from '@/types';
import {optimizeImageSrc} from '@/utils/image';
import {useNavigation} from '@react-navigation/native';
import {format} from 'date-fns';
import {useEffect, useState} from 'react';
import {Image, Pressable, Text, View} from 'react-native';

type CouponCardProps = {
  coupon: ICoupon;
  onPress?: () => void;
  isSelected?: boolean;
};
const CouponCard = ({
  coupon,
  onPress: _onPress,
  isSelected = false,
}: CouponCardProps) => {
  const navigation = useNavigation<ApplicationNavigationProps>();
  const {colors} = useTheme();
  const {user} = useAuthContext();
  const saveCouponMutation = useSaveCouponMutation();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const _isSaved = coupon.customerSaved.includes(user?._id!);
    setIsSaved(_isSaved);
  }, [coupon, user?._id]);

  const onSaveCoupon = async () => {
    setIsSaved(prev => !prev);
    saveCouponMutation.mutate(coupon.code, {
      onSuccess: data => {
        if (!data.success) {
          setIsSaved(prev => !prev);
          console.log('Failed to save coupon');
        }
      },
    });
  };

  const onPress = () => {
    if (_onPress) {
      _onPress();
      return;
    }
    navigation.navigate('CouponDetail', {couponCode: coupon.code!});
  };

  const isExpired =
    coupon?.status === ECouponStatus.EXPIRED ||
    new Date(coupon.endDate) < new Date();

  return (
    <Pressable
      // disabled={isExpired}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        borderWidth: isSelected ? 2 : 0.5,
        borderColor: isSelected ? colors.base.primary : colors.layout.divider,
        gap: 8,
        borderRadius: 8,
        overflow: 'hidden',
        opacity: isExpired ? 0.5 : 1,
      }}>
      {isExpired && (
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
          }}
        />
      )}
      <Image
        source={{uri: optimizeImageSrc(coupon.image!, 80, 80)}}
        style={{
          width: 120,
          height: 'auto',
        }}
        resizeMode="stretch"
      />
      <View style={{flex: 1, padding: 6}}>
        <Text
          style={[
            TYPOGRAPHY.body1,
            {
              fontFamily: FONT_FAMILY.bold,
            },
          ]}
          numberOfLines={1}>
          {coupon.code}
        </Text>
        <Text
          style={[
            TYPOGRAPHY.body2,
            {
              color: colors.primary.primary500,
            },
          ]}
          numberOfLines={1}>
          {coupon.type === ECouponType.PERCENTAGE
            ? `${coupon.discountValue * 100}% OFF`
            : `${formatCurrency(coupon.discountValue)} OFF`}
        </Text>
        <Text
          style={[
            TYPOGRAPHY.caption,
            {
              color: colors.layout.foreground,
            },
          ]}
          numberOfLines={1}>
          Apply to: {coupon.applyTo}
        </Text>

        <View
          style={{
            backgroundColor: colors.layout.divider,
            height: 6,
            borderRadius: 3,
            overflow: 'hidden',
            marginTop: 6,
          }}>
          <View
            style={{
              width: `${(coupon.usageCount / coupon.usageLimit) * 100}%`,
              backgroundColor: colors.primary.primary500,
              height: 6,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 6,
          }}>
          <Text
            style={[
              TYPOGRAPHY.caption,
              {
                color: colors.layout.foreground,
              },
            ]}>
            EXP: {format(new Date(coupon.endDate), 'dd/MM/yyyy')}
          </Text>

          {isExpired ? (
            <Text
              style={[
                TYPOGRAPHY.caption,
                {
                  color: colors.danger.danger500,
                },
              ]}>
              Expired
            </Text>
          ) : (
            <Pressable
              onPress={onSaveCoupon}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 12,
                backgroundColor: isSaved
                  ? colors.success.success500
                  : colors.primary.primary500,
                borderRadius: 6,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: colors.content.content1,
                  fontSize: 12,
                }}>
                {isSaved ? 'Saved' : 'Save'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default CouponCard;

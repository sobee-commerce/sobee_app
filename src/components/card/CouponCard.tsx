import {useTheme} from '@/context';
import {formatCurrency} from '@/lib';
import {ICoupon} from '@/lib/interfaces';
import {FONT_FAMILY, TYPOGRAPHY} from '@/theme';
import {ApplicationNavigationProps} from '@/types';
import {optimizeImageSrc} from '@/utils/image';
import {useNavigation} from '@react-navigation/native';
import {format} from 'date-fns';
import {Image, Pressable, Text, View} from 'react-native';

type CouponCardProps = {
  coupon: ICoupon;
};
const CouponCard = ({coupon}: CouponCardProps) => {
  console.log(coupon);
  const navigation = useNavigation<ApplicationNavigationProps>();
  const {colors} = useTheme();

  const onPress = () => {
    navigation.navigate('CouponDetail', {couponId: coupon._id!});
  };

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: colors.layout.divider,
        gap: 8,
        borderRadius: 8,
        overflow: 'hidden',
      }}>
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
          {coupon.type === 'Percentage'
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

          <Pressable
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              backgroundColor: colors.primary.primary500,
              borderRadius: 6,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: colors.content.content1,
                fontSize: 12,
              }}>
              Save
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

export default CouponCard;

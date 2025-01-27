import {Button} from '@/components/common';
import {useTheme} from '@/context';
import {formatCurrency} from '@/lib';
import {useGetCouponByIdQuery} from '@/services';
import {TYPOGRAPHY} from '@/theme';
import {ApplicationScreenProps} from '@/types';
import {optimizeImageSrc} from '@/utils/image';
import {format} from 'date-fns';
import {useEffect} from 'react';
import {ActivityIndicator, Image, ScrollView, Text, View} from 'react-native';

const CouponDetail = ({
  navigation,
  route,
}: ApplicationScreenProps<'CouponDetail'>) => {
  const {couponId} = route.params;
  const {data, isLoading} = useGetCouponByIdQuery(couponId);
  const coupon = data?.data;
  const {colors} = useTheme();
  console.log(coupon);

  useEffect(() => {
    navigation.setOptions({title: coupon?.code});
  }, [coupon]);

  return isLoading ? (
    <ActivityIndicator />
  ) : coupon ? (
    <View style={{flex: 1}}>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{
          padding: 12,
          gap: 12,
        }}>
        <Image
          source={{uri: optimizeImageSrc(coupon.image!, 120, 120)}}
          style={{
            width: 160,
            height: 120,
            alignSelf: 'center',
          }}
          resizeMode="stretch"
        />
        <Text
          style={[
            TYPOGRAPHY.h5,
            {
              textAlign: 'center',
            },
          ]}>
          {coupon.code} -{' '}
          {coupon.type === 'Percentage'
            ? `${coupon.discountValue * 100}% OFF`
            : `${formatCurrency(coupon.discountValue)} OFF`}
        </Text>
        <Text
          style={[
            TYPOGRAPHY.body2,
            {
              textAlign: 'center',
            },
          ]}>
          EXP: {format(new Date(coupon.endDate), 'dd/MM/yyyy')}
        </Text>
        <Text
          style={[
            TYPOGRAPHY.body2,
            {
              textAlign: 'center',
            },
          ]}>
          Apply to: {coupon.applyTo}
        </Text>
        {/* {coupon.applyTo === 'Specific' && (
        <View>
          <LabelItemList
            data={coupon.productApply as IProduct[]}
            label="Applied Products"
            renderItem={({item}) => <ProductCard product={item} />}
            showNavigation={false}
          />
        </View>
      )} */}
      </ScrollView>
      <Button
        style={{
          margin: 12,
        }}
        color="primary">
        <Text style={[TYPOGRAPHY.button, {color: colors.content.content1}]}>
          {coupon.usageCount === coupon.usageLimit
            ? 'Coupon is out of stock'
            : 'Get Coupon'}
        </Text>
      </Button>
    </View>
  ) : (
    <Text
      style={[
        TYPOGRAPHY.caption,
        {
          textAlign: 'center',
        },
      ]}>
      Coupon not found
    </Text>
  );
};

export default CouponDetail;

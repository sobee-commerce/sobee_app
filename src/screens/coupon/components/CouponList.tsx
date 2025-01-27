import {CouponCard} from '@/components/card';
import {useTheme} from '@/context';
import {ICoupon} from '@/lib/interfaces';
import {useGetAllCouponsQuery} from '@/services';
import {TYPOGRAPHY} from '@/theme';
import {ActivityIndicator, FlatList, Text} from 'react-native';

const CouponList = () => {
  const {data, isLoading} = useGetAllCouponsQuery();
  const {colors} = useTheme();
  const coupons = data?.data || ([] as ICoupon[]);

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <FlatList
      ListHeaderComponent={() => (
        <Text
          style={[
            TYPOGRAPHY.h6,
            {
              color: colors.layout.foreground,
            },
          ]}>
          All Coupons
        </Text>
      )}
      ListEmptyComponent={() =>
        isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text style={[TYPOGRAPHY.body2]}>No coupons</Text>
        )
      }
      contentContainerStyle={{gap: 12}}
      scrollEnabled={false}
      data={coupons}
      renderItem={({item}) => <CouponCard coupon={item} />}
      keyExtractor={item => item._id!}
    />
  );
};

export default CouponList;

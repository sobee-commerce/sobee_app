import {CouponCard} from '@/components/card';
import {useTheme} from '@/context';
import {ICoupon} from '@/lib/interfaces';
import {useGetSavedCouponsQuery} from '@/services';
import {TYPOGRAPHY} from '@/theme';
import {ActivityIndicator, FlatList, Text} from 'react-native';

const SaveCoupons = () => {
  const {colors} = useTheme();
  const {data, isLoading, isRefetching} = useGetSavedCouponsQuery();
  const coupons = data?.data || ([] as ICoupon[]);
  return (
    <FlatList
      ListHeaderComponent={() => (
        <>
          <Text
            style={[
              TYPOGRAPHY.h6,
              {
                color: colors.layout.foreground,
              },
            ]}>
            Saved Coupons
          </Text>
          {isRefetching && <ActivityIndicator size="small" />}
        </>
      )}
      ListEmptyComponent={() =>
        isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text style={[TYPOGRAPHY.body2]}>No coupons</Text>
        )
      }
      scrollEnabled={false}
      data={coupons}
      renderItem={({item}) => <CouponCard coupon={item} />}
      keyExtractor={item => item._id!}
    />
  );
};

export default SaveCoupons;

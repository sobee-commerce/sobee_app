import {ScrollView, StyleSheet} from 'react-native';
import CouponList from './components/CouponList';
import TodayCoupons from './components/TodayCoupons';

const CouponScreen = () => {
  return (
    <ScrollView contentContainerStyle={{padding: 16}}>
      <TodayCoupons />
      <CouponList />
    </ScrollView>
  );
};

export default CouponScreen;

const styles = StyleSheet.create({});

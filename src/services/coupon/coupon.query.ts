import {QUERY_KEY} from '@/constants';
import {useQuery} from '@tanstack/react-query';
import {couponService} from './coupon.service';

export const useGetAllCouponsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.COUPON.GET_ALL],
    queryFn: async () => {
      const res = await couponService.getAllCoupons();
      return res.data;
    },
  });
};

export const useGetCouponByCodeQuery = (code: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.COUPON.GET_BY_CODE, code],
    queryFn: async () => {
      const res = await couponService.getCouponByCode(code);
      return res.data;
    },
  });
};

export const useGetTodayCouponsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.COUPON.GET_TODAY],
    queryFn: async () => {
      const res = await couponService.getTodayCoupons();
      return res.data;
    },
  });
};

export const useGetSavedCouponsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.COUPON.GET_SAVED],
    queryFn: async () => {
      const res = await couponService.getSaveCoupons();
      return res.data;
    },
  });
};

import {QUERY_KEY} from '@/constants';
import {useQuery} from '@tanstack/react-query';
import {couponService} from './coupon.service';

export const useGetCouponQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.COUPON.GET_ALL],
    queryFn: async () => {
      const res = await couponService.getAllCoupons();
      return res.data;
    },
  });
};

export const useGetCouponByIdQuery = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.COUPON.GET_BY_ID, id],
    queryFn: async () => {
      const res = await couponService.getCouponById(id);
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

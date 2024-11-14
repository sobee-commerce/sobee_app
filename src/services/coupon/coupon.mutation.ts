import {ValidateCouponFormSchema} from '@/lib/form-schema';
import {useMutation} from '@tanstack/react-query';
import {couponService} from './coupon.service';

export const useApplyCouponMutation = () => {
  return useMutation({
    mutationKey: ['APPLY_COUPON'],
    mutationFn: async (data: ValidateCouponFormSchema) => {
      const res = await couponService.applyCoupon(data);
      return res.data;
    },
  });
};

import {QUERY_KEY} from '@/constants';
import {ValidateCouponFormSchema} from '@/lib/form-schema';
import {useMutation, useQueryClient} from '@tanstack/react-query';
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

export const useSaveCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['SAVE_COUPON'],
    mutationFn: async (code: string) => {
      const res = await couponService.saveCoupon(code);
      if (res.data.success) {
        await queryClient.refetchQueries({
          queryKey: [QUERY_KEY.COUPON.GET_SAVED],
        });
      }
      return res.data;
    },
  });
};

import {API_ROUTES} from '@/constants';
import {ValidateCouponFormSchema} from '@/lib/form-schema';
import {ICoupon} from '@/lib/interfaces';
import {BaseResponse} from '@/utils';
import apiClient from '../api-client';

export const couponService = {
  getAllCoupons: async () =>
    await apiClient.get<BaseResponse<ICoupon[]>>(
      API_ROUTES.COUPONS.GET_COUPONS,
    ),
  getCouponByCode: async (code: string) =>
    await apiClient.get<BaseResponse<ICoupon>>(
      API_ROUTES.COUPONS.GET_COUPON_BY_CODE.replace(':code', code),
    ),
  getTodayCoupons: async () =>
    await apiClient.get<BaseResponse<ICoupon[]>>(
      API_ROUTES.COUPONS.GET_TODAY_COUPONS,
    ),
  applyCoupon: async (data: ValidateCouponFormSchema) =>
    await apiClient.post<BaseResponse<ICoupon>>(
      API_ROUTES.COUPONS.APPLY_COUPON,
      data,
    ),

  saveCoupon: async (code: string) =>
    await apiClient.put<BaseResponse<ICoupon>>(
      API_ROUTES.COUPONS.SAVE_COUPON.replace(':code', code),
    ),
  getSaveCoupons: async () =>
    await apiClient.get<BaseResponse<ICoupon[]>>(
      API_ROUTES.COUPONS.GET_SAVE_COUPONS,
    ),
};

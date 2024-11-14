import {API_ROUTES} from '@/constants';
import {CreatePaymentAccountFormSchema} from '@/lib/form-schema';
import {IPaymentAccount} from '@/lib/interfaces';
import {BaseResponse} from '@/utils';
import apiClient from '../api-client';

export const paymentAccountService = {
  getAllPaymentAccounts: async () =>
    await apiClient.get<BaseResponse<IPaymentAccount[]>>(
      API_ROUTES.PAYMENT_ACCOUNT.GET_PAYMENT_ACCOUNTS,
    ),
  createPaymentAccount: async (data: CreatePaymentAccountFormSchema) =>
    await apiClient.post<BaseResponse<IPaymentAccount>>(
      API_ROUTES.PAYMENT_ACCOUNT.CREATE,
      data,
    ),
  setDefaultPaymentAccount: async (id: string) =>
    await apiClient.put<BaseResponse<IPaymentAccount>>(
      API_ROUTES.PAYMENT_ACCOUNT.SET_DEFAULT,
      {paymentAccountId: id},
    ),
  deletePaymentAccount: async (id: string) =>
    await apiClient.delete(
      API_ROUTES.PAYMENT_ACCOUNT.DELETE_PAYMENT_ACCOUNT.replace(':id', id),
    ),
};

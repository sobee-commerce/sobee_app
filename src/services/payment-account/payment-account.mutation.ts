import {QUERY_KEY} from '@/constants';
import {CreatePaymentAccountFormSchema} from '@/lib/form-schema';
import {IPaymentAccount} from '@/lib/interfaces';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {paymentAccountService} from './payment-account.service';

export const useCreatePaymentAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePaymentAccountFormSchema) => {
      const res = await paymentAccountService.createPaymentAccount(data);
      if (res.data.success) {
        queryClient.setQueryData(
          [QUERY_KEY.PAYMENT_ACCOUNT.GET_ALL],
          (oldData: IPaymentAccount[]) => [...oldData, res.data.data],
        );
      }
      return res.data;
    },
  });
};

export const useDeletePaymentAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await paymentAccountService.deletePaymentAccount(id);
      if (res.data.success) {
        queryClient.setQueryData(
          [QUERY_KEY.PAYMENT_ACCOUNT.GET_ALL],
          (oldData: IPaymentAccount[]) =>
            oldData.filter(item => item._id !== id),
        );
      }
      return res.data;
    },
  });
};

export const useSetDefaultPaymentAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await paymentAccountService.setDefaultPaymentAccount(id);
      if (res.data.success) {
        queryClient.setQueryData(
          [QUERY_KEY.PAYMENT_ACCOUNT.GET_ALL],
          (oldData: IPaymentAccount[]) => {
            const index = oldData.findIndex(item => item._id === id);
            oldData.forEach(item => {
              item.isDefault = false;
            });
            oldData[index].isDefault = true;
            return [...oldData];
          },
        );
      }
      return res.data;
    },
  });
};

import {QUERY_KEY} from '@/constants';
import {useQuery} from '@tanstack/react-query';
import {paymentAccountService} from './payment-account.service';

export const useGetPaymentAccountsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.PAYMENT_ACCOUNT.GET_ALL],
    queryFn: async () => {
      const res = await paymentAccountService.getAllPaymentAccounts();
      return res.data;
    },
  });
};

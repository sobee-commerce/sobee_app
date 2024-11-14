import {QUERY_KEY} from '@/constants';
import {useQuery} from '@tanstack/react-query';
import {cardService} from './card.service';

export const useGetCardsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.PAYMENT_ACCOUNT.GET_ALL],
    queryFn: async () => {
      const res = await cardService.getAllCards();
      return res.data;
    },
  });
};

import {QUERY_KEY} from '@/constants';
import {useQuery} from '@tanstack/react-query';
import {addressService} from './address.service';

export const useGetAddressQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.ADDRESS.GET_ALL],
    queryFn: async () => {
      const res = await addressService.getUserAddresses();
      return res.data;
    },
  });
};

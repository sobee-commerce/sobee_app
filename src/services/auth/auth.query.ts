import {QUERY_KEY} from '@/constants';
import {useQuery} from '@tanstack/react-query';
import {authService} from './auth.service';

export const useGetMeQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.AUTH.GET_ME],
    queryFn: async () => {
      const res = await authService.getMe();
      return res.data;
    },
  });
};

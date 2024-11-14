import {QUERY_KEY} from '@/constants';
import {useQuery} from '@tanstack/react-query';
import {questionService} from './question.service';

export const useGetProductQuestionsQuery = (productId: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.QUESTION.GET_ALL, productId],
    queryFn: async () => {
      const res = await questionService.getProductQuestions(productId);
      return res.data;
    },
  });
};

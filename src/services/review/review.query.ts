import {QUERY_KEY} from '@/constants';
import {useQuery} from '@tanstack/react-query';
import {reviewService} from './review.service';

export const useGetProductReviewsQuery = (productId: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.REVIEW.GET_ALL, productId],
    queryFn: async () => {
      const res = await reviewService.getProductReviews(productId);
      return res.data;
    },
  });
};

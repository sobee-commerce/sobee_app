import {QUERY_KEY} from '@/constants';
import {CreateReviewForm} from '@/lib/form-schema';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {reviewService} from './review.service';

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateReviewForm) => {
      const res = await reviewService.createReview(data);
      if (res.data.success) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.REVIEW.GET_ALL],
        });
      }
      return res.data;
    },
  });
};

export const useEditReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateReviewForm) => {
      const res = await reviewService.createReview(data);
      if (res.data.success) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.REVIEW.GET_ALL],
        });
      }
      return res.data;
    },
  });
};

export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await reviewService.deleteReview(reviewId);
      if (res.data.success) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.REVIEW.GET_ALL],
        });
      }
      return res.data;
    },
  });
};

export const useLikeReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await reviewService.likeReview(reviewId);
      if (res.data.success) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.REVIEW.GET_ALL],
        });
      }
      return res.data;
    },
  });
};

export const useLikeReviewReplyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await reviewService.likeReviewReply(reviewId);
      if (res.data.success) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.REVIEW.GET_ALL],
        });
      }
      return res.data;
    },
  });
};

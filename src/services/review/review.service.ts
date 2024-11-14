import {API_ROUTES} from '@/constants';
import {CreateReviewForm, EditReviewForm} from '@/lib/form-schema';
import {IReview} from '@/lib/interfaces';
import {BaseResponse} from '@/utils';
import apiClient from '../api-client';

export const reviewService = {
  getProductReviews: async (productId: string, query?: any) =>
    await apiClient.get<BaseResponse<IReview[]>>(
      API_ROUTES.REVIEW.GET_PRODUCT_REVIEWS.replace(':id', productId),
      {
        params: query,
      },
    ),
  createReview: async (data: CreateReviewForm) =>
    await apiClient.post<BaseResponse<IReview>>(
      API_ROUTES.REVIEW.CREATE_REVIEW,
      data,
    ),
  editReview: async (reviewId: string, data: EditReviewForm) =>
    await apiClient.put<BaseResponse<IReview>>(
      API_ROUTES.REVIEW.UPDATE_REVIEW.replace(':id', reviewId),
      data,
    ),
  deleteReview: async (reviewId: string) =>
    await apiClient.delete(
      API_ROUTES.REVIEW.DELETE_REVIEW.replace(':id', reviewId),
    ),
  likeReview: async (reviewId: string) =>
    await apiClient.put<BaseResponse<IReview>>(
      API_ROUTES.REVIEW.LIKE_REVIEW.replace(':id', reviewId),
    ),
  likeReviewReply: async (reviewId: string) =>
    await apiClient.put<BaseResponse<IReview>>(
      API_ROUTES.REVIEW.LIKE_REVIEW_REPLY.replace(':id', reviewId),
    ),
};

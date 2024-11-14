import {API_ROUTES} from '@/constants';
import {CreateQuestionForm, EditQuestionForm} from '@/lib/form-schema';
import {IQuestion} from '@/lib/interfaces';
import {BaseResponse} from '@/utils';
import apiClient from '../api-client';

export const questionService = {
  getProductQuestions: async (productId: string) =>
    await apiClient.get<BaseResponse<IQuestion[]>>(
      API_ROUTES.QUESTION.GET_PRODUCT_QUESTIONS.replace(':id', productId),
    ),
  createQuestion: async (data: CreateQuestionForm) =>
    await apiClient.post<BaseResponse<IQuestion>>(
      API_ROUTES.QUESTION.CREATE_QUESTION,
      data,
    ),
  editQuestion: async (questionId: string, data: EditQuestionForm) =>
    await apiClient.put<BaseResponse<IQuestion>>(
      API_ROUTES.QUESTION.UPDATE_QUESTION.replace(':id', questionId),
      data,
    ),
  deleteQuestion: async (questionId: string) =>
    await apiClient.delete(
      API_ROUTES.QUESTION.DELETE_QUESTION.replace(':id', questionId),
    ),
  likeQuestion: async (questionId: string) =>
    await apiClient.put<BaseResponse<IQuestion>>(
      API_ROUTES.QUESTION.LIKE_QUESTION.replace(':id', questionId),
    ),
  likeQuestionReply: async (questionId: string) =>
    await apiClient.put<BaseResponse<IQuestion>>(
      API_ROUTES.QUESTION.LIKE_QUESTION_REPLY.replace(':id', questionId),
    ),
};

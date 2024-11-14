import {API_ROUTES} from '@/constants';
import {CreateCardFormSchema} from '@/lib/form-schema';
import {ICard} from '@/lib/interfaces';
import {BaseResponse} from '@/utils';
import apiClient from '../api-client';

export const cardService = {
  getAllCards: async () =>
    await apiClient.get<BaseResponse<ICard[]>>(
      API_ROUTES.PAYMENT_ACCOUNT.GET_PAYMENT_ACCOUNTS,
    ),
  createCard: async (data: CreateCardFormSchema) =>
    await apiClient.post<BaseResponse<ICard>>(
      API_ROUTES.PAYMENT_ACCOUNT.CREATE,
      data,
    ),
  setDefaultCard: async (id: string) =>
    await apiClient.put<BaseResponse<ICard>>(
      API_ROUTES.PAYMENT_ACCOUNT.SET_DEFAULT,
      {cardId: id},
    ),
  deleteCard: async (id: string) =>
    await apiClient.delete(
      API_ROUTES.PAYMENT_ACCOUNT.DELETE_PAYMENT_ACCOUNT.replace(':id', id),
    ),
};

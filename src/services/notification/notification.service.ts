import {API_ROUTES} from '@/constants';
import {BaseResponse} from '@/utils';
import apiClient from '../api-client';

export const notificationService = {
  saveToken: async (token: string) =>
    await apiClient.post<BaseResponse>(API_ROUTES.NOTIFICATION.SAVE_TOKEN, {
      fcmToken: token,
    }),
};

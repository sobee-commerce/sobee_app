import {API_ROUTES} from '@/constants';
import {UpdateUserFormSchema} from '@/lib/form-schema';
import {IUser} from '@/lib/interfaces';
import {BaseResponse} from '@/utils';
import apiClient from '../api-client';

export const userService = {
  updateUser: async (data: UpdateUserFormSchema) =>
    await apiClient.put<BaseResponse<IUser>>(API_ROUTES.USER.UPDATE, data),
  changeAvatar: async (avatar: string) =>
    await apiClient.put<BaseResponse<IUser>>(API_ROUTES.USER.CHANGE_AVATAR, {
      avatar,
    }),
};

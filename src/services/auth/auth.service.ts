import {API_ROUTES} from '@/constants';
import {LoginFormSchema, RegisterFormSchema} from '@/lib/form-schema';
import {BaseResponse} from '@/utils';
import apiClient from '../api-client';
import {AuthResponse, GetMeResponse} from './auth.dto';

export const authService = {
  login: async (data: LoginFormSchema) =>
    await apiClient.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, data),
  register: async (data: RegisterFormSchema) =>
    await apiClient.post<AuthResponse>(API_ROUTES.AUTH.REGISTER, data),
  getMe: async () => await apiClient.get<GetMeResponse>(API_ROUTES.AUTH.GET_ME),
  logout: async () =>
    await apiClient.post<BaseResponse>(API_ROUTES.AUTH.LOGOUT),
};

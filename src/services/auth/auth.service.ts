import {API_ROUTES} from '@/constants';
import {
  ChangePasswordFormSchema,
  LoginFormSchema,
  RegisterFormSchema,
} from '@/lib/form-schema';
import {BaseResponse} from '@/utils';
import apiClient from '../api-client';
import {AuthResponse, GetMeResponse} from './auth.dto';

export const authService = {
  login: async (data: LoginFormSchema) =>
    await apiClient.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, data),
  googleLogin: async (email: string) =>
    await apiClient.post<AuthResponse>(API_ROUTES.AUTH.GOOGLE_LOGIN, {email}),
  register: async (data: RegisterFormSchema) =>
    await apiClient.post<AuthResponse>(API_ROUTES.AUTH.REGISTER, data),
  getMe: async () => await apiClient.get<GetMeResponse>(API_ROUTES.AUTH.GET_ME),
  logout: async () =>
    await apiClient.post<BaseResponse>(API_ROUTES.AUTH.LOGOUT),
  changePassword: async (data: ChangePasswordFormSchema) =>
    await apiClient.put<BaseResponse>(API_ROUTES.AUTH.CHANGE_PASSWORD, data),
  sendForgotPasswordMail: async (emailOrPhone: string) =>
    await apiClient.post<BaseResponse<string>>(
      API_ROUTES.AUTH.FORGOT_PASSWORD,
      {
        emailOrPhone,
      },
    ),
  validateForgotPassword: async (email: string, code: string) =>
    await apiClient.post<BaseResponse<boolean>>(
      API_ROUTES.AUTH.VALIDATE_FORGOT_PASSWORD,
      {email, code},
    ),
};

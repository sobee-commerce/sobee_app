import {IUser} from '@/lib/interfaces';
import {BaseResponse} from '@/utils';

export type AuthResponse = BaseResponse<{
  accessToken: string;
  refreshToken: string;
  user: IUser;
}>;

export type RefreshTokenResponse = BaseResponse<{
  accessToken: string;
  refreshToken: string;
}>;

export type GetMeResponse = BaseResponse<{user: IUser}>;

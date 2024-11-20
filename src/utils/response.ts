import {IPaginate} from '@/lib/interfaces';

export interface BaseResponse<T = any> extends Partial<IPaginate> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

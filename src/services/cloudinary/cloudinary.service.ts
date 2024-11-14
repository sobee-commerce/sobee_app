import {API_ROUTES} from '@/constants';
import {BaseResponse} from '@/utils';
import apiClient from '../api-client';

export const cloudinaryService = {
  uploadFile: async (data: FormData) => {
    data.append('upload_preset', 'sobee_preset');
    return await apiClient.post<
      BaseResponse<{
        urls: string[];
      }>
    >(API_ROUTES.UPLOAD.UPLOAD_FILE, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

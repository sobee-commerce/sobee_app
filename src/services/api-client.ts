import {APP_CONFIG, STORAGE} from '@/utils';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: APP_CONFIG.API_URL,
  timeout: 60000,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async config => {
    const accessToken = STORAGE.getString(APP_CONFIG.STORAGE_KEY.ACCESS_TOKEN);
    const userId = STORAGE.getString(APP_CONFIG.STORAGE_KEY.USER_ID);

    if (accessToken && userId && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      config.headers['x-client-id'] = userId;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// apiClient.interceptors.response.use(
//   response => {
//     return response;
//   },
//   async error => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest._retry) {
//       const refreshToken = STORAGE.getString(
//         APP_CONFIG.STORAGE_KEY.REFRESH_TOKEN,
//       );
//       originalRequest._retry = true;
//       try {
//         const response = await apiClient.post<RefreshTokenResponse>(
//           API_ROUTES.AUTH.REFRESH_TOKEN,
//           {
//             refreshToken,
//           },
//         );

//         const {refreshToken: newRefreshToken, accessToken: newAccessToken} =
//           response.data.data;

//         STORAGE.set(APP_CONFIG.STORAGE_KEY.ACCESS_TOKEN, newAccessToken);
//         STORAGE.set(APP_CONFIG.STORAGE_KEY.REFRESH_TOKEN, newRefreshToken);

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return apiClient(originalRequest);
//       } catch (err) {
//         STORAGE.delete(APP_CONFIG.STORAGE_KEY.ACCESS_TOKEN);
//         STORAGE.delete(APP_CONFIG.STORAGE_KEY.REFRESH_TOKEN);
//         STORAGE.delete(APP_CONFIG.STORAGE_KEY.USER_ID);
//         navigate('Login');
//       }
//     }

//     return Promise.reject(error);
//   },
// );

export default apiClient;

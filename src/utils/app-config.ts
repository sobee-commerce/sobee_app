import {Dimensions} from 'react-native';

export const APP_NAME = 'Sobee';
export const APP_CONFIG = {
  STORAGE_KEY: {
    IS_FIRST_TIME: `${APP_NAME}:isFirstTime`,
    THEME: `${APP_NAME}:theme`,
    ACCESS_TOKEN: `${APP_NAME}:accessToken`,
    REFRESH_TOKEN: `${APP_NAME}:refreshToken`,
    USER_ID: `${APP_NAME}:userId`,
  },
  API_URL: __DEV__
    ? 'https://2fb1-2402-800-6379-39b0-5cd3-865e-29db-c16c.ngrok-free.app/api'
    : 'https://sobee-be.up.railway.app/api',
  BASE_SOCKET_URL: __DEV__
    ? 'https://2fb1-2402-800-6379-39b0-5cd3-865e-29db-c16c.ngrok-free.app'
    : 'https://sobee-be.up.railway.app',
  SCREEN: {
    WIDTH: Dimensions.get('screen').width,
    HEIGHT: Dimensions.get('screen').height,
  },
};

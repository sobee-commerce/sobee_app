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
    ? 'http://10.0.2.2:8000/api'
    : 'https://sobee-be.up.railway.app/api',
  BASE_SOCKET_URL: __DEV__
    ? 'http://10.0.2.2:8000'
    : 'https://sobee-be.up.railway.app',
  SCREEN: {
    WIDTH: Dimensions.get('screen').width,
    HEIGHT: Dimensions.get('screen').height,
  },
};

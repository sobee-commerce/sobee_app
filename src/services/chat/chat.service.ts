import {API_ROUTES} from '@/constants';
import {IChatRoom} from '@/lib/interfaces';
import {BaseResponse} from '@/utils';
import apiClient from '../api-client';

export const chatService = {
  fetchRoomById: async (roomId: string) =>
    await apiClient.get<BaseResponse<IChatRoom>>(
      API_ROUTES.CHAT.GET_ROOM.replace(':id', roomId),
    ),
};

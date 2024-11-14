import {QUERY_KEY} from '@/constants';
import {useQuery} from '@tanstack/react-query';
import {chatService} from './chat.service';

export const useGetRoomByIdQuery = (roomId: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.CHAT.GET_ROOM, roomId],
    queryFn: async () => {
      const res = await chatService.fetchRoomById(roomId);
      return res.data;
    },
  });
};

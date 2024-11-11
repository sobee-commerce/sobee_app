import {SOCKET_CLIENT_MESSAGE, SOCKET_SERVER_MESSAGE} from '@/constants';
import {IChatMessage, IChatRoom} from '@/lib/interfaces';
import {BaseResponse} from '@/utils';
import {useState} from 'react';
import {useSocket} from './useSocket';

type MessageAndRoom = {
  chatRoomId: string;
  message: IChatMessage;
};

export const useChatRoomSocket = () => {
  const [data, setData] = useState<IChatRoom[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const socket = useSocket(socket => {
    socket.emit(SOCKET_CLIENT_MESSAGE.VIEW_USER_CHAT_ROOM);

    socket.on(
      SOCKET_SERVER_MESSAGE.USER_CHAT_ROOM_RESULT,
      (res: BaseResponse<IChatRoom[]>) => {
        setData(res.data);
        setIsLoading(false);
      },
    );

    socket.on(SOCKET_SERVER_MESSAGE.ERROR, (err: Error) => {
      setError(err.message);
      setIsLoading(false);
    });

    socket.on(
      SOCKET_SERVER_MESSAGE.NEW_CHAT_MESSAGE,
      (room: MessageAndRoom) => {
        setData(prev => {
          const index = prev.findIndex(r => r._id === room.chatRoomId);
          if (index !== -1) {
            const newRoom = {
              ...prev[index],
              messages: [...prev[index].messages, room.message],
            };
            return [...prev.slice(0, index), newRoom, ...prev.slice(index + 1)];
          }
          return prev;
        });
        socket.emit(SOCKET_CLIENT_MESSAGE.VIEW_USER_CHAT_ROOM);
        socket.emit(SOCKET_CLIENT_MESSAGE.VIEW_LIST_ROOM_CHAT);
      },
    );
  }, []);

  return {data, error, isError: !!error, isLoading};
};
import {SOCKET_CLIENT_MESSAGE, SOCKET_SERVER_MESSAGE} from '@/constants';
import {IChatRoom} from '@/lib/interfaces';
import {BaseResponse} from '@/utils';
import {useState} from 'react';
import {useSocket} from './useSocket';

export const useCreateChatRoomSocket = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<IChatRoom | null>(null);

  const socket = useSocket(socket => {
    socket.on(
      SOCKET_SERVER_MESSAGE.CREATE_CHAT_RESULT,
      (room: BaseResponse<IChatRoom>) => {
        console.log('Chat room created');
        setIsLoading(false);
        setIsSuccess(true);
        setData(room.data);
        socket.emit(SOCKET_CLIENT_MESSAGE.VIEW_USER_CHAT_ROOM);
        socket.emit(SOCKET_CLIENT_MESSAGE.VIEW_LIST_ROOM_CHAT);
      },
    );

    socket.on(SOCKET_SERVER_MESSAGE.ERROR, (err: Error) => {
      console.log(err);
      setIsLoading(false);
      setError(err.message);
    });
  });

  const createRoom = (orderId: string) => {
    setIsLoading(true);
    console.log('Creating chat room');
    socket?.emit(SOCKET_CLIENT_MESSAGE.CREATE_CHAT, {
      orderId,
    });
  };

  return {data, isSuccess, error, isError: !!error, isLoading, createRoom};
};

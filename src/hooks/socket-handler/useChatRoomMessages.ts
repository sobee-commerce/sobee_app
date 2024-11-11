import {SOCKET_CLIENT_MESSAGE, SOCKET_SERVER_MESSAGE} from '@/constants';
import {IChatMessage, IChatRoom} from '@/lib/interfaces';
import {BaseResponse} from '@/utils';
import {useState} from 'react';
import {useSocket} from './useSocket';

type MessageAndRoom = {
  chatRoomId: string;
  message: IChatMessage;
};
export const useChatRoomMessages = (roomId: string) => {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const socket = useSocket(socket => {
    socket.emit(SOCKET_CLIENT_MESSAGE.VIEW_ROOM_CHAT, {chatRoomId: roomId});
    socket.on(
      SOCKET_SERVER_MESSAGE.VIEW_ROOM_CHAT_RESULT,
      (data: BaseResponse<IChatRoom>) => {
        setMessages(data.data.messages);
        setIsLoading(false);
      },
    );

    socket.on(
      SOCKET_SERVER_MESSAGE.CREATE_CHAT_MESSAGE_RESULT,
      (message: BaseResponse<IChatMessage>) => {
        setMessages(prev => [...prev, message.data!]);
      },
    );

    socket.on(
      SOCKET_SERVER_MESSAGE.NEW_CHAT_MESSAGE,
      (room: MessageAndRoom) => {
        if (room.chatRoomId === roomId) {
          setMessages(prev => [...prev, room.message]);
        }
      },
    );

    socket.on(SOCKET_SERVER_MESSAGE.ERROR, (err: Error) => {
      setIsLoading(false);
      setError(err.message);
    });
  });

  return {messages, error, isLoading, isError: !!error};
};

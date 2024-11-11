'use client';

import {useSocketContext} from '@/context';
import {APP_CONFIG, STORAGE} from '@/utils';
import {useEffect} from 'react';
import {Socket, io} from 'socket.io-client';

export const useSocket = (
  onConnect?: (socket: Socket) => void,
  dependencies: string[] = [],
) => {
  const accessToken = STORAGE.getString(APP_CONFIG.STORAGE_KEY.ACCESS_TOKEN);
  const userId = STORAGE.getString(APP_CONFIG.STORAGE_KEY.USER_ID);
  const {socket, setSocket} = useSocketContext();
  useEffect(() => {
    if (socket && socket.connected) {
      return;
    }
    let _socket: Socket;
    if (!accessToken || !userId) return;
    _socket = io(APP_CONFIG.BASE_SOCKET_URL!, {
      extraHeaders: {
        client: userId,
        token: accessToken,
      },
    });

    _socket.on('connect', () => {
      setSocket(_socket);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, socket, userId, ...dependencies]);

  useEffect(() => {
    if (socket) {
      onConnect?.(socket);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!socket]);

  return socket;
};

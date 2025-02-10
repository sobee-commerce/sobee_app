import {useMutation} from '@tanstack/react-query';
import {notificationService} from './notification.service';

export const useSaveFCMTokenMutation = () => {
  return useMutation({
    mutationFn: async (token: string) =>
      await notificationService.saveToken(token),
  });
};

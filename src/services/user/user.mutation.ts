import {QUERY_KEY} from '@/constants';
import {UpdateUserFormSchema} from '@/lib/form-schema';
import {IUser} from '@/lib/interfaces';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {userService} from './user.service';

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateUserFormSchema) => {
      const res = await userService.updateUser(data);
      if (res.data.success) {
        queryClient.setQueryData([QUERY_KEY.AUTH.GET_ME], res.data.data);
      }
      return res.data;
    },
  });
};

export const useChangeAvatarMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (avatar: string) => {
      const res = await userService.changeAvatar(avatar);
      if (res.data.success) {
        queryClient.setQueryData([QUERY_KEY.AUTH.GET_ME], (oldData: IUser) => ({
          ...oldData,
          avatar,
        }));
      }
      return res.data;
    },
  });
};

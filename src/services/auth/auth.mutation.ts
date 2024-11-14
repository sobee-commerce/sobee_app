import {QUERY_KEY} from '@/constants';
import {LoginFormSchema, RegisterFormSchema} from '@/lib/form-schema';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {authService} from './auth.service';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (data: LoginFormSchema) => {
      const res = await authService.login(data);
      return res.data;
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (data: RegisterFormSchema) => {
      const res = await authService.register(data);
      return res.data;
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await authService.logout();
      if (res.data.success) {
        queryClient.setQueryData([QUERY_KEY.AUTH.GET_ME], null);
      }
    },
  });
};

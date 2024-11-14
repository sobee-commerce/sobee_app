import {QUERY_KEY} from '@/constants';
import {CreateCardFormSchema} from '@/lib/form-schema';
import {ICard} from '@/lib/interfaces';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {cardService} from './card.service';

export const useCreateCardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCardFormSchema) => {
      const res = await cardService.createCard(data);
      if (res.data.success) {
        queryClient.setQueryData(
          [QUERY_KEY.CARD.GET_ALL],
          (oldData: ICard[]) => [...oldData, res.data.data],
        );
      }
      return res.data;
    },
  });
};

export const useDeleteCardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await cardService.deleteCard(id);
      if (res.data.success) {
        queryClient.setQueryData([QUERY_KEY.CARD.GET_ALL], (oldData: ICard[]) =>
          oldData.filter(item => item._id !== id),
        );
      }
      return res.data;
    },
  });
};

export const useSetDefaultCardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await cardService.setDefaultCard(id);
      if (res.data.success) {
        queryClient.setQueryData(
          [QUERY_KEY.CARD.GET_ALL],
          (oldData: ICard[]) => {
            const index = oldData.findIndex(item => item._id === id);
            oldData.forEach(item => {
              item.isDefault = false;
            });
            oldData[index].isDefault = true;
            return [...oldData];
          },
        );
      }
      return res.data;
    },
  });
};

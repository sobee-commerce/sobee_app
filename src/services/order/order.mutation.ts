import {QUERY_KEY} from '@/constants';
import {
  CreateOrderFormSchema,
  CreateOrderItemFormSchema,
  UpdateOrderItemQuantityFormSchema,
} from '@/lib/form-schema';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {orderService} from './order.service';

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (order: CreateOrderFormSchema) => {
      const res = await orderService.createOrder(order);
      if (res.data.success) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.ORDER.GET_ALL],
          }),
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.ORDER.GET_ITEMS],
          }),
        ]);
      }
      return res.data;
    },
  });
};

export const useCreateOrderItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateOrderItemFormSchema) => {
      const res = await orderService.createOrderItem(data);
      if (res.data.success) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.ORDER.GET_ITEMS],
        });
      }
      return res.data;
    },
  });
};

export const useRemoveOrderItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await orderService.removeOrderItem(id);
      if (res.data.success) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.ORDER.GET_ITEMS],
        });
      }
      return res.data;
    },
  });
};

export const useUpdateOrderItemQuantityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateOrderItemQuantityFormSchema) => {
      const res = await orderService.updateOrderItemQuantity(
        data._id,
        data.quantity,
      );
      if (res.data.success) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.ORDER.GET_ITEMS],
        });
      }
      return res.data;
    },
  });
};

export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await orderService.cancelOrder(id);
      if (res.data.success) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.ORDER.GET_ALL],
        });
      }
      return res.data;
    },
  });
};

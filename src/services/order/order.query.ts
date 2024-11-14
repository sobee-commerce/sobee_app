import {QUERY_KEY} from '@/constants';
import {useQuery} from '@tanstack/react-query';
import {orderService} from './order.service';

export const useGetOrdersQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.ORDER.GET_ALL],
    queryFn: async () => {
      const res = await orderService.getOrders();
      return res.data;
    },
  });
};

export const useGetOrderByIdQuery = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.ORDER.GET_BY_ID, id],
    queryFn: async () => {
      const res = await orderService.getOrderById(id);
      return res.data;
    },
  });
};

export const useGetOrderItemsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.ORDER.GET_ITEMS],
    queryFn: async () => {
      const res = await orderService.getOrderItems();
      return res.data;
    },
  });
};

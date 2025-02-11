import {API_ROUTES} from '@/constants';
import {
  CreateOrderFormSchema,
  CreateOrderItemFormSchema,
} from '@/lib/form-schema';
import {IOrder, IOrderItem} from '@/lib/interfaces';
import {BaseResponse} from '@/utils';
import apiClient from '../api-client';

export const orderService = {
  createOrder: async (data: CreateOrderFormSchema) =>
    await apiClient.post<BaseResponse<IOrder>>(API_ROUTES.ORDER.CREATE, data),
  getOrders: async (query?: any) =>
    await apiClient.get<BaseResponse<IOrder[]>>(API_ROUTES.ORDER.GET_ORDERS, {
      params: query,
    }),
  getOrderById: async (id: string) =>
    await apiClient.get<BaseResponse<IOrder>>(
      API_ROUTES.ORDER.GET_ORDER.replace(':id', id),
    ),
  createOrderItem: async (data: CreateOrderItemFormSchema) =>
    await apiClient.post<BaseResponse<IOrderItem>>(
      API_ROUTES.ORDER.ADD_ORDER_ITEM,
      data,
    ),
  receiveOrder: async (id: string) =>
    await apiClient.put(API_ROUTES.ORDER.RECEIVE_ORDER.replace(':id', id)),
  updateOrderItemQuantity: async (id: string, quantity: number) =>
    await apiClient.put<BaseResponse<IOrderItem>>(
      API_ROUTES.ORDER.UPDATE_ORDER_ITEM_QUANTITY.replace(':id', id),
      {quantity},
    ),
  removeOrderItem: async (id: string) =>
    await apiClient.delete(
      API_ROUTES.ORDER.DELETE_ORDER_ITEM.replace(':id', id),
    ),
  getOrderItems: async () =>
    await apiClient.get<BaseResponse<IOrderItem[]>>(
      API_ROUTES.ORDER.GET_ORDER_ITEMS,
    ),
  cancelOrder: async (id: string) =>
    await apiClient.delete<BaseResponse<IOrder>>(
      API_ROUTES.ORDER.CANCEL_ORDER.replace(':id', id),
    ),
  fetchPaymentSheetParams: async (amount: number) =>
    await apiClient.get<
      BaseResponse<{
        paymentIntent: string;
        ephemeralKey: string;
        customer: string;
        publishableKey: string;
      }>
    >(API_ROUTES.ORDER.PAY, {
      params: {amount},
    }),
};

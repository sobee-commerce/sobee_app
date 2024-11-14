import {API_ROUTES} from '@/constants';
import {
  CreateAddressFormSchema,
  UpdateAddressFormSchema,
} from '@/lib/form-schema';
import {IAddress} from '@/lib/interfaces';
import {BaseResponse} from '@/utils';
import apiClient from '../api-client';

export const addressService = {
  getUserAddresses: async () =>
    await apiClient.get<BaseResponse<IAddress[]>>(
      API_ROUTES.ADDRESS.GET_ADDRESSES,
    ),
  createAddress: async (data: CreateAddressFormSchema) =>
    await apiClient.post<BaseResponse<IAddress>>(
      API_ROUTES.ADDRESS.CREATE,
      data,
    ),
  updateAddress: async (id: string, data: UpdateAddressFormSchema) =>
    await apiClient.put<BaseResponse<IAddress>>(
      API_ROUTES.ADDRESS.UPDATE.replace(':id', id),
      data,
    ),
  deleteAddress: async (id: string) =>
    await apiClient.delete(
      API_ROUTES.ADDRESS.DELETE_ADDRESS.replace(':id', id).replace(':id', id),
    ),
  setDefaultAddress: async (id: string) =>
    await apiClient.put<BaseResponse<IAddress>>(
      API_ROUTES.ADDRESS.SET_DEFAULT,
      {
        addressId: id,
      },
    ),
};

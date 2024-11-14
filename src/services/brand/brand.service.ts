import {API_ROUTES} from '@/constants';
import {IBrand, IProduct} from '@/lib/interfaces';
import {BaseResponse} from '@/utils';
import apiClient from '../api-client';

export const brandService = {
  getAllBrands: async () =>
    await apiClient.get<BaseResponse<IBrand[]>>(API_ROUTES.BRAND.GET_BRANDS),
  getBrandById: async (id: string) =>
    await apiClient.get<BaseResponse<IProduct[]>>(
      API_ROUTES.BRAND.GET_BRAND.replace(':id', id),
    ),
  getBrandyWithProducts: async () =>
    await apiClient.get<
      BaseResponse<
        {
          _id: string;
          name: string;
          products: IProduct[];
        }[]
      >
    >(API_ROUTES.BRAND.GET_BRANDIES_WITH_PRODUCTS),
};

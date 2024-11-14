import {API_ROUTES} from '@/constants';
import {ICategory, IProduct} from '@/lib/interfaces';
import {BaseResponse} from '@/utils';
import apiClient from '../api-client';

export const categoryService = {
  getAllCategories: async () =>
    await apiClient.get<BaseResponse<ICategory[]>>(
      API_ROUTES.CATEGORY.GET_CATEGORIES,
    ),
  getCategoryById: async (id: string) =>
    await apiClient.get<BaseResponse<IProduct[]>>(
      API_ROUTES.CATEGORY.GET_CATEGORY.replace(':id', id),
    ),
  getCategoryWithProducts: async () =>
    await apiClient.get<
      BaseResponse<
        {
          _id: string;
          name: string;
          slug: string;
          products: IProduct[];
        }[]
      >
    >(API_ROUTES.CATEGORY.GET_CATEGORIES_WITH_PRODUCTS),
};

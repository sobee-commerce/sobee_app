import {API_ROUTES} from '@/constants';
import {IProduct} from '@/lib/interfaces';
import {BaseResponse} from '@/utils';
import apiClient from '../api-client';

export const productService = {
  getProducts: async (query?: any) =>
    await apiClient.get<BaseResponse<IProduct[]>>(
      API_ROUTES.PRODUCT.GET_PUBLISHED_PRODUCTS + (query ? `?${query}` : ''),
    ),
  getProduct: async (id: string) =>
    await apiClient.get<BaseResponse<IProduct>>(
      API_ROUTES.PRODUCT.GET_PRODUCT.replace(':id', id),
    ),
  getFeaturedProducts: async () =>
    await apiClient.get<BaseResponse<IProduct[]>>(
      API_ROUTES.PRODUCT.GET_FEATURED_PRODUCTS,
    ),
  getBestSellerProducts: async () =>
    await apiClient.get<BaseResponse<IProduct[]>>(
      API_ROUTES.PRODUCT.GET_BEST_SELLER_PRODUCTS,
    ),

  getDiscountedProducts: async () =>
    await apiClient.get<BaseResponse<IProduct[]>>(
      API_ROUTES.PRODUCT.GET_DISCOUNT_PRODUCTS,
    ),
  getPopularProducts: async () =>
    await apiClient.get<BaseResponse<IProduct[]>>(
      API_ROUTES.PRODUCT.GET_POPULAR_PRODUCTS,
    ),
  getRelatedProducts: async (id: string) =>
    await apiClient.get<BaseResponse<IProduct[]>>(
      API_ROUTES.PRODUCT.GET_RELATED_PRODUCTS.replace(':id', id),
    ),
  getRecommendedProducts: async (id: string) =>
    await apiClient.get<BaseResponse<IProduct[]>>(
      API_ROUTES.PRODUCT.GET_RECOMMEND_PRODUCTS.replace(':id', id),
    ),
  getFavoriteProducts: async () =>
    await apiClient.get<BaseResponse<IProduct[]>>(
      API_ROUTES.PRODUCT.GET_CUSTOMER_FAVORITE_PRODUCTS,
    ),
  toggleFavoriteProduct: async (id: string) =>
    await apiClient.put<BaseResponse<IProduct>>(
      API_ROUTES.PRODUCT.TOGGLE_FAVORITE_PRODUCT.replace(':id', id),
      {},
    ),
  getProductColors: async () =>
    await apiClient.get<BaseResponse<string[]>>(API_ROUTES.PRODUCT.GET_COLORS),
};

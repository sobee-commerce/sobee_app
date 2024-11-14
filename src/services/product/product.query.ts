import {QUERY_KEY} from '@/constants';
import {useQuery} from '@tanstack/react-query';
import {productService} from './product.service';

export const useGetProductsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCT.GET_ALL],
    queryFn: async () => {
      const res = await productService.getProducts();
      return res.data;
    },
  });
};

export const useGetProductByIdQuery = (productId: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCT.GET_BY_ID, productId],
    queryFn: async () => {
      const res = await productService.getProduct(productId);
      return res.data;
    },
  });
};

export const useGetFavoriteProductsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCT.GET_FAVORITE],
    queryFn: async () => {
      const res = await productService.getFavoriteProducts();
      return res.data;
    },
  });
};

export const useGetFeaturedProductsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCT.GET_FEATURED],
    queryFn: async () => {
      const res = await productService.getFeaturedProducts();
      return res.data;
    },
  });
};

export const useGetBestSellerProductsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCT.GET_BEST_SELLER],
    queryFn: async () => {
      const res = await productService.getBestSellerProducts();
      return res.data;
    },
  });
};

export const useGetDiscountedProductsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCT.GET_DISCOUNT],
    queryFn: async () => {
      const res = await productService.getDiscountedProducts();
      return res.data;
    },
  });
};

export const useGetPopularProductsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCT.GET_POPULAR],
    queryFn: async () => {
      const res = await productService.getPopularProducts();
      return res.data;
    },
  });
};

export const useGetRelatedProductsQuery = (productId: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCT.GET_RELATE, productId],
    queryFn: async () => {
      const res = await productService.getRelatedProducts(productId);
      return res.data;
    },
  });
};

export const useGetRecommendedProductsQuery = (productId: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCT.GET_RECOMMEND, productId],
    queryFn: async () => {
      const res = await productService.getRecommendedProducts(productId);
      return res.data;
    },
  });
};

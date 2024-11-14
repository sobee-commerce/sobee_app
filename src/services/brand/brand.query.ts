import {QUERY_KEY} from '@/constants';
import {useQuery} from '@tanstack/react-query';
import {brandService} from './brand.service';

export const useGetBrandsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.BRAND.GET_ALL],
    queryFn: async () => {
      const res = await brandService.getAllBrands();
      return res.data;
    },
  });
};

export const useGetBrandByIdQuery = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.BRAND.GET_BY_ID, id],
    queryFn: async () => {
      const res = await brandService.getBrandById(id);
      return res.data;
    },
  });
};

export const useGetBrandWithProductsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.BRAND.GET_BRANDIES_WITH_PRODUCTS],
    queryFn: async () => {
      const res = await brandService.getBrandyWithProducts();
      return res.data;
    },
  });
};

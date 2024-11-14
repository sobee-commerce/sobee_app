import {QUERY_KEY} from '@/constants';
import {useQuery} from '@tanstack/react-query';
import {categoryService} from './category.service';

export const useGetCategoriesQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.CATEGORY.GET_ALL],
    queryFn: async () => {
      const res = await categoryService.getAllCategories();
      return res.data;
    },
  });
};

export const useGetCategoryByIdQuery = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.CATEGORY.GET_BY_ID, id],
    queryFn: async () => {
      const res = await categoryService.getCategoryById(id);
      return res.data;
    },
  });
};

export const useGetCategoriesWithProductsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEY.CATEGORY.GET_WITH_PRODUCTS],
    queryFn: async () => {
      const res = await categoryService.getCategoryWithProducts();
      return res.data;
    },
  });
};

import {QUERY_KEY} from '@/constants';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {productService} from './product.service';

export const useToggleFavoriteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await productService.toggleFavoriteProduct(productId);
      if (res.data.success) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.PRODUCT.GET_FAVORITE],
        });
      }
      return res.data;
    },
  });
};

import {ProductCard} from '@/components/card';
import {LabelItemList} from '@/components/common';
import {useGetFavoriteProductsQuery} from '@/services';
import {APP_CONFIG} from '@/utils';
import {useMemo} from 'react';

const FavoriteScreen = () => {
  const {data, isLoading} = useGetFavoriteProductsQuery();
  const products = useMemo(() => data?.data || [], [data]);
  return (
    <LabelItemList
      isLoading={isLoading}
      data={products}
      label="Favorite Products"
      renderItem={({item}) => (
        <ProductCard
          product={item}
          style={{
            width: APP_CONFIG.SCREEN.WIDTH / 2 - 26,
          }}
        />
      )}
      style={{padding: 20}}
      listProps={{
        numColumns: 2,
        scrollEnabled: false,
        columnWrapperStyle: {gap: 12},
        contentContainerStyle: {gap: 12},
        style: {gap: 12},
      }}
    />
  );
};

export default FavoriteScreen;

import {ProductCard} from '@/components/card';
import {LabelItemList} from '@/components/common';
import {useGetBrandWithProductsQuery} from '@/services';
import {ApplicationScreenProps} from '@/types';
import {useMemo} from 'react';
import {ActivityIndicator, ScrollView} from 'react-native';

const BrandScreen = ({navigation}: ApplicationScreenProps<'Brand'>) => {
  const {isLoading, isError, data} = useGetBrandWithProductsQuery();
  const brandWithProducts = useMemo(() => data?.data || [], [data]);
  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{padding: 20, gap: 20}}
      showsVerticalScrollIndicator={false}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        brandWithProducts.map(({name, products, _id}) => (
          <LabelItemList
            isError={isError}
            key={_id}
            isLoading={isLoading}
            data={products}
            label={name}
            showNavigation
            onPressNavigation={() =>
              navigation.navigate('BrandDetail', {brandId: _id, name})
            }
            renderItem={({item}) => (
              <ProductCard
                product={item}
                style={{
                  width: 160,
                }}
              />
            )}
            listProps={{
              horizontal: true,
            }}
          />
        ))
      )}
    </ScrollView>
  );
};

export default BrandScreen;

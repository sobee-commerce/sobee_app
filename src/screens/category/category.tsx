import {ProductCard} from '@/components/card';
import {LabelItemList} from '@/components/common';
import {useGetCategoriesWithProductsQuery} from '@/services';
import {ApplicationScreenProps} from '@/types';
import {useMemo} from 'react';
import {ActivityIndicator, ScrollView} from 'react-native';

const CategoryScreen = ({navigation}: ApplicationScreenProps<'Category'>) => {
  const {isLoading, isError, data} = useGetCategoriesWithProductsQuery();
  const categoryWithProducts = useMemo(() => data?.data || [], [data]);
  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{padding: 20, gap: 20}}
      showsVerticalScrollIndicator={false}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        categoryWithProducts.map(({name, products, _id, slug}) => (
          <LabelItemList
            isError={isError}
            key={_id}
            isLoading={isLoading}
            data={products}
            label={name}
            showNavigation
            onPressNavigation={() =>
              navigation.navigate('CategoryDetail', {categoryId: slug, name})
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

export default CategoryScreen;

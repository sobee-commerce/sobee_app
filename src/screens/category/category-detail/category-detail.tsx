import {ProductCard} from '@/components/card';
import {LabelItemList} from '@/components/common';
import {useGetCategoryByIdQuery} from '@/services';
import {ApplicationScreenProps} from '@/types';
import {APP_CONFIG} from '@/utils';
import React, {useEffect, useMemo} from 'react';
import {ScrollView} from 'react-native';

const CategoryDetailScreen = ({
  navigation,
  route,
}: ApplicationScreenProps<'CategoryDetail'>) => {
  const {categoryId, name} = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: name,
    });
  }, [name, navigation]);

  const {data, isLoading, isError} = useGetCategoryByIdQuery(categoryId);

  const products = useMemo(() => data?.data || [], [data]);

  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{padding: 20, gap: 20}}
      showsVerticalScrollIndicator={false}>
      <LabelItemList
        isLoading={isLoading}
        isError={isError}
        label={`All products of ${name} category`}
        data={products}
        renderItem={({item}) => (
          <ProductCard
            product={item}
            style={{
              width: APP_CONFIG.SCREEN.WIDTH / 2 - 26,
            }}
          />
        )}
        listProps={{
          numColumns: 2,
          columnWrapperStyle: {gap: 12},
          scrollEnabled: false,
        }}
      />
    </ScrollView>
  );
};

export default CategoryDetailScreen;

import {CategoryCard} from '@/components/card';
import {useTheme} from '@/context';
import {useGetCategoriesQuery} from '@/services';
import {TYPOGRAPHY} from '@/theme';
import React from 'react';
import {FlatList, Text, View} from 'react-native';

const CategoryList = () => {
  const {colors} = useTheme();
  const {isLoading, isError, isSuccess, data} = useGetCategoriesQuery();
  return (
    <View style={{gap: 8}}>
      <Text
        style={[
          TYPOGRAPHY.h6,
          {
            color: colors.layout.foreground,
          },
        ]}>
        Categories
      </Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{gap: 12}}
        data={data?.data || []}
        keyExtractor={item => item._id!}
        renderItem={({item}) => <CategoryCard category={item} />}
      />
    </View>
  );
};

export default CategoryList;

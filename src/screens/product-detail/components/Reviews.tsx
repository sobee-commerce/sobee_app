import {ReviewCard} from '@/components/card';
import {useTheme} from '@/context';
import {useGetProductReviewsQuery} from '@/services';
import {TYPOGRAPHY} from '@/theme';
import {ApplicationNavigationProps} from '@/types';
import {useNavigation} from '@react-navigation/native';
import {ChevronRight} from 'lucide-react-native';
import React from 'react';
import {ActivityIndicator, FlatList, Pressable, Text, View} from 'react-native';

type Props = {
  productId: string;
};

const Reviews = ({productId}: Props) => {
  const {colors} = useTheme();
  const navigation = useNavigation<ApplicationNavigationProps>();
  const {data, isLoading} = useGetProductReviewsQuery(productId);
  const reviews = data?.data || [];

  return (
    <View
      style={{
        marginTop: 20,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={[
            TYPOGRAPHY.h6,
            {
              color: colors.layout.foreground,
            },
          ]}>
          Reviews ({reviews.length})
        </Text>
        <Pressable
          onPress={() => navigation.navigate('ProductReview', {productId})}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}>
          <Text
            style={[
              TYPOGRAPHY.body2,
              {
                color: colors.base.primary,
              },
            ]}>
            See all
          </Text>
          <ChevronRight size={20} color={colors.base.primary} />
        </Pressable>
      </View>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          ListEmptyComponent={() => (
            <Text
              style={{
                ...TYPOGRAPHY.body1,
                color: colors.layout.foreground,
                textAlign: 'center',
              }}>
              No questions yet
            </Text>
          )}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          data={reviews}
          contentContainerStyle={{gap: 12, marginTop: 12}}
          keyExtractor={item => item._id!}
          renderItem={({item}) => <ReviewCard review={item} />}
        />
      )}
    </View>
  );
};

export default Reviews;

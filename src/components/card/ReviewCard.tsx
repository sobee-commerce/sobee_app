import {useTheme} from '@/context';
import {IReview, IUser} from '@/lib/interfaces';
import {FONT_FAMILY} from '@/theme';
import {format} from 'date-fns';
import React from 'react';
import {FlatList, Image, Text, View} from 'react-native';
import {AirbnbRating} from 'react-native-ratings';

type Props = {
  review: IReview;
};

const ReviewCard = ({review}: Props) => {
  const {colors} = useTheme();
  const customer = review.customer as IUser;

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 12,
      }}>
      <Image
        source={{uri: customer.avatar}}
        style={{width: 30, height: 30, borderRadius: 20}}
        resizeMode="contain"
      />
      <View style={{gap: 4, flex: 1}}>
        <Text
          style={{
            fontFamily: FONT_FAMILY.medium,
            fontSize: 14,
            color: colors.layout.foreground,
          }}>
          {customer.name}
        </Text>
        <Text
          style={{
            fontFamily: FONT_FAMILY.regular,
            fontSize: 12,
            color: colors.layout.foreground,
          }}>
          {format(review.createdAt!, "dd/MM/yyyy 'at' hh:mm aaa")}
        </Text>
        <AirbnbRating
          defaultRating={review.rating}
          showRating={false}
          size={14}
          starContainerStyle={{
            alignSelf: 'flex-start',
            paddingHorizontal: 0,
            marginHorizontal: 0,
          }}
        />
        <Text
          style={{
            fontFamily: FONT_FAMILY.regular,
            fontSize: 16,
            color: colors.layout.foreground,
          }}>
          {review.content}
        </Text>
        <FlatList
          data={review.assets}
          horizontal
          contentContainerStyle={{gap: 4}}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <Image
              source={{uri: item}}
              style={{
                width: 80,
                height: 80,
                borderRadius: 8,
                marginVertical: 8,
              }}
              resizeMode="contain"
            />
          )}
        />
      </View>
    </View>
  );
};

export default ReviewCard;

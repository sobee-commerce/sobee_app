import {useTheme} from '@/context';
import {IBrand} from '@/lib/interfaces';
import {TYPOGRAPHY} from '@/theme';
import {ApplicationNavigationProps} from '@/types';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, Pressable, Text} from 'react-native';

type BrandCardProps = {
  brand: IBrand;
};

const BrandCard = ({brand}: BrandCardProps) => {
  const {colors} = useTheme();
  const navigation = useNavigation<ApplicationNavigationProps>();

  const onPress = () => {
    navigation.navigate('BrandDetail', {brandId: brand._id!, name: brand.name});
  };
  return (
    <Pressable
      onPress={onPress}
      style={{
        padding: 10,
        borderWidth: 0.5,
        borderColor: colors.default.default200,
        borderRadius: 8,
        gap: 8,
      }}>
      <Image
        source={{uri: brand.logo!}}
        style={{
          width: 60,
          height: 60,
          alignSelf: 'center',
          borderRadius: 30,
        }}
        resizeMode="cover"
      />
      <Text
        style={[
          TYPOGRAPHY.body2,
          {
            color: colors.layout.foreground,
            textAlign: 'center',
          },
        ]}>
        {brand.name}
      </Text>
    </Pressable>
  );
};

export default BrandCard;

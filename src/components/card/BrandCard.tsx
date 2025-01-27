import {useTheme} from '@/context';
import {IBrand} from '@/lib/interfaces';
import {TYPOGRAPHY} from '@/theme';
import {ApplicationNavigationProps} from '@/types';
import {optimizeImageSrc} from '@/utils/image';
import {useNavigation} from '@react-navigation/native';
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
        width: 100,
      }}>
      <Image
        source={{uri: optimizeImageSrc(brand.logo!, 60, 60)}}
        style={{
          width: 60,
          height: 60,
          alignSelf: 'center',
          borderRadius: 30,
        }}
        resizeMode="cover"
      />
      <Text
        numberOfLines={1}
        style={[
          TYPOGRAPHY.body2,
          {
            color: colors.layout.foreground,
            textAlign: 'center',
            fontSize: 12,
          },
        ]}>
        {brand.name}
      </Text>
    </Pressable>
  );
};

export default BrandCard;

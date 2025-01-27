import {useTheme} from '@/context';
import {ICategory} from '@/lib/interfaces';
import {TYPOGRAPHY} from '@/theme';
import {ApplicationNavigationProps} from '@/types';
import {optimizeImageSrc} from '@/utils/image';
import {useNavigation} from '@react-navigation/native';
import {Image, Pressable, Text} from 'react-native';

type CategoryCardProps = {
  category: ICategory;
};

const CategoryCard = ({category}: CategoryCardProps) => {
  const {colors} = useTheme();
  const navigation = useNavigation<ApplicationNavigationProps>();

  const onPress = () => {
    navigation.navigate('CategoryDetail', {
      categoryId: category.slug!,
      name: category.name,
    });
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
        source={{uri: optimizeImageSrc(category.image!, 80, 80)}}
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
        {category.name}
      </Text>
    </Pressable>
  );
};

export default CategoryCard;

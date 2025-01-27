import {ProductCard} from '@/components/card';
import {LabelItemList} from '@/components/common';
import {useTheme} from '@/context';
import {useGetBrandByIdQuery} from '@/services';
import {ApplicationScreenProps} from '@/types';
import {APP_CONFIG} from '@/utils';
import {useEffect, useMemo} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const BrandDetailScreen = ({
  navigation,
  route,
}: ApplicationScreenProps<'BrandDetail'>) => {
  const {brandId, name} = route.params;
  const {colors} = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: name,
      headerTitleAlign: 'center',
    });
  }, [name, navigation, brandId]);

  const {data, isLoading, isError} = useGetBrandByIdQuery(brandId);

  const products = useMemo(() => data?.data || [], [data]);

  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{gap: 20}}
      showsVerticalScrollIndicator={false}>
      <LinearGradient
        style={{
          height: 160,
          width: '100%',
          justifyContent: 'flex-end',
          display: 'none',
        }}
        colors={[colors.base.primary, colors.primary.primary600]}>
        {/* <View
          style={StyleSheet.flatten([
            {
              borderColor: colors.default.default200,
              backgroundColor: colors.layout.background,
            },
            styles.card,
          ])}>
          <Image
            source={{uri: brand?.logo ?? DEFAULT_IMAGE}}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              borderWidth: 4,
              borderColor: colors.default.default100,
            }}
          />
          <View style={{flex: 1, justifyContent: 'space-between', gap: 8}}>
            <Text
              style={[
                TYPOGRAPHY.h5,
                {
                  color: colors.layout.foreground,
                },
              ]}>
              {brand?.name || 'N/A'}
            </Text>
            <Text
              style={[
                TYPOGRAPHY.body2,
                {
                  color: brand?.isActive
                    ? colors.base.success
                    : colors.base.danger,
                },
              ]}>
              {brand?.isActive ? 'Active' : 'Inactive'}
            </Text>
            <Text
              style={[
                TYPOGRAPHY.body2,
                {
                  color: colors.layout.foreground,
                },
              ]}>
              {products.length} products
            </Text>
            {brand?.website && (
              <Button
                onPress={() => Linking.openURL(brand?.website)}
                radius="full"
                size="sm"
                color="secondary"
                endContent={<ExternalLink size={20} color={colors.white} />}>
                <Text
                  style={[
                    TYPOGRAPHY.button,
                    {
                      color: colors.white,
                    },
                  ]}>
                  Visit
                </Text>
              </Button>
            )}
          </View>
        </View> */}
      </LinearGradient>
      <LabelItemList
        style={{padding: 20}}
        isLoading={isLoading}
        isError={isError}
        label={`All products of ${name} brand`}
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

export default BrandDetailScreen;

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: -50,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 2,
    zIndex: 1,
    left: 20,
    right: 20,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
});

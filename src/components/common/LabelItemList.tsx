import {useTheme} from '@/context';
import {TYPOGRAPHY} from '@/theme';
import {ChevronRight} from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  ListRenderItem,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

type LabelItemListProps<T> = {
  data: T[];
  renderItem: ListRenderItem<T>;
  label: string | React.ReactNode;
  showNavigation?: boolean;
  onPressNavigation?: () => void;
  listProps?: Omit<FlatListProps<T>, 'data' | 'renderItem'>;
  isLoading?: boolean;
  isError?: boolean;
  style?: StyleProp<ViewStyle>;
};

const LabelItemList = <T = any,>({
  label,
  data,
  renderItem,
  onPressNavigation = () => {},
  showNavigation = false,
  listProps,
  isLoading = false,
  isError = false,
  style,
}: LabelItemListProps<T>) => {
  const {colors} = useTheme();

  return (
    <View style={StyleSheet.flatten([{gap: 8}, style])}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {typeof label === 'string' ? (
          <Text
            style={[
              TYPOGRAPHY.h6,
              {
                color: colors.layout.foreground,
              },
            ]}>
            {label}
          </Text>
        ) : (
          label
        )}
        {showNavigation && (
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={onPressNavigation}>
            <Text
              style={[
                TYPOGRAPHY.body2,
                {
                  color: colors.base.primary,
                },
              ]}>
              View All
            </Text>
            <ChevronRight
              color={colors.base.primary}
              strokeWidth={1.5}
              size={18}
            />
          </Pressable>
        )}
      </View>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => (item as any)._id}
          ListEmptyComponent={() => (
            <Text
              style={[
                TYPOGRAPHY.body1,
                {
                  color: colors.layout.foreground,
                  fontSize: 14,
                },
              ]}>
              {isError ? 'An error occurred' : 'No items found'}
            </Text>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{gap: 12}}
          {...listProps}
        />
      )}
    </View>
  );
};

export default LabelItemList;

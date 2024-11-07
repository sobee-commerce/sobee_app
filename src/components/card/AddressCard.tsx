import {useTheme} from '@/context';
import {IAddress} from '@/lib/interfaces';
import {FONT_FAMILY, TYPOGRAPHY} from '@/theme';
import {ApplicationNavigationProps} from '@/types';
import {useNavigation} from '@react-navigation/native';
import {ChevronRight} from 'lucide-react-native';
import React, {useMemo} from 'react';
import {Pressable, Text, View} from 'react-native';

type Props = {
  address: IAddress;
  onPress?: () => void;
  selected?: boolean;
};

const AddressCard = ({address, onPress, selected = false}: Props) => {
  const {colors} = useTheme();
  const navigation = useNavigation<ApplicationNavigationProps>();
  const addressString = useMemo(() => {
    return [
      address.specificAddress,
      address.ward,
      address.district,
      address.city,
      address.country,
    ]
      .filter(v => v)
      .join(', ')
      .trim()
      .replace(/\n/g, ', ');
  }, [address]);

  return (
    <Pressable
      onPress={() => {
        onPress
          ? onPress()
          : navigation.navigate('AddressDetail', {
              addressId: address._id,
              data: address,
            });
      }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: selected ? colors.base.primary : colors.default.default200,
        padding: 12,
        borderRadius: 8,
        gap: 12,
      }}>
      <View
        style={{
          flex: 1,
        }}>
        <Text
          style={{
            ...TYPOGRAPHY.body1,
            color: colors.layout.foreground,
            fontFamily: FONT_FAMILY.semiBold,
          }}
          numberOfLines={2}>
          {address.name} - {address.phoneNumber}{' '}
          <Text
            style={{
              color: colors.base.primary,
            }}>
            {address.isDefault && '(Default)'}
          </Text>
        </Text>
        <Text
          style={{
            ...TYPOGRAPHY.body2,
            color: colors.layout.foreground,
          }}
          numberOfLines={2}>
          {addressString}
        </Text>
      </View>
      <ChevronRight color={colors.default.default500} strokeWidth={1} />
    </Pressable>
  );
};

export default AddressCard;

import {AddressCard} from '@/components/card';
import {Button} from '@/components/common';
import {useTheme} from '@/context';
import {useGetAddressQuery} from '@/services';
import {FONT_FAMILY, TYPOGRAPHY} from '@/theme';
import {ApplicationScreenProps} from '@/types';
import React, {useEffect, useState} from 'react';
import {Alert, FlatList, Pressable, Text, View} from 'react-native';

const ShippingAddressScreen = ({
  navigation,
  route,
}: ApplicationScreenProps<'ShippingAddress'>) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Select Address',
      headerTitleAlign: 'center',
      headerRight: ({tintColor}) => (
        <Pressable
          onPress={() => navigation.navigate('AddressDetail', {})}
          style={{
            marginRight: 16,
          }}>
          <Text
            style={{
              color: tintColor,
              fontFamily: FONT_FAMILY.medium,
            }}>
            Add Address
          </Text>
        </Pressable>
      ),
    });
  }, []);

  const {params} = route;
  const {colors} = useTheme();
  const getAddressesQuery = useGetAddressQuery();
  const addresses = getAddressesQuery.data?.data || [];
  const onChangeAddress = params.onChangeAddress;
  const [selectedAddress, setSelectedAddress] = useState(
    addresses.find(a => a._id === params.selectedAddress)?._id,
  );

  const onSave = () => {
    if (!selectedAddress) {
      return Alert.alert('Please select an address');
    }
    onChangeAddress(selectedAddress);
    navigation.goBack();
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={addresses}
        contentContainerStyle={{padding: 20, gap: 12}}
        keyExtractor={item => item._id!}
        renderItem={({item}) => (
          <AddressCard
            address={item}
            onPress={() => {
              setSelectedAddress(item._id);
            }}
            selected={selectedAddress === item._id}
          />
        )}
      />
      <Button color="primary" style={{margin: 20}} onPress={onSave}>
        <Text
          style={[
            TYPOGRAPHY.button,
            {
              color: colors.white,
            },
          ]}>
          Save
        </Text>
      </Button>
    </View>
  );
};

export default ShippingAddressScreen;

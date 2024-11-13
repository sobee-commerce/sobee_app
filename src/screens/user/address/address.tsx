import {AddressCard} from '@/components/card';
import {useGetAddressQuery} from '@/services';
import {ApplicationScreenProps} from '@/types';
import {CirclePlus} from 'lucide-react-native';
import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

const AddressScreen = ({navigation}: ApplicationScreenProps<'Address'>) => {
  useEffect(() => {
    navigation.setOptions({
      headerRight: ({tintColor}) => (
        <Pressable
          style={{marginRight: 16}}
          onPress={() => navigation.navigate('AddressDetail', {})}>
          <CirclePlus size={24} color={tintColor} strokeWidth={1.5} />
        </Pressable>
      ),
    });
  }, []);

  const {data, isLoading} = useGetAddressQuery();

  const addresses = data?.data! || [];

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={addresses}
        contentContainerStyle={{padding: 20, gap: 12}}
        keyExtractor={item => item._id!}
        renderItem={({item}) => <AddressCard address={item} />}
      />
    </View>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({});

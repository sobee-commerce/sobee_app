import {useTheme} from '@/context';
import {useChatRoomSocket} from '@/hooks/socket-handler';
import {FONT_FAMILY} from '@/theme';
import React from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import RoomItem from './components/RoomItem';

const ChatScreen = () => {
  const {colors} = useTheme();
  const {data, error, isError, isLoading} = useChatRoomSocket();

  if (isError) {
    return (
      <Text
        style={{
          color: colors.base.danger,
          fontFamily: FONT_FAMILY.regular,
          fontSize: 16,
          textAlign: 'center',
        }}>
        {error}
      </Text>
    );
  }
  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <View>
      <FlatList
        ListEmptyComponent={() => (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: FONT_FAMILY.medium,
                fontSize: 16,
                color: colors.layout.foreground,
              }}>
              No rooms
            </Text>
          </View>
        )}
        contentContainerStyle={{padding: 20, gap: 6}}
        data={data}
        renderItem={({item}) => <RoomItem room={item} />}
      />
    </View>
  );
};

export default ChatScreen;

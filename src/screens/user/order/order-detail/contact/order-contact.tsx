import {useTheme} from '@/context';
import {useChatRoomMessages} from '@/hooks/socket-handler';
import {FONT_FAMILY} from '@/theme';
import {ApplicationScreenProps} from '@/types';
import React, {useEffect} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import ChatItem from './components/ChatItem';
import SendMessage from './components/SendMessage';

const OrderContactScreen = ({
  navigation,
  route,
}: ApplicationScreenProps<'Contact'>) => {
  const {roomId} = route.params;
  const {colors} = useTheme();
  const {error, isError, isLoading, messages} = useChatRoomMessages(roomId);

  const flatListRef = React.useRef<FlatList>(null);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Chat',
      headerTitleAlign: 'center',
    });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToIndex({
        index: messages.length - 1,
        animated: false,
      });
    }
  }, [messages]);

  if (isError) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={{flex: 1}}>
      <FlatList
        ref={flatListRef}
        ListEmptyComponent={() =>
          isLoading ? (
            <ActivityIndicator />
          ) : (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: FONT_FAMILY.medium,
                  fontSize: 16,
                  color: colors.layout.foreground,
                }}>
                No messages
              </Text>
            </View>
          )
        }
        onScrollToIndexFailed={({index}) => {
          console.log('scroll failed', index);
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index,
              animated: false,
            });
          }, 500);
        }}
        showsVerticalScrollIndicator={false}
        data={messages}
        contentContainerStyle={{
          padding: 20,
          justifyContent: 'flex-end',
        }}
        renderItem={({item}) => <ChatItem chat={item} />}
      />
      <SendMessage roomId={roomId} />
    </View>
  );
};

export default OrderContactScreen;

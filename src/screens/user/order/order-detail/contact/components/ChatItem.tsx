import {useTheme} from '@/context';
import {IChatMessage} from '@/lib/interfaces';
import {APP_CONFIG, FONT_FAMILY, STORAGE} from '@/utils';
import {formatDistanceToNow} from 'date-fns';
import React from 'react';
import {Text, View} from 'react-native';

type Props = {
  chat: IChatMessage;
};

const ChatItem = ({chat}: Props) => {
  const {colors} = useTheme();
  const sender = chat.sender as string;
  const userId = STORAGE.getString(APP_CONFIG.STORAGE_KEY.USER_ID);
  return (
    <View
      style={{
        padding: 10,
        backgroundColor:
          sender === userId ? colors.base.primary : colors.default.default100,
        borderRadius: 10,
        alignSelf: sender === userId ? 'flex-end' : 'flex-start',
        marginBottom: 10,
        maxWidth: '80%',
      }}>
      <Text
        style={{
          color:
            sender === userId
              ? colors.layout.background
              : colors.layout.foreground,
          fontFamily: FONT_FAMILY.regular,
        }}>
        {chat.content}
      </Text>
      <Text
        style={{
          color:
            sender === userId
              ? colors.layout.background
              : colors.default.default500,
          fontSize: 10,
          marginTop: 4,
          fontFamily: FONT_FAMILY.regular,
        }}>
        {formatDistanceToNow(chat.createdAt!, {addSuffix: true})}
      </Text>
    </View>
  );
};

export default ChatItem;

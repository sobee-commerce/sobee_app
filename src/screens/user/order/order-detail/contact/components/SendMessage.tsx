import {Input} from '@/components/common';
import {useTheme} from '@/context';
import {useSendMessage} from '@/hooks/socket-handler';
import {FONT_FAMILY} from '@/theme';
import React, {useState} from 'react';
import {Pressable, Text, View} from 'react-native';

type Props = {roomId: string};

const SendMessage = ({roomId}: Props) => {
  const {colors} = useTheme();
  const {error, isError, isLoading, isSuccess, sendMessage} =
    useSendMessage(roomId);
  const [message, setMessage] = useState('');

  const onSendMessage = () => {
    sendMessage(message);
    setMessage('');
  };

  const disabled = isLoading || !message;

  return (
    <View
      style={{
        padding: 20,
        borderTopColor: colors.layout.divider,
        borderTopWidth: 1,
        flexDirection: 'row',
        gap: 12,
      }}>
      <Input
        placeholder="Type your message here"
        size="sm"
        containerStyle={{flex: 1}}
        value={message}
        onChangeText={setMessage}
        blurOnSubmit
        onSubmitEditing={onSendMessage}
      />
      <Pressable
        disabled={disabled}
        onPress={onSendMessage}
        style={{
          backgroundColor: colors.base.primary,
          paddingVertical: 10,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
          opacity: disabled ? 0.5 : 1,
        }}>
        <Text
          style={{
            color: colors.layout.background,
            fontFamily: FONT_FAMILY.medium,
          }}>
          Send
        </Text>
      </Pressable>
    </View>
  );
};

export default SendMessage;

import {useTheme} from '@/context';
import {IChatMessage, IChatRoom, IUser} from '@/lib/interfaces';
import {ApplicationNavigationProps} from '@/types';
import {APP_CONFIG, FONT_FAMILY, STORAGE} from '@/utils';
import {useNavigation} from '@react-navigation/native';
import {formatDistanceToNow} from 'date-fns';
import React from 'react';
import {Pressable, Text, View} from 'react-native';

type Props = {
  room: IChatRoom;
};

const RoomItem = ({room}: Props) => {
  const {colors} = useTheme();
  const navigation = useNavigation<ApplicationNavigationProps>();
  const lastMessage = room.lastMessage as IChatMessage;
  const lastUserSender = lastMessage?.sender as IUser;
  const userId = STORAGE.getString(APP_CONFIG.STORAGE_KEY.USER_ID);
  return (
    <Pressable
      style={{
        borderWidth: 1,
        borderColor: colors.layout.divider,
        padding: 16,
        borderRadius: 12,
      }}
      onPress={() =>
        navigation.navigate('Contact', {
          roomId: room._id!,
        })
      }>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text
          style={{
            flex: 1,
            fontFamily: FONT_FAMILY.medium,
            fontSize: 16,
            color: colors.layout.foreground,
          }}>
          {room.title}
        </Text>
        {lastMessage && (
          <Text
            style={{
              fontFamily: FONT_FAMILY.regular,
              fontSize: 12,
              color: colors.default.default500,
            }}>
            {formatDistanceToNow(lastMessage.createdAt!, {addSuffix: true})}
          </Text>
        )}
      </View>
      {lastMessage && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            style={{
              flex: 1,
              fontFamily: FONT_FAMILY.regular,
              fontSize: 14,
              color: colors.layout.foreground,
            }}
            numberOfLines={1}>
            {lastUserSender._id === userId
              ? 'You: '
              : `${lastUserSender.name.split(' ').pop()}: `}
            {lastMessage.content}
          </Text>

          {room.isHaveNew && (
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: colors.base.danger,
              }}
            />
          )}
        </View>
      )}
    </Pressable>
  );
};

export default RoomItem;

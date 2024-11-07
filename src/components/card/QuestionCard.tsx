import {useTheme} from '@/context';
import {IQuestion, IReply, IUser} from '@/lib/interfaces';
import {useLikeQuestionMutation} from '@/services';
import {FONT_FAMILY} from '@/theme';
import {ApplicationNavigationProps} from '@/types';
import {APP_CONFIG, STORAGE} from '@/utils';
import {useNavigation} from '@react-navigation/native';
import {format} from 'date-fns';
import {Heart} from 'lucide-react-native';
import React from 'react';
import {Image, Pressable, Text, View} from 'react-native';

type Props = {
  question: IQuestion;
};

const QuestionCard = ({question}: Props) => {
  const {colors} = useTheme();
  const customer = question.customer as IUser;
  const reply = question.answer as IReply;
  const navigation = useNavigation<ApplicationNavigationProps>();

  const isLiked = question.likes?.some(
    l => l === STORAGE.getString(APP_CONFIG.STORAGE_KEY.USER_ID),
  );

  const likeQuestionMutation = useLikeQuestionMutation();

  const handleLike = () => {
    likeQuestionMutation.mutate(question._id!);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 12,
      }}>
      <Image
        source={{uri: customer.avatar}}
        style={{width: 30, height: 30, borderRadius: 20}}
        resizeMode="contain"
      />
      <View style={{gap: 4, flex: 1}}>
        <Text
          style={{
            fontFamily: FONT_FAMILY.medium,
            fontSize: 14,
            color: colors.layout.foreground,
          }}>
          {customer.name}
          {STORAGE.getString(APP_CONFIG.STORAGE_KEY.USER_ID) === customer._id &&
            ' (You)'}
        </Text>
        <Text
          style={{
            fontFamily: FONT_FAMILY.regular,
            fontSize: 12,
            color: colors.layout.foreground,
          }}>
          {format(question.createdAt!, "dd/MM/yyyy 'at' hh:mm aaa")}
        </Text>
        <Text
          style={{
            fontFamily: FONT_FAMILY.regular,
            fontSize: 16,
            color: colors.layout.foreground,
          }}>
          {question.content}
        </Text>
        <View>
          <View
            style={{
              flexDirection: 'row',
              gap: 12,
              alignItems: 'center',
            }}>
            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}
              onPress={handleLike}>
              <Heart
                size={20}
                color={colors.base.danger}
                fill={isLiked ? colors.base.danger : 'none'}
              />
              <Text
                style={{
                  fontFamily: FONT_FAMILY.regular,
                  fontSize: 12,
                  color: colors.layout.foreground,
                }}>
                {(question.likes || []).length || 0} likes
              </Text>
            </Pressable>
            <Pressable
              onPress={() =>
                navigation.navigate('AskQuestion', {
                  productId: question.product as string,
                  data: question,
                })
              }
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}>
              <Text
                style={{
                  fontFamily: FONT_FAMILY.regular,
                  fontSize: 12,
                  color: colors.base.primary,
                }}>
                Edit your question
              </Text>
            </Pressable>
          </View>
        </View>
        {reply && (
          <View
            style={{
              backgroundColor: colors.default.default100,
              padding: 8,
              borderRadius: 8,
              marginTop: 8,
              gap: 4,
            }}>
            <Text
              style={{
                fontFamily: FONT_FAMILY.medium,
                fontSize: 14,
                color: colors.layout.foreground,
              }}>
              Reply of seller
            </Text>
            <Text
              style={{
                fontFamily: FONT_FAMILY.regular,
                fontSize: 12,
                color: colors.layout.foreground,
              }}>
              {format(question.createdAt!, "dd/MM/yyyy 'at' hh:mm aaa")}
            </Text>
            <Text
              style={{
                fontFamily: FONT_FAMILY.regular,
                fontSize: 16,
                color: colors.layout.foreground,
              }}>
              {reply.content}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default QuestionCard;

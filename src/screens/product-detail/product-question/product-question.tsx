import {QuestionCard} from '@/components/card';
import {useTheme} from '@/context';
import {ICustomer} from '@/lib/interfaces';
import {useGetProductQuestionsQuery} from '@/services';
import {FONT_FAMILY, TYPOGRAPHY} from '@/theme';
import {ApplicationScreenProps} from '@/types';
import {APP_CONFIG, STORAGE} from '@/utils';
import React, {useEffect} from 'react';
import {ActivityIndicator, FlatList, Pressable, Text, View} from 'react-native';

const ProductQuestionScreen = ({
  navigation,
  route,
}: ApplicationScreenProps<'ProductQuestion'>) => {
  const {
    params: {productId},
  } = route;
  const {colors} = useTheme();

  const {data, isLoading} = useGetProductQuestionsQuery(productId);

  const questions = data?.data! || [];
  const hasUserAsked = questions.find(
    q =>
      (q.customer as ICustomer)._id ===
      STORAGE.getString(APP_CONFIG.STORAGE_KEY.USER_ID),
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Questions',
      headerTitleAlign: 'center',
      headerRight: ({tintColor}) => (
        <Pressable
          onPress={() =>
            navigation.navigate('AskQuestion', {productId, data: hasUserAsked})
          }
          style={{
            marginRight: 16,
          }}>
          <Text
            style={{
              color: tintColor,
              fontFamily: FONT_FAMILY.medium,
            }}>
            {hasUserAsked ? 'Edit your question' : 'Ask a question'}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, productId, hasUserAsked]);

  return (
    <View style={{flex: 1}}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          ListEmptyComponent={() => (
            <Text
              style={{
                ...TYPOGRAPHY.body1,
                color: colors.layout.foreground,
                textAlign: 'center',
              }}>
              No questions yet
            </Text>
          )}
          data={questions}
          contentContainerStyle={{gap: 12, padding: 20}}
          keyExtractor={item => item._id!}
          renderItem={({item}) => <QuestionCard question={item} />}
        />
      )}
    </View>
  );
};

export default ProductQuestionScreen;

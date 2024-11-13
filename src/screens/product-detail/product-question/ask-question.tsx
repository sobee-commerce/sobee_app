import {Button, TextArea} from '@/components/common';
import {useTheme} from '@/context';
import {
  useCreateQuestionMutation,
  useDeleteQuestionMutation,
  useEditQuestionMutation,
} from '@/services';
import {TYPOGRAPHY} from '@/theme';
import {ApplicationScreenProps} from '@/types';
import React, {useEffect, useState} from 'react';
import {Alert, Pressable, ScrollView, Text} from 'react-native';

const AskQuestionScreen = ({
  navigation,
  route,
}: ApplicationScreenProps<'AskQuestion'>) => {
  const {productId, data} = route.params;
  const {colors} = useTheme();
  const deleteQuestionMutation = useDeleteQuestionMutation();

  const deleteQuestionHandler = () => {
    if (!data) return;

    Alert.alert(
      'Delete question',
      'Are you sure you want to delete this question?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteQuestionMutation.mutate(data._id!, {
              onSuccess: () => {
                Alert.alert('Success', 'Question deleted successfully', [
                  {
                    text: 'OK',
                    onPress: () => {
                      navigation.goBack();
                    },
                  },
                ]);
              },
              onError: (error: any) => {
                Alert.alert(
                  'Error',
                  error?.response?.data?.message || error.message,
                );
              },
            });
          },
        },
      ],
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: data ? 'Edit question' : 'Ask a question',
      headerTitleAlign: 'center',
      headerRight: () =>
        data ? (
          <Pressable
            style={{
              marginRight: 16,
            }}
            onPress={deleteQuestionHandler}>
            <Text
              style={[
                TYPOGRAPHY.body1,
                {
                  color: colors.white,
                },
              ]}>
              Delete
            </Text>
          </Pressable>
        ) : null,
    });
  }, [data]);

  console.log(data);

  const [question, setQuestion] = useState(data?.content || '');
  const createQuestionMutation = useCreateQuestionMutation();
  const editQuestionMutation = useEditQuestionMutation();
  const handler = data ? editQuestionMutation : createQuestionMutation;

  const onSubmit = () => {
    if (!question) {
      Alert.alert('Error', 'Question cannot be empty');
      return;
    }

    handler.mutate(
      data
        ? {
            _id: data._id!,
            content: question,
          }
        : {
            content: question,
            product: productId,
          },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Question submitted successfully', [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
                setQuestion('');
              },
            },
          ]);
        },
        onError: (error: any) => {
          Alert.alert('Error', error?.response?.data?.message || error.message);
        },
      },
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{
        gap: 12,
        padding: 20,
      }}>
      <TextArea
        placeholder="Type your question here"
        value={question}
        onChangeText={setQuestion}
        isDisabled={handler.isPending}
      />
      <Button
        color="primary"
        onPress={onSubmit}
        isLoading={handler.isPending}
        isDisabled={handler.isPending}>
        <Text style={[{color: 'white'}, TYPOGRAPHY.button]}>Submit</Text>
      </Button>
    </ScrollView>
  );
};

export default AskQuestionScreen;

import {Button, TextArea} from '@/components/common';
import {useTheme} from '@/context';
import {
  CreateReviewForm,
  EditReviewForm,
  createReviewFormSchema,
  editReviewFormSchema,
} from '@/lib/form-schema';
import {useCreateReviewMutation, useEditReviewMutation} from '@/services';
import {TYPOGRAPHY} from '@/theme';
import {ApplicationScreenProps} from '@/types';
import {zodResolver} from '@hookform/resolvers/zod';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ScrollView, Text} from 'react-native';

const ReviewOrderScreen = ({
  navigation,
  route,
}: ApplicationScreenProps<'Review'>) => {
  const {colors} = useTheme();
  const {orderId, data} = route.params;
  const isEdit = !!data;
  const {
    formState: {errors},
    handleSubmit,
    control,
  } = useForm<CreateReviewForm | EditReviewForm>({
    resolver: zodResolver(
      isEdit ? editReviewFormSchema : createReviewFormSchema,
    ),
  });

  const createReviewMutation = useCreateReviewMutation();
  const editReviewMutation = useEditReviewMutation();

  const isPending =
    createReviewMutation.isPending || editReviewMutation.isPending;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: isEdit ? 'Edit Review' : 'Review Order',
    });
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        gap: 20,
      }}>
      <Controller
        control={control}
        name="content"
        render={({field: {onChange, value}}) => (
          <TextArea
            onChangeText={onChange}
            value={value}
            label="Title"
            placeholder="Enter title"
            radius="sm"
            size="sm"
            isInvalid={!!errors.content}
            errorMessage={errors.content?.message}
            isDisabled={isPending}
          />
        )}
      />

      <Button color="primary">
        <Text
          style={[
            TYPOGRAPHY.button,
            {
              color: colors.white,
            },
          ]}>
          {isEdit ? 'Update Review' : 'Submit Review'}
        </Text>
      </Button>
    </ScrollView>
  );
};

export default ReviewOrderScreen;

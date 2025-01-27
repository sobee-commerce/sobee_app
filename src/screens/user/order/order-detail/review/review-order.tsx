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
import {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ScrollView, Text} from 'react-native';
import {Rating} from 'react-native-ratings';

const ReviewOrderScreen = ({
  navigation,
  route,
}: ApplicationScreenProps<'Review'>) => {
  const {colors} = useTheme();
  const {orderId, data: orderData} = route.params;
  const isEdit = !!orderData;
  const {
    formState: {errors},
    handleSubmit,
    control,
    watch,
    reset,
  } = useForm<CreateReviewForm | EditReviewForm>({
    resolver: zodResolver(
      isEdit ? editReviewFormSchema : createReviewFormSchema,
    ),
    defaultValues: {
      product: orderId,
    },
  });

  const {rating} = watch();

  useEffect(() => {
    if (orderData) {
      reset({
        ...orderData,
      });
    }
  }, [orderData]);

  const createReviewMutation = useCreateReviewMutation();
  const editReviewMutation = useEditReviewMutation();

  const isPending =
    createReviewMutation.isPending || editReviewMutation.isPending;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: isEdit ? 'Edit Review' : 'Review Order',
    });
  }, []);

  const submit = handleSubmit(data => {
    if (isEdit) {
      editReviewMutation.mutate(
        {
          content: data.content,
          rating: data.rating,
          _id: orderData._id!,
        },
        {
          onSuccess: () => {
            navigation.goBack();
          },
        },
      );
    } else {
      createReviewMutation.mutate(
        {
          content: data.content,
          rating: data.rating,
          product: orderId,
        },
        {
          onSuccess: () => {
            navigation.goBack();
          },
        },
      );
    }
  });

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        gap: 20,
      }}>
      <Controller
        control={control}
        name="rating"
        render={({field: {onChange}}) => (
          <Rating
            onFinishRating={onChange}
            ratingCount={5}
            startingValue={rating || 5}
            fractions={0}
            showRating
          />
        )}
      />

      <Controller
        control={control}
        name="content"
        render={({field: {onChange, value}}) => (
          <TextArea
            onChangeText={onChange}
            value={value}
            label="Review"
            placeholder="Enter review"
            radius="sm"
            size="sm"
            isInvalid={!!errors.content}
            errorMessage={errors.content?.message}
            isDisabled={isPending}
            style={{
              minHeight: 100,
            }}
          />
        )}
      />

      <Button
        color="primary"
        onPress={submit}
        isLoading={isPending}
        isDisabled={isPending}>
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

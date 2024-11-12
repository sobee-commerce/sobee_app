import {z} from 'zod';

export const deleteReviewFormSchema = z.string();

export type DeleteReviewFormSchema = z.infer<typeof deleteReviewFormSchema>;

export const createReviewFormSchema = z.object({
  content: z.string().min(10).max(500),
  product: z.string(),
});

export const editReviewFormSchema = z.object({
  content: z.string().min(10).max(500),
  _id: z.string(),
});

export type CreateReviewForm = z.infer<typeof createReviewFormSchema>;
export type EditReviewForm = z.infer<typeof editReviewFormSchema>;

export const likeReviewFormSchema = z.string();
export const likeReviewReplyFormSchema = z.string();

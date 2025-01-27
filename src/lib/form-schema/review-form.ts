import {z} from 'zod';

export const deleteReviewFormSchema = z.string();

export type DeleteReviewFormSchema = z.infer<typeof deleteReviewFormSchema>;

export const createReviewFormSchema = z.object({
  content: z.string().min(10).max(500),
  product: z.string(),
  rating: z.number().int().min(1).max(5).default(5),
});

export const editReviewFormSchema = z.object({
  content: z.string().min(10).max(500),
  rating: z.number().int().min(1).max(5).default(5),
  _id: z.string(),
});

export type CreateReviewForm = z.infer<typeof createReviewFormSchema>;
export type EditReviewForm = z.infer<typeof editReviewFormSchema>;

export const likeReviewFormSchema = z.string();
export const likeReviewReplyFormSchema = z.string();

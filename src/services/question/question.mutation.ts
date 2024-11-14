import {QUERY_KEY} from '@/constants';
import {CreateQuestionForm, EditQuestionForm} from '@/lib/form-schema';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {questionService} from './question.service';

export const useCreateQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateQuestionForm) => {
      const res = await questionService.createQuestion(data);
      if (res.data.success) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.QUESTION.GET_ALL],
        });
      }
      return res.data;
    },
  });
};

export const useEditQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: EditQuestionForm) => {
      const res = await questionService.editQuestion(data._id, data);
      if (res.data.success) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.QUESTION.GET_ALL],
        });
      }
      return res.data;
    },
  });
};

export const useDeleteQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (questionId: string) => {
      const res = await questionService.deleteQuestion(questionId);
      if (res.data.success) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.QUESTION.GET_ALL],
        });
      }
      return res.data;
    },
  });
};

export const useLikeQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (questionId: string) => {
      const res = await questionService.likeQuestion(questionId);
      if (res.data.success) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.QUESTION.GET_ALL],
        });
      }
      return res.data;
    },
  });
};

export const useLikeQuestionReplyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (questionId: string) => {
      const res = await questionService.likeQuestionReply(questionId);
      if (res.data.success) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.QUESTION.GET_ALL],
        });
      }
      return res.data;
    },
  });
};

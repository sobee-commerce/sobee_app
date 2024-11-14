import {useMutation} from '@tanstack/react-query';
import {cloudinaryService} from './cloudinary.service';

export const useUploadFileMutation = () => {
  return useMutation({
    mutationKey: ['UPLOAD_FILE'],
    mutationFn: async (data: FormData) => {
      const res = await cloudinaryService.uploadFile(data);
      return res.data;
    },
  });
};

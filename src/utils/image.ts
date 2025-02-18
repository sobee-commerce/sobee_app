import {DEFAULT_IMAGE} from '@/constants';

const CLOUDINARY_NAME = 'dtfkou1of';
const SUB = 'image/upload/';

export const optimizeImageSrc = (
  src: string,
  width: number = 100,
  height: number = 100,
) => {
  if (!src) return DEFAULT_IMAGE;
  const url = src.split(`/${CLOUDINARY_NAME}/${SUB}`);
  return `${url[0]}/${CLOUDINARY_NAME}/${SUB}w_${width},h_${height}/${url[1]}`;
};

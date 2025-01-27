const CLOUDINARY_NAME = 'dtfkou1of';
const SUB = 'image/upload/';

export const optimizeImageSrc = (
  src: string,
  width: number = 100,
  height: number = 100,
) => {
  const url = src.split(`/${CLOUDINARY_NAME}/${SUB}`);
  return `${url[0]}/${CLOUDINARY_NAME}/${SUB}w_${width},h_${height}/${url[1]}`;
};

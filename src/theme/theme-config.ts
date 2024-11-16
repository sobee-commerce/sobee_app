import {ColorVariant, ThemeColor, ThemeRadius, ThemeSize} from '@/types';
import {COLOR} from './color';

export const radiusConfig = (rd: ThemeRadius) => {
  switch (rd) {
    case 'sm':
      return 8;
    case 'md':
      return 12;
    case 'lg':
      return 14;
    case 'full':
      return 1000;
    default:
      return 12;
  }
};

export const sizeConfig = (size: ThemeSize) => {
  switch (size) {
    case 'sm':
      return {padding: 8};
    case 'md':
      return {padding: 12};
    case 'lg':
      return {padding: 16};
    default:
      return {padding: 12};
  }
};

export const colorConfig = (color: ThemeColor, theme: ColorVariant) => {
  return COLOR[theme].base[color];
};

import {COLOR} from '@/theme';

export type ThemeRadius = 'sm' | 'md' | 'lg' | 'full';
export type ThemeSize = 'sm' | 'md' | 'lg';
export type ThemeColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'transparent';

export type ColorVariant = keyof typeof COLOR;
export type ColorType = (typeof COLOR)['light'];

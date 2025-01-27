import {forwardRef} from 'react';
import {TextInput} from 'react-native';
import Input, {InputProps} from './Input';

export type TextAreaProps = {} & InputProps;

const TextArea = forwardRef<TextInput, TextAreaProps>((props, ref) => {
  return (
    <Input
      ref={ref}
      numberOfLines={4}
      {...props}
      multiline
      textAlignVertical="top"
    />
  );
});

export default TextArea;

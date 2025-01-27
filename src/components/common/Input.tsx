import {useTheme} from '@/context';
import {TYPOGRAPHY} from '@/theme';
import {radiusConfig, sizeConfig} from '@/theme/theme-config';
import {ThemeRadius, ThemeSize} from '@/types';
import {Eye, EyeOff} from 'lucide-react-native';
import {forwardRef, useState} from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

export type InputProps = {
  isDisabled?: boolean;
  isInvalid?: boolean;
  isReadOnly?: boolean;
  errorMessage?: string;
  helperMessage?: string;
  label?: string;
  showBorder?: boolean;
  size?: ThemeSize;
  radius?: ThemeRadius;
  containerStyle?: StyleProp<ViewStyle>;
} & TextInputProps;

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      isDisabled = false,
      isInvalid = false,
      isReadOnly = false,
      showBorder = true,
      errorMessage,
      helperMessage,
      label,
      size = 'md',
      radius = 'md',
      containerStyle,
      ...props
    },
    ref,
  ) => {
    const {colors} = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [isSecure, setIsSecure] = useState(props.secureTextEntry || false);

    return (
      <View
        style={StyleSheet.flatten([
          {
            gap: 8,
          },
          containerStyle,
        ])}>
        {label && (
          <Text
            style={[
              TYPOGRAPHY.body2,
              {
                color: isInvalid
                  ? colors.base.danger
                  : colors.layout.foreground,
              },
            ]}>
            {label}
          </Text>
        )}
        <View
          style={{
            gap: 4,
          }}>
          <View
            style={{
              flexDirection: 'row',
              borderRadius: radiusConfig(radius),
              borderColor: !isInvalid
                ? isFocused
                  ? colors.base.primary
                  : colors.default.default300
                : colors.base.danger,
              borderWidth: showBorder ? 1 : 0,
              backgroundColor: colors.layout.background,
            }}>
            <TextInput
              ref={ref}
              {...props}
              editable={!isDisabled && !isReadOnly}
              style={StyleSheet.flatten([
                {
                  flex: 1,
                  color: isInvalid
                    ? colors.base.danger
                    : colors.layout.foreground,
                },
                props.style,
                TYPOGRAPHY.body2,
                sizeConfig(size),
              ])}
              placeholderTextColor={colors.default.default500}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              secureTextEntry={isSecure}
            />
            {props.secureTextEntry && (
              <Pressable
                onPress={() => setIsSecure(!isSecure)}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 8,
                }}>
                {!isSecure ? (
                  <EyeOff color={colors.base.default} />
                ) : (
                  <Eye color={colors.base.default} />
                )}
              </Pressable>
            )}
          </View>
          {helperMessage && (
            <Text
              style={[
                TYPOGRAPHY.caption,
                {
                  color: colors.default.default500,
                },
              ]}>
              {helperMessage}
            </Text>
          )}
          {isInvalid && errorMessage && (
            <Text
              style={[
                TYPOGRAPHY.caption,
                {
                  color: isInvalid
                    ? colors.base.danger
                    : colors.default.default500,
                },
              ]}>
              {errorMessage}
            </Text>
          )}
        </View>
      </View>
    );
  },
);

export default Input;

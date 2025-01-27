import {useTheme} from '@/context';
import {colorConfig, radiusConfig, sizeConfig} from '@/theme/theme-config';
import {ThemeColor, ThemeRadius, ThemeSize} from '@/types';
import React, {forwardRef} from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

export type ButtonProps = {
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  radius?: ThemeRadius;
  size?: ThemeSize;
  color?: ThemeColor;
  innerStyle?: StyleProp<ViewStyle>;
} & PressableProps;

const Button = forwardRef<View, ButtonProps>(
  (
    {
      startContent = null,
      endContent = null,
      isLoading = false,
      isDisabled = false,
      radius = 'md',
      size = 'md',
      color = 'default',
      children,
      ...props
    },
    ref,
  ) => {
    const {theme} = useTheme();

    return (
      <Pressable
        ref={ref}
        {...props}
        disabled={isDisabled}
        style={StyleSheet.flatten([
          {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: colorConfig(color, theme),
            borderRadius: radiusConfig(radius),
          },
          sizeConfig(size),
          props.style,
        ])}>
        {isDisabled && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(255,255,255,0.8)',
              borderRadius: radiusConfig(radius),
            }}
          />
        )}

        <View
          style={StyleSheet.flatten([
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              flex: 1,
              gap: 8,
            },
            props.innerStyle,
          ])}>
          {startContent || <View style={{width: 20, height: 20}} />}
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 4,
            }}>
            {isLoading && <ActivityIndicator size={'small'} />}
            {children as React.ReactNode}
          </View>
          {endContent || <View style={{width: 20, height: 20}} />}
        </View>
      </Pressable>
    );
  },
);

export default Button;

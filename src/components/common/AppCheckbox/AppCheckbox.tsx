import {useTheme} from '@/context';
import {TYPOGRAPHY} from '@/theme';
import {CheckIcon} from 'lucide-react-native';
import React from 'react';
import {Pressable, Text, View} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import {AppCheckboxProps} from './AppCheckboxPropTypes';
/**
 * @desc The AppCheckbox component is a checkbox component that can be used throughout the app
 * @param {boolean} props.value - The value of the checkbox
 * @param {Function} props.onValueChange - The callback when the value of the checkbox changes
 * @param {ViewStyle} props.color - The color of the checkbox
 * @param {ViewStyle} props.label - The label of the checkbox
 * @param {number} props.size - The size of the checkbox
 * @param {string} props.label.checked - The label of the checkbox when it is checked
 * @param {string} props.label.unChecked - The label of the checkbox when it is unchecked
 * @param {boolean} props.showCheckMark - The show check mark of the checkbox
 * @returns {React.JSX.Element}
 */
const AppCheckbox: React.FC<AppCheckboxProps> = (props): React.JSX.Element => {
  const {colors} = useTheme();

  const {
    value,
    onValueChange,
    color = {
      checked: colors.base.primary,
      unchecked: colors.transparent,
    },
    label,
    size = 24,
    isRadio = false,
  } = props;

  const animControl = useDerivedValue(() => {
    return withTiming(value ? 1 : 0);
  });

  const boxAnimStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        animControl.value,
        [0, 1],
        [color?.unchecked!, color?.checked!],
      ),
    };
  });

  const iconAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(animControl.value, [0, 1], [0, 1], {
            extrapolateLeft: Extrapolation.CLAMP,
            extrapolateRight: Extrapolation.CLAMP,
          }),
        },
      ],
      opacity: interpolate(animControl.value, [0, 1], [0, 1], {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.CLAMP,
      }),
    };
  });

  const memoizeOnValueChange = React.useCallback(() => {
    runOnJS(onValueChange)(!value);
  }, [value]);

  return (
    <Pressable
      hitSlop={10}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      }}
      onPress={memoizeOnValueChange}>
      <View
        style={[
          {
            width: size,
            height: size,
            borderWidth: 3,
            borderColor: colors.base.primary,
            borderRadius: isRadio ? 999 : 8,
            padding: isRadio ? 2 : 0,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            backgroundColor: value ? color?.checked : color?.unchecked,
          },
        ]}>
        <Animated.View
          style={[
            boxAnimStyle,
            {
              borderRadius: isRadio ? 999 : 0,
              backgroundColor: value ? color?.checked : color?.unchecked,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        />
        {!isRadio && (
          <Animated.View
            style={[
              iconAnimStyle,
              {
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              },
            ]}>
            <CheckIcon size={size - 10} color={colors.white} />
          </Animated.View>
        )}
      </View>
      {label && (
        <Text
          style={{
            color: colors.layout.foreground,
            ...TYPOGRAPHY.body2,
            marginTop: 4,
          }}>
          {value ? label?.checked : label?.unChecked || label?.checked}
        </Text>
      )}
    </Pressable>
  );
};

export default AppCheckbox;

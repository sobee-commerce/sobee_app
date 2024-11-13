import {useTheme} from '@/context';
import {TYPOGRAPHY} from '@/theme';
import {ChevronRight} from 'lucide-react-native';
import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

type Props = {
  label: string;
  onPress?: () => void;
  right?: React.ReactNode;
};

const MenuItem = ({label, onPress, ...props}: Props) => {
  const {colors} = useTheme();
  const {right = <ChevronRight color={colors.default.default500} />} = props;
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: colors.default.default200,
        borderRadius: 8,
      }}>
      <Text
        style={{
          flex: 1,
          color: colors.layout.foreground,
          ...TYPOGRAPHY.body2,
        }}>
        {label}
      </Text>
      {right}
    </Pressable>
  );
};

export default MenuItem;

const styles = StyleSheet.create({});

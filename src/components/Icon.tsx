import React from 'react';
import { Text, TouchableOpacity, StyleSheet, TextStyle, ViewStyle } from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  fill?: boolean;
  onPress?: () => void;
  style?: TextStyle | ViewStyle;
}

export default function Icon({
  name,
  size = 24,
  color = '#303338',
  fill = false,
  onPress,
  style,
}: IconProps) {
  const iconStyle: TextStyle = {
    fontSize: size,
    color: color,
    fontFamily: fill ? 'MaterialSymbolsRoundedFilled' : 'MaterialSymbolsRounded',
  };

  const content = (
    <Text style={[styles.iconText, iconStyle, style as TextStyle]}>
      {name}
    </Text>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  iconText: {
    fontFamily: 'MaterialSymbolsRounded',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
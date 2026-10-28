import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, Palette, ThemeColor, Type } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return <Text style={[{ color: theme[themeColor ?? 'text'] }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  small: {
    fontFamily: Type.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  smallBold: {
    fontFamily: Type.bodyBold,
    fontSize: 14,
    lineHeight: 20,
  },
  default: {
    fontFamily: Type.body,
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontFamily: Type.display,
    fontSize: 48,
    lineHeight: 52,
  },
  subtitle: {
    fontFamily: Type.display,
    fontSize: 32,
    lineHeight: 38,
  },
  link: {
    fontFamily: Type.bodyMedium,
    lineHeight: 30,
    fontSize: 14,
  },
  linkPrimary: {
    fontFamily: Type.bodyMedium,
    lineHeight: 30,
    fontSize: 14,
    color: Palette.blaze,
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
});

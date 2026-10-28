/**
 * Design tokens for the "Field Journal at Dusk" direction. See docs/DESIGN.md.
 * Components take colors from here (or src/constants/track-style.ts), never raw hex.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Palette = {
  nightPine: '#0F1A15',
  canopy: '#1B2A22',
  canopyHigh: '#24362C',
  bone: '#F2ECE1',
  boneSoft: '#E4DED2',
  ash: '#B9B3A6',
  stone: '#8E897E',
  blaze: '#FF7A3D',
  blazeInk: '#1A0E06',
  sage: '#5CC9A8',
  paper: '#F6F1E7',
  ink: '#1B241F',
  inkSoft: '#5B6159',
  clay: '#C2410C',
} as const;

export const Colors = {
  // Reserved for long reading surfaces such as the Go Deeper sheet.
  light: {
    text: Palette.ink,
    textBody: Palette.ink,
    background: Palette.paper,
    backgroundElement: '#ECE5D8',
    backgroundSelected: '#E0D8C8',
    textSecondary: Palette.inkSoft,
    accent: Palette.clay,
    success: '#1F7A5C',
  },
  dark: {
    text: Palette.bone,
    textBody: Palette.boneSoft,
    background: Palette.nightPine,
    backgroundElement: Palette.canopy,
    backgroundSelected: Palette.canopyHigh,
    textSecondary: Palette.ash,
    accent: Palette.blaze,
    success: Palette.sage,
  },
} as const;

// The app runs dark for now so the tab bar matches the immersive feed.
export const AppScheme = 'dark' as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

// Families registered by useFonts in src/app/_layout.tsx. With a custom family,
// leave fontWeight unset: the weight is part of the family name.
export const Type = {
  display: 'Fraunces_600SemiBold',
  displayMedium: 'Fraunces_500Medium',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
} as const;

// Milliseconds. See the Motion section of docs/DESIGN.md.
export const Motion = {
  rise: 280,
  riseDistance: 12,
  stagger: 70,
  reveal: 220,
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

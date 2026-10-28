import type { SymbolViewProps } from 'expo-symbols';

import type { TrackId } from '@/content/types';

// Each track's color and icon. Hues share a similar lightness so no track
// shouts louder than another. See docs/DESIGN.md.
export type TrackStyle = {
  hue: string; // chip text, icons, progress, and the background glow
  tint: string; // chip and tile background
  icon: SymbolViewProps['name'];
};

const styles: Record<TrackId, TrackStyle> = {
  fire: { hue: '#F59A62', tint: '#2A1E16', icon: { ios: 'flame', android: 'local_fire_department', web: 'local_fire_department' } },
  water: { hue: '#6CC0E4', tint: '#15262E', icon: { ios: 'drop', android: 'water_drop', web: 'water_drop' } },
  shelter: { hue: '#D2A877', tint: '#2A2117', icon: { ios: 'tent', android: 'cottage', web: 'cottage' } },
  'first-aid': { hue: '#F07B76', tint: '#2D1A1A', icon: { ios: 'cross.case', android: 'medical_services', web: 'medical_services' } },
  'wild-food': { hue: '#A9D06F', tint: '#1E2716', icon: { ios: 'leaf', android: 'eco', web: 'eco' } },
  'fishing-trapping': { hue: '#5CC9A8', tint: '#14271F', icon: { ios: 'fish', android: 'phishing', web: 'phishing' } },
  garden: { hue: '#D2D46A', tint: '#232716', icon: { ios: 'carrot', android: 'yard', web: 'yard' } },
  homestead: { hue: '#E3B98A', tint: '#2A2218', icon: { ios: 'house', android: 'agriculture', web: 'agriculture' } },
  'power-tools': { hue: '#EEC25A', tint: '#2B2414', icon: { ios: 'bolt', android: 'bolt', web: 'bolt' } },
  'go-bag': { hue: '#C79BF2', tint: '#241B2D', icon: { ios: 'backpack', android: 'backpack', web: 'backpack' } },
  navigation: { hue: '#9AA8FF', tint: '#1A1E30', icon: { ios: 'safari', android: 'explore', web: 'explore' } },
  disasters: { hue: '#F2A65A', tint: '#2B2016', icon: { ios: 'cloud.bolt.rain', android: 'thunderstorm', web: 'thunderstorm' } },
};

const fallback: TrackStyle = {
  hue: '#B9B3A6',
  tint: '#1B2A22',
  icon: { ios: 'book', android: 'menu_book', web: 'menu_book' },
};

export function trackStyle(track: string): TrackStyle {
  return (styles as Record<string, TrackStyle | undefined>)[track] ?? fallback;
}

// A soft glow of the track's hue in one corner of a dark surface.
export function trackGlow(track: string, corner: 'left' | 'right' = 'left', strength = 0.3): string {
  const { hue } = trackStyle(track);
  const alpha = Math.round(strength * 255).toString(16).padStart(2, '0');
  const x = corner === 'left' ? '0%' : '100%';
  return `radial-gradient(120% 60% at ${x} 0%, ${hue}${alpha} 0%, ${hue}00 70%)`;
}

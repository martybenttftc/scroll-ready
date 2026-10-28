import type { SymbolViewProps } from 'expo-symbols';

import type { ThemeId, TrackId } from '@/content/types';
import { tracks } from '@/content/catalog';

// Color comes from a track's theme, so a theme reads as one family in the feed
// and on Learn. A few signature tracks get their own hue. Hues share a similar
// lightness so no track shouts louder than another. See docs/DESIGN.md.
export type TrackStyle = {
  hue: string; // chip text, icons, progress, and the background glow
  tint: string; // chip and tile background
  icon: SymbolViewProps['name'];
};

type Hue = Pick<TrackStyle, 'hue' | 'tint'>;

export const themeHues: Record<ThemeId, Hue> = {
  wilderness: { hue: '#A9D06F', tint: '#1E2716' },
  'water-food': { hue: '#6CC0E4', tint: '#15262E' },
  health: { hue: '#F07B76', tint: '#2D1A1A' },
  emergency: { hue: '#F2A65A', tint: '#2B2016' },
  gear: { hue: '#C79BF2', tint: '#241B2D' },
  garden: { hue: '#D2D46A', tint: '#232716' },
  homestead: { hue: '#E3B98A', tint: '#2A2218' },
  diy: { hue: '#9AA8FF', tint: '#1A1E30' },
  energy: { hue: '#EEC25A', tint: '#2B2414' },
};

const trackHues: Partial<Record<TrackId, Hue>> = {
  fire: { hue: '#F59A62', tint: '#2A1E16' },
  'fishing-trapping': { hue: '#5CC9A8', tint: '#14271F' },
};

const sym = (ios: SFName, android: AndroidName): SymbolViewProps['name'] => ({ ios, android, web: android });
type SymbolNames = Exclude<SymbolViewProps['name'], string>;
type SFName = NonNullable<SymbolNames['ios']>;
type AndroidName = NonNullable<SymbolNames['android']>;

const icons: Record<TrackId, SymbolViewProps['name']> = {
  fire: sym('flame', 'local_fire_department'),
  shelter: sym('tent', 'camping'),
  navigation: sym('safari', 'explore'),
  signaling: sym('megaphone', 'campaign'),
  knots: sym('link', 'link'),
  bushcraft: sym('tree', 'forest'),
  'wild-food': sym('leaf', 'eco'),
  'fishing-trapping': sym('fish', 'phishing'),
  weather: sym('cloud.sun', 'partly_cloudy_day'),
  water: sym('drop', 'water_drop'),
  'food-storage': sym('archivebox', 'shelves'),
  canning: sym('cylinder.split.1x2', 'inventory_2'),
  'off-grid-cooking': sym('frying.pan', 'outdoor_grill'),
  'first-aid': sym('cross.case', 'medical_services'),
  'medical-kit': sym('bandage', 'healing'),
  sanitation: sym('hands.sparkles', 'sanitizer'),
  mindset: sym('brain.head.profile', 'psychology'),
  disasters: sym('exclamationmark.triangle', 'warning'),
  storms: sym('hurricane', 'cyclone'),
  floods: sym('water.waves', 'flood'),
  earthquakes: sym('waveform.path', 'earthquake'),
  wildfire: sym('smoke', 'whatshot'),
  'winter-weather': sym('snowflake', 'ac_unit'),
  heat: sym('thermometer.sun', 'thermostat'),
  'power-outage': sym('lightbulb.slash', 'power_off'),
  evacuation: sym('figure.walk', 'directions_run'),
  communication: sym('antenna.radiowaves.left.and.right', 'cell_tower'),
  'go-bag': sym('backpack', 'backpack'),
  'home-kit': sym('house', 'home'),
  'everyday-carry': sym('key', 'key'),
  garden: sym('carrot', 'yard'),
  'soil-compost': sym('arrow.3.trianglepath', 'compost'),
  'seed-saving': sym('leaf.circle', 'grass'),
  herbs: sym('leaf.fill', 'spa'),
  'fruit-trees': sym('tree.fill', 'park'),
  pests: sym('ladybug', 'pest_control'),
  homestead: sym('house.lodge', 'agriculture'),
  chickens: sym('bird', 'egg'),
  bees: sym('hexagon', 'hive'),
  goats: sym('pawprint', 'pets'),
  'home-repair': sym('hammer', 'handyman'),
  plumbing: sym('spigot', 'plumbing'),
  sewing: sym('scissors', 'content_cut'),
  'hand-tools': sym('screwdriver', 'construction'),
  vehicle: sym('car', 'directions_car'),
  power: sym('bolt', 'bolt'),
  solar: sym('sun.max', 'solar_power'),
  heating: sym('heater.vertical', 'fireplace'),
};

const fallback: TrackStyle = {
  hue: '#B9B3A6',
  tint: '#1B2A22',
  icon: sym('book', 'menu_book'),
};

export function trackStyle(trackId: string): TrackStyle {
  const track = tracks.find((t) => t.id === trackId);
  if (!track) return fallback;
  return { ...themeHues[track.theme], ...trackHues[track.id], icon: icons[track.id] };
}

// A soft glow of the track's hue in one corner of a dark surface.
export function trackGlow(trackId: string, corner: 'left' | 'right' = 'left', strength = 0.3): string {
  const { hue } = trackStyle(trackId);
  const alpha = Math.round(strength * 255).toString(16).padStart(2, '0');
  const x = corner === 'left' ? '0%' : '100%';
  return `radial-gradient(120% 60% at ${x} 0%, ${hue}${alpha} 0%, ${hue}00 70%)`;
}

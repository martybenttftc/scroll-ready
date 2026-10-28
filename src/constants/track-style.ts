import type { SymbolViewProps } from 'expo-symbols';

import type { TrackId } from '@/content/types';

// Every track has its own icon, drawn in one neutral color. The app keeps to a
// single accent (blaze), so tracks don't each get a hue. See docs/DESIGN.md.

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

const fallback = sym('book', 'menu_book');

export function trackIcon(trackId: string): SymbolViewProps['name'] {
  return icons[trackId as TrackId] ?? fallback;
}

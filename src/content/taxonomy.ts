import type { Theme, Track, TrackId } from './types';

// The browse tree. Adding a track here and a folder in content/ is all it takes to add one.

export const themes: Theme[] = [
  { id: 'wilderness', title: 'Wilderness', blurb: 'Fire, shelter, and finding your way.' },
  { id: 'water-food', title: 'Water and food', blurb: 'Keep it safe, store it, cook it.' },
  { id: 'health', title: 'Health', blurb: 'First aid, hygiene, and a steady head.' },
  { id: 'emergency', title: 'Emergencies', blurb: 'Storms, floods, outages, and leaving fast.' },
  { id: 'gear', title: 'Gear', blurb: 'Pack once, be ready.' },
  { id: 'garden', title: 'Garden', blurb: 'Grow your own food.' },
  { id: 'homestead', title: 'Homestead', blurb: 'Animals, land, and self-reliance.' },
  { id: 'diy', title: 'Fix it', blurb: 'Repair, mend, and make do.' },
  { id: 'energy', title: 'Power and heat', blurb: 'Generators, solar, and staying warm.' },
];

export const tracks: Track[] = [
  { id: 'fire', theme: 'wilderness', title: 'Fire', blurb: 'Light it, keep it, put it out.' },
  { id: 'shelter', theme: 'wilderness', title: 'Shelter', blurb: 'Stay dry, stay warm.' },
  { id: 'navigation', theme: 'wilderness', title: 'Navigation', blurb: 'Know where you are.' },
  { id: 'signaling', theme: 'wilderness', title: 'Signaling', blurb: 'Help them find you.' },
  { id: 'knots', theme: 'wilderness', title: 'Knots and rope', blurb: 'A few knots do most jobs.' },
  { id: 'bushcraft', theme: 'wilderness', title: 'Bushcraft', blurb: 'Knife, axe, and saw work.' },
  { id: 'wild-food', theme: 'wilderness', title: 'Wild food', blurb: 'What to eat, what to avoid.' },
  { id: 'fishing-trapping', theme: 'wilderness', title: 'Fishing and trapping', blurb: 'Food without a rod.' },
  { id: 'weather', theme: 'wilderness', title: 'Reading weather', blurb: 'See it coming.' },

  { id: 'water', theme: 'water-food', title: 'Water', blurb: 'Find it and make it safe.' },
  { id: 'food-storage', theme: 'water-food', title: 'Food storage', blurb: 'A pantry that lasts.' },
  { id: 'canning', theme: 'water-food', title: 'Canning and preserving', blurb: 'Put up the harvest safely.' },
  { id: 'off-grid-cooking', theme: 'water-food', title: 'Off-grid cooking', blurb: 'Hot food without the stove.' },

  { id: 'first-aid', theme: 'health', title: 'First aid', blurb: 'Act fast when it matters.' },
  { id: 'medical-kit', theme: 'health', title: 'Medical kit', blurb: 'What to pack and why.' },
  { id: 'sanitation', theme: 'health', title: 'Hygiene and sanitation', blurb: 'Stay clean when the water stops.' },
  { id: 'mindset', theme: 'health', title: 'Mindset', blurb: 'Stay calm and think clearly.' },

  { id: 'disasters', theme: 'emergency', title: 'Disaster basics', blurb: 'Plans that work for any emergency.' },
  { id: 'storms', theme: 'emergency', title: 'Storms and hurricanes', blurb: 'Before, during, after.' },
  { id: 'floods', theme: 'emergency', title: 'Floods', blurb: 'Turn around, don’t drown.' },
  { id: 'earthquakes', theme: 'emergency', title: 'Earthquakes', blurb: 'Drop, cover, hold on.' },
  { id: 'wildfire', theme: 'emergency', title: 'Wildfire', blurb: 'Defensible space and leaving early.' },
  { id: 'winter-weather', theme: 'emergency', title: 'Winter storms', blurb: 'Cold, ice, and being snowed in.' },
  { id: 'heat', theme: 'emergency', title: 'Extreme heat', blurb: 'Stay cool, spot heat illness.' },
  { id: 'power-outage', theme: 'emergency', title: 'Power outages', blurb: 'When the lights go out.' },
  { id: 'evacuation', theme: 'emergency', title: 'Evacuation', blurb: 'Know when and how to go.' },
  { id: 'communication', theme: 'emergency', title: 'Communication', blurb: 'Radios and family plans.' },

  { id: 'go-bag', theme: 'gear', title: 'Go-bag', blurb: 'Grab it and go.' },
  { id: 'home-kit', theme: 'gear', title: 'Home kit', blurb: 'Two weeks at home.' },
  { id: 'everyday-carry', theme: 'gear', title: 'Everyday carry', blurb: 'Small things that help daily.' },

  { id: 'garden', theme: 'garden', title: 'Vegetable garden', blurb: 'From seed to harvest.' },
  { id: 'soil-compost', theme: 'garden', title: 'Soil and compost', blurb: 'Feed the soil first.' },
  { id: 'seed-saving', theme: 'garden', title: 'Seed saving', blurb: 'Grow next year’s garden.' },
  { id: 'herbs', theme: 'garden', title: 'Herbs', blurb: 'Easy wins in small spaces.' },
  { id: 'fruit-trees', theme: 'garden', title: 'Fruit and berries', blurb: 'Plant once, pick for years.' },
  { id: 'pests', theme: 'garden', title: 'Pests and problems', blurb: 'Fix it without guessing.' },

  { id: 'homestead', theme: 'homestead', title: 'Homestead basics', blurb: 'Plan the land and the work.' },
  { id: 'chickens', theme: 'homestead', title: 'Chickens', blurb: 'Eggs from the backyard.' },
  { id: 'bees', theme: 'homestead', title: 'Bees', blurb: 'Honey and pollination.' },
  { id: 'goats', theme: 'homestead', title: 'Goats', blurb: 'Milk, brush, and fences.' },

  { id: 'home-repair', theme: 'diy', title: 'Home repair', blurb: 'Fix it before you call.' },
  { id: 'plumbing', theme: 'diy', title: 'Plumbing basics', blurb: 'Shutoffs, leaks, and clogs.' },
  { id: 'sewing', theme: 'diy', title: 'Sewing and mending', blurb: 'Make it last longer.' },
  { id: 'hand-tools', theme: 'diy', title: 'Hand tools', blurb: 'Use and care for the basics.' },
  { id: 'vehicle', theme: 'diy', title: 'Car basics', blurb: 'Tires, jumps, and winter kits.' },

  { id: 'power', theme: 'energy', title: 'Generators', blurb: 'Run them safely.' },
  { id: 'solar', theme: 'energy', title: 'Solar and batteries', blurb: 'Small power, no fuel.' },
  { id: 'heating', theme: 'energy', title: 'Heating', blurb: 'Stay warm without the furnace.' },
];

// Every card in these tracks must be riskTier 'expert' (CLAUDE.md, ADR 0002).
export const EXPERT_TRACKS: TrackId[] = ['first-aid', 'wild-food', 'power'];

// Content model: Theme -> Track -> Skill -> Card. Mirrors Book -> Chapter -> Verse.
// Themes and tracks live in taxonomy.ts. Skills and cards live in content/<track>/<skill>.json.
// See docs/PRODUCT.md and ADR 0003.

export type ThemeId =
  | 'wilderness'
  | 'water-food'
  | 'health'
  | 'emergency'
  | 'gear'
  | 'garden'
  | 'homestead'
  | 'diy'
  | 'energy';

export type TrackId =
  // wilderness
  | 'fire'
  | 'shelter'
  | 'navigation'
  | 'signaling'
  | 'knots'
  | 'bushcraft'
  | 'wild-food'
  | 'fishing-trapping'
  | 'weather'
  // water-food
  | 'water'
  | 'food-storage'
  | 'canning'
  | 'off-grid-cooking'
  // health
  | 'first-aid'
  | 'medical-kit'
  | 'sanitation'
  | 'mindset'
  // emergency
  | 'disasters'
  | 'storms'
  | 'floods'
  | 'earthquakes'
  | 'wildfire'
  | 'winter-weather'
  | 'heat'
  | 'power-outage'
  | 'evacuation'
  | 'communication'
  // gear
  | 'go-bag'
  | 'home-kit'
  | 'everyday-carry'
  // garden
  | 'garden'
  | 'soil-compost'
  | 'seed-saving'
  | 'herbs'
  | 'fruit-trees'
  | 'pests'
  // homestead
  | 'homestead'
  | 'chickens'
  | 'bees'
  | 'goats'
  // diy
  | 'home-repair'
  | 'plumbing'
  | 'sewing'
  | 'hand-tools'
  | 'vehicle'
  // energy
  | 'power'
  | 'solar'
  | 'heating';

export type CardType = 'tip' | 'step' | 'myth' | 'quiz' | 'scenario' | 'gear' | 'checklist';

// standard: general knowledge. caution: can cause harm if done wrong.
// expert: can seriously hurt someone. Any disagreement between sources blocks it (ADR 0002).
export type RiskTier = 'standard' | 'caution' | 'expert';

export type Theme = {
  id: ThemeId;
  title: string;
  blurb: string;
};

export type Track = {
  id: TrackId;
  theme: ThemeId;
  title: string;
  blurb: string;
};

export type Skill = {
  id: string; // the JSON file name
  track: TrackId; // the JSON file's folder
  title: string;
  summary?: string;
  outline?: string[]; // card ideas planned but not drafted yet
  cardIds: string[]; // in file order
};

export type Source = {
  title: string;
  url?: string;
};

export type Card = {
  id: string;
  track: TrackId; // set by the loader from the file path
  skill: string; // set by the loader from the file path
  stepOrder?: number;
  type: CardType;
  headline: string; // 12 words or fewer
  body: string; // 40 words or fewer
  image?: string;
  deeper?: string; // Go Deeper sheet (premium)
  mistakes?: string[];
  gearIds?: string[];
  quiz?: { choices: string[]; answerIndex: number };
  // Myth cards only: is the common claim a myth or a fact? Standard and caution myth cards put the bare
  // claim in the headline so people can guess. Expert ones state the safe answer, since some won't tap.
  verdict?: 'myth' | 'fact';
  regions?: string[];
  seasons?: ('spring' | 'summer' | 'fall' | 'winter')[];
  difficulty: 1 | 2 | 3;
  riskTier: RiskTier;
  draftedBy?: string; // who wrote the card (agent role and session)
  verifiedBy?: string; // who checked it against its sources. Must differ from draftedBy.
  verifiedOn?: string; // YYYY-MM-DD the sources were checked. See ADR 0002.
  sources: Source[];
  isFree: boolean;
  offlineCore: boolean; // always bundled in the app binary
};

export const MIN_SOURCES_TO_SHIP = 3;

// Sources count once per site, and a source with no URL can't be re-checked, so it doesn't count.
export function independentSourceCount(card: Card): number {
  const hosts = new Set<string>();
  for (const s of card.sources) {
    const host = s.url?.match(/^https?:\/\/(?:www\.)?([^/:?#]+)/i)?.[1];
    if (host) hosts.add(host.toLowerCase());
  }
  return hosts.size;
}

const isIsoDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));

// Why a card can't ship yet. Empty means it can. See ADR 0002.
export function shipBlockers(card: Card): string[] {
  const blockers: string[] = [];
  const count = independentSourceCount(card);
  if (count < MIN_SOURCES_TO_SHIP) blockers.push(`${count} of ${MIN_SOURCES_TO_SHIP} independent sources`);
  if (!card.verifiedOn || !isIsoDate(card.verifiedOn)) blockers.push('no valid verifiedOn date');
  if (!card.verifiedBy) blockers.push('no verifiedBy');
  else if (card.verifiedBy === card.draftedBy) blockers.push('verified by its own drafter');
  return blockers;
}

export function isShippable(card: Card): boolean {
  return shipBlockers(card).length === 0;
}

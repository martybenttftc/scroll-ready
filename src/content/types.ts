// Content model: Track -> Skill -> Card. Mirrors Book -> Chapter -> Verse.
// See docs/PRODUCT.md for the full spec.

export type TrackId =
  | 'fire'
  | 'water'
  | 'shelter'
  | 'first-aid'
  | 'wild-food'
  | 'fishing-trapping'
  | 'garden'
  | 'homestead'
  | 'power-tools'
  | 'go-bag'
  | 'navigation'
  | 'disasters';

export type CardType = 'tip' | 'step' | 'myth' | 'quiz' | 'scenario' | 'gear' | 'checklist';

// standard: general knowledge. caution: can cause harm if done wrong.
// expert: must be signed off by a credentialed reviewer before it ships.
export type RiskTier = 'standard' | 'caution' | 'expert';

export type Track = {
  id: TrackId;
  title: string;
  blurb: string;
};

export type Skill = {
  id: string;
  track: TrackId;
  title: string;
  cardIds: string[];
};

export type Source = {
  title: string;
  url?: string;
};

export type Card = {
  id: string;
  track: TrackId;
  skill?: string;
  stepOrder?: number;
  type: CardType;
  headline: string; // 12 words or fewer
  body: string; // 40 words or fewer
  image?: string;
  deeper?: string; // Go Deeper sheet (premium)
  mistakes?: string[];
  gearIds?: string[];
  quiz?: { choices: string[]; answerIndex: number };
  regions?: string[];
  seasons?: ('spring' | 'summer' | 'fall' | 'winter')[];
  difficulty: 1 | 2 | 3;
  riskTier: RiskTier;
  verifiedOn?: string; // ISO date a reviewer confirmed 3+ sources agree. See ADR 0002.
  sources: Source[];
  isFree: boolean;
  offlineCore: boolean; // always bundled in the app binary
};

export const MIN_SOURCES_TO_SHIP = 3;

export function isShippable(card: Card): boolean {
  return card.sources.length >= MIN_SOURCES_TO_SHIP && Boolean(card.verifiedOn);
}

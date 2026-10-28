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

// How a photo or video may be used. Each one needs a page that states it (sourceUrl). ADR 0004.
// public-domain: US federal works and the like. own: we shot it. licensed: we paid for it.
export type MediaLicense = 'public-domain' | 'cc0' | 'cc-by' | 'cc-by-sa' | 'licensed' | 'own';

export type Media = {
  kind: 'photo' | 'video';
  url: string; // https. A photo file, or a video as .mp4 or an .m3u8 HLS stream. Plays in the app.
  alt: string; // what it shows, for screen readers
  poster?: string; // video only: a still shown before it plays
  license: MediaLicense;
  credit: string; // who made it, as the license asks to credit them
  sourceUrl: string; // the page that states the license
  aiGenerated?: boolean; // never on caution or expert cards
  // Who checked that it shows what the card says and that the license holds. Must differ from
  // the card's draftedBy, and a card with unchecked media can't ship. Swapping media clears it.
  verifiedBy?: string;
};

export type Card = {
  id: string;
  track: TrackId; // set by the loader from the file path
  skill: string; // set by the loader from the file path
  stepOrder?: number;
  type: CardType;
  headline: string; // 12 words or fewer
  body: string; // 40 words or fewer
  media?: Media;
  deeper?: string; // Go Deeper sheet (premium)
  mistakes?: string[];
  gearIds?: string[]; // ids in src/content/gear.ts
  quiz?: { choices: string[]; answerIndex: number };
  // Myth cards only: whether the common belief the card is about is a myth or a fact. On standard cards
  // the headline is that belief, so the UI can show the verdict as the answer. On caution and expert
  // cards the headline states the safe answer instead, so the UI must not badge the headline with it.
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
  if (card.media && !card.media.verifiedBy) blockers.push('media not verified');
  else if (card.media && card.media.verifiedBy === card.draftedBy) blockers.push('media verified by its drafter');
  return blockers;
}

export function isShippable(card: Card): boolean {
  return shipBlockers(card).length === 0;
}

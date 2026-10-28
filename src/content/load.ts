import { tracks } from './taxonomy';
import type { Card, CardType, Media, MediaLicense, RiskTier, Skill, Source, TrackId } from './types';

// Turns content/<track>/<skill>.json files into skills and cards. The app and
// scripts/check-content.ts both use this, so they always agree on what a file means.

export type ContentFile = { path: string; data: unknown };

export type Catalog = { skills: Skill[]; cards: Card[]; problems: string[] };

const CARD_TYPES: CardType[] = ['tip', 'step', 'myth', 'quiz', 'scenario', 'gear', 'checklist'];
const RISK_TIERS: RiskTier[] = ['standard', 'caution', 'expert'];
const SEASONS = ['spring', 'summer', 'fall', 'winter'] as const;
const MEDIA_KINDS = ['photo', 'video'] as const;
const MEDIA_LICENSES: MediaLicense[] = ['public-domain', 'cc0', 'cc-by', 'cc-by-sa', 'licensed', 'own'];
const SKILL_FIELDS = ['title', 'summary', 'outline', 'cards'];
const trackIds = new Set<string>(tracks.map((t) => t.id));

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const isStrList = (v: unknown): v is string[] => Array.isArray(v) && v.every(isStr);
const isOneOf = <T extends string>(list: readonly T[], v: unknown): v is T =>
  typeof v === 'string' && (list as readonly string[]).includes(v);

// "./water/purify-water.json" or "content/water/purify-water.json" -> ["water", "purify-water"]
function parsePath(path: string): [string, string] | null {
  const m = path.match(/([^/]+)\/([^/]+)\.json$/);
  return m ? [m[1], m[2]] : null;
}

function parseSource(v: unknown): Source | null {
  if (!isObj(v) || !isStr(v.title)) return null;
  if (v.url !== undefined && !isStr(v.url)) return null;
  return { title: v.title, ...(isStr(v.url) && { url: v.url }) };
}

const isHttps = (v: unknown): v is string => isStr(v) && /^https:\/\/[^\s]+$/.test(v);

function parseMedia(v: unknown): Media | null {
  if (!isObj(v) || !isOneOf(MEDIA_KINDS, v.kind) || !isHttps(v.url) || !isStr(v.alt)) return null;
  if (!isOneOf(MEDIA_LICENSES, v.license) || !isStr(v.credit) || !isHttps(v.sourceUrl)) return null;
  if (v.poster !== undefined && (v.kind !== 'video' || !isHttps(v.poster))) return null;
  if (v.aiGenerated !== undefined && typeof v.aiGenerated !== 'boolean') return null;
  if (v.verifiedBy !== undefined && !isStr(v.verifiedBy)) return null;
  const known = ['kind', 'url', 'alt', 'poster', 'license', 'credit', 'sourceUrl', 'aiGenerated', 'verifiedBy'];
  if (Object.keys(v).some((k) => !known.includes(k))) return null;
  return {
    kind: v.kind,
    url: v.url,
    alt: v.alt,
    license: v.license,
    credit: v.credit,
    sourceUrl: v.sourceUrl,
    ...(isStr(v.poster) && { poster: v.poster }),
    ...(v.aiGenerated === true && { aiGenerated: true }),
    ...(isStr(v.verifiedBy) && { verifiedBy: v.verifiedBy }),
  };
}

function parseCard(v: unknown, track: TrackId, skill: string, problem: (msg: string) => void): Card | null {
  if (!isObj(v) || !isStr(v.id)) {
    problem('card is missing an id');
    return null;
  }
  const at = `card "${v.id}"`;
  const bad = (field: string): null => {
    problem(`${at}: bad or missing ${field}`);
    return null;
  };
  if (!isOneOf(CARD_TYPES, v.type)) return bad('type');
  if (!isStr(v.headline)) return bad('headline');
  if (!isStr(v.body)) return bad('body');
  if (v.difficulty !== 1 && v.difficulty !== 2 && v.difficulty !== 3) return bad('difficulty');
  if (!isOneOf(RISK_TIERS, v.riskTier)) return bad('riskTier');
  if (typeof v.isFree !== 'boolean') return bad('isFree');
  if (typeof v.offlineCore !== 'boolean') return bad('offlineCore');
  if (!Array.isArray(v.sources)) return bad('sources');
  const sources: Source[] = [];
  for (const s of v.sources) {
    const parsed = parseSource(s);
    if (!parsed) return bad('source');
    sources.push(parsed);
  }

  const card: Card = {
    id: v.id,
    track,
    skill,
    type: v.type,
    headline: v.headline,
    body: v.body,
    difficulty: v.difficulty,
    riskTier: v.riskTier,
    sources,
    isFree: v.isFree,
    offlineCore: v.offlineCore,
  };
  if (v.stepOrder !== undefined) {
    if (typeof v.stepOrder !== 'number') return bad('stepOrder');
    card.stepOrder = v.stepOrder;
  }
  for (const key of ['deeper', 'draftedBy', 'verifiedBy', 'verifiedOn'] as const) {
    const value = v[key];
    if (value === undefined) continue;
    if (!isStr(value)) return bad(key);
    card[key] = value;
  }
  for (const key of ['mistakes', 'gearIds', 'regions'] as const) {
    const value = v[key];
    if (value === undefined) continue;
    if (!isStrList(value)) return bad(key);
    card[key] = value;
  }
  if (v.seasons !== undefined) {
    if (!Array.isArray(v.seasons) || !v.seasons.every((s) => isOneOf(SEASONS, s))) return bad('seasons');
    card.seasons = v.seasons;
  }
  if (v.media !== undefined) {
    const media = parseMedia(v.media);
    if (!media) return bad('media');
    card.media = media;
  }
  if (v.verdict !== undefined) {
    if (v.verdict !== 'myth' && v.verdict !== 'fact') return bad('verdict');
    card.verdict = v.verdict;
  }
  if (v.quiz !== undefined) {
    const q = v.quiz;
    if (!isObj(q) || !isStrList(q.choices) || typeof q.answerIndex !== 'number') return bad('quiz');
    card.quiz = { choices: q.choices, answerIndex: q.answerIndex };
  }
  for (const key of Object.keys(v)) {
    if (key === 'track' || key === 'skill') problem(`${at}: "${key}" is set from the file path; remove it`);
    else if (!(key in card)) problem(`${at}: unknown field "${key}"`);
  }
  return card;
}

export function loadCatalog(files: ContentFile[]): Catalog {
  const skills: Skill[] = [];
  const cards: Card[] = [];
  const problems: string[] = [];
  const seen = new Set<string>();
  const skillTracks = new Map<string, string>();

  for (const file of [...files].sort((a, b) => a.path.localeCompare(b.path))) {
    const problem = (msg: string) => problems.push(`${file.path}: ${msg}`);
    const parts = parsePath(file.path);
    if (!parts) {
      problem('expected content/<track>/<skill>.json');
      continue;
    }
    const [track, skillId] = parts;
    // Metro can list one file under two keys, so the same track/skill pair is skipped.
    if (seen.has(`${track}/${skillId}`)) continue;
    seen.add(`${track}/${skillId}`);
    if (!trackIds.has(track)) {
      problem(`unknown track folder "${track}" (add it to src/content/taxonomy.ts)`);
      continue;
    }
    const trackId = track as TrackId;
    const d = file.data;
    if (!isObj(d) || !isStr(d.title) || !Array.isArray(d.cards)) {
      problem('needs a "title" and a "cards" array');
      continue;
    }
    // Skill ids are global so a card's skill id alone finds its skill.
    const other = skillTracks.get(skillId);
    if (other) problem(`skill id "${skillId}" is already used in content/${other}/; pick a unique file name`);
    skillTracks.set(skillId, track);
    for (const key of Object.keys(d)) {
      if (!SKILL_FIELDS.includes(key)) problem(`unknown skill field "${key}"`);
    }
    if (d.summary !== undefined && !isStr(d.summary)) problem('bad summary');
    if (d.outline !== undefined && !isStrList(d.outline)) problem('bad outline');

    const skillCards: Card[] = [];
    for (const raw of d.cards) {
      const card = parseCard(raw, trackId, skillId, problem);
      if (card) skillCards.push(card);
    }
    skills.push({
      id: skillId,
      track: trackId,
      title: d.title,
      ...(isStr(d.summary) && { summary: d.summary }),
      ...(isStrList(d.outline) && { outline: d.outline }),
      cardIds: skillCards.map((c) => c.id),
    });
    cards.push(...skillCards);
  }
  return { skills, cards, problems };
}

// The feed takes one skill from each track in turn, so a big track doesn't bury the rest.
// A skill's cards play back to back in file order, so its progress segments fill up one
// card at a time instead of jumping to another skill after each card.
export function feedOrder(cards: Card[]): Card[] {
  // Grouped by skill id, not by adjacency, so a filtered or re-sorted input still keeps
  // each skill together. Maps keep insertion order, so file order holds.
  const byTrack = new Map<TrackId, Map<string, Card[]>>();
  for (const card of cards) {
    const skills = byTrack.get(card.track) ?? new Map<string, Card[]>();
    const list = skills.get(card.skill) ?? [];
    list.push(card);
    skills.set(card.skill, list);
    byTrack.set(card.track, skills);
  }
  const queues = [...byTrack.values()].map((skills) => [...skills.values()]);
  const out: Card[] = [];
  for (let i = 0; out.length < cards.length; i++) {
    for (const q of queues) if (i < q.length) out.push(...q[i]);
  }
  return out;
}

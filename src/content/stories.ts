import { tracks } from './taxonomy';
import type { Source, TrackId } from './types';

// Story of the day: one true survival or DIY story a day, read in about a minute.
// Stories live in stories/<id>.json and follow the same 3-source rule as cards (ADR 0002, ADR 0005).

export type StoryKind = 'survival' | 'diy';

export const kindLabel: Record<StoryKind, string> = {
  survival: 'Survival',
  diy: 'Do-it-yourself',
};

export type Story = {
  id: string; // the JSON file name
  kind: StoryKind;
  title: string; // 8 words or fewer
  dek: string; // one-line hook, 25 words or fewer
  when: string; // "1914–1916"
  where: string; // "Weddell Sea, Antarctica"
  paragraphs: string[]; // the story, 250 words or fewer in all
  takeaway: string; // what it teaches, 40 words or fewer
  track: TrackId; // the track the takeaway points to
  draftedBy?: string;
  verifiedBy?: string;
  verifiedOn?: string;
  sources: Source[];
};

export type StoryFile = { path: string; data: unknown };

const KINDS: StoryKind[] = ['survival', 'diy'];
const FIELDS = [
  'kind',
  'title',
  'dek',
  'when',
  'where',
  'paragraphs',
  'takeaway',
  'track',
  'draftedBy',
  'verifiedBy',
  'verifiedOn',
  'sources',
];
const trackIds = new Set<string>(tracks.map((t) => t.id));

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const isOneOf = <T extends string>(list: readonly T[], v: unknown): v is T =>
  typeof v === 'string' && (list as readonly string[]).includes(v);

export function loadStories(files: StoryFile[]): { stories: Story[]; problems: string[] } {
  const stories: Story[] = [];
  const problems: string[] = [];
  const seen = new Set<string>();

  for (const file of [...files].sort((a, b) => a.path.localeCompare(b.path))) {
    const id = file.path.match(/([^/]+)\.json$/)?.[1];
    // Metro can list one file under two keys.
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const problem = (msg: string) => problems.push(`${file.path}: ${msg}`);
    const d = file.data;
    if (!isObj(d)) {
      problem('expected an object');
      continue;
    }
    for (const key of Object.keys(d)) if (!FIELDS.includes(key)) problem(`unknown field "${key}"`);
    const missing = ['title', 'dek', 'when', 'where', 'takeaway'].filter((k) => !isStr(d[k]));
    if (missing.length) problem(`bad or missing ${missing.join(', ')}`);
    if (!isOneOf(KINDS, d.kind)) problem('kind must be "survival" or "diy"');
    if (!Array.isArray(d.paragraphs) || d.paragraphs.length === 0 || !d.paragraphs.every(isStr)) {
      problem('paragraphs must be a list of text');
    }
    if (!(isStr(d.track) && trackIds.has(d.track))) problem(`bad or missing track "${String(d.track)}"`);
    for (const key of ['draftedBy', 'verifiedBy', 'verifiedOn'] as const) {
      if (d[key] !== undefined && !isStr(d[key])) problem(`bad ${key}`);
    }
    const sources: Source[] = [];
    if (!Array.isArray(d.sources)) problem('needs a sources list');
    else
      for (const s of d.sources) {
        if (isObj(s) && isStr(s.title) && (s.url === undefined || isStr(s.url))) {
          sources.push({ title: s.title, ...(isStr(s.url) && { url: s.url }) });
        } else problem('bad source');
      }
    if (problems.some((p) => p.startsWith(`${file.path}:`))) continue;

    stories.push({
      id,
      kind: d.kind as StoryKind,
      title: d.title as string,
      dek: d.dek as string,
      when: d.when as string,
      where: d.where as string,
      paragraphs: d.paragraphs as string[],
      takeaway: d.takeaway as string,
      track: d.track as TrackId,
      ...(isStr(d.draftedBy) && { draftedBy: d.draftedBy }),
      ...(isStr(d.verifiedBy) && { verifiedBy: d.verifiedBy }),
      ...(isStr(d.verifiedOn) && { verifiedOn: d.verifiedOn }),
      sources,
    });
  }
  return { stories, problems };
}

// Days since 1970-01-01 in the device's time zone, so the story turns over at local midnight.
export function localDayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

// Everyone sees the same story on the same local date, and the list cycles in file-name order.
export function storyForDay(stories: Story[], day: number): Story | undefined {
  if (stories.length === 0) return undefined;
  return stories[day % stories.length];
}

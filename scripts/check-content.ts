/// <reference types="node" />
// Validates content/<track>/<skill>.json. `--release` also blocks cards not yet verified
// against 3+ sources (ADR 0002). `--stats` prints coverage per theme and track (ADR 0003).
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

import { loadCatalog, type ContentFile } from '../src/content/load';
import { EXPERT_TRACKS, themes, tracks } from '../src/content/taxonomy';
import { isShippable, shipBlockers } from '../src/content/types';

const release = process.argv.includes('--release');
const stats = process.argv.includes('--stats');
const root = process.cwd();
const contentDir = join(root, 'content');

const errors: string[] = [];
const warnings: string[] = [];

function readFiles(dir: string): ContentFile[] {
  const out: ContentFile[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...readFiles(full));
    else if (entry.name.endsWith('.json')) {
      const path = relative(root, full);
      try {
        out.push({ path, data: JSON.parse(readFileSync(full, 'utf8')) });
      } catch (e) {
        errors.push(`${path}: invalid JSON (${(e as Error).message})`);
      }
    }
  }
  return out;
}

const { skills, cards, problems } = loadCatalog(readFiles(contentDir));
errors.push(...problems);

const ids = new Set<string>();
const words = (s: string) => s.trim().split(/\s+/).length;
const text = (c: (typeof cards)[number]) => [c.headline, c.body, c.deeper ?? '', ...(c.mistakes ?? [])].join(' ');

for (const card of cards) {
  const at = `${card.track}/${card.skill}: card "${card.id}"`;
  if (ids.has(card.id)) errors.push(`${at}: duplicate id`);
  ids.add(card.id);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(card.id)) errors.push(`${at}: id must be kebab-case`);
  if (card.sources.length === 0) errors.push(`${at}: needs at least one source`);
  if (words(card.headline) > 12) errors.push(`${at}: headline over 12 words`);
  if (words(card.body) > 40) errors.push(`${at}: body over 40 words`);
  if (card.type === 'quiz' && !card.quiz) errors.push(`${at}: quiz card has no quiz`);
  if (card.type === 'myth' && !card.verdict) errors.push(`${at}: myth card needs a verdict ("myth" or "fact")`);
  if (card.type !== 'myth' && card.verdict) errors.push(`${at}: only myth cards take a verdict`);
  if (card.type === 'myth' && card.riskTier !== 'expert' && /\b(myth|fact)\b/i.test(card.headline)) {
    errors.push(`${at}: write the bare claim in the headline; the verdict field holds the answer`);
  }
  if (card.quiz && (card.quiz.answerIndex < 0 || card.quiz.answerIndex >= card.quiz.choices.length)) {
    errors.push(`${at}: quiz answerIndex out of range`);
  }
  const titles = card.sources.map((s) => s.title);
  if (new Set(titles).size !== titles.length) errors.push(`${at}: duplicate source`);
  if (!card.draftedBy) errors.push(`${at}: no draftedBy`);

  // Guardrails from CLAUDE.md. These catch omissions; the content-safety agent still reads every card.
  if (EXPERT_TRACKS.includes(card.track) && card.riskTier !== 'expert') {
    errors.push(`${at}: cards in the ${card.track} track must be riskTier "expert"`);
  }
  if (card.track === 'first-aid' && !/\b911\b/.test(text(card))) {
    errors.push(`${at}: first aid cards must point to calling 911`);
  }
  const sentences = text(card).split(/(?<=[.!?])\s+/);
  if (sentences.some((s) => /back[\s-]?feed/i.test(s) && !/\bnever\b/i.test(s))) {
    errors.push(`${at}: mentions backfeeding without saying never in the same sentence`);
  }

  const blockers = shipBlockers(card);
  if (blockers.length) (release ? errors : warnings).push(`${at}: not verified (${blockers.join(', ')})`);
}

for (const skill of skills) {
  if (skill.cardIds.length === 0 && !skill.outline?.length) {
    warnings.push(`${skill.track}/${skill.id}: no cards and no outline`);
  }
}

if (stats) {
  const pad = (s: string | number, n: number) => String(s).padEnd(n);
  console.log(`${pad('track', 26)}${pad('skills', 8)}${pad('planned', 9)}${pad('drafted', 9)}verified`);
  for (const theme of themes) {
    console.log(`\n${theme.title}`);
    for (const track of tracks.filter((t) => t.theme === theme.id)) {
      const ts = skills.filter((s) => s.track === track.id);
      const tc = cards.filter((c) => c.track === track.id);
      const planned = ts.reduce((n, s) => n + (s.outline?.length ?? 0), 0);
      console.log(
        `  ${pad(track.id, 24)}${pad(ts.length, 8)}${pad(planned, 9)}${pad(tc.length, 9)}${tc.filter(isShippable).length}`,
      );
    }
  }
  console.log('');
}

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);
console.log(
  `${cards.length} cards in ${skills.length} skills checked (${cards.filter(isShippable).length} verified): ` +
    `${errors.length} errors, ${warnings.length} warnings`,
);
process.exit(errors.length ? 1 : 0);

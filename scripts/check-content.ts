// Validates content cards. `--release` also blocks unreviewed expert-tier cards.
import { cards, skills, tracks } from '../src/content/seed';
import { isShippable } from '../src/content/types';

const release = process.argv.includes('--release');
const errors: string[] = [];
const warnings: string[] = [];
const ids = new Set<string>();
const trackIds = new Set(tracks.map((t) => t.id));
const words = (s: string) => s.trim().split(/\s+/).length;

for (const card of cards) {
  const at = `card "${card.id}"`;
  if (ids.has(card.id)) errors.push(`${at}: duplicate id`);
  ids.add(card.id);
  if (!trackIds.has(card.track)) errors.push(`${at}: unknown track "${card.track}"`);
  if (card.sources.length === 0) errors.push(`${at}: needs at least one source`);
  if (words(card.headline) > 12) errors.push(`${at}: headline over 12 words`);
  if (words(card.body) > 40) errors.push(`${at}: body over 40 words`);
  if (card.quiz && (card.quiz.answerIndex < 0 || card.quiz.answerIndex >= card.quiz.choices.length)) {
    errors.push(`${at}: quiz answerIndex out of range`);
  }
  if (!isShippable(card)) {
    const msg = `${at}: ${card.riskTier} card has no human reviewer`;
    (release ? errors : warnings).push(msg);
  }
}

const skillIds = new Set<string>();
for (const skill of skills) {
  const at = `skill "${skill.id}"`;
  if (skillIds.has(skill.id)) errors.push(`${at}: duplicate id`);
  skillIds.add(skill.id);
  if (!trackIds.has(skill.track)) errors.push(`${at}: unknown track "${skill.track}"`);
  for (const cardId of skill.cardIds) {
    const card = cards.find((c) => c.id === cardId);
    if (!card) errors.push(`${at}: lists unknown card "${cardId}"`);
    else if (card.skill !== skill.id || card.track !== skill.track) {
      errors.push(`${at}: card "${cardId}" does not point back to this skill and track`);
    }
  }
}
for (const card of cards) {
  if (!card.skill) continue;
  const skill = skills.find((s) => s.id === card.skill);
  if (!skill?.cardIds.includes(card.id)) {
    errors.push(`card "${card.id}": skill "${card.skill}" does not list this card`);
  }
}

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);
console.log(`${cards.length} cards checked: ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);

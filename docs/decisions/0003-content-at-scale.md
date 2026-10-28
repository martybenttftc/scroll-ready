# 0003: Content at scale

- Status: accepted on merge
- Date: 2026-10-28
- Decided by: the orchestrator, after Marcus asked on 2026-10-28 for thousands of skills across many more themes, explorable by users
- Builds on: ADR 0001 (stack), ADR 0002 (card verification)

## Context
The starter app had 11 cards in one TypeScript file. Marcus wants thousands of skills (eventually far more) across survival, preparedness, gardening, homesteading, and DIY. At that volume three things break: one file can't take parallel batches without merge conflicts, a flat list of 12 tracks can't be explored, and drafting and verifying cards by hand can't keep up. ADR 0002 still holds: every card needs 3 independent sources and a verifier who isn't its drafter.

## Decision

### Taxonomy: Theme → Track → Skill → Card
- 9 themes and 48 tracks, defined in `src/content/taxonomy.ts`. Theme ids are a string union in `src/content/types.ts` so design code can key colors and icons on them.
- A skill is a short lesson of 4 to 10 cards. A track holds about 10 to 20 skills.
- At about 12 skills per track and 8 cards per skill, the current taxonomy holds roughly 4,600 cards. Growth past that comes from new tracks and themes, and from regional and seasonal variants (`regions`, `seasons`), not from padding skills.

### Storage: one JSON file per skill
- Skills and their cards live in `content/<track>/<skill>.json`. The folder is the track and the file name is the skill id, so a card can't point at the wrong one.
- The app loads every file with Metro's `require.context`, so adding a file needs no index edit, and two batch PRs never conflict unless they touch the same skill.
- `src/content/load.ts` parses and validates the files. The app (`src/content/catalog.ts`) and `npm run check:content` both use it.
- A skill file can carry an `outline` of planned card ideas that aren't drafted yet. The outline is the work queue.
- Bundling holds up to about 5,000 cards (a card is roughly 600 bytes, so about 3 MB). Before we pass that, move the long tail to Supabase with downloadable track packs, keep `offlineCore` cards bundled, and write an ADR.

### Pipeline: plan → draft → verify → review → merge
Each stage is a separate agent run, so no run checks its own work.

| Stage | Agent | Model | Output |
|---|---|---|---|
| Plan | `curriculum-planner` | opus | Skill files with a title, summary, and `outline`, but no cards |
| Draft | `card-drafter` | sonnet | Cards from the outline, each with at least 1 source and `draftedBy` |
| Verify | `content-safety` | opus | 3+ independent sources per card, then `verifiedBy` and `verifiedOn`. A card it rewrites gets `draftedBy` set to the verifier and stays unverified for a separate run |
| Review | `code-reviewer` and the CI review | opus | Format, tone, guardrails, check passes |
| Merge | Marcus | | |

- `/card-batch <track>` runs plan, draft, and verify for one track and opens one PR. The CI review (`claude-review.yml`) re-checks every changed card in `content/` as content-safety.
- A batch is one track and at most about 60 cards, so a reviewer can read every card.
- The verifier works one skill at a time: it reads 3 to 5 sources once and checks every card in the skill against them. That is the main cost saving, since reading sources is most of the work.
- Cards may merge as drafts. A release build fails on any unverified card (ADR 0002), so drafts can't reach users. Drafts in `main` let the planner and designer see real content sooner.
- `npm run check:content -- --stats` prints planned, drafted, and verified counts per track. The product lead uses it to pick the next batch.

### Machine-checked guardrails
`npm run check:content` now also fails when a first-aid, wild-food, or generator (`power`) card isn't `expert`, when a first-aid card doesn't mention 911, when a card mentions backfeeding without "never", or when a card has no `draftedBy`. These catch omissions in those tracks only. Heat illness, medical kits, electrical work in `solar` or `home-repair`, and carbon monoxide in `heating` have no machine check yet, so a passing check says nothing about them. The content-safety agent still reads every card.

## Consequences
- Throughput is limited by verification. Expect a batch of about 50 cards to take one long agent session. The source library in `docs/sources/` keeps drafters from re-searching the web each time.
- Some official sites (ready.gov, cdc.gov) refuse scripted fetches. Verifiers read those pages through WebFetch or a browser, or use the downloaded public-domain copies and other official sources.
- "Hundreds of thousands" of distinct cards isn't the near-term target. Quality comes first, and there probably aren't that many distinct, verifiable survival facts worth a card. The target is about 1,000 verified cards by launch and about 5,000 within the first year, then variants and new themes.
- `src/content/seed.ts` is gone. Import from `@/content/catalog`.

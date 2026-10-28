---
name: card-batch
description: Plan, draft, and verify one batch of Scroll Ready cards for a track, then open a PR. Use as /card-batch <track> [number of skills].
---
Produce one content batch for the track named in the arguments (default: 4 skills, at most about 60 cards). Read ADR 0003 and docs/CONTENT.md first.

1. Run `npm run check:content -- --stats`. If the track has fewer planned outline items than the batch needs, run the `curriculum-planner` agent on it.
2. Create a branch `content/<track>-<n>`. Name the batch `<track>-<n>`, where n is one more than the highest batch number already used for that track in `draftedBy`.
3. Run the `card-drafter` agent on the chosen skills. Give it the batch name.
4. Run the `content-safety` agent, as a new agent run, on the same skills. It must not be the run that drafted them. Give it the drafter's report so it looks hardest at the claims the drafter flagged.
5. Run `npx tsc --noEmit` and `npm run check:content -- --stats`. Both must pass with no errors.
6. Open a PR titled `Content: <track> batch <n>`. In the body, list each skill with cards drafted, verified, rewritten, and left unverified, and copy the verifier's notes on anything it changed or rejected. Content-safety review is already done; the code reviewer checks format and tone.

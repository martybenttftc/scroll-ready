# Scroll Ready

A TikTok-style vertical feed that teaches survival, preparedness, gardening, and homesteading skills, one card at a time. The model is Scroll The Bible: a free feed with a premium "Go Deeper" layer.

Read these before working:
- `AGENTS.md`: Expo SDK rules and commands. Always check the versioned Expo docs; don't rely on memory.
- `docs/PRODUCT.md`: what we're building and the MVP scope.
- `docs/PROCESS.md`: how the agent team works (roles, stand-ups, debates, reviews).
- `docs/CONTENT.md`: how to write, source, and verify cards. Use `/card-batch <track>` to produce a batch.
- `docs/decisions/`: architecture decisions. Follow them unless you write a new ADR that supersedes one.

## Code
- Expo Router routes go in `src/app/`. Components go in `src/components/`. The content model and loader go in `src/content/`. Skills and cards go in `content/<track>/<skill>.json` (see `docs/CONTENT.md` and ADR 0003).
- Use `npx expo install <pkg>` for dependencies.
- Before calling anything done, run `npx tsc --noEmit` and `npm run check:content`.
- Match the surrounding code style. Use TypeScript strictly and don't use `any`.

## Content safety (non-negotiable)
- Every card has at least one source while it's a draft, and 3 independent ones before it ships.
- A card ships only after it is checked against at least 3 independent sources that agree, and a reviewer other than its drafter sets `verifiedBy` and `verifiedOn`. The agent that drafted a card never verifies it. `npm run check:content -- --release` fails otherwise. See `docs/decisions/0002-card-verification.md`.
- `riskTier: 'expert'` cards (first aid, wild food, generators and electrical, water from unknown sources) get the strictest check: any disagreement between sources means the card doesn't ship.
- Wild food cards never suggest eating a plant based on the app alone. Generator cards never describe backfeeding. First aid cards point to calling 911.
- The tone is calm and capable, never fear-selling.

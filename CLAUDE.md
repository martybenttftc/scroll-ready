# Scroll Ready

A TikTok-style vertical feed that teaches survival, preparedness, gardening, and homesteading skills, one card at a time. The model is Scroll The Bible: a free feed with a premium "Go Deeper" layer.

Read these before working:
- `AGENTS.md`: Expo SDK rules and commands. Always check the versioned Expo docs; don't rely on memory.
- `docs/PRODUCT.md`: what we're building and the MVP scope.
- `docs/PROCESS.md`: how the agent team works (roles, stand-ups, debates, reviews).
- `docs/decisions/`: architecture decisions. Follow them unless you write a new ADR that supersedes one.

## Code
- Expo Router routes go in `src/app/`. Components go in `src/components/`. The content model and data go in `src/content/`.
- Use `npx expo install <pkg>` for dependencies.
- Before calling anything done, run `npx tsc --noEmit` and `npm run check:content`.
- Match the surrounding code style. Use TypeScript strictly and don't use `any`.

## Content safety (non-negotiable)
- Every card has at least one source.
- `riskTier: 'expert'` cards need `reviewedBy` and `reviewedOn` from a real, credentialed human before they ship. `npm run check:content -- --release` fails otherwise.
- Wild food cards never suggest eating a plant based on the app alone. Generator cards never describe backfeeding. First aid cards point to calling 911.
- The tone is calm and capable, never fear-selling.

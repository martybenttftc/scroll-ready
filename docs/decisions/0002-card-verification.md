# 0002: Card verification by multiple sources

- Status: accepted
- Date: 2026-10-28
- Supersedes: the "credentialed human reviewer" rule for expert cards in CLAUDE.md and PROCESS.md

## Context
The original rule said expert-tier cards (first aid, wild food, generators and electrical) could not ship until a credentialed human filled in `reviewedBy`. Marcus decided that finding and paying experts for every risky card isn't practical, and that the material is well established and widely published. Accuracy should come from cross-referencing the published record.

## Decision
- Every card, at every risk tier, needs at least 3 independent sources that agree on every claim it makes. Sources that copy one another count once. Forums and blogs can be used to find sources, but they don't count toward the 3.
- The content-safety agent checks the sources and sets `verifiedOn`. The agent that drafted a card can't verify it.
- `reviewedBy` and `reviewedOn` are removed. `isShippable` requires 3+ sources and `verifiedOn`. `npm run check:content -- --release` fails on any card that isn't shippable.
- Expert cards get the strictest reading: if the sources disagree, or only one source makes a claim, the card is rewritten to what they agree on or it doesn't ship.
- The hard guardrails don't change. Wild food cards never suggest eating a plant based on the app alone. Generator cards never describe backfeeding. First aid cards point to calling 911.
- There is no requirement that one source be official (CDC, Red Cross, OSHA, USDA). Agents should still prefer official sources where they exist.

## Consequences
- Verification needs no outside people and scales with the card pipeline. Agents need network access to read the sources.
- No human with a credential reviews health or electrical advice. A subtle error that several sources share can still get through. App Store review of health-related content may ask what backs the advice. The answer is the cited sources, so they need to show in the app.
- All 11 seed cards currently have 1 source each, so a release build fails until each one is brought up to 3 and verified.

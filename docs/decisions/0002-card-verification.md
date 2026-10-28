# 0002: Card verification by multiple sources

- Status: accepted on merge
- Date: 2026-10-28
- Decided by: Marcus (product owner), on 2026-10-28 in the project thread. He was offered human sign-off on expert cards and chose multi-source verification only.
- Supersedes: the "credentialed human reviewer" rule for expert cards in CLAUDE.md and PROCESS.md

## Context
The original rule said expert-tier cards (first aid, wild food, generators and electrical) could not ship until a credentialed human filled in `reviewedBy`. Marcus decided that finding and paying experts for every risky card isn't practical, and that the material is well established and widely published. Accuracy should come from cross-referencing the published record.

## Decision
- Every card, at every risk tier, needs at least 3 independent sources that agree on every claim it makes. Sources that copy one another count once. Forums and blogs can be used to find sources, but they don't count toward the 3.
- The content-safety agent checks the sources and sets `verifiedBy` and `verifiedOn`. The agent session that drafted a card (`draftedBy`) can't verify it.
- `reviewedBy` and `reviewedOn` are removed. `isShippable` requires 3+ sources on different sites, each with a URL, plus `verifiedBy` and a valid `verifiedOn` date. `npm run check:content -- --release` fails on any card that isn't shippable.
- Expert cards get the strictest reading: if the sources disagree, or only one source makes a claim, the card is rewritten to what they agree on or it doesn't ship.
- The hard guardrails don't change. Wild food cards never suggest eating a plant based on the app alone. Generator cards never describe backfeeding. First aid cards point to calling 911.
- There is no requirement that one source be official (CDC, Red Cross, OSHA, USDA). Agents should still prefer official sources where they exist.

## Consequences
- Verification needs no outside people and scales with the card pipeline. Agents need network access to read the sources.
- No human with a credential reviews health or electrical advice. A subtle error that several sources share can still get through, and so can an agent misreading correct sources. The drafter and the verifier are runs of the same model, so keeping them separate catches careless mistakes but not shared blind spots. If this proves to be a problem, a later ADR can add a batch human review of the expert queue. App Store review of health-related content may ask what backs the advice. The answer is the cited sources, so they need to show in the app.
- All 11 seed cards currently have 1 source each, so a release build fails until each one is brought up to 3 and verified.
- The release check runs in two places. Every EAS build profile except `preview` and `development` runs it in the `eas-build-post-install` hook, which fails closed. `npm run update:production` runs it before publishing an OTA update. The update gate is a convention for now, and `eas update --branch production`, `eas update --channel production`, `eas update:republish`, and `eas channel:edit` all bypass it. Backlog item 11, publishing production updates only from CI, removes those bypasses and has to land before the first production update.
- Preview updates and `preview`/`development` builds run only the structural check, so they can carry unverified cards. They are for the team only. Android preview APKs install on any phone, so a preview link or APK must not be shared outside the team.

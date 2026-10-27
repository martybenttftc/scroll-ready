# 0001: App stack

- Status: accepted
- Date: 2026-10-27

## Context
The app is built by one founder working with AI agents. It needs to ship on iOS first, with Android soon after. It must work offline and support subscription price testing.

## Decision
- React Native with Expo (SDK 58), Expo Router, and TypeScript. Builds, submissions, and over-the-air updates go through EAS.
- The feed starts as a paging `FlatList`. Switch to FlashList or PagerView only if profiling shows a need, and write an ADR when you do.
- Seed content is bundled in `src/content/` for now. Next comes Supabase (Postgres, auth, storage) as the content source, with an expo-sqlite cache on the device for offline use.
- RevenueCat for subscriptions and paywalls, PostHog for analytics.
- The Claude API powers the Ask feature (v1.1). It answers only from reviewed cards.

## Consequences
iOS and Android come from one codebase, so there's no Android gap for copycats to fill. Native widgets need a small WidgetKit target added through a config plugin.

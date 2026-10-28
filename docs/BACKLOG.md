# Backlog

The product lead owns the order. Each item lists acceptance criteria and its status.

## Now
1. **Feed polish.** Full-screen snapping works on iOS and Android. The progress label reads "Track · Skill · n of m". Swiping right inside a skill moves to the next step. *Status: basic feed done.*
2. **Theme and brand.** Forest green and blaze orange palette, display font, app icon, and splash screen. *Status: not started.*
3. **Content pipeline.** Load cards from JSON files in `content/`, validated against `src/content/types.ts`. Add 100 draft cards across 12 tracks. *Status: not started. Depends on the content sources work.*

## Next
4. Onboarding quiz and Readiness Score
5. Paywall with RevenueCat (sandbox)
6. Go Deeper bottom sheet
7. Kit tab: go-bag checklist
8. Saves and streaks (stored on the device)
9. Daily notification
10. Offline core pack
11. Publish production OTA updates only from CI, after `check:content -- --release`, and keep production-capable `EXPO_TOKEN`s out of local shells. Until then, the gate is the `update:production` script by convention (ADR 0002). The job should also run `eas fingerprint:compare` against the latest production build so an update can't target a runtime no build has. Must land before the first production update.

## Later
Widget, share as image, plans, Supabase sync, rating prompt, Android release.

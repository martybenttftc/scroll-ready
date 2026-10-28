# Backlog

The product lead owns the order. Each item lists acceptance criteria and its status. P0 blocks the App Store launch, P1 should ship with v1.0, and P2 can follow. The plan and the reasoning behind this order are in `docs/LAUNCH.md`.

## P0: blocks launch
1. **Content to the launch bar.** 12 launch tracks, each with at least 4 skills and 25 to 35 verified cards (about 350), plus 30 verified stories. The 29 current drafts are verified or cut. Run `/card-batch <track>` per track. *Status: 43 cards (14 verified), 5 stories. The track list waits on Marcus (LAUNCH.md decision 2).*
2. **Learn opens tracks and skills.** Tapping a track shows its skills, each with its progress. Tapping a skill plays only that skill's cards, and you can come back. A finished skill shows a check and drops out of any "Continue". Tiles show "2 skills · 4 min" instead of a card count. *Status: Learn lists only tracks with cards (PR #19). The tiles don't open anything yet.*
3. **Saves that last, and a You tab.** Saves, quiz answers, and reveals are stored on the device. The You tab lists saved cards and has About, with the medical note and the version. The story card's swipe hint stays hidden after the first swipe into the feed (today it comes back each launch). *Status: saves are in memory only.*
4. **Icon, tab icons, and the Android splash.** Real app icon (`icon.png`, the Android adaptive icon, `assets/expo.icon`), SF Symbol tab icons, and a check of the Android 12+ splash. *Status: still the Expo starter art. Waits on Marcus (decision 3).*
5. **Large text never cuts off a card.** With iOS Larger Text at its largest, every card's text and answers can be reached, and the card scrolls inside itself if needed. *Status: not started.*
6. **Store paperwork.**
   - Policy, support, and terms pages are hosted.
   - App Privacy answers and the privacy manifest are done.
   - The medical note is in the app and in the listing (guideline 1.4.1).
   - Review notes are written for Apple.
   - The Apple Developer account is enrolled.

   *Status: not started.*
7. **Release builds leave drafts out.** A production build bundles only verified cards and stories, and still fails on a verified card that is broken. Production OTA updates go out only from CI, after `check:content -- --release`, with `eas fingerprint:compare` against the latest production build and a fresh checkout so `.env*.local` stays out (ADR 0002). *Status: today `--release` fails on any draft. It needs an ADR 0002 amendment.*

## P1: ship with v1.0
8. **First-session order.** The first skill after the story is a standard-tier myth or quiz. Expert-tier cards start at the second or third skill.
9. **One-question welcome.** "What do you want to be ready for?" offers 4 to 6 choices, which pick the first tracks. No account.
10. **Kind streak and daily reminder.** One card counts as a day. A free repair. A quiet note on days 3 and 7. Ask for notification permission after the first save or finished skill. One daily notice that names the day's card, with rotating copy and no loss framing.
11. **Crash reporting and analytics.** Sentry, plus PostHog without the advertising ID, disclosed, with an opt-out.
12. **VoiceOver moves between cards.** Accessible next and previous actions on the feed, so the app can claim VoiceOver support on Apple's accessibility labels.
13. **Lint in CI.** Fix the 4 React Compiler errors `expo lint` reports, then add lint to CI.
14. **Feed polish.** Swiping right inside a skill moves to the next step (from the original backlog). Test with 5 people whether anyone taps the progress segments. If they do, make a tap advance the card or switch to a small "2 of 5".

## P2: v1.1 and later
Items 15 and 16 sit here only if Marcus takes LAUNCH.md decisions 1 and 5 as recommended (free v1.0, light onboarding). If he doesn't, they move to P0.

15. **Go Deeper and the subscription.** RevenueCat (needs a development build). The paywall shows the billed price and period, the trial terms, a timeline with a Day 5 reminder that actually gets sent, Restore, Terms and Privacy links, and a close button that's visible right away. $39.99 a year with a 7-day trial, or $7.99 a month. It shows after the first finished skill and at Go Deeper taps.
16. **Readiness Score.** It only goes up and reads "Here's where you're starting".
17. **Kit tab.** Go-bag and home kit checklists, with gear links that open outside the app.
18. Widget with the day's card, share as an image (it keeps the 911 line and sources), seasonal packs, Supabase sync, the rating prompt after a finished skill, and the Android release.

## Done
- Feed snapping and the "Track · Skill" label (PR #1). Design v2 with one accent (PR #13). Story of the day (PR #16). Content pipeline and loader (PR #7).
- Offline core: every card and story is bundled in the app, so the feed works with no connection. Card photos and video (ADR 0004) stream, so revisit offline media when cards get media.
- Plain splash, a skill's cards play together, Learn hides empty tracks (PR #19). Swipe hint on the story card (PR #20).

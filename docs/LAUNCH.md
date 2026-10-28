# Launch plan

Owner: product lead. Written Oct 28, 2026 from an overnight UX audit and research pass. The research, with a source for every figure, is in `docs/research/launch-2026-10.md`. The audit summary below is the record; the page at https://claude.ai/artifact/5SzuN2tyJbbzS1wqMafcB2 is a convenience view of the same findings.

## Where we are
- 43 cards in 14 skills across 11 of 48 tracks. 14 are verified. Water is 33 of the 43.
- 5 verified stories.
- Two tabs (Feed, Learn). No onboarding, no saved state, no paywall.
- The app icon is still the Expo starter icon.

## Audit summary (Oct 28)
- **Keep:** one idea per card, think-then-reveal, one accent color, and the "Checked against N independent sources" line, which answers the main trust complaint about Scroll The Bible's AI-written study content.
- **Feed:** text can run off a fixed full-screen card at large iOS text sizes. Save goes nowhere: saves don't last past a restart and no screen lists them. Story-style progress segments suggest tap-to-advance but only fill on swipe. A new user's third card is an expert-tier first aid card.
- **Story of the day:** good daily ritual. It didn't say the feed continues below (fixed in PR #20).
- **Learn:** 37 "Coming soon" tiles (fixed in PR #19). The tiles look tappable but do nothing. Counts read "6 cards" where people think in skills and minutes.
- **Brand and plumbing:** the app icon, Android adaptive icon, and tab icons are Expo starter art. `--release` fails on any draft. CI doesn't run lint, and `expo lint` has 4 errors.
- **Wording:** "Why? Think, then tap to see" packs two instructions; try "Think it over, then tap for why."

## Decisions for Marcus
Each has a recommendation. Record the answer here and in an ADR where it changes architecture.
1. **Free v1.0 or subscription at launch.** Recommend: v1.0 free, then Go Deeper and the subscription in v1.1, before any paid marketing.
2. **Launch content bar.** Recommend lowering ADR 0003's targets: about 350 verified cards (12 tracks, each with at least 4 skills and 25 to 35 cards) plus 30 verified stories at launch instead of about 1,000, and about 1,000 in year one instead of about 5,000. If Marcus agrees, write a short ADR that amends 0003 and update PRODUCT.md to match.
3. **Name and icon.** Recommend: run a trademark search on "Scroll Ready", then pick from 3 icon concepts in the app palette.
4. **Apple Developer account.** Recommend: a company account, so the listing shows the company as the seller instead of a personal name (an individual account can sell subscriptions too). It needs a D-U-N-S number, so start that now.
5. **Onboarding.** Recommend: no account. One welcome question ("What do you want to be ready for?"), then the feed. The Readiness Score waits for v1.1 and only goes up.

## Phases
| When | Phase | Exit criteria |
|---|---|---|
| Week 1 | Decide and unblock | The 5 decisions made. Apple enrollment started. Icon picked. |
| Weeks 1–3 | Core UX | Learn opens track → skill → play. Saves last and show in a You tab. Text never cuts off at large sizes. |
| Weeks 1–6 | Content (in parallel) | Launch content bar met. All drafts verified or cut. |
| Weeks 4–6 | Store readiness | TestFlight build. Policy, support, and terms pages live. Crash reporting. Screenshots. VoiceOver and Larger Text pass. |
| Weeks 6–8 | Submit and launch | Approved. Plan for 1–2 weeks of review and one rejection round. |

## Rules the research gave us
- **Teach the swipe once.** A new niche app can't assume TikTok's gestures. The story card ends with "Swipe up for skills" until the first swipe into the feed.
- **Play before anything.** No account, no long quiz, and no paywall before the first skill. Apple 5.1.1(v) requires login-free use for apps without account features.
- **Forgiving habits.** One card counts as a day, a free streak repair, and celebrations at days 3 and 7. No loss-framed copy, ever.
- **Ask for notifications after value.** Ask after the first save or finished skill. Send one daily notice that names the card, with rotating copy.
- **Honest paywall (v1.1).** Show the billed price and period, a trial timeline (Today, a Day 5 reminder, Day 7), a reminder that actually gets sent, Restore, Terms and Privacy links, and a close button that's visible right away.
- **Medical note.** In the app (You → About) and in the listing: "Educational only. In an emergency, call 911. Check with a doctor." (guideline 1.4.1).

## Metrics
All-app medians are 25% D1, 8% D7, and 4% D30; the top quartile is 30–40%, 10–15%, and 5–8%. Aim for the top quartile before paid ads. Also track skills finished in the first session and notification opt-in (the iOS average is about 44%).

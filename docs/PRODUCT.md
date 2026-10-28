# Product brief

Full plan (UX flows, content model, monetization, marketing): https://claude.ai/artifact/6Jk1oANHbo1m7qgNNTENGe
Research on Scroll The Bible: https://claude.ai/artifact/VzGv5vGpsmGTwr1fTn9X11

## One line
Stop doomscrolling. Start skill-scrolling. Learn one survival skill a day in two minutes.

## Tabs
- **Feed**: full-screen vertical cards (tip, step, myth, quiz, scenario, gear, checklist). Each card shows its track and step. The first page is the story of the day, a short true survival or DIY story (ADR 0005).
- **Learn**: tracks, skills, and plans, with progress.
- **Kit**: go-bag and home kit checklists, with links to gear.
- **You**: Readiness Score, streak, saved cards, settings, and subscription.

## Content model
Theme → Track → Skill → Card. Types are in `src/content/types.ts`, themes and tracks in `src/content/taxonomy.ts`, and cards in `content/<track>/<skill>.json`. There are 9 themes and 48 tracks. The target is about 1,000 verified cards at launch and about 5,000 in the first year (ADR 0003).

## MVP (v1.0)
- Onboarding quiz, Readiness Score, and a paywall with a close button (RevenueCat)
- Feed with all 7 card types, plus the Go Deeper sheet
- Learn: 12 tracks and 4 plans
- Kit: go-bag and home kit checklists
- Save, share as an image, and streaks
- Daily notification and a home screen widget
- Offline safety basics, plus downloadable tracks
- In-app rating prompt after finishing a skill

## Later
AI "Ask" (v1.1), Android (about 6 weeks after iOS), video loops, community, alerts, local services, Spanish.

# Product brief

Full plan (UX flows, content model, monetization, marketing): https://claude.ai/artifact/6Jk1oANHbo1m7qgNNTENGe
Research on Scroll The Bible: https://claude.ai/artifact/VzGv5vGpsmGTwr1fTn9X11

## One line
Stop doomscrolling. Start skill-scrolling. Learn one survival skill a day in two minutes.

## Tabs
- **Feed**: full-screen vertical cards (tip, step, myth, quiz, scenario, gear, checklist). Each card shows its track and step.
- **Learn**: tracks, skills, and plans, with progress.
- **Kit**: go-bag and home kit checklists, with links to gear.
- **You**: Readiness Score, streak, saved cards, settings, and subscription.

## Content model
Track → Skill → Card. Types are in `src/content/types.ts`. There are 12 tracks, and the launch target is about 900 cards.

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

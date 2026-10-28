# Design direction: Field Journal at Dusk

Owner: design lead. Mockups: https://claude.ai/artifact/XFQZ9n3rQLGjyMY1fxPTSW

Scroll Ready should feel like a well-worn field guide read by firelight: calm, capable, and warm. The feed is dark and immersive. It is never camo, never military stencil, and never fear-selling.

## Principles
1. **One idea per screen.** The headline does the work and the body is a single breath (12 and 40 word budgets).
2. **Make them think, then reveal.** Quizzes, myths, and scenarios hold back the answer until a tap. Recalling an answer teaches better than rereading it.
3. **Show the trust.** Every card shows how many sources it was checked against. Drafts say they are drafts.
4. **Every track has a color.** You know where you are before you read a word.
5. **Motion rewards, never nags.** Short, soft, and off when Reduce Motion is on. No confetti, and no guilt-trip streak alerts.

## What the research says
- Scroll The Bible keeps the reading view clean and puts study tools one tap away, hidden until asked for. Its home dashboard (streaks, plans, saves) is the part reviewers call cluttered. ([ScreensDesign teardown](https://screensdesign.com/showcase/scroll-the-bible))
- Duolingo lets people play before signing up, gives feedback with personality instead of system messages, and makes streak milestones feel like a celebration you can share. Their team found the fire metaphor didn't translate across cultures. ([Duolingo blog](https://blog.duolingo.com/streak-milestone-design-animation), [925 Studios breakdown](https://www.925studios.co/blog/duolingo-design-breakdown))
- Streaks that rely on guilt draw backlash ([UX Collective](https://uxdesign.cc/gamification-gone-wrong-stop-the-streaks-c3de42618ae)). Ours stay kind: a daily goal you can meet in two minutes, and no shaming notifications.

## Color
Tokens live in `src/constants/theme.ts`. The app runs dark for now so the tab bar matches the feed. A light "paper" theme (#F6F1E7 ground, #1B241F ink) is reserved for long reading surfaces such as the Go Deeper sheet.

| Token | Hex | Use |
|---|---|---|
| Night pine | #0F1A15 | App and feed background |
| Canopy | #1B2A22 | Raised surfaces, tiles |
| Bone | #F2ECE1 | Primary text |
| Bone soft | #E4DED2 | Body text |
| Ash | #B9B3A6 | Secondary text (8.5:1 on night pine) |
| Blaze | #FF7A3D | The one accent: primary actions, selected tab, streak |
| Sage | #5CC9A8 | Right answers, verified badge |

Each theme has a hue, and a few signature tracks (Fire, Fishing) get their own. The hue drives a track's background glow, chip, icon, and progress, and every track has its own icon (`src/constants/track-style.ts`). Hues are similar in lightness so no track shouts louder than another. Right and wrong answers are never shown by color alone; they always carry a label.

## Type
- **Fraunces SemiBold** for headlines, 32 to 36 pt. A soft serif reads as a field journal, not a warning sign.
- **Inter** for body (18 pt, line height 27) and labels (12 to 13 pt caps, 1.5 pt tracking).
- Both load at runtime with `expo-font`, so they work in Expo Go.

## Feed card anatomy
A large, faint track icon (7% opacity) fills the empty upper area. From top to bottom:
1. Skill progress segments (only inside a skill), like stories.
2. Track chip: icon, track, skill, and card type (except on step cards), in the track color.
3. Content block, anchored to the lower half where the thumb is: big step number (step cards), headline, body, and the type's interaction.
4. Action rail on the right: Save, Share (verified cards only, and the shared text carries the sources and, on first aid, the 911 line), and Go Deeper (only when the card has deeper content).
5. Trust line: "Checked against N sources" with a shield, or "Draft · N sources". Tap it to list the sources, each linked when it has a URL.

## Card templates
| Type | Template |
|---|---|
| tip | Headline and body. |
| step | Big faint step number, "Step n of m", headline, body. |
| myth | The claim as the headline, then "Why? Think, then tap to see" reveals the body. Once cards carry a verdict field, people will guess Myth or Fact first (see mockup). |
| quiz | Question, large answer buttons, then a verdict ("You got it" or "It's 1 gallon") and the body as the explanation. |
| scenario | "What would you do?" Think first, then tap to reveal the answer. |
| gear | Product card (later, with Kit). |
| checklist | Tappable items (later, with Kit). |

First aid cards always show a "Call 911" strip.

## Motion
Values live in `Motion` in `src/constants/theme.ts`.
- When a card snaps into view, its lines rise 12 pt and fade in over 280 ms, 70 ms apart.
- Revealing an answer fades in over 220 ms.
- With Reduce Motion on, everything appears without movement.
- Haptics wait for a development build; `expo-haptics` isn't confirmed for Expo Go on SDK 58.

## Next
- App icon and splash in the new palette (needs a logo direction for Marcus).
- Streak and daily goal ring once saves and streaks land (backlog item 8). The mockup shows the target.
- Onboarding quiz and Readiness Score screens, researched first by the UX researcher.

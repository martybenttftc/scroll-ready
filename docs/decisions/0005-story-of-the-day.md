# 0005: Story of the day

- Status: proposed (accepted on merge)
- Date: 2026-10-28
- Asked for by: Marcus, on 2026-10-28, as an engagement hook: "a survival story of the day or do-it-yourself story of the day"
- Builds on: ADR 0002 (card verification), ADR 0003 (content at scale)

## Context
Cards teach one skill at a time, but they don't give people a reason to open the app at a set time each day. A short true story does: it changes every day, it's easy to share, and it shows why a skill matters. Scroll The Bible's daily verse plays the same role. The risk is accuracy. Survival stories attract legend and embellishment, so a story has to meet the same bar as a card.

## Decision

### Format
- One story per day, drawn from a mix of real survival stories and do-it-yourself stories (people who built, grew, or fixed something themselves).
- A story is a title (8 words or fewer), a one-line hook (25 words or fewer), when and where, three or four short paragraphs (250 words or fewer in all, about a one-minute read), and a takeaway (40 words or fewer) that points to a track.
- Stories are true and historical. We prefer well-documented events with public records, and avoid private people, graphic detail, gore, and fear-selling. The takeaway is a reflection, not new safety advice. Anything that needs safety advice belongs on a card.

### Sourcing
- Same rule as cards (ADR 0002): every fact in a story (names, dates, numbers, places, the order of events) is checked against at least 3 independent sources that agree, and a verifier who isn't the drafter sets `verifiedBy` and `verifiedOn`. A detail that only one or two sources give is cut.
- Prefer primary and public-domain sources (NASA, NPS, the Library of Congress, Project Gutenberg texts such as Shackleton's *South*), then museums and established publications. Wikipedia and blogs can point to sources but don't count.
- Stories are written in our own words. Facts aren't copyrighted, but other authors' prose is, so we never copy it.

### Where it lives
- Today's story is the first page of the Feed: a plain page with the hook and a "Read the story" button that opens the full text, the takeaway, and the sources in a sheet.
- The story turns over at local midnight. Everyone sees the same story on the same date, so it can anchor a daily notification (backlog item 9) and the home screen widget later.
- The switch isn't instant at midnight. The app picks a new story when it launches or comes back to the foreground on a new local day, so someone still scrolling past midnight keeps seeing the earlier story until then. A notification for a day's story should open that story by its id rather than assume the feed has already switched.
- The UI uses only the shared Palette, Type, and Spacing tokens, with no track colors, to match the simpler design (PR #13).

### Storage and checks
- One file per story in `stories/<id>.json`, loaded with `require.context` like cards. The format is the `Story` type in `src/content/stories.ts`.
- `npm run check:content` validates stories and their word limits. `--release` fails on any story that isn't verified, so drafts can't reach users.
- The rotation cycles through the stories in file-name order. At one story a day, 30 stories last a month and 365 last a year without repeats.

## Consequences
- Adding a story file shifts which story lands on which date. That's fine while the list is short. Once there are enough stories, a `date` field can pin stories to anniversaries (for example, the Apollo 13 story on April 13).
- Stories cost more verification than cards, because each one makes many small factual claims. Keep them short.
- Stories are free. Marcus decided this on 2026-10-28, because they're the hook that brings people back.
- Not decided yet: whether a story can be saved or shared. Sharing should follow the card rule: verified stories only, with their sources.

# Writing cards

How skills and cards are stored, written, and verified. The why is in ADR 0002 and ADR 0003.

## Where things go
- Themes and tracks: `src/content/taxonomy.ts`. Add a track there before adding its folder.
- One skill per file: `content/<track>/<skill-id>.json`. The folder must be a track id, and the file name is the skill id. Skill ids are unique across all tracks, so name them specifically (`purify-water`, not `basics`).
- Cards are listed in the order a user should see them.

## Skill file
```json
{
  "title": "Purify water",
  "summary": "Three ways to make water safe to drink.",
  "outline": ["Chemical treatment with unscented bleach", "When filters are not enough"],
  "cards": [
    {
      "id": "boil-water",
      "type": "step",
      "headline": "Boil water to make it safe",
      "body": "Bring clear water to a rolling boil for 1 minute. Above 6,500 feet, boil for 3 minutes.",
      "difficulty": 1,
      "riskTier": "caution",
      "sources": [{ "title": "CDC: Making water safe in an emergency", "url": "https://www.cdc.gov/..." }],
      "isFree": true,
      "offlineCore": true,
      "draftedBy": "card-drafter, 2026-10-28 batch water-1"
    }
  ]
}
```
- `outline` lists card ideas not drafted yet. Drafters remove an item when they draft its card.
- Don't write `track` or `skill` on a card. The loader sets them from the path.
- Optional card fields: `stepOrder`, `deeper` (Go Deeper text, premium), `mistakes`, `quiz` (`choices` and `answerIndex`), `gearIds`, `regions`, `seasons`, `image`, `verifiedBy`, `verifiedOn`. The full type is `Card` in `src/content/types.ts`.

## Writing rules
- Card ids are kebab-case and unique across all content. Lead with the subject: `bleach-water-ratio`, not `how-much-bleach`.
- Headline is 12 words or fewer. Body is 40 words or fewer. `deeper` can run to about 150 words.
- One idea per card. Use exact numbers when the sources give them (minutes, feet, ratios).
- Calm and capable. No fear-selling, no "you'll die if", no brand names unless the card is a `gear` card.
- Mix card types in a skill: open with a `tip` or `scenario`, teach with `step` cards, and end with a `quiz` or `myth`.
- `riskTier`: `standard` is general knowledge, `caution` can cause harm if done wrong, `expert` can seriously hurt someone. First aid, wild food identification, generators and electrical work, and water from unknown sources are `expert`.
- Guardrails: first-aid cards point to calling 911. Wild food cards never suggest eating a plant based on the app alone. Generator cards never describe backfeeding: outdoors, 20 feet from the house, and a transfer switch installed by a licensed electrician.
- `isFree`: safety basics are always free. Make about two thirds of each skill free and keep `deeper` for premium.
- `offlineCore`: true only for life-safety cards someone might need with no signal.

## Sources
- Start from the public-domain library in `docs/sources/manifest.csv` (US Army and Air Force survival manuals, FEMA, USDA canning guide, Nessmuk, Kephart, Beard, the 1911 Scout handbook). Each row has a download URL.
- Then official sites: Ready.gov, CDC, NOAA and the National Weather Service, USDA, USGS, NPS, OSHA, Red Cross, and university extension services.
- Quote facts, not prose. US federal works are public domain. Extension guides and most modern books are copyrighted, so restate them in our own words and cite them.
- Every source needs a URL to count toward the 3 (ADR 0002). Two pages on the same site count once.
- Never scrape YouTube, podcasts, Reddit, or blogs into cards. They can point you to a source but can't be one.

## Commands
```bash
npm run check:content               # validate everything; unverified cards are warnings
npm run check:content -- --stats    # planned, drafted, and verified counts per track
npm run check:content -- --release  # fails on any unverified card
```

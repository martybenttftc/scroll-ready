# 0004: Photos, videos, and gear links on cards

- Status: accepted on merge
- Date: 2026-10-28
- Decided by: the orchestrator, after Marcus asked on 2026-10-28 for demo videos that play in the app, high-quality photos, and a way to recommend gear people are missing
- Builds on: ADR 0002 (card verification), ADR 0003 (content at scale)

## Context
Text cards teach facts but not technique. A 20-second clip of a bow drill or a photo of a rolling boil teaches faster. Marcus also wants a second revenue line from gear people find they're missing, which the plan already lists as affiliate links. Three constraints shape this:
- Videos must play inside the app. YouTube embeds bring YouTube's ads, branding, and "watch on YouTube" links that send people out.
- A wrong picture is a safety bug. A made-up leaf can get a plant misidentified, and a made-up wound or splint teaches the wrong thing.
- Amazon Associates allows links in apps only after a separate approval, only in free apps where the links need no payment, and never shows Amazon pages inside the app (no WebViews). The FTC wants a clear disclosure next to the link. Apple allows links to buy physical goods outside in-app purchase.

## Decision

### One media item per card
- `Card.media` holds one photo or one video: `kind`, `url`, `alt`, optional `poster` (video), `license`, `credit`, `sourceUrl`, and `aiGenerated`. It replaces the unused `image` string.
- `license` is one of `public-domain`, `cc0`, `cc-by`, `cc-by-sa`, `licensed`, `own`. `sourceUrl` is the page that states the license, so a reviewer can re-check it. The card shows the credit under the media and links to `sourceUrl`.
- Sources, in order: US federal works (USDA, NPS, Fish and Wildlife, FEMA, NOAA, CDC), Wikimedia Commons under CC0, CC BY, or CC BY-SA, then our own photos and clips, then paid licenses. No stock sites with "editorial only" terms, and no frames grabbed from YouTube.
- AI-generated media is allowed only on `standard` cards outside the expert tracks, and the credit says it's AI-generated. `npm run check:content` enforces this.
- The verifier checks media like a claim: the picture shows what the card says, and the license page says what `license` says. They record it in `media.verifiedBy`, which must differ from the card's `draftedBy`, and copy the checked `url` into `media.verifiedUrl`. A card with unchecked media, or whose `url` no longer matches `verifiedUrl`, fails `--release`. Videos need a `poster`. On wild food cards a photo is never the basis for eating anything, and the card text still says so.

### Video plays in the app
- `expo-video` (included in Expo Go) plays `.mp4` or HLS `.m3u8`. The player mounts only on the card on screen, so off-screen clips don't download. A clip plays muted and looped, a tap turns sound on, and scrolling away resets both. With reduce motion on, nothing plays until tapped.
- Clips are hosted on Cloudflare Stream: $5 per month per 1,000 minutes stored and $1 per 1,000 minutes watched, with no bandwidth fees. 200 one-minute clips watched 100,000 times a month is about $101 a month. Mux is the fallback if we need its analytics.
- Media loads over the network and expo-image caches photos on disk. Media that fails to load, or doesn't fit the space the text leaves, is hidden, so offline-core cards must make sense with no media.

### Gear links
- Gear lives in `src/content/gear.ts` (`id`, `name`, `why`, `url`, `affiliate`), and cards point to it with `gearIds`. The check fails on an unknown id, and wild food cards never link to gear.
- Links open in Safari or the store's app with `Linking.openURL`, never in an in-app browser.
- Any card that shows an affiliate link shows the disclosure right under it. Gear shows after the card's answer is revealed, so a link never stands in for the lesson.
- The catalog stays empty until Amazon Associates approves the app (or another program such as REI through AvantLink), and each `why` line is held to the same sourcing rules as card text.

## Consequences
- Drafters can add media and gear to any card without code changes. The verifier now checks pictures and licenses too.
- No real media ships in this change: Wikimedia's API rate-limited the cloud container, so the first photos come from a content batch run.
- Marcus needs to sign up for Cloudflare Stream before we host our own clips, and apply to Amazon Associates once the app is in the App Store.

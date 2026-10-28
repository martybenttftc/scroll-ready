# Scroll Ready

Swipe through survival, preparedness, and homesteading skills, one card at a time.

```bash
npm install
npx expo start        # press i for iOS simulator, a for Android, w for web
npm run typecheck
npm run check:content # add -- --release to block unreviewed expert cards
```

- What we're building: [docs/PRODUCT.md](docs/PRODUCT.md)
- How the agent team works: [docs/PROCESS.md](docs/PROCESS.md)
- Decisions: [docs/decisions/](docs/decisions/)
- Backlog: [docs/BACKLOG.md](docs/BACKLOG.md)

## Preview on a phone

- **Expo Go (no Apple account needed):** publish with `npm run update:preview`. Then open the update on expo.dev, tap **Preview**, and scan the QR code. EAS needs an `EXPO_TOKEN` in the environment.
- **`preview` build profile (`distribution: internal`):** on iOS this makes an ad hoc build. It needs a paid Apple Developer account, and each phone's UDID has to be registered first with `npx eas-cli@latest device:create`. Android internal builds have no such restriction.
- **Production updates:** publish only with `npm run update:production`. It runs `check:content -- --release` first, so an update can't ship a card that hasn't been verified (see ADR 0002). EAS builds run the same check in an `eas-build-post-install` hook for every profile except `preview` and `development`. Don't run `eas update --branch production` directly, and don't move a preview update onto production with `eas update:republish --destination-branch production` or `eas channel:edit production`: neither runs the check. Moving production publishing into a CI job is the planned follow-up.

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

- **Expo Go (no Apple account needed):** publish with `npx eas-cli@latest update --branch preview`. Then open the update on expo.dev, tap **Preview**, and scan the QR code. EAS needs an `EXPO_TOKEN` in the environment.
- **`preview` build profile (`distribution: internal`):** on iOS this makes an ad hoc build. It needs a paid Apple Developer account, and each phone's UDID has to be registered first with `npx eas-cli@latest device:create`. Android internal builds have no such restriction.

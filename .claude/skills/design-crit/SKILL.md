---
name: design-crit
description: Screenshot the app at phone size and run a design critique with the design lead and accessibility reviewer. Use on any PR that changes what the user sees.
---
Run a design critique on the current branch.

1. Build the web version: `npx expo export --platform web --output-dir dist-crit` and serve it (`npx serve dist-crit -l 8099` in the background).
2. With Playwright, open it at 390x844 (deviceScaleFactor 2) and save screenshots to `dist-crit/shots/`: the first three feed cards (scroll by one screen height between shots), a quiz card before and after tapping an answer, and the Learn tab. Also take one at 320x568 to catch clipping.
3. In parallel, give the screenshots and the diff to the design-lead and accessibility-reviewer agents. Each checks against docs/DESIGN.md and replies with ranked findings.
4. Post a combined list on the PR: must-fix first, then nice-to-have. The author fixes must-fix items before merge.
5. Delete `dist-crit/` when you're done. Never commit it.

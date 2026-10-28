# How we build Scroll Ready with a team of agents

Marcus is the product owner and the only human. Claude agents do the design, coding, review, and testing. The process aims for three things: work moves forward without waiting on Marcus, no change lands without being checked by an agent that didn't write it, and every important decision is written down so the next session can read it instead of re-arguing it.

## The team

Each role is a Claude Code subagent defined in `.claude/agents/`. Opus does the thinking-heavy roles and Sonnet does the volume work. Haiku runs cheap, frequent checks.

| Role | Agent file | Model | Owns |
|---|---|---|---|
| Product lead | `product-lead.md` | opus | Scope, priorities, the backlog, user stories, what "done" means |
| Architect | `architect.md` | opus | Data model, app structure, libraries, ADRs in `docs/decisions/` |
| Mobile engineer | `mobile-engineer.md` | sonnet | Building features in `src/` |
| Content and safety reviewer | `content-safety.md` | opus | Card accuracy, risk tiers, sources, disclaimers |
| Code reviewer | `code-reviewer.md` | opus | Reviews every PR for bugs, simplicity, and fit with the ADRs |
| QA tester | `qa-tester.md` | sonnet | Runs the app, tries to break features, writes tests |

Marcus usually drives the main Claude Code session (Opus 5.5) as the orchestrator. The orchestrator hands work to these agents and runs the rituals below.

## Rituals

### Daily stand-up (`/standup`)
Run once at the start of each work session. Each role reads the repo state (open PRs, recent commits, `docs/BACKLOG.md`, the last stand-up note) and reports in three lines: what changed since last time, what it plans next, and what's blocking it. The orchestrator then writes one note in `docs/standups/YYYY-MM-DD.md` with the plan for the session and any questions for Marcus at the top. Takes about two minutes.

### Feature debate (`/debate <topic>`)
Use this for any choice that's expensive to reverse, such as a new library, a data model change, a paywall rule, or a navigation change. The architect and product lead each argue for an option, the most relevant other role (usually content-safety or the engineer) argues against both, and then the orchestrator decides. The decision goes in a new ADR in `docs/decisions/`. Marcus only gets pulled in when the decision changes what the product is, what it costs, or how it's positioned.

### Build loop (every feature)
1. The product lead writes a short story with acceptance criteria in `docs/BACKLOG.md`.
2. The architect adds an implementation note, or an ADR if it's a bigger call.
3. The mobile engineer builds it on a branch and opens a PR.
4. The code reviewer and QA tester review the PR. Content-safety joins if the PR touches cards.
5. The engineer fixes what they find. CI must pass: typecheck, lint, tests, and the content check.
6. Marcus merges. Merging is the only step that requires him.

### Weekly retro (`/retro`)
At the end of each week the team looks at what shipped, what slowed it down, and changes one rule in this file or in `CLAUDE.md`.

## Rules every agent follows
- The agent that writes a change never approves it.
- Read `CLAUDE.md`, `AGENTS.md`, and the ADRs before you code. Don't re-argue a decision that has an ADR unless you have new evidence. If you do, open a new ADR that supersedes the old one.
- Keep PRs small: one feature or fix, ideally under 400 changed lines.
- No card ships until the content-safety agent has checked it against at least 3 independent sources that agree and set `verifiedOn` (ADR 0002). The agent that drafted a card can't verify it.
- When unsure, write down the question in the stand-up note and keep working on what isn't blocked.

## Automation
- `.github/workflows/ci.yml` runs typecheck and the content check on every PR.
- `.github/workflows/claude-review.yml` has Claude review every PR automatically. It uses the `ANTHROPIC_API_KEY` repository secret.

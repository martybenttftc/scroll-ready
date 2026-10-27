---
name: standup
description: Run the Scroll Ready daily stand-up with the agent team and write the session plan.
---
Run the daily stand-up.

1. Gather state: `git log --oneline -15`, open PRs (`gh pr list`), docs/BACKLOG.md, and the newest file in docs/standups/.
2. Run the product-lead, architect, mobile-engineer, content-safety, and qa-tester agents in parallel. Give each one the state, and have each reply in three lines: what changed since last time, what it will do next, and what's blocking it.
3. Resolve conflicts between their plans. If two roles disagree on something expensive to reverse, run /debate on it.
4. Write docs/standups/YYYY-MM-DD.md with, in order: questions for Marcus (if any), today's plan (owner and task), and the roles' updates.
5. Start the first task in the plan.

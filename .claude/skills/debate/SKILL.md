---
name: debate
description: Run a structured feature or architecture debate between agents and record the decision as an ADR. Use for choices that are expensive to reverse.
---
Debate the topic given in the arguments.

1. Restate the question and the constraints in two sentences. Read the related ADRs.
2. In parallel, ask the architect for its recommended option, the product-lead for its recommended option, and the most relevant third role (content-safety, mobile-engineer, or qa-tester) to argue against both. Each answer stays under 200 words and must include costs.
3. Give each side one rebuttal round, run in parallel.
4. Decide. Pick one option and explain why in plain language. If the decision changes what the product is, its price, or its cost, stop and ask Marcus instead.
5. Write docs/decisions/NNNN-<slug>.md with Status, Date, Context, Options considered, Decision, and Consequences.

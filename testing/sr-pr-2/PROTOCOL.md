# SR-PR-2: AI code review, CodeRabbit vs Greptile

**Question:** On the same pull request with 8 planted bugs, how many does each tool flag, with how many false alarms?

**Fixture:** this repo's PR #1 change (`feature/search-and-export`, head `6f59362`): 6 files, +63/-5. Answer key: `answer-key.json`, written from the diff before any review comments were read.

**Runs:** 3 per tool. For each run, a fresh branch identical to the fixture is opened as a new PR against the pre-change base (`f465f64`). Default settings, no custom rules or context, standard review depth (no Apex/Plus). No human replies or prompts to the bot.

**Also scored:** CodeRabbit's existing Oct 2026 review on PR #1 (8 comments), with the same key. Recorded as a separate row; the published round-1 "7 of 8" stays as historical until this test is published.

**Recorded per run:** bugs caught (by ID), false positives, noise comments, time from PR open to review posted, plan/tier used, credits used.

**Scoring:** two passes, the second blind to tool name. Disagreements are written down with the comment text.

**Publishing:** win or lose, with the scope line "one code-review task, not an overall verdict." Rankings change only with Nicholas's approval.

**Cost ceiling:** $0. Any paid plan needs Nicholas's approval first.

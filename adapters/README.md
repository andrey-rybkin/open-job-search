# Site adapters

Each adapter documents one job site: search entry point/query strategy, extracting complete job details, application form fields, post-submit verification, inbox handling, delays and known limitations. Site-specific selectors belong only in that adapter.

Adapters may not bypass CAPTCHA, anti-bot checks, authentication or rate limits. Do not claim a site is supported until its flow has been manually verified. Keep `WORKFLOW.md` platform-neutral and common safety rules there.

- `hh.ru.md` documents the hh.ru browser flow from the source project; selectors can change and must be rechecked before use.
- `habr-career.md` uses Habr Career's public user-facing vacancy pages and requires user confirmation for responses.
- `superjob.md` uses SuperJob's official vacancy-search API; `superjob-search.mjs` is the runnable read-only search adapter.
- `linkedin.md` is manual handoff only. LinkedIn prohibits unauthorized scripts/bots for site access, scraping and activity; this kit does not automate LinkedIn.
- `site-template.md` is the checklist for adding another site.

Search and submit capabilities are separate. A source can be enabled for discovery while all submissions remain manual and confirmation-gated.

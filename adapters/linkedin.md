# LinkedIn adapter — manual handoff only

Status: automated site access is intentionally unsupported.

LinkedIn's [Prohibited software and extensions](https://www.linkedin.com/help/linkedin/answer/a1341387) policy says third-party software, bots, browser extensions and other unauthorized automation may not scrape or automate LinkedIn activity. The [User Agreement](https://www.linkedin.com/legal/user-agreement), sections 8.2.2, 8.2.3 and 8.2.13, prohibits scraping/copying, bypassing access limits, and unauthorized automated access/activity. Account restrictions are a stated risk.

## Supported workflow

1. The user searches and opens LinkedIn in their own browser manually. This kit does not generate direct LinkedIn search URLs, inspect pages, scrape results, click, fill fields, send messages, or submit applications there.
2. The user may provide a job URL and the job description text they are permitted to share. The assistant can compare that supplied text with the private profile and draft a tailored application outside LinkedIn.
3. The assistant returns the draft and a checklist. The user manually reviews and submits it on LinkedIn.
4. Record an application only after the user confirms submission; store only the minimum necessary local metadata.

If the user wants direct interaction with LinkedIn, stop and explain that this adapter does not automate it. Use only an official LinkedIn integration/API that LinkedIn has explicitly authorized for the specific operation, if one is available to that user; do not assume general developer API access permits job applications.

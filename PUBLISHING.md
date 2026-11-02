# Publishing checklist

This directory is the open-job-search repository. Never publish the parent project directory.

1. Review git status and the full file list. Candidate data should exist only as placeholders in profile.template.md and empty/example values in settings.example.json.
2. Search for names, email addresses, phone numbers, account handles, resume text, employer messages, job IDs and credentials. Remove any real data before pushing.
3. Confirm profile.md, settings.json, logs and runtime state are ignored by .gitignore.
4. Confirm the license and site terms are appropriate for the intended distribution. Do not include copied job descriptions or other third-party content.
5. Before each release, recheck site terms and adapter behavior; site UI and API policies can change.

The project does not bundle browser credentials or a hosted service. LinkedIn is manual-only; only the SuperJob search adapter is currently an executable site integration.

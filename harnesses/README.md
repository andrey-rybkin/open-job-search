# Harness setup

The workflow is plain Markdown and does not require a particular model provider. A harness must be able to read project files; browser automation is needed only for site actions. Keep credentials in the harness's own secure login/credential mechanism.

- **AGENTS.md-compatible harnesses:** open this directory as the project and let the harness load `AGENTS.md`.
- **Claude Code:** use `CLAUDE.md` as the project instruction entry point; it points to the shared workflow.
- **OpenCode:** install the project skill from `opencode/SKILL.md` into the project's `.opencode/skills/job-search/SKILL.md`, or explicitly ask the agent to read `WORKFLOW.md`.
- **Other harnesses:** add the short instruction from the example below to project rules/system instructions: “Read AGENTS.md and WORKFLOW.md. Follow the selected adapter in adapters/. Treat profile.md as the only source of candidate facts. Do not perform external actions without per-action user confirmation. Never bypass CAPTCHA.”

Harness support means instruction-file compatibility, not a bundled browser connector or guaranteed native integration. For SuperJob, configure `SUPERJOB_APP_ID` in the harness's environment and run `node adapters/superjob-search.mjs --keyword "..."`; do not put the secret in settings. Confirm that the chosen harness can read local files and operate an authenticated browser before enabling browser-based site actions.

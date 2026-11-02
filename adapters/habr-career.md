# Habr Career adapter

Mode: read-only discovery through the public, user-facing website; the authenticated browser is used only if the user explicitly asks to prepare a response. Last checked against current list/detail HTML and help pages: 2026-11-02. Website behavior and legal documents can change.

## Discovery

1. Navigate to `https://career.habr.com/vacancies` in the harness browser. Use only the site's visible search/filter controls. Do not guess undocumented query parameters or call private endpoints.
2. Current server-rendered list pages expose results under `[data-vacancy-list]`; vacancy title links use `.vacancy-card__title-link` (also `.vacancy-card__backdrop-link`), company links `.vacancy-card__company a`, and the visible response action is inside `.vacancy-card__response`. Record the ID from the canonical path `/vacancies/<numeric-id>`, title, company, visible location/remote label and published salary. Treat these class selectors as hints; verify they exist on the current page before using them.
3. Open only a small, relevant set of results. Detail pages currently expose `[data-vacancy-show]`, title `h1.page-title__title`, and a `JobPosting` JSON-LD block (`script[type="application/ld+json"]`) containing title, identifier.value, description, datePosted, validThrough, jobLocation and employmentType. Prefer the visible page text for requirements/instructions; use JSON-LD as structured cross-check. If either source is incomplete, do not mark the job ready.
4. Save full vacancy text locally; do not bulk-download, crawl pages, or commit employer content to the public kit.
5. Exclude IDs already in the user's local application and rejection logs. If the page is incomplete, login-gated, blocked or the layout differs, stop and report it rather than guessing.

## Response

Public vacancy cards currently show “Откликнуться у компании” or “Откликнуться”. On detail pages, the response link can be rendered as a dynamic placeholder until the client runs; don't construct or guess its href. Activate only the visible link after the user asks to prepare a response, inspect the destination and any external employer form, and follow its current instructions.

Prepare the message outside the site, then show the destination and exact message and obtain explicit user confirmation. Verify the message and any attachments in the actual form before the user submits. Confirm receipt from visible site feedback before recording an application. This adapter does not automate a click that submits a response.

## Limits and references

- Do not assume the Habr Career API supports candidate-side job search or applications; the public API page did not expose method details during verification.
- These selectors are implementation details, not a supported API. Recheck them each run and fall back to visible accessible controls; never invoke hidden endpoints or reuse page CSRF tokens.
- Official references: [vacancies](https://career.habr.com/vacancies), [candidate help](https://career.habr.com/info/help_user), [API docs](https://career.habr.com/info/api), [user agreement](https://career.habr.com/info/legal/agreement).

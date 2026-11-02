# hh.ru adapter

Status: documented workflow, not a maintained API integration. Verify the current interface before each use. Use the user's authenticated browser session; never store credentials in this project.

## Search and job details

- Search at `https://hh.ru/search/vacancy` using the user's configured query and filters. Do not use private endpoints or defeat access controls.
- Open each candidate job page and capture its URL, numeric vacancy ID, title, employer, compensation, full duties, requirements, conditions, required opening phrase, questions and application instructions.
- Save the complete job text locally before drafting. Do not treat menus, ads or recommendations as job requirements.
- Exclude IDs already present in `applications.md` or `rejected.md` before opening or applying.

## Application form

1. Open `https://hh.ru/applicant/vacancy_response?vacancyId=<id>`. Reveal the cover-letter field with `[data-qa="vacancy-response-letter-toggle"]`; the current textarea selector is `textarea[data-qa="vacancy-response-popup-form-letter-input"]`.
2. Fill from the reviewed local draft. Read the actual textarea value and compare it to the full draft (normalize line endings only).
3. If text differs, do not submit. Correct once; if it still differs, stop and ask the user.
4. If the site's client state did not register the filled value, follow the harness's documented way to dispatch an ordinary input event and re-verify. Never use a workaround that skips user-visible form behavior.
5. Submit through `[data-qa="vacancy-response-submit-popup"]` as a separate browser action only after the user confirms the exact application. If extra employer questions appear, stop and ask the user unless every answer is explicitly in `profile.md`.
6. Verify receipt after the page updates. The user's existing workflow has observed `hasResponseLetter=true` in the response page; if this field is absent or false, don't count the application as sent. Never retry automatically after an uncertain result.
7. Record the confirmed result immediately in `applications.md`.

## CAPTCHA and messages

On CAPTCHA or bot verification, stop and report the URL and job. Never solve it with a service, rotate accounts, or retry around it. For chats, verify the exact response text before sending and ask the user before sending. Check current site UI and terms; selectors and page behavior may change.

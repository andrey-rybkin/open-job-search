# SuperJob adapter

Mode: official API for read-only vacancy search and detail lookup; browser/human handoff for applying. Verified against SuperJob's public API documentation on 2026-11-02. API version, authorization requirements and site terms may change.

## Setup

1. Register an application through SuperJob's developer portal and review its current API terms/permissions.
2. Provide the application secret as `SUPERJOB_APP_ID` in the harness's environment/secret store. Despite the variable name in SuperJob docs, this header value is an application secret; never put it in settings files, logs or Git.
3. Do not use the candidate's account password or request candidate OAuth unless a specific documented endpoint requires it. Public vacancy search does not need candidate credentials.

## Search

Run:

```sh
SUPERJOB_APP_ID="$SUPERJOB_APP_ID" node adapters/superjob-search.mjs --keyword "technical support" --period 7
```

Optional flags: `--page` (0–500), `--count` (1–100), `--period` (0, 1, 3 or 7 days), `--town`, `--payment-from`, `--payment-to`, `--remote` (sets the documented `place_of_work=2`). Search is a GET to `https://api.superjob.ru/2.0/vacancies/`; the adapter sends `X-Api-App-Id`, uses API fields described by SuperJob, and emits normalized JSON to stdout. Do not retry automatically on 401/403/429 or other errors; report the status and stop.

The official API docs state a 120 requests/minute limit; this adapter intentionally performs one request per invocation and does not paginate automatically. Keep to a user-selected small number of queries.

Use the normalized job ID to deduplicate against local logs. The search response includes job description fields; if one is missing, use the documented detail GET `/2.0/vacancies/<id>/` via an approved API client or the official public vacancy link. Don't infer a link if API output omits it.

## Applying

The verified public API docs expose vacancy search and vacancy details, but no confirmed candidate-side application endpoint. Open the returned official job link manually in the user's browser. The user reviews the exact letter and submits it themselves; this adapter never posts applications, messages or personal data.

## References

- [Official API overview](https://api.superjob.ru/)
- [Official API client/docs](https://api.superjob.ru/client/)
- [Official API integration information](https://www.superjob.ru/integration/)

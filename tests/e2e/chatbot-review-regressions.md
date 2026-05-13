# Chatbot Review Regression E2E

These Chrome regressions cover the review fixes from 2026-05-13.

## Cases

- **PDF upload accept list**: opens the chat protocol demo assistant and verifies the file input advertises `.pdf,application/pdf` only.
- **Question answer routing**: opens the regression panel with `?reviewRegression=1`, clicks `Start Question Batches`, clicks `Answer Batch B`, and verifies the visible Batch A status remains `pending` while Batch B becomes `answered second`.
- **Slow human answer window**: opens the regression panel, clicks `Start Slow Question`, waits 31 seconds, clicks `Answer Slow Question`, and verifies the visible status becomes `answered after-timeout-window`.

## Run

```bash
PLAYWRIGHT_CHATBOT_REVIEW_REGRESSION=1 npx playwright test tests/e2e/chatbot-review-regressions.spec.ts --project=chatbot-review-regressions
```

The Playwright project starts:

- `services/chatbot-backend` on `http://127.0.0.1:18080` with `chatbot.e2e-support.enabled=true`
- `apps/chat-protocol-demo-web` on `http://127.0.0.1:4173`

The E2E support endpoint is disabled unless `chatbot.e2e-support.enabled=true`. Tests interact through visible UI controls; the UI panel owns the backend calls.

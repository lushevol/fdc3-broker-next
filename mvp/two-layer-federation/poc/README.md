# Two-layer federation POC

This track is private, disposable evidence. Every workspace retains a `-poc` package identity and must remain isolated from realworld applications and packages.

## Structure

- `apps/portal-host-poc` — proof host on port 9100.
- `apps/mfe-cashflow-poc` — proof federated Cashflow application on port 9101.
- `packages/platform-contracts-poc` — experimental runtime contracts.
- `packages/platform-sdk-poc` — experimental application capability client.
- `packages/ratan-sdk-poc` — UI-free proof domain utilities.
- `packages/ratan-design-poc` — minimal MUI/Emotion design-system proof.
- `packages/ratan-ui-poc` — proof Ratan domain UI composition.
- `tests/e2e` and `playwright.config.ts` — POC-only browser acceptance.
- `docs` — POC decisions and migration evidence.

## Portal platform design documents

- [Portal Home POC Plan](./docs/PORTAL_HOME_POC_PLAN.md) — the active, comprehensive implementation and verification plan.
- [Portal Platform POC Charter](./docs/PORTAL_PLATFORM_POC_CHARTER.md) — durable target architecture rules and subsequent POC sequence.
- [DevOps Migration Plan](./docs/DEVOPS_MIGRATION_PLAN.md) — distinct post-POC production delivery and migration plan.

These documents do not authorize implementation. The POC constitution takes precedence over older POC planning notes when their scope conflicts.

## Commands

Run from the repository root:

```bash
npm run poc:dev
npm run poc:build
npm run poc:test
npm run poc:lint
npm run poc:verify:boundaries
npm run poc:check
npm run poc:test:e2e
```

`poc:check` is the complete non-browser CI gate. `poc:test:e2e` builds the track, verifies its boundaries, starts the POC-only Playwright servers, and exercises the browser acceptance suite.

Do not add production package identities, production migration cohorts, or deployment configuration to this track.

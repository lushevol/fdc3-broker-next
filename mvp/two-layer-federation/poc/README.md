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

## Commands

Run from the repository root:

```bash
npm run build:federation-mvp
npm run test:federation-mvp
npm run lint:federation-mvp
npm run verify:federation-mvp-boundaries
npm run test:e2e:federation-mvp
```

Do not add production package identities, production migration cohorts, or deployment configuration to this track.

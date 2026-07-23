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

- [Portal Platform POC Constitution](./docs/PORTAL_PLATFORM_POC_CHARTER.md) — normative long-term rules, the smallest POC boundary, acceptance evidence, and phased sequence.
- [Portal Platform Design Discussion](./docs/PORTAL_PLATFORM_DISCUSSION.md) — consolidated project decisions, current evidence/gaps, migration mapping, and decisions requiring confirmation.
- [Portal POC 1 Specification](./docs/PORTAL_POC1_SPEC.md) — proposed normative behavior and contracts for the portal-core POC.
- [Portal POC 1 Test Plan](./docs/PORTAL_POC1_TEST_PLAN.md) — TDD order, requirement coverage, browser journeys, and exit evidence.

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

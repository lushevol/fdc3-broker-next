# Two-layer federation realworld track

This track contains production package identities and the migration implementation intended to replace the legacy three-layer portal. It remains isolated from the legacy `apps/` and `packages/` trees until rollout is approved.

## Structure

- `apps/portal-host` — direct Module Federation host on port 9200.
- `apps/mfe-cashflow` — independently deployed Cashflow application on port 9201.
- `packages/platform-contracts` — versioned application, appearance, and identity contracts.
- `packages/platform-sdk` — typed application client for host capabilities.
- `packages/ratan-design` — authoritative semantic-token and bounded-component design system.
- `packages/ratan-data-grid` — AG Grid adapter owned as an application/package dependency.
- `scripts` — realworld-only package and runtime boundary verification.
- `tests/e2e` and `playwright.config.ts` — realworld browser acceptance.
- `docs` — realworld architecture, verification, rollout, and compatibility guidance.

## Commands

Run from the repository root:

```bash
npm run build:production-foundation
npm run test:production-foundation
npm run build:production-pilot
npm run test:production-pilot
npm run lint:production-pilot
npm run verify:production-foundation-package
npm run verify:production-pilot-boundaries
npm run test:e2e:production-pilot
```

Package identities and versions remain production-oriented even while this track is an isolated migration candidate. No realworld workspace may depend on a `*-poc` package or runtime artifact.

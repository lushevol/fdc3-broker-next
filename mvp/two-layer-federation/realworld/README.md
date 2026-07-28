# Two-layer federation realworld track

This track contains production package identities and the migration implementation intended to replace the legacy three-layer portal. It remains isolated from the legacy `apps/` and `packages/` trees until rollout is approved.

## Structure

- `apps/portal-host` — direct Module Federation host on port 9200.
- `apps/mfe-cashflow` — independently deployed Cashflow application on port 9201.
- `apps/mfe-identity-profile` — independently deployed identity/profile component verification application on port 9202.
- `apps/mfe-fdc3-admin` — independently deployed FDC3 declarations and catalog verification application on port 9204.
- `apps/mfe-ratan-container-mvp` — independently deployed migration inventory for the legacy Ratan runtime on port 9205.
- `apps/mfe-cashflow-blotter-mvp` — independently deployed Cashflow Blotter migration slice on port 9206.
- `packages/platform-contracts` — versioned application, appearance, and identity contracts.
- `packages/platform-sdk` — typed application client for host capabilities.
- `packages/ratan-design` — authoritative semantic-token and bounded-component design system.
- `packages/ratan-data-grid` — AG Grid adapter owned as an application/package dependency.
- `scripts` — realworld-only package and runtime boundary verification.
- `tests/e2e` and `playwright.config.ts` — realworld browser acceptance.
- `docs` — realworld architecture, verification, rollout, and compatibility guidance.

## Active plans

- [React Aria Ratan Design System and Verification Tiles Plan](./docs/REACT_ARIA_DESIGN_SYSTEM_PLAN.md)

## Commands

Run from the repository root:

```bash
npm run realworld:dev
npm run realworld:build
npm run realworld:test
npm run realworld:lint
npm run realworld:verify:packages
npm run realworld:verify:boundaries
npm run realworld:check
npm run realworld:test:e2e
```

`realworld:check` is the complete non-browser CI gate. Foundation-only and package-only building blocks remain available as `realworld:*:foundation` and `realworld:build:packages` commands for focused package work.

Package identities and versions remain production-oriented even while this track is an isolated migration candidate. No realworld workspace may depend on a `*-poc` package or runtime artifact.

The two legacy migration MVPs are described in
[`docs/LEGACY_APP_MIGRATION_MVPS.md`](./docs/LEGACY_APP_MIGRATION_MVPS.md).
The end-to-end Cashflow procedure is recorded in
[`docs/CASHFLOW_BLOTTER_PORTAL_HOST_MIGRATION_RUNBOOK.md`](./docs/CASHFLOW_BLOTTER_PORTAL_HOST_MIGRATION_RUNBOOK.md).

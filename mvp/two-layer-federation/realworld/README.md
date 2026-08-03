# Two-layer federation realworld track

This track contains the production-identity implementation of the two-layer
Portal Host architecture. It remains isolated from the legacy `apps/` and
`packages/` runtime trees until rollout is approved. See the
[current-state record](./docs/CURRENT_STATE.md) for the latest migration and
verification status.

## Structure

- `apps/portal-host` — direct Module Federation host on port 9200.
- `apps/mfe-cashflow` — independently deployed Cashflow application on port 9201.
- `apps/mfe-identity-profile` — independently deployed identity/profile component verification application on port 9202.
- `apps/mfe-fdc3-admin` — independently deployed FDC3 declarations and catalog verification application on port 9204.
- `apps/mfe-ratan-container-mvp` — standalone migration inventory for the legacy Ratan runtime on port 9205; it is not registered by Portal Host or required by Cashflow.
- `apps/mfe-cashflow-blotter-mvp` — independently deployed Cashflow Blotter migration slice on port 9206.
- `packages/platform-contracts` — versioned application, appearance, and identity contracts.
- `packages/platform-sdk` — typed application client for host capabilities.
- `packages/ratan-design-webkit` — active Lit/custom-element component catalog
  and React wrapper used by Portal Host and the migrated applications.
- `packages/ratan-design` — legacy compatibility and reference package retained
  while remaining cohorts are retired; it is not the active UI source for the
  four Portal Host applications.
- `packages/ratan-data-grid` — AG Grid adapter owned as an application/package dependency.
- `scripts` — realworld-only package and runtime boundary verification.
- `tests/e2e` and `playwright.config.ts` — realworld browser acceptance.
- `docs` — realworld architecture, verification, rollout, and compatibility guidance.

## Documentation

- [Current state](./docs/CURRENT_STATE.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Verification](./docs/VERIFICATION.md)
- [Production deployment](./docs/PRODUCTION_DEPLOYMENT.md)
- [Historical React Aria plan](./docs/REACT_ARIA_DESIGN_SYSTEM_PLAN.md)

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
npm run realworld:deploy:up
npm run realworld:deploy:verify:live
```

`realworld:check` is the complete non-browser CI gate. Foundation-only and package-only building blocks remain available as `realworld:*:foundation` and `realworld:build:packages` commands for focused package work.

For UI changes, also complete the live browser checklist in
[`docs/VERIFICATION.md`](./docs/VERIFICATION.md); a non-browser aggregate gate
does not replace visual and interaction verification.

Package identities and versions remain production-oriented even while this track is an isolated migration candidate. No realworld workspace may depend on a `*-poc` package or runtime artifact.

The two legacy migration MVPs are described in
[`docs/LEGACY_APP_MIGRATION_MVPS.md`](./docs/LEGACY_APP_MIGRATION_MVPS.md).
The end-to-end Cashflow procedure is recorded in
[`docs/CASHFLOW_BLOTTER_PORTAL_HOST_MIGRATION_RUNBOOK.md`](./docs/CASHFLOW_BLOTTER_PORTAL_HOST_MIGRATION_RUNBOOK.md).
The phased plan for migrating the original Cashflow CN source and decomposing
the original Ratan Container into two-layer ownership is recorded in
[`docs/ORIGINAL_CASHFLOW_RATAN_PORTAL_MIGRATION_PLAN.md`](./docs/ORIGINAL_CASHFLOW_RATAN_PORTAL_MIGRATION_PLAN.md).

The production-shaped immutable nginx deployment, promotion model, and rollback
procedure are documented in
[`docs/PRODUCTION_DEPLOYMENT.md`](./docs/PRODUCTION_DEPLOYMENT.md).

# Two-layer Module Federation MVP

This directory is the ownership boundary for the greenfield `Host -> Application` proof of concept and the isolated production pilot derived from it. Both are isolated from the existing Single-SPA/SystemJS production platform.

## Structure

- `apps/portal-host-poc` — runtime registry, workspace shell, capability provider, and federated application loader
- `apps/mfe-cashflow-poc` — independently built Cashflow application remote
- `apps/portal-host` — production-identity host pilot; not part of the legacy `apps/` runtime tree
- `apps/mfe-cashflow` — production-identity Cashflow pilot loaded directly by `portal-host`
- `packages/platform-contracts-poc` — runtime-validated host/application contracts
- `packages/platform-sdk-poc` — typed application client for host capabilities
- `packages/ratan-sdk-poc` — shared Ratan domain functions
- `packages/ratan-design-poc` — product-neutral semantic tokens, local MUI provider, and bounded foundational components
- `packages/ratan-ui-poc` — Ratan domain React components built on the design-system package
- `tests/e2e` and `playwright.config.ts` — isolated browser verification

## Commands

Run these from the repository root:

```bash
npm run dev:federation-mvp
npm run test:federation-mvp
npm run build:federation-mvp
npm run test:e2e:federation-mvp
```

The proof-of-concept workspace package names intentionally retain the `-poc` suffix. The production-pilot applications retain their non-POC package identities while remaining physically isolated in this MVP boundary.

## Planning

- [DevOps and system migration plan](./docs/DEVOPS_MIGRATION_PLAN.md)
- [Design-system POC boundaries and production promotion policy](./docs/DESIGN_SYSTEM_POC.md)

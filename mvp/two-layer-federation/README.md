# Two-layer Module Federation MVP

This directory is the ownership boundary for the greenfield `Host -> Application` proof of concept. It is isolated from the existing Single-SPA/SystemJS production platform.

## Structure

- `apps/portal-host-poc` — runtime registry, workspace shell, capability provider, and federated application loader
- `apps/mfe-cashflow-poc` — independently built Cashflow application remote
- `packages/platform-contracts-poc` — runtime-validated host/application contracts
- `packages/platform-sdk-poc` — typed application client for host capabilities
- `packages/ratan-sdk-poc` — shared Ratan domain functions
- `packages/ratan-ui-poc` — shared Ratan React components
- `tests/e2e` and `playwright.config.ts` — isolated browser verification

## Commands

Run these from the repository root:

```bash
npm run dev:federation-mvp
npm run test:federation-mvp
npm run build:federation-mvp
npm run test:e2e:federation-mvp
```

The workspace package names intentionally retain the `-poc` suffix so moving the code does not change its public package identities.

## Planning

- [DevOps and system migration plan](./docs/DEVOPS_MIGRATION_PLAN.md)

# Cashflow CN source migration

This workspace is the two-layer-federation migration of the real
`apps/mfe-cashflow-blotter/src/Cashflow_CN` application. It is not the earlier
fixture-based Cashflow lookalike.

## What is migrated

- the complete `Cashflow_CN` component, Redux, service, workflow, and style tree;
- Cashflow-owned `Root` and generated support required by that tree;
- the Cashflow Dashboard date utility used transitively by Cashflow CN;
- a Module Federation entry that Portal Host loads from port `9206`;
- compatibility adapters for the legacy shell, Ratan facade, STOMP browser
  transport, navigation handoff, identity, configuration, theme, and FDC3.

The provenance test compares the migrated `Cashflow_CN/index.tsx` with the
legacy source and verifies that the federated entry renders its real Redux
`Main` root.

## Current migration boundary

At runtime, the built remote contains no references to `@fm/base`,
`@fm/ratan_container`, `@fm/ratan_cashflow`, `@fm/ratan_trades`, Single-SPA, or
an import map. The legacy import names are resolved at build time to local
compatibility adapters.

The remaining material debt is explicit:

- some Cashflow-used Ratan implementation is still compiled from
  `apps/mfe-ratan-container` through `@legacy-ratan`; it must be extracted into
  realworld ownership;
- local Portal Host validation currently has no Cashflow backend, so the real
  UI renders with `0/0` results and the notification connection reports
  unavailable;
- the copied legacy tree still has pre-existing full-project TypeScript and
  lint debt; migration-owned shell/adapters are checked separately;
- the production bundle is about 8.5 MB because the temporary Ratan source
  boundary prevents effective pruning;
- data, detail, notification, and entitled-action parity still require
  sanitized response contracts and integration services.

## Run and verify

```bash
npm test
npm run lint
npm run build
npm run check:boundaries
npm run dev
```

- standalone remote: `http://127.0.0.1:9206`
- Portal Host: `http://127.0.0.1:9200/cashflow-blotter`

See the
[migration runbook](../../docs/CASHFLOW_BLOTTER_PORTAL_HOST_MIGRATION_RUNBOOK.md)
for the exact source mapping, runtime fixes, verification evidence, remaining
work, cutover, and rollback.

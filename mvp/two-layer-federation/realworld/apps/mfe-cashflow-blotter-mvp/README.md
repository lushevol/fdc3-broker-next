# Cashflow CN source migration

Status: active migration slice. Shared UI now resolves through
`@scdevkit/webkit`; the remaining debt below belongs to the copied
Cashflow CN compatibility surface. Last reviewed 3 August 2026. See the
[current-state record](../../docs/CURRENT_STATE.md).

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

- the copied Cashflow domain tree still contains Ant Design and compatibility
  adapters; shared Ratan component imports resolve to the WebKit boundary, but
  domain-specific compatibility code still requires cohort-by-cohort removal;
- the complete Cashflow-used Ratan module closure is owned under
  `src/cashflow-ratan`; identity/permission, feature-enable, and logging
  utilities are Cashflow-owned and parity-tested, while the remaining local
  compatibility surface still needs cohort-by-cohort replacement;
- local Portal Host development supplies production-shaped contracts on the
  unchanged legacy routes, so the real UI renders two grid rows, a saved
  filter, a saved view, and Cashflow details without a backend;
- the reachable Cashflow application graph and migration-owned shell/adapters
  now have separate passing typechecks; inherited strict-null/lint cleanup and
  the Ratan facade implementation remain separate migration cohorts;
- the production bundle is about 8.5 MB because the broad compatibility facade
  still prevents effective pruning;
- the local contract responses still require approval against the integration
  service; local acceptance now covers notification startup, export
  entitlement, and an entitled Hold submission.

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

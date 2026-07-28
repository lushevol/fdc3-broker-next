# Cashflow Blotter migration MVP

This workspace is a direct Module Federation migration slice for
`apps/mfe-cashflow-blotter`. It consumes versioned platform, design, and grid
packages and has no runtime dependency on the Ratan Container migration MVP.

```bash
npm --workspace @fm/mfe-cashflow-blotter-mvp run dev
npm --workspace @fm/mfe-cashflow-blotter-mvp test
npm --workspace @fm/mfe-cashflow-blotter-mvp run build
```

Standalone URL: `http://127.0.0.1:9206`

The complete, reproducible migration process is documented in the
[Cashflow Blotter to Portal Host migration runbook](../../docs/CASHFLOW_BLOTTER_PORTAL_HOST_MIGRATION_RUNBOOK.md).

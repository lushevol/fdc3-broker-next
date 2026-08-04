# Legacy application migration MVPs

Status: active migration reference, updated 3 August 2026. See
[`CURRENT_STATE.md`](./CURRENT_STATE.md) for the current UI-package boundary.

## Scope

This migration check covers the legacy `apps/mfe-ratan-container` and
`apps/mfe-cashflow-blotter` workspaces without importing their source code or
preserving their Single-SPA/SystemJS runtime relationship.

## Required runtime shape

```text
portal-host
└── mfe-cashflow-blotter-mvp
    ├── @scdevkit/webkit
    └── @fm/ratan-data-grid
```

Cashflow is the independently deployed Module Federation application loaded
directly by Portal Host. Ratan WebKit is a build-time package boundary for
shared components, not a component remote or runtime layer. The standalone Ratan
Migration MVP remains an inventory tool only; Portal Host does not register it
and the Cashflow Blotter MVP does not load or import it.

## Acceptance

1. Cashflow exposes `./application`, publishes a compatible application
   manifest, and runs standalone without a Ratan remote.
2. Ratan Container MVP inventories the legacy container responsibilities and
   proves that reusable UI is consumed from versioned packages.
3. Cashflow Blotter MVP renders the migrated Cashflow CN slice with the
   versioned WebKit and grid packages plus explicitly documented compatibility
   adapters for remaining legacy-owned behavior.
4. Host navigation, notifications, telemetry, appearance, and identity arrive
   only through platform capabilities.
5. Boundary verification rejects Single-SPA, SystemJS, import maps,
   `@fm/base`, and any Cashflow-to-Ratan-container runtime dependency.

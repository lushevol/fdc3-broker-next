# Legacy application migration MVPs

## Scope

This migration check covers the legacy `apps/mfe-ratan-container` and
`apps/mfe-cashflow-blotter` workspaces without importing their source code or
preserving their Single-SPA/SystemJS runtime relationship.

## Required runtime shape

```text
portal-host
├── mfe-ratan-container-mvp
└── mfe-cashflow-blotter-mvp
```

Both MVPs are independently deployed Module Federation applications loaded
directly by the portal host. The Cashflow Blotter MVP must not load or import
the Ratan Container MVP.

## Acceptance

1. Each MVP exposes `./application`, publishes a compatible application
   manifest, and runs standalone.
2. Ratan Container MVP inventories the legacy container responsibilities and
   proves that reusable UI is consumed from versioned packages.
3. Cashflow Blotter MVP renders a filterable operational slice with the
   versioned Ratan grid and design packages.
4. Host navigation, notifications, telemetry, appearance, and identity arrive
   only through platform capabilities.
5. Boundary verification rejects Single-SPA, SystemJS, import maps,
   `@fm/base`, and any Cashflow-to-Ratan-container runtime dependency.

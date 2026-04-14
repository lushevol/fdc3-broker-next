# ratan-fdc3-agent — Rules

> Parent: [Monorepo rules](../../../docs/rules.md) · [AGENTS.md](../../../AGENTS.md)

## API Surface

- **Never** access `window.__RATAN_FDC3__.brokerInstance` directly — always use `getAgentApi()` or hooks.

## React Integration

- Always wrap tile components in `<AgentProvider>` before using FDC3 hooks.

## ScopedDesktopAgent

- Every FDC3 call through `ScopedDesktopAgent` automatically injects the tile's `AppIdentifier` as the `source` field.

## Error Boundary

- Import `ErrorBoundary` from this package (re-exported from broker with `theme="agent"`).

## Auto-Retry

- If the broker is unavailable when `AgentProvider` mounts, it polls every **100 ms** until the broker becomes available.

## FDC3 2.2 Compliance

- This package wraps the `@finos/fdc3` `DesktopAgent` interface. All FDC3 types are re-exported from this package.

# ratan-fdc3-agent — Architecture

## Tech Stack

- TypeScript
- tsup (ESM + CJS dual output, DTS)
- Vitest + happy-dom
- @testing-library/react

## Dependency Graph

```
fdc3-agent → fdc3-broker   (for Broker type + ErrorBoundary)
fdc3-app-directory          (no monorepo deps)
```

## Directory Structure

```
src/
  index.ts            Re-exports public API
  agent.ts            getAgentApi(), setBroker(), clearBroker()
  scoped-agent.ts     ScopedDesktopAgent implementation
  hooks.tsx           React hooks (useFDC3, useIntentListener, useContextListener, …)
  types.ts            Shared TypeScript types
  ErrorBoundary.tsx   Re-exported from broker with theme="agent"
```

## Core APIs

| Export                 | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| `getAgentApi()`        | Returns the `DesktopAgent` instance                   |
| `AgentProvider`        | React context — creates `ScopedDesktopAgent` per tile |
| `useFDC3()`            | Hook → `DesktopAgent`                                 |
| `useIntentListener()`  | Hook → registers/cleans intent listener               |
| `useContextListener()` | Hook → registers/cleans context listener              |
| `useCurrentChannel()`  | Hook → current channel                                |
| `useUserChannels()`    | Hook → all user channels                              |
| `useAppIdentifier()`   | Hook → current `AppIdentifier`                        |
| `ErrorBoundary`        | React error boundary                                  |

## Build

- **Bundler:** tsup
- **Outputs:** ESM, CJS, DTS
- **Externals:** react, react-dom, @finos/fdc3

## Testing

- **Runner:** Vitest (happy-dom)
- **Test files:** channel-hooks, scoped-agent, useFDC3, useIntentListener

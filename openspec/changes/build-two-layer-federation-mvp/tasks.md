## 1. Contracts and shared dependencies

- [x] 1.1 Add platform contract tests for valid and invalid registries, route constraints, and supported contract versions
- [x] 1.2 Implement the typed Zod registry, application module, and platform capability contracts
- [x] 1.3 Add Ratan SDK tests and implement representative cashflow domain aggregation and filtering
- [x] 1.4 Add Ratan UI component tests and implement the shared cashflow table

## 2. Greenfield host

- [x] 2.1 Scaffold the standalone Rsbuild host with no single-spa, SystemJS, or import maps
- [x] 2.2 Add tested runtime registry bootstrap and application route selection
- [x] 2.3 Add tested dynamic Module Federation loading with compatibility checks, retry, and failure isolation
- [x] 2.4 Implement launcher, workspace tabs, host notification capability, and nested-route refresh behavior

## 3. Cashflow pilot

- [x] 3.1 Scaffold the independently served Module Federation Cashflow remote
- [x] 3.2 Add component tests for filtering, selection, details navigation, notifications, and fresh remount state
- [x] 3.3 Implement the representative Cashflow workflow using platform contracts and Ratan packages without `@fm/base`

## 4. Integration and verification

- [x] 4.1 Add root development/build/test scripts and the runtime registry configuration
- [x] 4.2 Add Playwright configuration and an end-to-end journey covering loading, filtering, details routing, notification, close/reopen, and remote failure isolation
- [x] 4.3 Run unit tests, builds, lint/type checks, and Playwright E2E; fix all MVP failures
- [x] 4.4 Audit the browser network/runtime evidence to prove no legacy runtime or Ratan container is loaded

## 1. Appearance contract

- [x] 1.1 Add failing platform-contract tests for valid and invalid appearance snapshots, manifest compatibility, and appearance capability typing
- [x] 1.2 Implement the versioned appearance snapshot schema, manifest metadata, capability interfaces, and compatibility validation
- [x] 1.3 Add failing platform-SDK tests for appearance snapshot retrieval and subscription lifecycle
- [x] 1.4 Implement the SDK appearance client and local appearance controller used by standalone applications

## 2. Design-system package

- [x] 2.1 Scaffold `@fm/ratan-design-poc`, workspace scripts, peer dependencies, build configuration, and test setup
- [x] 2.2 Add failing tests for light/dark tokens, density, standalone provider rendering, Button, TextField, StatusBadge, and visible focus contracts
- [x] 2.3 Implement semantic tokens, generated CSS-variable styles, MUI theme creation, and `DesignSystemProvider`
- [x] 2.4 Implement the bounded Button, TextField, and StatusBadge APIs and export only the intended public surface

## 3. Host appearance ownership

- [x] 3.1 Add failing host tests for deterministic defaults, persisted scheme/density, stable capability identity, subscription updates, and shared control usage
- [x] 3.2 Implement host appearance controller/provider, persistence, theme and density controls, and capability wiring
- [x] 3.3 Replace representative host buttons with design-system components and remove superseded literal component styles

## 4. Cashflow adoption

- [x] 4.1 Add failing Cashflow tests for host-driven updates, standalone defaults, shared filter/action/status components, and preserved workflow behavior
- [x] 4.2 Wrap Cashflow in its local design provider, subscribe through the platform SDK, and retain standalone rendering
- [x] 4.3 Replace representative Cashflow filter, primary actions, and status badges and remove their superseded literal styles

## 5. Integrated verification and documentation

- [x] 5.1 Add E2E coverage for live scheme and density propagation, keyboard focus, standalone-compatible behavior, deep routing, and application failure isolation
- [x] 5.2 Add runtime compatibility and network assertions proving no design-system remote, Ratan container, Single-SPA, SystemJS, or import map is loaded
- [x] 5.3 Update the isolated MVP documentation with package boundaries, production promotion rules, commands, and compatibility/version policy
- [x] 5.4 Run package tests with coverage, host/application tests, lint, type checks, production builds, and Playwright E2E; resolve every failure

## 1. Production application foundation

- [x] 1.1 Add the `@fm/mfe-cashflow` workspace, independent development/build entries, and strict React/ReactDOM federation sharing
- [x] 1.2 Add failing tests for manifest identity, standalone defaults, live appearance subscription, public design primitives, domain filtering, details navigation, notifications, and fresh reopen state
- [x] 1.3 Implement the application-owned Cashflow record workflow using only production contracts, SDK, and design-system public APIs
- [x] 1.4 Add scoped application styles and tests that reject document-global reset ownership

## 2. Production host foundation

- [x] 2.1 Add the `@fm/portal-host` workspace, public registry fixture, independent build entry, and strict React/ReactDOM federation sharing
- [x] 2.2 Add failing tests for validated registry bootstrap, deterministic appearance persistence, launcher/workspace routing, capability delegation, nested refresh, and retryable failures
- [x] 2.3 Implement direct remote registration/loading with production compatibility validation before render
- [x] 2.4 Implement host-owned appearance, navigation, notification, telemetry, workspace lifecycle, and contained error boundaries
- [x] 2.5 Implement host shell composition with its own design provider and host-owned document reset

## 3. Architecture conformance

- [x] 3.1 Add automated dependency/import/configuration scans for POC, Single-SPA, SystemJS, import-map, `@fm/base`, and `mfe-ratan-container` boundaries
- [x] 3.2 Verify only React and ReactDOM are federation singleton shares and the design/MUI/Emotion stack remains deployable-local
- [x] 3.3 Verify the host and application build independently without source aliases or POC artifacts

## 4. Browser acceptance and evidence

- [ ] 4.1 Add dedicated production-pilot Playwright servers and configuration for independently built host and remote artifacts
- [ ] 4.2 Add browser journeys for registry bootstrap, remote open, Cashflow filtering/details, live theme/density propagation, nested refresh, close/reopen state, and remote failure containment
- [ ] 4.3 Add dependency-ordered root test, lint, build, conformance, and end-to-end scripts
- [ ] 4.4 Run all gates, strict OpenSpec validation, and record build sizes and acceptance evidence for the first legacy domain/grid cohort

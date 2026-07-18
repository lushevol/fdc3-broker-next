## 1. Versioned data-grid adapter

- [x] 1.1 Add `@fm/ratan-data-grid@1.0.0` package metadata, AG Grid Community/React peer boundaries, ESM/declaration/CSS exports, and build configuration
- [x] 1.2 Add failing tests for bounded columns, stable row identity, selection, activation, pagination, loading, empty, error/retry, and restricted exports
- [x] 1.3 Implement the generic `RatanDataGrid` adapter without raw grid API/configuration exports
- [x] 1.4 Add scoped semantic AG Grid theme mapping for both schemes and densities
- [x] 1.5 Add dependency/license scans rejecting Ant, enterprise modules, federation runtimes, legacy Ratan imports, and design-foundation coupling

## 2. Authorization Limits domain cohort

- [x] 2.1 Add typed Authorization Limit records, deterministic asynchronous repository fixtures, currency formatting, and loading/empty/error/ready tests
- [x] 2.2 Add list and details routes to the production Cashflow application with explicit read-only/mutation-deferral messaging
- [x] 2.3 Add tests for filtering, grid columns, row selection, double-click/keyboard details activation, detail metadata, back navigation, and unknown records
- [x] 2.4 Use only production platform/design/grid package APIs and keep list/details composition application-owned

## 3. Conformance and release evidence

- [ ] 3.1 Extend root dependency-order scripts for grid package test/lint/build and pilot application acceptance
- [ ] 3.2 Extend boundary scans for Ant, raw legacy Ratan, `src/Root`, AG Grid Enterprise, raw grid API/configuration exports, and legacy runtime dependencies
- [ ] 3.3 Add browser coverage for list load, filtering, sorting, pagination, pointer/keyboard details, back, appearances, standalone, and federated modes
- [ ] 3.4 Run packed package consumption, unit/component coverage, lint, builds, browser matrix, and strict OpenSpec validation
- [ ] 3.5 Record AG Grid version/license, before/after bundle size, deferred mutation workflows, production service blockers, and cohort exit evidence

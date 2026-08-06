## 1. Direction and Frozen Baseline

- [x] 1.1 Approve the eight directional decisions in `ratan-design/plan.md` and record owners for the four open design questions
- [x] 1.2 Inventory every WebKit public export, registered tag, supporting part, icon library, Table, DataView, and DataGrid surface at the pinned commit
- [x] 1.3 Classify every inventory entry as included, supporting-only, or excluded with rationale and eliminate unresolved classifications
- [x] 1.4 Capture runtime fixtures for properties, attributes, defaults, variants, states, events, slots, methods, themes, modes, and interactions
- [x] 1.5 Implement evidence-conflict resolution records using runtime → tests/source → usage → Storybook → docs precedence
- [x] 1.6 Generate and check in parity, migration, and deviation manifests with schema validation
- [x] 1.7 Add manifest drift, missing-mapping, and unapproved-deviation CI failures

## 2. Workspace and Dependency Architecture

- [x] 2.1 Move the bootstrap public package to `ratan-design/packages/react` without changing its public behavior
- [x] 2.2 Move the bootstrap parity harness to `ratan-design/apps/parity-lab`
- [x] 2.3 Scaffold private `foundation`, `components`, `tokens`, `styles`, `icons`, `patterns`, `data-grid`, `testing`, `storybook`, `standard`, and `vitest` workspaces
- [x] 2.4 Scaffold `apps/docs`, `apps/playground`, `migration`, `manifests`, and private `tooling` directories
- [x] 2.5 Configure npm workspaces, TypeScript project references, and Turbo build/test/lint/docs dependencies
- [x] 2.6 Implement dependency-boundary checks for the approved acyclic workspace graph
- [x] 2.7 Configure `packages/react` as the only publishable workspace and all other Ratan workspaces as private
- [x] 2.8 Add React/ReactDOM 18.2–19 peer ranges and prohibit design-system singleton/runtime configuration

## 3. Public Package Assembly

- [ ] 3.1 Define root, per-component, DataGrid, icons, tokens, testing, CSS, theme, mode, and JSON export maps
- [ ] 3.2 Generate ESM and TypeScript declarations for every public export and subpath
- [x] 3.3 Implement package assembly that bundles or copies private workspace outputs without unresolved workspace dependencies
- [x] 3.4 Declare CSS side effects per subpath and prove root imports exclude DataGrid and unrelated CSS
- [ ] 3.5 Add packed-consumer tests for every documented subpath under React 18.2 and React 19
- [x] 3.6 Add dependency checks prohibiting WebKit, Lit, Shoelace, Emotion, MUI, Ant Design, and external runtime assets
- [x] 3.7 Add package metadata, license validation, SBOM generation, integrity checks, and alpha release configuration

## 4. Tokens, Styles, Modes, and Icons

- [ ] 4.1 Extract, hash, and check in all required frozen `--sc-*` token sources and resolved values
- [ ] 4.2 Add exact-value tests for GDS primitives, semantic/component variables, typography, grid, and supported utilities
- [ ] 4.3 Implement light, dark, CPBB, follow-system, Inter, Roboto Mono, and Dyslexic CSS subpaths
- [ ] 4.4 Implement cascade layers, scoped resets, CSS Module conventions, and stable Ratan `data-*` state conventions
- [ ] 4.5 Add CSS isolation fixtures proving no leakage into tenant content or WebKit internals
- [ ] 4.6 Extract and package the complete included built-in icon libraries with typed exports
- [ ] 4.7 Verify icons, fonts, themes, and modes under CSP with external network access disabled

## 5. Interaction Foundation and Testing Helpers

- [x] 5.1 Add React Aria Components/hooks and define private adapter boundaries in `packages/foundation`
- [x] 5.2 Implement the approved exception manifest and ADR format for interactions without an applicable React Aria primitive
- [x] 5.3 Add static checks rejecting hand-written press, focus, collection, selection, overlay, date, and keyboard-navigation systems without an exception
- [x] 5.4 Implement shared controlled/uncontrolled state and Ratan-owned callback-reason helpers without exposing React Aria types
- [x] 5.5 Implement consumer testing helpers for fixture rendering, keyboard sequences, form reset/submission, overlays, tokens, and parity assertions
- [x] 5.6 Configure shared Vitest, Axe, coverage, strict TypeScript, lint, and zero-warning gates

## 6. Proof Cohort Specifications and Tests

- [x] 6.1 Finalize Button manifest/API specification and write failing contract, form, loading-label, accessibility, and parity tests
- [x] 6.2 Finalize TextInput manifest/API specification and write failing controlled/uncontrolled, form, validation, accessibility, and parity tests
- [x] 6.3 Finalize Dialog manifest/API specification and write failing overlay, dismissal, focus restoration, nesting, cleanup, accessibility, and parity tests
- [x] 6.4 Finalize DatePicker manifest/API specification and write failing locale, parsing, keyboard, form, RTL, accessibility, and parity tests
- [x] 6.5 Finalize Tabs manifest/API specification and write failing selection, keyboard, focus, controlled/uncontrolled, accessibility, and parity tests
- [x] 6.6 Finalize the representative DataGrid slice specification and write failing type, state, keyboard, virtualization, and parity tests

## 7. Proof Cohort Implementation

- [x] 7.1 Implement Button on React Aria with complete frozen variants/defaults and localized `loadingLabel` announcement
- [x] 7.2 Implement TextInput on React Aria with native form/reset/validation behavior and exact token states
- [x] 7.3 Implement Dialog on React Aria with `document.body` portal, dismissal reasons, focus lifecycle, and deterministic cleanup
- [x] 7.4 Implement DatePicker on React Aria with browser-locale defaults, prop override, RTL, forms, and frozen visuals
- [x] 7.5 Implement Tabs on React Aria with complete legacy mappings and keyboard/focus behavior
- [x] 7.6 Implement the representative DataGrid slice on TanStack Table/Virtual behind Ratan-owned types
- [x] 7.7 Refactor the proof cohort while keeping all contract, parity, accessibility, and coverage gates green

## 8. Workbench Foundation and Proof Evidence

- [x] 8.1 Configure Storybook with every proof component variant, state, size, theme, mode, RTL, and interaction fixture
- [x] 8.2 Build docs pages for the proof cohort with purpose, guidance, API, tokens, mappings, deviations, and compilable packed-package examples
- [x] 8.3 Build packed-package playground routes for React 18.2/19, forms, overlays, theme/modes, MFE lifecycle, and mixed WebKit/Ratan use
- [x] 8.4 Build matched WebKit/Ratan parity fixtures for the proof cohort in managed Chrome and Edge
- [x] 8.5 Add computed-style capture, screenshot thresholding, accessibility capture, and deviation linking
- [x] 8.6 Add bundle, synchronous-interaction, overlay-open, mount/unmount, and cleanup measurements for the proof cohort
- [x] 8.7 Run the foundation gate and block catalogue scaling until every proof requirement passes

## 9. Common Component Cohorts

- [ ] 9.1 Generate per-component SDD/TDD checklists from the manifest for actions, typography, display, and feedback components
- [ ] 9.2 Implement and complete workbench evidence for all included action and icon components
- [ ] 9.3 Implement and complete workbench evidence for typography, link, label, badge, tag, avatar, card, box, divider, and spacing components
- [ ] 9.4 Implement and complete workbench evidence for loader, progress, alert, banner, snackbar/toast, and related feedback parts
- [ ] 9.5 Generate per-component SDD/TDD checklists for basic form, selection, and date/time components
- [ ] 9.6 Implement and complete workbench evidence for text/password/number/formatted/card/search inputs and input groups
- [ ] 9.7 Implement and complete workbench evidence for checkbox/radio groups, switch/toggle, rating, slider, dropdown, select, multi-select, and combobox
- [ ] 9.8 Implement and complete workbench evidence for date/range pickers, time input, validation, and locale-sensitive form parts
- [ ] 9.9 Generate per-component SDD/TDD checklists for navigation, overlay, layout, file, list, table, DataView, and composites
- [ ] 9.10 Implement and complete workbench evidence for menus, popovers, tooltips, drawers/sheets, breadcrumbs, pagination, accordion, stepper, carousel, and navigation
- [ ] 9.11 Implement and complete workbench evidence for grids, layouts, sticky/draggable surfaces, scroll helpers, file controls, lists, repeater, and tree
- [ ] 9.12 Implement and complete workbench evidence for Table, DataView, action/status surfaces, and remaining included composite components

## 10. Provider-Free Overlays, Internationalization, and Motion

- [ ] 10.1 Add document-global theme/mode integration tests with no provider or shared Ratan runtime
- [ ] 10.2 Implement and test `document.body` overlay portals, z-index layers, nesting, dismissal reasons, and focus restoration across independent roots
- [ ] 10.3 Implement browser-locale defaults and explicit locale props for every locale-sensitive component
- [ ] 10.4 Add inherited RTL tests for layout, collections, dates, keyboard navigation, and overlays
- [ ] 10.5 Implement frozen motion timings and reduced-motion behavior with approved deviation coverage
- [ ] 10.6 Add repeated MFE mount/unmount tests proving no overlay, listener, observer, or global-style leaks

## 11. Complete DataGrid Subsystem

- [ ] 11.1 Define Ratan-owned row, column, state, callback, reason, and change-detail types with no exported TanStack types
- [ ] 11.2 Implement client/server sorting, filtering, pagination, and controlled/uncontrolled state contracts
- [ ] 11.3 Implement single/multiple selection, keyboard grid navigation, focus persistence, and accessible announcements
- [ ] 11.4 Implement editing, validation hooks, loading/refreshing distinction, and customizable loading/error/empty surfaces
- [ ] 11.5 Implement column ordering, visibility, sizing, pinning, spanning, manager, filters, and action slots
- [ ] 11.6 Implement row pinning, spanning, grouping, tree grouping, expansion, dragging, and selection strategies
- [ ] 11.7 Implement master/detail, overlapping views, custom filters, CSV export, and Excel export hooks
- [ ] 11.8 Implement bounded row/column virtualization and deterministic observer/listener cleanup
- [ ] 11.9 Add the agreed large-data benchmark and prove at least 55 FPS and p95 synchronous work below 10 ms
- [ ] 11.10 Complete manual DataGrid accessibility review and every manifest-recorded parity fixture
- [ ] 11.11 Verify excluded spreadsheet/pivot/personalization features have no accidental public API or implementation scope

## 12. Migration Tooling and Guidance

- [ ] 12.1 Generate WebKit import, attribute/property, event/callback, slot/composition, method, form, and icon mappings
- [ ] 12.2 Generate legacy Ratan and Ant Design component, provider, form, icon, prop, and styling mappings
- [ ] 12.3 Generate MUI component, provider, form, icon, prop, and styling mappings
- [ ] 12.4 Implement and test import, prop, callback/custom-event, and slot/composition codemods from the migration metadata
- [ ] 12.5 Publish the tenant migration playbook with inventory, coexistence, rollout, rollback, observation, cleanup, ownership, and endpoint procedures
- [ ] 12.6 Implement the repository adoption dashboard for parity, evidence, dependency, mapping, migration-plan, pilot, and retirement status
- [ ] 12.7 Publish deprecation warnings, replacement guidance, removal targets, and applicable codemods for every retiring API

## 13. Consumer Pilots and Migration

- [ ] 13.1 Inventory Portal Host WebKit usage and create its cohort-by-cohort migration and rollback plan
- [ ] 13.2 Migrate Portal Host login controls, menus, tabs, dialogs, overlays, feedback, and document-global theming
- [ ] 13.3 Verify Portal Host login, navigation, application/tile opening and rendering, overlays, workspace tabs, and tile removal
- [ ] 13.4 Inventory the first legacy `@fm/ratan-design@1.1.0` consumer and migrate it through public mappings/codemods only
- [ ] 13.5 Verify the first legacy consumer's application, packed-package, accessibility, and rollback gates
- [ ] 13.6 Inventory the second legacy `@fm/ratan-design@1.1.0` consumer and migrate it through public mappings/codemods only
- [ ] 13.7 Verify the second legacy consumer's application, packed-package, accessibility, and rollback gates
- [ ] 13.8 Complete a representative tenant adoption without design-system maintainers modifying tenant business source
- [ ] 13.9 Record owners and committed endpoints for every remaining mixed WebKit/Ratan/MUI/Ant Design application

## 14. Quality, Security, and Release Gates

- [ ] 14.1 Run contract validation proving every included legacy capability has a React mapping or approved deviation
- [ ] 14.2 Run exact token/hash, CSS isolation, Chrome/Edge screenshot, and computed-style gates for the complete fixture matrix
- [ ] 14.3 Run Axe, keyboard, focus, form, reduced-motion, high-contrast, RTL, screen-reader smoke, and 200-percent zoom gates
- [ ] 14.4 Complete required manual accessibility reviews for overlays, collections, dates, tabs, and DataGrid
- [ ] 14.5 Verify greater than 90 percent line/branch coverage, strict TypeScript, zero lint warnings, and compilable documentation examples
- [ ] 14.6 Verify common Portal Host Ratan JavaScript/CSS is at least 20 percent smaller than WebKit and p95 synchronous interactions remain below 10 ms
- [ ] 14.7 Run CSP, offline-asset, vulnerability, license, lockfile, package-integrity, SBOM, and prohibited-dependency gates
- [ ] 14.8 Publish versioned docs, Storybook, manifests, migration artifacts, compatibility matrix, and adoption dashboard for the release candidate

## 15. Retirement and Stable Release

- [ ] 15.1 Confirm 100 percent in-scope manifest completion and zero critical accessibility or unexplained visual findings
- [ ] 15.2 Confirm Portal Host, both legacy consumers, and the representative tenant have passed observation and rollback proof
- [ ] 15.3 Remove the legacy Realworld package, obsolete provider/runtime APIs, old scripts, and stale dependency references
- [ ] 15.4 Re-run packed-consumer, mixed WebKit/Ratan, application E2E, dependency, and release gates after legacy removal
- [ ] 15.5 Publish `@fm/ratan-design@2.0.0` only when every OpenSpec and plan acceptance criterion is satisfied

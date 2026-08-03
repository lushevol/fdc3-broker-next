# React Aria Ratan Design System and Verification Tiles Plan

> Historical plan, superseded on 3 August 2026 for active Portal Host UI by
> `@fm/ratan-design-webkit`. Keep this document as design and coverage history;
> use [`CURRENT_STATE.md`](./CURRENT_STATE.md),
> [`ARCHITECTURE.md`](./ARCHITECTURE.md), and the WebKit package README for
> current implementation rules.

## 1. Status, authority, and outcome

- **Status:** Superseded implementation plan; retained as historical evidence
- **Target track:** `mvp/two-layer-federation/realworld/`
- **Design-system package:** `packages/ratan-design` (`@fm/ratan-design`)
- **Source inventory:** `apps/base`
- **Explicit exclusion:** `apps/base/src/components/ChatbotSidebarV2/**`
- **Priority order:** login, Portal shell/workspace, profile, FDC3, remaining non-chatbot UI, advanced tables

The outcome is a production-oriented, domain-neutral Ratan Design System built on React Aria Components and semantic CSS tokens. MUI and Emotion must not remain implementation or public-API dependencies of `@fm/ratan-design`. The realworld Portal Host, the existing Cashflow application, and four independently built verification Tiles must consume the public package rather than MUI.

“Cover every component” means every user-facing non-chatbot UI area in `apps/base` is represented in a coverage ledger and ends in one of three valid destinations:

1. A reusable primitive or pattern exported by `@fm/ratan-design`.
2. A host-owned composition built only from Ratan Design primitives.
3. A Tile/application-owned composition built only from Ratan Design primitives.

Platform, domain, data-access, FDC3 execution, and controller functions must not be moved into the design system merely because they currently live beside UI code. They remain with their owner and receive tests through the host or verification Tile that exercises them.

## 2. Confirmed decisions

1. Inventory the entire user-facing `apps/base` surface except ChatbotSidebarV2 and all files below it.
2. Implement the system in the existing realworld `@fm/ratan-design` package.
3. Use React Aria Components as the accessible behavior layer and semantic CSS as the styling layer.
4. Remove MUI and Emotion from the active design-system package.
5. Prefer TanStack Table for the advanced table adapter, but implement it after the login, shell/workspace, profile, FDC3, and ordinary component waves.
6. Build verification Tiles as independent applications/remotes, not multiple exposed modules from one remote.
7. Preserve the two-layer runtime: `portal-host -> independently deployed Tile`.
8. Keep React and ReactDOM as the only Module Federation singleton shares.

## 3. Baseline and migration constraints

The baseline inventory found:

- 43 top-level non-chatbot component areas under `apps/base/src/components`.
- Login, Home, SingleView, routing, and admin page compositions outside that directory.
- 110 `apps/base` TypeScript files importing MUI, MUI X, MUI icons, or MUI theme types.
- `@fm/ratan-design` currently exports Button, TextField, NumberField, StatusBadge, InlineAlert, Dialog, and ConfirmationDialog, but implements them with MUI and Emotion.
- `@fm/ratan-data-grid` currently adapts AG Grid Community and remains a separate package.
- The realworld Portal Host and Cashflow application still declare MUI/Emotion dependencies.

React Aria supplies accessible interaction behavior but intentionally does not supply visual styling. Ratan must own the CSS, tokens, variants, density, theme, states, and public types. React Aria Table is suitable for semantic tables; TanStack Table is the preferred lower-priority headless engine for advanced grid behavior.

## 4. Ownership model

### 4.1 `@fm/ratan-design` owns

- Semantic tokens, reset, typography, density, motion, focus, elevation, and z-index scales.
- Light/dark, compact/comfortable, LTR/RTL, forced-colors, reduced-motion, and high-contrast behavior.
- Accessible primitives and reusable domain-neutral patterns.
- Local overlay/portal behavior that works inside the assigned application or Tile root.
- Public prop types that do not expose React Aria, MUI, Emotion, host, FDC3, or application internals.
- Component-level observability hooks already required by the platform design rules.
- Unit, accessibility, interaction, Storybook, and public-package tests.

### 4.2 Portal Host owns

- Login/session orchestration and entitlement decisions.
- App bar, launcher, workspace lifecycle, global appearance controls, notifications, and failure containment.
- Tile registry, loading, activation, closing, duplicate instances, and capability injection.
- Host-level FDC3/OpenFin adapters and global overlay policy.

### 4.3 Tiles own

- Profile and FDC3 verification journeys.
- Domain state, validation rules, service calls, workflows, and domain presentation.
- Composition of Ratan primitives into application screens.

### 4.4 `@fm/ratan-data-grid` owns

- Advanced headless table behavior and the stable grid API.
- TanStack Table and, only if later justified, TanStack Virtual integration.
- Sorting, filtering, selection, pagination, column sizing, keyboard activation, and loading/empty/error composition.
- No domain models and no dependency from `@fm/ratan-design` back to the grid package.

## 5. Complete coverage ledger

The implementation must create a checked-in ledger with one row per source component/page, current behaviors, target owner, target Ratan APIs, tests, story, verification Tile, status, and intentional differences. No row may be marked complete from visual resemblance alone.

### 5.1 Foundations and actions

| Legacy area                                    | Target                                                                                            |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `Button`                                       | `Button` with primary, secondary, danger, ghost, link, pending, disabled, and icon slots          |
| `LoadingButton`, `SearchButton`, `ResetButton` | Button variants and pending-state composition                                                     |
| `ToggleButton`, theme `Switch`                 | `ToggleButton`, `ToggleButtonGroup`, `Switch`                                                     |
| `BuilderButton`                                | Button + Popover + Tabs composition                                                               |
| `SurveyButton`, `Tile` action                  | IconButton/Button variants with Tooltip                                                           |
| MUI icons throughout base                      | One approved icon adapter and accessible `Icon`/`IconButton`; default evaluation target is Lucide |
| `ScWebkit`                                     | Scoped base styles/scrollbar tokens; no React component unless behavior requires one              |

### 5.2 Forms and selection

| Legacy area                     | Target                                                                             |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| `Input`                         | `TextField`, `PasswordField`, textarea variant                                     |
| `Label` and `Select`            | `Select`, `ListBox`, `ListBoxItem`, `FieldLabel`, `FieldDescription`, `FieldError` |
| MUI Autocomplete use            | `ComboBox` and reusable tag/multi-select composition                               |
| `SearchInput`                   | `SearchField` with clear action                                                    |
| `SwitchTime`                    | FieldGroup + Switch composition                                                    |
| Date/time localization provider | Provider-level locale contract and `@internationalized/date` values                |
| `DatePicker`                    | `DateField`, `Calendar`, `DatePicker`                                              |
| `TimePicker`                    | `TimeField`                                                                        |
| `DateTimePicker`                | composed DatePicker + TimeField with one typed value contract                      |
| `DateRangePicker`               | `DateRangePicker` + RangeCalendar                                                  |

### 5.3 Layout, navigation, and overlays

| Legacy area                                | Target                                                                                                               |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `AppBar`                                   | host-owned ShellHeader built from layout and action primitives                                                       |
| `Drawer`, `NewTile`                        | Dialog/Modal + launcher navigation pattern                                                                           |
| Drawer `Menu`/`MenuItem`                   | Menu, MenuItem, SubmenuTrigger, Section, Header, Separator                                                           |
| `SortableTab`, `TabItem`, `TabPanel`       | Tabs, TabList, Tab, TabPanel plus host-owned sortable workspace composition                                          |
| Tab rename/overflow menu                   | TextField + Menu + Dialog confirmation patterns                                                                      |
| `Dialog`, draggable title, timeout dialogs | Modal, Dialog, DialogHeader/Body/Footer; optional movable/resizable behavior remains a separately tested composition |
| Avatar menu                                | Avatar + Menu + Tooltip                                                                                              |
| `Profile`                                  | Card, Disclosure/Accordion, TagGroup, Avatar, Divider, definition-list patterns                                      |

### 5.4 Feedback and status

| Legacy area                     | Target                                                                                   |
| ------------------------------- | ---------------------------------------------------------------------------------------- |
| `Loader`, `PageLoader`          | ProgressBar, ProgressCircle, Skeleton, page-loading pattern                              |
| `Splash`                        | host-owned blocking loading surface                                                      |
| `Empty`                         | EmptyState pattern                                                                       |
| `FallbackError`, `ErrorBoundry` | ErrorState plus owner-specific ErrorBoundary                                             |
| `Snackbar`                      | ToastRegion and Toast; isolate React Aria’s unstable toast API behind a stable Ratan API |
| `SearchCondition`               | InlineAlert/status summary                                                               |
| `SearchConditionContainer`      | Disclosure + status summary composition                                                  |
| `Timeout`                       | ConfirmationDialog/session-expiry composition                                            |
| `Version`                       | InlineAlert + metadata pattern                                                           |
| Admin `Status`                  | StatusBadge + Tooltip                                                                    |
| `Survey`                        | ConfirmationDialog/feedback composition                                                  |

### 5.5 Data display and detail

| Legacy area            | Target                                                            |
| ---------------------- | ----------------------------------------------------------------- |
| `Table`                | semantic Ratan Table for ordinary datasets                        |
| `TableDetail`, `Field` | DescriptionList, editable field rows, Select/ComboBox composition |
| `SearchGrid`           | responsive layout primitive                                       |
| Admin common `Main`    | page/table toolbar composition                                    |
| Admin actions          | Menu/IconButton action-cell pattern                               |
| `CopyText`             | CopyButton with success announcement                              |
| `DateTime` display     | localized `DateTimeText` formatter                                |
| MUI X DataGrid uses    | lower-priority `@fm/ratan-data-grid` TanStack adapter             |

### 5.6 Page and feature compositions

| Legacy area                                                          | Target owner and verification                                 |
| -------------------------------------------------------------------- | ------------------------------------------------------------- |
| Login page and login tab panel                                       | Portal Host; first implementation wave                        |
| Home shell, launcher, workspace, tabs                                | Portal Host; second implementation wave                       |
| SingleView                                                           | Portal Host routing/workspace composition                     |
| Profile                                                              | Identity/Profile verification Tile; third implementation wave |
| Category admin                                                       | Admin/component verification Tile                             |
| Tile admin                                                           | Admin/component verification Tile                             |
| ImportMap admin                                                      | Admin/component verification Tile                             |
| FDC3 declaration tabs, editors, intent/context master lists, dialogs | FDC3 verification Tile; fourth implementation wave            |
| Routing and Snackbar orchestration                                   | Portal Host                                                   |
| ChatbotSidebarV2 and descendants                                     | Explicitly excluded                                           |

## 6. Target package structure

The precise filenames may evolve during TDD, but the package boundaries must converge on:

```text
packages/ratan-design/
├── src/
│   ├── index.ts
│   ├── provider.tsx
│   ├── foundation/
│   │   ├── tokens.ts
│   │   ├── generate-token-css.ts
│   │   ├── reset.css
│   │   ├── typography.css
│   │   └── motion.css
│   ├── components/
│   │   ├── actions/
│   │   ├── forms/
│   │   ├── navigation/
│   │   ├── overlays/
│   │   ├── feedback/
│   │   ├── data-display/
│   │   └── layout/
│   ├── patterns/
│   ├── observability/
│   └── generated/tokens.css
├── tests/
├── stories/
├── demo/
└── docs/
```

CSS must be statically emitted and scoped to `.ratan-design-root`. Components must rely on React Aria state/data attributes such as focus-visible, selected, pressed, invalid, open, and disabled rather than MUI class names. The provider sets appearance attributes and locale context without mutating the document root or creating an Emotion cache.

## 7. Implementation waves

Every wave follows the repository protocol: specification, failing tests, minimum implementation, refactor, coverage, lint, build, Storybook, packed-consumer verification, then browser acceptance.

### Wave 0 — Specification and executable inventory

1. Add the complete coverage ledger and freeze explicit chatbot exclusions.
2. Capture legacy behavior and screenshots at `http://localhost:8001` for login, shell/workspace, profile, and FDC3 before implementation.
3. Define public component contracts without MUI types.
4. Define supported browsers, keyboard journeys, screen-reader semantics, locale/time-zone behavior, overlay root behavior, and responsive breakpoints.
5. Expand semantic tokens for spacing, typography, sizes, borders, elevation, overlay layers, motion, breakpoints, icons, validation, and component states.
6. Record intentional differences where legacy behavior is inaccessible or coupled to MUI.
7. Add package-boundary tests that reject `@mui/*` and `@emotion/*` in active `ratan-design` source, manifest, declarations, and packed output.

**Exit:** every included legacy area has an owner, target API, acceptance test, and verification destination.

### Wave 1 — Remove MUI from the foundation

1. Add `react-aria-components` and `@internationalized/date`.
2. Replace the MUI ThemeProvider with a local Ratan provider.
3. Reimplement the existing seven public components while preserving behavior or documenting deliberate API changes.
4. Remove MUI-derived public props, `sx`, theme augmentation, and Emotion styling.
5. Add accessible Button, IconButton, TextField, PasswordField, NumberField, InlineAlert, StatusBadge, Dialog, and ConfirmationDialog tests and stories.
6. Verify light/dark, density, LTR/RTL, forced-colors, reduced-motion, and local overlay behavior.
7. Update package PROJECT, ARCHITECTURE, RULES, README, changelog, and build externals.

**Exit:** the packed `@fm/ratan-design` artifact has no MUI/Emotion dependency or declaration leakage and retains >90% line and branch coverage.

### Wave 2 — Login

1. Implement Tabs, Form, FieldGroup, PasswordField, Divider, Link, and validation/error patterns.
2. Replace the realworld Portal Host entry experience with a deterministic login/session adapter suitable for the migration track.
3. Preserve loading, invalid credentials, disabled submission, keyboard submission, password masking, and focus restoration behaviors.
4. Create the independently built Identity/Profile Tile skeleton and its standalone mode.
5. Add unit, integration, accessibility, and Playwright login journeys.

**Exit:** login is fully operable by keyboard, exposes correct form semantics, and contains no direct MUI use.

### Wave 3 — Portal shell and workspace

1. Implement layout, typography, AppBar primitives, Menu, Tooltip, Popover, Drawer/Modal, Tabs, Toast, progress, EmptyState, and ErrorState.
2. Migrate the realworld Portal Host launcher, workspace tabs, appearance controls, notifications, and application failure boundary.
3. Preserve duplicate instances, activation without remount, close selection, retry, loading, empty workspace, and responsive behavior.
4. Ensure all overlay containers and styles remain local to the host or assigned Tile root.
5. Add host integration tests and live workspace acceptance.

**Exit:** the Portal Host shell uses only Ratan public APIs and raw semantic layout where no reusable primitive is justified.

### Wave 4 — Profile

1. Implement Avatar, Card, Disclosure/Accordion, TagGroup, Badge, definition-list, and metadata patterns.
2. Build `mfe-identity-profile` as an independent remote with profile summary, roles, expandable sections, status, and editable preference examples.
3. Verify profile loading, empty, error, long-name, many-role, compact/comfortable, light/dark, and RTL states.
4. Exercise both standalone and host-mounted execution.

**Exit:** the legacy profile surface is behaviorally represented and the Tile can be released without rebuilding the host.

### Wave 5 — FDC3

1. Implement ComboBox, multi-value TagGroup, Switch field, master-detail, action toolbar, fullscreen dialog, and editable JSON/text patterns.
2. Build `mfe-fdc3-admin` as an independent remote.
3. Port the FDC3 declaration UI behavior without importing legacy base source or moving FDC3 execution into the design package.
4. Cover declaration summary, filtering, context/intent CRUD presentation, validation, dirty state, add/remove tag values, fullscreen dialog, and error recovery.
5. Connect only through the typed host FDC3 capability/test adapter.

**Exit:** all included FDC3 UI rows in the coverage ledger pass unit, integration, accessibility, and hosted browser tests.

### Wave 6 — Remaining controls and admin compositions

1. Implement SearchField, Select, advanced ComboBox cases, date/time fields and pickers, DateRangePicker, CopyButton, Skeleton, survey/confirmation, timeout, version, and responsive search patterns.
2. Build `mfe-component-lab` as an independent remote.
3. Port Category, Tile, and ImportMap admin presentations using deterministic in-memory repositories.
4. Exercise every component state in Storybook and in at least one integrated Tile journey.
5. Finish all remaining non-chatbot coverage-ledger rows except the advanced grid rows.

**Exit:** no included non-grid row remains unverified.

### Wave 7 — TanStack advanced table, lower priority

1. Write a grid compatibility specification from current MUI X and AG Grid usage.
2. Keep the `@fm/ratan-data-grid` package boundary and replace its AG Grid implementation with `@tanstack/react-table`.
3. Add virtualization only when measured row counts require `@tanstack/react-virtual`.
4. Preserve the domain-neutral public API where practical; version intentional breaking changes.
5. Implement sortable headers, filtering, selection, activation, pagination, resizing, visibility, loading/empty/error, and action cells.
6. Implement export as an application-owned data transformation unless a reusable domain-neutral contract is proven.
7. Build `mfe-data-lab` as an independent remote and migrate the realworld Cashflow grid.

**Exit:** advanced grid journeys pass keyboard, focus, screen-reader, performance, and large-dataset acceptance without AG Grid, MUI X, MUI, or Emotion.

### Wave 8 — Realworld cleanup and compatibility

1. Remove obsolete MUI/Emotion dependencies from the Portal Host, Cashflow, and verification Tiles.
2. Update realworld package/boundary verifiers to reject direct MUI/Emotion UI imports.
3. Decide whether the historical `ratan-design/gds-official` reference is deleted or explicitly excluded from active build and dependency gates; it must never ship in the production artifact.
4. Update runtime registry, root scripts, builds, tests, lint, packed-consumer fixtures, and documentation for all independent Tiles.
5. Confirm React/ReactDOM remain the only singleton shares and the design system is bundled normally into each deployable.

**Exit:** all realworld active UI consumes Ratan, all boundaries pass, and no runtime layer was added.

### Wave 9 — Final automated and live verification

1. Run focused package checks after each wave.
2. Run the full gates:

   ```bash
   npm run realworld:check
   npm run realworld:test:e2e
   ```

3. Start the legacy UI and record the required baseline at `http://localhost:8001`:
   - log in;
   - open New Tile;
   - launch a Tile;
   - close its workspace tab.
4. Start the realworld host and all independent verification remotes.
5. Complete the hosted live journey:
   - log in using keyboard only;
   - operate launcher, workspace tabs, duplicate Tile instances, activation, and close;
   - open Identity/Profile, Component Lab, FDC3 Admin, and Data Lab Tiles;
   - exercise every documented component state;
   - switch light/dark and compact/comfortable and confirm mounted Tiles update without losing state;
   - repeat critical journeys in RTL, forced-colors, reduced-motion, narrow viewport, and desktop viewport;
   - verify focus trapping/restoration for dialogs, popovers, menus, drawers, and date pickers;
   - verify toast announcements and loading/error/empty recovery;
   - verify FDC3 adapter success and failure states;
   - verify table keyboard navigation, sorting, filtering, selection, pagination, and large-data performance;
   - close each Tile and confirm no styles, portals, listeners, or state leak into another root.
6. Inspect browser console, failed network requests, accessibility results, interaction timing, and screenshots.
7. Store Playwright traces/screenshots and update `realworld/docs/VERIFICATION.md` with the exact commands, ports, results, known limitations, and evidence paths.

**Exit:** automated gates pass, the live verification checklist passes without console errors or critical accessibility violations, and every coverage-ledger row links to evidence.

## 8. Independent verification applications

| Application                 | Default port | Primary responsibility                                                                            |
| --------------------------- | -----------: | ------------------------------------------------------------------------------------------------- |
| `apps/mfe-identity-profile` |         9202 | Login-related field behaviors, profile, avatar, disclosure, cards, tags                           |
| `apps/mfe-component-lab`    |         9203 | Remaining controls, dates, overlays, feedback, search, Category/Tile/ImportMap admin compositions |
| `apps/mfe-fdc3-admin`       |         9204 | FDC3 declaration editor, intent/context lists, master-detail, validation, dialogs                 |
| `apps/mfe-data-lab`         |         9205 | Semantic table and lower-priority TanStack advanced-grid behavior                                 |

Each application must:

- have its own package identity, manifest, build, tests, lint, standalone entry, and registry record;
- consume the packed/public `@fm/ratan-design` API;
- receive appearance and platform capabilities through versioned contracts;
- be independently startable and releasable;
- expose no source alias into the host or another Tile;
- contain deterministic fixtures for every state it verifies.

## 9. Test strategy and quality gates

### Component tests

- Test observable behavior and accessibility semantics, not React Aria internals or CSS implementation.
- Cover pointer, keyboard, touch-equivalent semantics where supported, disabled, readonly, required, invalid, loading, controlled, and uncontrolled contracts.
- Test focus-visible, focus movement, focus restoration, escape dismissal, outside interaction, and non-dismissible overlays.
- Test all appearance combinations and token generation drift.
- Maintain >90% line and branch coverage per package.

### Accessibility

- Prefer role/name/state queries.
- Add automated axe checks to component stories and integrated pages.
- Require zero critical/serious violations for supported states.
- Define manual keyboard scripts for every composite component.
- Verify screen-reader names, descriptions, live regions, error association, table headers, and dialog relationships.

### Visual and responsive

- Add Storybook stories for every public component and meaningful state.
- Add Playwright screenshots for light/dark, compact/comfortable, narrow/desktop, RTL, and forced-colors baselines.
- Reject overlaps, clipped focus rings, inaccessible overflow, and host/Tile style leakage.

### Performance

- Measure interaction latency for menus, dialogs, tabs, form validation, and table operations.
- Treat the repository’s <10 ms interaction target as a measurement gate for local state updates.
- Establish bundle budgets for the design package and each Tile.
- Do not add virtualization until measured data proves it is required.

### Dependency and runtime boundaries

- Reject MUI and Emotion in active `@fm/ratan-design` source, package metadata, declarations, and packed artifacts.
- Reject direct MUI/Emotion use in migrated realworld UI.
- Reject Single-SPA, SystemJS, import maps, POC packages, legacy source imports, and design-system federation remotes.
- Confirm React and ReactDOM are the only federation singletons.

## 10. Definition of done

The program is complete only when:

1. Every included `apps/base` UI area has a completed coverage-ledger row.
2. ChatbotSidebarV2 and descendants remain untouched and explicitly excluded.
3. `@fm/ratan-design` is React Aria/CSS based and has no MUI/Emotion implementation or public type leakage.
4. Login, Portal shell/workspace, profile, and FDC3 are implemented in that order before lower-priority grid work.
5. The four verification Tiles build and deploy independently.
6. The Portal Host, existing Cashflow application, and verification Tiles consume only approved Ratan public APIs for covered UI.
7. `@fm/ratan-data-grid` uses TanStack Table, with virtualization justified by measurements.
8. Tests, lint, builds, coverage, Storybook, boundary scans, packed-consumer tests, and realworld E2E pass.
9. Required legacy `localhost:8001` verification and realworld live browser verification are completed and recorded.
10. Documentation describes intentional differences, remaining risks, and migration evidence.

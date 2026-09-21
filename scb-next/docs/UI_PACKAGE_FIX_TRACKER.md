# Ratan Design Origin Fix Tracker

Created: 2026-09-19. Source: [package clinic](UI_PACKAGE_CLINIC.md).

**Progress: 24/30 DONE. Next: RD-025.** The clinic contains the review evidence
and its limits. Reproduce each finding against the checkout used for implementation
before changing behavior, then record current verification evidence here.

## Status and priority

- **TODO**: not started; **IN PROGRESS**: active; **BLOCKED**: record the concrete
  dependency and owner; **DONE**: acceptance criteria and completion evidence met.
- **P1**: broken interaction, public contract, accessibility or token correctness.
- **P2**: consistency, distribution quality, maintainability or release readiness.
- **P3**: adoption experiment or performance work requiring measurements first.
- **Confirmed** means the clinic reported a runtime/browser reproduction.
  **Static finding** means source/tooling inspection identified the issue or gap.
  **Enhancement** is proposed behavior or infrastructure, not a reproduced defect.
  **Historical baseline** must be reproduced; it is not a newly observed failure.

Work one item at a time by default. Small related items may share a stage when the
acceptance evidence identifies each item separately. The suggested sequence is
phase 1 interaction contracts, phase 2 design consistency, phase 3 distribution
quality, then phase 4 adoption. Dependencies take precedence over ID order.

| ID | Item | Priority | Phase | Status |
| --- | --- | --- | --- | --- |
| [RD-001](#rd-001) | Closed loading overlay hit testing | P1 | 1 | DONE |
| [RD-002](#rd-002) | Empty and partial range values | P1 | 1 | DONE |
| [RD-003](#rd-003) | Uncontrolled date values | P1 | 1 | DONE |
| [RD-004](#rd-004) | Search clear name and disabled state | P1 | 1 | DONE |
| [RD-005](#rd-005) | Label and native Select names | P1 | 1 | DONE |
| [RD-006](#rd-006) | Loading announcements | P1 | 1 | DONE |
| [RD-007](#rd-007) | Collapsed criteria keyboard behavior | P1 | 1 | DONE |
| [RD-008](#rd-008) | Dialog title relationships | P1 | 1 | DONE |
| [RD-009](#rd-009) | Builder instance IDs | P1 | 1 | DONE |
| [RD-010](#rd-010) | Shared field state | P1 | 1 | DONE |
| [RD-011](#rd-011) | Supported sx composition | P1 | 1 | DONE |
| [RD-012](#rd-012) | SearchButton loadingPosition | P1 | 1 | DONE |
| [RD-013](#rd-013) | Builder close requests | P2 | 1 | DONE |
| [RD-014](#rd-014) | Responsive token conditions | P1 | 2 | DONE |
| [RD-015](#rd-015) | Unresolved font-size token | P1 | 2 | DONE |
| [RD-016](#rd-016) | Canonical token source | P2 | 2 | DONE |
| [RD-017](#rd-017) | WebKit action states | P2 | 2 | DONE |
| [RD-018](#rd-018) | Contrast and focus cues | P1 | 2 | DONE |
| [RD-019](#rd-019) | Reduced motion | P2 | 2 | DONE |
| [RD-020](#rd-020) | Public contracts and font ownership | P2 | 2 | DONE |
| [RD-021](#rd-021) | Tree shaking and package byte budget | P2 | 3 | DONE |
| [RD-022](#rd-022) | Browser accessibility and visual gates | P2 | 3 | DONE |
| [RD-023](#rd-023) | Dependency resolution verification | P2 | 3 | DONE |
| [RD-024](#rd-024) | Lint and aggregate verification | P2 | 3 | DONE |
| [RD-025](#rd-025) | Shared pure host adapters | P2 | 4 | TODO |
| [RD-026](#rd-026) | Explicit host appearance contract | P2 | 4 | TODO |
| [RD-027](#rd-027) | Alpha direct-adoption pilot | P3 | 4 | TODO |
| [RD-028](#rd-028) | Release ownership and decisions | P2 | 4 | TODO |
| [RD-029](#rd-029) | Reproduce historical host test failures | P2 | 1 preflight | TODO |
| [RD-030](#rd-030) | Real host performance budgets | P3 | 3 measurement | TODO |

## Compatibility boundaries

Each fix must account for [release and rollback policy](UI_PACKAGE_RELEASE.md)
and the [existing implementation contracts](UI_PACKAGE_IMPLEMENTATION.md).

- Preserve legacy defaults and existing Base imports, including compatibility
  aliases, unless a deliberate migration changes them.
- Existing hosts retain their forced portal/container behavior and theme policy.
  Do not silently substitute package defaults for host decisions.
- Inactive Builder panels remain mounted where that preserves existing state.
  Fix their accessibility relationships without changing that lifecycle by accident.
- Core, dates, Pro range, compatibility and portal-theme remain separate entries.
  Core consumers must not acquire optional peers or Pro licensing requirements.
- Hosts continue to own routing, authentication, storage, FDC3, localization,
  workspace policy and production Pro license initialization.
- Style and visual fixes require review in legacy/WebKit and light/dark modes,
  including mobile layouts and relevant host overlays.

## Definition of done and evidence

For each implementation item:

1. Update the behavior specification first. For a defect, add a regression that
   fails for the reported public behavior before implementing the fix. For a
   documentation-only item, verify links and accuracy instead of adding artificial
   tests. Follow [engineering standards](../../docs/rules.md).
2. Before editing a function, class or method, run GitNexus upstream impact for
   the symbol. Record direct callers, affected processes and risk; surface HIGH
   or CRITICAL risk before editing. Documentation-only changes do not edit symbols.
3. Satisfy the item-specific acceptance criteria below and run focused checks
   appropriate to the scope. Maintain package line and branch coverage above 90%.
4. At the completed stage, run the applicable package, packed-consumer, catalog,
   host and release checks in [Contribution Checks](UI_PACKAGE_RELEASE.md#contribution-checks).
   For UI changes, verify the required host login → New Tile → render → remove
   journey and record the actual URL, viewport and appearance configuration.
5. Run staged `detect_changes()` before an isolated commit; confirm that changed
   symbols and execution flows match the intended stage. Make a best-effort
   focused commit, excluding unrelated work, and record any commit blocker.
6. Record evidence, update the progress table and mark DONE only when all
   acceptance criteria are met. Record pre-existing failures explicitly; a failed
   broad suite is not a passing result.

Use this completion record under the item or link to a committed evidence file:

```text
Status: DONE
Completed: YYYY-MM-DD
Owner:
Commit(s):
Specification/regression:
GitNexus impact and staged detect_changes:
Commands (include working directory):
Outcomes (counts, sizes, modes/viewports, relevant logs/artifacts):
Compatibility review and rollback target:
Limitations / pre-existing failures / follow-up IDs:
```

Do not treat historical benchmark numbers as current results. If a finding no
longer reproduces, record the current evidence and resolving commit before
closing it; do not silently remove the item. Update the total and next-item marker
whenever status changes.

## Phase 1: Interaction contracts

### RD-001

**Closed LoadingOverlay must not intercept input.** P1 · Confirmed · DONE.
Dependencies: none. [Clinic](UI_PACKAGE_CLINIC.md#rd-001).

- [x] Specify inactive, opening, active and closing hit-testing behavior without
  changing host portal/container policy.
- [x] Remove inactive hit testing or unmount after the exit transition; preserve
  the intended blocking behavior while loading.
- [x] A browser regression opens and closes the overlay, then clicks and
  keyboard-activates the underlying control successfully. Verify visible loading
  status as well as underlying interaction; absence of status alone is insufficient.

```text
Status: DONE
Completed: 2026-09-21
Owner: Codex
Commit(s): fix(ratan-design): release closed loading overlays (this stage)
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-001 contract;
  presentation.test.tsx public contract regression; design-origin.spec.ts packed-
  consumer pointer and keyboard regression.
GitNexus impact and staged detect_changes: LoadingOverlay upstream impact LOW;
  one direct test caller, no affected processes/modules. Staged scope audit is
  recorded in the stage commit evidence.
Commands (working directory scb-next): package test, typecheck, lint and build;
  Storybook build; verify:package; verify:dependency-isolation; consumer and host
  Playwright suites.
Outcomes: 10 test files/57 package tests passed with 100% line/branch coverage;
  packed tarball typechecked under bundler and node resolution and passed build/
  SSR checks; Storybook built; dependency isolation passed; consumer browser
  matrix passed 10/10 at 390px and 1280px in legacy/WebKit and light/dark;
  overlay regression passed at the default 1280x720 viewport on
  http://127.0.0.1:8019; host journey passed 1/1 at 1280x720 on
  http://127.0.0.1:8001.
Compatibility review and rollback target: closed roots now use pointer-events:none;
  open caller pointer policy, root sizing/styles, portal ownership and Base Splash's
  permanently-open use remain unchanged. Roll back this stage commit if a host
  depends on a closed overlay intercepting input.
Limitations / pre-existing failures / follow-up IDs: none for RD-001. Registry,
  asset and Pro-license ownership remain tracked by RD-028.
```

### RD-002

**Preserve empty and partial range endpoints.** P1 · Confirmed · DONE.
Dependencies: none. [Clinic](UI_PACKAGE_CLINIC.md#rd-002).

- [x] Specify null, partial and complete Dayjs range values; avoid coercing valid
  null endpoints into invalid dates.
- [x] Test `[null, null]`, both partial forms, a selected range and clearing through
  the public range entry. Assert values and validation callbacks.
- [x] Verify packed range declarations/runtime with optional peers installed;
  preserve explicit host localization and Pro licensing responsibilities.

```text
Status: DONE
Completed: 2026-09-20
Owner: Codex
Commit(s): fix(ratan-design): preserve partial date ranges (this stage)
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-002 contract;
  date-range.test.tsx public value/validation regressions; packed dates fixture
  rejects invalid empty or partial range SSR.
GitNexus impact and staged detect_changes: DateRangePicker upstream impact LOW;
  three direct dependants, one affected module and no processes. Staged scope
  audit is recorded in the stage commit evidence.
Commands (working directory scb-next): package test, typecheck, lint and build;
  Storybook build; verify:package; verify:dependency-isolation; Base focused range
  test, typecheck and build; host Playwright suite.
Outcomes: 10 test files/61 package tests passed with 100% line/branch coverage;
  `[null,null]`, both partial forms, complete/edit and clearing callbacks pass;
  packed tarball declarations/build and null-endpoint SSR pass with optional peers;
  Base range adapter passed 3/3 and Base typecheck/build passed; host journey passed
  1/1 at 1280x720 on http://127.0.0.1:8001.
Compatibility review and rollback target: null endpoints remain null while non-null
  endpoints retain Dayjs normalization; the single field, caller localization,
  callback signatures, optional entry and host-owned Pro licensing are unchanged.
  Roll back this stage commit if an undocumented consumer relies on invalid Dayjs
  instances for null range endpoints.
Limitations / pre-existing failures / follow-up IDs: MUI/Vite builds retain their
  existing module-directive and future config-loader warnings. RD-003 separately
  covers uncontrolled community date values; RD-028 owns release/licensing gates.
```

### RD-003

**Preserve uncontrolled date defaults.** P1 · Confirmed · DONE.
Dependencies: none; coordinate with RD-002. [Clinic](UI_PACKAGE_CLINIC.md#rd-003).

- [x] Specify the distinction between omitted `value`, explicit `null` and a
  selected value for every community date wrapper.
- [x] Verify default-value-only controls render their defaults, accept edits and
  clear correctly; controlled controls continue following their supplied value.
- [x] Cover public type/runtime contracts without uncontrolled/controlled React
  warnings; run affected date and packed-consumer checks.

```text
Status: DONE
Completed: 2026-09-20
Owner: Codex
Commit(s): fix(ratan-design): preserve uncontrolled date defaults (this stage)
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-003 contract;
  dates.test.tsx public field/change and warning regressions for DatePicker,
  DateTimePicker and TimePicker; packed dates fixture renders deterministic
  default values for all three wrappers.
GitNexus impact and staged detect_changes: each wrapper has LOW upstream impact,
  three direct dependants, one affected module and no processes. Staged scope
  audit is recorded in the stage commit evidence.
Commands (working directory scb-next): package test, typecheck, lint and build;
  Storybook build; verify:package; verify:dependency-isolation; four Base date
  adapter test files, Base typecheck/build; host Playwright suite.
Outcomes: 10 test files/64 package tests passed with 100% line/branch coverage;
  each default-value-only wrapper rendered its default, accepted an edit, cleared
  to null and emitted no ownership warning; packed declarations/build and SSR
  passed with optional peers; Base passed 4 files/10 tests plus typecheck/build;
  host journey passed 1/1 at 1280x720 on http://127.0.0.1:8001.
Compatibility review and rollback target: omitted values now remain uncontrolled;
  explicit null and selected values remain controlled, with non-null Dayjs
  normalization intact. Localization, formats, callbacks, layout and optional-peer
  ownership are unchanged. Roll back this stage commit if a host intentionally
  relied on omitted values suppressing MUI X defaultValue.
Limitations / pre-existing failures / follow-up IDs: the focused development stack
  emitted an alpha API EMFILE watcher failure plus login-input ownership and nested-
  button console warnings outside the date wrappers; the required UI journey still
  passed. RD-029 owns broader host-failure reproduction.
```

### RD-004

**Make search clearing accessible and honor field state.** P1 · Confirmed · DONE.
Dependencies: none. [Clinic](UI_PACKAGE_CLINIC.md#rd-004).

- [x] Supply a documented, localizable accessible name for the clear action.
- [x] Specify and test disabled/read-only behavior; clearing must not mutate a
  field when that action is unavailable.
- [x] Exercise pointer and keyboard clearing, focus handling and callback
  behavior; verify the button name with an accessibility scan.

```text
Status: DONE
Completed: 2026-09-20
Owner: Codex
Commit(s): fix(ratan-design): make search clearing accessible (this stage)
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-004 contract;
  controls.test.tsx covers default/localized names, effective disabled/read-only
  state, legacy/modern precedence and callback suppression; design-origin.spec.ts
  covers packed-consumer pointer and keyboard clearing, focus retention and names.
GitNexus impact and staged detect_changes: SearchInput and SearchInputProps upstream
  impact LOW; three rendered and 17 type-level dependants, one module and no
  processes. The packed fixture App is absent from the index. Staged scope audit
  is recorded in the stage commit evidence.
Commands (working directory scb-next): package test/coverage, typecheck, lint,
  build and Storybook build; verify:package; verify:dependency-isolation; Base
  focused SearchInput/Builder tests and typecheck; packed-consumer and host
  Playwright suites; Base aggregate build.
Outcomes: 10 files/71 package tests and 100% statement/branch/function/line
  coverage passed; declarations, package build, Storybook, tarball verification
  and dependency isolation passed; Base focused tests passed 2 files/4 tests and
  typecheck passed; packed-consumer matrix passed 11/11 at 390px and 1280px in
  legacy/WebKit and light/dark, with the focused clear regression passing at
  1280x720 on http://127.0.0.1:8019; host journey passed 1/1 at 1280x720 on
  http://127.0.0.1:8001 with no uncaught page errors. Base webpack also passed.
Compatibility review and rollback target: handleClear remains caller-owned and is
  called once for enabled pointer/keyboard activation; the package adds only a
  default/localizable name and mirrors effective field availability. Modern slots
  retain precedence over matching legacy props. Roll back this stage commit if an
  undocumented host depends on clearing a disabled or read-only SearchInput.
Limitations / pre-existing failures / follow-up IDs: Base's aggregate build remains
  nonzero because server/tsconfig.json uses removed importsNotUsedAsValues and the
  installed Storybook builder module is missing; Base typecheck and webpack pass.
  The host stack also repeats alpha API EMFILE, login ownership, kebab-case CSS,
  federation version and nested-button warnings outside SearchInput. RD-029 owns
  broader host-failure reproduction; RD-028 owns release/licensing gates.
```

### RD-005

**Connect labels to custom and native Select controls.** P1 · Confirmed · DONE.
Dependencies: none; coordinate with RD-010. [Clinic](UI_PACKAGE_CLINIC.md#rd-005).

- [x] Define how Label, generated control IDs and explicit IDs establish each
  control's accessible name.
- [x] Verify native Select with no supplied ID, explicit IDs, repeated instances
  and the existing “Group by” example are named correctly.
- [x] Run component assertions and a browser accessibility scan; preserve
  compatible host labels and the supported control variants.

```text
Status: DONE
Completed: 2026-09-20
Owner: Codex
Commit(s): fix(ratan-design): connect select accessible names (this stage)
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-005 contract;
  controls.test.tsx reproduces and verifies generated custom/native IDs, repeated
  native instances, explicit IDs, Label defaults and ARIA overrides; the existing
  Storybook Group by state exercises the repaired Label; design-origin.spec.ts
  verifies names, native interaction, relationships and an unnamed-combobox scan.
GitNexus impact and staged detect_changes: exact Label and Select render-function
  impact LOW, with one and two direct test dependants respectively, no processes
  or modules. The name-only SelectProps graph reports CRITICAL/316 dependants, so
  its public interface was deliberately left unchanged. Packed App is not indexed.
  The staged scope audit is recorded in the stage commit evidence.
Commands (working directory scb-next): package test/coverage, typecheck, lint,
  build and Storybook build; verify:package; verify:dependency-isolation; Base
  focused Label/Select tests, typecheck and build; packed-consumer and host
  Playwright suites.
Outcomes: 10 files/73 package tests passed with 100% statements/functions/lines
  and 99.4% branch coverage; package build, Storybook, tarball verification and
  dependency isolation passed; Base adapters passed 2 files/5 tests, typecheck
  and production build; packed-consumer matrix passed 12/12 at 390px and 1280px
  in legacy/WebKit and light/dark, including the focused naming scan at 1280x720
  on http://127.0.0.1:8019; host journey passed 1/1 at 1280x720 on
  http://127.0.0.1:8001 with no uncaught page errors.
Compatibility review and rollback target: generated IDs fill only omitted IDs;
  explicit id/labelId, values, callbacks, refs, variants and label layout remain
  unchanged. Label retains its hidden default menu item and selection behavior;
  explicit ARIA naming remains authoritative. Roll back this stage commit if an
  undocumented consumer depends on a Select without an ID or an unnamed Label.
Limitations / pre-existing failures / follow-up IDs: packed builds retain MUI
  module-directive and local Pro-license warnings. The host repeats alpha API
  EMFILE, login ownership, kebab-case CSS, federation version and nested-button
  warnings outside these controls. RD-029 owns broader host-failure reproduction;
  RD-028 owns release/licensing gates.
```

### RD-006

**Make loading announcements consistent.** P1 · Confirmed · DONE.
Dependencies: none; coordinate with RD-012. [Clinic](UI_PACKAGE_CLINIC.md#rd-006).

- [x] Specify busy semantics and accessible names for every supported loading
  position; choose when the spinner is named versus decorative.
- [x] Verify loading start/end, button naming, disabled behavior and announced
  status without duplicate announcements.
- [x] Cover each position in component tests and browser accessibility checks.

```text
Status: DONE
Completed: 2026-09-20
Owner: Codex
Commit(s): fix(ratan-design): announce loading actions consistently (this stage)
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-006 contract;
  controls.test.tsx and loading-compatibility.test.tsx cover inline/start-icon and
  SearchButton semantics; design-origin.spec.ts verifies the packed-browser
  accessibility tree and loading transition.
GitNexus impact and staged detect_changes: LoadingButton LOW with two direct
  dependants; LoadingButtonProps LOW with three direct dependants; SearchButton
  LOW with one direct dependant; SearchButtonProps LOW with two direct dependants;
  no affected processes. Staged scope audit is recorded in this stage commit.
Commands (working directory scb-next): focused and full package tests with
  coverage; package typecheck/lint/build and Storybook build; verify:package;
  verify:dependency-isolation; packed focused/full Playwright; Base focused tests,
  typecheck/build; host Playwright journey.
Outcomes: 10 files/73 package tests passed; coverage 100% statements/functions/
  lines and 99.4% branches; packed consumer passed 13/13 at 390px and 1280px in
  legacy/WebKit and light/dark, including focused loading regression 1/1 on
  http://127.0.0.1:8019; Base passed 2 files/4 tests plus typecheck/build; host
  login, New Tile, Cashflow render and tab removal passed 1/1 at 1280x720 on
  http://127.0.0.1:8001; remaining package and release gates passed.
Compatibility review and rollback target: button names, spinner sizing, disabled
  behavior, caller start icons and Base's 16px adapter default are preserved.
  Roll back this stage if a consumer relies on the nested progressbar being
  separately announced. SearchButton loadingPosition remains owned by RD-012.
Limitations / pre-existing failures / follow-up IDs: the dev stack retained its
  known Alpha API EMFILE watcher failure plus existing Vite config-loader,
  federation version, kebab-case CSS, login ownership and nested-button warnings.
  None prevented the required host journey. RD-012 remains open.
```

### RD-007

**Keep collapsed criteria out of hidden keyboard navigation.** P1 · Confirmed · DONE.
Dependencies: none. [Clinic](UI_PACKAGE_CLINIC.md#rd-007).

- [x] Specify which criteria remain visible and interactive when collapsed;
  preserve entered state and define focus handling when collapsing.
- [x] Add correct `aria-expanded`, `aria-controls` and expand/collapse names;
  hidden criteria must not remain keyboard-activatable.
- [x] Verify Tab/Shift+Tab, expand, edit and collapse in a browser at desktop and
  mobile widths. Confirm visible criteria still work.

```text
Status: DONE
Completed: 2026-09-20
Owner: Codex
Commit(s): fix(ratan-design): remove clipped criteria from navigation (this stage)
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-007 contract;
  controls.test.tsx covers stable/effective IDs, toggle semantics, measured-row
  inertness, focus recovery and expansion; design-origin.spec.ts covers real
  Tab/Shift+Tab, activation, collapse and retained state at both target widths.
GitNexus impact and staged detect_changes: SearchConditionContainer LOW with one
  direct test dependant and no affected processes/modules; packed fixture App is
  absent from the index. Staged scope audit is recorded in this stage commit.
Commands (working directory scb-next): focused/full package tests, typecheck,
  lint/build and Storybook build; verify:package; verify:dependency-isolation;
  focused/full packed Playwright; Base focused adapter tests, typecheck/build;
  host Playwright journey.
Outcomes: 10 files/74 package tests passed with 97.96% lines and 96.60% branches;
  independent tarball declarations/build/SSR passed; packed browser passed focused
  2/2 and full 15/15 at 390px and 1280px across legacy/WebKit and light/dark on
  http://127.0.0.1:8019; Base passed 1 file/2 tests plus typecheck/build; host
  login, New Tile, Cashflow render and tab removal passed 1/1 at 1280x720 on
  http://127.0.0.1:8001; Storybook and dependency isolation passed.
Compatibility review and rollback target: the 49px collapsed height, first-row
  actions, all mounted child state, caller IDs, style precedence, themes and Base
  re-export remain intact. Managed inert/ARIA attributes restore caller values.
  Roll back this stage if a host intentionally tabs into visually clipped rows.
Limitations / pre-existing failures / follow-up IDs: package builds retain MUI
  module-directive warnings. The dev stack retained Alpha API EMFILE plus existing
  Vite config-loader, federation version, kebab-case CSS, login ownership and
  nested-button warnings; none prevented the required journey. RD-029 owns the
  broader host-warning baseline.
```

### RD-008

**Resolve Dialog title IDs once.** P1 · Confirmed · DONE.
Dependencies: none. [Clinic](UI_PACKAGE_CLINIC.md#rd-008).

- [x] Define precedence for generated IDs, `titleProps.id`, custom headers,
  suppressed headers and explicitly supplied accessible names.
- [x] Verify every `aria-labelledby` resolves to the intended mounted title,
  including multiple dialogs and custom IDs; avoid dangling references.
- [x] Run dialog public-contract tests and browser naming/focus checks in the
  host portal configuration.

```text
Status: DONE
Completed: 2026-09-20
Owner: Codex
Commit(s): pending this stage commit
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-008 contract;
  dialog.test.tsx covers generated, explicit, custom, suppressed and PaperProps
  names plus unique IDs; the packed-consumer fixture and design-origin.spec.ts
  cover scoped-portal naming, focus entry and focus restoration.
GitNexus impact and staged detect_changes: Dialog upstream impact MEDIUM: five
  direct dependants, one Scenarios module and no affected execution flows.
  Staged detect_changes found eight files/12 symbols, no affected processes and
  LOW risk; the scope is limited to Dialog behavior, package/consumer coverage
  and the accompanying contract documentation.
Commands (working directory scb-next): package test, typecheck, lint, build,
  Storybook build, verify:package and verify:dependency-isolation; Base focused
  Dialog test, typecheck and build; packed-consumer and Base-host Playwright suites.
Outcomes: 10 package test files/76 tests passed with 98.03% line and 96.5%
  branch coverage; package, catalog and isolated-dependency checks passed; the
  packed-consumer matrix passed 16/16 at 390px and 1280px across legacy/WebKit
  and light/dark at http://127.0.0.1:8019; the Base host journey passed 1/1 at
  http://127.0.0.1:8001.
Compatibility review and rollback target: titleProps IDs, explicit caller names,
  header suppression, custom headers, PaperProps names, Base's portal container,
  close behavior and focus restoration remain supported. Roll back this stage if
  a consumer depends on MUI's generated dangling relationship for an unnamed
  custom or suppressed header.
Limitations / pre-existing failures / follow-up IDs: a coverage-enabled focused
  Base test fails its global 90% suite threshold despite the 5/5 contract tests
  passing; the no-coverage focused command, Base typecheck/build and host journey
  pass. Vite retains its existing config-loader warning. RD-009 is next.
```

### RD-009

**Namespace Builder tab/panel IDs per instance.** P1 · Confirmed · DONE.
Dependencies: none. [Clinic](UI_PACKAGE_CLINIC.md#rd-009).

- [x] Define a shared instance namespace for tab IDs, panel IDs and their ARIA
  relationships without requiring callers to coordinate global IDs.
- [x] Render two Builders together and verify unique IDs, correct relationships
  and independent keyboard tab selection.
- [x] Verify inactive panels keep their established mounted state and values;
  check SSR/hydration compatibility where the generated IDs are rendered.

```text
Status: DONE
Completed: 2026-09-20
Owner: Codex
Commit(s): pending this stage commit
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-009 contract;
  builder.test.tsx covers two concurrent Builder instances, namespaced ARIA
  pairs, independent keyboard selection, retained inactive state, explicit caller
  relationships and SSR/hydration of IDs rendered by BuilderButton.
GitNexus impact and staged detect_changes: BuilderTabPanel LOW (three direct
  dependants) and builderTabProps LOW (two direct dependants); neither affects
  an execution flow. The staged scope audit is recorded in this stage commit.
Commands (working directory scb-next): focused/full package tests, typecheck,
  lint, build and verify:package; Storybook and dependency-isolation checks;
  Base focused Builder test, typecheck/build; Base-host Playwright journey.
Outcomes: 10 package test files/79 tests passed with 98.14% lines and 96.41%
  branches; package, catalog and isolated-dependency checks passed; Base passed
  one focused test file/2 tests plus typecheck/build; the host journey passed 1/1
  at http://127.0.0.1:8001 with the required Ratan remote running.
Compatibility review and rollback target: legacy helper IDs, explicit caller
  IDs/relationships, controlled anchor/open ownership, package tab navigation and
  mounted inactive panels remain supported. Roll back this stage if an adapter
  depends on colliding static package tab/panel IDs across concurrent Builders.
Limitations / pre-existing failures / follow-up IDs: MUI Popover portals do not
  server-render tab/panel children; the runtime multi-instance regression covers
  those relationships, while the hydration regression covers rendered trigger IDs
  and reports no recoverable hydration errors. The focused coverage command runs
  all-file thresholds and therefore exits nonzero despite 7/7 tests passing; the
  full gate passes. The full dev launcher has an unrelated Alpha watcher EMFILE /
  port-8086 conflict; the prerequisite frontend-only host setup passed.
```

### RD-010

**Propagate shared field state consistently.** P1 · Confirmed · DONE.
Dependencies: none; coordinate with RD-005. [Clinic](UI_PACKAGE_CLINIC.md#rd-010).

- [x] Specify precedence and propagation for disabled, error and required state
  across Input/Select, their FormControl, label and input elements.
- [x] Test the public combinations and state transitions rather than only the
  underlying input attributes.
- [x] Verify label/control appearance and semantics in both modes and generations;
  factor a small internal helper only if it makes these rules easier to maintain.

```text
Status: DONE
Completed: 2026-09-20
Owner: Codex
Commit(s): pending this stage commit
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-010 contract;
  controls.test.tsx covers effective Input disabled/required slot precedence,
  error semantics, Input/Select state transitions and the FormControl/label/native
  control state in legacy/WebKit plus light/dark combinations.
GitNexus impact and staged detect_changes: Input LOW (four direct dependants) and
  Select LOW (two direct dependants), with no affected execution flows. The staged
  scope audit is recorded in this stage commit.
Commands (working directory scb-next): focused/full package tests, typecheck,
  lint, build and verify:package; Storybook and dependency-isolation checks;
  Base Input/Select focused tests, typecheck/build; Base-host Playwright journey.
Outcomes: 10 package test files/87 tests passed with 98.16% lines and 96.47%
  branches; package, catalog and isolated-dependency checks passed; Base passed
  three focused test files/11 tests plus typecheck/build; the host journey passed
  1/1 at http://127.0.0.1:8001 with required remotes running.
Compatibility review and rollback target: modern slot precedence over legacy
  InputProps/inputProps remains intact, callers retain all non-state attributes,
  generated Select labels/IDs and refs remain unchanged. Roll back this stage if
  a consumer intentionally requires contradictory field-level and native state.
Limitations / pre-existing failures / follow-up IDs: Storybook retains its
  existing chunk-size warning; Base retains its Vite config-loader advisory. The
  host journey retains unrelated federation, kebab-case CSS and uncontrolled-input
  warnings. RD-029 owns the broader historical warning baseline.
```

### RD-011

**Compose all supported sx forms.** P1 · Confirmed · DONE.
Dependencies: none. [Clinic](UI_PACKAGE_CLINIC.md#rd-011).

- [x] Document default-versus-caller precedence for SearchInput and date wrappers.
- [x] Preserve object, callback and array `SxProps` forms, including conditional
  array entries, without overwriting the caller's style.
- [x] Test resolved styles through public components and type-check representative
  consumer usage; verify package defaults still apply when no override is supplied.

```text
Status: DONE
Completed: 2026-09-20
Owner: Codex
Commit(s): pending this stage commit
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-011 contract;
  controls.test.tsx, dates.test.tsx and date-range.test.tsx cover object,
  callback and conditional-array sx values through the public SearchInput,
  community picker and Pro range APIs, including caller precedence and defaults.
GitNexus impact and staged detect_changes: SearchInput, DatePicker and
  DateRangePicker are each LOW risk with three direct dependants and no affected
  execution flows. The staged scope audit is recorded in this stage commit.
Commands (working directory scb-next): focused/full package tests, typecheck,
  lint, build and verify:package; Storybook and dependency-isolation checks;
  Base date/search focused tests, typecheck/build; Base-host Playwright journey.
Outcomes: 10 package test files/92 tests passed with 98.18% lines and 96.51%
  branches; package, catalog and isolated-dependency checks passed; Base passed
  four focused test files/9 tests plus typecheck/build; the host journey passed
  1/1 at http://127.0.0.1:8001 with required remotes running.
Compatibility review and rollback target: SearchInput retains its 8px padding
  default while callers override it with normal sx order; dates retain caller
  style source order and hidden's existing forced display behavior; DateRange
  retains its fixed single-input slot. Roll back if a host depends on invalid
  object-spread treatment of callback or array sx values.
Limitations / pre-existing failures / follow-up IDs: Storybook retains its
  existing chunk-size warning; Base retains its Vite config-loader advisory. The
  host journey retains unrelated federation, kebab-case CSS and uncontrolled-input
  warnings. RD-029 owns the broader historical warning baseline.
```

### RD-012

**Honor SearchButton's advertised loadingPosition.** P1 · Confirmed · DONE.
Dependencies: RD-006. [Clinic](UI_PACKAGE_CLINIC.md#rd-012).

- [x] Decide whether to support the advertised positions through shared loading
  behavior or narrow/deprecate the interface with explicit compatibility review.
- [x] Test each supported position and busy/name semantics; prevent unsupported
  props from leaking to the DOM.
- [x] Verify existing SearchButton consumers, declarations and visual states.

```text
Status: DONE
Completed: 2026-09-20
Owner: Codex
Commit(s): pending this stage commit
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-012 contract;
  loading-compatibility.test.tsx covers SearchButton inline/startIcon loading,
  caller icon replacement/restoration, action name, busy/disabled semantics,
  spinner decoration and the absence of a leaked loadingposition attribute.
GitNexus impact and staged detect_changes: SearchButton LOW (one direct
  dependant) and SearchButtonProps LOW (two direct type dependants); neither
  affects an execution flow. The staged scope audit is recorded in this commit.
Commands (working directory scb-next): focused/full package tests, typecheck,
  lint, build and verify:package; Storybook and dependency-isolation checks;
  Base SearchButton focused test, typecheck/build; Base-host Playwright journey.
Outcomes: 10 package test files/94 tests passed with 98.20% lines and 96.58%
  branches; package, catalog and isolated-dependency checks passed; Base passed
  one focused test file/2 tests plus typecheck/build; the host journey passed 1/1
  at http://127.0.0.1:8001 with required remotes running.
Compatibility review and rollback target: inline SearchButton spacing and caller
  start icons remain unchanged; startIcon loading now follows LoadingButton's
  established replace-and-restore behavior. Default exports, props and 14px/host
  16px sizing remain compatible. Roll back if a host relies on the prior invalid
  DOM prop or seeing its start icon beside a startIcon-position spinner.
Limitations / pre-existing failures / follow-up IDs: Storybook retains its
  existing chunk-size warning; Base retains its Vite config-loader advisory. The
  host journey retains unrelated federation, kebab-case CSS and uncontrolled-input
  warnings. RD-029 owns the broader historical warning baseline.
```

### RD-013

**Expose a Builder close-request callback.** P2 · Enhancement · DONE.
Dependencies: RD-009. [Clinic](UI_PACKAGE_CLINIC.md#rd-013).

- [x] Specify an optional callback with dismissal reasons for Escape and backdrop
  interactions; retain host ownership of `anchorEl` and open state.
- [x] Test request delivery and controlled dismissal, including the existing
  behavior when no callback is supplied.
- [x] Verify focus restoration and dismissal in host portals; document the
  compatible addition and retain mounted inactive panel behavior.

```text
Status: DONE
Completed: 2026-09-20
Owner: Codex
Commit(s): pending this stage commit
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-013 contract;
  builder.test.tsx covers Escape/backdrop close requests, controlled-open
  retention with and without a callback, trigger ARIA state, mounted value and
  trigger focus restoration after host-controlled dismissal.
GitNexus impact and staged detect_changes: BuilderButton LOW with three direct
  dependants and no affected execution flows. The staged scope audit is recorded
  in this stage commit.
Commands (working directory scb-next): focused/full package tests, typecheck,
  lint, build and verify:package; Storybook and dependency-isolation checks;
  Base Builder focused test, typecheck/build; Base-host Playwright journey.
Outcomes: 10 package test files/96 tests passed with 98.21% lines and 96.58%
  branches; package, catalog and isolated-dependency checks passed; Base passed
  one focused test file/2 tests plus typecheck/build; the host journey passed 1/1
  at http://127.0.0.1:8001 with required remotes running.
Compatibility review and rollback target: anchor-controlled open state, action
  closure, panel mounting/state, tab relationships and existing described-by IDs
  remain intact. The callback is optional and additive. Roll back if a host needs
  to suppress Popover dismissal requests while retaining MUI default behavior.
Limitations / pre-existing failures / follow-up IDs: Storybook retains its
  existing chunk-size warning; Base retains its Vite config-loader advisory. The
  host journey retains unrelated federation, kebab-case CSS and uncontrolled-input
  warnings. RD-029 owns the broader historical warning baseline.
```

## Phase 2: Design consistency

### RD-014

**Preserve media-query conditions in generated tokens.** P1 · Static finding · DONE.
Dependencies: none. [Clinic](UI_PACKAGE_CLINIC.md#rd-014).

- [x] Specify how conditional ancestry is retained when extracting canonical CSS.
- [x] Add a regression with conditional token declarations and verify mobile-only
  values do not become unconditional generated rules.
- [x] Regenerate deterministically, review source hashes and diff, and compare
  computed token values at narrow/wide widths in light/dark modes.

```text
Status: DONE
Completed: 2026-09-21
Owner: Codex
Commit(s): pending this stage commit
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-014 contract;
  generate-webkit-assets.test.mjs covers direct declarations plus nested
  @media/@supports ancestry and rejects unrelated selector leakage;
  design-origin.spec.ts checks computed responsive and mode tokens from the
  independently installed tarball at 390px and 1280px in light/dark modes.
GitNexus impact and staged detect_changes: the generator source list has no
  indexed dependants or execution flows; the browser spec has one direct docs
  dependant and no flows. Both are LOW risk. The staged scope audit is recorded
  in this stage commit.
Commands (working directory scb-next/packages/ratan-design-origin unless noted):
  npm test; npm run typecheck; npm run lint; npm run build;
  npm run build:storybook; npm run verify:package; two consecutive
  npm run tokens:generate runs with SHA-1 comparison; from scb-next, the
  independent-consumer Playwright design-origin matrix.
Outcomes: 10 Vitest files/96 tests plus one generator test passed with 98.21%
  lines and 96.58% branches; package, Storybook and independent tarball checks
  passed. Both generations produced styles.css 2eddcbd7fcc14eec2305d474bb48a0bb7efba350
  and webkit-sources.json 6fcf7abc309d8e8eec69fd86e920360c3958aa96.
  All four canonical source hashes were unchanged. Browser verification passed
  16/16: --sc-button-width computed to 100% at 390px and remained undefined at
  1280px for both light and dark WebKit roots; --sc-mode matched each mode.
Compatibility review and rollback target: unconditional canonical variables,
  font extraction, token aliases, generation/mode scoping and committed-asset
  builds are unchanged. Only canonical @media/@supports declarations regain
  their source conditions. Roll back if a downstream host intentionally relies
  on a formerly flattened responsive declaration.
Limitations / pre-existing failures / follow-up IDs: Storybook retains its
  existing chunk-size warning; the independent Vite consumer retains upstream
  module-directive warnings and the existing kebab-case CSS warning. RD-029 owns
  the broader historical warning baseline. RD-015 owns unresolved token aliases.
```

### RD-015

**Resolve the public font-size token.** P1 · Static finding · DONE.
Dependencies: RD-014. [Clinic](UI_PACKAGE_CLINIC.md#rd-015).

- [x] Map the published font-size reference to an approved defined token or emit
  its canonical definition; document any intended fallback.
- [x] Validate every public token reference and alias chain against packaged CSS,
  detecting missing definitions and cycles rather than checking only this token.
- [x] Verify computed font sizing from the packed stylesheet in the consumer
  fixture and affected catalog controls.

```text
Status: DONE
Completed: 2026-09-21
Owner: Codex
Commit(s): pending this stage commit
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-015 contract;
  generate-webkit-assets.test.mjs first reproduced --sc-font-size as the sole
  globally missing node, then exposed the omitted dark focus-shadow chain through
  per-generation/per-mode validation. Explicit missing/cycle fixtures remain;
  all 31 exported WebKit references and 181 generated aliases are validated;
  design-origin.spec.ts verifies the packed consumer token and rendered surface.
GitNexus impact and staged detect_changes: generator output and newStyleTokens
  have no indexed dependants/flows; the browser spec has one direct docs
  dependant and no flows. All indexed targets are LOW risk. The consumer fixture
  is not indexed; its packed-consumer build/browser gates provide direct evidence.
  The staged scope audit is recorded in this stage commit.
Commands (working directory scb-next/packages/ratan-design-origin unless noted):
  red/green npm run test:tokens; npm test; npm run typecheck; npm run lint;
  npm run build; npm run build:storybook; npm run verify:package; repeated
  npm run tokens:generate with SHA-1 comparison; from scb-next, the independent
  tarball-consumer Playwright design-origin matrix.
Outcomes: 10 Vitest files/96 tests plus three generator tests passed with 98.21%
  lines and 96.58% branches; the 212-root token graph has no missing definitions
  or cycles. Package, Storybook and independent tarball checks passed. Repeated
  generation produced styles.css 8e22e0d1bd35a3c78a2685041df9280146cf13a5
  and unchanged provenance 6fcf7abc309d8e8eec69fd86e920360c3958aa96.
  Browser verification passed 16/16: WebKit roots expose --sc-font-size: 1rem and
  the public-token consumer surface computes to 16px plus the appropriate light
  or dark focus shadow at narrow/wide widths.
Compatibility review and rollback target: WebKit's existing root fallback is now
  an explicit scoped variable, resolving newStyleTokens.typography.fontSize and
  the three legacy-name size aliases without changing legacy-generation values.
  The missing dark focus shadow now mirrors the canonical light formula with the
  dark blue counterpart. Roll back if a host deliberately distinguishes an
  undefined token from either scoped fallback.
Limitations / pre-existing failures / follow-up IDs: Storybook retains its
  existing chunk-size warning; the independent Vite consumer retains upstream
  module-directive warnings and the existing kebab-case CSS warning. RD-029 owns
  the broader historical warning baseline. RD-016 owns canonical source unification.
```

### RD-016

**Generate CSS and MUI raw values from a canonical source.** P2 · Enhancement · DONE.
Dependencies: RD-014, RD-015. [Clinic](UI_PACKAGE_CLINIC.md#rd-016).

- [x] Document the versioned source, generation boundary and cases where MUI needs
  raw values rather than CSS references.
- [x] Generate or validate theme palette values and public CSS references against
  that source, with drift checks and deterministic output.
- [x] Verify legacy/WebKit, light/dark and responsive values; ordinary package
  builds must still work from committed assets without a sibling source checkout.

```text
Status: DONE
Completed: 2026-09-21
Owner: Codex
Commit(s): pending this stage commit
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-016 contract;
  webkit-theme.json is the versioned authoring manifest for scoped supplements,
  all 31 public WebKit references and the raw values MUI must calculate with.
  tokens:generate emits a narrow runtime module and validates the manifest against
  canonical CSS definitions; theme tests cover every generated light/dark value.
GitNexus impact and staged detect_changes: getWebkitOptions has three indexed
  dependants through createRatanTheme and one Theme module; newStyleTokens has no
  indexed dependants or flows. Both are LOW risk. The staged scope audit is
  recorded in this stage commit.
Commands (working directory scb-next/packages/ratan-design-origin unless noted):
  npm test; npm run typecheck; npm run lint; npm run build;
  npm run build:storybook; npm run verify:package; two consecutive
  npm run tokens:generate runs with SHA-1 comparison; from scb-next, the fresh
  independent-tarball-consumer Playwright design-origin matrix.
Outcomes: 10 Vitest files/98 tests plus three generator tests passed with 98.22%
  lines and 96.47% branches. Production, Storybook and independent packed-consumer
  builds passed, including the Button-only tree-shaking assertion. Consecutive
  generation produced webkit-theme.generated.ts
  7f015c28da0534491997cf21002565467e229a96, styles.css
  8e22e0d1bd35a3c78a2685041df9280146cf13a5 and unchanged provenance
  6fcf7abc309d8e8eec69fd86e920360c3958aa96. Browser verification passed 16/16
  across legacy/WebKit, light/dark and 390px/1280px values.
Compatibility review and rollback target: public token strings and generated CSS
  values are unchanged. Theme raw values now come from the same versioned manifest;
  committed generated TypeScript and CSS keep ordinary builds independent of a
  sibling WebKit checkout. Roll back the manifest imports and generated module if
  downstream tooling cannot consume the committed output.
Limitations / pre-existing failures / follow-up IDs: Storybook retains its
  existing chunk-size warning; the independent consumer retains upstream
  module-directive warnings and the existing kebab-case CSS warning. RD-029 owns
  the broader historical warning baseline. RD-017 owns action-control states.
```

### RD-017

**Complete WebKit action-control states.** P2 · Static finding · DONE.
Dependencies: RD-016. [Clinic](UI_PACKAGE_CLINIC.md#rd-017).

- [x] Specify SearchButton, ResetButton and ToggleButton behavior under explicit
  WebKit generation while preserving the legacy default branch.
- [x] Apply approved semantic tokens to normal, hover, focus, pressed, selected,
  disabled, error and loading states as applicable.
- [x] Review a state matrix on desktop/mobile across both generations and modes;
  record intentional visual changes and compatible host checks.

```text
Status: DONE
Completed: 2026-09-21
Owner: Codex
Commit(s): pending this stage commit
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-017 contract;
  controls.test.tsx first failed because the semantic action-state layer and
  WebKit Toggle branch did not exist, then covers primary/secondary normal,
  hover, press, focus, disabled, error and selected mappings plus the unchanged
  legacy Toggle branch. Controls/ActionStateMatrix exposes catalog review states;
  design-origin.spec.ts verifies the independently packed computed styles.
GitNexus impact and staged detect_changes: SearchButtonRoot and ResetButtonRoot
  have no indexed dependants; modeStyle has one direct file dependant and 29
  imports within three levels, including Base compatibility paths, but no affected
  execution flows. Controls has no dependants. All resolved symbols are LOW risk;
  the fixture is unindexed and covered by its packed-consumer gates. The staged
  scope audit is recorded in this stage commit.
Commands (package directory unless noted): red/green focused controls test;
  npm test; npm run typecheck; npm run lint; npm run build;
  npm run build:storybook; npm run verify:package; from scb-next, the fresh
  independent-consumer Playwright design-origin matrix and
  npm run verify:dependency-isolation; from web/mfe-base-origin, focused
  SearchButton/ResetButton/ToggleButton tests, typecheck and production build.
Outcomes: 10 Vitest files/100 tests plus three generator tests passed with 97.04%
  lines and 96.18% branches. Package, Storybook, packed consumer and Button-only
  tree-shaking checks passed. Browser verification passed 16/16 across both
  generations, modes and widths, exercising pointer hover/held press, keyboard
  focus, error, loading/disabled and selection. Base's six focused tests,
  typecheck/build and workspace MUI dependency isolation passed.
Compatibility review and rollback target: legacy Search/Reset fixed colors and
  Toggle gradients/transforms remain on the default branch. Only explicit WebKit
  roots now resolve action states through scoped primary/secondary variables;
  loading/accessibility behavior and component props are unchanged. Roll back the
  generation branches and shared action map if hosts require the incomplete fixed
  WebKit colors.
Limitations / pre-existing failures / follow-up IDs: Storybook retains its chunk
  warning; Base retains Vite config-loader advisories; the independent consumer
  retains upstream module-directive and kebab-case CSS warnings. RD-029 owns that
  historical baseline. RD-018 owns measured contrast and remaining focus cues.
```

### RD-018

**Improve contrast and restore visible focus cues.** P1 · Static finding · DONE.
Dependencies: RD-016; coordinate with RD-017. [Clinic](UI_PACKAGE_CLINIC.md#rd-018).

- [x] Measure placeholders, relevant text and focus indicators against their actual
  backgrounds; use approved semantic tokens and record the applicable criteria.
- [x] Restore a reviewed keyboard focus indication for legacy portal grids and
  assess legacy input focus plus WebKit light/dark focus states.
- [x] Verify keyboard navigation and measured contrast in actual rendered states;
  record host compatibility review for changes to intentional legacy overrides.

```text
Status: DONE
Completed: 2026-09-21
Owner: Codex
Commit(s): pending this stage commit
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-018 contract;
  controls/theme/portal-theme regressions cover the semantic focus source,
  placeholder opacity, legacy outlined-input focus, and replacement DataGrid
  focus indicators. The packed fixture adds a placeholder and an optional-peer
  portal grid; design-origin.spec.ts measures rendered contrast and keyboard focus.
GitNexus impact and staged detect_changes: getWebkitActionStyle has three direct
  dependants and 19 total; Config and getWebkitOptions each have one direct
  dependant; the legacy getControlTheme factories have no indexed dependants.
  All resolved symbols are LOW risk with no affected execution processes. The
  consumer fixture is unindexed and covered by packed-consumer/browser gates.
  The staged scope audit is recorded in this stage commit.
Commands (working directory scb-next unless noted): package test, typecheck,
  lint, build and Storybook build; verify:package; verify:dependency-isolation;
  fresh independent-consumer Playwright design-origin suite; from Base, six
  focused theme/control tests, typecheck, lint and production build; live host
  design-origin-host Playwright journey.
Outcomes: 10 Vitest files/102 tests plus three generator tests passed with 97.04%
  line and 96.18% branch coverage. Package, Storybook, packed declaration/build,
  SSR/tree-shaking, dependency isolation, Base focused tests/typecheck/build and
  18/18 browser checks passed. The browser matrix covered 390px/1280px,
  legacy/WebKit and light/dark controls plus both legacy portal grid modes; it
  enforced 4.5:1 placeholder/helper text and 3:1 input/button/grid focus cues.
  The required login -> New Tile -> Cashflow render -> add/delete workspace journey
  passed at 1280x720 on http://127.0.0.1:8001 with no page errors.
Compatibility review and rollback target: legacy fill/gradient and hidden-notch
  visuals remain unchanged; only focused outlined roots gain the palette-primary
  outline. The portal override replaces deliberately removed grid outlines with
  an inset indicator that does not alter layout. WebKit placeholder and focus
  semantics change only under explicit WebKit generation. Roll back these theme
  overrides if consumer visual review rejects the approved contrast treatment.
Limitations / pre-existing failures / follow-up IDs: Base's repository-wide lint
  remains red on 8 errors and 138 warnings in untouched admin tests, hooks and
  module-federation.d.ts. The live alpha API watcher reproduced EMFILE while the
  required Base/Ratan/Cashflow journey passed. Storybook, Base and packed consumer
  retain their existing chunk/config-loader/module-directive advisories. RD-024
  owns aggregate lint; RD-029 owns historical host failures.
```

### RD-019

**Respect reduced-motion preferences.** P2 · Enhancement · DONE.
Dependencies: none; coordinate with RD-006. [Clinic](UI_PACKAGE_CLINIC.md#rd-019).

- [x] Specify reduced-motion behavior for animated loaders while keeping loading
  state understandable and accessible.
- [x] Implement the approved reduced-motion presentation using shared tokens/styles
  where appropriate, without changing the ordinary animation unintentionally.
- [x] Verify browser-emulated reduced motion and default motion, including loading
  announcements and both appearance generations.

```text
Status: DONE
Completed: 2026-09-21
Owner: Codex
Commit(s): pending this stage commit
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-019 contract;
  the independent fixture renders the public Loader, and design-origin.spec.ts
  verifies ordinary timing, live reduced-motion switching, static visible rings,
  and the preserved named polite status in legacy/WebKit and light/dark modes.
  The four cases first failed with animation-name rotate after emulating reduce,
  then passed after the CSS media override was added.
GitNexus impact and staged detect_changes: LoaderRoot has no indexed dependants,
  affected modules or execution processes and is LOW risk. JSX/style edges are
  not represented for Loader, PageLoader or the compatibility export; package,
  packed-consumer, Base adapter and browser gates cover those known consumers.
  The fixture App is not indexed. The staged scope audit is recorded in the
  stage commit evidence.
Commands (working directory scb-next unless noted): focused feedback test;
  package test, typecheck, lint, build and Storybook build; verify:package after
  build; verify:dependency-isolation; fresh independent-consumer focused red/green
  and full Playwright design-origin suites; from Base, focused Loader/PageLoader
  tests, typecheck and production build; live design-origin-host Playwright journey.
Outcomes: 10 Vitest files/102 tests plus three generator tests passed with 97.04%
  line and 96.18% branch coverage. Package, Storybook, packed declarations/build,
  SSR/tree-shaking and dependency isolation passed. The reduced-motion matrix
  passed 4/4 and the complete browser suite passed 22/22. Base passed two files/
  three tests plus typecheck/build. The required login -> New Tile -> Cashflow
  render -> add/delete workspace journey passed at 1280x720 on
  http://127.0.0.1:8001 with no page errors.
Compatibility review and rollback target: default two-second outer and one-second
  inner rotations, SVG geometry, colors, dimensions, status semantics and both
  appearance branches are unchanged. Only `prefers-reduced-motion: reduce` stops
  the transforms, using CSS so preference changes apply without remounting. Roll
  back the two media overrides if a host requires motion despite the user setting.
Limitations / pre-existing failures / follow-up IDs: verify:package consumes the
  existing dist and therefore must follow the documented build step; the first
  green attempt exposed that stale-output condition before a rebuilt tarball
  passed. Storybook and the consumer retain their known chunk/module-directive
  warnings. The live alpha API watcher again reproduced EMFILE while the required
  Base/Ratan/Cashflow journey passed. RD-024 owns aggregate verification and
  RD-029 owns historical host failures.
```

### RD-020

**Document supported public contracts and font ownership.** P2 · Enhancement · DONE.
Dependencies: RD-001–RD-013; update alongside those fixes where useful.
[Clinic](UI_PACKAGE_CLINIC.md#rd-020).

- [x] Document defaults, controlled/uncontrolled values, nulls, callbacks/reasons,
  refs, slots, labels/IDs, style precedence and supported inherited props.
- [x] State that legacy Poppins is host-provided and identify packaged fonts,
  explicit stylesheet loading, optional peers, localization and Pro ownership.
- [x] Add compiling examples for changed contracts and link corresponding stories;
  verify README, declarations, compatibility guidance and changelog agree.

```text
Status: DONE
Completed: 2026-09-21
Owner: Codex
Commit(s): pending this stage commit
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-020 contract; the new
  documentation test derives the packaged font list and optional-peer list from
  package metadata, then requires explicit stylesheet/Poppins ownership, contract
  matrix dimensions, compiled example links and every public catalog source. It
  first failed all four requirements and passed after the documentation update.
  The independent consumer examples now compile explicit refs/IDs, default values,
  read-only localized search clearing, both loading positions, Dialog naming/close
  reasons and controlled Builder close requests. Existing date fixtures cover
  uncontrolled defaults plus controlled empty and partial-null values.
GitNexus impact and staged detect_changes: capturedContracts, builderContracts and
  Dates are not indexed, so no caller/process blast radius can be calculated for
  these fixture-only symbols. The public runtime symbols and declarations are
  unchanged; package tests and the isolated tarball verifier cover the fixture and
  emitted-contract boundary. The staged audit reports eight intended files,
  18 documentation/fixture symbols, zero affected processes and LOW risk.
Commands (working directory scb-next unless noted): focused red/green documentation
  test; package test, typecheck, lint, build and Storybook build; verify:package
  after build; verify:dependency-isolation; git diff --check.
Outcomes: 11 Vitest files/106 tests plus three generator tests passed with 97.04%
  line and 96.18% branch coverage. The focused documentation contract passed 4/4.
  Package typecheck/lint/build, Storybook, dependency isolation and the independent
  tarball consumer passed, including Bundler/Node declarations, production build,
  DOM-free imports, SSR, tree shaking, packaged CSS/fonts and optional date,
  date-range and portal-theme peers.
Compatibility review and rollback target: no runtime export, declaration or host
  adapter changed. The README now describes the already verified public behavior,
  and the fixture exercises it without altering consumers. Roll back this stage if
  a declared contract is found to exceed the supported emitted surface.
Limitations / pre-existing failures / follow-up IDs: Storybook retains its chunk
  warning and the isolated consumer retains upstream MUI module-directive warnings.
  Directly typechecking the repository fixture without isolation sees unrelated
  root type-package conflicts; verify:package is the authoritative clean install.
  RD-021 owns measured tree-shaking improvement, RD-023 owns broader dependency
  resolution, and RD-024 owns aggregate release gates.
```

## Phase 3: Distribution quality

### RD-021

**Improve tree shaking and enforce a package byte budget.** P2 · Confirmed · DONE.
Dependencies: none. [Clinic](UI_PACKAGE_CLINIC.md#rd-021).

- [x] Reproduce the Button-only retained-code baseline with pinned tooling and
  peer externalization stated explicitly; inspect unrelated retained modules.
- [x] Make pure initialization removable without dropping actual side effects;
  validate any annotation/build or icon-import change through SSR and Storybook.
- [x] Enforce a reviewed byte ceiling and unrelated-module checks in the packed
  consumer verifier. Record measured before/after bytes; the clinic's approximate
  18.6 KB → 1.6 KB experiment is evidence, not a promised release threshold.

```text
Status: DONE
Completed: 2026-09-21
Owner: Codex
Commit(s): pending this stage commit
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-021 records the pinned
  Vite 8.2.1, external-peer measurement contract and pure-initialization boundary.
  The packed consumer gate first failed against the reproduced 21,935-byte bundle,
  which retained index, Snackbar, Loader, legacy-token and WebKit-token modules.
  It now requires only Button.js to render, rejects Loader/Snackbar/token/provider/
  optional-integration/React/host markers and enforces a 2,048-byte ceiling.
GitNexus impact and staged detect_changes: Loader, PageLoader, Snackbar, Label and
  the styled component roots are LOW risk, with at most four dependants and no
  affected execution processes. vite.config.ts and the verifier top-level script
  are not indexed. The staged audit reports 17 intended files, 33 changed symbols,
  zero affected processes and LOW risk.
Commands (working directory scb-next unless noted): package tests, token-generator
  tests, coverage, typecheck, lint, build and Storybook build; verify:package;
  verify:dependency-isolation; Base typecheck/build; Ratan and Cashflow builds;
  node --check packages/ratan-design-origin/scripts/verify-package.mjs; git diff
  --check.
Outcomes: the Button-only package code fell from 21,935 to 427 bytes (98.05%) with
  Vite 8.2.1 and React/MUI/Emotion externalized; Button.js is the only rendered
  package module. All marker, byte-budget, declaration, production-build, DOM-free
  core/date/date-range/portal SSR and optional-peer checks passed. Eleven Vitest
  files/106 tests and three generator tests passed with 97.04% line and 96.18%
  branch coverage. Package typecheck/lint/build, Storybook, dependency isolation,
  Base typecheck/build and both host builds passed.
Compatibility review and rollback target: preserved modules keep every documented
  entry point while pure annotations cover only side-effect-free styled and memo
  initialization. SSR, Storybook and host builds prove required initialization was
  retained. Roll back this stage if a supported bundler cannot resolve the emitted
  module graph or if a documented import depends on discarded initialization.
Limitations / pre-existing failures / follow-up IDs: Storybook retains its existing
  large-chunk warning, host builds retain Vite config-loader/deprecation warnings,
  and the packed consumer retains upstream MUI module-directive warnings. Ratan's
  existing typecheck script fails before source analysis because it combines
  emitDeclarationOnly with noEmit (TS5053); its production build passed. RD-022
  owns browser gates, RD-023 owns dependency-resolution breadth and RD-024 owns
  aggregate verification.
```

### RD-022

**Automate browser accessibility, interaction and visual checks.** P2 · Confirmed · DONE.
Dependencies: phase 1 regressions, RD-017–RD-019.
[Clinic](UI_PACKAGE_CLINIC.md#rd-022).

- [x] Make actionable catalog accessibility violations fail a repeatable automated
  command; record any narrowly justified, owned exclusions.
- [x] Gate keyboard behavior, dismissal, focus restoration and overlay hit testing
  with representative package and host flows.
- [x] Replace screenshot-only artifacts with reviewed screenshot comparisons for
  the selected desktop/mobile and legacy/WebKit light/dark matrix; record baseline
  update/review procedure and avoid accepting changed images without review.

```text
Status: DONE
Completed: 2026-09-21
Owner: Codex
Commit(s): pending this stage commit
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-022 defines one
  repository command, zero accessibility exclusions, settled catalog scanning,
  the interaction/date contract and explicit baseline ownership. Initial browser
  runs failed on Loader/LoadingOverlay contrast, an inaccessible long-message
  Snackbar scroll region and missing baselines. The final suite scans every story
  across legacy/WebKit light/dark, scans the consumer/date surfaces and compares
  eight 390px/1280px appearance baselines.
GitNexus impact and staged detect_changes: the browser spec, LoaderRoot, Loader,
  LoadingOverlay and Snackbar are LOW risk. Loader has three direct consumers,
  LoadingOverlay two and Snackbar three; no target reaches an indexed execution
  process. The staged audit reports 21 indexed files, 22 changed symbols, zero
  affected processes and LOW risk.
Commands (working directory scb-next unless noted): explicit baseline update and
  review; npm run test:e2e:design-origin; package npm test, typecheck, lint, build
  and Storybook build; verify:package; verify:dependency-isolation; build:apps;
  focused Snackbar red/green test; git diff --check.
Outcomes: the ordinary browser gate passed 24/24 after all eight PNGs were visually
  reviewed. The gate built both surfaces, verified a fresh tarball consumer, scanned
  the complete catalog and consumer matrix with no axe exclusions, and passed clear,
  collapse, keyboard focus, dialog dismissal/restoration, overlay hit testing,
  reduced-motion and date Escape/restoration behavior. Eleven Vitest files/107
  tests plus three generator tests passed with 97.04% lines and 96.15% branches.
  Package typecheck/lint/build, Storybook, packed declarations/build/SSR/tree
  shaking, dependency isolation and Base/Ratan/Cashflow/Alpha/API builds passed.
Compatibility review and rollback target: existing commands remain available and
  the new command owns only package browser surfaces. Loader text now follows the
  active theme, LoadingOverlay uses a contrast-safe backdrop and the Snackbar's
  existing 50px scroll region is keyboard focusable. Roll back those three focused
  presentation changes and the browser command together if a supported host cannot
  preserve the verified behavior; never retain baselines for reverted pixels.
Limitations / pre-existing failures / follow-up IDs: Storybook and hosts retain
  existing chunk/config-loader warnings, the packed consumer retains upstream MUI
  module-directive warnings, and the optional Pro date fixture logs its expected
  missing-license notice. Existing Emotion kebab-case and nth-child console warnings
  are non-page errors. RD-023 owns dependency resolution breadth and RD-024 owns the
  aggregate release command.
```

### RD-023

**Validate supported versions and runtime dependency resolution.** P2 · Static finding · DONE.
Dependencies: RD-029 when affected host suites are needed.
[Clinic](UI_PACKAGE_CLINIC.md#rd-023).

- [x] Check supported peer versions rather than only Material/icons major version 5.
- [x] Verify React, ReactDOM, MUI and Emotion resolve to each host's intended runtime;
  check optional integrations when present and core operation when absent.
- [x] Exercise negative fixtures for unsupported or duplicate resolution and run
  the independent consumer plus affected host checks. Keep federation sharing
  changes outside this fix unless separately specified and measured.

```text
Status: DONE
Completed: 2026-09-21
Owner: Codex
Commit(s): pending this stage commit
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-023 defines required
  peer ownership, full-range checks, Vite-resolved identity, optional declaration
  semantics and the five required negative fixture classes. The Node contract
  suite first failed because the major-only script exported no validator; it now
  passes nine fixtures covering supported, unsupported, missing, duplicate,
  absent-optional, incompatible-optional, exact prerelease and host-range cases.
GitNexus impact and staged detect_changes: refreshed at 7d23c209. The original
  top-level expectations constant has zero direct dependants, affected processes
  or modules: LOW risk. The verifier had no existing function/class/method symbols.
  The final staged audit reports eight intended files, 25 indexed symbols, zero
  affected execution processes and LOW risk.
Commands (working directory scb-next unless noted): test:dependency-isolation;
  verify:dependency-isolation; package test/coverage and token-generator tests;
  package typecheck, lint, build, Storybook build and verify:package; Base typecheck;
  Base, Ratan and Cashflow production builds; node --check; git diff --check.
Outcomes: all nine dependency fixtures pass. Vite resolution verifies six required
  peers per host at React/ReactDOM 18.3.1, Material/icons 5.18.0, Emotion React
  11.14.0 and styled 11.14.1. Base additionally verifies declared pickers/Pro
  6.20.2, grid 6.20.4 and Dayjs 1.11.23; Ratan/Cashflow correctly ignore undeclared
  optional copies. The fresh tarball consumer passed core-without-optionals,
  explicit optional entries, declarations, build, SSR and tree-shaking checks.
  Eleven Vitest files/107 tests plus three generator tests passed with 97.04% line
  and 96.15% branch coverage. Package typecheck/lint/build, Storybook, Base
  typecheck and all three host builds passed.
Compatibility review and rollback target: public runtime exports, peer ranges,
  host declarations and Vite/federation configuration are unchanged. The verifier
  now evaluates the existing Vite policies from host and package importers. Roll
  back the verifier/test/docs command set if a supported Vite release cannot expose
  equivalent resolution evidence; do not weaken the package peer contract or add
  federation sharing as part of that rollback.
Limitations / pre-existing failures / follow-up IDs: Vite retains config-loader and
  Cashflow optimizeDeps deprecation warnings, Storybook retains its chunk warning,
  and the packed consumer retains upstream MUI module-directive warnings. RD-024
  owns aggregate verification; RD-030 owns real-host performance measurements.
```

### RD-024

**Strengthen lint and provide an aggregate quality command.** P2 · Enhancement · DONE.
Dependencies: RD-021–RD-023. [Clinic](UI_PACKAGE_CLINIC.md#rd-024).

- [x] Add suitable TypeScript, React Hooks and JSX accessibility rules, resolving
  actionable findings with scoped changes and documented exceptions.
- [x] Provide a repository-owned command aggregating the relevant package,
  distribution and browser gates; document required services and external CI use.
- [x] Demonstrate successful exit on a clean candidate and failed exit when a
  representative gate fails; preserve actionable logs and avoid masking failures.

```text
Status: DONE
Started: 2026-09-21
Completed: 2026-09-22
Owner: Codex
Specification/regression: UI_PACKAGE_IMPLEMENTATION.md RD-024 defines the
  TypeScript/Hooks/JSX-a11y policy, zero-warning/exception boundary, sequential
  aggregate steps, failure semantics, browser prerequisites and CI entry point.
GitNexus impact: eslint.config.mjs has no indexed default-export symbol or execution
  process. DatePicker, DateTimePicker, TimePicker and DateRangePicker were LOW risk,
  with at most two direct dependants and no indexed processes. The aggregate runner
  and picker slot-prop composer are new symbols; final staged scope is checked with
  detect_changes.
Completion evidence: the package passes 107 Vitest cases with 95.53% statements,
  95.97% branches and zero lint warnings. Runner fixtures prove ordered success and
  fail-fast output that includes the failed label/command. The real aggregate gate
  passes dependency fixtures/resolution, package/Storybook/tarball/SSR verification,
  all 24 browser/axe/visual cases, Base typecheck and Base/Ratan/Cashflow builds.
  A pristine HEAD archive plus the intended package manifest reproduced the checked
  lockfile exactly. The picker slot merge also keeps hidden fields non-visible with
  the currently locked MUI/testing stack while preserving caller text-field props.
Compatibility review and rollback target: no public exports, peer ranges, host
  adapters or federation policy changed. Type-only empty-interface aliases preserve
  assignability; date wrappers preserve caller slot props and the existing hidden
  contract. Roll back the lint config, aggregate scripts/pipeline and picker slot
  merge together if the gate cannot run on a supported CI image.
Limitations / pre-existing failures / follow-up IDs: upstream MUI directive/license,
  Vite config-loader/optimizeDeps and Storybook chunk advisories remain visible.
  CI ownership is assigned by RD-028; live-host performance is measured by RD-030.
```

## Phase 4: Adoption and ownership

### RD-025

**Share pure Ratan/Cashflow compatibility adaptation.** P2 · Static finding · TODO.
Dependencies: phase 1 fixes, RD-020, RD-023, RD-029.
[Clinic](UI_PACKAGE_CLINIC.md#rd-025).

- [ ] Recheck the reported duplicated adapter block and specify the smallest shared
  pure UI boundary using current consumers and GitNexus impact.
- [ ] Share that boundary while preserving Base imports, host-specific services,
  forced portals and each host's existing theme policy.
- [ ] Run adapter contract tests, both host builds and affected workspace journeys;
  document a focused rollback and avoid extracting unrelated host policy.

### RD-026

**Propagate explicit mode and designGeneration from hosts.** P2 · Enhancement · TODO.
Dependencies: RD-017, RD-020, RD-025. [Clinic](UI_PACKAGE_CLINIC.md#rd-026).

- [ ] Specify a host appearance contract containing both `mode` and
  `designGeneration`, including inheritance and fallback behavior.
- [ ] Propagate it through providers/adapters without changing existing legacy
  defaults or unifying intentionally different host theme policies implicitly.
- [ ] Verify runtime mode/generation transitions, portals and multiple mounted
  micro-frontends; document an incremental opt-in rollout and rollback.

### RD-027

**Pilot direct public-package adoption in Alpha Payments.** P3 · Enhancement · TODO.
Dependencies: RD-020, RD-024, RD-026, RD-028 before publication;
RD-030 for the performance comparison. [Clinic](UI_PACKAGE_CLINIC.md#rd-027).

- [ ] Inventory the duplicated controls/feedback states and select a small pilot
  with explicit behavior and appearance acceptance criteria.
- [ ] Adopt public entries with explicit styles/provider configuration, preserving
  Alpha's business, routing and data ownership.
- [ ] Verify public types, peer resolution, browser interactions and visual states;
  compare bundle/runtime measurements and document rollout/rollback evidence.

### RD-028

**Assign release ownership and record publication decisions.** P2 · Enhancement · TODO.
Dependencies: none for recording decisions; publication requires applicable
release gates. [Clinic](UI_PACKAGE_CLINIC.md#rd-028).

- [ ] Record named release owner and backup, registry/access/visibility policy,
  maintainer review responsibilities and immutable artifact retention.
- [ ] Obtain and record the required asset/font redistribution decision and
  production MUI X Pro license/initialization ownership where applicable.
- [ ] Update release/changelog guidance with approved decisions and rollback
  responsibilities. Missing decisions remain explicit blockers; this tracking item
  does not authorize registry publication or production deployment.

## Baseline and measurement work

### RD-029

**Reproduce and classify historical broad host test failures.** P2 · Historical baseline · TODO.
Dependencies: none; run early when host changes or broad host validation start.
[Clinic](UI_PACKAGE_CLINIC.md#rd-029).

- [ ] Locate the recorded host dependency-resolution failures and rerun their
  original commands on the implementation baseline; capture versions and logs.
- [ ] Classify results as still failing, already resolved or environment-specific.
  Separate existing failures from regressions introduced by this work.
- [ ] Fix any reproduced resolution issue within a specified scope, or record an
  owned follow-up/blocker with affected checks. Mark this item DONE only when the
  baseline classification and disposition are evidenced; do not claim a historical
  failure was freshly reproduced without its actual command result.

### RD-030

**Measure real host performance before architectural changes.** P3 · Enhancement · TODO.
Dependencies: RD-021, RD-023; baseline measurements may begin earlier.
[Clinic](UI_PACKAGE_CLINIC.md#rd-030).

- [ ] Define repeatable production-build measurements with real UI dependencies
  included: route/chunk transfer size, dependency duplication, relevant render and
  interaction timings, hardware/browser and cache conditions.
- [ ] Record baseline and candidate results for representative hosts; set reviewed
  budgets consistent with repository performance targets and enforce useful checks.
- [ ] Use the evidence to decide whether further provider, import or federation
  changes are justified. Do not change MUI/Emotion federation sharing solely from
  a package-only externalized byte result; record any separate design decision.

## Activity log

Record implementation starts and completions here; link the item completion record
or committed evidence.

| Date | Item | Status change | Commit / evidence | Notes / next action |
| --- | --- | --- | --- | --- |
| 2026-09-20 | RD-001 | TODO → IN PROGRESS | GitNexus LOW risk: one direct test caller, no processes/modules | Specification added; write failing public contract test next |
| 2026-09-20 | RD-001 | IN PROGRESS → DONE | Item completion record and passing package, packed-consumer, Storybook, browser and host gates | Next: RD-002 |
| 2026-09-20 | RD-002 | TODO → IN PROGRESS | GitNexus LOW risk: three direct dependants, one module, no processes | Specify null/partial range values; add failing public contract regression |
| 2026-09-20 | RD-002 | IN PROGRESS → DONE | Item completion record and passing package, packed optional-peer, Base and host gates | Next: RD-003 |
| 2026-09-20 | RD-003 | TODO → IN PROGRESS | GitNexus LOW risk per wrapper: three direct dependants, one module, no processes | Specify controlled/uncontrolled semantics; add failing default-value regression |
| 2026-09-20 | RD-003 | IN PROGRESS → DONE | Item completion record and passing package, packed optional-peer, Base and host gates | Next: RD-004 |
| 2026-09-20 | RD-004 | TODO → IN PROGRESS | GitNexus LOW risk: three rendered and 17 type-level dependants, one module, no processes | Specify clear action name/state; add failing public contract regression |
| 2026-09-20 | RD-004 | IN PROGRESS → DONE | Item completion record and passing package, packed-consumer, Base and host gates | Next: RD-005 |
| 2026-09-20 | RD-005 | TODO → IN PROGRESS | GitNexus LOW risk for concrete Label/Select render functions; SelectProps name graph is CRITICAL but unchanged | Specify field IDs/names and caller precedence; add failing public regressions |
| 2026-09-20 | RD-005 | IN PROGRESS → DONE | Item completion record and passing package, packed-consumer, Base and host gates | Next: RD-006 |
| 2026-09-20 | RD-006 | TODO → IN PROGRESS | GitNexus LOW risk: LoadingButton two direct callers, SearchButton one, no processes/modules | Specify one-source busy announcements; add failing position regressions |
| 2026-09-20 | RD-006 | IN PROGRESS → DONE | Item completion record and passing package, packed-consumer, Base and host gates | Next: RD-007 |
| 2026-09-20 | RD-007 | TODO → IN PROGRESS | GitNexus LOW risk: one direct test dependant, no processes/modules | Specify first-row/inert behavior and add keyboard regressions |
| 2026-09-20 | RD-007 | IN PROGRESS → DONE | Item completion record and passing package, packed-consumer, Base and host gates | Next: RD-008 |
| 2026-09-20 | RD-008 | TODO → IN PROGRESS | GitNexus MEDIUM risk: five direct dependants, one Scenarios module, no processes | Specify effective name/ID precedence and add dangling-reference regressions |
| 2026-09-20 | RD-008 | IN PROGRESS → DONE | Item completion record and passing package, packed-consumer, Base and host gates | Next: RD-009 |
| 2026-09-20 | RD-009 | TODO → IN PROGRESS | GitNexus LOW risk: BuilderTabPanel three direct dependants; builderTabProps two; no processes | Specify instance namespace and add multi-Builder regressions |
| 2026-09-20 | RD-009 | IN PROGRESS → DONE | Item completion record and passing package, dependency, Base and host gates | Next: RD-010 |
| 2026-09-20 | RD-010 | TODO → IN PROGRESS | GitNexus LOW risk: Input four direct dependants; Select two; no processes | Specify shared state precedence and add public state regressions |
| 2026-09-20 | RD-010 | IN PROGRESS → DONE | Item completion record and passing package, dependency, Base and host gates | Next: RD-011 |
| 2026-09-20 | RD-011 | TODO → IN PROGRESS | GitNexus LOW risk: SearchInput, DatePicker and DateRangePicker have three direct dependants each; no processes | Specify sx precedence and add public style regressions |
| 2026-09-20 | RD-011 | IN PROGRESS → DONE | Item completion record and passing package, dependency, Base and host gates | Next: RD-012 |
| 2026-09-20 | RD-012 | TODO → IN PROGRESS | GitNexus LOW risk: SearchButton one direct dependant; props two type dependants; no processes | Specify supported loading positions and add public regressions |
| 2026-09-20 | RD-012 | IN PROGRESS → DONE | Item completion record and passing package, dependency, Base and host gates | Next: RD-013 |
| 2026-09-21 | RD-013 | TODO → IN PROGRESS | GitNexus LOW risk: BuilderButton three direct dependants; no processes | Specify controlled close requests and add public regressions |
| 2026-09-21 | RD-013 | IN PROGRESS → DONE | Item completion record and passing package, dependency, Base and host gates | Next: RD-014 |
| 2026-09-21 | RD-014 | TODO → IN PROGRESS | GitNexus LOW risk: generator source list has no dependants/flows; browser spec one direct docs dependant, no flows | Preserve conditional ancestry and add generator/browser regressions |
| 2026-09-21 | RD-014 | IN PROGRESS → DONE | Deterministic assets and passing package, Storybook, packed-consumer and 16-case browser gates | Next: RD-015 |
| 2026-09-21 | RD-015 | TODO → IN PROGRESS | GitNexus LOW risk for generator output, public token object and browser spec; consumer fixture not indexed | Resolve the canonical fallback and add graph/browser regressions |
| 2026-09-21 | RD-015 | IN PROGRESS → DONE | Complete 212-root per-generation/mode graph plus passing package, Storybook, packed-consumer and 16-case browser gates | Next: RD-016 |
| 2026-09-21 | RD-016 | TODO → IN PROGRESS | GitNexus LOW risk: getWebkitOptions has three dependants/one module; newStyleTokens has none | Add one versioned authoring manifest and drift regressions |
| 2026-09-21 | RD-016 | IN PROGRESS → DONE | Deterministic generated runtime source plus passing package, Storybook, packed-consumer and 16-case browser gates | Next: RD-017 |
| 2026-09-21 | RD-017 | TODO → IN PROGRESS | GitNexus LOW risk: Search/Reset roots have no dependants; modeStyle reaches 29 imports and no flows | Add generation-aware semantic state mappings and matrix regressions |
| 2026-09-21 | RD-017 | IN PROGRESS → DONE | Passing package, Storybook, packed-consumer, 16-case browser, Base and dependency-isolation gates | Next: RD-018 |
| 2026-09-21 | RD-018 | TODO → IN PROGRESS | GitNexus LOW risk: action style three direct dependants; portal Config one; WebKit options one/Theme module; legacy factories none; no processes | Measure approved contrast pairs and restore browser-verified keyboard focus cues |
| 2026-09-21 | RD-018 | IN PROGRESS → DONE | Passing package, Storybook, packed-consumer, 18-case browser, Base and live-host gates | Next: RD-019 |
| 2026-09-21 | RD-019 | TODO → IN PROGRESS | GitNexus LOW risk: LoaderRoot has no indexed dependants or flows; fixture App is unindexed | Specify static reduced-motion behavior and add browser regressions |
| 2026-09-21 | RD-019 | IN PROGRESS → DONE | Passing package, Storybook, packed-consumer, 22-case browser, Base and live-host gates | Next: RD-020 |
| 2026-09-21 | RD-020 | TODO → IN PROGRESS | Source/declaration/catalog audit; specification recorded | Add the public contract matrix, compiled examples and ownership alignment |
| 2026-09-21 | RD-020 | IN PROGRESS → DONE | Passing documentation contract, package, Storybook, packed-consumer and dependency-isolation gates | Next: RD-021 |
| 2026-09-21 | RD-021 | TODO → IN PROGRESS | Current Vite 8.2.1 external-peer baseline: 21,935 bytes plus legacy/WebKit/Snackbar/Loader retention; all edit targets LOW risk | Add failing budget/module assertions, then mark pure component initialization |
| 2026-09-21 | RD-021 | IN PROGRESS → DONE | Button-only package code is 427/2,048 bytes with only Button.js rendered; package, Storybook, packed-consumer, dependency and host gates pass | Next: RD-022 |
| 2026-09-21 | RD-022 | TODO → IN PROGRESS | Existing 22-case browser suite has LOW graph risk, manual screenshot artifacts and no failing axe command | Add catalog/consumer axe scans, date interaction and reviewed 2×2×2 baselines |
| 2026-09-21 | RD-022 | IN PROGRESS → DONE | 24/24 browser checks, zero axe exclusions, eight reviewed baselines, package/packed-consumer/dependency/host gates pass | Next: RD-023 |
| 2026-09-21 | RD-023 | TODO → IN PROGRESS | GitNexus LOW risk: verifier constant has no direct dependants, processes or modules | Specification added; write dependency-contract negative fixtures next |
| 2026-09-21 | RD-023 | IN PROGRESS → DONE | Nine negative/positive fixtures, full Vite resolution matrix, packed consumer and Base/Ratan/Cashflow checks pass | Next: RD-024 |
| 2026-09-21 | RD-024 | TODO → IN PROGRESS | ESLint config has no indexed export/process; aggregate runner is new | Specification added; write fail-fast runner fixtures next |
| 2026-09-22 | RD-024 | IN PROGRESS → DONE | 107 tests, zero-warning lint, three runner fixtures, 24 browser checks and Base/Ratan/Cashflow builds pass; pristine lock reconstruction matches | Next: RD-025 |

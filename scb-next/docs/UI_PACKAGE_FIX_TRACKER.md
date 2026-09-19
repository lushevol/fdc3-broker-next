# Ratan Design Origin Fix Tracker

Created: 2026-09-19. Source: [package clinic](UI_PACKAGE_CLINIC.md).

**Progress: 7/30 DONE. Next: RD-008.** The clinic contains the review evidence
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
| [RD-008](#rd-008) | Dialog title relationships | P1 | 1 | TODO |
| [RD-009](#rd-009) | Builder instance IDs | P1 | 1 | TODO |
| [RD-010](#rd-010) | Shared field state | P1 | 1 | TODO |
| [RD-011](#rd-011) | Supported sx composition | P1 | 1 | TODO |
| [RD-012](#rd-012) | SearchButton loadingPosition | P1 | 1 | TODO |
| [RD-013](#rd-013) | Builder close requests | P2 | 1 | TODO |
| [RD-014](#rd-014) | Responsive token conditions | P1 | 2 | TODO |
| [RD-015](#rd-015) | Unresolved font-size token | P1 | 2 | TODO |
| [RD-016](#rd-016) | Canonical token source | P2 | 2 | TODO |
| [RD-017](#rd-017) | WebKit action states | P2 | 2 | TODO |
| [RD-018](#rd-018) | Contrast and focus cues | P1 | 2 | TODO |
| [RD-019](#rd-019) | Reduced motion | P2 | 2 | TODO |
| [RD-020](#rd-020) | Public contracts and font ownership | P2 | 2 | TODO |
| [RD-021](#rd-021) | Tree shaking and package byte budget | P2 | 3 | TODO |
| [RD-022](#rd-022) | Browser accessibility and visual gates | P2 | 3 | TODO |
| [RD-023](#rd-023) | Dependency resolution verification | P2 | 3 | TODO |
| [RD-024](#rd-024) | Lint and aggregate verification | P2 | 3 | TODO |
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
Completed: 2026-09-20
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

**Resolve Dialog title IDs once.** P1 · Confirmed · TODO.
Dependencies: none. [Clinic](UI_PACKAGE_CLINIC.md#rd-008).

- [ ] Define precedence for generated IDs, `titleProps.id`, custom headers,
  suppressed headers and explicitly supplied accessible names.
- [ ] Verify every `aria-labelledby` resolves to the intended mounted title,
  including multiple dialogs and custom IDs; avoid dangling references.
- [ ] Run dialog public-contract tests and browser naming/focus checks in the
  host portal configuration.

### RD-009

**Namespace Builder tab/panel IDs per instance.** P1 · Confirmed · TODO.
Dependencies: none. [Clinic](UI_PACKAGE_CLINIC.md#rd-009).

- [ ] Define a shared instance namespace for tab IDs, panel IDs and their ARIA
  relationships without requiring callers to coordinate global IDs.
- [ ] Render two Builders together and verify unique IDs, correct relationships
  and independent keyboard tab selection.
- [ ] Verify inactive panels keep their established mounted state and values;
  check SSR/hydration compatibility where the generated IDs are rendered.

### RD-010

**Propagate shared field state consistently.** P1 · Confirmed · TODO.
Dependencies: none; coordinate with RD-005. [Clinic](UI_PACKAGE_CLINIC.md#rd-010).

- [ ] Specify precedence and propagation for disabled, error and required state
  across Input/Select, their FormControl, label and input elements.
- [ ] Test the public combinations and state transitions rather than only the
  underlying input attributes.
- [ ] Verify label/control appearance and semantics in both modes and generations;
  factor a small internal helper only if it makes these rules easier to maintain.

### RD-011

**Compose all supported sx forms.** P1 · Confirmed · TODO.
Dependencies: none. [Clinic](UI_PACKAGE_CLINIC.md#rd-011).

- [ ] Document default-versus-caller precedence for SearchInput and date wrappers.
- [ ] Preserve object, callback and array `SxProps` forms, including conditional
  array entries, without overwriting the caller's style.
- [ ] Test resolved styles through public components and type-check representative
  consumer usage; verify package defaults still apply when no override is supplied.

### RD-012

**Honor SearchButton's advertised loadingPosition.** P1 · Confirmed · TODO.
Dependencies: RD-006. [Clinic](UI_PACKAGE_CLINIC.md#rd-012).

- [ ] Decide whether to support the advertised positions through shared loading
  behavior or narrow/deprecate the interface with explicit compatibility review.
- [ ] Test each supported position and busy/name semantics; prevent unsupported
  props from leaking to the DOM.
- [ ] Verify existing SearchButton consumers, declarations and visual states.

### RD-013

**Expose a Builder close-request callback.** P2 · Enhancement · TODO.
Dependencies: RD-009. [Clinic](UI_PACKAGE_CLINIC.md#rd-013).

- [ ] Specify an optional callback with dismissal reasons for Escape and backdrop
  interactions; retain host ownership of `anchorEl` and open state.
- [ ] Test request delivery and controlled dismissal, including the existing
  behavior when no callback is supplied.
- [ ] Verify focus restoration and dismissal in host portals; document the
  compatible addition and retain mounted inactive panel behavior.

## Phase 2: Design consistency

### RD-014

**Preserve media-query conditions in generated tokens.** P1 · Static finding · TODO.
Dependencies: none. [Clinic](UI_PACKAGE_CLINIC.md#rd-014).

- [ ] Specify how conditional ancestry is retained when extracting canonical CSS.
- [ ] Add a regression with conditional token declarations and verify mobile-only
  values do not become unconditional generated rules.
- [ ] Regenerate deterministically, review source hashes and diff, and compare
  computed token values at narrow/wide widths in light/dark modes.

### RD-015

**Resolve the public font-size token.** P1 · Static finding · TODO.
Dependencies: RD-014. [Clinic](UI_PACKAGE_CLINIC.md#rd-015).

- [ ] Map the published font-size reference to an approved defined token or emit
  its canonical definition; document any intended fallback.
- [ ] Validate every public token reference and alias chain against packaged CSS,
  detecting missing definitions and cycles rather than checking only this token.
- [ ] Verify computed font sizing from the packed stylesheet in the consumer
  fixture and affected catalog controls.

### RD-016

**Generate CSS and MUI raw values from a canonical source.** P2 · Enhancement · TODO.
Dependencies: RD-014, RD-015. [Clinic](UI_PACKAGE_CLINIC.md#rd-016).

- [ ] Document the versioned source, generation boundary and cases where MUI needs
  raw values rather than CSS references.
- [ ] Generate or validate theme palette values and public CSS references against
  that source, with drift checks and deterministic output.
- [ ] Verify legacy/WebKit, light/dark and responsive values; ordinary package
  builds must still work from committed assets without a sibling source checkout.

### RD-017

**Complete WebKit action-control states.** P2 · Static finding · TODO.
Dependencies: RD-016. [Clinic](UI_PACKAGE_CLINIC.md#rd-017).

- [ ] Specify SearchButton, ResetButton and ToggleButton behavior under explicit
  WebKit generation while preserving the legacy default branch.
- [ ] Apply approved semantic tokens to normal, hover, focus, pressed, selected,
  disabled, error and loading states as applicable.
- [ ] Review a state matrix on desktop/mobile across both generations and modes;
  record intentional visual changes and compatible host checks.

### RD-018

**Improve contrast and restore visible focus cues.** P1 · Static finding · TODO.
Dependencies: RD-016; coordinate with RD-017. [Clinic](UI_PACKAGE_CLINIC.md#rd-018).

- [ ] Measure placeholders, relevant text and focus indicators against their actual
  backgrounds; use approved semantic tokens and record the applicable criteria.
- [ ] Restore a reviewed keyboard focus indication for legacy portal grids and
  assess legacy input focus plus WebKit light/dark focus states.
- [ ] Verify keyboard navigation and measured contrast in actual rendered states;
  record host compatibility review for changes to intentional legacy overrides.

### RD-019

**Respect reduced-motion preferences.** P2 · Enhancement · TODO.
Dependencies: none; coordinate with RD-006. [Clinic](UI_PACKAGE_CLINIC.md#rd-019).

- [ ] Specify reduced-motion behavior for animated loaders while keeping loading
  state understandable and accessible.
- [ ] Implement the approved reduced-motion presentation using shared tokens/styles
  where appropriate, without changing the ordinary animation unintentionally.
- [ ] Verify browser-emulated reduced motion and default motion, including loading
  announcements and both appearance generations.

### RD-020

**Document supported public contracts and font ownership.** P2 · Enhancement · TODO.
Dependencies: RD-001–RD-013; update alongside those fixes where useful.
[Clinic](UI_PACKAGE_CLINIC.md#rd-020).

- [ ] Document defaults, controlled/uncontrolled values, nulls, callbacks/reasons,
  refs, slots, labels/IDs, style precedence and supported inherited props.
- [ ] State that legacy Poppins is host-provided and identify packaged fonts,
  explicit stylesheet loading, optional peers, localization and Pro ownership.
- [ ] Add compiling examples for changed contracts and link corresponding stories;
  verify README, declarations, compatibility guidance and changelog agree.

## Phase 3: Distribution quality

### RD-021

**Improve tree shaking and enforce a package byte budget.** P2 · Confirmed · TODO.
Dependencies: none. [Clinic](UI_PACKAGE_CLINIC.md#rd-021).

- [ ] Reproduce the Button-only retained-code baseline with pinned tooling and
  peer externalization stated explicitly; inspect unrelated retained modules.
- [ ] Make pure initialization removable without dropping actual side effects;
  validate any annotation/build or icon-import change through SSR and Storybook.
- [ ] Enforce a reviewed byte ceiling and unrelated-module checks in the packed
  consumer verifier. Record measured before/after bytes; the clinic's approximate
  18.6 KB → 1.6 KB experiment is evidence, not a promised release threshold.

### RD-022

**Automate browser accessibility, interaction and visual checks.** P2 · Enhancement · TODO.
Dependencies: phase 1 regressions, RD-017–RD-019.
[Clinic](UI_PACKAGE_CLINIC.md#rd-022).

- [ ] Make actionable catalog accessibility violations fail a repeatable automated
  command; record any narrowly justified, owned exclusions.
- [ ] Gate keyboard behavior, dismissal, focus restoration and overlay hit testing
  with representative package and host flows.
- [ ] Replace screenshot-only artifacts with reviewed screenshot comparisons for
  the selected desktop/mobile and legacy/WebKit light/dark matrix; record baseline
  update/review procedure and avoid accepting changed images without review.

### RD-023

**Validate supported versions and runtime dependency resolution.** P2 · Static finding · TODO.
Dependencies: RD-029 when affected host suites are needed.
[Clinic](UI_PACKAGE_CLINIC.md#rd-023).

- [ ] Check supported peer versions rather than only Material/icons major version 5.
- [ ] Verify React, ReactDOM, MUI and Emotion resolve to each host's intended runtime;
  check optional integrations when present and core operation when absent.
- [ ] Exercise negative fixtures for unsupported or duplicate resolution and run
  the independent consumer plus affected host checks. Keep federation sharing
  changes outside this fix unless separately specified and measured.

### RD-024

**Strengthen lint and provide an aggregate quality command.** P2 · Enhancement · TODO.
Dependencies: RD-021–RD-023. [Clinic](UI_PACKAGE_CLINIC.md#rd-024).

- [ ] Add suitable TypeScript, React Hooks and JSX accessibility rules, resolving
  actionable findings with scoped changes and documented exceptions.
- [ ] Provide a repository-owned command aggregating the relevant package,
  distribution and browser gates; document required services and external CI use.
- [ ] Demonstrate successful exit on a clean candidate and failed exit when a
  representative gate fails; preserve actionable logs and avoid masking failures.

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

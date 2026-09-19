# Ratan Design Origin Clinic

Review date: 2026-09-19. Package: `ratan-design-origin@0.1.0`.
Reviewed repository commit: `a2b9a5f7a2c3c25c7408b6f41adfab6f7fbe8249`.

This document records the review findings and their evidence. Implementation
status, acceptance criteria, dependencies, and completion evidence live in the
[fix tracker](UI_PACKAGE_FIX_TRACKER.md). The review itself fixes no production
behavior. Treat this document as a dated baseline; record subsequent outcomes in
the tracker rather than silently rewriting the original observations.

## Assessment

The package has a sound extraction architecture and useful distribution checks.
Its next investment should be completing interaction contracts, accessibility,
token fidelity, and bundle behavior before expanding the component catalog or
widening adoption.

The recurring design weakness is a broad inherited MUI interface around an
implementation that silently overrides or omits some supported behavior. The
package should faithfully preserve those props or expose a narrower documented
interface. Small internal modules for shared field state, loading presentation,
and style composition can concentrate the rules without adding public concepts.

Preserve these strengths and deliberate contracts:

- Separate core, theme, tokens, compatibility, dates, Pro range, and portal-theme
  entries; date/grid/Pro integrations remain optional for core consumers.
- Scoped providers with explicit `mode` and `designGeneration`; host ownership
  of storage, URL policy, authentication, routing, FDC3, and workspace behavior.
- Explicit CSS loading, external React/MUI/Emotion peers, asset provenance,
  independent tarball installation, declarations, and DOM-free SSR checks.
- Safe Snackbar string rendering; sanitized historical HTML stays in Base.
- Existing legacy defaults, consumer callback/ref/export shapes, 14px core versus
  16px adapter loading indicators, forced host dialog portals, and mounted
  inactive Builder panels.
- Host-owned date localization, Pro licensing, dialog sizing/drag/maximize, and
  controlled Builder anchors. Compatibility changes need consumer evidence.

## Scope and verification

The clinic covered current source, public exports, tests, stories, generated
tokens/assets, build and package verification, and Base/Ratan/Cashflow/Alpha
adoption. Parallel reviews examined components, theming/accessibility, and
consumer architecture. Targeted temporary probes checked gaps in the existing
tests. Browser observations used the built Storybook and an independently
installed package consumer.

| Fresh check | Observed result |
| --- | --- |
| Package unit tests with coverage | 10 files / 57 tests passed; reported lines 100% (178/178), branches 100% (292/292) |
| Package typecheck and lint | Passed |
| Package ESM/declaration/assets build | Passed |
| Storybook production build | Passed, with a chunk-size warning |
| Independent packed consumer | Passed core/optional declarations, installation, assets, SSR, and existing tree-shaking assertions |
| Dependency-isolation script | Passed its current MUI-major checks; limitations in RD-023 |
| Independent consumer browser suite | 9 tests passed, including 390px/1280px and all four generation/mode combinations |
| Host browser smoke test | 1 test passed: login, launch Cashflow tile, add workspace, remove the tile workspace |
| Storybook Controls/States accessibility scan | 3 violations in legacy/light and WebKit/light: unnamed button, combobox, progressbar |

The browser test initially could not launch Chromium inside the filesystem
sandbox; the rerun outside that sandbox passed. This was an environment issue,
not a component failure. The packed verifier emitted substantial upstream MUI
`use client` diagnostics; a passing command does not mean warning-free output.

These results describe the installed working environment. An unrelated modified
`scb-next/package-lock.json` and two untracked patch files were present and left
untouched; this review does not claim clean-lockfile reproducibility. Broad
Ratan/Cashflow suites were not rerun. Their historical resolution failures are
tracked separately in RD-029. GitNexus reported an older index, so its lookup
results were cross-checked against current files rather than treated as an
exhaustive dependency graph.

Local logs and diagnostic fixtures were temporary. The durable evidence is the
observations below; fixes must add reproducible, checked-in regression coverage.
Original logs were `/tmp/ratan-clinic-{tests,typecheck,lint,build,storybook,package,isolation,e2e,host}.log`.

## Findings

Each ID matches the [tracker](UI_PACKAGE_FIX_TRACKER.md). “Runtime confirmed”
means an isolated source or packed-consumer probe demonstrated the behavior;
“browser confirmed” means it was observed in the actual rendered interface.
Source findings, enhancements, and historical limitations are identified
separately so they are not mistaken for freshly reproduced regressions.

## RD-001

**Closed LoadingOverlay intercepts clicks — browser confirmed.**

[StatePresentation.tsx, LoadingOverlay](../packages/ratan-design-origin/src/StatePresentation.tsx)
keeps an absolute, full-size wrapper mounted when `open={false}`. In the packed
consumer, hit testing selected its `section` with `pointer-events: auto`; clicking
an underlying button did not increment its counter. Removing the closed overlay
made the same button work. Unmount the inactive wrapper or remove it from hit
testing while preserving exit transitions. A browser test must activate the
underlying control after loading ends.

## RD-002

**Empty and partial date ranges become invalid — runtime confirmed.**

[date-range.tsx](../packages/ratan-design-origin/src/date-range.tsx) converts both
endpoints using `dayjs()`, including `null`. `value={[null, null]}` produced
`aria-invalid="true"` and `onError(["invalidDate", "invalidDate"])`. Partial ranges
have the same problem at the empty endpoint. Preserve `null`; the interface
already accepts Dayjs values. Existing “empty value” coverage exercises an omitted
value, which does not establish the valid null-tuple contract.

## RD-003

**Date wrappers override uncontrolled values — runtime confirmed.**

[dates.tsx](../packages/ratan-design-origin/src/dates.tsx) passes explicit `null`
when `value` is omitted for DatePicker, DateTimePicker, and TimePicker. A
DatePicker supplied only `defaultValue={dayjs("2026-09-18")}` rendered empty.
Preserve the distinction between `undefined`, `null`, and a selected value so
MUI's advertised controlled/uncontrolled behavior remains available.

## RD-004

**Search clear action is unnamed and bypasses disabled state — runtime and browser confirmed.**

[SearchInput.tsx](../packages/ratan-design-origin/src/SearchInput.tsx) gives the
clear IconButton neither an accessible name nor disabled state. A disabled input
still allowed `handleClear` to run. Add a localizable action name and honor
disabled/read-only policy. Base directly re-exports this presentation, making
the repair useful to existing consumers. Its current anonymous button query
does not verify the accessible name.

## RD-005

**Label and native Select can lack accessible names — confirmed.**

[Label.tsx](../packages/ratan-design-origin/src/Label.tsx) uses its `label` as a
default value without connecting an accessible label; Storybook flags its
“Group by” combobox. [Select.tsx](../packages/ratan-design-origin/src/Select.tsx)
generates a label ID but no control ID. In native mode without an explicit `id`,
the visible label did not name the select. Resolve IDs and relationships at the
field module, preserving caller overrides and native/non-native behavior.

## RD-006

**Loading announcements are inconsistent — source and browser confirmed.**

[LoadingButton.tsx](../packages/ratan-design-origin/src/LoadingButton.tsx) and
[SearchButton.tsx](../packages/ratan-design-origin/src/SearchButton.tsx) emit
unnamed progressbars. LoadingButton's start-icon branch also omits the busy
semantics present in its inline branch. Give the progress indicator a meaningful
name or make it decorative when the named action/status announces loading.
Apply consistent busy behavior without duplicate announcements.

## RD-007

**Collapsed criteria retain interactive hidden rows — browser confirmed.**

[SearchConditionContainer.tsx](../packages/ratan-design-origin/src/SearchConditionContainer.tsx)
clips all children to a 49px region without changing their interactivity. Tab
navigation reached and activated later criteria while the region remained
collapsed; the browser scrolled the clipped region internally. The toggle always
says “expand” and supplies neither `aria-expanded` nor `aria-controls`. Define
which criteria remain accessible when collapsed, expose expansion semantics, and
verify narrow layouts and zoom without destroying child state unnecessarily.

## RD-008

**Dialog title overrides break its accessible relationship — runtime confirmed.**

[Dialog.tsx](../packages/ratan-design-origin/src/Dialog.tsx) generates
`aria-labelledby` before `titleProps.id` can replace the actual title ID. The
result can reference a missing element. Resolve the effective ID once; account
for default, custom, and suppressed headers and explicit caller naming props.

## RD-009

**Builder tab IDs collide across instances — runtime confirmed.**

[BuilderButton.tsx](../packages/ratan-design-origin/src/BuilderButton.tsx) gives
popovers unique IDs, but `builderTabProps` and `BuilderTabPanel` derive tab/panel
IDs only from numeric indices. Two tab groups produced duplicate IDs. Introduce
an instance namespace shared by tabs and panels; preserve established test IDs
and compatibility selectors where needed. Continue mounting inactive panels.

## RD-010

**Field state stops before the surrounding FormControl — runtime confirmed.**

[Input.tsx](../packages/ratan-design-origin/src/Input.tsx) routes `disabled` to
InputProps without setting the surrounding TextField state. The native input is
disabled while its label is not. [Select.tsx](../packages/ratan-design-origin/src/Select.tsx)
similarly leaves disabled/error/required state off FormControl. Centralize state
resolution and propagation, respecting the documented slot precedence rather
than introducing contradictory root and input states.

## RD-011

**Supported style inputs are silently dropped — runtime confirmed.**

SearchInput spreads caller props and then overwrites `sx`. Date and range wrappers
object-spread `SxProps`, which loses valid callback and array forms. Width probes
confirmed both losses. Normalize style composition as arrays with explicit
precedence. [Snackbar.tsx](../packages/ratan-design-origin/src/Snackbar.tsx) already
contains a useful local pattern for composing `alertsx` without discarding forms.

## RD-012

**SearchButton advertises loadingPosition without implementing it — runtime confirmed.**

[SearchButton.tsx](../packages/ratan-design-origin/src/SearchButton.tsx) extends
LoadingButtonProps but does not consume `loadingPosition`. The caller's start
icon remained, the spinner stayed inline, and React warned as the prop leaked
into the DOM. Share loading presentation or explicitly narrow the interface;
coordinate any type/behavior change with existing consumers.

## RD-013

**Builder needs a close-request interface — enhancement.**

BuilderButton exposes a controlled anchor but no popover close callback for
Escape/backdrop requests. Add a callback with the appropriate reason while the
host continues to clear `anchorEl`. Improve trigger expanded/control semantics.
The current action-button closure is deliberately documented; this is an
interface extension, not evidence that the extraction violated its old contract.

## RD-014

**Token generation discards responsive conditions — source/output confirmed.**

[generate-webkit-assets.mjs](../packages/ratan-design-origin/scripts/generate-webkit-assets.mjs)
walks nested rules and appends scoped declarations to the output root, dropping
ancestor conditions. Canonical
[ScStyleguide.css](../../sc-dev-web/sc-dev-web/dist/styles/ScStyleguide.css)
contains media conditions at 415px and 680px; corresponding rules in packaged
[styles.css](../packages/ratan-design-origin/assets/styles.css) are unconditional.
Preserve `@media`/`@supports` ancestry and validate computed tokens at narrow and
wide widths. This establishes token-fidelity failure; the current MUI Button
does not consume `--sc-button-width`, so it does not prove that Button is full
width on desktop.

## RD-015

**The public font-size token does not resolve — source confirmed.**

[tokens/webkit.ts](../packages/ratan-design-origin/src/tokens/webkit.ts) exports
`var(--sc-font-size)`, but the packaged stylesheet never defines it. Several
generated legacy-name aliases also depend on it. Define the intended font-size
contract or an approved fallback and validate all exported references and alias
chains in both modes. Checking only for a `var(--sc-` substring cannot establish
token validity.

## RD-016

**Generate palette values and CSS references from one source — design improvement.**

[theme/options.ts](../packages/ratan-design-origin/src/theme/options.ts) repeats
raw palette and typography values separately from canonical CSS tokens. A
versioned token source should produce the raw values needed for MUI color
arithmetic and the semantic CSS references. Preserve reproducible ordinary
builds from committed assets; do not require a sibling WebKit checkout for every
consumer build.

## RD-017

**WebKit action styling is incomplete — source confirmed.**

SearchButton uses fixed legacy colors; ResetButton and ToggleButton choose styles
by mode without a complete WebKit-generation branch. Keep legacy visuals stable
and implement approved WebKit semantic states. Verify normal, hover, focus,
pressed, selected, disabled, error, and loading states where applicable across
both generations/modes. Historical portal-theme policy is a separate surface.

## RD-018

**Improve contrast and verify focus cues — mixed measured and source evidence.**

Committed placeholder colors compute to approximately 2.85:1 for `#999999` on
white and 4.43:1 on `#333333`, below 4.5:1 for normal text. The WebKit button ring
also has low computed contrast against provider backgrounds; those calculations
alone are not a full WCAG compliance verdict.

[portal-theme/Config.ts](../packages/ratan-design-origin/src/portal-theme/Config.ts)
explicitly removes grid header/cell focus outlines without a replacement in those
overrides. Legacy input themes hide the notched outline; their full keyboard
focus visibility still needs targeted browser assessment. Restore appropriate
semantic focus cues and correct approved color pairs, including helper/error
states, through consumer-reviewed visual changes.

## RD-019

**Respect reduced motion — source finding.**

[loader-style.ts](../packages/ratan-design-origin/src/loader-style.ts) defines
indefinite animation without a reduced-motion override. Supply a static loading
affordance under `prefers-reduced-motion` while preserving the status message and
ordinary behavior for users who have not requested reduced motion.

## RD-020

**Document the supported component contracts — documentation improvement.**

The [README](../packages/ratan-design-origin/README.md) explains ownership,
imports, and optional integrations well. Add a concise contract matrix for
controlled state, accessible names, keyboard behavior, refs, customization,
precedence, and appearance support. Clarify that legacy Poppins is host-provided,
not among packaged fonts. Keep examples compilable and distinguish supported
interfaces from compatibility-only helpers.

## RD-021

**Button-only imports retain unrelated code — build experiment confirmed.**

The fresh [package verifier](../packages/ratan-design-origin/scripts/verify-package.mjs)
reported 18,644 bytes for a Button-only build with UI peers externalized. An
equivalent diagnostic build produced 18,626 bytes; the small difference came
from generated path comments. It retained Loader/PageLoader bodies and SVG,
Snackbar, tokens, and unused styled initializers.

Missing purity annotations on `React.memo` in Loader/Snackbar and on several
top-level `styled` calls explain much of the retention. An in-memory transform,
without repository edits, produced:

| Experimental annotations | Output bytes |
| --- | ---: |
| None | 18,626 |
| React.memo only | 8,781 |
| styled only | 12,805 |
| Both | 1,641 |

This is approximately 91% less package overhead, not a measurement of bundled
MUI or total application savings. Validate purity rather than blindly applying
annotations. Add a documented byte budget and retained-module checks: the
current literal `var(--sc-` search misses tokens built through a template helper.
The verifier prints bytes without enforcing a ceiling. Test icon-import changes
against SSR/Storybook because earlier MUI subpath interop problems are recorded
in [the implementation history](UI_PACKAGE_IMPLEMENTATION.md).

## RD-022

**Automate browser quality checks beyond the existing smoke tests — tooling gap.**

The Storybook accessibility addon finds real violations, but no package command
enforces its results as a failing gate. Existing stories mostly demonstrate
static states. The [consumer browser suite](../tests/e2e/design-origin.spec.ts)
saves screenshots but does not compare them against baselines. Add automated
keyboard, clear, collapse, dismissal, focus-restoration, date, and overlay
scenarios with accessibility and reviewed visual comparisons. Cover both modes,
both generations, and narrow/wide layouts; keep targeted contract tests for
semantic edge cases instead of pursuing coverage percentage alone.

## RD-023

**Dependency verification proves too little — tooling gap, not a current mismatch.**

[verify-dependency-isolation.mjs](../scripts/verify-dependency-isolation.mjs)
checks only Material/icons major version 5. It does not enforce the declared
5.18 minimum, React/Emotion identity, optional-peer compatibility, or bundler
resolution. Installed core versions met the documented matrix during review.
Extend checks to supported semver and runtime resolution within each host;
preserve intentional isolation between hosts rather than requiring a global
singleton policy.

## RD-024

**Strengthen lint and provide an aggregate quality command — tooling improvement.**

The [package lint config](../packages/ratan-design-origin/eslint.config.mjs)
enables a short list of JavaScript rules without a complete TypeScript, Hooks,
or JSX accessibility policy. Add relevant rules and a repository-owned command
that runs the documented package gates, with explicit browser prerequisites.
Checked-in frontend Azure pipelines delegate to external templates; their actual
enforcement was not inspectable, so this review does not claim there is no CI.
Wire the aggregate command into the available pipeline integration.

## RD-025

**Consolidate pure compatibility presentation — maintenance improvement.**

The [Ratan bridge](../web/mfe-ratan-container-origin/src/compat/base.tsx) and
[Cashflow bridge](../web/mfe-cashflow-blotter-origin/src/compat/base.tsx) had 394
identical lines in files of 402 and 415 lines. Extract shared UI adaptation into
an appropriate compatibility module. Keep auth, storage, services, FDC3, and
host theme differences local; preserve captured namespace/default exports,
loading sizes, and forced-portal dialog behavior. Do not move all duplicated
platform policy into the design core just to reduce line count.

## RD-026

**Propagate explicit appearance across hosts — adoption improvement.**

The package models both `mode` and `designGeneration`, while existing consumer
bridges largely propagate mode and retain distinct historical theme policies.
Introduce an explicit appearance contract and deliberate per-host generation
rollout. Subscribe through host-owned appearance state rather than spreading
document observers across consumers. The existing differences were preserved
intentionally; this is not an extraction regression.

## RD-027

**Use Alpha Payments to validate direct adoption — proposed pilot.**

[Alpha Payments](../web/mfe-alpha-payments-origin/package.json) currently has no
design-package dependency and recreates input/select/action/loading/error
presentation. Its [styles](../web/mfe-alpha-payments-origin/src/styles.css) mix
inherited legacy colors with fixed dark-derived values. Adopt the provider,
semantic tokens, and appropriate public controls in a bounded pilot while
keeping payment workflows and business table behavior local. Confirm that the
benefit justifies added UI dependencies; this proposal is not a completed rollout.

## RD-028

**Resolve publication ownership and artifact decisions — release gate.**

[UI_PACKAGE_RELEASE.md](UI_PACKAGE_RELEASE.md) leaves the release owner,
registry/access policy, and backup unassigned.
[NOTICE.md](../packages/ratan-design-origin/NOTICE.md) records asset restrictions.
Assign accountable owners, settle redistribution and host Pro-license
responsibilities, and retain immutable candidate/checksum/rollback evidence.
Select explicit publication settings or a guard appropriate to the internal
candidate status. This tracker does not authorize publication or establish
external approvals.

## RD-029

**Reproduce and repair historical broad host test failures — historical limitation.**

[UI_PACKAGE_IMPLEMENTATION.md](UI_PACKAGE_IMPLEMENTATION.md) records successful
focused adoption checks alongside pre-existing broad Ratan/Cashflow failures
associated with duplicate React resolution. These broad suites were not rerun
in the clinic. Establish the current baseline first, then repair test resolution
where still needed. Keep focused compatible-export tests and report unrelated
failures explicitly; do not substitute a focused pass for a broad-suite pass.

## RD-030

**Measure actual host performance before changing federation — measurement improvement.**

The package-only external-peer proof does not measure delivered application
cost. Existing federation policy leaves MUI/Emotion/design code independently
bundled per host. Measure compressed bytes, cold tile loading, duplicate modules
and style insertion, and representative render/theme-switch cost. Set repeatable
budgets from that evidence. Global singleton sharing is a separate architecture
decision with context/version risks; it is not automatically the right fix.

## Execution plan

| Stage | Focus | Completion evidence |
| --- | --- | --- |
| 1 | Interaction correctness and public behavior | Regression tests plus keyboard/browser probes for the repaired contracts |
| 2 | Token fidelity and appearance consistency | Token validation, reviewed state comparisons, contrast/focus/motion checks |
| 3 | Distribution and quality gates | Packed-consumer budgets, enforceable browser checks, dependency/lint/host checks |
| 4 | Adoption and accountable release | Shared pure adapters, explicit appearance, a bounded direct consumer, named release decisions |

Work through the [fix tracker](UI_PACKAGE_FIX_TRACKER.md) one item at a time.
Start with RD-001. Keep legacy compatibility explicit, update specifications
before implementation, and commit only a verified, isolated stage. Existing
[inventory](UI_PACKAGE_INVENTORY.md), [implementation specifications](UI_PACKAGE_IMPLEMENTATION.md),
and [release policy](UI_PACKAGE_RELEASE.md) continue to govern ownership and
rollout.

# Base UI component migration plan

Status: proposed implementation sequence, 2026-09-27. This plan covers
`web/mfe-base-origin` adopting reusable presentation from
`packages/ratan-design-origin`. It does not implement the migration.

The earlier [guide plan](BASE_UI_MIGRATION_GUIDE_PLAN.md) completed the
documentation stage. This plan turns the [migration guide](UI_PACKAGE_MIGRATION_GUIDE.md)
and [component audit](BASE_UI_COMPONENT_AUDIT.md) into concrete implementation
slices, rechecked against the current source. The
[inventory](UI_PACKAGE_INVENTORY.md) remains the record of shipped ownership;
candidate components below are not available exports yet.

## Target and ownership

Base pages should obtain their shared fields, actions, dialogs, switches and
feedback from Ratan Design, directly or through compatible Base adapters.
Login and Home remain Base pages. Their page layouts and feature compositions
do not become design-package exports.

The migration unit is a useful component: for example, a field with its label,
adornments and validation display, or an icon action with tooltip and keyboard
behavior. Its internal primitives need not each become public exports.

**No logic with business dependencies belongs in Ratan Design.**

| Ratan Design owns | Base owns |
| --- | --- |
| Reusable rendering, tokens, visual states and accessibility | Page layout, product copy, illustrations and feature composition |
| Field values/options received through props and validation display | Validation rules, fetching, record conversion and form submission |
| Focus, keyboard navigation, selection UI, expansion and overlays | Authentication, entitlements, routing, session renewal and logout |
| Generic callbacks and component-local presentation state | Stores, services, analytics, persistence, FDC3/OpenFin and remote lifecycle |
| Generic presentation types | User, Workspace, AdminRecord and other domain models |

Passing a business record or service into the package through props still
violates this rule. Base must resolve it into presentation values and ordinary
event callbacks first. DOM measurement and focus handling are legitimate UI
behavior; reading session storage or interpreting business field names is not.

Completion means adoption of the agreed shared component catalog and an explicit
disposition for remaining uses. Local MUI layout, typography, icons, styling
utilities and retained feature integrations are allowed. A complete MUI facade,
zero direct MUI imports and relocation of every Base component are not targets.

## Current codebase findings

The reviewed package has 54 TypeScript source files, 12 test files and six
Storybook files. Source inspection found no imports of Base source, stores,
services or routing, and no obvious business execution dependency in the
provider, controls, dialogs, state presentation or compatibility adapters.
This is a source audit, not a new runtime verification result.

| Current surface | Evidence and conclusion | Migration action |
| --- | --- | --- |
| Buttons and fields | [Core exports](../packages/ratan-design-origin/src/index.ts) include Button, LoadingButton, Input, Select, Label and ToggleButton. Base Button/LoadingButton already re-export them; Input/Select preserve host selectors. | Adopt the existing components; do not build replacements. |
| Search and builder | SearchInput/actions/criteria/layout and BuilderButton/tabs/panels are public. | Keep query execution and filter values in Base. Builder tabs are not a workspace-tab replacement. |
| Feedback | Loader/PageLoader, Snackbar, EmptyState, ErrorFallback and LoadingOverlay already have Base adapters. | Preserve those seams, including Base's sanitized HTML Snackbar and host-owned error/support behavior. |
| Dialog | [Core Dialog](../packages/ratan-design-origin/src/Dialog.tsx) supplies title/content/actions and focus/overlay handling. Base Dialog additionally manages workspace placement, drag, resize, stacking and telemetry. | Use core Dialog for ordinary Survey/Timeout presentation; retain the specialized Base adapter elsewhere. |
| Dates | `dates` and optional Pro `date-range` entries already exist. | Keep localization, timezone policy and license initialization in Base; no new extraction. |
| Missing shared compositions | AutocompleteField, LabeledSwitch and IconAction are absent from current core exports. Repeated Base uses establish their need. | Add one focused interface per composition, then adopt it in the named consumers below. |
| Legacy presentation | `compatibility`, `base-compat` and `portal-theme` contain intentional legacy contracts. Portal theme still includes LoginPage visual values; `base-compat.Time` only stringifies a value. | Keep them opt-in/transitional. Do not remove compatible exports or promote login tokens, domain-aware Time, or portal reset policy into core. |
| Host theme integration | [Base theme selection](../web/mfe-base-origin/src/theme/index.tsx) and [provider](../web/mfe-base-origin/src/theme/Provider.tsx) still use host state, MUI ThemeProvider, CssBaseline and localization. Base loads its own WebKit CSS; [Container](../web/mfe-base-origin/src/pages/Home/common/Container.tsx) forwards appearance to remotes. | Test both standalone RatanDesignProvider and the actual Base provider. Do not assume Base already uses RatanDesignProvider or replace the host provider/CSS as an incidental adoption. |

The older [extraction plan](UI_PACKAGE_EXTRACTION_PLAN.md) describes historical
foundation work and is not the current completion baseline. In particular,
MUI 5 alignment and most shared-control extraction are already implemented.
The remaining work is call-site adoption plus the three demonstrated gaps.

## Implementation sequence

Each slice ends with captured behavior, verified source changes, documentation
updates and its own commit. The order prioritizes existing exports before new
public interfaces. Slice 0 precedes source work; slices 3–5 can proceed
independently once their contracts and file ownership are settled.

### 0. Capture contracts and establish the baseline

- Record selected imports, exported/default shapes, props, callback arguments,
  refs, native IDs, root test IDs, selectors, portal placement and visual states.
- Capture the current worktree, including Login's removal of forced `focused`
  props. Keep unrelated local edits out of migration commits.
- Run focused existing tests and the relevant baseline gates; record existing
  failures separately so they cannot be mistaken for migration regressions.
- Recheck GitNexus freshness and run upstream impact for every existing symbol
  being edited. Report callers, affected processes and risk before editing;
  warn on HIGH/CRITICAL results.
- Record existing legacy/WebKit light/dark visuals and both `new-layout`
  branches where they apply. Layout and design-generation flags are distinct.

Exit: a small contract checklist for each slice and a reproducible baseline.
No broad architectural rewrite is required to start.

### 1. Adopt existing fields and actions

| Consumer | Change | Behavior that remains in Base / must survive |
| --- | --- | --- |
| [Login](../web/mfe-base-origin/src/pages/Login/index.tsx) | Replace the two direct TextField compositions with existing Input through the Base adapter. Consolidate label ownership without rendering duplicate labels. Existing sign-in/SSO LoadingButtons already use the package. | Username trimming, password handling, Enter behavior, loading, SSO URL and visibility policy; placeholders, adornments, test IDs, accessible label association, medium sizing and page CSS. Preserve the current unforced focus state. |
| [Home](../web/mfe-base-origin/src/pages/Home/index.tsx) | Adopt Button for Add Workspace. | Workspace creation, accessible name, class and test ID, tab positioning and both layout branches. |
| [Tile](../web/mfe-base-origin/src/components/Tile/index.tsx) | Adopt Button inside the existing card. | Disabled behavior and click bubbling: launch must happen once. Theme-dependent card composition and launch policy stay local. |
| [Admin Main](../web/mfe-base-origin/src/admin/common/Main/index.tsx) | Adopt Button for ordinary actions. | Permissions, create/save workflows and DataGrid stay local. |
| [TabItem](../web/mfe-base-origin/src/components/TabItem/index.tsx) | Adopt Input for the standard, unlabeled workspace-name field after confirming DOM/style equivalence. | `edit-${item.id}` input ID, root test ID, Workspace Name accessibility, curried edit handler and deliberate click-to-blur behavior. No package Workspace prop. |

Use the existing Input interface first. If its label/style defaults obstruct a
consumer, identify the exact shared contract gap and test a minimal general
extension; do not add a `login` or `workspace` mode. Record any justified retained
use explicitly rather than silently declaring the family complete.

Exit: these consumers use the existing catalog with their page/controllers and
public Base paths intact. No LoginPage, HomePage or authentication-form export.

### 2. Adopt existing Dialog in Survey and Timeout

Replace the repeated MUI Dialog/title/content/actions structure in
[Survey](../web/mfe-base-origin/src/components/Survey/index.tsx) and
[Timeout](../web/mfe-base-origin/src/components/Timeout/index.tsx) with core
Dialog's `titleComponents`, `actionComponents`, `titleProps` and content.
Use package Button/LoadingButton for actions. Avoid routing these ordinary
modals through Base's workspace-aware Dialog controller.

Preserve explicit title/description IDs, action test IDs, autofocus, busy/disabled
states and the current Escape/backdrop close policy. Existing MUI DialogTitle
renders an `h2`, while core Dialog's generated title defaults to a `div`: supply
`titleProps.component="h2"` (or an equivalent custom header) and test the heading
role as well as the dialog's accessible name. Core Dialog already creates
content/action wrappers; avoid accidentally nesting a second set. Check portal
placement, stacking, focus containment and focus return in the actual Base host.
Do not introduce a close button or dismiss-on-Escape behavior merely because
the package supports them.

Survey copy, popup behavior, logout sequencing, token expiry, timers and session
extension remain in their existing Base controllers.

Exit: both features reuse generic modal presentation with unchanged business
behavior. Existing Base Dialog consumers retain drag/resize/workspace behavior.

### 3. Add and adopt LabeledSwitch

Evidence: [Switch](../web/mfe-base-origin/src/components/Switch/index.tsx) and
[SwitchTime](../web/mfe-base-origin/src/components/SwitchTime/index.tsx) repeat
switch/label/icon composition and share SwitchStyled.

Proposed interface: controlled `checked`, visible label, accessible name,
optional decorative icon, disabled/size, ordinary root/input attributes and
input ref; `onChange(event, checked)`. The package owns associated labeling,
keyboard/focus behavior and token-based switch styling. A read-only label can
contain the host's already-formatted time without owning a clock.

Base maps theme and time preferences to these props. Keep storage, document
classes, theme dispatch, UTC/local conversion, timer interval and analytics
local. Capture the existing distinct switch appearances, including the older
SwitchTime MUI variant, before defining generic presentation options; do not
expose `isNewLayout`, store objects or domain-specific methods in its interface.
The host binds its preference update to the ordinary `onChange` callback.
Base adapters preserve their root/input selectors and test IDs.

Exit: both consumers use one reusable switch composition; standalone stories
and tests cover label association, Space activation, focus, disabled state,
checked rendering and exactly one callback per activation.

### 4. Add and adopt AutocompleteField

Evidence: [TableDetail Field](../web/mfe-base-origin/src/components/TableDetail/Field.tsx)
and [admin Tile](../web/mfe-base-origin/src/admin/Tile/index.tsx) both assemble
Autocomplete + Input + popup icon with a left-hand label.

Proposed interface: typed options/selection, separately controlled `value` and
`inputValue`, label/label position, placeholder, disabled/read-only/error/helper
state, clearability, option-label/equality/render callbacks, input ref and
presentation/portal options. Preserve the existing MUI change reason/details
contract so host behavior does not depend on reinterpreted events. Limit the
initial interface to demonstrated single-select needs; do not add multi-select,
async fetching or free-solo policy without a consumer requirement.

The package owns input/listbox wiring, refs/adornments, keyboard navigation and
selection presentation. Preserve supplied Autocomplete input handlers/refs when
composing Input. Verify clearability and empty values separately: TableDetail
uses `disableClearable`, while admin Tile uses a clearable category selector and
`disablePortal`. Default portal placement must work under both standalone and
Base themes, with explicit consumer placement taking precedence.

Base retains column/record interpretation, string/boolean conversions, option
fetching, image URL construction and permission decisions. Resolve these into
values and render content before passing props; do not expose AdminRecord,
GridColDef, category services or business field names in the package interface.

Exit: both consumers use the composed field; tests cover typing versus selection,
clear/empty state, disabled/read-only behavior, option rendering, keyboard choice,
label association, callbacks and popup placement.

### 5. Add and adopt IconAction

Proposed interface: icon/content node, required accessible name, optional tooltip,
disabled/size/color, normal button attributes/events, root class and button ref.
It owns focus cues and tooltip composition, including an intentional disabled
tooltip wrapper that does not change the ref target or event behavior.

Adopt it in [SurveyButton](../web/mfe-base-origin/src/components/SurveyButton/index.tsx),
[CopyText](../web/mfe-base-origin/src/admin/common/CopyText/index.tsx),
[TabItem](../web/mfe-base-origin/src/components/TabItem/index.tsx), and the refresh
action in admin Tile. Include [Avatar's menu trigger](../web/mfe-base-origin/src/components/Avatar/index.tsx)
and [Base Dialog's resize handle](../web/mfe-base-origin/src/components/Dialog/index.tsx)
after capturing their menu/pointer contracts. A resize handle requires normal
`onMouseDown` support, not just `onClick`.

Keep clipboard effects, survey windows, identity/photo lookup, menu state,
workspace callbacks and resize orchestration in Base. Preserve button IDs,
test IDs, curried callback binding and mouse-event propagation. Add an explicit
accessible name where a consumer currently relies only on tooltip/image text.
Do not replace DataGrid's GridActionsCellItem; its grid-specific keyboard and
menu behavior is a retained integration.

Exit: the six named consumers use the shared action where their contracts fit;
any exception has a documented technical reason. Tests cover accessible name,
Enter/Space, disabled activation, tooltip on pointer/focus, refs and host events.

### 6. Close the inventory and prevent regressions

- Re-scan Base call sites for the adopted families. Require package usage or an
  explicit, reviewed exception; do not use a blanket MUI import ban.
- Add focused architecture checks for forbidden package-to-application imports,
  application aliases and unexpected dependencies. Review public types/defaults
  manually for domain leakage that an import check cannot detect.
- Keep `dates`, Pro `date-range`, `portal-theme` and compatibility entries
  separate. Core must not acquire MUI X licensing or WebKit browser registration.
- Update the inventory, migration-guide status, package README, implementation
  record and changelog to describe actual exports and actual adoption. Keep
  existing `@fm/base` export/default shapes and downstream feature imports.
- Record the final accepted exceptions, test results and remaining deferred
  candidates. Future package extraction requires independent reuse evidence.

## Deliberately retained or deferred

| Surface | Final disposition for this migration |
| --- | --- |
| Login/Home, AppBar, Drawer/NewTile, Avatar/Profile | Retain page/shell/identity composition in Base; adopt selected controls within them. |
| TabItem/TabPanel and Home Container | Keep workspace semantics, editing, mounting, caching and activation local. Adopt Input/IconAction where selected; do not substitute Builder tabs. |
| Table/TableDetail, admin editors/actions/status | Retain record-aware grids, permission checks, verification/deactivate/save and status meaning. Extract only the agreed field/action presentation. |
| Time, Timeout, Survey, Version | Keep time-field heuristics, session/survey/version policy in Base. Base Time is not replaced with `base-compat.Time`. |
| Empty/FallbackError/Splash/ErrorBoundry | Keep existing host wrappers, support lookup, capture, illustrations, copy and layout; presentation is already packaged. |
| ScWebkit/ReactWrapper and platform bridges | Keep custom-element registration, browser integration, services and related-app navigation local. |
| ActionCard, general tabs, generic grid, profile/menu/accordion abstractions | Defer pending a second meaningful use and a shared interface. Raw Card, Tabs or DataGrid imports alone do not justify extraction. |

## Verification and completion

For each implementation slice, specify the behavior first, write focused failing
tests for missing behavior, then implement and run the affected existing tests.
Every new public component needs public-interface tests, declaration/export
coverage, standalone fixture usage and a story with meaningful states. Render
package tests with plain data and callbacks, without Base providers/services.
Maintain the repository's >90% line/branch coverage requirement and do not lower
the configured thresholds to pass a slice.

From `scb-next`, package changes use these existing gates:

```bash
npm run test --workspace ratan-design-origin -- --maxWorkers=2
npm run typecheck --workspace ratan-design-origin
npm run lint --workspace ratan-design-origin
npm run build:packages
npm run build:storybook --workspace ratan-design-origin
npm run verify:package --workspace ratan-design-origin
npm run verify:dependency-isolation
```

The dependency-isolation check validates dependency resolution/version alignment;
it does not replace source/interface review for business coupling. The packed
consumer gate verifies independent installation and optional-peer/core isolation.
Extend its fixture for new exports rather than testing only workspace resolution.

For Base changes, run affected component/page tests, then its test, typecheck,
lint and build scripts. Run the host regression from `scb-next`:

```bash
npm exec -- playwright test tests/e2e/design-origin-host.spec.ts
```

Use the SCB Vite host at `http://localhost:8001`, not the separate root-monorepo
Single-SPA application. Verify login → New Tile → launch a tile → remove its
workspace tab. Also exercise the changed controls in legacy/WebKit light/dark,
both applicable layout variants and narrow/wide viewports, including focus,
disabled, error and loading states. The existing host test covers one configured
appearance journey; it is not by itself the full appearance/state matrix.

Run affected Ratan/Cashflow bridge tests and builds when public package contracts
change; Cashflow has no active typecheck script. Retain federation sharing,
deduplication and appearance forwarding. Provider/global-CSS changes, if later
needed, require their own integration slice and cross-host verification.

Before each commit, run GitNexus `detect_changes()` on the intended staged scope,
review the diff and commit only that verified slice. Roll back a slice by
restoring its coherent package/adapter/CSS revision and rerunning the same gates;
never reset unrelated work. Publication/deployment follows the separate
[release runbook](UI_PACKAGE_RELEASE.md).

The migration is complete when the named consumers use the agreed catalog (or
have explicit exceptions), each new component works independently, business
policy remains in Base, compatibility is preserved, and the affected gates pass.
Retained features and deferred abstractions are not unfinished migration work.

## Planning verification record

This plan was checked against the current package exports, Base call sites,
controllers, theme integration, manifests, test configuration and earlier audit.
Only documentation is changed by this planning stage. No new component is
claimed as implemented, and no application/browser test pass is claimed here.

Planning checks confirmed the source/test/story counts, absence of the three
candidate exports, all 88 local links across the three touched documents, and
balanced code fences. An independent source review checked the adoption seams.
GitNexus returned unrelated flows for the package/Base query; index refresh did
not complete global registry registration because of filesystem permissions.
These findings therefore rely on current source inspection, not a graph-based
blast-radius claim. No implementation symbol was edited; fresh symbol impact
analysis remains required before implementing the slices.

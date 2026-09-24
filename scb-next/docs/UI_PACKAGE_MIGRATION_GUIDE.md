# Migrating reusable Base UI to Ratan Design

Status: guide for the current `ratan-design-origin@0.1.0` catalog and remaining
component candidates, 2026-09-24. Candidate interfaces below are proposals;
they are not exports available for use yet.

Use this guide to adopt or extract reusable controls and useful compositions of
primitives. Login, Home and portal features remain in Base. They can use package
fields, actions and dialogs while retaining page layout and business behavior.
Local MUI layout, typography, icons and styling utilities are allowed; removing
every direct MUI import is not a migration goal.

The [source audit](BASE_UI_COMPONENT_AUDIT.md) records the inspection of both
codebases. The [inventory](UI_PACKAGE_INVENTORY.md) records shipped ownership;
the [implementation contract](UI_PACKAGE_IMPLEMENTATION.md) records detailed
specifications. Use the [package README](../packages/ratan-design-origin/README.md)
for the full prop/default/ref matrix and supported peer versions.

## Ownership rule

**No business-dependent logic belongs in `ratan-design-origin`.** Review public
types, default values and decisions as well as imports. Injecting a Base store or
service through props still couples the component to business behavior.

| Package owns | Base owns |
| --- | --- |
| Fields, labels, adornments, validation display, action and loading states | Values, validation rules, authentication, submissions and data fetching |
| Focus, keyboard interaction, expansion, selection presentation and overlays | Entitlements, navigation, session renewal, analytics and persistence |
| Reusable styling, tokens, themes and ordinary UI event callbacks | Page composition, business copy/assets, workspace placement and remote lifecycle |
| Presentation options and identifiers | AdminRecord/User/Workspace models, field-specific rules and mapping from records to presentation |

Internal primitives need not become public exports. Prefer one useful field
interface over requiring each caller to assemble its label, input, helper text
and accessibility relationships. Keep feature components local when extracting
them would merely move domain decisions behind a new name.

## Status and next action

"Migrated" means the package owns that presentation and the existing Base bridge
delegates to it. It does not mean every screen uses it. "Retained in Base" is a
completed ownership decision, not an unfinished migration.

| Family or use | Status | Next action |
| --- | --- | --- |
| Button, LoadingButton, Input, Select, ToggleButton, Label | Migrated | Use the existing controls; preserve adapter-specific selectors and defaults. |
| SearchInput/actions/criteria/layout and BuilderButton/tabs/panels | Migrated | Reuse the compositions; keep criteria/query execution in the caller. |
| Loader/PageLoader, Snackbar and empty/error/loading presentations | Migrated | Preserve host orchestration and legacy Snackbar HTML semantics. |
| Dialog presentation and legacy title/root styles | Migrated | Keep Base's workspace/drag/resize adapter where required. |
| DatePicker, DateTimePicker, TimePicker, DateRangePicker | Migrated | Use the appropriate optional entry and host localization. |
| Theme/tokens, legacy visual compatibility | Migrated | Keep core appearance explicit and portal compatibility opt-in. |
| Direct Button/Input/Dialog uses in selected Base consumers | Adoption pending | Verify the call-site contract, then adopt an existing export or Base bridge. |
| Autocomplete field, labeled switch, icon action | Candidate | Implement the contracts in the remaining-work section after capturing consumer behavior. |
| Action card, general tab group, generic grid | Deferred | Require evidence of a useful shared interface before adding to the catalog. |
| Pages, shell navigation, identity, session, admin and WebKit integrations | Retained in Base | Adopt selected controls inside them without moving the feature. |

## Choosing an import

Existing `@fm/base` namespace imports and local Base component paths remain
supported. Keep them when callers depend on host behavior or legacy styling.
New independent UI can use named package exports. Do not perform a blanket
replacement of Base imports with package imports.

| Existing Base path/export | Package equivalent | Compatibility detail |
| --- | --- | --- |
| `components/Button`, `LoadingButton` defaults | Core `Button`, `LoadingButton` | Base re-exports these directly. Core loading indicator defaults to 14px/inline. |
| `components/Input`, `Select` defaults | Core `Input`, `Select` | Base adds its prefixed left-label CSS classes; keep the bridge for existing selectors. |
| `components/Label` default and `MenuItem` | Core `Label`, `LabelMenuItem` | Preserve both names in the Base adapter. |
| `components/ResetButton` exported `SearchButtonProps` type | Core `ResetButtonProps` | Preserve the historical type alias for old callers. |
| `components/BuilderButton` default, `Tabs`, `Tab`, `TabPanel`, `a11yTabPanelProps` | Core `BuilderButton`, `BuilderTabs`, `BuilderTab`, `BuilderTabPanel`, `builderTabProps` | Preserve Base's named exports; general workspace tabs have a different contract. |
| Search component defaults | Corresponding core named exports | Keep existing style-helper aliases in the bridges. |
| Loader/PageLoader defaults | Core `Loader`, `PageLoader` | Base supplies historical root/nested test IDs. |
| Snackbar default | Core `Snackbar` | Base sanitizes HTML strings; core displays text or React content. |
| Dialog default | Core `Dialog` | Core does not supply Base workspace lookup, drag/resize or telemetry. |
| Empty, FallbackError, Splash | Core `EmptyState`, `ErrorFallback`, `LoadingOverlay` | Base owns dispatch, support links, error capture, copy and viewport layout. |
| Community picker defaults | `dates` named exports | Base preserves classes/test IDs; localization remains at the host. |
| DateRangePicker default | `date-range` named export | Optional Pro dependency and license setup remain host responsibilities. |

Use `ratan-design-origin/theme` for theme factories, `tokens` for semantic
tokens, and `styles.css` for scoped variables/fonts. `portal-theme` preserves
historical host theme/reset policy. `compatibility` preserves existing styled
surfaces/selectors. `base-compat` preserves the Ratan/Cashflow presentation
namespaces: its loading adapter defaults to 16px/startIcon and its Dialog has
legacy portal/default-open behavior. Its `Time.Time` string renderer is not the
domain-aware Base Time component. These compatibility entries are not the
starting point for new component interfaces.

## Recipes for migrated components

### 1. Appearance and ordinary controls

At an independent UI root, import package CSS explicitly and supply appearance.
The provider does not read auth, storage or URL flags. Base already has a
[host theme adapter](../web/mfe-base-origin/src/theme/index.tsx) and
[provider](../web/mfe-base-origin/src/theme/Provider.tsx); retain their existing
policy when adopting individual controls. Adding a new provider around every
field is unnecessary and can change overlay placement.

This example is a composition in the consuming application. Its callback owns
the action; the package does not know what the entered value represents.

```tsx
import { Input, LoadingButton, RatanDesignProvider } from 'ratan-design-origin';
import 'ratan-design-origin/styles.css';

export function ControlsExample({ value, busy, onChange, onContinue }: {
  value: string;
  busy: boolean;
  onChange: (value: string) => void;
  onContinue: () => void;
}) {
  return (
    <RatanDesignProvider mode="light" designGeneration="legacy">
      <Input label="Reference" variant="outlined" value={value}
        disabled={busy} onChange={(event) => onChange(event.target.value)} />
      <LoadingButton loading={busy} onClick={onContinue}>Continue</LoadingButton>
    </RatanDesignProvider>
  );
}
```

Keep `variant` explicit for Input and Select. Input supports native `inputRef`
and a root ref; modern `slotProps` take precedence over corresponding legacy
props. Select supplies its own FormControl and associated label. Avoid leaving
an extra form-control/label wrapper around an adopted field without checking
the resulting DOM and visual behavior. LoadingButton disables activation while
loading and preserves its accessible name. Label is a compact selector;
ToggleButton owns selection presentation through the normal MUI props.

For Login, keep username trimming, password state, Enter handling, SSO links and
sign-in services in its controller. Evaluate the two TextField uses against
Input's labels, adornments, size and test IDs before changing them. This is a
field adoption; it does not create a package Login component.

### 2. Search controls and criteria

The caller owns query values, search/reset actions and the criteria list.
SearchInput supplies search/clear affordances. Its clear action is disabled when
the effective input is disabled or read-only. A SearchCondition hides itself on
close and reports the event; update the caller's criteria data too. The container
owns collapsed/expanded display and clipped-item accessibility.

```tsx
import {
  ResetButton, SearchButton, SearchCondition, SearchConditionContainer,
  SearchGrid, SearchInput,
} from 'ratan-design-origin';

export function SearchExample({ value, busy, onChange, onSearch, onReset }: {
  value: string;
  busy: boolean;
  onChange: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
}) {
  return <>
    <SearchGrid>
      <SearchInput label="Search" variant="outlined" value={value}
        onChange={(event) => onChange(event.target.value)}
        handleClear={() => onChange('')} />
      <SearchButton loading={busy} onClick={onSearch}>Search</SearchButton>
      <ResetButton onClick={onReset}>Reset</ResetButton>
    </SearchGrid>
    <SearchConditionContainer>
      {value && <SearchCondition key={value} label="Search" value={value}
        onClose={() => onChange('')} />}
    </SearchConditionContainer>
  </>;
}
```

### 3. Builder popover

The caller controls `anchorEl`, selected tab and content. Clear the anchor for
Escape/backdrop requests and after any application action that should close it.
Builder manages tab relationships and restores trigger focus after closing.
The following component contains only local UI state.

```tsx
import { useState } from 'react';
import {
  BuilderButton, BuilderTab, BuilderTabPanel, BuilderTabs, builderTabProps,
} from 'ratan-design-origin';

export function BuilderExample() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [tab, setTab] = useState(0);
  return <BuilderButton label="Filters" anchorEl={anchor}
    onClick={(event) => setAnchor(event.currentTarget)}
    onClose={() => setAnchor(null)}>
    <BuilderTabs value={tab} onChange={(_event, value: number) => setTab(value)}>
      <BuilderTab label="Options" {...builderTabProps(0)} />
      <BuilderTab label="Preview" {...builderTabProps(1)} />
    </BuilderTabs>
    <BuilderTabPanel value={tab} index={0}>Option controls</BuilderTabPanel>
    <BuilderTabPanel value={tab} index={1}>Preview content</BuilderTabPanel>
  </BuilderButton>;
}
```

Builder's supported labels are Table and Filters. Its tabs/panels preserve
inactive children. Base TabPanel additionally coordinates remote mounting and
activation; retain that feature locally.

### 4. Dialog

Use core Dialog for ordinary controlled modal presentation. `onClose` reports
Escape/backdrop requests; `onCloseButton` handles the optional header button.
The caller closes the dialog. An explicit container overrides the provider's
overlay container. Preserve title/description relationships and focus behavior.

```tsx
import { Button, Dialog } from 'ratan-design-origin';

export function DialogExample({ open, onClose }: {
  open: boolean;
  onClose: () => void;
}) {
  return <Dialog open={open} titleComponents="Details"
    onClose={onClose} onCloseButton={onClose}
    actionComponents={<Button onClick={onClose}>Done</Button>}>
    Details supplied by the caller.
  </Dialog>;
}
```

Retain Base Dialog for consumers requiring its sizing, workspace positioning,
drag, resize, maximize, stacking and analytics. Survey/Timeout can potentially
adopt core presentation, but preserve their existing title/description IDs,
autofocus, action test IDs and close policy. Their logout/session controllers
must remain in Base. Do not infer that a dialog migration requires those flows
to become package components.

### 5. Feedback and state presentation

Loader/PageLoader display loading state. Snackbar accepts React content or
literal text; never transfer Base's legacy HTML interpretation into core.
EmptyState, ErrorFallback and LoadingOverlay accept content/actions without
dispatching, navigating, catching errors or constructing support links.

```tsx
import { Button, EmptyState, ErrorFallback, PageLoader, Snackbar } from 'ratan-design-origin';

export function FeedbackExample({ loading, failed, empty, saved, onRetry, onDismiss }: {
  loading: boolean;
  failed: boolean;
  empty: boolean;
  saved: boolean;
  onRetry: () => void;
  onDismiss: () => void;
}) {
  if (loading) return <PageLoader text="Loading" />;
  if (failed) return <ErrorFallback title="Unable to load"
    action={<Button onClick={onRetry}>Retry</Button>} />;
  return <>
    {empty && <EmptyState title="No results" description="Adjust your search." />}
    <Snackbar open={saved} severity="success" message="Saved"
      onClose={onDismiss} />
  </>;
}
```

PageLoader uses an absolute layout; the caller provides a suitable containing
region. LoadingOverlay similarly needs explicit open state and a host layout.
Keep Base's Empty illustration/drawer action, FallbackError's support lookup,
Splash's viewport sizing and ErrorBoundry's error capture locally. Preserve Base
Loader/PageLoader test IDs through their adapters.

### 6. Dates and ranges

Use the community `dates` entry and put localization at the host. DateRangePicker
uses the separate optional Pro `date-range` entry. Keep service values and
business date rules outside the controls. Omitted value is uncontrolled; null
is a controlled empty value. Preserve partially empty range endpoints.

```tsx
import {
  AdapterDayjs, DatePicker, LocalizationProvider, type Dayjs,
} from 'ratan-design-origin/dates';

export function DateExample({ value, onChange }: {
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
}) {
  return <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker label="Date" value={value} onChange={onChange}
      format="YYYY-MM-DD" />
  </LocalizationProvider>;
}
```

The [date fixture](../packages/ratan-design-origin/fixtures/consumer/src/dates.tsx)
also demonstrates DateTimePicker, TimePicker and Pro ranges. Preserve picker
callback arguments, slots, IDs, hidden state and left-label selectors. Hosts
own optional dependencies, localization/timezone and MUI X Pro licensing.

## Evidence index for migrated families

Use these sources when writing or reviewing an adoption. Existing tests are
evidence of a contract; rerun affected tests after implementation changes.

| Family | Implementation / Base bridge | Public tests and catalog |
| --- | --- | --- |
| Controls | [Input](../packages/ratan-design-origin/src/Input.tsx), [Base Input](../web/mfe-base-origin/src/components/Input/index.tsx), [Select bridge](../web/mfe-base-origin/src/components/Select/index.tsx) | [Controls tests](../packages/ratan-design-origin/tests/controls.test.tsx), [Base compatibility](../web/mfe-base-origin/src/components/Input/compatibility.test.tsx), [Controls stories](../packages/ratan-design-origin/stories/Controls.stories.tsx) |
| Search | [SearchInput](../packages/ratan-design-origin/src/SearchInput.tsx), [Base search](../web/mfe-base-origin/src/components/SearchInput/index.tsx) | Controls tests/stories above; [Base SearchInput test](../web/mfe-base-origin/src/components/SearchInput/index.test.tsx) |
| Builder | [Builder](../packages/ratan-design-origin/src/BuilderButton.tsx), [Base aliases](../web/mfe-base-origin/src/components/BuilderButton/index.tsx) | [Builder tests](../packages/ratan-design-origin/tests/builder.test.tsx), [Builder stories](../packages/ratan-design-origin/stories/Builder.stories.tsx) |
| Dialog | [Dialog](../packages/ratan-design-origin/src/Dialog.tsx), [Base Dialog](../web/mfe-base-origin/src/components/Dialog/index.tsx) | [Package tests](../packages/ratan-design-origin/tests/dialog.test.tsx), [Base tests](../web/mfe-base-origin/src/components/Dialog/index.test.tsx), [Dialog stories](../packages/ratan-design-origin/stories/Dialog.stories.tsx) |
| Feedback | [Snackbar](../packages/ratan-design-origin/src/Snackbar.tsx), [Base HTML adapter](../web/mfe-base-origin/src/components/Snackbar/index.tsx) | [Feedback tests](../packages/ratan-design-origin/tests/feedback.test.tsx), [HTML compatibility](../web/mfe-base-origin/src/components/Snackbar/compatibility.test.tsx), [Feedback stories](../packages/ratan-design-origin/stories/Feedback.stories.tsx) |
| Empty/error/loading | [State presentation](../packages/ratan-design-origin/src/StatePresentation.tsx), [Base Empty](../web/mfe-base-origin/src/components/Empty/index.tsx) | [Presentation tests](../packages/ratan-design-origin/tests/presentation.test.tsx), [State stories](../packages/ratan-design-origin/stories/StatePresentation.stories.tsx) |
| Pickers | [Dates](../packages/ratan-design-origin/src/dates.tsx), [Base DatePicker](../web/mfe-base-origin/src/components/DatePicker/index.tsx) | [Dates tests](../packages/ratan-design-origin/tests/dates.test.tsx), [Range tests](../packages/ratan-design-origin/tests/date-range.test.tsx), [Dates stories](../packages/ratan-design-origin/stories/Dates.stories.tsx) |
| Appearance/compatibility | [Provider](../packages/ratan-design-origin/src/Provider.tsx), [Base theme](../web/mfe-base-origin/src/theme/index.tsx) | [Theme tests](../packages/ratan-design-origin/tests/theme.test.tsx), [Portal tests](../packages/ratan-design-origin/tests/portal-theme.test.ts), [Base-compat tests](../packages/ratan-design-origin/tests/base-compat.test.tsx); catalog toolbar selects appearance |

The compiling [core contracts](../packages/ratan-design-origin/fixtures/consumer/src/contracts.tsx),
[date contracts](../packages/ratan-design-origin/fixtures/consumer/src/dates.tsx)
and [portal contracts](../packages/ratan-design-origin/fixtures/consumer/src/server-portal.tsx)
cover public entry points. Keep examples aligned with them and the package
export map.

## Remaining work: proposed component contracts

The following names describe candidate interfaces. Complete one coherent slice
at a time; do not import these names until their implementation and exports exist.

### A. Adopt existing controls

Begin with direct Button uses in Home, admin Main and Tile. Preserve props,
selectors and click behavior through the existing package-backed Base Button.
Next evaluate Login fields and Survey/Timeout presentation using the recipes
above. Capture existing behavior first; direct MUI and package controls can have
different wrappers, defaults and layout.

For each selected call site, record original/default/named imports, relevant
props/ref/callback behavior and the replacement. A compatible existing Base
adapter counts as package adoption. Completion requires consumer tests and the
affected browser flow, not an import-count reduction.

### B. Autocomplete field

Evidence: [admin Tile](../web/mfe-base-origin/src/admin/Tile/index.tsx) and
[TableDetail Field](../web/mfe-base-origin/src/components/TableDetail/Field.tsx)
compose MUI Autocomplete with package-backed Input. Their data and selection
semantics differ, so the package interface must deal only in presentation data.

| Contract | Proposed behavior |
| --- | --- |
| Inputs | Readonly options with stable string/number value, label and optional disabled state; controlled selected value or null; controlled inputValue; label, labelPosition, placeholder, disabled/readOnly/error/required/helper text. |
| Events | Selection and input-text callbacks preserve event and reason information needed by adapters. Host resolves a selected value to its original record. |
| Composition | Package owns field label/input/popup affordances and their ARIA/ref wiring. Optional option renderer receives presentation data and required list-item attributes. Preserve disableClearable, autoHighlight and explicit portal choice used by current callers. |
| Host mapping | Admin Tile maps category records to options and maps selection back to the original record; its All-category rule, requests and clear/reset effects stay local. TableDetail supplies values/labels and optional image rendering; record updates, boolean conversions, resets and image URL construction remain local. |
| Verification | Keyboard select/Escape, clear versus disableClearable, independent text/selected value, stable selection after option refresh, disabled/readOnly/error states, labeling/ref forwarding and overlay theme. Host tests prove category mapping, clear effects and record editing are unchanged. |

Capture current undefined/empty initialization in the adapter before choosing
the package's controlled-null representation. Do not pass AdminRecord, column
metadata, entitlement tokens or a fetch function into the new component.

### C. Labeled switch

Evidence: [Switch](../web/mfe-base-origin/src/components/Switch/index.tsx) and
[SwitchTime](../web/mfe-base-origin/src/components/SwitchTime/index.tsx) share
switch styling and compose it with labels/icons.

| Contract | Proposed behavior |
| --- | --- |
| Inputs | Controlled checked, disabled, visible label, explicit accessible name where needed, optional decorative icon, size, input attributes/ref and root className. |
| Event | onChange receives the event and next checked value; the host chooses its meaning. |
| Package state | Only ordinary switch interaction and visual states; no clock or persisted preference. |
| Host mapping | Theme/UTC-local conversion, time display, analytics, storage, document classes and layout flags remain in Base. Preserve both legacy and new-layout wrappers without a package dependency on Base theme extensions. |
| Verification | Keyboard Space and focus, one change callback per activation, checked/disabled semantics, label association, both design generations/modes and host selector compatibility. |

### D. Icon action

Evidence: [SurveyButton](../web/mfe-base-origin/src/components/SurveyButton/index.tsx),
[CopyText](../web/mfe-base-origin/src/admin/common/CopyText/index.tsx) and
[workspace actions](../web/mfe-base-origin/src/components/TabItem/index.tsx).

| Contract | Proposed behavior |
| --- | --- |
| Inputs | Icon node, required accessible name, optional tooltip, disabled, size/color, normal button attributes, className and button ref. |
| Event | Normal click event callback; no clipboard, navigation, popup or workspace service in the component. |
| Composition | IconButton plus optional tooltip, with a deliberate disabled-tooltip wrapper and visible keyboard focus. Icons remain caller-supplied; no package-wide icon facade is required. |
| Host mapping | CopyText binds its value to the existing callback; SurveyButton supplies popup behavior; TabItem binds the current workspace and refresh/remove callback. |
| Verification | Accessible name, Enter/Space activation, disabled activation prevention, tooltip behavior for pointer/focus, ref target and unchanged host IDs/callback arguments. |

Cards, general tabs and grids remain deferred. Tile's theme dependency might be
removed behind a reusable action card, but first establish another meaningful
use and a common contract. A generic grid must not expose AdminRecord verification
or save/deactivate behavior. Workspace TabPanel lifecycle remains in Base even
if a general tab presentation is later introduced.

## Implementing and verifying a slice

1. Specify the selected public contract and host mapping. Review business
   dependencies on both sides; consult the audit for deliberately retained code.
2. Run GitNexus impact before editing existing symbols, report callers/processes
   and risk, and warn on HIGH/CRITICAL results. Capture observable behavior in a
   focused failing test before implementing a missing component.
3. Add the package implementation, public types/export, behavior tests and story.
   Render it using plain fixture values and callbacks without Base providers.
   Keep optional integrations outside core and use package theme/tokens.
4. Adapt the selected Base consumers. Preserve old exported names, defaults,
   callback arguments, refs, selectors and test IDs. Retain host business logic.
5. Run the focused tests while iterating, then the affected gates below. Update
   this status table, the inventory and implementation contract with actual
   outcomes. Follow the release policy for public interface/changelog changes.
6. Run GitNexus change detection and commit only the verified slice. Record
   failures explicitly; do not treat historical pass counts as current proof.

From `scb-next`, package implementation changes use:

```bash
npm run test --workspace ratan-design-origin -- --maxWorkers=2
npm run typecheck --workspace ratan-design-origin
npm run lint --workspace ratan-design-origin
npm run build:packages
npm run build:storybook --workspace ratan-design-origin
npm run verify:package --workspace ratan-design-origin
npm run verify:dependency-isolation
```

For affected Base adoption, run its focused tests and required workspace gates:

```bash
npm run test --workspace @fm/base-origin -- --maxWorkers=2
npm run typecheck --workspace @fm/base-origin
npm run lint --workspace @fm/base-origin
npm run build --workspace @fm/base-origin
npm exec -- playwright test tests/e2e/design-origin-host.spec.ts
```

The host Playwright gate uses the configured SCB development stack at port 8001
and development login fixtures. Verify login → New Tile → tile rendering →
workspace-tab removal; also exercise the changed field/action/dialog. Check
legacy/WebKit light/dark, narrow/wide layouts and relevant focus/disabled/error/
loading states. Run affected remote adapter gates when a shared public contract
changes. Use the [release runbook](UI_PACKAGE_RELEASE.md) for the full rollout.

For rollback, restore the prior coherent package/adapter revision in a clean
checkout, rebuild and run the same affected gates. Keep package CSS/assets with
their matching implementation. Do not reset unrelated local work or remove
legacy exports as part of an ordinary adoption.

## Guide verification record

This guide changes documentation only. The TSX recipes are checked against the
current source exports; linked contract fixtures remain the packed-consumer
proof used during package release. Verification on 2026-09-24:

- All six TSX recipe blocks were extracted into temporary modules and passed
  strict TypeScript checking with `tsc --noEmit`, Bundler resolution and paths
  to the current core/dates source entry points. Temporary files were removed.
- From the package directory, `../../node_modules/.bin/vitest run --maxWorkers=2`
  passed all 12 test files / 112 tests, including public documentation tests.
- All 55 local links in this guide resolved to existing files.

This run did not repeat token-script tests, coverage, builds, packed installation
or browser gates. Run the relevant implementation/release gates above when
changing code. Candidate names above remain unimplemented.

# Base and Ratan Design component audit

Audit date: 2026-09-24. This source audit supports the revised
[migration guide plan](BASE_UI_MIGRATION_GUIDE_PLAN.md). Its unit of review is a
reusable control or composition of primitives. Pages and business features stay
in Base and consume those components as useful.

## Current package

An import scan of all 54 TypeScript source files under
`packages/ratan-design-origin/src` found no relative imports leaving that source
tree and no imports of Base, its stores, services, router, domain models or
analytics. External dependency families were React, Emotion, MUI material/icons,
MUI X and Dayjs. Inspection of the provider, appearance resolution, dialog,
builder, state presentation, compatibility adapters and portal theme found no
obvious business execution dependency. This conclusion concerns the reviewed
source; it is not a full behavioral or security certification.

| Existing surface | Observed contract | Assessment and guide treatment |
| --- | --- | --- |
| [Provider](../packages/ratan-design-origin/src/Provider.tsx) and [appearance](../packages/ratan-design-origin/src/appearance.ts) | Receives mode, design generation and optional theme; owns a scoped overlay root | Appropriate package ownership. Base selects appearance from application state and persists it. |
| [Input](../packages/ratan-design-origin/src/Input.tsx), Select and action controls | Values, callbacks, field state, labels and styling come through props | Keep the current reusable controls. Internal MUI primitives do not each need their own public wrapper. |
| [SearchConditionContainer](../packages/ratan-design-origin/src/SearchConditionContainer.tsx) and [BuilderButton](../packages/ratan-design-origin/src/BuilderButton.tsx) | Own collapse measurement, focus and tab relationships; accept content and interaction callbacks | UI interaction belongs here. DOM measurement is not a business dependency. Builder's fixed Table/Filters vocabulary is a specialized UI contract; document it without adding query services or domain rules. |
| [Dialog](../packages/ratan-design-origin/src/Dialog.tsx) and [state presentation](../packages/ratan-design-origin/src/StatePresentation.tsx) | Receive open state, content, actions, callbacks and presentation slots | Good examples of the desired granularity. Workspace lookup, support routing, error capture and loading dispatch remain in Base. |
| [Dates](../packages/ratan-design-origin/src/dates.tsx) and [range](../packages/ratan-design-origin/src/date-range.tsx) | Picker values and callbacks with optional integration dependencies | Reusable controls. Locale, timezone policy and Pro license initialization remain host inputs/responsibilities. |
| [Legacy dialog title](../packages/ratan-design-origin/src/DialogTitle.tsx) and [compatibility exports](../packages/ratan-design-origin/src/compatibility.ts) | Render resize/close controls from flags and callbacks; preserve selectors and styles | Legacy visual compatibility, without workspace decisions. Preserve the existing interface; avoid expanding it into a portal controller. |
| [Base compatibility](../packages/ratan-design-origin/src/base-compat.tsx) | Preserves namespace shapes, loading defaults and portal/sizing behavior | Consumer-specific UI adaptation, not business orchestration. Keep it explicitly transitional. Its Time renderer only stringifies a value; it does not replace Base's Time policy. |
| [Portal theme](../packages/ratan-design-origin/src/portal-theme.ts) and [login tokens](../packages/ratan-design-origin/src/portal-theme/common.ts) | Expose LoginPage layout values, historical shell theme keys, layout flags and document reset policy | Existing page-specific visual coupling. This is not authentication/business logic, but it is outside the general reusable catalog. Preserve compatibility and keep these exports opt-in; do not use them as the model for new page abstractions. Any relocation needs a separate compatibility review. |

The package's pure controls and composed presentation do not currently need a
business-logic extraction based on this audit. The guide needs clearer treatment
of legacy visual contracts, especially the distinction between `base-compat.Time`
and Base `Time`, and the difference between core themes and portal-wide resets.

## Base components still under consideration

| Surface inspected | Dependency evidence | Disposition |
| --- | --- | --- |
| [Login](../web/mfe-base-origin/src/pages/Login/index.tsx) and [Home](../web/mfe-base-origin/src/pages/Home/index.tsx) | Compose fields/buttons/tabs with login and workspace controllers | Keep both pages in Base. Review individual uses of existing Input/Button/LoadingButton. Preserve page layout and controller behavior. |
| [Switch](../web/mfe-base-origin/src/components/Switch/common/useController.ts) and [SwitchTime](../web/mfe-base-origin/src/components/SwitchTime/common/useController.ts) | Read Base store; dispatch mode/timezone changes; write storage, mutate host classes and emit analytics; time control owns a clock | Candidate: a labeled switch taking checked, label, disabled, icon and change callback. Keep all listed policy in Base. |
| [TableDetail field](../web/mfe-base-origin/src/components/TableDetail/Field.tsx) and [admin Tile](../web/mfe-base-origin/src/admin/Tile/index.tsx) | Repeat Autocomplete + Input; field controller reads AdminRecord/column metadata and constructs image URLs | Candidate: a composed autocomplete field. Host supplies resolved options, selection, label, option rendering and handlers. Keep record conversion, option fetching and image URL policy in Base. |
| [SurveyButton](../web/mfe-base-origin/src/components/SurveyButton/index.tsx), [CopyText](../web/mfe-base-origin/src/admin/common/CopyText/index.tsx), [TabItem](../web/mfe-base-origin/src/components/TabItem/index.tsx) | Repeat icon actions; consumers supply survey, copy and workspace operations | Candidate: an accessible icon action with optional tooltip. Domain callbacks remain at the call site. |
| [Tile](../web/mfe-base-origin/src/components/Tile/index.tsx) | Mostly title/subtitle/image/disabled/action presentation, but reads Base theme context | Possible action-card candidate. First demonstrate a useful shared contract; pass appearance through package theme or explicit presentation props. Tile launch/positioning stays in Base. |
| [Avatar](../web/mfe-base-origin/src/components/Avatar/index.tsx) and [Profile](../web/mfe-base-origin/src/components/Profile/index.tsx) | Build identity-specific image URLs; read user/session data and entitlements; interpret RATAN_DATA_ENTITLEMENT | Retain feature components. Do not introduce package APIs that accept Base User, Entity or Subject records. A reusable menu/card can be considered separately if another use supports it. |
| [Drawer types](../web/mfe-base-origin/src/components/Drawer/common/interface.ts), NewTile and AppBar | Depend on Tiles/Container records and portal navigation/state | Retain portal composition and controls. Adopting a Button or icon action does not require moving the whole shell. |
| [TabItem](../web/mfe-base-origin/src/components/TabItem/index.tsx) and [TabPanel](../web/mfe-base-origin/src/components/TabPanel/index.tsx) | Workspace editing/removal/refresh callbacks and cached remote activation through setTabPanel | Retain lifecycle and workspace semantics. A general tab UI may be evaluated later; Builder tabs do not establish compatibility with workspace tabs. |
| [Table contract](../web/mfe-base-origin/src/components/Table/common/interface.ts) and [field controller](../web/mfe-base-origin/src/components/TableDetail/common/Field.useController.tsx) | AdminRecord, verification/deactivation/save operations, record-derived editing state | Keep Table/TableDetail and admin workflow in Base. A reusable grid must have an independently justified row/column/selection interface; it is not assumed necessary in this migration. |
| [Time](../web/mfe-base-origin/src/components/Time/index.tsx) and [controller](../web/mfe-base-origin/src/components/Time/common/useController.ts) | Uses store.timeType, date heuristics and excluded Trade_Id/Package_Id fields | Retain this implementation in Base. Passing a field name into the package would carry domain policy across the seam. Consider pure date display only if there is an independent need. |
| [Survey controller](../web/mfe-base-origin/src/components/Survey/common/useController.ts) and [Timeout controller](../web/mfe-base-origin/src/components/Timeout/common/useController.ts) | Logout/relogin services, token expiry, timers, dispatch and analytics | Retain workflow. Existing Dialog and action controls can supply presentation without knowing why the dialog is open. |
| [Base Dialog controller](../web/mfe-base-origin/src/components/Dialog/common/useController.ts) | Reads workspace state, manages host DOM and emits analytics | Keep the current adapter seam. Generic dialog presentation is already extracted; moving the controller is not an outstanding migration task. |
| [Empty](../web/mfe-base-origin/src/components/Empty/index.tsx), [FallbackError controller](../web/mfe-base-origin/src/components/FallbackError/common/useController.ts), Splash/ErrorBoundry | Base dispatch, support-address resolution and error capture surround package presentation | Existing separation is appropriate. Local copy, illustration, layout and feature callbacks can remain. |
| [Version](../web/mfe-base-origin/src/components/Version/index.tsx), [ScWebkit](../web/mfe-base-origin/src/components/ScWebkit/index.tsx) and ReactWrapper | Environment lookup or custom-element registration/browser integration | Retain integrations. A local MUI or custom-element import alone is not a reason for package extraction. |

## Rules for the next guide and implementation

For an accepted candidate, document the actual shared behavior, its smallest
useful interface, existing consumers, host responsibilities and compatibility
tests. The component may own selection, focus, expansion, loading display or
overlay state. It must not fetch application data, choose permissions, translate
business field names, manage sessions, or know Base route/workspace models.

Review both imports and semantics. A dependency scan cannot catch hardcoded
business decisions or a public interface that accepts domain records. Conversely,
DOM references used for measuring or focusing UI are not evidence of business
coupling. Tests for a new component should render it with plain fixture values
and event callbacks, without constructing Base providers or services.

Prioritize adoption of existing package controls, then the demonstrated missing
compositions: autocomplete field, labeled switch and icon action. Cards, general
tabs and grids remain candidates requiring justification. Page and feature
retention is an intentional end state. There is no zero-MUI-import target.

## Verification and limits

The source dependency scan and manual interface/controller inspection informed
this audit. GitNexus query returned no relevant execution flows for the package,
so these findings use direct source evidence rather than graph impact claims.
No implementation symbols were edited.

From `scb-next/packages/ratan-design-origin`, the existing focused suites ran:

```bash
../../node_modules/.bin/vitest run tests/theme.test.tsx tests/base-compat.test.tsx tests/portal-theme.test.ts tests/presentation.test.tsx tests/dialog.test.tsx tests/builder.test.tsx --maxWorkers=2
```

Result: **6 files, 45 tests passed**. These corroborate provider, dialog, state,
builder and compatibility contracts; they do not by themselves prove the
absence of business dependencies. Full application/browser gates were not run
for this documentation-only audit. Run the affected gates when implementing
each selected component or adoption change.

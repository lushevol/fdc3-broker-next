# UI Package Migration Inventory

The maintained package is `packages/ratan-design-origin` (candidate 0.1.0).
Base keeps compatible namespace/default paths; Ratan/Cashflow keep `@fm/base`
compatibility resolution. Business screens need no import or prop changes.

The existing entries remain supported. New consumers can use the 30 direct
component/provider/appearance paths documented in the package README, for example
`ratan-design-origin/button` and `ratan-design-origin/date-picker`, to avoid
compiling unrelated package modules. Root named imports still remove unused
runtime code from production bundles. CSS/fonts require an explicit stylesheet
import; producer package builds emit every supported module for distribution.

| Original surface | Maintained presentation | Host responsibility |
| --- | --- | --- |
| Theme controls/tokens and CSS aliases | Core/theme/tokens/compatibility entries | Auth-based mode, persistence, document classes, explicit CSS loading |
| Config, light/dark/common/normalize/scroll | Optional portal-theme entry | URL flags and explicit global CssBaseline policy; Ratan retains its palette-only theme |
| Button, LoadingButton, Input, Select | Core named exports | Consumer primary-type translation and 16px startIcon default |
| SearchInput, SearchButton, ResetButton, ToggleButton, Label | Core named exports | Screen state, query execution and analytics |
| SearchGrid, SearchCondition, SearchConditionContainer | Core named exports | Criteria values, removal and expansion policy |
| BuilderButton and its tabs/panel | Core named exports | Controlled anchor, selected tab and filter content |
| Loader, PageLoader, Snackbar | Core named exports; Spinner primitive for consumer Loader | Application loading/notification orchestration; Base-only sanitized HTML compatibility |
| DatePicker, DateTimePicker, TimePicker | dates entry | Localization, locale/timezone, validation and application values |
| DateRangePicker | Optional Pro date-range entry | Same date policy plus Pro licensing/initialization |
| Dialog and legacy root/title styles | Core Dialog; compatibility root/title | Workspace lookup, drag, resizing, maximize, stacking, sizing, telemetry |
| Empty | EmptyState | Workspace copy/illustration/layout, loading dispatch, drawer action and telemetry |
| FallbackError | ErrorFallback | Support-address selection, portal copy, mailto construction and captured error |
| Splash | LoadingOverlay | Existing copy/root viewport sizing and error boundary |

The catalog at `packages/ratan-design-origin/stories` covers controls, search/
builder composition, date integrations, notifications/loaders, Dialog and the
three state presentations. Its toolbar selects legacy/WebKit and light/dark.
Base's retained stories continue to exercise compatible exports.

The `compatibility` entry is restricted to the existing Base migration helpers;
it is not a general customization API. Hosts load `styles.css` explicitly. That
stylesheet packages SC Prosper Sans, Open Dyslexic, Inter and Roboto Mono assets;
legacy Poppins remains host-provided. Hosts also own date localization/timezone/
format policy, font redistribution approval and MUI X Pro licensing/initialization.

## Deliberately Retained

| Surface | Disposition and reason |
| --- | --- |
| ErrorBoundry | Keep the existing class-based capture adapter in Base. It stores portal error/support state and renders package ErrorFallback through FallbackError. Consumers retain their app-specific error handling. No new class component was introduced. |
| TabItem | Workspace editing/refresh/removal with Workspace records, curried portal callbacks, layout selection and deliberate name-input blur. It is portal navigation. Generic independently usable tabs already exist in the Builder exports. |
| TabPanel | Calls setTabPanel to coordinate cached remote mounting and activation/visibility. Keep its error capture and application lifecycle in Base. |
| Empty/Splash host styles | Keep the workspace illustration, 100vh/portal-header layout and legacy selectors in host wrappers. These are portal composition, not standalone defaults. |
| AppBar, Avatar/Profile, Drawer/NewTile/Tile, Switch/SwitchTime, Time, Timeout, Survey/SurveyButton, Version | Portal identity, navigation, workspace, session or survey/version policy. Promote a pure piece only when a second use case establishes its contract. |
| Table, TableDetail, admin editors/actions | AdminRecord, verification, deactivate/save and other feature workflows remain feature modules. No generic grid interface is claimed. |
| ScWebkit, ReactWrapper | Explicit browser/custom-element registration and events remain host integrations. Core never registers elements or imports WebKit runtime. A future optional integration needs its own contract and browser validation. |
| Ratan/Cashflow bridges, services, storage and related-app navigation | App compatibility services, not UI-library responsibilities. |

There is one maintained implementation of each promoted presentation. Adapters
retain contracts and host behavior; compatibility entries retain deliberate
legacy selectors/styles. The portal-theme entry intentionally preserves raw
historical visual values and global reset policy instead of redesigning hosts.
New standalone surfaces use core themes and semantic tokens.

See UI_PACKAGE_IMPLEMENTATION.md for specifications, tests and known baseline
limitations; UI_PACKAGE_RELEASE.md defines contribution and rollout policy.

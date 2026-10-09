# UI Package Migration Inventory

The maintained package is `packages/ratan-design-origin` (candidate 0.1.0).
Base keeps compatible namespace/default paths; Ratan/Cashflow keep `@fm/base`
compatibility resolution. Business screens need no import or prop changes.

Use the [migration guide](UI_PACKAGE_MIGRATION_GUIDE.md) for import mappings,
usage recipes and the remaining component candidates. The
[source audit](BASE_UI_COMPONENT_AUDIT.md) explains the business ownership rules.

The [revised implementation plan](BASE_UI_COMPONENT_MIGRATION_PLAN.md) and
[complete MUI import inventory](BASE_MUI_IMPORT_INVENTORY.md) require every Base
MUI UI use to adopt package exports with unchanged portal appearance/behavior.
The table below records shipped presentation; `primitives`, `icons` and
`data-grid` are available. Optional higher-level composition helpers remain
proposals, while [host parity evidence](BASE_UI_PARITY_EVIDENCE.md) covers the
verified surfaces and outstanding checks.

Base keeps its complete appearance implementation and selection policy under
`web/mfe-base-origin/src/new-styles`, including the theme, standalone query
mapping, federated appearance mapping and shell/page adapters. Original public
component paths re-export those adapters. New UI uses the package's supported
controls, primitives, icons, theme APIs and `styles-and-tokens.css`; authentication,
analytics, persistence and workspace lifecycle remain host responsibilities.
See the [Portal specification](../web/mfe-base-origin/docs/NEW_STYLES_SPEC.md).

The existing entries remain supported. New consumers can use the 30 direct
component/provider/appearance paths documented in the package README, for example
`ratan-design-origin/button` and `ratan-design-origin/date-picker`, to avoid
compiling unrelated package modules. Root named imports still remove unused
runtime code from production bundles. CSS/fonts require an explicit stylesheet
import; producer package builds emit every supported module for distribution.

| Original surface | Maintained presentation | Host responsibility |
| --- | --- | --- |
| Theme controls/tokens and CSS aliases | Core/theme/tokens/compatibility entries | Auth-based mode, persistence, document classes, explicit CSS loading |
| Compact business typography and sizing | `tokens`: `compactControlTokens`; WebKit theme overrides | Ant and AG Grid adapters consume the shared SC Prosper roles; hosts retain legacy settings and business row density |
| Scoped and global CSS tokens/fonts | `styles.css`, `tokens.css`, or combined `styles-and-tokens.css` | Choose the required scope; load the combined entry instead of both standalone files when both are needed |
| Config, light/dark/common/normalize/scroll | Optional portal-theme entry | URL flags and explicit global CssBaseline policy; Ratan retains its palette-only theme |
| Button, LoadingButton, Input, Select | Core named exports | Ratan/Cashflow compatibility retains primary-type translation and 16px startIcon defaults; Base Button/LoadingButton directly use core defaults |
| SearchInput, SearchButton, ResetButton, ToggleButton, Label | Core named exports | Screen state, query execution and analytics |
| SearchGrid, SearchCondition, SearchConditionContainer | Core named exports | Criteria values, data removal and query policy; package owns UI collapse/expansion |
| BuilderButton and its tabs/panel | Core named exports | Controlled anchor, selected tab and filter content |
| Loader, PageLoader, Snackbar | Core named exports; Spinner primitive for consumer Loader | Application loading/notification orchestration; Base-only sanitized HTML compatibility |
| DatePicker, DateTimePicker, TimePicker | dates entry | Localization, locale/timezone, validation and application values |
| DateRangePicker | Optional Pro date-range entry | Same date policy plus Pro licensing/initialization |
| Dialog and legacy root/title styles | Core Dialog; compatibility root/title | Workspace lookup, drag, resizing, maximize, stacking, sizing, telemetry |
| Empty | EmptyState | Workspace copy/illustration/layout, loading dispatch, drawer action and telemetry |
| FallbackError | ErrorFallback | Support-address selection, portal copy, mailto construction and captured error |
| Splash | LoadingOverlay | Existing copy/root viewport sizing and error boundary |
| Login layout, raw fields and tabs | `primitives` entry: exact MUI component exports | Base owns page composition, credential state, SSO and layout policy; current DOM/theme selectors are preserved |
| Login field glyphs | `icons` entry: original `PersonOutlined` and `LockOutlined` glyphs | Base chooses which glyph appears with each field |
| Base shell, settings, profile and admin presentation | Curated `primitives`, `icons` and `theme` entries with exact MUI identities | Base retains navigation, identity, state, policy, services and page composition |
| Base grids and date localization | Optional `data-grid` and `dates` entries | Base retains row models, actions, audit workflows, provider placement and license policy |

The [Storybook scenario inventory](../packages/ratan-design-origin/STORYBOOK_COVERAGE.md)
maps 158 stories across 24 files: core controls and patterns, every curated
primitive and icon, dates/ranges, data grids, themes/tokens and legacy
compatibility APIs. Typed playgrounds, variant matrices and interactive local
workflows cover appearance, size, state, content, keyboard and integration axes.
The toolbar selects legacy/WebKit and light/dark. A build check guards public
visual-export coverage; browser checks exercise the catalog and responsive layouts.
Base's retained stories continue to exercise compatible exports.

The `compatibility` entry is restricted to the existing Base migration helpers;
it is not a general customization API. Hosts load `styles.css` explicitly (or
`styles-and-tokens.css` when they also need document-wide tokens). That
stylesheet packages SC Prosper Sans, Open Dyslexic, Inter and Roboto Mono assets;
legacy Poppins remains host-provided. Hosts also own date localization/timezone/
format policy, font redistribution approval and MUI X Pro licensing/initialization.

The [compatibility contract table](../packages/ratan-design-origin/README.md)
records legacy namespace shapes, spinner defaults, forced dialog portals and
string-only Time rendering. These are intentional supported migration contracts.
The [optimization record](UI_PACKAGE_OPTIMIZATION.md) contains reconciliation,
measured work reductions and current validation results. Optional compositions
in the migration plan remain proposals, not new package exports.

## Deliberately Retained

These features remain in Base. All their underlying direct MUI UI imports must
still migrate through Ratan Design; retaining a business feature is not an
exemption from UI adoption. Preserve its appearance and behavior throughout.

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

The optional `ratan-design-origin/compatibility-css` entry exposes `stringCss`
for existing Base class-name generators. It requires the host's declared
`@emotion/css` peer and stays isolated from the core and the other compatibility
entries. New presentation uses package `styled` or component `sx`; this facade
preserves existing string class and tagged-template contracts during the SCB
Webpack/Single-SPA backport.

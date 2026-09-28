# Base UI component migration plan

Status: import adoption implemented 2026-09-28. Login, authenticated shell,
populated admin screens, SSO-only Login, an overflowed workspace and the logout
survey, login-error feedback and session timeout have matched pre-migration
visual and interaction comparisons. Picker, cached-remote and deeper admin states
remain open. This plan covers
`web/mfe-base-origin` adopting reusable presentation from
`packages/ratan-design-origin`. The current evidence is recorded in
[Base UI parity evidence](BASE_UI_PARITY_EVIDENCE.md).

The earlier [guide plan](BASE_UI_MIGRATION_GUIDE_PLAN.md) completed the
documentation stage. This plan turns the [migration guide](UI_PACKAGE_MIGRATION_GUIDE.md)
and [component audit](BASE_UI_COMPONENT_AUDIT.md) into concrete implementation
slices, rechecked against the current source. The
[inventory](UI_PACKAGE_INVENTORY.md) remains the record of shipped ownership.
The curated primitive, icon, theme and data-grid entries are available. The
higher-level LabeledSwitch, AutocompleteField and IconAction ideas below remain
optional proposals; exact package re-exports currently preserve their Base
compositions without moving business policy into the package.

Scope clarification: every direct MUI UI use in Base must migrate through
Ratan Design, including layout, typography, icons, shell surfaces and data grids.
The finished portal must look and behave the same. This replaces the earlier
plan's permission to retain direct MUI imports in those areas.

## Target and ownership

Base pages must obtain all currently MUI-supplied UI from Ratan Design, directly
or through compatible Base adapters. This includes fields, actions, dialogs,
switches, feedback, layouts, typography, icons, menus, tabs, cards and grids.
Login and Home remain Base pages. Their page layouts and feature compositions
do not become design-package exports.

The preferred migration unit is a useful component: for example, a field with
its label/adornments/validation display or an icon action with tooltip behavior.
Where Base still composes MUI primitives, provide curated package exports for
the actual primitives it uses. A behavior-preserving re-export is appropriate;
there is no need to invent a new wrapper, redesign a primitive or move a page
into the package simply to change its import owner.

**No logic with business dependencies belongs in Ratan Design.**

| Ratan Design owns | Base owns |
| --- | --- |
| Reusable rendering, tokens, visual states and accessibility | Page layout, product copy, illustrations and feature composition |
| Field values/options received through props and validation display | Validation rules, fetching, record conversion and form submission |
| Focus, keyboard navigation, selection UI, expansion and overlays | Authentication, entitlements, routing, session renewal and logout |
| Generic callbacks and component-local presentation state | Stores, services, analytics, persistence, FDC3/OpenFin and remote lifecycle |
| Generic presentation types | User, Workspace, AdminRecord and other domain models |

Package interfaces must not require Base domain records or injected business
services. Base resolves policy into presentation values and ordinary callbacks.
A generic DataGrid may receive opaque `TRow` objects and caller-owned column/
render/event functions, preserving existing row identity; the package must not
import Base record types, interpret their business fields or execute domain
policy. DOM measurement and focus handling are legitimate UI behavior; reading
session storage or deciding entitlements is not.

Completion requires zero direct runtime or type imports/re-exports from `@mui/*`
in Base source, stories and test helpers/tests, and verified visual/interaction
parity. This includes deep paths, barrel imports, dynamic imports and `require`.
The package may continue using MUI internally. Base keeps its MUI/Emotion peer
dependencies where needed for compatible resolution; removing installed MUI is
not required. Build dedupe/noExternal settings are not UI imports.

The only source-level MUI module-name exception is an existing type-only
`declare module "@mui/material/styles"` augmentation that must address MUI's
canonical type identity. Keep Base-specific theme types in Base, source imported
types through Ratan Design, and enforce that this exception emits no runtime
code. It cannot exempt a component, stylesheet helper, icon or grid import.

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
| Missing shared compositions | AutocompleteField, LabeledSwitch and IconAction are absent from current core exports. Repeated Base uses establish their need. | Add one focused interface per composition, then adopt it in the named consumers below. These are not the entire remaining scope. |
| Remaining direct MUI surfaces | Base also imports layout/typography, Tabs/Tab, AppBar/Toolbar, Drawer, Avatar/Menu, cards/accordion/chips, Alert/Tooltip/Paper, icons and DataGrid. | Every such use must consume a package export, even when the containing feature remains Base-owned. See the complete [import inventory](BASE_MUI_IMPORT_INVENTORY.md). |
| Legacy presentation | `compatibility`, `base-compat` and `portal-theme` contain intentional legacy contracts. Portal theme still includes LoginPage visual values; `base-compat.Time` only stringifies a value. | Keep them opt-in/transitional. Do not remove compatible exports or promote login tokens, domain-aware Time, or portal reset policy into core. |
| Host theme integration | [Base theme selection](../web/mfe-base-origin/src/theme/index.tsx) and [provider](../web/mfe-base-origin/src/theme/Provider.tsx) still use host state, MUI ThemeProvider, CssBaseline and localization. Base loads its own WebKit CSS; [Container](../web/mfe-base-origin/src/pages/Home/common/Container.tsx) forwards appearance to remotes. | Test both standalone RatanDesignProvider and the actual Base provider. Do not assume Base already uses RatanDesignProvider or replace the host provider/CSS as an incidental adoption. |

The older [extraction plan](UI_PACKAGE_EXTRACTION_PLAN.md) describes historical
foundation work and is not the current completion baseline. In particular,
MUI 5 alignment and most shared-control extraction are already implemented.
The remaining work is complete call-site adoption, the three demonstrated
compositions, and missing package exports for every other used MUI surface.
The full import audit found 62 production files with MUI imports (54 with runtime
uses and eight using only types), plus tests, stories, the hidden Storybook
provider and MDX examples: 98 source/example files in total. Treat these as a
dated baseline and re-scan at implementation and completion.

## Package coverage for every MUI family

New entry names below are proposed and must be added to package export maps,
declarations, fixtures and tests before adoption. Export only required symbols
with explicit named exports; do not copy the entire MUI catalog or use wildcard
icon exports. Keep the current React/MUI/Emotion versions and component identity.

| Current imports | Package destination | Preservation requirement |
| --- | --- | --- |
| Button, TextField, Autocomplete, Switch, IconButton and dialog compositions | Existing core controls and proposed AutocompleteField/LabeledSwitch/IconAction; compatibility export where an existing core default cannot reproduce the current use | Preserve DOM, props, refs, default sizes, label behavior, loading and event semantics. A package component with the same name is not automatically equivalent. |
| Box, Grid, Stack, Typography, Divider | Proposed `ratan-design-origin/primitives` | Preserve Grid breakpoints/gutters, component/as polymorphism, text metrics, `sx`, refs and inherited MUI class names. Base still decides page composition. |
| Tabs/Tab, AppBar/Toolbar, Drawer, Menu/MenuItem, Avatar, Card/CardContent/CardMedia, Chip, Accordion/Summary/Details | Proposed `primitives` entry | Curated compatible presentation exports; preserve controlled state, focus, transitions, portals, scroll buttons and retained mounting. Base owns navigation, identity and entitlements. |
| Tooltip, Paper, Alert, FormControl/FormLabel/InputLabel/InputAdornment, remaining dialog subcomponents | Composed core controls where appropriate; proposed `primitives` for remaining presentation uses | Preserve DOM/heading semantics and layout. Do not force a composition that changes the portal just to remove imports. |
| Every `@mui/icons-material` import, including barrel aliases | Proposed `ratan-design-origin/icons` | Re-export the same used glyphs with their props/refs/viewBox and inherited sizing. No substitutions or new icon set. |
| styled/useTheme/ThemeProvider and theme utilities/types | Extend existing `theme`; explicit CssBaseline export in `portal-theme` | Preserve provider order, Emotion insertion, theme object, component overrides and document reset. Host still selects theme and explicitly applies baseline CSS. |
| DataGrid, GridActionsCellItem and grid types | Proposed optional `ratan-design-origin/data-grid` | Preserve MUI X 6 generic types, apiRef, virtualization, row IDs, columns, events and grid-action keyboard semantics; no AdminRecord or workflow helpers in the package. Keep MUI X outside core. |
| LocalizationProvider/AdapterDayjs and community/Pro date imports | Existing `dates` and `date-range`, extended only if needed | Preserve nested provider structure, locale, formats and adapter identity; do not remove a provider as an incidental import cleanup. Licensing stays host-owned. |
| MUI types in interfaces, tests, fixtures and stories | Relevant package entry above | Re-export precise types so signatures remain compatible. Update mocks and examples to package imports; retain existing behavioral assertions. |

The [file-level inventory](BASE_MUI_IMPORT_INVENTORY.md) is the implementation
checklist. Each row must acquire a destination, parity evidence and completed
status. A feature being retained in Base never closes its MUI adoption rows.
All visible native markup, custom CSS and host-integrated WebKit surfaces must
also remain visually unchanged; this does not relocate their business owners.

## Implementation sequence

Each slice ends with captured behavior, verified source changes, documentation
updates and its own commit. The order prioritizes existing exports before new
public interfaces. Slice 0 precedes source work. Add the needed support exports
within each consuming slice; keep ownership of overlapping files explicit.

### 0. Capture contracts and establish the baseline

- Record all imports from the inventory, exported/default shapes, props, callback arguments,
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
- Capture stable before-migration screenshots and interaction expectations of
  the real Base portal as specified below. This is required before changing UI;
  package Storybook screenshots alone are not the reference.

Exit: a small contract checklist for each slice and a reproducible baseline.
No broad architectural rewrite is required to start.

### 1. Adopt existing fields and actions

| Consumer | Change | Behavior that remains in Base / must survive |
| --- | --- | --- |
| [Login](../web/mfe-base-origin/src/pages/Login/index.tsx) | Completed: use exact TextField/layout/tab exports from `primitives` and original glyphs from `icons`. Existing Input changes wrapper and label behavior here, so substituting it requires separate parity evidence. Existing sign-in/SSO LoadingButtons already use the package. | Username trimming, password handling, Enter behavior, loading, SSO URL and visibility policy; placeholders, adornments, test IDs, accessible label association, medium sizing and page CSS. Preserve the current unforced focus state. |
| [Home](../web/mfe-base-origin/src/pages/Home/index.tsx) | Adopt Button for Add Workspace. | Workspace creation, accessible name, class and test ID, tab positioning and both layout branches. |
| [Tile](../web/mfe-base-origin/src/components/Tile/index.tsx) | Adopt Button inside the existing card. | Disabled behavior and click bubbling: launch must happen once. Theme-dependent card composition and launch policy stay local. |
| [Admin Main](../web/mfe-base-origin/src/admin/common/Main/index.tsx) | Adopt Button for ordinary actions. | Permissions, create/save workflows and DataGrid stay local. |
| [TabItem](../web/mfe-base-origin/src/components/TabItem/index.tsx) | Adopt Input for the standard, unlabeled workspace-name field after confirming DOM/style equivalence. | `edit-${item.id}` input ID, root test ID, Workspace Name accessibility, curried edit handler and deliberate click-to-blur behavior. No package Workspace prop. |

Use the existing Input interface first. If its label/style defaults obstruct a
consumer, identify the exact shared contract gap and test a minimal general
extension or package compatibility export; do not add a `login` or `workspace`
mode. A parity mismatch blocks that adoption row; it is not permission to
leave a direct MUI import in the completed migration.

Exit: these consumers use the existing catalog with their page/controllers and
public Base paths intact. No LoginPage, HomePage or authentication-form export.

Every Base call site in this slice now imports through Ratan Design. Login's
eight captured desktop/mobile, legacy/WebKit and old/new-layout screenshots
match the pre-migration portal pixel for pixel. A Base shell browser check covers
login, tile drawer, tile selection, workspace creation and tab removal. Wider
screen-state comparison remains a separate exit condition.

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
tooltip wrapper that does not change the ref target or event behavior. Existing
focus/hover visuals and hit areas must match the captured Base baseline; a new
package default must not silently redesign them.

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
Keep DataGrid's GridActionsCellItem behavior through the proposed package
`data-grid` entry; do not substitute IconAction for its grid-specific keyboard
and menu semantics.

Exit: all six consumers use package-owned actions with matching contracts;
use a package compatibility export if the composition cannot preserve a case.
Tests cover accessible name,
Enter/Space, disabled activation, tooltip on pointer/focus, refs and host events.

### 6. Migrate the remaining layouts, shell and feature presentation

Add the required `primitives` and `icons` exports and migrate every remaining
runtime UI import in these consumers, including their `common/style.ts` files:

| Base consumers | Required adoption |
| --- | --- |
| Login, Login TabPanel, Home and Drawer menu items | Box/Grid/Stack/Typography/Divider, Tabs/Tab, adornments/labels and icons. Keep the workspace TabPanel controller; changing the Tabs import must not affect cached remotes. |
| AppBar, Drawer, Drawer Menu, NewTile and Tile | AppBar/Toolbar/Drawer, layout and action presentation. Preserve anchors, drawer width, overlay/backdrop, header geometry and tile hit areas. |
| Avatar/Profile | Avatar/Menu/MenuItem, Card/CardContent/CardMedia, Chip, Accordion/Summary/Details, Tooltip, layout, typography and icons. Profile entitlement/identity decisions remain local. |
| Dialog's Draggable wrapper, Survey, Timeout and Version | Paper, any remaining dialog subcomponents, Alert, typography/layout and icons. Preserve drag/resize, z-index, modal semantics and version-alert appearance. |
| Admin Category/ImportMap/Tile/Main/Actions/Status/CopyText and TableDetail renderers | Layout, tooltips, menu items, status glyphs and action icons. Migrate UI constructed inside controllers/render callbacks too. |
| Empty, FallbackError, Splash, Switch/SwitchTime and routing styles | Remaining icons/layout/styling imports. Existing assets, copy, dimensions and host behavior stay unchanged. |

Exact component re-exports preserve MUI classes and `muiName` more safely than
unnecessary wrapper elements. Verify this with the existing host CSS, theme
overrides and refs; preserve polymorphic types as well as rendering. All used
glyphs must come through `icons`, even where IconAction receives a caller icon.

Exit: no remaining runtime MUI UI imports outside the separately tracked grid
and theme/date integration slices; before/after screenshots and interactions
pass for every touched surface. Custom ActionCard/ProfileCard/navigation-page
abstractions remain optional; adoption of their underlying primitives is required.

### 7. Migrate data-grid presentation without moving admin workflows

Add the optional `data-grid` entry for the exact DataGrid, GridActionsCellItem,
hooks/constants and types present in the inventory. Migrate components/Table,
admin/common/Main, admin/common/Actions and the grid types in audit/field
controllers/interfaces. Preserve the same MUI X peer version and generic public
types; Base supplies its own rows, column definitions, action callbacks and
record mappings. The package must never import Base AdminRecord or services.

Test density/row heights, headers, column widths, sorting/filtering, selection,
pagination, scrolling/virtualization, focus/keyboard navigation, menus and edit
flows. Verify verify/deactivate/save callbacks and permission-based actions in
Base. A library re-export does not excuse skipping these integration checks.

Exit: every Base MUI X grid import uses `data-grid`, admin behavior/screens match
the baseline, and core still installs/builds without optional MUI X packages.

### 8. Complete theme, localization, type and development-use adoption

Route Base `styled`, `useTheme`, ThemeProvider and imported theme/types through
the package; route explicit CssBaseline through `primitives`. Update every
local styled wrapper while preserving its selectors and theme logic. Re-export
the same underlying helpers so existing MUI theme augmentation and Emotion
resolution continue to work. Leave host-only augmentations in Base.

Route both App.tsx's current Pro localization imports and theme/Provider.tsx's
community imports through the appropriate package date entry, preserving the
actual provider nesting and locale/format behavior. Keep theme/store selection,
URL flags, document classes and explicit CSS loading in Base. Do not switch to
RatanDesignProvider, reorder global CSS, regenerate tokens, change fonts or
upgrade MUI as an incidental part of changing imports.

Migrate imports in stories, Storybook preview, test setup, tests and executable
documentation examples. Broader story-only controls must receive package exports
or use an equivalent existing composition with parity evidence; do not delete
stories/tests to achieve a zero count. Update test mocks to the public entry
without weakening their assertions. Keep config dependency/dedupe strings and
the narrowly allowed ambient type declaration distinct from runtime imports.

Exit: every UI import in the inventory, including type-only and development
uses, resolves through package exports. Standalone fixtures and Base/remote
themes retain their current rendering and dependency identity.

### 9. Close the inventory and prevent regressions

- Re-scan all Base source, stories and test files and reconcile every inventory
  row. Require zero direct `@mui/*` runtime/type imports or re-exports. Add an
  AST-based architectural check plus restricted-import lint rules covering
  root/deep paths, aliases, export-from, dynamic import and require. The type-only
  ambient module declaration is the sole source exception, not an import bypass.
- Add focused architecture checks for forbidden package-to-application imports,
  application aliases and unexpected dependencies. Review public types/defaults
  manually for domain leakage that an import check cannot detect.
- Keep `dates`, Pro `date-range`, `portal-theme` and compatibility entries
  separate. Core must not acquire MUI X licensing or WebKit browser registration.
- Update the inventory, migration-guide status, package README, implementation
  record and changelog to describe actual exports and actual adoption. Keep
  existing `@fm/base` export/default shapes and downstream feature imports.
- Record final visual/interaction evidence, type-declaration/config exceptions
  and remaining optional higher-level abstractions. A broken/missing comparison
  or a remaining direct MUI component import means the migration is incomplete.

## Deliberately retained or deferred

| Surface | Final disposition for this migration |
| --- | --- |
| Login/Home, AppBar, Drawer/NewTile, Avatar/Profile | Retain page/shell/identity composition in Base; all underlying MUI presentation imports migrate through package exports. |
| TabItem/TabPanel and Home Container | Keep workspace semantics, editing, mounting, caching and activation local. Adopt Input/IconAction or exact package-compatible primitives, plus package Tabs/Tab; do not substitute Builder tabs. |
| Table/TableDetail, admin editors/actions/status | Retain domain controllers, permission checks, verification/deactivate/save and status meaning. All fields/actions and generic grid presentation/types come from the package. |
| Time, Timeout, Survey, Version | Keep time-field heuristics, session/survey/version policy in Base. Base Time is not replaced with `base-compat.Time`. |
| Empty/FallbackError/Splash/ErrorBoundry | Keep existing host wrappers, support lookup, capture, illustrations, copy and layout; presentation is already packaged. |
| ScWebkit/ReactWrapper and platform bridges | Keep custom-element registration, browser integration, services and related-app navigation local. |
| New ActionCard, navigation-tab controller or domain-neutral profile abstractions | Optional future composition work. Required Card/Tabs/Menu/Accordion/DataGrid package exports and Base adoption are in scope now. |

"Retained in Base" describes feature ownership, never permission to retain its
direct MUI UI imports. Pages still compose package-owned building blocks.

## Required proof of unchanged UI and UX

Capture reference screenshots from the pre-migration Base worktree before
implementation, preserving any user edits already present. Record the source
commit and local-diff fingerprint, fixture data, URL flags, appearance, viewport,
browser/OS, device scale and font assets. Re-run after each slice against exactly
the same inputs. Do not use newly generated package stories as the old portal
baseline.

Create a Base host visual-regression suite; the current host test is a functional
smoke and takes no comparison screenshots. Existing packed-consumer screenshots
cover isolated controls, and Storybook accessibility checks do not prove portal
equivalence. `mui5-compatibility.spec.ts` also saves screenshots with
`page.screenshot()` but does not compare them. Add actual `toHaveScreenshot`
assertions against the pre-migration references. Keep existing gates, and add
the following host coverage:

| Surface | Required captured states and interactions |
| --- | --- |
| Login | Ordinary and SSO-only modes; empty, populated, invalid and loading fields; pointer/keyboard focus; Enter submission. Preserve hero assets, labels, spacing and the current unforced focus state. |
| Home and navigation | Empty and populated workspace, long/overflowing tabs, rename, add/refresh/remove, cached inactive remotes, scroll buttons; header and background geometry. |
| New Tile/Drawer | Open/closed drawer, category/menu selection, hover/focus/disabled tiles, launch once, backdrop/Escape and restored focus. |
| Avatar/Profile | Menu open, profile dialog, avatar fallback/image, chips and entitlement groups, expanded/collapsed accordion, logout actions. |
| Survey/Timeout/standard and draggable dialogs | Title/content/actions, autofocus, loading/disabled, close restrictions, focus trap/return, portals/stacking, drag/resize/maximize and backdrop. |
| Admin grids and editors | All reachable Category/Tile/ImportMap screens, populated/empty/loading/error grids, headers/density/scroll, sorting/filtering/selection, action menus and edit/verify/deactivate/save; autocomplete listbox and selected/cleared values. |
| Shared feedback and settings | Toast/error/empty/loading/version states, enabled/disabled controls, tooltips, theme switch, time switch and picker popups where reachable. |

For authenticated states, cover every supported combination of legacy/WebKit,
light/dark and old/new layout. Preserve existing host capture sizes 390×844 and
1440×900, add 768×1024 and 1280×900, and check breakpoint boundaries affected by
changed layout helpers. Keep device scale fixed.
Assert the actual resolved appearance and layout, not just query strings. Login
currently forces dark while unauthenticated: cover its reachable generations
and layouts without inventing a light-mode login as a migration requirement.
Document unreachable states with controller evidence instead of silently skipping
them. Existing layout defects are baseline findings, not incidental redesigns.

Use deterministic local API fixtures, fixed clock/locale/timezone and stable
avatar/asset responses; wait for fonts, data and animation settling. Set up
fixtures in the SCB Vite host's existing dev-mock layer, not remote production
services. Existing default empty API responses do not prove populated admin
screens work: add explicit category/tile/import-map rows, audit history, profile
entitlements/photos, permission variants, loading/errors and session-expiry/
renewal/logout fixtures. Assert these expected records are visible so an empty
screen cannot falsely pass. Mask only a documented irreducible changing value,
never an entire
component, text block, grid or overlay that could hide a regression.

Require zero unexplained screenshot differences. Use zero differing pixels in
the pinned environment where rendering is deterministic; any unavoidable
rasterization tolerance must be narrowly documented and established on repeated
unchanged-baseline captures before migration. Do not reuse the separate consumer
suite's broad tolerance without proving it is appropriate for Base. Review
before/after/diff images for spacing, fonts, glyphs, colors, borders, shadows,
dimensions, responsive wrapping, clipping, focus rings and overlay placement.

Screenshots must be paired with event/keyboard/focus assertions: identical looks
alone cannot prove unchanged UX. Block completion for new console/hydration
errors, changed click counts, focus order, scroll/keyboard behavior, mount state,
or broken flows. Do not overwrite reference snapshots to make migration failures
pass. Any desired visual/UX change requires separate scope; no unapproved visual
change is an acceptable result of this migration.
Keep before/after/diff artifacts, fixture/config provenance and results for each
slice so the parity decision is reviewable. Missing fixtures, skipped target
tests or uncaptured required states block completion rather than counting as pass.

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

The migration is complete only when all inventoried MUI uses resolve through
Ratan Design, the direct-import guard passes, every new export works independently,
business policy remains in Base, and the full portal visual/interaction matrix
passes with no unexplained differences. Import cleanup alone is not completion.
Retained business features and optional new abstractions do not exempt their
underlying UI from adoption or parity verification.

## Planning verification record

This plan was checked against the current package exports, Base call sites,
controllers, theme integration, manifests, test configuration and earlier audit.
Only documentation is changed by this planning stage. No new component is
claimed as implemented, and no application/browser test pass is claimed here.

The initial planning checks confirmed the source/test/story counts, absence of
the three candidate exports, local links and balanced code fences. The revised
scope adds a full MUI import inventory and host visual/interaction acceptance
matrix. Independent source reviews checked the import coverage and parity gaps.
GitNexus returned unrelated flows for the package/Base query; index refresh did
not complete global registry registration because of filesystem permissions.
These findings therefore rely on current source inspection, not a graph-based
blast-radius claim. No implementation symbol was edited; fresh symbol impact
analysis remains required before implementing the slices.

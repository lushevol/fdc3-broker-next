# Storybook component and scenario coverage

This catalog documents the shipped `ratan-design-origin` APIs. It contains no
authentication, services, application stores, routing, licensing initialization,
or business workflow dependencies. Existing story IDs remain usable.

## Shared scenario dimensions

Ordinary stories inherit the toolbar's **legacy / WebKit × light / dark** appearance.
Provider comparison and token stories intentionally pin a generation or mode to
demonstrate scope and inheritance; their story descriptions explain those overrides.
Use Controls for supported prop combinations and the viewport toolbar for narrow
and wide layouts. Matrix stories make important combinations visible together;
interactive stories expose state changes, submitted values and close reasons.
The catalog covers meaningful combinations rather than an unbounded Cartesian
product of every MUI prop. Date examples use fixed dates to remain reproducible.

| Dimension     | Required coverage where the component supports it                                                    |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| Appearance    | Legacy/WebKit, light/dark, token-driven surfaces, inherited/overridden host theme                    |
| Size/layout   | Small/medium/large, compact/full-width, narrow/wide, wrapping and long content                       |
| State         | Default, hover/focus via interaction, selected, disabled, read-only, required, error, loading, empty |
| Content       | Plain/rich/long text, icons/adornments, helper text, labels and custom slots                         |
| Control       | Controlled and uncontrolled values, change/clear/reset/submit, observable callbacks                  |
| Accessibility | Named controls, label relationships, keyboard activation, focus return, retained/hidden panels       |
| Integration   | Scoped portals, nested providers, host theme, community/Pro opt-in entries, legacy adapters          |

## Catalog navigation and source map

The current built `storybook-static/index.json` contains **158 stories across
24 story files**, plus **17 generated Docs pages**. Validation evidence is recorded below. The seven
original files and their existing IDs remain alongside expanded scenario files.
The singular **Integration** category contains Data grid; **Migration** contains
legacy compatibility contracts.

| Storybook navigation                         | Source file                                                                  | Stories | Main coverage                                                       |
| -------------------------------------------- | ---------------------------------------------------------------------------- | ------: | ------------------------------------------------------------------- |
| Start here/Catalog                           | [Overview.stories.tsx](stories/Overview.stories.tsx)                         |       1 | Catalog navigation and usage guide                                  |
| Components/Actions                           | [Actions.stories.tsx](stories/Actions.stories.tsx)                           |       9 | Core action props, matrices, loading, callbacks and toggles         |
| Components/Fields                            | [Fields.stories.tsx](stories/Fields.stories.tsx)                             |      10 | Core Input/Select/SearchInput/Label form combinations               |
| Patterns/Search                              | [SearchPatterns.stories.tsx](stories/SearchPatterns.stories.tsx)             |       6 | Search criteria, clipping, dismissal and responsive query form      |
| Foundation/Appearance                        | [Appearance.stories.tsx](stories/Appearance.stories.tsx)                     |      11 | Provider inheritance, compact business density, theme factories, tokens, fonts and CSS policy |
| Foundation/Form primitives                   | [FormPrimitives.stories.tsx](stories/FormPrimitives.stories.tsx)             |       7 | MUI fields, autocomplete, selection, switches and actions           |
| Foundation/Icons                             | [Icons.stories.tsx](stories/Icons.stories.tsx)                               |       3 | All 21 icons, sizes/colors, search and accessible actions           |
| Foundation/Layout primitives                 | [LayoutPrimitives.stories.tsx](stories/LayoutPrimitives.stories.tsx)         |       6 | Responsive layouts, surfaces, cards, typography and identity        |
| Foundation/Navigation primitives             | [NavigationPrimitives.stories.tsx](stories/NavigationPrimitives.stories.tsx) |       5 | Shell bar, tabs/panels and accordion state                          |
| Foundation/Overlay primitives                | [OverlayPrimitives.stories.tsx](stories/OverlayPrimitives.stories.tsx)       |       8 | Alerts, tooltip, menu, drawer and modal compositions                |
| Foundation/Primitives                        | [Primitives.stories.tsx](stories/Primitives.stories.tsx)                     |       3 | Retained original fields/tabs, shell and grid examples              |
| Inputs/Date scenarios                        | [DateScenarios.stories.tsx](stories/DateScenarios.stories.tsx)               |      24 | Community/Pro states, limits, formats, locale and all styled roots  |
| Inputs/Dates                                 | [Dates.stories.tsx](stories/Dates.stories.tsx)                               |       2 | Retained original top/left date examples                            |
| Search/Builder                               | [Builder.stories.tsx](stories/Builder.stories.tsx)                           |       1 | Retained original Table builder                                     |
| Search/Builder scenarios                     | [BuilderScenarios.stories.tsx](stories/BuilderScenarios.stories.tsx)         |       7 | Controlled builders, retained panels and independent instances      |
| Feedback/Dialog                              | [Dialog.stories.tsx](stories/Dialog.stories.tsx)                             |       1 | Retained original dialog example                                    |
| Feedback/Dialog scenarios                    | [DialogScenarios.stories.tsx](stories/DialogScenarios.stories.tsx)           |       9 | Sizing, content slots, dismissal and validated form                 |
| Feedback/States                              | [Feedback.stories.tsx](stories/Feedback.stories.tsx)                         |       3 | Retained original notification/page/long-message examples           |
| Feedback/Notification and progress scenarios | [FeedbackScenarios.stories.tsx](stories/FeedbackScenarios.stories.tsx)       |      12 | Notification states, messages, loaders and progress                 |
| Feedback/Presentation                        | [StatePresentation.stories.tsx](stories/StatePresentation.stories.tsx)       |       3 | Retained original empty/error/loading examples                      |
| Feedback/State scenarios                     | [StateScenarios.stories.tsx](stories/StateScenarios.stories.tsx)             |       8 | Empty/error recovery and loading overlay release                    |
| Migration/Compatibility                      | [Compatibility.stories.tsx](stories/Compatibility.stories.tsx)               |       9 | Legacy namespaces, styled roots, classes and alias contracts        |
| Controls/States                              | [Controls.stories.tsx](stories/Controls.stories.tsx)                         |       2 | Retained original core control and action matrices                  |
| Integration/Data grid                        | [DataGrid.stories.tsx](stories/DataGrid.stories.tsx)                         |       8 | Community grid sort/filter/page/select/edit/action/export states    |

Story IDs are resolved from the built index rather than inferred from display
names. The catalog verifier checks public UI export coverage and that story
exports are indexed. Prop types are documented through their component examples;
nonvisual helpers do not need standalone canvases. In particular,
`builderTabProps` is demonstrated with builder tabs, while `builderEmptyStyle`,
`modeStyle`, the search style helpers, `datePickerClasses`/`datePickerStyle`,
`DEFAULT_RATAN_APPEARANCE`/`resolveRatanAppearance`, theme styling utilities and
portal normalize/scroll/token helpers remain their existing documented APIs.
The catalog does not apply historical global scrolling/selection policy or
change document attributes to simulate a host.

## Core components

| Components                               | Variants and scenarios                                                                                                                                                           |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button                                   | Playground; text/outlined/contained × sizes/colors; icons, disabled, link/form actions, full width and long label; click output and ref focus                                    |
| LoadingButton                            | Inline/startIcon, idle/loading/disabled, default/custom spinner sizes, caller icon restoration, submit completion and busy state                                                 |
| SearchButton, ResetButton                | Semantic search/reset styling, loading positions, disabled, sizes, controlled query/apply/reset workflow                                                                         |
| ToggleButton                             | Selected/unselected/disabled, exclusive/multiple selection, vertical/horizontal grouping, labels/icons                                                                           |
| Input                                    | Playground; outlined/filled/standard, top/left labels, sizes, helper/error/required, disabled/read-only, multiline, adornments, slot precedence, native/root refs                |
| Select                                   | Controlled/uncontrolled, empty/placeholder, native/custom/multiple, disabled/error/required, label placement, long options and grouping                                          |
| SearchInput                              | Controlled text, clear action, custom accessible clear label, empty/populated, disabled/read-only, Enter submission                                                              |
| Label, LabelMenuItem                     | Compact controlled selector, label/name overrides, icons/dividers/disabled options                                                                                               |
| SearchGrid                               | Responsive search form, variable field widths, long labels, action placement                                                                                                     |
| SearchCondition                          | Label/value, long values, dismissal and restoration, accessible close                                                                                                            |
| SearchConditionContainer                 | Few/many/wrapping criteria, collapse/expand, retained interactive children, removal, narrow widths, clipped-content keyboard behavior                                            |
| BuilderButton                            | Controlled open/close, size customization, disabled trigger, filters/table composition, apply/reset/cancel and close reasons                                                     |
| BuilderTabs, BuilderTab, BuilderTabPanel | Controlled tab choice, keyboard navigation, inactive panels retain form state, empty results, independent builder instances; builderTabProps relationships                       |
| Dialog                                   | Playground; widths/fullscreen/scroll, title/actions/content, custom/headerless headers, disabled close, Escape/backdrop/close-button callbacks, form submission and focus return |
| Loader                                   | Text/no-text, sizes, custom accessible name, inline/section loading, reduced-motion semantics                                                                                    |
| PageLoader                               | Whole-section loading with nested loader slot props                                                                                                                              |
| Spinner                                  | Indeterminate/determinate, sizes/colors, named progress                                                                                                                          |
| Snackbar                                 | Severity × variant, placement, duration, close reasons, long/rich/plain messages, actions and dismissal                                                                          |
| EmptyState                               | Minimal, illustration, long content, filtered-empty/reset and create-action composition                                                                                          |
| ErrorFallback                            | Minimal/detailed, retry and recovery, host-supplied actions                                                                                                                      |
| LoadingOverlay                           | Open/closed, loading completion, scoped backdrop, content/actions, pointer release after close                                                                                   |
| RatanDesignProvider                      | All four appearances, inheritance/nesting, existing host theme, appearance hook, scoped menus/dialogs                                                                            |

## Optional date and grid entries

| Entry/components                                                                           | Variants and scenarios                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dates: DatePicker                                                                          | Fixed selected date, controlled empty, uncontrolled default, top/left label, disabled/read-only, formats, min/max, validation and hidden field                                                  |
| dates: DateTimePicker                                                                      | Date and time together, 12/24-hour display, bounds, errors and controlled updates                                                                                                               |
| dates: TimePicker                                                                          | Empty/selected, formats, time limits, minutes, disabled/read-only and custom field props                                                                                                        |
| dates: LocalizationProvider, AdapterDayjs                                                  | Shared local provider around each date scenario; locale/format policy remains explicit                                                                                                          |
| date-range: DateRangePicker                                                                | Pro single-input field; empty/partial/complete endpoints, limits and validation, labels and read-only/disabled states; license remains consumer-owned                                           |
| dates: DatePickerRoot, DateTimePickerRoot, TimePickerRoot; date-range: DateRangePickerRoot | `Inputs/Date scenarios → Styled Roots` renders all four lower-level styled pickers with fixed defaults and caller-supplied field slots; the range root retains its native two-field composition |
| data-grid: DataGrid                                                                        | Populated/empty/loading, densities, pagination, sorting/filtering, row selection, editing and actions                                                                                           |
| data-grid: GridActionsCellItem, GridToolbarContainer, GridToolbarExport                    | Observable row actions, custom toolbar, CSV export; supported ariaV7 structure in examples                                                                                                      |

## All curated primitives

| Family        | Exported components                                                                                          | Scenarios                                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout        | Box, Stack, Grid, Paper, Divider, Typography                                                                 | Responsive rows/columns/grid, spacing, elevations, text hierarchy/wrapping                                                                            |
| Content       | Card, CardContent, CardMedia, Avatar, Chip                                                                   | Media/text cards, initials/icon avatars, rounded/square shapes, status/selected/deletable chips                                                       |
| Fields        | Autocomplete, TextField, OutlinedInput, InputAdornment, FormControl, FormLabel, InputLabel, Select, MenuItem | Single/multiple/empty/disabled choices, grouping, field labels/errors/adornments and custom selection; native Select is shown in Components/Fields    |
| Actions       | Button, IconButton, Switch, ToggleButtonGroup                                                                | Variants, accessible icon actions/tooltips, controlled on/off and exclusive/multiple toggles                                                          |
| Navigation    | AppBar, Toolbar, Tabs, Tab, Accordion, AccordionSummary, AccordionDetails                                    | Responsive shell composition, tabs/panels, scrollable/disabled tabs, expandable sections                                                              |
| Overlays      | Menu, Drawer, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Tooltip                  | Anchored selection, drawers/anchors, modal actions/scroll, named tooltips, close/focus behavior                                                       |
| Feedback      | Alert                                                                                                        | Severities/variants, messages/actions and dismissal                                                                                                   |
| Global policy | CssBaseline                                                                                                  | Explicit opt-in under the current preview theme, separate from the historical portal theme example; scoped provider alone does not reset the document |

## Icons

All 21 exported glyphs appear in a named gallery with size/color and accessible
action examples: Add, Adjust, ArrowForwardIos, CallMade, CheckCircleOutlined,
Close, ContentPaste, Dangerous, Delete, Edit, ExpandMore, History,
KeyboardArrowDown, LightMode, LockOutlined, PersonOutlined,
PublishedWithChanges, RadioButtonUnchecked, RateReview, Refresh, Unpublished.

## Themes, tokens and compatibility

| Surface       | Coverage                                                                                                                                                                      |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| theme, tokens | createRatanTheme, ThemeProvider, theme inspection, newStyleTokens/legacyTokens swatches and typography/spacing/radius; helpers remain documented styling APIs                 |
| CSS           | styles.css scoped defaults; tokens.css global-only and styles-and-tokens.css combined usage documented with scope/override rules                                              |
| portal-theme  | Historical theme using selected mode/generation and original layout; CssBaseline has a separate explicit opt-in story; no URL/storage/auth policy                             |
| base-compat   | Button.default primary mapping; LoadingButton.default 16px start-icon spinner; Loader.default; Time.Time string values; Dialog.default open/portal/sizing/close contract      |
| compatibility | InputStyled, LoaderRoot/loaderClasses, SnackbarRoot, DialogRoot/dialogClasses, DialogTitle and background helpers; old/new color aliases documented as migration-only styling |

## Host composition choices in primitive examples

The primitive entry preserves historical MUI identities and defaults. The catalog
makes its sample-specific accessibility choices explicit through supported props:
initials avatars derive contrasting text from the theme's primary background, filled Chips
and Alerts use a host-owned `contrastThreshold: 4.5` text choice via `sx`, and the
disabled Chip represents an unavailable action. These settings do not change the
package theme or exported components. Filled error fields select the darker error
label tone in light mode and the lighter error tone in dark mode to contrast
with the filled surface; filled Alert text follows its actual main/dark background.
The Community grid loading example uses a
named progress indicator in a custom `loadingOverlay` slot with row/cell
semantics, and its comfortable-density canvas fits the initial five-row page.

## Verification

Build/typecheck/lint the catalog. Validate its inventory against public component
exports and built Storybook IDs. Load every story in all four appearances and
scan for serious/critical accessibility failures. Exercise interactive examples
with browser assertions (forms, clearing/resetting, tab retention, dialogs,
notifications, overlays, date controls, grid actions and compatibility adapters).
Check representative dense layouts at mobile/tablet/desktop widths. Storybook-only
changes must not change package implementation or existing portal screenshots.


## Validation evidence — 1 October 2026

- Storybook build and public-export guard: 157 stories across 24 files, with all
  113 capitalized runtime exports across the nine visual entry points referenced
  by built examples (including namespace adapters and localization helpers).
- Package TypeScript and zero-warning ESLint passed. Package tests passed:
  127 Vitest cases, seven token checks and three catalog-guard tests.
- The three Storybook Playwright specs passed all 71 tests: four complete catalog
  scans (628 story/appearance cases), 32 story-play checks, 32 workflow checks,
  and three responsive checks covering six examples at each width.
- No serious/critical WCAG axe findings remained in the scanned states. The
  workflow checks include forms, retained builder drafts, dialog focus/saving,
  notifications/progress, recovery/overlays, dates/ranges, grid editing/export,
  and legacy compatibility callbacks. Animation completion is awaited before
  scanning overlays; the harness runs axe explicitly to avoid concurrent addon scans.
- Eighteen screenshots were captured at 390, 768 and 1440 pixels. Representative
  overview, search, date roots, dialog and grid layouts were visually reviewed;
  viewport overflow assertions passed for every responsive example.
- Existing story IDs were preserved. Shipped component source, assets and host
  source were unchanged; no portal visual baseline was regenerated.

Reproduce with the package typecheck/lint/test/build commands, followed by
`npm run test:e2e:design-origin` from `scb-next`. This command also retains the
independent consumer checks and existing screenshot comparisons. Catalog inventory
checks establish source usage; the browser assertions establish the specific
rendered states and interactions exercised above.

## Validation evidence — 9 October 2026

The package catalog builds with 158 stories. The public-export guard covers all
24 curated icons, including the three profile icons, and the new migration
String Class Facade example compiles. The three catalog verifier tests pass.
The browser acceptance for the copied original-runtime Base is recorded in
`scb/web/mfe-base/docs/ACCEPTANCE.md`; the earlier catalog browser evidence above
retains its original scope.

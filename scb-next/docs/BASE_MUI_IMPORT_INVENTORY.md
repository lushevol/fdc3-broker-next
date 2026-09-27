# Base direct-MUI migration inventory

Audit date: 2026-09-27. This is the implementation checklist for the [Base UI component migration plan](BASE_UI_COMPONENT_MIGRATION_PLAN.md), audited from the current `mfe-base-origin` source and the current public exports of `ratan-design-origin`. All listed changes are planned; this document does not claim that the migration or visual verification has already passed.

## Scope and counts

The audit used `rg --files --hidden` for discovery and the TypeScript parser for import/export declarations, import types, module augmentations, and test mock module references. It includes `src/`, `stories/`, and hidden `.storybook/`; MDX tutorial import snippets were reviewed separately. Generated output, dependencies, and lockfiles are excluded. Types are classified by their actual contract role even where older source uses value-import syntax.

| Scope | Files with direct MUI references | Static import declarations | Notes |
| --- | ---: | ---: | --- |
| Production source including declarations | 62 | 146 | 54 files import runtime values; 8 files use only type contracts. One of those contains a module augmentation. |
| Tests | 18 | 26 | 13 files contain static imports; 5 more contain only mock/import-type references. Six tests reference the grid module in partial mocks. |
| Executable stories | 14 | 29 | Includes the JSX raw-component demo. |
| Storybook decorator | 1 | 4 | Hidden `.storybook/MuiTheme.tsx` must not be missed. |
| MDX tutorial snippets | 3 | 11 snippets | Import statements shown in documentation, not executable TS/JS modules. |
| Total source/example files | 98 | 205 executable/declaration imports + 11 documented imports | No direct MUI export declarations or runtime dynamic imports were found. |

Five additional manifest/configuration files and one historical dependency-audit document contain MUI strings. They are listed separately below; package installation, deduplication, type resolution, and historical prose are not runtime UI import exceptions. Counts are a dated baseline, not a limit: rerun the audit before implementation and at completion.

## Package entry mapping

All Base runtime UI imports must resolve through public Ratan entry points by completion, including styling helpers, providers, glyphs, and DataGrid. Use existing coarse controls where their contract matches. Use narrow presentation exports for standard primitives that the host composes. Do not move a page or business controller merely to remove an import.

| Key | Target | Status and purpose |
| --- | --- | --- |
| C | `ratan-design-origin` | Existing Button, Input, Select, Dialog and other controls; proposed coarse LabeledSwitch, AutocompleteField and IconAction. Confirm markup/default/interaction parity before substituting for a raw MUI component. |
| F | `ratan-design-origin/primitives` | Proposed narrow Material UI presentation exports and their prop/event types. Preserve exact primitive behavior, refs, generics, theme lookup, classes and slots. Include raw TextField/Dialog/Select/Button only where existing coarse APIs cannot preserve the current contract without changing presentation. |
| I | `ratan-design-origin/icons` | Proposed exports for the actual icon glyphs below. Preserve SVG paths, viewBox, sizing, color, accessible/decorative semantics and styling. |
| T | `ratan-design-origin/theme` | Existing entry, extended with the required styling/provider helpers and type exports. A re-exported ThemeProvider must use the same MUI context instance. |
| P | `ratan-design-origin/portal-theme` | Existing opt-in historical portal theme; extend its explicit reset/type exports where necessary. Keep CssBaseline opt-in and preserve its placement. Base continues to choose modes from host state. |
| D | `ratan-design-origin/dates` | Existing LocalizationProvider and AdapterDayjs exports. Current Pro import paths must also migrate, preserving locale and provider behavior. Keep the actual Pro range picker in existing `/date-range`. |
| G | `ratan-design-origin/data-grid` | Proposed isolated optional entry for Community DataGrid, toolbar/actions and grid types. No admin service, audit workflow, record policy or license machinery belongs in the core entry. |

`C/F` means adopt the existing core component if parity is demonstrated; otherwise expose the exact generic primitive through F. It is not an unresolved permission to retain a direct MUI import. A pass-through export is appropriate when it preserves a standard primitive; a new wrapper solely to rename a domain operation is not.

The file tables map the currently imported contracts to their package owners. A coarse C component such as AutocompleteField, LabeledSwitch or IconAction can consume F/I internally and replace several host imports together. Prefer that composition when it preserves the existing consumer contract; the tables do not require each host to keep assembling those primitives itself.

## Exhaustive imported symbol set

The symbols below are original exports, not local aliases such as `MuiButton` or `AvatarMui`. File tables follow.

- **Production Material UI, styling and types:** `Accordion`, `AccordionDetails`, `AccordionSummary`, `Alert`, `AppBar`, `Autocomplete`, `Avatar`, `Box`, `Button`, `CSSObject`, `Card`, `CardContent`, `CardMedia`, `Chip`, `CssBaseline`, `Dialog`, `DialogActions`, `DialogContent`, `DialogContentText`, `DialogProps`, `DialogTitle`, `DialogTitleProps`, `Divider`, `Drawer`, `FormControl`, `FormLabel`, `Grid`, `IconButton`, `InputAdornment`, `InputLabel`, `Menu`, `MenuItem`, `Paper`, `PaperProps`, `SnackbarCloseReason`, `Stack`, `Switch`, `Tab`, `Tabs`, `TextField`, `Theme`, `ThemeProvider`, `Toolbar`, `Tooltip`, `Typography`, `styled`, `useTheme`.
- **Production icon glyphs:** `Add`, `ArrowForwardIos`, `CallMade`, `CheckCircleOutlined`, `Close`, `ContentPaste`, `Dangerous`, `Delete`, `Edit`, `ExpandMore`, `History`, `KeyboardArrowDown`, `LightMode`, `LockOutlined`, `PersonOutlined`, `PublishedWithChanges`, `RateReview`, `Refresh`, `Unpublished`.
- **Production Community DataGrid:** `DataGrid`, `GridActionsCellItem`, `GridColDef`, `GridToolbarContainer`, `GridToolbarExport`, `GridValueGetterParams`.
- **Production localization (both community and Pro source paths):** `AdapterDayjs`, `LocalizationProvider`.
- **Additional executable story/test symbols:** `Adjust`, `ButtonProps`, `ChipProps`, `OutlinedInput`, `RadioButtonUnchecked`, `Select`, `SelectProps`, `TextFieldProps`, `ToggleButtonGroup`, `createTheme`.
- **Additional MDX tutorial helpers:** `css`, `darken`, `responsiveFontSizes`; `createTheme` is also used by a test. Rewrite these examples to supported Ratan exports.

## Production files with runtime imports (54)

| File | Runtime symbols | Types / special references | Target entries |
| --- | --- | --- | --- |
| [src/App.tsx](../web/mfe-base-origin/src/App.tsx#L5) | `AdapterDayjs`, `LocalizationProvider` | — | D |
| [src/admin/Category/common/style.ts](../web/mfe-base-origin/src/admin/Category/common/style.ts#L1) | `Stack`, `styled` | — | F, T |
| [src/admin/ImportMap/common/style.ts](../web/mfe-base-origin/src/admin/ImportMap/common/style.ts#L1) | `Stack`, `styled` | — | F, T |
| [src/admin/Tile/common/style.ts](../web/mfe-base-origin/src/admin/Tile/common/style.ts#L1) | `Stack`, `styled` | — | F, T |
| [src/admin/Tile/index.tsx](../web/mfe-base-origin/src/admin/Tile/index.tsx#L2) | `Autocomplete`, `IconButton`, `KeyboardArrowDown`, `Refresh`, `Stack` | — | F, I |
| [src/admin/common/Actions/index.tsx](../web/mfe-base-origin/src/admin/common/Actions/index.tsx#L2) | `Edit`, `GridActionsCellItem`, `History`, `PublishedWithChanges`, `Tooltip`, `Unpublished` | — | F, G, I |
| [src/admin/common/CopyText/index.tsx](../web/mfe-base-origin/src/admin/common/CopyText/index.tsx#L2) | `ContentPaste`, `IconButton` | — | F, I |
| [src/admin/common/Main/common/style.ts](../web/mfe-base-origin/src/admin/common/Main/common/style.ts#L1) | `Box`, `styled` | — | F, T |
| [src/admin/common/Main/index.tsx](../web/mfe-base-origin/src/admin/common/Main/index.tsx#L4) | `Button`, `DataGrid` | — | C/F, G |
| [src/admin/common/Status/index.tsx](../web/mfe-base-origin/src/admin/common/Status/index.tsx#L3) | `CheckCircleOutlined`, `Dangerous`, `Tooltip` | — | F, I |
| [src/components/AppBar/common/style.ts](../web/mfe-base-origin/src/components/AppBar/common/style.ts#L1) | `styled` | — | T |
| [src/components/AppBar/index.tsx](../web/mfe-base-origin/src/components/AppBar/index.tsx#L2) | `AppBar`, `Toolbar`, `Typography` | — | F |
| [src/components/Avatar/common/style.ts](../web/mfe-base-origin/src/components/Avatar/common/style.ts#L1) | `Menu`, `styled` | — | F, T |
| [src/components/Avatar/index.tsx](../web/mfe-base-origin/src/components/Avatar/index.tsx#L2) | `Avatar`, `Divider`, `IconButton`, `MenuItem`, `Tooltip`, `Typography` | — | F |
| [src/components/Dialog/common/Draggable.tsx](../web/mfe-base-origin/src/components/Dialog/common/Draggable.tsx#L3) | `Paper` | — | F |
| [src/components/Dialog/index.tsx](../web/mfe-base-origin/src/components/Dialog/index.tsx#L8) | `ArrowForwardIos`, `IconButton` | — | F, I |
| [src/components/Drawer/Menu.tsx](../web/mfe-base-origin/src/components/Drawer/Menu.tsx#L2) | `Box` | — | F |
| [src/components/Drawer/MenuItem.tsx](../web/mfe-base-origin/src/components/Drawer/MenuItem.tsx#L2) | `Grid` | — | F |
| [src/components/Drawer/common/style.ts](../web/mfe-base-origin/src/components/Drawer/common/style.ts#L1) | `styled` | — | T |
| [src/components/Drawer/common/tile.style.ts](../web/mfe-base-origin/src/components/Drawer/common/tile.style.ts#L1) | `styled` | — | T |
| [src/components/Drawer/index.tsx](../web/mfe-base-origin/src/components/Drawer/index.tsx#L2) | `Drawer` | — | F |
| [src/components/Empty/common/style.ts](../web/mfe-base-origin/src/components/Empty/common/style.ts#L1) | `styled` | — | T |
| [src/components/Empty/index.tsx](../web/mfe-base-origin/src/components/Empty/index.tsx#L3) | `CallMade` | — | I |
| [src/components/FallbackError/common/style.ts](../web/mfe-base-origin/src/components/FallbackError/common/style.ts#L1) | `styled` | — | T |
| [src/components/NewTile/common/style.ts](../web/mfe-base-origin/src/components/NewTile/common/style.ts#L1) | `styled` | — | T |
| [src/components/Profile/common/style.ts](../web/mfe-base-origin/src/components/Profile/common/style.ts#L1) | `Accordion`, `styled` | — | F, T |
| [src/components/Profile/index.tsx](../web/mfe-base-origin/src/components/Profile/index.tsx#L6) | `AccordionDetails`, `AccordionSummary`, `Box`, `Card`, `CardContent`, `CardMedia`, `Chip`, `Divider`, `ExpandMore`, `Stack`, `Typography` | — | F, I |
| [src/components/Splash/common/style.ts](../web/mfe-base-origin/src/components/Splash/common/style.ts#L1) | `styled` | — | T |
| [src/components/Survey/index.tsx](../web/mfe-base-origin/src/components/Survey/index.tsx#L2) | `Button`, `Dialog`, `DialogActions`, `DialogContent`, `DialogContentText`, `DialogTitle` | — | C/F, F |
| [src/components/SurveyButton/common/style.ts](../web/mfe-base-origin/src/components/SurveyButton/common/style.ts#L1) | `styled` | — | T |
| [src/components/SurveyButton/index.tsx](../web/mfe-base-origin/src/components/SurveyButton/index.tsx#L2) | `IconButton`, `RateReview`, `Tooltip` | — | F, I |
| [src/components/Switch/common/style.ts](../web/mfe-base-origin/src/components/Switch/common/style.ts#L1) | `Switch`, `styled` | — | F, T |
| [src/components/Switch/index.tsx](../web/mfe-base-origin/src/components/Switch/index.tsx#L5) | `LightMode` | — | I |
| [src/components/SwitchTime/common/style.ts](../web/mfe-base-origin/src/components/SwitchTime/common/style.ts#L1) | `styled` | — | T |
| [src/components/SwitchTime/index.tsx](../web/mfe-base-origin/src/components/SwitchTime/index.tsx#L2) | `FormControl`, `FormLabel`, `Switch` | — | F |
| [src/components/TabItem/common/style.ts](../web/mfe-base-origin/src/components/TabItem/common/style.ts#L1) | `styled` | — | T |
| [src/components/TabItem/index.tsx](../web/mfe-base-origin/src/components/TabItem/index.tsx#L2) | `Close`, `Delete`, `IconButton`, `Refresh`, `TextField`, `Tooltip` | — | C/F, F, I |
| [src/components/Table/common/style.ts](../web/mfe-base-origin/src/components/Table/common/style.ts#L1) | `Box`, `styled` | — | F, T |
| [src/components/Table/index.tsx](../web/mfe-base-origin/src/components/Table/index.tsx#L4) | `DataGrid`, `GridToolbarContainer`, `GridToolbarExport` | — | G |
| [src/components/TableDetail/Field.tsx](../web/mfe-base-origin/src/components/TableDetail/Field.tsx#L5) | `Autocomplete`, `KeyboardArrowDown`, `MenuItem` | — | F, I |
| [src/components/TableDetail/common/Field.useController.tsx](../web/mfe-base-origin/src/components/TableDetail/common/Field.useController.tsx#L2) | `Box` | `GridValueGetterParams` | F, G |
| [src/components/TableDetail/common/style.ts](../web/mfe-base-origin/src/components/TableDetail/common/style.ts#L1) | `styled` | — | T |
| [src/components/Tile/common/style.ts](../web/mfe-base-origin/src/components/Tile/common/style.ts#L2) | `styled` | — | T |
| [src/components/Tile/index.tsx](../web/mfe-base-origin/src/components/Tile/index.tsx#L3) | `Add`, `Button` | — | C/F, I |
| [src/components/Timeout/index.tsx](../web/mfe-base-origin/src/components/Timeout/index.tsx#L2) | `Dialog`, `DialogActions`, `DialogContent`, `DialogContentText`, `DialogTitle` | — | C/F, F |
| [src/components/Version/common/style.ts](../web/mfe-base-origin/src/components/Version/common/style.ts#L1) | `Alert`, `styled` | — | F, T |
| [src/components/Version/index.tsx](../web/mfe-base-origin/src/components/Version/index.tsx#L2) | `Stack`, `Typography` | — | F |
| [src/pages/Home/common/style.ts](../web/mfe-base-origin/src/pages/Home/common/style.ts#L1) | `styled` | — | T |
| [src/pages/Home/index.tsx](../web/mfe-base-origin/src/pages/Home/index.tsx#L2) | `Add`, `Box`, `Button`, `Tab`, `Tabs`, `useTheme` | — | C/F, F, I, T |
| [src/pages/Login/common/TabPanel.tsx](../web/mfe-base-origin/src/pages/Login/common/TabPanel.tsx#L2) | `Box` | — | F |
| [src/pages/Login/common/style.ts](../web/mfe-base-origin/src/pages/Login/common/style.ts#L1) | `styled` | — | T |
| [src/pages/Login/index.tsx](../web/mfe-base-origin/src/pages/Login/index.tsx#L2) | `Box`, `Divider`, `FormControl`, `Grid`, `InputAdornment`, `InputLabel`, `LockOutlined`, `PersonOutlined`, `Tab`, `Tabs`, `TextField`, `Typography` | — | C/F, F, I |
| [src/routing/common/style.ts](../web/mfe-base-origin/src/routing/common/style.ts#L1) | `styled` | — | T |
| [src/theme/Provider.tsx](../web/mfe-base-origin/src/theme/Provider.tsx#L2) | `AdapterDayjs`, `CssBaseline`, `LocalizationProvider`, `ThemeProvider` | `Theme` | D, P, T |

## Production files using only types or augmentation (8)

| File | Runtime symbols | Types / special references | Target entries |
| --- | --- | --- | --- |
| [src/@types/index.d.ts](../web/mfe-base-origin/src/@types/index.d.ts#L1) | — | `CSSObject`; module augmentation | P, T |
| [src/admin/Category/common/useAudit.tsx](../web/mfe-base-origin/src/admin/Category/common/useAudit.tsx#L3) | — | `GridColDef` | G |
| [src/admin/ImportMap/common/useAudit.tsx](../web/mfe-base-origin/src/admin/ImportMap/common/useAudit.tsx#L3) | — | `GridColDef` | G |
| [src/admin/Tile/common/useAudit.tsx](../web/mfe-base-origin/src/admin/Tile/common/useAudit.tsx#L3) | — | `GridColDef` | G |
| [src/admin/common/Main/common/interface.ts](../web/mfe-base-origin/src/admin/common/Main/common/interface.ts#L2) | — | `GridColDef` | G |
| [src/components/Dialog/common/types.ts](../web/mfe-base-origin/src/components/Dialog/common/types.ts#L1) | — | `DialogProps`, `DialogTitleProps`, `PaperProps` | F |
| [src/components/TableDetail/common/interface.ts](../web/mfe-base-origin/src/components/TableDetail/common/interface.ts#L1) | — | `GridColDef` | G |
| [src/routing/common/useController.ts](../web/mfe-base-origin/src/routing/common/useController.ts#L12) | — | `SnackbarCloseReason` | F |

`src/@types/index.d.ts` currently augments `Theme` and `ThemeOptions` with `customColor` and the portal `theme` shape, including the optional Avatar menu override. Generic presentation types may be exported by P. A host-specific module augmentation may remain in Base as a type-only declaration, with its imported types coming through Ratan. It must not introduce a runtime MUI import or make the package import Base source.

## Tests (18)

| File | Runtime symbols | Types / special references | Target entries |
| --- | --- | --- | --- |
| [src/admin/Category/index.test.tsx](../web/mfe-base-origin/src/admin/Category/index.test.tsx#L15) | — | partial grid mock, grid module import type | G |
| [src/admin/ImportMap/index.test.tsx](../web/mfe-base-origin/src/admin/ImportMap/index.test.tsx#L15) | — | partial grid mock, grid module import type | G |
| [src/admin/Tile/index.test.tsx](../web/mfe-base-origin/src/admin/Tile/index.test.tsx#L15) | — | partial grid mock, grid module import type | G |
| [src/admin/common/Actions/index.test.tsx](../web/mfe-base-origin/src/admin/common/Actions/index.test.tsx#L5) | — | partial grid mock, grid module import type | G |
| [src/admin/common/Main/index.test.tsx](../web/mfe-base-origin/src/admin/common/Main/index.test.tsx#L4) | — | `GridColDef`; partial grid mock, grid module import type | G |
| [src/admin/index.test.tsx](../web/mfe-base-origin/src/admin/index.test.tsx#L6) | — | partial grid mock, grid module import type | G |
| [src/components/BuilderButton/index.test.tsx](../web/mfe-base-origin/src/components/BuilderButton/index.test.tsx#L3) | `Box`, `Button`, `Stack`, `Tab`, `Tabs`, `Typography` | — | C/F, F |
| [src/components/DatePicker/compatibility.test.tsx](../web/mfe-base-origin/src/components/DatePicker/compatibility.test.tsx#L5) | `AdapterDayjs`, `LocalizationProvider` | — | D |
| [src/components/DatePicker/index.test.tsx](../web/mfe-base-origin/src/components/DatePicker/index.test.tsx#L6) | `AdapterDayjs`, `LocalizationProvider` | — | D |
| [src/components/DateRangePicker/index.test.tsx](../web/mfe-base-origin/src/components/DateRangePicker/index.test.tsx#L6) | `AdapterDayjs`, `LocalizationProvider` | — | D |
| [src/components/DateTimePicker/index.test.tsx](../web/mfe-base-origin/src/components/DateTimePicker/index.test.tsx#L6) | `AdapterDayjs`, `LocalizationProvider` | — | D |
| [src/components/Dialog/index.test.tsx](../web/mfe-base-origin/src/components/Dialog/index.test.tsx#L5) | `Button`, `Typography` | `SnackbarCloseReason` | C/F, F |
| [src/components/Table/index.test.tsx](../web/mfe-base-origin/src/components/Table/index.test.tsx#L4) | — | `GridColDef` | G |
| [src/components/TableDetail/index.test.tsx](../web/mfe-base-origin/src/components/TableDetail/index.test.tsx#L4) | `Edit`, `GridActionsCellItem` | — | G, I |
| [src/components/TimePicker/index.test.tsx](../web/mfe-base-origin/src/components/TimePicker/index.test.tsx#L6) | `AdapterDayjs`, `LocalizationProvider` | — | D |
| [src/components/ToggleButton/index.test.tsx](../web/mfe-base-origin/src/components/ToggleButton/index.test.tsx#L3) | `ToggleButtonGroup` | — | F |
| [src/components/mui5-compatibility.test.tsx](../web/mfe-base-origin/src/components/mui5-compatibility.test.tsx#L5) | `AdapterDayjs`, `LocalizationProvider` | — | D |
| [src/pages/Login/common/style.test.tsx](../web/mfe-base-origin/src/pages/Login/common/style.test.tsx#L2) | `ThemeProvider`, `createTheme` | — | T |

Retarget all six partial grid mocks and their `typeof import(...)` expressions to G along with production imports. Keep their intended contract assertions effective; changing only production imports would silently bypass the old MUI-module mocks.

## Executable stories and Storybook provider (15)

| File | Runtime symbols | Types / special references | Target entries |
| --- | --- | --- | --- |
| [stories/CompRaw.jsx](../web/mfe-base-origin/stories/CompRaw.jsx#L2) | `Button`, `Stack` | — | C/F, F |
| [stories/CustomComponent/Dialog.stories.tsx](../web/mfe-base-origin/stories/CustomComponent/Dialog.stories.tsx#L3) | `Button`, `Typography` | `SnackbarCloseReason` | C/F, F |
| [stories/CustomComponent/DialogWithTabs.stories.tsx](../web/mfe-base-origin/stories/CustomComponent/DialogWithTabs.stories.tsx#L3) | `Box`, `Button`, `Tab`, `Tabs`, `Typography` | `SnackbarCloseReason` | C/F, F |
| [stories/CustomComponent/SearchCondition.stories.tsx](../web/mfe-base-origin/stories/CustomComponent/SearchCondition.stories.tsx#L3) | `Stack` | — | F |
| [stories/CustomComponent/Snackbar.stories.tsx](../web/mfe-base-origin/stories/CustomComponent/Snackbar.stories.tsx#L3) | `Button` | `SnackbarCloseReason` | C/F, F |
| [stories/CustomInputComponent/AutocompleteInput.stories.tsx](../web/mfe-base-origin/stories/CustomInputComponent/AutocompleteInput.stories.tsx#L3) | `Autocomplete`, `Box` | — | F |
| [stories/CustomInputComponent/BuilderButton.stories.tsx](../web/mfe-base-origin/stories/CustomInputComponent/BuilderButton.stories.tsx#L3) | `Box`, `Button`, `Stack`, `Typography` | — | C/F, F |
| [stories/CustomInputComponent/Toggle2Button.stories.tsx](../web/mfe-base-origin/stories/CustomInputComponent/Toggle2Button.stories.tsx#L3) | `ToggleButtonGroup` | — | F |
| [stories/CustomInputComponent/Toggle3Button.stories.tsx](../web/mfe-base-origin/stories/CustomInputComponent/Toggle3Button.stories.tsx#L3) | `Adjust`, `RadioButtonUnchecked`, `ToggleButtonGroup` | — | F, I |
| [stories/MuiInputComponent/AutocompleteTextField.stories.tsx](../web/mfe-base-origin/stories/MuiInputComponent/AutocompleteTextField.stories.tsx#L4) | `Autocomplete`, `TextField` | `TextFieldProps` | C/F, F |
| [stories/MuiInputComponent/Button.stories.tsx](../web/mfe-base-origin/stories/MuiInputComponent/Button.stories.tsx#L4) | `Button` | `ButtonProps` | C/F, F |
| [stories/MuiInputComponent/Chip.stories.tsx](../web/mfe-base-origin/stories/MuiInputComponent/Chip.stories.tsx#L4) | `Chip` | `ChipProps` | F |
| [stories/MuiInputComponent/Select.stories.tsx](../web/mfe-base-origin/stories/MuiInputComponent/Select.stories.tsx#L4) | `FormControl`, `InputLabel`, `KeyboardArrowDown`, `MenuItem`, `OutlinedInput`, `Select` | `SelectProps` | C/F, F, I |
| [stories/MuiInputComponent/TextField.stories.tsx](../web/mfe-base-origin/stories/MuiInputComponent/TextField.stories.tsx#L4) | `TextField` | `TextFieldProps` | C/F, F |

| File | Runtime symbols | Types / special references | Target entries |
| --- | --- | --- | --- |
| [.storybook/MuiTheme.tsx](../web/mfe-base-origin/.storybook/MuiTheme.tsx#L2) | `AdapterDayjs`, `CssBaseline`, `LocalizationProvider`, `ThemeProvider` | — | D, P, T |

## MDX tutorial examples (3)

| File | Direct MUI symbols in code examples | Target entries |
| --- | --- | --- |
| [stories/GettingStarted.mdx](../web/mfe-base-origin/stories/GettingStarted.mdx#L33) | `Stack`, `Button` | F, C |
| [stories/Styling.mdx](../web/mfe-base-origin/stories/Styling.mdx#L37) | `css`, `styled`, `TextField`, `Button` | T, C/F |
| [stories/Theme.mdx](../web/mfe-base-origin/stories/Theme.mdx#L34) | `createTheme`, `responsiveFontSizes`, `ThemeProvider`, `CssBaseline`, `css`, `darken` | T, P |

Rewrite active examples to the final public imports and compile meaningful examples as consumer fixtures. Documentation should not teach a bypass after migration. MUI terminology and upstream documentation links may remain when describing the underlying implementation.

## Non-import MUI references

| File | Why the string exists | Required treatment |
| --- | --- | --- |
| [package.json](../web/mfe-base-origin/package.json) | Explicit Material UI, icon, grid and date package versions | Keep the peer installation graph valid and versions aligned. Zero direct UI imports does not mean blindly deleting required peer installations. |
| [vite.config.ts](../web/mfe-base-origin/vite.config.ts) | Runtime dependency deduplication | Preserve one React/MUI/Emotion context; add new Ratan entries to resolution/build policy where needed. |
| [vitest.config.ts](../web/mfe-base-origin/vitest.config.ts) | Deduplication and source transformation | Preserve correct context/ESM handling for Ratan and optional entries. |
| [tsconfig.json](../web/mfe-base-origin/tsconfig.json) | Material/System type-resolution paths | Verify public Ratan declarations resolve consistently; retain or remove mappings based on actual compiler resolution. |
| [tsconfig.typecheck.json](../web/mfe-base-origin/tsconfig.typecheck.json) | Material/System type-resolution paths for checking | Same compiler-resolution verification as above. |
| [docs/DEPENDENCY_AUDIT_2026-08-15.md](../web/mfe-base-origin/docs/DEPENDENCY_AUDIT_2026-08-15.md) | Historical package-version audit | Historical prose is not a UI import; retain its historical meaning. |

## Compatibility traps and completion gate

- Preserve the current portal theme and design generation. Reusing a provider or control name is insufficient if it changes CssBaseline placement, font loading, global CSS order, density, theme overrides, default props, scoped overlay containers, or document scroll locking. Preserve the existing provider nesting during migration; consolidate it only with evidence of identical behavior.
- Raw Login TextField and TabItem TextField must keep their label/adornment/variant and inline-edit layouts. Core Input adds presentation conventions; prove equivalence or use F. Preserve the old MUI 5 Grid API and spacing behavior.
- Profile Card/Accordion/Chip, shell AppBar/Drawer/Avatar/Menu/Tabs, Version Alert, and Survey/Timeout dialog parts are mandatory UI-import migrations. Their domain composition, auth, routing, user data, storage, timers and service callbacks remain in Base. Cards/tabs/grids are not deferred exceptions to the import boundary.
- Dialog adapters retain drag/resize/maximize policy in Base. Preserve Paper and title prop types, ARIA relationships, portals, close reasons, focus restoration, defaults and existing selectors. Do not import the compatibility entry's styled DialogTitle when the consumer needs the raw primitive's contract without comparing them.
- Keep DataGrid Community 6.20.4 behavior (columns, value getters, toolbar export, actions, paging, density, virtualization and detail forms) while moving imports to G. Existing optional peer declaration alone does not mean a public G entry already exists.
- Existing `/dates` already exports LocalizationProvider/AdapterDayjs; preserve behavior for consumers currently importing them via Pro paths. Keep MUI X and Pro range/license costs outside the core bundle.
- Add an import-boundary check for Base source, declarations, tests, executable stories, hidden Storybook helpers, and import/export/dynamic-import/require/mock paths; check MDX examples separately. It must reject new direct `@mui/*` imports and package-internal Ratan paths. Explicitly distinguish the type-only module-augmentation declaration, dependency/configuration metadata and historical prose.
- Every row needs an implemented target and passing contract evidence. Capture the portal before changes and compare after each stage using the same browser, data, viewport, fonts, theme, design generation and state. Verify screenshots plus keyboard/focus/overlay/error/loading/disabled behavior; zero direct imports alone cannot establish UI/UX parity. Use the detailed visual and behavioral matrix in the migration plan.

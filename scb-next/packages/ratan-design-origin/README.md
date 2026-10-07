# Ratan Design Origin

Internal standalone React 18 / Material UI 5 design-system candidate. It
contains Button, LoadingButton, Input, Select, the search controls and
layouts, ToggleButton, Label, Loader, PageLoader, Snackbar, explicit theme factories, and legacy / SC WebKit
tokens. No Base store, auth, router or services are needed.

```tsx
import { RatanDesignProvider } from 'ratan-design-origin/provider';
import { Input } from 'ratan-design-origin/input';
import { Button } from 'ratan-design-origin/button';
import 'ratan-design-origin/styles.css';

export function PaymentForm() {
  return (
    <RatanDesignProvider mode="light" designGeneration="legacy">
      <Input variant="outlined" label="Reference" />
      <Button variant="contained">Submit</Button>
    </RatanDesignProvider>
  );
}
```

The provider defaults to light/legacy and scopes CSS variables and overlay
containers to its own root. Nested providers inherit omitted appearance fields
from the nearest provider. Hosts that already own a MUI theme may pass it through
`baseTheme`; the provider preserves that theme's policy while adding Ratan
appearance metadata and scoped overlay containers. `useRatanAppearance()` exposes
the resolved contract to adapters that must forward it across an MFE boundary.
The provider does not reset the document, change scrolling, read storage or choose
appearance from application state. Hosts own those policies and date localization.
Load CSS explicitly for scoped legacy/WebKit
aliases, canonical WebKit variables and fonts. Keyboard-focused actions show a
2px brand-color focus ring; outlined inputs and opt-in portal DataGrid cells and
headers retain the same visible keyboard cue. WebKit placeholders use the label
semantic so rendered placeholder and helper text meet the package's normal-text
contrast target in light and dark modes. Select labels are associated with their
combobox.
The WebKit generation maps MUI controls to the SC GDS palette, SC Prosper Sans,
spacing, radii, button states and form-control states. Legacy keeps its existing
Poppins typography and compact visual baseline during migration. Poppins is host-provided;
it is not one of this package's font assets.
WebKit's public `newStyleTokens.typography.fontSize` resolves through the scoped
`--sc-font-size: 1rem` canonical default; generated compatibility aliases are
checked transitively per generation/mode for missing custom-property definitions
and cycles. Dark WebKit roots supplement the omitted canonical data-grid focus
shadow with the same formula and the dark blue token counterpart.

## Imports

- `ratan-design-origin`: controls, prop types, provider.
- `ratan-design-origin/theme`: `createRatanTheme`, shared control overrides and
  compact defaults; emitted `Theme.ratan.designGeneration` augmentation.
- `ratan-design-origin/tokens`: framework-independent `legacyTokens` and
  `newStyleTokens` semantic references.
- `ratan-design-origin/compatibility`: existing CSS alias strings,
  `InputStyled`, `DialogTitle`, `DialogRoot` and `dialogClasses`; retained
  for Base adapters, not a new customization contract.
- `ratan-design-origin/base-compat`: migration-only legacy Base presentation
  namespaces for Ratan/Cashflow (`Loader`, `Time`, `Button`, `LoadingButton`,
  `Dialog`); it contains no host state, services, routing or theme policy.
- `ratan-design-origin/styles.css`: scoped canonical WebKit variables and fonts.
- `ratan-design-origin/dates`: DatePicker, DateTimePicker, TimePicker, their
  Dayjs prop types, LocalizationProvider and AdapterDayjs.
- `ratan-design-origin/date-range`: optional Pro single-input DateRangePicker.
- `ratan-design-origin/portal-theme`: opt-in historical portal theme factory,
  extensions, document reset and grid override policy for existing hosts.

### Tree shaking and direct imports

Use a direct component path when the application build should load and compile
only that component and its required dependencies:

```tsx
import { Button, type ButtonProps } from 'ratan-design-origin/button';
import { Dialog, type DialogProps } from 'ratan-design-origin/dialog';
```

Each path supports named value and type exports from its module. The existing
root and integration entries remain compatible. Root named imports remove unused
runtime code from the final production bundle, but the bundler may still traverse
the root barrel and its reexports. Direct paths avoid that unrelated package
module traversal. Type-only imports load no runtime code; applications with no
package import load no package modules.

| Direct paths | Main exports |
| --- | --- |
| `/button`, `/loading-button` | `Button`, `LoadingButton` |
| `/input`, `/select` | `Input`, `Select` |
| `/search-input`, `/search-button`, `/reset-button` | `SearchInput`, `SearchButton`, `ResetButton` |
| `/search-grid`, `/search-condition`, `/search-condition-container` | `SearchGrid`, `SearchCondition`, `SearchConditionContainer` |
| `/toggle-button`, `/label`, `/label-menu-item` | `ToggleButton`, `Label`, `LabelMenuItem` |
| `/loader`, `/page-loader`, `/spinner`, `/snackbar` | `Loader`, `PageLoader`, `Spinner`, `Snackbar` |
| `/dialog`, `/empty-state`, `/error-fallback`, `/loading-overlay` | `Dialog`, `EmptyState`, `ErrorFallback`, `LoadingOverlay` |
| `/builder-button`, `/builder-tabs`, `/builder-tab`, `/builder-tab-panel` | `BuilderButton`, `BuilderTabs`, `BuilderTab`, `BuilderTabPanel` |
| `/date-picker`, `/date-time-picker`, `/time-picker` | `DatePicker`, `DateTimePicker`, `TimePicker` |
| `/provider`, `/appearance` | `RatanDesignProvider`, `useRatanAppearance`; appearance defaults/resolution/types |

Prefix each path with `ratan-design-origin`. `builderTabProps` is also exported
from `/builder-tab`, and `builderEmptyStyle` from `/builder-tabs`. Direct date
paths still require the host's optional MUI X/Dayjs peers and localization provider.
The `dates` entry continues to export `LocalizationProvider` and `AdapterDayjs`.

JavaScript imports do not implicitly load CSS or fonts. Import `styles.css` or
`tokens.css` explicitly when required; those stylesheets are side effects and
remain in the bundle. Required dependencies, including theme/token modules used
by a selected component, remain part of its graph. Tree shaking requires an ESM
consumer builder with unused-code elimination enabled. The package's own library
build emits all supported modules for distribution, independently of which
components a later application imports.

## Public contract matrix

| Surface | Values and defaults | Callbacks and refs | Accessibility and keyboard | Customization and precedence |
| --- | --- | --- | --- | --- |
| `RatanDesignProvider`, theme and tokens | `mode="light"` and `designGeneration="legacy"`; omitted fields inherit from the nearest provider and standalone roots use those defaults. | No application-state callback or forwarded ref; `useRatanAppearance()` returns the resolved pair for explicit MFE forwarding. | Scopes color scheme, variables and overlay containers to its root. | Supports `children`, `className` and an existing MUI `baseTheme`; use the `theme` and `tokens` entries for supported standalone composition. It does not read URL, storage, auth or document state. |
| `Button`, `ResetButton`, `ToggleButton`, `SearchGrid`, `SearchCondition` | Preserve the corresponding MUI Button, ToggleButton, Grid and Alert values/defaults; `SearchCondition` requires `label`, `value` and `onClose`. | Forward their MUI root refs and callbacks; `SearchCondition.onClose` receives the close `SyntheticEvent`. | Retain MUI keyboard behavior and names. `SearchCondition` keeps its close action. | Support their inherited MUI 5 props, including `sx`, DOM attributes and ARIA props. Package visual policy remains token/theme-owned. |
| `LoadingButton`, `SearchButton` | `loading=false`, `loadingSize=14`, `loadingPosition="inline"`; `startIcon` replaces and later restores the caller icon. | Forward `HTMLButtonElement` refs and inherited Button callbacks. Loading disables activation. | The named button owns `aria-busy`; its spinner is decorative. | Support inherited MUI `ButtonProps`. Caller `disabled` remains effective; `loadingPosition` is consumed and never reaches the DOM. |
| `Input`, `SearchInput` | Use MUI `value`/`defaultValue`; `labelPosition="top"`. `SearchInput.clearButtonLabel="Clear search"`. | `Input` forwards its root `HTMLDivElement` ref and native `inputRef`; callbacks are inherited from MUI TextField. `SearchInput.handleClear` is required. | MUI label/input keyboard behavior is retained. Search clear is disabled when the effective input is disabled or read-only. | Support `TextFieldProps` except unrestricted `variant`. Modern `slotProps` override legacy `InputProps`/`inputProps` counterparts; caller `sx` follows SearchInput padding. `hidden` supplies the initial inline display value and caller `style` is applied last. |
| `Select`, `Label` | Use inherited controlled `value` or uncontrolled `defaultValue`; `Select.labelPosition="top"`, FormControl size defaults to `small`, and `variant` is explicit. `Label` uses `label` as its initial value. | `Select` forwards its root `HTMLDivElement` ref and the MUI `(event, child)` callback; `Label` retains MUI Select callbacks. | `Select` generates associated control/label IDs unless explicit `id`/`labelId` are supplied. `Label` derives its name from string/number `label`; `SelectDisplayProps` ARIA fields override root ARIA fields and the derived name. | Support inherited MUI Select props. `Select.IconComponent` overrides the package icon; caller IDs and ARIA names are authoritative. |
| Search composition | `SearchConditionContainer` starts collapsed at the legacy 49px height and keeps children mounted. | Container and grid refs are forwarded; criteria removal remains caller-owned. | Fully visible first-row criteria remain interactive; clipped rows become inert and hidden. The toggle exposes state-specific text, `aria-expanded` and `aria-controls`; MUI handles grid/control keyboard behavior. | `SearchGrid`, `SearchCondition` and the container support their inherited MUI props. The container owns spacing, direction and collapsed height; caller `sx` may customize wrapping and other MUI styles. |
| Builder | `anchorEl` is controlled; default popover size is 284x560px. Inactive panels stay mounted. | `onClose(event, "escapeKeyDown" | "backdropClick")` requests closure; callers clear `anchorEl`. Tabs retain MUI change callbacks and refs; focus returns to the trigger after controlled close. | Trigger, tab and panel IDs are stable and instance-scoped. MUI tab arrow-key behavior is retained. Explicit tab/panel relationships override generated relationships. | `BuilderButton` supports inherited Button props except package-owned variant/icons/color. `popOverWidth`/`popOverHeight` override size; `builderTabProps` remains available for direct MUI tab use. |
| `Loader`, `PageLoader`, `Snackbar` | Loader `size=90`; its accessible name is `text` or `Loading...`. Snackbar is controlled by inherited `open`; strings remain text. | Loader accepts HTML attributes. Snackbar retains MUI close event/reasons. PageLoader passes `slotProps.loader` to the nested Loader. | Loader is a polite named status and becomes static under reduced motion. Snackbar retains MUI alert/Snackbar keyboard behavior. | Loader supports section HTML attributes. Snackbar supports MUI Snackbar props plus `severity`, `variant` and `alertsx`; `alertsx` follows package alert styles. |
| `Dialog` | `open` is controlled. Generated header/actions render only when their content is non-null; provider overlay is the default container. | MUI `onClose(event, "escapeKeyDown" | "backdropClick")` and `onCloseButton` are separate. Root and `contentRef` are forwarded. | MUI manages modal focus/Escape. Explicit root naming wins, then `PaperProps`, then a mounted generated/custom header ID; suppressed or ID-less custom headers create no dangling relationship. | Supports inherited MUI Dialog props plus header/content/action/surface slots. Explicit `container` wins over provider/theme. `titleProps`, `contentProps`, `actionProps`, `PaperProps` and `RootComponent` are supported; host drag/resize/maximize policy stays outside. |
| State presentation | `LoadingOverlay.open` is controlled; optional content is omitted when null. | Presentation surfaces do not dispatch, navigate, catch errors or emit policy callbacks. | Loading content is a status only while open; a closed overlay immediately releases pointer input. | `EmptyState`/`ErrorFallback` support Box root props; EmptyState also supports wrapper/content Box props. LoadingOverlay supports Box and `backdropProps`; caller root props follow package defaults while closed pointer release remains authoritative. |
| Date, time and range entries | Community pickers preserve omitted `value` as uncontrolled and explicit `null` as controlled-empty. Range preserves each null endpoint. `labelPosition="top"`; `hidden=false`. | Retain MUI X callbacks; these wrappers do not add forwarded refs. | Retain MUI X field/dialog keyboard and labeling behavior. IDs belong in `slotProps.textField.inputProps`. | Support inherited MUI X 6 props. Caller `slotProps` replaces default shrink props; range always uses `SingleInputDateRangeField`. Caller `sx` is preserved and `hidden` is the final display override. |

Compatibility-only exports in `ratan-design-origin/compatibility` preserve Base
adapter selectors and styled surfaces. The `base-compat` entry preserves only the
pure presentation namespace shape during Ratan/Cashflow migration. They are
migration helpers, not supported general-purpose customization primitives.
`portal-theme` likewise preserves an explicit historical host integration and
document-level policy.

The compiling examples are [core contracts](fixtures/consumer/src/contracts.tsx),
[date contracts](fixtures/consumer/src/dates.tsx), and
[portal contracts](fixtures/consumer/src/server-portal.tsx). Corresponding catalog
stories are [Controls/States and ActionStateMatrix](stories/Controls.stories.tsx),
[Inputs/Dates](stories/Dates.stories.tsx), [Search/Builder](stories/Builder.stories.tsx),
[Feedback/Dialog](stories/Dialog.stories.tsx),
[Feedback/States](stories/Feedback.stories.tsx), and
[Feedback/Presentation](stories/StatePresentation.stories.tsx).

Controls accept MUI 5 props. Input also translates Base's modern slot spelling
to MUI 5, with slots taking precedence over legacy props. Its effective disabled
and required values are shared by the TextField, label and native input; error is
a field-level MUI state shared by the label and input. Select likewise propagates
its disabled, error and required props through its FormControl, label and select
surface. Button/LoadingButton
forward button refs; Input forwards root and native input refs. Select forwards
its root ref, generates a stable control ID when one is omitted, and associates
its visible label with custom and native comboboxes; explicit `id` and `labelId`
remain authoritative. LoadingButton
retains the label and disables the action while loading (default spinner 14px).
`loadingPosition="startIcon"` replaces the caller's start icon while loading
and restores it when idle; consumer adapters retain their 16px default.
SearchButton supports the same `inline` default and `startIcon` loading positions
and consumes the prop internally, so it never reaches the button DOM.
`Spinner`/`SpinnerProps` expose the existing MUI circular progress primitive.
SearchInput composes Input with search and clear adornments. SearchButton,
ResetButton, ToggleButton and Label preserve the existing Base contracts while
their implementations and visual policy are now owned by this package.
Label uses a string or numeric `label` as the compact selector's accessible name;
callers can override it through `aria-label`, `aria-labelledby`, or the matching
`SelectDisplayProps` fields.
LoadingButton and SearchButton keep their action name, disable activation and
expose `aria-busy="true"` while loading. Their embedded progress indicators are
visual decoration so assistive technology receives one busy announcement from
the named action instead of a duplicate progressbar.
The SearchInput clear button is named `Clear search` by default; set
`clearButtonLabel` for localized or field-specific text. The clear action is
disabled when the effective input is disabled or read-only, including through
legacy `InputProps`/`inputProps` and modern `slotProps` spellings.
SearchInput's default input padding precedes caller `sx`; callers may use MUI
object, callback or conditional-array forms. Date and range wrappers preserve
those forms too; date `hidden` remains the explicit final display override.
SearchGrid, SearchCondition and SearchConditionContainer provide the composed
search layout, dismissible criteria and collapsed/expanded criteria region. The
collapsed region keeps its first visible row interactive while clipped rows are
inert and hidden from assistive technology. Its state-named toggle exposes
`aria-expanded` and `aria-controls`; children remain mounted across transitions.
BuilderButton composes a Table/Filters trigger with a controlled popover.
Callers own `anchorEl` and clear it from their actions to close; the legacy
284x560px popover accepts `popOverWidth`/`popOverHeight` overrides. BuilderTabs,
BuilderTab, BuilderTabPanel and `builderTabProps` retain MUI tab navigation and
the existing mounted inactive-panel behavior. A provider scopes the popover
inside its theme root. Each BuilderButton namespaces the nested package tab and
panel IDs, so concurrent Builders have isolated ARIA relationships without
caller-managed IDs. Existing `builderTabProps` IDs remain available for direct
Material-tab use; explicitly supplied tab or panel relationships take precedence.
Trigger/popover IDs are stable across SSR hydration. MUI's portal renders the
tab/panel content on the client, where the same Builder namespace applies.
Builder triggers expose expanded/control semantics and may receive an optional
`onClose` request callback for Escape or backdrop interactions. The caller still
owns `anchorEl` and closes the controlled popover by clearing it. Focus returns
to the trigger after that controlled close transition.

Loader announces a loading status (default accessible name: "Loading...") and
shows visible text only when supplied. `size` accepts a number or CSS dimension;
the legacy 90px maximum remains. Its two rings retain their ordinary 2s/1s
rotation unless the browser requests reduced motion, when the visible affordance
becomes static while the status announcement remains available. PageLoader
centers it in an absolute full-page region and accepts `slotProps.loader` for
loader-specific attributes.
Snackbar accepts plain text or React content in `message`, plus `action`,
`severity`, `variant`, `alertsx`, and MUI Snackbar lifecycle props. Strings are
never parsed as HTML. Its scrollable message region retains the legacy 50px
height cap and is keyboard focusable so overflow can be scrolled without a
pointer. Base's adapter alone preserves sanitized legacy HTML messages.

Dialog composes a controlled MUI dialog with `titleComponents`, `actionComponents`,
`onCloseButton`, `disabledClose` and `dividers`. MUI `onClose` retains its reason
argument; the explicit close-button callback is separate. A provider scopes its
overlay; an explicit `container` overrides that default. Hosts can replace or
suppress `header`, supply `contentRef`, title/content/action props, and append
`surfaceChildren` for interaction adornments. Hosts own sizing, maximize/resize,
drag integration via PaperComponent, stacking, telemetry and workspace policy.
The dialog references only a mounted generated or custom title. Explicit
`aria-labelledby`/`aria-label` names and equivalent `PaperProps` names remain
authoritative, so suppressed or unnamed custom headers leave no dangling label
relationship.

EmptyState accepts host-supplied `title`, `description`, `illustration` and
`action`, plus wrapper/content Box props. ErrorFallback composes a title and
optional description/action in a padded section. LoadingOverlay receives
controlled `open` and status content, with explicit backdrop props. These
surfaces do not catch errors, dispatch loading, select support addresses or
open navigation. Hosts own those decisions.

React / ReactDOM, Material / icons and Emotion are required external peers. The
supported ranges are React/ReactDOM `^18.2.0`, Material/icons `^5.18.0`,
Emotion React `^11.14.0` and Emotion styled `^11.14.1`. The repository hosts
currently resolve React 18.3.1, Material/icons 5.18.0 and Emotion 11.14.0/11.14.1.
ESM and declarations are shipped; no CommonJS export is promised. Core excludes
grid/date/Pro integrations and WebKit element registration.

The optional host-installed peer ranges are `@mui/x-date-pickers` (`~6.20.2`),
`@mui/x-date-pickers-pro` (`~6.20.2`), `@mui/x-data-grid` (`~6.20.4`),
`@mui/base` (`5.0.0-beta.70`) and `dayjs` (`^1.11.21`). They are never loaded by
the core entry. An integration is present only when the host declares it; an
ancestor-hoisted copy does not enable package entries. Range hosts own date-entry
policy. Hosts own MUI X Pro licensing and license initialization.
Wrap dates in LocalizationProvider with AdapterDayjs. Hosts own localization,
timezone, format and validation policy, including `adapterLocale`.
Controls retain `labelPosition="top" | "left"`, `hidden`, Dayjs values and MUI X
callbacks. Community date controls preserve omitted `value` as uncontrolled so
`defaultValue` works, while explicit `null` remains controlled-empty. Caller
`slotProps` replaces the default shrink text-field props;
range always uses SingleInputDateRangeField and preserves null endpoints in empty
and partial controlled values. Field identifiers belong in
`slotProps.textField.inputProps`; MUI X 6 ignores top-level data attributes.
The compiled `fixtures/consumer/src/dates.tsx` demonstrates the public imports.

Import `ratan-design-origin/styles.css` explicitly to load scoped variables and
fonts. The package ships these WOFF2 assets:

- SC Prosper Sans: `SCProsperSans-Regular.woff2`, `SCProsperSans-Medium.woff2`,
  `SCProsperSans-Bold.woff2`.
- Open Dyslexic: `OpenDyslexic-Regular.woff2`, `OpenDyslexic-Bold.woff2`.
- Inter: `inter-v18-latin-regular.woff2`, `inter-v18-latin-500.woff2`,
  `inter-v18-latin-600.woff2`, `inter-v18-latin-700.woff2`.
- Roboto Mono: `roboto-mono-v23-latin-regular.woff2`,
  `roboto-mono-v23-latin-500.woff2`, `roboto-mono-v23-latin-600.woff2`,
  `roboto-mono-v23-latin-700.woff2`.

Legacy Poppins is host-provided and is not packaged. Asset redistribution still
requires the approval described in NOTICE.md and the release guide.

Existing portal hosts can use `Config(getPortalTheme(mode, newStyles, isNewLayout))`
from `portal-theme`. Defaults remain legacy and the original layout. Gold
maps to dark; unknown/undefined modes map to light. URL parsing and application
appearance stay outside the factory. Applying its CssBaseline is an explicit
document-wide opt-in, including scrolling/selection restrictions. Standalone
apps should normally use createRatanTheme/RatanDesignProvider.
The portal declarations require optional `@mui/x-data-grid@6.20.4` and
`@mui/base@5.0.0-beta.70` (an upstream grid declaration dependency that Material
5.18 no longer installs). Core consumers need neither. See the compiled
`fixtures/consumer/src/server-portal.tsx` for extension/declaration/SSR usage.

## Use tokens directly in application CSS

Import the global token entry once in your application's stylesheet (with a
bundler that resolves package CSS imports):

```css
@import 'ratan-design-origin/tokens.css';

.payment-card {
  color: var(--sc-layout-text-color);
  background: var(--sc-panel-background-color);
  border: 1px solid var(--sc-divider-color);
  border-radius: var(--sc-radius-md);
  padding: var(--sc-spacing-16);
  font-family: var(--sc-font-family);
}
```

Alternatively, import `ratan-design-origin/tokens.css` in your application entry
file. No React, MUI, JavaScript token import, or `RatanDesignProvider` is needed
to use the CSS. For an unbundled site, serve `dist/tokens.css` with its adjacent
`fonts/` directory and load it with a stylesheet `<link>`.

Tokens inherit throughout the document, including body-mounted overlays and
micro-frontends in that document. Each iframe or separate document must load
the stylesheet itself. Loading tokens does not apply colors, fonts, resets or
layout rules to elements; applications choose which variables to use.

The global entry defaults to **WebKit/light**. Set attributes on `<html>` to
select an appearance, and change them at runtime to update CSS consumers:

```html
<html data-generation="webkit" data-mode="dark">
```

`data-mode="light"` (or no mode attribute) selects light; `data-mode="dark"`
selects dark. `data-generation="legacy"` selects legacy variables, including
`--base-*` and `--theme-*`; use `var(--theme-color-body-background)` for a
background alias shared by both generations. `--sc-*` tokens belong to WebKit.
Remove the generation attribute or set it to `webkit` for WebKit tokens.
The application owns these attributes; this entry does not synchronize them
with a React theme, portal store, or operating-system preference.

Common WebKit variables:

| Purpose | CSS variable |
| --- | --- |
| Page / panel background | `--sc-layout-background-color` / `--sc-panel-background-color` |
| Text / muted text | `--sc-layout-text-color` / `--sc-panel-content-color` |
| Border / focus | `--sc-divider-color` / `--sc-focus-ring-color` |
| Spacing | `--sc-spacing-4`, `--sc-spacing-8`, `--sc-spacing-16`, `--sc-spacing-24` |
| Radius | `--sc-radius-sm`, `--sc-radius-md`, `--sc-radius-lg` |
| Typography | `--sc-font-family`, `--sc-font-size` |

The [CSS-only consumer](fixtures/consumer/tokens.html) is bundled by the package
verifier. The generated [token stylesheet](assets/tokens.css) lists every token.
Both CSS entries ship the same font faces and retain responsive token values.
Continue loading `styles.css` for `RatanDesignProvider` scopes; those scopes
keep their own appearance even when `tokens.css` is also loaded. The provider's
existing default remains legacy/light.

To customize a global token, add a `:root` declaration after the import; no
`!important` or appearance-selector matching is needed:

```css
:root {
  --sc-radius-md: 0.75rem;
}
```

## AI migration and usage guidance

The package includes the [ratan-design-origin skill](.agents/skills/ratan-design-origin/SKILL.md)
for component usage, migration through compatible adapters, and extraction of
reusable presentation. Its references cover imports/tree shaking, themes/overlays,
optional dates, host ownership, and validation. It is included in npm tarballs
and uses packaged documentation/declarations when source-checkout tools are absent.
For an agent working outside this package, provide the skill's file path explicitly.

## Development commands

Run `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, and
`npm run build:storybook`. `npm run verify:package` packs and installs into a
temporary independent consumer, checks declarations/assets/SSR/tree shaking,
and prints its path. Run `npm run dev` in that printed consumer for port 8019.
After building the package, `npm run verify:tree-shaking` checks all 30 direct
paths against their required package module graphs, plus no-import, unused root
import, type-only import, root Button and explicit stylesheet cases. The packed
consumer verifier runs the same checks with its pinned Vite version and validates
direct-import declarations in both modern and legacy TypeScript resolution.
Use `npm run storybook` for appearance controls and component states on 6019.
From `scb-next`, `npm run test:e2e:design-origin` builds those surfaces and runs
the required catalog axe scan, consumer accessibility/interaction matrix, and
eight reviewed screenshot comparisons. Use
`npm run test:e2e:design-origin:update` only for an intentional visual change;
inspect every changed PNG and rerun the ordinary command before accepting it.

Also from `scb-next`, `npm run test:dependency-isolation` exercises unsupported,
missing, duplicate and optional-peer fixtures. `npm run verify:dependency-isolation`
loads each host's Vite policy and checks that declared versions satisfy both the
host and package ranges, while package-originated core imports resolve to the same
physical React/MUI/Emotion instances as host imports. It reports undeclared
optional integrations as absent even when npm has hoisted a copy elsewhere.

`npm run verify:design-origin` is the complete candidate gate. It runs package
tests/coverage, typecheck and zero-warning lint; dependency fixtures and host
resolution; the package/Storybook/tarball/browser gate; Base typecheck; and the
Base, Ratan and Cashflow production builds. Install workspace dependencies and
Playwright Chromium first, keep ports 8019 and 8020 free, and allow npm registry or
cache access for the temporary consumer. No application/backend service is started
separately. Azure uses `azure-pipelines-design-origin-quality.yml`; an external CI
template can invoke the same command after `npm ci` and Chromium installation.

The packed tree-shaking gate uses the fixture's exact Vite 8.2.1 and externalizes
UI peers. A root `Button` import renders only `Button.js`; its direct path also
loads only `Button.js`. The enforced ceiling is 2,048 uncompressed bytes and the
verifier also rejects unrelated component/token markers and rendered modules.
This measures package code for one import, not framework bytes, gzip transfer size
or total application savings. Revise the ceiling only with a reviewed Button
contract change and a new before/after measurement.

`src/tokens/webkit-theme.json` is the versioned authoring manifest for scoped
supplements, public semantic references, and MUI raw theme values.
`tokens:generate` combines it with WebKit 2.0.5 to regenerate committed CSS,
provenance, and `src/tokens/webkit-theme.generated.ts`, retaining canonical
`@media`/`@supports` ancestry around scoped token declarations. Components use
CSS references so mode and responsive values stay live. Theme creation uses raw
colors where MUI parses and calculates contrast, and numeric font size/radius
where MUI performs arithmetic. `npm test` checks manifest/CSS drift, complete
token graphs, and deterministic generation; provenance hashes are in
`assets/webkit-sources.json`. Ordinary builds consume the committed generated
files and need no sibling source checkout. See NOTICE.md for asset licensing
restrictions. Registry, release owners and redistribution approval must be
confirmed before publishing.
Base, Ratan and Cashflow use package presentation behind their existing exports.
See [the inventory](../../docs/UI_PACKAGE_INVENTORY.md) for deliberate portal
boundaries and [release/rollback](../../docs/UI_PACKAGE_RELEASE.md) for versioning,
review responsibilities, adoption and publication gates.

The [2026-09-19 clinic](../../docs/UI_PACKAGE_CLINIC.md) records the package's
behavior, accessibility, token, distribution, and adoption review. Use the
[fix tracker](../../docs/UI_PACKAGE_FIX_TRACKER.md) for the ordered remediation
backlog, acceptance criteria, and completion evidence.

# Ratan Design Origin

Internal standalone React 18 / Material UI 5 design-system candidate. It
contains Button, LoadingButton, Input, Select, the search controls and
layouts, ToggleButton, Label, Loader, PageLoader, Snackbar, explicit theme factories, and legacy / SC WebKit
tokens. No Base store, auth, router or services are needed.

```tsx
import { RatanDesignProvider, Input, Button } from 'ratan-design-origin';
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
containers to its own root. It does not reset the document, change scrolling,
read storage or choose appearance from application state. Hosts own those
policies and date localization. Load CSS explicitly for scoped legacy/WebKit
aliases, canonical WebKit variables and fonts. Keyboard-focused actions show a
2px brand-color focus ring; Select labels are associated with their combobox.
The WebKit generation maps MUI controls to the SC GDS palette, SC Prosper Sans,
spacing, radii, button states and form-control states. Legacy keeps its existing
Poppins typography and compact visual baseline during migration.

## Imports

- `ratan-design-origin`: controls, prop types, provider.
- `ratan-design-origin/theme`: `createRatanTheme`, shared control overrides and
  compact defaults; emitted `Theme.ratan.designGeneration` augmentation.
- `ratan-design-origin/tokens`: framework-independent `legacyTokens` and
  `newStyleTokens` semantic references.
- `ratan-design-origin/compatibility`: existing CSS alias strings,
  `InputStyled`, `DialogTitle`, `DialogRoot` and `dialogClasses`; retained
  for Base adapters, not a new customization contract.
- `ratan-design-origin/styles.css`: scoped canonical WebKit variables and fonts.
- `ratan-design-origin/dates`: DatePicker, DateTimePicker, TimePicker, their
  Dayjs prop types, LocalizationProvider and AdapterDayjs.
- `ratan-design-origin/date-range`: optional Pro single-input DateRangePicker.
- `ratan-design-origin/portal-theme`: opt-in historical portal theme factory,
  extensions, document reset and grid override policy for existing hosts.

Controls accept MUI 5 props. Input also translates Base's modern slot spelling
to MUI 5, with slots taking precedence over legacy props. Button/LoadingButton
forward button refs; Input forwards root and native input refs. Select forwards
its root ref, generates a stable control ID when one is omitted, and associates
its visible label with custom and native comboboxes; explicit `id` and `labelId`
remain authoritative. LoadingButton
retains the label and disables the action while loading (default spinner 14px).
`loadingPosition="startIcon"` replaces the caller's start icon while loading
and restores it when idle; consumer adapters retain their 16px default.
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
inside its theme root. Trigger/popover IDs are stable across SSR hydration.

Loader announces a loading status (default accessible name: "Loading...") and
shows visible text only when supplied. `size` accepts a number or CSS dimension;
the legacy 90px maximum remains. PageLoader centers it in an absolute full-page
region and accepts `slotProps.loader` for loader-specific attributes.
Snackbar accepts plain text or React content in `message`, plus `action`,
`severity`, `variant`, `alertsx`, and MUI Snackbar lifecycle props. Strings are
never parsed as HTML. Its scrollable message region retains the legacy 50px
height cap. Base's adapter alone preserves sanitized legacy HTML messages.

Dialog composes a controlled MUI dialog with `titleComponents`, `actionComponents`,
`onCloseButton`, `disabledClose` and `dividers`. MUI `onClose` retains its reason
argument; the explicit close-button callback is separate. A provider scopes its
overlay; an explicit `container` overrides that default. Hosts can replace or
suppress `header`, supply `contentRef`, title/content/action props, and append
`surfaceChildren` for interaction adornments. Hosts own sizing, maximize/resize,
drag integration via PaperComponent, stacking, telemetry and workspace policy.

EmptyState accepts host-supplied `title`, `description`, `illustration` and
`action`, plus wrapper/content Box props. ErrorFallback composes a title and
optional description/action in a padded section. LoadingOverlay receives
controlled `open` and status content, with explicit backdrop props. These
surfaces do not catch errors, dispatch loading, select support addresses or
open navigation. Hosts own those decisions.

React / ReactDOM, Material / icons and Emotion are external peers. The verified
matrix is React 18.3.1, Material/icons 5.18.0, Emotion 11.14.0 / 11.14.1.
ESM and declarations are shipped; no CommonJS export is promised.
Core excludes grid/date/Pro integrations and WebKit element registration.

Date integrations require `@mui/x-date-pickers@6.20.2` and `dayjs@1.11.21`.
Range also requires `@mui/x-date-pickers-pro@6.20.2`; the host owns MUI X Pro
licensing and license initialization. These peers are optional and never loaded
by the core entry point. Wrap dates in LocalizationProvider with AdapterDayjs;
the host chooses `adapterLocale`, timezone, formats and validation policy.
Controls retain `labelPosition="top" | "left"`, `hidden`, Dayjs values and MUI X
callbacks. Community date controls preserve omitted `value` as uncontrolled so
`defaultValue` works, while explicit `null` remains controlled-empty. Caller
`slotProps` replaces the default shrink text-field props;
range always uses SingleInputDateRangeField and preserves null endpoints in empty
and partial controlled values. Field identifiers belong in
`slotProps.textField.inputProps`; MUI X 6 ignores top-level data attributes.
The compiled `fixtures/consumer/src/dates.tsx` demonstrates the public imports.

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

## Development

Run `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, and
`npm run build:storybook`. `npm run verify:package` packs and installs into a
temporary independent consumer, checks declarations/assets/SSR/tree shaking,
and prints its path. Run `npm run dev` in that printed consumer for port 8019.
Use `npm run storybook` for appearance controls and component states on 6019.

`tokens:generate` regenerates committed assets from WebKit 2.0.5; provenance
hashes are in `assets/webkit-sources.json`. Ordinary builds need no sibling
checkout. See NOTICE.md for asset licensing restrictions. Registry, release
owners and redistribution approval must be confirmed before publishing.
Base, Ratan and Cashflow use package presentation behind their existing exports.
See [the inventory](../../docs/UI_PACKAGE_INVENTORY.md) for deliberate portal
boundaries and [release/rollback](../../docs/UI_PACKAGE_RELEASE.md) for versioning,
review responsibilities, adoption and publication gates.

The [2026-09-19 clinic](../../docs/UI_PACKAGE_CLINIC.md) records the package's
behavior, accessibility, token, distribution, and adoption review. Use the
[fix tracker](../../docs/UI_PACKAGE_FIX_TRACKER.md) for the ordered remediation
backlog, acceptance criteria, and completion evidence.

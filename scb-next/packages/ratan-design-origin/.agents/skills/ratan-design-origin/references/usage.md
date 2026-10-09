# Component Usage

Check the package [contract matrix](../../../../README.md#public-contract-matrix)
and [export map](../../../../package.json) before choosing props or import paths.
This package is ESM with TypeScript declarations and React/MUI/Emotion peers;
it does not promise CommonJS support or install host UI runtimes.

## Imports and appearance

Load the scoped stylesheet once at the host entry, then import only the requested
components. The host supplies appearance and its own state:

```tsx
import { RatanDesignProvider } from 'ratan-design-origin/provider';
import { Button } from 'ratan-design-origin/button';
import { Input } from 'ratan-design-origin/input';
import 'ratan-design-origin/styles.css';

export function ReferenceForm() {
  return (
    <RatanDesignProvider mode="light" designGeneration="webkit">
      <Input variant="outlined" label="Reference" />
      <Button variant="contained" type="submit">Submit</Button>
    </RatanDesignProvider>
  );
}
```

Use the README's direct-path table rather than guessing a kebab-case path or
importing private `dist`/`src` files. Direct modules still load their required
dependencies: for example, PageLoader uses Loader and Dialog uses shared overlay
context. Root imports can traverse the export barrel even when unused final code
is removed. UI peer bytes are separate from package-code tree-shaking evidence.

If the host already owns a MUI theme, pass it as `baseTheme` to preserve its theme
policy while adding scoped appearance/overlays. `useRatanAppearance` is exported
from `/provider` for forwarding the resolved mode/generation to independently
mounted remotes. Preserve each host's intentional palette and provider boundary;
sharing React alone does not establish shared appearance across every MFE root.

The provider scopes variables and overlay containers to `.ratan-design-root`;
it does not apply a document reset or read URL/storage preferences. Dialog's
explicit `container` overrides the provider container. Diagnose overlay styling
by checking the actual portal destination and its ancestor appearance root.

WebKit uses packaged SC Prosper Sans; legacy Poppins is host-provided. Check
computed styles, font loading, theme defaults, and CSS variable ancestry when
text or controls appear too large. Put shared visual policy in the package's
tokens/theme; use supported component props for deliberate host customization.
In a source checkout, author token changes in `src/tokens/webkit-theme.json`
and regenerate through `tokens:generate` with the required canonical inputs.
Treat generated CSS/theme outputs and `dist` as build products. Ordinary builds
consume committed generated assets and do not require a sibling WebKit checkout.

## Contract decisions that matter

| Surface | Usage decision |
| --- | --- |
| Button / LoadingButton | Direct components inherit MUI button `type`; legacy `type="primary"` translation belongs to a compatibility adapter. LoadingButton defaults to a 14px inline spinner; a migrated Base adapter may deliberately preserve a 16px start-icon spinner. |
| Input / Select | Preserve the declared variant restrictions and root/native-input ref distinction. Input's modern `slotProps` take precedence over equivalent legacy props. Select needs its supported explicit variant and keeps MUI `(event, child)` change arguments. |
| SearchInput / SearchCondition | SearchInput requires `handleClear`; set `clearButtonLabel` for field-specific/localized naming. Criteria values and `onClose` removal remain caller-owned. |
| Builder | Keep `anchorEl` and selected tab state in the host; clear the anchor when closure is requested. Import `builderTabProps` with BuilderTab from `/builder-tab` to keep generated tab/panel relationships without a root import. Inactive panels stay mounted. |
| Dialog | Core `open` is controlled. Keep MUI `onClose(event, reason)` distinct from `onCloseButton`. Use the supported header/content/action slots; size, drag, resize, maximize, stacking, and telemetry remain host policy. |
| Snackbar | Pass plain text or React nodes. Legacy sanitized HTML handling stays in the Base adapter. Preserve the Snackbar close reasons and accessible notification behavior. |
| EmptyState / ErrorFallback / LoadingOverlay | Supply host copy/actions and controlled loading state. ErrorFallback renders presentation; the host error boundary captures errors. A closed overlay must release pointer input. |

Check the full contract matrix for the selected surface's refs, accessibility,
controlled values, defaults, and style precedence. Retain accessible names and
explicit ARIA relationships when composing or adapting controls.

## Dates and optional integrations

Read `peerDependencies` and `peerDependenciesMeta` before installing optional
integrations. Core consumers need no MUI X, grid, Pro, or Dayjs integration;
an ancestor-hoisted dependency is not a substitute for a host declaration.

Use `/date-picker`, `/date-time-picker`, or `/time-picker` for a single community
control. `/dates` also exports `LocalizationProvider`, `AdapterDayjs`, and Dayjs
types. The host owns locale, timezone, formats, validation, and values:

```tsx
import { DatePicker } from 'ratan-design-origin/date-picker';
import { LocalizationProvider, AdapterDayjs } from 'ratan-design-origin/dates';

export function SettlementDate() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker label="Settlement date" defaultValue={null} />
    </LocalizationProvider>
  );
}
```

Omitted `value` remains uncontrolled, including `defaultValue`; explicit `null`
is controlled-empty. Keep caller slot props and the documented final `hidden`
behavior. Field identifiers belong in `slotProps.textField.inputProps` for the
supported MUI X generation.

Use `/date-range` only when the host explicitly needs the Pro single-input range
control and declares its peers. The host owns Pro license initialization and
localization; preserve empty and partially null range endpoints.

## CSS-only tokens

For pages without a React provider, explicitly import
`ratan-design-origin/tokens.css` or link that stylesheet from the deployed asset
path. It defaults to WebKit/light at document scope; use the README's supported
HTML appearance attributes for other modes. `styles.css` is scoped to provider
roots. Neither stylesheet creates React components, registers WebKit elements,
or chooses the host's persisted preferences. Use documented semantic variables
or `/tokens` exports rather than inventing token names.

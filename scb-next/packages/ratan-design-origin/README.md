# Ratan Design Origin

Internal standalone React 18 / Material UI 5 design-system candidate. The first
slice contains Button, LoadingButton, Input, Select, SearchInput, SearchButton,
ResetButton, ToggleButton, Label, explicit theme factories, and legacy / SC
WebKit tokens. No Base store, auth, router or services are needed.

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
- `ratan-design-origin/compatibility`: existing CSS alias strings and
  `InputStyled`; retained for Base adapters, not a new customization contract.
- `ratan-design-origin/styles.css`: scoped canonical WebKit variables and fonts.

Controls accept MUI 5 props. Input also translates Base's modern slot spelling
to MUI 5, with slots taking precedence over legacy props. Button/LoadingButton
forward button refs; Input forwards root and native input refs. Select forwards
its root ref and associates its visible label with the combobox. LoadingButton
retains the label and disables the action while loading (default spinner 14px).
SearchInput composes Input with search and clear adornments. SearchButton,
ResetButton, ToggleButton and Label preserve the existing Base contracts while
their implementations and visual policy are now owned by this package.

React / ReactDOM, Material / icons and Emotion are external peers. The verified
matrix is React 18.3.1, Material/icons 5.18.0, Emotion 11.14.0 / 11.14.1.
ESM and declarations are shipped; no CommonJS export is promised.
Core excludes grid/date/Pro integrations and WebKit element registration.

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
Remaining catalog, remote-adapter integration and release governance are later
stages of `../../docs/UI_PACKAGE_EXTRACTION_PLAN.md`.

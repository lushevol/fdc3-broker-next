# @fm/ratan-design

## Unreleased

### Changed

- Replaced MUI and Emotion internals with React Aria Components and scoped semantic CSS.
- Removed MUI and Emotion peer dependencies and all MUI-derived public prop types.
- Added optional local portal targeting to `DesignSystemProvider` for host and Tile overlay containment.
- Preserved controlled Button, TextField, NumberField, StatusBadge, Dialog, ConfirmationDialog, and InlineAlert behavior with React Aria focus, dismissal, labeling, and validation semantics.
- Added form/login, shell feedback, selection controls, and profile data-display primitives for the first migration waves.
- Added the independent `mfe-identity-profile` verification consumer to exercise the packed public API in host-mounted and standalone modes.

### Compatibility

- `NumberField` now follows React Aria's locale-aware text editing semantics and exposes an accessible number-field description rather than relying on a native `type="number"` spinbutton.
- Public Ratan APIs remain implementation-neutral; React Aria types are not re-exported.

## 1.1.0

### Added

- Added controlled `NumberField`, compositional `Dialog`, bounded `ConfirmationDialog`, and application-local `InlineAlert` APIs.
- Added keyboard, focus restoration, loading repeat-prevention, validation association, and live-region behavior tests.
- Added Storybook and standalone-demo coverage plus packed-consumer checks for the interaction surface.

### Compatibility

- This is additive: every 1.0.0 export and semantic token remains available with compatible behavior.
- Applications still own form state, domain formatting, authorization, request lifecycle, service calls, and cross-MFE communication.

## 1.0.0

### Major changes

- Replaced the unconsumed experimental `ratan-design@0.x` identity with the scoped production foundation.
- Added typed semantic tokens, generated scoped CSS, local MUI/Emotion provider, Button, TextField, and StatusBadge.
- Removed experimental Ant-based Input, Card, legacy Button, CSS cleanup utilities, and broad primitive token exports.
- React, ReactDOM, MUI, and Emotion are now peer dependencies and externalized from builds.

### Migration

There were no repository consumers of `ratan-design@0.x`. New consumers install `@fm/ratan-design`, wrap their root in `DesignSystemProvider`, and use the bounded v1 components. Historical prototypes remain available through Git history rather than production exports.

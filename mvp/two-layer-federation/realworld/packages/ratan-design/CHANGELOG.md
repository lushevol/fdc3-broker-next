# @fm/ratan-design

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

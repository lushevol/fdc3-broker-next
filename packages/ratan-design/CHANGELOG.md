# @fm/ratan-design

## 1.0.0

### Major changes

- Replaced the unconsumed experimental `ratan-design@0.x` identity with the scoped production foundation.
- Added typed semantic tokens, generated scoped CSS, local MUI/Emotion provider, Button, TextField, and StatusBadge.
- Removed experimental Ant-based Input, Card, legacy Button, CSS cleanup utilities, and broad primitive token exports.
- React, ReactDOM, MUI, and Emotion are now peer dependencies and externalized from builds.

### Migration

There were no repository consumers of `ratan-design@0.x`. New consumers install `@fm/ratan-design`, wrap their root in `DesignSystemProvider`, and use the bounded v1 components. Historical prototypes remain available through Git history rather than production exports.

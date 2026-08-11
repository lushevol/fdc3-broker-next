# Button

## Purpose
Trigger actions and native form submission with the frozen WebKit button presentation.

## Guidance
Use `variant` for hierarchy and `tone` for semantic intent. Keep `loadingLabel` localized; loading preserves focus and the accessible name while announcing progress.

## API
`variant`, `tone`, `size`, `loading`, `loadingLabel`, selectable state, icons, native button attributes, and forwarded refs are supported. See `buttonExample` in `src/examples/proof.tsx`.

## Tokens
Consumes the frozen `--sc-button-*`, typography, color, spacing, border, and focus tokens.

## WebKit mapping
`sc-button` maps legacy `type` to `variant`, legacy `state` to `tone`, `sc-click` to `onPress`, and native form behavior to React button attributes.

## Deviations
Loading uses a stable live region and localized `loadingLabel`, correcting the legacy missing announcement without changing geometry.

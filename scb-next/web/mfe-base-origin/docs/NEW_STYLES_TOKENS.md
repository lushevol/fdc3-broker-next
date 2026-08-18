# New styles token migration

## Scope

`src/new-styles` is the additive design-token surface for the SCB Next Base
micro-frontend. It exposes semantic application roles backed only by
`@scdevkit/webkit` CSS custom properties.

## Requirements

1. Token values must reference `--sc-*` WebKit variables through `var(...)`.
2. Color, typography, spacing, radius, and shadow roles must be available.
3. Components, layout, theme selection, and the existing `src/theme` contract
   must remain unchanged.
4. The token surface must be exported by the Base remote for incremental
   consumers.

## Non-goals

- Replacing MUI or existing Base components.
- Changing light/dark mode behavior.
- Migrating component structure or layout styles.
- Defining fallback values that duplicate WebKit design-token values.

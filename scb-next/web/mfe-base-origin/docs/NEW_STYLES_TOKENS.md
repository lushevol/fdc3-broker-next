# New styles token migration

## Scope

`src/new-styles` exposes the typed SCB Next Base design-token surface. The live
portal's existing token declarations under `src/theme/config/color*.ts` are
backed by `@scdevkit/webkit` CSS custom properties.

## Requirements

1. Token values must reference `--sc-*` WebKit variables through `var(...)`.
2. Color, typography, spacing, radius, and shadow roles must be available.
3. Existing legacy token names must remain available for remote MFE consumers.
4. Existing portal selectors must remain active alongside WebKit light/dark
   mode selectors.
5. Components and layout declarations must remain unchanged.
6. The token surface must be exported by the Base remote for incremental
   consumers.

## Feature flag

Pass `newStyles: true` to the Base `App` or `MountComponent` props to enable
the WebKit token aliases and mode selectors. The flag defaults to `false`, so
existing remote hosts retain the legacy token values until they opt in.
For the standalone portal, use the equivalent `?new-styles=true` query
parameter.

## Non-goals

- Replacing MUI or existing Base components.
- Changing light/dark mode behavior.
- Migrating component structure or layout styles.
- Defining fallback values that duplicate WebKit design-token values.

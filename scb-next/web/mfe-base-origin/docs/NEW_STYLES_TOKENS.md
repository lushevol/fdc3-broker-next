# New styles foundation and Portal appearance

The token-only migration below is the historical baseline. The next phase follows
[NEW_STYLES_SPEC.md](NEW_STYLES_SPEC.md) and
[NEW_STYLES_IMPLEMENTATION_PLAN.md](NEW_STYLES_IMPLEMENTATION_PLAN.md): responsive
Base composition, both themes, and necessary motion/interactions. Foundation
helpers/assets are prepared first; component activation follows in verified stages.

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
5. Legacy component/layout behavior stays compatible; prototype composition is
   introduced through the explicit appearance contract in the new specification.
6. The token surface must be exported by the Base remote for incremental
   consumers.

## Feature flag

Pass `newStyles: true` to the Base `App` or `MountComponent` props to enable
the WebKit token aliases and mode selectors. The flag defaults to `false`, so
existing remote hosts retain the legacy token values until they opt in.
For the standalone portal, use the equivalent `?new-styles=true` query
parameter.

The prototype foundation defines `resolvePortalAppearance(newStyles, search)`:
the enabled prop selects `prototype`, otherwise `new-layout=true` retains
`layout-preview`, and the default is `legacy`. Integration must use this same
decision for embedded and standalone Base. `portalTokens` contains Base-owned
brand colors and measured geometry; existing `newStyleTokens` continues to expose
the shared WebKit alias surface without breaking its contract.

## Non-goals

- Replacing the shared component library.
- Changing production authentication, entitlement, or tenant-launch contracts.
- Changing historical shared Portal theme defaults for all consumers.
- Defining fallback values that duplicate WebKit design-token values.

# @fm/ratan-design-webkit

`@fm/ratan-design-webkit` is the public adoption boundary for the next Ratan
design system. It gives applications one stable import while the WebKit
component source drop is made production-ready.

## Current public surface

- `DesignSystemProvider` activates the WebKit layer and preserves the existing
  appearance, direction, density, overlay, and accessibility contracts.
- `Dialog` uses the imported Lit/Shoelace `ScDialog` implementation for normal
  dismissible dialogs. Non-dismissible dialogs retain the established React
  implementation until WebKit exposes matching dismissal controls.
- The established Ratan React components are re-exported as a compatibility
  surface so consumers can migrate their package boundary independently from
  individual component replacements.
- `styles.css` contains the established component styles plus semantic
  `--sc-*` aliases used by WebKit components.

## Imported component source

The `src/components` directory contains the imported Lit component source.
Components are promoted into the production entry individually after their
dependency chain and React contract are validated. `ScDialog` is the first
promoted component; the remaining components still require registration and
supporting modules from:

- `src/assets`
- `src/elements`
- `src/mixins`
- `src/controllers`
- `src/types`

Publishing those sources without their local modules would create a package
that installs successfully but fails when a consumer bundles it. Add and test
the missing foundation before exporting individual `Sc*` elements.

## Commands

```bash
npm --workspace @fm/ratan-design-webkit test
npm --workspace @fm/ratan-design-webkit run lint
npm --workspace @fm/ratan-design-webkit run build
```

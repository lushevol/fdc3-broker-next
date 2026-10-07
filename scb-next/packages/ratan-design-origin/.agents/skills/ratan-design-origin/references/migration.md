# Migration and Extraction

Resolve whether the request is a new package consumer, a transparent migration
of existing imports, or extraction of a new reusable component. Use the selected
SCB Next package in each case. Preserve user-selected scope and visual generation.

## Capture the consumer contract

Inspect the old component, actual callers, provider, manifest, build/test alias
resolution, and existing tests. Record only the relevant observable contract:
named/default/namespace exports, prop types and defaults, controlled/null values,
callback arguments, refs, selectors, portal destination, and appearance behavior.
Add a focused contract test before replacing an existing implementation.

Classify responsibilities from the code:

- Adopt an existing public component when it already meets the contract.
- Move generic presentation, styling, and presentation state into the package.
- Keep auth, services, storage, routing, loading orchestration, analytics,
  session/workspace behavior, and browser registration in the host.

For the SCB source checkout, the maintained inventory is
`scb-next/docs/UI_PACKAGE_INVENTORY.md`. The standalone repository guides under
`docs/SCB_MFBASE_RATAN_DESIGN_MIGRATION_GUIDE.md` and
`docs/SCB_MFBASE_COMPONENT_EXTRACTION_TO_RATAN_DESIGN_GUIDE.md` provide project
migration and component-extraction detail when present. A tarball consumer can
work from this skill, its package README/declarations, and its own host source.

## Adopt behind existing imports

Install the package using the host's workspace/file or approved artifact
convention and verify its declared peer ranges. Follow the host's existing
package/bundler strategy; preserve runtime identity for React, MUI, and Emotion.
In SCB's Vite hosts this uses deduplication, with Vitest `ssr.noExternal` where
those hosts need package transformation. Preserve the existing federation sharing
policy as part of this migration.

Replace the old implementation with a thin adapter/reexport after the package
contract exists. Keep old `@fm/base` imports and namespace/default shapes when
transparent adoption is requested. Ratan/Cashflow bridges can consume the
migration-only `/base-compat` namespaces, including `{ default: Component }`;
new standalone consumers use direct named components.

Check actual adapter quirks instead of copying core defaults blindly. Examples
include `type="primary"` translation, 16px start-icon loading, default-open
compatibility Dialog, portal placement, and the Loader namespace. Retain non-UI
services and navigation bridges in the host. Use `/compatibility` only for
existing selector/styled-surface contracts that callers still require.

Keep mode selection, persisted preferences, and each application's
`MfeThemeProvider` in the host. Pass explicit appearance to the scoped provider
and forward it across MFE mounts. Use `/portal-theme` only when retaining the
historical host reset/grid/config policy is part of the request. Package adoption
alone does not authorize switching generations or changing document policy.
In Base, place new portal-specific appearance composition and switching logic
under `src/new-styles`; keep reusable supported visual behavior in this package.
Preserve the original host's existing provider/CSS wiring until its replacement
has been verified, since a component reexport alone cannot supply scoped tokens.

## Extract a new public component

Implement the smallest reusable contract in the package with host policy passed
as props/callbacks. Keep optional integrations behind separate public entries.
For a new surface, update its specification/contract test, implementation, types,
meaningful catalog states, consumer fixture, and public ownership documentation.
Use the source checkout's inventory and implementation records when available.

Keep direct components in independent modules, composing only required helpers.
Retain shared context identity between a provider and its consumers. Add the
module as an explicit library entry in `vite.config.ts`, its ESM/types mapping
in `package.json.exports`, and the corresponding legacy `typesVersions` mapping.
Preserve established root exports when extending the package. Check emitted JS
as well as declarations: `preserveModules` alone can remove a non-entry module's
public reexport during the producer build.

Keep JavaScript side-effect-free, preserve justified PURE annotations on pure
module initialization, and retain explicit CSS side effects. Add the new direct
entry's required package-module graph to `scripts/verify-tree-shaking.mjs` and
its type/runtime imports to the packed-consumer fixtures. Check SSR when changing
external import shapes; passing workspace tests alone cannot establish packed
SSR compatibility.

Complete each requested stage through the [appropriate checks](validation.md)
and update imports/ownership guidance to match the shipped API. Preserve old
consumer paths until their removal is explicitly part of the migration contract.

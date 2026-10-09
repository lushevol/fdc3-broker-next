# SCB MFE Base styles backport

## Objective and source

Create `scb/web/mfe-base` directly from the original `scb/web/mfe-base-origin` at
repository revision `289efa83`, then adopt the accepted presentation from
`scb-next/web/mfe-base-origin` and the maintained
`scb-next/packages/ratan-design-origin` package. The original remains untouched.

## Required contracts

- Preserve Webpack, Single-SPA/SystemJS lifecycle exports, original `@fm/base`
  namespaces, import-map names, dynamic SystemJS remote loading, services,
  authentication/session timing, analytics, entitlements and workspace policy.
- All added appearance implementation and selection belongs in `src/new-styles`.
  Existing public paths delegate; reusable controls/theme/icons/tokens come from
  public `ratan-design-origin` entries. No duplicate design-package fork.
- Render the accepted WebKit login, shell, empty workspace, profile menu/popup,
  New Tile drawer and workspace tabs with compact typography/control dimensions,
  contained avatar/header backgrounds, aligned non-flickering switches, light/dark
  themes, responsive layout and reduced-motion behavior.
- Default the adapted copy to WebKit; explicit `newStyles=false` retains the
  original legacy layout. An explicit query flag is useful for standalone proof.
- The local Legacy/WebKit switch and styling console appear only in development
  on loopback hosts. Switching updates URL/context without document reload or
  changing auth/expiry/workspaces. Existing shell boundaries may remount tiles.
  Production includes neither development control implementation.
- Consume a built package artifact and its explicit combined CSS/fonts. Verify
  Webpack/Jest consumption and every original root namespace. Retain optional
  community/Pro entry boundaries and existing host licensing policy.
- Independently mounted SystemJS remotes receive explicit resolved appearance
  props without changing their import-map addresses or package sharing policy.

## Acceptance

Verify copied source provenance and original source immutability; tests for public
namespace/default contracts, light/dark/WebKit/legacy policy, typed appearance
forwarding, local gates and assets; strict TypeScript, zero-warning changed-code
lint, Webpack production output and browser evidence. Log in, open New Tile,
launch a tile, remove its workspace tab, inspect avatar/profile and switch both
styles. Prove production development-code exclusion and record limitations.

Document reproducible setup, dependency versions, package source/checksum,
commands and validation evidence beside this copied project. Commit only this
migration stage; preserve all unrelated checkout changes.

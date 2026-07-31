# Portal Host Ratan Design Migration

## Principle

All basic UI components in the portal host come from the public
`@fm/ratan-design-webkit` API. Host code may compose page landmarks and remote
mount boundaries, but it must not create a local visual or interactive
replacement for a Ratan primitive.

## Requirement

The portal host must compose its production user interface from the public
`@fm/ratan-design-webkit` API. The host continues to own application state,
routing, capability injection, and layout composition.

The WebKit package is the migration boundary. It activates the `--sc-*` token
layer and preserves the established React component contracts while imported
Lit components are validated and promoted individually. Dismissible dialogs
now render the promoted `ScDialog` implementation; non-dismissible dialogs
retain the established implementation until WebKit exposes equivalent
dismissal controls.

## Design ownership

Ratan owns:

- page-header presentation and action placement;
- dialogs, searchable fields, action menus, avatars, and notification controls;
- closable workspace-tab behavior, including keyboard navigation;
- cards, description lists, forms, fields, links, buttons, toggles, progress,
  empty states, error states, and toast feedback.

The portal host owns:

- semantic page landmarks and responsive grid layout;
- registry, tab-instance, authentication, and appearance state;
- remote application mount containers and composition-boundary attributes;
- the content passed into Ratan components.

## Required behavior

1. The shell header uses `PageHeader` as a single responsive app bar. It shows
   `Markets Operations One` at the left and, at the right, New tile, theme,
   notification, and avatar controls.
2. New tile opens a Ratan `Dialog` with a Ratan `TextField`. Registry entries
   are grouped by category and filter by title or description; selecting one
   opens a fresh workspace instance.
3. The avatar uses the Ratan action-menu primitive and exposes Profile and
   Logout actions.
4. Open applications use `WorkspaceTabs`. Tabs support pointer activation,
   Left/Right/Home/End keyboard navigation, an accessible close action, and
   persistent mounted panels while another tab is active.
4. Login and shell information surfaces use `Card` and `DescriptionList`.
5. Registry loading, remote loading, and all contained failures use Ratan
   progress/error components. Retry actions use the Ratan `Button`.
6. No production portal-host source may render a native `button` directly.
7. Remote mount elements remain plain host-owned elements because they are
   integration boundaries rather than visual components.

## Visual principles

- Preserve the dense post-trade operations character and the visible
  `Host → Application` runtime seam.
- Use only Ratan semantic tokens for color, typography, spacing, radius,
  elevation, focus, density, and motion.
- Keep the app bar one line while truncating the title and compacting controls
  at narrow widths; never let actions overlap the workspace.
- Follow the GDS page-header, modal, menu, tabs, card, and progress
  guidance checked into `packages/ratan-design/gds-official`.

## Acceptance

- Ratan package tests cover semantics and keyboard behavior for every new
  component, and each new component has a Storybook story.
- Portal tests verify the design-component boundaries and remote failure states.
- Package and portal test coverage remain above 90% for lines and branches.
- Ratan and portal build, lint, and browser smoke checks pass.

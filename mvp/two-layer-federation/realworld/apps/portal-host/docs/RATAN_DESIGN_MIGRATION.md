# Portal Host Ratan Design Migration

## Principle

All basic UI components in the portal host come from the public
`@fm/ratan-design` API. Host code may compose page landmarks and remote mount
boundaries, but it must not create a local visual or interactive replacement
for a Ratan primitive.

## Requirement

The portal host must compose its production user interface from the public
`@fm/ratan-design` API. The host continues to own application state, routing,
capability injection, and layout composition.

## Design ownership

Ratan owns:

- page-header presentation and action placement;
- application-level side navigation;
- closable workspace-tab behavior, including keyboard navigation;
- cards, description lists, forms, fields, links, buttons, toggles, progress,
  empty states, error states, and toast feedback.

The portal host owns:

- semantic page landmarks and responsive grid layout;
- registry, tab-instance, authentication, and appearance state;
- remote application mount containers and composition-boundary attributes;
- the content passed into Ratan components.

## Required behavior

1. The shell header uses `PageHeader` and exposes the workspace title,
   architecture eyebrow, appearance actions, and runtime seam.
2. The application launcher uses `SideNavigation`. Each registry application
   is an action that opens a fresh workspace instance.
3. Open applications use `WorkspaceTabs`. Tabs support pointer activation,
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
- Keep the launcher available beside the workspace on wide screens and stack it
  above the workspace on narrower screens without overlap.
- Follow the GDS page-header, side-panel-navigation, tabs, card, and progress
  guidance checked into `packages/ratan-design/gds-official`.

## Acceptance

- Ratan package tests cover semantics and keyboard behavior for every new
  component, and each new component has a Storybook story.
- Portal tests verify the design-component boundaries and remote failure states.
- Package and portal test coverage remain above 90% for lines and branches.
- Ratan and portal build, lint, and browser smoke checks pass.

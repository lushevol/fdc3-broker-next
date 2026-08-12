# Centralized New Layout Design

## Goal

Move every custom `new-layout=true` implementation in `@fm/base` into one
`src/new-layout/` module. Preserve the existing portal as the unconditional
default implementation and select the opt-in experience at one top-level
gateway.

## Scope

The new-layout module owns all presentation and composition introduced for the
opt-in portal experience:

- Home page header and workspace-tab composition
- App Bar and its New Tile, theme, and avatar controls
- Tile Library modal, search, category navigation, sorting, favorites, and usage
  views
- Profile modal and Local/UTC preference
- Workspace tab presentation
- Empty workspace and loading splash surfaces
- SC Dev WebKit React adapters and scoped CSS overrides
- New-layout-only images and visual assets
- New-layout theme overrides

Authentication, application state, analytics, workspace operations, tile
launching, logout, FDC3 integration, and other business behavior remain shared.

## Module Boundary

The implementation will live under:

```text
apps/base/src/new-layout/
├── index.tsx
├── NewLayoutExperience.tsx
├── components/
│   ├── AppBar/
│   ├── Avatar/
│   ├── Empty/
│   ├── NewTile/
│   ├── Profile/
│   ├── Splash/
│   ├── ThemeSwitch/
│   ├── TileLibrary/
│   └── WorkspaceTab/
├── pages/
│   └── Home/
├── theme/
├── webkit/
│   ├── components.ts
│   └── styles.css
└── assets/
```

The exact internal file count may vary as responsibilities are extracted, but
all opt-in presentation code must remain below this folder.

## Gateway Interface

`src/new-layout/index.tsx` is the only application module that reads the
`new-layout` URL parameter. It exposes a small experience-selection interface
used by `App.tsx`:

```ts
export const isNewLayoutEnabled: () => boolean;
export const PortalExperience: React.FC<PortalExperienceProps>;
```

`PortalExperience` selects one of two complete adapters:

- Legacy adapter: existing `Theme` and `Routing` composition.
- New-layout adapter: new-layout theme and routing composition from this module.

No legacy component, page, style, theme configuration, or shared hook may read
the feature flag.

## Legacy Invariants

With the flag absent, false, or any value other than the exact string `true`:

- The original fixed 50px MUI App Bar is used.
- The original gradient, shadow, spacing, title, avatar menu, New Tile control,
  theme switch, timezone switch, and survey behavior remain intact.
- The workspace tab row remains outside the App Bar header.
- The original MUI drawer, tile cards, and resizable profile dialog are used.
- Legacy components do not import SC Dev WebKit, new-layout CSS, or new-layout
  assets.
- Existing public exports keep their current legacy behavior.

## New Layout Invariants

With `new-layout=true`:

- The 96px composite portal header and its current App Bar/workspace-tab split
  are retained.
- The App Bar uses the current WebKit New Tile, theme, and avatar controls.
- Clicking the avatar opens profile details directly.
- Profile owns the Local/UTC preference and direct logout action.
- Tile Library retains search, category synchronization, sorting, favorites,
  usage ranking, and tile launch behavior.
- Empty and loading workspace surfaces retain their current WebKit design.
- Current modal dimensions, responsive behavior, and prototype-aligned styling
  remain unchanged.

## Shared Behavior

Layout implementations may consume shared hooks, types, controllers, and
business operations. Shared modules must remain layout-neutral: they may expose
state and commands but may not import from `src/new-layout/` or branch on the
feature flag.

Where an existing controller mixes presentation state with business behavior,
the reusable behavior will be extracted behind a typed hook or passed into the
layout adapter. This keeps the dependency direction one-way:

```text
App gateway -> legacy or new-layout presentation -> shared business modules
```

Shared and legacy modules never depend on new-layout presentation code.

## Styling And Assets

All selectors created for the opt-in experience move to
`src/new-layout/webkit/styles.css` or a focused style file below
`src/new-layout/`. The stylesheet is loaded only by the new-layout adapter.

New-layout-only background images, portal wordmarks, profile images, and icons
move below `src/new-layout/assets/`. Original assets used by legacy modules stay
in their existing locations.

Legacy MUI style files are restored to contain only legacy selectors. Theme
configuration is split into stable legacy defaults plus new-layout overrides
owned by the new-layout module.

## Migration Strategy

1. Add architecture tests that fail while flag reads, WebKit imports, and
   new-layout selectors remain outside the central folder.
2. Create the gateway and move WebKit adapters, CSS, and assets.
3. Extract new-layout versions of leaf surfaces while restoring legacy files to
   unconditional implementations.
4. Extract the new-layout App Bar and Home composition.
5. Move theme overrides and remove the old shared feature-flag hook.
6. Verify dependency direction, tests, builds, and both routes visually.

The migration must preserve behavior at every step. A moved implementation may
reuse shared controllers, but it must not leave a forwarding new-layout branch
inside a legacy component.

## Test Contract

Automated tests will cover:

- Exact feature-flag semantics: only `new-layout=true` enables the new module.
- Architecture rule: no `new-layout`, `useIsNewLayout`, SC Dev WebKit import, or
  opt-in CSS marker exists outside the gateway/new-layout folder, except test
  fixtures and the specification.
- Legacy App Bar, avatar menu, New Tile launcher, theme/time controls, drawer,
  profile, workspace tabs, empty state, and splash behavior.
- New-layout App Bar, direct profile access, profile timezone/logout actions,
  Tile Library filters and navigation, empty state, splash, and workspace tabs.
- Theme selection for light and dark modes in both experiences.

Browser verification at `http://localhost:8001` will check login, New Tile,
tile launch, workspace tile removal, profile, empty workspace, and responsive
geometry on both:

- `http://localhost:8001/`
- `http://localhost:8001/?new-layout=true`

The production Base build and lint for all touched files must pass. Any unrelated
pre-existing test or type-check failure will be identified separately and must
not be hidden by this refactor.

## Non-Goals

- Changing the visual design or interactions of either experience
- Replacing shared state management or business controllers
- Changing public MFE exports
- Removing the runtime URL feature flag
- Refactoring unrelated portal or FDC3 functionality

## Completion Criteria

The refactor is complete when:

1. The runtime flag is evaluated at one gateway only.
2. All opt-in components, styles, theme overrides, and assets live under
   `src/new-layout/`.
3. Legacy modules contain no new-layout branches or WebKit dependencies.
4. Both routes satisfy the automated and browser verification contract.
5. GitNexus reports only the expected presentation and composition impact.

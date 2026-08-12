# Centralized New Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate every opt-in portal presentation change under `apps/base/src/new-layout/`, with one runtime feature gateway and unchanged legacy behavior by default.

**Architecture:** `App.tsx` delegates the themed/routed application tree to a `PortalExperience` gateway. The gateway is the only production code that reads `new-layout`; it selects the existing legacy Theme/Routing adapter or the complete new-layout adapter. New-layout views share business hooks and types but own their components, composition, styles, WebKit adapters, and assets.

**Tech Stack:** React 18, TypeScript, Material UI, SC Dev WebKit, Emotion, Jest and Testing Library, Rsbuild/SystemJS, Playwright.

## Global Constraints

- Only the exact query parameter `new-layout=true` enables the opt-in experience.
- Legacy modules must contain no feature-flag reads, SC Dev WebKit imports, or opt-in selectors.
- Existing public MFE exports retain legacy behavior.
- All new-layout presentation code, CSS, and assets live under `apps/base/src/new-layout/`.
- Shared hooks and controllers remain layout-neutral.
- Preserve current visuals and interactions on both routes.
- Do not stage or modify the existing user-owned `skills-lock.json` change.

---

### Task 1: Enforce The Central Module Boundary

**Files:**
- Create: `apps/base/src/new-layout/architecture.test.ts`
- Create: `apps/base/src/new-layout/featureFlag.test.ts`
- Create: `apps/base/src/new-layout/index.tsx`

**Interfaces:**
- Produces: `isNewLayoutEnabled(search?: string): boolean`
- Produces: `PortalExperience(props: Record<string, unknown>): ReactElement`
- Enforces: flag reads and WebKit presentation dependencies are restricted to `src/new-layout/`

- [ ] **Step 1: Write the failing architecture and feature-flag tests**

```ts
describe('new-layout module boundary', () => {
  it('keeps feature flag reads inside the new-layout gateway', () => {
    expect(findProductionMatchesOutsideNewLayout(/new-layout|useIsNewLayout/)).toEqual([]);
  });

  it('keeps SC Dev WebKit imports and opt-in selectors inside new-layout', () => {
    expect(findProductionMatchesOutsideNewLayout(/@scdevkit\/webkit|base-webkit-scope/)).toEqual([]);
  });
});

it.each([
  ['', false],
  ['?new-layout=false', false],
  ['?new-layout=1', false],
  ['?new-layout=true', true],
])('resolves %s to %s', (search, expected) => {
  expect(isNewLayoutEnabled(search)).toBe(expected);
});
```

- [ ] **Step 2: Run tests and verify RED**

Run:

```bash
cd apps/base
npm run test -- --runInBand src/new-layout/architecture.test.ts src/new-layout/featureFlag.test.ts --coverage=false
```

Expected: architecture assertions fail because flag reads, WebKit imports, and selectors remain scattered; the feature-flag import fails because the gateway does not exist.

- [ ] **Step 3: Add the minimal gateway parser and placeholder adapter interface**

```tsx
export const isNewLayoutEnabled = (search = window.location.search): boolean =>
  new URLSearchParams(search).get('new-layout') === 'true';
```

Keep the architecture test red until all migrations finish. Make only the flag parser test green in this task.

- [ ] **Step 4: Run focused tests**

Expected: feature-flag cases pass and architecture cases remain red for the enumerated existing files.

- [ ] **Step 5: Commit the test contract and parser**

```bash
git add apps/base/src/new-layout/architecture.test.ts apps/base/src/new-layout/featureFlag.test.ts apps/base/src/new-layout/index.tsx
git commit -m "test(base): define centralized new layout boundary"
```

### Task 2: Establish Experience And Theme Adapters

**Files:**
- Create: `apps/base/src/LegacyExperience.tsx`
- Create: `apps/base/src/new-layout/NewLayoutExperience.tsx`
- Create: `apps/base/src/new-layout/theme/index.tsx`
- Create: `apps/base/src/new-layout/theme/config.ts`
- Create: `apps/base/src/new-layout/theme/config.test.ts`
- Modify: `apps/base/src/App.tsx`
- Modify: `apps/base/src/theme/config/dark.ts`
- Modify: `apps/base/src/theme/config/light.ts`
- Modify: `apps/base/src/theme/config/utils.ts`
- Modify: `apps/base/src/theme/config/utils.test.tsx`

**Interfaces:**
- `LegacyExperience(props)` composes existing `Theme`, `FDC3Integration`, and `Routing`.
- `NewLayoutExperience(props)` composes `NewLayoutTheme`, `FDC3Integration`, and `NewLayoutRouting`.
- `getNewLayoutTheme(theme?: string)` returns the current flagged light/dark theme object.
- Legacy `getTheme(theme?: string)` becomes deterministic and URL-independent.

- [ ] **Step 1: Add failing adapter and theme parity tests**

Test that `PortalExperience` chooses `LegacyExperience` by default and `NewLayoutExperience` only for the exact enabled flag. Snapshot or object assertions must verify the known App Bar and New Tile theme differences for both light and dark modes.

- [ ] **Step 2: Run tests and verify RED**

Run the new gateway/theme tests plus `src/theme/config/utils.test.tsx`. Expected: adapter modules are missing and the legacy theme still reads the URL.

- [ ] **Step 3: Implement the experience gateway**

```tsx
export const PortalExperience: React.FC<PortalExperienceProps> = (props) =>
  isNewLayoutEnabled() ? <NewLayoutExperience {...props} /> : <LegacyExperience {...props} />;
```

Move the current provider descendants from `App.tsx` into the two adapters. Keep `LocalizationProvider` and the application state `Provider` above the gateway.

- [ ] **Step 4: Split theme configuration**

Make legacy dark/light factories unconditional using their current false branches. In `new-layout/theme/config.ts`, derive the current true-branch overrides for `MuiAppBar` and `NewTileComponent` without reading the URL. Import the new-layout stylesheet from `NewLayoutExperience`, not `App.tsx`.

- [ ] **Step 5: Run focused tests and build**

```bash
npm run test -- --runInBand src/new-layout/featureFlag.test.ts src/new-layout/theme/config.test.ts src/theme/config/utils.test.tsx --coverage=false
npm run build:app
```

- [ ] **Step 6: Commit the experience seam**

```bash
git add apps/base/src/App.tsx apps/base/src/LegacyExperience.tsx apps/base/src/new-layout apps/base/src/theme/config
git commit -m "refactor(base): add portal experience gateway"
```

### Task 3: Move WebKit And Leaf Surfaces

**Files:**
- Create: `apps/base/src/new-layout/webkit/components.ts`
- Create: `apps/base/src/new-layout/webkit/styles.css`
- Create: `apps/base/src/new-layout/components/Avatar/index.tsx`
- Create: `apps/base/src/new-layout/components/Profile/index.tsx`
- Create: `apps/base/src/new-layout/components/NewTile/index.tsx`
- Create: `apps/base/src/new-layout/components/ThemeSwitch/index.tsx`
- Create: `apps/base/src/new-layout/components/Empty/index.tsx`
- Create: `apps/base/src/new-layout/components/Splash/index.tsx`
- Create: `apps/base/src/new-layout/test/webkit-react-stub.tsx`
- Move: New Tile, theme switch, and profile assets into `apps/base/src/new-layout/assets/`
- Modify: `apps/base/jest.config.ts`
- Modify: `apps/base/src/components/Avatar/index.tsx`
- Modify: `apps/base/src/components/NewTile/index.tsx`
- Modify: `apps/base/src/components/Switch/index.tsx`
- Modify: `apps/base/src/components/SwitchTime/index.tsx`
- Modify: `apps/base/src/components/Empty/index.tsx`
- Modify: `apps/base/src/components/Splash/index.tsx`
- Modify: the corresponding legacy `common/style.ts` files
- Delete: `apps/base/src/components/webkit.ts`
- Delete: `apps/base/src/components/webkit.css`
- Delete: `apps/base/src/test/webkit-react-stub.tsx`

**Interfaces:**
- New-layout components consume existing typed props and shared controllers.
- Legacy components keep their current public default exports and render only MUI/original markup.
- `new-layout/webkit/components.ts` is the sole typed React adapter for SC custom elements.

- [ ] **Step 1: Extend portal-surface tests with direct legacy/new imports**

Assert that legacy components render original MUI markup with no URL setup and new-layout components render the current SC elements directly. Preserve profile timezone/logout and empty/splash assertions.

- [ ] **Step 2: Run tests and verify RED**

Expected: imports below `src/new-layout/components/` do not exist.

- [ ] **Step 3: Move WebKit adapters, stylesheet, and assets**

Update the Jest WebKit mapper to the new stub. Keep all CSS selectors scoped below `.base-webkit-scope` and preserve current modal dimensions and responsive rules.

- [ ] **Step 4: Extract new-layout leaf components**

Copy only the flagged branches into the new components. Reuse shared controllers such as Avatar, NewTile, Switch, and dispatcher hooks; do not import legacy view modules.

- [ ] **Step 5: Restore unconditional legacy leaf components and styles**

Remove `useIsNewLayout`, SC imports, new-layout assets, conditional markup, and opt-in selectors from each existing component. Restore the original MUI Empty and Splash implementations and retain current verified legacy profile behavior.

- [ ] **Step 6: Run focused tests, lint, and build**

```bash
npm run test -- --runInBand src/components/PortalSurfaces.test.tsx --coverage=false
npx eslint src/components/{Avatar,NewTile,Switch,SwitchTime,Empty,Splash}/**/*.{ts,tsx} src/new-layout/**/*.{ts,tsx}
npm run build:app
```

- [ ] **Step 7: Commit leaf-surface migration**

```bash
git add apps/base/jest.config.ts apps/base/src/components apps/base/src/new-layout
git commit -m "refactor(base): centralize new layout leaf surfaces"
```

### Task 4: Move Tile Library And App Bar

**Files:**
- Create: `apps/base/src/new-layout/components/TileLibrary/index.tsx`
- Create: `apps/base/src/new-layout/components/TileLibrary/Catalog.tsx`
- Create: `apps/base/src/new-layout/components/TileLibrary/TileCard.tsx`
- Create: `apps/base/src/new-layout/components/TileLibrary/types.ts`
- Create: `apps/base/src/new-layout/components/AppBar/index.tsx`
- Create: `apps/base/src/new-layout/components/AppBar/style.ts`
- Modify: `apps/base/src/components/AppBar/index.tsx`
- Modify: `apps/base/src/components/AppBar/common/style.ts`
- Modify: `apps/base/src/components/Drawer/index.tsx`
- Modify: `apps/base/src/components/Drawer/Menu.tsx`
- Modify: `apps/base/src/components/Drawer/MenuItem.tsx`
- Modify: `apps/base/src/components/Drawer/common/style.ts`
- Modify: `apps/base/src/components/NewTile/common/style.ts`

**Interfaces:**
- `NewLayoutAppBar` consumes the shared App Bar controller and owns New Tile, theme, avatar, and Tile Library composition.
- `TileLibraryProps` matches the existing drawer inputs: `anchor`, `toggleDrawer`, `addTile`, and `drawers`.
- Legacy `AppBar` and `Drawer` remain public, unconditional MUI implementations.

- [ ] **Step 1: Add failing Tile Library/App Bar parity tests**

Cover direct profile opening, absence of the App Bar timezone control, modal open/close, search, category synchronization, sorting, favorites persistence, most-used ordering, and tile launch. Add legacy assertions for title, timezone, survey, MUI drawer, and original tile cards.

- [ ] **Step 2: Run tests and verify RED**

Expected: new-layout App Bar and Tile Library imports do not exist.

- [ ] **Step 3: Extract Tile Library implementation**

Move catalog state and navigation from the current Drawer `Menu` and `MenuItem` into focused files below `new-layout/components/TileLibrary/`. Preserve the local-storage keys and existing analytics calls.

- [ ] **Step 4: Extract new-layout App Bar**

Use the shared App Bar controller and the new-layout leaf components. Keep logout direct from Profile and do not mount the legacy survey flow.

- [ ] **Step 5: Restore unconditional legacy App Bar and drawer**

Remove all feature checks and WebKit imports. Retain the fixed App Bar, legacy controls, MUI drawer, resizable profile, survey, and spacer.

- [ ] **Step 6: Run focused tests, lint, and build**

Run `PortalSurfaces.test.tsx`, relevant component tests, ESLint for touched files, and `npm run build:app`.

- [ ] **Step 7: Commit App Bar and Tile Library migration**

```bash
git add apps/base/src/components/AppBar apps/base/src/components/Drawer apps/base/src/components/NewTile apps/base/src/new-layout
git commit -m "refactor(base): centralize new layout app bar and tile library"
```

### Task 5: Move Home And Workspace Composition

**Files:**
- Create: `apps/base/src/new-layout/routing/index.tsx`
- Create: `apps/base/src/new-layout/pages/Home/index.tsx`
- Create: `apps/base/src/new-layout/pages/Home/style.ts`
- Create: `apps/base/src/new-layout/components/WorkspaceTab/index.tsx`
- Create: `apps/base/src/new-layout/components/WorkspaceTab/style.ts`
- Modify: `apps/base/src/pages/Home/index.tsx`
- Modify: `apps/base/src/pages/Home/common/style.ts`
- Modify: `apps/base/src/pages/Home/index.test.tsx`
- Modify: `apps/base/src/components/TabItem/index.tsx`
- Modify: `apps/base/src/components/TabItem/common/style.ts`
- Modify: `apps/base/src/routing/index.tsx` only if a layout-neutral helper extraction is required
- Move: portal header background assets into `apps/base/src/new-layout/assets/`

**Interfaces:**
- `NewLayoutRouting` mirrors legacy authentication, single-view, error, and loading behavior while routing authenticated standard views to `NewLayoutHome`.
- `NewLayoutHome` consumes existing Home controller, parameter, OpenFin, and FDC3 workspace hooks.
- `NewLayoutWorkspaceTab` consumes the existing `TabProps` contract.

- [ ] **Step 1: Add failing routing and Home composition tests**

Assert that legacy Home places tabs outside the App Bar header and new-layout Home places tabs inside a 96px header. Verify each routing adapter selects Login, SingleView, or its own Home and uses its own Suspense splash.

- [ ] **Step 2: Run tests and verify RED**

Expected: new-layout routing, Home, and workspace-tab imports do not exist.

- [ ] **Step 3: Extract new-layout routing and Home**

Move the 96px header composition, background assets, 40/60 App Bar/tab split, new empty state, new splash, and new workspace tab presentation below `src/new-layout/`. Continue consuming shared Home controllers and workspace operations.

- [ ] **Step 4: Restore unconditional legacy Home and TabItem**

Remove all feature checks, assets, new-layout selectors, Close icon switching, and composite-header composition. Keep the verified separate fixed App Bar and tab row structure.

- [ ] **Step 5: Run focused tests, lint, and build**

```bash
npm run test -- --runInBand src/pages/Home/index.test.tsx src/components/TabItem/index.test.tsx src/new-layout --coverage=false
npx eslint src/pages/Home src/components/TabItem src/new-layout
npm run build:app
```

- [ ] **Step 6: Commit Home migration**

```bash
git add apps/base/src/pages/Home apps/base/src/components/TabItem apps/base/src/new-layout
git commit -m "refactor(base): centralize new layout workspace shell"
```

### Task 6: Remove Scattered Flag Infrastructure And Verify

**Files:**
- Modify: `apps/base/src/hooks/model/root.ts`
- Modify: `apps/base/src/components/PortalSurfaces.test.tsx`
- Modify: `apps/base/src/new-layout/architecture.test.ts`
- Modify: `apps/base/docs/NEW_LAYOUT_SURFACES.md`
- Modify: `docs/superpowers/specs/2026-08-12-centralized-new-layout-design.md` only if implementation details differ from the approved interface

**Interfaces:**
- Removes: `useIsNewLayout`
- Final invariant: the only production URL flag read is in `src/new-layout/index.tsx`

- [ ] **Step 1: Delete the obsolete shared feature hook**

Remove `useIsNewLayout` after all callers have migrated.

- [ ] **Step 2: Make the architecture tests green**

The file scan must report no flag reads, WebKit imports, opt-in selectors, or new-layout assets outside `src/new-layout/`, with explicit exemptions only for test files and versioned documentation.

- [ ] **Step 3: Run complete automated verification**

```bash
cd apps/base
npm run test -- --runInBand src/new-layout src/components/PortalSurfaces.test.tsx src/pages/Home/index.test.tsx src/components/TabItem/index.test.tsx src/theme/config/utils.test.tsx --coverage=false
npm run lint
npm run build:app
npm run build:types -- --pretty false
npm test -- --runInBand
```

Record any unrelated pre-existing failure separately. Do not modify unrelated test targets as part of this refactor.

- [ ] **Step 4: Run browser verification on desktop and mobile**

At both `/` and `/?new-layout=true`: log in, open New Tile, launch a tile, remove it from the workspace, inspect profile, toggle theme, and inspect empty/loading states. Measure App Bar/header/tab geometry at desktop and mobile widths and confirm no overlap, blank gap, or cross-layout selector leakage.

- [ ] **Step 5: Run GitNexus change detection**

Run `detect_changes({scope: "staged"})`, review changed symbols and affected flows, and investigate any HIGH or CRITICAL result before committing.

- [ ] **Step 6: Commit final cleanup and verification updates**

```bash
git add apps/base/src apps/base/docs/NEW_LAYOUT_SURFACES.md
git commit -m "refactor(base): complete centralized new layout module"
```

- [ ] **Step 7: Confirm clean scoped worktree**

`git status --short` must show no task-owned changes and may show only the untouched user-owned `skills-lock.json` modification.

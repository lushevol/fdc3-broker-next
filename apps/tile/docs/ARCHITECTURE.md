# @fm/template — Architecture

> Parent: [Monorepo AGENTS.md](../../AGENTS.md)

## Tech Stack

| Layer          | Technology                                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| UI Framework   | React 18 (Functional Components & Hooks)                                                                                        |
| Micro-Frontend | Single-SPA (`single-spa`, `single-spa-react`)                                                                                   |
| Build          | Rsbuild (Rspack-based)                                                                                                          |
| UI Libraries   | MUI v5 (`@mui/material`, `@mui/icons-material`), Emotion (`@emotion/react`, `@emotion/styled`, `@emotion/css`), MUI X Data Grid |
| FDC3           | `ratan-fdc3-agent` (hooks: `useFDC3`, `useIntentListener`, `useAppIdentifier`, `useUserChannels`)                               |
| Desktop        | `@openfin/core` (OpenFin desktop container support)                                                                             |
| Routing        | React Router DOM v6 (MemoryRouter, used inside container shell)                                                                 |
| Testing        | Jest + `@testing-library/react`, `babel-jest`                                                                                   |

## Directory Structure

```
apps/tile/
├── .env.local              # Dev env (port 8006)
├── .env.server             # Production build env
├── .env.mfe                # MFE build-time vars
├── rsbuild.config.ts       # Build config (SystemJS output, externals)
├── babel.config.json       # Babel config for Jest
├── tsconfig.json
├── src/
│   ├── system-entry.ts          # Single-SPA entry: sets public path, re-exports root
│   ├── root.tsx                  # Re-exports App.tsx
│   ├── App.tsx                   # Root component: Routing with TileProps
│   ├── Root/
│   │   ├── import/
│   │   │   └── index.ts              # @fm/base runtime import bridge (40+ exports)
│   │   └── routing/
│   │       ├── index.tsx             # Route definitions with Suspense boundaries
│   │       └── common/
│   │           ├── interface.ts       # TileProps interface + Container interface
│   │           └── useController.ts   # Navigation controller hook (uses tile prop)
│   ├── components/
│   │   └── ExampleFDC3Tile.tsx       # FDC3 demo (453 lines): intents, broadcast, channels
│   ├── Tile1/
│   │   └── index.tsx                 # Minimal placeholder tile
│   ├── FDC3Tile1/
│   │   └── index.tsx                 # Wraps ExampleFDC3Tile with header
│   ├── FDC3Tile2/
│   │   └── index.tsx                 # Wraps ExampleFDC3Tile with header (second instance)
│   └── @types/                       # Custom type declarations
└── docs/                              # This documentation
```

## Single-SPA Lifecycle

1. **`system-entry.ts`** — Sets `__webpack_public_path__` from `__system_context__.meta.url`, then re-exports `./root`
2. **`root.tsx`** — Re-exports `App` as default
3. **`App.tsx`** — Typed with `TileProps`, renders `<Routing {...props} />`

```tsx
const App: React.FC<TileProps> = (props: TileProps): React.ReactElement => <Routing {...props} />;
```

## TileProps Interface

Every tile receives standardized props from its parent container:

```ts
interface Container {
  id: string;
  container: string;
  module: string;
  tile: string;
  title: string;
  subtitle?: string;
  parameters?: Record<string, any>;
  emailSupport: string;
  panelId: string;
  tabId: string;
  leftPosition?: string;
  topPossition?: string; // note: typo preserved from source
}

interface TileProps extends Container {
  children?: React.ReactNode;
}
```

## FDC3 Demo (`components/ExampleFDC3Tile.tsx`)

The template includes a comprehensive FDC3 example demonstrating:

- **Intent raising** — `fdc3.raiseIntent('ViewChart', context)` to send intents to other apps
- **Intent listening** — `useIntentListener('ViewChart', handler)` with automatic cleanup
- **Context broadcasting** — `fdc3.broadcast(context)` to share data on channels
- **Channel management** — `fdc3.getUserChannels()`, `joinUserChannel()`, `leaveCurrentChannel()`, `getCurrentChannel()`
- **Context listening** — `fdc3.addContextListener()` with self-message filtering
- **Base-owned lifecycle** — `@fm/base` wraps each remote tile with a scoped FDC3 agent and registers/unregisters tile instances in `pages/Home/common/Container.tsx`

Components:

- `FDC3Operations` — Intent raising and context broadcast buttons
- `IntentListenerSection` — Displays received intents
- `ChannelSection` — Channel picker with color-coded badges and context display
- `CurrentContextSection` — Shows current channel context
- `ExampleFDC3Tile` — Demo component that consumes the base-provided FDC3 agent hooks

## Shared Shell Pattern (`Root/import/index.ts`)

Imports 40+ named exports from `@fm/base` at runtime, including UI components (ErrorBoundry, Loader, Button, Dialog, Input, Tabs), utilities (Service, Hooks, CommonUtil, ChannelUtil), and FDC3 (FDC3Agent).

```ts
import * as Container from '@fm/base';
export const FDC3Agent = Container.FDC3Agent.default;
export const ErrorBoundry = Container.ErrorBoundry.default;
export const Loader = Container.Loader.default;
export const ReactRouterDom = Container.ReactRouterDom;
// ... 40+ more exports
```

## Routing (`Root/routing/index.tsx`)

Routes are defined with `React.lazy` imports and `Suspense` boundaries:

```tsx
const Tile1 = React.lazy(() => import('../../Tile1'));
const FDC3Tile1 = React.lazy(() => import('../../FDC3Tile1'));
const FDC3Tile2 = React.lazy(() => import('../../FDC3Tile2'));

<Route
  path="/template_tile1/*"
  element={
    <React.Suspense fallback={<Loader />}>
      <Tile1 {...props} />
    </React.Suspense>
  }
/>;
```

Internal tile routes use lazy loading with `@/` path aliases (see `ModuleNameMapper` in Jest config).

## Build Configuration (`rsbuild.config.ts`)

- **Output format:** `library.type: 'system'` (SystemJS module)
- **Externals:** `react` and `@fm/base` — resolved at runtime via import map
- **Note:** `react-dom` is NOT an external in the tile rsbuild config (unlike container)
- **Code splitting:** Disabled (`splitChunks: false`, `runtimeChunk: false`)
- **Entry:** `template` pointing to `src/system-entry.ts`
- **HMR:** Disabled; live reload enabled
- **CORS headers:** `Access-Control-Allow-Origin: *` on dev server

## Testing

- Jest with `babel-jest` transform and `jest-environment-jsdom`
- Template has **no test files** — runs with `--passWithNoTests`
- No standalone `jest.config.ts` file in this workspace

# @fm/template — Rules & Conventions

> Parent rules: [docs/rules.md](../../../docs/rules.md) | Parent config: [AGENTS.md](../../../AGENTS.md)

## Scaffolding Rules

When creating a new tile from this template:

1. **Copy** `apps/tile` to `apps/<your_tile_name>`
2. **Update `package.json`** — change `"name"` from `@fm/template` to `@fm/<your_tile_name>`
3. **Update `.env.local`** — change `port` to an unused port (default: 8006)
4. **Update `.env.mfe`** — change `MFE_APP_TARGET_ROOT` and `MFE_APP_PREFIX_STYLE` to match your app name
5. **Update `rsbuild.config.ts`:**
   - Change `output.uniqueName` from `@fm/template` to `@fm/<your_tile_name>`
   - Change entry key from `template` to your entry name
   - Change `chunkFilename` pattern accordingly
6. **Update import maps:**
   - Add entry to `root-config/public/importmaplocal.json`
   - Add entry to `root-config/public/importmap.json`
7. **Register in base app** — add the new tile to `@fm/base` tile menu configuration

## Module Format

- **SystemJS output** — `library.type: 'system'` in rsbuild config
- **Externals** — `react` and `@fm/base` are NOT bundled; resolved at runtime via import map
- **Note:** `react-dom` is bundled in tiles (unlike containers which externalize it)
- **No code splitting** — `splitChunks: false`, `runtimeChunk: false`

## Import Conventions

- **Always** import shared components from `@fm/base` via `Root/import/index.ts`
- **Never** import `@fm/base` directly in component files — use the destructured bridge exports

```ts
// ✅ Correct
import { ErrorBoundry, Loader, ReactRouterDom, FDC3Agent } from '../import';

// ❌ Wrong
import { ErrorBoundry } from '@fm/base';
```

## FDC3 Integration

- Use `ratan-fdc3-agent` hooks for all FDC3 operations:
  - `useFDC3()` — access the FDC3 agent instance
  - `useIntentListener(intent, handler)` — listen for intents with automatic cleanup
  - `useAppIdentifier()` — get the current app identity for filtering
  - `useUserChannels()` — list available user channels
- Do not wrap tile components in `<AgentProvider>` inside the tile app; `@fm/base` wraps remote tiles in `pages/Home/common/Container.tsx`
- Do not manually call `registerTile()`/`unregisterTile()` in tile components; base owns tile lifecycle registration
- See `components/ExampleFDC3Tile.tsx` for a full demo

## TileProps Interface

All tile components must accept `TileProps` as their props type:

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
  topPossition?: string;
}

interface TileProps extends Container {
  children?: React.ReactNode;
}
```

When creating new sub-tiles, always type the component with `TileProps`:

```tsx
const MyNewTile: React.FC<TileProps> = (props: TileProps): React.ReactElement => (
  // ...
);
```

## Route Naming

- Use path constants in `Root/routing/common/interface.ts` for route definitions
- Tile sub-routes follow the pattern `/template_<name>/*` (e.g., `/template_tile1/*`, `/template_tile_fdc3_1/*`)
- When creating a new tile, define a `TILE_MENU` enum for route path constants if the tile will have multiple sub-routes
- Always wrap lazy-loaded routes in `<React.Suspense fallback={<Loader />}>`

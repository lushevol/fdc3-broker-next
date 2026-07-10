# @fm/template_container — Rules & Conventions

> Parent rules: [docs/rules.md](../../../docs/rules.md) | Parent config: [AGENTS.md](../../../AGENTS.md)

## Scaffolding Rules

When creating a new container from this template:

1. **Copy** `apps/container` to `apps/<your_container_name>`
2. **Update `package.json`** — change `"name"` from `@fm/template_container` to `@fm/<your_container_name>`
3. **Update `.env.local`** — change `port` to an unused port
4. **Update `.env.mfe`** — change `MFE_APP_TARGET_ROOT` and `MFE_APP_PREFIX_STYLE` to match your app name
5. **Update `rsbuild.config.ts`:**
   - Change `output.uniqueName` from `@fm/template_container` to `@fm/<your_container_name>`
   - Change entry key from `template_container` to your entry name
   - Change `chunkFilename` pattern accordingly
6. **Update import maps:**
   - Add entry to `root-config/public/importmaplocal.json`
   - Add entry to `root-config/public/importmap.json`
7. **Register in layout** — add the MFE to `root-config/src/microfrontend-layout.html` if needed

## Module Format

- **SystemJS output** — `library.type: 'system'` in rsbuild config
- **Externals** — `react`, `react-dom`, `react-dom/client`, `@fm/base` are NOT bundled; resolved at runtime via the import map
- **No code splitting** — `splitChunks: false`, `runtimeChunk: false`

## Import Conventions

- **Always** import shared components from `@fm/base` via `Root/import/index.ts`
- **Never** import `@fm/base` directly in component files — use the destructured bridge exports
- **Never** bundle React or `@fm/base` locally — they are externals

```ts
// ✅ Correct
import { ErrorBoundry, ReactRouterDom, Hooks } from '../import';

// ❌ Wrong
import { ErrorBoundry } from '@fm/base';
```

## Environment Handling

- `env-cmd -f .env.local` — used by `dev` and `start` scripts (port 8007, development mode)
- `env-cmd -f .env.server` — used by `build:app` script (production mode)
- MFE-specific vars in `.env.mfe` are injected at build time via `readMfeEnv()` in the rsbuild config
- **Order matters:** `npm run dev` reads `.env.local`. `npm run build` reads `.env.server`.

## Routing

- **Use `MemoryRouter`** — containers are guests inside single-SPA. Never use `BrowserRouter`.
- Define route paths as **enums** in `Root/routing/common/interface.ts`:
  - `CONTAINER_MENU` — routes for container-level pages
  - `TILE_MENU` — routes for embedded tile pages
  - `APPLICATION_MENU` — top-level application routes (used as the catch-all route)
- Navigation is handled by `useController` hook which uses `useNavigate` to redirect on mount

## Tile Loading Pattern

When embedding a tile inside a container:

```tsx
// 1. Define a lazy-loaded component in Root/import/
const Mfe = React.lazy(() => System.import('@fm/template'));

// 2. Use it in routing
<Route path={APPLICATION_MENU.TEMPLATE_CONTAINER} element={<TemplateTile {...props} />} />

// 3. Wrap in Suspense at the route level if needed
<React.Suspense fallback={<Loader />}>
  <TemplateTile {...props} />
</React.Suspense>
```

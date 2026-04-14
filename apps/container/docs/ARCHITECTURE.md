# @fm/template_container — Architecture

> Parent: [Monorepo AGENTS.md](../../AGENTS.md)

## Tech Stack

| Layer          | Technology                                                                      |
| -------------- | ------------------------------------------------------------------------------- |
| UI Framework   | React 18 (Functional Components & Hooks)                                        |
| Micro-Frontend | Single-SPA (`single-spa`, `single-spa-react`)                                   |
| Build          | Rsbuild (Rspack-based)                                                          |
| UI Libraries   | MUI v5, Ant Design (`antd`), Emotion                                            |
| Data Grid      | AG Grid Enterprise (`ag-grid-enterprise` + `ag-grid-react`)                     |
| State          | Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)                               |
| GraphQL        | Apollo Client (`@apollo/client`), Relay (`relay-runtime`, `babel-plugin-relay`) |
| Real-Time      | SockJS (`sockjs-client`) + Stomp (`stompjs`)                                    |
| Routing        | React Router DOM v6 (MemoryRouter)                                              |
| Styling        | Less (via `@rsbuild/plugin-less`), Emotion                                      |
| Testing        | Jest + `@testing-library/react`, `babel-jest`                                   |

## Directory Structure

```
apps/container/
├── .env.local              # Dev env (port 8007)
├── .env.server             # Production build env
├── .env.mfe                # MFE build-time vars
├── rsbuild.config.ts       # Build config (SystemJS output, externals)
├── babel.config.json       # Babel config for Jest + Relay
├── tsconfig.json
├── src/
│   ├── system-entry.ts     # Single-SPA entry: sets public path, re-exports root
│   ├── root.tsx             # Re-exports App.tsx (Single-SPA convention)
│   ├── App.tsx              # Root component: MemoryRouter + Routing
│   └── Root/
│       ├── import/
│       │   ├── index.ts        # @fm/base runtime import bridge (20+ exports)
│       │   └── TemplateTile.tsx # Lazy-loaded tile via System.import
│       └── routing/
│           ├── index.tsx           # Route definitions using APPLICATION_MENU enum
│           └── common/
│               ├── interface.ts    # ContainerProps, CONTAINER_MENU, TILE_MENU, APPLICATION_MENU enums
│               └── useController.ts  # Navigation controller hook
└── docs/                   # This documentation
```

## Single-SPA Lifecycle

1. **`system-entry.ts`** — Sets `__webpack_public_path__` from `__system_context__.meta.url`, then re-exports `./root`
2. **`root.tsx`** — Re-exports `App` as default (Single-SPA expects a module with `bootstrap`/`mount`/`unmount`)
3. **`App.tsx`** — Wraps content in `<MemoryRouter>` with a catch-all `<Route path="*">` pointing to `<Routing>`

## Shared Shell Pattern (`Root/import/index.ts`)

All shared UI and utility imports come from `@fm/base` at runtime (resolved via the import map). The bridge file destructures 20+ named exports:

```ts
import * as Container from '@fm/base';
export const ErrorBoundry = Container.ErrorBoundry.default;
export const Splash = Container.Splash.default;
export const Loader = Container.Loader.default;
export const ContainerProvider = Container.Provider;
export const ReactRouterDom = Container.ReactRouterDom;
export const Service = Container.Service;
export const Provider = Container.Provider;
export const Hooks = Container.Hooks;
export const CommonUtil = Container.CommonUtil;
export const ChannelUtil = Container.ChannelUtil;
export const LoginUtil = Container.LoginUtil;
export const useContainerDispatcher = Container.Dispatcher.default;
export const ThemeConfig = Container.ThemeConfig.default;
export const ThemeUtil = Container.ThemeUtil;
export const Time = Container.Time;
export const LoadingButton = Container.LoadingButton.default;
export const Button = Container.Button.default;
export const ExtendTokenService = Container.ExtendService.extendToken;
export const Dialog = Container.Dialog.default;
export const useAnalytics = Container.Analytics.default;
```

> Never import from `@fm/base` directly in component files. Always go through `Root/import/index.ts`.

## Dynamic Tile Loading (`Root/import/TemplateTile.tsx`)

Containers embed tiles using `React.lazy` + `System.import`:

```tsx
const Mfe = React.lazy(() => System.import('@fm/template').then((a) => a));

const TemplateTile: React.FC<any> = (props: any): ReactElement => {
  return <Mfe {...props} />;
};
```

The lazy-loaded component is rendered inside a route in `Root/routing/index.tsx` and must be wrapped in `<React.Suspense>` by the consuming container if no top-level suspense boundary exists.

## Build Configuration (`rsbuild.config.ts`)

- **Output format:** `library.type: 'system'` (SystemJS module)
- **Externals:** `react`, `react-dom`, `react-dom/client`, `@fm/base` — resolved at runtime via import map
- **Code splitting:** Disabled (`splitChunks: false`, `runtimeChunk: false`)
- **Entry:** `template_container` pointing to `src/system-entry.ts` (no HTML template)
- **HMR:** Disabled; live reload enabled
- **CORS headers:** `Access-Control-Allow-Origin: *` on dev server

## Testing

Jest with `babel-jest` transform, `jest-environment-jsdom`, and `@testing-library/react`.

- Config located in `jest.config.ts` (not present as standalone file — uses default config)
- `moduleNameMapper` maps `@/` → `src/next-packages/`
- Template has **no test files**; runs with `--passWithNoTests`

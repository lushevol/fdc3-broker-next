# @fm/base — Architecture

> Parent: [PROJECT.md](./PROJECT.md) | [Monorepo AGENTS.md](../../../AGENTS.md)

## Tech Stack

| Layer          | Technology                                                                                     |
| -------------- | ---------------------------------------------------------------------------------------------- |
| UI Framework   | React 18 (functional components + hooks only)                                                  |
| Micro-Frontend | Single-SPA (`single-spa-react`)                                                                |
| Build          | Rsbuild 1.7+ (`@rsbuild/core`, `@rsbuild/plugin-react`)                                        |
| UI Library     | MUI v5 (`@mui/material`, `@mui/icons-material`, `@mui/x-data-grid`, `@mui/x-date-pickers-pro`) |
| Styling        | Emotion (`@emotion/react`, `@emotion/styled`, `@emotion/css`) + Tailwind v4                    |
| AI Chat        | `@assistant-ui/react` v0.12+, `@assistant-ui/react-ai-sdk`                                     |
| Streaming      | RxJS 7, `event-source-polyfill` (SSE)                                                          |
| HTTP           | Axios                                                                                          |
| Routing        | `react-router-dom` v6                                                                          |
| State          | React Context + `useReducer` (AppContext)                                                      |
| Testing        | Jest 29, `babel-jest`, `jest-environment-jsdom`, `@testing-library/react`                      |
| Module Format  | SystemJS (`library.type: 'system'`)                                                            |

## Directory Structure

```
src/
├── admin/                   # Admin CRUD pages (Tile, Category, ImportMap, FDC3Declaration)
├── analytics/               # Analytics tracking utilities
├── components/              # Reusable UI components (43+ dirs)
│   ├── AppBar/              # Top navigation bar
│   ├── ChatbotSidebar/      # AI assistant (AssistantUIRuntimeProvider, exports)
│   ├── Drawer/              # Side navigation
│   ├── Loader/              # Loading indicators + PageLoader
│   ├── NewTile/             # Tile launcher from nav bar
│   ├── Splash/              # Splash/screen loading
│   └── ...                  # Button, Dialog, Input, Select, Snackbar, etc.
├── fdc3/                    # FDC3 integration layer
│   ├── FDC3Integration.tsx  # Base-to-FDC3 platform adapter
│   ├── expose.ts            # Re-exports AgentProvider hooks
│   └── useFDC3WorkspaceHelper.ts
├── hooks/                   # Custom React hooks
│   ├── provider/            # AppContext + useReducer state management
│   ├── reducer/             # Action types + reducers
│   ├── service/             # API data-fetching hooks
│   ├── fdc3/               # FDC3-specific hooks
│   └── workspace/           # Workspace/tab management hooks
├── next-packages/           # Internal shared code (aliased as @/)
│   ├── components/          # Next-gen UI + assistant-ui components
│   ├── hooks/               # Next-gen hooks
│   └── lib/                 # Shared utilities
├── pages/                   # Route-level pages
│   ├── Home/
│   └── Login/
├── routing/                 # React Router configuration
├── services/                # API service layer (Axios)
├── styles/                  # Global styles + Tailwind CSS
├── theme/                   # MUI theme config, dynamic light/dark switching
│   ├── Config.ts            # Theme configuration constants
│   ├── Provider.tsx          # ThemeProvider with light/dark mode
│   └── config/utils.ts      # Theme utility functions
├── utils/                   # Common utilities (locale, login, drawer, ReactWrapper)
├── App.tsx                  # Root component: LocalizationProvider → Provider → ThemeProvider → FDC3Integration → Routing
├── root.tsx                 # Single-SPA lifecycle + 40+ public re-exports
└── system-entry.ts          # Sets __webpack_public_path__ from SystemJS context
```

## Single-SPA Lifecycle

```
system-entry.ts
  ├── Sets __webpack_public_path__ from __system_context__.meta.url
  └── Re-exports root.tsx

root.tsx
  ├── singleSpaReact({ React, ReactDOMClient, rootComponent: App })
  ├── Exports: bootstrap, mount, unmount
  ├── Exports: render, check (standalone mode)
  └── Exports: 40+ namespaces (ReactRouterDom, Analytics, Button, Dialog, ...)

App.tsx
  └── Provider hierarchy:
      LocalizationProvider (AdapterDayjs)
        → Provider (AppContext, rootVersion)
          → ThemeProvider (MUI createTheme, light/dark)
            → FDC3Integration (base platform adapter → FDC3RootProvider)
              → Routing (react-router-dom)
```

## Module Format & Externals

- **Output:** SystemJS module (`library.type: 'system'`)
- **Externals** resolved at runtime via import map:
  - `react` → `react`
  - `react-dom` → `react-dom`
  - `react-dom/client` → `react-dom/client`
  - `single-spa` → `single-spa`
- **No HTML output** (`html: false`) — loaded as a SystemJS module by root-config

## Build Configuration (`rsbuild.config.ts`)

| Setting                | Value                                               |
| ---------------------- | --------------------------------------------------- |
| Entry                  | `./src/system-entry.ts`                             |
| `html`                 | `false` (no HTML generated)                         |
| `define`               | `process.env.*` from `readMfeEnv()` + `process.env` |
| `externalsType`        | `'system'`                                          |
| `splitChunks`          | `false`                                             |
| `runtimeChunk`         | `false`                                             |
| `assetPrefix`          | `http://localhost:{port}/`                          |
| `output.filename.js`   | `[name].js`                                         |
| `output.chunkFilename` | `[chunkhash].[name].base.js`                        |
| `hmr`                  | `false` (Single-SPA manages mounts)                 |
| `liveReload`           | `true`                                              |
| CORS headers           | `Access-Control-Allow-Origin: *`                    |

`readMfeEnv()` parses `.env.mfe` and merges its values into `process.env.*` defines at build time.

## State Management

- **Pattern:** React Context + `useReducer`
- **Location:** `src/hooks/provider/` (AppContext)
- **Consumption:** `useContext(AppContext)` via `Provider` export
- **Reducers:** `src/hooks/reducer/` with `ActionType` constants
- **No external state library** — no Redux, Zustand, or MobX

## FDC3 Integration

Base has two deliberately small integration points:

1. `FDC3Integration` maps base-owned authentication, tile catalog, entitlement policy,
   single-view policy, and `workspaceOpenTile` capability into `FDC3RootProvider`.
2. `pages/Home/common/Container.tsx` wraps each remote child with
   `FDC3ChildProvider` and supplies its app/instance identity.

`ratan-fdc3` owns the FDC3 broker, app-directory synchronization, resolver,
interop bridges, queued-intent replay, global publication, and child registration
lifecycle. It calls the host-provided `openApp` capability; it does not know how
base workspaces or tiles are implemented.

**Re-exports** (`fdc3/expose.ts`):

- `AgentProvider`, `useFDC3`, `useIntentListener`, `useUserChannels`, `useAppIdentifier` from `ratan-fdc3`

Other MFEs should import FDC3 hooks via `System.import('@fm/base').FDC3Agent` — never access the Broker directly.

## Chatbot Architecture (`AssistantUIRuntimeProvider.tsx`, 941 lines)

- **Provider:** `AssistantUIRuntimeProvider` wraps chatbot UI with runtime context
- **Streaming:** SSE via `fetchSSE` adapter (custom `event-source-polyfill` integration)
- **Tool Routing:** Frontend tool registry with `createFrontendToolRegistry`, `createFdc3IntentToolkit`, `createWorkspaceSummaryToolkit`
- **Generative UI:** `GenerativeUIProvider` with registered components (Card, List, Table, Status, Error, Form)
- **Exports:** `ChatbotSidebar`, `useAssistantUIRuntime`, `useRegisterAssistantTools`, `useAssistantToolMetadata`, `useAssistantToolRoutingDebug`

## Theme System

- **Dynamic light/dark switching** via `ThemeProvider` (`src/theme/Provider.tsx`)
- **MUI `createTheme`** with extensive palette, typography, and component overrides (`src/theme/Config.ts`)
- **Tailwind v4** with `aui-*` CSS custom properties for assistant-ui theming
- **PostCSS** integration via `@tailwindcss/postcss`

## Testing

| Setting                 | Value                                                                     |
| ----------------------- | ------------------------------------------------------------------------- |
| Runner                  | Jest 29                                                                   |
| Transform               | `babel-jest`                                                              |
| Environment             | `jsdom`                                                                   |
| Library                 | `@testing-library/react`, `@testing-library/jest-dom`                     |
| Mock                    | `__mocks__/@assistant-ui/react.tsx` for assistant-ui                      |
| Path Alias              | `@/` → `src/next-packages/`                                               |
| transformIgnorePatterns | Whitelists `@assistant-ui`, `ai`, `zustand`, `nanoid`, `assistant-stream` |
| Setup                   | `jest.setup.tsx` + `@testing-library/jest-dom`                            |

# @fm/root-config — Architecture

## Tech Stack

| Layer         | Technology                                |
| ------------- | ----------------------------------------- |
| Framework     | Single-SPA 5.x                            |
| Build Tool    | Rsbuild 1.7.x (Rspack)                    |
| Module Format | SystemJS (`library.type: 'system'`)       |
| Language      | TypeScript (strict)                       |
| HTML Template | EJS (`index.ejs`)                         |
| Testing       | Jest 29 + babel-jest                      |
| Dev Server    | Rsbuild dev server with custom middleware |

## Directory Structure

```
root-config/
├── src/
│   ├── root.ts                      # Entry: constructRoutes, registerApplications, start
│   ├── microfrontend-layout.html   # Single-SPA layout (only @fm/base on default route)
│   ├── index.ejs                    # HTML template: loads SystemJS, import map, boots app
│   └── declarations.d.ts           # Type declarations for asset imports
├── public/
│   ├── importmaplocal.json          # Dev import map (localhost URLs)
│   ├── importmap.json               # Prod import map (relative URLs)
│   ├── js/external/                  # Shared external JS (SystemJS, React, single-spa)
│   └── systemjs-smoke.html          # Standalone SystemJS smoke test page
├── scripts/
│   ├── jwt.js                       # Local RS512 JWT generator for dev auth mock
│   ├── jwt.test.js                  # JWT generation unit test
│   └── copy.js                      # Post-build: copies public/ to dist/
├── dev-server.ts                    # Dev proxy + mock middleware (350 lines)
├── rsbuild.config.ts                # Build config (SystemJS output, externals)
├── rsbuild.config.test.ts           # Tests for dev server middleware
├── jest.config.ts / jest.setup.ts   # Jest configuration
├── babel.config.json                # Babel transform for Jest
└── tsconfig.json                    # TypeScript config
```

## Bootstrap Flow

```
Browser loads index.ejs
  → runtime.min.js (Rsbuild runtime)
  → SystemJS import map (importmaplocal.json or importmap.json)
  → system.min.js, import-map-overrides.js, amd.min.js
  → System.import("@fm/root-config")
    → src/root.ts:
      1. constructRoutes(microfrontend-layout.html)
      2. constructApplications({ routes, loadApp: ({ name }) => System.import(name) })
      3. constructLayoutEngine({ routes, applications })
      4. registerApplication() for each MFE
      5. layoutEngine.activate()
      6. single-spa.start()
```

## Dev Server Proxy Routes

| Route             | Target                  | Notes                       |
| ----------------- | ----------------------- | --------------------------- |
| `/api/chat`       | `http://localhost:8080` | Chatbot-backend             |
| `/api/bff/`       | `http://localhost:8088` | Backend BFF (path rewrite)  |
| `/api/log/`       | `http://localhost:8088` | Backend logging (WebSocket) |
| `/api/auth/`      | `http://localhost:8088` | Backend auth (path rewrite) |
| `/api/analytics/` | `http://localhost:8088` | Backend analytics           |
| `/api/sse/`       | `http://localhost:8088` | Server-Sent Events          |

When `useBackendAuth=false`, mock auth endpoints replace `/api/auth/v2/sso/*` routes. FDC3 mock endpoints are always active.

## Build Output

- Single bundle: `config.js` (no code splitting)
- SystemJS module format with `externalsType: 'system'`
- External dependencies (react, react-dom, single-spa) resolved at runtime via import map
- Post-build: `scripts/copy.js` copies `public/` folder to `dist/`

## Testing

- Jest with `babel-jest` transform, `jest-environment-jsdom`
- `jest.setup.ts` mocks `global.System.import` and suppresses console output
- `rsbuild.config.test.ts` tests the dev server middleware (auth mock vs. proxy)
- `scripts/jwt.test.js` validates JWT token generation

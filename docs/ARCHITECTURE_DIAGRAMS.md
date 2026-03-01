# MFE Architecture Diagrams

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Browser                                           │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  index.html (port 8001)                                            │   │
│  │                                                                     │   │
│  │  1. Load SystemJS                                                  │   │
│  │  2. Load import map                                                │   │
│  │  3. System.import("@fm/root-config")                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  @fm/root-config (Single-SPA Orchestrator)                         │   │
│  │                                                                     │   │
│  │  • Reads microfrontend-layout.html                                 │   │
│  │  • Registers applications with single-spa                          │   │
│  │  • Manages lifecycle (bootstrap/mount/unmount)                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  @fm/base (Shared MFE - Port 8002)                                 │   │
│  │                                                                     │   │
│  │  Exports: Components | Hooks | Services | Theme | FDC3 Agent      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Module Federation Relationships

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Module Federation                                    │
│                                                                             │
│    ┌──────────────────┐              ┌──────────────────┐                  │
│    │  mf_container    │              │     mf_tile      │                  │
│    │  (Rsbuild)       │◄────────────►│     (Rsbuild)    │                  │
│    │  Port: 3000      │   remotes    │     Port: 3001   │                  │
│    │                  │              │                  │                  │
│    │  exposes:        │              │  exposes:        │                  │
│    │    ./            │              │    ./            │                  │
│    └──────────────────┘              └──────────────────┘                  │
│            │                                  │                             │
│            │  remotes                         │                             │
│            ▼                                  │                             │
│    ┌──────────────────┐                       │                             │
│    │     base         │                       │                             │
│    │   (Webpack)      │◄──────────────────────┘                             │
│    │   Port: 8002     │                                                 │
│    │                  │    remotes                                        │
│    │  remotes:        │    mf_container                                   │
│    │  mf_container    │    mf_tile                                        │
│    │  mf_tile         │                                                  │
│    └──────────────────┘                                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Single-SPA Lifecycle Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Application Lifecycle                                 │
│                                                                             │
│  ┌─────────────┐                                                          │
│  │   Loading   │ ── System.import("@fm/base")                            │
│  └──────┬──────┘                                                          │
│         │                                                                  │
│         ▼                                                                  │
│  ┌─────────────┐                                                          │
│  │  bootstrap  │ ── Run once: Setup, init, fetch config                  │
│  └──────┬──────┘     (required)                                           │
│         │                                                                  │
│         ▼                                                                  │
│  ┌─────────────┐                                                          │
│  │    mount    │ ── Render to DOM: ReactDOM.render(<App/>)               │
│  └──────┬──────┘     (required)                                           │
│         │                                                                  │
│         ▼                                                                  │
│  ┌─────────────┐     ┌─────────────┐                                      │
│  │   Active    │────►│   unmount   │ ── Cleanup: ReactDOM.unmount        │
│  │  (running)  │     └─────────────┘                                      │
│  └─────────────┘                                                          │
│         │                                                                  │
│         │ (navigation away)                                               │
│         ▼                                                                  │
│    Can remount                                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## FDC3 Communication

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FDC3 Inter-App Communication                             │
│                                                                             │
│   ┌─────────────┐              ┌─────────────┐              ┌────────────┐ │
│   │  Tile App 1 │              │ FDC3 Broker │              │ Tile App 2 │ │
│   │             │              │             │              │            │ │
│   │ broadcast() │─────────────►│  receives   │─────────────►│ receives   │ │
│   │ (context)   │              │  context    │              │  context   │ │
│   └─────────────┘              └─────────────┘              └────────────┘ │
│                                                                             │
│   ┌─────────────┐              ┌─────────────┐              ┌────────────┐ │
│   │  Tile App 1 │              │ FDC3 Broker │              │ Tile App 2 │ │
│   │             │              │             │              │            │ │
│   │ raiseIntent │─────────────►│  resolves   │─────────────►│  handles   │ │
│   │ "ViewChart" │              │  to app     │              │   intent   │ │
│   └─────────────┘              └─────────────┘              └────────────┘ │
│                                                                             │
│   Context Types: fdc3.instrument, fdc3.contact, fdc3.organization         │
│   Standard Intents: ViewInstrument, ViewContact, ViewChart, etc.          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Development Setup

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Development Servers                                   │
│                                                                             │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐     │
│  │ root-config│    │    base    │    │ mf_container│   │  mf_tile   │     │
│  │  port 8001 │    │  port 8002 │    │  port 3000  │   │  port 3001 │     │
│  └─────┬──────┘    └─────┬──────┘    └──────┬─────┘    └──────┬─────┘     │
│        │                 │                   │                  │           │
│        │                 │      ┌────────────┴────────┐         │           │
│        │                 │      │                     │         │           │
│        └─────────────────┴──────┴─────────────────────┴─────────┘           │
│                              │                                              │
│                              ▼                                              │
│                    ┌─────────────────┐                                     │
│                    │  Browser        │                                     │
│                    │  (localhost)    │                                     │
│                    └─────────────────┘                                     │
│                                                                             │
│  All started via: npm run dev                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Import Resolution Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Import Resolution                                      │
│                                                                             │
│  1. Code: import App from 'mf_container'                                   │
│                                                                          │
│  2. Check import map:                                                     │
│     {                                                                     │
│       "imports": {                                                        │
│         "mf_container": "//localhost:3000/mf_container.js"              │
│       }                                                                   │
│     }                                                                     │
│                                                                          │
│  3. SystemJS loads from: http://localhost:3000/mf_container.js          │
│                                                                          │
│  4. Module Federation serves: mf-manifest.json                           │
│     → loads required chunks                                              │
│                                                                          │
│  5. App mounted via single-spa lifecycle                                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

## File Structure

```
mfe-next/
├── apps/
│   ├── root-config/          # Entry point (8001)
│   │   ├── src/
│   │   │   ├── index.ejs
│   │   │   ├── root.ts              # single-spa init
│   │   │   └── microfrontend-layout.html
│   │   └── public/
│   │       └── importmaplocal.json
│   │
│   ├── base/                 # Shared components (8002)
│   │   ├── src/
│   │   │   ├── root.tsx             # lifecycles + exports
│   │   │   ├── components/          # UI components
│   │   │   ├── hooks/               # React hooks
│   │   │   ├── services/            # API services
│   │   │   └── theme/               # MUI themes
│   │   ├── webpack.config.js
│   │   └── module-federation.config.js
│   │
│   ├── container/            # Legacy container (8007)
│   ├── tile/                 # Legacy tile (8006)
│   ├── mf_container/         # Rsbuild container (3000)
│   │   ├── src/
│   │   │   └── index.tsx
│   │   └── module-federation.config.ts
│   │
│   └── mf_tile/              # Rsbuild tile (3001)
│       ├── src/
│       │   └── index.tsx
│       └── module-federation.config.ts
│
├── packages/
│   ├── fdc3-agent/           # FDC3 client API
│   ├── fdc3-broker/          # FDC3 server/mediator
│   ├── fdc3-app-directory/   # App registry
│   ├── fdc3-resolver-ui/     # Intent resolver UI
│   └── mf_lib/               # Shared library (Rslib)
│
└── docs/
    ├── ARCHITECTURE.md       # Full documentation
    ├── QUICK_REFERENCE.md    # Quick reference
    └── ARCHITECTURE_DIAGRAMS.md  # This file
```

# MFE Quick Reference

## Ports and Apps

| Port | App Name     | Type    | Description                           |
| ---- | ------------ | ------- | ------------------------------------- |
| 8001 | root-config  | Webpack | Entry point - Single-SPA orchestrator |
| 8002 | base         | Webpack | Shared components, hooks, services    |
| 8006 | tile         | Webpack | Legacy tile example                   |
| 8007 | container    | Webpack | Legacy container example              |
| 3000 | mf_container | Rsbuild | Modern container                      |
| 3001 | mf_tile      | Rsbuild | Modern tile                           |

## Key Files

### root-config (8001)

```
apps/root-config/
├── src/
│   ├── index.ejs              # HTML entry point
│   ├── root.ts                # Single-SPA initialization
│   └── microfrontend-layout.html  # MFE layout definition
└── public/
    └── importmaplocal.json    # Module name → URL mapping
```

### base (8002)

```
apps/base/
├── src/
│   ├── root.tsx               # Single-spa lifecycles + exports
│   ├── components/            # UI components
│   ├── hooks/                 # React hooks
│   ├── services/              # API services
│   ├── theme/                 # MUI themes
│   └── fdc3/                  # FDC3 integration
└── module-federation.config.js
```

## Loading Sequence

```
Browser → index.ejs → import map → SystemJS
    → @fm/root-config (single-spa) → registerApplications
    → bootstrap() → mount() → App visible
```

## Single-SPA Lifecycle

```typescript
export const bootstrap = async () => {
  // One-time setup
};

export const mount = async (props) => {
  // Render to DOM
  ReactDOM.render(<App {...props} />, root);
};

export const unmount = async (props) => {
  // Cleanup
  ReactDOM.unmountComponentAtNode(root);
};
```

## Module Federation Config (base)

```javascript
module.exports = {
  name: 'baseContainer',
  remotes: {
    mf_container: 'mf_container@http://localhost:3000/mf-manifest.json',
    mf_tile: 'mf_tile@http://localhost:3001/mf-manifest.json',
  },
  shared: {
    react: { singleton: true, eager: true },
    'react-dom': { singleton: true, eager: true },
    '@emotion/react': { singleton: true, eager: true },
  },
};
```

## Import Map Example

```json
{
  "imports": {
    "@fm/root-config": "/config.js",
    "@fm/base": "//localhost:8002/base.js",
    "mf_container": "//localhost:3000/mf_container.js",
    "mf_tile": "//localhost:3001/mf_tile.js"
  }
}
```

## FDC3 Communication

```typescript
import { FDC3 } from '@fm/base';

// Broadcast context to all apps
FDC3.broadcast({ type: 'fdc3.instrument', id: { symbol: 'AAPL' } });

// Raise intent to specific app
const result = await FDC3.raiseIntent('ViewChart', { type: 'fdc3.instrument' });

// Listen for context
FDC3.addContextListener('fdc3.instrument', (context) => {
  console.log('Received:', context);
});
```

## Common Commands

```bash
# Start all apps
npm run dev

# Start single app
cd apps/base && npm run dev

# Build all
npm run build

# Test
npm run test

# Lint
npm run lint

# Clean builds
npm run clean
```

## Key Concepts

| Concept   | Meaning                     |
| --------- | --------------------------- |
| Host      | App that imports remotes    |
| Remote    | App that exposes modules    |
| Shared    | Dependencies loaded once    |
| Singleton | Single instance across MFEs |
| Eager     | Load at startup             |
| Lazy      | Load on demand              |

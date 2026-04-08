# MFE-Next Architecture Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [How the System Loads and Runs](#how-the-system-loads-and-runs-step-by-step)
3. [Application Architecture](#application-architecture)
4. [Key Technologies](#key-technologies)
5. [Package Dependencies](#package-dependencies)
6. [Development Guide](#development-guide)

---

## System Overview

This is a **Micro-Frontend (MFE)** monorepo using a combination of:

| Technology                                      | Purpose                                          |
| ----------------------------------------------- | ------------------------------------------------ |
| **Single-SPA**                                  | Orchestrates loading and mounting of MFEs        |
| **Webpack Module Federation**                   | Legacy MFEs (base, container, tile, root-config) |
| **Rsbuild + @module-federation/rsbuild-plugin** | Modern MFEs (mf_container, mf_tile)              |
| **npm workspaces**                              | Package management with shared dependencies      |

### Directory Structure

```
mfe-next/
├── apps/                      # Micro-frontend applications
│   ├── base/                  # Shared MFE with components, hooks, services (Webpack)
│   ├── container/             # Container MFE (Webpack)
│   ├── tile/                  # Tile MFE example (Webpack)
│   ├── mf_container/          # Container MFE (Rsbuild)
│   ├── mf_tile/               # Tile MFE (Rsbuild)
│   └── root-config/           # Single-SPA root config (orchestrator)
├── packages/                  # Shared libraries
│   ├── fdc3-agent/            # FDC3 agent API
│   ├── fdc3-app-directory/    # FDC3 app directory
│   ├── fdc3-broker/           # FDC3 broker (inter-app communication)
│   ├── fdc3-resolver-ui/      # FDC3 resolver UI
│   └── mf_lib/                # Modern library (Rslib)
```

---

## How the System Loads and Runs (Step-by-Step)

This section explains the complete loading sequence from browser request to fully rendered application.

### Step 1: Browser Requests the Entry Point

When a user visits `http://localhost:8001`, the browser loads `index.ejs`:

```html
<!-- apps/root-config/src/index.ejs -->
<script src="<%=publicUrl%>/js/external/runtime.min.js"></script>
<script type="systemjs-importmap" src="<%=publicUrl%><%=importmap%>"></script>
<script src="<%=publicUrl%>/js/external/system.min.js"></script>
<script>
  System.import('@fm/root-config');
</script>
```

**What happens here:**

1. **runtime.min.js** - SystemJS runtime
2. **import map** - Tells SystemJS where to find each module
3. **system.min.js** - SystemJS loader
4. **System.import("@fm/root-config")** - Starts loading the root config

### Step 2: Import Map Resolution

The **SystemJS import map** (`importmaplocal.json`) maps module names to URLs:

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

This is the "telephone directory" that tells the browser:

- When someone asks for `@fm/root-config`, load it from `/config.js`
- When someone asks for `@fm/base`, load it from `//localhost:8002/base.js`

### Step 3: Root Config Initializes Single-SPA

`@fm/root-config` (in `apps/root-config/src/root.ts`) loads and:

1. **Reads the layout** from `microfrontend-layout.html`:

   ```html
   <single-spa-router>
     <route default>
       <application name="@fm/base"></application>
     </route>
   </single-spa-router>
   ```

2. **Registers applications** with single-spa:

   ```typescript
   const applications = constructApplications({
     routes,
     loadApp({ name }) {
       return System.import(name); // Uses SystemJS to load
     },
   });
   applications.forEach((mfe) => registerApplication(mfe));
   ```

3. **Starts single-spa**:
   ```typescript
   start(); // Begins lifecycle management
   ```

**Key insight**: The layout defines which MFEs to load. In this case, only `@fm/base` is registered.

### Step 4: Single-SPA Lifecycle Management

Single-SPA manages each MFE's lifecycle with three main functions:

| Lifecycle     | Purpose                      | When it runs                    |
| ------------- | ---------------------------- | ------------------------------- |
| **bootstrap** | One-time initialization      | Runs once when app first loads  |
| **mount**     | Render the app to DOM        | Runs when app should be visible |
| **unmount**   | Clean up and remove from DOM | Runs when app should be hidden  |

For React apps, this is handled by `single-spa-react`:

```typescript
// apps/base/src/root.tsx
import singleSpaReact from 'single-spa-react';

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: App,
  errorBoundary(err) {
    return <span>{err.message}</span>;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
```

**Why lifecycle functions matter:**

- Bootstrap runs once → perfect for setting up connections, fetching config
- Mount runs when navigating → ensure app is visible
- Unmount runs when leaving → cleanup to prevent memory leaks

### Step 5: Module Federation Loading (Optional)

#### For Webpack MFEs (base, container, tile):

The app is loaded as a single JavaScript bundle. The Module Federation plugin bundles everything together.

```javascript
// apps/base/module-federation.config.js
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

#### For Rsbuild MFEs (mf_container, mf_tile):

Uses `@module-federation/rsbuild-plugin` which generates a `mf-manifest.json` for dynamic loading:

```typescript
// apps/mf_container/module-federation.config.ts
export default createModuleFederationConfig({
  name: 'mf_container',
  exposes: {
    '.': './src/index.tsx', // Exposes the main component
  },
  remotes: {
    mf_tile: 'mf_tile@http://localhost:3001/mf-manifest.json',
  },
  shared: {
    react: { singleton: true, eager: true },
    'react-dom': { singleton: true, eager: true },
  },
});
```

**Key difference:**

- **Webpack**: Loads entire bundle at once
- **Rsbuild**: Uses manifest for on-demand chunk loading

### Step 6: Inter-App Communication via FDC3

The **FDC3 (Financial Desktop Composability)** standard enables communication between apps:

```
┌─────────────┐     FDC3 Broker     ┌─────────────┐
│   Tile 1    │◄───────────────────►│   Tile 2    │
│ (mf_tile)   │    Context/Intents  │ (mf_tile)   │
└─────────────┘                     └─────────────┘
```

**How FDC3 works:**

1. **Context**: Data shared between apps (e.g., "instrument: AAPL")
2. **Intent**: Action an app can perform (e.g., "ViewChart")
3. **Broker**: Mediates between apps to route contexts/intents

Key FDC3 packages:

- **fdc3-agent**: API exposed to tiles for sending/receiving contexts
- **fdc3-broker**: Manages intent resolution and context distribution
- **fdc3-resolver-ui**: UI for resolving intents to apps

---

## Application Architecture

### 1. root-config (Port 8001)

**Purpose**: Entry point and orchestrator using Single-SPA

| File                            | Purpose                        |
| ------------------------------- | ------------------------------ |
| `src/index.ejs`                 | HTML template loading SystemJS |
| `src/root.ts`                   | Single-SPA initialization      |
| `src/microfrontend-layout.html` | Route and app configuration    |
| `public/importmaplocal.json`    | Module name to URL mapping     |

**Key Responsibilities:**

- Registers all MFEs with single-spa
- Defines routing structure
- Provides import map for SystemJS

**Webpack Configuration:**

- Entry: `src/root.ts`
- Output: `config.js`
- Template: `src/index.ejs`
- Dev Server Port: 8001

**Detailed Code Flow:**

```typescript
// apps/root-config/src/root.ts
import { registerApplication, start } from 'single-spa';
import { constructApplications, constructLayoutEngine, constructRoutes } from 'single-spa-layout';
import microfrontendLayout from './microfrontend-layout.html';

const root = () => {
  // 1. Parse the layout HTML
  const routes = constructRoutes(microfrontendLayout);

  // 2. Create application loaders
  const applications = constructApplications({
    routes,
    loadApp({ name }) {
      return System.import(name);
    },
  });

  // 3. Build layout engine
  const layoutEngine = constructLayoutEngine({ routes, applications });

  // 4. Register each application
  applications.forEach((mfe) => {
    mfe.customProps = { publicUrl: `/` };
    registerApplication(mfe);
  });

  // 5. Activate and start
  layoutEngine.activate();
  start();
};

root();
```

### 2. base (Port 8002)

**Purpose**: Shared utility MFE providing components, hooks, and services

**Exports by Category:**

| Category       | Exports                                                                                                                                                                                                                                                                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Components** | Button, Dialog, Drawer, Input, Select, DatePicker, DateRangePicker, DateTimePicker, TimePicker, Loader, PageLoader, LoadingButton, ToggleButton, SearchButton, SearchInput, SearchGrid, SearchCondition, SearchConditionContainer, Snackbar, Splash, BuilderButton, ErrorBoundry, Label, Time, Version, ScWebkit, ResetButton |
| **Hooks**      | Hooks, Dispatcher, Provider, Reduces, ActionType, Service, ExtendService                                                                                                                                                                                                                                                      |
| **Services**   | Services (API layer)                                                                                                                                                                                                                                                                                                          |
| **Theme**      | ThemeConfig, ThemeUtil, ThemeProvider                                                                                                                                                                                                                                                                                         |
| **Utilities**  | CommonUtil, ChannelUtil, LocaleUtil, LoginUtil, ReactWrapper                                                                                                                                                                                                                                                                  |
| **FDC3**       | FDC3Agent                                                                                                                                                                                                                                                                                                                     |

**Entry Point**: `apps/base/src/root.tsx`

```typescript
// Key exports from base
export * as Button from './components/Button';
export * as Dialog from './components/Dialog';
export * as Hooks from './hooks';
export * as Services from './services';
export * as ThemeProvider from './theme/Provider';
export * as FDC3Agent from './fdc3/expose';

// Single-spa lifecycle exports
export const { bootstrap, mount, unmount } = lifecycles;
```

**Module Federation Config:**

```javascript
// apps/base/module-federation.config.js
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
    '@emotion/css': { singleton: true, eager: true },
    '@emotion/styled': { singleton: true, eager: true },
  },
};
```

### 3. container (Port 8007) - Legacy Webpack

**Purpose**: Container MFE example using Webpack-based Module Federation

**Entry Point**: `apps/container/src/root.tsx`

```typescript
import Root from './App';
export default Root;
```

### 4. tile (Port 8006) - Legacy Webpack

**Purpose**: Tile MFE example using Webpack-based Module Federation

### 5. mf_container (Port 3000) - Rsbuild Modern

**Purpose**: Modern container MFE using Rsbuild with enhanced Module Federation

**Module Federation Config:**

```typescript
// apps/mf_container/module-federation.config.ts
import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

export default createModuleFederationConfig({
  name: 'mf_container',
  filename: 'mf_container.js',
  exposes: {
    '.': './src/index.tsx',
  },
  remotes: {
    mf_tile: 'mf_tile@http://localhost:3001/mf-manifest.json',
  },
  shared: {
    react: { singleton: true, eager: true },
    'react-dom': { singleton: true, eager: true },
  },
});
```

**Key Features:**

- Generates `mf-manifest.json` for dynamic loading
- Supports on-demand chunk loading
- Better code splitting than Webpack

### 6. mf_tile (Port 3001) - Rsbuild Modern

**Purpose**: Modern tile MFE using Rsbuild

---

## Key Technologies

### Module Federation Concepts

| Concept     | Description                                                  |
| ----------- | ------------------------------------------------------------ |
| **Host**    | The app that imports and uses remote modules                 |
| **Remote**  | The app that exposes modules for others to use               |
| **Shared**  | Dependencies (like React) loaded once and shared across MFEs |
| **Exposes** | Modules a remote app makes available to hosts                |
| **Remotes** | External MFEs this app can load                              |

### Shared Dependencies (Singletons)

These are marked as `singleton: true` to ensure one instance across all MFEs:

```javascript
shared: {
  react: { singleton: true, eager: true, requiredVersion: '^18.2.0' },
  "react-dom": { singleton: true, eager: true },
  "@emotion/react": { singleton: true, eager: true },
}
```

| Option            | Purpose                                         |
| ----------------- | ----------------------------------------------- |
| `eager: true`     | Load immediately at startup (for critical deps) |
| `singleton: true` | Only one instance across all MFEs               |
| `requiredVersion` | Version constraint for shared library           |

### Single-SPA Key Concepts

| Concept                   | Description                            |
| ------------------------- | -------------------------------------- |
| **registerApplication**   | Register an MFE with single-spa        |
| **constructRoutes**       | Parse layout HTML into route objects   |
| **constructApplications** | Create application loaders from routes |
| **constructLayoutEngine** | Build the layout management system     |
| **start**                 | Begin the lifecycle management         |

---

## Package Dependencies

### fdc3-broker

Core package for inter-application communication:

| File                        | Purpose                         |
| --------------------------- | ------------------------------- |
| `src/broker.ts`             | Main FDC3 broker implementation |
| `src/channel-manager.ts`    | Manages FDC3 channels           |
| `src/channel.ts`            | Channel implementation          |
| `src/intent-resolver.ts`    | Resolves intents to apps        |
| `src/tile-registry.ts`      | Registry of available tiles     |
| `src/openfin-bridge.ts`     | OpenFin platform integration    |
| `src/intent-queue.ts`       | Queue for pending intents       |
| `src/postmessage-bridge.ts` | PostMessage communication       |
| `src/entitlements.ts`       | Entitlement checking            |
| `src/types.ts`              | TypeScript type definitions     |

### fdc3-agent

API exposed to tile applications for FDC3 operations:

| Method                 | Purpose                    |
| ---------------------- | -------------------------- |
| `raiseIntent()`        | Send intent to another app |
| `broadcast()`          | Send context to all apps   |
| `addContextListener()` | Receive contexts           |
| `createChannel()`      | Create a private channel   |

### fdc3-app-directory

Manages the app directory for FDC3:

- App registration
- App metadata
- Intent declarations

### fdc3-resolver-ui

UI for resolving intents:

- Shows available apps for an intent
- User selection UI
- Integration with broker

---

## Development Guide

### Development Ports

| App          | Port | Technology |
| ------------ | ---- | ---------- |
| root-config  | 8001 | Webpack    |
| base         | 8002 | Webpack    |
| container    | 8007 | Webpack    |
| tile         | 8006 | Webpack    |
| mf_container | 3000 | Rsbuild    |
| mf_tile      | 3001 | Rsbuild    |

### Starting Development

```bash
# From root directory
npm run dev
```

This starts all MFEs using turbo.

### Individual App Development

```bash
# Webpack apps
cd apps/base
npm run dev

# Rsbuild apps
cd apps/mf_container
npm run dev
```

### Adding a New MFE

1. **Create app in `apps/` directory**

2. **Configure module federation:**
   - For Webpack: Create `module-federation.config.js`
   - For Rsbuild: Create `module-federation.config.ts`

3. **Add import map entry** in `apps/root-config/public/importmaplocal.json`:

   ```json
   {
     "imports": {
       "@fm/new-mfe": "//localhost:8099/new-mfe.js"
     }
   }
   ```

4. **Register in layout** `apps/root-config/src/microfrontend-layout.html`:

   ```html
   <application name="@fm/new-mfe"></application>
   ```

5. **Export single-spa lifecycle functions:**

   ```typescript
   // src/root.tsx
   import singleSpaReact from 'single-spa-react';

   const lifecycles = singleSpaReact({
     React,
     ReactDOMClient,
     rootComponent: App,
   });

   export const { bootstrap, mount, unmount } = lifecycles;
   ```

### Building for Production

```bash
# Build all apps
npm run build

# Build single app
cd apps/base
npm run build
```

---

## Architecture Benefits

This architecture provides:

1. **Independent Deployment**: Each MFE can be deployed separately
2. **Technology Agnostic**: Mix Webpack and Rsbuild MFEs
3. **Shared Dependencies**: React loaded once, not duplicated
4. **Inter-app Communication**: FDC3 standard for financial apps
5. **Lazy Loading**: Rsbuild supports on-demand chunk loading
6. **Scalability**: Add new features without modifying existing MFEs

---

## Troubleshooting

### Common Issues

| Issue                   | Solution                                            |
| ----------------------- | --------------------------------------------------- |
| Module version mismatch | Ensure shared dependencies have compatible versions |
| Circular dependencies   | Restructure code to remove circular imports         |
| Styling conflicts       | Use CSS modules or scoped styles                    |
| Cross-origin errors     | Configure CORS in webpack dev server                |

### Useful Commands

```bash
# Check for dependency issues
npm ls

# Clean all builds
npm run clean

# Lint code
npm run lint

# Run tests
npm run test
```

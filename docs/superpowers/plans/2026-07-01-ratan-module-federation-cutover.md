# Ratan Module Federation Cutover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `apps/mfe-ratan-container` and `apps/mfe-cashflow-blotter` active Module Federation remotes while preserving their old SystemJS source files for later manual deletion.

**Architecture:** The two Ratan apps become Rsbuild Module Federation remotes that expose their existing `src/root.tsx` APIs. `apps/base` becomes the compatibility bridge: migrated Ratan container identifiers load through `@module-federation/enhanced/runtime`, and all other app identifiers continue through `System.import()`.

**Tech Stack:** React 18, TypeScript, Rsbuild, Rspack, `@module-federation/rsbuild-plugin`, `@module-federation/enhanced/runtime`, Jest, Playwright.

## Global Constraints

- Hard runtime cutover for `mfe-ratan-container` and `mfe-cashflow-blotter`.
- Keep `src/system-entry.ts` in both migrated apps.
- Do not delete SystemJS-specific declarations unless they block the Module Federation build.
- Keep existing ports: `8009` for `mfe-ratan-container`, `8015` for `mfe-cashflow-blotter`.
- Keep `.env.mfe` parsing and `process.env.*` define injection in both apps.
- `apps/base` must keep SystemJS loading for non-migrated applications.
- React and ReactDOM must be shared as Module Federation singletons.
- Avoid unrelated business-logic refactors.

---

## File Structure

- `apps/base/src/pages/Home/common/remoteLoader.ts`: new focused loader utility that maps legacy Ratan app identifiers to Module Federation remote names and falls back to `System.import()`.
- `apps/base/src/pages/Home/common/remoteLoader.test.ts`: new unit tests for the loader contract.
- `apps/base/src/pages/Home/common/Container.tsx`: use the loader utility in `React.lazy()`.
- `apps/mfe-ratan-container/module-federation.config.ts`: new Module Federation remote config for `ratan_container`.
- `apps/mfe-ratan-container/rsbuild.config.ts`: switch active build output from SystemJS library mode to Module Federation plugin mode while preserving env, Less, aliases, CORS, and version banner.
- `apps/mfe-cashflow-blotter/module-federation.config.ts`: new Module Federation remote config for `ratan_cashflow_blotter` and remote dependency on `ratan_container`.
- `apps/mfe-cashflow-blotter/rsbuild.config.ts`: switch active build output from SystemJS library mode to Module Federation plugin mode while preserving env, aliases, CORS, fallback, version banner, and `version.json`.
- `apps/mfe-ratan-container/package.json`: add `@module-federation/rsbuild-plugin`.
- `apps/mfe-cashflow-blotter/package.json`: add `@module-federation/rsbuild-plugin`.
- `apps/root-config/scripts/importmap.test.js`: update expectations for migrated Ratan remote manifest URLs if import maps are changed.
- `apps/root-config/public/importmaplocal.json`: route active migrated Ratan identifiers to local `mf-manifest.json` URLs if the host uses import-map-provided identifiers.
- `apps/root-config/public/importmap.json`: route active migrated Ratan identifiers to production `mf-manifest.json` URLs if the host uses import-map-provided identifiers.
- `tests/e2e/mfe-cashflow-blotter-rendering.spec.ts`: update SystemJS checks to Module Federation artifact/runtime checks.
- `tests/e2e/mfe-rsbuild-verification.spec.ts`: stop asserting the two migrated Ratan apps are SystemJS modules; assert Module Federation manifests instead.

---

### Task 1: Add Host Loader Contract

**Files:**

- Create: `apps/base/src/pages/Home/common/remoteLoader.ts`
- Create: `apps/base/src/pages/Home/common/remoteLoader.test.ts`
- Modify: `apps/base/src/pages/Home/common/Container.tsx`

**Interfaces:**

- Produces: `loadWorkspaceRemote(containerName: string): Promise<{ default: React.ComponentType<any> }>`
- Consumes: `loadRemote(remoteName: string)` from `@module-federation/enhanced/runtime`

- [ ] **Step 1: Write the failing loader tests**

Create `apps/base/src/pages/Home/common/remoteLoader.test.ts`:

```ts
import { loadRemote } from '@module-federation/enhanced/runtime';
import { loadWorkspaceRemote } from './remoteLoader';

jest.mock('@module-federation/enhanced/runtime', () => ({
  loadRemote: jest.fn(),
}));

describe('loadWorkspaceRemote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (globalThis as typeof globalThis & { System?: { import: jest.Mock } }).System = {
      import: jest.fn().mockResolvedValue({ default: () => null }),
    };
  });

  it('loads the Ratan container through Module Federation', async () => {
    (loadRemote as jest.Mock).mockResolvedValue({ default: () => null });

    await loadWorkspaceRemote('@fm/ratan_container');

    expect(loadRemote).toHaveBeenCalledWith('ratan_container');
    expect(globalThis.System.import).not.toHaveBeenCalled();
  });

  it('loads the cashflow blotter through Module Federation', async () => {
    (loadRemote as jest.Mock).mockResolvedValue({ default: () => null });

    await loadWorkspaceRemote('@fm/ratan_cashflow_blotter');

    expect(loadRemote).toHaveBeenCalledWith('ratan_cashflow_blotter');
    expect(globalThis.System.import).not.toHaveBeenCalled();
  });

  it('keeps non-migrated containers on SystemJS', async () => {
    await loadWorkspaceRemote('@fm/base');

    expect(loadRemote).not.toHaveBeenCalled();
    expect(globalThis.System.import).toHaveBeenCalledWith('@fm/base');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
cd apps/base && npm test -- --runTestsByPath src/pages/Home/common/remoteLoader.test.ts --watchAll=false
```

Expected: FAIL because `remoteLoader.ts` does not exist.

- [ ] **Step 3: Implement the loader utility**

Create `apps/base/src/pages/Home/common/remoteLoader.ts`:

```ts
import { loadRemote } from '@module-federation/enhanced/runtime';
import type React from 'react';

type RemoteModule = {
  default: React.ComponentType<any>;
};

const moduleFederationRemotes: Record<string, string> = {
  '@fm/ratan_container': 'ratan_container',
  '@fm/ratan_cashflow_blotter': 'ratan_cashflow_blotter',
};

export const loadWorkspaceRemote = async (containerName: string): Promise<RemoteModule> => {
  const remoteName = moduleFederationRemotes[containerName];

  if (remoteName) {
    return loadRemote(remoteName) as Promise<RemoteModule>;
  }

  return System.import(containerName) as Promise<RemoteModule>;
};
```

- [ ] **Step 4: Wire `Container.tsx` to the loader**

Update `apps/base/src/pages/Home/common/Container.tsx`:

```ts
import { loadWorkspaceRemote } from './remoteLoader';
```

Replace the `React.lazy(async () => { ... })` body with:

```ts
React.lazy(() => loadWorkspaceRemote(props.container));
```

Keep the existing `useMemo` dependency behavior unless tests expose stale container loading.

- [ ] **Step 5: Run the focused host tests**

Run:

```bash
cd apps/base && npm test -- --runTestsByPath src/pages/Home/common/remoteLoader.test.ts src/pages/Home/common/Container.test.tsx --watchAll=false
```

Expected: PASS.

---

### Task 2: Convert Ratan Container Active Build To Module Federation

**Files:**

- Create: `apps/mfe-ratan-container/module-federation.config.ts`
- Modify: `apps/mfe-ratan-container/rsbuild.config.ts`
- Modify: `apps/mfe-ratan-container/package.json`

**Interfaces:**

- Produces: Module Federation remote `ratan_container` exposing `'.'`.
- Consumes: existing `./src/root.tsx` export namespace.

- [ ] **Step 1: Add Module Federation dependency**

In `apps/mfe-ratan-container/package.json`, add to `devDependencies`:

```json
"@module-federation/rsbuild-plugin": "^2.6.0"
```

- [ ] **Step 2: Create the Module Federation config**

Create `apps/mfe-ratan-container/module-federation.config.ts`:

```ts
import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';
import pkg from './package.json';

export default createModuleFederationConfig({
  name: 'ratan_container',
  filename: 'ratan_container.js',
  exposes: {
    '.': './src/root.tsx',
  },
  shared: {
    react: {
      singleton: true,
      requiredVersion: pkg.dependencies.react,
    },
    'react-dom': {
      singleton: true,
      requiredVersion: pkg.dependencies['react-dom'],
    },
  },
});
```

- [ ] **Step 3: Switch Rsbuild plugins and entry**

In `apps/mfe-ratan-container/rsbuild.config.ts`:

```ts
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import moduleFederationConfig from './module-federation.config';
```

Change plugins to:

```ts
plugins: [
  pluginReact({ splitChunks: false }),
  pluginLess(),
  pluginModuleFederation(moduleFederationConfig),
],
```

Remove the `source.entry.ratan_container` block so Module Federation owns the runtime entry.

- [ ] **Step 4: Remove active SystemJS output settings only**

In the active Rspack config for `apps/mfe-ratan-container/rsbuild.config.ts`, remove:

```ts
externalsType: 'system',
externals: {
  react: 'react',
  'react-dom': 'react-dom',
  'react-dom/client': 'react-dom/client',
  '@fm/base': '@fm/base',
},
output: {
  uniqueName: '@fm/ratan_container',
  library: {
    type: 'system',
  },
  chunkFilename: '[chunkhash].[name].ratan_container.js',
  publicPath: `http://localhost:${port}/`,
},
```

Keep the version banner plugin, aliases, CORS headers, `.env.mfe` injection, and Less plugin.

- [ ] **Step 5: Build and inspect artifacts**

Run:

```bash
cd apps/mfe-ratan-container && npm run build
```

Expected: PASS and `dist/mf-manifest.json` exists.

---

### Task 3: Convert Cashflow Blotter Active Build To Module Federation

**Files:**

- Create: `apps/mfe-cashflow-blotter/module-federation.config.ts`
- Modify: `apps/mfe-cashflow-blotter/rsbuild.config.ts`
- Modify: `apps/mfe-cashflow-blotter/package.json`

**Interfaces:**

- Produces: Module Federation remote `ratan_cashflow_blotter` exposing `'.'`.
- Consumes: remote `ratan_container@http://localhost:8009/mf-manifest.json`.

- [ ] **Step 1: Add Module Federation dependency**

In `apps/mfe-cashflow-blotter/package.json`, add to `devDependencies`:

```json
"@module-federation/rsbuild-plugin": "^2.6.0"
```

- [ ] **Step 2: Create the Module Federation config**

Create `apps/mfe-cashflow-blotter/module-federation.config.ts`:

```ts
import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';
import pkg from './package.json';

export default createModuleFederationConfig({
  name: 'ratan_cashflow_blotter',
  filename: 'ratan_cashflow_blotter.js',
  exposes: {
    '.': './src/root.tsx',
  },
  remotes: {
    ratan_container: 'ratan_container@http://localhost:8009/mf-manifest.json',
  },
  shared: {
    react: {
      singleton: true,
      requiredVersion: pkg.dependencies.react,
    },
    'react-dom': {
      singleton: true,
      requiredVersion: pkg.dependencies['react-dom'],
    },
  },
});
```

- [ ] **Step 3: Switch Rsbuild plugins and entry**

In `apps/mfe-cashflow-blotter/rsbuild.config.ts`:

```ts
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import moduleFederationConfig from './module-federation.config';
```

Change plugins to:

```ts
plugins: [
  pluginReact({ splitChunks: false }),
  pluginModuleFederation(moduleFederationConfig),
],
```

Remove the `source.entry.ratan_cashflow_blotter` block so Module Federation owns the runtime entry.

- [ ] **Step 4: Remove active SystemJS output settings only**

In the active Rspack config for `apps/mfe-cashflow-blotter/rsbuild.config.ts`, remove:

```ts
externalsType: 'system',
externals: {
  react: 'react',
  'react-dom': 'react-dom',
  'react-dom/client': 'react-dom/client',
  '@fm/base': '@fm/base',
  '@fm/ratan_container': '@fm/ratan_container',
},
output: {
  uniqueName: '@fm/ratan_cashflow_blotter',
  library: {
    type: 'system',
  },
  chunkFilename: '[chunkhash].[name].ratan_cashflow_blotter.js',
  publicPath: `http://localhost:${port}/`,
},
```

Keep `resolve.fallback.net = false`, aliases, CORS headers, `.env.mfe` injection, version banner, and `VersionJsonPlugin`.

- [ ] **Step 5: Build and inspect artifacts**

Run:

```bash
cd apps/mfe-cashflow-blotter && npm run build
```

Expected: PASS and `dist/mf-manifest.json` exists.

---

### Task 4: Update Runtime Contract Tests

**Files:**

- Modify: `tests/e2e/mfe-cashflow-blotter-rendering.spec.ts`
- Modify: `tests/e2e/mfe-rsbuild-verification.spec.ts`
- Modify if import maps change: `apps/root-config/scripts/importmap.test.js`

**Interfaces:**

- Consumes: `http://localhost:8009/mf-manifest.json`
- Consumes: `http://localhost:8015/mf-manifest.json`

- [ ] **Step 1: Replace SystemJS artifact assertions**

In `tests/e2e/mfe-rsbuild-verification.spec.ts`, change the first test to fetch:

```ts
[
  { name: 'ratan_cashflow_blotter', url: 'http://localhost:8015/mf-manifest.json' },
  { name: 'ratan_container', url: 'http://localhost:8009/mf-manifest.json' },
  { name: '@fm/flowzero', url: 'http://localhost:8016/flowzero.js' },
];
```

Assert Ratan manifests contain remote metadata and keep the Flowzero `System.register` assertion.

- [ ] **Step 2: Replace direct `System.import()` cashflow checks**

In `tests/e2e/mfe-cashflow-blotter-rendering.spec.ts`, stop calling:

```ts
(window as any).System.import('@fm/ratan_cashflow_blotter');
```

Replace with manifest checks for `http://localhost:8015/mf-manifest.json` and `http://localhost:8009/mf-manifest.json`, plus browser workspace rendering through the actual base loader.

- [ ] **Step 3: Run focused static tests**

Run:

```bash
cd apps/root-config && npm test -- --runTestsByPath scripts/importmap.test.js --watchAll=false
```

Expected: PASS if import-map expectations still match the chosen active contract.

- [ ] **Step 4: Run focused e2e tests when dev servers are available**

Run:

```bash
npm run test:e2e -- tests/e2e/mfe-rsbuild-verification.spec.ts tests/e2e/mfe-cashflow-blotter-rendering.spec.ts
```

Expected: PASS with the UI stack running.

---

### Task 5: Final Verification

**Files:**

- No new files expected.

**Interfaces:**

- Consumes all outputs from Tasks 1-4.

- [ ] **Step 1: Run package install if lockfile needs dependency updates**

Run:

```bash
npm install
```

Expected: package lock includes the added workspace dev dependencies.

- [ ] **Step 2: Build migrated remotes**

Run:

```bash
npm --workspace apps/mfe-ratan-container run build
npm --workspace apps/mfe-cashflow-blotter run build
```

Expected: both commands PASS.

- [ ] **Step 3: Run host loader tests**

Run:

```bash
npm --workspace apps/base test -- --runTestsByPath src/pages/Home/common/remoteLoader.test.ts src/pages/Home/common/Container.test.tsx --watchAll=false
```

Expected: PASS.

- [ ] **Step 4: Run root-config import-map tests**

Run:

```bash
npm --workspace apps/root-config test -- --runTestsByPath scripts/importmap.test.js --watchAll=false
```

Expected: PASS.

- [ ] **Step 5: Manual UI verification**

Run:

```bash
npm run dev:ui
```

Then verify:

- Open `http://localhost:8001`.
- Click `Sign In`.
- Click `New Tile`.
- Open a migrated Ratan-backed tile.
- Confirm it renders without missing remote or duplicate React errors.
- Delete the workspace tab.

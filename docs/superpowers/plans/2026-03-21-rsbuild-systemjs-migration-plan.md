# Rsbuild SystemJS Migration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate `apps/base`, `apps/container`, and `apps/tile` from webpack to the latest Rsbuild stack while preserving the existing SystemJS import-map contract and proving that container and tile still load successfully.

**Architecture:** Keep `apps/root-config` unchanged as the SystemJS host. Rebuild each legacy app with Rsbuild/Rspack configured to emit `System.register` bundles with the same public entry filenames and equivalent externals/public-path behavior. Add an automated SystemJS smoke harness first, then migrate each app one by one, and finish with host-level verification through `root-config`.

**Tech Stack:** Rsbuild `@rsbuild/core@1.7.3`, `@rsbuild/plugin-react@1.4.6`, `@rsbuild/plugin-less@1.6.2`, Rspack low-level output overrides, single-spa, SystemJS, Playwright smoke verification, npm workspaces, Turbo

---

### Task 1: Add a SystemJS Regression Harness Before Changing Builders

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/systemjs-smoke.spec.ts`
- Create: `apps/root-config/public/systemjs-smoke.html`
- Create: `apps/root-config/public/systemjs-smoke.js`
- Modify: `package.json`

- [ ] **Step 1: Add the browser smoke test dependencies and root scripts**

Run:

```bash
npm install -D @playwright/test
```

Update `package.json` with scripts like:

```json
{
  "scripts": {
    "test:e2e:systemjs": "playwright test tests/e2e/systemjs-smoke.spec.ts",
    "test:e2e:systemjs:headed": "playwright test tests/e2e/systemjs-smoke.spec.ts --headed"
  }
}
```

- [ ] **Step 2: Create a standalone SystemJS smoke page served by `root-config`**

`apps/root-config/public/systemjs-smoke.html` should:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>SystemJS Smoke</title>
    <script type="systemjs-importmap" src="/importmaplocal.json"></script>
    <script src="/js/external/system.min.js"></script>
    <script src="/js/external/amd.min.js"></script>
  </head>
  <body>
    <div id="status">booting</div>
    <div id="container-root"></div>
    <script type="module" src="/systemjs-smoke.js"></script>
  </body>
</html>
```

`apps/root-config/public/systemjs-smoke.js` should:

```js
async function main() {
  const status = document.getElementById('status');
  const root = document.getElementById('container-root');

  const [React, ReactDOMClient, baseModule, containerModule, tileModule] = await Promise.all([
    System.import('react'),
    System.import('react-dom/client'),
    System.import('@fm/base'),
    System.import('@fm/template_container'),
    System.import('@fm/template'),
  ]);

  status.dataset.baseLoaded = String(Boolean(baseModule));
  status.dataset.containerLoaded = String(Boolean(containerModule?.default));
  status.dataset.tileLoaded = String(Boolean(tileModule?.default));

  const App = containerModule.default;
  const reactRoot = ReactDOMClient.createRoot(root);
  reactRoot.render(
    React.createElement(App, {
      module: '/template_container1',
      tile: '/template_tile1',
    }),
  );

  status.textContent = 'ready';
}

main().catch((error) => {
  const status = document.getElementById('status');
  status.textContent = 'error';
  status.dataset.error = error?.message || String(error);
  console.error(error);
});
```

- [ ] **Step 3: Add the Playwright smoke test that captures the current webpack baseline**

`tests/e2e/systemjs-smoke.spec.ts` should assert:

```ts
import { test, expect } from '@playwright/test';

test('SystemJS imports base, container, and tile without runtime errors', async ({ page }) => {
  const errors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('http://127.0.0.1:8001/systemjs-smoke.html');
  await expect(page.locator('#status')).toHaveText('ready');
  await expect(page.locator('#status')).toHaveAttribute('data-base-loaded', 'true');
  await expect(page.locator('#status')).toHaveAttribute('data-container-loaded', 'true');
  await expect(page.locator('#status')).toHaveAttribute('data-tile-loaded', 'true');
  expect(errors).toEqual([]);
});
```

- [ ] **Step 4: Run the smoke test against the current webpack implementation to capture the baseline**

Run in four terminals:

```bash
npm run dev --workspace apps/root-config
npm run dev --workspace apps/base
npm run dev --workspace apps/container
npm run dev --workspace apps/tile
```

Then run:

```bash
npm run test:e2e:systemjs
```

Expected: PASS. This is a baseline compatibility harness, not a failing-first unit test. The migration is done only when the same smoke test still passes after all builder changes.

- [ ] **Step 5: Commit the verification harness**

```bash
git add package.json playwright.config.ts tests/e2e/systemjs-smoke.spec.ts apps/root-config/public/systemjs-smoke.html apps/root-config/public/systemjs-smoke.js
git commit -m "test: add SystemJS smoke verification harness"
```

### Task 2: Migrate `apps/base` to Rsbuild While Keeping `base.js`

**Files:**
- Create: `apps/base/rsbuild.config.ts`
- Modify: `apps/base/package.json`
- Modify: `apps/base/src/root.tsx`
- Delete: `apps/base/webpack.config.js`
- Test: `tests/e2e/systemjs-smoke.spec.ts`

- [ ] **Step 1: Replace webpack dependencies and scripts with Rsbuild equivalents**

Run:

```bash
npm install -D -w apps/base @rsbuild/core@1.7.3 @rsbuild/plugin-react@1.4.6
npm remove -w apps/base webpack webpack-cli webpack-dev-server webpack-merge webpack-config-single-spa-react webpack-config-single-spa-react-ts webpack-config-single-spa-ts dotenv-webpack
```

Update `apps/base/package.json` scripts to:

```json
{
  "scripts": {
    "start": "env-cmd -f .env.local rsbuild dev",
    "dev": "cross-env FEDERATION_DEBUG=true env-cmd -f .env.local rsbuild dev",
    "build:webpack": "env-cmd -f .env.server rsbuild build"
  }
}
```

Rename `build:webpack` to `build:app` during implementation if that makes the package clearer, but update the parent `build` script in the same change.

- [ ] **Step 2: Create `apps/base/rsbuild.config.ts` with explicit SystemJS output**

Start from this shape:

```ts
import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const port = Number(process.env.port);

export default defineConfig(() => {
  const { parsed } = loadEnv({ processEnv: process.env });

  return {
    plugins: [pluginReact()],
    source: {
      entry: {
        base: './src/root.tsx',
      },
      define: Object.fromEntries(
        Object.entries(parsed).map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)]),
      ),
    },
    server: {
      port,
    },
    output: {
      assetPrefix: `http://localhost:${port}/`,
      filename: {
        js: '[name].js',
      },
    },
    tools: {
      rspack: {
        externals: {
          react: 'react',
          'react-dom': 'react-dom',
          'react-dom/client': 'react-dom/client',
          'single-spa': 'single-spa',
        },
        output: {
          library: {
            type: 'system',
          },
          uniqueName: '@fm/base',
          chunkFilename: '[chunkhash].[name].base.js',
        },
      },
    },
  };
});
```

Implementation notes:

- Preserve the top-level emitted file name as `base.js`.
- Keep the bundle consumable through `System.import('@fm/base')`.
- Do not change the public import-map entry.
- If `loadEnv` does not cover `.env.mfe` cleanly, add a tiny helper in this task rather than reintroducing webpack-only dotenv handling.

- [ ] **Step 3: Keep the lifecycle entry explicit in `apps/base/src/root.tsx`**

Do not simplify `src/root.tsx` away from explicit single-spa exports. Preserve:

```ts
export const { bootstrap, unmount } = lifecycles;
export const mount = rootElement ? MountComponent : lifecycles.mount;
```

If Rsbuild changes tree-shaking behavior, add a minimal assertion test or a dev-time check so these exports remain present in the built module namespace.

- [ ] **Step 4: Run isolated verification for `base`**

Run:

```bash
npm run build --workspace apps/base
npm run dev --workspace apps/root-config
npm run dev --workspace apps/base
```

Then, in a browser or using devtools console:

```js
await System.import('@fm/base')
```

Expected: resolves successfully, exports include `bootstrap`, `mount`, and `unmount`, and the served URL remains `http://localhost:8002/base.js`.

- [ ] **Step 5: Re-run the smoke test before moving to the next app**

Run:

```bash
npm run dev --workspace apps/container
npm run dev --workspace apps/tile
npm run test:e2e:systemjs
```

Expected: PASS. If this fails after only migrating `base`, fix `base` first. Do not continue with `container` or `tile` while the baseline host contract is broken.

- [ ] **Step 6: Commit the `base` migration**

```bash
git add apps/base/package.json apps/base/rsbuild.config.ts apps/base/src/root.tsx
git rm apps/base/webpack.config.js
git commit -m "build: migrate base from webpack to rsbuild"
```

### Task 3: Migrate `apps/container` to Rsbuild and Preserve Lazy System Import of `@fm/template`

**Files:**
- Create: `apps/container/rsbuild.config.ts`
- Modify: `apps/container/package.json`
- Modify: `apps/container/src/root.tsx`
- Modify: `apps/container/src/Root/import/TemplateTile.tsx`
- Delete: `apps/container/webpack.config.js`
- Test: `tests/e2e/systemjs-smoke.spec.ts`

- [ ] **Step 1: Replace webpack dependencies with Rsbuild and keep LESS support**

Run:

```bash
npm install -D -w apps/container @rsbuild/core@1.7.3 @rsbuild/plugin-react@1.4.6 @rsbuild/plugin-less@1.6.2
npm remove -w apps/container webpack webpack-cli webpack-dev-server webpack-merge webpack-config-single-spa-react webpack-config-single-spa-react-ts webpack-config-single-spa-ts dotenv-webpack mini-css-extract-plugin style-loader css-loader less-loader
```

Update `apps/container/package.json` scripts to use `rsbuild dev` and `rsbuild build`.

- [ ] **Step 2: Create `apps/container/rsbuild.config.ts` with explicit externals and SystemJS output**

Use this shape:

```ts
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginLess } from '@rsbuild/plugin-less';

const port = Number(process.env.port);

export default defineConfig({
  plugins: [pluginReact(), pluginLess()],
  source: {
    entry: {
      template_container: './src/root.tsx',
    },
  },
  server: {
    port,
  },
  output: {
    assetPrefix: `http://localhost:${port}/`,
    filename: {
      js: '[name].js',
    },
  },
  tools: {
    rspack: {
      externals: {
        react: 'react',
        'react-dom': 'react-dom',
        'react-dom/client': 'react-dom/client',
        '@fm/base': '@fm/base',
      },
      output: {
        library: {
          type: 'system',
        },
        uniqueName: '@fm/template_container',
        chunkFilename: '[chunkhash].[name].template_container.js',
      },
    },
  },
});
```

Port the current version banner behavior only if it is still consumed. If it is dead weight, remove it deliberately and note that in the PR/change summary.

- [ ] **Step 3: Make the container entry explicit if the webpack defaults were hiding lifecycle glue**

Today `apps/container/src/root.tsx` is:

```ts
import Root from './App';
export default Root;
```

During migration, verify whether the consuming path only needs a default React component or whether explicit single-spa lifecycle exports are required. If explicit exports are needed, rewrite `src/root.tsx` to mirror the `base` approach with `single-spa-react` while keeping the default export intact for the smoke page.

- [ ] **Step 4: Preserve the tile lazy-load path through SystemJS**

Keep `apps/container/src/Root/import/TemplateTile.tsx` functionally equivalent to:

```ts
const Mfe = React.lazy(() =>
  System.import('@fm/template').then((a) => a),
);
```

The migration must not replace this with federation or a static import.

- [ ] **Step 5: Run container-focused verification**

Run:

```bash
npm run build --workspace apps/container
npm run dev --workspace apps/root-config
npm run dev --workspace apps/base
npm run dev --workspace apps/container
npm run dev --workspace apps/tile
npm run test:e2e:systemjs
```

Expected:

- smoke page reaches `ready`
- no browser console errors
- `@fm/template_container` resolves from `http://localhost:8007/template_container.js`
- the container app renders and successfully triggers the nested `System.import('@fm/template')`

- [ ] **Step 6: Commit the `container` migration**

```bash
git add apps/container/package.json apps/container/rsbuild.config.ts apps/container/src/root.tsx apps/container/src/Root/import/TemplateTile.tsx
git rm apps/container/webpack.config.js
git commit -m "build: migrate template container from webpack to rsbuild"
```

### Task 4: Migrate `apps/tile` to Rsbuild and Preserve `template.js`

**Files:**
- Create: `apps/tile/rsbuild.config.ts`
- Modify: `apps/tile/package.json`
- Modify: `apps/tile/src/root.tsx`
- Delete: `apps/tile/webpack.config.js`
- Test: `tests/e2e/systemjs-smoke.spec.ts`

- [ ] **Step 1: Replace webpack dependencies with Rsbuild**

Run:

```bash
npm install -D -w apps/tile @rsbuild/core@1.7.3 @rsbuild/plugin-react@1.4.6
npm remove -w apps/tile webpack webpack-cli webpack-dev-server webpack-merge webpack-config-single-spa-react webpack-config-single-spa-react-ts webpack-config-single-spa-ts dotenv-webpack
```

Update `apps/tile/package.json` scripts to use `rsbuild dev` and `rsbuild build`.

- [ ] **Step 2: Create `apps/tile/rsbuild.config.ts`**

Use this shape:

```ts
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const port = Number(process.env.port);

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      template: './src/root.tsx',
    },
  },
  server: {
    port,
  },
  output: {
    assetPrefix: `http://localhost:${port}/`,
    filename: {
      js: '[name].js',
    },
  },
  tools: {
    rspack: {
      externals: {
        react: 'react',
        'react-dom': 'react-dom',
        'react-dom/client': 'react-dom/client',
        '@fm/base': '@fm/base',
      },
      output: {
        library: {
          type: 'system',
        },
        uniqueName: '@fm/template',
        chunkFilename: '[chunkhash].[name].template.js',
      },
    },
  },
});
```

- [ ] **Step 3: Keep the tile entry loadable as a component module**

`apps/tile/src/root.tsx` currently exports a default component. Preserve that shape unless verification shows the consumer now needs explicit lifecycles too.

If explicit single-spa lifecycles become necessary, export them in addition to the default component so `System.import('@fm/template')` remains compatible with `TemplateTile.tsx`.

- [ ] **Step 4: Run tile-focused verification**

Run:

```bash
npm run build --workspace apps/tile
npm run dev --workspace apps/root-config
npm run dev --workspace apps/base
npm run dev --workspace apps/container
npm run dev --workspace apps/tile
npm run test:e2e:systemjs
```

Expected:

- `@fm/template` resolves from `http://localhost:8006/template.js`
- lazy-loaded tile routes render instead of falling through to `FALL BACK`
- async route chunks load successfully with no 404s

- [ ] **Step 5: Commit the `tile` migration**

```bash
git add apps/tile/package.json apps/tile/rsbuild.config.ts apps/tile/src/root.tsx
git rm apps/tile/webpack.config.js
git commit -m "build: migrate template tile from webpack to rsbuild"
```

### Task 5: Clean Up Builder-Specific Debt and Lock the Final Scripts

**Files:**
- Modify: `apps/base/package.json`
- Modify: `apps/container/package.json`
- Modify: `apps/tile/package.json`
- Modify: `package.json`

- [ ] **Step 1: Normalize script names after all three apps are on Rsbuild**

Update the package scripts so they no longer refer to webpack. Preferred end state:

```json
{
  "scripts": {
    "start": "env-cmd -f .env.local rsbuild dev",
    "dev": "env-cmd -f .env.local rsbuild dev",
    "build": "concurrently \"npm run build:app\" \"npm run build:types\"",
    "build:app": "env-cmd -f .env.server rsbuild build"
  }
}
```

Apply the same cleanup to `apps/base`, `apps/container`, and `apps/tile`.

- [ ] **Step 2: Remove leftover webpack-only files and references**

Run:

```bash
rg -n "webpack|webpack serve|webpack --mode|webpack-config-single-spa" apps/base apps/container apps/tile
```

Expected: only intentionally retained documentation references remain. Remove stale builder references from package scripts and active source files.

- [ ] **Step 3: Run workspace install and a clean build**

Run:

```bash
npm install
npm run build --workspace apps/base
npm run build --workspace apps/container
npm run build --workspace apps/tile
```

Expected: all three build cleanly with Rsbuild, and the dist outputs include `base.js`, `template_container.js`, and `template.js`.

- [ ] **Step 4: Commit the cleanup**

```bash
git add package.json apps/base/package.json apps/container/package.json apps/tile/package.json
git commit -m "chore: remove legacy webpack build wiring"
```

### Task 6: Perform Final Integration Verification Through `root-config`

**Files:**
- Test: `tests/e2e/systemjs-smoke.spec.ts`

- [ ] **Step 1: Start the full local stack**

Run in separate terminals:

```bash
npm run dev --workspace apps/root-config
npm run dev --workspace apps/base
npm run dev --workspace apps/container
npm run dev --workspace apps/tile
```

- [ ] **Step 2: Run the automated smoke suite**

```bash
npm run test:e2e:systemjs
```

Expected: PASS.

- [ ] **Step 3: Run host-level browser verification in `root-config`**

Open `http://127.0.0.1:8001/` and verify all of the following:

- `@fm/base` loads as the default application without SystemJS errors.
- The browser can resolve `@fm/template_container` and `@fm/template` from the unchanged import map.
- The container route `/template_container1/*` renders through the migrated `template_container.js`.
- The tile route `/template_tile1/*` renders through the migrated `template.js`.
- Browser console is free of:
  - `System.register` / SystemJS format errors
  - missing export or missing lifecycle errors
  - chunk 404 errors
  - public-path or asset-prefix errors

- [ ] **Step 4: Record the exact verification evidence**

Capture and summarize:

- URL requested for `base.js`
- URL requested for `template_container.js`
- URL requested for `template.js`
- any async chunk URLs for container and tile
- console output status

This summary belongs in the implementation close-out so the migration is evidenced, not asserted.

- [ ] **Step 5: Run the existing quality gates**

Run:

```bash
npm run lint --workspace apps/base
npm run lint --workspace apps/container
npm run lint --workspace apps/tile
npm run test --workspace apps/base
npm run test --workspace apps/container
npm run test --workspace apps/tile
```

Expected: existing app-local checks pass, or any unrelated pre-existing failures are documented explicitly.

- [ ] **Step 6: Final commit**

```bash
git status --short
git add .
git commit -m "build: migrate legacy SystemJS apps from webpack to rsbuild"
```

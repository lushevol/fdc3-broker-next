# MFE Cashflow And Flowzero Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `mfe-cashflow-blotter` and `mfe-flowzero` available from the tile drawer and render through the correct SystemJS applications.

**Architecture:** Cashflow blotter remains a routed child of `@fm/ratan_container`; backend tile rows keep `import_map_id = 10` and modules like `cashflow_blotter_cn`. Flowzero is a direct app with `container = @fm/flowzero`, backed by its own import-map entry and a tile seed row.

**Tech Stack:** Single-SPA, SystemJS import maps, React 18, TypeScript, Jest, Spring Boot Flyway SQL seed data.

---

### Task 1: Import Map Regression Test

**Files:**
- Create: `apps/root-config/scripts/importmap.test.js`

- [ ] **Step 1: Write the failing test**

```js
const fs = require('fs');
const path = require('path');

const localImportMap = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../public/importmaplocal.json'), 'utf8'),
);
const prodImportMap = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../public/importmap.json'), 'utf8'),
);

describe('MFE import maps', () => {
  it('routes ratan container, cashflow blotter, and flowzero to their local dev bundles', () => {
    expect(localImportMap.imports['@fm/ratan_container']).toBe(
      '//localhost:8009/ratan_container.js',
    );
    expect(localImportMap.imports['@fm/ratan_cashflow_blotter']).toBe(
      '//localhost:8015/ratan_cashflow_blotter.js',
    );
    expect(localImportMap.imports['@fm/flowzero']).toBe('//localhost:8016/flowzero.js');
  });

  it('routes flowzero and cashflow production bundle names', () => {
    expect(prodImportMap.imports['@fm/ratan_container']).toBe(
      '/ratan_container/ratan_container.js',
    );
    expect(prodImportMap.imports['@fm/ratan_cashflow_blotter']).toBe(
      '/ratan_cashflow_blotter/ratan_cashflow_blotter.js',
    );
    expect(prodImportMap.imports['@fm/flowzero']).toBe('/flowzero/flowzero.js');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --workspace apps/root-config test -- scripts/importmap.test.js --runInBand`

Expected: FAIL because `@fm/ratan_container` currently points at `//localhost:8007/ratan_container.js`.

- [ ] **Step 3: Fix import map entries**

Update `apps/root-config/public/importmaplocal.json` so `@fm/ratan_container` points to `//localhost:8009/ratan_container.js`, keep `@fm/ratan_cashflow_blotter` on `8015`, and keep `@fm/flowzero` on `8016`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --workspace apps/root-config test -- scripts/importmap.test.js --runInBand`

Expected: PASS.

### Task 2: Local Dev Script Coverage

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update local UI dev command**

Change `dev:ui` so it starts `apps/mfe-ratan-container`, `apps/mfe-cashflow-blotter`, and `apps/mfe-flowzero` in addition to the existing shell apps.

- [ ] **Step 2: Verify package scripts exist**

Run: `npm --workspace apps/mfe-ratan-container run dev -- --help`, `npm --workspace apps/mfe-cashflow-blotter run dev -- --help`, and `npm --workspace apps/mfe-flowzero run dev -- --help`.

Expected: each workspace has a usable `dev` script or is patched to add one equivalent to its `start` script.

### Task 3: Backend Menu Seed Data

**Files:**
- Modify: `services/backend/src/main/resources/migration/V1_0_1__fmo_data_import.sql`
- Modify or create later migration if the repository pattern requires additive changes

- [ ] **Step 1: Add Flowzero import map seed**

Add an active `import_map` row with `key_name = 'flowzero'`, `path = '/flowzero/flowzero.js'`, and an unused ID.

- [ ] **Step 2: Add Flowzero menu tile seed**

Add a Flowzero category or place it in an existing appropriate category. The tile must have `module = '/flowzero'`, `tile = '/home'`, and `import_map_id` pointing to the Flowzero import map.

- [ ] **Step 3: Preserve cashflow ratan-container routing**

Confirm cashflow tile rows keep `import_map_id = 10`, `module = 'cashflow_blotter_cn'` or the existing ratan route modules, and tile values matching `mfe-cashflow-blotter` routes.

### Task 4: Verification

**Files:**
- No new files expected

- [ ] **Step 1: Run targeted tests**

Run: `npm --workspace apps/root-config test -- scripts/importmap.test.js --runInBand`

Expected: PASS.

- [ ] **Step 2: Build target MFEs**

Run: `npm --workspace apps/mfe-ratan-container run build:webpack`, `npm --workspace apps/mfe-cashflow-blotter run build:webpack`, and `npm --workspace apps/mfe-flowzero run build:webpack`.

Expected: all bundles build or any blocker is reported with the exact failure.

- [ ] **Step 3: Runtime smoke if feasible**

Start the local UI stack, open `http://localhost:8001`, log in, open the tile drawer, launch Cashflow Blotter and Flowzero, and confirm both render in workspace tabs.

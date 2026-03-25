# Root Config Rsbuild Migration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace webpack in `apps/root-config` with Rsbuild while preserving current build output, dev mocks, and proxy behavior.

**Architecture:** Add an Rsbuild config that mirrors the current webpack setup closely. Keep behavior-focused tests around middleware and proxy definitions so the migration stays parity-first instead of becoming a refactor.

**Tech Stack:** Rsbuild, TypeScript, Jest, Single-SPA, SystemJS

---

### Task 1: Lock current behavior with tests

**Files:**

- Create: `apps/root-config/rsbuild.config.test.ts`
- Delete: `apps/root-config/webpack.config.test.ts`
- Test: `apps/root-config/rsbuild.config.test.ts`

- [ ] **Step 1: Write the failing test**
- [ ] **Step 2: Run `npm test -- rsbuild.config.test.ts` in `apps/root-config` and confirm failure**
- [ ] **Step 3: Assert auth mocks remain conditional and proxy routes remain present**
- [ ] **Step 4: Re-run the test after implementation**

### Task 2: Replace webpack config with Rsbuild

**Files:**

- Create: `apps/root-config/rsbuild.config.ts`
- Create: `apps/root-config/dev-server.ts`
- Delete: `apps/root-config/webpack.config.js`

- [ ] **Step 1: Port proxy definitions into a reusable helper**
- [ ] **Step 2: Port mock middleware registration into a reusable helper**
- [ ] **Step 3: Build `rsbuild.config.ts` around the same HTML template, entry, and output contract**
- [ ] **Step 4: Re-run focused Jest tests**

### Task 3: Update package scripts and dependencies

**Files:**

- Modify: `apps/root-config/package.json`

- [ ] **Step 1: Replace webpack scripts with rsbuild equivalents**
- [ ] **Step 2: Remove webpack-only dependencies**
- [ ] **Step 3: Add required Rsbuild dependencies**
- [ ] **Step 4: Verify `npm run build` for `apps/root-config`**

### Task 4: Verify migration end to end

**Files:**

- Modify: `apps/root-config/README.md`

- [ ] **Step 1: Run root-config Jest tests**
- [ ] **Step 2: Run root-config build**
- [ ] **Step 3: Run UI verification against `http://localhost:8001` after starting the app**
- [ ] **Step 4: Update README commands if needed**

# Smart Dev Launcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a smart root launcher that starts any selected combination of UI apps and all services in `services/`.

**Architecture:** Put service metadata and command planning in `scripts/dev-launcher.js`, exporting pure functions for tests and running the CLI only when invoked directly. Align Maven-only services by adding npm workspace `package.json` wrappers. Root scripts call the launcher for the new `dev:smart` entry point while preserving existing script names.

**Tech Stack:** Node.js CommonJS scripts, Node built-in `node:test`, npm workspaces, Maven Spring Boot service commands, `concurrently`, `cross-env`.

## Global Constraints

- Preserve existing dev script behavior unless explicitly replacing a command with equivalent launcher arguments.
- Include every service directory under `services/`.
- Use `ACTIVE_ENV` profiles from root `.env.profile.*`.
- Do not commit secrets or profile-local files.
- Keep tests focused on dry planning logic and avoid starting long-running services in automated tests.

---

### Task 1: Launcher Planning Tests

**Files:**
- Create: `scripts/dev-launcher.test.js`
- Create: `scripts/dev-launcher.js`

**Interfaces:**
- Produces: `parseArgs(argv: string[]): ParsedOptions`
- Produces: `createLaunchPlan(options: ParsedOptions): LaunchPlan`
- Produces: `SERVICE_REGISTRY`
- Produces: `PRESETS`

- [ ] **Step 1: Write failing tests for flag parsing and launch planning**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { createLaunchPlan, parseArgs } = require('./dev-launcher');

test('selects chatbot and flowzero MCP from flags', () => {
  const plan = createLaunchPlan(parseArgs(['--chatbot', '--flowzero-mcp', '--no-stop']));

  assert.equal(plan.profile, 'dev');
  assert.deepEqual(
    plan.components.map((component) => component.id),
    ['flowzero-mcp', 'chatbot'],
  );
  assert.equal(plan.shouldStopFirst, false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/dev-launcher.test.js`

Expected: FAIL with module or function missing.

- [ ] **Step 3: Implement minimal launcher exports and registry**

Create `scripts/dev-launcher.js` with registry, preset, argument parsing, and launch plan functions. The CLI execution path can still be minimal for this task.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/dev-launcher.test.js`

Expected: PASS.

### Task 2: Presets, Dependency Waits, and Dry Run

**Files:**
- Modify: `scripts/dev-launcher.test.js`
- Modify: `scripts/dev-launcher.js`

**Interfaces:**
- Consumes: `parseArgs(argv: string[])`
- Consumes: `createLaunchPlan(options: ParsedOptions)`
- Produces: `formatDryRun(plan: LaunchPlan): string`

- [ ] **Step 1: Write failing tests for presets, `--all`, waits, and validation**

```js
test('flowzero chatbot preset selects UI, FlowZero MCP, chatbot, and model validation', () => {
  const plan = createLaunchPlan(parseArgs(['--preset', 'flowzero-chatbot']));

  assert.equal(plan.profile, 'flowzero-chatbot');
  assert.equal(plan.validateChatbotModel, true);
  assert.deepEqual(
    plan.components.map((component) => component.id),
    ['ui', 'flowzero-mcp', 'chatbot'],
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/dev-launcher.test.js`

Expected: FAIL on missing preset behavior.

- [ ] **Step 3: Implement preset expansion and chatbot wait command generation**

Add preset definitions, `--all`, `--dry-run`, dependency health waits, and clear error messages.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/dev-launcher.test.js`

Expected: PASS.

### Task 3: Service Wrapper Alignment

**Files:**
- Create: `services/auth-server/package.json`
- Create: `services/flowzero-designer-service/package.json`
- Create: `services/flowzero-orchestration-service/package.json`
- Modify: `package.json`

**Interfaces:**
- Consumes: root npm workspace discovery via `"services/*"`.
- Produces: aligned `dev`, `test`, and `build` scripts for Maven-only services.

- [ ] **Step 1: Write failing package script assertions**

Add test assertions that every service in `SERVICE_REGISTRY` except `ui` has a matching `services/<dir>/package.json` and a `dev` script.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/dev-launcher.test.js`

Expected: FAIL for missing Maven-only package wrappers.

- [ ] **Step 3: Add package wrappers and root script**

Add aligned `package.json` files for Maven-only services. Add root `dev:smart`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test scripts/dev-launcher.test.js`

Expected: PASS.

### Task 4: Root Script Compatibility and Verification

**Files:**
- Modify: `package.json`
- Modify: `scripts/dev-launcher.js`

**Interfaces:**
- Consumes: `dev:smart` root npm script.
- Produces: backwards-compatible launcher aliases for common demo scripts.

- [ ] **Step 1: Write failing test for root script contract**

Assert root `package.json` exposes `dev:smart` and does not remove existing dev script names.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test scripts/dev-launcher.test.js`

Expected: FAIL until `dev:smart` exists.

- [ ] **Step 3: Add root script and preserve existing scripts**

Add `"dev:smart": "node scripts/dev-launcher.js"` and optionally point demo aliases at equivalent launcher invocations after dry-run parity is verified.

- [ ] **Step 4: Run targeted verification**

Run:

```bash
node --test scripts/dev-launcher.test.js
npm run dev:smart -- --dry-run --chatbot --flowzero-mcp --no-stop
npm run dev:smart -- --dry-run --preset flowzero-chatbot --no-stop
```

Expected: all commands exit `0`.


# FDC3 Package Completions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete direct unfinished FDC3 package behavior and repair the failing resolver-ui test.

**Architecture:** Reuse the existing PostMessage request/response envelope for channel methods and keep broker integration consistent with the OpenFin channel sync path. Align AppCard styling with the package's current test and documented transition contract.

**Tech Stack:** TypeScript, React, Vitest, tsup.

---

### Task 1: PostMessage Channel Behavior Tests

**Files:**
- Modify: `packages/fdc3-broker/test/postmessage-bridge.test.ts`

- [ ] Replace the placeholder no-op tests with tests that assert `joinUserChannel`, `broadcast`, `getCurrentChannel`, and `getUserChannels` send the correct PostMessage method and resolve from successful responses.
- [ ] Run `npm test -- --run test/postmessage-bridge.test.ts --coverage=false` in `packages/fdc3-broker` and confirm the new tests fail against the placeholder implementation.

### Task 2: PostMessage Channel Implementation

**Files:**
- Modify: `packages/fdc3-broker/src/postmessage-bridge.ts`
- Modify: `packages/fdc3-broker/src/broker.ts`

- [ ] Implement bridge channel methods using `sendRequest`.
- [ ] Accept optional `targetOrigin` parameters without breaking existing call sites.
- [ ] Sync broker `broadcast`, `getUserChannels`, and `joinUserChannel` to PostMessage when enabled.
- [ ] Run `npm test -- --run test/postmessage-bridge.test.ts --coverage=false` in `packages/fdc3-broker` and confirm it passes.

### Task 3: Resolver AppCard Test Repair

**Files:**
- Modify: `packages/fdc3-resolver-ui/src/styles.ts`

- [ ] Use the existing failing `AppCard` transition test as the red case.
- [ ] Align `Card.base.transition` with the documented/tested `all 0.2s` contract.
- [ ] Run `npm test -- --coverage=false` in `packages/fdc3-resolver-ui` and confirm the suite passes.

### Task 4: Package Verification

**Files:**
- Verify only.

- [ ] Run `npm test` in `packages/fdc3-broker`.
- [ ] Run `npm test` in `packages/fdc3-resolver-ui`.
- [ ] Run package builds in dependency order: app-directory, broker, agent, resolver-ui.
- [ ] Check `git status --short` and summarize changed files.


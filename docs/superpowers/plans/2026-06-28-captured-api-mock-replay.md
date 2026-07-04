# Captured API Mock Replay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build root-config local mock data for `mfe-cashflow-blotter` and `mfe-flowzero` using sanitized captured API fixtures.

**Architecture:** Add captured API replay middleware to the root-config devserver. Captured fixtures handle original-project journeys from the shared local dev entry point; individual MFE `server/` folders remain untouched because they are for containerization/server packaging.

**Tech Stack:** Express, TypeScript, Jest, existing MFE server packages.

## Global Constraints

Use sanitized app API fixtures only; do not replay shell login, import map, analytics, or photo calls.

Match duplicate POST endpoints with body markers instead of request sequence.

Keep server compilation scoped to Node server code.

---

### Task 1: Captured Replay Matcher

**Files:**

- Create: `apps/root-config/captured-api-mocks.ts`
- Test: `apps/root-config/rsbuild.config.test.ts`

**Steps:**

- [x] Write failing tests for method/path/query/body marker matching.
- [x] Implement `findCapturedReplayFixture`.
- [x] Implement `registerCapturedReplayRoutes`.
- [x] Run focused root-config Jest tests.

### Task 2: Sanitized Fixtures

**Files:**

- Create: `apps/root-config/mock/captured-api-fixtures.mock.json`

**Steps:**

- [x] Extract only relevant `/api/flowzero/...` and `/api/ratan/...` captured responses.
- [x] Exclude auth, import-map, photo, and analytics calls.
- [x] Store fixtures under root-config mock data so root-config owns local devserver responses.

### Task 3: Root-Config Devserver Wiring

**Files:**

- Modify: `apps/root-config/dev-server.ts`
- Modify: `apps/root-config/AGENTS.md`
- Modify: `apps/root-config/docs/RULES.md`
- Modify: `AGENTS.md`

**Steps:**

- [x] Register captured replay middleware with root-config devserver mocks.
- [x] Leave individual MFE `server/` folders untouched.
- [x] Update the contract/docs to state that MFE `server/` folders are for containerization/server packaging.

### Task 4: Verification

**Steps:**

- [x] Run focused root-config Jest tests.
- [x] Run root-config type build.
- [x] Run whitespace diff check.

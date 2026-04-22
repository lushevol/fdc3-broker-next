# Chat Protocol Package Split Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the current protocol-native demo stack into two reusable packages, `chat-protocol-runtime` and `chat-protocol-ui`, then refactor `apps/chat-protocol-demo-web` to consume them as a thin proving client.

**Architecture:** Evolve the existing `packages/chat-protocol-frontend` code into the runtime package, extract reusable protocol-facing UI from `apps/chat-protocol-demo-web` into a second UI package, then make the demo app a consumer of both packages. Ignore `apps/base` as an extraction source; it is only a future adopter.

**Tech Stack:** React 18, TypeScript, assistant-ui, Vite, Vitest, npm workspaces, Turbo

---

### Task 1: Define the Runtime Package Boundary and Stabilize Its API

**Files:**

- Modify: `packages/chat-protocol-frontend/package.json`
- Modify: `packages/chat-protocol-frontend/src/index.ts`
- Modify: `packages/chat-protocol-frontend/src/runtime/createProtocolLocalRuntime.ts`
- Modify: `packages/chat-protocol-frontend/src/runtime/createProtocolStreamAdapter.ts`
- Create: runtime request/resume helper files under `packages/chat-protocol-frontend/src/runtime/`
- Test: `packages/chat-protocol-frontend/test/*`

- [ ] **Step 1: Write failing runtime-package tests for request building, resume flows, and thread conversation bookkeeping**
- [ ] **Step 2: Keep the existing folder temporarily, but evolve the package name/export surface toward `chat-protocol-runtime`**
- [ ] **Step 3: Move protocol request submission and resume helper logic out of `apps/chat-protocol-demo-web/src/ChatProtocolApp.tsx` into runtime package modules**
- [ ] **Step 4: Extend the runtime package exports so consumer apps can build submit-message and submit-tool-result flows without reimplementing them**
- [ ] **Step 5: Run the runtime package tests**

### Task 2: Extract Remaining Protocol Runtime Orchestration from the Demo App

**Files:**

- Modify: `apps/chat-protocol-demo-web/src/ChatProtocolApp.tsx`
- Modify: demo app helper files related to protocol runtime flow
- Create or modify: package runtime helpers used by the demo
- Test: runtime package tests and any demo-level tests that cover runtime orchestration

- [ ] **Step 1: Write failing tests around the demo behaviors that should become package-owned runtime logic**
- [ ] **Step 2: Move frontend tool auto-resolution, request assembly, and conversation bookkeeping into the runtime package**
- [ ] **Step 3: Leave only demo-specific preset selection and demo-only behavior in the app**
- [ ] **Step 4: Run targeted checks to confirm the demo no longer owns core runtime flow**

### Task 3: Create the Reusable UI Package

**Files:**

- Create: `packages/chat-protocol-ui/package.json`
- Create: `packages/chat-protocol-ui/tsconfig.json`
- Create: `packages/chat-protocol-ui/tsup.config.ts`
- Create: `packages/chat-protocol-ui/vitest.config.ts`
- Create: `packages/chat-protocol-ui/src/index.ts`
- Create: UI modules under `packages/chat-protocol-ui/src/`
- Modify: `apps/chat-protocol-demo-web/src/components/**/*`
- Test: `packages/chat-protocol-ui/test/*`

- [ ] **Step 1: Write failing UI-package tests for provider composition, modal rendering, thread rendering, and generative component registry behavior**
- [ ] **Step 2: Extract reusable protocol-facing UI from `apps/chat-protocol-demo-web` into `packages/chat-protocol-ui`**
- [ ] **Step 3: Add `ChatProtocolProvider`, `ChatProtocolModal`, and `ChatProtocolThread` APIs that consume the runtime package instead of app-local wiring**
- [ ] **Step 4: Keep demo-only explanatory panels and preset controls out of the package**
- [ ] **Step 5: Run the UI package tests**

### Task 4: Refactor the Demo App to Consume the New Packages

**Files:**

- Modify: `apps/chat-protocol-demo-web/package.json`
- Modify: `apps/chat-protocol-demo-web/src/ChatProtocolApp.tsx`
- Modify: `apps/chat-protocol-demo-web/src/App.tsx`
- Modify: demo-only tool preset and panel files
- Test: `tests/e2e/chat-protocol-demo.spec.ts`
- Test: `tests/e2e/chat-protocol-demo-mcp-tools.spec.ts`

- [ ] **Step 1: Replace app-local runtime orchestration in `ChatProtocolApp.tsx` with runtime package APIs**
- [ ] **Step 2: Replace app-local assistant shell composition with the UI package while preserving demo-only preset controls and debug panels**
- [ ] **Step 3: Remove code from the demo app that is now package-owned**
- [ ] **Step 4: Run the demo app lint/build checks and relevant e2e coverage**

### Task 5: Remove Redundant Demo-Local Copies and Finalize the Toolkit

**Files:**

- Delete or reduce: redundant runtime/UI files left in `apps/chat-protocol-demo-web`
- Modify: package READMEs and any docs that mention old ownership

- [ ] **Step 1: Search for stale imports of old demo-local runtime or UI modules**
- [ ] **Step 2: Remove duplicated code that is now package-owned**
- [ ] **Step 3: Update docs to describe the new two-package ownership model**
- [ ] **Step 4: Run package and demo builds**

### Task 6: Final Verification

**Files:**

- Modify: snapshots or tests affected by the new package imports

- [ ] **Step 1: Run targeted runtime package tests**
- [ ] **Step 2: Run targeted UI package tests**
- [ ] **Step 3: Run the relevant demo checks**
- [ ] **Step 4: Verify the demo app end-to-end against the protocol scenarios**

## File Ownership Summary

After completion:

- `chat-protocol-runtime` owns generic runtime, transport, frame adaptation, request building, and continuation logic
- `chat-protocol-ui` owns generic React provider, modal, thread, and rendering shell code
- `apps/chat-protocol-demo-web` owns only demo-specific presets, sample tools, and debug/explanatory surfaces

## Open Implementation Decisions

These decisions should be resolved at the start of execution, not deferred mid-refactor:

1. The folder stays as `packages/chat-protocol-frontend` temporarily, but the package surface should shift toward `chat-protocol-runtime`
2. Which current demo components are generic enough to move untouched versus needing package-safe cleanup first
3. Whether any demo-only helper should remain in the app even if it looks superficially reusable

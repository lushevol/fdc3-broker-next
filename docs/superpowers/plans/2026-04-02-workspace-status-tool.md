# Workspace Status Tool Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a centralized frontend chatbot tool that reports workspace status and provides an inline `Close all tiles` action affecting all tabs/workspaces.

**Architecture:** Implement a new `workspaceStatusTool` under the chatbot tool registry, extend the central registry config with workspace snapshot and bulk-close dependencies, wire those dependencies from the Home page/store, and keep execution entirely local in the browser through the existing frontend tool manifest/continuation flow.

**Tech Stack:** React 18, TypeScript, MUI, assistant-ui, Jest

---

### Task 1: Add Workspace Status Tool

**Files:**
- Create: `apps/base/src/components/ChatbotSidebar/tools/workspaceStatusTool.tsx`
- Modify: `apps/base/src/components/ChatbotSidebar/tools/createFrontendToolRegistry.ts`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/workspaceStatusTool.test.tsx`

- [ ] **Step 1: Write failing tests for tool prompt matching, snapshot result shape, and action card behavior**
- [ ] **Step 2: Implement the tool factory and inline card renderer**
- [ ] **Step 3: Register the tool in the central frontend tool registry**
- [ ] **Step 4: Run targeted tests**

### Task 2: Wire Workspace Dependencies From Existing App State

**Files:**
- Modify: `apps/base/src/components/ChatbotSidebar/tools/createFrontendToolRegistry.ts`
- Modify: `apps/base/src/pages/Home/index.tsx`
- Modify: `apps/base/src/pages/Home/common/useController.ts`
- Test: `apps/base/src/components/ChatbotSidebar/__tests__/AssistantUIRuntimeProvider.test.tsx`

- [ ] **Step 1: Expose a bulk-close action from the existing Home controller path**
- [ ] **Step 2: Pass workspace snapshot and bulk-close dependencies into `toolRegistryConfig`**
- [ ] **Step 3: Ensure the runtime manifest includes the new tool**
- [ ] **Step 4: Run targeted tests**

### Task 3: Verify Main Flow

**Files:**
- Modify: tests only if needed for supported behavior changes

- [ ] **Step 1: Run focused chatbot frontend tests**
- [ ] **Step 2: Start the app and verify the assistant can render the workspace-status card**
- [ ] **Step 3: Verify `Close all tiles` clears tiles across all workspaces without breaking the app shell**

# Repository Documentation Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Bring maintained repository documentation into alignment with the workspaces, commands, ports, and architecture present on 2026-07-10.

**Architecture:** Treat package manifests, Maven configuration, import maps, launcher scripts, and source layout as authoritative. Refresh the root documentation index and active workspace documentation while preserving archived proposals, dated plans/specifications, changelogs, release notes, vendored guidance, and fixtures as historical records.

**Tech Stack:** Markdown, npm workspaces, Turbo, React 18, Rsbuild/Rspack, Spring Boot, Maven, Single-SPA, SystemJS, Module Federation.

## Global Constraints

- Use npm commands throughout; the root package manager is `npm@10.9.2`.
- Do not rewrite historical or third-party documentation.
- Do not modify unrelated untracked files.
- Verify documented workspace names, scripts, and ports against repository configuration.

---

### Task 1: Refresh the root documentation and inventory

**Files:**

- Modify: `README.md`
- Modify: `AGENTS.md`

**Interfaces:**

- Consumes: root `package.json`, `scripts/stop-ports.js`, local import map, workspace manifests.
- Produces: current architecture, command, workspace, environment, and verification guidance.

- [x] **Step 1:** Update the root README with the current architecture, launch modes, workspace inventory, and documentation map.
- [x] **Step 2:** Update AGENTS.md so new applications, chat-protocol packages, and Flowzero services are represented.
- [x] **Step 3:** Compare every root command and port claim with its source configuration.

### Task 2: Refresh active package and service entry points

**Files:**

- Modify: `packages/mf_lib/README.md`
- Modify: `packages/ratan-design/README.md`
- Modify: `packages/fdc3-agent/README.md`
- Modify: `packages/fdc3-app-directory/README.md`
- Modify: `packages/fdc3-broker/README.md`
- Modify: `packages/fdc3-resolver-ui/README.md`
- Create: `packages/chat-protocol-runtime/README.md`
- Create: `packages/chat-protocol-ui/README.md`
- Create: `apps/chat-protocol-demo-web/README.md`
- Create: `services/flowzero-mcp-service/README.md`

**Interfaces:**

- Consumes: each workspace's package manifest and source exports.
- Produces: npm-based setup, accurate purpose, current scripts, and integration notes.

- [x] **Step 1:** Replace stale Yarn commands with npm equivalents and correct package names.
- [x] **Step 2:** Add concise entry-point documentation for active undocumented workspaces.
- [x] **Step 3:** Verify command examples exist in the corresponding manifest.

### Task 3: Validate the maintained documentation set

**Files:**

- Verify: root and active workspace Markdown files changed by Tasks 1-2.

**Interfaces:**

- Consumes: updated Markdown.
- Produces: formatting, link, and drift-check results.

- [x] **Step 1:** Run Prettier check/write on changed Markdown files.
- [x] **Step 2:** scan maintained docs for obsolete Yarn commands and broken relative links.
- [x] **Step 3:** Review `git diff --check`, `git diff --stat`, and the final diff.

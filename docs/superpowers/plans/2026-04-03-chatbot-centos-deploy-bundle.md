# Chatbot CentOS Deploy Bundle Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a manual deployment bundle flow for the chatbot backend that can be built on macOS, uploaded to a CentOS host, and started with clear validation errors.

**Architecture:** Package the existing Spring Boot JAR into a small distributable archive with a shell launcher and environment template. Keep the implementation isolated to the chatbot backend workspace and documentation so the rest of the monorepo remains unchanged.

**Tech Stack:** npm workspace scripts, Maven, POSIX shell, Spring Boot

---

### Task 1: Add deploy bundle assets

**Files:**

- Create: `services/chatbot-backend/scripts/bundle-centos.sh`
- Create: `services/chatbot-backend/scripts/run-centos.sh`
- Create: `services/chatbot-backend/.env.example`

- [ ] Step 1: Add shell assets for bundle creation and runtime startup.
- [ ] Step 2: Keep runtime checks explicit for missing Java, JAR, and `.env`.

### Task 2: Wire workspace scripts

**Files:**

- Modify: `services/chatbot-backend/package.json`

- [ ] Step 1: Add `build`, `bundle:centos`, and `run:bundle` scripts.
- [ ] Step 2: Keep the existing `dev` script unchanged.

### Task 3: Document the workflow

**Files:**

- Modify: `services/chatbot-backend/README.md`

- [ ] Step 1: Document how to build the archive.
- [ ] Step 2: Document upload, extraction, `.env` setup, and startup.

### Task 4: Verify

**Files:**

- None

- [ ] Step 1: Run the chatbot backend package build.
- [ ] Step 2: Run the macOS bundle script.
- [ ] Step 3: Inspect the archive contents.

# leapkit-to-sb-plugin Agent

Converts a leap-kit React project into a Service Bench UI plugin (LitElement 3 + TypeScript + @scdevkit) through a guided 6-step workflow.

## Overview

This agent automates the full migration pipeline from a leap-kit React codebase to a production-ready Service Bench plugin — including project analysis, archiving, scaffolding, component conversion, and final validation.

## Steps

| Step | Agent | Description |
|------|-------|-------------|
| 1 | [Analyse Leap-Kit Project](./step-1-analyze-leapkit-project.agent.md) | Analyses the current leap-kit React project and produces a structured Migration Inventory. Waits for user confirmation before any code changes. |
| 2 | [Archive Leap-Kit Files](./step-2-archive-leapkit-files.agent.md) | Archives all existing leap-kit React source files into `_leapkit-archive/` and removes them from the active project, leaving a clean slate for the SB plugin structure. |
| 3 | [Set Up SB Plugin Structure](./step-3-setup-sb-plugin-structure.agent.md) | Scaffolds the complete SB plugin project structure using `@scdevkit/cli`, then customises routes, constants, and API service for the migrated project. |
| 4 | [Migrate React Components to LitElement](./step-4-migrate-components.agent.md) | Converts every React component in `src/pages/` and `src/components/` into a LitElement TypeScript component. |
| 5 | [Migrate Services & Routes](./step-5-migrate-services-routes.agent.md) | Migrates services/API calls, finalises route wiring, runs build verification, and runs security validation. |
| 6 | [Unit Tests & Final Report](./step-6-unit-tests.agent.md) | Converts unit tests from Enzyme/React to @open-wc/testing, achieves ≥ 80% coverage, and produces the final migration report. |

## Typical Workflow

1. Run **Step 1** to analyse the leap-kit project and produce the Migration Inventory — confirm the plan before proceeding
2. Run **Step 2** to archive the original React files into `_leapkit-archive/`
3. Run **Step 3** to scaffold the SB plugin structure using `@scdevkit/cli`
4. Run **Step 4** to convert all React pages and components to LitElement TypeScript
5. Run **Step 5** to migrate services, wire routes, verify the build, and run the security validator
6. Run **Step 6** to convert unit tests, verify coverage, and generate the final migration report

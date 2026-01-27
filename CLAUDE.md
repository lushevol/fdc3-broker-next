<!-- OPENSPEC:START -->

# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:

- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:

- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# mfe-next Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-12-27

## Active Technologies

- TypeScript 5.x with strict mode enabled (002-fdc3-interoperability)

## Project Structure

```text
src/
tests/
```

## Commands

npm run test && npm run lint

## Code Style

TypeScript 5.x with strict mode enabled: Follow standard conventions

## Recent Changes

- 002-fdc3-interoperability: Added TypeScript 5.x with strict mode enabled

<!-- MANUAL ADDITIONS START -->

# Agent Verification

After implement, you can verify the UI behavior by:

1. run website by npm run dev
2. use chrome-devtools mcp to open website by http://localhost:8001

<!-- MANUAL ADDITIONS END -->

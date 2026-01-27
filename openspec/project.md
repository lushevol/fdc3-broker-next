# Project Context

## Purpose

A Micro-Frontend (MFE) platform designed for financial desktop applications, implementing the FDC3 (Financial Desktop Connectivity and Collaboration Consortium) 2.2 standard. The project aims to provide a robust environment for interoperable micro-apps using Module Federation and Single-SPA concepts, featuring a custom FDC3 Broker, Agent, and App Directory.

## Tech Stack

- **Languages**: TypeScript, JavaScript
- **Frontend Framework**: React
- **Micro-Frontend**: Webpack 5 Module Federation, Single-SPA
- **UI Component Library**: Material UI (@mui/material, @mui/x-data-grid)
- **State Management & Async**: RxJS
- **Monorepo Tools**: npm workspaces, Turbo Repo
- **Build Tools**: Webpack (Apps), tsup (Packages)
- **Testing**: Jest (Apps), Vitest (Packages)
- **Linting/Formatting**: Biome (Root), ESLint, Prettier

## Project Conventions

### Code Style

- **Formatting**: Enforced via Prettier and Biome.
- **Linting**: ESLint with `eslint-config-ts-react-important-stuff` and specific rules for React/Hooks.
- **Imports**: Workspace packages should be imported, often using the `ratan-` prefix for FDC3 components.

### Architecture Patterns

- **Monorepo Structure**: Distinct separation between `apps` (deployable frontends) and `packages` (shared libraries).
- **FDC3 Implementation**:
  - `fdc3-broker`: Core logic for context/intent resolution.
  - `fdc3-agent`: Desktop agent implementation.
  - `fdc3-app-directory`: Directory service.
  - `fdc3-resolver-ui`: UI for intent resolution.
- **Micro-Frontends**: Uses `@module-federation/enhanced` and Single-SPA for orchestration.

### Testing Strategy

- **Unit Testing**:
  - Apps use Jest with `@testing-library/react`.
  - Packages use Vitest with `@testing-library/react`.
- **Coverage**: Coverage reporting is configured (e.g., `vitest --coverage`).

### Git Workflow

- Standard feature branch workflow.
- Pre-commit hooks via Husky (linting/formatting).

## Domain Context

- **FDC3**: Deep integration with FDC3 2.2 standards (Intents, Contexts, Channels, App Directory).
- **Financial Desktop**: Focus on interoperability between financial applications (tiles/containers).

## External Dependencies

- **OpenFin**: Dependency on `@openfin/core` and related types, suggesting OpenFin compatibility or target environment.
- **FDC3 Standard**: `@finos/fdc3` is the core compliance target.

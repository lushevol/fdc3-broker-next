# workspace-management Specification

## Purpose

TBD - created by archiving change migrate-to-yarn-lerna. Update Purpose after archive.

## Requirements

### Requirement: The project MUST use NPM for package management

The project MUST utilise NPM (version 10.x or later, bundled with Node.js 20+) as the sole package manager for all workspaces, ensuring deterministic builds and compatibility with native npm workspace features.

#### Scenario: Developer installs dependencies with NPM

- **Given** a clean clone of the repository
- **When** the developer runs `npm install`
- **Then** dependencies are installed successfully and a `package-lock.json` file is respected.

#### Scenario: CI/CD installs dependencies with NPM

- **Given** a fresh CI/CD environment
- **When** the pipeline runs `npm ci`
- **Then** dependencies are installed deterministically from the lockfile.

### Requirement: The project MUST use Turbo for monorepo task orchestration

The project MUST integrate Turbo Repo to manage workspace tasks including build, test, and lint operations, leveraging build caching and parallel execution alongside npm workspaces.

#### Scenario: Turbo configuration presence

- **Given** the project root
- **Then** a `turbo.json` file exists configured with task definitions.

#### Scenario: Building packages with Turbo

- **Given** the terminal
- **When** running `npm run build`
- **Then** turbo orchestrates builds across all workspaces with caching.

#### Scenario: Listing packages with NPM workspaces

- **Given** the terminal
- **When** running `npm query ".workspace"`
- **Then** all workspace packages (apps and packages) are listed.

### Requirement: Yarn and Lerna configuration MUST be removed

The project MUST NOT rely on yarn or lerna configuration files, lockfiles, or dependencies.

#### Scenario: No yarn configuration file

- **Given** the project root
- **Then** `.yarnrc.yml` does not exist.

#### Scenario: No yarn lockfile

- **Given** the project root
- **Then** `yarn.lock` does not exist.

#### Scenario: No lerna configuration

- **Given** the project root
- **Then** `lerna.json` does not exist.

#### Scenario: No yarn cache directory

- **Given** the project root
- **Then** `.yarn/` directory does not exist.

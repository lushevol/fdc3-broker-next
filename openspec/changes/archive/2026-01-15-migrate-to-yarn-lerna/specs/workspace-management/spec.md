# Workspace Management Spec

## ADDED Requirements

### Requirement: The project MUST use Yarn for package management

The project MUST utilise Yarn (specifically version 4.x) as the sole package manager for all workspaces, ensuring deterministic builds and compatibility with the desired workflow.

#### Scenario: Developer installs dependencies with Yarn

- **Given** a clean clone of the repository
- **When** the developer runs `yarn install`
- **Then** dependencies are installed successfully and a `yarn.lock` file is respected.

#### Scenario: Package manager version consistency

- **Given** the `package.json` `packageManager` field
- **Then** it specifies `yarn` version 4.x (or compatible stable version).

### Requirement: The project MUST use Lerna for monorepo orchestration

The project MUST integrate Lerna to manage workspace tasks, versioning, and publishing, operating alongside or on top of Yarn workspaces.

#### Scenario: Lerna configuration presence

- **Given** the project root
- **Then** a `lerna.json` file exists configured to use yarn workspaces.

#### Scenario: Listing packages with Lerna

- **Given** the terminal
- **When** running `npx lerna list`
- **Then** all workspace packages (apps and packages) are listed.

### Requirement: pnpm configuration MUST be removed

The project MUST NOT rely on pnpm configuration files or lockfiles.

#### Scenario: No pnpm workspace file

- **Given** the project root
- **Then** `pnpm-workspace.yaml` does not exist.

#### Scenario: No pnpm lockfile

- **Given** the project root
- **Then** `pnpm-lock.yaml` does not exist.

# repo-tooling Specification

## Purpose

TBD - created by archiving change migrate-lint-format. Update Purpose after archive.

## Requirements

### Requirement: `standardize-lint-format`

The repository MUST use ESLint 9 and Prettier for all code quality and formatting tasks.

#### Scenario: Root Configuration

Given the repository root
When a developer checks the configuration files
Then `biome.json` should not exist
And `eslint.config.mjs` (or .js) should exist and be valid
And `.prettierrc` should exist and be valid

#### Scenario: Scripts consistency

Given any package or app in `packages/*` or `apps/*`
When a developer runs `npm run lint`
Then it should execute `eslint`
And when a developer runs `npm run format`
Then it should execute `prettier`

#### Scenario: No Biome

Given `package.json` in the root
When dependencies are inspected
Then `@biomejs/biome` should not be present

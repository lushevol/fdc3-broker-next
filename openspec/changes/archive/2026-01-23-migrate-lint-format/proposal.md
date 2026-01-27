# Proposal: Migrate Linting to ESLint 9 and Formatting to Prettier

## Goal

Standardize linting and formatting across the monorepo by migrating from Biome (and legacy ESLint versions) to **ESLint 9** and **Prettier**. This ensures consistent code quality, leverages the latest tooling ecosystem (Flat Config), and unifies configuration across all apps and packages.

## Context

Currently, the repository has a fragmented tooling setup:

- **Root** uses Biome for checking and linting.
- **packages/ratan-design** and **packages/fdc3-agent** use ESLint 9.
- **apps/base** uses strict ESLint 7.
- **apps/mf_tile** has no explicit lint script.

This fragmentation leads to inconsistent rules, multiple sources of truth for styling, and maintenance overhead. By moving everything to ESLint 9 + Prettier, we simplify the developer experience and CI pipelines.

## Scope

- **Root**: Remove Biome, install ESLint 9 + Prettier, setup base configs.
- **Packages/Apps**: Update `package.json` scripts, remove package-local legacy configs, and ensure they extend/use the root configuration where appropriate.
- **CI/CD**: Update pipelines to run the new `lint` and `format` commands.

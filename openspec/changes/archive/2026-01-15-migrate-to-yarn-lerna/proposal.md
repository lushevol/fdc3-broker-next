# Migrate Project Workspace to Yarn + Lerna

## Summary

Migrate the current monorepo package management and workspace orchestration from `pnpm` to `yarn` and `lerna`. This change aligns the project with team preferences for `yarn` workflows and leverages `lerna` for advanced versioning and publishing capabilities alongside `turbo` for build caching.

## Motivation

- **Standardization**: Align with organization-wide preference for `yarn`.
- **Release Management**: Adopt `lerna` for streamlined semantic versioning and changelog generation across packages.
- **Ecosystem Compatibility**: Ensure broader compatibility with tools optimized for yarn workspaces.

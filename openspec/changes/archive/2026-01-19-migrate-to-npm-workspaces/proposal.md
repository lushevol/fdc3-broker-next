# Change: Migrate Monorepo from Yarn + Lerna to NPM Workspaces + Turbo

## Why

Simplify the monorepo tooling stack by removing yarn and lerna in favor of npm's native workspaces feature combined with turbo for task orchestration. This reduces dependency on multiple package managers and specialized monorepo tools while maintaining full functionality for builds, tests, and versioning.

**Key Motivations:**

- **Simplification**: npm workspaces are built into npm (no extra installation), reducing tool count from yarn + lerna + turbo → npm + turbo.
- **Reduced Complexity**: Eliminates yarn-specific configuration (`.yarnrc.yml`, `.yarn/` directory) and lerna (`lerna.json`).
- **Native npm Experience**: Developers familiar with npm will have a more intuitive experience without learning yarn's specifics.
- **Maintained Turbo Integration**: Turbo seamlessly supports npm workspaces, preserving build caching and task orchestration.
- **Changesets Compatibility**: `@changesets/cli` works with npm workspaces, so versioning and publishing workflow remains unchanged.

## What Changes

### **Files to Modify**

- **`package.json`**: Update `packageManager` field to npm, adjust scripts from `yarn` → `npm run`
- **`turbo.json`**: (No changes needed - turbo auto-detects npm workspaces)
- **`lerna.json`**: **DELETE** - No longer needed
- **`.yarnrc.yml`**: **DELETE** - No longer needed
- **`.yarn/`**: **DELETE** - No longer needed
- **`yarn.lock`**: **DELETE** - Replaced by `package-lock.json`
- **`azure-pipelines-pr.yml`**: Replace `yarn` commands with `npm` equivalents
- **`azure-pipelines-release.yml`**: Replace `yarn` commands with `npm` equivalents
- **`README.md`**: Update installation and command documentation
- **`CLAUDE.md`**: Update command references
- **`.husky/pre-push`**: (Already commented out, verify npm compatibility)
- **`apps/*/package.json`**: Update script references from `yarn` → `npm run`
- **`packages/*/README.md`**: Update documentation references

### **Breaking Changes**

> [!WARNING]
>
> - **BREAKING**: All developers must switch from `yarn install` to `npm install`
> - **BREAKING**: All CI/CD pipelines must be updated before merge
> - **BREAKING**: Local yarn installations and `yarn.lock` will be obsolete

## Impact

- **Affected specs**: `workspace-management` (MODIFIED - all requirements changing)
- **Affected code**:
  - Root config files (`package.json`, `lerna.json`, `.yarnrc.yml`)
  - CI/CD pipelines (`azure-pipelines-*.yml`)
  - All app and package `package.json` scripts
  - Documentation (`README.md`, `CLAUDE.md`)

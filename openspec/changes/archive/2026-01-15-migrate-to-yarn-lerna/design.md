# Architecture & Design

## Package Manager Migration

- **Target**: Yarn Modern (v4) with `node-modules` linker.
  - Reason: Provides the stability and performance of modern Yarn while maintaining compatibility with tools (like some bundlers or legacy scripts) that expect a `node_modules` structure, minimizing friction during migration from `pnpm`.
- **Lockfile**: Replace `pnpm-lock.yaml` with `yarn.lock`.

## Workspace Orchestration

- **Lerna Integration**:
  - Install `lerna` as a dev dependency in the root.
  - Configure `lerna.json` to use `yarn` as the npm client and `workspaces` for package management.
  - Enable Lerna to use `turbo` for task execution where possible, or coexist (Lerna for versioning/publish, Turbo for build/test/lint).

## Configuration Changes

- **`package.json`**:
  - Remove `pnpm`-specific fields.
  - Add `workspaces` array (porting from `pnpm-workspace.yaml`).
  - Update `packageManager` field.
  - Add `lerna` configuration or dependency.
- **Scripts**:
  - Update scripts to use `lerna run` or continue using `turbo run` (Turbo supports Yarn workspaces natively). Given the prompt specifically asked for "yarn+lerna", we will ensure Lerna is configured and functional, but we can keep Turbo for the heavy lifting of builds if preferred, or switch strictly to Lerna if that's the implication. _Decision_: Keep Turbo for task running (build/test) as it's superior for caching, but use Lerna for high-level management and publishing. This is a common/recommended pattern.

## CI/CD Impact

- Update CI workflows to install `yarn` instead of `pnpm`.
- Update frozen lockfile check commands (e.g., `yarn install --immutable`).

## Documentation

- Update `openspec/project.md` and `README.md` to reflect the toolchain change.

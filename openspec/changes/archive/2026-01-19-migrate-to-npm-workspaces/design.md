# Design: NPM Workspaces + Turbo Migration

## Context

The project currently uses **yarn@4.6.0** with **lerna@8.x** and **turbo** for monorepo management. This combination has worked, but introduces complexity:

- Yarn-specific configuration (`.yarnrc.yml`, corepack, `.yarn/` cache)
- Lerna for "monorepo orchestration" when turbo handles the same tasks
- Dual tooling: lerna is mainly used for `lerna list` while turbo does actual builds

The migration to npm workspaces consolidates tooling while maintaining build performance via turbo.

## Goals / Non-Goals

### Goals

- Remove yarn and lerna dependencies
- Migrate to npm native workspaces
- Maintain turbo for build/test caching and orchestration
- Keep changesets for versioning and publishing
- Update all CI/CD pipelines

### Non-Goals

- Changing the project structure (apps/packages layout stays the same)
- Modifying how turbo tasks are defined
- Altering the changeset workflow

## Decisions

### Decision: Use npm instead of yarn

**Rationale**: npm workspaces have been stable since npm 7. The project already uses `node-modules` linker (not PnP), so migration is straightforward. npm is bundled with Node.js, reducing setup steps.

**Alternatives considered**:

- **Stay with yarn**: More setup complexity, requires corepack
- **pnpm**: Previously used and migrated away (per archived change `migrate-to-yarn-lerna`)

### Decision: Remove lerna entirely

**Rationale**: Lerna's role in this project is minimal - turbo handles task running, and changesets handles versioning. The only lerna usage is `npx lerna list`, which can be replaced with `npm query --workspaces`.

**Alternatives considered**:

- **Keep lerna**: Adds unnecessary dependency; its features are redundant with turbo + changesets

### Decision: Maintain turbo for task orchestration

**Rationale**: Turbo provides excellent caching, parallel execution, and task dependencies. It supports npm workspaces natively (auto-detects from `package.json` workspaces field).

## Migration Plan

### Phase 1: Root Configuration

1. Remove `packageManager` field from `package.json` (npm is default)
2. Delete `lerna.json`, `.yarnrc.yml`
3. Delete `.yarn/` directory and `yarn.lock`
4. Remove `lerna` from devDependencies
5. Run `npm install` to generate `package-lock.json`

### Phase 2: Script Updates

1. Update root `package.json` scripts: `yarn` → `npm run`
2. Update app `package.json` scripts in all 6 apps
3. Update CI/CD pipelines
4. Update documentation

### Phase 3: Validation

1. Verify `npm install` works
2. Verify `npm run build` (via turbo) works
3. Verify `npm test` works
4. Verify changeset workflow works

## Risks / Trade-offs

| Risk                             | Mitigation                                                      |
| -------------------------------- | --------------------------------------------------------------- |
| Breaking CI/CD on merge          | Update pipelines in same PR, test in feature branch if possible |
| Developers have local yarn cache | Clear communication + updated README                            |
| Performance regression           | npm 10+ matches yarn performance; turbo caching unchanged       |
| Changeset compatibility          | Changesets fully supports npm workspaces                        |

## Command Mapping

| Current (yarn)           | New (npm)                                 |
| ------------------------ | ----------------------------------------- |
| `yarn install`           | `npm install`                             |
| `yarn build`             | `npm run build`                           |
| `yarn test`              | `npm run test`                            |
| `yarn lint`              | `npm run lint`                            |
| `yarn dev`               | `npm run dev`                             |
| `yarn changeset`         | `npm run changeset`                       |
| `yarn changeset version` | `npm run version`                         |
| `yarn changeset publish` | `npx changeset publish`                   |
| `npx lerna list`         | `npm query --workspaces` or define script |

## Open Questions

None - approach is straightforward.

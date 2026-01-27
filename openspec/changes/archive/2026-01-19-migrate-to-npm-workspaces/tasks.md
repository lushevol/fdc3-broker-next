# Tasks: Migrate to NPM Workspaces + Turbo

## 1. Root Configuration Updates

- [x] 1.1 Remove `packageManager` field from root `package.json` (npm is auto-detected) - Updated to `npm@10.9.2`
- [x] 1.2 Update root `package.json` scripts: replace `yarn` → `npm run`
- [x] 1.3 Remove `lerna` from `devDependencies` in root `package.json`
- [x] 1.4 Delete `lerna.json`
- [x] 1.5 Delete `.yarnrc.yml`
- [x] 1.6 Delete `.yarn/` directory
- [x] 1.7 Delete `yarn.lock`
- [x] 1.8 Run `npm install` to generate `package-lock.json`
- [x] 1.9 Create `.npmrc` with `legacy-peer-deps=true` for peer dependency handling
- [x] 1.10 Convert `resolutions` to `overrides` in root package.json
- [x] 1.11 Update `workspace:*` protocol to `*` for npm compatibility

## 2. App Script Updates

- [x] 2.1 Update `apps/base/package.json` scripts: `yarn` → `npm run`
- [x] 2.2 Update `apps/container/package.json` scripts: `yarn` → `npm run`
- [x] 2.3 Update `apps/mf_container/package.json` scripts: (no yarn refs, uses rsbuild)
- [x] 2.4 Update `apps/mf_tile/package.json` scripts: (no yarn refs, uses rsbuild)
- [x] 2.5 Update `apps/root-config/package.json` scripts: `yarn` → `npm run`
- [x] 2.6 Update `apps/tile/package.json` scripts: `yarn` → `npm run`
- [x] 2.7 Update `apps/mf_tile/README.md`: yarn → npm
- [x] 2.8 Update `apps/mf_container/README.md`: yarn → npm

## 3. CI/CD Pipeline Updates

- [x] 3.1 Update `azure-pipelines-pr.yml`:
  - Remove `corepack enable` step
  - Replace `yarn install --immutable` with `npm ci`
  - Replace `yarn build:packages` with `npm run build:packages`
  - Replace `yarn test` with `npm run test`
  - Update changeset instructions in echo statements
- [x] 3.2 Update `azure-pipelines-release.yml`:
  - Remove `corepack enable` step
  - Replace `yarn install --immutable` with `npm ci`
  - Replace `yarn changeset version` with `npx changeset version`
  - Replace `yarn build:packages` with `npm run build:packages`
  - Replace `yarn changeset publish` with `npx changeset publish`

## 4. Documentation Updates

- [x] 4.1 Update root `README.md`:
  - Remove corepack prerequisite
  - Update prerequisites to Node.js with npm
  - Update installation command to `npm install`
  - Update all command examples to use `npm run`
  - Replace lerna commands with npm workspace alternatives
- [x] 4.2 Update `CLAUDE.md`: replace yarn commands with npm equivalents
- [x] 4.3 Update `openspec/project.md`: update Tech Stack section

## 5. Verification

- [x] 5.1 Run `npm install` and verify successful installation
- [x] 5.2 Run `npm run build` and verify turbo executes builds
- [x] 5.3 Run `npm run test` and verify tests pass (turbo orchestrates tests)
- [x] 5.4 Run `npm run lint` and verify linting works (via turbo)
- [x] 5.5 Verify `npm run changeset` launches changeset CLI
- [x] 5.6 Verify workspace listing: `npm query ".workspace"`

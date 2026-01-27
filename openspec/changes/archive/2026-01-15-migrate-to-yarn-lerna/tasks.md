# Tasks

1. [x] Remove `pnpm` specific configuration
   - Remove `pnpm-lock.yaml`
   - Remove `pnpm-workspace.yaml`
2. [x] Configure `yarn`
   - Set `packageManager` to `yarn@4.x` in `package.json`
   - Create `.yarnrc.yml` with `nodeLinker: node-modules`
   - Configure `workspaces` in `package.json` matching previous `pnpm-workspace.yaml` packages
3. [x] Install and Configure `lerna`
   - Add `lerna` to `devDependencies`
   - Create `lerna.json` configured for yarn workspaces
4. [x] Install Dependencies
   - Run `yarn install` to generate `yarn.lock`
5. [x] Update Documentation
   - Update `openspec/project.md` to reflect new stack
   - Update `README.md` instructions
6. [x] specific `onlyBuiltDependencies` migration (if any)
   - Check if `pnpm-workspace.yaml`'s `onlyBuiltDependencies` needs to be ported to `package.json` or `.yarnrc.yml` whitelist
7. [x] Verification
   - [x] Run `yarn build` (via turbo)
   - [x] Run `yarn test`
   - [x] Run `yarn check`
   - [x] Verify `lerna list` shows all packages correctly

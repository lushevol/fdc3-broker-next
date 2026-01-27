- [x] Remove Biome
  - [x] Uninstall `@biomejs/biome` from root
  - [x] Delete `biome.json`
  - [x] Remove `check` script from root package.json
  - [x] Update `lint-staged` config in root package.json to use eslint/prettier

- [x] Setup Root ESLint & Prettier
  - [x] Install `eslint`, `prettier`, `typescript-eslint`, `eslint-config-prettier`, `globals`
  - [x] Create `.prettierrc`
  - [x] Create `eslint.config.mjs` with Typescript + React support

- [x] Migrate Packages and Apps
  - [x] `packages/fdc3-agent`: Ensure compatibility with root config
  - [x] `packages/ratan-design`: Ensure compatibility with root config
  - [x] `packages/fdc3-broker`: Add/Update lint/format scripts
  - [x] `packages/fdc3-app-directory`: Add/Update lint/format scripts
  - [x] `packages/fdc3-resolver-ui`: Add/Update lint/format scripts
  - [x] `apps/base`: Upgrade from ESLint 7 to 9, resolve config conflicts
  - [x] `apps/mf_tile`: Add lint/format scripts
  - [x] `apps/mf_container`: Add lint/format scripts
  - [x] `apps/tile`: Add lint/format scripts
  - [x] `apps/root-config` (if exists): Add lint/format scripts

- [x] Verification
  - [x] Run `turbo run lint` from root and ensure all packages pass (or fail with expected errors)
  - [x] Run `turbo run format` and ensure formatting is applied
  - [x] Verify `lint-staged` works on a dummy commit

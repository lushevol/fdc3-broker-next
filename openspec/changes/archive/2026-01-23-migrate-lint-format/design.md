# Design: ESLint 9 & Prettier Migration

## Architecture

### 1. Root Configuration

- **ESLint**: We will use the new **Flat Config** system (`eslint.config.mjs`).
  - Base configuration will be defined in the root.
  - Ideally, we can export a shared config or just have the root config apply to all files if using a monorepo-friendly setup. Given the structure, a root config that discovers files is good, but `turbo` works best with per-package scripts.
  - We will likely use `typescript-eslint` v8+ (compatible with ESLint 9).
- **Prettier**: A standard `.prettierrc` (or `prettier.config.js`) in the root.

### 2. Package Integration

Each package and app will have updated scripts:

- `lint`: `eslint . --max-warnings 0` (or similar).
- `format`: `prettier --write .`

Packages that already have `eslint.config.js` (like `ratan-design`) will be reviewed to see if they can inherit from a root shared config or if they should keep their own. For simplicity and consistency, a composition model is preferred:

- Root provides a factory or shared array of configs.
- Packages import it and extend if necessary.

### 3. Migration Strategy

1.  **Decommission Biome**: Remove `biome.json` and `@biomejs/biome` dependency.
2.  **Install Core Tools**: `eslint`, `prettier`, `typescript-eslint`, `eslint-config-prettier` in root.
3.  **Configure Root**: Create `eslint.config.mjs` and `.prettierrc`.
4.  **Iterate Packages**:
    - **Apps**: `base`, `mf_tile`, `mf_container`, etc.
    - **Packages**: `fdc3-*`, `ratan-*`, etc.
    - For `apps/base` (Legacy ESLint 7): This might require fixing many lint errors or suppressing them temporarily to upgrade. We will prioritize "working upgrade" over "perfect code" by using `eslint-disable` or relaxed rules if the error count is massive, then tighten later.
5.  **Fix Configs**: Ensure `tsconfig.json` references are correct for typescript-eslint parser.

## Trade-offs

- **Biome Speed vs. ESLint Ecosystem**: Biome is faster, but ESLint has a wider plugin ecosystem and is currently more widely adopted for complex React/TS rules. The user explicitly requested this change.
- **Migration Effort**: Updating legacy code (apps/base) to strict ESLint 9 rules might trigger many errors. We will maintain existing behavior where possible or use baselines.

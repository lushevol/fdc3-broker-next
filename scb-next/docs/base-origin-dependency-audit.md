# Base Origin dependency migration

Audit completed: **14 August 2026**

Scope: `scb-next/web/mfe-base-origin`, its Storybook, and its legacy Node
server. This document records the implemented dependency migration and the
remaining release gates. It is also the hand-off procedure for moving other
legacy SCB Next sources to the current Vite, Vitest, Storybook, MUI, and
federation architecture.

## Result

Base Origin now builds on the current frontend architecture:

| Area | Previous | Current | Status |
| --- | --- | --- | --- |
| Emotion | 11.11.x | `css` 11.13.5, `react` 11.14.0, `styled` 11.14.1 | Complete |
| Material UI | 5.15 | 9.3.1 | Complete |
| MUI X | 6.18 | 9.11.0 | Complete |
| Storybook | 7.0, Webpack framework | 10.5.8, React-Vite framework | Complete |
| ESLint | 7.32, legacy config | 9.39.5, flat config | Complete; ESLint 10 blocked |
| Module Federation | 1.20.6 | 1.20.7 | Complete |
| React Router | 6.4.4 | 6.30.4 | Complete; v7 deferred |
| React | 18.2 | 18.2 with latest React 18 types | Intentionally unchanged |
| TypeScript | 5.9.3 | 5.9.3 | Current supported line; TypeScript 7 blocked |

The active runtime updates also include Axios 1.19.0, Day.js 1.11.21,
DOMPurify 3.4.13, Testing Library React 16.3.2, Testing Library DOM 10.4.1, and
jest-dom 7.0.1. The follow-up minimization reduced the frontend manifest from
51 to 41 direct entries and the nested server manifest from nine to six.

The work was deliberately split into verified commits:

| Commit | Migration stage |
| --- | --- |
| `af7dd3de` | Remove obsolete Base tooling and stale dependency pins |
| `54319977` | Upgrade Emotion |
| `d0db574c` | Migrate MUI 5 to 6 and MUI X 6 to 7 |
| `77359ffa` | Migrate MUI 6 to 7 and MUI X 7 to 8 |
| `a8c181bb` | Migrate MUI 7 to 9 and MUI X 8 to 9 |
| `a5705d23` | Replace Storybook 7/Webpack with Storybook 10/Vite |
| `6956d532` | Replace legacy lint configuration with ESLint 9 flat config |
| `73bf0f00` | Remove the obsolete text-encoding test shim |
| `289fd578` | Update the federation Vite plugin |
| `ae538e42` | Update active runtime dependencies |
| `4ab03308` | Update testing dependencies |
| `1973998a` | Update development types and server build tooling |

## Removed dependencies

The audit removed packages that had no active source, script, or configuration
consumer, as well as packages superseded by the current architecture:

- Babel/Jest/Webpack build configuration and its unused loaders, presets, and
  runners. Tests run through Vitest.
- Storybook 7 packages replaced or absorbed by Storybook 10, including the
  Webpack framework, actions, essentials, interactions, MDX GFM, storysource,
  styling, testing-library, blocks, and direct React framework packages.
- `moment`; Base uses Day.js.
- `event-source-polyfill`; the supported browser floor provides EventSource.
- `@types/dompurify` and `@types/testing-library__jest-dom`; both libraries
  provide their own declarations.
- Unused `@testing-library/user-event`, `concurrently`, `cross-env`, `find-up`,
  `husky`, and `pretty-quick` package-local dependencies.
- The deprecated `text-encoding` shim and stale transitive `resolutions`.
- Legacy Babel ESLint parsing, package-local shared lint configuration, and
  Prettier-as-an-ESLint-rule packages.
- `buffer` and `uuid`; browser-native `atob`/`TextDecoder` and
  `crypto.randomUUID()` now cover their Base use cases.
- Unused Storybook links and OpenFin ambient types, the Jest type package, and
  the frontend's unnecessary `env-cmd` build wrapper.
- Direct `@mui/system` and `@mui/types` declarations; required types are
  imported through Material's public exports.
- `clsx`, whose two string-only calls are now handled locally, and type-only
  `@openfin/core`; Base only checks for an optional `window.fin` value.
- Nested-server `cookie-parser`, `ts-loader`, and `concurrently`, which had no
  source or script consumer.

Do not restore these packages to make an old config compile. Migrate the config
or test to the current Vite/Vitest/flat-config equivalent instead.

## Current architecture rules

### Storybook

Storybook uses `@storybook/react-vite`. Retain only addons that are explicitly
configured: docs and accessibility. Import story types from
`@storybook/react-vite` and MDX blocks from `@storybook/addon-docs/blocks`.
Federation is disabled while Storybook builds because stories render local
components and do not need a host share scope.

### Tests

Tests run with Vitest and jest-dom's Vitest setup entry. Do not add Jest or
Babel compatibility packages for new tests. Existing `jest.*` APIs are
provided by the current compatibility setup and should be converted to native
Vitest APIs when the affected test is next changed.

### Lint and formatting

The package uses `eslint.config.mjs` and ESLint 9. Formatting is a separate
Prettier command. Do not reintroduce `.eslintrc`, `--ext`, or
`eslint-plugin-prettier`.

ESLint 10.8.1 was evaluated but not installed. The retained
`eslint-plugin-jsx-a11y@6.10.2` peer range ends at ESLint 9. The accessibility
rules are part of the package's legacy behavior, so forcing an unsupported peer
tree would lose either reproducibility or coverage. Upgrade ESLint only after
that plugin publishes support or after an explicit replacement is verified.

The current lint command exposes pre-existing debt: 10 errors and 140 warnings.
The dependency migration did not bulk-edit unrelated source to hide that debt.
Likewise, the Prettier check reports existing formatting drift.

### MUI and browser support

MUI 9 and MUI X 9 are now the supported Base versions. Ratan Container and
Cashflow remain on their existing MUI 5 package lines; upgrading those remotes
is outside this migration. Direct use of
`@mui/x-date-pickers` is declared explicitly instead of relying on the Pro
package's transitive dependencies. Material, icons, Data Grid, and Date Pickers
must remain on compatible majors. MUI system and type packages are still
installed transitively by Material but are no longer part of Base's direct
dependency contract.

MUI 9 raises its browser floor to Chrome 117, Edge 121, Firefox 121, and Safari
17. Base's Vite build target was therefore raised from `chrome89` to
`chrome117`. Deployment and OpenFin runtime certification must preserve at
least that floor. This does not change the independently built Ratan and
Cashflow targets or their package versions.

### Federation

Follow the MVP Real World Portal Host pattern: React and ReactDOM are shared
singletons, Vite deduplicates both packages, and UI libraries remain local
application dependencies. Base currently shares React 18.2 with Ratan and
Cashflow. Ratan and Cashflow additionally share React Router; removing that
legacy share is a separate federation-contract change.

### Workspace dependency isolation

The workspace root sets npm's `install-strategy=nested`. This is required by
the Base-only migration: Base must resolve MUI 9 from its own workspace while
Ratan and Cashflow each resolve their declared MUI 5 dependencies locally.
Without this policy, npm may hoist Base's MUI 9 tree to `scb-next/node_modules`,
where unchanged remotes can resolve it and fail on MUI 5 entry points that no
longer exist.

Run `npm run verify:dependency-isolation` after every root install. It must
report Base on MUI 9 and both remotes on MUI 5. Do not add Base aliases or
change remote manifests to compensate for a hoisted install.

### React boundary

React and ReactDOM remain on 18.2 across the federated applications. React 19
is not part of this migration. Because React is a federation singleton, a
future React major upgrade must be planned and accepted across Base, Ratan,
and Cashflow together; Base must not introduce it independently.

## Other deliberate deferrals

- `react-draggable@4.7.1` publishes declarations that fail this React 18
  typecheck. Base remains on 4.4.5.
- TypeScript 7 is outside `typescript-eslint@8.67.0`'s supported `<6.1.0`
  range. TypeScript 5.9.3 remains the current supported compiler.
- React Router 7 and Zod 4 are behavioral or ESM major migrations; handle each
  with focused tests rather than folding them into dependency housekeeping.
- FINOS FDC3 and the archived `openfin-fdc3` bridge require deployed OpenFin
  runtime certification before changing versions. The unused `@openfin/core`
  type dependency has already been removed.
- `@scdevkit/webkit` is private and still declared as `"*"`. Its latest version
  cannot be established from the public registry.
  Replace the wildcard with an internally approved exact version when private
  registry access is available.
- The nested server remains CommonJS on Express 4.22.2, TypeScript 4.9.5, and
  ts-node 10.9.2 because its Docker image still targets Node 14. Its active
  dependencies were updated within those compatible lines; modernize the
  runtime as an isolated server migration.

## Verification and installation

The completed migration passes:

- Base production build in the available workspace install. That install
  currently resolves hoisted Vite 7.3.3; Storybook verifies the declared Vite
  8.2.1 line, and a root lockfile/local install is still required for a
  reproducible direct Base build.
- Nested server TypeScript build.
- 121 test files and 334 tests.
- Storybook static build with 203 indexed entries.
- Integrated Base startup, mocked local login, New Tile drawer, Ratan and
  Cashflow loading, Quick Search and Data Grid rendering, representative
  Cashflow controls, and workspace removal.

The original integrated failure was caused by dependency placement, not by a
required remote migration. In the available no-lockfile tree, Ratan and
Cashflow resolved Base's hoisted MUI 9 installation instead of their declared
MUI 5 line. Cashflow and Ratan import MUI 5 icon entry points such as
`CheckCircleOutline`, `ErrorOutline`, and `DeleteOutline`; those imports fail
when incorrectly resolved against MUI 9. A nested-install probe and local
integrated run confirmed that workspace-local MUI 5 resolution restores those
modules while Base continues to use MUI 9.

Known baseline diagnostics remain: jsdom XHR `AggregateError` output, negative
timer warnings, an undefined MUI Select value warning, and a dynamic-import
warning. TypeScript also reports existing errors in `jest.setup.tsx`, the
bootstrap version prop, and `src/vitest.setup.ts`. These were not introduced by
the dependency upgrades.

A fresh root install cannot currently be reproduced from the public registry:
`@scdevkit/webkit` is private, and SCB Next has no root lockfile. Until private
registry credentials are available, verification uses isolated dependency
trees and the existing private package. The release owner must complete a
clean root install and commit the generated `scb-next/package-lock.json` before
deployment:

```bash
cd scb-next
npm install
npm run verify:dependency-isolation
npm ls --all
npm run build --workspace @fm/base-origin
npm run build:server --workspace @fm/base-origin
npm run test --workspace @fm/base-origin
npm run build:storybook --workspace @fm/base-origin
```

Do not create a child-workspace lockfile. One root lockfile must cover Base,
Ratan, and Cashflow so the federation singleton tree is reproducible.

## Portal acceptance

After a clean workspace install, start `npm run dev` from `scb-next` and verify
the integrated application at `http://localhost:8001`:

1. Click **login**.
2. Open **New Tile** in the top navigation.
3. Launch Ratan and the Cashflow Blotter and confirm both render.
4. Remove each application with its workspace-tab delete control.
5. Check the browser console for federation share-scope, invalid-hook-call,
   failed remote, and MUI runtime errors.

This integrated journey is required because a Base-only build cannot detect a
React singleton mismatch in a remote.

## References

- [MVP Real World Portal Host](../../mvp/two-layer-federation/realworld/apps/portal-host/package.json)
- [MVP Real World current state](../../mvp/two-layer-federation/realworld/docs/CURRENT_STATE.md)
- [Storybook migration guide](https://storybook.js.org/docs/releases/migration-guide)
- [ESLint 10 migration guide](https://eslint.org/docs/latest/use/migrate-to-10.0.0)
- [Material UI v9 migration guide](https://mui.com/material-ui/migration/upgrade-to-v9/)
- [MUI X v9 Data Grid migration](https://mui.com/x/migration/migration-data-grid-v8/)
- [Module Federation shared configuration](https://module-federation.io/configure/shared.html)

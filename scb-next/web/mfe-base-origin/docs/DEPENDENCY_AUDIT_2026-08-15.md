# MFE Base dependency audit

Date: 2026-08-15

Scope: `scb-next/web/mfe-base-origin/package.json` only. The separately managed
`server/package.json` is outside the version table, although the root
`build:server` script is considered when assessing `env-cmd`.

## Executive summary

- The baseline manifest has 51 direct entries: 25 runtime dependencies and 26
  development dependencies. Almost every public package is already on the
  newest stable release in its current major, or its caret range already admits
  that release.
- Twelve entries have a newer stable major according to official npm registry
  metadata. Most should not be upgraded independently: React must move across
  all federated apps; ESLint 10 is outside `eslint-plugin-jsx-a11y`'s peer range;
  TypeScript 7 is outside `@typescript-eslint/parser`'s peer range; React type
  packages must move with React; and Node types should match the deployed Node
  runtime.
- There is no lockfile under `scb-next`. Consequently, the exact installed graph
  cannot be established from source, and a clean install can drift within every
  caret or wildcard range. Adding and committing the workspace lockfile is more
  important than changing already-current lower bounds.
- High-confidence removals or replacements are `buffer`, `uuid`,
  `@storybook/addon-links`, `@types/openfin`, and probably the root `env-cmd`.
  `@emotion/css`, `@mui/types`, `clsx`, and `@types/jest` can also leave the
  direct manifest after small code/type migrations.
- The largest potential reduction is `@scdevkit/webkit`, but it is also the
  highest contract risk. Base only loads two elements and exports the wrapper;
  no in-repository production consumer was found. Confirm external MFE
  consumers before deleting that export. At minimum, replace `"*"` with an
  exact private-registry version or a reproducible workspace/file reference.
- `openfin-fdc3` should be retired. It is not marked deprecated on npm, but the
  maintainer repository is archived and unchanged since 2020. Migrate the FDC3
  integration to `@finos/fdc3@2.2.3` and `getAgent()` in a separately tested
  stage.

## Version status

The "latest" values below are official npm `dist-tags.latest` values retrieved
on the audit date. A caret declaration may already install a newer patch/minor
than the literal lower bound shown in `package.json`.

### Newer stable major exists

| Entry | Declared | Registry latest | Adopt now? | Main constraint |
| --- | --- | --- | --- | --- |
| [`@openfin/core`](https://registry.npmjs.org/%40openfin%2Fcore) | `^35.79.5` | `43.101.4` (`stable-v43` is `43.104.2`) | Prefer removal; otherwise align with deployed OpenFin runtime | It is used only for `Window.fin` typing. OpenFin uses runtime-family tags, so a generic latest-major jump is not automatically correct. |
| [`fdc3-2.1` / `@finos/fdc3`](https://registry.npmjs.org/%40finos%2Ffdc3) | `2.1.x` | `2.2.3` | Yes, as its own migration stage | 2.2 is ESM-only, promotes `getAgent()`, makes `window.fdc3` optional, and makes `Listener.unsubscribe()` async. |
| [`react`](https://registry.npmjs.org/react) / [`react-dom`](https://registry.npmjs.org/react-dom) | `^18.2.0` | `19.2.8` | Not in Base alone | All three `scb-next` React MFEs declare React 18 and Module Federation config shares `^18.2.0`. Upgrade to 18.3.1 first, then migrate every shared singleton together. |
| [`react-router-dom`](https://registry.npmjs.org/react-router-dom) | `^6.30.4` | `7.18.2` | Reasonable after future-flag testing | Base uses the v6 declarative APIs only, but it also re-exports the package, making this a consumer contract. |
| [`uuid`](https://registry.npmjs.org/uuid) | `^9.0.0` | `14.0.1` | Remove instead | The Vite target is Chrome 117, which provides `crypto.randomUUID()`. UUID 12+ is ESM-only and v14 requires global crypto. |
| [`zod`](https://registry.npmjs.org/zod) | `^3.25.76` | `4.4.3` | Yes, with focused schema tests | Only two small authentication schemas use it, but the repository security rules require a schema validator. Zod 4 changes error customization and several error-formatting APIs. |
| [`eslint`](https://registry.npmjs.org/eslint) | `^9.39.5` | `10.8.1` | Hold | [`eslint-plugin-jsx-a11y@6.10.2`](https://registry.npmjs.org/eslint-plugin-jsx-a11y/6.10.2) declares peers only through ESLint 9. |
| [`typescript`](https://registry.npmjs.org/typescript) | `^5.9.3` | `7.0.2` | Hold | [`@typescript-eslint/parser@8.67.0`](https://registry.npmjs.org/%40typescript-eslint%2Fparser/8.67.0) requires TypeScript `>=4.8.4 <6.1.0`; the native TypeScript 7 toolchain also still documents API/language-service limitations. |
| [`@types/node`](https://registry.npmjs.org/%40types%2Fnode) | `^24.13.3` | `26.2.0` | Hold on Node 24 types | Types should match the deployed runtime. The local runtime is Node 24.16.0. |
| [`@types/react`](https://registry.npmjs.org/%40types%2Freact) | `^18.3.31` | `19.2.18` | Only with React 19 | React 19 has intentional type changes. |
| [`@types/react-dom`](https://registry.npmjs.org/%40types%2Freact-dom) | `^18.3.7` | `19.2.4` | Only with React 19 | Must stay on the same major as React DOM and `@types/react`. |

`react-draggable@^4.4.5` is not a major-version lag: that range already admits
the current stable `4.7.1`.

### Already current in the declared line

| Group | Current stable versions | Evidence / note |
| --- | --- | --- |
| Emotion | `@emotion/css` 11.13.5, `@emotion/react` 11.14.0, `@emotion/styled` 11.14.1 | [Official registry metadata](https://registry.npmjs.org/%40emotion%2Freact); React/styled satisfy MUI peer requirements. |
| MUI Core | `@mui/material` 9.3.1, icons 9.3.1, system/types 9.3.0 | [Material metadata](https://registry.npmjs.org/%40mui%2Fmaterial/9.3.1) confirms `@mui/system` and `@mui/types` are also Material dependencies. |
| MUI X | data grid/date pickers/date pickers Pro 9.11.0 | [Pro metadata](https://registry.npmjs.org/%40mui%2Fx-date-pickers-pro/9.11.0) confirms Pro depends on the community date-pickers package. |
| Runtime utilities | Axios 1.19.0, buffer 6.0.3, clsx 2.1.1, Day.js 1.11.21, DOMPurify 3.4.13, `openfin-fdc3` 0.2.3 | Each package's official registry `latest` tag matches; current does not imply actively maintained. [`openfin-fdc3`'s repository is archived](https://github.com/HadoukenIO/fdc3-service). |
| Test stack | Testing Library DOM 10.4.1, jest-dom 7.0.1, React 16.3.2, Vitest/coverage 4.1.10, jsdom 30.0.1 | [`@testing-library/react` peers](https://registry.npmjs.org/%40testing-library%2Freact/16.3.2) require DOM 10. `jsdom@30` requires Node 22.22.2+, 24.15+, or 26+. |
| Storybook | core, React Vite, docs, links, a11y all 10.5.8 | [`storybook@10.5.8`](https://registry.npmjs.org/storybook/10.5.8) and addon peers are aligned. |
| Build/lint | Module Federation Vite 1.20.7, Vite 8.2.1, React plugin 6.0.5, TypeScript ESLint parser 8.67.0, JSX a11y 6.10.2, React Hooks 7.1.1, Prettier 3.9.6, env-cmd 11.0.0 | Official package metadata confirms compatible current lines. Vite 8 and its React plugin require Node 20.19+ or 22.12+. |
| Remaining types | `@types/jest` 30.0.0, `@types/openfin` 51.0.7 | Both are latest, but being current does not make them necessary. |

No latest public package in the manifest has an npm `deprecated` field. Public
npm returns 404 for `@scdevkit/webkit`; the repository copy identifies itself as
version 2.0.5 in `sc-dev-web/sc-dev-web/package.json`.

## Usage and necessity

### Remove or replace first

| Dependency | Source evidence | Recommendation | Expected effect |
| --- | --- | --- | --- |
| `buffer` | `src/utils/common.ts` imports `Buffer` only to decode one JWT payload. | Replace with a small base64url-to-UTF-8 decoder using `atob` and `TextDecoder`; keep input/error tests. | Removes a browser polyfill package and its bundled code. |
| `uuid` | Three direct imports generate UI/workspace IDs; other calls go through `uuidv4()` in `src/utils/common.ts`. | Centralize on `crypto.randomUUID()` and update mocks. The [Web Cryptography specification](https://www.w3.org/TR/WebCryptoAPI/#Crypto-method-randomUUID) defines the native operation. | Removes a runtime package completely. |
| `@storybook/addon-links` | It appears only in `.storybook/main.ts`; no `linkTo`, `hrefTo`, or addon import occurs in stories/source. | Delete the addon unless links are injected externally. | Removes one Storybook addon and its dependencies from dev installs. |
| `@types/openfin` | No import or explicit reference exists. `Window.fin` is declared from `@openfin/core` in `src/@types/index.d.ts`. | Remove and typecheck. | Removes redundant ambient types and possible global conflicts. |
| root `env-cmd` | It is used only by `env-cmd -f .env.server tsc --project ./server`. `tsc` does not consume these variables in this project. | Change the root script to `tsc --project ./server`, then remove this root dependency. Do not conflate it with `server/package.json`'s separate runtime script. | Removes one root dev dependency without changing emitted TypeScript. |
| `@emotion/css` | Used only for `backgroundCss`, `DrawerClass`, and `NewDrawerClass` in two style files. | Express those rules through the existing MUI `styled` API or MUI `GlobalStyles`. | Removes a direct dependency and direct bundle import; Emotion React/styled remain for MUI. |
| `@mui/types` | One type-only import, `OverridableStringUnion`, in `Snackbar`. | Derive `variant` and `severity` from MUI `AlertProps` instead. | Removes a direct manifest entry, but not the installed package because Material depends on it. |
| `clsx` | Two calls in `components/Dialog/index.tsx`. | Use a tiny local class-name join or conditional template. | Removes a direct entry, but MUI/MUI X still install `clsx`; graph/bundle savings may be negligible. |
| `@types/jest` | Tests run with Vitest. The package currently supplies the `jest` global type used by the compatibility setup and older tests. | Finish the Vitest migration: type `globalThis.jest` from `vi`, import from `vitest`, and remove the Jest compatibility typing. | Removes legacy type baggage after a broader but mechanical test cleanup. |

### Remove after contract confirmation

`@scdevkit/webkit` is dynamically loaded only for `sc-button` and
`sc-icon-card`, and Base exports the generic `ScWebkit` wrapper. No production
consumer was found elsewhere under `scb-next/web`; only Base tests exercise it.
The local `sc-dev-web/sc-dev-web/dist` is about 21 MB, although dynamic imports
mean that figure is not the Base bundle cost.

Recommended decision sequence:

1. Search deployed/external MFE consumers for Base's `ScWebkit` export.
2. If there are none, remove the wrapper, its two loaders, tests/mocks, tsconfig
   path mapping, and `@scdevkit/webkit`.
3. If consumers exist, retain the integration but pin a private registry version
   or make the local package a declared workspace/file dependency. Never retain
   `"*"`; it defeats reproducible installation and version review.

### Modernize rather than retain the legacy bridge

`fdc3-2.1` and `openfin-fdc3` are both used by
`pages/Home/common/useOpenfin.ts`. The latter is an archived 2020 bridge. The
official [FDC3 2.2 release notes](https://github.com/finos/FDC3/releases/tag/v2.2)
describe the ESM-only package, `getAgent()`, optional global API, and async
listener cleanup; [2.2.3](https://github.com/finos/FDC3/releases/tag/v2.2.3) is
the latest stable maintenance release.

Migrate to one supported source of the agent:

- replace the `fdc3-2.1` alias with `@finos/fdc3@^2.2.3`;
- obtain the agent with `getAgent()` instead of falling back to
  `openfin-fdc3`;
- await or intentionally discard the promise from listener `unsubscribe()`;
- test against the actual OpenFin Desktop Agent/runtime before removing the
  legacy package.

The same stage can remove both OpenFin type packages if `window.fin` remains
only an existence check. `fdc3InitUtil` accepts it as `unknown`, so a minimal
optional `Window.fin?: unknown` declaration is sufficient. If Base starts using
OpenFin APIs directly, retain `@openfin/core` and pin it to the deployed runtime
family rather than blindly selecting npm's generic `latest` tag.

### Keep unless the feature is intentionally redesigned

| Dependency/group | Why it is necessary |
| --- | --- |
| React / React DOM | Core rendering and Module Federation singletons. The [React 19 guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide) requires a coordinated compatibility pass. |
| MUI Material / icons / Emotion React+styled | Base has more than 200 Material imports and about 36 icon imports. Emotion is the selected MUI styling engine and declared peer. Hand-building these controls or icons would increase maintenance and accessibility risk. |
| MUI X Data Grid | Used by shared/admin table components and types. Replacing the grid is a feature rewrite, not dependency cleanup. |
| MUI X Date Pickers + Pro / Day.js | Date, time, date-time, and Pro date-range pickers are all used. Day.js is both the adapter peer and the application's date/UTC/duration utility. Pro depends on the community package; normalizing imports can reduce manifest entries but not the installed graph. |
| Axios | The project centralizes request defaults, interceptors, response/error behavior, cancellation, and typed verbs around Axios. A Fetch adapter is possible, but it is a service-layer migration with behavioral tests, not a trivial removal. |
| DOMPurify | Required while Snackbar renders external strings with `dangerouslySetInnerHTML`. Prefer rendering plain React text and then removing DOMPurify if HTML formatting is not a requirement. Never replace it with a home-grown sanitizer. |
| Zod | Used for login/token boundary validation and required by the repository's security standard. The [Zod 4 changelog](https://zod.dev/v4/changelog) is the migration source. |
| React Router | Used by the admin module and re-exported to consumers. The official [v6 to v7 guide source](https://github.com/remix-run/react-router/blob/react-router%407.18.2/docs/upgrading/v6.md) calls for adopting future flags before the major upgrade. |
| `react-draggable` | Powers draggable MUI dialogs. Its existing caret range admits 4.7.1; a custom pointer implementation is unlikely to be lighter in maintenance or interaction quality. |
| Testing Library DOM/React/jest-dom | React Testing Library and jest-dom declare DOM Testing Library peer requirements; direct installation is correct even though app tests do not import `@testing-library/dom` by name. |
| Vitest, coverage-v8, jsdom | Directly configured by `vitest.config.ts` and test scripts. Coverage and Vitest versions must stay exactly aligned. |
| Vite, React plugin, Module Federation plugin | Directly imported by Vite configs and required for the MFE build/runtime contract. |
| Storybook core, React Vite, docs, a11y | Directly configured or imported by stories. Only the links addon lacks usage evidence. |
| ESLint parser, JSX a11y, React Hooks | Directly imported by `eslint.config.mjs`; retain on ESLint 9 until all plugin peer ranges include 10. The [ESLint 10 guide](https://eslint.org/docs/latest/use/migrate-to-10.0.0) also documents removed eslintrc/deprecated APIs and newer Node requirements. |
| TypeScript, `@types/node`, React types | Required for source/config compilation. Keep TypeScript 5.9 while the parser excludes 6.1+, and keep type-package majors aligned with the actual runtime libraries. |
| Prettier | Directly invoked by formatting scripts. |

## Recommended staged plan

1. Establish reproducibility: pin `@scdevkit/webkit`, document the Node runtime,
   and generate/commit the `scb-next` workspace lockfile.
2. Low-risk removals: `buffer`, `uuid`, addon-links, `@types/openfin`, root
   `env-cmd`; then run typecheck, unit tests with coverage, lint, Storybook build,
   and the Base production build.
3. Small consolidation: remove direct `@emotion/css`, `@mui/types`, and `clsx`
   after adapting their few call sites. Treat this primarily as manifest/API
   cleanup because MUI still installs some of these transitively.
4. Retire legacy FDC3/OpenFin bridge: upgrade to FDC3 2.2.3, use `getAgent()`,
   verify listener cleanup and actual desktop runtime behavior, then remove
   `openfin-fdc3` and potentially `@openfin/core`.
5. Decide the `ScWebkit` export after external consumer inventory. Removing it
   offers the largest dependency reduction but must not silently break runtime
   consumers.
6. Independent major migrations: Zod 4 first; Router 7 after v6 future flags;
   React 19 across all `scb-next` MFEs. Hold ESLint 10 and TypeScript 7 until
   their currently installed plugins declare compatibility.

## Primary sources

- Official npm registry metadata for every package, linked from the tables
  above. Registry `dist-tags`, version publication records, peer dependencies,
  engines, repository links, and deprecation fields are the version authority
  used by this audit.
- [React 19 upgrade guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [React Router v6 to v7 guide source](https://github.com/remix-run/react-router/blob/react-router%407.18.2/docs/upgrading/v6.md)
- [Zod 4 migration changelog](https://zod.dev/v4/changelog)
- [UUID official changelog](https://github.com/uuidjs/uuid/blob/main/CHANGELOG.md)
- [ESLint 10 migration guide](https://eslint.org/docs/latest/use/migrate-to-10.0.0)
- [FDC3 2.2 release](https://github.com/finos/FDC3/releases/tag/v2.2) and
  [FDC3 2.2.3 release](https://github.com/finos/FDC3/releases/tag/v2.2.3)
- [Archived OpenFin FDC3 service repository](https://github.com/HadoukenIO/fdc3-service)
- [TypeScript native compiler repository](https://github.com/microsoft/typescript-go)
- Repository source inspected directly: `package.json`, `vite.config.ts`,
  `vitest.config.ts`, `eslint.config.mjs`, `.storybook/*`, `stories/*`, and all
  imports under `src/`.

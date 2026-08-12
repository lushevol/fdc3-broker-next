# SCB migration dependency research

Research snapshot: **2026-08-13**. Scope: `scb/web/mfe-base-origin`,
`mfe-ratan-container-origin`, `mfe-cashflow-blotter-origin`, the former root
config, and `scb/services/single-ui-bff`.

## Executive recommendation

Use Vite 8, Vitest 4, `@module-federation/vite`, React 19, and native ESM for
the new host and three remotes. Remove Single-SPA, SystemJS, Webpack, Babel/Jest
build plumbing rather than upgrading it. Share `react` and `react-dom` as
strict singletons and keep the UI libraries local unless a measured duplicate
cost justifies sharing them. Module Federation's official Vite integration
supports exposes, remotes, shared dependencies, manifests, and remote type
consumption; remote HMR is still listed as roadmap work, so acceptance must use
both dev and production-preview builds ([official Vite integration](https://module-federation.io/integrations/build-tool/vite)).

The current npm `latest` versions below were read from the npm registry's
package metadata on the snapshot date. Registry links are primary, machine-
readable sources (`dist-tags.latest`). Pin exact versions in the lockfile; rerun
the query immediately before merging because tags move.

## Target platform versions

| Package | npm `latest` | Migration decision / compatibility note |
|---|---:|---|
| [`vite`](https://registry.npmjs.org/vite/latest) | 8.2.1 | Adopt. Vite 8 uses Rolldown/Oxc and requires Node 20.19+ or 22.12+ ([announcement](https://vite.dev/blog/announcing-vite8), [v7-to-v8 migration](https://vite.dev/guide/migration)). Prefer Node 22 LTS in CI and images. |
| [`@vitejs/plugin-react`](https://registry.npmjs.org/@vitejs/plugin-react/latest) | 6.0.5 | Adopt for all React host/remotes. Vite supplies the modern JSX transform required by React 19. |
| [`@module-federation/vite`](https://registry.npmjs.org/@module-federation/vite/latest) | 1.20.6 | Adopt. Configure explicit `server.origin`/`base`, manifest, named remotes, and singleton React shares. |
| [`vitest`](https://registry.npmjs.org/vitest/latest) | 4.1.10 | Adopt with `jsdom` 30.0.1. Vitest 4 requires Vite >=6 and Node >=20; configure `coverage.include`, since `coverage.all` was removed ([official migration guide](https://vitest.dev/guide/migration)). |
| [`typescript`](https://registry.npmjs.org/typescript/latest) | 7.0.2 | Registry latest, but treat as a separate compatibility gate. Start the bundler migration on the latest TS 5.9 patch already used by base if MF/codegen/plugin typings do not certify TS 7, then upgrade after a clean typecheck. |
| [`react`](https://registry.npmjs.org/react/latest) / [`react-dom`](https://registry.npmjs.org/react-dom/latest) | 19.2.8 | Target, shared singleton, exact same version in every app. React recommends first running 18.3 to surface warnings; React 19 requires the modern JSX transform and removes legacy render/unmount APIs ([official upgrade guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)). |
| [`@types/react`](https://registry.npmjs.org/@types/react/latest) / [`@types/react-dom`](https://registry.npmjs.org/@types/react-dom/latest) | 19.2.18 / 19.2.4 | Keep the major aligned with React. |
| [`@testing-library/react`](https://registry.npmjs.org/@testing-library/react/latest) | 16.3.2 | Adopt. |
| [`@testing-library/jest-dom`](https://registry.npmjs.org/@testing-library/jest-dom/latest) | 7.0.1 | Adopt; import the Vitest entry in test setup. |
| [`@testing-library/user-event`](https://registry.npmjs.org/@testing-library/user-event/latest) | 14.6.4 | Adopt; v14's async user interactions require awaited calls. |
| [`jsdom`](https://registry.npmjs.org/jsdom/latest) | 30.0.1 | Adopt as Vitest DOM environment. |
| [`@playwright/test`](https://registry.npmjs.org/@playwright/test/latest) | 1.62.1 | Adopt for host-plus-remotes E2E and visual regression. |
| [`eslint`](https://registry.npmjs.org/eslint/latest) / [`typescript-eslint`](https://registry.npmjs.org/typescript-eslint/latest) | 10.8.1 / 8.67.0 | Adopt flat config only after confirming peer ranges; do not carry the custom `*-important-stuff` configs into the new tree. |
| [`prettier`](https://registry.npmjs.org/prettier/latest) | 3.9.6 | Adopt. Remove `eslint-plugin-prettier`; run formatting independently. |
| [`storybook`](https://registry.npmjs.org/storybook/latest) / [`@storybook/react-vite`](https://registry.npmjs.org/@storybook/react-vite/latest) | 10.5.7 | Replace the Webpack Storybook builder and obsolete split addons with the Vite framework package. |
| [`concurrently`](https://registry.npmjs.org/concurrently/latest) / [`cross-env`](https://registry.npmjs.org/cross-env/latest) | 10.0.4 / 10.1.0 | Keep only if root scripts need them; Vite natively loads mode-specific `.env` files, so remove `env-cmd`/`dotenv-webpack`. |

Vite 8's default browser target moved forward and the project now uses
Rolldown. Preserve the bank's actual browser matrix explicitly in
`build.target`; do not silently accept Vite's default if older managed browsers
remain supported ([official Vite 8 migration guide](https://vite.dev/guide/migration)).

## Retained frontend libraries: registry latest and risk

These are the latest registry versions, not a direction to combine every major
upgrade with the federation cutover. “Phase” is the safe sequencing choice.

| Area | Latest versions | Recommendation |
|---|---|---|
| State/router | [`@reduxjs/toolkit` 2.12.0](https://registry.npmjs.org/@reduxjs/toolkit/latest), [`react-redux` 9.3.0](https://registry.npmjs.org/react-redux/latest), [`zustand` 5.0.14](https://registry.npmjs.org/zustand/latest), [`react-router-dom` 7.18.2](https://registry.npmjs.org/react-router-dom/latest) | Upgrade Redux/Zustand after tests pass. Router 6 to 7 is a separate behavioral migration; preserve routes on v6 during the first cut unless already verified. Do not share stores through MF implicitly—expose typed domain APIs. |
| GraphQL | [`@apollo/client` 4.2.11](https://registry.npmjs.org/@apollo/client/latest), [`graphql` 17.0.2](https://registry.npmjs.org/graphql/latest), [`graphql-request` 7.4.0](https://registry.npmjs.org/graphql-request/latest), [`graphql-ws` 6.2.1](https://registry.npmjs.org/graphql-ws/latest), [`@graphql-codegen/cli` 7.2.0](https://registry.npmjs.org/@graphql-codegen/cli/latest) | Align generated documents and runtime in one phase. GraphQL 17/Apollo 4 are major upgrades; keep one GraphQL stack per remote where practical. |
| Ant Design | [`antd` 6.6.0](https://registry.npmjs.org/antd/latest), [`@ant-design/icons` 6.3.2](https://registry.npmjs.org/@ant-design/icons/latest) | Major upgrade from v5; defer until federation and CSS parity are green. Validate reset CSS, tokens, portals, and table sizing. |
| Material UI | [`@mui/material` 9.3.1](https://registry.npmjs.org/@mui/material/latest), [`@mui/icons-material` 9.3.1](https://registry.npmjs.org/@mui/icons-material/latest), [`@mui/x-data-grid` 9.11.0](https://registry.npmjs.org/@mui/x-data-grid/latest), [`@mui/x-date-pickers-pro` 9.11.0](https://registry.npmjs.org/@mui/x-date-pickers-pro/latest), [`@emotion/react` 11.14.0](https://registry.npmjs.org/@emotion/react/latest), [`@emotion/styled` 11.14.1](https://registry.npmjs.org/@emotion/styled/latest) | v5 to v9 spans multiple breaking releases. Do it after federation; MUI's v9 guide raises supported browsers to Chrome 117/Firefox 121/Safari 17 and removes deprecated APIs ([official guide](https://mui.com/material-ui/migration/upgrade-to-v9/)). Keep Material and icons on the same major; MUI X versions are independent. |
| AG Grid | [`ag-grid-community` 36.1.0](https://registry.npmjs.org/ag-grid-community/latest), [`ag-grid-enterprise` 36.1.0](https://registry.npmjs.org/ag-grid-enterprise/latest), [`ag-grid-react` 36.1.0](https://registry.npmjs.org/ag-grid-react/latest) | All three must be exactly aligned. v32 to v36 is a separate codemod/API/CSS migration and requires enterprise-license regression checks. The blotter currently declares AG Grid in devDependencies; move runtime grid packages to dependencies. |
| Query builder | [`react-querybuilder` 8.22.5](https://registry.npmjs.org/react-querybuilder/latest), [`@react-querybuilder/antd` 8.22.5](https://registry.npmjs.org/@react-querybuilder/antd/latest) | Keep exact versions aligned and validate peer compatibility with Ant Design 6. |
| Network/runtime | [`axios` 1.19.0](https://registry.npmjs.org/axios/latest), [`express` 5.2.1](https://registry.npmjs.org/express/latest), [`compression` 1.8.1](https://registry.npmjs.org/compression/latest), [`cookie-parser` 1.4.7](https://registry.npmjs.org/cookie-parser/latest), [`zod` 4.4.3](https://registry.npmjs.org/zod/latest), [`dompurify` 3.4.13](https://registry.npmjs.org/dompurify/latest) | Axios/compression/cookie-parser are low-risk with tests. Express 4 to 5 and Zod 3 to 4 are major migrations; gate separately. Prefer the existing Java/nginx serving path over four bespoke Express servers if it preserves deployment behavior. |
| Data/export | [`exceljs` 4.4.0](https://registry.npmjs.org/exceljs/latest), [`file-saver` 2.0.5](https://registry.npmjs.org/file-saver/latest), [`uuid` 14.0.1](https://registry.npmjs.org/uuid/latest) | ExcelJS/FileSaver are already latest. UUID is a major ESM/API update; use `crypto.randomUUID()` where only v4 UUIDs are needed. |
| Dates | [`dayjs` 1.11.21](https://registry.npmjs.org/dayjs/latest) | Standardize on Day.js and remove Moment after golden date/time-zone tests. Moment officially calls itself a legacy maintenance project and discourages new usage ([project status](https://momentjs.com/docs/)). |
| OpenFin/FDC3 | `@openfin/core`, `openfin-fdc3`, `fdc3-2.1`, `@types/openfin` | Keep pinned during bundler migration. Their runtime is external and deployment-specific; certify against the actual OpenFin runtime before any version bump. Move from the npm alias `fdc3-2.1` only as a separate FDC3 protocol migration. |
| Private UI | `@scdevkit/webkit` (`*`) | **Blocker:** no authoritative public version exists. Replace `*` with an exact internally approved version and obtain its Vite/React 19 support statement before acceptance. |

## Remove or replace

| Existing dependency | Action | Reason / replacement |
|---|---|---|
| `single-spa`, `single-spa-react`, `single-spa-layout`, `ts-config-single-spa`, `@types/systemjs` | Remove | The Vite host owns composition and loads remotes through Module Federation; retaining a second application lifecycle is unnecessary complexity. |
| `webpack*`, `webpack-config-single-spa*`, loaders, `html-webpack-plugin`, `dotenv-webpack`, Babel build packages | Remove | Replaced by Vite, `@vitejs/plugin-react`, CSS preprocessors used directly by Vite, and `tsc --noEmit`. Do not use `npm-force-resolutions` to hide an incoherent tree. |
| `jest*`, `babel-jest`, `@types/jest`, `identity-obj-proxy` | Remove | Replaced by Vitest/jsdom. Vitest is Jest-like but globals are off by default and reset semantics differ ([official Jest migration notes](https://main.vitest.dev/guide/migration.html#migrating-from-jest)). |
| `react-beautiful-dnd` | Replace with [`@atlaskit/pragmatic-drag-and-drop` 2.0.2](https://registry.npmjs.org/@atlaskit/pragmatic-drag-and-drop/latest), after interaction/a11y tests | Atlassian archived and deprecated `react-beautiful-dnd` and directs users to Pragmatic Drag and Drop ([official repository](https://github.com/atlassian/react-beautiful-dnd)). This is not API-compatible, so do not swap it during the mechanical bundler step. |
| `stompjs` | Replace with [`@stomp/stompjs` 7.3.0](https://registry.npmjs.org/@stomp/stompjs/latest) | The scoped client is the maintained modern API. Preserve SockJS only if the server still requires its fallback transport. |
| `subscriptions-transport-ws` | Remove; use `graphql-ws` 6.2.1 | Apollo describes the old package as unmaintained and recommends `graphql-ws` ([official Apollo changelog](https://github.com/apollographql/apollo-server/blob/main/CHANGELOG_historical.md)). Confirm the backend subprotocol is `graphql-transport-ws`. |
| `moment` | Remove after parity tests; use the already-present Day.js | Officially legacy, mutable, and not tree-shakeable. |
| `classnames` plus `clsx` | Consolidate on [`clsx`](https://registry.npmjs.org/clsx/latest) | Same small class-name task; one dependency and one convention. |
| `lodash` `^4.18.1` | Correct immediately | That declared range is suspect and should not be trusted as a published stable target. Prefer native functions/specific imports; if retained, select the current registry release and lock it. |
| `text-encoding`, `event-source-polyfill`, `buffer` | Remove where browser matrix permits | Modern targets provide `TextEncoder`, EventSource, and browser primitives. Keep only where an audited dependency proves a runtime need. |

## Service dependency guidance

The BFF is not coupled to Vite at build time, but its origin/CORS/static-resource
contract is coupled to the new host/remotes. Preserve endpoint behavior first;
modernize the Java dependency graph as an independent stage.

| Dependency | Current | Latest primary-source result | Decision |
|---|---:|---:|---|
| Spring Boot parent | 3.3.4 | 4.1.0 ([Spring](https://spring.io/projects/spring-boot/), [Maven Central](https://central.sonatype.com/artifact/org.springframework.boot/spring-boot-starter-parent)) | Do not jump until both private `com.scb.ratan` starters certify Boot 4/Spring 7/Tomcat 11. Latest Boot still defaults to Java 17, but Jakarta/API and dependency changes remain substantial. |
| Spring Cloud BOM | 2023.0.2 | 2025.1.2 ([Spring Cloud](https://spring.io/projects/spring-cloud/)) | Use the BOM compatible with Boot: 2025.1.x for Boot 4.0/4.1; 2025.0.x for Boot 3.5. Spring marks 2023.0.x EOL. Never mix a Cloud train with an unsupported Boot generation. |
| PostgreSQL JDBC | 42.7.4 | 42.7.11 ([Maven Central](https://central.sonatype.com/artifact/org.postgresql/postgresql)) | Safe patch-line candidate, still run DB integration tests. Prefer Boot BOM management. |
| Auth0 Java JWT | 4.3.0 | 4.5.2 ([Maven Central](https://central.sonatype.com/artifact/com.auth0/java-jwt)) | Safe minor candidate with auth/token regression tests. |
| Commons IO | 2.16.1 | 2.22.0 ([Maven Central](https://central.sonatype.com/artifact/commons-io/commons-io)) | Upgrade after file-handling tests. |
| Commons CSV | 1.10.0 | 1.14.1 ([Maven Central](https://central.sonatype.com/artifact/org.apache.commons/commons-csv)) | Upgrade after export/import golden tests. |
| Gson | 2.12.0 | 2.14.0 ([Maven Central](https://central.sonatype.com/artifact/com.google.code.gson/gson)) | Upgrade with serialization fixtures. Prefer the Boot BOM if managed. |
| XStream | 1.4.21 | 1.4.21 ([Maven Central](https://central.sonatype.com/artifact/com.thoughtworks.xstream/xstream)) | Already latest. Keep strict type allowlists; do not deserialize untrusted XML. |
| Jettison | 1.5.4 | 1.5.5 ([Maven Central](https://central.sonatype.com/artifact/org.codehaus.jettison/jettison)) | Patch candidate; verify XML/JSON mapping. |
| Spring LDAP core | 3.2.8 | 4.1.0 ([Maven Central](https://central.sonatype.com/artifact/org.springframework.ldap/spring-ldap-core)) | Let the Boot BOM choose it. 4.1 belongs to the Spring 7/Boot 4 generation. |
| Embedded Tomcat | 10.1.39 | 11.0.22 ([Maven Central](https://central.sonatype.com/artifact/org.apache.tomcat.embed/tomcat-embed-core)) | Do not override manually. Tomcat 11 follows Boot 4; let the Boot BOM select a security-patched compatible version. |
| Mockito | `mockito-inline` 5.2.0 | `mockito-core` 5.23.0 ([Maven Central](https://central.sonatype.com/artifact/org.mockito/mockito-core)) | Remove the explicit inline artifact/version when the chosen Mockito supports inline mocking by default; use Boot test BOM. |
| Jasypt | 1.9.3 | 1.9.3 ([Maven Central](https://central.sonatype.com/artifact/org.jasypt/jasypt)) | No newer release. Prefer the organization's secrets manager/Vault integration for new encrypted configuration rather than extending Jasypt use. |
| Private SCB starters | 6.3.1 | Not publicly resolvable | **Release gate:** acquire private repository metadata and a compatibility matrix. These starters determine the highest safe Boot/Cloud generation. |

The current POM manually excludes and re-adds Spring Framework and Tomcat
artifacts. That defeats the tested Spring Boot dependency set. Remove these
overrides as part of the service-upgrade stage and let the selected Boot parent
and Cloud BOM manage Spring, Tomcat, Flyway, Lombok, and test libraries. Retain
an explicit override only for a documented security fix, with an expiry note.

## Compatibility gates for implementation and acceptance

1. Lock Node 22 LTS and one package-manager version across local, CI, and image
   builds. Commit the lockfile and use frozen installs.
2. Land the mechanical Vite/MF/Vitest conversion while holding application
   framework majors steady where necessary; record baseline screenshots and
   network/API fixtures before changing UI libraries.
3. Ensure host and all remotes use the same exact React/ReactDOM versions and
   MF singleton configuration. Reject duplicate React at runtime.
4. Run remote contract tests both independently and through the production
   host. Test remote unavailable, wrong manifest, cache/stale remote entry,
   authentication expiry, deep link, and refresh paths.
5. Compare computed styles and screenshots at supported viewport/browser sizes,
   including Ant Design/MUI portals, AG Grid themes/row heights, drag/drop,
   modal z-index, fonts, icons, and print/export paths.
6. Upgrade React, router, each design system, AG Grid, GraphQL, and service BOM
   in separate commits. A registry `latest` number is evidence, not compatibility.
7. Use Playwright for deterministic E2E/visual checks, then use Live Browser for
   human acceptance of login, navigation, both remotes, cashflow interactions,
   websocket/GraphQL updates, and responsive styling.

## Unresolved evidence required before release

- Exact latest versions and compatibility statements for `@scdevkit/webkit`,
  both `com.scb.ratan:*:6.3.1` starters, deployment `ansible.version`, and the
  bank's OpenFin runtime are private/vendor-controlled and cannot be validated
  from public primary sources.
- MUI X Pro/AG Grid Enterprise license keys and version entitlements must be
  checked in the target deployment without exposing keys in source or logs.
- Browser support and CSP/CORS rules must be supplied by the deployment owner;
  Vite 8, Module Federation remote loading, and MUI 9 all affect that contract.


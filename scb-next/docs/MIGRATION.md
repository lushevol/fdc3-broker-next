# SCB Vite and Module Federation migration runbook

## Scope and source preservation

`scb-next` is an isolated copy of the repository's lowercase `scb/web` and `scb/services` trees. Generated output, dependency directories, and caches were excluded. No source file under `scb/` was changed, so it remains the rollback baseline.

The active migration is deliberately limited to the three origins requested:

```text
mfe-base-origin :8001
  └─ @fm/ratan_container from :8009/remoteEntry.js
       └─ @fm/ratan_cashflow_blotter from :8015/remoteEntry.js
```

The copied `mfe-root-config-origin` and legacy `System.import` integrations for unrelated external tiles remain as migration reference, but are not in the active three-origin boot path.

## What changed

- Replaced the three origins' Webpack/single-spa scripts with Vite build, dev, and preview scripts.
- Added `index.html`, Vite configurations, React `createRoot` bootstraps, typed federation declarations, and explicit application exposes.
- Made the base origin the portal host. It consumes Ratan; Ratan consumes Cashflow.
- Shared `react`, `react-dom`, and `react-router-dom` as federation singletons. Sharing the router is essential because Cashflow reads routing context created by Ratan.
- Preserved the copied React trees, Less/CSS, images, themes, routes, and HTTP request contracts.
- Reused the two-layer-federation compatibility façades for base, Ratan components, dialogs, and utilities. These replace compile-time SystemJS imports with local ESM boundaries.
- Replaced Jest execution with Vitest and added compatibility setup for the copied Jest-era tests. New architecture tests validate manifests, ports, remotes, exposes, and absence of single-spa in the active manifests.
- Added Playwright tests for portal styling and the Ratan-to-Cashflow production federation chain.

## Runtime configuration

| Origin | Port | Federation name | Interface |
| --- | ---: | --- | --- |
| Base host | 8001 | `mfe_base_host` | consumes `ratan_container/application` |
| Ratan | 8009 | `ratan_container` | exposes `./application`; consumes Cashflow |
| Cashflow | 8015 | `cashflow_blotter` | exposes `./application` |

Remote URLs can be overridden with the corresponding Vite environment variables defined in the Vite configs. Defaults use `127.0.0.1` and the ports above.

## Dependency decisions

The manifests declare the latest stable migration toolchain available on 2026-08-13: Vite 8.2.1, Vitest 4.1.10, `@module-federation/vite` 1.20.6, and React plugin 6.0.5. Exact registry and official-documentation evidence is in [dependency-research.md](dependency-research.md).

React, MUI, AG Grid, GraphQL, and Spring ecosystem major upgrades were not combined with the federation cutover. They are valuable follow-up stages, but changing all runtime contracts at once would make UI or data regressions difficult to isolate. The report records current latest releases and recommended replacements/removals.

## Commands

From `scb-next` after installing dependencies:

```bash
npm run dev
npm run build
npm run test
npm run test:unit
npm run test:e2e
```

For production-style acceptance, build all three origins and run their `preview` scripts concurrently. Playwright expects the three URLs to be live.

## Verification performed

| Gate | Result |
| --- | --- |
| Architecture contract | Passed: 8/8 Vitest assertions |
| Base, Ratan, Cashflow production builds | Passed; both remote entries emitted |
| Base unit suite | Passed: 120/120 files, 332/332 tests |
| Ratan unit suite | Passed: 161 files and 823 tests; 1 file/test remains intentionally skipped |
| Cashflow unit suite | Passed: 241/241 files, 1,945 tests; 17 tests remain intentionally skipped; zero unhandled errors |
| Playwright production acceptance | Passed: 2/2 scenarios |
| Live Browser: base | Login UI and heading rendered; SSO button retained `rgb(0, 135, 56)`, white text, 5px radius, and Poppins typography; no new page error |
| Live Browser: nested federation | Ratan loaded Cashflow from port 8015 and rendered `API Status` / `Refresh Page` with no uncaught browser errors |

The inherited frontend corpus now executes under Vitest. The migration replaced executable CommonJS test imports, corrected Vitest mock hoisting and partial-module mocks, made timer ownership explicit, and removed dangling asynchronous DOM queries. The remaining skips are pre-existing intentional skips and are reported separately above.

## Service constraint

The copied `single-ui-bff` retains its routes and source unchanged. A Maven test attempt resolved public artifacts but could not retrieve the private SCB starters, including `com.scb.ratan:ratanone-service-spring-boot-starter:6.3.1` and the private HashiCorp starter. Configure the corporate Maven repository and credentials, then run the service tests from the service directory. This environment cannot certify the BFF suite without those artifacts.

## Known follow-ups

- Supply corporate npm/Maven credentials. A clean workspace install is currently blocked by private `@scdevkit/webkit` and private Maven starters; verification used the repository's installed compatible toolchain while manifests record current stable versions.
- Split the largest Ratan/Cashflow chunks. Vite correctly emits them, but warns about assets above the default 500 kB threshold.
- Run the backend-connected business-data journey when the private BFF can start. Browser acceptance currently proves composition and preserved styling; the blank blotter data canvas is expected without the BFF.

## Rollback

Stop the three `scb-next` origins and route traffic back to the original single-spa root-config/import maps. Since `scb/` was not modified, rollback requires no source reconstruction.

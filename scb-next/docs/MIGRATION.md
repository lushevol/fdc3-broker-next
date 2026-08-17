# SCB Next AI migration runbook

This is the canonical execution guide for converting behavior from the legacy
`scb/` project into the active `scb-next/` architecture. It is written for an
AI coding agent performing the work, not as a historical overview.

Read these documents in this order:

1. this runbook for the ordered migration process;
2. [MIGRATION_SPEC.md](MIGRATION_SPEC.md) for normative acceptance criteria;
3. [VERIFICATION_GUIDE.md](VERIFICATION_GUIDE.md) for commands and evidence;
4. [base-origin-dependency-audit.md](base-origin-dependency-audit.md) when the
   change affects dependencies, MUI, Storybook, ESLint, React, or installation;
5. [PRODUCTION_ACCEPTANCE.md](PRODUCTION_ACCEPTANCE.md) only as dated historical
   evidence, never as proof that the current checkout still passes.

The migration is complete only when the target owns the behavior, every
preserved contract has evidence, the integrated browser journey passes, and no
active build or runtime path reaches back into `scb/`.

## AI execution contract

Follow this contract for every migration, including small follow-up ports.

1. Read the repository `AGENTS.md`, `docs/rules.md`, and all target-workspace
   instructions before editing.
2. Treat `scb/` as read-only evidence and rollback source. Record its commit
   SHA and the exact files or diff being migrated.
3. Inspect both source and target before deciding that a file should be copied.
   The target intentionally differs in composition, compatibility, tests,
   dependencies, and deployment.
4. Define observable parity first. Add or update the specification and a
   regression test before implementation.
5. Run GitNexus impact analysis before editing a symbol and warn on HIGH or
   CRITICAL risk. Run change detection before every commit.
6. Migrate one coherent stage at a time. Each stage ends with a checkable gate
   and an isolated commit containing no unrelated changes.
7. Preserve business behavior and external contracts. Translate only the
   architecture boundary needed by Vite and Module Federation.
8. Keep React 18 across all three origins. Upgrade dependencies only in Base
   when the task explicitly targets the completed Base dependency migration.
   Ratan and Cashflow remain on their existing dependency lines.
9. Verify the integrated host after any Base, federation, theme, dependency,
   routing, API, or compatibility-facade change. A workspace build alone cannot
   detect singleton, CSS-order, remote-loading, or cross-origin failures.
10. Report blockers as blockers. Never convert a missing private package,
    unsupported peer range, real-BFF dependency, or failed build into a claimed
    pass by weakening a test or changing unrelated business code.

### Stop conditions

Stop the affected stage and report evidence when any of these conditions holds:

- the legacy behavior or response contract cannot be established from source,
  tests, screenshots, or sanitized captures;
- a private package or Maven artifact is unavailable and the target cannot be
  installed or built reproducibly;
- a proposed change would require a React major change across only one origin;
- Base resolves Ratan or Cashflow to Base's MUI 9 dependency tree;
- a compatibility facade would need to duplicate business logic rather than
  expose a narrow platform capability;
- a backend schema, entitlement, workflow, or data migration would cease to be
  backward compatible;
- the only way to pass is to restore SystemJS, an import map, Single-SPA, or
  Webpack to the active three-origin path;
- the target behavior differs from production and the difference has not been
  explicitly accepted.

For a blocked gate, retain the failing command, exit code, first actionable
error, environment assumptions, and the last known passing gate.

## Truth hierarchy

Use evidence in this order when sources disagree:

1. current production request/response capture and accepted screenshot;
2. legacy runtime behavior and tests at the recorded source SHA;
3. target specifications and contract tests;
4. target implementation;
5. historical acceptance reports and prose.

Raw production captures may contain credentials, JWTs, identifiers, and other
sensitive data. Store only minimal sanitized fixtures. Preserve field names,
operation names, branching markers, pagination, and relationships required by
the UI; replace or remove secrets and unrelated personal data.

## Scope and ownership

`scb-next` began as an isolated copy of the legacy web and service trees. The
active release is deliberately narrower than the full legacy composition.

| Concern                        | Legacy source                         | Target owner                                           | Required treatment                                                                                                           |
| ------------------------------ | ------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Root composition               | `scb/web/mfe-root-config-origin`      | Base Vite host                                         | Replace active import-map and Single-SPA startup; retain legacy root only as migration history.                              |
| Portal/login/workspaces        | `scb/web/mfe-base-origin`             | `scb-next/web/mfe-base-origin`                         | Preserve login, identity, entitlements, drawer, themes, workspaces, and tab behavior.                                        |
| Ratan routing/providers        | `scb/web/mfe-ratan-container-origin`  | `scb-next/web/mfe-ratan-container-origin`              | Expose `./application`; preserve Cashflow routing and provider context.                                                      |
| Cashflow applications          | `scb/web/mfe-cashflow-blotter-origin` | `scb-next/web/mfe-cashflow-blotter-origin`             | Expose `./application`; preserve all eight screens, business logic, styles, GraphQL/REST contracts, and generated types.     |
| Base imports used by remotes   | `@fm/base` runtime/package surface    | Per-remote `src/compat/base.tsx`                       | Implement the smallest typed compatibility capability.                                                                       |
| Ratan imports used by Cashflow | `@fm/ratan_container`                 | Cashflow `src/compat/` plus `src/cashflow-ratan/`      | Keep Cashflow self-contained at build time while preserving the consumed Ratan contract.                                     |
| Platform HTTP services         | `scb/services/single-ui-bff`          | three portal runtime services plus retained fallback   | Split deployment ownership by stable path family while preserving routes, payloads, auth headers, schemas, and side effects. |
| Development API replay         | Legacy/production behavior            | Base `dev/mock-api.ts` and `devops/mock-bff/fixtures/` | Provide deterministic, request-aware, sanitized local behavior.                                                              |
| Production edge                | Legacy per-origin delivery            | `scb-next/devops/vm` and `scb-next/devops/kubernetes`  | Route browser traffic through the platform edge; on Kubernetes delegate tenant path families to team-owned tenant edges.     |

Generated output is never a migration source. Exclude `dist/`, `coverage/`,
`node_modules/`, `.vite/`, Playwright results, copied lockfiles from child
workspaces, built assets, logs, and temporary captures.

## Target runtime contract

```text
Browser
  -> Base host (:8001, federation name mfe_base_host)
       -> import("mfe_ratan_container/application")
          Ratan remote (:8009, name mfe_ratan_container)
            -> import("mfe_cashflow_blotter/application")
               Cashflow remote (:8015, name mfe_cashflow_blotter)
  -> /api/*
       -> Base development mock
       -> production edge -> portal-auth-service for auth and SSO
                          -> portal-tile-management-service for admin
                          -> portal-telemetry-service for analytics
                          -> single-ui-bff for unmatched platform APIs
                          -> Kubernetes ratan-edge
                               -> Ratan-owned BFF/notification/DA/gateway for /api/ratan/*
```

| Origin   | Development URL         | Federation contract                        | Production path                                           | Owner                                               |
| -------- | ----------------------- | ------------------------------------------ | --------------------------------------------------------- | --------------------------------------------------- |
| Base     | `http://127.0.0.1:8001` | consumes `mfe_ratan_container/application` | `/`                                                       | login, navigation, theme, workspace state, mock API |
| Ratan    | `http://127.0.0.1:8009` | exposes `./application`; consumes Cashflow | `/static/ratan/container/` with `/remotes/ratan/` alias   | Ratan provider/router and Cashflow routes           |
| Cashflow | `http://127.0.0.1:8015` | exposes `./application`                    | `/static/ratan/cashflow/` with `/remotes/cashflow/` alias | Cashflow screens and business state                 |

The three origins share compatible React and ReactDOM 18 singletons. Ratan and
Cashflow also share React Router because Cashflow consumes Ratan's router
context. UI libraries are local dependencies, not federation singletons.

`scb-next/web/mfe-root-config-origin` is migration history. It is excluded from
the root npm workspaces, startup commands, build, packaging, and deployment.

## Architecture replacements

| Legacy mechanism                                  | Target mechanism                                           | Source of truth                                     |
| ------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------- |
| Webpack and `webpack-config-single-spa-*`         | Vite                                                       | each active origin's `vite.config.ts`               |
| Single-SPA bootstrap/mount                        | React host plus federated React module                     | `src/bootstrap.tsx` and `src/root.tsx`              |
| `System.import("@fm/ratan_container")`            | dynamic federation import                                  | Base `pages/Home/common/Container.tsx`              |
| `System.import("@fm/ratan_cashflow_blotter")`     | nested federation import                                   | Ratan `Root/import/CashFlowCN.tsx`                  |
| Import-map addresses                              | build environment remote URLs                              | `VITE_RATAN_REMOTE_URL`, `VITE_CASHFLOW_REMOTE_URL` |
| Runtime `@fm/base` dependency                     | local compatibility alias                                  | Ratan/Cashflow Vite aliases                         |
| Cashflow runtime `@fm/ratan_container` dependency | local Ratan facade and Cashflow-owned compatibility source | Cashflow Vite aliases and `src/compat/`             |
| Node-oriented `stompjs` entry                     | browser compatibility entry                                | Cashflow `src/compat/stomp.ts` alias                |
| Jest/Babel execution                              | Vitest compatibility setup                                 | workspace `vitest.config.ts` and setup files        |
| Public remote origins                             | same-origin Nginx paths                                    | `devops/nginx/default.conf.template`                |

Copied loaders for unrelated Ratan applications may still contain
`System.import`. They are dormant reference paths, not supported applications.
A later migration must give each such application its own remote contract,
tests, deployment path, and rollback plan before exposing it in the drawer.

## Dependency contract

The dependency graph is part of runtime correctness.

- React and ReactDOM remain `18.2` compatible across Base, Ratan, and Cashflow.
- Base uses current MUI 9, MUI X 9, Emotion 11, Storybook 10, ESLint 9, Vite 8,
  and Vitest 4 as recorded in
  [base-origin-dependency-audit.md](base-origin-dependency-audit.md).
- Ratan and Cashflow retain MUI 5 and their existing Ant Design, AG Grid,
  GraphQL, state, and test dependency lines. Their version upgrades are
  independent migrations.
- The SCB Next root uses npm's nested install strategy. After every install,
  run `npm run verify:dependency-isolation` and require Base to resolve MUI 9
  while both remotes resolve MUI 5 from their own workspaces.
- One root `scb-next/package-lock.json` must cover all workspaces. Do not create
  child lockfiles.
- `@scdevkit/webkit` and SCB Maven starters require corporate registry access.
  A public-registry-only install is not a reproducible release build.
- React, router, MUI, Ant Design, AG Grid, GraphQL, and Spring major upgrades
  each require a separate specification, compatibility matrix, and regression
  stage.

If a remote build cannot resolve MUI 5 icon modules such as
`DeleteOutline` or `CheckCircleOutline`, first prove dependency placement with
`npm run verify:dependency-isolation`. The accepted fix is a correct nested
install and root lockfile, not rewriting imports for MUI 9 and not upgrading
the remote.

## Compatibility boundaries

Compatibility files are anti-corruption layers, not dumping grounds.

| Boundary                            | Current location                                                  | Responsibilities                                                                                            |
| ----------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Ratan -> Base                       | `mfe-ratan-container-origin/src/compat/base.tsx`                  | identity, service transport, portal state/components, telemetry, navigation, theme-compatible capabilities  |
| Cashflow -> Base                    | `mfe-cashflow-blotter-origin/src/compat/base.tsx`                 | identity, service transport, dialogs/components, storage, telemetry, navigation, canonical portal MUI theme |
| Cashflow -> Ratan                   | `mfe-cashflow-blotter-origin/src/compat/ratan-container.ts`       | stable export namespace expected by Cashflow                                                                |
| Cashflow-owned Ratan implementation | `mfe-cashflow-blotter-origin/src/cashflow-ratan/`                 | copied Ratan UI/utilities that Cashflow currently requires at build time                                    |
| Related applications                | `compat/related-applications.tsx`, `compat/quick-search-items.ts` | typed host handoff replacing Cashflow-owned dynamic SystemJS imports                                        |
| STOMP                               | `compat/stomp.ts`                                                 | force the browser entry and avoid Node `net` resolution                                                     |

When a copied change introduces a new Base or Ratan import:

1. locate every consumer and define the observable capability;
2. prefer an existing facade export;
3. add one minimal typed export when no contract exists;
4. implement platform behavior at the facade boundary, business behavior in
   the owning business module;
5. add a contract test that would fail if the facade shape or behavior drifted;
6. verify no new runtime dependency on a legacy package name appears in built
   assets.

Preserve these style/runtime boundary details:

- Ratan CSS prefix: `MicroWebUI_ratan_container`;
- Cashflow CSS prefix: `MicroWebUI_cashflow_cn`;
- host `<html>` theme class and dark/light propagation;
- Poppins typography and compact MUI defaults;
- Ant Design provider tokens and portal/z-index behavior;
- locally bundled Ratan AG Grid skin and `.ag-theme-alpine-dark` behavior;
- Emotion insertion order so later MUI defaults do not override the portal
  theme;
- asset URLs relative to each remote's `VITE_PUBLIC_BASE`.

## Ordered migration procedure

### Phase 0: establish baselines

1. Record `git rev-parse HEAD` for the target and the legacy source revision.
2. Record `git status --short`; preserve unrelated changes.
3. Run the current focused tests and build commands before editing.
4. Capture the legacy user journey, screenshots, console, request bodies, and
   responses required by the change.
5. Write a short parity statement naming inputs, visible output, service
   effects, permissions, styles, responsive behavior, and failure states.

Completion criterion: every requested behavior has a legacy evidence source,
and every failing baseline command is recorded before migration work starts.

### Phase 1: inventory the dependency surface

For every legacy file in scope, classify its transitive dependencies:

- local business source, styles, assets, tests, generated types;
- Base platform API;
- Ratan platform API;
- remote application/runtime composition;
- React/provider/router/store context;
- REST, GraphQL, SockJS/STOMP, export, or notification contract;
- browser/global/build-time assumption;
- private package, license, entitlement, or environment dependency.

Produce a source map with one disposition per item: copy, translate, facade,
regenerate, retain version, exclude, or block. Whole-directory copying is not
a disposition.

Completion criterion: every changed legacy file and every non-relative import
reachable from it has an explicit target treatment.

### Phase 2: specify and make the test red

Update [MIGRATION_SPEC.md](MIGRATION_SPEC.md) when the behavior changes. Add the
smallest test at the real contract seam:

- component/unit test for local behavior;
- facade contract test for Base/Ratan compatibility;
- architecture test for composition, aliases, dependency isolation, or CSS
  namespace;
- mock middleware test for API request matching and response shape;
- Playwright test for cross-origin composition or user workflow.

Run the focused command and confirm it fails for the missing behavior, not for
an unrelated environment problem.

Completion criterion: the new test deterministically distinguishes the old
target behavior from the required behavior.

### Phase 3: port owned source

Copy only the source, tests, styles, assets, and generated contracts required
by the inventory. Preserve relative layout when code generation or imports
depend on it. Apply the smallest runtime translation needed by the target.

Keep target-owned files authoritative, including:

- `package.json`, root lockfile, Vite/Vitest/Playwright configuration;
- `src/bootstrap.tsx`, `src/root.tsx`, federation declarations;
- compatibility facades and Cashflow-owned Ratan compatibility tree;
- Base development mock middleware;
- Nginx, Docker, build, and deployment scripts.

Completion criterion: the target contains all owned behavior and no imported,
aliased, linked, or served source path points into `scb/`.

### Phase 4: translate composition and imports

Apply these rules in order:

1. retain relative business imports;
2. route Base and Ratan package imports through declared aliases;
3. replace an active application runtime import with a declared federation
   module;
4. replace Cashflow-owned cross-application actions with typed host navigation
   handoffs;
5. preserve provider nesting and router ownership;
6. add ambient module declarations for federation modules;
7. configure React/ReactDOM singleton sharing and React Router sharing where
   context crosses the boundary;
8. preserve compile-time globals through Vite `define` only when source still
   requires them.

Completion criterion: the migrated path runs without a legacy import map,
Single-SPA lifecycle, `System.import`, Webpack global, duplicate React
dispatcher, or missing provider/router context.

### Phase 5: preserve styling and assets

Compare the accepted legacy screenshot and target at the same viewport and
theme. Verify components individually: portal chrome, Quick Search, preset
metrics, custom selectors/builders, grid, dialogs, details, icons, tooltips,
loading, empty, error, hover, disabled, and responsive states.

Check computed styles, not only class names. Confirm remote CSS and assets load
from the correct origin and that later-injected MUI/Emotion styles do not reset
the portal theme.

Completion criterion: there is no layout overlap, missing asset, unstyled
Material UI control, Ant Design token regression, grid-skin regression, or
theme mismatch at the accepted desktop and responsive viewports.

### Phase 6: preserve service contracts and mocks

Keep production REST and GraphQL paths, methods, query parameters, headers,
request bodies, response envelopes, pagination, errors, and side effects
unchanged unless a separate service specification changes them.

Development replay belongs in
`mfe-base-origin/dev/mock-api.ts`; fixture payloads belong in
`devops/mock-bff/fixtures/`. Match the request by method, pathname, query, and
the minimal stable body markers needed to distinguish operations. Keep a
generic fallback only for unrelated calls.

The Cashflow acceptance replay must cover:

| Journey step         | Required mock behavior                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| login                | sanitized successful identity, entitlements, drawer and eight Cashflow tiles, authorization response header   |
| initial metadata     | field versions and field definitions for transaction/Cashflow contexts                                        |
| initial grid         | production-shaped `cashflowUltraQuery` envelope and rows                                                      |
| preset metrics       | distinguish Pending Operator and Pending Verification requests for both date groups                           |
| ID search            | match `M0P56753524` request markers and return one complete row                                               |
| details              | match `graphCashFlowDetails` and return detail composition for the same ID                                    |
| accounting           | return the captured empty accounting result                                                                   |
| currency holiday     | return the captured holiday response                                                                          |
| custom search/view   | return usable saved filter and view arrays with the correct builder types                                     |
| notification startup | provide valid SockJS JSONP open/connected/heartbeat/send frames so no reconnect alert or syntax error appears |

Fixtures must be internally consistent: IDs used by search must open details;
dates/currencies/amounts must agree across grid and details; builder types must
match request types; login entitlements must expose the tested controls.

Development and production fixture paths use the canonical request-aware
handler in `devops/mock-bff/mock-api.mjs`. The Vite plugin is a typed adapter;
the production composition runs `devops/mock-bff/server.mjs` behind the Nginx
edge. The server supports SockJS WebSocket and JSONP transports so production
acceptance does not depend on a transport error followed by fallback.

Completion criterion: the automated mock tests pass and the live browser
journey completes without fallback alerts, notification errors, unexpected
empty states, or sensitive captured data in the repository.

### Phase 7: verify from leaf to host

Run focused tests first, then verify in dependency order:

1. Cashflow tests and build;
2. Ratan tests and build;
3. Base tests, Storybook where affected, and build;
4. architecture and dependency-isolation tests;
5. integrated development Playwright and Live Browser;
6. VM edge render/routing and rollback checks for the current production path;
7. Minikube workload, ingress, routing, policy-capable CNI, Playwright, and Live Browser checks for the Kubernetes proof;
8. real platform and tenant backend acceptance for production certification.

Use [VERIFICATION_GUIDE.md](VERIFICATION_GUIDE.md) for exact commands and
evidence. A downstream build failure blocks its consumers even if the Base
host builds.

Completion criterion: every applicable gate is green or explicitly recorded
as blocked with no claim of release readiness.

### Phase 8: inspect the built boundary

Inspect generated host and remote artifacts for:

- correct `remoteEntry.js` URLs and public bases;
- HTTP 200 for every remote entry and referenced chunk;
- no active references to `scb/`, import maps, or legacy MFE package names;
- one compatible React share scope;
- no host-relative remote chunk URLs;
- `no-store` on federation manifests and immutable caching on hashed assets;
- `/api/` requests routed through the Base mock in development or the owning
  platform/tenant upstream through the edge in production.

Completion criterion: the browser network graph contains the expected host,
two remote manifests, their chunks, and allowed API origin only.

### Phase 9: review and commit

Run GitNexus change detection and inspect `git diff --check`, the full diff,
and `git status --short`. Commit only the completed stage. Use a message that
states the behavior or boundary migrated, not a generic synchronization label.

Completion criterion: the commit is reproducible, contains no unrelated user
changes, and its message plus verification evidence explains why the stage is
safe.

### Phase 10: cut over and monitor

Record independent Base, Ratan, Cashflow, portal service, platform fallback,
tenant backend, and edge artifact identities. Promote only the selected compatible units, then route a
controlled cohort through the platform edge first.
Monitor login failures, remote/chunk load failures, React share-scope errors,
API status and latency, SockJS/STOMP reconnects, uncaught browser errors, blank
workspaces, and user workflow errors before increasing traffic.

Completion criterion: the agreed observation window passes its thresholds and
the recorded rollback route remains available.

## Configuration contracts

| Variable                                  | Phase            | Contract                                                                                                     |
| ----------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------ |
| `VITE_RATAN_REMOTE_URL`                   | Base build/dev   | full Ratan `remoteEntry.js` URL; local default is port `8009`                                                |
| `VITE_CASHFLOW_REMOTE_URL`                | Ratan build/dev  | full Cashflow `remoteEntry.js` URL; local default is port `8015`                                             |
| `VITE_PUBLIC_BASE`                        | remote build     | remote asset base; canonical production paths are below `/static/ratan/` and `/remotes/*` remains compatible |
| `SCB_NEXT_EDGE_ORIGIN`                    | production build | public origin embedded in both remote URLs; local default is `http://127.0.0.1:9081`                         |
| `SCB_NEXT_EDGE_PORT`                      | local production | published edge port; defaults to `9081` and derives the origin when it is unset                              |
| `BFF_ORIGIN`                              | local Compose    | fixture-backed upstream for the legacy local acceptance topology only                                        |
| `PORTAL_AUTH_SERVICE_UPSTREAM`            | VM edge runtime  | owner for general `/api/auth/*` and `/api/sso/*` routes                                                      |
| `PORTAL_TILE_MANAGEMENT_SERVICE_UPSTREAM` | VM edge runtime  | owner for the most-specific `/api/auth/v1/fmo/admin/*` route family                                          |
| `PORTAL_TELEMETRY_SERVICE_UPSTREAM`       | VM edge runtime  | owner for `/api/analytics/*` routes                                                                          |
| `SINGLE_UI_BFF_UPSTREAM`                  | VM edge runtime  | fallback upstream for unmatched platform `/api/*` routes                                                     |
| `RATAN_*_UPSTREAM`                        | VM edge runtime  | independently configured Ratan BFF, notification, data-ambassador, and gateway owners                        |
| `IMAGE_TAG`                               | container build  | optional edge image tag                                                                                      |

Build production artifacts from the leaf toward the host. The authoritative
script is `devops/scripts/build-production.sh`, whose order is Cashflow,
Ratan, then Base.

## Failure dictionary

| Symptom                                                       | Likely cause                                                | Required first check                                                         |
| ------------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------- |
| invalid hook call or `ReactCurrentDispatcher` failure         | duplicate/incompatible React share                          | compare all three manifests and federation singleton configuration           |
| remote entry loads but chunks 404                             | wrong `VITE_PUBLIC_BASE` or remote URL                      | inspect `remoteEntry.js` and failing chunk URL                               |
| `@mui/icons-material/*` cannot resolve in a remote            | Base MUI 9 hoisted over remote MUI 5                        | run dependency-isolation verification and inspect workspace-local resolution |
| Material UI controls lose production styling                  | Emotion/MUI insertion order or incomplete Base theme facade | inspect computed styles and Cashflow Base compatibility theme                |
| Cashflow selectors lose action styling                        | Ratan CSS prefix drift                                      | verify `MicroWebUI_ratan_container` and architecture test                    |
| grid renders unstyled                                         | local Ratan grid skin missing or load order changed         | inspect bundled AG Grid CSS and `.ag-theme-alpine-dark` computed styles      |
| `process` or `global` is undefined                            | legacy compile-time global not translated                   | inspect Cashflow Vite `define` and aliases                                   |
| Node `net` requested by STOMP                                 | wrong `stompjs` entry                                       | verify browser STOMP alias                                                   |
| JSONP `Unexpected token ':'` and notification reconnect alert | generic JSON fallback handled SockJS script request         | verify request-aware JSONP transport mock                                    |
| blank tile drawer after opening a stale session               | login fixture was not loaded into current portal state      | log out and sign in through the local fixture flow                           |
| custom dialog opens but saved entries are absent              | filters/views fixture returns empty or wrong builder type   | compare request query and fixture `type`                                     |
| search row opens fallback details                             | list and detail fixture IDs or operation markers disagree   | verify one internally consistent journey ID                                  |
| build passes but integrated screen fails                      | untested federation/provider/CSS runtime boundary           | run development and production browser gates                                 |

## Current known state

As of 18 August 2026:

- the development three-origin journey is operational through Base port `8001`;
- the Base development mock replays login, metadata, metrics, initial grid,
  `M0P56753524` search/details, accounting, holiday, custom filter/view, and
  SockJS notification startup;
- `scb-next` root architecture, mock, deployment, and adapter tests pass with 44 tests;
- the complete leaf-to-host production build passes when dependency isolation
  resolves Base to MUI 9 and both remotes to MUI 5;
- a clean `scb-next` install remains blocked without corporate-registry access
  to `@scdevkit/webkit`; do not replace the private package or upgrade remotes
  as a workaround;
- strict Base typecheck still exposes pre-existing Jest setup, bootstrap prop,
  and Vitest setup errors;
- the Minikube proof deploys ten Ready workloads and thirteen `ClusterIP`
  Services, including independently owned `scb-next-edge`, `ratan-edge`, three
  portal domain services, and retained `single-ui-bff` fallback Deployments;
- two-edge routing, canonical and compatibility remotes, cache headers, security
  contexts, Ratan-only outage/recovery, and WebSocket notification startup pass;
- mock response identity proves auth, tile-management, telemetry, and fallback
  route ownership; stopping each portal service affects only its path family
  and recovery does not restart unrelated services;
- the portal split is deployment-first and still uses compatible
  `single-ui-bff` code; Java source, database, session, and downstream
  integration separation remain future work;
- the latest strict production-edge Playwright run completed the captured
  Cashflow journey with an empty console-error gate;
- the default Minikube bridge CNI stores but does not enforce NetworkPolicy, so
  runtime denial remains blocked until rerun with a policy-capable CNI;
- inherited React, Ant Design, Apollo, Redux serializability, and AG Grid
  deprecation warnings remain migration debt. Classify warnings explicitly;
  never hide new runtime failures among them.

Re-run all gates. This status is context, not acceptance evidence.

## Required handoff record

An AI completing a migration must return this record:

```text
Legacy source SHA:
Target starting SHA:
Target ending SHA:
Scope migrated:
Files intentionally copied:
Files intentionally translated:
Compatibility capabilities added:
External contracts preserved:
Dependencies changed (or "none"):
Mock contracts added/changed:
Focused tests and results:
Workspace tests and results:
Dependency isolation result:
Build results for Cashflow, Ratan, Base:
Development Playwright result:
Development Live Browser evidence:
Production-edge result:
VM edge and rollback result:
Kubernetes workload/route result:
NetworkPolicy CNI and runtime result:
Real-BFF result:
Known warnings/debt:
Blocked gates and exact cause:
Rollback revision and routing action:
Commits created:
```

A blank field is not evidence. Use `not applicable` with a reason or `blocked`
with the failing command and cause.

## Cutover and rollback

Before cutover, record both legacy and target revisions, canonical and alias
remote URLs, every platform and tenant upstream, artifact digests, lockfile,
test evidence, browser evidence, and rollback owner. Mock-backed acceptance
certifies frontend composition only; real backend acceptance is mandatory for
production certification.

Rollback is a routing operation:

1. stop increasing traffic to `scb-next`;
2. route users to the recorded legacy root-config/import-map deployment;
3. drain target traffic before stopping the target composition;
4. retain failed artifacts, logs, traces, and configuration for diagnosis;
5. fix source in `scb-next` and rebuild; never patch generated `dist/` output;
6. preserve `scb/` as the unchanged rollback baseline.

Frontend rollback does not reverse BFF writes. Any data, workflow, entitlement,
or schema change requires an independently tested backward-compatible rollback
plan before cutover.

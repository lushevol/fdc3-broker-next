# SCB Next migration runbook

This document explains how to move changes from the legacy `scb/` sources into the active `scb-next/` architecture and how to cut traffic over without changing business or service contracts. Use [MIGRATION_SPEC.md](MIGRATION_SPEC.md) for acceptance requirements and [VERIFICATION_GUIDE.md](VERIFICATION_GUIDE.md) for the complete verification procedure.

## Scope and ownership

`scb-next` began as an isolated copy of `scb/web` and `scb/services`. The legacy tree is intentionally unchanged and remains the rollback baseline; it is not a runtime dependency of `scb-next`.

| Concern                              | Legacy source                                                                 | Current owner                              | Migration rule                                                                             |
| ------------------------------------ | ----------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Portal, login, navigation, workspace | `scb/web/mfe-base-origin` plus root-config composition                        | `scb-next/web/mfe-base-origin`             | Preserve portal behavior; compose Ratan directly through Module Federation.                |
| Ratan routes and shared components   | `scb/web/mfe-ratan-container-origin`                                          | `scb-next/web/mfe-ratan-container-origin`  | Preserve routes and component APIs; expose one federated application module.               |
| Cashflow applications and styling    | `scb/web/mfe-cashflow-blotter-origin`                                         | `scb-next/web/mfe-cashflow-blotter-origin` | Preserve business behavior, assets, theme contracts, and HTTP requests.                    |
| Browser composition                  | `scb/web/mfe-root-config-origin`, SystemJS import maps, Single-SPA lifecycles | Base host and the two Vite remotes         | Do not port root-config or import-map behavior into the active Cashflow path.              |
| Service routes and schemas           | `scb/services/single-ui-bff`                                                  | `scb-next/services/single-ui-bff`          | Keep request and response contracts stable until a separately specified service migration. |
| Production routing                   | Per-origin legacy packaging                                                   | `scb-next/devops/nginx`                    | Serve the host and remotes through one edge and forward `/api/` to `BFF_ORIGIN`.           |

Generated directories such as `dist/`, `coverage/`, `node_modules/`, `.vite/`, and test results are outputs, not migration sources. Never copy them from `scb/` or commit them as part of a source transition.

## Current runtime

```text
Browser
  -> Base host (:8001, mfe_base_host)
       -> mfe_ratan_container/application
          Ratan remote (:8009, mfe_ratan_container)
            -> mfe_cashflow_blotter/application
               Cashflow remote (:8015, mfe_cashflow_blotter)
  -> /api/*
       -> BFF origin
```

| Origin          | Development URL         | Federation contract                        | Production path      |
| --------------- | ----------------------- | ------------------------------------------ | -------------------- |
| Base host       | `http://127.0.0.1:8001` | Consumes `mfe_ratan_container/application` | `/`                  |
| Ratan remote    | `http://127.0.0.1:8009` | Exposes `./application`; consumes Cashflow | `/remotes/ratan/`    |
| Cashflow remote | `http://127.0.0.1:8015` | Exposes `./application`                    | `/remotes/cashflow/` |

The base origin owns login, navigation, workspace state, and the top-level theme. Ratan owns Cashflow routing and supplies its provider/router context. Cashflow owns the business screens. `react` and `react-dom` are shared singletons across all three origins; `react-router-dom` is also shared by Ratan and Cashflow because Cashflow consumes Ratan's routing context.

`mfe-root-config-origin` is retained only as migration history. It must not be started, packaged, or added back to the active three-origin boot path.

## Legacy-to-current replacements

| Legacy mechanism                              | Current mechanism                                               | Source of truth                                     |
| --------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------- |
| Webpack and `webpack-config-single-spa-*`     | Vite                                                            | Each active origin's `vite.config.ts`               |
| Single-SPA bootstrap/mount lifecycle          | React `createRoot` host and federated React application exports | Each active origin's `src/root.tsx`                 |
| `System.import("@fm/ratan_container")`        | `import("mfe_ratan_container/application")`                     | Base container loader                               |
| `System.import("@fm/ratan_cashflow_blotter")` | `import("mfe_cashflow_blotter/application")`                    | `Root/import/CashFlowCN.tsx`                        |
| Import-map remote addresses                   | Vite build environment variables                                | `VITE_RATAN_REMOTE_URL`, `VITE_CASHFLOW_REMOTE_URL` |
| Runtime imports from `@fm/base`               | Local ESM compatibility façade                                  | Each consumer's `src/compat/base.*` alias           |
| Cashflow imports from `@fm/ratan_container`   | Local Cashflow compatibility façade                             | `src/compat/ratan-container.ts`                     |
| Jest execution                                | Vitest with legacy-test setup                                   | Each origin's `vitest.config.ts`                    |
| Per-origin public URLs                        | Same-origin Nginx paths                                         | `devops/nginx/default.conf.template`                |

Only the supported Cashflow path has been converted from `System.import` to the nested Cashflow remote. Copied loaders for unrelated Ratan applications may still contain `System.import`; they are reference code outside the active migration scope. Do not expose those applications in `scb-next` until each one has its own remote contract, tests, deployment path, and cutover plan.

## Compatibility boundaries

Compatibility façades are deliberate anti-corruption layers between copied business code and the new runtime. They are temporary only when a replacement contract and consumer migration are both complete.

- `mfe-ratan-container-origin/src/compat/base.tsx` supplies the base capabilities Ratan still imports.
- `mfe-cashflow-blotter-origin/src/compat/base.tsx` supplies portal state, components, dialogs, and the canonical portal MUI theme to Cashflow.
- `mfe-cashflow-blotter-origin/src/compat/ratan-container.ts` and related utility façades supply the Ratan APIs Cashflow consumes without a compile-time SystemJS dependency.
- The Cashflow grid skin is bundled locally. A CDN or runtime stylesheet is not an acceptable replacement.
- The Ratan CSS namespace must remain `MicroWebUI_ratan_container`; Cashflow selectors depend on that exact value.
- Theme propagation must preserve the host `<html>` theme class, Poppins typography, compact MUI component defaults, Ant Design tokens, and dark grid styles.

When a legacy change imports a new symbol from `@fm/base` or `@fm/ratan_container`, add the smallest typed capability to the relevant façade and test its observable contract. Do not copy an entire legacy package into the façade or recreate business logic there.

## Porting a legacy change

Use this sequence for every change that exists in `scb/` and must move to `scb-next/`.

1. Identify the owning legacy workspace and the user-visible behavior being moved. Record the source commit or diff used for the port.
2. Confirm the target is inside the active Base, Ratan, Cashflow, or BFF scope. Treat other SystemJS applications as separate migrations.
3. Add or update the behavioral specification and a regression test in `scb-next` before changing implementation.
4. Copy only the relevant source, tests, styles, and assets. Exclude build configuration, generated files, dependency directories, and legacy composition glue.
5. Reconcile imports:
   - keep local business imports local;
   - route Base/Ratan dependencies through existing compatibility aliases;
   - use a declared Module Federation module for a runtime remote;
   - never add a new `System.import`, import map, Single-SPA lifecycle, or Webpack dependency.
6. Preserve external contracts: component props, routes, permissions, HTTP paths and payloads, GraphQL schemas, theme behavior, CSS namespaces, and user-visible error states.
7. Run the focused unit test first, then the owning workspace suite, the architecture test, the production build, and the relevant Playwright journey.
8. Compare the result against the legacy screen at desktop and responsive widths. Verify behavior as well as appearance.
9. Commit the port independently. Do not mix it with dependency major upgrades, broad refactors, or unrelated legacy synchronization.

If both trees remain active during a transition window, apply urgent business fixes to the owning legacy source and port the same behavioral change to `scb-next` as a separate reviewed commit. Never synchronize whole directories: the build, lifecycle, compatibility, test, and deployment files intentionally differ.

## Configuration mapping

| Variable                   | Phase            | Purpose                                                                               |
| -------------------------- | ---------------- | ------------------------------------------------------------------------------------- |
| `VITE_RATAN_REMOTE_URL`    | Base build/dev   | Full URL of Ratan's `remoteEntry.js`; defaults to port `8009`.                        |
| `VITE_CASHFLOW_REMOTE_URL` | Ratan build/dev  | Full URL of Cashflow's `remoteEntry.js`; defaults to port `8015`.                     |
| `VITE_PUBLIC_BASE`         | Remote build     | Public asset base; production uses `/remotes/ratan/` or `/remotes/cashflow/`.         |
| `SCB_NEXT_EDGE_ORIGIN`     | Production build | Public edge origin embedded in both remote URLs; defaults to `http://127.0.0.1:9081`. |
| `BFF_ORIGIN`               | Edge runtime     | Upstream for `/api/`; changing it does not require rebuilding frontend artifacts.     |
| `IMAGE_TAG`                | Container build  | Optional production-edge image tag.                                                   |

Remote URLs and public bases are build-time contracts. `BFF_ORIGIN` is a runtime routing contract. Promote the exact same frontend artifacts between environments when the public edge origin is stable; switch backend environments through edge configuration.

## Development transition

Prerequisites are Node.js `20.19+` or `22.12+`, npm, and access to the private corporate packages when performing a clean install.

```bash
cd scb-next
npm install
npm run dev
```

Development starts Base on `8001`, Ratan on `8009`, and Cashflow on `8015`. Ports are strict: a conflict fails startup instead of silently changing a federation URL.

The Base development server provides deterministic login, field metadata, view/filter, and Cashflow fixtures. Open `http://127.0.0.1:8001/?show_normal_login=Y&survey=no` and use the documented acceptance account in [VERIFICATION_GUIDE.md](VERIFICATION_GUIDE.md). This proves frontend composition without requiring the private BFF; it does not certify real backend behavior.

Minimum checks while the development servers are running:

```bash
curl -f http://127.0.0.1:8001/
curl -f http://127.0.0.1:8009/remoteEntry.js
curl -f http://127.0.0.1:8015/remoteEntry.js
npm test -- --run tests/architecture.test.ts
npm run test:e2e
```

## Production build and deployment

Build from the leaf remote toward the host so every consumer is compiled with the final downstream URL:

```bash
cd scb-next
SCB_NEXT_EDGE_ORIGIN=https://scb-next.example.internal npm run build:production
```

The build order is Cashflow, Ratan, then Base. Production Nginx serves both `remoteEntry.js` files with `no-store`, immutable caching for hashed assets, the Base SPA fallback at `/`, and `/api/` forwarding to `BFF_ORIGIN`.

For local production-style acceptance:

```bash
npm run serve:production
docker-compose -f devops/docker-compose.production.yml ps
```

Do not promote a release by rebuilding one remote in isolation. The host, Ratan remote, Cashflow remote, edge configuration, and recorded commit SHA form one release unit even though the applications are federated at runtime.

## Cutover checklist

Before routing users to `scb-next`:

- Freeze or record the legacy source revision used for the candidate.
- Confirm the original `scb/` deployment remains available and its routing configuration is known.
- Install from the approved corporate registry and retain the lockfile used to build.
- Pass architecture tests, focused and workspace unit suites, all three Vite production builds, and the production Playwright journey.
- Verify both federation manifests and all referenced chunks return HTTP 200 from their production paths.
- Verify `remoteEntry.js` uses `no-store` while hashed assets use immutable caching.
- Configure `BFF_ORIGIN` for the real service and complete the backend-connected checks; mock fixtures alone are not production certification.
- Compare all eight Cashflow screens at desktop and `1024x768`, including login, navigation, permissions, dialogs, MUI/Ant Design styling, grid styling, and tab removal.
- Capture health, console, failed-request, screenshot, test, build, and commit-SHA evidence.
- Route a controlled cohort first and monitor authentication, remote-load failures, API errors, and browser errors before full traffic.

The authoritative detailed checklist and evidence requirements are in [VERIFICATION_GUIDE.md](VERIFICATION_GUIDE.md). Record the release result in a copy of [PRODUCTION_ACCEPTANCE.md](PRODUCTION_ACCEPTANCE.md).

## Rollback

Rollback is a routing operation, not a source rewrite:

1. Stop increasing traffic to `scb-next`.
2. Route users back to the legacy root-config/import-map deployment at the recorded legacy revision.
3. Keep the failed `scb-next` artifacts, logs, browser traces, and edge configuration for diagnosis.
4. Stop the `scb-next` composition only after traffic has drained.
5. Reproduce and fix the issue in `scb-next`; do not patch generated `dist/` output or alter the preserved `scb/` baseline as part of rollback.

Rollback does not revert data written through the BFF. Any change that modifies data or service schemas requires its own backward-compatible data and service rollback plan before cutover.

## Known constraints

- Clean installs require access to private `@scdevkit/webkit` packages.
- The real BFF build requires private SCB Maven starters and corporate repository credentials.
- Large Vite chunks, strict TypeScript debt, and coverage-harness debt are tracked separately from the federation cutover.
- Major React, MUI, Ant Design, AG Grid, GraphQL, and Spring upgrades are separate migrations and must not be folded into a routine legacy-source port.
- Unrelated Ratan applications that still use `System.import` are not supported by the active three-origin release until migrated explicitly.

A transition is complete only when the current source owns the behavior, no active runtime dependency reaches into `scb/`, the verification gates pass, production evidence is retained, and the legacy route remains recoverable for the agreed rollback window.

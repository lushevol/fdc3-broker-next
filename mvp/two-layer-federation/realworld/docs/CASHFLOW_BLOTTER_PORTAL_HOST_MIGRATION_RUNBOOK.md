# Cashflow Blotter to Portal Host migration runbook

## Purpose

This runbook records the reproducible steps for migrating
`apps/mfe-cashflow-blotter` from the legacy Single-SPA/SystemJS runtime to the
two-layer Portal Host architecture.

The working reference implementation is:

- application: `realworld/apps/mfe-cashflow-blotter-mvp`
- host: `realworld/apps/portal-host`
- platform contracts: `realworld/packages/platform-contracts`
- platform client: `realworld/packages/platform-sdk`
- UI foundation: `realworld/packages/ratan-design`
- grid adapter: `realworld/packages/ratan-data-grid`

The MVP proves direct host composition, package-based Ratan reuse, appearance
propagation, telemetry, notifications, filtering, AG Grid rendering, standalone
execution, and removal of the Ratan runtime dependency. It does not claim that
all legacy Cashflow workflows or production services have been migrated.

## Architecture change

### Legacy runtime

```text
root-config / SystemJS import map
└── @fm/base
    └── @fm/ratan_cashflow_blotter
        ├── @fm/ratan_container
        ├── System.import("@fm/ratan_trades")
        └── System.import("@fm/ratan_cashflow")
```

The legacy application is compiled as `System.register`, receives React and
shell code through externals, and uses bridge modules under `src/Root/import`
to reach the base shell and Ratan container.

### Target runtime

```text
portal-host
└── mfe-cashflow-blotter
    ├── @fm/platform-contracts   build-time package
    ├── @fm/platform-sdk         build-time package
    ├── @fm/ratan-design         build-time package
    └── @fm/ratan-data-grid      build-time package
```

There are exactly two runtime layers: host and independently deployed
application. Cashflow does not load a Ratan remote, another Cashflow remote,
Single-SPA, SystemJS, or an import map.

## Step 1: inventory the legacy boundaries

Audit the legacy application before moving code:

```bash
rg -n "@fm/base|@fm/ratan_container|System\\.import|single-spa" \
  apps/mfe-cashflow-blotter/src \
  apps/mfe-cashflow-blotter/rsbuild.config.ts
```

The current dependency classes are:

| Legacy dependency                                  | Representative source                                                         | Target ownership                                                                 |
| -------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Shell UI, router, service, hooks, analytics, theme | `src/Root/import/index.ts` → `@fm/base`                                       | Platform capability, application code, or versioned UI package                   |
| Ratan components and grid                          | `src/Root/import/ratancomponents/index.ts`                                    | `@fm/ratan-design` and `@fm/ratan-data-grid`                                     |
| Identity and permissions                           | `src/Root/import/ratanutils/index.ts`                                         | Host-delivered identity capability plus application-owned policy                 |
| Ratan dialogs                                      | `src/Root/import/ratandialog/index.ts`                                        | Versioned design components or application-owned dialogs                         |
| Analysis package                                   | `src/Root/import/packages/Analysis/index.ts`                                  | Versioned domain package or Cashflow-owned code                                  |
| SystemJS domain loading                            | `System.import("@fm/ratan_trades")` and `System.import("@fm/ratan_cashflow")` | Direct package dependency, host navigation, or separately registered application |
| SystemJS public path                               | `src/system-entry.ts`                                                         | Module Federation manifest and asset prefix                                      |
| Runtime externals                                  | legacy `rsbuild.config.ts`                                                    | Remove; keep only the approved federation share policy                           |

Do not copy `src/Root/import` into the new application. Each bridge import must
be replaced deliberately.

## Step 2: choose and characterize a migration cohort

Move one bounded business journey at a time. Before implementation:

1. Record inputs, outputs, routes, permissions, API calls, error states, loading
   states, empty states, keyboard behavior, formatting, and audit events.
2. Write behavior tests against those requirements.
3. Keep the legacy route authoritative until the cohort exit criteria pass.
4. Avoid a whole-application component rewrite in the first cohort.

The first production cohort selected in this repository is Authorization
Limits because it proves list/detail navigation and the legacy grid dependency
with a limited domain model. The separate Blotter MVP uses four deterministic
records to validate the host/application boundary itself.

## Step 3: create an isolated application workspace

Create a new workspace under:

```text
mvp/two-layer-federation/realworld/apps/mfe-cashflow-blotter-mvp
```

Required files:

```text
package.json
module-federation.config.ts
rsbuild.config.ts
tsconfig.json
babel.config.json
jest.config.ts
README.md
src/application.tsx
src/application.test.tsx
src/index.tsx
src/standalone.ts
src/styles.css
src/test-setup.ts
```

The workspace is already included by the root
`mvp/two-layer-federation/realworld/apps/*` workspace pattern.

## Step 4: replace runtime dependencies with production packages

The migrated application depends on:

```json
{
  "@fm/platform-contracts": "^1.1.0",
  "@fm/platform-sdk": "^1.1.0",
  "@fm/ratan-data-grid": "1.0.0",
  "@fm/ratan-design": "^1.1.0",
  "ag-grid-community": "32.3.0",
  "ag-grid-react": "32.3.0",
  "react": "^19.2.3",
  "react-dom": "^19.2.3"
}
```

Do not add:

- `@fm/base`
- `@fm/ratan_container`
- `single-spa`
- `single-spa-react`
- SystemJS
- import-map tooling
- `ag-grid-enterprise` without a separate license and bundle decision

Run `npm install` from the repository root after adding the workspace so the
root lockfile records the new workspace and its React-compatible dependency
tree.

## Step 5: implement the application contract

Export an application manifest from `src/application.tsx`:

```ts
export const manifest: ApplicationManifest = {
  id: 'cashflow-blotter',
  displayName: 'Cashflow Blotter MVP',
  contractVersion: APPLICATION_CONTRACT_VERSION,
  appearanceContractVersion: APPEARANCE_CONTRACT_VERSION,
  identityContractVersion: IDENTITY_CONTRACT_VERSION,
  designSystemVersion: '1.1.0',
};
```

The values must agree with the Portal Host registry entry. Runtime protocol
versions are independent from the npm package version.

The default federated module must expose:

```ts
export default { manifest, Application };
```

For an application that owns a React major different from the host, expose
imperative `mount` and `unmount` functions and configure `shared: {}`. Never
pass React elements or context across a React-major boundary.

## Step 6: consume host capabilities through the platform client

The application receives `ApplicationProps`:

```ts
export function Application({ instanceId, capabilities }: ApplicationProps) {
  const client = useMemo(() => createPlatformClient(capabilities), [capabilities]);
}
```

Use the client for:

| Concern             | Call                                     |
| ------------------- | ---------------------------------------- |
| Navigation          | `client.navigate(path)`                  |
| Host notification   | `client.notify(message)`                 |
| Telemetry           | `client.track(event, data)`              |
| Appearance snapshot | `client.getAppearance()`                 |
| Appearance updates  | `client.subscribeToAppearance(listener)` |
| Identity snapshot   | `client.getIdentity()`                   |
| Identity updates    | `client.subscribeToIdentity(listener)`   |
| Workspace close     | capability-owned workspace method        |

Do not import a host component, store, token, service singleton, router object,
or authentication helper.

## Step 7: install an application-scoped design provider

Every application owns its local provider:

```tsx
<DesignSystemProvider
  appearance={{
    scheme: appearance.scheme,
    density: appearance.density,
    direction: appearance.direction,
  }}
  scope="application"
>
  {/* Cashflow UI */}
</DesignSystemProvider>
```

Import the package stylesheet:

```ts
import '@fm/ratan-design/styles.css';
```

Application CSS must remain scoped to an application class. Do not style
`html`, `body`, `:root`, or `*`.

## Step 8: migrate the grid through the bounded adapter

Use `RatanDataGrid` instead of importing the legacy Ratan grid or exporting raw
AG Grid APIs as the application contract:

```tsx
<RatanDataGrid
  ariaLabel="Cashflow blotter"
  rows={rows}
  columns={cashflowColumns}
  getRowId={(row) => row.id}
  selectedRowId={selectedId}
  onSelectionChange={select}
  onActivate={select}
  pageSize={5}
/>
```

Import its scoped styles:

```ts
import '@fm/ratan-data-grid/styles.css';
```

Keep `ag-grid-community` and `ag-grid-react` at exactly compatible versions in
the consuming application.

### AG Grid compatibility correction discovered during live rendering

AG Grid package mode must not register module-mode components. The adapter must
not call:

```ts
ModuleRegistry.registerModules([ClientSideRowModelModule]);
```

Doing so produced this browser error:

```text
You are mixing modules and packages; use only one mechanism.
```

The selection configuration also uses the current v32 object API:

```tsx
rowSelection={{ mode: 'singleRow' }}
```

The deprecated `rowSelection="single"` form logged a browser warning.

## Step 9: move domain state into the application

Cashflow owns:

- record types and validation;
- filter and sort rules;
- selected-record state;
- application routes and detail composition;
- domain permissions and maker/checker policy;
- API repositories and service adapters;
- domain telemetry event names.

The Portal Host must not know Cashflow record types, endpoints, permissions, or
workflow state.

The MVP implements:

- typed `CashflowRecord` records;
- case-insensitive filtering;
- formatted amounts;
- status-to-design-tone mapping;
- row selection and activation;
- telemetry on selection;
- host notification on an explicit user action.

## Step 10: configure Module Federation

The application remote configuration is:

```ts
export default createModuleFederationConfig({
  name: 'mfe_cashflow_blotter',
  filename: 'remoteEntry.js',
  exposes: { './application': './src/application.tsx' },
  dts: false,
  shared: {
    react: {
      singleton: true,
      eager: true,
      requiredVersion: pkg.dependencies.react,
    },
    'react-dom': {
      singleton: true,
      eager: true,
      requiredVersion: pkg.dependencies['react-dom'],
    },
  },
});
```

The Rsbuild development server uses:

- host `127.0.0.1`;
- port `9206`;
- `Access-Control-Allow-Origin: *`;
- `Cache-Control: no-store`;
- asset prefix `http://127.0.0.1:9206/`.

The production deployment must replace the local manifest URL with the
immutable release location managed by the application registry.

## Step 11: keep a standalone bootstrap

`src/index.tsx` renders the application without the Portal Host using
`standaloneCapabilities` from `src/standalone.ts`.

Standalone execution proves that the application does not rely on:

- Portal Host React context;
- host DOM structure;
- host source aliases;
- host global variables;
- another remote being loaded first.

Development URL:

```text
http://127.0.0.1:9206/
```

## Step 12: register the application with the Portal Host

Add the following entry to
`realworld/apps/portal-host/public/registry.json`:

```json
{
  "id": "cashflow-blotter",
  "displayName": "Cashflow Blotter MVP",
  "remoteName": "mfe_cashflow_blotter",
  "manifestUrl": "http://127.0.0.1:9206/mf-manifest.json",
  "exposedModule": "./application",
  "basePath": "/cashflow-blotter",
  "contractVersion": "1.0.0",
  "appearanceContractVersion": "1.0.0",
  "identityContractVersion": "1.0.0",
  "capabilities": [
    "navigation",
    "notifications",
    "telemetry",
    "workspace",
    "appearance",
    "identity"
  ]
}
```

The registry is the only host change required to discover the application.
Do not add a static source import from the host to Cashflow.

## Step 13: add root lifecycle commands

Add the workspace to:

- `realworld:dev`
- `realworld:build`
- `realworld:test`
- `realworld:lint`

The complete runtime starts with:

```bash
npm run realworld:dev
```

If an unrelated package build blocks the aggregate command, start the already
built migration surfaces directly:

```bash
npx concurrently --names ratan-mvp,blotter-mvp \
  "npm --workspace @fm/mfe-ratan-container-mvp run dev" \
  "npm --workspace @fm/mfe-cashflow-blotter-mvp run dev"
```

The Portal Host must still be available on `http://127.0.0.1:9200`.

## Step 14: enforce two-layer boundaries

Add the application root to
`realworld/scripts/verify-production-two-layer.mjs`.

The verifier rejects:

- POC workspaces;
- Single-SPA and SystemJS;
- import maps;
- `@fm/base`;
- Ratan container references;
- Ant Design in the accepted production slice;
- legacy `src/Root` bridges;
- AG Grid Enterprise;
- runtime sharing of design, data-grid, MUI, Emotion, or AG Grid packages;
- document-global application CSS.

Run:

```bash
npm run realworld:verify:boundaries
```

Expected runtime graph:

```json
{
  "verified": true,
  "runtimeLayers": ["portal-host", "federated-application"]
}
```

## Step 15: implement tests before migration code

The Cashflow MVP component tests cover:

1. application manifest identity;
2. unfiltered and filtered record behavior;
3. no-match behavior;
4. amount formatting;
5. every status tone;
6. package-owned grid composition;
7. stable row identity;
8. selection telemetry;
9. host notifications.

Run:

```bash
npm --workspace @fm/mfe-cashflow-blotter-mvp test -- --runInBand
```

The current MVP application source has 100% statement, branch, function, and
line coverage.

The grid package separately verifies loading, error, retry, empty, pagination,
selection, pointer activation, keyboard activation, row identity, density
styles, package boundaries, and absence of module-mode registration:

```bash
npm --workspace @fm/ratan-data-grid test
```

## Step 16: build and inspect the federation artifacts

Run:

```bash
npm --workspace @fm/mfe-cashflow-blotter-mvp run lint
npm --workspace @fm/mfe-cashflow-blotter-mvp run build
```

Confirm the build produces:

```text
dist/index.html
dist/mf-manifest.json
dist/mf-stats.json
dist/remoteEntry.js
```

Inspect `mf-manifest.json` and confirm that `./application` is exposed under
the `mfe_cashflow_blotter` remote.

## Step 17: verify through the Portal Host

Automated browser acceptance is in:

```text
realworld/tests/e2e/legacy-migration-mvps.spec.ts
```

Run:

```bash
npx playwright test \
  --config=mvp/two-layer-federation/realworld/playwright.config.ts \
  mvp/two-layer-federation/realworld/tests/e2e/legacy-migration-mvps.spec.ts
```

Manual verification:

1. Open `http://127.0.0.1:9200`.
2. Sign in with the development account `test` / `test`.
3. Select **New tile**.
4. Open **Cashflow Blotter MVP**.
5. Confirm the route is `/cashflow-blotter`.
6. Confirm the application appears in a workspace tab.
7. Confirm the grid shows `CF-24001` through `CF-24004`.
8. Filter for `Atlas` and confirm only `CF-24001` remains.
9. Select a row and confirm the selection footer appears.
10. Trigger the notification and confirm it is rendered by the host.
11. Change host appearance and confirm the application provider updates.
12. Open the browser console and confirm there are no new AG Grid, React,
    federation, or asset-loading errors.
13. Confirm network requests include
    `http://127.0.0.1:9206/mf-manifest.json`.
14. Confirm network requests do not include Single-SPA, SystemJS, an import
    map, or a Ratan container remote.

## Step 18: migrate production data and authorization safely

The UI proof is not production activation. For each production cohort:

1. Define a typed repository interface inside Cashflow.
2. Implement an HTTP or GraphQL adapter inside Cashflow.
3. Validate every response at the transport boundary.
4. Obtain identity from the platform capability.
5. Translate identity permissions into an application-owned policy.
6. Keep backend authorization authoritative.
7. Fail closed when identity is absent, anonymous, expired, or changes.
8. Preserve correlation IDs and emit structured telemetry.
9. Add loading, empty, recoverable error, timeout, and retry coverage.
10. Add contract tests against the approved backend environment.
11. Keep mutation features behind explicit activation until maker/checker,
    concurrency, audit, cancellation, and session-expiry behavior is accepted.

Do not move Cashflow endpoints, permission taxonomy, mutation services, or
record types into the Portal Host.

## Step 19: migrate the remaining legacy application by cohorts

Recommended order:

1. Authorization Limits read-only list and details.
2. Authorization Limits create/edit.
3. Authorization Limits delete/approve/reject transitions.
4. BIC Netting Static Table.
5. Splitting Static.
6. Utilization Static Table.
7. Group Management.
8. Dashboard.
9. Cashflow CN read-only search and details.
10. Cashflow CN mutations, splitting, netting, settlement updates, accounting,
    dynamic trade/cashflow panels, and FDC3 interactions.

For every cohort, replace legacy bridges rather than forwarding them:

| Legacy use                    | Migration action                                             |
| ----------------------------- | ------------------------------------------------------------ |
| `Container.Service`           | Cashflow-owned typed repository/transport                    |
| `Container.ReactRouterDom`    | Application-owned router or platform navigation              |
| `Container.Analytics`         | Platform telemetry capability                                |
| `Container.ThemeConfig`       | Ratan design provider and appearance capability              |
| `RatanutilsAuthenticator`     | Identity capability plus Cashflow policy                     |
| `RatancomponentsDataGrid`     | `@fm/ratan-data-grid`                                        |
| Legacy Ratan component export | Bounded `@fm/ratan-design` component or Cashflow component   |
| `System.import(...)`          | Package import, host navigation, or registered direct remote |

## Step 20: rollout and rollback

Before activating a migrated cohort:

1. Publish immutable application and package artifacts.
2. Record package, manifest, contract, and design-system versions.
3. Deploy the remote independently from the Portal Host.
4. Validate the manifest URL and asset URLs from the target environment.
5. Add the new release URL to a non-production registry.
6. Run unit, boundary, build, package, browser, accessibility, and backend
   contract gates.
7. Compare migrated behavior with the legacy route.
8. Enable the cohort for an approved user group.
9. Monitor load failures, API failures, interaction latency, and workflow
   outcomes.
10. Roll back by restoring the previous registry release URL or routing the
    cohort back to the legacy application.

Do not require a Portal Host rebuild to roll back an independently deployed
Cashflow release.

## Issues encountered while building the MVP

### React test-runtime mismatch

The monorepo root contains React 18 while some realworld workspaces use React 19. Jest/Vitest can otherwise render elements from one React copy with another
ReactDOM copy.

The MVP Jest configs map `react`, `react/*`, `react-dom`, and `react-dom/*` to
the workspace-local React 19 installation. The grid package Vitest config maps
both React and ReactDOM to one consistent test installation.

### AG Grid module/package mixing

Registering `ClientSideRowModelModule` while consuming the package distribution
caused a live browser error. The adapter now uses package mode only and verifies
the absence of `ModuleRegistry` and `ClientSideRowModelModule` in its boundary
test.

### Port contention

Rsbuild may silently choose a different port when a configured port is busy.
That breaks registry URLs even though the terminal reports a running server.
Use fixed ports and check the manifest URL before browser verification.

### Aggregate development build blocker

During this migration check, unrelated uncommitted `ActionMenu.tsx` declaration
errors blocked the `@fm/ratan-design` declaration build. The already-built
Portal Host and MVP remotes were started directly for runtime verification.
Resolve unrelated foundation-package declaration errors before relying on
`npm run realworld:dev` as the sole startup command.

## Completion checklist

A Cashflow cohort is Portal Host compatible only when all items are true:

- [ ] It exposes `./application` through Module Federation.
- [ ] Manifest and registry IDs and contract versions match.
- [ ] It runs standalone.
- [ ] It loads directly from the Portal Host.
- [ ] It imports no `@fm/base`.
- [ ] It imports or loads no Ratan container remote.
- [ ] It uses no Single-SPA, SystemJS, or import map.
- [ ] Host concerns use typed platform capabilities.
- [ ] Domain state and services remain application-owned.
- [ ] UI and grid reuse versioned packages.
- [ ] CSS is application scoped.
- [ ] React sharing or isolation matches the supported version strategy.
- [ ] Unit coverage exceeds the repository thresholds.
- [ ] Lint and TypeScript pass without warnings.
- [ ] Production build emits a valid federation manifest.
- [ ] Boundary verification passes.
- [ ] Portal-host browser acceptance passes.
- [ ] Browser console contains no new runtime warnings or errors.
- [ ] Production API, identity, authorization, audit, and observability gates
      pass for the cohort.
- [ ] Registry-driven rollback is tested.

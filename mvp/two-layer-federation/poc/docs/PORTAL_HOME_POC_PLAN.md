# Portal Home POC Plan

## 1. Authority and purpose

This is the single implementation plan for the active Portal POC. It supersedes the previous POC 1 specification, test plan, decision register, design-system POC, and home-principles draft.

The POC proves a simple Portal home page and workspace. It does not aim to recreate all of `@fm/base` or claim production readiness.

**Primary question:** can a Portal Host use local entitlement control to discover, load, isolate, and operate many independently registered Tile types directly—without `@fm/base` or a shared runtime container?

## 2. Scope

### Included

- Start on the Portal home page with a deterministic local entitlement set; no login flow.
- A static local registry with multiple entitled Tile definitions, plus unentitled and incompatible fixtures.
- A Ratan Design application menu that groups and lists the registry-backed Tile definitions; a user selects any allowed Tile to open it in the workspace.
- Entitlement filtering in the launcher and a second mount-time check.
- A React 19 Host, built with Vite and React Compiler support, using Zustand for Host state.
- Module Federation as the default Tile loader and one isolated SystemJS legacy-loader adapter.
- A `tile-workspace` Web Component with one Shadow Root and style target per Tile instance; iframes are prohibited.
- React 18 or React 19 Tiles, structurally based on `apps/tile`. Cashflow is only the first representative Tile used for proof.
- Duplicate Tile instances, tabs, activation, close, retained local state, failure containment, and telemetry.
- Ratan Design System components for every Host and Tile UI, with a local automatic telemetry collector.
- One minimal FDC3 context-or-intent action through a Host-owned browser/OpenFin adapter.

### Excluded

- Login, SSO, tokens, logout, renewal, and session persistence.
- Registry administration, backend services, Nginx, production delivery, or migration of a legacy Tile.
- Chatbot, notifications, surveys, user profiles, and the legacy admin module.
- Workspace restore, drag/drop, resize, panes, free-form layouts, or cross-device persistence.
- A general capability gateway, broad FDC3 catalogue/resolver, OpenFin window orchestration, or cross-tile workflow engine.
- New packages unless code is proven to be shared by the Host and at least two independent Tiles.

## 3. Architecture principles

```text
Portal Host (React 19 + Vite + Zustand)
  -> local registry, entitlement control, and Tile menu
  -> loader adapter (Module Federation | legacy SystemJS)
  -> <tile-workspace> Web Component / Shadow Root
  -> Tile root + Tile-owned style target (React 18 or 19)
```

1. The runtime has two application layers only: **Host -> Tile**.
2. The registry—not Host source code—defines the available Tile menu. Adding a compatible Tile registry record must not require a new launcher component or a Host rebuild.
3. `@fm/base`, `mfe-ratan-container`, Single-SPA, and import maps are not part of new Host or Module Federation Tile code.
4. SystemJS is permitted only inside a named legacy loader adapter. The adapter normalizes a legacy module to the Tile contract and exposes no SystemJS APIs elsewhere.
5. The Host owns registry access, entitlement checks, Tile lifecycle, active-instance selection, global overlays, FDC3/OpenFin adaptation, and lifecycle telemetry.
6. A Tile owns its local UI state, domain behavior, React root, and styles. It must not access another Tile’s DOM, store, or module.
7. Every styling solution is normalized to the Shadow Root: Module Federation manifest CSS assets are adopted as Shadow-Root stylesheet links, CSS-in-JS receives the Shadow Root as its insertion container, inline styles remain local, and Tile portals must use a portal node inside the same root. No Tile stylesheet or styling-engine tag may remain in `document.head`.
8. Shadow DOM provides strong DOM and CSS encapsulation, not a JavaScript security realm. POC Tiles are trusted modules and must not mutate shared browser globals. Hard isolation of untrusted JavaScript is excluded because the Portal explicitly prohibits iframes.
9. Every lifecycle operation uses a unique `instanceId`, not only a `tileId`.

## 4. Technology decisions

| Concern | POC decision |
| --- | --- |
| Host | React 19, TypeScript, Vite, React Compiler-enabled React plugin, Zustand |
| Tiles | React 18 or 19, TypeScript, derived from `apps/tile` structure |
| Default loader | Module Federation runtime loader |
| Legacy loader | One Host-owned SystemJS adapter only |
| Runtime isolation | `tile-workspace` custom element and Shadow Root per instance; iframe-free |
| UI | Ratan Design System only; no direct MUI, Ant, or alternative UI kit usage in POC UI |
| Telemetry | Ratan Design telemetry adapter plus Host lifecycle collector; local/no-op only |
| Interop | Host-owned FDC3 capability using browser/postMessage or OpenFin adapter |
| OpenFin | Detected and adapted at Host boundary; never imported by Tiles |

React and ReactDOM sharing must be declared explicitly per loader path. Design-system dependencies remain normal package dependencies, never an MFE runtime layer or shared remote.

## 5. Minimal contracts

Keep these types in the Host app until a second independent Tile proves they need a shared home.

```ts
type TileRegistryEntry = {
  tileId: string;
  displayName: string;
  category: string;
  loader: 'module-federation' | 'systemjs';
  entry: string;
  exposedModule?: string;
  requiredEntitlements: string[];
  contractVersion: '0.1';
};

type TileMount = {
  tileId: string;
  instanceId: string;
  root: ShadowRoot;
  capabilities: { close(): void; telemetry: TileTelemetry; fdc3: TileFdc3 };
};

type TileModule = {
  manifest: { tileId: string; contractVersion: '0.1' };
  styleUrls?: string[];
  mount(input: TileMount): void | Promise<void>;
  unmount?(instanceId: string): void | Promise<void>;
};
```

The Host validates the registry record, entitlement, loader result, manifest identity, and contract version. The loader derives extracted CSS assets from the Module Federation manifest and supplies them as `styleUrls`; the workspace adopts those links into the Shadow Root and removes any runtime-injected duplicates from the Host head. Styling engines receive the same Shadow Root as their insertion target. The Host contains errors in the affected workspace instance.

## 6. Home-page behavior

1. Load and validate the local registry.
2. Build the application menu from registry categories and Tile definitions, then filter it using the local entitlement set.
3. When a user selects a menu Tile, re-check entitlement, allocate an instance ID scoped to that Tile definition (for example, `cashflow-1`), then create a workspace tab.
4. Create a `tile-workspace` element, load and validate the Tile module, adopt its styles into the element’s Shadow Root, then mount its application into that root.
5. Keep ready inactive Tiles mounted but inaccessible and hidden. Activating a tab must not remount it.
6. Close by `instanceId`, unmount the Tile, release its adopted styles, remove only that custom element, and select the most recently active remaining instance.
7. A denied, failed, or incompatible Tile remains a closable bounded error tab; healthy instances are unaffected.

Zustand stores only Portal state: registry, entitlement set, instance list, active instance, loading/error state, and Host preferences. It never stores Tile business state.

## 7. UI, design, and telemetry

- Render the launcher, tabs, controls, errors, and Tile UI exclusively with approved Ratan Design primitives and semantic tokens.
- Configure Ratan Design with a Host-provided collector so standard component events are automatic and non-blocking.
- Emit Host lifecycle events for registry load, entitlement denial, open request, mount success/failure, activate, close, FDC3 request, and FDC3 result.
- Every event contains timestamp, action, outcome, correlation ID, `tileId`, and `instanceId` when applicable. Never collect credentials, field values, or business payloads.
- Test and standalone modes use a deterministic collecting or no-op adapter. No telemetry backend is introduced.

## 8. FDC3 and OpenFin boundary

- The Host provides a typed FDC3 capability at Tile mount time.
- A Tile can raise one declared Cashflow context or intent. The Host records caller instance, correlation, target/result, and outcome.
- Browser execution uses the repository browser/postMessage adapter. OpenFin execution uses the Host’s OpenFin adapter.
- Tiles have the same FDC3 contract in either runtime and do not import `@openfin/*` or broker internals.
- Resolver UX, multiple-target policy, full intent catalogues, and OpenFin window/workspace control are deferred.

## 9. Implementation plan

| Step | Deliverable | Done when |
| --- | --- | --- |
| 1 | Vite React 19 Host skeleton | Host renders the Ratan Design home shell and React Compiler build succeeds. |
| 2 | Registry, entitlement store, and Tile menu | Multiple allowed Tiles appear in their registry categories; direct open of an unentitled entry is denied. |
| 3 | Zustand workspace lifecycle | Duplicate instances receive unique IDs; activate, close, and retained state tests pass. |
| 4 | `tile-workspace` custom element | Each instance gets its own Shadow Root, style target, and cleanup on close. |
| 5 | Module Federation Tile loader | Cashflow markup, extracted CSS, tokens, and CSS-in-JS mount inside one Shadow Root; failure is contained. |
| 6 | SystemJS legacy adapter | A fixture legacy Tile mounts through the same contract; no other Host code references SystemJS. |
| 7 | Ratan telemetry | Automatic control and lifecycle events are safely collected and attributed. |
| 8 | FDC3/OpenFin adapters | One Tile interop action works against browser and OpenFin test adapters. |
| 9 | Browser acceptance and boundaries | Complete journey, architecture scans, build, lint, types, and coverage gates pass. |

Follow TDD for each step: write the acceptance criterion and failing focused test, implement the minimum behavior, then verify lint, type checks, and coverage before continuing.

## 10. Acceptance journey

1. Open the Portal home page with a local entitlement set that allows more than one Tile.
2. Select a Tile from the registry-backed menu and verify that unentitled fixtures are absent.
3. Open Cashflow twice and see `cashflow-1` and `cashflow-2`; optionally open another allowed Tile in the same workspace.
4. Change a filter in the first instance, switch instances, and verify the second is unchanged.
5. Trigger the single FDC3 action and verify instance-attributed telemetry.
6. Close one instance and verify the other remains mounted and usable.
7. Attempt an unentitled and incompatible Tile; verify no remote mounts and the Host remains usable.
8. Repeat the FDC3 assertion with the OpenFin adapter test double.

## 11. Verification

- Unit tests: registry schema, menu category/filter behavior, entitlement filter/check, Zustand transitions, IDs, manifest validation, loader selection, and telemetry attribution.
- Component tests: distinct Shadow Roots, extracted stylesheet adoption and cleanup, styling-engine insertion target, retained inactive instance state, Ratan Design telemetry wiring, and bounded error rendering.
- Browser test: the complete acceptance journey, computed Tile styles, style nodes inside the Tile root, and no Tile rules or style nodes in the Host document.
- Boundary test: reject `@fm/base`, `mfe-ratan-container`, Single-SPA, and import-map imports; allow SystemJS and OpenFin imports only in named Host adapters.
- Quality gate: Vite build, type check, lint with zero warnings, and repository coverage threshold.

## 12. Roadmap after this POC

1. Real SSO and dynamic entitlement refresh.
2. FDC3 resolver and supported OpenFin runtime/window behavior.
3. Static Host/Tile delivery through Nginx with a minimal tenant backend.
4. Structured notifications.
5. Design-system observability expansion and production event delivery.
6. Tile onboarding/scaffolding after the contract is proven.
7. Workspace layouts only after evidence that tabs are insufficient.
8. Cashflow migration and then measured legacy retirement.

For production release, registry promotion, artifact integrity, canary, rollback, and migration details, use [DEVOPS_MIGRATION_PLAN.md](./DEVOPS_MIGRATION_PLAN.md). The durable target architecture rules remain in [PORTAL_PLATFORM_POC_CHARTER.md](./PORTAL_PLATFORM_POC_CHARTER.md).

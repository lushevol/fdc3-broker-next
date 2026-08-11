# Realworld two-layer architecture

Status: current. Last reviewed 3 August 2026. See
[`CURRENT_STATE.md`](./CURRENT_STATE.md) for the verified application matrix.

## Runtime

The runtime graph is exactly:

```text
portal-host -> independently deployed applications
```

`portal-host` owns registry validation, application loading, global appearance preference, navigation, notifications, telemetry, workspace lifecycle, identity delivery, and application failure containment. Applications own domain routing, workflows, state, data acquisition, authorization-aware composition, and local design providers.

React and ReactDOM are the only Module Federation singleton shares. The WebKit
design system, Shoelace dependencies, the data-grid adapter, platform
contracts, and domain utilities are versioned build-time packages bundled into
deployables.

## UI composition

The active host and applications consume the origin `@scdevkit/webkit` workspace
from the repository root. React consumers create adapters through
`@scdevkit/webkit/react`; the adapters
wrap registered `sc-*` custom elements and do not implement parallel visual
components.

Custom-element registration is global and idempotent. Applications must not
install the scoped-custom-element-registry polyfill. Nested Shoelace elements
used by WebKit components are registered at the React wrapper boundary so that
buttons, dialogs, menus, tabs, badges, tooltips, and related controls upgrade
consistently across independently built remotes.

Dialogs that must escape a remote mount or tab-panel clipping boundary are
ported to `document.body` while retaining the WebKit `ScDialog` implementation.

## Package boundary

Realworld-specific platform and grid packages live under `realworld/packages`.
The SC WebKit implementation is owned once under the repository-root
`packages/sc-dev-web*` workspaces and is consumed directly by the MVP; the MVP
must not maintain a copied WebKit implementation.

`@scdevkit/webkit` is the active custom-element UI package. `@fm/ratan-design`
remains a legacy compatibility/reference workspace for the Cashflow Blotter
appearance provider and other explicitly tracked cohorts; WebKit must never
import it.

## Prohibited dependencies

Realworld code must not import or load:

- any `*-poc` workspace;
- legacy `root-config`, `base`, or `mfe-ratan-container` runtime code;
- Single-SPA, SystemJS, or import maps;
- a design-system or Ratan component remote.
- `@fm/ratan-design` from Portal Host, Cashflow, Identity/Profile, FDC3 Admin,
  or WebKit runtime source.
- scoped-custom-element-registry bootstrap imports in active applications.

The POC and realworld tracks may run simultaneously only through separate ports and manifests. They share no source aliases or runtime registry entries.

# Realworld current state

Last verified: 3 August 2026.

This document is the current source of truth for the Realworld two-layer
federation track. Migration plans and acceptance records elsewhere in this
directory retain their historical detail, but must be read against this status.

## Runtime topology

The runtime has two layers:

```text
portal-host -> independently deployed federated application
```

Portal Host owns authentication entry, the validated application registry,
workspace tabs, global appearance controls, identity delivery, capability
injection, navigation, notifications, and remote failure containment. Each
application owns its domain state, routes, workflows, data access, and local UI
composition.

React and ReactDOM are the only permitted federation singleton shares. Design
components, the grid adapter, platform contracts, and domain utilities are
bundled as versioned application dependencies; none is a runtime layer or
component remote.

## Applications

| Workspace                      | Port | Portal route        | Current role                                                      |
| ------------------------------ | ---: | ------------------- | ----------------------------------------------------------------- |
| `@fm/portal-host`              | 9200 | `/`                 | Login, registry, workspace, capabilities, and remote composition  |
| `@fm/mfe-cashflow`             | 9201 | `/cashflow`         | Cashflow list/detail and Authorization Limits verification cohort |
| `@fm/mfe-identity-profile`     | 9202 | `/identity-profile` | Host-delivered identity/profile verification                      |
| `@fm/mfe-fdc3-admin`           | 9204 | `/fdc3-admin`       | FDC3 declaration, intent, and context administration              |
| `@fm/mfe-ratan-container-mvp`  | 9205 | standalone only     | Legacy Ratan ownership inventory; not a shared runtime            |
| `@fm/mfe-cashflow-blotter-mvp` | 9206 | `/cashflow-blotter` | Original Cashflow CN migration slice                              |

## UI package status

Portal Host, Cashflow, Identity/Profile, FDC3 Admin, and Cashflow Blotter MVP
consume `@fm/ratan-design-webkit`. React applications use the package's existing
`@fm/ratan-design-webkit/react` wrapper; reusable implementations remain under
the WebKit `src/components` tree.

The WebKit package is native-custom-element based. Registration modules are
idempotent, nested Shoelace dependencies are registered by the React boundary,
and applications do not install or import a scoped-custom-element-registry
polyfill. The package has no dependency on `@fm/ratan-design` and contains no
root-level React component implementations, provider, dialog, divider, or
status-badge replacement.

`@fm/ratan-design` remains in the Realworld workspace only as a legacy
compatibility and reference package while remaining migration cohorts are
retired. It is not the UI source for the four active Portal Host applications.

## Verified UI behavior

The latest live Chrome audit covered:

- login and registry loading;
- Portal Host notification, avatar, theme, application picker, and workspace
  tab controls;
- Cashflow list, selection, detail, and Authorization Limits pages;
- Identity/Profile avatar and accordion interactions;
- FDC3 declaration, intent, and context pages;
- create, edit, delete, and dismissible dialog overlays;
- generated close, notification, edit, trash, and person icons;
- active workspace-tab removal.

The audit confirmed visible avatar initials, non-zero icon hit targets, working
dialog overlays, and direct loading of all four active remotes.

## Latest focused verification

| Workspace                  |     Tests | Build  | Lint                                     |
| -------------------------- | --------: | ------ | ---------------------------------------- |
| `@fm/ratan-design-webkit`  | 10 passed | passed | passed with four existing `any` warnings |
| `@fm/portal-host`          | 46 passed | passed | passed                                   |
| `@fm/mfe-cashflow`         | 84 passed | passed | passed                                   |
| `@fm/mfe-fdc3-admin`       |  6 passed | passed | passed                                   |
| `@fm/mfe-identity-profile` |  6 passed | passed | passed                                   |

The WebKit build still reports the pre-existing direct-`eval` warning in
`ScTable`; consumer builds also report the existing optional rich-text dynamic
import warning. These warnings are not introduced by the UI migration.

## Remaining program work

- Validate Cashflow Blotter integration fixtures and complete its remaining
  legacy compatibility extraction.
- Complete production authentication/session integration; the local login is a
  deterministic `test` / `test` verification adapter.
- Keep Authorization Limits mutation activation behind its explicit backend,
  entitlement, cohort, and rollback gates.
- Resolve the legacy `@fm/ratan-design` retirement plan only after all remaining
  consumers and reference obligations are accounted for.

No OpenSpec change is archived merely because the UI migration is locally
verified; archive decisions require explicit approval.

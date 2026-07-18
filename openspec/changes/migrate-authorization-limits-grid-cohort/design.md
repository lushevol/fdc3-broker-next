## Context

The legacy Authorization Limits grid combines a Ratan runtime wrapper, raw AG Grid props, Ant modal/message APIs, MUI styling, source-root aliases, and maker/checker mutations. The accepted production pilot needs a bounded first cohort. `@fm/ratan-design` deliberately forbids AG Grid, so data-intensive infrastructure requires its own package and release cadence.

## Goals / Non-Goals

**Goals:**

- Introduce a reusable, accessible, semantically themed AG Grid adapter without polluting the foundation package.
- Migrate the read-only Authorization Limits list/details behavior into the independent Cashflow application.
- Prove light/dark, compact/comfortable, standalone/federated, sorting, pagination, keyboard, and routing behavior.
- Define evidence that permits this bounded route to leave the legacy runtime later.

**Non-Goals:**

- Create/edit/delete/approve/reject workflows, production APIs, entitlements, or role policy.
- A universal wrapper for every AG Grid feature or re-export of `AgGridReact`/`GridApi`.
- AG Grid as a host capability, federation remote, or dependency of `@fm/ratan-design`.
- Removing or changing the legacy application in this change.

## Decisions

### Separate data-grid package

`@fm/ratan-data-grid` owns adapter behavior and semantic theme mapping. It peers on React, `ag-grid-community`, and `ag-grid-react`; consuming applications own compatible installed versions. This isolates AG Grid’s size and faster release cadence from foundational controls.

### Bounded application-facing API

Applications provide rows, stable `getRowId`, a small column model, pagination size, selected ID, and activation callbacks. Columns support field/header/width/flex/sortability plus value formatting or cell rendering. Raw `gridOptions`, `GridApi`, enterprise modules, and arbitrary theme configuration are not public v1 API.

### Community edition for the first cohort

The cohort uses AG Grid Community 32.3.x because sorting, client pagination, keyboard navigation, and row activation need no enterprise feature. License and bundle evidence are recorded. Enterprise modules remain an explicit future decision.

### Adapter owns infrastructure states

Loading, empty, and error states use deterministic accessible semantics outside the grid canvas. The application owns domain error messages and retry behavior.

### Read-only fixture behind a repository

Authorization Limits records are supplied by an application-owned asynchronous repository with deterministic fixture behavior for the cohort. This creates a replaceable API boundary without copying legacy service/runtime imports.

## Risks / Trade-offs

- [Adapter becomes a feature dumping ground] → Require explicit versioned API additions and prohibit raw escape hatches in v1.
- [AG Grid CSS leaks] → Scope semantic overrides below `.ratan-data-grid` and import only required community base/theme CSS.
- [Bundle size grows materially] → Record isolated delta and keep grid code in the remote application chunk.
- [Read-only parity is mistaken for full migration] → Label mutation/approval routes deferred in UI, docs, and exit criteria.
- [Legacy and new data diverge] → Production cutover remains blocked until the repository uses the approved service and parity fixtures.

## Migration Plan

1. Implement and package-test the adapter API/theme/state boundaries.
2. Add Authorization Limits repository, route, list, and details composition with behavior tests.
3. Extend conformance and browser matrices, record bundle/license evidence, and validate the legacy fallback remains untouched.
4. Use accepted evidence to plan the mutation/approval cohort and production service integration.

Rollback is registry/route selection back to the unchanged legacy application; this implementation does not remove legacy code.

## Open Questions

- Which production service/entitlement capability will replace the legacy dispatcher and environment utilities?
- Do later grids require enterprise features, and if so which license delivery mechanism is approved?
- Should column preference persistence become application-owned or a separate platform capability?


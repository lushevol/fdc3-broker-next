# Original Cashflow and Ratan to Portal Host migration plan

Status: historical phased plan with an active remaining-work ledger. Current
implementation facts are maintained in [`CURRENT_STATE.md`](./CURRENT_STATE.md)
and the [Cashflow migration runbook](./CASHFLOW_BLOTTER_PORTAL_HOST_MIGRATION_RUNBOOK.md).

## Purpose

This document records the migration plan for:

- `apps/mfe-cashflow-blotter`, limited initially to its real `Cashflow_CN`
  application; and
- `apps/mfe-ratan-container`, limited to the components, utilities, dialogs,
  and platform responsibilities used by Cashflow CN.

The target is the production two-layer runtime under
`mvp/two-layer-federation/realworld`:

```text
portal-host
└── independently deployed Cashflow CN remote
    ├── platform contracts and SDK
    ├── versioned Ratan WebKit/grid packages
    └── Cashflow-owned components, adapters, state, and workflows
```

`mfe-ratan-container` is not a third runtime layer in the target. Portal Host
must load Cashflow without starting, registering, or downloading a Ratan
container manifest. Ratan provides source material that is decomposed into
build-time packages, host capabilities, or application-owned code.

The governing OpenSpec change is
`openspec/changes/migrate-cashflow-cn-to-portal-host`.

## Non-negotiable boundaries

1. Portal Host loads Cashflow CN directly through its Module Federation
   `./application` entry.
2. Cashflow CN owns its Redux state, domain routing, GraphQL/REST calls,
   permissions, business workflows, and domain dialogs.
3. Portal Host owns application registration, loading, identity delivery,
   appearance, navigation, notifications, telemetry, workspace lifecycle, and
   failure containment.
4. Reusable Ratan UI is consumed through versioned build-time packages:
   `@fm/ratan-design-webkit` and `@fm/ratan-data-grid`.
5. Cashflow must continue to load and complete its primary workflow when port
   `9205` and the Ratan container manifest are unavailable.
6. The built runtime must not request Single-SPA, SystemJS, an import map,
   `@fm/base`, `@fm/ratan_container`, `@fm/ratan_cashflow`, or
   `@fm/ratan_trades`.
7. Local fixtures may exercise unchanged production service boundaries, but
   they must be serve-only and must not become the production data path.
8. Other routes from `mfe-cashflow-blotter` are separate migration slices and
   do not enter Cashflow CN implicitly.

## Starting point and current status

| Area                               | Status         | Evidence or remaining condition                                                                 |
| ---------------------------------- | -------------- | ----------------------------------------------------------------------------------------------- |
| Actual Cashflow CN source          | Proven         | copied from `apps/mfe-cashflow-blotter/src/Cashflow_CN` and rendered by the realworld remote    |
| Portal Host registration           | Proven         | route `/cashflow-blotter` loads the remote on port `9206`                                       |
| Ratan runtime independence         | Proven         | hosted acceptance passes with port `9205` unavailable                                           |
| Grid, saved filter/view, details   | Proven locally | real AG Grid, production-shaped local contracts, responsive details dialog                      |
| Dynamic SystemJS applications      | Replaced       | typed navigation/action adapters replace trade and cashflow `System.import` calls               |
| Legacy Ratan implementation        | Interim        | Cashflow still compiles part of `apps/mfe-ratan-container/src` through `@legacy-ratan`          |
| Full migrated-tree TypeScript/lint | Pending        | migration-owned shell and adapters pass; inherited full-tree debt remains                       |
| Production service parity          | Pending        | GraphQL, REST, identity, permissions, STOMP, export, and actions require integration acceptance |
| Entitled workflow acceptance       | Pending        | exercise at least one maker/checker or lifecycle action end to end                              |
| Bundle optimization                | Pending        | remove the legacy source boundary and reduce the current large bundle                           |

The standalone `apps/mfe-ratan-container-mvp` remains an inventory and
decomposition evidence application. It is not registered by Portal Host and
must never become a Cashflow prerequisite.

## Ownership mapping

### Original Cashflow Blotter

| Original area                        | Target owner                                                      | Migration treatment                                        |
| ------------------------------------ | ----------------------------------------------------------------- | ---------------------------------------------------------- |
| `src/Cashflow_CN`                    | `apps/mfe-cashflow-blotter-mvp/src/Cashflow_CN`                   | copy with provenance; preserve behavior before refactoring |
| Cashflow-specific `src/Root` support | Cashflow remote or Cashflow package                               | copy only the transitive Cashflow-owned surface            |
| generated Cashflow types             | Cashflow remote or generated contract package                     | preserve generation provenance and version                 |
| Single-SPA lifecycle and route shell | deleted                                                           | replace with the federated `application.tsx` entry         |
| `@fm/base` imports                   | Cashflow compatibility adapter, then platform SDK/design packages | replace runtime shell access with explicit contracts       |
| `@fm/ratan_container` imports        | temporary facade, then extracted packages/application code        | eliminate the runtime namespace and final source alias     |
| trade/cashflow `System.import`       | typed application/host action                                     | navigate or render through an explicit capability          |
| GraphQL and REST services            | Cashflow-owned transport adapter                                  | keep endpoint and payload semantics unchanged              |
| Redux store, reducers, actions       | Cashflow remote                                                   | retain through the composition migration                   |

### Original Ratan Container

| Original responsibility                           | Target owner                                        | Examples                                                                                    |
| ------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| tokens and domain-neutral controls                | `@fm/ratan-design-webkit`                           | registered custom elements, React wrappers, dialogs, fields, status and feedback primitives |
| AG Grid integration                               | `@fm/ratan-data-grid`                               | grid wrapper, column behavior, reusable grid cells                                          |
| shell identity/navigation/notifications/telemetry | Portal Host capabilities through `@fm/platform-sdk` | no copied shell store or hook-backed globals                                                |
| Cashflow-specific builders and selectors          | Cashflow remote or Cashflow-owned package           | filter selector, view selector, Cashflow query composition                                  |
| Cashflow-specific dialogs and workflow UI         | Cashflow remote or Cashflow-owned package           | history, counterparty, SWIFT, settlement and action dialogs                                 |
| genuinely reusable pure utilities                 | a versioned realworld utility package               | filtering, conversion, date, and field helpers after dependency review                      |
| static mutable globals                            | typed configuration adapter                         | initialize per application root; remove implicit module side effects                        |
| Ratan application entry and Single-SPA lifecycle  | inventory only, then retired                        | never added to the production Portal Host registry                                          |

A module is not reusable merely because it lives under
`mfe-ratan-container`. If it imports Cashflow state, services, fields,
permissions, or workflow types, it belongs to Cashflow.

## Migration phases

### Phase 1: Freeze and characterize the originals

1. Record the source commit for both original applications.
2. Inventory Cashflow CN imports, generated types, assets, CSS, globals,
   routes, feature flags, permissions, services, notification channels,
   exports, and workflow actions.
3. Produce the transitive list of Ratan modules actually used by Cashflow CN.
4. Classify every used Ratan module as design, grid, platform capability,
   reusable utility, or Cashflow-owned domain code.
5. Capture sanitized production-shaped list, detail, metadata, saved-item,
   notification, export, and representative action contracts.
6. Add provenance tests before changing the copied business source.

**Exit gate:** every original dependency has one named target owner and no
unknown runtime import remains.

### Phase 2: Establish the direct federation boundary

1. Create the Cashflow remote with a versioned application manifest and
   `./application` exposure.
2. Register only the Cashflow remote in Portal Host.
3. Share React and React DOM roots/subpaths as federation singletons.
4. Supply appearance, identity, navigation, notifications, telemetry,
   workspace, configuration, and optional FDC3 through platform contracts.
5. Keep the Ratan inventory application standalone on port `9205`; do not add
   it to the host registry or Cashflow `remotes`.

**Exit gate:** Portal Host mounts and contains the Cashflow remote while the
Ratan application is offline.

### Phase 3: Move the actual Cashflow CN application

1. Copy the real `Cashflow_CN` tree, required Cashflow-owned `Root` support,
   generated types, styles, and assets into the realworld application.
2. Point the federated entry at the copied Redux `Main` root.
3. Replace the Single-SPA lifecycle and legacy route shell.
4. Introduce narrow compile-time adapters for unresolved shell and Ratan
   imports; do not rewrite business behavior to make compilation easier.
5. Replace dynamic SystemJS application loads with typed navigation or local
   component actions.
6. Preserve the original GraphQL, REST, Redux, field, permission, feature-flag,
   notification, export, error, and loading state machines.
7. Delete any fixture-authored Cashflow facsimile after the real source renders.

**Exit gate:** provenance, grid, saved filter/view, paging, details, and error
state tests execute the copied application rather than a substitute screen.

### Phase 4: Decompose the Ratan Container

Migrate one transitive cohort at a time:

1. Start with leaf modules that have no Cashflow state or service imports.
2. Move visual primitives and tokens into `@fm/ratan-design-webkit`.
3. Move AG Grid abstractions into `@fm/ratan-data-grid`.
4. Move host concerns to platform contracts and SDK adapters.
5. Move Cashflow-aware selectors, builders, dialogs, and workflow components
   into Cashflow ownership.
6. Move only dependency-free, cross-domain utilities into a shared utility
   package.
7. Add parity tests against the original module before switching each import.
8. Replace the corresponding export in `src/compat/ratan-container.ts`.
9. Remove the original source alias for that cohort and run source/bundle
   boundary checks.

Do not expose the decomposed modules through a new Ratan Module Federation
remote. Package versions, application builds, and contract tests replace the
old runtime namespace.

**Exit gate:** `rsbuild.config.ts` has no `@legacy-ratan` alias, Cashflow source
has no `@fm/ratan_container` import, and no realworld build reads
`apps/mfe-ratan-container/src`.

### Phase 5: Remove transitional adapters and inherited debt

1. Replace `@fm/base` compatibility exports with direct platform SDK,
   design-system, React Router, or Cashflow-owned imports.
2. Replace the broad Ratan facade with direct package/application imports.
3. Convert implicit globals and import-time hook calls to typed per-root
   configuration.
4. Resolve full copied-tree TypeScript, lint, asset, CSS, and generated-type
   failures.
5. Remove compatibility declarations and aliases as their last consumers
   disappear.
6. Measure and reduce bundle size after source boundaries are clean.

**Exit gate:** the complete migrated tree passes strict typecheck and lint,
and compatibility modules contain only intentional platform translations.

### Phase 6: Production contract and workflow parity

1. Validate sanitized fixtures against the integration services.
2. Configure production GraphQL and REST transports without fixture imports.
3. Validate identity and role/permission mapping with real entitlements.
4. Validate STOMP reconnect, notification refresh, and host notification
   behavior.
5. Exercise export and paging against production-sized results.
6. Exercise details, trade navigation, and one representative entitled
   lifecycle or maker/checker action, including progress, success, and error.
7. Record telemetry, failure containment, and response-time evidence.

**Exit gate:** the selected production workflow has contract, integration, and
hosted browser evidence with no legacy runtime requests.

### Phase 7: Cutover and retire

1. Publish immutable versions of the platform, design, grid, and Cashflow
   artifacts.
2. Deploy the accepted Cashflow manifest without changing the legacy route.
3. Enable the Portal Host registry entry for a pilot cohort.
4. Compare functional, error, latency, and workflow telemetry against the
   legacy application.
5. Expand the cohort only while acceptance thresholds hold.
6. Roll back by restoring the previous Portal Host registry version if a gate
   fails.
7. After the acceptance window, retire the original Cashflow CN route and the
   Ratan container runtime independently.

The legacy source is not deleted as part of initial cutover. Repository removal
is a later, separately reviewed cleanup after rollback is no longer required.

## Repeatable implementation sequence

Use this order for each original-source update:

1. Rebase the migration baseline onto the approved original source commit.
2. Review the original diff and copy only in-scope Cashflow CN changes.
3. Update provenance and contract tests before adapting the new code.
4. Classify any new Ratan dependency using the ownership table above.
5. Migrate or adapt the dependency at build time; never register a Ratan
   runtime remote.
6. Run focused unit and adapter tests.
7. Build the Cashflow remote and run its transitive boundary scan.
8. Build Portal Host and run full realworld boundary verification.
9. Run the hosted flow with only ports `9200` and `9206` required for this
   application.
10. Record source commits, artifact versions, contract changes, acceptance
    evidence, known gaps, and rollback version in the release record.

## Verification gates

From the repository root:

```bash
npm --workspace @fm/mfe-cashflow-blotter-mvp test -- --runInBand
npm --workspace @fm/mfe-cashflow-blotter-mvp run lint
npm --workspace @fm/mfe-cashflow-blotter-mvp run build
npm --workspace @fm/mfe-cashflow-blotter-mvp run check:boundaries
npm --workspace @fm/portal-host test
npm --workspace @fm/portal-host run lint
npm --workspace @fm/portal-host run build
npm run realworld:verify:boundaries
npx playwright test --config=mvp/two-layer-federation/realworld/playwright.config.ts \
  mvp/two-layer-federation/realworld/tests/e2e/legacy-migration-mvps.spec.ts
openspec validate migrate-cashflow-cn-to-portal-host --strict
```

Hosted acceptance must prove:

- the remote manifest comes from port `9206`;
- no request is made to port `9205`;
- initial grid data, saved filters, saved views, paging/footer, and details work;
- details remain inside the Portal Host viewport and can be closed;
- notifications do not report false local transport failures;
- production notification behavior is enabled in production mode;
- at least one entitled action completes through its real service contract;
- no Single-SPA, SystemJS, import-map, base-shell, or Ratan-container asset is
  requested; and
- no federation, React dispatcher, invalid-hook, or uncaught application error
  occurs.

## Completion checklist

- [x] Actual Cashflow CN source renders from the federated remote.
- [x] Portal Host loads Cashflow without the Ratan inventory application.
- [x] Local grid, saved filter/view, and responsive detail-dialog flow pass.
- [x] Application-owned SystemJS loads are replaced.
- [ ] All Cashflow-used Ratan source is extracted from the original repository.
- [ ] `@legacy-ratan`, `@fm/ratan_container`, and broad base compatibility
      facades are removed.
- [ ] The complete migrated source passes strict TypeScript and lint.
- [ ] Production GraphQL, REST, identity, permissions, STOMP, export, and
      notification contracts are accepted.
- [ ] One entitled workflow passes hosted production-like acceptance.
- [ ] Bundle and performance budgets are accepted.
- [ ] Pilot cutover and rollback evidence is recorded.

## Related documents

- [Cashflow CN implementation runbook](./CASHFLOW_BLOTTER_PORTAL_HOST_MIGRATION_RUNBOOK.md)
- [Legacy application migration MVP topology](./LEGACY_APP_MIGRATION_MVPS.md)
- [Realworld architecture](./ARCHITECTURE.md)
- [Ratan design migration](../apps/portal-host/docs/RATAN_DESIGN_MIGRATION.md)

# Production foundation acceptance evidence

Status: historical evidence for the legacy compatibility package. Current
active UI verification is recorded in
[`../../../docs/CURRENT_STATE.md`](../../../docs/CURRENT_STATE.md).

Evidence recorded for `@fm/ratan-design@1.0.0`, `@fm/platform-contracts@1.0.0`, and `@fm/platform-sdk@1.0.0` before the host/application pilot.

## Automated results

| Gate                    | Result                                                                                   |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| Platform contract tests | 16 passed; 100% lines/functions, 93.93% branches                                         |
| Platform SDK tests      | 5 passed; 100% lines/branches/functions                                                  |
| Design foundation tests | 24 passed; 100% lines/functions, 95.23% branches                                         |
| Design Storybook        | Production static build passed for Button, TextField, StatusBadge                        |
| Package builds          | ESM and declaration builds passed in dependency order                                    |
| Dependency scan         | No Ant, AG Grid, federation runtime, legacy loader, or Ratan domain dependency/import    |
| Generated token drift   | Checked-in CSS matches deterministic generator byte-for-byte                             |
| Packed consumer         | Runtime imports, TypeScript JSX imports, CSS export, and blocked internal subpath passed |
| OpenSpec                | Strict validation passed                                                                 |

## Artifact evidence

| Package                  | JavaScript |     CSS | Declarations | Packed tarball |
| ------------------------ | ---------: | ------: | -----------: | -------------: |
| `@fm/platform-contracts` |    4.64 KB |       — |      7.80 KB |    2,923 bytes |
| `@fm/platform-sdk`       |    1.26 KB |       — |    883 bytes |    1,122 bytes |
| `@fm/ratan-design`       |    9.32 KB | 3.38 KB |      6.46 KB |    6,429 bytes |

Sizes are uncompressed build output reported by tsup; packed tarballs are produced by the automated temporary-consumer verifier.

## Compatibility guarantees

- Application and appearance protocols are independently versioned at `1.0.0`.
- Unsupported application identity or contract versions fail before rendering with stable typed codes and diagnostic details.
- Appearance snapshots are runtime validated; standalone controller snapshots are cloned and frozen.
- Host and application may bundle different compatible design-package minor versions. Runtime compatibility depends on protocol majors, not package equality.
- React, ReactDOM, MUI, and Emotion are peer/build dependencies and are not design-system federation remotes.

## Deferred cohorts

The foundation intentionally does not yet include dialogs/overlays, icons, navigation, notifications, loading/empty/error compositions, AG Grid adapters, charts, or domain data workspaces. It does not migrate the new host or a production application in this change. Ant and AG Grid may remain inside legacy applications until their behavior-tested migration cohorts complete.

## Pilot entry criteria

The next change can pilot these packages in the new host and one independent Cashflow application because the public exports, protocol contracts, standalone mode, peer boundaries, generated styles, documentation, and consumer installation are now verified without source aliases.

## Interaction foundation 1.1.0

The additive interaction release was accepted after the production host, Cashflow application, and data-grid cohort existed. No application mutation or entitlement behavior was changed in this release.

| Gate                          | Result                                                                                                                                                                      |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Design tests                  | 45 passed; 100% lines/functions/statements, 96.87% branches                                                                                                                 |
| Interaction behavior          | Number/null changes, helper/error association, modal naming, Escape/backdrop gating, focus restoration, loading repeat prevention, and urgency-specific live regions passed |
| Storybook                     | Static production build passed for all existing components plus NumberField, Dialog, ConfirmationDialog, and InlineAlert                                                    |
| Build and declarations        | ESM, CSS, and declarations built successfully; generated token CSS remained byte-for-byte deterministic                                                                     |
| Boundaries                    | No Ant, AG Grid, federation, legacy Ratan/domain, form engine, raw public MUI/Emotion, or application dependency/import                                                     |
| Packed consumer               | Runtime exports, TypeScript JSX, restricted props, CSS resolution, and blocked internal subpaths passed                                                                     |
| Existing production consumers | Data grid 6 tests, Cashflow 12 tests, and host 10 tests passed without adopting the new APIs                                                                                |
| Runtime architecture          | Boundary verifier still reports only host and federated-application layers, with only React and ReactDOM shared singletons                                                  |
| OpenSpec                      | `add-production-interaction-foundation` passed strict validation                                                                                                            |

### 1.1.0 artifact evidence

| Artifact       |        Size |
| -------------- | ----------: |
| JavaScript     |    15.74 KB |
| CSS            |     3.38 KB |
| Declarations   |     8.81 KB |
| Packed tarball | 8,834 bytes |

The unchanged Cashflow production build passed at 1,911.1 KB / 505.0 KB gzip after resolving the additive workspace minor. This release preserves every 1.0.0 export and token; runtime host/application compatibility still depends on platform protocol majors rather than an identical design-package minor.

### Deferred controls and mutation entry

Select/autocomplete, date/time and currency formatting, icons, navigation, toast queues, global overlay managers, form engines, entitlement policy, service clients, and mutation state machines remain deliberately deferred. The first mutation cohort may start only after Cashflow defines typed entitlement and service ports, characterizes status transitions and self-verification rules, maps failures to local feedback, and tests repeat-write prevention.

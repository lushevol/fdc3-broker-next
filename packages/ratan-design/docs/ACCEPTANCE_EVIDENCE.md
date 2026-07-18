# Production foundation acceptance evidence

Evidence recorded for `@fm/ratan-design@1.0.0`, `@fm/platform-contracts@1.0.0`, and `@fm/platform-sdk@1.0.0` before the host/application pilot.

## Automated results

| Gate | Result |
| --- | --- |
| Platform contract tests | 16 passed; 100% lines/functions, 93.93% branches |
| Platform SDK tests | 5 passed; 100% lines/branches/functions |
| Design foundation tests | 24 passed; 100% lines/functions, 95.23% branches |
| Design Storybook | Production static build passed for Button, TextField, StatusBadge |
| Package builds | ESM and declaration builds passed in dependency order |
| Dependency scan | No Ant, AG Grid, federation runtime, legacy loader, or Ratan domain dependency/import |
| Generated token drift | Checked-in CSS matches deterministic generator byte-for-byte |
| Packed consumer | Runtime imports, TypeScript JSX imports, CSS export, and blocked internal subpath passed |
| OpenSpec | Strict validation passed |

## Artifact evidence

| Package | JavaScript | CSS | Declarations | Packed tarball |
| --- | ---: | ---: | ---: | ---: |
| `@fm/platform-contracts` | 4.64 KB | — | 7.80 KB | 2,923 bytes |
| `@fm/platform-sdk` | 1.26 KB | — | 883 bytes | 1,122 bytes |
| `@fm/ratan-design` | 9.32 KB | 3.38 KB | 6.46 KB | 6,429 bytes |

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

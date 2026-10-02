# Ratan production typecheck audit

## Gate contract

`npm run typecheck` checks production TypeScript without emitting JavaScript,
declarations, or incremental build files. Its `@fm/base` alias matches Vite's
existing compatibility bridge. Unit tests and their Vitest setup remain under
the existing Vitest workflow; this gate validates production source only, as in Base.

The original `tsc --noEmit` command stopped on a configuration conflict because
`ts-config-single-spa` sets `emitDeclarationOnly: true`. The dedicated
`tsconfig.typecheck.json` disables declaration output for this gate and retains
the app's strict source settings. The declaration build configuration is unchanged.

## Remaining debt (2026-10-02)

With the installed TypeScript 4.9.5, the original configuration with the conflicting
option overridden reports 1,038 diagnostics: 990 in test files and 48 elsewhere.
Many of those are missing Vitest globals or declaration-portability diagnostics.

The production gate reports **43 source diagnostics and no configuration errors**.
It must remain a failing gate until these source contracts are corrected. They
include:

- Feature flags and entitlement helpers treat unknown platform data as concrete
  values, or expect platform fields absent from the current bridge types.
- Feature service wrappers expect legacy methods and request options that the
  compatibility bridge does not expose.
- Query-builder controls disagree with current AntD option/callback types and
  duplicated Dayjs types.
- A FieldLabel imports an unavailable private AntD module; a quick-search helper
  references an undeclared `System` global.
- Legacy feature adapters have mismatched dialog props, boolean types, or callback
  arguments.

Repair belongs to the deferred Ratan feature migration/remediation backlog. Work
through each affected contract with a behavior test before changing its bridge,
types, or feature code. Do not relax `strict`, replace these errors with `any`, or
suppress the gate to make a design-package release appear complete. Business
logic remains in the application.

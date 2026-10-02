# Cashflow development startup

Cashflow must load through the development federation host without a module
initialization error. Loading the exception utilities before the date forms must
keep `DateFormat` equal to `YYYY-MM-DD` and `TimeFormat` equal to `HH:mm:ss`.
Existing imports of those constants from `MultiExceptions/common/utils` remain
supported. Date values, callbacks, validation and displayed formats are unchanged.

Date forms also consume the formats while their modules are being evaluated.
The format constants therefore live in a dependency-free module instead of the
utility module that imports data hooks and Cashflow detail components. This
prevents the `DateFormat` temporal-dead-zone failure under native browser ESM.

The regression gate is the existing development federation journey in
`scb-next/tests/e2e/design-origin-host.spec.ts`: sign in, launch Cashflow, render
`CF-ACCEPT-001`, add a workspace and remove the Cashflow workspace. Run it from
`scb-next` with Base, Ratan and Cashflow development servers available:

```sh
npm exec -- playwright test tests/e2e/design-origin-host.spec.ts
```

Vitest's transformed module loader does not reproduce the pre-fix startup cycle;
its form and utility suites validate unchanged behavior but are not substitutes
for the native-browser development journey.

## Verification (2026-10-02)

- A native-browser import of `MultiExceptions/common/utils.ts` reproduced
  `Cannot access 'DateFormat' before initialization` before the fix. The same
  probe now loads successfully with both original format values.
- The development portal journey completed at `http://127.0.0.1:8001` in
  WebKit/dark mode, including the Cashflow record and workspace removal, with
  no uncaught page errors.
- Four utility/form/data-hook suites passed 220 tests with three existing
  skips. The Cashflow production build passed.
- The broader host browser gate still fails on existing console messages and
  unrelated missing resources (Alpha dev server and Base font URLs). Those
  failures are separate from the fixed initialization error and are not counted
  as a passing full-portal browser gate.
- The two date-form components and the new format module pass zero-warning
  lint. The legacy utility/form files retain the same nine errors and fifteen
  warnings as the pre-fix source; this change only adjusts their imports/exports.

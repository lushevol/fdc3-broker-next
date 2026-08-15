# MFE Base TypeScript coverage

Date: 2026-08-15

## Scope

Increase compile-time type coverage for `mfe-base-origin` without changing
runtime behavior. Production source, ambient declarations, build/test
configuration, and shared test setup are in scope. Existing test cases remain
the behavioral regression contract.

## Baseline

- `strict` and `strictNullChecks` are enabled.
- The production typecheck fails on untyped test setup, the `App` version prop,
  and incompatible top-level setup imports.
- `type-coverage@2.29.7` with TypeScript 5.8.3 reports 97.62% coverage
  (17,104 of 17,520 identifiers). TypeScript 5.8.3 is used only for this metric
  because this type-coverage release is incompatible with TypeScript 5.9's
  compiler API; the project compiler remains TypeScript 5.9.3.
- Production code contains explicit `any`, broad `Function`/`object` types, and
  `@ts-ignore` directives at service, browser, UI, and integration boundaries.

## Requirements

1. `npm run typecheck` must pass with the project's TypeScript 5.9 compiler.
2. Production/config type coverage must reach 100% with no ignored files or
   ignored type categories.
3. Production/config code must contain no explicit `any`, broad `Function`
   annotations, double assertions through `unknown`, or TypeScript suppression
   directives.
4. External data must enter as concrete library types or `unknown` and be
   narrowed before property access.
5. Callback, timer, DOM, React, Axios, FDC3, and theme values must use their
   platform/library contracts instead of hand-written loose substitutes.
6. Runtime branches, state transitions, request mutation, rendering, and public
   values must remain unchanged.
7. Unit coverage, production build, Storybook build, and the Base UI smoke path
   must continue to pass subject to existing environment limitations.

## Non-goals

- No feature, UI, request, state, or data-shape redesign.
- No dependency or framework major upgrade.
- No enabling of `exactOptionalPropertyTypes` or
  `noUncheckedIndexedAccess` in this stage. A probe shows those flags require a
  separate domain-model migration across reducer and workspace/auth flows,
  which exceeds a type-only, behavior-preserving change.
- No bulk formatting or unrelated lint cleanup.

## Verification

```bash
npm run typecheck
npm run type-coverage
npm test -- --maxWorkers=4
npm run build
npm run build:storybook
```

The type-coverage script must enforce exactly 100% rather than allowing the
metric to regress silently.

## Result

- Type coverage: 100.00% (17,675 of 17,675 identifiers).
- Strict TypeScript 5.9 source typecheck: passed.
- Unit tests: 334 passed across 121 test files.
- Production build: passed.
- Storybook build: blocked by the existing workspace install because the
  declared `@storybook/react-vite` package is absent from `node_modules`.

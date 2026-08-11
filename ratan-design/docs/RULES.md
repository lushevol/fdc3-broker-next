# ratan-design — Rules & Conventions

> Parent: [PROJECT.md](PROJECT.md) · Onboarding: [NEW-JOINER.md](NEW-JOINER.md)

## Authority & Parity

1. **Runtime observation wins.** When observed frozen WebKit behavior at the pinned baseline (`@scdevkit/webkit@2.0.5` @ `a8398ea6df30e4843e22fcb5a1d3343107463c60`) disagrees with tests, source, Storybook, or docs, the observed runtime behavior is authoritative.
2. **Never re-invent the token contract.** `--sc-*` names and values are permanent and public. Do not introduce replacement namespaces. Do not rename, normalize, or "improve" frozen values.
3. **Every WebKit property, default, variant, state, event, slot, and method must be mapped or explicitly waived** in the parity manifest. Unmapped surface is a completeness failure.
4. **Known defects are corrected, not reproduced** — but every correction must be recorded as a tested, approved deviation in `manifests/deviations.json` (see `button-loading-announcement` for the pattern).
5. **No continuous mirroring.** The baseline is a one-time snapshot; future WebKit changes are out of scope.

## Public API

1. **Ratan owns the public API.** Public props, event names, state semantics, and markup expectations belong to Ratan. React Aria classes/types/DOM shape and TanStack state types never leak into the public contract.
2. **Standard state prop names** — `disabled`, `loading`, `invalid`, `required`, `readOnly`, `selected`, `expanded`, `size`, `variant`, `tone`. Avoid parallel naming (`isDisabled`, `hasError`).
3. **Visual meaning** — `variant` = hierarchy, `tone` = semantic status, `size` = physical size. Frozen legacy names (`pill`, `border`, `compact`, `snack`, `fill`, `inverse`) are retained only as parity waivers, not new design direction.
4. **Controlled/uncontrolled both supported** (`defaultValue`/`value` + `onValueChange`/`onChange` style pairs) via `useControllableState` from `packages/foundation`.
5. **Forward refs** on all interactive components; native attributes and form behavior preserved (`name`, `value`, `onChange`, `onBlur`, `required`, `readOnly`, `aria-describedby`, form submit/reset).
6. **No unrestricted polymorphism** (`as=`). Prefer semantic components (`Button`, `ButtonLink`, `IconButton`). `asChild` only after parity, with preserved semantics.
7. **No provider props or design-system runtime dependencies.** Components must work mounted anywhere with only `styles.css` + theme/mode CSS loaded.
8. **No hardcoded user-facing strings** (e.g. "No results", "Loading", "Clear selection"). Components accept locale/formatting props; browser locale is the default.
9. **Heavy capabilities go behind subpaths** — DataGrid must never be re-exported from the root barrel.

## Interaction Foundation

1. **React Aria is mandatory** for interactive behavior whenever a Component/hook exists. Direct native implementation is limited to non-interactive presentation or behavior with no Aria primitive.
2. **Any interactive exception** requires: ADR entry (`packages/foundation/exceptions/ADR-TEMPLATE.md`), manifest rationale, keyboard/focus tests, and owner approval. `verify-interaction-foundation.mjs` enforces this.
3. **Overlays portal to `document.body`**, clean up on unmount, follow React Aria focus/dismissal/scroll-lock behavior unless a stricter legacy requirement is recorded.

## Styling

1. **Static CSS only.** No CSS-in-JS, Emotion, Styled Components, Tailwind runtime, or dynamic style engine.
2. **Cascade layers** — `@layer ratan-reset, sc-theme, ratan-components, application-components, utilities;` declared before component/app CSS.
3. **Scoped to Ratan roots** — every component rule anchors to a Ratan-owned class or `data-ratan-*`/`data-variant`-style attribute; internal hashed classes are private.
4. **CSS side effects per subpath** — importing `/button` loads only button CSS. No cross-component CSS imports in subpath entries.
5. **Customization policy** — supported: props, semantic `--sc-*` token overrides, exposed `className`/documented slots, wrappers. Requires review: new variants, pattern-level changes, token categories. Prohibited: internal hashed-class selectors, global overrides of internals, `!important`, primitive palette overrides, dependence on undocumented DOM structure.
6. **Reduced motion** — respect `prefers-reduced-motion`; component functionality must not depend on animation completion.

## Manifests & Migration

1. **Keep manifests authoritative and complete.** `parity-manifest.json`, `migration-map.json`, and `deviations.json` are inputs to docs, tests, codemods, and release gates. Update them in the same change as the component.
2. **Deviations need approval and tests** — a deviation without a linked test is invalid.
3. **Migration mappings** (`migration/mappings/{webkit,legacy-ratan,mui,ant-design}`) must exist before legacy consumers migrate; codemods live in `migration/codemods`.

## Testing & Quality Gates

1. **Contract tests are mandatory** — public props, events, a11y (axe via `@fm/ratan-design-vitest`), forms, overlays, controlled/uncontrolled. Coverage is enforced in `packages/react` and `packages/data-grid`.
2. **Style tests** assert frozen `--sc-*` consumption and generated state CSS correctness.
3. **Accessibility gates** — keyboard nav, focus management/restoration, screen-reader semantics, high contrast, zoom, reduced motion, disabled/read-only/validation relationships.
4. **Performance gates** — tree-shaking per subpath, bounded DataGrid DOM, p95 interaction work < 10 ms, cleanup on unmount (no leaks).
5. **Boundary rules** — production `packages/react` code must not import Lit/Shoelace/WebKit or cross private-package boundaries (`verify-workspace-boundaries.mjs`).
6. **Complete before promote** — a component cohort is not done until: manifest complete (100%), Storybook variants, docs page (all six enforced sections), compilable examples, parity-lab evidence, a11y + tests + performance, and playground/packed-consumer verification all pass (`npm run verify:foundation`).
7. **Docs as code** — examples in documentation must be compilable and verified (`apps/docs/scripts/verify-docs.mjs` fails the build on missing sections/examples).

## Repository Hygiene

1. Run the full workspace gates before pushing: `npm run ratan:build`, `npm run ratan:test`, `npm run ratan:lint`, `npm run ratan:typecheck` (root) or `npm run verify:foundation` (inside `ratan-design/`).
2. Do not commit `dist/`, `coverage/`, or `node_modules` artifacts unless a release workflow requires them.
3. Follow the root monorepo AI workflow (see repo `docs/rules.md`): spec → failing tests → implementation → verify coverage → lint/performance review.

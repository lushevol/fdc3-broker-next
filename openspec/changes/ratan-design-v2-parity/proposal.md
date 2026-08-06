## Why

Portal applications need a React-native design system that preserves the frozen `@scdevkit/webkit@2.0.5` visual and behavioral contract without retaining Web Components, Lit, Shoelace, or the legacy Ant Design/Emotion-based Ratan implementation. The replacement is needed now so independently deployed React micro-frontends can migrate predictably while improving accessibility, performance, typing, testing, and developer experience.

## What Changes

- Create `@fm/ratan-design` v2 as the only public package, with ESM, TypeScript declarations, root exports, tree-shakable component subpaths, CSS/theme/mode subpaths, icons, testing helpers, and machine-readable parity and migration metadata.
- Freeze WebKit parity at repository commit `a8398ea6df30e4843e22fcb5a1d3343107463c60`, preserving exact `--sc-*` tokens, themes, typography modes, component variants, defaults, states, events, slots, methods, and intended interaction behavior.
- Implement interactive React components on React Aria Components/hooks and implement the full in-scope DataGrid on private TanStack Table and TanStack Virtual foundations.
- Establish private workspace boundaries for components, foundation, tokens, styles, icons, patterns, DataGrid, testing, Storybook, standards, and Vitest, with docs, playground, and parity-lab applications.
- Add contract, visual, accessibility, performance, packed-consumer, React 18.2/19, and micro-frontend lifecycle gates for every component cohort.
- Add WebKit, legacy Ratan, MUI, and Ant Design mappings, codemods, a tenant migration playbook, and an adoption dashboard.
- Migrate Portal Host as the representative WebKit pilot and migrate the remaining legacy `@fm/ratan-design@1.1.0` consumers before retiring the old workspace.
- **BREAKING** Replace the legacy `@fm/ratan-design@1.1.0` Ant Design/Emotion implementation with the provider-free v2 React API and frozen `--sc-*` contract.
- **BREAKING** Remove obsolete provider/runtime assumptions and legacy component APIs after their consumers pass documented migration and rollback gates.
- Keep mandatory telemetry, shell singleton coordination, business logic, authorization, network calls, and excluded WebKit viewers/editors outside the core v2 delivery.

## Capabilities

### New Capabilities

- `ratan-parity-contract`: Frozen WebKit catalogue inventory, evidence precedence, manifest mappings, deviations, scope classification, and completeness gates.
- `ratan-workspace-package`: Monorepo hierarchy, private dependency boundaries, the single public package, exports, build assembly, and micro-frontend runtime contract.
- `ratan-tokens-styles-icons`: Exact `--sc-*` tokens, themes, font modes, static CSS isolation, cascade layers, resets, and built-in icon delivery.
- `ratan-react-components`: Idiomatic React component APIs, React Aria foundation rules, variants, forms, refs, callbacks, composition, accessibility, and component cohort delivery.
- `ratan-overlays-i18n-motion`: Provider-free overlays, focus restoration, locale and direction behavior, document-global themes, and reduced-motion behavior.
- `ratan-data-grid`: Table, DataView, and complete manifest-recorded DataGrid behavior, accessibility, bounded rendering, and performance requirements.
- `ratan-workbench-quality`: Docs, Storybook, playground, parity lab, testing helpers, SDD/TDD, visual, accessibility, browser, bundle, and interaction quality gates.
- `ratan-migration-release`: WebKit/legacy Ratan/MUI/Ant Design migration mappings, codemods, playbook, adoption dashboard, pilots, deprecation, retirement, and release promotion.

### Modified Capabilities

None. Existing similarly named OpenSpec capabilities concern HTML/CSS extraction tooling and are not changed by this design-system programme.

## Impact

- Adds a new `ratan-design/` workspace hierarchy and OpenSpec-governed delivery programme.
- Replaces the legacy Realworld `@fm/ratan-design` implementation after consumer migration, while retaining the package identity on the `2.0.0-alpha.*` to `2.0.0` release line.
- Affects Portal Host, two remaining legacy Ratan consumers, package/build configuration, npm workspaces, Turbo tasks, Storybook/docs/playground/parity infrastructure, and migration tooling.
- Adds React Aria, TanStack Table, and TanStack Virtual as private implementation dependencies; React and ReactDOM remain peers supporting 18.2 through 19.
- Prohibits production dependencies on WebKit, Lit, Shoelace, Emotion, MUI, Ant Design, or a shared Ratan runtime.
- Preserves coexistence with unmigrated applications through the exact document-global `--sc-*` token contract until approved migration endpoints are reached.

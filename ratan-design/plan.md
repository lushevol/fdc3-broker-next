# Ratan Design v2 — React Parity Architecture and Implementation Plan

**Status:** Final reconciliation draft for owner steering; component expansion is paused pending approval
**Target platform:** Portal shell and independently deployed React micro-frontends
**Public package:** `@fm/ratan-design`
**Release line:** `2.0.0-alpha.*` → `2.0.0`
**Frozen design authority:** `@scdevkit/webkit@2.0.5` at repository commit `a8398ea6df30e4843e22fcb5a1d3343107463c60`
**Interaction foundation:** React Aria Components and hooks
**Data-grid foundation:** TanStack Table plus TanStack Virtual
**Styling:** Static CSS, CSS Modules, exact `--sc-*` variables, and cascade layers
**Runtime model:** No required provider and no shared design-system runtime
**Telemetry:** Deferred optional extension; not a v2 delivery dependency

---

# 0. Governing revision decisions

This revision preserves the original plan's useful accessibility, component API, forms, overlays, internationalization, security, documentation, governance, and delivery guidance while changing its design authority and delivery architecture.

If a later section conflicts with this section, these decisions take precedence:

1. Ratan is a from-scratch React implementation of the frozen SC WebKit design, not an original HeroUI-inspired visual language.
2. Existing `--sc-*` names and resolved values are the permanent public token contract. Ratan does not introduce replacement `--pui-*` or `--ratan-*` tokens.
3. The in-scope contract is the WebKit UI catalogue, built-in icon libraries, Table, DataView, and DataGrid. DashboardViewer, Tour, legacy RichTextEditor, DocumentImageViewer, and all sibling WebKit packages are excluded.
4. React APIs are idiomatic but every observed Web Component property, default, variant, state, event, slot, and method must be mapped or explicitly waived.
5. Runtime observation at the frozen baseline outranks tests/source, application usage, Storybook, and written documentation when those sources disagree.
6. Known accessibility, performance, security, and interaction defects are corrected and recorded rather than reproduced.
7. The baseline is a one-time snapshot. Ratan does not continuously mirror later WebKit changes.
8. Ratan is one public npm package with tree-shakable subpaths. Heavy DataGrid code is isolated behind `@fm/ratan-design/data-grid`.
9. Components require no provider. Theme and font modes are document-global, direction inherits from `dir`, browser locale is the default, and overlays portal to `document.body`.
10. The legacy `@fm/ratan-design@1.1.0` workspace is removed after its consumers migrate. Prereleases use `2.0.0-alpha.*`; stable release is `2.0.0`.
11. The Portal Host is the representative WebKit-to-Ratan pilot. Other WebKit consumers may coexist during migration because both systems use the same token contract.
12. Mandatory telemetry, a shell singleton, analytics schemas, authorization, workflow state, and business logic are outside the core v2 package. The retained telemetry design is a future optional extension only.

## 0.1 Item-by-item reconciliation with the original plan

The following ledger accounts for every numbered section in the original plan. `Keep` means the original direction remains normative; `Adapt` preserves the intent but changes its mechanism; `Replace` records an approved conflicting decision; `Expand` strengthens the original scope; and `Defer` keeps the idea visible without making it a v2 dependency.

| # | Original plan item | Decision | Final treatment |
|---:|---|---|---|
| 1 | Executive summary | Adapt | Retain the multi-team portal purpose; make frozen WebKit parity the design authority and one public Ratan package the delivery unit. |
| 2 | Problem statement | Keep | Preserve the original MFE consistency, isolation, accessibility, upgrade, overlay and product-usage visibility problems; telemetry remediation is deferred. |
| 3 | Vision | Replace | Replace the HeroUI-inspired/new visual direction with a React expression of the frozen SC WebKit look and feel. |
| 4 | Goals and non-goals | Expand | Preserve platform goals and add complete catalogue parity, migration, DataGrid, bundle and interaction gates. |
| 5 | Design principles | Adapt | Keep accessibility, progressive disclosure, mature APIs, isolation and offline assets; replace mandatory runtime, telemetry and invented density assumptions. |
| 6 | High-level architecture | Adapt | Keep the shell/MFE development model and restore docs, Storybook and playground; use one public package with private workbench apps. |
| 7 | Package architecture | Adapt | Consolidate the proposed `@portal-ui/*` public packages into internal modules and tree-shakable subpaths of `@fm/ratan-design`; keep clear internal boundaries. |
| 8 | Component foundation | Replace | React Aria Components/hooks are selected, not merely provisional; TanStack Table/Virtual are selected for DataGrid. |
| 9 | MFE runtime contract | Adapt | Keep independent application delivery and React peers; remove the provider/shared Ratan runtime and runtime component substitution. |
| 10 | Styling architecture | Adapt | Keep static isolated CSS and cascade layers; replace new visual CSS with exact `--sc-*` artifacts and parity-scoped component styles. |
| 11 | Token architecture | Adapt | Keep primitive/semantic/component organization internally while preserving exact public `--sc-*` names and resolved values. |
| 12 | Theme and density | Replace | Preserve WebKit light, dark, CPBB and font modes; map density only from observed sizes/compact behavior instead of inventing a new scale. |
| 13 | Component API standards | Expand | Keep mature React conventions and add exhaustive mappings from attributes, properties, events, slots, methods and defaults. |
| 14 | Customization policy | Keep | Preserve props → composition → tokens → reviewed exceptions; internal DOM/classes remain private. |
| 15 | Internationalization | Adapt | Keep locale, RTL and formatting requirements without a provider; browser/`dir` defaults plus relevant component props. |
| 16 | Motion | Adapt | Keep reduced-motion rules while matching frozen WebKit timings unless an approved defect correction applies. |
| 17 | Form integration | Expand | Keep native form participation and add WebKit contract parity, controlled/uncontrolled behavior, reset and validation gates. |
| 18 | Overlay architecture | Replace | Keep accessible focus/dismissal/z-index behavior; use `document.body` portals and document-global themes instead of a runtime overlay root. |
| 19 | Telemetry architecture | Defer | Retain as optional post-v2 design material; core components expose React/native callbacks and never require telemetry. |
| 20 | Telemetry schema | Defer | Preserve for a separately approved, independently versioned extension. |
| 21 | Telemetry value rules | Defer | Preserve privacy-aware guidance; it is not a component parity or release gate. |
| 22 | Telemetry DOM contract | Defer | Stable `data-*` state remains available for styling/testing, but no telemetry DOM contract is required in v2. |
| 23 | Telemetry loading/disabled behavior | Adapt | Loading and disabled semantics remain normative component behavior; telemetry emission is deferred. |
| 24 | Telemetry component API | Defer | No telemetry props in the core v2 API; revisit only through a separate proposal. |
| 25 | Telemetry lifecycle | Defer | Not part of core component lifecycle or stable-release scope. |
| 26 | Telemetry privacy/trust | Keep as future guardrail | Any future adapter must retain the original prohibited-data and trust-boundary rules. |
| 27 | Telemetry performance/reliability | Keep as future guardrail | Any future adapter must be optional, failure-isolated and outside synchronous interaction work. |
| 28 | Telemetry diagnostics | Defer | Diagnostics belong to a future adapter or development tooling, not production components. |
| 29 | Button API | Expand | Preserve the detailed API exercise, but derive exact variants/defaults/states from the manifest and implement interaction through React Aria; restore the `loadingLabel` announcement contract. |
| 30 | Select API | Expand | Preserve compound and convenience APIs, forms and overlays; map the complete WebKit select/dropdown surface using React Aria collections. |
| 31 | DataTable strategy | Expand | Replace the limited initial DataTable scope with Table, DataView and complete DataGrid parity behind a dedicated subpath; retain the loading/refreshing distinction and manifest-gated exclusions. |
| 32 | Initial component roadmap | Adapt | Preserve cohorts and enterprise patterns; sequence them by manifest coverage and Portal Host migration needs. |
| 33 | Repository structure | Restore and adapt | Restore `apps`, `packages` and `tooling`; adopt HeroUI-like docs/React/styles/Storybook/standards boundaries while publishing only `packages/react` as `@fm/ratan-design`. |
| 34 | Package/build requirements | Expand | Keep ESM/types/tree shaking and add CSS side effects, subpath, manifest drift, packed-consumer and prohibited-dependency checks. |
| 35 | Versioning/compatibility | Adapt | Preserve SemVer/deprecation matrices; use the existing package identity and the `2.0.0-alpha.*` → `2.0.0` release line. |
| 36 | Documentation | Expand | Restore a dedicated docs app and require WebKit mappings, deviations, migration guidance and compilable examples. |
| 37 | AI-ready support | Expand | Keep machine-readable guidance and add parity/migration manifests as authoritative inputs; restore MUI and Ant Design migration mappings for legacy consumers. |
| 38 | Accessibility gates | Expand | Keep the original gates and add parity fixtures, native forms, zoom, high contrast and manual DataGrid review. |
| 39 | Performance | Expand | Keep budgets and add WebKit comparison, subpath budgets, bounded DOM, 55 FPS DataGrid and cleanup checks. |
| 40 | Security/supply chain | Keep | Preserve dependency, CSP, asset, vulnerability, license and SBOM governance. |
| 41 | Browser/environment support | Adapt | Test supported portal browsers in managed Chrome and Edge across React 18.2–19 and representative MFE mounts. |
| 42 | Governance | Expand | Keep ownership/review rules and add parity-manifest/deviation approval and workbench ownership. |
| 43 | Delivery roadmap | Restore and expand | Restore foundation surfaces in Phase 1—docs, Storybook and playground—then require them in every component cohort; restore the tenant migration playbook deliverable. |
| 44 | Adoption | Expand | Keep gradual adoption; add manifest-driven codemods, Portal Host pilot and legacy Ratan consumer migration; restore the approved-plan guardrail for indefinite mixed-library usage. |
| 45 | Risks | Expand | Keep original risks and add parity evidence, React Aria gaps, DataGrid schedule and legacy-removal timing. |
| 46 | Acceptance criteria | Expand | Preserve quality gates and require workbench completeness, 100% manifest completion and migrated consumer flows; restore the pilot-tenant-without-source-modification gate. |
| 47 | Architectural decisions | Adapt | Publish a single final decision table that includes both original platform intent and approved parity decisions. |
| 48 | Recommendation | Adapt | Approve the reconciled direction and workbench structure before further component expansion. |

Nothing from the original plan is silently removed. Conflicting ideas remain traceable here, and deferred telemetry material remains in sections 19–28 so it can be revisited without confusing it with the v2 release contract.

## 0.2 Directional decisions requiring owner approval

This document recommends the following steering decisions. Implementation does not scale beyond the proof cohort until they are approved:

1. SC WebKit `2.0.5` at the pinned commit is the frozen visual and behavioral authority.
2. React Aria is mandatory for interactive behavior whenever it provides the relevant component or hook; hand-rolled interaction primitives require a written exception.
3. `@fm/ratan-design` is the only public npm package, while docs, Storybook, playground and parity lab remain private workspaces.
4. The target repository structure is the `apps/`, `packages/` and `tooling/` structure in section 33.
5. Exact `--sc-*` tokens are public; no replacement token namespace is introduced.
6. There is no required provider, shared Ratan runtime or mandatory telemetry in v2.
7. Table, DataView and complete DataGrid parity are required for stable `2.0.0`; explicitly excluded viewers/editors remain out of scope.
8. Every component must be complete across manifest contract, Storybook, docs, playground where applicable, parity lab, accessibility, tests and performance before its cohort is promoted.

# 1. Executive summary

Ratan Design v2 provides the React-native successor to SC WebKit for independently deployed portal applications. It must deliver the same design tokens, component variants, visual states, themes, typography modes, and intended interaction behavior while removing Web Components, Lit, Shoelace, and untyped React wrappers from the consumer experience.

The programme will deliver:

- A frozen, machine-readable parity manifest covering every public WebKit export and registered element.
- Exact snapshots of the GDS, styleguide, light/dark, CPBB, Inter, Roboto Mono, Dyslexic, typography, and component token assets.
- Accessible, typed React components built on React Aria behind Ratan-owned APIs.
- A full DataGrid replacement built on TanStack Table and TanStack Virtual without exposing their internal state types as the permanent public contract.
- Static, isolated component CSS that consumes the existing `--sc-*` variables.
- Root and per-component imports from one tree-shakable `@fm/ratan-design` package.
- Manifest-driven migration metadata and codemods for properties, events, slots, and imports.
- A parity lab rendering WebKit and Ratan fixtures under identical conditions.
- Incremental alpha cohorts, migration of remaining legacy Ratan consumers, and a Portal Host pilot before stable release.

Example React usage:

```tsx
import { Button } from "@fm/ratan-design/button";
import "@fm/ratan-design/styles.css";

export function SettlementActions() {
  return (
    <Button variant="primary" tone="default" size="sm">
      Confirm
    </Button>
  );
}
```

No design-system provider, shell runtime, or telemetry client is required. Applications own business state and policy; Ratan owns presentation, accessible interaction behavior, and the frozen design contract.

# 2. Problem statement

The portal hosts applications developed and released by multiple teams. These applications may currently use different UI libraries, interaction patterns, styling technologies and accessibility implementations.

Without a governed design system, the platform faces:

- Inconsistent visual experiences
- Conflicting CSS in a shared document
- Duplicate UI and accessibility dependencies
- Inconsistent keyboard and screen-reader behavior
- Different loading, error, permission and empty states
- Repeated implementation of common workflows
- Difficult upgrades across independently deployed applications
- Limited control over component security and quality
- Increasing maintenance and support costs
- Inconsistent telemetry and incomplete product-usage visibility; this remains a platform problem, but its solution is explicitly deferred from the core v2 component release.
- Poor compatibility between AI-generated code and portal standards
- Uncontrolled component overrides
- Overlay, focus and z-index conflicts between micro-frontends

The design system must address these problems without becoming:

- A tenant business-logic framework
- A general application SDK
- A tightly coupled runtime requiring synchronized tenant releases
- A mandatory global component implementation singleton
- A mechanism for collecting confidential business data

---

# 3. Vision

> Ratan Design is the React expression of the proven SC WebKit visual system. A migrated screen should look and feel familiar to users, while its implementation becomes more accessible, typed, performant, testable and natural for React teams.

Ratan should feel:

- Visually indistinguishable from the approved WebKit baseline, except for documented defect corrections.
- Professional, precise, compact and operationally efficient.
- Predictable across independently mounted React roots.
- Native to React rather than a wrapper around Custom Elements.
- Faster to load and interact with, especially for common portal routes and large grids.

Design evolution beyond the frozen baseline begins only after the parity programme reaches stable release.

# 4. Goals and non-goals

## 4.1 Primary goals

Ratan Design v2 will:

1. Preserve every in-scope WebKit token, visual variant, state, size and intended interaction.
2. Replace untyped Custom Element wrappers with strict, discoverable React APIs.
3. Improve keyboard, screen-reader, focus, form, high-contrast, zoom and reduced-motion behavior.
4. Eliminate Lit, Shoelace and WebKit from the new package's production dependency graph.
5. Support React 18.2 through React 19 with React and ReactDOM as peers.
6. Isolate styles across micro-frontends without Shadow DOM.
7. Provide root and per-component imports with heavy features isolated in subpaths.
8. Reproduce the full approved DataGrid feature surface with bounded rendering.
9. Enable incremental coexistence and manifest-driven migration.
10. Improve bundle size, interaction latency, unmount cleanup and development ergonomics.
11. Retain the original plan's accessibility, internationalization, forms, overlays, security, documentation and governance standards where compatible with parity.

## 4.2 Non-goals

The v2 parity programme will not:

- Create a new visual language or reinterpret SC styling.
- Continuously synchronize future WebKit changes.
- Implement excluded viewers, editors, tours, charts, forms tooling or sibling packages.
- Preserve known legacy defects when the intended behavior is clear.
- Require a React provider, shell singleton, global event bus or component implementation singleton.
- Make telemetry mandatory or collect business data.
- Own tenant business logic, authentication, authorization, FDC3 routing, OpenFin integration, workflow orchestration, API clients or application state.
- Expose React Aria, TanStack, CSS Module class names or internal DOM structure as public contracts.

# 5. Design principles

## 5.1 Accessible by default

Components must provide correct:

- Keyboard navigation
- Focus management
- Focus restoration
- Screen-reader semantics
- Form participation
- Disabled and read-only behavior
- Validation relationships
- High-contrast behavior
- Browser zoom behavior
- Reduced-motion behavior

Accessibility must be implemented by the design system rather than repeatedly implemented by each tenant.

## 5.2 Progressive disclosure

Simple cases should remain concise:

```tsx
<Button variant="primary">Confirm</Button>
```

Advanced composition should remain available:

```tsx
<Card>
  <Card.Header>
    <Card.Title>Settlement details</Card.Title>
    <Card.Description>
      Transaction and processing information
    </Card.Description>
  </Card.Header>

  <Card.Body>
    <SettlementDetails />
  </Card.Body>

  <Card.Footer>
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Confirm</Button>
  </Card.Footer>
</Card>
```

## 5.3 Mature component API design

The public API should adopt proven patterns:

- Compound components
- Controlled and uncontrolled state
- Slot-based customization
- Stable state naming
- Strong ref support
- Native attributes where appropriate
- Minimal props for simple usage
- Advanced parts for complex composition

The API must not blindly reproduce the implementation APIs of Base UI, React Aria or any other underlying library.

## 5.4 Provider-free integration

Tenant applications import components and the required global style entry point; no provider is mounted.

Components resolve configuration through platform standards:

- Theme and component values inherit from document-global `--sc-*` variables.
- Light, dark, CPBB and font-mode selectors match the frozen WebKit CSS contract.
- Direction inherits from the nearest `dir` attribute.
- Locale defaults to the browser and may be overridden on components that format locale-sensitive values.
- Overlay content portals to `document.body` and therefore uses the document-global theme.

Per-subtree overlay themes and local portal containers are intentionally unsupported in v2 because they require a provider or runtime contract.

## 5.5 Telemetry is deferred and optional

Telemetry is not part of the core component contract and must not block parity delivery. Core components emit ordinary React callbacks and native semantic events only.

Sections 19–28 retain the original telemetry proposal as design material for a future opt-in adapter. Any later telemetry package must remain vendor-neutral, privacy-controlled, failure-isolated and unable to change component interaction behavior.

## 5.6 Density and compact variants follow the baseline

Ratan does not invent a new global density scale during parity. It preserves WebKit's observed component sizes, compact flags, row heights, spacing and control dimensions exactly.

After parity, a global density abstraction may be proposed only if every mapping to existing variants is explicit and produces no unexplained visual change.

## 5.7 Isolation before global convenience

Because multiple applications render in one document:

- Component CSS must not leak.
- Tenant CSS must not override internal classes accidentally.
- Global selectors must be minimized.
- Stable customization must use documented props, tokens and slots.
- Internal DOM and hashed classes must remain private.

## 5.8 Global coordination without component-version coupling

Only truly global capabilities should be shared as singletons.

A tenant compiled against one design-system version must not silently execute a different shell-owned component implementation.

## 5.9 No external runtime dependencies

The design system must not require:

- Public CDNs
- Externally hosted fonts
- Externally hosted icons
- External analytics services
- External styling services
- Direct third-party network calls

---

# 6. High-level architecture

```text
Ratan Design workspace
│
├─ Public delivery
│  └─ @fm/ratan-design (application-bundled, tree-shakable)
│     ├─ typed React APIs backed by React Aria
│     ├─ exact frozen --sc-* token and theme assets
│     ├─ static isolated component CSS and built-in icons
│     ├─ patterns, testing helpers and migration metadata
│     └─ data-grid subpath backed by TanStack Table + Virtual
│
├─ Product and developer workbench (private)
│  ├─ Docs: durable guidance, API, tokens, migration and deviations
│  ├─ Storybook: exhaustive component variants, states and interactions
│  ├─ Playground: realistic React/MFE integration and package-consumer flows
│  └─ Parity lab: frozen WebKit-versus-Ratan evidence and benchmarks
│
└─ Tooling (private)
   ├─ baseline/manifest generators
   ├─ codemods and migration checks
   ├─ visual/accessibility/performance runners
   └─ package-boundary and release validation

Portal shell / independently deployed React application
├─ React + ReactDOM peers
├─ document-global SC theme and font-mode CSS
└─ a pinned @fm/ratan-design application dependency
```

Ratan is bundled with each application. Only React and ReactDOM remain shared federation singletons. Ratan components, React Aria and TanStack dependencies are not substituted by the shell at runtime.

# 7. Package architecture

## 7.1 One public package

`@fm/ratan-design` contains all public APIs and is released as one semantic-versioned unit from `packages/react`. Private workspace packages provide strong source, test and build boundaries, but they are not separately published, independently versioned or required as runtime dependencies by consumers. The public build bundles or copies their approved outputs into `@fm/ratan-design`.

Required exports:

```text
@fm/ratan-design
@fm/ratan-design/button
@fm/ratan-design/text-input
@fm/ratan-design/date-picker
@fm/ratan-design/dialog
@fm/ratan-design/tabs
@fm/ratan-design/data-grid
@fm/ratan-design/icons
@fm/ratan-design/tokens
@fm/ratan-design/testing
@fm/ratan-design/styles.css
@fm/ratan-design/themes/light.css
@fm/ratan-design/themes/dark.css
@fm/ratan-design/themes/cpbb.css
@fm/ratan-design/modes/inter.css
@fm/ratan-design/modes/roboto-mono.css
@fm/ratan-design/modes/dyslexic.css
@fm/ratan-design/parity-manifest.json
@fm/ratan-design/migration-map.json
```

Common components may be imported from the root. Per-component subpaths must avoid loading unrelated component code or CSS. DataGrid and other expensive capabilities are never re-exported from the root barrel.

The original multi-package responsibilities are preserved as boundaries without multiplying public release units:

| Original responsibility | Final home | Treatment |
|---|---|---|
| `@portal-ui/runtime` | None in v2 | Replaced by document-global CSS and explicit component props; no singleton runtime. |
| `@portal-ui/telemetry-schema` | Deferred proposal under `tooling/` or a future package | Not a v2 production dependency. |
| `@portal-ui/tokens` | Private `packages/tokens` → `@fm/ratan-design/tokens` | Exact public `--sc-*` contract and generated metadata. |
| `@portal-ui/styles` | Private `packages/styles` → CSS/theme/mode subpaths | Static scoped CSS with accurate side effects. |
| `@portal-ui/react` | Public `packages/react` facade over private component workspaces | Main typed React catalogue and only published release unit. |
| `@portal-ui/icons` | Private `packages/icons` → `@fm/ratan-design/icons` | Frozen built-in WebKit icon libraries. |
| `@portal-ui/patterns` | Private `packages/patterns` → root/subpath exports | Shared compositions that are in the manifest or approved after parity. |
| `@portal-ui/data-table` | Private `packages/data-grid` → `/table`, `/data-view` and `/data-grid` | Expanded to full frozen catalogue parity; expensive code stays isolated. |
| `@portal-ui/testing` | Private `packages/testing` → `@fm/ratan-design/testing` | Consumer-facing helpers only; internal runners live in workbench/tooling. |
| `@portal-ui/eslint-plugin` | Private `packages/standard` and boundary tooling | Publish separately only if external consumers demonstrate a need. |
| Optional framework adapters | Migration tooling or future separate packages | React v2 does not bundle framework adapters. |

## 7.2 Private workbench applications and packages

The original plan's development surfaces remain first-class workspaces:

- **Docs** owns durable product guidance, API reference, token reference, accessibility, migration and approved deviations.
- **Storybook package** owns shared configuration and exhaustive isolated examples for every component variant, state, size, theme, font mode and supported interaction.
- **Playground** owns realistic React 18/19, form, overlay, navigation, MFE mount/unmount, mixed WebKit/Ratan and packed-package consumer scenarios.
- **Parity lab** owns frozen WebKit/Ratan fixture pairs, computed-style capture, screenshots, accessibility comparison and performance benchmarks.

These workspaces are private and are never bundled into `@fm/ratan-design`. Storybook is an implementation workbench, not the design authority; observed frozen WebKit runtime behavior remains authoritative when evidence conflicts.

## 7.3 Private tooling

Generators, codemods, fixture builders, visual-test runners and release checks live outside the public package. Tooling may depend on the frozen WebKit baseline; production package code may not.

## 7.4 Frozen metadata

The checked-in parity manifest records, for every WebKit public export and registered tag:

- classification: included, excluded or supporting-only;
- source class and tag names;
- React component/subpath mapping;
- properties, attributes, defaults, variants and states;
- events, slots, methods and imperative handles;
- token and mode dependencies;
- runtime, story and migration fixtures;
- documented deviations and their approvals.

The migration map is generated from the same source and drives codemods, documentation and completeness tests.

## 7.5 Testing and enforcement

Testing helpers expose fixture rendering, keyboard sequences, overlay access, token inspection and parity assertions. Lint rules and dependency-boundary tests prohibit internal imports, Lit/Shoelace/WebKit dependencies, undefined tokens, unsupported raw controls, and inaccessible icon-only actions.

# 8. Component foundation

## 8.1 React Aria

React Aria Components and hooks are the standard private behavior foundation because the catalogue requires collection navigation, selection, date and range controls, locale-aware behavior, overlays, form semantics, keyboard interaction, focus management and screen-reader support.

Ratan owns all public names, props, markup expectations, styles and state semantics. React Aria classes, types and composition rules do not leak through the API.

Native HTML remains the rendered semantic foundation, but Ratan does not recreate interaction systems already supplied by React Aria. An interactive component must use the corresponding React Aria Component or hook when one exists. Direct native implementation is limited to non-interactive presentation or behavior for which React Aria has no applicable primitive. Any interactive exception requires an ADR entry, manifest rationale, keyboard/focus tests and owner approval.

Ratan CSS may style React Aria-rendered semantics and stable Ratan `data-*` states, but React Aria types, class names, DOM shape and state naming remain private. A package-boundary check rejects hand-written press, focus, collection, selection, overlay, date or keyboard-navigation infrastructure unless the component is listed in the approved exception manifest.

## 8.2 DataGrid

TanStack Table provides private row/column state and TanStack Virtual provides bounded row and column rendering. Ratan owns the public column, filtering, sorting, selection, editing, grouping, pinning, sizing, spanning, export and event contracts.

The initial architecture spike must prove Button, TextInput, Dialog, DatePicker, Tabs and a representative DataGrid slice against WebKit before cohort implementation scales.

## 8.3 Foundation gate

The foundation is accepted only when the spike proves:

- visual parity in every baseline theme/mode and state;
- keyboard, focus, form, locale and screen-reader behavior;
- document-body overlay behavior and cleanup;
- controlled and uncontrolled React APIs;
- strict ref and callback typing;
- CSP compatibility and no external runtime asset requirement;
- per-component tree shaking;
- lower common-route bundle cost and p95 interaction work below 10 ms;
- bounded DataGrid DOM and stable scrolling.

# 9. Micro-frontend runtime contract

## 9.1 Shared dependencies

Only `react` and `react-dom` are shared federation singletons. Ratan is compiled into each independently deployed application so one application's upgrade cannot replace another application's component implementation.

Supported peers:

```text
react >=18.2.0 <20
react-dom >=18.2.0 <20
```

## 9.2 No design runtime

There is no `@fm/ratan-design/runtime`, global bridge, runtime symbol, provider, event bus, toast singleton or compatibility negotiation service in v2.

Applications load the frozen global token/mode CSS once and import component CSS through component subpaths. Storybook and tests use the same CSS entry points.

## 9.3 Coexistence

WebKit and Ratan may render in the same document during migration. They share the `--sc-*` token contract but not implementation classes or state. Component CSS is scoped so neither implementation overrides the other's internals.

Compatibility failures are detected at build/test time through peer ranges, package-boundary checks, manifest completeness and packed-consumer tests rather than through runtime substitution.

# 10. Styling architecture

## 10.1 Technology decision

```text
exact --sc-* CSS variables
+ static CSS Modules
+ cascade layers
+ stable data attributes
+ component subpath CSS
```

No CSS-in-JS, Emotion, Styled Components, Tailwind runtime or dynamic style engine is used.

## 10.2 Isolation

React cannot rely on WebKit's Shadow DOM boundary. Every component rule is anchored to a Ratan-owned root class or data attribute, internal classes are locally scoped, and resets apply only to Ratan component roots. Global selectors are limited to the frozen theme/mode token definitions.

Example output:

```html
<button
  class="Button_root__hash"
  data-ratan-component="Button"
  data-variant="primary"
  data-tone="default"
  data-size="sm"
  data-loading="false"
  data-disabled="false"
>
  Confirm
</button>
```

## 10.3 Cascade order

```css
@layer ratan-reset, sc-theme, ratan-components, application-components, utilities;
```

The layer declaration loads before component and application CSS. The standard `styles.css` entry point includes layer order, frozen token foundations and minimal scoped resets. Theme/mode subpaths remain explicit and side-effectful.

## 10.4 Build behavior

Root imports do not load DataGrid or unrelated component CSS. Every subpath declares its own static CSS side effect. A complete CSS bundle is permitted only for Storybook, parity lab and non-code-split prototypes.

# 11. Token architecture

## 11.1 Authority

The frozen WebKit CSS assets are copied into Ratan and hashed in the parity manifest. Existing `--sc-*` names and values are authoritative; they are not renamed, normalized or reduced during parity.

Included token assets cover:

- GDS primitives and component variables;
- styleguide and typography foundations;
- light and dark component mappings;
- CPBB overrides;
- Inter, Roboto Mono and Dyslexic font modes;
- grid, follow-system and supported utility foundations;
- every component-state variable referenced by included source styles.

## 11.2 Typed metadata

`@fm/ratan-design/tokens` exports immutable metadata describing each custom property, source asset, category, supported modes and consumers. The JavaScript metadata never replaces CSS as the rendering authority.

## 11.3 Drift and completeness

Generation tests verify source hashes, duplicate/conflicting definitions, undefined component variables and parity-manifest coverage. Because the baseline is a one-time snapshot, tests compare against checked-in hashes rather than the live WebKit workspace after the snapshot is approved.

## 11.4 Customization

Consumers may override documented semantic and component `--sc-*` variables. Primitive variables and undocumented implementation variables remain unsupported. Ratan documentation identifies which existing variables are stable customization contracts without changing their names.

# 12. Theme, typography mode and compact behavior

## 12.1 Document-global themes

Ratan reproduces the frozen selectors and resolved values for:

```text
light
dark
CPBB overrides
follow-system where supported
```

Theme classes and variables are applied to `html` or `body`. Because overlays portal to `document.body` and no provider exists, per-subtree overlay themes are not supported.

## 12.2 Typography modes

Inter, Roboto Mono and Dyslexic mode assets preserve their WebKit font stacks and custom properties. Fonts are packaged or resolved from approved local/system sources; Ratan performs no public-CDN font requests.

## 12.3 Sizes and compact variants

Every observed WebKit size, padding, control height, row height and component-level compact option is preserved. Ratan does not add comfortable/compact global density modes until after parity. Any later density proposal requires an explicit mapping to the frozen variants and independent design approval.

# 13. Component API standards

## 13.1 Standard state names

Use:

```tsx
disabled
loading
invalid
required
readOnly
selected
expanded
size
variant
tone
```

Avoid parallel naming such as `isDisabled` or `hasError`.

## 13.2 Visual meaning

- `variant`: visual hierarchy
- `tone`: semantic status
- `size`: physical size

Component-specific names such as `compact`, `multiple`, `pill` and `border`
are retained when they are part of the frozen WebKit contract. Ratan does not
normalize distinct legacy capabilities into a new global density prop.

## 13.3 Controlled and uncontrolled state

```tsx
<Tabs defaultValue="summary" />
<Tabs value={tab} onValueChange={setTab} />
```

## 13.4 Ref support

Interactive components must expose the relevant underlying element through a React ref.

## 13.5 Native behavior

Components should retain appropriate native form and accessibility behavior.

## 13.6 Compound APIs

Complex components should expose stable parts:

```tsx
<Dialog>
  <Dialog.Trigger />
  <Dialog.Portal>
    <Dialog.Backdrop />
    <Dialog.Positioner>
      <Dialog.Popup>
        <Dialog.Title />
        <Dialog.Description />
      </Dialog.Popup>
    </Dialog.Positioner>
  </Dialog.Portal>
</Dialog>
```

## 13.7 Polymorphism

Unrestricted polymorphism such as:

```tsx
<Button as="div" />
```

should not be supported initially.

Prefer semantic components:

```tsx
<Button />
<ButtonLink />
<IconButton />
```

An `asChild` model may be considered only after parity and only if it preserves semantics, typing and disabled behavior.

---

# 14. Customization and override policy

## 14.1 Customization hierarchy

```text
1. Component props
2. Approved variants and tones
3. Semantic tokens
4. Documented slots
5. Local application wrapper
6. Shared pattern or approved variant
```

## 14.2 Supported

- Documented props
- Semantic token overrides
- Root `className` where exposed
- Documented `classNames` slots
- Data-driven cell and row renderers
- Local wrappers
- Approved custom content

## 14.3 Requires review

- New shared variants
- Pattern-level visual changes
- New token categories
- Reusable tenant wrappers
- DataGrid behaviors likely to become standard
- Changes to frozen size or compact behavior

## 14.4 Prohibited

- Internal hashed-class selectors
- Global overrides of component internals
- DOM-position-dependent selectors
- Unapproved `!important`
- Tenant overrides of primitive palette values
- Copies of internal component source
- Dependencies on undocumented DOM structure

---

# 15. Internationalization

Ratan has no locale provider or shared locale runtime. Locale-sensitive
components default to the browser locale and inherited direction, and expose
typed props for an application to override locale, time zone, formatting and
generic accessibility messages where the frozen component requires them.

The exact per-component props are recorded in the parity manifest. Ratan may
share private formatting/message utilities, but applications do not configure a
global Ratan singleton.

Responsibility split:

| Concern | Owner |
|---|---|
| Date and number formatting | Component props and native `Intl` |
| Accessibility messages | Design system |
| Generic component labels | Design system catalog |
| Application content | Tenant |
| Business validation messages | Tenant |
| Time zone | Browser default or component prop |
| Locale selection | Browser default, component prop or application preference |

Components must not hardcode strings such as:

- No results
- Loading
- Clear selection
- Previous page
- Next page
- Selected rows
- Invalid value

---

# 16. Motion and reduced motion

Preserve the motion properties present in the frozen token inventory. The
following illustrates intent-based naming only; it must not create variables
that are absent from the baseline:

```css
--sc-motion-duration-feedback
--sc-motion-duration-overlay
--sc-motion-duration-navigation
--sc-motion-easing-enter
--sc-motion-easing-exit
```

Respect:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --sc-motion-duration-feedback: 0ms;
    --sc-motion-duration-overlay: 0ms;
    --sc-motion-duration-navigation: 0ms;
  }
}
```

Component functionality must not depend on animation completion.

---

# 17. Form integration

The core design system remains form-library-neutral.

Controls must support:

- `name`
- `value`
- `defaultValue`
- `onChange`
- `onBlur`
- `disabled`
- `required`
- `readOnly`
- Form submission
- Form reset
- Forwarded refs
- Validation state
- `aria-describedby`
- Native form values for custom controls

React Hook Form integration should work naturally:

```tsx
<Controller
  name="currency"
  control={control}
  render={({ field, fieldState }) => (
    <Select
      {...field}
      invalid={fieldState.invalid}
      errorMessage={fieldState.error?.message}
    />
  )}
/>
```

React Hook Form must not be a core dependency.

---

# 18. Overlay architecture

## 18.1 Document-body portal contract

Dialogs, menus, popovers, tooltips and other portalled surfaces render into
`document.body`. No shell registration, provider or shared overlay root is
required. The implementation creates and removes only the minimal nodes it
owns, remains safe across multiple independent React roots and cleans up after
component unmount.

Because theme and font modes are document-global, portalled content resolves
the same `--sc-*` variables as its trigger. Per-subtree overlay theming and a
consumer-selected portal container are intentionally unsupported for v2.

## 18.2 Overlay contract

Define:

- Container resolution
- Z-index layers
- Modal nesting
- Focus trapping
- Focus restoration
- Escape-key handling
- Outside-press handling
- Scroll locking
- Toast stacking
- Full-screen behavior
- Navigation cleanup
- Tile-unmount cleanup
- Nested overlays

## 18.3 Layering and coexistence

The frozen WebKit z-index values and overlay geometry are parity inputs. Ratan
uses those values through `--sc-*` variables and scoped styles. Overlay stacks
from separate React roots must not share mutable design-system state; native DOM
order plus the documented layer contract determines stacking.

## 18.4 Accessibility and lifecycle

Focus trapping, initial focus, focus restoration, escape handling, outside
press, scroll locking, nested overlays and cleanup follow React Aria behavior
unless the manifest records a stricter legacy requirement. Every intentional
correction is captured as a tested deviation.

---

# 19. Deferred optional telemetry architecture

> **Post-v2 design material:** Sections 19–28 are retained from the original plan so the privacy, hierarchy, schema and reliability thinking is not lost. They are non-normative for Ratan Design v2. Core components do not extend telemetry props, dispatch telemetry events, or require telemetry identifiers. A future adapter must be separately proposed and may only observe public callbacks/native events without changing component behavior.

## 19.1 Original objective



Ratan Design telemetry provides a standardized understanding of how users interact with components across micro-frontends.

Focus areas:

- Action events
- Safe component values
- Loading state
- Disabled state
- Component hierarchy
- Page and application context
- Interaction outcomes
- Relevant performance duration

## 19.2 Architecture

```text
User interaction
       ↓
Ratan Design component
       ↓
Semantic CustomEvent
       ↓
DOM bubbling and capture
       ↓
Root shell listener
       ↓
Schema validation
       ↓
Privacy sanitization
       ↓
Batching and sampling
       ↓
Approved analytics and observability pipeline
```

## 19.3 Central subscription point

The shell subscribes once:

```ts
document.documentElement.addEventListener(
  "portal-ui:telemetry",
  handlePortalUITelemetry,
  { capture: true },
);
```

Capture mode reduces the risk that tenant event handlers prevent observation.

Components also dispatch to the runtime-owned telemetry target as a reliability channel. The central DOM event remains the public integration and diagnostic contract.

## 19.4 Event transport

```ts
element.dispatchEvent(
  new CustomEvent("portal-ui:telemetry", {
    bubbles: true,
    composed: true,
    cancelable: false,
    detail: event,
  }),
);
```

Requirements:

| Property | Value |
|---|---|
| Event name | `portal-ui:telemetry` |
| `bubbles` | `true` |
| `composed` | `true` |
| `cancelable` | `false` |
| Payload | `event.detail` |
| Dispatch target | Semantic component root |
| Processing | Asynchronous and non-blocking |

## 19.5 Event names

Use a small stable set:

```ts
type PortalUIEventName =
  | "ui.action"
  | "ui.state"
  | "ui.lifecycle"
  | "ui.performance"
  | "ui.error";
```

The structured action describes the specific event.

Avoid an unbounded list such as `button.click`, `select.change` and `table.sort`.

---

# 20. Telemetry event schema

## 20.1 Base event

```ts
interface PortalUITelemetryEvent {
  schemaVersion: "1.0";

  eventId: string;
  eventName: PortalUIEventName;
  timestamp: string;

  action: TelemetryAction;
  component: TelemetryComponent;
  state: TelemetryState;
  value?: TelemetryValue;
  hierarchy: TelemetryHierarchy;

  context: TelemetryContext;
  interaction: TelemetryInteraction;
  outcome?: TelemetryOutcome;
  performance?: TelemetryPerformance;

  extensions?: Record<string, unknown>;
}
```

## 20.2 Action

```ts
type TelemetryActionType =
  | "press"
  | "focus"
  | "blur"
  | "input"
  | "change"
  | "selection-change"
  | "open"
  | "close"
  | "submit"
  | "reset"
  | "sort"
  | "filter"
  | "paginate"
  | "expand"
  | "collapse"
  | "resize"
  | "reorder"
  | "loading-start"
  | "loading-end"
  | "validation-error"
  | "copy"
  | "download";

interface TelemetryAction {
  type: TelemetryActionType;
  trigger?:
    | "pointer"
    | "keyboard"
    | "touch"
    | "programmatic"
    | "unknown";
  reason?: string;
}
```

## 20.3 Component

```ts
interface TelemetryComponent {
  type: string;
  id?: string;
  name?: string;
  variant?: string;
  tone?: string;
  size?: string;
  role?: string;
  slot?: string;
  packageVersion?: string;
}
```

`id` must be a stable application-defined identifier, not a generated accessibility ID.

## 20.4 State

```ts
interface TelemetryState {
  disabled: boolean;
  loading: boolean;
  readOnly: boolean;
  invalid: boolean;

  required?: boolean;
  expanded?: boolean;
  selected?: boolean;
  checked?: boolean | "indeterminate";
  visible?: boolean;
  blocked?: boolean;

  loadingReason?: string;
  disabledReason?: string;
}
```

Reasons must be stable categorical values, not free-form messages.

## 20.5 Hierarchy

```ts
interface TelemetryHierarchy {
  path: TelemetryHierarchyNode[];
  depth: number;
}

interface TelemetryHierarchyNode {
  type: string;
  id?: string;
  name?: string;
  slot?: string;
}
```

Example:

```json
{
  "path": [
    {
      "type": "ApplicationPage",
      "id": "trade-search"
    },
    {
      "type": "FilterBar",
      "id": "primary-filters"
    },
    {
      "type": "Field",
      "id": "currency-field"
    },
    {
      "type": "Select",
      "id": "currency-select"
    }
  ],
  "depth": 4
}
```

## 20.6 Context

Context may include:

```ts
interface TelemetryContext {
  portal: string;
  portalVersion?: string;
  application: string;
  applicationVersion?: string;
  tenant?: string;
  route?: string;
  page?: string;
  feature?: string;
  environment?: string;
  locale?: string;
  timeZone?: string;
  density?: string;
  theme?: string;
}
```

Trusted shell context must overwrite equivalent tenant values.

## 20.7 Interaction

```ts
interface TelemetryInteraction {
  sessionId?: string;
  interactionId?: string;
  correlationId?: string;
}
```

Identifiers must be opaque and must not contain user identity or business data.

## 20.8 Outcome and performance

```ts
interface TelemetryOutcome {
  status:
    | "success"
    | "failure"
    | "cancelled"
    | "blocked"
    | "unknown";
  reason?: string;
}

interface TelemetryPerformance {
  durationMs?: number;
}
```

---

# 21. Telemetry value rules

## 21.1 Value union

```ts
type TelemetryValue =
  | TelemetryTextValue
  | TelemetryScalarValue
  | TelemetrySelectionValue
  | TelemetryRangeValue
  | TelemetryTableValue
  | TelemetryRedactedValue;
```

## 21.2 Button

The value is the safe action label:

```ts
interface TelemetryTextValue {
  type: "text";
  value: string;
  source:
    | "telemetry-label"
    | "aria-label"
    | "visible-text"
    | "component-prop";
}
```

Resolution order:

```text
telemetry.label
    ↓
aria-label
    ↓
explicit component label
    ↓
safe visible text
    ↓
undefined
```

Example:

```tsx
<Button
  telemetry={{
    id: "confirm-settlement",
    label: "Confirm settlement",
  }}
>
  Confirm trade 5839201
</Button>
```

Collected value:

```json
{
  "type": "text",
  "value": "Confirm settlement",
  "source": "telemetry-label"
}
```

The visible trade identifier is not collected.

## 21.3 Input

Raw values are prohibited by default.

```json
{
  "type": "redacted",
  "reason": "user-input"
}
```

Safe metadata may include:

```json
{
  "empty": false,
  "valueLength": 12,
  "changed": true
}
```

## 21.4 Select

Single selection:

```json
{
  "type": "selection",
  "optionValue": "USD",
  "selectedValues": ["USD"],
  "previousValues": ["HKD"],
  "selectedCount": 1
}
```

Multiple selection:

```json
{
  "type": "selection",
  "optionValue": "SGD",
  "selectedValues": ["USD", "HKD", "SGD"],
  "previousValues": ["USD", "HKD"],
  "selectedCount": 3
}
```

Collect stable option values by default, not display labels.

## 21.5 Checkbox and switch

```json
{
  "type": "scalar",
  "value": true
}
```

Indeterminate:

```json
{
  "type": "scalar",
  "value": "indeterminate"
}
```

## 21.6 Data table

```ts
interface TelemetryTableValue {
  type: "table";

  columnId?: string;
  columnIds?: string[];
  sortDirection?: "ascending" | "descending" | "none";

  selectedRowCount?: number;
  visibleRowCount?: number;
  totalRowCount?: number;

  pageIndex?: number;
  pageSize?: number;

  filterId?: string;
  filterOperator?: string;
  filterValueClassification?: string;
}
```

Raw row data and row identifiers are not collected by default.

---

# 22. Telemetry hierarchy and DOM contract

## 22.1 Stable attributes

```text
data-ratan-component
data-ratan-slot
data-ratan-telemetry-id
data-ratan-telemetry-name
data-ratan-loading
data-ratan-disabled
data-ratan-state
```

Example:

```html
<section
  data-ratan-component="ApplicationPage"
  data-ratan-telemetry-id="trade-search"
>
  <div
    data-ratan-component="FilterBar"
    data-ratan-telemetry-id="primary-filters"
  >
    <button
      data-ratan-component="Select"
      data-ratan-telemetry-id="currency-select"
    >
      USD
    </button>
  </div>
</section>
```

## 22.2 Hierarchy resolution

Use:

```ts
event.composedPath()
```

and select elements carrying telemetry metadata.

This supports:

- Normal DOM ancestry
- Independent React roots
- Open Shadow DOM boundaries
- Micro-frontends
- Runtime diagnostics

## 22.3 Portalled content

For Dialog, Popover, Menu, Select and Tooltip, the source hierarchy must be captured when the overlay opens.

Overlay events contain:

```ts
interface OverlayTelemetryHierarchy {
  source: TelemetryHierarchy;
  rendered: TelemetryHierarchy;
}
```

## 22.4 Context scopes

Tenant roots may declare:

```html
<div
  data-portal-application="settlement-cn"
  data-portal-application-version="4.8.1"
  data-portal-tenant="settlement"
  data-portal-telemetry-scope
>
```

Sensitive values must never be placed in DOM telemetry attributes.

---

# 23. Telemetry loading and disabled behavior

## 23.1 Loading transitions

Emit only meaningful user-visible transitions.

Start:

```json
{
  "eventName": "ui.state",
  "action": {
    "type": "loading-start"
  },
  "state": {
    "loading": true,
    "disabled": true,
    "readOnly": false,
    "invalid": false,
    "loadingReason": "form-submission"
  }
}
```

End:

```json
{
  "eventName": "ui.state",
  "action": {
    "type": "loading-end"
  },
  "state": {
    "loading": false,
    "disabled": false,
    "readOnly": false,
    "invalid": false
  },
  "outcome": {
    "status": "success"
  },
  "performance": {
    "durationMs": 842
  }
}
```

Do not emit loading events for every internal render.

## 23.2 Disabled state

Native disabled semantics must not be weakened to capture clicks.

Emit state changes when useful:

```json
{
  "eventName": "ui.state",
  "action": {
    "type": "change",
    "reason": "disabled-state"
  },
  "state": {
    "disabled": true,
    "loading": false,
    "readOnly": false,
    "invalid": false,
    "disabledReason": "form-invalid"
  }
}
```

For operationally important blocked actions, use an explicit wrapper:

```tsx
<BlockedAction
  reason="insufficient-permission"
  onAttempt={handleBlockedAttempt}
>
  <Button disabled>Approve</Button>
</BlockedAction>
```

Do not make every disabled control artificially clickable.

---

# 24. Telemetry component API

All interactive components support:

```ts
interface RatanTelemetryProps {
  telemetry?: {
    id?: string;
    name?: string;
    label?: string;

    disabled?: boolean;

    disabledReason?: string;
    loadingReason?: string;

    value?: TelemetryValue | (() => TelemetryValue);

    extensions?: Record<string, unknown>;
  };

  onTelemetry?: (
    event: PortalUITelemetryEvent,
  ) => void;
}
```

Disable telemetry:

```tsx
<Button telemetry={{ disabled: true }}>
  Internal diagnostic action
</Button>
```

A local `onTelemetry` handler must not suppress central telemetry.

---

# 25. Telemetry lifecycle

```text
1. User interacts with component
2. Component resolves semantic action
3. Component snapshots state
4. Safe value is generated
5. Logical hierarchy is resolved
6. Portal and application context is resolved
7. Optional local callback runs
8. DOM CustomEvent is dispatched
9. Runtime reliability event is dispatched
10. Shell validates schema
11. Privacy sanitizer runs
12. Trusted shell context is applied
13. Event is queued
14. Batch is transmitted asynchronously
```

Local callback errors must not break component behavior or central dispatch.

---

# 26. Telemetry privacy and trust

## 26.1 Trusted shell-enriched fields

The shell owns:

- Portal name and version
- Environment
- Runtime version
- Session identifier
- Receipt timestamp
- Locale
- Time zone
- Theme
- Density

## 26.2 Tenant-supplied fields

Treat as untrusted:

- Application name
- Component IDs
- Labels
- Values
- Reasons
- Extensions

Validate and sanitize all tenant-supplied data.

## 26.3 Prohibited data

Do not emit:

- User-entered free text
- Client names
- Client identifiers
- Account numbers
- Trade identifiers
- Transaction descriptions
- Email addresses
- Bank IDs
- Authentication tokens
- Authorization details
- API payloads
- Raw error stack traces
- Table row contents
- Uploaded filenames without approval

## 26.4 Data classifications

```ts
type TelemetryDataClassification =
  | "public"
  | "internal"
  | "confidential"
  | "restricted";
```

The standard UI telemetry pipeline accepts only:

```text
public
internal
```

---

# 27. Telemetry performance and reliability

Requirements:

- Non-blocking dispatch
- In-memory queue
- Batched transmission
- Sampling support
- Rate limiting
- Payload validation
- Failure isolation
- Bounded memory usage
- No synchronous network activity

Recommended initial limits:

```text
Maximum serialized event: 8 KB
Typical action event: below 2 KB
Maximum hierarchy depth: 12
Maximum extension fields: 20
Maximum string length: 256 characters
Default batch size: 20–50 events
Default flush interval: 5–10 seconds
```

Analytics failure must never block a user action.

---

# 28. Telemetry diagnostics

Development diagnostics may expose:

```ts
window.portalUI.telemetry.inspect();
window.portalUI.telemetry.subscribe(console.log);
window.portalUI.telemetry.getQueueSize();
window.portalUI.telemetry.getSchemaVersion();
```

A diagnostic panel may show:

- Events received
- Events rejected
- Events redacted
- Queue size
- Last flush
- Sampling state
- Schema version
- Application source
- Component hierarchy

Production access must be restricted.

---

# 29. Button API

Button demonstrates how idiomatic React names preserve the complete observed WebKit contract.

```ts
type ButtonVariant = "primary" | "secondary" | "text" | "link";
type ButtonTone = "default" | "error" | "alert" | "success";
type ButtonSize = "xxs" | "xs" | "sm" | "md" | "lg";

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  width?: React.CSSProperties["width"];
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  pill?: boolean;
  border?: boolean;
  compact?: boolean;
  snack?: boolean;
  truncate?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  readOnly?: boolean;
  selectable?: boolean | "toggle";
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
}
```

Defaults come from observed WebKit runtime behavior: `variant="primary"`, `tone="default"`, `size="sm"`, pill and border enabled, and native `type="button"` for React form safety.

Migration mapping:

| WebKit | Ratan React |
|---|---|
| `type` | `variant` |
| `state` | `tone` |
| `left-icon` / `right-icon` | `startIcon` / `endIcon` |
| `no-pill` | `pill={false}` |
| `no-border` | `border={false}` |
| `selected` | `selected` / `defaultSelected` |

The observed but undocumented `type="tertiary"` usage is recorded as a conflict: WebKit's converter renders it as primary, so the codemod emits `variant="primary"` rather than inventing a fifth style.

When loading, the button stays mounted, preserves layout width, prevents repeated activation, uses `aria-disabled`, retains focus where possible, shows a progress indicator and announces `loadingLabel` (defaulting to a catalog-provided message) through an `aria-live` region. It also respects the matching frozen pressed/loading styles. Icon-only actions use the dedicated IconButton API and require an accessible name.

# 30. Select API

## 30.1 Scope

`Select` supports predefined single or multiple selection.

Free-text search and arbitrary input belong to `Combobox`.

## 30.2 Compound API

```tsx
<Select
  name="currency"
  value={currency}
  onValueChange={setCurrency}
>
  <Select.Trigger>
    <Select.Value placeholder="Select currency" />
    <Select.Icon />
  </Select.Trigger>

  <Select.Portal>
    <Select.Positioner>
      <Select.Popup>
        <Select.List>
          <Select.Item value="USD">
            <Select.ItemIndicator />
            <Select.ItemText>US Dollar</Select.ItemText>
          </Select.Item>

          <Select.Item value="HKD">
            <Select.ItemIndicator />
            <Select.ItemText>Hong Kong Dollar</Select.ItemText>
          </Select.Item>
        </Select.List>
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
</Select>
```

## 30.3 Convenience API

```tsx
<Select
  label="Currency"
  name="currency"
  options={[
    { value: "USD", label: "US Dollar" },
    { value: "HKD", label: "Hong Kong Dollar" },
  ]}
  value={currency}
  onValueChange={setCurrency}
/>
```

The compound API remains canonical.

## 30.4 Root API

```ts
interface SelectRootProps<TValue extends string> {
  name?: string;

  value?: TValue | TValue[];
  defaultValue?: TValue | TValue[];

  onValueChange?: (
    value: TValue | TValue[],
    details: SelectValueChangeDetails<TValue>,
  ) => void;

  multiple?: boolean;

  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;

  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (
    open: boolean,
    details: SelectOpenChangeDetails,
  ) => void;

  placeholder?: string;
  form?: string;
  children?: React.ReactNode;
}
```

```ts
interface SelectValueChangeDetails<
  TValue extends string,
> {
  selectedValue?: TValue;
  selectedValues: TValue[];
  previousValues: TValue[];

  trigger:
    | "pointer"
    | "keyboard"
    | "programmatic";
}
```

## 30.5 Item API

```ts
interface SelectItemProps<TValue extends string> {
  value: TValue;
  disabled?: boolean;
  textValue?: string;
  children: React.ReactNode;
}
```

`textValue` is used for typeahead and accessibility.

## 30.6 Form behavior

The component must support:

- Native form submission
- Form reset
- Required validation
- Disabled exclusion
- Controlled state
- Uncontrolled state
- Multiple values

A hidden form control may be used where required.

## 30.7 Overlay behavior

`Select.Portal` defaults to `document.body`.

It must preserve:

- Theme
- Locale
- Z-index layer

## 30.8 Callback details

Selection and open-state callbacks expose Ratan-owned reason details for
application logic and testing. They are ordinary React callbacks and do not
dispatch analytics events.

Close reasons may include:

```text
selection
escape-key
outside-press
focus-loss
programmatic
```

---

# 31. DataGrid API and strategy

DataGrid is an in-scope parity subsystem exported from `@fm/ratan-design/data-grid`. It is not reduced to the original plan's first-release table subset.

## 31.1 Public contract

Ratan owns typed row, column and change-detail types. TanStack objects do not appear in public props or callbacks.

The contract includes:

- typed accessors and custom cells;
- client and server sorting, filtering and pagination;
- single/multiple selection and selection strategies;
- column ordering, visibility, sizing, pinning and spanning;
- row pinning, spanning, grouping, tree grouping, expansion and dragging;
- editing and validation hooks;
- keyboard navigation and focus behavior;
- simple and advanced filters with custom filter widgets;
- master/detail and overlapping views;
- CSV and Excel export hooks;
- column manager and action slots;
- loading, refreshing, empty and error presentation;
- bounded row/column virtualization for large data.

## 31.2 Controlled state

Each stateful feature supports controlled and uncontrolled forms with feature-specific callbacks carrying Ratan-owned reason/trigger details. Server modes never apply client transformations implicitly.

## 31.3 Accessibility

The rendered semantic model, keyboard grid behavior, focus persistence, selection announcements, editing transitions and virtualized off-screen behavior require dedicated manual review in addition to automated tests.

## 31.4 Performance

The agreed large-data fixture must use bounded DOM rendering, sustain at least 55 FPS during scripted scrolling, keep p95 synchronous interaction work below 10 ms and release observers/listeners after unmount. Root package imports must never pull DataGrid code.

## 31.5 Loading versus refreshing

- `loading`: no usable primary result is available.
- `refreshing`: existing data remains visible while an update runs.

These states must be visually and semantically distinct. The root API exposes `loadingState`, `errorState` and `emptyState` ReactNode props so applications can customize these surfaces, and `refreshing` marks the table `aria-busy` while keeping prior data visible.

## 31.6 Default out-of-scope

The following are not built during parity unless the frozen WebKit manifest demonstrably records them as supported behavior:

- spreadsheet-style editing and formula support
- arbitrary merged cells beyond manifest-recorded spanning
- pivot tables
- full grid personalization
- complex cross-row validation

Anything absent from the frozen manifest is out of scope by definition.

# 32. Component parity roadmap

The generated manifest, not a hand-maintained shortlist, defines completeness. Delivery is organized into cohorts without changing the stable-release boundary.

## 32.1 Proof cohort

```text
Button
TextInput
Dialog
DatePicker
Tabs
representative DataGrid slice
```

## 32.2 Actions, display and feedback

Buttons, icons, typography, links, labels, badges, tags, avatars, cards, boxes, dividers, spacing, loaders, progress, alerts, banners, snackbar/toast and related supporting parts.

## 32.3 Forms, selection and date/time

Text/password/number/formatted/card inputs, search, checkbox/radio groups, switch/toggle, dropdown and multi-select, date/range pickers, time input, rating, slider, input groups and validation presentation.

## 32.4 Navigation, overlays and layout

Tabs, breadcrumbs, menus, pagination, accordion, stepper, carousel, navigation, dialog/modal/sheets, tooltip, grids, column/search/landing layouts, sticky/draggable surfaces and scroll helpers.

## 32.5 Files, lists and data display

File controls, lists, repeater, tree, table, DataView, status filters, action bars and remaining included composite components.

## 32.6 Full DataGrid

All manifest-recorded DataGrid features and supporting elements are completed before stable release.

Excluded components remain visible in the manifest with rationale so catalogue totals cannot be manipulated by omission.

# 33. Repository structure

The hierarchy keeps the original plan's `apps`, `packages` and `tooling` separation and adapts the verified [HeroUI v3 repository hierarchy](https://github.com/heroui-inc/heroui/tree/v3): runnable documentation is an app; React distribution, styles, Storybook and shared standards are explicit package workspaces; React source separates components, hooks and utilities; and the root owns orchestration. Ratan intentionally differs from HeroUI by publishing only one npm package.

```text
ratan-design/
├── plan.md
├── package.json                # private workspace orchestration and scripts
├── tsconfig.json               # root project references
├── turbo.json                  # build/test/lint/docs dependency graph
├── apps/
│   ├── docs/                   # durable documentation product
│   │   ├── content/
│   │   ├── public/
│   │   ├── scripts/
│   │   └── src/
│   ├── playground/             # packed-package React/MFE consumer sandbox
│   │   ├── src/scenarios/
│   │   └── tests/
│   └── parity-lab/             # frozen WebKit/Ratan comparison harness
│       ├── fixtures/
│       ├── benchmarks/
│       └── tests/
├── packages/
│   ├── react/                  # ONLY PUBLIC PACKAGE: @fm/ratan-design
│   │   ├── src/
│   │   │   ├── entries/        # root and generated subpath facades
│   │   │   ├── hooks/          # approved public-hook facades
│   │   │   ├── version.ts
│   │   │   └── index.ts
│   │   ├── scripts/            # export and package assembly
│   │   ├── tests/              # package/consumer contract tests
│   │   └── package.json
│   ├── foundation/             # private React Aria adapters and utilities
│   ├── components/             # private component implementations
│   │   └── src/                # one directory per public component
│   ├── tokens/                 # private frozen token sources + metadata
│   ├── styles/                 # private reset/layers/themes/modes/foundations
│   ├── icons/                  # private icon sources and generators
│   ├── patterns/               # private shared compositions
│   ├── data-grid/              # private heavy subsystem implementation
│   ├── testing/                # private source for public testing helpers
│   ├── storybook/              # private catalogue, stories and interactions
│   │   ├── .storybook/
│   │   ├── stories/
│   │   └── tests/
│   ├── standard/               # private ESLint/Prettier/TS/boundary standards
│   └── vitest/                 # private shared test configuration
├── migration/
│   ├── mappings/
│   │   ├── webkit/
│   │   ├── legacy-ratan/
│   │   ├── mui/
│   │   └── ant-design/
│   ├── codemods/
│   └── playbook/
├── manifests/
│   ├── parity-manifest.json
│   ├── migration-map.json
│   └── deviations.json
└── tooling/
    ├── baseline/               # frozen inventory and token extraction
    ├── generators/             # manifests, exports, docs and story scaffolds
    ├── visual-tests/           # screenshot/computed-style orchestration
    ├── adoption-dashboard/     # manifest/app migration coverage reports
    └── release/                # boundary, bundle, SBOM and pack checks
```

## 33.1 Hierarchy rules

- `apps/` contains runnable products that validate or explain the library; apps are never imported by packages.
- `packages/` contains buildable library/configuration boundaries. Only `packages/react` is published.
- Private implementation packages use `private: true`, have no independent SemVer and cannot appear as unresolved dependencies in the packed public package.
- `packages/foundation` wraps React Aria and depends only on approved third-party primitives and low-level token/style contracts.
- `packages/components` depends on foundation, tokens, styles and icons; `patterns` and `data-grid` may depend on components, never on the public facade.
- `packages/react` is the top-level public facade. It assembles explicit root and subpath exports from private workspaces without flattening ownership or pulling DataGrid into common imports.
- `migration/` owns source-library-specific mappings, codemods and operational rollout guidance; migration logic does not enter component runtime code.
- `manifests/` is the checked-in contract shared by builds, docs, Storybook, parity tests and the adoption dashboard.
- `tooling/` may depend on WebKit and repository internals; production packages may not.
- Dependency direction is enforced: `apps/storybook → react facade → patterns/data-grid/components/testing → foundation/styles/icons/tokens`; no reverse imports and no cycles.

The repository uses its existing npm workspaces and Turborepo pipeline. It does not introduce a nested pnpm workspace. HeroUI informs the separation of docs, React, styles, Storybook and shared standards; its Tailwind choice, multi-public-package release model and component visuals are not adopted.

The current bootstrap `package/` and `parity-lab/` folders are temporary. Before the foundation phase exits, they move without API changes to `packages/react/` and `apps/parity-lab/`; the private foundation packages, docs, Storybook and playground workspaces must exist and run in CI. This structural move is not authorization to delete the legacy Realworld package; that remains gated on consumer migration.

Typical component structure:

```text
packages/components/src/button/
├── button.tsx
├── button.types.ts
├── button.module.css
├── button.contract.test.tsx
├── button.a11y.test.tsx
├── button.parity.test.tsx
└── index.ts

packages/storybook/stories/button/
├── button.stories.tsx
└── button.interactions.ts

apps/parity-lab/fixtures/button/
├── webkit.fixture.ts
└── ratan.fixture.tsx
```

# 34. Package and build requirements

The public package must:

- produce ESM and TypeScript declarations;
- expose explicit root and subpath exports;
- support tree shaking and mark CSS side effects accurately;
- keep React and ReactDOM external peers;
- prevent root imports from including DataGrid;
- bundle or copy every required private-workspace artifact so the packed tarball has no unresolved private workspace dependency;
- contain no Lit, Shoelace, WebKit, Emotion, MUI, Ant Design or federation runtime dependency;
- copy frozen styles and icons into the published package with checked hashes;
- publish package, manifest and migration-map version metadata;
- use only local/package assets by default;
- pass packed-consumer, license, vulnerability and dependency-boundary checks;
- produce an SBOM for promotion.

The build fails when generated manifests drift, tokens are undefined, a public export lacks a parity classification, an excluded dependency enters the graph, or a documented subpath cannot be imported independently.

# 35. Versioning and compatibility

## 35.1 Component semantic versioning

### Patch

- Defect fixes
- Accessibility corrections
- Minor visual corrections within approved tolerance
- Documentation fixes

### Minor

- New compatible components
- New optional props
- New tokens with defaults
- New patterns
- Compatible accessibility improvements

### Major

- Removed APIs
- Renamed public props
- Breaking DOM contracts
- Required token changes
- Major behavior changes
- Changes to the frozen parity scope or package contract

## 35.2 Optional telemetry extension versioning

If the deferred telemetry proposal is later approved, its schema and adapter
must be versioned independently from the core component package. It must never
become a prerequisite for importing or rendering Ratan components.

### Patch

- Clarifications
- Validator fixes
- Additional examples

### Minor

- New optional fields
- New compatible action values
- New optional event types

### Major

- Removed fields
- Changed field meaning
- Changed required fields
- Changed value representation
- Incompatible privacy classification

## 35.3 Deprecation

Every deprecation must provide:

- Warning where practical
- Documentation notice
- Replacement guidance
- Removal target
- Codemod where feasible

## 35.4 Compatibility matrix

Publish:

```text
Portal shell version
Supported @fm/ratan-design versions
Supported React versions
Supported browser versions
Frozen WebKit baseline identifier
Parity-manifest schema version
```

---

# 36. Documentation requirements

Documentation is a product surface, not a generated afterthought. The private docs app, Storybook, playground and parity lab have distinct responsibilities and all are required in CI.

## 36.1 Docs application

Every component page must include:

1. Purpose
2. When to use
3. When not to use
4. Anatomy
5. Variants
6. States
7. Size and compact behavior
8. Keyboard behavior
9. Accessibility
10. Internationalization
11. Content guidance
12. Customization slots
13. Examples
14. API
15. Tokens
16. WebKit-to-React mapping
17. Intentional deviations
18. Migration notes
19. Known limitations

Documentation should use real portal scenarios:

- Trade search
- Settlement confirmation
- Exception handling
- Permission restriction
- Bulk operations
- Incremental refresh
- Audit-history viewing
- Long-running processes

Docs examples are compiled against the packed public package. API tables, token dependencies, WebKit mappings and deviations are generated from checked-in metadata, while narrative usage guidance remains reviewed source.

## 36.2 Storybook

Every included component must have stories covering all manifest-recorded:

- variants, tones, sizes, defaults and states;
- light, dark and CPBB themes;
- Inter, Roboto Mono and Dyslexic font modes where supported;
- loading, disabled, read-only, invalid, empty and long-content cases;
- controlled/uncontrolled behavior and relevant form participation;
- keyboard, focus, pointer and overlay interactions;
- RTL, locale-sensitive and reduced-motion behavior where applicable.

Storybook runs accessibility and interaction tests and provides the human review catalogue. A story is not parity evidence by itself and may not redefine behavior that differs from the frozen runtime.

## 36.3 Playground

The playground validates Ratan as a real consumer rather than an in-repository source import. It must install or consume a packed build and provide routes for:

- React 18.2 and React 19 compatibility;
- forms, validation, reset and submission;
- nested overlays, menus, dialogs and focus restoration;
- navigation, tabs, file/list/table flows and a large DataGrid;
- all document-global themes and font modes, RTL and locale overrides;
- repeated MFE mount/unmount and listener/observer cleanup;
- mixed WebKit/Ratan coexistence during migration;
- root versus subpath imports, CSS loading and bundle inspection;
- realistic Portal Host and enterprise workflow compositions.

Playground scenarios may become E2E fixtures, but it is not a replacement for the Portal Host migration verification.

## 36.4 Parity lab

For every visual/interactive manifest fixture, the parity lab renders frozen WebKit and Ratan under identical font, viewport, DPR, theme, mode and browser conditions. It owns screenshots, computed styles, token-resolution capture, accessibility results and performance traces. Approved differences link directly to deviation records.

## 36.5 Workbench completeness rule

A component cannot be marked complete in the parity manifest until its contract tests, relevant Storybook stories, docs page, playground scenario when integration behavior matters, parity fixtures, accessibility evidence and performance checks are present. Supporting-only items may satisfy this through the parent component that consumes them.

---

# 37. AI-ready development support

Publish:

```text
llms.txt
components.json
tokens.json
examples.json
deprecated-apis.json
parity-manifest.json
migration-map.json
migration-mappings/webkit.json
migration-mappings/legacy-ratan.json
migration-mappings/mui.json
migration-mappings/ant-design.json
```

Internal coding guidance should explain:

- Approved imports
- Correct component usage
- Accessibility expectations
- Form patterns
- Layout conventions
- Token usage
- Prohibited overrides
- WebKit attribute/event/slot mappings
- Legacy Ratan migration mappings
- MUI migration mappings
- Ant Design migration mappings

MUI and Ant Design mappings cover existing portal applications (including legacy `@fm/ratan-design@1.1.0` consumers built on Ant Design) so their component names, props and form patterns map onto the Ratan catalogue during migration, not only WebKit surfaces.

Generated code remains subject to normal linting, testing and review.

---

# 38. Accessibility quality gates

Applicable components must pass:

- Automated Axe tests
- Keyboard-only tests
- Focus-visible validation
- Focus restoration tests
- Screen-reader smoke tests
- Windows high-contrast tests
- Browser zoom at 200%
- Reduced-motion tests
- Light-theme tests
- Dark-theme tests
- Every frozen size and compact-mode test
- Overlay nesting tests
- Native form tests

Dialog, Menu, Select, Combobox, date controls, Tabs and DataGrid require manual accessibility review before stable release.

---

# 39. Performance requirements

Measure:

- JavaScript bundle size
- CSS size
- Duplicate dependency cost
- Component mount time
- Overlay opening latency
- Interaction latency
- Large-list behavior
- DataGrid scrolling and bounded DOM rendering
- Memory cleanup after tile unmount
- Style recalculation with multiple MFEs

Indicative budgets:

```text
Button implementation:       below 3 KB gzip
Dialog implementation:       below 12 KB gzip
Select implementation:       below 20 KB gzip
Combobox implementation:     below 25 KB gzip
Global base styles:          below 20 KB gzip
Runtime style engine:        prohibited
External runtime requests:   zero
Common pilot route:          >=20% smaller than WebKit
P95 synchronous interaction: below 10 ms
Large DataGrid scrolling:    >=55 FPS in agreed fixture
```

Budget increases require explicit justification.

---

# 40. Security and supply-chain governance

Required controls:

- Approved dependency inventory
- Internal package registry
- Lockfile governance
- SBOM generation
- License validation
- CVE monitoring
- Package-integrity verification
- CSP compatibility
- No external fonts
- No external icon loading
- No public CDN dependency
- No direct external services
- No undeclared analytics or data collection

Dependencies should remain minimal because each dependency expands the platform’s maintenance and vulnerability surface.

---

# 41. Browser and environment support

Define and test:

- Managed corporate Chrome
- Managed corporate Edge
- Supported Windows versions
- Standard and high-DPI displays
- Browser zoom from 100% to 200%
- Windows high-contrast mode
- Keyboard-only operation
- Pointer and touch input where applicable
- Portal CSP restrictions
- Module Federation runtime
- Independent React roots
- Multiple document-body portal stacks
- WebKit/Ratan coexistence in one document

Unsupported behavior must be documented.

---

# 42. Governance model

## 42.1 Platform-team ownership

The platform team owns:

- Architecture
- Tokens
- Component APIs
- Accessibility
- Package releases
- Documentation
- Security review
- Compatibility policy
- Deprecation
- Overlay architecture
- Parity and deviation approval

## 42.2 Tenant-team ownership

Tenant teams own:

- Correct adoption
- Business composition
- Application content
- Application-level accessibility
- Migration within the supported window
- Reporting missing patterns and defects

## 42.3 Contribution requirements

A proposed shared component must include:

- Demonstrated reuse
- User problem
- API proposal
- Accessibility behavior
- Token requirements
- Customization model
- Legacy parity classification or explicit post-parity rationale
- Test plan
- Documentation
- Maintenance owner

Tenant-specific components remain local until repeated reuse justifies promotion.

## 42.4 Review requirements

Review is required for changes affecting:

- Public API
- Tokens
- Accessibility
- Parity manifest or approved deviations
- Overlay behavior
- CSS layering
- Dependencies
- Major visual patterns

---

# 43. Delivery roadmap

## Phase 0 — Direction approval, specification and frozen baseline

- Approve the eight steering decisions in section 0.2 before expanding implementation.
- Generate the complete component/export inventory.
- Capture runtime properties, defaults, variants, events, slots, methods and story/application conflicts.
- Copy and hash approved token, theme, mode and typography assets.
- Check in parity and migration manifests with zero unresolved entries.
- Establish Chrome and Edge parity fixtures and benchmark scenarios.
- Record the current proof code as provisional until it conforms to the approved structure and gates.

## Phase 1 — Workspace foundation and proof cohort

- Establish `apps/docs`, `apps/playground`, `apps/parity-lab`, `packages/react`, the private foundation packages (including `packages/storybook`), `migration`, `manifests` and `tooling` in the existing npm/Turbo workspace.
- Scaffold `@fm/ratan-design@2.0.0-alpha.0` as the only public package.
- Implement static styles, token metadata, icons, React Aria adapters and testing helpers.
- Implement Button, TextInput, Dialog, DatePicker, Tabs and a representative DataGrid slice through SDD/TDD.
- Deliver the complete docs, Storybook, playground and parity-lab evidence for the proof cohort.
- Prove React 18.2/19, visual, behavior, accessibility, tree-shaking, packed-consumer and performance gates before expanding.

## Phase 2 — Common catalogue and Portal Host pilot

- Deliver actions, display, feedback, form basics, tabs, menus and overlays required by Portal Host.
- Add each component to the docs, Storybook, playground where relevant and parity lab in the same change cohort.
- Generate codemods from the migration map.
- Migrate Portal Host and verify login, navigation, application selection, dialogs, notifications, workspace tabs and tile removal.

## Phase 3 — Remaining UI catalogue

- Complete selection, date/time, navigation, layout, file, list, table, DataView and composite cohorts.
- Require workbench completeness and manifest closure for each cohort before alpha promotion.
- Migrate the two remaining legacy `@fm/ratan-design` consumers as their required components become stable.

## Phase 4 — Full DataGrid

- Complete every manifest-recorded feature, accessibility scenario and performance benchmark.
- Exercise small and large datasets, client/server modes, editing, grouping, export and MFE cleanup in the playground and parity lab.

## Phase 5 — Migration, enforcement, retirement and stable release

- Confirm every in-scope manifest entry passes contract, visual, behavior and accessibility gates.
- Complete WebKit, legacy Ratan, MUI and Ant Design mappings and their applicable codemods.
- Publish the tenant migration playbook covering sequencing, coexistence, rollback, deprecation windows and per-library mappings before final enforcement.
- Publish the manifest-driven adoption dashboard and deprecated-library policy; enforcement may tighten only after the mapped replacement surface is available.
- Remove the legacy Realworld package, obsolete provider APIs, old scripts and stale dependency references.
- Verify packed consumers and mixed WebKit/Ratan operation.
- Publish the versioned docs and Storybook catalogue for the stable candidate.
- Publish `2.0.0` only after the complete gate passes.

## 43.1 Per-component definition of done

No component is complete because its source renders. The component must have:

1. A manifest contract with no unresolved attributes, properties, defaults, variants, events, slots or methods.
2. Failing contract/accessibility tests written before implementation and final line/branch coverage above 90%.
3. React Aria usage for every applicable interaction primitive, or an approved exception record.
4. Exact token dependency and theme/mode coverage with no unexplained computed-style differences.
5. Storybook stories for its full fixture matrix and passing interaction/Axe checks.
6. A docs page with compilable packed-package examples, API, mapping, tokens and deviations.
7. A playground scenario when forms, overlays, routing, MFE lifecycle, performance or multi-component composition matters.
8. WebKit/Ratan parity fixtures in managed Chrome and Edge with any accepted difference recorded.
9. Strict TypeScript, zero lint warnings, independent subpath import and bundle-budget compliance.
10. Migration-map and codemod coverage for every legacy surface it replaces.

## 43.2 Grill QA promotion gate

At every cohort review, the owner and maintainers answer these questions from evidence rather than intent:

| Gate question | Required evidence |
|---|---|
| Did we reproduce the frozen contract, including obscure defaults and variants? | Manifest completeness and contract tests |
| Did we use React Aria instead of rebuilding interaction behavior? | Dependency/boundary report or approved exception |
| Does it look the same in every supported theme, mode and state? | Computed styles and Chrome/Edge parity diffs |
| Can a developer discover and exercise the full surface? | Storybook matrix and interaction results |
| Can a consumer understand and migrate to it? | Docs page, migration map and compilable examples |
| Does it work outside the source workspace? | Packed-package playground/consumer tests |
| Does it behave correctly in forms, overlays and MFE lifecycle? | Playground/E2E flows and cleanup assertions |
| Is it accessible beyond Axe? | Keyboard/focus tests plus required manual review |
| Is it measurably smaller and faster? | Bundle and synchronous-interaction reports |
| Can the cohort be removed without breaking earlier consumers? | Subpath boundaries, SemVer/deprecation and pilot results |

A failed or missing answer blocks cohort promotion. Schedule pressure does not convert missing evidence into an approved deviation.

# 44. Adoption strategy

1. Keep WebKit operational while Ratan alpha cohorts are incomplete.
2. Migrate imports, properties, custom events and slot composition through generated mappings rather than manual guesswork.
3. Pilot Portal Host because it exercises the broadest common-control and overlay surface.
4. Migrate the remaining legacy Ratan consumers to the new APIs before deleting the old workspace.
5. Allow other applications to migrate component-by-component while both systems share global `--sc-*` tokens.
6. Do not enforce Ratan-only usage until equivalent in-scope components and codemods exist.
7. Record every application-discovered contract gap back into the frozen manifest and resolve it before stable release.
8. Indefinite mixed-library usage requires an approved migration plan with a committed endpoint; component-by-component coexistence without a plan is not a resting state.

## 44.1 Tenant migration playbook

The playbook is an operational release artifact, not merely component documentation. For WebKit, legacy Ratan, MUI and Ant Design consumers it defines:

1. Inventory and classify current imports, global CSS, providers, portals, forms, icons and theme overrides.
2. Select a component cohort whose Ratan parity and migration tooling are already promoted.
3. Establish token/style coexistence and prevent duplicate resets or conflicting overlay layers.
4. Apply mapping-driven codemods, then resolve documented semantic differences manually.
5. Verify the tenant in the packed-package playground and its own unit/E2E suite.
6. Roll out behind an application-owned release/rollback mechanism; Ratan does not own business feature flags.
7. Measure visual, accessibility, bundle and interaction results against the pre-migration baseline.
8. Remove obsolete library code only after rollback criteria and an agreed observation window pass.
9. Record the remaining component inventory, owner, target cohort and committed completion date.

The playbook includes rollback triggers, supported coexistence combinations, escalation paths, deprecation windows and examples for incremental versus route-level migration. Design-system maintainers may improve Ratan, mappings or codemods; they must not patch tenant business source as a hidden migration step.

## 44.2 Adoption dashboard

Private tooling generates a CI dashboard from manifests, repository dependency scans and approved tenant declarations. It reports, without collecting end-user interaction data:

- parity completion by component/cohort;
- Storybook/docs/playground/parity evidence completeness;
- WebKit, legacy Ratan, MUI and Ant Design imports by application;
- codemod/mapping coverage and unresolved manual migrations;
- coexistence-plan owner, endpoint and deprecation deadline;
- pilot and tenant verification status;
- blockers to legacy package or library retirement.

Dashboard data is build and migration metadata, not the deferred product telemetry system.

# 45. Key risks and mitigations

| Risk | Mitigation |
|---|---|
| React Aria cannot reproduce an observed behavior | Prove representative controls first; implement a scoped Ratan adapter or native behavior and record the deviation |
| Runtime/source/stories disagree | Apply the fixed evidence precedence and store the resolution in the manifest |
| Provider-free configuration becomes ambiguous | Limit global configuration to frozen document-level CSS; expose explicit locale-sensitive props |
| Component package becomes a singleton accidentally | Share only React and ReactDOM; enforce federation and packed-consumer checks |
| Design system becomes a dumping ground | Enforce package boundaries and contribution criteria |
| Package-version conflicts | Publish peer/support matrices and test independent application bundles |
| CSS leakage | CSS Modules, scoped reset and cascade layers |
| Tenant overrides fragment the UI | Controlled props, tokens, slots and review |
| Overlay conflicts | Frozen z-index contract, document-body portals, nested-overlay tests and deterministic cleanup |
| Visual parity hides accessibility defects | Record approved deviations and test corrected behavior separately |
| DataGrid delays the programme | Isolate it behind a subpath, deliver feature cohorts and keep stable gated on the complete matrix |
| Legacy package is removed too early | Delete only after both consumers pass migration and packed-consumer tests |
| Accessibility regressions | Automated and manual quality gates |
| Package growth affects performance | Bundle budgets and dependency governance |
| Shell upgrades break applications | Keep Ratan application-bundled and use React peers only |
| Documentation becomes stale | Generate API, token, parity and migration documentation during releases |

---

# 46. Final acceptance criteria

Ratan Design v2 is production-ready when:

1. Every WebKit public export and registered element is classified with zero unresolved entries.
2. Every included property, default, variant, state, event, slot and method has a React mapping or approved deviation.
3. Frozen token assets retain exact `--sc-*` names and values and pass hash/completeness tests.
4. WebKit and Ratan can coexist without CSS leakage or internal-class collisions.
5. React and ReactDOM are the only shared federation singletons; Ratan is application-bundled.
6. Root and component subpath imports work and root imports exclude DataGrid.
7. No provider, runtime singleton or telemetry client is required.
8. Automated fixture screenshots remain below 0.1% changed pixels under matched Chrome/Edge conditions; every accepted difference is documented.
9. Computed geometry, typography, colour, spacing and focus values have no unexplained differences.
10. Pointer, keyboard, form, focus restoration, controlled/uncontrolled, disabled/read-only/loading, reduced-motion, high-contrast, RTL and 200% zoom scenarios pass.
11. Applicable fixtures pass Axe; overlays, collections, date controls, tabs and DataGrid pass manual accessibility review.
12. Coverage exceeds 90% for lines and branches, strict TypeScript passes and lint reports zero warnings.
13. Common Portal Host design-system JavaScript and CSS is at least 20% smaller than WebKit, excluding React peers.
14. P95 synchronous interaction work remains below 10 ms.
15. DataGrid uses bounded DOM rendering, sustains at least 55 FPS in the agreed large-data fixture and cleans up after unmount.
16. Portal Host login, navigation, application/tile opening, overlay interactions and workspace removal pass after migration.
17. The remaining legacy Ratan consumers run on the new package and provider-free theme contract.
18. The old package workspace and obsolete dependency references are removed.
19. No excluded viewer/editor/sibling package or prohibited runtime dependency enters the public package.
20. `2.0.0` is not published until 100% of the approved in-scope manifest is complete.
21. Docs, Storybook, playground and parity lab are live CI workspaces, and every included component satisfies the workbench completeness rule.
22. Every applicable interactive component is React Aria-based or has an approved, tested exception.
23. A pilot tenant adopts the system without design-system-team modifications to tenant source; every required change flows through documented props, tokens, slots and codemods.
24. The adoption dashboard accounts for every in-repository WebKit, legacy Ratan, MUI and Ant Design consumer and shows an owner and endpoint for every approved coexistence plan.
25. The tenant migration playbook has been exercised in the pilot, including a successful rollback rehearsal or equivalent non-production proof.

# 47. Final architectural decisions

| Area | Decision |
|---|---|
| Design authority | Frozen `@scdevkit/webkit@2.0.5` runtime and source contract |
| Baseline synchronization | One-time snapshot |
| Conflict precedence | Runtime → tests/source → usage → Storybook → docs |
| Public package | Single `@fm/ratan-design` package with subpaths |
| Stable version | `2.0.0` after full parity; alpha cohorts before it |
| React support | React/ReactDOM 18.2–19 peers |
| Interaction foundation | React Aria Components/hooks, private |
| DataGrid foundation | TanStack Table + TanStack Virtual, private |
| Styling | Static CSS Modules, cascade layers and stable data attributes |
| Tokens | Exact existing `--sc-*` names and values |
| Themes/modes | Light, dark, CPBB, Inter, Roboto Mono, Dyslexic and approved follow-system behavior |
| Provider/runtime | None |
| Overlay container | `document.body` |
| API model | Idiomatic React APIs with complete legacy mappings |
| Defect policy | Preserve intent; document and test corrections |
| In scope | UI catalogue, icons, Table, DataView and full DataGrid |
| Excluded | DashboardViewer, Tour, legacy RTE, DocumentImageViewer and sibling packages |
| Telemetry | Deferred optional adapter; not core v2 |
| Migration pilot | Portal Host |
| Legacy package | Remove after its consumers migrate |
| Repository tooling | Existing npm workspaces and Turborepo |
| Repository shape | Private docs, Storybook, playground and parity-lab apps; one public package; separate private tooling |
| Component workbench | Storybook is mandatory for exhaustive isolated coverage |
| Consumer validation | Packed-package playground is mandatory for realistic React/MFE scenarios |
| Quality gate | SDD/TDD, >90% coverage, parity lab, accessibility and performance budgets |

# 48. Recommendation

Approve the reconciled direction and target repository structure before broad component coding resumes. The first implementation milestone is accepted only when the inventory contains no unresolved public exports, copied styles have verified hashes, the docs, Storybook, playground and parity-lab workspaces run in CI, and Button, TextInput, Dialog, DatePicker, Tabs and a representative DataGrid slice prove the selected architecture end to end.

The programme then proceeds through alpha cohorts while retaining WebKit for incomplete surfaces. Stable release and legacy-package deletion occur only after the complete in-scope catalogue, Portal Host pilot, remaining legacy consumers, accessibility gates and performance budgets pass.

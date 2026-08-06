## Context

The repository currently contains SC WebKit consumers and a legacy `@fm/ratan-design@1.1.0` package based on Ant Design and Emotion. Ratan v2 must replace both consumption paths with an idiomatic React library while preserving the frozen WebKit UI contract at commit `a8398ea6df30e4843e22fcb5a1d3343107463c60`. The programme spans component behavior, CSS/token extraction, package assembly, DataGrid, documentation and test applications, migration tooling, and several independently deployed React micro-frontends.

The design is constrained by exact `--sc-*` compatibility, React 18.2 through 19, Single-SPA/Module Federation coexistence, managed Chrome and Edge, strict CSP, no external runtime assets, and the repository's SDD/TDD and greater-than-90-percent line/branch coverage rules. React and ReactDOM remain peers; Ratan is application-bundled so one micro-frontend cannot substitute another application's component implementation.

## Goals / Non-Goals

**Goals:**

- Reproduce every in-scope WebKit token, theme, mode, default, variant, state, visual fixture, and intended interaction with explicit evidence.
- Expose typed, idiomatic, controlled/uncontrolled React APIs without leaking Web Component, React Aria, or TanStack implementation contracts.
- Use React Aria for applicable interaction primitives and TanStack Table/Virtual for the full manifest-recorded DataGrid surface.
- Publish one tree-shakable `@fm/ratan-design` package with explicit component, CSS, token, icon, testing, manifest, and migration subpaths.
- Provide an enforceable monorepo dependency hierarchy, exhaustive workbench surfaces, and measurable accessibility/performance gates.
- Support staged coexistence, mapping-driven migration, rollback, pilot verification, and eventual legacy retirement.

**Non-Goals:**

- Creating a new visual language or continuously tracking WebKit after the frozen baseline.
- Shipping DashboardViewer, Tour, legacy RichTextEditor, DocumentImageViewer, sibling WebKit packages, or features absent from the frozen manifest.
- Requiring a Ratan provider, shared design-system singleton, mandatory telemetry, business state, authorization, networking, or workflow policy.
- Publishing private implementation workspaces or exposing internal DOM, CSS Module names, React Aria types, or TanStack state.

## Decisions

### Frozen evidence-led parity contract

Generate checked-in parity, migration, and deviation manifests from runtime fixtures, source, tests, stories, and application usage. Resolve conflicts using runtime observation first, then tests/source, usage, Storybook, and written docs. Every public export is included, supporting-only, or excluded with rationale; unresolved entries block component scaling and stable release.

Alternative considered: treat WebKit source or Storybook as the authority. Rejected because observed runtime behavior is the only reliable statement of what current users see and operate.

### One public package over private layered workspaces

Use `apps/docs`, `apps/playground`, and `apps/parity-lab`; private `packages/foundation`, `components`, `tokens`, `styles`, `icons`, `patterns`, `data-grid`, `testing`, `storybook`, `standard`, and `vitest`; public `packages/react`; plus `migration`, `manifests`, and `tooling`. The public facade bundles or copies approved private outputs so its tarball has no unresolved private dependency. Enforce the DAG `apps/storybook → react facade → patterns/data-grid/components/testing → foundation/styles/icons/tokens`.

Alternative considered: publish every internal package independently, as in large general-purpose libraries. Rejected because coordinated parity and migration require one versioned contract and the user selected a single public package.

### React Aria as mandatory interaction foundation

Applicable interactive components use React Aria Components/hooks for press, focus, collections, selection, overlays, dates, locale-aware behavior, and keyboard navigation. Direct native implementation is limited to presentation or a missing primitive. Exceptions require an ADR, manifest rationale, owner approval, and dedicated keyboard/focus tests. Ratan owns public names, callbacks, state details, composition, CSS, and stable data attributes.

Alternative considered: hand-build simple controls or mix foundations component by component. Rejected because it duplicates accessibility state machines and creates inconsistent behavior.

### Static CSS and exact public SC tokens

Copy and hash the frozen `--sc-*` assets, preserving names and resolved values across GDS primitives, light/dark, CPBB, typography, Inter, Roboto Mono, Dyslexic, follow-system, and required utilities. Use scoped resets, CSS Modules, cascade layers, and component subpath side effects. No CSS-in-JS runtime, global element reset, Tailwind runtime, external font, or external icon request is allowed.

Alternative considered: translate tokens to a new Ratan namespace. Rejected because shared tokens are the coexistence and visual-parity contract.

### Provider-free document-global configuration

Theme and font-mode selectors apply to `html` or `body`, direction inherits from `dir`, locale defaults to the browser with relevant prop overrides, and overlays portal to `document.body`. Per-subtree overlay themes are unsupported in v2. Components remain form-library neutral and use native form semantics where possible.

Alternative considered: a provider and shared overlay runtime. Rejected to avoid cross-root version coupling and consumer setup while matching the selected global token model.

### Isolated DataGrid subsystem

Expose DataGrid only through `/data-grid`; use private TanStack Table state and TanStack Virtual rendering. Ratan-owned public types cover sorting, filtering, pagination, selection, editing, columns, rows, grouping, expansion, export, master/detail, overlapping views, keyboard behavior, and server/client modes. Loading and refreshing remain distinct. Spreadsheet formulas, arbitrary merges, pivots, full personalization, and complex cross-row validation remain excluded unless the frozen manifest proves support.

Alternative considered: expose TanStack types or deliver a reduced table. Rejected because both weaken the stable API and fail the approved parity scope.

### Workbench completeness as a release contract

Docs provide durable guidance and generated reference; Storybook provides the exhaustive isolated fixture matrix; playground consumes the packed package in realistic React/MFE flows; parity lab compares WebKit and Ratan under matched conditions. A component is complete only when all applicable contract, story, docs, playground, parity, accessibility, performance, package, and migration evidence exists.

### Migration before retirement

Generate WebKit, legacy Ratan, MUI, and Ant Design mappings and codemods. Pilot Portal Host, migrate the remaining legacy Ratan consumers, publish the tenant playbook and adoption dashboard, and require an owner/end date for mixed-library usage. Remove the old package only after application tests, packed-consumer checks, rollback proof, and the observation window pass.

## Risks / Trade-offs

- [The frozen runtime, source, tests, and stories disagree] → Apply the evidence precedence and record every resolution in the parity/deviation manifests.
- [React Aria cannot reproduce a WebKit interaction or geometry] → Prove representative controls first; add a scoped adapter or approved native exception without leaking the foundation.
- [Private workspace layering complicates packaging] → Enforce dependency boundaries and test the packed tarball for unresolved workspace dependencies and every documented subpath.
- [Exact visual parity can preserve poor behavior] → Preserve visual intent while documenting and testing approved accessibility, security, performance, or interaction corrections.
- [Document-global theming limits subtree customization] → State the limitation explicitly and test overlay inheritance; defer provider-based subtree themes beyond v2.
- [DataGrid delays stable release] → Isolate it behind a subpath, deliver feature cohorts, benchmark continuously, and retain the complete manifest as the stable gate.
- [Multiple UI libraries persist indefinitely] → Require a migration plan, owner, endpoint, deprecation policy, and adoption-dashboard evidence.
- [Package growth harms common routes] → Keep DataGrid out of root exports, enforce subpath and CSS side effects, and compare common-route bytes against WebKit.
- [Visual tests are noisy] → Pin browser, viewport, DPR, fonts, motion, data, and interaction state; allow only reviewed deviation records.

## Migration Plan

1. Approve the OpenSpec capability requirements and freeze the WebKit inventory and token hashes.
2. Move the bootstrap package/parity code into the approved workspace hierarchy without changing public behavior.
3. Prove Button, TextInput, Dialog, DatePicker, Tabs, and a representative DataGrid slice across all workbench and quality gates.
4. Publish component-cohort `2.0.0-alpha.*` builds and migration mappings while WebKit and legacy Ratan remain available.
5. Migrate Portal Host with login, navigation, tile opening/rendering, overlays, feedback, workspace tabs, and removal verification.
6. Migrate both legacy Ratan consumers using Ant Design/legacy mappings and packed-package tests.
7. Complete the remaining catalogue and full DataGrid; publish docs, Storybook, playbook, dashboard, deprecations, and rollback criteria.
8. Remove the old workspace and dependencies only after migration observation and rollback gates pass; publish `2.0.0` after all stable criteria pass.

Rollback keeps the previous application/package version deployable until its cohort observation window closes. Application owners control rollout flags or deployment rollback; Ratan never embeds business feature flags. A failed cohort returns the consumer to its previous dependency and records the missing contract or deviation before retrying.

## Open Questions

- Which exact managed Chrome and Edge versions form the release browser matrix at each alpha promotion?
- Which representative tenant, in addition to Portal Host, will satisfy the no-design-system-team-source-modification adoption gate?
- What dataset, hardware profile, and scripted interaction define the final DataGrid 55 FPS benchmark fixture?
- What alpha cohort cadence and deprecation observation window will platform governance approve?

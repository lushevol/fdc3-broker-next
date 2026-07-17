# Current UI Problems Statement

**Status:** Current-state assessment  
**Assessment date:** 2026-07-18  
**Purpose:** Establish an evidence-based problem statement for unifying the portal design system.  
**Scope:** This document examines only:

- `apps/base`
- `apps/root-config`
- `apps/mfe-ratan-container`
- `apps/mfe-cashflow-blotter`

No conclusions in this document are based on UI code from other application or package folders. References to `packages/ratan-design` are limited to observing whether the four in-scope applications consume it.

## Executive Summary

The portal does not currently operate as a single, governed design system. It contains several partially connected UI systems:

1. `apps/base` provides the shell experience and owns a bespoke Material UI theme, light and dark palettes, typography, density defaults, component overrides, and some global styling.
2. `apps/mfe-ratan-container` combines Material UI, Ant Design, AG Grid, Emotion/styled components, Less, CSS, CSS custom properties, and component-local styling. It also exports a large set of domain UI components for other micro-frontends.
3. `apps/mfe-cashflow-blotter` consumes some UI capabilities from `mfe-ratan-container`, but also directly uses Material UI, Ant Design, AG Grid, Emotion/styled components, inline styles, and many feature-local component variants.
4. `apps/root-config` composes the micro-frontends but does not establish a portal-wide theme, token contract, CSS baseline, or design-system version contract.

This results in duplicated components, independent theme adapters, inconsistent tokens, several styling mechanisms, version drift, accessibility risks, and unclear ownership. The existing `ratan-design` package is not referenced by any of the four in-scope applications, so it is not currently the source of truth for the portal UI.

The principal problem is not simply that multiple libraries exist. The deeper problem is that the portal lacks a stable design-system contract above those libraries. Color, spacing, typography, radius, density, focus, elevation, z-index, grid behavior, and component APIs can be defined or overridden independently in each application. Consequently, visually equivalent controls may have different implementations, behavior, accessibility characteristics, and maintenance paths.

## Current-State Inventory

The following statistics were produced through static analysis of source files under each in-scope application's `src` directory. Counts are directional complexity indicators, not measures of user-facing quality. Generated files, test files, and non-UI code may contribute to broad source-file counts; library-import and styling counts are restricted to relevant source extensions.

| Application | UI and styling stack | Source files | TSX/JSX files | Style files/modules | Key indicators |
| --- | --- | ---: | ---: | ---: | --- |
| `apps/base` | Material UI, MUI X, Emotion, Tailwind CSS 4, CSS custom properties | 327 | 110 | 36 | 109 files import MUI; 50 styled declarations; 103 `sx` props; 21 inline style props |
| `apps/root-config` | Single-SPA composition; no application UI library | 2 | 0 | 0 | No UI theme or style ownership |
| `apps/mfe-ratan-container` | Material UI, Ant Design, AG Grid, Emotion/styled components, Less, CSS | 315 | 137 | 27 broadly matched style files; 20 conventional `style*` modules | 66 files import MUI; 70 import Ant Design; 11 import AG Grid; 38 styled declarations; 35 inline style props |
| `apps/mfe-cashflow-blotter` | Material UI, Ant Design, AG Grid, Emotion/styled components | 506 | 173 | 53 | 124 files import MUI; 125 import Ant Design; 59 import AG Grid; 79 styled declarations; 77 inline style props |

Additional styling signals:

| Application | `sx` props | Hex color occurrences | RGB/HSL occurrences | `!important` occurrences | Unique CSS custom-property names observed |
| --- | ---: | ---: | ---: | ---: | ---: |
| `apps/base` | 103 | 415 | 303 | 62 | 225 |
| `apps/root-config` | 0 | 0 | 0 | 0 | 0 |
| `apps/mfe-ratan-container` | 9 | 92 | 74 | 29 | 72 |
| `apps/mfe-cashflow-blotter` | 47 | 49 | 1 | 16 | 23 |

These literal counts include legitimate token definitions. They should not be interpreted as an exact count of design-system violations. They do, however, show that color and styling knowledge is spread across a large surface rather than being consumed exclusively through a small semantic token API.

## UI Libraries and Their Current Roles

### Material UI

Material UI is the only general-purpose component library used across all three UI-bearing applications. It is therefore the strongest candidate for the primary implementation foundation of a unified system.

However, the applications do not use one shared MUI setup:

- `apps/base/src/theme/Config.ts` creates the shell theme, including typography, shape, component density, button behavior, menus, dialogs, inputs, and MUI Data Grid overrides.
- `apps/mfe-ratan-container/src/Root/component/MfeThemeProvider/index.tsx` obtains a theme through the container import layer and then extends it with application-specific scrollbar behavior.
- `apps/mfe-cashflow-blotter/src/Root/common/component/MfeThemeProvider/index.tsx` independently obtains the MUI theme and pairs it with its own Ant Design configuration.

This architecture gives the appearance of reuse because the MFEs call common theme helpers, but it does not create one immutable design-system boundary. Each MFE can still add global baselines, component overrides, or literal values independently.

Observed high-frequency MUI patterns include:

- `styled` and `css` utilities
- `Box`, `Stack`, and `Grid` for layout
- `Button` and `IconButton`
- `Tooltip`
- `Tabs` and `Tab`
- MUI X `DataGrid` in the base application

The `base` application depends on MUI `5.15.0`, while both business MFEs declare MUI versions around `5.10.x`. Even when package-manager resolution prevents multiple physical copies, the declared compatibility ranges represent design and runtime drift. Shared components should not rely on accidental compatibility between different minor versions.

### Ant Design

Ant Design is used extensively in both business MFEs but not in the shell:

- 70 Ratan container source files import Ant Design.
- 125 cashflow source files import Ant Design.

Frequently used Ant components include `message`, `Input`, `Form`, `Button`, `Select`, `Modal`, `Popover`, `Tooltip`, `Space`, `DatePicker`, `InputNumber`, `Checkbox`, and `Tag`.

Both business MFEs create an Ant `ConfigProvider` alongside the MUI `ThemeProvider`. Each defines a 12px default font size, a Poppins font family, dark/light algorithms, and popup z-index values. The definitions are nearly equivalent but independently maintained.

Problems created by this arrangement include:

- A single screen can contain controls with different default height, padding, typography, validation, disabled state, hover state, focus state, and DOM semantics.
- MUI and Ant theme tokens do not have a documented semantic mapping.
- Fixing a portal-wide component state may require changes in two library adapters and several local overrides.
- Similar component names, such as `Button`, `Tooltip`, `Dialog`/`Modal`, `Select`, and form inputs, can refer to different implementation libraries depending on the file.
- Developers can choose a library based on convenience rather than a governed component policy.

Using two libraries is not automatically a defect. It becomes a systemic problem when their responsibilities, token mappings, and migration boundaries are undefined.

### AG Grid and MUI Data Grid

The portal contains two grid foundations:

- `apps/base` configures and uses MUI X Data Grid.
- The business MFEs primarily use AG Grid and a custom Ratan `DataGrid` wrapper.

Grid styling is particularly fragmented because data-heavy workflows define many of their own configurations and wrappers. The cashflow application alone contains feature-specific `DataGrid` folders for multiple static-table workflows and additional grids under `Cashflow_CN`.

There is also a concrete version-alignment problem:

- `apps/mfe-ratan-container/package.json` declares AG Grid `32.3.0`.
- `apps/mfe-cashflow-blotter/package.json` declares AG Grid `32.3.3` development dependencies.
- `apps/mfe-ratan-container/src/ratancomponents/DataGrid/styles/ag-grid-ratan.css` and `ag-theme-alpine-ratan.css` load AG Grid `35.3.1` CSS from jsDelivr.

Loading major-version-35 styles around major-version-32 runtime components can cause class, variable, sizing, and interaction-state mismatches. Loading the stylesheet from a public CDN also means grid appearance can fail or change due to network policy, CDN availability, or content-security restrictions.

The design system needs an explicit grid strategy. It may retain AG Grid for business tables and MUI Data Grid for smaller shell use cases, but it must define shared tokens, density, typography, focus behavior, selection behavior, empty/loading/error states, and a version policy for both.

### Emotion and Styled Components

Emotion is declared in all three UI applications, and MUI's `styled`/`css` APIs are used extensively:

- 50 styled declarations in `apps/base`
- 38 in `apps/mfe-ratan-container`
- 79 in `apps/mfe-cashflow-blotter`

Styled components are not inherently problematic. The issue is that many styled definitions act as local design decisions rather than compositions of shared primitives and semantic tokens. This increases the number of places that can independently define spacing, color, border, radius, layout, responsive behavior, and component states.

### Less and Plain CSS

`mfe-ratan-container` contains legacy Less and plain CSS alongside styled components. Examples include custom dialog, form, popover, quick-search, custom-row, and grid styles. Its `ratantheme/index.less` defines a base color palette and includes instructions not to use base colors directly in components.

That intention is sound, but enforcement is incomplete:

- The Less palette is separate from the TypeScript MUI theme.
- Ant Design tokens are configured separately.
- AG Grid uses CSS variables and imported theme CSS.
- Some components still contain literal colors or component-specific CSS variables.

As a result, there is no single token transformation that guarantees all technologies render the same semantic color or spacing value.

### Tailwind CSS

`apps/base` imports Tailwind CSS 4 through `src/styles/tailwind.css`, primarily to support assistant UI styling. It defines an `--aui-*` token namespace and maps those values into Tailwind theme variables.

This is a relatively contained use, but it creates another token domain with its own OKLCH palette, radii, shadows, and component reset behavior. The assistant UI may therefore feel visually separate from the MUI-based portal unless its `--aui-*` variables are generated from the same portal semantic tokens.

Tailwind does not need to be removed to achieve unification. It does need to become a consumer of the same source tokens rather than a separate visual system.

## Theme and Token Problems

### No Single Source of Truth

The current token landscape includes:

- MUI theme configuration in `apps/base/src/theme`
- light and dark TypeScript color configuration
- custom `theme-color-*` CSS variables
- the `--aui-*` assistant token namespace
- Less variables in `mfe-ratan-container/src/ratantheme`
- Ant Design tokens inside two MFE theme providers
- AG Grid CSS variables and theme CSS
- feature-specific CSS variables in cashflow
- direct color, pixel, radius, shadow, and z-index values

These sources are related informally but are not generated from a common schema. A semantic concept such as “interactive primary,” “surface elevated,” “border subtle,” “focus ring,” or “status danger” can therefore have several definitions or no definition at all.

### Theme Provider Duplication

The two MFE theme providers independently define:

- Ant light/dark algorithms
- `fontSize: 12`
- Poppins font-family strings with slightly different formatting
- `zIndexPopupBase: 1500`
- message placement and popup behavior

The Ratan provider also adds scrollbar styling not present in the cashflow provider. Because these providers are application code rather than a design-system package API, they can continue diverging.

### Typography Is Incompletely Governed

Poppins is the intended family, but the implementations vary:

- The base MUI theme reads Poppins from its custom theme configuration.
- The Ratan Ant theme uses `"Poppins",Helvetica!important`.
- The cashflow Ant theme uses `"Poppins", Helvetica !important`.

Embedding `!important` inside a font-family token is brittle and suggests that cascade conflicts are being solved at the value level. A unified system should define font families, type scale, line heights, weights, letter spacing, numeric/table typography, and density-specific variants once.

### Spacing, Radius, and Density Are Not Explicit Contracts

The base theme establishes a 5px default radius and globally selects small/dense variants for many MUI components. Ant Design uses a 12px font-size override but does not share a documented density scale with MUI. AG Grid has separate row-height and variable behavior. Local styled components add more pixel values.

Without named density and spacing tokens, teams cannot reliably answer:

- What is the standard field height?
- What padding belongs in a compact toolbar?
- What radius should dialogs, menus, tabs, cards, and grid rows use?
- Which layout gaps are valid?
- What is the compact versus comfortable data density?

### Z-Index and Overlay Behavior Are Locally Managed

Both Ant providers set popup values around 1500, while dialogs, menus, notifications, assistant UI, workspace tabs, and micro-frontend overlays may also establish stacking contexts. There is no visible portal-wide z-index scale describing the relationship among navigation, drawers, dialogs, popovers, tooltips, notifications, and modal assistant surfaces.

This raises the risk of controls rendering behind other MFEs or forcing developers to add progressively larger local z-index values.

## Component Architecture Problems

### The Shared Component Boundary Is a Micro-Frontend Export Surface

`apps/mfe-ratan-container/src/root.tsx` exports at least 26 UI component groups, including grids, filters, dialogs, forms, loading indicators, selectors, tags, popovers, and domain detail components.

`apps/mfe-cashflow-blotter/src/Root/import/ratancomponents/index.ts` then translates those namespace exports into local imports.

This provides runtime reuse, but it has significant limitations as a design-system architecture:

- UI primitives are coupled to the deployment and availability of a business micro-frontend.
- The public API is a broad namespace façade rather than a small, versioned component package.
- General primitives and domain-specific components are mixed together.
- Consumers can still bypass the shared exports and directly use MUI, Ant Design, or AG Grid.
- Storybook documentation, visual states, accessibility requirements, and deprecation policy are not enforced by the runtime export boundary.
- Refactoring the Ratan application can unintentionally change the UI contract used by cashflow.

A shared package should own portal primitives. Business MFEs should consume that package; one business MFE should not have to function as the design-system server for another.

### Extensive Feature-Local Duplication in Cashflow

The cashflow application has seven top-level feature areas:

- `Cashflow_Authorization_Limits`
- `Cashflow_BIC_Netting_Static_Table`
- `Cashflow_CN`
- `Cashflow_Dashboard`
- `Cashflow_Group_Management`
- `Cashflow_Splitting_Static`
- `Cashflow_Utilization_Static_Table`

Across these areas, recurring component folders include:

- `DataGrid`
- `QuickSearch`
- `GridFooter`
- `Export`
- `Audit`
- `Detail`
- `Actions`

Static-table areas contain especially similar structures. This indicates that feature teams have copied or independently evolved workflow scaffolding instead of composing a shared “cashflow data workspace” pattern.

The duplication cost is larger than repeated JSX. Each copy can independently define:

- layout and spacing
- buttons and icons
- loading and error behavior
- grid configuration
- column menus
- search behavior
- pagination and export controls
- dialog sizing
- labels and help text
- focus order and keyboard behavior
- responsive behavior

These repeated patterns should be consolidated into shared primitives and higher-level compositions, with feature code supplying configuration and business behavior.

### Multiple Dialog Implementations

The Ratan container exports several dialog implementations, including `Dialog`, `MuiDialog`, `MuiDialogV1`, and `MuiDialogV2`, while Ant `Modal` is also used directly. Cashflow uses the Ratan MUI dialog wrapper across many Audit, Detail, Export, and workflow components.

Multiple dialog generations usually mean that requirements were added by creating a new variant instead of evolving one stable API. This produces uncertainty around which dialog supports:

- resizing
- correct focus trapping and restoration
- responsive sizing
- consistent header/footer composition
- escape and backdrop behavior
- nested overlays
- busy and error states
- accessible labelling

The unified system should provide one primary dialog API plus deliberately named specialized variants.

### Iconography Is Not Standardized

The dependencies include both `@mui/icons-material` and `@ant-design/icons`, and `apps/base` additionally uses `lucide-react`. Mixed icon libraries differ in stroke/fill style, optical size, baseline, view box, and default visual weight. Without an icon policy and wrapper, navigation, actions, status indicators, and empty states will continue to look inconsistent.

### Component States Are Not Centrally Specified

There is no single specification for normal, hover, pressed, selected, focused, disabled, loading, invalid, success, warning, and destructive states across libraries. The current themes cover some states, while local CSS and component props cover others.

The result is a high probability that equivalent actions communicate different affordances and severity depending on the feature or implementation library.

## Accessibility Problems and Risks

This section identifies code-level risks. It is not a WCAG conformance assessment because the portal was not running during the assessment and no keyboard, screen-reader, zoom, contrast, or responsive-flow testing was performed.

### Focus Indicators Are Suppressed

`apps/base/src/theme/Config.ts` removes outlines from `MuiButtonBase`, `MuiButton`, MUI Data Grid column headers, and grid cells, including focus and focus-within states. Several declarations use `!important`.

Unless every affected component supplies an equally visible alternative focus indicator, keyboard users may be unable to determine which control or grid cell is active. The design system should define a shared `focus-visible` token and interaction pattern rather than globally suppressing browser or library focus treatment.

### Small and Dense Defaults May Reduce Operability

The base theme globally applies small/dense variants to text fields, buttons, icon buttons, floating action buttons, tables, toolbars, toggle buttons, list items, and forms. The business apps also use a 12px Ant base font.

Dense interfaces are reasonable for financial workflows, but density must not make interactive targets or text too small. The design system needs explicit compact-mode requirements for minimum target size, readable line height, keyboard focus, and zoom/reflow behavior.

### Accessibility Behavior Varies by Library

MUI, Ant Design, AG Grid, custom portals, and custom resizable dialogs provide different semantic and keyboard behavior. Local wrappers can unintentionally remove labels, focus management, ARIA relationships, or keyboard interaction.

Central primitives need documented accessibility contracts and automated checks so that each feature does not have to solve these concerns independently.

### Color and Status Semantics Are Fragmented

The codebase contains base colors, semantic-looking theme variables, assistant tokens, Ant tokens, AG Grid variables, and feature-specific status colors. Without one semantic status model, color may be used inconsistently to represent success, warning, failure, pending, disabled, selected, or stale data.

The unified system must ensure that status is not communicated by color alone and that light/dark contrast is verified for every semantic pair.

## Runtime and Delivery Risks

### Cross-MFE Theme Coupling

The business MFEs retrieve theme-related utilities and providers through runtime imports. If the provider's expected theme shape changes, consumers can fail at runtime even when their own source code has not changed.

### Package Version Drift

The applications declare different React, MUI, AG Grid, TypeScript, and `single-spa-react` versions. Design-system components loaded across MFE boundaries are sensitive to duplicated React contexts, incompatible theme shapes, and library minor-version differences.

### CDN-Loaded Core Styling

AG Grid core styles are loaded from jsDelivr rather than built and versioned with the application. This weakens reproducibility, offline/local behavior, content-security policy control, and release traceability.

### Global CSS and Baseline Collisions

Multiple `CssBaseline`, CSS resets, Tailwind layers, Less imports, AG Grid theme styles, and custom portal rendering can affect descendants across micro-frontend boundaries. Single-SPA does not automatically isolate CSS. A style introduced by one MFE can therefore change another MFE unless selectors and ownership are carefully controlled.

## Root-Config Ownership Gap

`apps/root-config` currently registers and mounts `@fm/base` through Single-SPA layout, but it does not establish a design-system contract.

This creates several unresolved questions:

- Which layer loads fonts and global token CSS?
- Which package version is mandatory for all MFEs?
- How are theme changes communicated to mounted MFEs?
- Which layer owns color scheme, reduced motion, density, locale, and direction?
- How are portal overlays coordinated across stacking contexts?
- How are incompatible design-system versions detected?

`root-config` does not need to render UI components, but it should participate in enforcing shared runtime prerequisites and compatibility.

## Existing Strengths to Preserve

The current system contains useful foundations that should be consolidated rather than discarded:

- A working light/dark MUI theme exists in `apps/base`.
- Poppins is consistently intended as the portal typeface.
- The base theme already centralizes many MUI defaults and grid states.
- The Ratan container already exposes reusable domain components.
- Cashflow already consumes several Ratan components instead of implementing everything locally.
- Ant Design is already wrapped in theme providers rather than left entirely unconfigured.
- CSS custom properties are already used for runtime theming.
- The assistant UI's Tailwind styles are scoped under `.aui-root` and use a distinct token namespace.
- AG Grid has a custom wrapper, providing a potential migration seam.
- The applications have light/dark theme awareness and shared container state.

The unification effort should turn these existing seams into formal, tested contracts.

## Problem Severity and Priority

| Priority | Problem | Why it matters |
| --- | --- | --- |
| P0 | No authoritative semantic token source | Every component migration remains unstable until the visual language has one source of truth |
| P0 | AG Grid runtime/CSS major-version mismatch | Can produce immediate styling and behavior defects; also undermines reproducible builds |
| P0 | Focus outlines suppressed without a guaranteed replacement | Creates a direct keyboard-accessibility risk across core controls and data grids |
| P1 | Independent MUI/Ant theme providers | Causes ongoing drift in typography, overlay behavior, color mapping, and component states |
| P1 | Shared UI exposed from a business MFE rather than a package | Couples product deployment to the design-system API and makes versioning/governance unclear |
| P1 | Repeated cashflow workspace components | Multiplies maintenance, test, accessibility, and visual-consistency work |
| P1 | Multiple dialog and grid variants | Core workflows can differ in behavior and accessibility depending on implementation generation |
| P2 | Mixed icon families | Produces visible inconsistency and repeated sizing/alignment work |
| P2 | Tailwind assistant palette separate from portal tokens | Makes assistant surfaces feel like a different product and duplicates dark-mode decisions |
| P2 | High use of local literals, inline styles, and `!important` | Makes theme changes expensive and encourages cascade escalation |

## Required Design-System Capabilities

The target design system must provide more than a component catalog. At minimum it needs:

### Token Foundation

- semantic color tokens for content, surfaces, borders, actions, selections, statuses, and data visualization
- typography tokens for UI, dense data, numeric values, labels, headings, and code/message content
- spacing and layout scale
- component height and density scale
- radius, border, elevation, and shadow scale
- focus-ring and keyboard-interaction tokens
- motion duration/easing and reduced-motion behavior
- z-index/overlay scale
- light and dark schemes
- CSS-variable output for runtime MFE consumption
- adapters for MUI, Ant Design, AG Grid, and Tailwind during migration

### Core Primitives

- buttons and icon buttons
- icons and status symbols
- text fields, selects, date/time inputs, checkboxes, and form layout
- tooltip, popover, menu, and notification
- dialog/drawer with responsive and resizable variants where justified
- tabs, chips/tags, badges, and status indicators
- loading, empty, error, permission-denied, and no-results states
- page, panel, toolbar, stack, and responsive layout primitives

### Data-Workflow Components

- standardized AG Grid wrapper and theme
- quick search and advanced filter composition
- grid toolbar and actions
- pagination/load-next behavior
- export workflow
- audit/history presentation
- detail panel/dialog composition
- selection and bulk-action patterns
- numeric, currency, date/time, and status cell renderers

### Governance and Delivery

- versioned package API
- Storybook documentation with all visual and interaction states
- accessibility requirements and automated tests
- visual-regression coverage in light and dark modes
- migration/deprecation policy
- lint rules or codemods preventing unauthorized direct library usage and literal styling
- peer dependency and MFE compatibility policy
- change log and upgrade guidance

## Recommended Work Sequence

### Phase 1: Stabilize Critical Risks

1. Align AG Grid runtime and CSS to one exact supported version and bundle its styles locally.
2. Replace global outline suppression with an accessible `:focus-visible` treatment.
3. Document and freeze current MUI, Ant, React, and AG Grid compatibility versions.
4. Identify CSS baseline and global-style ownership to prevent cross-MFE collisions.

### Phase 2: Establish the Token Contract

1. Select the authoritative design-system package, preferably evolving `packages/ratan-design`.
2. Extract the intended portal visual decisions from the base theme, Ratan Less theme, CSS variables, Ant providers, and AG Grid theme.
3. Normalize those decisions into semantic tokens rather than library-specific token names.
4. Generate CSS variables and library adapters from the semantic source.
5. Make theme, density, and color-scheme state available consistently to all mounted MFEs.

### Phase 3: Consolidate Providers and Foundations

1. Replace the two MFE-local theme providers with a shared provider/adaptor package.
2. Standardize typography, CSS baseline, scrollbar behavior, overlay stacking, and notification placement.
3. Establish a policy for direct imports from MUI, Ant Design, icon libraries, and AG Grid.
4. Map the assistant UI Tailwind tokens to portal semantic tokens.

### Phase 4: Build Core Components

Prioritize the components with the highest reuse and inconsistency cost:

1. button and icon system
2. form controls and field layout
3. dialog and overlay system
4. status/tag/badge system
5. loading, empty, and error states
6. AG Grid wrapper and data-cell renderers
7. search/filter and action-toolbar patterns

### Phase 5: Migrate Cashflow by Workflow Pattern

Migrate repeated static-table workflows as a family instead of treating each folder as an unrelated screen:

1. define a configurable data-workspace composition
2. migrate one representative feature
3. verify visual, keyboard, data-density, and error/loading behavior
4. migrate sibling features using configuration
5. delete feature-local copies only after parity is established

The same approach should then be applied to dashboard, group-management, authorization-limit, and `Cashflow_CN` workflows.

### Phase 6: Enforce and Remove Legacy Paths

1. prohibit new literal colors, arbitrary z-index values, and undocumented spacing values
2. prohibit new direct library components when a design-system equivalent exists
3. deprecate duplicate dialog generations and local grid wrappers
4. remove unused Less variables, CSS variables, and local style modules
5. add visual regression, accessibility, and compatibility checks to CI

## Definition of Success

The portal can be considered design-system unified when:

- all four applications consume the same versioned semantic-token source
- MUI, Ant, AG Grid, and Tailwind—where still present—derive visual decisions from those tokens
- there is one shared provider contract for light/dark mode, density, typography, and overlays
- common components have one documented API and state model
- cashflow workflows compose shared data-workspace primitives instead of maintaining feature-local copies
- keyboard focus is visible and core workflows meet agreed accessibility requirements
- component styles are packaged with the application and versions are reproducible
- design changes can be implemented centrally without editing dozens of feature-local style files
- root-config and the MFE build/runtime configuration can detect incompatible design-system versions
- visual regression coverage verifies representative shell, Ratan, and cashflow workflows in light and dark themes

## Assessment Limitations

This statement is based on static source and dependency analysis. During the assessment, no local portal services were running on ports 8001, 8002, 8009, or 8015. Consequently:

- no screenshots were used as evidence
- no visual comparison among applications was performed
- no keyboard, screen-reader, contrast, responsive, zoom, or reduced-motion testing was performed
- runtime CSS collisions and overlay behavior were not directly observed
- component usage counts indicate scale but do not prove that every import renders in a production workflow

A follow-up visual and accessibility audit should exercise representative flows after the portal is running. Recommended representative surfaces are login and shell navigation, tile/container creation, a Ratan data grid with filters and dialogs, and at least one cashflow static-table and `Cashflow_CN` workflow.

## Final Problem Statement

The portal's UI has evolved through application-local themes, several third-party component libraries, runtime component exports, and repeated feature implementations. Although meaningful reuse exists, there is no authoritative design-system package that controls tokens, providers, component APIs, accessibility states, library adapters, and version compatibility across the four applications.

As a result, visual and behavioral consistency depends on developers manually coordinating MUI, Ant Design, AG Grid, Tailwind, Emotion, Less, CSS variables, and local overrides. This coordination cost grows with every feature and makes even small portal-wide changes risky and expensive.

The required work is therefore a staged platform migration: stabilize immediate accessibility and version risks, establish one semantic token and provider contract, extract shared primitives and financial data-workflow patterns into a versioned package, migrate repeated cashflow implementations, and enforce the new contract through documentation, tests, and tooling.

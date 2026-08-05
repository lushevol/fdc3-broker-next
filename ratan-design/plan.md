# Portal Design System — Final Architecture and Implementation Proposal

**Status:** Proposed for architecture validation  
**Target platform:** Portal shell and independently deployed React micro-frontends  
**Package namespace:** `@portal-ui/*`  
**Primary consumers:** Portal platform team and tenant application teams  
**Design inspiration:** HeroUI developer experience with an original portal visual language  
**Behavior foundation:** Base UI, subject to validation against React Aria Components  
**Styling:** CSS Modules, CSS variables and cascade layers  
**Runtime model:** Provider-less, automatically bound to the portal shell  
**Telemetry model:** Semantic component events captured centrally from the DOM

---

# 1. Executive summary

The portal requires a shared design system that provides a consistent, accessible, observable and supportable user experience across independently developed micro-frontends.

The proposed Portal Design System will provide:

- A portal-owned visual language
- Accessible and composable React components
- Compact, data-dense interaction patterns for trading and operations workflows
- Strong CSS isolation for applications sharing the same browser document
- Controlled tenant customization
- Provider-less runtime integration
- Portal-wide theme, locale, density, overlay, toast and telemetry coordination
- Standard enterprise patterns such as filters, forms, data tables, status indicators and details panels
- Built-in interaction telemetry with a single shell-level subscription point
- Versioning, documentation, testing, migration and dependency governance
- Machine-readable guidance for coding agents and automated review tools

The intended developer experience is similar to HeroUI:

- Simple APIs for common cases
- Compound APIs for advanced composition
- Accessible headless behavior
- CSS-variable theming
- Granular package imports
- Strong TypeScript typing
- Minimal application setup
- No required React provider
- Consistent telemetry without tenant-side analytics integration

Example tenant usage:

```tsx
import { Button } from "@portal-ui/react";

export function SettlementActions() {
  return (
    <Button
      variant="primary"
      telemetry={{
        id: "confirm-settlement",
        label: "Confirm settlement",
      }}
    >
      Confirm
    </Button>
  );
}
```

No `PortalUIProvider`, theme provider or tenant telemetry client is required.

The system will not fork HeroUI or inherit its visual identity. It will adopt the strongest architectural principles from mature component systems while remaining optimized for the portal’s banking, micro-frontend and operational requirements.

---

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
- Inconsistent telemetry and incomplete product-usage visibility
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

> The Portal Design System is the standard UI contract for portal applications. It provides accessible components, enterprise interaction patterns, design tokens, telemetry instrumentation and safe coexistence within the shared portal canvas.

The design system should feel:

- Professional
- Precise
- Compact
- Calm
- Operationally efficient
- Suitable for long-running, data-heavy workflows
- Consistent without eliminating legitimate domain flexibility

It should not resemble a generic consumer website or marketing-oriented component library.

---

# 4. Goals and non-goals

## 4.1 Primary goals

The design system will:

1. Standardize portal UI behavior and appearance.
2. Prevent CSS leakage between micro-frontends.
3. Support compact and comfortable information density.
4. Provide accessible behavior by default.
5. Reduce duplicated implementation across tenant teams.
6. Enable predictable upgrades through semantic versioning.
7. Provide controlled extension points.
8. Coordinate theme, locale, density, overlays, notifications and telemetry.
9. Work across independently mounted React roots.
10. Require no tenant-side provider setup.
11. Provide built-in semantic telemetry.
12. Allow one central shell listener to receive all design-system events.
13. Make correct usage straightforward for developers and coding agents.
14. Support gradual migration from existing UI libraries.
15. Remain compatible with strict internal-network and dependency controls.

## 4.2 Non-goals

The design system will not own:

- Tenant business logic
- Tenant API clients
- Authentication implementation
- Authorization policy evaluation
- FDC3 routing
- OpenFin integration
- Workflow orchestration
- Application state management
- Tenant data models
- Tenant-specific branding
- Runtime calls to external services
- Application analytics pipelines
- Raw business-data collection

Portal platform capabilities outside presentation should remain in separate SDK packages.

---

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

## 5.4 Provider-less integration

Tenant applications must not be required to mount:

```tsx
<PortalUIProvider>
```

Runtime capabilities are resolved automatically from:

- The shared `@portal-ui/runtime` singleton
- A shell-injected global bridge
- Shell-owned DOM attributes
- The shared overlay root
- Runtime-managed event targets

This reduces tenant setup, prevents inconsistent configuration and allows components to work immediately after import.

## 5.5 Telemetry as a first-class capability

Telemetry is part of the component contract rather than an optional tenant implementation.

Components emit semantic events containing:

- Action
- Safe component value
- State
- Loading status
- Disabled status
- Logical hierarchy
- Application and page context
- Interaction trigger
- Outcome and performance where applicable

Telemetry must be:

- Centrally subscribable
- Vendor-neutral
- Schema-versioned
- Privacy-controlled
- Non-blocking
- Failure-isolated

## 5.6 Density as a system capability

Initial density modes:

```text
comfortable
compact
```

Density affects spacing, control height, row height and layout rhythm. It must not be implemented through browser zoom or indiscriminate font reduction.

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
┌──────────────────────────────────────────────────────────────┐
│                         Portal Shell                         │
│                                                              │
│  @portal-ui/runtime                                          │
│  ├─ Theme and density state                                  │
│  ├─ Locale and time-zone state                               │
│  ├─ Overlay registration                                     │
│  ├─ Toast coordination                                       │
│  ├─ Telemetry event target and queue                         │
│  ├─ Runtime compatibility reporting                          │
│  └─ Diagnostics                                              │
│                                                              │
│  Global tokens and base styles                               │
│  Shared overlay root                                         │
│  Central telemetry listener                                  │
└──────────────────────────────────────────────────────────────┘
                    │ automatic runtime binding
        ┌───────────┴───────────────────────────┐
        │                                       │
┌────────────────────────┐            ┌────────────────────────┐
│ Tenant micro-frontend A│            │ Tenant micro-frontend B│
│                        │            │                        │
│ @portal-ui/react       │            │ @portal-ui/react       │
│ Local component CSS    │            │ Local component CSS    │
│ Tenant features        │            │ Tenant features        │
│ No provider            │            │ No provider            │
└────────────────────────┘            └────────────────────────┘
```

---

# 7. Package architecture

## 7.1 `@portal-ui/runtime`

A small, stable, shared runtime.

Responsibilities:

- Theme configuration
- Density configuration
- Locale configuration
- Time-zone configuration
- Overlay-root registration
- Toast and notification coordination
- Telemetry dispatch and subscription
- Telemetry batching and sampling
- Z-index coordination
- Runtime compatibility reporting
- Runtime diagnostics
- Portal context resolution

It must not contain ordinary visual component implementations.

## 7.2 `@portal-ui/telemetry-schema`

A framework-independent telemetry contract containing:

- TypeScript event types
- JSON Schema definitions
- Runtime validators
- Schema-version constants
- Sanitization metadata
- Field classifications
- Event examples

This package should be usable by:

- React components
- The portal shell
- Telemetry processors
- Automated tests
- Backend validation services
- Documentation generators

## 7.3 `@portal-ui/tokens`

Framework-independent tokens.

Outputs:

```text
tokens.css
tokens.json
tokens.d.ts
```

Categories:

- Color
- Typography
- Spacing
- Sizing
- Radius
- Border
- Elevation
- Motion
- Breakpoints
- Z-index
- Density
- Component sizing

## 7.4 `@portal-ui/styles`

Contains:

- Cascade-layer declarations
- Scoped reset
- Themes
- Typography foundations
- Reduced-motion defaults
- Approved utilities
- Optional complete component CSS bundle

## 7.5 `@portal-ui/react`

Primary React components.

```tsx
import {
  Button,
  Card,
  Dialog,
  Field,
  Select,
} from "@portal-ui/react";
```

Subpath imports:

```tsx
import { Button } from "@portal-ui/react/button";
import { Dialog } from "@portal-ui/react/dialog";
```

Only documented exports are public.

## 7.6 `@portal-ui/icons`

An approved internal SVG icon collection.

Requirements:

- Tree-shakable
- No network loading
- Consistent dimensions
- Accessible title support
- No external font dependency
- Controlled naming and deprecation

## 7.7 `@portal-ui/patterns`

Higher-level enterprise patterns:

- `ApplicationPage`
- `PageHeader`
- `FilterBar`
- `SearchPanel`
- `DetailsPanel`
- `FormSection`
- `PermissionState`
- `ExceptionBanner`
- `StatusSummary`
- `AuditTimeline`
- `ColumnManager`
- `BulkActionBar`

Patterns must remain free of tenant business logic.

## 7.8 `@portal-ui/data-table`

A separately governed table subsystem, likely based internally on:

```text
TanStack Table
+
optional TanStack Virtual
+
Portal UI markup, accessibility and styling
```

The public API must not expose TanStack-specific state objects unnecessarily.

## 7.9 `@portal-ui/testing`

Shared helpers:

```tsx
renderWithPortalRuntime()
configureTestRuntime()
openDialog()
selectOption()
expectAccessible()
captureTelemetry()
```

## 7.10 `@portal-ui/eslint-plugin`

Potential rules:

- Prohibit internal imports
- Detect prohibited UI libraries
- Detect unsupported raw controls
- Detect inaccessible icon-only actions
- Detect global overrides of design-system internals
- Detect deprecated APIs
- Require telemetry identifiers for important business actions
- Detect unsafe telemetry values

## 7.11 Optional adapters

Optional packages may include:

```text
@portal-ui/react-hook-form
@portal-ui/tanstack-query
```

They should only be introduced when repeated integration code justifies them.

---

# 8. Component foundation

## 8.1 Provisional selection

Base UI is the provisional behavior foundation because it provides:

- Unstyled React primitives
- Compound component structure
- Accessible interaction behavior
- State exposed through data attributes
- Styling independence
- Direct DOM control
- Compatibility with CSS Modules

## 8.2 Fallback

React Aria Components is the fallback where Base UI does not meet requirements around:

- Collection behavior
- Internationalization
- Keyboard interaction
- Form semantics
- Focus management
- Screen-reader consistency

## 8.3 Validation spike

The spike must cover:

- Button
- Field
- Checkbox
- RadioGroup
- Dialog
- AlertDialog
- Tooltip
- Popover
- Menu
- Select
- Combobox
- Nested overlays
- Form submission and reset
- Controlled and uncontrolled state
- Keyboard-only usage
- Screen-reader behavior
- Shared overlay-root integration
- Provider-less runtime access
- Telemetry emission
- CSP compatibility
- Compact-density styling
- React Hook Form compatibility
- Tile unmount cleanup
- Bundle size and rendering cost

## 8.4 Selection gate

Base UI will be selected unless material problems are found in:

- Focus restoration
- Internationalized input
- Nested overlay behavior
- Form participation
- Collection navigation
- Screen-reader output
- Required custom interaction code
- Bundle size
- Runtime stability

Base UI and React Aria should not be mixed component-by-component without architectural approval.

---

# 9. Micro-frontend runtime contract

## 9.1 Shared singleton dependencies

The portal should share:

```text
react
react-dom
@portal-ui/runtime
```

Example Module Federation configuration:

```ts
shared: {
  react: {
    singleton: true,
    requiredVersion: "^18.2.0 || ^19.0.0",
  },
  "react-dom": {
    singleton: true,
    requiredVersion: "^18.2.0 || ^19.0.0",
  },
  "@portal-ui/runtime": {
    singleton: true,
    requiredVersion: "^1.0.0",
  },
}
```

## 9.2 Dependencies not shared by default

Normally local to each tenant bundle:

```text
@portal-ui/react
@base-ui/react
component CSS Modules
```

This avoids:

- Unexpected runtime substitution
- Shell-driven component behavior changes
- Cross-tenant release coupling
- Difficult rollback
- Private dependency conflicts

## 9.3 Provider-less runtime resolution

Components resolve the runtime through a stable function:

```ts
const runtime = getPortalUIRuntime();
```

Resolution order:

```text
1. Shared @portal-ui/runtime singleton
2. Shell-injected global runtime bridge
3. DOM-bound portal runtime metadata
4. Safe local fallback for development and tests
```

The global bridge should use a versioned symbol rather than an arbitrary global name:

```ts
const runtimeKey = Symbol.for("@portal-ui/runtime");
```

The shell registers:

```ts
globalThis[runtimeKey] = portalUIRuntime;
```

The runtime must validate compatibility before accepting a registration.

## 9.4 Tenant usage

No setup is required:

```tsx
createRoot(container).render(<Application />);
```

No theme provider, locale provider, overlay provider or telemetry provider is required.

## 9.5 Runtime fallback behavior

Outside the portal, such as Storybook or unit tests, components may use a safe local runtime providing:

- Default light theme
- Comfortable density
- Browser locale
- `body` overlay container
- In-memory telemetry sink
- Development diagnostics

Production portal usage must use the shell runtime.

## 9.6 Compatibility validation

Before mounting a tile, validate:

- React version
- React DOM version
- Runtime major version
- Supported component major versions
- Required portal capabilities
- Telemetry schema compatibility

A compatibility failure must produce a clear diagnostic rather than silently selecting an arbitrary version.

---

# 10. Styling architecture

## 10.1 Technology decision

```text
CSS variables
+
CSS Modules
+
CSS cascade layers
+
stable data attributes
```

Not required:

- CSS-in-JS
- Styled Components
- Emotion
- Tailwind CSS
- Runtime style injection

## 10.2 Component output

```html
<button
  class="pui_Button_root_a7f3"
  data-pui-component="Button"
  data-pui-telemetry-id="confirm-settlement"
  data-pui-variant="primary"
  data-pui-loading="false"
  data-pui-disabled="false"
>
  Confirm
</button>
```

Internal classes are private and hashed.

## 10.3 Cascade-layer order

The shell declares:

```css
@layer reset, portal-theme, portal-components, tenant-components, utilities;
```

This declaration must load before tenant component CSS.

## 10.4 Shell-loaded styles

```css
@import "@portal-ui/styles/layers.css";
@import "@portal-ui/styles/tokens.css";
@import "@portal-ui/styles/base.css";
@import "@portal-ui/styles/themes/default.css";
```

## 10.5 Component-loaded styles

```tsx
import styles from "./button.module.css";
```

Styles load with component chunks.

## 10.6 Optional complete bundle

```css
@import "@portal-ui/styles/all.css";
```

Intended for:

- Documentation
- Prototypes
- Visual testing
- Non-bundled consumers

It is not the normal portal production path.

## 10.7 Reset scope

Avoid an uncontrolled global reset.

Prefer:

```css
[data-portal-ui-root] {
  box-sizing: border-box;
  font-family: var(--pui-font-family-body);
}
```

---

# 11. Token architecture

## 11.1 Hierarchy

```text
Primitive tokens
       ↓
Semantic tokens
       ↓
Component tokens
       ↓
Component implementation
```

## 11.2 Primitive tokens

```css
--pui-blue-600
--pui-neutral-100
--pui-space-4
--pui-radius-2
--pui-font-size-14
```

Tenant applications should not normally override them.

## 11.3 Semantic tokens

```css
--pui-color-background
--pui-color-surface
--pui-color-surface-raised
--pui-color-text
--pui-color-text-muted
--pui-color-border
--pui-color-accent
--pui-color-critical
--pui-color-warning
--pui-color-success
```

Approved theming occurs primarily at this layer.

## 11.4 Component tokens

Use only where a stable component-specific contract is required:

```css
--pui-control-height-md
--pui-table-row-height
--pui-dialog-max-width
```

## 11.5 Naming requirements

Tokens must:

- Describe purpose, not temporary appearance
- Avoid tenant-specific terminology
- Remain stable across themes
- Distinguish foreground, background and border roles
- Support light, dark and high-contrast modes

---

# 12. Theme and density

## 12.1 Theme

Initial themes:

```text
light
dark
```

Applied by the shell:

```html
<html
  data-portal-ui-root
  data-theme="light"
  data-density="compact"
>
```

Per-tenant visual themes are not supported by default.

## 12.2 Density

```css
[data-density="comfortable"] {
  --pui-control-height-sm: 28px;
  --pui-control-height-md: 36px;
  --pui-table-row-height: 40px;
}

[data-density="compact"] {
  --pui-control-height-sm: 24px;
  --pui-control-height-md: 28px;
  --pui-table-row-height: 32px;
}
```

Density may affect:

- Control height
- Component padding
- Row height
- Toolbar spacing
- Section spacing
- Icon gaps

---

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
density
```

Avoid parallel naming such as `isDisabled` or `hasError`.

## 13.2 Visual meaning

- `variant`: visual hierarchy
- `tone`: semantic status
- `size`: physical size
- `density`: information density

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

An `asChild` model may be considered only if it preserves semantics, typing, disabled behavior and telemetry.

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
- Data-table behaviors likely to become standard
- Exceptions to density rules

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

The runtime exposes:

```ts
interface PortalUILocaleConfig {
  locale: string;
  timeZone: string;
  messages: PortalUIMessageCatalog;
  numberFormat?: Intl.NumberFormatOptions;
  dateFormat?: Intl.DateTimeFormatOptions;
}
```

Responsibility split:

| Concern | Owner |
|---|---|
| Date and number formatting | Portal runtime and native `Intl` |
| Accessibility messages | Design system |
| Generic component labels | Design system catalog |
| Application content | Tenant |
| Business validation messages | Tenant |
| Time zone | Portal shell |
| Locale selection | Portal shell or user preference |

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

Use intent-based tokens:

```css
--pui-motion-duration-feedback
--pui-motion-duration-overlay
--pui-motion-duration-navigation
--pui-motion-easing-enter
--pui-motion-easing-exit
```

Respect:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --pui-motion-duration-feedback: 0ms;
    --pui-motion-duration-overlay: 0ms;
    --pui-motion-duration-navigation: 0ms;
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

## 18.1 Shared overlay root

```html
<div id="portal-overlay-root">
  <div data-overlay-layer="popover"></div>
  <div data-overlay-layer="modal"></div>
  <div data-overlay-layer="toast"></div>
</div>
```

## 18.2 Runtime registration

```ts
configurePortalUIRuntime({
  overlayRoot: document.getElementById("portal-overlay-root"),
});
```

This occurs in the shell, not tenant applications.

## 18.3 Overlay contract

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

## 18.4 Theme and density inheritance

Portalled content must receive current theme and density:

```tsx
<Dialog.Portal container={runtime.overlay.modal}>
  <div
    data-theme={runtime.theme}
    data-density={runtime.density}
  >
    <Dialog.Backdrop />
    <Dialog.Popup />
  </div>
</Dialog.Portal>
```

## 18.5 Logical hierarchy preservation

Because a portalled overlay is physically outside its trigger hierarchy, the runtime must preserve the trigger’s logical telemetry hierarchy and attach it to overlay events.

---

# 19. Telemetry architecture

## 19.1 Objective

Portal UI telemetry provides a standardized understanding of how users interact with components across micro-frontends.

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
Portal UI component
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
data-pui-component
data-pui-slot
data-pui-telemetry-id
data-pui-telemetry-name
data-pui-loading
data-pui-disabled
data-pui-state
```

Example:

```html
<section
  data-pui-component="ApplicationPage"
  data-pui-telemetry-id="trade-search"
>
  <div
    data-pui-component="FilterBar"
    data-pui-telemetry-id="primary-filters"
  >
    <button
      data-pui-component="Select"
      data-pui-telemetry-id="currency-select"
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
interface PortalUITelemetryProps {
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

## 29.1 API

```ts
type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghost";

type ButtonTone =
  | "neutral"
  | "accent"
  | "critical";

interface ButtonProps
  extends Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      "color"
    >,
    PortalUITelemetryProps {
  variant?: ButtonVariant;
  tone?: ButtonTone;

  size?: "sm" | "md" | "lg";
  density?: "inherit" | "comfortable" | "compact";

  loading?: boolean;
  loadingLabel?: string;

  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;

  fullWidth?: boolean;

  children: React.ReactNode;
}
```

Defaults:

```ts
{
  variant: "secondary",
  tone: "neutral",
  size: "md",
  density: "inherit",
  loading: false,
  fullWidth: false,
  type: "button"
}
```

`type` defaults to `button` to prevent accidental form submission.

## 29.2 Usage

```tsx
<Button variant="primary">
  Confirm
</Button>
```

```tsx
<Button
  variant="primary"
  tone="critical"
>
  Delete
</Button>
```

```tsx
<Button
  variant="primary"
  loading={isSubmitting}
  loadingLabel="Confirming settlement"
  telemetry={{
    id: "confirm-settlement",
    label: "Confirm settlement",
    loadingReason: "settlement-submission",
  }}
>
  Confirm
</Button>
```

## 29.3 Loading behavior

When loading:

- Keep the button mounted.
- Preserve layout width.
- Prevent repeated activation.
- Use `aria-disabled`.
- Retain focus where possible.
- Show a progress indicator.
- Announce the loading label.
- Emit loading transition telemetry.

## 29.4 Icon-only actions

Use:

```tsx
<IconButton
  aria-label="Refresh results"
  icon={<RefreshIcon />}
/>
```

Do not use an empty `Button`.

---

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
interface SelectRootProps<TValue extends string>
  extends PortalUITelemetryProps {
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

  telemetry?: {
    label?: string;
    classification?: "safe" | "restricted";
  };
}
```

`textValue` is used for typeahead and accessibility. It is not automatically collected as telemetry.

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

`Select.Portal` defaults to the shell-owned overlay root.

It must preserve:

- Theme
- Density
- Locale
- Source hierarchy
- Application context
- Z-index layer

## 30.8 Telemetry

Selection event:

```json
{
  "eventName": "ui.action",
  "action": {
    "type": "selection-change",
    "trigger": "pointer"
  },
  "component": {
    "type": "Select",
    "id": "currency-select",
    "name": "currency"
  },
  "value": {
    "type": "selection",
    "optionValue": "USD",
    "selectedValues": ["USD"],
    "previousValues": ["HKD"],
    "selectedCount": 1
  },
  "state": {
    "disabled": false,
    "loading": false,
    "readOnly": false,
    "invalid": false,
    "expanded": true
  }
}
```

Close reasons may include:

```text
selection
escape-key
outside-press
focus-loss
programmatic
```

---

# 31. DataTable API and strategy

## 31.1 Objectives

`DataTable` must support:

- Typed columns
- Client-side and server-side modes
- Sorting
- Filtering
- Pagination
- Row selection
- Loading, refreshing, empty and error states
- Custom cells
- Compact density
- Sticky headers
- Column resizing
- Incremental refresh
- Safe telemetry

It must not expose the internal table-engine API as its permanent public contract.

## 31.2 Root API

```ts
interface DataTableProps<
  TRow,
  TRowId extends string = string,
> extends PortalUITelemetryProps {
  data: readonly TRow[];
  columns: readonly DataTableColumn<TRow>[];

  getRowId: (row: TRow) => TRowId;

  loading?: boolean;
  refreshing?: boolean;
  error?: DataTableError;

  emptyState?: React.ReactNode;
  errorState?: React.ReactNode;
  loadingState?: React.ReactNode;

  sorting?: DataTableSortingState;
  defaultSorting?: DataTableSortingState;
  onSortingChange?: (
    sorting: DataTableSortingState,
    details: DataTableSortingChangeDetails,
  ) => void;

  filters?: DataTableFilterState;
  defaultFilters?: DataTableFilterState;
  onFiltersChange?: (
    filters: DataTableFilterState,
    details: DataTableFilterChangeDetails,
  ) => void;

  pagination?: DataTablePaginationState;
  defaultPagination?: DataTablePaginationState;
  onPaginationChange?: (
    pagination: DataTablePaginationState,
    details: DataTablePaginationChangeDetails,
  ) => void;

  rowSelection?: DataTableRowSelectionState<TRowId>;
  defaultRowSelection?: DataTableRowSelectionState<TRowId>;
  onRowSelectionChange?: (
    selection: DataTableRowSelectionState<TRowId>,
    details: DataTableSelectionChangeDetails<TRowId>,
  ) => void;

  totalRowCount?: number;

  operationMode?: {
    sorting?: "client" | "server";
    filtering?: "client" | "server";
    pagination?: "client" | "server";
  };

  stickyHeader?: boolean;
  resizableColumns?: boolean;
  selectableRows?: boolean;

  onRowAction?: (
    row: TRow,
    details: DataTableRowActionDetails<TRowId>,
  ) => void;
}
```

## 31.3 Column API

```ts
interface DataTableColumn<TRow> {
  id: string;
  header: React.ReactNode;

  accessor?: keyof TRow | ((row: TRow) => unknown);

  cell?: (
    context: DataTableCellContext<TRow>,
  ) => React.ReactNode;

  width?: number;
  minWidth?: number;
  maxWidth?: number;

  align?: "start" | "center" | "end";

  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;

  pinned?: "start" | "end" | false;

  visibility?: {
    defaultVisible?: boolean;
    hideable?: boolean;
  };

  telemetry?: {
    id?: string;
    classification?: "safe" | "restricted";
  };
}
```

## 31.4 Sorting

```ts
interface DataTableSort {
  columnId: string;
  direction: "ascending" | "descending";
}

type DataTableSortingState =
  readonly DataTableSort[];
```

Telemetry records the column ID and direction, not cell contents.

## 31.5 Filtering

```ts
interface DataTableFilter {
  id: string;
  operator: string;
  value: unknown;
}
```

Application callbacks receive raw values. Telemetry receives classifications:

```text
empty
single-value
multiple-values
date-range
numeric-range
free-text-present
```

Raw filter values are not emitted.

## 31.6 Selection

```ts
type DataTableRowSelectionState<
  TRowId extends string,
> = ReadonlySet<TRowId> | "all";
```

Telemetry records counts, not row IDs.

## 31.7 Loading versus refreshing

- `loading`: no usable primary result is available.
- `refreshing`: existing data remains visible while an update runs.

These states must be visually and semantically distinct.

## 31.8 Row actions

Row activation must be explicit:

```tsx
<DataTable
  onRowAction={(row) => {
    openTradeDetails(row.id);
  }}
/>
```

Do not infer actions from every row click.

## 31.9 Initial scope

First stable release:

- Typed columns
- Sorting
- Filtering hooks
- Pagination
- Loading
- Refreshing
- Empty state
- Error state
- Row selection
- Custom cells
- Compact density
- Sticky header
- Basic resizing
- Server-side operation modes

## 31.10 Later scope

Potential later capabilities:

- Virtualized rows
- Virtualized columns
- Pinning
- Grouping
- Saved views
- Column manager
- Keyboard cell navigation
- Copy to clipboard
- Bulk actions
- Export hooks
- Permission-aware columns
- Row expansion
- Tree structures

## 31.11 Excluded from first release

- Spreadsheet editing
- Formula support
- Arbitrary merged cells
- Pivot tables
- Full grid personalization
- Complex cross-row validation

---

# 32. Initial component roadmap

## 32.1 Foundation

```text
Button
IconButton
Link
Text
Heading
Divider
Badge
Avatar
Spinner
Skeleton
Tooltip
```

## 32.2 Forms

```text
Field
Input
TextArea
Checkbox
RadioGroup
Switch
Select
Combobox
FormMessage
```

## 32.3 Overlays

```text
Dialog
AlertDialog
Drawer
Popover
Menu
ContextMenu
Toast
```

## 32.4 Application components

```text
Card
Tabs
Breadcrumbs
Pagination
Toolbar
Accordion
EmptyState
ErrorState
Result
```

## 32.5 Enterprise patterns

```text
ApplicationPage
PageHeader
FilterBar
DetailsPanel
FormSection
StatusIndicator
ExceptionSummary
PermissionState
AuditTimeline
BulkActionBar
```

## 32.6 Flagship capabilities

Highest-impact components:

1. `ApplicationPage`
2. `Field`
3. `Button`
4. `Dialog`
5. `Select`
6. `FilterBar`
7. `DataTable`
8. `DetailsPanel`
9. `StatusIndicator`
10. `EmptyState`
11. `ErrorState`
12. `PermissionState`

---

# 33. Repository structure

```text
portal-design-system/
├── apps/
│   ├── docs/
│   ├── storybook/
│   └── playground/
│
├── packages/
│   ├── runtime/
│   ├── telemetry-schema/
│   ├── tokens/
│   ├── styles/
│   ├── react/
│   ├── icons/
│   ├── patterns/
│   ├── data-table/
│   ├── testing/
│   └── eslint-plugin/
│
├── tooling/
│   ├── build/
│   ├── codemods/
│   ├── generators/
│   └── scripts/
│
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

Component structure:

```text
packages/react/src/button/
├── button.tsx
├── button.types.ts
├── button.module.css
├── button.test.tsx
├── button.a11y.test.tsx
├── button.telemetry.test.tsx
├── button.stories.tsx
├── button.examples.tsx
└── index.ts
```

Recommended tooling:

```text
pnpm workspace
Turborepo
TypeScript
Storybook
Vitest or Jest
React Testing Library
Playwright
Axe
Changesets
ESLint
Stylelint
```

---

# 34. Package and build requirements

Every package must:

- Produce ESM output
- Publish TypeScript declarations
- Declare explicit exports
- Support tree shaking
- Avoid unintended side effects
- Mark required CSS side effects correctly
- Publish through the internal npm registry
- Expose package-version metadata
- Avoid public runtime assets
- Avoid external telemetry SDK dependencies
- Produce an SBOM
- Pass license and vulnerability checks

Example exports:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./button": {
      "types": "./dist/button/index.d.ts",
      "import": "./dist/button/index.js"
    },
    "./styles.css": "./dist/styles.css"
  }
}
```

---

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
- Runtime-contract changes

## 35.2 Telemetry schema versioning

Telemetry schema changes follow semantic versioning.

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
@portal-ui/runtime version
Telemetry schema versions
Supported @portal-ui/react versions
Supported React versions
Supported browser versions
```

---

# 36. Documentation requirements

Every component page must include:

1. Purpose
2. When to use
3. When not to use
4. Anatomy
5. Variants
6. States
7. Density behavior
8. Keyboard behavior
9. Accessibility
10. Internationalization
11. Content guidance
12. Customization slots
13. Examples
14. API
15. Tokens
16. Telemetry events
17. Telemetry values
18. Privacy behavior
19. Migration notes
20. Known limitations

Documentation should use real portal scenarios:

- Trade search
- Settlement confirmation
- Exception handling
- Permission restriction
- Bulk operations
- Incremental refresh
- Audit-history viewing
- Long-running processes

---

# 37. AI-ready development support

Publish:

```text
llms.txt
components.json
tokens.json
examples.json
telemetry-schema.json
telemetry-events.json
deprecated-apis.json
migration-mappings.json
```

Internal coding guidance should explain:

- Approved imports
- Correct component usage
- Accessibility expectations
- Form patterns
- Layout conventions
- Token usage
- Prohibited overrides
- Telemetry identifiers
- Prohibited telemetry values
- MUI migration mappings
- Ant Design migration mappings

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
- Compact-density tests
- Overlay nesting tests
- Native form tests

Dialog, Select, Combobox and DataTable require manual accessibility review before stable release.

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
- Data-table scrolling
- Memory cleanup after tile unmount
- Telemetry dispatch overhead
- Telemetry queue behavior
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
Typical telemetry event:     below 2 KB
Telemetry dispatch:          non-blocking
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
- No external telemetry destination
- No public CDN dependency
- No direct external services
- No unauthorized telemetry extensions
- Privacy review for new telemetry fields

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
- Shared overlay root
- Open Shadow DOM where applicable

Unsupported behavior must be documented.

---

# 42. Governance model

## 42.1 Platform-team ownership

The platform team owns:

- Architecture
- Tokens
- Component APIs
- Runtime
- Telemetry schema
- Privacy rules
- Accessibility
- Package releases
- Documentation
- Security review
- Compatibility policy
- Deprecation
- Overlay architecture
- Telemetry sinks and batching

## 42.2 Tenant-team ownership

Tenant teams own:

- Correct adoption
- Business composition
- Application content
- Application-level accessibility
- Safe telemetry identifiers
- Migration within the supported window
- Reporting missing patterns and defects
- Avoiding restricted telemetry data

## 42.3 Contribution requirements

A proposed shared component must include:

- Demonstrated reuse
- User problem
- API proposal
- Accessibility behavior
- Token requirements
- Customization model
- Telemetry behavior
- Privacy classification
- Test plan
- Documentation
- Maintenance owner

Tenant-specific components remain local until repeated reuse justifies promotion.

## 42.4 Review requirements

Review is required for changes affecting:

- Public API
- Tokens
- Accessibility
- Runtime contract
- Telemetry schema
- Telemetry privacy
- Overlay behavior
- CSS layering
- Dependencies
- Major visual patterns

---

# 43. Delivery roadmap

## Phase 0 — Architecture validation

Deliver:

- Base UI versus React Aria comparison
- Module Federation runtime proof
- Provider-less runtime proof
- Global runtime bridge
- Shared overlay-root proof
- CSS isolation proof
- Density proof
- Form integration proof
- Telemetry event schema
- Central root listener
- Hierarchy resolution
- Portalled hierarchy preservation
- Privacy sanitizer
- Telemetry performance measurements
- Runtime diagnostics
- Button, Input, Select, Dialog and DataTable prototypes

Exit criteria:

- Foundation selected
- Provider-less model proven
- Runtime compatibility model proven
- No critical accessibility issue
- No critical CSS leakage issue
- Central telemetry receives events from every test MFE
- Restricted data is rejected or redacted
- Telemetry overhead is acceptable

## Phase 1 — Foundation

Packages:

```text
@portal-ui/runtime
@portal-ui/telemetry-schema
@portal-ui/tokens
@portal-ui/styles
@portal-ui/react
@portal-ui/icons
@portal-ui/testing
```

Components:

```text
Button
IconButton
Text
Heading
Badge
Spinner
Skeleton
Field
Input
Checkbox
Tooltip
Dialog
Card
```

Also deliver:

- Documentation site
- Storybook
- Release pipeline
- Compatibility diagnostics
- Telemetry inspector

## Phase 2 — Forms and navigation

```text
TextArea
RadioGroup
Switch
Select
Combobox
FormMessage
Tabs
Breadcrumbs
Pagination
Menu
Popover
Toast
Drawer
```

## Phase 3 — Enterprise patterns

```text
ApplicationPage
PageHeader
FilterBar
DetailsPanel
FormSection
StatusIndicator
EmptyState
ErrorState
PermissionState
ExceptionSummary
```

## Phase 4 — Data table

Deliver the separately governed table subsystem.

## Phase 5 — Migration and enforcement

Deliver:

- MUI migration mappings
- Ant Design migration mappings
- Codemods
- ESLint enforcement
- Adoption dashboard
- Deprecated-library policy
- Tenant migration playbook
- Telemetry-compliance validation

---

# 44. Adoption strategy

1. New portal applications use the design system.
2. Existing applications adopt tokens and global foundations.
3. Shared states and overlays migrate.
4. Common controls migrate incrementally.
5. Enterprise patterns replace repeated implementations.
6. Telemetry becomes automatic as components migrate.
7. Legacy UI libraries are removed when no longer required.
8. Enforcement becomes stricter after migration tooling exists.

Indefinite mixed-library usage requires an approved migration plan.

---

# 45. Key risks and mitigations

| Risk | Mitigation |
|---|---|
| Base UI lacks required behavior | Complete the foundation spike and retain React Aria as fallback |
| Provider-less runtime is difficult to debug | Versioned global bridge, strict diagnostics and safe fallback |
| Component package becomes a singleton accidentally | Share only React, React DOM and runtime |
| Design system becomes a dumping ground | Enforce package boundaries and contribution criteria |
| Runtime version conflicts | Compatibility matrix and pre-mount validation |
| CSS leakage | CSS Modules, scoped reset and cascade layers |
| Tenant overrides fragment the UI | Controlled props, tokens, slots and review |
| Overlay conflicts | Shell-owned overlay root and runtime coordination |
| Portalled events lose hierarchy | Capture and preserve logical source hierarchy |
| Telemetry overload | Batching, sampling, limits and event governance |
| Telemetry impacts UI latency | Asynchronous local queue and no synchronous network calls |
| Sensitive data is collected | Safe defaults, schema validation and sanitization |
| Invalid tenant telemetry breaks processing | Treat tenant fields as untrusted |
| Data table delays the program | Deliver it as a separate subsystem |
| Accessibility regressions | Automated and manual quality gates |
| Package growth affects performance | Bundle budgets and dependency governance |
| Shell upgrades break tenants | Version compatibility and controlled contracts |
| Documentation becomes stale | Generate API, token and telemetry docs during releases |

---

# 46. Final acceptance criteria

The first production-ready release is accepted when:

1. Two independently deployed tenant applications can use different compatible `@portal-ui/react` versions on one page.
2. React, React DOM and `@portal-ui/runtime` resolve as shared singletons.
3. No tenant application requires a provider.
4. Components automatically resolve shell theme, locale, density and overlays.
5. Theme and density remain consistent across independent React roots.
6. Dialogs, popovers, selects and toasts use the shared overlay architecture.
7. Portalled telemetry retains its logical trigger hierarchy.
8. Component CSS does not leak into tenant content.
9. Tenant CSS cannot unintentionally override internal classes.
10. Components work in compact and comfortable density.
11. Foundation components pass accessibility gates.
12. React Hook Form integration works without a core dependency.
13. Global styles load once and component styles remain chunkable.
14. Root and subpath imports work.
15. No runtime request targets an external asset or service.
16. Version compatibility is validated before tile mounting.
17. The shell receives telemetry from all tenant React roots through one central listener.
18. Button telemetry contains a safe action label.
19. Select telemetry contains the option value and selected values.
20. Input telemetry does not expose raw input.
21. Data-table telemetry does not expose rows or restricted cell content.
22. Loading-start and loading-end events can be correlated.
23. Disabled state and categorical reason are available where configured.
24. Native disabled accessibility is not weakened.
25. Invalid telemetry cannot break UI execution.
26. Restricted telemetry data is rejected or redacted.
27. Telemetry processing is asynchronous and non-blocking.
28. Telemetry schema and component APIs are documented and versioned.
29. Runtime diagnostics expose compatibility and telemetry status.
30. A pilot tenant adopts the system without design-system-team modifications to tenant source.

---

# 47. Final architectural decisions

| Area | Decision |
|---|---|
| Design inspiration | HeroUI-like developer experience with original portal styling |
| Behavior foundation | Base UI, subject to validation |
| Fallback foundation | React Aria Components |
| API model | Simple APIs plus compound components |
| Provider | Not required |
| Runtime binding | Automatic through shared runtime, global bridge and DOM metadata |
| Shared singletons | React, React DOM and `@portal-ui/runtime` |
| Component package singleton | No |
| Base UI singleton | No |
| Styling | CSS Modules, CSS variables and cascade layers |
| CSS-in-JS | Not used |
| Tailwind dependency | Not required |
| Theme | Shell-owned semantic CSS variables |
| Density | Comfortable and compact |
| Customization | Props, semantic tokens and documented slots |
| Overlay | Shell-owned shared overlay root |
| Forms | Form-library-neutral |
| Internationalization | Runtime locale and message contract |
| Data table | Separate TanStack-based subsystem |
| Telemetry | First-class semantic component capability |
| Central subscription | Root DOM listener in capture mode |
| Telemetry transport | Bubbling and composed `CustomEvent` plus runtime reliability channel |
| Button telemetry value | Safe action label |
| Select telemetry value | Option value and current selected values |
| Input telemetry value | Redacted by default |
| Table telemetry value | Column IDs, operation metadata and counts only |
| Loading and disabled state | Included in structured state snapshots |
| Hierarchy | DOM-derived logical hierarchy with portal preservation |
| Telemetry schema | Versioned independent package |
| Repository | pnpm workspace and Turborepo |
| Documentation | Storybook and dedicated docs application |
| Governance | Semver, compatibility matrix, deprecation and codemods |
| Security | Internal registry, SBOM, license, CVE and privacy governance |
| AI support | Machine-readable components, tokens, examples and telemetry contracts |

---

# 48. Recommendation

Proceed with Phase 0 architecture validation before broad component implementation.

The validation must prove:

1. Base UI or React Aria foundation suitability
2. Provider-less runtime resolution
3. Module Federation singleton behavior
4. Independent React-root compatibility
5. Shared overlay hosting
6. Logical overlay hierarchy
7. CSS isolation and cascade-layer ordering
8. Compact-density behavior
9. Form-library compatibility
10. Accessibility behavior
11. Central telemetry capture
12. Safe button, select, input and data-table values
13. Loading and disabled-state telemetry
14. Privacy enforcement
15. Acceptable bundle and interaction performance

The target outcome is not merely an npm component package. It is a governed portal UI platform that provides consistent behavior, visual language, accessibility, observability, isolation and long-term upgradeability across all tenant applications.
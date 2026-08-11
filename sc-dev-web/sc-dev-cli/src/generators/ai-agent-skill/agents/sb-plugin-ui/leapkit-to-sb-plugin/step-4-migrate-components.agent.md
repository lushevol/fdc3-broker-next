---
tools: ['edit/editFiles', 'read/readFile', 'search', 'search/codebase']
description: 'Step 4 of leapkit-to-sb-plugin migration — Converts every React component in src/pages/ and src/components/ into a LitElement TypeScript component. Processes pages first (orchestrators), then child components.'
---

# Step 4 — Migrate React Components to LitElement

## Role

You are converting every React component from the original leap-kit project into a LitElement 3 TypeScript component following Service Bench plugin conventions.

Load the `sb-plugin-dev` skill immediately before writing any component code — it is the authoritative source for SB plugin LitElement patterns.

---

## Autonomous Execution Rules

- ✅ Load `sb-plugin-dev` skill before writing component code
- ✅ Process all pages and components without asking per-file confirmation
- ✅ Derive all names, prefixes, and paths from actual project files
- ✅ Create files in the correct SB plugin directory structure
- ✅ Apply the full lifecycle, state, event, and layout conventions
- ❌ NEVER skip a component — migrate every identified file from the Step 1 inventory
- ❌ NEVER use React patterns (JSX, useState, class state) in output code
- ❌ NEVER keep `@leap/sdk` imports — replace ALL with `@scdevkit` equivalents
- ❌ NEVER use `px` units — always convert to `rem` (1px = 0.0625rem)
- ❌ NEVER use `@sc-sb-project/` in any source file — it is only allowed in `package.json` and azure-pipeline yaml files

---

## Pre-Migration Checks

For each source file, read the original React code from `_leapkit-archive/src/` (archived in Step 2) completely before writing the LitElement equivalent. Extract:
1. The component's responsibilities (what it renders/does)
2. State variables → `@state()` candidates
3. Props received → `@property()` candidates
4. Methods and event handlers
5. Lifecycle hooks used
6. `@leap/sdk` components used (see mapping table)
7. Any `Guard`, `withNavigation`, or service calls

---

## Migration Order

**Process pages first (Section A), then child components (Section B).**

This order ensures the orchestrator pattern is established before child components are wired into it.

---

## Section A — Page Orchestrators (`src/pages/` → `src/views/`)

For each page in the Step 1 inventory, create:
- `src/views/[feature]/[Feature]Page.ts` — the LitElement page orchestrator
- `elements/[feature].js` — the custom element registration file
- Add `import './[feature].js';` to `elements/index.js`

### Template: Page Orchestrator

```typescript
// src/views/[feature]/[Feature]Page.ts
import { css, html, LitElement, nothing } from 'lit';
import { state } from 'lit/decorators.js';
import { createContext, contexts } from '@scdevkit/service-bench-core';
import { ApiService } from '../../api/ApiService';
import { PLUGIN_PREFIX, EVENT_PREFIX } from '../../constants/app';
// Import child component(s) registered in this page
// import '../[feature]/components/[FeatureChild]';

const userContext = createContext(contexts.USER);
const navContext  = createContext(contexts.NAVIGATION);

export class [Feature]Page extends LitElement {
  private _api = new ApiService(this);
  private _user = userContext.createConsumer(this);
  private _nav  = navContext.createConsumer(this);

  // --- State (from React this.state / useState) ---
  @state() private _data: [Type][] = [];
  @state() private _isLoading = false;
  @state() private _error: string | null = null;

  static styles = css`
    :host { display: block; height: 100%; width: 100%; }
    .page-wrapper { display: flex; flex-direction: column; height: 100%; }
  `;

  async connectedCallback() {
    super.connectedCallback();
    // Stop @scdevkit events from leaking out of the page
    const stopLeaking = (e: Event) => e.stopPropagation();
    this.addEventListener('sc-close', stopLeaking);
    this.addEventListener('sc-select', stopLeaking);
    await this._fetchData();
  }

  private async _fetchData() {
    this._isLoading = true;
    try {
      this._data = await this._api.get<[Type][]>('/api/[namespace]/v1/[resource]');
    } catch (err: unknown) {
      this._error = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      this._isLoading = false;
    }
  }

  render() {
    if (this._isLoading) return html`<sc-spinner></sc-spinner>`;
    if (this._error)     return html`<sc-alert type="error">${this._error}</sc-alert>`;

    return html`
      <div class="page-wrapper">
        <!-- child components -->
      </div>
    `;
  }
}
```

### Template: Element Registration

```js
// elements/[feature].js
import { [Feature]Page } from '../src/views/[feature]/[Feature]Page.js';

if (!window.customElements.get('[prefix]-[feature]')) {
  window.customElements.define('[prefix]-[feature]', [Feature]Page);
}
```

---

## Section B — Child Components (`src/components/` → `src/views/[feature]/components/`)

For each React component that is NOT a page orchestrator, create a LitElement child component.

### Template: Child Component

```typescript
// src/views/[feature]/components/[ComponentName].ts
import { css, html, LitElement, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { EVENT_PREFIX } from '../../../constants/app';
import { [Type] } from '../../../types';

export class [ComponentName] extends LitElement {
  // Data flowing down from orchestrator
  @property({ type: Array }) items: [Type][] = [];
  @property({ type: Boolean }) isLoading = false;

  static styles = css`
    :host { display: block; }
  `;

  private _handleAction(item: [Type]) {
    this.dispatchEvent(new CustomEvent(`${EVENT_PREFIX}[action-name]`, {
      bubbles: true,
      composed: true,
      detail: { item },
    }));
  }

  render() {
    if (!this.items.length) return nothing;
    return html`
      <!-- sc-* components here -->
    `;
  }
}

if (!window.customElements.get('[prefix]-[component-name]')) {
  customElements.define('[prefix]-[component-name]', [ComponentName]);
}
```

### Register import in the page orchestrator file

Add at the top of `[Feature]Page.ts`:
```typescript
import './components/[ComponentName].js';
```

---

## Conversion Rules per React Pattern

### Class component state → LitElement @state

```typescript
// React
this.state = { items: [], loading: false };
this.setState({ loading: true });
const { items } = this.state;

// LitElement
@state() private _items: Item[] = [];
@state() private _loading = false;
this._loading = true;
this._items
```

### Functional hooks → @state

```typescript
// React
const [count, setCount] = useState(0);

// LitElement
@state() private _count = 0;
// setter: this._count = newValue
```

### Props → @property

```typescript
// React
const { title, onSave } = this.props;

// LitElement (child component)
@property({ type: String }) title = '';
// callbacks become CustomEvents dispatched up
```

### componentDidMount → connectedCallback

```typescript
// React
async componentDidMount() {
  const data = await Service.getAll();
  this.setState({ data });
}

// LitElement
async connectedCallback() {
  super.connectedCallback();
  await this._fetchData();
}

private async _fetchData() {
  this._isLoading = true;
  try {
    this._data = await this._api.get('/api/...');
  } catch (err) {
    this._error = err instanceof Error ? err.message : 'Error';
  } finally {
    this._isLoading = false;
  }
}
```

### componentWillUnmount → disconnectedCallback

```typescript
// React
componentWillUnmount() {
  document.removeEventListener('keydown', this.onKeyDown);
}

// LitElement
disconnectedCallback() {
  super.disconnectedCallback();
  document.removeEventListener('keydown', this._onKeyDown);
}
```

### Callback props → CustomEvents

```typescript
// React (parent passes callback to child)
<LinkCard onSelect={this.handleSelect} />
// Child calls: this.props.onSelect(item)

// LitElement — child dispatches event
this.dispatchEvent(new CustomEvent(`${EVENT_PREFIX}link-selected`, {
  bubbles: true, composed: true, detail: { item },
}));

// LitElement — orchestrator listens
html`<sb-[plugin-name]-link-card
  @sb-go-url-link-selected=${this._handleLinkSelected}
></sb-[plugin-name]-link-card>`
```

### withNavigation HOC → contexts.NAVIGATION

```typescript
// React
export default withNavigation(MyComponent);
// Used as: this.props.goTo('/explore');

// LitElement
const navContext = createContext(contexts.NAVIGATION);
private _nav = navContext.createConsumer(this);

private _navigate(path: string) {
  const nav = this._nav.value as NavigationContext;
  nav?.go(path);
}
```

### Guard (permission) → protect-plugin

```typescript
// React
<Guard permission="UI_GO_ADMIN">
  <AdminPage />
</Guard>

// LitElement — load the sb-protect-plugin skill for the exact pattern.
// In routes.json, mark the route with an id so SC-IDP authorization controls access:
{ "id": "admin", "path": "admin", "component": "sb-go-url-admin", "element": "admin.js" }
// Routes without an id are visible to everyone by default.
```

---

## @scdevkit Component Conversion Guide

For each `@leap/sdk` component found, apply the replacement below. Verify exact properties from `node_modules/@scdevkit/webkit` before writing.

### Button
```html
<!-- React: <Button primary onClick={fn}>Save</Button> -->
<sc-button type="primary" size="md" @click=${this._handleSave}>Save</sc-button>

<!-- React: <Button type="danger">Delete</Button> -->
<sc-button type="danger" size="md">Delete</sc-button>
```

### TextInput
```html
<!-- React: <TextInput value={val} onChange={fn} label="Name" /> -->
<sc-text-input
  size="md"
  label-size="md"
  label="Name"
  .value=${this._name}
  @sc-change=${(e: CustomEvent) => { this._name = e.detail.value; }}
></sc-text-input>
```

### DropdownInput
```typescript
// Set options via property (not attribute)
private _statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

// Template:
// <sc-dropdown-input size="md" .options=${this._statusOptions}
//   .value=${this._status}
//   @sc-change=${(e) => { this._status = e.detail.value; }}
// ></sc-dropdown-input>
```

### Table → sc-data-grid
```typescript
private _columnDefs = [
  { field: 'name',   headerName: 'Name' },
  { field: 'status', headerName: 'Status' },
];

// Template:
// <sc-data-grid
//   .columnDefs=${this._columnDefs}
//   .rowData=${this._data}
// ></sc-data-grid>
```

Rules for sc-data-grid:
- Items in cells are in shadow DOM — use inline styles only
- Do NOT use `.getRowHeight` if any cell has a dropdown
- Handle cell edits with `@sc-change` + `e.stopPropagation()`

### Modal → sc-dialog
```html
<!-- React: <Modal open={isOpen} title="Confirm" ... /> -->
<sc-dialog
  ?open=${this._showDialog}
  heading="Confirm"
  @sc-close=${() => { this._showDialog = false; }}
>
  <div slot="content">Are you sure?</div>
  <div slot="footer">
    <sc-button type="primary" @click=${this._handleConfirm}>OK</sc-button>
    <sc-button type="secondary" @click=${() => { this._showDialog = false; }}>Cancel</sc-button>
  </div>
</sc-dialog>
```

### Alert
```html
<!-- React: <Alert type="error">Message</Alert> -->
<sc-alert type="error">Message</sc-alert>
```

### Icon
```html
<!-- React: <Icon name="search" size="1rem" /> -->
<sc-icon icon="search" size="1rem"></sc-icon>
```

### GridContainer/Row/Column → sc-column-layout
```html
<!-- React: two-column layout -->
<sc-column-layout
  layout="Main Content Right"
  height="cover"
  left-column-size="sm"
  style="
    --sc-layout-top-offset: 0rem;
    --sc-layout-bottom-offset: 0rem;
    --sc-layout-right-offset: 0rem;
    --sc-layout-left-offset: 0rem;
    --sc-layout-grid-column-padding-x: 0rem;
  "
>
  <div slot="left"><!-- left sidebar --></div>
  <div slot="right"><!-- main content --></div>
</sc-column-layout>
```

---

## i18n

If the original project has hard-coded UI strings, load the `sb-i18n` skill and extract all user-visible text to `src/i18n/en.json` (and `zh-CN.json` if needed).

---

## CSS Migration

Original project CSS (Sass/CSS files, inline styles):
- Convert all `px` values to `rem` (1px = 0.0625rem)
- Move into LitElement `static styles = css\`...\`` or `:host` block
- Use SC WebKit CSS custom properties for colors: `var(--sc-color-grey-100)`, `var(--sc-color-primary-600)`
- Replace Sass variables with CSS custom properties from the design system

---

## Completion Message

After all components are migrated, output:

```
✅ Component migration complete.

Pages migrated:
- [list of page orchestrators created]

Components migrated:
- [list of child components created]

Element registrations:
- [list of elements/ files created]

> Proceed to Step 5 to migrate services, wire routes, and convert unit tests.
```

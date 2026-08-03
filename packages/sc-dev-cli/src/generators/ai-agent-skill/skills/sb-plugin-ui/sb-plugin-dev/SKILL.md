---
name: sb-plugin-dev
description: Development guide for Service Bench plugin UI projects. Use this skill whenever you are building new features, adding views/pages/components, fixing bugs, modifying routes, working with GraphQL API, dispatching events, applying layout patterns, or following coding standards in a Service Bench plugin project that uses LitElement + TypeScript + @scdevkit components. Trigger on any request involving: new page, new component, new route, fix bug, add field, add tab, update layout, sc-column-layout, sc-data-grid, @scdevkit, SbElement, service-bench-core contexts, GraphQL query/mutation, reference data, event dispatching, vibe coding a new feature, spec changes, or UI optimization.
---

# Service Bench — Plugin Development

This skill covers everything needed to develop features, fix bugs, and optimize code in any Service Bench plugin UI project built with LitElement + TypeScript + `@scdevkit` components.

## UI Component Policy (WebKit First)

For any UI generation or UI modification task:
1. MUST load `@scdevkit/webkit components` before writing markup.
2. MUST follow `@scdevkit/webkit components` Hard Rules and Fallback Policy.
3. If there is any policy conflict for UI control selection, `@scdevkit/webkit components` takes precedence.
4. MUST report component usage summary in the final response:
  - WebKit components used
  - Native fallbacks used and reasons
  - Requirement-to-component mapping

## Architecture Mental Model

The plugin follows a strict **top-down data flow**:

```
Page Orchestrator  (holds all @state, owns fetching)
    │   @property down
    ▼
Child Components   (display-only, dispatch events up)
    │   CustomEvent up (bubbles: true, composed: true)
    ▼
Page Orchestrator  (handles event → fetch/mutate → update @state)
```

**Never fetch data in child components.** All API calls live in the page orchestrator.

---

## File Structure Conventions

```
elements/           ← Custom element registrations (one .js per page)
manifests/
  routes.json       ← Routes + header menu definition
src/
  api/              ← GraphQLClientService, queries, mutations
  common/           ← Shared components (Wrapper.ts, etc.)
  constants/        ← dateFormatters, shared utilities
  types/            ← Shared TypeScript types
  views/
    home/           ← HomePage.ts + components/
    feature-a/      ← FeatureAPage.ts + components/
    admin/
      settings/     ← SettingsPage.ts + components/
    shared/         ← EmptyState and other cross-view components
```

---

## Adding a New Page / View

### Step 1 — Create the Page Orchestrator

```typescript
// src/views/my-feature/MyFeaturePage.ts
import { css, html, LitElement } from 'lit';
import { state } from 'lit/decorators.js';
import { createContext, contexts } from '@scdevkit/service-bench-core';
import GraphQLClientService from '../../api/GraphQLClientService';

const userContext = createContext(contexts.USER);

export class MyFeaturePage extends LitElement {
  private _graphQLClient: GraphQLClientService;
  private _userContextConsumer = userContext.createConsumer(this);

  constructor() {
    super();
    this._graphQLClient = new GraphQLClientService(this);
  }

  @state() private _data: MyDataType[] = [];
  @state() private _isLoading = false;
  @state() private _error: string | null = null;

  async connectedCallback() {
    super.connectedCallback();
    const stopLeaking = (e: Event) => e.stopPropagation();
    this.addEventListener('sc-close', stopLeaking);
    this.addEventListener('sc-select', stopLeaking);
    await this._fetchData();
  }

  static styles = css`
    :host { display: block; height: 100%; width: 100%; }
    .page-wrapper { display: flex; flex-direction: column; height: 100%; }
    .main-content-area { flex: 1; }
  `;

  render() {
    return html`
      <div class="page-wrapper">
        <!-- child components here -->
      </div>
    `;
  }
}
```

### Step 2 — Register the Custom Element

> **Naming convention**: custom element tag names use the pattern `{plugin-tag-prefix}-{feature-name}`. Every plugin defines its own prefix (e.g., `sb-my-plugin-`). The prefix must match the string used in `routes.json` `component` field and in `customElements.define`.

Hard requirement:
- Always use an `sb-` prefixed plugin tag namespace (for example `sb-my-plugin-`).
- Do not use unprefixed namespaces such as `my-plugin-` in generated code.

```typescript
// elements/my-feature.js
import { MyFeaturePage } from '../src/views/my-feature/MyFeaturePage';
if (!window.customElements.get('sb-my-plugin-my-feature')) {
  window.customElements.define('sb-my-plugin-my-feature', MyFeaturePage);
}
```

```typescript
// elements/index.js — add the import
import './my-feature.js';
```

### Step 3 — Register the Route

```json
// manifests/routes.json
// Note: "component" value must use your plugin's tag prefix (must match customElements.define)
{
  "routes": [
    { "path": "my-feature", "component": "sb-my-plugin-my-feature", "element": "my-feature.js" }
  ],
  "headerDefinition": {
    "menus": [
      {
        "title": "Admin",
        "width": "13.5rem",
        "menuItems": [
          { "title": "My feature", "href": "admin/my-feature" }
        ]
      }
    ]
  }
}
```

**routes.json rules:**
- Parent dropdown entries with `menuItems` do NOT have `href`
- Flat entries need `href`
- Dropdown menus use `menuItems` (not `children`)

---

## Adding a New Child Component

```typescript
// src/views/my-feature/components/MyFeatureHeader.ts
import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export class MyFeatureHeader extends LitElement {
  @property({ type: Object }) data: MyDataType | null = null;

  static styles = css`
    :host { display: block; }
    .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 0.0625rem solid var(--sc-color-grey-100);
      padding: 0.75rem 1.25rem;
    }
  `;

  private _handleAction() {
    // Event naming: use a plugin-specific prefix (defined in src/constants/app.ts)
    this.dispatchEvent(new CustomEvent('sb-my-plugin-my-action', {
      bubbles: true,
      composed: true,
      detail: { data: this.data },
    }));
  }

  render() {
    return html`
      <section class="container">
        <sc-button
          type="primary"
          size="md"
          @click=${this._handleAction}
        >Action</sc-button>
      </section>
    `;
  }
}
// Tag naming: use your plugin's tag prefix (see Step 2 note above)
customElements.define('sb-my-plugin-my-feature-header', MyFeatureHeader);
```

---

## Layout Patterns

### Left/Right Panel Split — `sc-column-layout`

Always use `sc-column-layout` (not manual flexbox) for two-column layouts. Always zero out the offsets inside a page:

```html
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
  <div slot="left" class="left"><!-- left content --></div>
  <div slot="right" class="right"><!-- right content --></div>
</sc-column-layout>
```

Add border between panels via `::part`:
```css
sc-column-layout::part(left-column) {
  border-right: 0.0625rem solid var(--sc-color-grey-100);
}
```

### Data Grid — `sc-data-grid`

- Items in grid cells are in **shadow DOM** — use **inline styles only** (host CSS classes won't apply)
- `editable: true` on columns for inline text editing
- Do NOT use `.getRowHeight` if any cell has a dropdown (it cuts off the dropdown)
- Use `@sc-change` with `e.stopPropagation()` for cell edits

```typescript
private _columnDefs = [
  { field: 'label', headerName: 'Label', editable: true },
  { field: 'code', headerName: 'Code' },
  {
    field: 'is_active',
    headerName: 'Active',
    cellRenderer: (params: any) => html`
      <sc-button
        type="link"
        size="sm"
        style="color: var(--sc-color-primary-600)"
        @click=${() => this._handleToggleActive(params.data)}
      >${params.data.is_active ? 'Deactivate' : 'Activate'}</sc-button>
    `,
  },
];
```

---

## Event Patterns

All custom events must:
- Use a **plugin-specific prefix** that is consistent across all events in the plugin (e.g., `sb-my-plugin-`). 
- Carry callback functions (`onSuccess`, `onError`) in `detail` for async feedback

```typescript
// Child dispatches with callbacks
// Replace 'sb-my-plugin-' with your plugin's event prefix
this.dispatchEvent(new CustomEvent('sb-my-plugin-post-comment', {
  bubbles: true,
  composed: true,
  detail: { content, created_by, onSuccess, onError },
}));

// Page orchestrator handles
private async _handlePostComment(e: CustomEvent) {
  const { content, created_by, onSuccess, onError } = e.detail;
  try {
    const result = await postItem(this._graphQLClient, { ... });
    onSuccess?.(result);
  } catch (err) {
    onError?.(err.message);
  }
}
```

Listen in the orchestrator template:
```html
<sb-my-plugin-feature-child
  @sb-my-plugin-post-comment=${this._handlePostComment}
></sb-my-plugin-feature-child>
```

---

## GraphQL API Patterns

### Query file structure

```typescript
// src/api/myFeatureQueries.ts
import GraphQLClientService from './GraphQLClientService';

export interface MyItem {
  id: string;
  name: string;
}

export async function getMyItems(client: GraphQLClientService): Promise<MyItem[]> {
  const query = `query { myItems { id name } }`;
  const result = await client.query(query);
  return result.data.myItems;
}
```

### Mutation file structure

```typescript
// src/api/myFeatureMutations.ts
import GraphQLClientService from './GraphQLClientService';

export interface PutMyItemInput {
  id: string;
  name: string;
}

export async function putMyItem(
  client: GraphQLClientService,
  input: PutMyItemInput
): Promise<MyItem> {
  const mutation = `mutation PutMyItem($input: PutMyItemInput!) {
    putMyItem(input: $input) { id name }
  }`;
  const result = await client.query(mutation, { input });
  return result.data.putMyItem;
}
```

### Lookup Data — cache and reuse

```typescript
private _lookupDataCache: LookupData | null = null;

private async _getLookupData(): Promise<LookupData> {
  if (!this._lookupDataCache) {
    this._lookupDataCache = await getAllLookupData(this._graphQLClient);
  }
  return this._lookupDataCache;
}

private async _initializeDropdownOptions() {
  const lookupData = await this._getLookupData(); // single call
  this._populateCountryOptions(lookupData);
  this._populateCategoryOptions(lookupData);
}
```

---

## Coding Standards

### Units
- **Always `rem`** — never `px`
- 1px = 0.0625rem, 3px = 0.1875rem, 4px = 0.25rem, 8px = 0.5rem, 16px = 1rem

### Component Sizing
- Default `size="md"` and `label-size="md"` for all `@scdevkit` form components
- Only use `size="lg"` when explicitly required for a specific UX reason

### Label Capitalization
- **Sentence case** — first word capitalized only (unless proper noun)
- ✅ "Is this a restricted case?"  ❌ "Is This A Restricted Case?"

### Imports
- **Never import `@scdevkit/webkit...`** in `src/` or `elements/` files — it is already imported in the main page. Use `@scdevkit` components directly as HTML tags without any import.

### Lit Patterns
- `@state()` for internal mutable state
- `@property()` for parent-to-child data
- Use `nothing` from `lit` for conditional rendering — never `''` (empty string)
- Always check `!window.customElements.get()` before `define()`

### Reference Data Logic
- **Always use codes/IDs for logic** — never labels (labels can change)
- ✅ `choice.choice_id === 'country_codes'`  ❌ `choice.choice_name === 'Country codes'`

### Console Logging
- Log format: `'[ComponentName] Event - Description:', data`
- Log: init with context, field changes (name + new value), API errors
- Avoid: logs in render(), verbose loops, detailed event object dumps

### Empty States
- Use your plugin's shared empty-state component (e.g., `<sb-my-plugin-empty-state>`) with a `text` attribute describing the empty state
- Hide titles/headers when data is empty or loading
- Spinner/empty state containers: `margin-top: 15vh; margin-bottom: 15vh;`

---

## Common Bug Fix Patterns

### Event leaking (sc-close, sc-select from @scdevkit bubbling up)
Add in `connectedCallback()` of every page orchestrator:
```typescript
const stopLeaking = (e: Event) => e.stopPropagation();
this.addEventListener('sc-close', stopLeaking);
this.addEventListener('sc-select', stopLeaking);
```

### Dropdown cut off inside sc-data-grid
Remove `.getRowHeight` from the grid config — it overrides the row height and clips dropdowns.

### CSS not applying inside sc-data-grid cells
Grid cells are in shadow DOM — switch from CSS classes to `style="..."` inline.

### sc-column-layout has unexpected spacing/offset
Set all CSS custom property offsets to `0rem` inline on the element (see Layout Patterns section above).

### Empty string instead of `nothing` in templates
Replace `condition ? html`...` : ''` with `condition ? html`...` : nothing`.

---

## @scdevkit Quick Reference

| Task | Component |
|---|---|
| Button | `<sc-button type="primary\|secondary\|link" size="md">` |
| Text input | `<sc-text-input size="md" label-size="md">` |
| Dropdown | `<sc-dropdown-input size="md">` |
| Tabs | `<sc-tab-group>` + `<sc-tab>` + `<sc-tab-panel>` |
| Modal/Dialog | `<sc-dialog>` or `<sc-modal>` |
| Side sheet | `<sc-side-sheet>` |
| Two-column layout | `<sc-column-layout>` |
| Data grid | `<sc-data-grid>` |
| Toast/Alert | `<sc-alert>` |
| Spinner | `<sc-spinner>` |
| Breadcrumb | `<sc-breadcrumb>` + `<sc-breadcrumb-item>` |
| Icon | `<sc-icon icon="arrow-ios-backward">` |
| Accordion | `<sc-accordion>` |

For full component API, consult the `scdevkit-webkit-components` skill.

---

## Context Keys (from `@scdevkit/service-bench-core`)

```typescript
import { createContext, contexts } from '@scdevkit/service-bench-core';

contexts.USER         // logged-in user info
contexts.NAVIGATION   // router navigation (params, go())
contexts.APP          // app-level config
contexts.AUTHZ        // authorization client
contexts.REST_CLIENT  // REST client
contexts.STORAGE_CLIENT // file storage client
contexts.PLUGIN       // plugin-level config
contexts.EVENT_BUS    // app-wide event bus
```

Usage:
```typescript
const userCtx = createContext(contexts.USER);
private _user = userCtx.createConsumer(this);

// In render or methods:
const user = this._user.value as UserContext;
```

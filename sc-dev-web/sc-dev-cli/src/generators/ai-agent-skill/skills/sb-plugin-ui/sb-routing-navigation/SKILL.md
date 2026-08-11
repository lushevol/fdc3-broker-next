---
name: sb-routing-navigation
description: >
  Complete guide for routing and navigation in Service Bench plugin UI projects.
  Use this skill whenever you need to add new pages/routes, navigate between pages, read URL path parameters,
  set the browser tab title, configure routes.json, add header menu items, or do cross-plugin navigation.
  Trigger on any request involving: routes.json, new page, new route, navigate to page, navigation.go(), path parameter,
  navigation.params, setPageTitle, browser title, add route, headerDefinition, menu item, menuItems, defaultRoute,
  cross-plugin navigation, in-plugin navigation, go('/(pluginId)'), link(), navigation.path, navigation.link,
  /:id pattern, enter callback, leave callback, searchParams, hash navigation, NAVIGATION context in routing context,
  "how do I navigate", "how do I add a page", "how do I read URL params", "add a route", "new page route",
  "add menu", "route manifest", or any request to wire up a new page component to the plugin navigation.
---

# Service Bench — Routing & Navigation

Routing in a Service Bench plugin is split between two places:
- **`manifests/routes.json`** — declares which URL paths exist and which custom element handles each
- **`NAVIGATION` context** — consumed in components to navigate imperatively or read current URL state

---

## 1. routes.json — The Route Manifest

Every page in the plugin must be registered in `manifests/routes.json`. The shell reads this manifest at runtime and registers the routes into the plugin container's internal router.

### Full Schema

```json
{
  "title": "Group Investigations",
  "defaultRoute": "home",
  "routes": [
    { "path": "home",                "component": "sb-my-plugin-home",             "element": "home.js" },
    { "path": "cases",               "component": "sb-my-plugin-case",             "element": "case.js" },
    { "path": "cases/:id",           "component": "sb-my-plugin-case",             "element": "case.js" },
    { "path": "admin/reference-data","component": "sb-my-plugin-reference-data",   "element": "reference-data.js" },
    { "path": "admin/role",          "component": "sb-my-plugin-role",             "element": "role.js" }
  ],
  "headerDefinition": {
    "title": "Group Investigations",
    "showHeader": true,
    "menus": [
      { "title": "Home", "href": "home" },
      { "title": "Admin", "width": "13.5rem",
        "menuItems": [
          { "title": "Manage reference data", "href": "admin/reference-data" },
          { "title": "Manage roles",          "href": "admin/role" }
        ]
      }
    ]
  }
}
```

### Field Reference

| Field | Required | Description |
|---|---|---|
| `title` | No | Plugin display name (shown in header and browser title) |
| `defaultRoute` | Yes | Path used when plugin loads without a sub-route (e.g., `"home"`) |
| `routes[].path` | Yes | URL path segment(s). Supports `:param` for path parameters |
| `routes[].component` | Yes | Custom element tag name that renders this route |
| `routes[].element` | Yes | JS file in `elements/` folder that defines the component |
| `headerDefinition.title` | No | Header bar title (falls back to `title` at root level) |
| `headerDefinition.showHeader` | Yes | Whether to render the plugin header bar |
| `headerDefinition.menus[]` | No | Navigation links in the header bar |

### Path Parameter Syntax

Use `:paramName` in the path to declare a dynamic segment. The same component can handle both list and detail views:

```json
{ "path": "cases",     "component": "sb-my-plugin-case", "element": "case.js" },
{ "path": "cases/:id", "component": "sb-my-plugin-case", "element": "case.js" }
```

Access the value in the component via `navigation.params.id`.

### Header Menu: Flat vs Dropdown

**Flat item** — has `href`, links directly to a path:
```json
{ "title": "Home", "href": "home" }
```

**Dropdown item** — has `menuItems`, no `href` on the parent:
```json
{
  "title": "Admin",
  "width": "13.5rem",
  "menuItems": [
    { "title": "Manage reference data", "href": "admin/reference-data" }
  ]
}
```

> Do NOT put `href` on a dropdown parent — it will not work as a dropdown. Only leaf items have `href`.

---

## 2. Adding a New Page — Full Checklist

When adding a new page, you must touch **three places**:

### Step 1 — Register the route in `routes.json`

```json
{ "path": "audit/log", "component": "sb-my-plugin-audit-log", "element": "audit-log.js" }
```

And optionally add a header menu entry:
```json
{ "title": "Audit Log", "href": "audit/log" }
```

### Step 2 — Create the component file in `elements/`

```javascript
// elements/audit-log.js
import { AuditLogPage } from '../src/views/audit/AuditLogPage.js';
customElements.define('sb-my-plugin-audit-log', AuditLogPage);
```

### Step 3 — Export from `elements/index.js`

```javascript
// elements/index.js  (add the import)
import './audit-log.js';
```

The shell lazy-loads each `element` file — the import in `index.js` ensures it is bundled.

---

## 3. NAVIGATION Context — Consuming Navigation in Components

Import and consume the `NAVIGATION` context using the standard 3-step pattern:

```typescript
import { createContext, contexts } from '@scdevkit/service-bench-core';

const navigationContext = createContext(contexts.NAVIGATION);

export class AuditLogPage extends LitElement {
  // Step 1: create consumer — auto-subscribes and re-renders on change
  private _navigationContextConsumer = navigationContext.createConsumer(this);

  goHome() {
    // Step 2: use .value to access the live navigation object
    this._navigationContextConsumer.value?.go('home');
  }
}
```

Or use `SbElement` base class which provides `this._navigationContextConsumer` for free:

```typescript
import { SbElement } from '@scdevkit/service-bench-core';

export class AuditLogPage extends SbElement {
  // this._navigationContextConsumer is already wired up — no createContext needed
  goHome() {
    this._navigationContextConsumer.value?.go('home');
  }
}
```

---

## 4. NAVIGATION Context API Reference

The `navigation` object (accessed via `this._navigationContextConsumer.value`) exposes:

| Property / Method | Type / Signature | Description |
|---|---|---|
| `path` | `string` | Current route path (e.g., `/my-plugin/cases/123`) |
| `params` | `object` | Route params + hash + searchParams (see below) |
| `go(path, searchParams?, hash?)` | `async Function` | Navigate to a path (in-plugin or cross-plugin) |
| `link(path?)` | `Function` | Generate URL string; no arg = current page URL |
| `setPageTitle(pageName)` | `Function` | Set browser tab title dynamically |
| `fullPath` | `string` | Full URL including search and hash |

### `params` Object Shape

The `params` object contains **route path params** plus two reserved sub-keys:

```typescript
navigation.params.id            // → from :id in route path
navigation.params.hash          // → current URL hash (e.g. '#section')
navigation.params.searchParams  // → URL query params as object (e.g. { page: '2' })
```

Example — route `items/:id` at URL `/my-plugin/items/42?tab=notes#summary`:
```typescript
navigation.params.id                          // '42'
navigation.params.searchParams?.tab           // 'notes'
navigation.params.hash                        // '#summary'
```

---

## 5. Programmatic Navigation

### In-Plugin Navigation (same plugin)

Path is relative — do NOT include the plugin prefix:

```typescript
// Go to a flat route
this._navigationContextConsumer.value?.go('home');

// Go to a route with a path param
this._navigationContextConsumer.value?.go(`items/${itemId}`);

// Go to a nested route
this._navigationContextConsumer.value?.go('admin/settings');
```

### Navigate with searchParams or Hash

```typescript
// Go with query params → URL becomes /my-plugin/items?status=open
this._navigationContextConsumer.value?.go('items', { status: 'open' });

// Go with hash → URL becomes /my-plugin/items/42#details
this._navigationContextConsumer.value?.go(`items/${itemId}`, {}, '#details');
```

### Cross-Plugin Navigation (different plugin)

Use an absolute path starting with `/`, using `/(pluginId)/(route)` format:

```typescript
// Navigate to another plugin entirely
this._navigationContextConsumer.value?.go('/(other-plugin)/home');

// Navigate to a specific record in another plugin
this._navigationContextConsumer.value?.go(`/(other-plugin)/items/${itemId}`);
```

---

## 6. Reading Path Parameters

When a route has `:paramName` (e.g., `cases/:id`), access the value via `navigation.params`:

```typescript
import { createContext, contexts } from '@scdevkit/service-bench-core';

const navigationContext = createContext(contexts.NAVIGATION);

export class ItemDetailPage extends LitElement {
  private _navigationContextConsumer = navigationContext.createConsumer(this);

  connectedCallback() {
    super.connectedCallback();
    const itemId = this._navigationContextConsumer.value?.params?.id;
    if (itemId) {
      this._loadItem(itemId);
    }
  }

  render() {
    const itemId = this._navigationContextConsumer.value?.params?.id;
    return html`<p>Item ID: ${itemId}</p>`;
  }
}
```

---

## 7. Setting the Browser Tab Title Dynamically

Use `navigation.setPageTitle(pageName)` to update the browser tab title.

**Result format:** `Service Bench - {Plugin Title} - {pageName}`

```typescript
// When the item detail page loads, set the tab title to the actual item name
this._navigationContextConsumer.value?.setPageTitle(`Item: ${item.name}`);
```

Call it after data is loaded so the title reflects real content:

```typescript
async connectedCallback() {
  super.connectedCallback();
  const itemId = this._navigationContextConsumer.value?.params?.id;
  const item = await this._loadItem(itemId);
  this._navigationContextConsumer.value?.setPageTitle(`Item: ${item.name}`);
}
```

> `title` field in `routes.json` sets a **static** title per route. `setPageTitle()` overrides it **dynamically** at runtime.

---

## 8. Generating URLs (link)

`navigation.link(path?)` returns the full URL for a path without navigating:

```typescript
// Current page URL (no arg)
const currentUrl = this._navigationContextConsumer.value?.link();

// URL for a specific path
const itemUrl = this._navigationContextConsumer.value?.link(`items/${itemId}`);
```

Useful for building `<a href="">` elements or sharing URLs.

---

## 9. Complete routes.json Example

A fully-configured `manifests/routes.json` combining flat routes, a param route, and a dropdown menu. Replace `sb-my-plugin-` with your plugin's element tag prefix.

```json
{
  "title": "My Plugin",
  "defaultRoute": "home",
  "routes": [
    { "path": "home",              "component": "sb-my-plugin-home",         "element": "home.js" },
    { "path": "items",             "component": "sb-my-plugin-item",         "element": "item.js" },
    { "path": "items/:id",         "component": "sb-my-plugin-item",         "element": "item.js" },
    { "path": "admin/settings",    "component": "sb-my-plugin-settings",     "element": "settings.js" },
    { "path": "admin/reference",   "component": "sb-my-plugin-reference",    "element": "reference.js" }
  ],
  "headerDefinition": {
    "title": "My Plugin",
    "showHeader": true,
    "menus": [
      { "title": "Home", "href": "home" },
      { "title": "Items", "href": "items" },
      { "title": "Admin", "width": "13.5rem",
        "menuItems": [
          { "title": "Settings",        "href": "admin/settings" },
          { "title": "Reference data",  "href": "admin/reference" }
        ]
      }
    ]
  }
}
```

---

## 10. Common Pitfalls

### ⚠️ Navigation value may be `undefined` on first render
Context values are populated asynchronously. Always guard before calling methods:
```typescript
this._navigationContextConsumer.value?.go('home');   // ✅ safe
this._navigationContextConsumer.value.go('home');    // ❌ crashes if undefined
```

### ⚠️ `go()` path must NOT include the plugin prefix
The path passed to `go()` is relative within the current plugin:
```typescript
navigation.go('home');           // ✅ correct — goes to /my-plugin/home
navigation.go('/my-plugin/home') // ❌ wrong for in-plugin navigation
navigation.go('/(my-plugin)/home') // ❌ also wrong (cross-plugin syntax)
```
Cross-plugin navigation ONLY uses `/(pluginId)/route` format.

### ⚠️ `params.searchParams` is an object, NOT a URLSearchParams instance
Access it with plain object dot notation:
```typescript
const page = navigation.params?.searchParams?.page;    // ✅
const page = navigation.params?.searchParams?.get('page'); // ❌ not a URLSearchParams instance
```

### ⚠️ `path` in `routes.json` must NOT start with `/`
```json
{ "path": "cases/:id" }  // ✅ correct
{ "path": "/cases/:id" } // ❌ wrong — omit the leading slash
```

### ⚠️ Dropdown menu parent must NOT have `href`
A menu item with `menuItems` is a dropdown. Adding `href` to the parent makes it a direct link instead:
```json
{ "title": "Admin", "menuItems": [...] }              // ✅ dropdown
{ "title": "Admin", "href": "admin", "menuItems": [...] } // ❌ not a dropdown
```

### ⚠️ React Router's `/:param?` optional param syntax is not valid — use two explicit routes

The SB plugin router does not accept React Router's `/:param?` question-mark suffix. Declare two explicit routes that share the same component and element file — one without the param and one with:

```json
{ "path": "details/:type{/}?",      "component": "sb-my-plugin-details", "element": "details.js" },
{ "path": "details/:type/:id{/}?",  "component": "sb-my-plugin-details", "element": "details.js" }
```

The `{/}?` suffix on each route makes the **trailing slash** optional (e.g. `details/someType/` and `details/someType` both match the first entry). The component reads the optional param with a safe guard:

```typescript
const id = this._navigationContextConsumer.value?.params?.id; // undefined on the first route
if (id) { this._loadDetail(id); }
```

---

### ⚠️ `component` in `routes.json` must match the custom element tag exactly
The `component` value must be the same string used in `customElements.define()`:
```json
{ "component": "sb-my-plugin-case" }
```
```javascript
customElements.define('sb-my-plugin-case', CasePage); // must match
```

### ⚠️ Every new element file must be imported in `elements/index.js`
The shell only loads what is exported from `elements/index.js`. If you create a new `elements/my-page.js`, you must add `import './my-page.js'` to `elements/index.js` or the component will never be defined.

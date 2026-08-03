---
name: sb-plugin-state
description: >
  Plugin-level state management (store) for Service Bench plugin UIs. Use this
  skill whenever the task involves: sharing state between multiple components
  within a plugin, creating a plugin store, registering a store in routes.json,
  consuming a storeContext, calling createContext(contexts.STORE), using
  getState/subscribe to a store, implementing storeUpdated callback, configuring
  stores in rollup.config.js or web-dev-server.config.mjs, deciding between
  plugin state vs component state, state lifecycle in a plugin (cleared on leave),
  cross-component data sharing, global state within a plugin, or any mention of
  "plugin state", "plugin store", "store context", "storeContext", "contexts.STORE",
  or "createStore". Trigger on any request to manage state across plugin pages/components.
---

# Service Bench — Plugin State Management

Plugin state provides a global state store scoped to a single plugin instance. All components within the plugin can read, update, and subscribe to changes in this store. The store is automatically cleared when the user navigates away from the plugin.

## When to Use Plugin State

**Prefer component-level state first** (LitElement `@state()` reactive properties, or the Context API) for data that only one or a few related components need. Reach for plugin state when:
- Multiple unrelated components across different pages/routes need the same data.
- You need to preserve state across in-plugin navigation (e.g., a shopping cart, a selected filter, accumulated form data).
- You need cross-component communication without tightly coupling them.

**Never use** `localStorage`, `sessionStorage`, `cookies`, or `window.*` for plugin data — these are shared across all plugins and create data-isolation problems.

## Store Lifecycle

The store is provided by the Service Bench plugin container (`ServiceBenchPluginContainer`):
- **Created**: asynchronously when the plugin route manifest loads.
- **Available**: via `storeContext` while the plugin is mounted.
- **Cleared**: when the plugin container's `disconnectedCallback` runs (user leaves the plugin). This means all accumulated state resets on navigation away.

## Architecture Overview

```
plugin-root/
├── src/
│   └── stores.js          ← store factory definitions (the logic lives here)
├── stores/
│   └── {storeName}.js     ← thin re-export files (one per store, at root level)
└── manifests/
    └── routes.json        ← store registration config
```

The `stores/` folder must be at the **root level** of the plugin project, not inside `src/`. The `src/stores.js` file holds the actual state logic, `stores/{name}.js` just re-exports it.

---

## Step 1 — Create the Store Factory (`src/stores.js`)

A store factory is a curried function: `(context) => (set) => ({ ...state, ...operations })`.

- The outer `context` parameter exposes platform services: `graphQLClient`, `restClient`, `storageClient`, `authorizationClient`, `user`, `app`, `locale`, `view`, `analytics`.
- The inner `set` function updates the state. **Always return a new object — never mutate state in place.**

```javascript
// src/stores.js

const cartStore = (context) => {
  // context.graphQLClient is available here if needed
  return (set) => ({
    /* ── State variables ── */
    items: [],
    total: 0,

    /* ── Operations ── */
    addItem: (item) =>
      set((state) => ({
        items: [...state.items, item],
        total: state.total + item.price,
      })),

    removeItem: (index) =>
      set((state) => {
        const items = [...state.items];
        const removed = items.splice(index, 1)[0];
        return { items, total: state.total - (removed?.price ?? 0) };
      }),

    clearCart: () => set(() => ({ items: [], total: 0 })),
  });
};

export { cartStore };
```

Key rules for `set()`:
- Always return a plain object with the fields you want to update (partial update is fine).
- Always create new arrays/objects (`[...arr]`, `{ ...obj }`) — never push/splice the existing reference.

---

## Step 2 — Create the Store Entry File (`stores/{name}.js`)

Each store needs a thin entry file at the **root** `stores/` directory. This file is what rollup builds and what the container imports at runtime.

```javascript
// stores/cart.js
import { cartStore } from "../src/stores.js";

export default cartStore;
```

The filename becomes the store's path in `routes.json` (e.g., `cart.js` → `"store": "cart.js"`).

---

## Step 3 — Register the Store in `manifests/routes.json`

Add a `state` section to the manifest. The key under `stores` is the **store name** that components use to look up the store at runtime.

```json
{
  "routes": [...],
  "state": {
    "stores": {
      "cart": {
        "store": "cart.js"
      }
    }
  }
}
```

- Keep `"store"` values as `"*.js"` even in TypeScript projects — the build output is always JS.
- The store name (`"cart"`) must match the key used in the component: `this._storeContextConsumer.value['cart']`.

---

## Step 4 — Configure the Build Tools

### `rollup.config.js` — build `stores/*.js`

Add a build pass for the `stores/` directory similar to the existing `elements/` build:

```javascript
import fs from 'fs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';

const storeFiles = fs.readdirSync('./stores');
const storeConfigs = storeFiles
  .filter((file) => file !== 'index.js')
  .map((file) => ({
    input: `./stores/${file}`,
    output: {
      entryFileNames: '[name].js',
      chunkFileNames: '[hash].js',
      format: 'es',
      dir: 'dist/stores',
      sourcemap: true,
    },
    preserveEntrySignatures: true,
    plugins: [
      nodeResolve(),
      esbuild({ minify: true, target: ['chrome80', 'safari14', 'firefox78'] }),
    ],
  }));

storeConfigs.forEach((config) => configs.push(config));
```

### `web-dev-server.config.mjs` — proxy `/stores` requests

Add a proxy entry so the dev server serves built store files. Place it before other proxy entries:

```javascript
proxy(`/app/${pluginId}/stores`, {
  target: `http://localhost:${port}`,
  changeOrigin: true,
  rewrite: (path) => path.replace(`/app/${pluginId}`, '/dist'),
}),
```

Replace `${pluginId}` with your plugin's actual ID string (e.g., `'cms-plus'`), and `${port}` with the dev server's port.

---

## Step 5 — Consume the Store in a Component

```typescript
import { html, LitElement } from 'lit';
import { createContext, contexts } from '@scdevkit/service-bench-core';

// Create the context handle once, at module scope
const storeContext = createContext(contexts.STORE);

export class MyPage extends LitElement {
  static properties = {
    items: { state: true },
  };

  constructor() {
    super();
    this.storeUpdated = this.storeUpdated.bind(this);
    this.items = [];
  }

  // Create consumer once as a class field
  _storeContextConsumer = storeContext.createConsumer(this);

  // References held for cleanup
  _cartStoreState = null;
  _cartStoreSubscription = null;

  connectedCallback() {
    super.connectedCallback();

    // Retrieve the named store — key must match routes.json
    const cartStore = this._storeContextConsumer.value['cart'];

    // Save a reference to the state object — use this for operations
    this._cartStoreState = cartStore.getState();

    // Subscribe to changes — storeUpdated is called on every state change
    this._cartStoreSubscription = cartStore.subscribe(this.storeUpdated);

    // Read the initial values
    this.items = this._cartStoreState.items;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Unsubscribe to prevent memory leaks and stale callbacks
    if (this._cartStoreSubscription) {
      this._cartStoreSubscription();
      this._cartStoreSubscription = null;
    }
  }

  storeUpdated(state) {
    // Called whenever state changes — update reactive properties here
    this.items = state.items;
  }

  handleAddItem(item) {
    // Call operations on the state reference, not on the store object
    this._cartStoreState.addItem(item);
  }

  handleClear() {
    this._cartStoreState.clearCart();
  }
}
```

Key points:
- Call `createContext(contexts.STORE)` **at module scope**, not inside the class.
- Get the store via `this._storeContextConsumer.value['storeName']` — use the exact key from `routes.json`.
- Call operations on `this._cartStoreState` (the `getState()` result), not on the store object directly.
- Always unsubscribe in `disconnectedCallback` to avoid memory leaks.
- `storeUpdated(state)` receives the full latest state object.

---

## Multiple Stores

A plugin can have multiple stores. Register each under its own key in `routes.json`:

```json
"state": {
  "stores": {
    "cart": { "store": "cart.js" },
    "filters": { "store": "filters.js" }
  }
}
```

Each component then accesses only the stores it needs:

```javascript
const cartStore = this._storeContextConsumer.value['cart'];
const filtersStore = this._storeContextConsumer.value['filters'];
```

---

## Quick Reference

| Concern | How |
|---|---|
| State variable | Property in the `(set) => ({})` return object |
| Update state | Call `set(state => ({ newField: ... }))` — return new object |
| Never do | `state.items.push(...)` — direct mutation breaks reactivity |
| Subscribe | `store.subscribe(this.callback)` — returns an unsubscribe function |
| Unsubscribe | Call the return value of `subscribe()` in `disconnectedCallback` |
| Access store | `this._storeContextConsumer.value['storeName']` |
| Run operation | `this._storeState.operationName(args)` |
| Store cleared | Automatically when plugin's `disconnectedCallback` fires |
| `context` arg | `graphQLClient`, `restClient`, `user`, `app`, `locale`, etc. |

---
name: sb-protect-plugin
description: >
  Expert guide for protecting and authorizing Service Bench plugin UI with SC-IDP integration.
  Use this skill whenever a user mentions: protect plugin, plugin access, plugin authorization,
  SC-IDP, authStoreId, authServiceId, authorization store, content guard, sb-content-guard,
  route protection, menu protection, secure route, secure menu, content-id, authorizationClient,
  check(), getObjects(), authzTypeObjects, hide UI for unauthorized users, role-based access,
  restrict access to plugin, restrict route/menu/content, protect UI component, authorization
  policy, IDP, FGA, OpenFGA, can_view, relation, or any request to control who can see what in
  a Service Bench plugin. Trigger on "how do I protect my plugin", "only admin can access",
  "hide this for unauthorized users", "link plugin to IDP", "configure auth store", "authStoreId
  in routes", "check authorization in code", "per-user access control in SB plugin", etc.
---

# Service Bench — Plugin Protection

Service Bench plugins support two levels of protection powered by **SC-IDP** (Service Connect Identity Provider):

| Level | What it controls | Where configured |
|---|---|---|
| **Plugin Access** | Whether a user can see/enter the plugin | SC-IDP service URN, linked via SB team |
| **Plugin Authorization** | Whether a user sees specific routes, menus, or content inside the plugin | SC-IDP authorization store + `routes.json` / `<sb-content-guard>` |

> ⚠️ **Warning:** UI protection only complements API protection — always secure your experience APIs independently. Before enabling protection, add all users to the SC-IDP access policy first to avoid locking anyone out.

---

## Two Levels of Protection

### 1. Plugin Access (SC-IDP Service)

Controls whether a user can open the plugin at all. SC-IDP can be configured for:
- **Limited access** (specific users/groups only)
- **Birthright access** (all users by default)

To enable: contact the SB team at `http://go/chat/sb-plugin` with your SC-IDP Service URN. Self-service linking is coming.

### 2. Plugin Authorization (SC-IDP Authorization Store)

Controls which UI elements (routes, menus, content) are visible to a given user. Requires:
1. An **authorization store** configured in SC-IDP with an authorization model (OpenFGA-based)
2. The store linked to the plugin (contact SB team; self-service coming)
3. UI elements tagged with matching `id` values from the authorization store

---

## Authorization Model: UI Resource Tagging

Three types of UI resources can be protected:

| Resource Type | SC-IDP authObject | How to tag |
|---|---|---|
| **Route** | `route` | Add `"id"` to route object in `routes.json` |
| **Menu** | `menu` | Add `"id"` to menu/menuItem in `headerDefinition` |
| **Content** | `content` | Use `<sb-content-guard content-id="...">` in LitElement |

A UI resource is rendered **only if** there is a relation between the current user and `authObject:id` (e.g. `user:alice → can_view → route:admin`).

Resources **without** an `id` field are visible to everyone by default.

---

## Protecting Routes

Add an `id` to each route object in `routes.json` that should be protected. Routes without `id` remain open to all.

```json
{
  "defaultRoute": "home",
  "routes": [
    {
      "id": "home",
      "path": "home",
      "component": "sb-my-plugin-home",
      "element": "home.js"
    },
    {
      "id": "admin",
      "path": "admin",
      "component": "sb-my-plugin-admin",
      "element": "admin.js"
    },
    {
      "path": "public-info",
      "component": "sb-my-plugin-public",
      "element": "public.js"
    }
  ]
}
```

- `home` and `admin` routes are protected — only users with `can_view` relation to `route:home` / `route:admin` can access them.
- `public-info` has no `id` → visible to everyone.

The `ServiceBenchAuth` container automatically calls `getObjects()` on load and stores the result in `authzTypeObjects.route` — the plugin container then filters routes accordingly.

---

## Protecting Menus

Add an `id` to each menu entry or dropdown item in `headerDefinition.menus` that should be protected:

```json
"headerDefinition": {
  "title": "My Plugin",
  "showHeader": true,
  "menus": [
    {
      "id": "home",
      "title": "Home",
      "href": "home"
    },
    {
      "id": "admin",
      "title": "Admin",
      "menuItems": [
        {
          "title": "Section 1",
          "href": "admin/section-1"
        },
        {
          "title": "Section 2",
          "href": "admin/section-2"
        }
      ]
    }
  ]
}
```

- Menus with `id` are filtered by `authzTypeObjects.menu` — only shown if the user has the relation.
- The `secure: true` flag on a menu/item hides it whenever no auth data is available (not specifically ID-based).

---

## Protecting Content (`<sb-content-guard>`)

For fine-grained control of in-page content (blocks, buttons, sections), use the `<sb-content-guard>` web component. The slot content is rendered **only** if the user has the relation to `content:<content-id>`.

**Step 1: Import `sb-components.js` in `service-bench.html`**
```html
<script type="module">
  import '@scdevkit/service-bench-core/elements/sb-components.js';
</script>
```

**Step 2: Wrap protected content in `<sb-content-guard>`**
```typescript
import { LitElement, html } from 'lit';

export class MyPage extends LitElement {
  render() {
    return html`
      <h1>Dashboard</h1>

      <!-- Visible to all users -->
      <sb-my-plugin-summary></sb-my-plugin-summary>

      <!-- Only visible to users with can_view on content:admin-panel -->
      <sb-content-guard content-id="admin-panel">
        <sb-my-plugin-admin-panel></sb-my-plugin-admin-panel>
      </sb-content-guard>

      <!-- Only visible to users with can_view on content:reports -->
      <sb-content-guard content-id="reports">
        <sb-my-plugin-reports></sb-my-plugin-reports>
      </sb-content-guard>
    `;
  }
}
```

`ServiceBenchContentGuard` internally consumes `authzContext` and checks if `this.authzTypeObjects?.content` includes the `content-id` value. If not included, it renders nothing.

---

## Configuring the Store (`app-shell-manifest.json`)

To wire the plugin to SC-IDP locally (for testing) or in any environment, add `authServiceId` and `authStoreId` to the plugin's route definition in `app-shell-manifest.json`:

```json
{
  "routes": [
    {
      "path": "/my-plugin/*",
      "component": "sb-app-my-plugin",
      "routeDefinition": "/app/my-plugin/manifests/routes.json",
      "authServiceId": "servicebench-gbl",
      "authStoreId": "sb-my-plugin-store"
    }
  ]
}
```

| Field | Description |
|---|---|
| `authServiceId` | SC-IDP Service URN (e.g. `servicebench-gbl`) — scopes the authorization client to that IDP service |
| `authStoreId` | SC-IDP Store Name created inside that service — which authorization store to query |

> **Note:** If you use only `authStoreId` (old pattern — store ID directly), it is still supported.

---

## Environment Mapping

Each SB environment maps to a specific SC-IDP environment. Make sure your authorization store is configured in the correct environment:

| Service Bench | SC-IDP |
|---|---|
| DevFactory - DEV / SIT | DevFactory - SIT |
| DevFactory - UAT / QA | DevFactory - UAT |
| Catalyst - STG | Catalyst - STG |
| Catalyst - PROD | Catalyst - PROD |
| UK - STG | Catalyst - STG |
| UK - PROD | Catalyst - PROD |

---

## Using the Authorization Client Programmatically

For dynamic/conditional logic (e.g. checking a specific object at runtime), use the `authorizationClient` context directly in your LitElement component.

**Import and consume the context:**

```typescript
import { html, LitElement } from 'lit';
import { contexts, createContext } from '@scdevkit/service-bench-core';

const authzClientContext = createContext(contexts.AUTHZ_CLIENT);

export class MyComponent extends LitElement {
  _authzClientContextConsumer = authzClientContext.createConsumer(this);

  connectedCallback() {
    super.connectedCallback();
    this.checkAuth();
  }

  async checkAuth() {
    const client = this._authzClientContextConsumer.value;

    // Get default store ID
    const storeId = client.getDefaultStoreId();

    // Get all objects the current user has can_view relation to (multiple types at once)
    const authObjects = await client.getObjects('', ['route', 'content'], 'can_view');
    // Returns: { "route": ["home", "admin"], "content": ["reports"] }

    // Check a single object
    const canViewAdmin = await client.check('', 'route', 'admin', 'can_view');
    // Returns: true | false
  }
}
```

### `check(storeId, type, objectId, relation)`

| Param | Type | Description |
|---|---|---|
| `storeId` | `string` | Store name (if using IDP service) or store ID. Pass `''` to use the linked store |
| `type` | `string` | Object type, e.g. `'route'`, `'menu'`, `'content'` |
| `objectId` | `string` | The object ID (matches the `id` tag in routes.json or `content-id`) |
| `relation` | `string` | The relation to check, e.g. `'can_view'` |

Returns: `Promise<boolean>`

### `getObjects(storeId, types, relation)`

| Param | Type | Description |
|---|---|---|
| `storeId` | `string` | Store name or ID. Pass `''` to use the linked store |
| `types` | `string[]` | Array of object types, e.g. `['route', 'menu', 'content']` |
| `relation` | `string` | The relation to check, e.g. `'can_view'` |

Returns: `Promise<Map<string, string[]>>` — keys are types, values are arrays of object IDs the user has the relation to.

---

## Local Testing Setup

To test authorization locally against the SIT environment:

1. **Update project template** — ensure you're on the latest SB plugin template
2. **Install latest service-bench-core**: `npm install @scdevkit/service-bench-core@latest --save`
3. **Add import to `service-bench.html`**:
   ```html
   <script type="module">
     import '@scdevkit/service-bench-core/elements/sb-components.js';
   </script>
   ```
4. **Enable API integration** — follow the API Integration setup (the authorization API endpoint is protected, so API integration must be configured)
5. **Configure `app-shell-manifest.json`** — add `authServiceId` and `authStoreId` to the plugin route (see section above)

> By default, local plugin runs use SB SIT for all API calls including SC-IDP authorization calls. Make sure your user is added to the SIT authorization store before testing locally.

---

## Key Rules

1. **No `id` = open to everyone** — routes and menus without `id` are always visible, regardless of auth state.
2. **`authStoreId` is required** in `app-shell-manifest.json` for authorization to work at all. Without it, all routes/menus are treated as open.
3. **`sb-content-guard` requires `sb-components.js` import** in `service-bench.html` — otherwise the element is undefined.
4. **UI-only protection is not sufficient** — always pair with API-level security. The UI layer can be bypassed by direct API calls.
5. **Context-based authorization** (dynamic runtime values as conditions) is not supported in plugin UI — call the experience API instead, which can apply context-aware authorization checks server-side.
6. **Same `id` in route and menu** — it is common to reuse the same ID string for both the route and its menu entry (e.g. `id: "admin"` in both the route and its menu).
7. **Environment setup is separate** — each SB/SC-IDP environment pair must be configured independently; a store configured in SIT does not automatically exist in UAT.

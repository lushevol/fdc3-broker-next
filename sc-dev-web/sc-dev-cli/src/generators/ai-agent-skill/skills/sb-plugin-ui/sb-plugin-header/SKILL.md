---
name: sb-plugin-header
description: >
  Expert guide for configuring the Service Bench plugin header — the top navigation bar shown inside any SB plugin. Use this skill whenever a user mentions: plugin header, headerDefinition, routes.json header config, plugin title, menu bar, navigation menu, showHeader, per-route header, menuItems, dropdown menu, header menus, plugin navigation, top bar, header not showing, menu not highlighted, secure menu, hide header for a route, menu item with icon, open menu in new tab, or any request to add/change/configure the header in a Service Bench plugin UI project. Trigger on "add a header", "configure menus", "navigation menus in plugin", "how does headerDefinition work", "per-route header override", etc.
---

# Service Bench — Plugin Header

The plugin header is the top navigation bar rendered automatically by the `service-bench-plugin-container` (from `@scdevkit/service-bench-core`). It is configured **entirely through `routes.json`** — no custom LitElement component needs to be written for the header itself. The header displays the plugin title and a horizontal menu bar with flat links and/or dropdown menus.

---

## Where to Configure

All header configuration lives in `manifests/routes.json`. There are two levels:

| Level | Key | Purpose |
|---|---|---|
| **Top-level** | `headerDefinition` | Default header for the whole plugin |
| **Per-route** | `headerDefinition` inside a route object | Overrides the top-level definition for that route only |

Per-route configuration **merges with** (and overrides) the top-level definition — any property you omit at the route level inherits from the top level.

---

## Top-Level `headerDefinition`

```json
{
  "defaultRoute": "home",
  "routes": [ ... ],
  "headerDefinition": {
    "title": "My Plugin Name",
    "showHeader": true,
    "menus": [ ... ]
  }
}
```

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Shown as the plugin title on the left side of the header |
| `showHeader` | `boolean` | `true` to display the header, `false` to hide it entirely |
| `menus` | `Menu[]` | Ordered list of top-level menu entries |

---

## Menu Item Schema

Each entry in `menus` is a **Menu** object:

```json
{
  "title": "Admin",
  "id": "admin-menu",
  "href": "admin/dashboard",
  "target": "_blank",
  "width": "14rem",
  "secure": true,
  "menuItems": [ ... ]
}
```

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Label shown in the menu bar |
| `id` | `string` | Optional. Used for authorization filtering (see Authorization section) |
| `href` | `string` | Route path or full URL. Omit when `menuItems` is present (pure dropdown) |
| `target` | `string` | `"_self"` (default) or `"_blank"` to open in a new tab |
| `width` | `string` | CSS width of the dropdown popup, e.g. `"13.5rem"` or `"900px"` (auto by default) |
| `secure` | `boolean` | If `true`, hidden when no authorization data is provided |
| `menuItems` | `MenuItem[]` | If present, renders as a dropdown. The menu click opens the popup |

> **Note:** A menu entry with no `menuItems` renders as a **flat link**. A menu entry with `menuItems` renders as a **dropdown button** — clicking shows the popup.

---

## Dropdown Item Schema (`menuItems`)

Each entry in `menuItems`:

```json
{
  "title": "Manage Roles",
  "description": "View and edit system roles",
  "href": "admin/role",
  "target": "_self",
  "category": "User Management",
  "prefixIcon": "user--line",
  "suffixIcon": "arrow-right--line",
  "id": "manage-roles",
  "secure": false
}
```

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Dropdown item label |
| `description` | `string` | Optional sub-text shown below the title |
| `href` | `string` | Route path or URL to navigate to |
| `target` | `string` | `"_self"` or `"_blank"` |
| `category` | `string` | Groups items under a column heading in the dropdown popup |
| `prefixIcon` | `string` | Icon name shown before the title |
| `suffixIcon` | `string` | Icon name shown after the title |
| `id` | `string` | For authorization filtering |
| `secure` | `boolean` | Hidden when no authorization data provided |

---

## Per-Route Header Override

Add `headerDefinition` directly inside a route object to override the header for that specific route.

```json
{
  "routes": [
    {
      "path": "basic",
      "component": "sb-my-plugin-home",
      "element": "home.js",
      "headerDefinition": {
        "showHeader": false
      }
    },
    {
      "path": "admin/:section",
      "component": "sb-my-plugin-admin",
      "element": "admin.js",
      "headerDefinition": {
        "title": "Admin Panel",
        "showHeader": true,
        "menus": [
          {
            "title": "Dashboard",
            "href": "admin/dashboard"
          },
          {
            "title": "Settings",
            "menuItems": [
              { "title": "Roles", "href": "admin/role" },
              { "title": "Reference Data", "href": "admin/reference-data" }
            ]
          }
        ]
      }
    }
  ],
  "headerDefinition": {
    "title": "My Plugin",
    "showHeader": true,
    "menus": [
      { "title": "Home", "href": "home" }
    ]
  }
}
```

The per-route `headerDefinition` is deep-merged with the top-level one, so you only need to specify the fields you want to change.

---

## Complete Example

Real-world example from a production plugin:

```json
{
  "defaultRoute": "home",
  "routes": [
    {
      "path": "home",
      "component": "sb-my-plugin-home",
      "element": "home.js"
    },
    {
      "path": "cases",
      "component": "sb-my-plugin-case",
      "element": "case.js"
    },
    {
      "path": "cases/:id",
      "component": "sb-my-plugin-case",
      "element": "case.js"
    },
    {
      "path": "admin/reference-data",
      "component": "sb-my-plugin-reference-data",
      "element": "reference-data.js"
    },
    {
      "path": "admin/role",
      "component": "sb-my-plugin-role",
      "element": "role.js"
    }
  ],
  "headerDefinition": {
    "title": "Group Investigations",
    "showHeader": true,
    "menus": [
      {
        "title": "Home",
        "href": "home"
      },
      {
        "title": "Admin",
        "width": "13.5rem",
        "menuItems": [
          {
            "title": "Manage reference data",
            "href": "admin/reference-data"
          },
          {
            "title": "Manage roles",
            "href": "admin/role"
          }
        ]
      }
    ]
  }
}
```

---

## Authorization (Menu Visibility)

Menus and dropdown items can be hidden based on authorization context using two mechanisms:

### `id`-based filtering
If `authzTypeObjects.menu` is provided (a list of allowed menu IDs), a menu or item is only shown if its `id` is in that list.

```json
{
  "title": "Admin",
  "id": "admin-menu",
  "menuItems": [
    { "title": "Manage Roles", "id": "manage-roles", "href": "admin/role" }
  ]
}
```

### `secure` flag
If `secure: true` is set on a menu or item, it is hidden when no authorization data exists (i.e., `authzTypeObjects.menu` is `undefined`).

```json
{
  "title": "Admin Settings",
  "href": "admin/settings",
  "secure": true
}
```

Use `id` when you want explicit whitelist control. Use `secure` when you want to hide for all unauthorized users but show for all authorized users.

---

## Common Patterns

### Hide header on a specific route (e.g., a full-screen page)
```json
{
  "path": "fullscreen-view",
  "component": "sb-my-plugin-fullscreen",
  "element": "fullscreen.js",
  "headerDefinition": { "showHeader": false }
}
```

### Open an external link in a new tab
```json
{
  "title": "Documentation",
  "href": "https://docs.example.com",
  "target": "_blank"
}
```

### Dropdown with grouped items (categories)
```json
{
  "title": "Layouts",
  "width": "900px",
  "menuItems": [
    {
      "title": "Main Content Left",
      "description": "2 columns, main at left",
      "href": "layout/main-content-left",
      "category": "2 Columns layout"
    },
    {
      "title": "Main Content Right",
      "description": "2 columns, main at right",
      "href": "layout/main-content-right",
      "category": "2 Columns layout"
    },
    {
      "title": "Main Content Middle",
      "description": "3 columns, main at middle",
      "href": "layout/main-content-middle",
      "category": "3 Columns layout"
    }
  ]
}
```

### Dropdown item with icons
```json
{
  "title": "View Details",
  "href": "cases/details",
  "prefixIcon": "info-circle--line",
  "suffixIcon": "arrow-right--line"
}
```

### Completely hide header for all routes (override globally)
```json
"headerDefinition": {
  "showHeader": false
}
```

---

## Key Rules

1. **No custom component needed** — header is rendered by `service-bench-plugin-container` from `routes.json`.
2. **`showHeader: true` is required** — without it (or if set to `false`) the header bar is invisible.
3. **No `menuItems` = flat link**, with `menuItems` = dropdown.
4. **Per-route overrides merge** with top-level — you don't need to repeat all menus, only what changes.
5. **`href` paths are relative** to the plugin base path (e.g., `"admin/role"` not `"/admin/role"`), unless they start with `http://` or `https://` (treated as absolute URLs).
6. **`title`** in `headerDefinition` fallbacks to `pluginName` if omitted.
7. **Menu selection state** is automatically managed by the container — the active route's menu is highlighted.

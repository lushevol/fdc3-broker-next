---
name: sb-context-provider
description: >
  Complete guide for using Service Bench Shell contexts and providers in LitElement plugin components.
  Use this skill whenever you need to consume shell-provided data (user info, navigation, locale, permissions, view size, etc.)
  in a plugin component at any component tree depth — without passing data through intermediate @property chains.
  Trigger on any request involving: createContext, createConsumer, contexts.USER, contexts.NAVIGATION, contexts.LOCALE,
  contexts.AUTHZ, contexts.REST_CLIENT, contexts.STORAGE_CLIENT, contexts.PLUGIN, contexts.EVENT_BUS, contexts.APP,
  contexts.SHELL, contexts.VIEW, contexts.ICON_LIBRARY, SbElement, context consumer, context provider, service-bench-core,
  local dev auth provider, preset locale, userPreferenceProvider, authProvider, get user from context, navigate to route,
  consume context in deep child, context value in LitElement, plugin context, sb shell context,
  or any question like "how do I get the current user / navigate / check permissions / get locale in a plugin component"
---

# Service Bench — Context & Providers

Contexts are the **primary channel** through which the Service Bench Shell shares runtime data (user identity, routing, preferences, etc.) with plugin components. They are built on `@lit/context` (Lit's official Context API) and wrapped by `@scdevkit/service-bench-core`.

The key insight: **any component at any depth** in the tree can subscribe directly to a context — no need to thread `@property()` through every ancestor. This is the right tool when a deep child needs shell data that its parent doesn't care about.

---

## Core Pattern: Three Steps

```typescript
import { createContext, contexts } from '@scdevkit/service-bench-core';

// 1. Create the context object (once, at module level)
const navigationContext = createContext(contexts.NAVIGATION);

export class MyComponent extends LitElement {
  // 2. Create a consumer — subscribes automatically, triggers re-render on change
  private _nav = navigationContext.createConsumer(this);

  goHome() {
    // 3. Access the live value
    this._nav.value.go('home');
  }
}
```

`createConsumer(host, callback?)` — the optional `callback` fires every time the context value changes. Useful for triggering side effects (e.g., re-fetching data when the user changes).

```typescript
private _user = userContext.createConsumer(this, (value) => {
  console.log('[MyPage] User changed:', value?.id);
  this._loadUserData();
});
```

---

## All Available Contexts

Import key: `import { createContext, contexts } from '@scdevkit/service-bench-core';`

| `contexts.*` key | String value | What it provides |
|---|---|---|
| `NAVIGATION` | `service-bench-navigation-context` | Routing — `go()`, `path`, `params`, `link()` |
| `USER` | `service-bench-user-context` | Logged-in user info |
| `LOCALE` | `service-bench-locale-context` | Language selection |
| `ANALYTICS` | `service-bench-analytics-context` | Event tracking |
| `VIEW` | `service-bench-view-context` | Viewport size / device type |
| `APP` | `service-bench-app-context` | App config: env, version |
| `SHELL` | `service-bench-shell-context` | Split-view mode, shell state |
| `ICON_LIBRARY` | `service-bench-icon-library` | Plugin icon bundles |
| `AUTHZ` | `service-bench-authz-context` | Authorization checker |
| `AUTHZ_CLIENT` | `service-bench-authz-client-context` | Raw authz client |
| `REST_CLIENT` | `service-bench-rest-client-context` | REST HTTP client |
| `STORAGE_CLIENT` | `service-bench-storage-client-context` | File storage client |
| `PLUGIN` | `service-bench-plugin` | Plugin-level config |
| `EVENT_BUS` | `service-bench-event-bus-context` | Cross-plugin event bus |
| `PREFERENCE` | `service-bench-preference-context` | User preference store |
| `STORE` | `service-bench-store-context` | Global state store |
| `RECENTLY_VIEW` | `service-bench-recently-view` | Recently viewed records |
| `ANNOUNCEMENT` | `service-bench-announcement-context` | Platform announcements |
| `MAINTENANCE` | `service-bench-maintenance-context` | Maintenance mode flag |

---

## Context Property Reference

### NAVIGATION context
| Property | Type | Description |
|---|---|---|
| `path` | `string` | Current route path |
| `params` | `object` | Route params (e.g., `{ caseId: '123' }`) |
| `go(path)` | `Function` | Navigate to path. Cross-plugin: `go('/(pluginId)/(route)')` |
| `link(path?)` | `Function` | Generate URL for a path (omit arg = current page URL) |

### USER context
| Property | Type | Description |
|---|---|---|
| `id` | `string` | Login ID |
| `firstName` | `string` | First name |
| `lastName` | `string` | Last name |

### LOCALE context
| Property | Type | Description |
|---|---|---|
| `getAvailableLanguages()` | `Function` | Returns list of available languages |
| `getCurrentLanguage()` | `Function` | Returns current language code |
| `setCurrentLanguage(lang)` | `Function` | Changes language |

### ANALYTICS context
| Property | Type | Description |
|---|---|---|
| `publishEvent(name, data)` | `Function` | Publish custom plugin analytics event |

### VIEW context
| Property | Type | Description |
|---|---|---|
| `size` | `string` | `xxs` / `xs` / `sm` / `md` / `lg` / `xl` / `xxl` |
| `width` | `number` | Viewport width in px |
| `isTablet` | `boolean` | Whether running on tablet |

### APP context
| Property | Type | Description |
|---|---|---|
| `env` | `string` | Environment name (e.g., `'production'`) |
| `version` | `string` | Service Bench shell version |
| `webkitVersion` | `string` | SCWebKit version |

### SHELL context
| Property | Type | Description |
|---|---|---|
| `mode` | `string` | `'single'` or `'multiple'` (split view enabled) |
| `primary` | `boolean` | Whether this is the primary shell |
| `active` | `boolean` | Whether this shell is focused |
| `isSplitViewActive` | `boolean` | Split view currently active |
| `canOpenInSplitView(path)` | `Function` | Check if path can open in split view |
| `openInSplitView(path)` | `Function` | Open path in split view |

### ICON_LIBRARY context
Returns an array of icon library definitions. Spread into `sc-icon-provider`:
```typescript
const sbIconLibraries = Array.isArray(this._iconLibraryCtx.value)
  ? this._iconLibraryCtx.value : [];

render() {
  return html`<sc-icon-provider .iconLibraries=${[...sbIconLibraries]}></sc-icon-provider>`;
}
```

---

## SbElement Base Class — Free Contexts

`SbElement` (from `@scdevkit/service-bench-core`) already wires up the 4 most-used contexts. Extend it to skip boilerplate:

```typescript
import { SbElement } from '@scdevkit/service-bench-core';

export class MyPage extends SbElement {
  // These are ready to use — no createContext/createConsumer needed:
  //   this._userContextConsumer.value       → USER context
  //   this._navigationContextConsumer.value → NAVIGATION context
  //   this._appContextConsumer.value        → APP context
  //   this._analyticsContextConsumer.value  → ANALYTICS context

  goHome() {
    this._navigationContextConsumer.value.go('home');
  }

  render() {
    const user = this._userContextConsumer.value;
    return html`<p>Hello, ${user?.firstName}</p>`;
  }
}
```

> **Note:** When to use `SbElement` vs `LitElement` — use `SbElement` when you want the 4 free consumers; use `LitElement` + manual `createConsumer` when you need explicit control or want to document which contexts the component depends on. Many plugins use `LitElement` directly for page orchestrators.

---

## Consuming Context in a Deep Child Component

Context shines when a leaf component needs shell data without burdening the parent chain. Just call `createConsumer` directly in the child:

```typescript
// src/views/case/components/main/CaseDetailForm.ts
import { createContext, contexts } from '@scdevkit/service-bench-core';

const userCtx = createContext(contexts.USER);

export class CaseDetailForm extends LitElement {
  // No @property from parent needed — consumes directly from the shell
  private _user = userCtx.createConsumer(this);

  render() {
    const user = this._user.value as any;
    return html`<span>Submitted by: ${user?.firstName} ${user?.lastName}</span>`;
  }
}
```

---

## Using Multiple Contexts Together

```typescript
import { createContext, contexts } from '@scdevkit/service-bench-core';

const userCtx   = createContext(contexts.USER);
const navCtx    = createContext(contexts.NAVIGATION);
const pluginCtx = createContext(contexts.PLUGIN);

export class CasePage extends LitElement {
  private _user   = userCtx.createConsumer(this);
  private _nav    = navCtx.createConsumer(this);
  private _plugin = pluginCtx.createConsumer(this);

  async connectedCallback() {
    super.connectedCallback();
    // params from URL — e.g. /case/123
    const caseId = this._nav.value?.params?.caseId;
    await this._loadCase(caseId);
  }

  private _handleClose() {
    this._nav.value?.go('home');
  }
}
```

---

## GraphQLClientService Uses REST_CLIENT Context Internally

The plugin's `GraphQLClientService` already consumes `REST_CLIENT` and `STORAGE_CLIENT` contexts internally. You don't need to access those contexts directly in page components — just instantiate the service:

```typescript
import GraphQLClientService from '../../api/GraphQLClientService';

export class MyPage extends LitElement {
  private _graphQLClient = new GraphQLClientService(this);
  // GraphQLClientService internally pulls REST_CLIENT context from `this` host
}
```

---

## Provider: Local Development Customization

In local development (`service-bench.html`), you can inject custom providers to simulate different users or locales — no need to log in as a specific user in the real system.

### Local User Profile

```html
<!-- service-bench.html -->
<script type="module">
  import { html, render } from 'lit';
  import '@scdevkit/service-bench-core/elements';

  const testUser = {
    id: '1577986',
    firstName: 'Test',
    lastName: 'User',
  };

  const authProvider = {
    init: async () => Promise.resolve(),
    isAuthenticated: async () => new Promise(resolve => setTimeout(resolve, 1000)),
    getUser: async () => Promise.resolve(testUser),
    performAuth: async () => Promise.resolve(testUser),
  };

  render(
    html`<service-bench .authProvider=${authProvider}></service-bench>`,
    document.querySelector('#sb-root')
  );
</script>
```

### Preset Locale

```html
<script type="module">
  import { html, render } from 'lit';
  import '@scdevkit/service-bench-core/elements';

  const userPreferenceProvider = {
    getAll: async () => Promise.resolve({ locale: { language: 'zh-CN' } }),
  };

  render(
    html`<service-bench .userPreferenceProvider=${userPreferenceProvider}></service-bench>`,
    document.querySelector('#sb-root')
  );
</script>
```

> Both providers can be combined on the same `<service-bench>` element.

---

## Common Patterns & Pitfalls

### Context value may be undefined on first render
Context values are populated asynchronously when the shell provides them. Always guard:
```typescript
const user = this._userContextConsumer.value;
if (!user) return html`<sc-spinner></sc-spinner>`;
```

### `subscribe: true` is the default
`createConsumer` sets `subscribe: true` — the component automatically re-renders when the context value changes. No manual subscription management needed.

### Context key must match exactly
The context key is a plain string used as an identifier throughout the DOM tree. `createContext(contexts.USER)` on the consumer side must match the key used by the shell's provider. Always use the `contexts.*` constants — never hardcode strings like `'service-bench-user-context'`.

### Do NOT invent a UserContext import type
There is no exported `UserContext` type from this project or from `@scdevkit/service-bench-core`. Do not write `import type { UserContext } from '../../../../types/types'` or similar — this file does not exist. Just cast the value as `any`:
```typescript
const user = this._user.value as any;
// Then access user?.firstName, user?.lastName, user?.id
```

### authProvider.isAuthenticated must use setTimeout pattern
When writing a local dev `authProvider`, use the documented timing pattern for `isAuthenticated`. Do NOT return `Promise.resolve(true)` directly — use the timeout to allow the shell to initialize properly:
```typescript
const authProvider = {
  init: async () => Promise.resolve(),
  isAuthenticated: async () => new Promise(resolve => setTimeout(resolve, 1000)), // ← correct
  getUser: async () => Promise.resolve(testUser),
  performAuth: async () => Promise.resolve(testUser),
};
```
Do NOT add extra methods like `refreshToken`, `logout`, `set`, `remove`, `removeAll` — only these 4 are required.

### Cross-plugin navigation
```typescript
// Navigate to a different plugin's route
this._nav.value.go('/(another-plugin-id)/(route)');
```

### Reading route params
```typescript
const nav = this._navigationContextConsumer.value;
const caseId = nav?.params?.caseId;   // from URL like /case/:caseId
const tab    = nav?.params?.tab;
```

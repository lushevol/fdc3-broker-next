# @leap/sdk — Services & App Bootstrap

---

## HttpService

Axios-backed HTTP service. Import from `@leap/sdk`.

```js
import { HttpService } from '@leap/sdk';
// OR for direct module access:
import HttpService from '@leap/sdk/lib/HttpService';
```

### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `get` | `(url, config?)` | GET request |
| `post` | `(url, data?, config?)` | POST request |
| `put` | `(url, data?, config?)` | PUT request |
| `patch` | `(url, data?, config?)` | PATCH request |
| `delete` | `(url, config?)` | DELETE request |
| `head` | `(url, config?)` | HEAD request |
| `options` | `(url, config?)` | OPTIONS request |
| `request` | `(config)` | Raw axios request |
| `download` | `(url, fileName, fileType?, options?)` | Download file as blob |
| `addRequestInterceptor` | `(fn)` → id | Add axios request interceptor |
| `removeRequestInterceptor` | `(id)` | Remove request interceptor |

All methods return a Promise (axios response). Access `.data` for response body.

```js
// GET
const res = await HttpService.get('/api/urls');
const items = res.data;

// POST
const res = await HttpService.post('/api/urls', {
  longUrl: 'https://example.com',
  shortUrl: 'ex',
});

// DELETE
await HttpService.delete(`/api/urls/${id}`);

// File download
await HttpService.download(
  '/api/report/export',
  'report.xlsx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
);
```

---

## HttpServiceContext

Configure the HTTP service at app startup.

```js
import { HttpServiceContext } from '@leap/sdk';

// Set base API URL (prepended to all requests)
HttpServiceContext.setApiEndpoint('https://api.myapp.com');

// Set global error handler
HttpServiceContext.setErrorInterceptor((error) => {
  console.error('HTTP Error', error.response?.status);
  // Return the error to re-throw, or handle here
});
```

---

## AuthService

JWT-based authentication service.

```js
import { AuthService } from '@leap/sdk';
```

### Key Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getAuthHeader()` | string | `"Bearer <token>"` for use in HTTP headers |
| `getAccessToken()` | object | Decoded JWT payload |
| `isTokenValid()` | bool | Whether the current token is valid and unexpired |
| `getEntitlement()` | object | User entitlements |
| `getProfile()` | object | User profile object |
| `setAccessToken(token, type)` | object | Store JWT; type = `'Bearer'` |
| `removeAccessToken()` | void | Clear token from memory and localStorage |
| `setEntitlement(entitlement)` | void | Store entitlement |
| `setProfile(profileObj)` | void | Store profile |
| `init(config)` | Promise | Bootstrap auth (fetches token etc.) |

```js
// Check if authenticated
if (AuthService.isTokenValid()) {
  const profile = AuthService.getProfile();
  console.log('Logged in as', profile.name);
}

// Get entitlement for permission check
const entitlement = AuthService.getEntitlement();
const isAdmin = entitlement?.roles?.includes('admin');
```

### Auth config passed to `initApp`
```js
{
  authNamespace: 'TS',            // localStorage key prefix
  authScopeType: '',              // scope type string
  authScopeValue: '',             // scope value string
  authBaseUrl: 'https://...',     // base auth API URL
}
```

---

## App Bootstrap — Provider Setup

The standard pattern used in this project (see `src/initApp.js`):

```jsx
import React, { Component } from 'react';
import {
  PortalAppProvider,
  PortalAppConfigProvider,
  Viewport,
  ViewportProvider,
  DataContainer,
  HttpServiceContext,
} from '@leap/sdk';

// Responsive viewport wrapper
const AppViewport = ({ viewport, children }) =>
  viewport
    ? <ViewportProvider value={viewport}>{children}</ViewportProvider>
    : <Viewport>{children}</Viewport>;

// Context providers
const AppContext = ({ portalApp, portalAppConfig, children }) => {
  const appBasePath = portalApp?.appBasePath || '/default';
  const appId = ('leap' + appBasePath.replace('/', '_')).toUpperCase();
  return (
    <DataContainer name={appId}>
      <PortalAppProvider value={portalApp}>
        <PortalAppConfigProvider value={portalAppConfig}>
          {children}
        </PortalAppConfigProvider>
      </PortalAppProvider>
    </DataContainer>
  );
};

// Root app container
class AppContainer extends Component {
  componentDidMount() {
    const { env } = this.props;
    if (env?.apiEndpoint)
      HttpServiceContext.setApiEndpoint(env.apiEndpoint);
    if (env?.handlers?.httpServiceError)
      HttpServiceContext.setErrorInterceptor(env.handlers.httpServiceError);
  }

  render() {
    const { App, portalApp, portalAppConfig, viewport } = this.props;
    return (
      <AppViewport viewport={viewport}>
        <AppContext portalApp={portalApp} portalAppConfig={portalAppConfig}>
          <App {...this.props} />
        </AppContext>
      </AppViewport>
    );
  }
}

// Entry point called by the host portal
export default function initApp(props) {
  return <AppContainer {...props} App={MyApp} />;
}
```

---

## portalApp Object

Injected from the host portal at runtime. Key fields:

| Field | Type | Description |
|-------|------|-------------|
| `appBasePath` | string | Base URL path, e.g. `'/go'` |
| `env` | object | Environment config (apiEndpoint, handlers) |
| `env.apiEndpoint` | string | Backend base URL |
| `env.handlers.httpServiceError` | func | Global error handler |
| `env.resolveUiURL` | func | Resolve asset URLs |

---

## Viewport / ViewportProvider

Provides responsive breakpoint context to the whole tree.

```jsx
// Automatic breakpoint detection
<Viewport>{children}</Viewport>

// Manual value injection (e.g. in tests or micro-frontends)
<ViewportProvider value={{ is: (bp) => bp === 'lg' }}>
  {children}
</ViewportProvider>
```

---

## StyleguideColor / ThemeColor / DotStatus

```js
import { StyleguideColor, ThemeColor, DotStatus } from '@leap/sdk';

// StyleguideColor — static palette constants
const red = StyleguideColor.RED;
const blue = StyleguideColor.BLUE;

// ThemeColor — semantic theme tokens
const primary = ThemeColor.primary;
const success = ThemeColor.success;
```

---

## initApp (SDK default export)

The SDK also exports an `initApp` function that wraps the full provider tree automatically.

```js
import { initApp } from '@leap/sdk';

// Call from your Action.js / entry point
initApp({ App: MyApp, portalApp, portalAppConfig, viewport });
```

This is equivalent to the manual pattern above but uses SDK-internal providers.

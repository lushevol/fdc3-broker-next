---
name: leap-kit-components
description: 'Reference skill for @leap React component library (v3.70.0). Use when building UI with @leap/sdk, @leap/ui-elements, @leap/ui-components, @leap/ui-extensions, or @leap/icons — for component selection, correct props, import patterns, layout, forms, feedback components, domain entities, navigation HOCs, and service wiring.'
---

# Leap Kit Components

## Packages at a Glance

| Package | Purpose | Import |
|---------|---------|--------|
| `@leap/sdk` | **Unified entry point** — re-exports everything from ui-elements, ui-components, ui-extensions | `import { Button } from '@leap/sdk'` |
| `@leap/ui-elements` | Primitive UI: Button, Table, Modal, Alert, Card, Grid, Tag, Tooltip, Spinner, etc. | via `@leap/sdk` |
| `@leap/ui-components` | Domain UI: Contact, Application, Avatar, Navigation, Header, Forms, DataContainer, etc. | via `@leap/sdk` |
| `@leap/ui-extensions` | Extension-level UI: APIDoc, ApplicationExt, CertificateExt, HostExt, IncidentChange | via `@leap/sdk` |
| `@leap/icons` | SVG icon set — default export only | `import Icon from '@leap/icons'` |

**Rule:** Always import from `@leap/sdk` (not sub-packages) unless accessing a deep module path (e.g. `@leap/sdk/lib/HttpService`).

---

## Quick Import Reference

```js
// Components, HOCs, services — all from @leap/sdk
import {
  // Layout
  GridContainer, GridRow, GridColumn, Box, Columns, PageContent,
  // Actions
  Button, Link, NavLink, IconButton, ActionGroup, ActionItem, ActionIcon,
  // Feedback
  Alert, Spinner, Modal, Prompt, Tooltip, Toast,
  // Data display
  Table, InfiniteScroll, List, Tag, Search, DotStatus,
  // Forms
  TextInput, Switch, SwitchInput, CheckboxInput, RadioInput, RadioInputGroup,
  NumberInput, DateInput, DateRangeInput, DropdownInput, MultiselectInput,
  ContactInput, Select,
  // Domain entities
  ContactName, ContactAvatar, StyleguideColor, ThemeColor,
  // Services
  HttpService, AuthService, HttpServiceContext,
  // App wiring
  initApp, PortalAppProvider, PortalAppConfigProvider, DataContainer,
  Viewport, ViewportProvider,
  // HOCs
  withNavigation, withDataContainer,
  // MasterDetail
  MasterDetail,
} from '@leap/sdk';

// Icons — default export
import Icon from '@leap/icons';
```

---

## Layout System

`GridContainer → GridRow → GridColumn` maps to Reactstrap Container → Row → Col.

```jsx
<GridContainer>
  <GridRow>
    <GridColumn md={6}>Left</GridColumn>
    <GridColumn md={6}>Right</GridColumn>
  </GridRow>
</GridContainer>
```

`Box` is a generic block wrapper. `Columns` is a flex column layout helper.

---

## Key Component APIs

### Button
See [./references/ui-elements.md](./references/ui-elements.md#button) for full API.

```jsx
<Button onClick={fn} primary>Save</Button>
<Button type="danger" icon="trash" iconPosition="left">Delete</Button>
<Button compact disabled>Small</Button>
```

### Alert
```jsx
<Alert type="info">Message</Alert>           // type: info | success | error | warning
<Alert type="error" closeable onAction={fn} mode="banner">Error</Alert>
```

### Modal
```jsx
<Modal
  open={isOpen}
  title="Confirm"
  size="md"                         // sm | md | lg
  handleAction={(name) => { }}      // called with action.name
  actions={[
    { name: 'confirm', label: 'OK', primary: true },
    { name: 'cancel',  label: 'Cancel' },
  ]}
  showCloseIcon
  closeOnClickOutside
>
  Modal body content
</Modal>
```

### Spinner
```jsx
<Spinner />   // loading indicator
```

### Tag
```jsx
<Tag color="primary">Label</Tag>
```

### Tooltip
Wraps `rc-tooltip`. Pass `overlay` (content), `placement`, and the target as child.

```jsx
<Tooltip overlay="Tip text" placement="top">
  <span>Hover me</span>
</Tooltip>
```

### Prompt (confirmation dialog)
```jsx
<Prompt
  open={show}
  title="Are you sure?"
  message="This cannot be undone."
  handleAction={(name) => { /* name: 'ok' | 'cancel' */ }}
/>
```

### InfiniteScroll
```jsx
<InfiniteScroll
  hasMore={hasMore}
  loadMore={fetchNext}
  loader={<Spinner />}
>
  {items.map(item => <div key={item.id}>{item.name}</div>)}
</InfiniteScroll>
```

### Search
```jsx
<Search
  value={query}
  onChange={(val) => setQuery(val)}
  placeholder="Search..."
/>
```

### Table
Wraps Reactstrap `Table`. All reactstrap Table props are supported.

```jsx
<Table striped bordered hover responsive>
  <thead><tr><th>Name</th><th>Value</th></tr></thead>
  <tbody>{rows}</tbody>
</Table>
```

---

## Forms

All inputs use controlled pattern with `value` + `onChange`.

```jsx
<TextInput  value={val} onChange={fn} label="Name" placeholder="..." />
<NumberInput value={num} onChange={fn} label="Count" />
<Switch checked={bool} onChange={fn} />
<CheckboxInput checked={bool} onChange={fn} label="Accept" />
<RadioInputGroup value={selected} onChange={fn} options={[{ label:'A', value:'a' }]} />
<DateInput value={date} onChange={fn} />
<DropdownInput value={val} onChange={fn} options={[{ label:'X', value:'x' }]} />
<MultiselectInput value={[]} onChange={fn} options={opts} />
<ContactInput value={contact} onChange={fn} />   // contact picker
```

---

## Icons

```jsx
import Icon from '@leap/icons';

<Icon name="search"  size="1rem" />
<Icon name="cross"   size="1.25rem" color="#666" />
<Icon name="chevron-right--line" />
```

`name` accepts kebab-case icon names. See [./references/icons.md](./references/icons.md) for common icon names.

---

## Navigation (withNavigation HOC)

`withNavigation` wraps a component with react-router and provides navigation props.

```jsx
// Wrap your component
export default withNavigation(MyComponent);

// Props injected by withNavigation:
// props.goTo(path, state?)   — push to route
// props.goBack()             — history.goBack()
// props.createHref(path)     — creates an href
// props.canGoBack()          — boolean
// props.refresh()            — reload current route
// props.stateParams          — location.state
```

`NavLink` is the link primitive (renders `<a>` with router awareness):
```jsx
<NavLink href="/some/path">Click</NavLink>
```

---

## Services

### HttpService
Axios-backed HTTP client. Methods: `get`, `post`, `put`, `patch`, `delete`, `download`.

```js
import { HttpService } from '@leap/sdk';

const data = await HttpService.get('/api/resource').then(r => r.data);
await HttpService.post('/api/resource', payload);
await HttpService.download('/api/file', 'report.pdf', 'application/pdf');
```

### AuthService
Handles JWT token storage, entitlements, and profile.

```js
import { AuthService } from '@leap/sdk';

AuthService.getAuthHeader();        // returns Bearer token string
AuthService.getAccessToken();       // decoded JWT payload
AuthService.isTokenValid();         // boolean
AuthService.getEntitlement();       // entitlement object
AuthService.getProfile();           // user profile
```

### HttpServiceContext
Used at app setup to configure the HTTP service.

```js
import { HttpServiceContext } from '@leap/sdk';

HttpServiceContext.setApiEndpoint('https://api.example.com');
HttpServiceContext.setErrorInterceptor(errorHandler);
```

---

## App Bootstrap

Both `initApp` (from SDK) and the manual pattern (from `src/initApp.js`) wire up provider context.

### Manual pattern (preferred in this project)
```jsx
import {
  PortalAppProvider, PortalAppConfigProvider,
  DataContainer, Viewport, HttpServiceContext
} from '@leap/sdk';

class AppContainer extends Component {
  componentDidMount() {
    const { env } = this.props;
    if (env.apiEndpoint) HttpServiceContext.setApiEndpoint(env.apiEndpoint);
    if (env.handlers?.httpServiceError)
      HttpServiceContext.setErrorInterceptor(env.handlers.httpServiceError);
  }
  render() {
    const { App, portalApp, portalAppConfig } = this.props;
    return (
      <Viewport>
        <DataContainer name="APP_ID">
          <PortalAppProvider value={portalApp}>
            <PortalAppConfigProvider value={portalAppConfig}>
              <App {...this.props} />
            </PortalAppConfigProvider>
          </PortalAppProvider>
        </DataContainer>
      </Viewport>
    );
  }
}
```

---

## Domain Components

```jsx
<ContactName id={userId} />              // renders user's display name
<ContactAvatar id={userId} size="sm" />  // renders user avatar
```

`StyleguideColor` and `ThemeColor` provide color constants:
```js
import { StyleguideColor, ThemeColor } from '@leap/sdk';
const primary = ThemeColor.primary;
```

---

## MasterDetail

```jsx
import { MasterDetail, withNavigation, withDataContainer } from '@leap/sdk';

// Use MasterDetail for side-panel list + detail layouts
<MasterDetail
  listComponent={MyList}
  detailComponent={MyDetail}
  items={data}
/>
```

---

## References

- [UI Elements (primitives)](./references/ui-elements.md) — Button, Table, Alert, Modal, Card, Tag, Tooltip, Grid, etc.
- [UI Components (domain)](./references/ui-components.md) — Contact, Avatar, Application, Navigation, Header, Forms
- [Services & App Setup](./references/services.md) — HttpService, AuthService, initApp, Providers
- [Icons](./references/icons.md) — Icon usage and common icon names

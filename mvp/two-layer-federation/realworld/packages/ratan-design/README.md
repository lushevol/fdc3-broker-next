# @fm/ratan-design

> Legacy compatibility and reference package for the Realworld migration.
> Portal Host, Cashflow, Identity/Profile, FDC3 Admin, and Cashflow Blotter MVP
> use `@scdevkit/webkit` for active shared UI. Do not add new active-host
> UI here. Last reviewed 3 August 2026; see
> [`../../docs/CURRENT_STATE.md`](../../docs/CURRENT_STATE.md).

Production design foundation for the two-layer portal. Applications consume this package at build time and create a local provider for each React root. It is never a Module Federation remote and does not provide domain workflows.

## Public API

- `DesignSystemProvider` — local React Aria/CSS provider for resolved scheme, density, direction, and optional overlay container
- `Button` — primary, secondary, danger, and ghost actions
- `TextField` — accessible controlled text input
- `NumberField` — locale-aware controlled `number | null` input with bounded numeric constraints
- `StatusBadge` — ready, review, blocked, and neutral semantics
- `Dialog` — accessible, compositional modal with bounded width and dismissal behavior
- `ConfirmationDialog` — default/danger confirmation with disabled and loading safety
- `InlineAlert` — application-local semantic feedback with an optional action
- Login/form: `Form`, `FieldGroup`, `PasswordField`, `Tabs`, `Divider`, and `Link`
- Shell/feedback: `PageHeader`, `IconButton`, `Switch`, `ToggleButton`, `ProgressCircle`, `EmptyState`, `ErrorState`, and `Toast`
- Navigation: `SideNavigation`, `Tabs`, and closable `WorkspaceTabs`
- Profile/display: `Avatar`, `Card`, `Disclosure`, `TagGroup`, and `DescriptionList`
- `semanticTokens` — typed semantic token metadata
- `@fm/ratan-design/styles.css` — generated scoped token stylesheet

```tsx
import {
  Button,
  Dialog,
  DesignSystemProvider,
  InlineAlert,
  NumberField,
  StatusBadge,
  TextField,
} from '@fm/ratan-design';

<DesignSystemProvider
  appearance={{ scheme: 'dark', density: 'compact', direction: 'ltr' }}
  scope="application"
>
  <TextField id="filter" label="Filter" value={filter} onChange={setFilter} />
  <NumberField
    id="limit"
    label="Limit"
    value={limit}
    min={0}
    onChange={setLimit}
  />
  <StatusBadge status="ready">Ready</StatusBadge>
  <InlineAlert tone="info" message="Local application feedback" />
  <Button>Submit</Button>
  <Dialog open={open} title="Edit limit" onClose={() => setOpen(false)}>
    Application-owned form content
  </Dialog>
</DesignSystemProvider>;
```

Consumers must install compatible React 18.3 or React 19 peers. React Aria Components is an internal behavior dependency: do not infer public behavior from its classes, import it through Ratan, or import internal package paths.

`Dialog`, `ConfirmationDialog`, and `InlineAlert` are presentation primitives. Applications retain lifecycle, validation, request state, authorization, maker/checker policy, service calls, and success/error decisions. See [interaction ownership](docs/INTERACTION_FOUNDATION.md).

## Commands

```bash
npm --workspace @fm/ratan-design test
npm --workspace @fm/ratan-design run build
npm --workspace @fm/ratan-design run lint
npm --workspace @fm/ratan-design run dev:sb
```

The generated token artifact is checked in at `src/generated/tokens.css`; its drift test compares it byte-for-byte with the typed source. The checked-in [`gds-official`](./gds-official/) reference is the authority for the palette, semantic color conventions, and typography scale. Ratan publishes scoped `--ratan-*` aliases so applications do not inherit global GDS CSS or its implementation dependencies.

See [GDS alignment](docs/GDS_ALIGNMENT.md), [architecture](docs/ARCHITECTURE.md), [rules](docs/RULES.md), and [release governance](docs/RELEASE_GOVERNANCE.md).

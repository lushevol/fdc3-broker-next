# @fm/ratan-design

Production design foundation for the two-layer portal. Applications consume this package at build time and create a local provider for each React root. It is never a Module Federation remote and does not provide domain workflows.

## Public API

- `DesignSystemProvider` — local MUI/Emotion provider for resolved scheme, density, and direction
- `Button` — primary, secondary, danger, and ghost actions
- `TextField` — accessible controlled text input
- `NumberField` — controlled `number | null` input with native numeric constraints
- `StatusBadge` — ready, review, blocked, and neutral semantics
- `Dialog` — accessible, compositional modal with bounded width and dismissal behavior
- `ConfirmationDialog` — default/danger confirmation with disabled and loading safety
- `InlineAlert` — application-local semantic feedback with an optional action
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

Consumers must install compatible React 18, MUI 5, and Emotion peers. MUI is an implementation detail: do not infer public behavior from generated classes and do not import internal package paths.

`Dialog`, `ConfirmationDialog`, and `InlineAlert` are presentation primitives. Applications retain lifecycle, validation, request state, authorization, maker/checker policy, service calls, and success/error decisions. See [interaction ownership](docs/INTERACTION_FOUNDATION.md).

## Commands

```bash
npm --workspace @fm/ratan-design test
npm --workspace @fm/ratan-design run build
npm --workspace @fm/ratan-design run lint
npm --workspace @fm/ratan-design run dev:sb
npm --workspace @fm/ratan-design run dev:demo
```

The generated token artifact is checked in at `src/generated/tokens.css`; its drift test compares it byte-for-byte with the typed source.

See [architecture](docs/ARCHITECTURE.md), [rules](docs/RULES.md), and [release governance](docs/RELEASE_GOVERNANCE.md).

# @fm/ratan-design

Production design foundation for the two-layer portal. Applications consume this package at build time and create a local provider for each React root. It is never a Module Federation remote and does not provide domain workflows.

## Public API

- `DesignSystemProvider` — local MUI/Emotion provider for resolved scheme, density, and direction
- `Button` — primary, secondary, danger, and ghost actions
- `TextField` — accessible controlled text input
- `StatusBadge` — ready, review, blocked, and neutral semantics
- `semanticTokens` — typed semantic token metadata
- `@fm/ratan-design/styles.css` — generated scoped token stylesheet

```tsx
import {
  Button,
  DesignSystemProvider,
  StatusBadge,
  TextField,
} from '@fm/ratan-design';

<DesignSystemProvider
  appearance={{ scheme: 'dark', density: 'compact', direction: 'ltr' }}
  scope="application"
>
  <TextField id="filter" label="Filter" value={filter} onChange={setFilter} />
  <StatusBadge status="ready">Ready</StatusBadge>
  <Button>Submit</Button>
</DesignSystemProvider>;
```

Consumers must install compatible React 18, MUI 5, and Emotion peers. MUI is an implementation detail: do not infer public behavior from generated classes and do not import internal package paths.

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

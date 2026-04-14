# ratan-fdc3-resolver-ui — Architecture

## Tech Stack

- TypeScript, React
- Emotion CSS-in-JS
- MUI (Material UI)
- tsup (ESM + CJS + DTS)
- Vitest + happy-dom

## Directory Structure

```
src/
  ResolverDialog.tsx          Main modal component
  AppCard.tsx                 Target selector card
  ContextPreview.tsx          JSON context display
  styles.ts                   Centralised Emotion styles
  types.ts                    Shared TypeScript types
  useResolverKeyboard.ts      Keyboard navigation hook
  lazy.tsx                    Lazy-loading utilities
  ResolverErrorBoundary.ts    Error boundary (alias for broker's ErrorBoundary)
```

## Component Architecture

```
ResolverDialog
  ├── ContextPreview       Displays JSON of the context being sent
  └── AppCard (× N)        One per resolving app, selectable via click or keyboard
```

- `ResolverDialog` renders `ContextPreview` + a list of `AppCard` components.
- Keyboard navigation is handled by `useResolverKeyboard` (Arrow, Home, End, Enter, Escape).
- Full ARIA compliance: `role="dialog"`, `aria-modal`, `aria-labelledby`.

## Lazy Loading

| Utility                | Returns                            |
| ---------------------- | ---------------------------------- |
| `lazyResolverDialog()` | `React.lazy` → `ResolverDialog`    |
| `lazyAppCard()`        | `React.lazy` → `AppCard`           |
| `lazyContextPreview()` | `React.lazy` → `ContextPreview`    |
| `ResolverSuspense`     | `<Suspense>` wrapper with fallback |
| `preloadResolver()`    | Triggers preloading of all chunks  |

## Build

- **Bundler:** tsup
- **Outputs:** ESM, CJS, DTS
- **Externals:** react, react-dom, @finos/fdc3, @mui/material, @emotion/react, @emotion/styled

## Testing

- **Runner:** Vitest (happy-dom)
- **Test files:** AppCard.test.tsx, ResolverDialog.test.tsx

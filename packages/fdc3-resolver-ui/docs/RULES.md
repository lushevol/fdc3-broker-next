# ratan-fdc3-resolver-ui — Rules

> Parent: [Monorepo rules](../../../docs/rules.md) · [AGENTS.md](../../../AGENTS.md)

## Accessibility

- All components must maintain **WCAG 2.1 AA** compliance.
- Use ARIA roles, labels, and keyboard navigation via `useResolverKeyboard`.

## Lazy Loading

- Prefer `lazyResolverDialog` / `lazyAppCard` / `lazyContextPreview` over direct imports to reduce initial bundle size.

## Styles

- All styles are defined in `src/styles.ts` using Emotion `css` template literals. No inline styles.

## Error Boundary

- Use `ResolverErrorBoundary` (alias for broker's `ErrorBoundary` with a default theme).

## ResolverTarget

- Always provide `ResolverTarget` objects with `appId`, `metadata` (`AppMetadata`), and optional `instanceId` and `currentContext`.

# @fm/ratan-design — Architecture

## Runtime position

The package is bundled independently into each deployable. Runtime composition remains `host -> application`; design-system code is not a third runtime layer. Separate roots communicate appearance through `@fm/platform-contracts`, then construct local providers.

## Structure

```text
src/
├── index.ts                         documented public surface
├── provider.tsx                    local MUI theme/provider adapter
├── components/
│   ├── Button.tsx
│   ├── TextField.tsx
│   └── StatusBadge.tsx
├── foundation/
│   ├── tokens.ts                   authoritative typed semantics
│   └── generate-token-css.ts       deterministic pure generator
└── generated/tokens.css            checked-in scoped artifact
```

## Token flow

`semanticTokens` is the source of truth. `generateTokenCss()` converts camel-case semantic roles to scoped `--ratan-*` variables. `createRatanTheme()` privately adapts the same values to MUI. Drift tests prevent the checked-in CSS and TypeScript values from diverging.

## Provider boundary

`DesignSystemProvider` accepts only resolved scheme, density, and direction. It sets attributes on its own `.ratan-design-root` and does not mutate `documentElement`. Updating appearance rerenders the provider without remounting consumer state.

## Build and verification

Tsup emits ESM, declarations, and `index.css`. React, ReactDOM, MUI, and Emotion are external peers. Vitest/Testing Library verify behavior and >90% coverage. A dependency test scans manifests and source imports for prohibited runtime/domain dependencies.

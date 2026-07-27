# @fm/ratan-design — Architecture

## Runtime position

The package is bundled independently into each deployable. Runtime composition remains `host -> application`; design-system code is not a third runtime layer. Separate roots communicate appearance through `@fm/platform-contracts`, then construct local providers.

## Structure

```text
src/
├── index.ts                         documented public surface
├── provider.tsx                    local appearance and overlay-container adapter
├── components.css                 scoped component styling
├── components/
│   ├── Button.tsx
│   ├── TextField.tsx
│   ├── NumberField.tsx
│   ├── StatusBadge.tsx
│   ├── Dialog.tsx
│   ├── ConfirmationDialog.tsx
│   └── InlineAlert.tsx
├── foundation/
│   ├── tokens.ts                   authoritative typed semantics
│   └── generate-token-css.ts       deterministic pure generator
└── generated/tokens.css            checked-in scoped artifact
```

## Token flow

`semanticTokens` is the source of truth. `generateTokenCss()` converts camel-case semantic roles to scoped `--ratan-*` variables. Components consume those variables through static CSS and React Aria state attributes. Drift tests prevent the checked-in CSS and TypeScript values from diverging.

## Provider boundary

`DesignSystemProvider` accepts resolved scheme, density, direction, and an optional local overlay container. It sets attributes on its own `.ratan-design-root` and does not mutate `documentElement`. Updating appearance rerenders the provider without remounting consumer state.

## Interaction boundary

Interaction components adapt private React Aria behavior behind domain-neutral props. Dialog state remains in the consuming application; local portals do not create another federation/runtime layer. Inline feedback renders where composed and has no singleton manager. Numeric controls emit raw controlled values and never format domain currency.

## Build and verification

Tsup emits ESM, declarations, and `index.css`. React and ReactDOM are external peers. Vitest/Testing Library verify behavior and >90% coverage. A dependency test scans manifests and source imports for MUI, Emotion, and prohibited runtime/domain dependencies.

# @fm/ratan-design — Rules

## Public API

- Export documented APIs only from `src/index.ts`.
- Never export raw MUI components, MUI theme providers, `sx`, Emotion internals, or internal source paths.
- Components are domain-neutral and must not import application or Ratan domain models.
- Every new component requires behavior/accessibility tests and Storybook coverage.

## Tokens and styling

- Use semantic roles from `src/foundation/tokens.ts`; component literals for color, spacing, typography, radius, or focus are prohibited.
- All custom properties use the `--ratan-*` prefix and are scoped to `.ratan-design-root`.
- Do not add document-global theme selectors or depend on generated Emotion class names across roots.
- Light/dark and compact/comfortable behavior must be tested together.

## Dependencies

- React, ReactDOM, MUI, and Emotion remain peers and are externalized from the library build.
- Ant Design, AG Grid, federation runtimes/loaders, and Ratan domain packages are forbidden.
- Applications—not this package—configure Module Federation.

## Compatibility

- Design-package semver does not decide runtime compatibility. Applications and hosts negotiate `@fm/platform-contracts` application/appearance versions.
- Removing/renaming an export or token, or changing semantic meaning, requires a major release.
- Additive optional APIs are minor; compatible fixes are patch releases.

## Required checks

Run test with coverage, build/declarations, lint, dependency boundary tests, generated-token drift, and packed-consumer verification before promotion.

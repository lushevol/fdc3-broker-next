# @fm/ratan-design — Rules

## Public API

- Export documented APIs only from `src/index.ts`.
- Never export raw React Aria components, MUI components, theme providers, `sx`, styling-engine internals, or internal source paths.
- Components are domain-neutral and must not import application or Ratan domain models.
- Every new component requires behavior/accessibility tests and Storybook coverage.
- Dialogs and feedback must remain application-composed; never add global overlay state, toast queues, or cross-MFE event buses.
- Authorization, maker/checker policy, repositories, and mutation lifecycle are application/domain responsibilities.

## Tokens and styling

- Use semantic roles from `src/foundation/tokens.ts`; component literals for color, spacing, typography, radius, or focus are prohibited.
- All custom properties use the `--ratan-*` prefix and are scoped to `.ratan-design-root`.
- Do not add document-global theme selectors or depend on generated library class names across roots.
- Light/dark and compact/comfortable behavior must be tested together.

## Dependencies

- React and ReactDOM remain peers and are externalized from the library build.
- React Aria Components and internationalized date utilities are approved implementation dependencies.
- MUI, Emotion, Ant Design, AG Grid, federation runtimes/loaders, and Ratan domain packages are forbidden.
- Applications—not this package—configure Module Federation.

## Compatibility

- Design-package semver does not decide runtime compatibility. Applications and hosts negotiate `@fm/platform-contracts` application/appearance versions.
- Removing/renaming an export or token, or changing semantic meaning, requires a major release.
- Additive optional APIs are minor; compatible fixes are patch releases.

## Required checks

Run test with coverage, build/declarations, lint, dependency boundary tests, generated-token drift, and packed-consumer verification before promotion.

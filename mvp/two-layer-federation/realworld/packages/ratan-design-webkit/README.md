# @fm/ratan-design-webkit

Status: active shared UI package for the Realworld Portal Host applications.
Last verified 3 August 2026.

Pure Ratan WebKit component catalog. The package contains the imported Lit
components and their registration modules, with no dependency on the legacy
`@fm/ratan-design` package.

## Public boundaries

- `@fm/ratan-design-webkit` exports component classes from `src/components`.
- `@fm/ratan-design-webkit/elements` registers the `sc-*` custom elements.
- `@fm/ratan-design-webkit/react` exports the existing React wrapper factory.

React consumers create thin adapters with the wrapper; UI implementations stay
in `src/components`:

```tsx
import { createComponent } from '@fm/ratan-design-webkit/react';

const ScButton = createComponent('sc-button');
```

The wrapper loads the WebKit registration modules and the nested Shoelace
definitions required by the catalog. Registration is guarded and idempotent.
Applications must not import a scoped-custom-element-registry polyfill.

The package root intentionally contains no React component implementations,
provider, or standalone stylesheet.

## Native element rules

- Reusable behavior and presentation live under `src/components`.
- `elements/` contains registration modules only; every definition checks the
  global registry before defining a tag.
- React integration stays in `src/wrapper/ReactWrapper.ts`.
- Do not add root-level `react-components`, provider, dialog, divider, or
  status-badge implementations.
- Do not import `@fm/ratan-design` or copy its runtime into this package.
- Add missing icons to the WebKit icon library as dependency-free SVG data
  assets when an upstream icon is unavailable.

The current generated fallback set includes close, notification, edit, trash,
and person icons. `ScAvatar` renders slotted initials dynamically and supplies
an accessible blue/white fallback when consumer tokens are absent.

## Consumer verification

After changing registrations, wrappers, icons, dialogs, or avatar behavior,
build WebKit first, then build each consumer. Do not build consumers in parallel
with WebKit's clean build because the package output is temporarily removed.
Complete the live Chrome matrix in
[`../../docs/VERIFICATION.md`](../../docs/VERIFICATION.md).

## Commands

```bash
npm --workspace @fm/ratan-design-webkit test
npm --workspace @fm/ratan-design-webkit run lint
npm --workspace @fm/ratan-design-webkit run build
```

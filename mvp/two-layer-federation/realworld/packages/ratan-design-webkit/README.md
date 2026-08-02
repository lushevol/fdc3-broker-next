# @fm/ratan-design-webkit

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
import '@webcomponents/scoped-custom-element-registry';
import { createComponent } from '@fm/ratan-design-webkit/react';

const ScButton = createComponent('sc-button');
```

The scoped custom-element registry polyfill must be the application bootstrap's
first import, as required by `@open-wc/scoped-elements`.

The package root intentionally contains no React component implementations,
provider, or standalone stylesheet.

## Commands

```bash
npm --workspace @fm/ratan-design-webkit test
npm --workspace @fm/ratan-design-webkit run lint
npm --workspace @fm/ratan-design-webkit run build
```

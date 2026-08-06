# Button contract

## Frozen source

- Baseline: `@scdevkit/webkit@2.0.5` at `a8398ea6df30e4843e22fcb5a1d3343107463c60`.
- Legacy element: `sc-button`.
- React exports: `Button` from the root and `@fm/ratan-design/button`.
- Interaction foundation: React Aria Button through the private foundation adapter.

## Public API

`variant` is `primary | secondary | text | link`, `tone` is
`default | error | alert | success`, and `size` is
`xxs | xs | sm | md | lg`. Defaults are `variant="primary"`,
`tone="default"`, `size="sm"`, `pill={true}`, `border={true}`, and native
`type="button"`.

The API also preserves `width`, `startIcon`, `endIcon`, `compact`, `snack`,
`truncate`, `readOnly`, selection state, `fill`, `inverse`, and `iconButton`.
Native button attributes and refs are forwarded. Controlled selection never mutates
the supplied value; uncontrolled selection starts from `defaultSelected`.

## Native form behavior

The safe default does not submit its owner form. Explicit `type="submit"` and
`type="reset"` retain native submission and reset behavior. Disabled buttons are
excluded by the platform and cannot activate.

## Loading accessibility correction

While `loading`, the same button remains mounted and focusable, reports
`aria-disabled`, prevents repeat activation, retains its label and layout, and
shows a progress indicator. A sibling polite live region announces
`loadingLabel`, defaulting to the English catalogue message `Loading`. Consumers
localize the announcement by supplying `loadingLabel`; no provider or shared
locale runtime is required. The live region is outside the button's accessible
name computation.

This approved correction is recorded as `button-loading-announcement` in the
deviation manifest and is required by dedicated contract and Axe tests.

## Evidence gates

- Manifest arrays and defaults exactly match the exported runtime constants.
- Pointer and keyboard activation use React Aria press semantics.
- Loading, read-only, and disabled states block activation without focus loss.
- Native submit/reset behavior, ref forwarding, controlled/uncontrolled selection,
  accessible loading announcements, and automated Axe checks pass.

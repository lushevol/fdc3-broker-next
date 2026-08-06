# Dialog contract

## Frozen source and scope

- Baseline: `sc-dialog` from `@scdevkit/webkit@2.0.5` at
  `a8398ea6df30e4843e22fcb5a1d3343107463c60`.
- React exports: root `Dialog` and `@fm/ratan-design/dialog`.
- Frozen defaults: `open={false}` and an empty label.
- Slot mappings: `children`, `label`, and `footer`.

This proof component covers the simple frozen Dialog catalogue entry. The larger
legacy `sc-modal` surface remains a separate `Modal` contract and is not silently
collapsed into Dialog.

## React API

`open`/`onOpenChange` is controlled and `defaultOpen` is uncontrolled. Change
callbacks receive a Ratan-owned detail with `reason` equal to `dismiss`,
`close-button`, or `programmatic`. `onShow` and `onHide` preserve the frozen
lifecycle callbacks with the same detail. A forwarded ref resolves to the dialog
section. `label`, `footer`, `children`, `closeLabel`, `showCloseButton`,
`isDismissable`, and `isKeyboardDismissDisabled` provide convenience composition.

The implementation uses React Aria ModalOverlay, Modal, Dialog, Heading, and
Button adapters. React Aria types, state, DOM conventions, and dismissal events
remain private.

## Overlay lifecycle

- The overlay portals to `document.body`; custom portal containers are not public.
- Outside interaction dismisses by default, and Escape dismisses unless disabled.
- Modal focus is contained and restored to the logical trigger after close.
- Nested dialogs respect React Aria's overlay stack.
- Unmount removes every Dialog-owned overlay/backdrop node and React Aria handles
  listener and scroll-lock cleanup.
- Controlled dismissal reports intent without mutating the supplied `open` value.

## Accessibility and styling

The dialog has an accessible name, close action, modal semantics, and keyboard
operation. Static scoped CSS resolves frozen `--sc-modal-*` and `--sc-*` values,
uses stable `data-ratan-component` states, and honors reduced motion. Contract,
focus, dismissal, nesting, cleanup, Axe, manifest, and CSS-token tests are required.

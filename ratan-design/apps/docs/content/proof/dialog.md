# Dialog

## Purpose
Present modal tasks and alerts in a document-body portal with deterministic focus restoration.

## Guidance
Use a visible `label`; reserve `alertdialog` for decisions requiring immediate attention. Document-global theme/mode applies to all overlays.

## API
Controlled/uncontrolled open state, dismiss policies, close button, footer, lifecycle callbacks with reasons, native attributes, and refs are supported. See `dialogExample`.

## Tokens
Consumes frozen dialog/modal backgrounds, borders, shadows, spacing, typography, overlay, and focus tokens.

## WebKit mapping
`sc-dialog`/`sc-modal` open properties and show/hide events map to `open`, `onOpenChange`, `onShow`, and `onHide`; slots map to React composition.

## Deviations
React Aria modality, nested focus scopes, escape/outside dismissal, aria hiding, and restoration correct known legacy focus defects.

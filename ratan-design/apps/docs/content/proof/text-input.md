# TextInput

## Purpose
Collect single-line or multiline text with frozen labels, hints, validation, sizes, and border styles.

## Guidance
Prefer controlled state when application validation owns the value; uncontrolled state participates in native reset. Associate visible errors through `errorMessage`.

## API
Supports controlled/uncontrolled values, `line | box`, all seven frozen sizes, label/tooltip/hint placement, validation states, textarea mode, native form attributes, and refs. See `textInputExample`.

## Tokens
Consumes `--sc-form-input-*`, label, typography, color, spacing, validation, and focus tokens.

## WebKit mapping
`sc-text-input` properties map to native React props; `sc-input` maps to `onValueChange` and `sc-change` maps to `onChange` where applicable.

## Deviations
React Aria provides corrected field relationships and keyboard semantics; approved differences are linked in `parity-manifest.json`.

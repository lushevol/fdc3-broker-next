# TextInput contract

## Frozen source and foundation

- Baseline: `sc-text-input` from `@scdevkit/webkit@2.0.5` at
  `a8398ea6df30e4843e22fcb5a1d3343107463c60`.
- React exports: root `TextInput` and `@fm/ratan-design/text-input`.
- Interaction foundation: React Aria `TextField`, `Input`, `TextArea`, `Label`,
  `Text`, `FieldError`, and Button through private adapters.

## Variants and defaults

`borderType` supports `line | box`. `size` accepts the complete frozen
`xxs | xs | sm | md | lg | xl | xxl` set. As in WebKit, `sm` and `lg` have
special control geometry; the other accepted text sizes retain the default
control geometry while affecting inherited label/icon composition where used.

Observed defaults include `type="text"`, `borderType="box"`, `size="md"`,
`labelPosition="top"`, `labelAlignment="left"`, `textAlign="left"`,
`tooltipPlacement="top"`, `hintPlacement="right"`, `labelSize="md"`,
`placeholder="Input here"`, and an empty value. Boolean state defaults are
false, and `readOnlyRows` defaults to 5.

## State and callbacks

`value`/`onValueChange` is controlled; `defaultValue` is uncontrolled.
`onValueChange` maps `sc-input`, `onBubbleInput` maps `sc-bubble-input`, and
`onClear` maps `sc-clear`. Native focus, blur, pointer, input, and change props
remain available. Slot mappings use React composition props for labels,
adornments, help, errors, success content, and custom controls.

Stable root/control attributes expose border type, size, alignment, invalid,
success, disabled, read-only, multiline resize, truncation, and trustpoint state.
Styles resolve only frozen `--sc-*` tokens.

## Native forms and accessibility

Named controls submit their current value. Disabled controls are excluded;
read-only controls remain successful form controls. Required constraints use the
native validity API. An uncontrolled form reset restores `defaultValue`, while a
controlled value remains application-owned. Labels, descriptions, errors, and
required/invalid state use React Aria relationships. Clear actions restore input
focus. Each contract fixture must pass Axe.

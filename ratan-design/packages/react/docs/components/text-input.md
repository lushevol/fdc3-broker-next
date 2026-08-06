# TextInput contract

`TextInput` is the React mapping for the frozen `sc-text-input` contract in
`@scdevkit/webkit@2.0.5`.

## Native control and value model

- Render an `<input>` by default and a `<textarea>` when `multiline` is true.
- Forward a ref to the rendered native control.
- Support controlled `value` and uncontrolled `defaultValue` without changing
  controlled state internally.
- Default `type` to `text`, `placeholder` to `Input here`, `borderType` to
  `box`, `size` to `md`, `textAlign` to `left`, and `readOnlyRows` to `5`.
- Preserve native form participation, validation, focus, disabled, read-only,
  name, autocomplete, and submission behavior.
- Clamp string values to `maxLength`, matching the observed WebKit watcher.

## Interaction callbacks

- `onValueChange(value, event)` maps `sc-input`.
- `onBubbleInput(value, event)` maps `sc-bubble-input`; the native input event
  continues to bubble normally.
- Native `onFocus`, `onBlur`, `onMouseOver`, and `onMouseLeave` map the
  corresponding legacy events without wrapping their event types.
- `onClear(event)` maps `sc-clear`. Clearing follows controlled/uncontrolled
  state rules and returns focus to the native control.

## Composition and presentation

- `label`, `labelTooltip`, `labelHint`, `prefix`, `suffix`, `errorIcon`,
  `formControl`, `help`, `errorContent`, and `successContent` replace the
  corresponding legacy slots. `children` is accepted as the label fallback.
- Legacy `prefixIcon`, `suffixIcon`, and `suffixLabel` remain convenience props.
- Support line/box borders, sm/md/lg sizes, all observed label positions,
  left/right text alignment, multiline rows, fixed/vertical/auto resizing,
  clearable state, help/error/success messages, character count, and read-only
  line clamping.
- Use only frozen `--sc-*` public tokens. Internal state is expressed through
  stable `data-*` attributes.

## Intentional corrections

- Labels use native `htmlFor`/`id` association instead of duplicated ARIA
  references.
- Error/help text IDs are unique per instance and are attached to the native
  control through `aria-describedby` and `aria-errormessage`.
- Read-only controls remain native controls so selection, form semantics, and
  assistive-technology behavior are preserved.
- Internal Lit helpers are not exposed through an imperative React handle.

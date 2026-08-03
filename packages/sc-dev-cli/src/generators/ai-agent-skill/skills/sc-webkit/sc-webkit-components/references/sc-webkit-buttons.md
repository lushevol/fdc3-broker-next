# @scdevkit/webkit — Buttons & Actions

> Auto-generated reference. Use for component APIs: attributes, slots, events, and usage variants.

## `sc-button-group` — Components/Button Group

Use Button Group component to combines a set of buttons that have similar or related functionality.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `array` | — | The value of the button group. |
| `size` | `string` | `md` | The preferrred button group size. Options: `sm`, `md`, `lg`. |
| `single-select` | `boolean` | `false` | Makes the button group single or multiple select. |
| `enable-deselect` | `boolean` | `false` | Enables deselection in single-select mode. |
| `success` | — | — |  |
| `success-message` | — | — |  |
| `slot[name='success']` | — | — |  |

### Events

| Event | Description |
| --- | --- |
| `sc-select` | Emitted when selected items are changed. Get the index by event.detail.index and        get the value by event.detail.value and get the interacted element by event.detail.target |

### Stories

- `Default`
- `SingleSelect`
- `Readonly`
- `ItemDisabled`
- `Disabled`
- `Error`

## `sc-button` — Components/Button/Button

Buttons represent actions that are available to the user.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `string` | `primary` | Sets the button type. Options: `primary`, `secondary`, `text`, `link`. |
| `state` | `string` | `default` | Sets the button state. Options: `default`, `error`, `alert`, `success`. |
| `size` | `string` | `md` | Sets the button size. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `width` | `string` | `auto` | Customize button width. |
| `left-icon` | `string` | — | Set the left icon name if need to show icon on button. |
| `right-icon` | `string` | — | Set the right icon name if need to show icon on button. |
| `no-pill` | `boolean` | `false` | Sets if not round border. |
| `no-border` | `boolean` | `false` | Sets to show no border. |
| `compact` | `boolean` | `false` | Sets to show no padding. |
| `loading` | `boolean` | `false` | Sets if show spinner on button. |
| `disabled` | `boolean` | `false` | Sets disabled attribute. |
| `selectable` | `boolean|string` | `false` | Enable selected visual indicator. `selected` will be true when clicked or toggled. Options: `false`, `true`, `toggle`. |
| `selected` | `boolean` | `false` | Visual indicator that the button has already been clicked. Can be reset by toggle or removing attribute |

### Slots

| Slot | Description |
| --- | --- |
| `loading` | Sets to customize the label. |
| `(default)` | Button text |

### Stories

- `Primary`
- `SecondaryButton`
- `TextButton`
- `LinkButton`
- `Loading`
- `LoadingWithIcons`
- `PrimaryErrorWithIcon`
- `NotPill`
- `NoBorder`
- `SelectableButton`

## `sc-copy` — Components/Copy

Copies text data to the clipboard when the user clicks the trigger.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `string` | `default` | The preferred mode of the copy button. Options: `default`, `text`. |
| `tooltip-placement` | `string` | `top` | The preferred placement of the tooltip. Options: `top`, `bottom`, `left`, `right`. |
| `help-text` | `string` | — | A custom message to show in the tooltip. |
| `label` | `string` | — | Label to show on screen. |
| `value` | `string` | — | The text value to copy. |
| `disabled` | `boolean` | `false` | Disables the copy button. |
| `success-message` | `string` | — | A custom message to show after copying. |
| `error-message` | `string` | — | A custom message to show when a copy error occurs. |
| `feedback-duration` | `number` | `1000` | The length of time (milliseconds) to show feedback before restoring the default trigger. |
| `from` | `string` | — | An id that references an element in the same document from which data will be copied. If both this and value are present, this value will take precedence. To copy an attribute, append the attribute name wrapped in square brackets, e.g. from="el[value]". To copy a property, append a dot and the property name, e.g. from="el.value" |

### Slots

| Slot | Description |
| --- | --- |
| `help-text` | Sets to customize the tooltip help text. |
| `label` | Sets to customize the copy icon or label. |
| `copy-success` | Sets to customize the copy success icon. |
| `copy-error` | Sets to customize the copy error icon. |

### Stories

- `Default`
- `Error`
- `Disabled`
- `CustomMessage`
- `TextDefault`
- `TextError`
- `TextDisabled`
- `TextCustomMessage`

## `sc-icon-button` — Components/Button/Icon Button

Icon button represent actions that are available to the user.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `string` | `primary` | Sets the button type. Options: `primary`, `secondary`, `text`, `link`. |
| `state` | `string` | `default` | Sets the button state. Options: `default`, `error`. |
| `size` | `string` | `sm` | Sets the button size. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `name` | `string` | — | The name of the icon. |
| `no-pill` | `boolean` | `false` | Sets if not round border. |
| `disabled` | `boolean` | `false` | Sets disabled attribute. |

### Stories

- `Primary`
- `PrimaryError`
- `Secondary`
- `SecondaryError`
- `Text`
- `Link`


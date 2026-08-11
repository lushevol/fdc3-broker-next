# @scdevkit/webkit — Overlays & Feedback

> Auto-generated reference. Use for component APIs: attributes, slots, events, and usage variants.

## `sc-action-sheet` — Components/Sheet/Action Sheet

Action sheet slide in from a container to expose additional options and information.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | The label of action sheet. |
| `primary-action` | `string` | — | The preferred name of the primary action. |
| `primary-action-label` | `string` | — | The preferred label of the primary action. |
| `secondary-action` | `string` | — | The preferred name of the secondary action. |
| `secondary-action-label` | `string` | — | The preferred label of the secondary action. |
| `other-action` | `string` | — | The preferred name of the other action. |
| `other-action-label` | `string` | — | The preferred label of the primary action. |
| `height` | `string` | `auto` | Sets to customize the action sheet height. |
| `open` | `boolean` | `false` | Set to open and show action sheet. |
| `contained` | `boolean` | `false` | By default, the action sheet slides out of its containing block (usually the viewport).          To make the action sheet slide out of its parent element,          set this attribute and add position: relative to the parent. |
| `no-header` | `boolean` | `false` | Set to hide header on action sheet. Set this to true will remove label and close icon |
| `no-close-icon` | `boolean` | `false` | Set to hide close icon on action sheet. |
| `disable-outside-click` | `boolean` | `false` | Set to disable user to close the action sheet by clicking outside the action sheet. |

### Slots

| Slot | Description |
| --- | --- |
| `label` | Sets to customize the label. |
| `(default)` | Sets to customize content. |

### Events

| Event | Description |
| --- | --- |
| `sc-show` | Emitted when the action sheet opens. Get the state by event.detail.open. |
| `sc-hide` | Emitted when the action sheet closes. Get the state by event.detail.open. |
| `sc-action` | Emitted when click the action button. Get the action name by event.detail.name. |

### Stories

- `Default`
- `Actions`
- `CustomHeight`
- `NoCloseIcon`
- `PreventCloseOutside`

## `sc-alert` — Components/Alert

Alerts are used to display important messages and expand to show additional content.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `string` | `info` | Sets the preferred alert type. Options: `default`, `info`, `success`, `warning`, `error`. |
| `mode` | `string` | `default` | Sets the preferred alert mode. Options: `default`, `banner`. |
| `title` | `string` | — | Sets the alert title. |
| `expand` | `boolean` | `false` | Sets to control if the alert can be expand. |
| `closable` | `boolean` | `false` | Sets to control if the alert can closed. |
| `open` | `boolean` | `true` | Sets to show the alert. |
| `icon` | `boolean` | `false` | Set to show the icon for the alert. |
| `full-width` | `boolean` | `false` | Set to show the full-width for the alert. |

### Slots

| Slot | Description |
| --- | --- |
| `icon` | Sets to customize the icon of alert. |
| `title` | Sets to customize the title of alert. |
| `(default)` | Sets to customize content. |

### Stories

- `Default`
- `Info`
- `Success`
- `Warning`
- `Error`
- `Transparent`
- `Closable`
- `Collapsible`
- `HTMLContent`
- `CustomIcon`

## `sc-banner` — Components/Banner

Banner is used to display information to the user along with some visual illustration.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Sets to change the banner title. |
| `body` | `string` | — | Sets to change the banner body. |
| `title-size` | `string` | `lg` | The preferrred title size Options: `xxs`, `xs`, `sm`, `md`, `lg`, `xl`. |
| `body-size` | `string` | `xs` | The preferrred body size Options: `xxs`, `xs`, `sm`, `md`, `lg`, `xl`. |
| `space-size` | `string` | `md` | Sets to change the banner spacing. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `background-color` | `string` | `gradient-blue` | Sets to change the banner background color. Options: `gradient-blue`, `dark-blue`, `alt-blue`, `light-blue`, `white`. |
| `text-alignment` | `string` | `left` | The preferred alignment of the title and description. Options: `left`, `center`, `right`, `justify`. |
| `image-src` | `string` | — | Sets to show a image at the right of banner. |
| `image-position` | `string` | `right` | Sets to show the image at the right or left of banner. Options: `left`, `right`. |
| `closable` | `boolean` | `false` | Set to allow the banner to be closable. |
| `trustpoint` | `boolean` | `false` | Sets to show the title with trustpoint style. |

### Slots

| Slot | Description |
| --- | --- |
| `title` | Sets to customize the title. |
| `body` | Sets to customize the description. |

### Stories

- `Default`
- `Closable`
- `WithoutImage`

## `sc-bottom-sheet` — Components/Sheet/Bottom Sheet

Bottom sheet slide in from bottom to expose additional options and information.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | The label of bottom sheet. |
| `height` | `string` | `auto` | Sets to customize the bottom sheet height. |
| `open` | `boolean` | `false` | Set to open and show bottom sheet. |
| `expandable` | `boolean` | `false` | Sets to allow user to expand the bottom sheet to full height. |
| `expand-height` | `string` | `auto` | Sets the bottom sheet initial height when expandable is enabled.          Value is based on viewport`s height (vh) |
| `no-header` | `boolean` | `false` | Set to hide header on bottom sheet. Set this to true will remove label and close icon |
| `no-close-icon` | `boolean` | `false` | Set to hide close icon on bottom sheet. |
| `disable-outside-click` | `boolean` | `false` | Set to disable user to close the bottom sheet by clicking outside the bottom sheet. |

### Slots

| Slot | Description |
| --- | --- |
| `label` | Sets to customize the label. |
| `(default)` | Sets to customize content. |

### Events

| Event | Description |
| --- | --- |
| `sc-show` | Emitted when the bottom sheet opens. Get the state by event.detail.open. |
| `sc-hide` | Emitted when the bottom sheet closes. Get the state by event.detail.open. |

### Stories

- `Default`
- `CustomHeight`
- `Expandable`
- `NoCloseIcon`
- `PreventCloseOutside`

## `sc-draggable-side` — Components/Sheet/Draggable Side Sheet

Draggable draggable side sheet slide in from a container to expose additional options and information.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | The label of the draggable side sheet. |
| `size` | `string` | `xs` | Sets the preferred size of the draggable side sheet. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `width` | `string` | — | Customize the width of the draggable side sheet. If specified, size will be ignored. |
| `fixed` | `boolean` | `false` | By default, the draggable side sheet take part of the container's width,        this attribute will make it fixed in the container and will not take any width. |
| `no-header` | `boolean` | `false` | Set to hide header on action sheet. Set this to true will remove label and close icon |

### Slots

| Slot | Description |
| --- | --- |
| `label` | Sets to customize the label. |
| `(default)` | Sets to customize content. |

### Events

| Event | Description |
| --- | --- |
| `sc-hide` | Emitted when dragging. Get the width by event.detail.width. |

### Stories

- `Default`
- `CustomWidth`
- `Fixed`

## `sc-modal` — Components/Modal

Modal appear above the page and require the user’s immediate attention.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `header` | `string` | — | The header of the modal. |
| `title` | `string` | — | The title of the modal. |
| `size` | `string` | `md` | The preferred size of the modal. Options: `sm`, `md`, `lg`. |
| `expanded-view` | `boolean` | `false` | Set to expand the modal. |
| `color` | `string` | `default` | The preferred color of the modal. Options: `default`, `blue`, `green`, `amber`, `red`. |
| `icon` | `boolean` | `true` | Set to show the icon in front of the header. |
| `no-header` | `boolean` | `false` | Sets to hide the header. Set this to true will remove header and close icon. |
| `no-close-icon` | `boolean` | `false` | Sets to hide the close icon. |
| `no-padding` | `boolean` | `false` | Sets to remove all padding within the modal. |
| `open` | `boolean` | `false` | Sets to open and show modal. |
| `no-footer` | `boolean` | `false` | Set to hide the footer. |
| `footer-type` | `string` | `button` | Type of footer to display. Options: `button`, `pagination`, `alternative`. |
| `pagination-total` | `number` | `100` | Total number of items for pagination. |
| `pagination-label` | `boolean` | `false` | Sets to show pagination label. |
| `pagination-page-size` | `number` | `10` | Number of items per page for pagination. |
| `pagination-size-changer` | `boolean` | `false` | Sets to show pagination size changer. |
| `pagination-current-page` | `number` | `1` | Current page number for pagination. |
| `pagination-disabled-pages` | `number[]` | — | Array of disabled page numbers for pagination. |
| `pagination-jump-first-last-page` | `boolean` | `true` | Sets to show jump to first/last page buttons in pagination. |
| `button-state-secondary` | `string` | `default` | The preferred state of the secondary button. Options: `default`, `error`. |
| `button-no-pill` | `boolean` | `false` | Sets to show buttons with no pill shape. |
| `button-disable-primary` | `boolean` | `false` | Set to show primary button in the disabled state. |
| `button-loading-primary` | `boolean` | `false` | Set to show primary button in the loading state. |
| `button-disable-secondary` | `boolean` | `false` | Set to show secondary button in the disable state. |
| `button-loading-secondary` | `boolean` | `false` | Set to show secondary button in the loading state. |
| `button-text-primary` | `string` | — | Text of the primary button. |
| `button-text-secondary` | `string` | — | Text of the secondary button. |
| `button-text-tertiary` | `string` | — | Text of the tertiary button. |
| `button-text-left` | `string` | — | Text of the left button. |
| `disable-outside-click` | `boolean` | `false` | Disables closing the modal by clicking outside of it. |

### Slots

| Slot | Description |
| --- | --- |
| `header` | Sets to customize the header. |
| `title` | Sets to customize the title. |
| `header-actions` | Sets to customize header actions. |
| `icon` | Set to customize icon. |
| `footer-button` | Set to customize icon. |
| `footer-left` | Set to customize icon. |
| `alternative-footer` | Set to customize icon. |
| `(default)` | Sets to customize content. |

### Events

| Event | Description |
| --- | --- |
| `sc-show` | Emitted when the modal opens. Get the model state by event.detail.open. |
| `sc-hide` | Emitted when the modal closes. Get the model state by event.detail.open. |
| `sc-action` | Emitted when the modal actions are triggered. Get the model action by event.detail.type. |

### Stories

- `Default`
- `NoCloseIcon`
- `PreventCloseOutside`
- `NoHeader`

## `sc-side-sheet` — Components/Sheet/Side Sheet

Side sheet slide in from a container to expose additional options and information.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | The label of the side sheet. |
| `size` | `string` | `xs` | Sets the preferred size of the side sheet. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `width` | `string` | — | Customize the width of the side sheet. If specified, size will be ignored. |
| `position` | `string` | `right` | Sets the position of the side sheet. Options: `top`, `bottom`, `left`, `right`. |
| `open` | `boolean` | `false` | Set to open and show side sheet. |
| `contained` | `boolean` | `false` | By default, the side sheet slides out of its containing block (usually the viewport).        To make the side sheet slide out of its parent element,        set this attribute and add position: relative to the parent. |
| `no-header` | `boolean` | `false` | Set to hide header on action sheet. Set this to true will remove label and close icon |
| `no-close-icon` | `boolean` | `false` | Set to hide close icon on action sheet. |
| `no-header-bottom-border` | `boolean` | `false` | Set to show header border on side sheet. Set this to true will remove header border |
| `disable-outside-click` | `boolean` | `false` | Set to disable user to close the action sheet by clicking outside the side sheet. |
| `no-footer` | `boolean` | `true` | Set to show footer on side sheet. Set this to true will remove footer |
| `no-footer-top-border` | `boolean` | `false` | Set to show footer border on side sheet. Set this to true will remove footer border |
| `primary-action` | `string` | — | The preferred name of the primary action. |
| `primary-action-label` | `string` | — | The preferred label of the primary action. |
| `secondary-action` | `string` | — | The preferred name of the secondary action. |
| `secondary-action-label` | `string` | — | The preferred label of the secondary action. |
| `other-action` | `string` | — | The preferred name of the other action. |
| `other-action-label` | `string` | — | The preferred label of the primary action. |

### Slots

| Slot | Description |
| --- | --- |
| `label` | Sets to customize the label. |
| `(default)` | Sets to customize content. |

### Events

| Event | Description |
| --- | --- |
| `sc-show` | Emitted when the side sheet opens. Get the state by event.detail.open. |
| `sc-hide` | Emitted when the side sheet closes. Get the state by event.detail.open. |
| `sc-action` | Emitted when click the action button. Get the action name by event.detail.name. |

### Stories

- `Default`
- `CustomWidth`
- `NoCloseIcon`
- `PreventCloseOutside`
- `Left`
- `Top`
- `Bottom`

## `sc-snackbar` — Components/Snackbar

Snackbar is used to communicate a brief message or notification quickly with as little disruption as possible to the user’s experience.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `string` | `success` | Sets the preferred snackbar type. Options: `success`, `warning`, `error`, `info`, `disabled`, `loading`. |
| `closable` | `boolean` | `false` | Sets to control if the snackbar can be manually closed. |
| `icon-hide` | `boolean` | `false` | Sets to control if the snackbar show the left icon or not. |
| `open` | `boolean` | `true` | Sets to show the snackbar. |
| `placement` | `string` | `top` | Sets the preferred snackbar position. Options: `top`, `bottom`. |
| `duration` | `number` | `3000` | The number of milliseconds to wait before auto dismissing after user interaction, e.g. mouse move. Can set as 'Infinity' if don't want to auto dismiss |

### Slots

| Slot | Description |
| --- | --- |
| `icon` | Sets to customize the prefix icon of snackbar. |
| `action` | Sets to show the action buttons in the snackbar. |
| `close-icon` | Sets to customize the close icon. |
| `(default)` | Snackbar text |

### Events

| Event | Description |
| --- | --- |
| `sc-show` | Emitted when the snackbar open. |
| `sc-hide` | Emitted when the snackbar closes. |

### Stories

- `Default`
- `Actions`
- `NotDismiss`
- `NoIcon`
- `Multiple`

## `sc-toast` — Components/Toast

Toast is used to communicate a brief message or notification quickly with as little disruption as possible to the user’s experience.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `string` | `success` | Sets the preferred toast type. Options: `success`, `warning`, `error`. |
| `closable` | `boolean` | `false` | Sets to control if the toast can be manually closed. |
| `open` | `boolean` | `true` | Sets to show the toast. |
| `rows` | `string` | `3` | Sets the max rows of the body. The value can be any number or auto. If want to show all, please set value as auto |
| `placement` | `string` | `top-right` | Sets the preferred toast position. Options: `top-left`, `top-right`, `bottom-left`, `bottom-right`. |
| `duration` | `number` | `3000` | The number of milliseconds to wait before auto dismissing after user interaction, e.g. mouse move. Can set as 'Infinity' if don't want to auto dismiss |
| `title` | `string` | — | Sets the title of toast. |

### Slots

| Slot | Description |
| --- | --- |
| `icon` | Sets to customize the prefix icon of toast. |
| `close-icon` | Sets to customize the close icon. |
| `title` | Sets to customize the title of toast. |
| `(default)` | Body of toast |

### Events

| Event | Description |
| --- | --- |
| `sc-show` | Emitted when the toast open. Get the state by event.detail.open. |
| `sc-hide` | Emitted when the toast closes. Get the state by event.detail.open. |

### Stories

- `Default`
- `NotDismiss`
- `CustomMessage`
- `AutoHeight`

## `sc-tooltip` — Components/Tooltip

Tooltips display additional information based on a specific action.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `header` | `string` | — | Sets the tooltip header. |
| `content` | `string` | — | Sets the tooltip content. |
| `placement` | `string` | `top` | The preferrred placement of the tooltip. Options: `top-start`, `top`, `top-end`, `bottom-start`, `bottom`, `bottom-end`, `left-start`, `left`, `left-end`, `right-start`, `right`, `right-end`. |
| `mode` | `string` | `dark` | The mode of the tooltip. Options: `dark`, `light`, `success`, `warning`, `error`, `primary`. |
| `distance` | `number` | `10` | The distance in pixels from which to offset the tooltip away from its target. |
| `skidding` | `number` | `0` | The distance in pixels from which to offset the tooltip along from its target. |
| `trigger` | `string` | `click` | Controls how the tooltip is activated. Multiple option can be passed by separating them with a space. Options: `click`, `hover`, `manual`. |
| `content-max-width` | `string` | `144px` | the maximum width of the tooltip before its content will wrap. |
| `open` | `boolean` | `false` | Sets to open and show tooltip. |
| `hoist` | `boolean` | `false` | It will be clipped if it's inside a container that has overflow: auto\|hidden. The hoist attribute forces the panel to use a fixed positioning strategy, allowing it to break out of the container. |
| `disabled` | `boolean` | `false` | Disables the tooltip so it won't show when triggered. |

### Slots

| Slot | Description |
| --- | --- |
| `content` | Sets to customize the tooltip content. |
| `(default)` | Sets to customize content. |

### Stories

- `Default`
- `BottomPlacement`
- `LeftPlacement`
- `RightPlacement`
- `Manual`
- `Disabled`
- `HTMLTooltip`
- `Hoist`


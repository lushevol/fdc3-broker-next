# @scdevkit/webkit — Loaders & Progress

> Auto-generated reference. Use for component APIs: attributes, slots, events, and usage variants.

## `sc-content-loader` — Components/Content Loader

Content loaders are used to entertain the user while they wait for a longer operation.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `string` | `line` | Sets the preferred loader type. Options: `circle`, `line`, `rectangle`, `square`. |
| `height` | `string` | `16px` | The preferred height of content loader. |
| `radius` | `string` | `sm` | The preferred radius of content loader. Not applicable for circle. Options: `xxs`, `xs`, `sm`, `md`, `lg`, `none`. |

### Stories

- `Default`
- `Circle`
- `Rectangle`
- `Square`
- `Combine`

## `sc-progress-bar` — Components/Progress Bar

Progress bars are used to show the status of an ongoing operation.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `string` | `sm` | The size of the progress bar. Options: `sm`, `md`, `lg`. |
| `type` | `string` | `success` | The color of the progress bar. Options: `info`, `success`, `warning`, `error`. |
| `value` | `string` | — | The current progress as a percentage, 0 to 100. |
| `indeterminate` | `boolean` | `false` | When true, percentage is ignored and the progress bar is drawn in an indeterminate state. |
| `show-label` | `boolean` | `false` | show the progress bar label |

### Slots

| Slot | Description |
| --- | --- |
| `label` | Sets to customize label. |
| `(default)` | Sets to customize content. |

### Stories

- `Default`
- `Information`
- `Success`
- `Warning`
- `Error`
- `Label`
- `Indeterminate`

## `sc-spinner` — Components/Spinner

Spinners are used to show the progress of a determinate operation.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `string` | `component` | Sets the preferred type of the spinner. Options: `component`, `page`. |
| `size` | `string` | `sm` | Sets the size of component spinner. Options: `sm`, `md`, `lg`. |
| `color` | `string` | `blue` | Sets the color of component spinner. Options: `blue`, `white`. |
| `message` | `string` | — | Defines the text content displayed with spinner. |

### Slots

| Slot | Description |
| --- | --- |
| `message` | Defines the text message displayed with spinner. |

### Stories

- `Component`
- `ComponentWhite`
- `Page`
- `Message`

## `sc-stepper` — Components/Stepper

Steppers convey progress through numbered steps.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `direction` | `string` | `horizontal` | The preferred direction of the stepper. Options: `horizontal`, `vertical`. |
| `mode` | `string` | `full` | The preffered mode of the stepper. Options: `indicator`, `full`. |
| `title-position` | `string` | `bottom` | The preferred position of the steps text. Not applicable for vertical stepper. Options: `bottom`, `right`. |
| `compact` | `boolean` | `false` | Show stepper in compact mode. |
| `presence-numbers` | `number` | `0` | The number of steps user wants to see by default. If this number is less than the total number of steps, the expand/collapse function will display. 0 means show all the steps without expand/collapse. Not applicable for horizontal stepper. |

### Events

| Event | Description |
| --- | --- |
| `sc-active-step-changing` | Emitted when changing the active step. Get newest index by event.detail.newIndex and       get last index by event.detail.oldIndex and get the element container by event.detail.owner. |
| `sc-active-step-changed` | Emitted when the active step changes. Get the index by event.detail.index and       get element container by event.detail.owner. |
| `sc-change` | Emitted when the expand/collapse feature is enabled and toggled by clicking. Get the expanded status by event.detail. |

### Stories

- `Default`
- `Complete`
- `Error`
- `Indicator`
- `IndicatorCompact`
- `Vertical`
- `VerticalCompact`

## `sc-timer` — Components/Timer

Timer component are use to indicate movement of time for a process that is taken place.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `duration-value` | `string` | — | Used to specify duration value in seconds or minutes or hours. |
| `duration-unit` | `string` | — | Used to specify duration unit with second or minute or hour. |
| `label` | `string` | — | Used to specific label and description. |
| `need-hour-digit` | `boolean` | `false` | Used to specify whether hour digit is required or not. |
| `no-background` | `boolean` | `false` | Used to specify whether background is needed or not. |
| `size` | `string` | `sm` | Used to specify size in terms of height. Options: `sm`, `md`, `lg`. |
| `state-interval-time` | `number` | — | Used to specify interval time between states default, warning and alert in seconds. |
| `time-out-message` | `string` | — | Used to specify timeout message which is displayed after time out, instead of label. |

### Events

| Event | Description |
| --- | --- |
| `sc-timer-start` | Emitted when the timer starts. |
| `sc-timer-end` | Emitted when the timer ends. |
| `sc-timer-tick` | Emitted when there is a state change between default, warning and alert. |

### Stories

- `Timer`
- `TimerWithHourDigit`
- `SmallTimer`
- `LargeTimer`
- `NoBackground`


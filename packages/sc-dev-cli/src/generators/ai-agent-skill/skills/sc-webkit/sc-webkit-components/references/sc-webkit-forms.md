# @scdevkit/webkit — Forms & Inputs

> Auto-generated reference. Use for component APIs: attributes, slots, events, and usage variants.

## `sc-card-number-input` — Components/Form Input/Card Number Input

Use card number input to capture user data input in pre-defined format, 
          typically use for credit card number entry.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `clearable` | `boolean` | `false` | Sets to allow user to clear the value. |
| `max-length` | `number` | `16` | Maximun character allowed. |
| `no-suffix-icon` | `boolean` | `false` | Sets to hide the suffix icon. |

### Stories

- `Default`
- `SizeSmall`
- `SizeLarge`
- `NoSuffix`
- `Box`
- `Error`
- `HTML`

## `sc-checkbox-group` — Components/Checkbox/Checkbox Group

Checkboxes group allows users to select one or more items from a list of choice.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `direction` | `boolean` | — | Display the direction of checkbox. Options: `vertical`, `horizontal`. |
| `columns` | `number` | — | Display the columns of checkbox. |

### Events

| Event | Description |
| --- | --- |
| `sc-change` | Emitted when the checked state changes. Get the checked state by event.detail.value. |

### Stories

- `Default`
- `Label`
- `Error`
- `Horizontal`
- `WithParent`

## `sc-checkbox` — Components/Checkbox/Checkbox

Checkboxes allow the user to toggle an option on or off.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean` | `false` | Draws the checkbox in a checked state. |
| `indeterminate` | `boolean` | `false` | Draws the checkbox in an indeterminate state. |

### Events

| Event | Description |
| --- | --- |
| `sc-change` | Emitted when the checked state changes. Get the checked state by event.detail.checked. |

### Stories

- `Default`
- `Checked`
- `Indeterminate`
- `Error`
- `Disable`

## `sc-date-input` — Components/Form Input/Date Input

Select the single date.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `min` | `string` | — | Sets the minimum date, should follow the dayjs format, e.g. 2024-09-25, 25 Sep 2024. |
| `max` | `string` | — | Sets the maxmum date, should follow the dayjs format, e.g. 2024-09-25, 25 Sep 2024. |
| `hoist` | `boolean` | `false` | Date picker will be clipped if they’re inside a container that has overflow: auto\|hidden. The hoist attribute forces the panel to use a fixed positioning strategy, allowing it to break out of the container. |
| `label-position` | `string` | `right` | The preferred placement of the label. Options: `top`, `right`. |
| `clearable` | `boolean` | `false` | Sets to allow user to clear the value. |
| `show-action-bar` | `boolean` | `false` | Sets to show the action bar to select today. |
| `quick-selector` | `boolean` | `false` | Enables the quick selector feature. |
| `quick-selector-items` | `array` | `[ 
            { amount: -1, unit: 'year' },
            { amount: -1, unit: 'month' },
            { amount: -1, unit: 'week' },
            { amount: -1, unit: 'day' },
            { amount: 1, unit: 'day' },
            { amount: 1, unit: 'week' },
            { amount: 1, unit: 'month' },
            { amount: 1, unit: 'year' }
          ]` | Defines the items for the quick selector. Each item should have an amount and a unit. |
| `disabled-dates` | `array` | — | Sets the disabled dates for the date picker. |

### Events

| Event | Description |
| --- | --- |
| `sc-change` | Emitted when switch the option. Get the date by event.detail.value. |

### Stories

- `Default`
- `SizeSmall`
- `SizeLarge`

## `sc-date-range-input` — Components/Form Input/Date Range Input

Select the range date.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `hoist` | `boolean` | `false` | Date range picker will be clipped if they’re inside a container that has overflow: auto\|hidden. The hoist attribute forces the panel to use a fixed positioning strategy, allowing it to break out of the container. |
| `label-position` | `string` | `right` | The preferred placement of the label. Options: `top`, `right`. |
| `start-config` | `object` | — | The config for the first input, you can set the attributes which sc-date-input supports. |
| `end-config` | `object` | — | The config for the second input, you can set the attributes which sc-date-input supports. |
| `clearable` | `boolean` | `false` | Sets to allow user to clear the value. |
| `quick-selector` | `boolean` | `false` | Enables the quick selector feature. |
| `quick-selector-items` | `array` | `[ 
            { amount: -1, unit: 'year' },
            { amount: -1, unit: 'month' },
            { amount: -1, unit: 'week' },
            { amount: -1, unit: 'day' },
            { amount: 1, unit: 'day' },
            { amount: 1, unit: 'week' },
            { amount: 1, unit: 'month' },
            { amount: 1, unit: 'year' }
          ]` | Defines the items for the quick selector. Each item should have an amount and a unit. |

### Events

| Event | Description |
| --- | --- |
| `sc-change` | Emitted when switch the option. Get the date by event.detail.value. |

### Stories

- `Default`
- `SizeSmall`
- `SizeLarge`
- `HTML`

## `sc-dropdown-input` — Components/Dropdown/Dropdown

Dropdowns expose additional content that “drops down” in a panel.

### Stories

- `Default`
- `SizeSmall`
- `SizeLarge`
- `Hoist`
- `Error`
- `HTML`
- `VirtualDropdown`
- `HierarchicalDropdown`
- `CustomDropdown`

## `sc-file-input` — Components/File/File Input

File input provides a drop zone to upload files.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `array` | — | Sets the input field value. |
| `label-size` | `string` | `md` | The size of the label. Options: `sm`, `md`, `lg`. |
| `icon-size` | `string` | `sm` | The size of the icon. Options: `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`. |
| `accept` | `string` | — | The file types the file input should accept, separated by comma. |
| `width` | `string` | `100%` | The width of file input. |
| `max-size` | `number` | — | The max size allowed (in bytes). |
| `direction` | — | `vertical` | The direction of the file list. Options: `horizontal`, `vertical`. |
| `no-icon` | `boolean` | `false` | Hide file icon if set to true. |
| `no-border` | `boolean` | `false` | Hide border if set to true. |
| `bg-gray` | `boolean` | `false` | drop zone with gray background if set to true. |
| `hide-file-list` | `boolean` | `false` | Hide file list if set to true. |
| `multiple` | `boolean` | `false` | Sets to allow accept more than one files at once. |
| `selectable` | `boolean` | `false` | Sets to show file name as link. |
| `deletable` | `boolean` | `false` | Sets to show delete file icon. |

### Slots

| Slot | Description |
| --- | --- |
| `placeholder` | Sets to customize the text in drop zone. |
| `add-button` | Sets to Add Button style to upload file. |

### Events

| Event | Description |
| --- | --- |
| `sc-change` | Emitted when file input value is changed. Get the file information by event.detail.value. |

### Stories

- `Default`
- `Multiple`
- `Disabled`
- `ErrorBorder`
- `GrayBackgroundDropzone`
- `HideFileList`
- `WithInitValue`
- `Readonly`
- `AddButtonPrimaryWithAccepts`
- `AddButtonWithErrorMessage`
- `AddButtonWithCustomTitleAndLargeSize`
- `AddButtonWithDisabled`

## `sc-file-item` — Components/File/File Item

File item shows information such as file type, size and icon for a given file.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `file-id` | `string` | — | Unique File id. And it will add the same class to the component |
| `name` | `string` | — | File name with extension. |
| `icon-size` | `string` | `default` | The size of the icon. Options: `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `default`. |
| `width` | `string` | `max-content` | Sets the preferred width. |
| `size` | `number` | — | File size (in byte). |
| `progress-size` | `number` | — | Sets the size (in byte) processed.          For example, to show 50% progress for file of size 100KB, set the progress-size to 50KB. |
| `progress-text` | `string` | — | Prefix label to be prepended to the progress information. |
| `progress-type` | `string` | `success` | Sets the type of the progress bar. Options: `success`, `warning`, `error`. |
| `extra` | `string` | — | Sets the extra text of the file. |
| `status` | `string` | `default` | Sets the status of the file. Options: `default`, `uploading`, `error`. |
| `no-icon` | `boolean` | `false` | Hide file icon if set to true. |
| `no-border` | `boolean` | `false` | Hide border if set to true. |
| `selectable` | `boolean` | `false` | Sets to show file name as link. |
| `deletable` | `boolean` | `false` | Sets to show delete file icon. |

### Slots

| Slot | Description |
| --- | --- |
| `(default)` | Sets to customize content. |

### Events

| Event | Description |
| --- | --- |
| `sc-select` | Emitted when select the file name. Get the file name by event.detail.name and get the file id by event.detail.file-id and get the file status by event.detail.status and other properties in event.detail and       get interacted element by event.detail.target. |
| `sc-remove` | Emitted when click on the delete icon. Get the file name by event.detail.name and get the file id by event.detail.file-id and get the file status by event.detail.status and other properties in event.detail and       get interacted element by event.detail.target. |
| `sc-cancel` | Emitted when click on the cancel icon only in uploading status. Get the file name by event.detail.name and get the file id by event.detail.file-id and get the file status by event.detail.status and other properties in event.detail and       get interacted element by event.detail.target. |
| `sc-loaded` | Emitted when the status change. Get the file name by event.detail.name and get the file id by event.detail.file-id and get the file status by event.detail.status and other properties in event.detail and       get interacted element by event.detail.target. |

### Stories

- `Default`
- `Selectable`
- `Deletable`
- `Progress`
- `StatusLoading`
- `StatusError`
- `Extra`
- `ExtraOnError`
- `NoBorder`
- `OnlyText`
- `Customize`

## `sc-file-list` — Components/File/File List

File list shows file item in either horizontal or vertical manner.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `direction` | — | `vertical` | The direction of the file list. Options: `horizontal`, `vertical`. |

### Events

| Event | Description |
| --- | --- |
| `sc-select-items` | Emitted when select the file name. Get details of all the files listed by looping through the array from event.detail.value.currentFiles. |
| `sc-remove-items` | Emitted when click on the delete icon. Get details of the remaining files listed by looping through the array from event.detail.value.currentFiles and get details of the removed files by looping through the array from event.detail.value.removedItems. |
| `sc-cancel-items` | Emitted when click on the cancel icon only in uploading status. Get details of all the files listed by looping through the array from event.detail.value.currentFiles. |
| `sc-loaded-items` | Emitted when the status change. Get details of all the files listed by looping through the array from event.detail.value.currentFiles. |

### Stories

- `Default`
- `Horizontal`

## `sc-formatted-input` — Components/Form Input/Formatted Input

Use formatted input to capture user data input in pre-defined format.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `clearable` | `boolean` | `false` | Sets to allow user to clear the value. |
| `format` | `string` | — | Set to customize the format, can set the string of regular expression. |
| `blocks` | `string` | — | Set the value blocks, separate the numbers with commas, e.g ‘2,3,4’. |
| `delimiter` | `string` | ` - ` | The delimiters for connecting blocks. |
| `max-length` | `number` | — | Sets the max length of the input. |
| `rows` | `number` | — | Sets the rows number of the input. |
| `resizable` | `boolean` | `false` | Sets to allow user to resize the input. |

### Stories

- `Default`
- `Error`
- `SizeSmall`
- `SizeLarge`
- `CustomDelimiter`
- `CustomFormat`

## `sc-input-group` — Components/Form Input/Input Group

sc-input-group provides a layout wrapper of child inputs. 
Can wrap sc-dropdown-input, sc-text-input, sc-number-input, sc-card-number-input, sc-time-input as child

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | The title of label. |
| `size` | `string` | `md` | The preferrred field size. Options: `sm`, `md`, `lg`. |
| `label-size` | `string` | — | The preferrred label size. It’s same with size property by default. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `tooltip` | `string` | — | Tooltip content. |
| `tooltip-placement` | `string` | `right` | The preferred placement of the tooltip. Options: `top`, `bottom`, `left`, `right`. |
| `hint` | `string` | — | hint content. |
| `hint-placement` | `string` | `right` | The preferred placement of the hint. Options: `top`, `bottom`, `left`, `right`. |
| `required` | `boolean` | `false` | Makes the input a required field. |
| `error` | `boolean` | `false` | Sets to display error state. |
| `error-message` | `string` | — | The input’s error message. |
| `success` | `boolean` | `false` | Sets to display success state. |
| `success-message` | `string` | — | The input’s success message. |
| `help-text` | `string` | — | The input’s help text. |
| `width` | `string` | `100%` | The width of input group. |

### Slots

| Slot | Description |
| --- | --- |
| `label` | Sets to customize the label of input group. |
| `label-tooltip` | Sets to customize the tooltip of label. |
| `label-hint` | Sets to customize the hint of label. |
| `help` | Sets to customize the help text. |
| `success` | Sets to customize the success message. |
| `error` | Sets to customize the error message. |

### Stories

- `Default`
- `SizeSmall`
- `SizeLarge`
- `CustomWidth`
- `WithError`
- `CustomLabel`

## `sc-dropdown-multi-select` — Components/Dropdown/Dropdown Multi Select 

Similar to dropdowns, dropdown multi select expose additional content that “drops down” 
          in a panel and allow user to select multiple options.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `string` | `md` | The preferrred size of the dropdown. Options: `sm`, `md`, `lg`. |
| `multiple-rows` | `boolean` | `false` | Set to allow multiple rows. |
| `clearable` | `boolean` | `false` | Set to allow user to clear the value. |
| `data` | `DATA_ITEM[]` | — | Set to render virtual list. |
| `value` | `array` | — | The input’s default value. |
| `dropdown-header` | `string` | — | Sets the dropdown header of the dropdown. |
| `prefix-icon` | `string` | — | Sets the prefix icon of the dropdown. |
| `loading` | `boolean` | `false` | Shows the loading state of the dropdown. |
| `loading-text` | `string` | — | Sets the loading text of the dropdown. |
| `empty-text` | `string` | — | Sets the empty text of the dropdown to show that no options are available. |
| `retry-button` | `string` | `Retry` | Shows the text preferred for the retry button when options are loading or cannot be found. |
| `advanced-search-text` | `string` | — | Sets the advanced search text and shows the advanced search for the dropdown. |
| `advanced-search-icon` | `string` | `search` | Sets the advanced search icon of the dropdown. |
| `display-raw-value` | `boolean` | `false` | Sets to show the option's value in dropdown input.        By default, the dropdown will show the option's content |
| `hoist` | `boolean` | `false` | Dropdown panels will be clipped if they’re inside a container that has overflow: auto\|hidden. The hoist attribute forces the panel to use a fixed positioning strategy, allowing it to break out of the container. |
| `select-all` | `boolean` | `false` | Shows the select all option. |

### Slots

| Slot | Description |
| --- | --- |
| `empty-text` | Sets the empty text of the dropdown to show that no options are available. |
| `side-sheet-content` | Sets to customize the side sheet content for advanced search. |

### Events

| Event | Description |
| --- | --- |
| `sc-clear` | Emitted when clear content. |
| `sc-select` | Emitted when a dropdown option is selected. Get the selected values by event.detail.value. Get the deleted values by event.detail.deletedValues |

### Stories

- `Default`
- `Hoist`
- `Error`
- `HTML`
- `VirtualDropdown`
- `DisabledOption`
- `HierarchicalDropdown`
- `DataLookupDropdown`
- `CustomDropdown`
- `SelectAll`

## `sc-number-input` — Components/Form Input/Number Input

Use number input to enforce number entry by user.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `max-decimals` | `number` | — | The maximum decimal place. |
| `type` | `string` | `number` | The preferrred icon size. Options: `number`, `digit`. |
| `clearable` | `boolean` | `false` | Sets to allow user to clear the value. |
| `min` | `number` | — | Sets the minimum number. |
| `max` | `number` | — | Sets the maximum number. |

### Stories

- `Default`
- `SizeSmall`
- `SizeLarge`
- `Box`
- `Error`
- `HTML`

## `sc-password-input` — Components/Form Input/Password Input

Password input allows user to show and hide text on input.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `clearable` | `boolean` | `false` | Sets to allow user to clear the value. |
| `max-length` | `number` | `16` | Maximun character allowed. |

### Stories

- `Default`
- `SizeSmall`
- `SizeLarge`
- `Box`
- `Error`
- `HTML`

## `sc-radio-group` — Components/Radio Group

Radio button groups for user action.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Sets the default value of radio group. |
| `direction` | `string` | — | Display the direction of all radios. Options: `vertical`, `horizontal`. |
| `columns` | `number` | — | Display the columns of radios. |

### Events

| Event | Description |
| --- | --- |
| `sc-change` | Emitted when the radio group’s selected value changes.        Get the radio group state by event.detail.value. |

### Stories

- `Default`
- `Selected`
- `Disabled`
- `Horizontal`

## `sc-rating` — Components/Rating

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `string` | `default` |  Options: `default`, `button`. |
| `max` | `number` | — |  |
| `size` | `string` | `lg` |  Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `value` | `number` | — |  |
| `first-lower-text` | `string` | — | Set the first lower text ('Least likely'). |
| `last-lower-text` | `string` | — | Set the first lower text ('Most likely'). |
| `options` | `array` | — |  |
| `inline` | `boolean` | `false` |  |

### Events

| Event | Description |
| --- | --- |
| `sc-change` | Emitted when the selected item changes. Get the current rating by event.detail.value. |

### Stories

- `Default`
- `Readonly`
- `ButtonMode`

## `sc-repeater` — Components/Repeater

Compound inputs are triggers that add or remove form items dynamically.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `position` | `string` | `append` | Sets the position of the duplicated item Options: `append`, `prepend`, `startingEmpty`. |
| `disabled` | `boolean` | `false` | Sets the disabled status |
| `button-expand` | `boolean` | `false` | Sets to expand the button to full width |

### Events

| Event | Description |
| --- | --- |
| `sc-duplication-add` | Emitted when the duplication is added. |
| `sc-duplication-remove` | Emitted when the duplication is removed. |
| `sc-change` | Emitted when change is made, to get all fields and values. Get the fields with event.detail.fieldsand get the values with event.detail.values |

### Stories

- `Append`
- `Prepend`
- `StartingEmpty`
- `ButtonExpand`
- `Disabled`
- `Group`

## `sc-search-field` — Components/SearchField

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | The value of search field. |
| `size` | `string` | `lg` | The preferrred field size. Options: `sm`, `md`, `lg`. |
| `show-suggestion` | `boolean` | `false` | Sets to show the suggestion when input value's length >= threshold. |
| `threshold` | `number` | `3` | Sets to control the mininum value length to show the suggestion. |
| `hoist` | `boolean` | `false` | Search panels will be clipped if they’re inside a container that has overflow: auto\|hidden. The hoist attribute forces the panel to use a fixed positioning strategy, allowing it to break out of the container. |
| `empty-text` | `string` | `No data found` | Sets to customize the empty text if there is no suggestion result. |
| `placeholder` | `string` | — | The placeholder of search field. |
| `readonly` | `boolean` | `false` | Sets the search field as readonly. |
| `max-rows` | `boolean` | `false` | Set to show a maximum number of rows. |
| `readonly-rows` | `number` | — | Maximum number of rows allowed in readonly state. |
| `disabled` | `boolean` | `false` | Sets to disable search field. |
| `clearable` | `boolean` | `false` | Sets to allow user to clear the value. |
| `error` | `boolean` | `false` | Sets to display error state. |
| `error-message` | `string` | — | Sets the error message. |
| `display-raw-value` | `boolean` | `false` | Sets `value` as the text displayed when selecting from the dropdrown. |
| `updateSuggestions` | `(suggestions: SuggestionOption[]) => void` | — | A method to dynamically update the list of suggestions. It accepts an array of            SuggestionOption objects,           where each object contains a `value` and an optional `displayValue` (string or function). |

### Slots

| Slot | Description |
| --- | --- |
| `error` | Sets to customize the error message. |

### Events

| Event | Description |
| --- | --- |
| `sc-input` | Emitted when the control receives input. Get the input content by event.detail.value. |
| `sc-search` | Emitted when click the search icon or press Enter. Get the latest input value by event.detail.value. |

### Stories

- `Default`

## `sc-slider` — Components/Slider

A flexible slider component supporting number, range, and string types.

### Stories

- `Default`
- `Range`
- `StringStops`
- `WithStops`

## `sc-switch` — Components/Switch

Switches toggle the state of a single setting on or off.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `label-position` | `string` | `right` | The preferred placement of the label. Options: `top`, `left`, `right`. |
| `size` | `string` | `sm` | The size of the switch. Options: `sm`, `md`, `lg`. |
| `checked` | `boolean` | `false` | Draws the switch in a checked state. |
| `loading` | `boolean` | `false` | Draws the switch in a loading state. |
| `text-icon-label` | `string` | `null` | The preferred type of inner label. Options: `null`, `text-label`, `icon-label`. |
| `success` | — | — |  |
| `success-message` | — | — |  |
| `slot[name='success']` | — | — |  |
| `error` | — | — |  |
| `error-message` | — | — |  |
| `slot[name='error']` | — | — |  |

### Events

| Event | Description |
| --- | --- |
| `sc-change` | Emitted when switch the option. Get the state by event.detail.checked. |

### Stories

- `Default`
- `LabelTop`
- `LabelLeft`
- `LabelRight`
- `TextLabel`
- `IconLabel`
- `Loading`
- `Disabled`
- `HTML`

## `sc-text-input` — Components/Form Input/Text Input

Inputs collect data from the user and allow multiline lines of text.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `prefix-icon` | `string` | — | Sets the prefix icon. |
| `suffix-icon` | `string` | — | Sets the suffix icon. |
| `suffix-label` | `string` | — | Sets the suffix label. |
| `max-length` | `number` | — | Maximum character allowed. |
| `show-character-count` | `boolean` | `false` | Sets to show the character counter. |
| `rows` | `number` | `5` | Sets the number of row. |
| `clearable` | `boolean` | `false` | Sets to allow user to clear the value. |
| `resizable` | `boolean|string` | `false` | Sets to allow user to resize the input if multiline. Options: `false`, `true`, `auto`. |
| `multiline` | `boolean` | `false` | Sets to render text input as multiline input. |

### Stories

- `Default`
- `MultilineRow`
- `MultilineResizable`
- `MultilineResizableAuto`
- `Help`
- `SizeSmall`
- `SizeLarge`
- `TextAlignRight`
- `Success`
- `Error`
- `ErrorWhenRequiredSymbolShow`
- `HTML`

## `sc-time-input` — Components/TimeInput

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `hour-step` | `number` | `1` | The hour step. |
| `clearable` | `boolean` | `false` | Sets to allow user to clear the value. |
| `hoist` | `boolean` | `false` | Time panels will be clipped if they’re inside a container that has overflow: auto\|hidden. The hoist attribute forces the panel to use a fixed positioning strategy, allowing it to break out of the container. |
| `minute-step` | `number` | `1` | The minute step. |
| `second-step` | `number` | `1` | The second step. |
| `disabled-hours` | `array` | — | Sets to disable hours. |
| `disabled-minutes` | `array` | — | Sets to disable minutes. |
| `disabled-seconds` | `array` | — | Sets to disable seconds. |
| `format` | `string` | `HH:mm` | The time format, the values follow dayjs. |
| `seconds` | `boolean` | `false` | Sets to display second list. |

### Events

| Event | Description |
| --- | --- |
| `sc-input` | Emitted when selects the time. Get the Date by event.detail.value. |

### Stories

- `Default`
- `SizeSmall`
- `SizeLarge`
- `CustomFormat`
- `DefaultValue`
- `WithAMPM`
- `TimeInputWithError`
- `DisabledItem`
- `DisabledTimeInput`

## `sc-toggle` — Components/Toggle

Use toggle to quickly switch between multiple possible states.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `string` | `xs` | Sets the size of toggle label. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |

### Events

| Event | Description |
| --- | --- |
| `sc-select` | Emitted when the option changes. Get the selected value by event.detail.value. |

### Stories

- `Default`
- `Error`
- `HTML`


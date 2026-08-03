# @scdevkit/webkit — Content & Display

> Auto-generated reference. Use for component APIs: attributes, slots, events, and usage variants.

## `sc-avatar` — Components/Avatar

Avatars can be used to represent people or objects. It supports images, icons, or letters.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `background` | `string` | — | Sets the background color of the avatar. Options: `red`, `green`, `blue`, `yellow`, `default`. |
| `shape` | `string` | `circle` | Sets the shape of the avatar. Options: `circle`, `square`. |
| `size` | `string` | `md` | Sets the size of the avatar. Options: `sm`, `md`, `lg`, `default`. |
| `show-badge` | `boolean` | `false` | Sets to show/hide badge content. |
| `badge-number` | `number` | `null` | Sets the number value of the badge content. |
| `badge-label` | `string` | — | Sets to the label value of the badge content. |
| `badge-type` | `string` | `number` | Sets the preferred type of the badge. Options: `number`, `text`, `dot`. |
| `badge-color` | `string` | — | Sets the preferred color for the badge Options: `error`, `success`, `info`, `dark-blue`, `warning`, `disabled`, `default`. |

### Stories

- `Default`
- `Image`
- `ImageBadgeNumber`
- `ImageBadgeText`
- `ImageBadgeDot`
- `Slot`
- `SlotNumberBadge`
- `SlotTextBadge`
- `SlotDotBadge`

## `sc-badge` — Components/Badge

Badges are used to draw attention and display statuses or counts.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `string` | `number` | Sets the preferred type of the badge. Options: `number`, `text`, `dot`. |
| `color` | `string` | `blue` | Sets the preferred color for the badge Options: `blue`, `dark-blue`, `green`, `red`, `amber`, `grey`, `transparent`. |
| `number` | `number` | — | Set the number to show. Note that number will be truncated to thousands. |
| `label` | `string` | — | Set the label to show. |
| `outlined` | `boolean` | `false` | Draws the badge as outlined mode. |
| `size` | `string` | `md` | Sets the size for the badge Options: `sm`, `md`, `lg`, `default`. |

### Stories

- `Default`
- `Number`
- `Dot`
- `Outlined`

## `sc-card` — Components/Card/Card

Card groups related information in a flexible-size container visually resembling a playing card.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `direction` | — | `vertical` | The direction of the card content. Options: `horizontal`, `vertical`. |
| `title` | `string` | — | Sets to change the card title. |
| `title-size` | `string` | `sm` | Sets to change the title size. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `sub-title` | `string` | — | Sets to change the card sub title. |
| `body` | `string` | — | Sets to change the card body text. |
| `body-size` | `string` | `xs` | Sets to change the body size. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `space-size` | `string` | `sm` | Sets to change the card spacing. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `text-align` | `string` | `left` | Sets to change the card text alignment. Options: `left`, `center`, `right`, `justify`. |
| `vertical-align` | `string` | `middle` | Sets to change the card vertical alignment. Options: `top`, `middle`, `bottom`. |
| `width` | `string` | — | The preferred width for the card. |
| `height` | `string` | — | The preferred height for the card. |
| `selected-on-click` | `boolean` | `false` | Sets to select the card on click. |
| `selected` | `boolean` | `false` | Sets to select and highlight the card. |
| `disabled` | `boolean` | `false` | Set to show the disabled state of the card. |
| `hover-highlight` | `boolean` | `false` | Sets to enable hover effect. |
| `no-border` | `boolean` | `false` | Sets to show card without border. |
| `action-button` | `string` | — | Set to show the action button. |
| `draggable` | `boolean` | `false` | Set to show the drag icon. |
| `icon` | `string` | — | The preferred icon for card. |
| `icon-size` | `string` | `sm` | The preferred size for the icon. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `icon-align` | `string` | `right` | The preferred alignment for icon. Options: `left`, `center`, `right`, `justify`. |
| `icon-vertical-align` | `string` | `top` | The preferred vertical alignment for icon. Options: `top`, `middle`, `bottom`. |
| `tags-group` | `array` | — | Sets the tags for the card. |
| `supplementary-details` | `array` | — | Sets the tags for the card. |
| `clickable` | `boolean` | `false` | Set to make the card clickable. |
| `button-no-pill` | `boolean` | `false` | Set to show the no pill state for the buttons. |
| `button-state-primary` | `string` | `default` | The state for the primary button. Options: `default`, `error`. |
| `button-state-secondary` | `string` | `default` | The state for the secondary button. Options: `default`, `error`. |
| `button-text-primary` | `string` | `Decision` | The text for the primary button. |
| `button-text-secondary` | `string` | `Way out` | The text for the secondary button. |
| `button-text-left` | `string` | `Learn more` | The text for the left button. |
| `button-truncate` | — | — |  |
| `expandable` | `boolean` | `false` | Set to show an expandable card. |

### Slots

| Slot | Description |
| --- | --- |
| `header` | Sets to customize the header. |
| `prefix` | Sets to customize the prefix. |
| `suffix` | Sets to customize the suffix. |
| `title` | Sets to customize the title. |
| `sub-title` | Sets to customize the sub title. |
| `body` | Sets to customize the body. |
| `footer` | Sets to customize the footer. |
| `(default)` | Sets to customize content. |

### Events

| Event | Description |
| --- | --- |
| `sc-action` | Emitted when clicking on the icon, action or drag button. Get the interacted element by event.detail.target.         Also emitted when clicking on the buttons. Get the button type by event.detail.type. |

### Stories

- `Default`
- `ActionButton`
- `ActionButtonVertical`
- `Selected`
- `Clickable`

## `sc-check-card` — Components/Card/Check Card

Check card groups related information in a flexible-size container 
          visually resembling a playing card and show checkbox for user action.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `checkbox-position` | `string` | `left` | Sets to change the checkbox position. Options: `left`, `right`. |
| `title` | `string` | — | Sets to change the card title. |
| `title-size` | `string` | `sm` | Sets to change the title size. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `sub-title` | `string` | — | Sets to change the card sub title. |
| `sub-title-size` | `string` | `sm` | Sets to change the sub title size. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `body` | `string` | — | Sets to change the card body text. |
| `body-size` | `string` | `sm` | Sets to change the body size. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `space-size` | `string` | `sm` | Sets to change the card spacing. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `text-align` | `string` | `left` | Sets to change the card text alignment. Options: `left`, `center`, `right`, `justify`. |
| `vertical-align` | `string` | `middle` | Sets to change the card vertical alignment. Options: `top`, `middle`, `bottom`. |
| `width` | `string` | — | The preferred width for the card. |
| `height` | `string` | — | The preferred height for the card. |
| `checked` | `boolean` | `false` | Sets to select and highlight the card. |
| `hover-highlight` | `boolean` | `false` | Sets to enable hover effect. |
| `no-border` | `boolean` | `false` | Sets to show card without border. |
| `disabled` | `boolean` | `false` | Sets to disabled checkbox. |
| `icon` | `string` | — | The preferred icon for card. |
| `icon-size` | `string` | `md` | The preferred size for the icon. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `icon-vertical-align` | `string` | `middle` | The preferred vertical alignment for icon. Options: `top`, `middle`, `bottom`. |
| `tags-group` | `array` | — | Sets the tags for the card. |
| `supplementary-details` | `array` | — | Sets the tags for the card. |
| `clickable` | `boolean` | `false` | Set to make the card clickable and get custom event i.e sc-action |

### Slots

| Slot | Description |
| --- | --- |
| `header` | Sets to customize the header. |
| `prefix` | Sets to customize the prefix. |
| `suffix` | Sets to customize the suffix. |
| `title` | Sets to customize the title. |
| `sub-title` | Sets to customize the sub title. |
| `body` | Sets to customize the body. |
| `footer` | Sets to customize the footer. |
| `(default)` | Sets to customize content. |

### Events

| Event | Description |
| --- | --- |
| `sc-change` | Emitted when the checked state changes. Get the checked state by event.detail.checked. |
| `sc-action` | Emitted when clickable=true and click on card. Get the radio state by event.detail.checked. |

### Stories

- `Default`
- `IconAndHover`
- `Selected`
- `Disabled`
- `WithHeaderAndFooter`
- `WithoutBorder`

## `sc-closable-tag` — Components/Tag/Closable Tag

Closable tags are used as labels to organize things or to indicate a selection and allow it to be closed.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `string` | `primary` | Sets the preferred type of tag. Options: `primary`, `success`, `warning`, `error`, `disabled`, `transparent`, `blue`, `dark-blue`, `red`, `amber`, `green`, `grey`, `black`, `white`, `grey-dash`. |
| `mode` | `string` | `default` | Sets the preferred mode. Options: `default`, `filled`, `link`. |
| `value` | `string` | `false` | Value of the tag. |
| `disabled` | `boolean` | `false` | Show tag as disabled. |
| `max-width` | `max-width` | `false` | Max width of the tag. |
| `icon-name` | `string` | `false` | The name of the icon. |

### Slots

| Slot | Description |
| --- | --- |
| `(default)` | Sets the text of the tag. |

### Events

| Event | Description |
| --- | --- |
| `sc-remove` | Emitted when the tag closes. Get the tag value by event.detail.tag and        get the interacted element by event.detail.target. |

### Stories

- `Default`
- `Primary`
- `Blue`
- `DarkBlue`
- `Success`
- `Green`
- `Warning`
- `Amber`
- `Error`
- `Red`
- `Transparent`
- `White`
- `Black`
- `Disabled`
- `Grey`
- `GreyDash`

## `sc-date` — Components/Date

Date component are use to convert time format to the bank standard format

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `date` | `string` | `2025-06-16T09:05:52.831Z` | Used to input a time date, support string, number, Date, Dayjs type. |
| `date-type` | `string` | `full-date` | The date format type. Options: `full-date`, `short-date`. |
| `show-time` | `boolean` | `false` | Date displays year, month, day with hours, minutes, seconds or not. |
| `time-only` | `boolean` | `false` | Date only displays hours, minutes, seconds or not. |
| `hide-seconds` | `boolean` | `false` | Date hidden in seconds or not. |
| `show-timezone` | `boolean` | `false` | Date show timezone or not. |
| `size` | `string` | `md` | Used to specify font size. Options: `sm`, `md`, `lg`. |

### Stories

- `DateArgs`
- `DateWithShortDate`
- `DateWithShowTime`
- `DateWithTimeOnly`
- `DateWithHideSeconds`
- `DateWithShowTimezone`

## `sc-dot-status` — Components/Dot Status

Dot status are pre-defined color dot or icons used to display status.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `string` | `default` | The preferred mode of the dot status. Options: `default`, `icon`. |
| `type` | `string` | `disabled` | The preferred dot status color. Options: `info`, `neutral`, `error`, `warning`, `success`, `minor-error`, `pending`, `draft`, `urgent-error`. |
| `status` | `string` | `draft` | The preffered dot status icon. Options: `error`, `warning`, `minor-error`, `success`, `info`, `pending`, `pending-approval`, `draft`, `missing-info`, `rejected`, `on-hold`, `not-started`. |
| `outline` | `boolean` | `false` | Show icon as outline. |
| `compact` | `boolean` | `false` | Show in compact mode. |
| `label` | `string` | — | Label to show on screen. Provide empty space to remove label. |
| `inline` | `boolean` | `false` | Show dot status as inline. |

### Stories

- `Default`
- `NoLabel`
- `Icon`
- `IconOutline`

## `sc-icon-card` — Components/Card/Icon Card

Icon card are surfaces that display content and actions on a single topic.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `string` | `default` | The preferred mode for icon card. Options: `default`, `icon`. |
| `src` | `string` | — | Sets the image URL. |
| `icon` | `string` | — | Sets the icon name. |
| `icon-size` | `string` | `sm` | Sets the icon size. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `icon-align` | `string` | `left` | The preferred alignment for icon. Options: `left`, `center`, `right`, `justify`. |
| `icon-vertical-align` | `string` | `top` | The preferred vertical alignment for icon. Options: `top`, `middle`, `bottom`. |
| `title` | `string` | — | Sets to change the card title. |
| `title-size` | `string` | `sm` | Sets to change the title size. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `body` | `string` | — | Sets to change the card body text. |
| `body-size` | `string` | `sm` | Sets to change the body size. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `space-size` | `string` | `sm` | Sets to change the card spacing. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `image-align` | `string` | `left` | Sets to change the card image alignment. Options: `left`, `center`, `right`, `justify`. |
| `text-align` | `string` | `left` | Sets to change the card text alignment. Options: `left`, `center`, `right`, `justify`. |
| `selected` | `boolean` | `false` | Sets to select and highlight the card. |
| `hover-highlight` | `boolean` | `false` | Sets to enable hover effect. |
| `no-border` | `boolean` | `false` | Sets to show card without border. |
| `layout` | `string` | `title-in` | The preferred layout for the card. Options: `title-in`, `title-out`. |
| `size` | `string` | `full` | The preferred size of the card. Options: `full`, `half`, `one-third`, `one-fourth`, `custom`. |
| `width` | `string` | `100%` | The preferred width for the card. |
| `height` | `string` | — | The preferred height for the card. |
| `direction` | — | `vertical` | The direction of the card content. Options: `horizontal`, `vertical`. |
| `sub-title` | `string` | — | Sets to change the card sub title. |
| `vertical-align` | `string` | `middle` | Sets to change the card vertical alignment. Options: `top`, `middle`, `bottom`. |
| `selected-on-click` | `boolean` | `false` | Sets to select the card on click. |
| `disabled` | `boolean` | `false` | Set to show the disabled state of the card. |
| `action-button` | `string` | — | Set to show the action button. |
| `draggable` | `boolean` | `false` | Set to show the drag icon. |
| `tags-group` | `array` | — | Sets the tags for the card. |
| `supplementary-details` | `array` | — | Sets the tags for the card. |
| `clickable` | `boolean` | `false` | Set to make the card clickable. |
| `button-no-pill` | `boolean` | `false` | Set to show the no pill state for the buttons. |
| `button-state-secondary` | `string` | `default` | The state for the secondary button. Options: `default`, `error`. |
| `button-text-primary` | `string` | `Decision` | The text for the primary button. |
| `button-text-secondary` | `string` | `Way out` | The text for the secondary button. |
| `button-text-left` | `string` | `Learn more` | The text for the left button. |
| `button-truncate` | — | — |  |
| `expandable` | `boolean` | `false` | Set to show an expandable card. |

### Slots

| Slot | Description |
| --- | --- |
| `header` | Sets to customize the header. |
| `title` | Sets to customize the title. |
| `sub-title` | Sets to customize the sub title. |
| `body` | Sets to customize the body. |
| `footer` | Sets to customize the footer. |
| `image` | Sets to customize the image. |
| `icon` | Sets to customize the icon. |
| `(default)` | Sets to customize content. |

### Events

| Event | Description |
| --- | --- |
| `sc-action` | Emitted when clicking on the icon, action or drag button. Get the interacted element by event.detail.target |

### Stories

- `Default`
- `TitleInLayout`
- `TitleOutLayout`
- `HalfSize`
- `OneThirdSize`
- `Icon`

## `sc-icon` — Components/Icon

Icons are symbols that can be used to represent various options within an application. It will search system icons by default. If you prefer, you can provide more custom icon libraries by sc-icon-provider.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | The name of the icon. Refer to icon library for complete list of available icons. |
| `label` | `string` | — | An alternate description to use for assistive devices. If omitted, the icon will be considered presentational and ignored by assistive devices. |
| `size` | `string` | `sm` | The preferred size of the icon. Options: `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`. |
| `library` | `string` | — | The name of a registered icon library. If no specified library, will search all registered libraries. |

### Stories

- `Default`
- `Size`
- `ScIconLibrary`
- `CustomLibrary`

## `sc-image-card` — Components/Card/Image Card

Image card groups related information in a flexible-size container visually resembling a playing card.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `image-position` | `string` | `left` | Sets to change the image position. Options: `left`, `right`, `background`. |
| `direction` | `string` | `horizontal` | The direction of the card. Options: `horizontal`, `vertical`. |
| `src` | `string` | — | Sets the image URL. |
| `background-color` | `string` | — | Sets to change the card background color. |
| `background-position` | `string` | — | Sets to change the image background position. |
| `background-repeat` | `string` | — | Sets to change the image background repeat value. |
| `background-size` | `string` | — | Sets to change the image background size. |
| `title` | `string` | — | Sets to change the card title. |
| `title-size` | `string` | `sm` | Sets to change the title size. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `sub-title` | `string` | — | Sets to change the card sub title. |
| `sub-title-size` | `string` | `sm` | Sets to change the sub title size. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `body` | `string` | — | Sets to change the card body text. |
| `body-size` | `string` | `sm` | Sets to change the body size. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `space-size` | `string` | `sm` | Sets to change the card spacing. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `text-align` | `string` | `left` | Sets to change the card text alignment. Options: `left`, `center`, `right`, `justify`. |
| `vertical-align` | `string` | `middle` | Sets to change the card vertical alignment. Options: `top`, `middle`, `bottom`. |
| `width` | `string` | — | The preferred width for the card. |
| `height` | `string` | — | The preferred height for the card. |
| `selected` | `boolean` | `false` | Sets to select and highlight the card. |
| `hover-highlight` | `boolean` | `false` | Sets to enable hover effect. |
| `tags-group` | `array` | — | Sets the tags for the card. |
| `supplementary-details` | `array` | — | Sets the tags for the card. |
| `no-border` | `boolean` | `false` | Sets to show card without border. |
| `icon` | `string` | — | The preferred icon for card. |
| `icon-size` | `string` | `md` | The preferred size for the icon. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `icon-vertical-align` | `string` | `middle` | The preferred vertical alignment for icon. Options: `top`, `middle`, `bottom`. |
| `clickable` | `boolean` | `false` | Set to make the card clickable. |
| `button-no-pill` | `boolean` | `false` | Set to show the no pill state for the buttons. |
| `button-type-primary` | `string` | `default` | The type for the primary button. |
| `button-type-secondary` | `string` | `default` | The type for the secondary button. |
| `button-text-primary` | `string` | `Decision` | The text for the primary button. |
| `button-text-secondary` | `string` | `Way out` | The text for the secondary button. |
| `button-text-left` | `string` | `Learn more` | The text for the left button. |
| `button-truncate` | — | — |  |

### Slots

| Slot | Description |
| --- | --- |
| `header` | Sets to customize the header. |
| `prefix` | Sets to customize the prefix. |
| `suffix` | Sets to customize the suffix. |
| `title` | Sets to customize the title. |
| `sub-title` | Sets to customize the sub title. |
| `body` | Sets to customize the body. |
| `footer` | Sets to customize the footer. |
| `(default)` | Sets to customize content. |

### Events

| Event | Description |
| --- | --- |
| `sc-action` | Emitted when click on the icon. Get the interacted element by event.detail.target. |

### Stories

- `Default`
- `Direction`
- `IconAndHover`
- `SelectedAndTextAligment`
- `WithoutBorder`
- `BackgroundImage`
- `Clickable`

## `sc-label` — Components/Label

Label represents a caption for an item.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Sets the title for the label. |
| `label-size` | `string` | `sm` | The preferrred label size. Options: `sm`, `md`, `lg`. |
| `trustpoint` | `boolean` | `false` | Sets to show the title with trustpoint style. Only works when label-size is 'md' or 'lg' |
| `hint` | `string` | — | Sets the hint content. |
| `hint-placement` | `string` | `right` | The preferrred placement of the hint. Options: `top`, `bottom`, `left`, `right`. |
| `tooltip` | `string` | — | Sets the tooltip content. |
| `tooltip-placement` | `string` | `top` | The preferrred placement of the tooltip. Options: `top`, `bottom`, `left`, `right`. |
| `required` | `boolean` | `false` | Indicates whether input field is mandatory. |

### Slots

| Slot | Description |
| --- | --- |
| `label` | Sets to customize the title of label. |
| `tooltip` | Sets to customize the tooltip of label. |
| `hint` | Sets to customize the hint of label. |

### Stories

- `Default`
- `Tooltip`
- `Hint`
- `LabelSize`
- `TrustPoint`
- `HTML`

## `sc-link-card` — Components/Card/Link Card

Link card displays metadata in the link, such as images, URLs, and title descriptions. Clicking on it will redirect you to the page.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `direction` | `string` | `horizontal` | The direction of the card. Options: `horizontal`, `vertical`. |
| `src` | `string` | — | Sets the image URL. |
| `title` | `string` | — | Sets to change the card title. |
| `body` | `string` | — | Sets to change the card body text. |
| `link-text` | `string` | — | Sets to change the link text. |
| `href` | `string` | — | Sets to change the link URL. |
| `target` | `string` | `_blank` | Sets to change the link target attribute. |
| `width` | `string` | `100%` | The preferred width for the card. |
| `height` | `string` | `100%` | The preferred height for the card. |
| `tags-group` | `array` | — | Sets the tags for the card. |
| `icon` | `string` | — | The preferred icon for card. |
| `link-icon-name` | `string` | — | The icon for link. |
| `clickable` | `boolean` | `true` | Set to make the card clickable. |
| `no-actions` | `boolean` | `false` | Sets to hide the actions. |
| `actions` | `array` | — | Set to customize the actions. <br/> actions=[html`<div>Edit</div>`] |

### Slots

| Slot | Description |
| --- | --- |
| `header` | Sets to customize the header. |
| `prefix` | Sets to customize the prefix. |
| `suffix` | Sets to customize the suffix. |
| `title` | Sets to customize the title. |
| `body` | Sets to customize the body. |
| `footer` | Sets to customize the footer. |
| `(default)` | Sets to customize content. |

### Events

| Event | Description |
| --- | --- |
| `sc-action` | Emitted when click on the icon. Get the interacted element by event.detail.target. |

### Stories

- `Default`
- `Direction`
- `Icon`
- `Customize`

## `sc-list-item` — Components/List Item

List item show a single item containing title and body and allow additional customization via slot.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Sets to change the list title. |
| `title-size` | `string` | `sm` | Sets to change the title size. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `title-line` | `number` | `0` | Sets the number of line to show before it gets truncated. |
| `body` | `string` | — | Sets to change the body text. |
| `body-line` | `number` | `0` | Sets the number of line to show before it gets truncated. |

### Slots

| Slot | Description |
| --- | --- |
| `title` | Sets to customize the title. |
| `body` | Sets to customize the body. |

### Stories

- `Default`
- `TitleSize`
- `TitleOnly`
- `TruncateLine`

## `sc-paragraph` — Components/Typography/Paragraph

Used to display the paragraph in page.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `number` | `md` | Set different size of paragraph. Options: `xs`, `sm`, `md`, `lg`. |
| `ellipsis` | `boolean` | `false` | Display ellipsis when text overflows. |
| `rows` | `number` | `1` | Sets to show the text rows if ellipsis equal true. |

### Slots

| Slot | Description |
| --- | --- |
| `(default)` | The paragraph content. |

### Stories

- `Default`
- `Ellipsis`

## `sc-radio-card` — Components/Card/Radio Card

Radio card groups related information in a flexible-size container visually resembling 
          a playing card and show radio button for user action.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `radio-position` | `string` | `left` | Sets to change the radio button position. Options: `left`, `right`. |
| `title` | `string` | — | Sets to change the card title. |
| `title-size` | `string` | `sm` | Sets to change the title size. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `sub-title` | `string` | — | Sets to change the card sub title. |
| `sub-title-size` | `string` | `sm` | Sets to change the sub title size. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `body` | `string` | — | Sets to change the card body text. |
| `body-size` | `string` | `sm` | Sets to change the body size. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `space-size` | `string` | `sm` | Sets to change the card spacing. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `text-align` | `string` | `left` | Sets to change the card text alignment. Options: `left`, `center`, `right`, `justify`. |
| `vertical-align` | `string` | `middle` | Sets to change the card vertical alignment. Options: `top`, `middle`, `bottom`. |
| `width` | `string` | — | The preferred width for the card. |
| `height` | `string` | — | The preferred height for the card. |
| `tags-group` | `array` | — | Sets the tags for the card. |
| `supplementary-details` | `array` | — | Sets the tags for the card. |
| `checked` | `boolean` | `false` | Sets to select and highlight the card. |
| `hover-highlight` | `boolean` | `false` | Sets to enable hover effect. |
| `no-border` | `boolean` | `false` | Sets to show card without border. |
| `disabled` | `boolean` | `false` | Sets to disabled radio button. |
| `icon` | `string` | — | The preferred icon for card. |
| `icon-size` | `string` | `md` | The preferred size for the icon. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `icon-vertical-align` | `string` | `middle` | The preferred vertical alignment for icon. Options: `top`, `middle`, `bottom`. |
| `clickable` | `boolean` | `false` | Set to make the card clickable and get custom event i.e sc-action |

### Slots

| Slot | Description |
| --- | --- |
| `header` | Sets to customize the header. |
| `prefix` | Sets to customize the prefix. |
| `suffix` | Sets to customize the suffix. |
| `title` | Sets to customize the title. |
| `sub-title` | Sets to customize the sub title. |
| `body` | Sets to customize the body. |
| `footer` | Sets to customize the footer. |
| `(default)` | Sets to customize content. |

### Events

| Event | Description |
| --- | --- |
| `sc-change` | Emitted when the checked state changes. Get the radio state by event.detail.checked. |
| `sc-action` | Emitted when clickable=true and click on card. Get the radio state by event.detail.checked. |

### Stories

- `Default`
- `IconAndHover`
- `Selected`
- `Diasbled`
- `WithHeaderAndFooter`
- `WithoutBorder`

## `sc-tag` — Components/Tag/Tag

Tags are used as labels to organize things or to indicate a selection.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `string` | `primary` | The preferred type of tag. Options: `primary`, `success`, `warning`, `error`, `disabled`, `transparent`, `blue`, `dark-blue`, `red`, `amber`, `green`, `grey`, `black`, `white`, `grey-dash`. |
| `mode` | `string` | `default` | Sets the preferred mode. Options: `default`, `filled`, `link`. |
| `disabled` | `boolean` | `false` | Show tag as disabled. |
| `max-width` | `max-width` | `false` | Max width of the tag. |
| `icon-name` | `string` | `false` | The name of the icon. |

### Slots

| Slot | Description |
| --- | --- |
| `(default)` | Sets to customize content. |

### Stories

- `Default`
- `Primary`
- `Blue`
- `DarkBlue`
- `Success`
- `Green`
- `Warning`
- `Amber`
- `Error`
- `Red`
- `Transparent`
- `White`
- `Black`
- `Disabled`
- `Grey`
- `GreyDash`

## `sc-title` — Components/Typography/Title

Used to display the title in page.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `level` | `number` | `1` | Set content importance. Match with h1, h2, h3, h4, h5 h6. Options: `1`, `2`, `3`, `4`, `5`, `6`. |
| `ellipsis` | `boolean` | `false` | Display ellipsis when text overflows. |
| `rows` | `number` | `1` | Sets to show the text rows if ellipsis equal true. |
| `hero` | `boolean` | `false` | Set to show the hero title. |

### Slots

| Slot | Description |
| --- | --- |
| `(default)` | The title content. |

### Stories

- `Default`
- `HeroTitle`
- `Ellipsis`


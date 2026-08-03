# @scdevkit/webkit — Navigation

> Auto-generated reference. Use for component APIs: attributes, slots, events, and usage variants.

## `sc-back` — Components/Back

Back is used to display navigation link for user to navigate to previous page or differnt page.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `string` | `href` | Sets the preferred mode. Options: `href`, `history`. |
| `label` | `string` | `href` | Sets the preferred label. Options: `href`, `history`. |
| `to` | `string` | `#` | Sets the link to navigate to. |
| `disabled` | `boolean` | `false` | Show back as disabled. |

### Stories

- `Default`
- `CustomLabel`
- `Disabled`

## `sc-bottom-navbar` — Components/Bottom Navbar

Bottom navbar display two to five destinations at the bottom of a screen. 
          Each destination is represented by an icon and text label.

### Slots

| Slot | Description |
| --- | --- |
| `(default)` | Sets to customize content. |

### Events

| Event | Description |
| --- | --- |
| `sc-select` | Emitted when one of the item is selected. |

### Stories

- `Default`
- `WithBadge`

## `sc-breadcrumb-item` — Components/Breadcrumb/Breadcrumb Item

A breadcrumb items are used inside breadcrumbs 
        to represent different links.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `href` | `string` | — | URL to direct the user to when the breadcrumb item is activated. |
| `target` | `string` | — | Tells the browser where to open the link. Only used when href is set. Options: `blank`, `parent`, `self`, `top`. |

### Slots

| Slot | Description |
| --- | --- |
| `prefix` | An optional prefix, usually an icon or icon button. |
| `suffix` | An optional suffix, usually an icon or icon button. |
| `(default)` | Set to customize the content. |

### Stories

- `Default`
- `WithPrefix`
- `WithSuffix`

## `sc-breadcrumb` — Components/Breadcrumb/Breadcrumb

A breadcrumb is a list of links that help visualize navigation location, 
          it allows navigation up to any of the ancestors.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `compressed` | `boolean` | `false` | Set breadcrumb in compressed view. |
| `fill` | `boolean` | `false` | Set breadcrumb UI mode to fill. |

### Slots

| Slot | Description |
| --- | --- |
| `separator` | Sets to customize the separator. |

### Stories

- `Default`
- `Compressed`
- `Fill`
- `Custom`

## `sc-link` — Components/Link

Links are used as navigational elements and can be used on their own or inline with text.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `href` | `text` | — | URL to navigate to. |
| `block` | `boolean` | `false` | Sets to render link as block. |
| `inverse` | `boolean` | `false` | Sets link UI mode to inverse. |
| `disabled` | `boolean` | `false` | Sets to disabled the link. |
| `target` | `text` | `_self` | Link target |

### Slots

| Slot | Description |
| --- | --- |
| `(default)` | Button text |

### Stories

- `Default`
- `Block`
- `Inverse`
- `Disabled`

## `sc-list-navigation-item` — Components/List Navigation/List Navigation Item

List navigation item show a single item containing
          title and body and allow additional customization via slot.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Sets to change the list title. |
| `title-size` | `string` | `sm` | Sets to change the title size. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `title-line` | `number` | `0` | Sets the number of line to show before it gets truncated. |
| `body` | `string` | — | Sets to change the body text. |
| `body-line` | `number` | `0` | Sets the number of line to show before it gets truncated. |
| `selected` | `boolean` | `false` | Sets to show the list item as selected state. |
| `prefix` | `string` | — | Sets to change the prefix. |
| `suffix` | `string` | `arrow-ios-forward` | Sets to change the suffix icon. |
| `no-suffix` | `boolean` | `false` | Sets to show or hide suffix icon. |
| `href` | `string` | — | Sets to change the navigation URL. |
| `no-border` | `boolean` | `false` | Sets to show the list item without border. |
| `disabled` | `boolean` | `false` | Sets to show the disabled list item. |

### Slots

| Slot | Description |
| --- | --- |
| `prefix` | Sets to customize the prefix. |
| `suffix` | Sets to customize the suffix. |
| `title` | Sets to customize the title. |
| `body` | Sets to customize the body. |

### Events

| Event | Description |
| --- | --- |
| `sc-action` | Emitted when click the list navigation item. Get the interacted element by event.detail.target. |

### Stories

- `Default`
- `Selected`
- `Disabled`
- `TitleSize`
- `NoArrow`
- `TruncateLine`

## `sc-list-navigation` — Components/List Navigation/List Navigation

List navigation present information in a concise, 
          easy-to-follow format through a continuous, vertical index of text or images.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `space-size` | `string` | `none` | Sets to change the spacing. Options: `xxs`, `xs`, `sm`, `md`, `lg`, `none`. |
| `title-line` | `number` | `0` | Sets the number of line to show before it gets truncated. |
| `body-line` | `number` | `0` | Sets the number of line to show before it gets truncated. |
| `box` | `boolean` | `false` | Sets to show list navigation in box. |
| `items` | `array` | — | Set to render navigation items. If the navigation has only one category,       can render the navigation items by slot, if has multiple categories, please use this. |
| `searchable` | `boolean` | `false` | Sets to show search field. |
| `show-right-arrow` | `boolean` | `false` | Sets to show the right arrow for each list item. |
| `no-border` | `boolean` | `false` | Sets to show the border for each list item. |
| `radius` | `string` | `none` | Sets to change the box radius. Options: `xxs`, `xs`, `sm`, `md`, `lg`, `none`. |

### Events

| Event | Description |
| --- | --- |
| `sc-select` | Emitted when select the item. Get the selected keys by event.detail.selectedKeys |

### Stories

- `Default`
- `Searchable`
- `SingleCategory`
- `TitleOnly`
- `ShowRightArrow`
- `NoBorder`
- `WithPrefixIcon`
- `WithSuffixIcon`
- `DefaultSlot`
- `Box`
- `Disabled`

## `sc-pagination` — Components/Pagination

Pagination component display active page and navigate between multiple page.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `string` | `default` | The mode of the pagination. Options: `default`, `document`. |
| `size` | `string` | `sm` | The size of the pagination. Options: `sm`, `md`. |
| `alignment` | `string` | `center` | The alignment of the pagination. Options: `left`, `center`, `right`. |
| `label` | `boolean` | `false` | Set to show the label. |
| `no-truncation` | `boolean` | `false` | Set to hide truncation between pages. |
| `jump-first-last-page` | `boolean` | `true` | Set to show first page and last page jumpers. |
| `total` | `number` | `0` | The total number of the data. |
| `total-pages` | `number` | `0` | The total pages of the pagination. |
| `current-page` | `number` | `1` | The current selected page. |
| `page-size` | `number` | `10` | The size of each page. |
| `quick-jumper` | `boolean` | `false` | Sets to show the quick jumper. |
| `size-changer` | `boolean` | `false` | Sets to allow user to change the size of each page. |
| `disabled-pages` | `array` | — | Sets the pages that should be shown in a disabled state. |
| `page-size-options` | `array` | — | Set to define custom page size options. |

### Events

| Event | Description |
| --- | --- |
| `sc-change` | Emitted when the selected page changes. Get the current page number by event.detail.page        and get the page size by event.detail.pageSize. |

### Stories

- `Default`
- `SizeChanger`
- `QuickJumper`
- `CustomizedPage`
- `CustomizedPageSize`
- `CustomizedPageSizeOptions`
- `DocumentMode`

## `sc-scroll-to-top` — Components/ScrollToTop

Scroll To Top has a button to scroll the element window to the top

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `help-text` | `string` | — | Help text that will appear as tooltip. |
| `ref-element-id` | `string` | — | Element Id of the element if the scroll to top buttonis added to element other than window element. |
| `scroll-duration` | `number` | — | Scroll duration in milliseconds. |
| `scroll-threshold` | `number` | — | The scrolling threshold after which the scroll to top button should appear. |

### Stories

- `Default`
- `InsideDivElement`
- `WithThreshold`
- `WithscrollDuration`

## `sc-tabs` — Components/Tabs

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `alignment` | `string` | `left` |  Options: `left`, `center`. |
| `type` | `string` | `outline` |  Options: `outline`, `filled`, `segmented`. |
| `show-tabs-bottom-line` | `boolean` | `false` |  |

### Events

| Event | Description |
| --- | --- |
| `sc-tab-select` | Emitted when select a tab. Get the tab name by event.detail.name. |
| `sc-close` | Emitted when close a tab. Get the closed tab by event.detail.tab. Get the name of closed tab by event.detail.name. |
| `sc-tab-hide` | Emitted when a tab is hidden. Get the tab name by event.detail.name. |
| `sc-tab-show` | Emitted when a tab is shown. Get the tab name by event.detail.name. |

### Stories

- `Default`
- `TabDivider`
- `NoBottomLine`
- `Closeable`
- `Filled`
- `Segmented`


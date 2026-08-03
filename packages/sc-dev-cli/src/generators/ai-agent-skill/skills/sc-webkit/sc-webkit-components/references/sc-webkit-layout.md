# @scdevkit/webkit — Layout

> Auto-generated reference. Use for component APIs: attributes, slots, events, and usage variants.

## `sc-accordion` — Components/Accordion

Accordion show a brief summary and expand to show additional content.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `summary` | `string` | — | Sets to change the summary text. |
| `summary-line` | `number` | `0` | Sets the number of line to show before it gets truncated. |
| `label-size` | `string` | `sm` | Sets to change the label size. Options: `sm`, `md`, `lg`. |
| `icon-position` | `string` | `right` | The preferred position of the icon. Options: `left`, `right`. |
| `sub-summary` | `string` | — | Sets to change the sub summary text. |
| `tooltip` | `string` | — | Sets tooltip after the summary text. |
| `border` | `boolean` | `false` | Sets to if the accordion have border or not. |
| `open` | `boolean` | `false` | Sets to expands accordion. |
| `disabled` | `boolean` | `false` | Disables the details so it can’t be toggled. |

### Slots

| Slot | Description |
| --- | --- |
| `summary` | Sets to customize the summary text. |
| `label-content` | Sets to customize the label text, please set this slot only when the icon-position is left. |
| `(default)` | Sets to customize content. |

### Events

| Event | Description |
| --- | --- |
| `sc-show` | Emitted when the accordion opens. Get the state by event.detail.open. |
| `sc-hide` | Emitted when the accordion closes. Get the state by event.detail.open. |

### Stories

- `Default`
- `IconLeft`
- `IconRight`
- `Label`
- `WithBorder`
- `Expand`
- `Disabled`

## `sc-box` — Components/Box

The Box component is a generic container for grouping other components.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `view` | `string` | `default` | Sets the preferred box view. Options: `default`, `outline`. |
| `type` | `string` | `default` | Sets the preferred box type. Options: `default`, `info`, `success`, `warning`, `error`, `disabled`, `transparent`. |
| `space-size` | `string` | `sm` | The preferred space size for box. Options: `xxs`, `xs`, `sm`, `md`, `lg`, `none`. |
| `radius` | `string` | `sm` | The preferred radius of box. Options: `xxs`, `xs`, `sm`, `md`, `lg`, `none`. |
| `height` | `string` | `auto` | The preferred height for the box. |

### Slots

| Slot | Description |
| --- | --- |
| `(default)` | Sets to customize content. |

### Stories

- `Default`
- `Success`
- `Warning`
- `Error`
- `Transparent`

## `sc-column-layout` — Layout/Column Layout

Column layout is a generic layout to show grouping of info in grid

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Sets page title |
| `layout` | `string` | `Main Content Right` | Sets the preferred page layout. Options: `Main Content Right`, `Main Content Left`, `Main Content Middle`, `Main Content Full`. |
| `height` | `string` | `auto` | Set if layout height = page height - header offset - breadcrumb offset - additional offset. Options: `cover`, `auto`. |
| `hide-zoom` | `boolean` | `false` | Sets if hide the default zoom in/out icon. |
| `left-column-collapsible` | `boolean` | `false` | Sets if left grid can be collapsible. |
| `left-column-collapse` | `boolean` | `false` | Sets if left grid collapse by default. |
| `left-divider-invisible` | `boolean` | `false` | Sets if hide the divider between left and main part. |
| `left-header-divider` | `boolean` | `false` | Sets if show the divider between left header and left slot part. |
| `right-column-collapsible` | `boolean` | `false` | Sets if right grid can be collapsible. |
| `right-column-collapse` | `boolean` | `false` | Sets if right grid collapse by default. |
| `right-divider-invisible` | `boolean` | `false` | Sets if hide the divider between right and main part. |
| `right-header-divider` | `boolean` | `false` | Sets if show the divider between right header and right slot part. |
| `right-column-size` | `string` | `md` | Sets to adjust the width of right column. Options: `sm`, `md`, `lg`. |
| `fix-sticky-bar` | `boolean` | `false` | Sets if sticky breadcrumb and buttons fix at top. |
| `custom-icons` | `array` | — | Sets if want to add some customized user actions by configuring icons. |
| `additional-height` | `string` | `0px` | Sets if more space needed besides title and breadcrumb |

### Slots

| Slot | Description |
| --- | --- |
| `title` | Sets to customize the title. |
| `breadcrumb` | Sets to customize the breadcrumb, it does not work if there is sticky-breadcrumb or sticky-button. |
| `sticky-breadcrumb` | Sets to customize the breadcrumb which will be sticky when scrolling. |
| `sticky-button` | Sets to sticky the button when scrolling. |
| `additional` | Sets to customize additional content below title and breadcrumb. |
| `left-header` | Sets to customize additional content in the top of left part. |
| `right-header` | Sets to customize additional content in the top of left part. |
| `content` | Sets to customize main content when using "Full" layout. |
| `left` | Sets to customize left content when not using "Full" layout. |
| `right` | Sets to customize right content when not using "Full" layout. |
| `middle` | Sets to customize right content when not using "Full" layout. |

### Events

| Event | Description |
| --- | --- |
| `sc-action` | Emitted when collapse/expand the left and right column. Get the value by event.detail.action and event.detail.value. |

### Stories

- `Default`
- `MainContentFull`
- `MainContentLeft`
- `MainContentMiddle`
- `LeftColumnCollapsible`
- `RightColumnCollapsible`
- `Custom`
- `StickyHeader`

## `sc-divider` — Components/Divider

Divider are used to visually separate or group elements.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `string` | `xxs` | The preferred size of the divider. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `mode` | `string` | `default` | The preferred mode of the divider. Options: `default`, `filled`, `card-header`. |
| `compact` | `boolean` | `false` | Draws the divider without margin. |
| `line-width` | `string` | `xxs` | The preferred line width of the divider. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `line-height` | `string` | `xxs` | The preferred lie height of the divider. Options: `xxs`, `xs`, `sm`, `md`, `lg`. |
| `text-align` | `string` | `center` | The preferred text alignment of the divider. Options: `left`, `center`, `right`. |
| `vertical` | `boolean` | `false` | Draws the divider in a vertical orientation. |
| `title` | `string` | — | Set the label of the divider. |
| `card-number` | `number` | — | Add a front number to the card header. |
| `optional-text` | `boolean` | `false` | Show an '(optional)' text on the card header. |

### Slots

| Slot | Description |
| --- | --- |
| `title` | Set to customize the content. |

### Stories

- `Default`
- `CardHeader`
- `TextDivider`
- `FilledDivider`
- `LineDivider`

## `sc-grid-column` — Components/Grid/Grid Column

Columns are used to organize and align grid items vertically within the grid container. <br />
        To use it, need import ScGridStyle from '@scdevkit/webkit/styles/ScGridStyle.js'; <br />
        Then add ScGridStyle into static css, static styles = css`${ScGridStyle}`;

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `auto` | `boolean` | `false` | Sets the column to auto width |
| `col-1` | `boolean` | `false` | Sets the column’s width to 1/12 |
| `col-2` | `boolean` | `false` | Sets the column’s width to 2/12 |
| `col-3` | `boolean` | `false` | Sets the column’s width to 3/12 |
| `col-4` | `boolean` | `false` | Sets the column’s width to 4/12 |
| `col-5` | `boolean` | `false` | Sets the column’s width to 5/12 |
| `col-6` | `boolean` | `false` | Sets the column’s width to 6/12 |
| `col-7` | `boolean` | `false` | Sets the column’s width to 7/12 |
| `col-8` | `boolean` | `false` | Sets the column’s width to 8/12 |
| `col-9` | `boolean` | `false` | Sets the column’s width to 9/12 |
| `col-10` | `boolean` | `false` | Sets the column’s width to 10/12 |
| `col-11` | `boolean` | `false` | Sets the column’s width to 11/12 |
| `col-12` | `boolean` | `false` | Sets the column’s width to 12/12 |
| `xs` | `string` | — | Sets the column’s width in xs screen Options: `auto`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11`, `12`. |
| `sm` | `string` | — | Sets the column’s width in sm screen Options: `auto`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11`, `12`. |
| `md` | `string` | — | Sets the column’s width in md screen Options: `auto`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11`, `12`. |
| `lg` | `string` | — | Sets the column’s width in lg screen Options: `auto`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11`, `12`. |
| `xl` | `string` | — | Sets the column’s width in xl screen Options: `auto`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11`, `12`. |
| `xxl` | `string` | — | Sets the column’s width in xxl screen Options: `auto`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11`, `12`. |

### Slots

| Slot | Description |
| --- | --- |
| `(default)` | Grid column text |

### Stories

- `Default`
- `MultiColumns`

## `sc-grid-container` — Components/Grid/Grid Container

Container is the parent element that contains all the items (rows and columns) within the grid system. <br />
        To use it, need import ScGridStyle from '@scdevkit/webkit/styles/ScGridStyle.js'; <br />
        Then add ScGridStyle into static css, static styles = css`${ScGridStyle}`;

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `fluid` | `boolean` | `false` | Sets to change the container to fluid mode |

### Slots

| Slot | Description |
| --- | --- |
| `(default)` | Grid container text |

### Stories

- `Default`
- `Fluid`

## `sc-grid-row` — Components/Grid/Grid Row

Rows are used to organize and align grid items horizontally across the grid container. <br />
        To use it, need import ScGridStyle from '@scdevkit/webkit/styles/ScGridStyle.js'; <br />
        Then add ScGridStyle into static css, static styles = css`${ScGridStyle}`;

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `no-gutters` | `boolean` | `false` | Sets to change the row with no gutters |

### Slots

| Slot | Description |
| --- | --- |
| `(default)` | Grid row text |

### Stories

- `Default`
- `NoGutters`

## `sc-landing-layout` — Layout/Landing Layout

Landing layout is a generic layout to show banner and content

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `height` | `string` | `auto` | Set if layout covers full window height Options: `cover`, `auto`. |
| `banner-title` | `string` | — | Sets banner title |
| `banner-body` | `string` | — | Sets to change the banner body. |
| `banner-text-alignment` | `string` | `left` | The preferred alignment of the banner title and description. Options: `left`, `center`, `right`. |
| `banner-image-src` | `string` | — | Sets to show a image at the right of banner. |
| `banner-image-position` | `string` | `right` | Sets to show the image at the right or left of banner. Options: `left`, `right`. |

### Slots

| Slot | Description |
| --- | --- |
| `banner-title` | Sets to customize the banner title. |
| `banner-body` | Sets to customize the banner description. |
| `content` | Sets to customize the page content. |

### Stories

- `Default`
- `WithImage`

## `sc-scrollbar` — Components/Scrollbar

### Stories

- `ScrollableChild`
- `ScrollableSibling`
- `ScrollableSelector`
- `MultipleSync`
- `RightToLeft`

## `sc-search-layout` — Layout/Search Layout

Search layout is a generic layout to show search criteria and search result

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Sets title |
| `description` | `string` | — | Sets description |
| `hide-image` | `boolean` | `false` | Sets if hide the image at the right position of banner. |
| `image-src` | `string` | — | Sets custom image src |
| `multiple-search` | `boolean` | `false` | Sets to show only one search field or both basic and advanced search fields. |
| `single-search-placeholder` | `string` | — | Sets placeholder of single search field |
| `loading` | `boolean` | `false` | Show spinner in the search result area |

### Slots

| Slot | Description |
| --- | --- |
| `title` | Sets to customize the title. |
| `description` | Sets to customize the description. |
| `basic-search` | Sets to customize the basic search conditions. |
| `advance-search` | Sets to customize the advance search conditions. |
| `result` | Sets to customize the search result. |
| `empty-message` | Sets to customize the message when there isn't search result. |

### Stories

- `Default`
- `EmptyMessage`

## `sc-spacer` — Components/Spacer

Spacer are used to create some white-space between elements.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `vertical` | `boolean` | `false` | Draws the spacer in a vertical orientation. |
| `size` | `string` | `04` | Set the size of the spacer. Options: `04`, `08`, `12`, `16`, `20`, `24`, `32`, `40`, `48`, `56`, `64`. |

### Stories

- `Default`
- `Horizontal`
- `Vertical`

## `sc-sticky-panel` — Components/Sticky Panel

Sticky panel have fixed position at the top of the screen and show a brief summary and expand to show additional content.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `summary` | `string` | — | Header text. |
| `summary-line` | `number` | `0` | Sets the number of line to show before it gets truncated. |
| `open` | `boolean` | `false` | Sets to expands accordion. |
| `disabled` | `boolean` | `false` | Disables the details so it can’t be toggled. |

### Slots

| Slot | Description |
| --- | --- |
| `summary` | Sets to customize the summary text. |
| `(default)` | Sets to customize content. |

### Events

| Event | Description |
| --- | --- |
| `sc-show` | Emitted when the accordion opens. Get the state by event.detail.open. |
| `sc-hide` | Emitted when the accordion closes. Get the state by event.detail.open. |

### Stories

- `Default`
- `Expand`
- `Disabled`


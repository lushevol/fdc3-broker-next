# @scdevkit/webkit — Data & Tables

> Auto-generated reference. Use for component APIs: attributes, slots, events, and usage variants.

## `sc-area-chart` — Data Visualisation/Area Chart

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `object` | — | Sets the chart data |
| `fill` | `string` | `origin` | Set the chart fill. |
| `width` | `number` | — | Sets chart width |
| `height` | `number` | — | Sets chart height |
| `chart-title` | `object` | — | Sets the chart title |
| `palette` | `string` | `default` | Sets the color palette for the chart Options: `default`, `risk`, `accessible`, `custom`. |
| `custom-colors` | `array` | — | Sets the custom colors for the chart |
| `hide-legend` | `boolean` | `false` | Sets if hide legend on chart. |
| `legend` | `object` | — | Sets the chart legend |
| `interaction` | `object` | — | Sets the chart interaction |
| `tooltip` | `object` | — | Sets the chart tooltip |
| `x-axis` | `object` | — | Sets the x Axis |
| `y-axis` | `object` | — | Sets the x Axis |
| `horizontal-grid-lines` | `object` | — | Sets the horizontal grid lines |
| `vertical-grid-lines` | `object` | — | Sets the vertical grid lines |
| `margin` | `object` | — | Sets the chart margin |
| `hide-legend-on-hint` | `boolean` | `false` | Sets if hide legend on tooltip. |

### Stories

- `Default`
- `ChartWithPoint`
- `ChartWithNoTension`
- `ChartWithNoTooltip`
- `ChartWithTitleAndLegendAtBottom`

## `sc-bar-chart` — Data Visualisation/Bar Chart

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `object` | — | Sets the chart data |
| `width` | `number` | — | Sets chart width |
| `height` | `number` | — | Sets chart height |
| `chart-title` | `object` | — | Sets the chart title |
| `palette` | `string` | `default` | Sets the color palette for the chart Options: `default`, `risk`, `accessible`, `custom`. |
| `custom-colors` | `array` | — | Sets the custom colors for the chart |
| `hide-legend` | `boolean` | `false` | Sets if hide legend on chart. |
| `legend` | `object` | — | Sets the chart legend |
| `interaction` | `object` | — | Sets the chart interaction |
| `tooltip` | `object` | — | Sets the chart tooltip |
| `horizontal` | `true` | — | Sets if horizontal chart. |
| `x-axis` | `object` | — | Sets the x Axis |
| `y-axis` | `object` | — | Sets the x Axis |
| `horizontal-grid-lines` | `object` | — | Sets the horizontal grid lines |
| `vertical-grid-lines` | `object` | — | Sets the vertical grid lines |
| `margin` | `object` | — | Sets the chart margin |
| `hide-legend-on-hint` | `boolean` | `false` | Sets if hide legend on tooltip. |

### Stories

- `Default`
- `ChartWithTitleAndNoLegend`
- `ChartWithCustomizedTooltip`
- `HorizontalChart`
- `ChartWithIndexMode`
- `ChartWithTimeAxis`

## `sc-bubble-chart` — Data Visualisation/Bubble Chart

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `object` | — | Sets the chart data |
| `width` | `number` | — | Sets chart width |
| `height` | `number` | — | Sets chart height |
| `chart-title` | `object` | — | Sets the chart title |
| `palette` | `string` | `default` | Sets the color palette for the chart Options: `default`, `risk`, `accessible`, `custom`. |
| `custom-colors` | `array` | — | Sets the custom colors for the chart |
| `hide-legend` | `boolean` | `false` | Sets if hide legend on chart. |
| `legend` | `object` | — | Sets the chart legend |
| `tooltip` | `object` | — | Sets the chart tooltip |
| `horizontal-grid-lines` | `object` | — | Sets the horizontal grid lines |
| `vertical-grid-lines` | `object` | — | Sets the vertical grid lines |
| `margin` | `object` | — | Sets the chart margin |
| `hide-legend-on-hint` | `boolean` | `false` | Sets if hide legend on tooltip. |

### Stories

- `Default`
- `ChartWithTitle`

## `sc-data-view` — Table/Data View

Data View is a component that provides a partial view with the data.

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `array` | — | Sets the data. |
| `compact` | `boolean` | `false` | Enable compact mode. Make the row height lower |
| `mode` | `string` | `table` | The view mode. Options: `table`, `view`. |
| `columns` | `number` | `1` | Sets how many columns in each row. |
| `horizontal-align` | `string` | `left` | Horizontal alignment of text inside cell. Options: `left`, `center`, `right`. |
| `vertical-align` | `string` | `middle` | Vertical alignment of text inside cell. Options: `top`, `middle`, `bottom`. |

### Stories

- `Default`
- `ViewMode`
- `CustomData`
- `ViewModeWithCustomData`
- `CustomDataWithAligment`

## `sc-doughnut-chart` — Data Visualisation/Doughnut Chart

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `object` | — | Sets the chart data |
| `width` | `number` | — | Sets chart width |
| `height` | `number` | — | Sets chart height |
| `chart-title` | `object` | — | Sets the chart title |
| `palette` | `string` | `default` | Sets the color palette for the chart Options: `default`, `risk`, `accessible`, `custom`. |
| `custom-colors` | `array` | — | Sets the custom colors for the chart |
| `hide-legend` | `boolean` | `false` | Sets if hide legend on chart. |
| `legend` | `object` | — | Sets the chart legend |
| `tooltip` | `object` | — | Sets the chart tooltip |
| `margin` | `object` | — | Sets the chart margin |
| `hide-legend-on-hint` | `boolean` | `false` | Sets if hide legend on tooltip. |

### Stories

- `Default`
- `ChartWithoutLegend`
- `ChartWithoutLegendOnHint`

## `sc-gauge-chart` — Data Visualisation/Gauge Chart

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `width` | `number` | — | Sets chart width |
| `height` | `number` | — | Sets chart height |
| `min` | `number` | `0` | Sets chart min value |
| `max` | `number` | `100` | Sets chart max value |
| `value` | `number` | — | Sets chart value |
| `value-size` | `number` | `24` | Sets font size of chart value |
| `label-size` | `number` | `14` | Sets font size of chart label |
| `value-color` | `string` | `--sc-color-grey-600` | Sets font color of value.        For all colors, please refer <a href='index.html?path=/story/colors--all'>here</a> |
| `label-color` | `string` | `--sc-color-grey-600` | Sets font color of label.        For all colors, please refer <a href='index.html?path=/story/colors--all'>here</a> |
| `donut` | `boolean` | `false` | Sets if show donut chart |
| `chart-title` | `object` | — | Sets the chart title |
| `margin` | `object` | — | Sets the chart margin |

### Stories

- `Default`
- `ChartWithCustomizedStyle`
- `ChartWithDonut`

## `sc-line-chart` — Data Visualisation/Line Chart

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `object` | — | Sets the chart data |
| `width` | `number` | — | Sets chart width |
| `height` | `number` | — | Sets chart height |
| `chart-title` | `object` | — | Sets the chart title |
| `palette` | `string` | `default` | Sets the color palette for the chart Options: `default`, `risk`, `accessible`, `custom`. |
| `custom-colors` | `array` | — | Sets the custom colors for the chart |
| `hide-legend` | `boolean` | `false` | Sets if hide legend on chart. |
| `legend` | `object` | — | Sets the chart legend |
| `interaction` | `object` | — | Sets the chart interaction |
| `tooltip` | `object` | — | Sets the chart tooltip |
| `x-axis` | `object` | — | Sets the x Axis |
| `y-axis` | `object` | — | Sets the x Axis |
| `horizontal-grid-lines` | `object` | — | Sets the horizontal grid lines |
| `vertical-grid-lines` | `object` | — | Sets the vertical grid lines |
| `margin` | `object` | — | Sets the chart margin |
| `hide-legend-on-hint` | `boolean` | `false` | Sets if hide legend on tooltip. |

### Stories

- `Default`
- `ChartWithTension`
- `ChartWithPointStyle`
- `ChartWithTitle`
- `ChartWithCustomizedTooltip`
- `ChartWithTimeAxis`

## `sc-pie-chart` — Data Visualisation/Pie Chart

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `object` | — | Sets the chart data |
| `width` | `number` | — | Sets chart width |
| `height` | `number` | — | Sets chart height |
| `chart-title` | `object` | — | Sets the chart title |
| `palette` | `string` | `default` | Sets the color palette for the chart Options: `default`, `risk`, `accessible`, `custom`. |
| `custom-colors` | `array` | — | Sets the custom colors for the chart |
| `hide-legend` | `boolean` | `false` | Sets if hide legend on chart. |
| `legend` | `object` | — | Sets the chart legend |
| `tooltip` | `object` | — | Sets the chart tooltip |
| `margin` | `object` | — | Sets the chart margin |
| `hide-legend-on-hint` | `boolean` | `false` | Sets if hide legend on tooltip. |

### Stories

- `Default`
- `ChartWithoutLegend`
- `ChartWithoutLegendOnHint`

## `sc-polar-area-chart` — Data Visualisation/Polar Area Chart

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `object` | — | Sets the chart data |
| `width` | `number` | — | Sets chart width |
| `height` | `number` | — | Sets chart height |
| `chart-title` | `object` | — | Sets the chart title |
| `palette` | `string` | `default` | Sets the color palette for the chart Options: `default`, `risk`, `accessible`, `custom`. |
| `custom-colors` | `array` | — | Sets the custom colors for the chart |
| `hide-legend` | `boolean` | `false` | Sets if hide legend on chart. |
| `legend` | `object` | — | Sets the chart legend |
| `tooltip` | `object` | — | Sets the chart tooltip |
| `margin` | `object` | — | Sets the chart margin |
| `hide-legend-on-hint` | `boolean` | `false` | Sets if hide legend on tooltip. |

### Stories

- `Default`
- `ChartWithTitle`

## `sc-rader-chart` — Data Visualisation/Radar Chart

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `object` | — | Sets the chart data |
| `width` | `number` | — | Sets chart width |
| `height` | `number` | — | Sets chart height |
| `chart-title` | `object` | — | Sets the chart title |
| `palette` | `string` | `default` | Sets the color palette for the chart Options: `default`, `risk`, `accessible`, `custom`. |
| `custom-colors` | `array` | — | Sets the custom colors for the chart |
| `legend` | `object` | — | Sets the chart legend |
| `hide-legend` | `boolean` | `false` | Sets if hide legend on chart. |
| `tooltip` | `object` | — | Sets the chart tooltip |
| `margin` | `object` | — | Sets the chart margin |
| `hide-legend-on-hint` | `boolean` | `false` | Sets if hide legend on tooltip. |

### Stories

- `Default`
- `ChartWithTitle`

## `sc-scatter-chart` — Data Visualisation/Scatter Chart

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `object` | — | Sets the chart data |
| `width` | `number` | — | Sets chart width |
| `height` | `number` | — | Sets chart height |
| `chart-title` | `object` | — | Sets the chart title |
| `palette` | `string` | `default` | Sets the color palette for the chart Options: `default`, `risk`, `accessible`, `custom`. |
| `custom-colors` | `array` | — | Sets the custom colors for the chart |
| `hide-legend` | `boolean` | `false` | Sets if hide legend on chart. |
| `legend` | `object` | — | Sets the chart legend |
| `tooltip` | `object` | — | Sets the chart tooltip |
| `horizontal-grid-lines` | `object` | — | Sets the horizontal grid lines |
| `vertical-grid-lines` | `object` | — | Sets the vertical grid lines |
| `margin` | `object` | — | Sets the chart margin |
| `hide-legend-on-hint` | `boolean` | `false` | Sets if hide legend on tooltip. |

### Stories

- `Default`
- `ChartWithTitle`

## `sc-stacked-bar-chart` — Data Visualisation/Stacked Bar Chart

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `object` | — | Sets the chart data |
| `width` | `number` | — | Sets chart width |
| `height` | `number` | — | Sets chart height |
| `chart-title` | `object` | — | Sets the chart title |
| `palette` | `string` | `default` | Sets the color palette for the chart Options: `default`, `risk`, `accessible`, `custom`. |
| `custom-colors` | `array` | — | Sets the custom colors for the chart |
| `hide-legend` | `boolean` | `false` | Sets if hide legend on chart. |
| `legend` | `object` | — | Sets the chart legend |
| `tooltip` | `object` | — | Sets the chart tooltip |
| `horizontal` | `true` | — | Sets if horizontal chart. |
| `x-axis` | `object` | — | Sets the x Axis |
| `y-axis` | `object` | — | Sets the x Axis |
| `horizontal-grid-lines` | `object` | — | Sets the horizontal grid lines |
| `vertical-grid-lines` | `object` | — | Sets the vertical grid lines |
| `margin` | `object` | — | Sets the chart margin |
| `hide-legend-on-hint` | `boolean` | `false` | Sets if hide legend on tooltip. |

### Stories

- `Default`
- `HorizontalChart`
- `ChartWithTitleAndLeftLengend`

## `sc-table` — Table/Table

…

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `conf` | `object` | — | Set to config the header. |
| `data` | `array` | — | Set to render the rows. |
| `sticky-header` | `boolean` | `false` | Set to show the sticky header. |
| `compact` | `boolean` | `false` | Enable compact mode. Make the row height lower |
| `column-chooser` | `boolean` | `false` | Set to show the checkbox. |
| `select-all-rows` | `boolean` | `false` | Set to select all row by default if set column-chooser as true. |
| `hide-header` | `boolean` | `false` | Set to hide the header. |
| `select-scope` | `string` | `all` | Set to control select behaviour when set column-chooser as true.        all -> select all rows of all pages       page -> select all rows of current page Options: `all`, `page`. |
| `expandable` | `boolean` | `false` | Set to enable nested row. |
| `expand-mode` | `string` | `multiple` | Set to change different expand mode. Support 'single-only' and 'multiple' currently Options: `single-only`, `multiple`. |
| `rowExpandable` | `Function: (rowData) => number` | — | Set to control whether row can be expand or not.        Valid return value is 0[non-expandable], 1[expandable], 2[expanded by default].  -------  Arguments:  **rowData**: Data for each row |
| `rowExpandRender` | `Function: (rowData) => TemplateResult` | — | Set to control what content should be render.  -------  Arguments:  **rowData**: Data for each row |
| `selectedRows` | `Function: (rowData) => boolean` | — | Set to control which row should be selected if set column-chooser as true.  -------  Arguments:  **rowData**: Data for each row |
| `pagination` | `boolean` | `false` | Set to show the pagination. |
| `total` | `number` | `0` | The total size of the pagination, will equals to the row data length if don't set it. |
| `page-size` | `number` | `10` | The size of each page. |
| `quick-jumper` | `boolean` | `false` | Set to show the quick jumper. |
| `size-changer` | `boolean` | `false` | Set to allow user to change the size of each page. |
| `sort` | `string` | — | Sets the default sortale header, the format should be {property},{direction}, e.g 'fruit,asc'.        It will only take effect when use <sc-table-column> and set the column type as sort. |

### Events

| Event | Description |
| --- | --- |
| `sc-page-change` | Emitted when the selected page changes. Get the current page number by event.detail.page and        get the page size by event.detail.pageSize. |
| `sc-sort` | Emitted when the sorting direction changed.        Get the string which format is `${column},${key}` and order by event.detail.value. |
| `sc-filter` | Emitted when the filter conditions changed. get selected filter items by event.detail.value and current column property by event.detail.property |
| `sc-select` | Emitted when click the checkbox in each row if set column-chooser as true.        The value include selectAll and selectedData which indicate if the select all checkbox is ticked.       If has nested table, will include a map named selectedSubTableData which indicate selected child table rows. |
| `sc-tr-create` | Emitted when the tr is created. Get the current row element by event.detail.tr and        get the row index by event.detial.lineIndex and get the row data by event.detail.item. |
| `sc-tr-mouseover` | Emitted when the mouse is over on the tr. Get the interacted element by event.detail. |
| `sc-tr-mouseout` | Emitted when the mouse is out of the tr. Get the interacted element by event.detail. |
| `sc-tr-tap` | Emitted when click on tr. Get the interacted element by event.detail.element. Get the row data by event.detail.value. |
| `sc-tr-expanded` | Emitted when a row expanded. Get the data of expanded row by event.detail.value. |

### Stories

- `Default`
- `Empty`
- `Pagination`
- `Chooser`
- `FilterableTable`
- `StickyColumn`


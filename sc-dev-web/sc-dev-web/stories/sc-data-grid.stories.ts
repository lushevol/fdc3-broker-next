import type { Meta, StoryObj } from '@storybook/web-components';
// @ts-ignore
import { default as serialize } from 'serialize-javascript';

import { ScDataGrid } from '../src/components/ScDataGrid/ScDataGrid.js';
import { html, nothing } from 'lit';
import { RowData, TColumn } from '../src/components/ScDataGrid/types/ColumnDef.js';
import { ColumnSpanningDef } from '../src/components/ScDataGrid/types/features/ColumnSpanningDef.js';
import { ref } from 'lit/directives/ref.js';
import { getDefaultValues, setPropertyAutomatically } from '../src/shared/storybook.decorators.js';

// @ts-ignore
import { faker } from '@faker-js/faker';
import { Column, Row, Table } from '@tanstack/lit-table';
import { FilterWidgetProps } from '../src/components/ScDataGrid/types/features/ColumnFilterDef.js';

// @ts-ignore
import { MainIconLibrary } from '@scdevkit/icons/libraries/MainIconLibrary.js';
// @ts-ignore
window.MainIconLibrary = MainIconLibrary;

type properties = InstanceType<typeof ScDataGrid>;

const WARNNING = `
  <br/>
  <span style="font-weight: bold; color: #d50000;">The example below is solely intended to highlight available features of the table. For implementation please follow table patterns and best practices.</span>
`;

const gData = (number: number) => {
  const now = Date.now();
  return Array(number)
  .fill(1)
  .map((_, index) => {
    return {
      uuid: (now + index).toString(36),
      firstName: `${faker.person.firstName()}`,
      lastName: faker.person.lastName(),
      age: faker.number.int(30),
      visits: faker.number.int(20),
      progress: faker.number.int(100),
      date: new Date(faker.date.anytime()),
      isAdult: faker.datatype.boolean(),
      object: {
        value: faker.person.bio(),
      },
      status: 'status',
    };
  });
};

const data = gData(20);

const generateCode = (template: string) => {
  return {
    source: {
      code: template,
      language: 'html',
    },
  };
};

const columns: TColumn<RowData, any>[] = [
  {
    property: 'firstName',
    header: 'First name',
    flex: 1,
    enableResizing: true,
  },
  {
    property: 'lastName',
    header: 'Last name',
    minSize: 60,
    flex: 2,
  },
  {
    property: 'age',
    minSize: 40,
  },
  {
    property: 'visits',
  },
];

const gSpanningColumn = (() => {
  let index = 0;
  return (options: {
    colSpanning?: ColumnSpanningDef<unknown, unknown>['colSpanning'];
    pinned?: 'left' | 'right';
    size?: number;
  }) => {
    index++;
    return {
      size: options.size ?? 150,
      property: `property${index}`,
      id: `id${index}`,
      header: `${index} - header`,
      cell: `${index} - cell`,
      colSpanning: options.colSpanning,
      pinned: options.pinned,
    } as TColumn<RowData, any>;
  };
})();

let elementIndex = 0;
const renderTemplate = (
  opts: {
    emptySlot?: any;
    actionsButtonSlot?: any;
    headerActionsButtonSlot?: any;
    dataExportSlot?: any;
    sort?: any;
    page?: any;
    filter?: any;
    change?: any;
    columnOrder?: any;
    apiFunction?: (grid?: ScDataGrid) => void;
  } = {}
) => {
  const id = `sc-data-grid${elementIndex++}`;
  return (args: ScDataGrid) => {
    return html`
      <sc-icon-provider>
        <div style="height: 340px;">
          <sc-data-grid
            id=${id}
            ${ref(element => {
              if (element) {
                element.addEventListener('sc-sort', e => {
                  opts.sort?.(e, element);
                });
                element.addEventListener('sc-filter', e => {
                  opts.filter?.(e, element);
                });
                element.addEventListener('sc-page-change', e => {
                  opts.page?.(e, element);
                });
                element.addEventListener('sc-change', e => {
                  opts.change?.(e, element);
                });
                element.addEventListener('sc-column-order', e => {
                  opts.columnOrder?.(e, element);
                });
                opts.apiFunction
                  ? opts.apiFunction(element as ScDataGrid)
                  : null;
              }
            })}
            ${ref(element => {
              const elementWithType = element as unknown as ScDataGrid;
              if (elementWithType) {
                setPropertyAutomatically(
                  elementWithType,
                  args,
                  (ScDataGrid as any).argTypes
                );
              }
            })}
          >
            ${opts.emptySlot ? opts.emptySlot() : nothing}
            ${opts.actionsButtonSlot ? opts.actionsButtonSlot() : nothing}
            ${opts.dataExportSlot ? opts.dataExportSlot() : nothing}
            ${opts.headerActionsButtonSlot
              ? opts.headerActionsButtonSlot()
              : nothing}
          </sc-data-grid>
        </div>
        <script>
          // get your own data and columns then set on <sc-data-grid>
          // like <sc-data-grid .data=\${your own data} .columns=\${your own columns}></sc-data-grid>
        </script>
      </sc-icon-provider>
      <script>
        (() => {
          const providers = Array.from(
            document.getElementsByTagName('sc-icon-provider')
          );
          providers[providers.length - 1].iconLibraries = [
            window.MainIconLibrary,
          ];
        })();
      </script> `;
  };
};

const meta: Meta<properties> = {
  title: 'Table/Data Grid',
  component: 'sc-data-grid',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Column Definitions

Column definitions are plain objects with the following options

| Name | Type | Description | Optional | Default |
| ---- | ---- | ----------- | -------- | ------- |
| id | string | The unique identifier for the column | Optional when property or header is string | - |
| property | string OR (originalRow: RowData, index: number) => any | A string or function to use when extracting the value for the column, it is MANDATORY for sorting and filtering features | no | - |
| header | string OR ((props: {table: Table<RowData>,header: Header<RowData>,column: Column<RowData>}) => unknown) | Display for header.  | yes | - |
| cell | string OR ((props: {table: Table<RowData>,row: Row<RowData>,column: Column<RowData>,cell: Cell<RowData>,getValue: () => any,renderValue: () => any}) => unknown) | The cell to display each row for the column | yes | - |
| columns | ColumnDefintions[] | The child column definitions to include in a group column | yes | - |
| pinned | 'left' OR 'right' | Pinned column to left or right | yes | - |
| colSpanning | number OR ((table: Table<RowData>,column: Column<RowData>,row: Row<RowData>,cell: Cell<RowData, unknow>) => number) | Allow cells to span multiple columns, return 1 means no spanning | yes | - |
| rowSpanning | boolean OR (cell1: CellType, cell2: cellType) => boolean | Allow cells to span multiple rows | yes | - |
| sortable | boolean | Enable or disable sorting the column | yes | false |
| sortingOrder | ('asc' OR 'desc' OR 'none')[] | Controll sorting order for the column | yes | ascending -> descending -> none |
| sort | 'asc' OR 'desc' OR 'none' | Default column sorting | yes | - |
| sortingFn *(alias* comparator*)* | \`basic\` \`text\` \`textCaseSensitive\` \`date\` \`alphanumeric\` \`alphanumericCaseSensitive\` or \`(a,b)=>number\` | Sorting fn name or custom comparator function. [see details](https://tanstack.com/table/latest/docs/guide/sorting#sorting-fns) | yes | Checks or assumes \`cellDataType\` to match the type: \`text\` or \`date\`, otherwise \`basic\` |
| enableResizing | boolean | Enable or disable resizing for the column | yes | - |
| maxSize | number | The maximum allowed size for the column | yes | Infinity |
| minSize | number | The minimum allowed size for the column | yes | 20 |
| size | number | The desired size for the column | yes | 150 |
| flex | number | Occupy the remaining space with other flex column | yes | - |
| rowGrouping | boolean | Enable to group rows with equivalent cell values under shared parent rows | yes | - |
| rowGroupingTree | boolean | Enable to group rows as tree | yes | - |
| getGroupingTreePath | (row) => string[] | If value is not \`string[]\`, use this to parse for the group tree path | yes | - |
| aggregatedCell | string OR ((props: {table: Table<RowData>,row: Row<RowData>,column: Column<RowData>,cell: Cell<RowData>,getValue: () => any,renderValue: () => any}) => any | If the cell is an aggregate, set aggregatedCell to show customized content | yes | - |
| cellDataType | 'text' OR 'number' OR 'boolean' OR 'date' OR 'default' OR 'cell type you defined' | The cell data type, by default the grid will infer cell data types when pass row data into grid | yes | - |
| filterable | boolean | Enable or disable column filter | yes | - |
| filterLookup | (props: { keyword?: string, column: Column<any, any>, table: Table<any>, }) => {value: string, label: string}[] | Get dunamic data for column filter | yes | - |
| filterWidget | (props: { value: unknown, bindFilterValue: BindFilterValue, table: Table<unknown>, column: Column<unknown, unknown> }) => any | Customize filter widget | yes | - |
| filterFn | (props: { row: Row<TData>, columnId: string, filterValue: any }) => boolean | The filter function to use with this column, must be set when you using filterWidget. should return true if a row should be included in the filtered rows and flase if it should be removed. | yes | - |
| filter | 'setFilter', 'text', 'number', 'date', 'boolean' or 'multiple' | Specific filter name for typed filtering. See [Typed Filtering](#typed-filtering) for example | yes | \`setFilter\` |
| filterParams | object | Additional settings for typed or multiple filter. | yes | - |
| filterParams.modes | string[] | specifies the modes available for the filter and in which order. | yes | See [Typed Filtering](#typed-filtering) |
| filterParams.defaultMode | string | specifies the default initial mode when filter is opened. | yes | the first option |
| filterParams.filters | FilterDef[] | List of filter definitions for multiple filter. See [Multiple Filtering Per Column](#multiple-filtering-per-column) | yes | 'text', 'number' or 'date' (depending on the column's type) and setFilter |
| filterParams.filters[n].filter | 'setFilter', 'text', 'number', 'date', 'boolean' | Specific filter name for typed filtering. See [Typed Filtering](#typed-filtering) for example | yes | - |
| filterParams.filters[n].filterParams | object | configure filter params modes & defaultMode | yes | - |
| filterParams.filters[n].filterWidget | (props: { value: unknown, bindFilterValue: BindFilterValue, table: Table, column: Column<unknown, unknown> }) => any | See above. Customize the template used within multiple filter. | yes | - |
| filterParams.filters[n].filterFn | (props: { row: Row, columnId: string, filterValue: any }) => boolean | See above. Customize the compare function used within multiple filter. | yes | - |
| columnManagerLabel | string OR (props: {table: Table<RowData>,column: Column<RowData>}) => string | Set to customize label for each column in column manager | yes | - |
| hide | boolean | Hide particular column if true | yes | - |
| lock | 'ordering' OR 'visibility' OR boolean | Set to lock(disable) show\/hide column or reorder column, it will disable all when set true | yes | - |
| editable | boolean OR (cell: Cell) => boolean | Enable or disable editing mode for each cell of columns | yes | - |
| cellEditorParams | (props: {table: Table<RowData>,row: Row<RowData>,column: Column<RowData>,cell: Cell<RowData>,getValue: () => any,renderValue: () => any}) => any | Use this function to pass dynamic parameters into cellEditor | yes | - |
| cellEditor | (props: {table: Table<RowData>,row: Row<RowData>,column: Column<RowData>,cell: Cell<RowData>,getValue: () => any,renderValue: () => any}, params: any, sendValue: (updatedVal: any) => void) => any | Customize UI of editable area, second parameter came from cellEditorParams, call third parameter to trigger sc-change event then you can update original data. | yes | - |
| meta | object |  This is a great way to pass arbitrary data or functions to your table without having to pass it to every thing the table touches. | yes | - |
| draggable | boolean | Attach draggable icon for current column when enable attribute: enable-draggable-row | yes | - |

## Keyboard Shortcuts

### Navigation

| Action | Key | Restriction |
| ---- | ------ | ----- |
| Move to right | \`→\` | header & body |
| Move to left | \`←\` | header & body |
| Move to above | \`↑\` | header & body |
| Move to below | \`↓\` | header & body |
| Move to next | \`tab\` | header & body |
| Move to previous | \`shift\` + \`tab\` | header & body |
| Move to right most | \`ctrl\` + \`→\` | body |
| Move to left most | \`ctrl\` + \`←\` | body |
| Move to top | \`ctrl\` + \`↑\` | body |
| Move to bottom | \`ctrl\` + \`↓\` | body |
| Move to next scroll | \`page down\` | body |
| Move to previous scroll | \`page up\` | body |
| Move to first | \`home\` | body |
| Move to last | \`end\` | body |

### Actions

| Action | Key | Restriction |
| ---- | ------ | ----- |
| Filter column | \`ctrl\` + \`enter\` | filterable header |
| Swap column order with right | \`shift\` + \`→\` | non-pinned column header |
| Swap column order with left | \`shift\` + \`←\` | non-pinned column header |
| Pin to left | \`ctrl\` + \`shift\` + \`←\` | first non-pinned column header |
| Unpin from left | \`ctrl\` + \`shift\` + \`→\` | last left-pinned column header |
| Pin to right | \`ctrl\` + \`shift\` + \`→\` | last non-pinned column header |
| Unpin from right | \`ctrl\` + \`shift\` + \`←\` | first right-pinned column header |
| Increase column size | \`alt\` + \`→\` | resizable header |
| Decrease column size | \`alt\` + \`←\` | resizable header |
| Toggle Sort column | \`enter\` | sortable header |
| Edit mode | \`enter\` | editable body |
| Toggle expand/collapse | \`enter\` | expandable body |
| Toggle row selection | \`space\` | selectable body |

------

<span style="font-weight: bold; color: #d50000;">NOTE: Colour usage on WebKit components are governed by strict brand and accessibility standards. As such, designs must strictly adhere to approved colour palette for the component, and are not allowed to deviate under any circumstance.</span>

`,
        story: `Click **[Show code]** button to check more details.
        ${WARNNING}
        `,
      },
    },
  },
  // | getHeaderStyle | (headerContext) => CSSStyleDeclaration | A customized style function which used for header cells of current column | yes | - |
  // | getCellStyle | (cellContext) => CSSStyleDeclaration | A customized style function which used for body cells of current column | yes | - |
  args: {
    ...getDefaultValues((ScDataGrid as any).argTypes),
    // some too complex data should set manually
    data,
    columns,
  },
  argTypes: {
    ...(ScDataGrid as any).argTypes,

    'sc-tr-tap': {
      description: `Emitted when the click on each rows.
      get row id by event.detail.value`,
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-select': {
      description:
        'Emitted when click the checkbox in each row if enable row-selection. The value include isSelectedAll and selectedData which indicate if the select all checkbox is ticked.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-sort': {
      description: `Emitted when the sorting direction changed.
      get sorting information({id: string, desc: boolean}[]) by event.detail.value.`,
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-filter': {
      description: `Emitted when applied column fiters of global filter.
      get column filter infomations by event.detail.columnFilterValues.
      get global filter infomations by event.detail.globalFilterValue`,
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-page-change': {
      description: `Emitted when the selected page changes.
      Get the current page number by event.detail.page and get the page size by event.detail.pageSize.`,
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-master-expand': {
      description: `Emitted when the master cell expanded.
      Can get cell, row, column via event.detail.[cell|row|column], also can get if expanded or not via event.detail.isExpanded.`,
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-group-expand': {
      description: `Emitted when the grouped cell expanded.
      Can get cell, row, column via event.detail.[cell|row|column], also can get if expanded or not via event.detail.isExpanded.`,
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-mouse-down': {
      description:
        'Emitted when press on column resizer. Get particular column by event.detail.column.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-mouse-move': {
      description:
        'Emitted when drag column resizer. Get particular column by event.detail.column.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-mouse-up': {
      description:
        'Emitted when column resizer released. Get particular column by event.detail.column.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-change': {
      description:
        'Emitted when change cell value in editing mode. Get particular cell by event.detail.cell and latest value by event.detail.value.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-editing-started': {
      description:
        'Emitted when double click on editable cell. Get particular cell by event.detail.value.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-editing-stopped': {
      description:
        'Emitted when double cancel editing. Get particular cell by event.detail.value.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    // draggable row events part
    'sc-dragstart': {
      description:
        'Emitted when start dragging an row(s). Get dragging rows by event.detail.rows.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-dragover': {
      description:
        'Emitted when an row(s) dragging and mouse pointer is over a valid row. Get dragging rows by event.detail.rows. Get overed row by event.detail.targetRow.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-drop': {
      description:
        'Emitted when an row(s) dropped on a valid row. Get dragging rows by event.detail.rows. Get droped target row by event.detail.targetRow. Get droped position by event.detail.placement.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-dragend': {
      description:
        'Emitted when drag operation is being ended. Get ended target row by event.detail.targetRow.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-dragleave': {
      description:
        'Emitted when dragged row(s) leaves a valid row. Get dragging rows by event.detail.rows. Get leaved row by event.detail.targetRow.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-column-order': {
      description:
        'Emitted when column order or visibility is changed via column manager or drag. Get current column order from event.detail.columns.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
  },
};
type Story = StoryObj<properties>;

export default meta;

const basicData = gData(4);
export const Basic: Story = {
  parameters: {
    docs: {
      ...generateCode(`
<sc-data-grid
  .data=\${${serialize(basicData, { space: 12 })}}
  .columns=\${${serialize(columns, { space: 12 })}}
>
</sc-data-grid>
      `),
    },
  },
  render: renderTemplate(),
  args: {
    data: basicData,
  },
};

const groupColumns: TColumn<RowData, any>[] = [
  {
    header: 'group',
    id: 'group',
    columns: [
      {
        header: 'subGroup',
        id: 'subGroup',
        columns: [
          {
            property: 'visits',
          },
        ],
      },
      {
        property: 'progress',
      },
    ],
  },
  {
    property: 'firstName',
    header: 'First name',
    flex: 1,
    enableResizing: true,
  },
  {
    property: 'lastName',
    header: 'Last name',
    minSize: 60,
    flex: 2,
  },
  {
    property: 'age',
    minSize: 40,
  },
];

export const HeaderGroup: Story = {
  parameters: {
    docs: {
      ...generateCode(`
<sc-data-grid
  .columns=\${${serialize(groupColumns, { space: 12 })}}
>
</sc-data-grid>
      `),
    },
  },
  render: renderTemplate(),
  args: {
    data: basicData,
    columns: groupColumns,
  },
};

export const CustomizeRowHeight: Story = {
  parameters: {
    docs: {
      ...generateCode(`
<sc-data-grid
  .getRowHeight=\${row => row.index % 2 ? 40 : 80}
>
</sc-data-grid>
      `),
    },
  },
  render: renderTemplate(),
  args: {
    data: basicData,
    getRowHeight(row) {
      return row.index % 2 ? 40 : 80;
    },
  },
};

export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story: `If data length is 0, will show empty tips. you also can customize tips by using slot:

\`\`\`html
<sc-data-grid>
    <div slot="empty">There is not available records came from data if you can see me.</div>
</sc-data-grid>
\`\`\`
${WARNNING}
        `,
      },
    },
  },
  render: renderTemplate({
    emptySlot: () =>
      html`
        <div slot="empty">
          There is not available records came from data if you can see me.
        </div>`,
  }),
  args: {
    data: [],
  },
};
export const FixedResizeStrategy: Story = {
  parameters: {
    docs: {
      description: {
        story: `When use fixed resize strategy, columns and adjacent columns will share space.
${WARNNING}
`,
      },
    },
  },
  render: renderTemplate(),
  args: {
    columnResizeStrategy: 'fixed',
  },
};

const stickyColumnCols = [
  gSpanningColumn({}),
  gSpanningColumn({
    pinned: 'left',
  }),
  gSpanningColumn({}),
  gSpanningColumn({ pinned: 'left', colSpanning: 2 }),
  gSpanningColumn({ pinned: 'left' }),
  gSpanningColumn({}),
  gSpanningColumn({
    pinned: 'right',
  }),
  gSpanningColumn({}),
  gSpanningColumn({}),
  gSpanningColumn({}),
];
export const StickyColumn: Story = {
  parameters: {
    docs: {
      ...generateCode(`
<sc-data-grid
  .columns=\${${serialize(stickyColumnCols, { space: 12 })}}
>
</sc-data-grid>
      `),
    },
  },
  render: renderTemplate(),
  args: {
    columns: stickyColumnCols,
  },
};
const columnSpanningCols = [
  gSpanningColumn({
    colSpanning: 3,
  }),
  gSpanningColumn({
    size: 200,
    colSpanning: 1,
  }),
  gSpanningColumn({
    size: 200,
    colSpanning: 2,
  }),
  gSpanningColumn({
    colSpanning: 2,
  }),
  gSpanningColumn({
    colSpanning: 1,
  }),
  gSpanningColumn({
    colSpanning: 1,
  }),
];
export const ColumnSpanning: Story = {
  parameters: {
    docs: {
      ...generateCode(`
<sc-data-grid
  .columns=\${${serialize(columnSpanningCols, { space: 12 })}}
>
</sc-data-grid>
      `),
      description: {
        story: `When setting the colSpanning for a certain column, this column will span across the right columns according to the result of colSpanning.
          ${WARNNING}
          `,
      },
    },
  },
  render: renderTemplate(),
  args: {
    columns: columnSpanningCols,
  },
};

const csSortCols: TColumn<unknown, any>[] = [
  {
    property: 'firstName',
    header: 'First name',
    sortable: true,
    enableResizing: true,
    sort: 'desc',
    sortingOrder: ['none', 'desc', 'asc'],
    flex: 1,
  },
  {
    property: 'lastName',
    header: 'Last name',
    minSize: 60,
    sortable: false,
  },
  {
    property: 'age',
    enableResizing: false,
    minSize: 40,
  },
  {
    property: 'visits',
  },
];

export const ClientSideRowSorting: Story = {
  parameters: {
    docs: {
      ...generateCode(`
<sc-data-grid
  .columns=\${${serialize(csSortCols, { space: 12 })}}
>
</sc-data-grid>
      `),
      description: {
        story: `
        Press Shift and click on sort icon to **multi sorting**
        ${WARNNING}
        `,
      },
    },
  },
  render: renderTemplate(),
  args: {
    columns: csSortCols,
  },
};

export const ServerSideRowSorting: Story = {
  parameters: {
    docs: {
      ...generateCode(`
<sc-data-grid
  @sc-sort=\${() => {
    gridInstance.data = dataFromBackend;
  }}
  manual-sorting
>
</sc-data-grid>
      `),
      description: {
        story: `When the grid has manualSorting enabled, you need to listen to the sc-sort event to obtain the sorted data and then pass it back to the grid.
          ${WARNNING}
          `,
      },
    },
  },
  render: renderTemplate({
    sort(
      e: CustomEvent<{
        value: { desc: boolean; id: string }[];
      }>,
      element: ScDataGrid
    ) {
      element.data = gData(2);
    },
  }),
  args: {
    manualSorting: true,
    columns: [
      {
        property: 'firstName',
        header: 'First name',
        sortable: true,
        enableResizing: true,
        sort: 'desc',
        sortingOrder: ['none', 'desc', 'asc'],
        flex: 1,
      },
      {
        property: 'lastName',
        header: 'Last name',
        minSize: 60,
        sortable: false,
      },
      {
        property: 'age',
        enableResizing: false,
        minSize: 40,
      },
      {
        property: 'visits',
      },
    ],
  },
};

const rowSpanningCols = [
  {
    property: 'firstName',
    header: 'First name',
    rowSpanning: true,
    flex: 1,
  },
  {
    property: 'lastName',
    header: 'Last name',
    rowSpanning: true,
  },
  {
    property: 'age',
    rowSpanning: true,
    colSpanning: 2,
  },
  {
    property: 'lastName',
    header: 'Last name',
    rowSpanning: true,
  },
  {
    property: 'visits',
    rowSpanning: true,
  },
];

export const RowSpanning: Story = {
  parameters: {
    docs: {
      ...generateCode(`
<sc-data-grid
  .columns=\${${serialize(rowSpanningCols, { space: 12 })}}
>
</sc-data-grid>
      `),
      description: {
        story: `rowSpanning property of columnDef can be:

\`\`\`typescript
type cellType = {
  column: Cell,
  getValue: () => any,
  id: string,
  row: Row,
}
rowSpanning: boolean | (cell1: cellType, cell2: cellType) => boolean
\`\`\`
there are more useful object in cellType, print it to check.
${WARNNING}
`,
      },
    },
  },
  render: renderTemplate(),
  args: {
    sortable: true,
    data: gData(20),
    columns: rowSpanningCols,
  },
};

const rowPinningData = gData(20);
const rowPinningCon = {
  top: [rowPinningData[0].uuid],
  bottom: [rowPinningData[1].uuid, rowPinningData[2].uuid],
};
export const RowPinning: Story = {
  parameters: {
    docs: {
      ...generateCode(`
<sc-data-grid
  .rowPinning=\${${serialize(rowPinningCon, { space: 12 })}}
>
</sc-data-grid>
      `),
      description: {
        story: `Pass row id to top or bottom to fix the rows to the top or bottom
          ${WARNNING}
          `,
      },
    },
  },
  render: renderTemplate(),
  args: {
    rowPinning: rowPinningCon,
    sortable: true,
    data: rowPinningData,
  },
};

export const ClientSidePagination: Story = {
  render: renderTemplate(),
  args: {
    pagination: true,
    data: gData(41),
    pageSize: 20,
    pageIndex: 2,
  },
};
export const ClientSidePaginationWithCustomPageSizeOptions: Story = {
  render: renderTemplate(),
  args: {
    pagination: true,
    data: gData(41),
    pageSize: 5,
    pageIndex: 2,
    pageSizeOptions: [5, 25, 50, 100],
  },
};
export const ServerSidePagination: Story = {
  parameters: {
    docs: {
      ...generateCode(`
<sc-data-grid
  @sc-page-change=\${() => {
    daraGrid.data = dataFromBackend;
  }}
>
</sc-data-grid>
      `),
      description: {
        story: `When manualPagination is enabled for the grid, you need to listen to the sc-page-change event to obtain the data for the corresponding page and then pass it back to the grid.

\`\`\`html
<sc-data-grid @sc-page-change=\$\{your logic here\}></sc-data-grid>
\`\`\`
${WARNNING}
`,
      },
    },
  },
  render: renderTemplate({
    page(
      e: CustomEvent<{
        value: { desc: boolean; id: string }[];
      }>,
      element: ScDataGrid
    ) {
      element.data = gData(2);
    },
  }),
  args: {
    pagination: true,
    data: gData(3),
    pageSize: 10,
    pageIndex: 2,
    total: 100,
    manualPagination: true,
  },
};

const rowGroupingCols = [
  {
    property: 'firstName',
    header: 'First name',
    flex: 1,
  },
  {
    property: 'lastName',
    header: 'Last name',
  },
  {
    property: 'age',
    rowGrouping: true,
  },
  {
    property: 'progress',
    rowGrouping: true,
  },
  {
    property: 'visits',
    rowGrouping: true,
  },
];
export const RowGrouping: Story = {
  parameters: {
    docs: {
      ...generateCode(`
<sc-data-grid
  .columns=\${${serialize(rowGroupingCols, { space: 12 })}}
>
</sc-data-grid>

<script>
const grid = document.querySelector('sc-data-grid');
grid.updateComplete.then(() => {
  // Get grouped row model
  const groupedRowModel = grid.table.getGroupedRowModel();
  // Apply toggleExpanded to first row
  groupedRowModel.rows[0].toggleExpanded();
})
</script>
      `),
    },
  },
  render: renderTemplate({
    apiFunction(grid?: ScDataGrid) {
      if (grid) {
        grid.updateComplete.then(() => {
          const row = grid.table.getGroupedRowModel();
          row.rows[0].toggleExpanded();
        });
      }
    },
  }),
  args: {
    sortable: true,
    data: gData(20),
    columns: rowGroupingCols,
  },
};

const CustomizeAggregatedCellWhenGroupingCols = [
  {
    property: 'firstName',
    header: 'First name',
    aggregatedCell(props: any) {
      return `total: ${props.row.subRows.length}` || 0;
    },
    flex: 1,
  },
  {
    property: 'lastName',
    header: 'Last name',
  },
  {
    property: 'age',
    rowGrouping: true,
  },
  {
    property: 'progress',
    rowGrouping: true,
  },
  {
    property: 'visits',
    rowGrouping: true,
  },
];
export const CustomizeAggregatedCellWhenGrouping: Story = {
  parameters: {
    docs: {
      ...generateCode(`
<sc-data-grid
  .columns=\${${serialize(CustomizeAggregatedCellWhenGroupingCols, {
        space: 12,
      })}}
>
</sc-data-grid>
      `),
      description: {
        story: `AggregatedCell property of columnDef is useful when you want to show aggregated info.
        it receive only one parameter which has cell, column, row, table, getValue, renderValue object.
        ${WARNNING}
        `,
      },
    },
  },
  render: renderTemplate(),
  args: {
    sortable: true,
    data: gData(20),
    columns: CustomizeAggregatedCellWhenGroupingCols,
  },
};

const masterCellConf = {
  masterCellRenderer(cell: any, renderCallback: (template: unknown) => void) {
    alert('master cell renderer triggered');
    renderCallback('you can put anything here');
  },
  isCellExpandable() {
    return true;
  },
};

export const MasterCell: Story = {
  parameters: {
    docs: {
      ...generateCode(`
<sc-data-grid
  .masterCellRenderer=\${${serialize(masterCellConf.masterCellRenderer, {
        space: 12,
      })}}
  .isCellExpandable=\${${serialize(masterCellConf.isCellExpandable, {
        space: 12,
      })}}
>
</sc-data-grid>
      `),
      description: {
        story: `Master Cell refers to a top level cell called a Master Cell having rows that expand.
        When the row is expanded, arbitrary content is displayed with more details related to the expanded row.
        ${WARNNING}
        `,
      },
    },
  },
  render: renderTemplate(),
  args: {
    sortable: true,
    ...masterCellConf,
    data: gData(20),
    columns: [
      {
        property: 'firstName',
        header: 'First name',
        flex: 1,
      },
      {
        property: 'lastName',
        header: 'Last name',
      },
    ],
  },
};
const masterCellWithArbitraryContentConf = {
  masterCellRenderer(cell: any, renderCallback: (template: unknown) => void) {
    const color = cell.row.index % 2 ? 'darkblue' : 'darkolivegreen';
    renderCallback(html`
      <div style="border: 1px solid ${color};">
        <h4>Column${cell.column.getIndex()}</h4>
        ${JSON.stringify(cell.row.original, null, 2)}
      </div>`);
  },
  isCellExpandable(cell: any) {
    return cell.column.getIndex() === 1;
  },
};
export const MasterCellWithArbitraryContent: Story = {
  parameters: {
    docs: {
      ...generateCode(`
<sc-data-grid
  .masterCellRenderer=\${(cell, renderCallback) => {
    const color = cell.row.index % 2 ? 'darkblue' : 'darkolivegreen';
    renderCallback(html\`<div style="border: 1px solid \${color};">
      <h4>Column\${cell.column.getIndex()}</h4>
      \${JSON.stringify(cell.row.original, null, 2)}
    </div>\`);
  }}
  .isCellExpandable=\${${serialize(
        masterCellWithArbitraryContentConf.isCellExpandable,
        { space: 12 }
      )}}
>
</sc-data-grid>

<script>
const grid = document.querySelector('sc-data-grid');
grid.updateComplete.then(() => {
  // Get row model
  const rowModel = grid.table.getRowModel();
  // Apply toggleExpanded to cell 2 row 1
  rowModel.rows[0].getVisibleCells()[1].toggleExpanded();
})
</script>
      `),
    },
  },
  render: renderTemplate({
    apiFunction(grid?: ScDataGrid) {
      if (grid) {
        grid.updateComplete.then(() => {
          const row = grid.table.getRowModel();
          row.rows[0].getVisibleCells()[1].toggleExpanded();
        });
      }
    },
  }),
  args: {
    sortable: true,
    ...masterCellWithArbitraryContentConf,
    data: gData(20),
    columns: [
      {
        property: 'firstName',
        header: 'First name',
        flex: 1,
      },
      {
        property: 'lastName',
        header: 'Last name',
      },
    ],
  },
};

export const MasterCellWhenEnableGrouping: Story = {
  parameters: {
    docs: {
      description: {
        story: `If enable Grouping and Master Cell together on the same column(or cell), Grouping will take highest priority.
        Which means others feature will disabled. see below example, even though enable Master Cell for every cell, the cells in age and progress column will ignore it.
        ${WARNNING}
        `,
      },
    },
  },
  render: renderTemplate(),
  args: {
    sortable: true,
    masterCellRenderer(cell: any, renderCallback: (template: unknown) => void) {
      const color = cell.row.index % 2 ? 'darkblue' : 'darkolivegreen';
      renderCallback(html`
        <div style="border: 1px solid ${color};">
          <h4>Column${cell.column.getIndex()}</h4>
        </div>`);
    },
    isCellExpandable(cell: any) {
      return true;
    },
    data: gData(20),
    columns: [
      {
        property: 'firstName',
        header: 'First name',
        flex: 1,
      },
      {
        property: 'lastName',
        header: 'Last name',
      },
      {
        property: 'age',
        rowGrouping: true,
      },
      {
        property: 'progress',
        rowGrouping: true,
      },
    ],
  },
};

export const RowSelection: Story = {
  parameters: {
    docs: {
      description: {
        story: `Press Ctrl key and do select to select multiple rows when in single selection mode.

Press Shift key and do select to select all rows within a certain range.

        ${WARNNING}
        `,
      },
    },
  },
  render: renderTemplate(),
  args: {
    rowSelection: true,
    data: gData(10),
    columns: [
      {
        property: 'firstName',
        header: 'First name',
        flex: 1,
      },
      {
        property: 'lastName',
        header: 'Last name',
      },
      {
        property: 'age',
      },
      {
        property: 'progress',
      },
      {
        property: 'visits',
      },
    ],
  },
};
export const SingleRowSelection: Story = {
  render: renderTemplate(),
  args: {
    rowSelection: true,
    rowSelectionMode: 'single',
    rowSelectionRadio: true,
    data: gData(10),
    columns: [
      {
        property: 'firstName',
        header: 'First name',
        flex: 1,
      },
      {
        property: 'lastName',
        header: 'Last name',
      },
      {
        property: 'age',
      },
      {
        property: 'progress',
      },
      {
        property: 'visits',
      },
    ],
  },
};

const dataForConfigureSelectionState = gData(10);
const configureSelectionStateConf: Partial<ScDataGrid> = {
  defaultSelectedRows: [
    dataForConfigureSelectionState[2].uuid,
    dataForConfigureSelectionState[6].uuid,
  ],
  isRowSelectable(row) {
    return row.index % 2 === 0;
  },
};
export const ConfigureSelectionState: Story = {
  parameters: {
    docs: {
      ...generateCode(`
<sc-data-grid
  row-selection
  .defaultSelectedRows=\${${serialize(
        configureSelectionStateConf.defaultSelectedRows,
        { space: 12 }
      )}}
  .isRowSelectable=\${${serialize(configureSelectionStateConf.isRowSelectable, {
        space: 12,
      })}}
  hide-unselectable-rows
>
</sc-data-grid>
      `),
    },
  },
  render: renderTemplate(),
  args: {
    rowSelection: true,
    defaultSelectedRows: configureSelectionStateConf.defaultSelectedRows,
    isRowSelectable: configureSelectionStateConf.isRowSelectable,
    hideUnselectableRows: true,
    data: dataForConfigureSelectionState,
    columns: [
      {
        property: 'firstName',
        header: 'First name',
        flex: 1,
      },
      {
        property: 'lastName',
        header: 'Last name',
      },
      {
        property: 'age',
      },
      {
        property: 'progress',
      },
      {
        property: 'visits',
      },
    ],
  },
};

export const PaginationRowSelection: Story = {
  render: renderTemplate(),
  args: {
    pagination: true,
    pageSize: 5,
    rowSelection: true,
    rowSelectionMode: 'multiple',
    data: gData(15),
    columns: [
      {
        property: 'firstName',
        header: 'First name',
        flex: 1,
      },
      {
        property: 'lastName',
        header: 'Last name',
      },
      {
        property: 'age',
      },
      {
        property: 'progress',
      },
      {
        property: 'visits',
      },
    ],
  },
};
export const PaginationRowSelectionEachPage: Story = {
  parameters: {
    docs: {
      description: {
        story: `
\`\`\`html
<sc-data-grid
    row-selection-strategy="currentPage" // Select rows on the current page only
>
</sc-data-grid>
\`\`\`
${WARNNING}
        `,
      },
    },
  },
  render: renderTemplate(),
  args: {
    pagination: true,
    pageSize: 5,
    rowSelection: true,
    rowSelectionMode: 'multiple',
    rowSelectionStrategy: 'currentPage',
    data: gData(15),
    columns: [
      {
        property: 'firstName',
        header: 'First name',
        flex: 1,
      },
      {
        property: 'lastName',
        header: 'Last name',
      },
      {
        property: 'age',
      },
      {
        property: 'progress',
      },
      {
        property: 'visits',
      },
    ],
  },
};

const dataForComplexRowSelection = gData(15);
const complexRowSelectionConf: Partial<ScDataGrid> = {
  pagination: true,
  pageSize: 5,
  rowSelection: true,
  defaultSelectedRows: [dataForComplexRowSelection[2].uuid],
  isRowSelectable(row) {
    return row.index !== 0;
  },
  rowSelectionMode: 'multiple',
  rowSelectionStrategy: 'currentPage',
};
export const ComplexRowSelection: Story = {
  parameters: {
    docs: {
      ...generateCode(`
<sc-data-grid
  pagination
  .pageSize=\${${complexRowSelectionConf.pageSize}}
  .rowSelectionMode=\${${complexRowSelectionConf.rowSelectionMode}}
  .rowSelectionStrategy=\${${complexRowSelectionConf.rowSelectionStrategy}}
  row-selection
  .defaultSelectedRows=\${${serialize(
        complexRowSelectionConf.defaultSelectedRows,
        { space: 12 }
      )}}
  .isRowSelectable=\${${serialize(complexRowSelectionConf.isRowSelectable, {
        space: 12,
      })}}
>
</sc-data-grid>
      `),
    },
  },
  render: renderTemplate(),
  args: {
    pagination: true,
    pageSize: 5,
    rowSelection: true,
    defaultSelectedRows: [dataForComplexRowSelection[2].uuid],
    isRowSelectable(row) {
      return row.index !== 0;
    },
    rowSelectionMode: 'multiple',
    rowSelectionStrategy: 'currentPage',
    data: dataForComplexRowSelection,
    columns: [
      {
        property: 'firstName',
        header: 'First name',
        pinned: 'left',
      },
      {
        property: 'lastName',
        header: 'Last name',
      },
      {
        property: 'age',
        rowGrouping: true,
      },
      {
        property: 'progress',
      },
      {
        property: 'status',
        pinned: 'right',
      },
      {
        property: 'visits',
      },
    ],
  },
};

const cellDataTypeConf: Partial<ScDataGrid> = {
  cellDataTypeDefinitions: {
    object(props) {
      return html`
        <span style="font-style: italic;"
        >${(props.cell.getValue() as any).value}</span
        >
      `;
    },
  },
  columns: [
    {
      property: 'firstName',
      header: ()=>html`The <b>First</b> name'`,
      flex: 1,
    },
    {
      property: 'date',
    },
    {
      property: 'object',
      cellDataType: 'object',
    },
    {
      property: 'isAdult',
    },
    {
      property: 'progress',
    },
  ],
};

export const CellDataType: Story = {
  parameters: {
    docs: {
      ...generateCode(`
<sc-data-grid
  .cellDataTypeDefinitions=\${() => {
    object(props) {
      return html\`
        <span style="font-style: italic;">
        \${(props.cell.getValue() as any).value}
        </span>
      \`;
    },
  }}
  .columns=\${[
    {
      property: 'firstName',
      header: ()=>html\`The <b>First</b> name\`,
      flex: 1,
    },
    {
      property: 'date',
    },
    {
      property: 'object',
      cellDataType: 'object',
    },
    {
      property: 'isAdult',
    },
    {
      property: 'progress',
    },
  ]}}
>
</sc-data-grid>
      `),
    },
  },
  render: renderTemplate(),
  args: {
    rowSelection: true,
    data: gData(5),
    ...cellDataTypeConf,
  },
};

// const customizedGridStyleCols: TColumn<unknown, any>[] = [
//   {
//     property: 'firstName',
//   },
//   {
//     property: 'age',
//     rowSpanning: true,
//     getCellStyle(cell) {
//       if (cell.getIsRowSpanningRoot()) {
//         return {
//           background: 'darkseagreen',
//           color: '#fff',
//         };
//       }
//       return {};
//     },
//     sort: 'asc',
//   },
//   {
//     property: 'date',
//   },
//   {
//     property: 'visits',
//     colSpanning: (table, column, row, cell) => {
//       if (cell.getValue() > 8) {
//         return 2;
//       }
//       return 1;
//     },
//     getCellStyle(cell) {
//       if (cell.getIsColSpanningRoot()) {
//         return {
//           background: 'darkkhaki',
//           color: '#fff',
//         };
//       }
//       return {};
//     },
//   },
//   {
//     property: 'progress',
//   },
//   {
//     property: 'isAdult',
//   },
// ];
// export const CustomizedGridStyle: Story = {
//   parameters: {
//     docs: {
//       ...generateCode(`
// <sc-data-grid
//   .columns=\${${serialize(customizedGridStyleCols, { space: 12 })}}
// >
// </sc-data-grid>
//       `),
//     },
//   },
//   render: renderTemplate(),
//   args: {
//     rowSelection: true,
//     data: gData(10),
//     sortable: true,
//     columns: customizedGridStyleCols,
//   },
// };

// const customizedDifferentGridRowStyleConf: Partial<ScDataGrid> = {
//   getHeaderStyle(header) {
//     return {
//       background: '#2c2d34',
//       color: '#fff',
//     };
//   },
//   getRowStyle(row) {
//     return {
//       background: '#23242c',
//       color: '#fff',
//       '--sc-data-grid-row-hover-bg-color': 'rgb(66, 133, 244)',
//     };
//   },
// };

// export const CustomizedDifferentGridRowStyle: Story = {
//   parameters: {
//     docs: {
//       ...generateCode(`
// <sc-data-grid
//   .getHeaderStyle=\${${serialize(
//     customizedDifferentGridRowStyleConf.getHeaderStyle,
//     { spance: 12 }
//   )}}
//   .getRowStyle=\${${serialize(customizedDifferentGridRowStyleConf.getRowStyle, {
//     spance: 12,
//   })}}
// >
// </sc-data-grid>
//       `),
//     },
//   },
//   render: renderTemplate(),
//   args: {
//     rowSelection: true,
//     data: gData(10),
//     sortable: true,
//     ...customizedDifferentGridRowStyleConf,
//     columns: [
//       {
//         property: 'firstName',
//       },
//       {
//         property: 'age',
//       },
//       {
//         property: 'date',
//       },
//       {
//         property: 'visits',
//       },
//       {
//         property: 'progress',
//       },
//       {
//         property: 'isAdult',
//       },
//     ],
//   },
// };

export const ColumnManager: Story = {
  parameters: {
    docs: {
      description: {
        // story: ``,
      },
    },
  },
  render: renderTemplate({
    columnOrder: (e: CustomEvent) => console.log(e.detail.columns),
  }),
  args: {
    columnOrdering: true,
    columnVisibility: true,
  },
};

export const ActionsBar: Story = {
  parameters: {
    docs: {
      description: {
        // story: ``,
      },
    },
  },
  render: renderTemplate({
    actionsButtonSlot: () =>
      html`
        <div slot="actions">
          <sc-button type="primary" state="default" size="xxs">
            Upload
          </sc-button>
          <sc-button type="primary" state="default" size="xxs">
            Download
          </sc-button>
        </div>`,
    headerActionsButtonSlot: () =>
      html`
        <div slot="header-actions">
          <sc-button type="primary" state="default" size="xxs">
            Fullscreen
          </sc-button>
          <sc-button type="primary" state="default" size="xxs">
            Refresh
          </sc-button>
        </div>`,
  }),
  args: {
    rowSelection: true,
    selectAllButton: true,
    selectionQuantity: true,
  },
};

export const DataExport: Story = {
  parameters: {
    docs: {
      description: {},
    },
  },
  render: renderTemplate(),
  args: {
    columns: [
      {
        property: 'firstName',
        header: () => html`<b>First name</b>`,
        cell: ({ renderValue }) => html`<sc-link href="https://pulse.sc.com/">${renderValue()}</sc-link>`,
      },
      {
        property: 'lastName',
        header: 'Last name',
      },
      {
        property: 'age',
        cell: ({ renderValue, cell }) => html`
          <b>${renderValue()}</b> (${cell.getValue() > 18 ? 'Adult' : 'Minor'})`,
      },
    ],
    columnOrdering: true,
    columnVisibility: true,
    sortable: true,
    filterable: true,
    advancedFilter: true,
    enableExport: true,
  },
};

export const DataExportSlot: Story = {
  parameters: {
    docs: {
      description: {},
    },
  },
  render: renderTemplate({
    dataExportSlot: () =>
      html`
        <div slot="data-export">
          <sc-button type="primary" state="default" size="xxs" .dataExportOptions=${{
            headers: {
              fullName: 'Full Name',
            },
            modifier: 'pre-paginated',
            type: 'csv',
            fileName: 'adult-employees',
            rowFilter: (row: Row<any>) => row.original.age >= 18,
            dataMapper: (data: any) => ({
              fullName: `${data.firstName} ${data.lastName}`,
            }),
          }}>
            Export adults as CSV
          </sc-button>
          <a .dataExportOptions=${{
            modifier: 'all',
            type: 'xlsx',
            fileName: 'all-employees',
            respectColumnOrder: true,
            respectColumnVisibility: true,
          }} href="#" style="margin-left: 12px; margin-right: 12px">
            Export all data as XLSX
          </a>
        </div>`,
  }),
  args: {
    columns: [
      {
        property: 'firstName',
        header: () => html`<b>First name</div>`,
      },
      {
        property: 'lastName',
        header: 'Last name',
      },
      {
        property: 'age',
        cell: ({ renderValue, cell }) => html`
          <b>${renderValue()}</b> (${cell.getValue() > 18 ? 'Adult' : 'Minor'})`,
      },
    ],
    columnOrdering: true,
    columnVisibility: true,
    sortable: true,
    filterable: true,
    advancedFilter: true,
    enableExport: true,
  },
};

const ClientSideRowFilteringData = gData(4);
export const ClientSideRowFiltering: Story = {
  parameters: {
    docs: {
      ...generateCode(`
<sc-data-grid
  filterable
  advanced-filter
>
</sc-data-grid>
      `),
    },
  },
  render: renderTemplate(),
  args: {
    data: ClientSideRowFilteringData,
    filterable: true,
    advancedFilter: true,
  },
};

const ServerSideRowFilteringData = gData(4);

const ssFilterColumns: TColumn<unknown, any>[] = [
  {
    property: 'firstName',
    header: 'First name',
    filterLookup(props: {
      keyword?: string;
      column: Column<any, any>;
      table: Table<any>;
    }) {
      let res: { label: string; value: string }[] = [];
      const keyword = props.keyword;
      if (keyword) {
        res = ServerSideRowFilteringData.filter(d =>
          d.firstName.toLowerCase().includes(keyword.toLowerCase())
        ).map(d => {
          return {
            label: `${d.firstName}`,
            value: `${d.firstName}`,
          };
        });
      } else {
        res = ServerSideRowFilteringData.map(d => {
          return {
            label: `${d.firstName}`,
            value: `${d.firstName}`,
          };
        });
      }
      return Promise.resolve(res);
    },
    flex: 1,
  },
];
export const ServerSideRowFiltering: Story = {
  parameters: {
    docs: {
      ...generateCode(`
<sc-data-grid
  filterable
  manual-filter
  @sc-filter=\${() => {
    gridInstance.data = dataFromBackend;
  }}
  .columns=\${[
    {
      property: 'firstName',
      header: 'First name',
      filterLookup(props: {
        keyword?: string;
        column: Column<any, any>;
        table: Table<any>;
      }) {
        let res: { label: string; value: string }[] = [];
        const keyword = props.keyword;
        if (keyword) {
          // [ServerSideRowFilteringData]: is your dynamic data.
          // You can fetch API to get it according to the keyword
          // Pls modify it while you use it in real project.
          res = ServerSideRowFilteringData.filter(d =>
            d.firstName.toLowerCase().includes(keyword.toLowerCase())
          ).map(d => {
            return {
              label: \`\${d.firstName}\`,
              value: \`\${d.firstName}\`,
            };
          });
        } else {
          res = ServerSideRowFilteringData.map(d => {
            return {
              label: \`\${d.firstName}\`,
              value: \`\${d.firstName}\`,
            };
          });
        }
        return Promise.resolve(res);
      },
    },
  ]}
>
</sc-data-grid>
      `),

      description: {
        story: `When the grid has manual-filter enabled, you need to listen to the sc-filter event to obtain the filtered data and then pass it back to the grid.


Notice: when you click on filter input when SS filter mode. it will shows [No data found] by default until you type something.

If the default behaviour not fit your requirement. pls try use filterWidget and filterFn to customized column filter UI widget.

${WARNNING}
          `,
      },
    },
  },
  render: renderTemplate({
    filter(e: CustomEvent, element: ScDataGrid) {
      element.data = gData(2);
    },
  }),
  args: {
    columns: ssFilterColumns,
    data: ServerSideRowFilteringData,
    filterable: true,
    manualFilter: true,
  },
};

const CustomizedFilterWidgetColumn: TColumn<RowData, any>[] = [
  {
    property: 'firstName',
    header: 'First name',
    filterWidget(props) {
      return html`<input
        @input=${(e: any) => {
          props.bindFilterValue(e.target?.value ?? undefined);
        }}
      />
      <button @click=${() => props.bindFilterValue(undefined)}>
        Reset
      </button>`;
    },
    flex: 2,
    filterFn(row, columnId, filterValue) {
      const cellValue = String(row.getValue(columnId));
      return cellValue.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    property: 'date',
    flex: 3,
  },
  {
    property: 'date',
    header: 'date-with-specific-type',
    id: 'date-with-specific-type',
    cellDataType: 'text',
    size: 300,
  },
  {
    property: 'isAdult',
  },
  {
    property: 'status',
    filterable: false,
  },
];
export const CustomizedFilterWidget: Story = {
  parameters: {
    docs: {
      description: {
        story: `FilterWidget of column definition is used in the following example at firstName column,
        at the same time filterFn must be set to apply proper filter logic.
        click show code to check details.
        ${WARNNING}
        `,
      },
      ...generateCode(`
<sc-data-grid
  .column=\${[{
    property: 'firstName',
    header: 'First name',
    filterWidget(props: FilterWidgetProps) {

      return html\`<input
          @input=\${(e: any) => {
            props.bindFilterValue(e.target?.value ?? undefined);
          }}
        />
        <button @click=\${() => props.bindFilterValue(undefined)}>
          Reset
        </button>\`;
    },
    flex: 2,
    filterFn(row, columnId, filterValue) {
      const cellValue = String(row.getValue(columnId));
      return cellValue.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  ...otherColumns,
  ]}
  filterable
  advanced-filter
>
</sc-data-grid>
      `),
    },
  },
  render: renderTemplate(),
  args: {
    columns: CustomizedFilterWidgetColumn,
    filterable: true,
    advancedFilter: true,
  },
};

const typedFilteringColumns = [
  {
    property: 'firstName',
    filter: 'text',
  },
  {
    property: 'lastName',
    filter: 'text',
    filterParams: {
      modes: ['contains', 'equals', 'notContains', 'notEquals'],
      defaultMode: 'equals',
    },
  },
  {
    property: 'age',
    filter: 'number',
  },
  {
    property: 'visits',
    filter: 'number',
    filterParams: {
      modes: [
        'equals',
        'notEquals',
        'greaterThan',
        'lessThan',
        'greaterThanOrEqual',
        'lessThanOrEqual',
      ],
      defaultMode: 'equals',
    },
  },
  {
    property: 'date',
    filter: 'date',
  },
  {
    property: 'isAdult',
    filter: 'boolean',
  },
];
export const TypedFiltering: Story = {
  parameters: {
    docs: {
      description: {
        story: `
default text modes: \`['contains', 'notContains', 'beginsWith', 'endsWith', 'equals', 'notEquals', 'empty', 'notEmpty']\`

default number modes: \`['equals', 'notEquals', 'greaterThan', 'greaterThanOrEquals', 'lessThan', 'lessThanOrEquals', 'empty', 'notEmpty']\`

default date modes: \`['equals', 'notEquals', 'before', 'after', 'between', 'empty', 'notEmpty']\`
`,
      },
      ...generateCode(`
<sc-data-grid
  filterable
  advanced-filter
  .columns=${serialize(typedFilteringColumns, { space: 4 })}
>
</sc-data-grid>
      `),
    },
  },
  render: renderTemplate(),
  args: {
    filterable: true,
    advancedFilter: true,
    data: gData(10),
    columns: typedFilteringColumns,
  },
};

const multipleFilteringColumns = [
  {
    property: 'firstName',
    filter: 'multiple',
  },
  {
    property: 'lastName',
    filter: 'multiple',
    filterParams: {
      filters: [
        {
          filter: 'setFilter',
        },
        {
          filter: 'text',
          filterParams: {
            modes: ['contains', 'equals', 'notContains', 'notEquals'],
            defaultMode: 'equals',
          },
        },
      ],
    },
  },
  {
    property: 'age',
    filter: 'multiple',
  },
  {
    property: 'visits',
    filter: 'multiple',
    filterParams: {
      filters: [
        {
          filter: 'setFilter',
        },
        {
          filter: 'number',
          filterParams: {
            modes: [
              'equals',
              'notEquals',
              'greaterThan',
              'lessThan',
              'greaterThanOrEqual',
              'lessThanOrEqual',
            ],
            defaultMode: 'equals',
          },
        },
      ],
    },
  },
  {
    property: 'date',
    filter: 'multiple',
  },
  {
    property: 'isAdult',
    filter: 'boolean',
  },
];
export const MultipleFilteringPerColumn: Story = {
  parameters: {
    docs: {
      ...generateCode(`
<sc-data-grid
  filterable
  advanced-filter
  .columns=${serialize(multipleFilteringColumns, { space: 4 })}
>
</sc-data-grid>
      `),
    },
  },
  render: renderTemplate(),
  args: {
    filterable: true,
    advancedFilter: true,
    data: gData(10),
    columns: multipleFilteringColumns,
  },
};

const customMultipleFilteringColumns: TColumn<RowData, any>[] = [
  {
    property: 'firstName',
    filter: 'multiple',
    filterParams: {
      filters: [
        {
          filterWidget: <RowData>(props: FilterWidgetProps<RowData>) => {
            return html`<input
              .value=${props.value ?? ''}
              @input=${(e: any) => {
                props.bindFilterValue(e.target?.value ?? undefined);
              }}
            />
            <button @click=${() => props.bindFilterValue(undefined)}>
              Reset
            </button>`;
          },
          filterFn: (row, columnId, filterValue) => {
            return String(row.getValue(columnId))
            ?.toLowerCase()
            .includes(filterValue.toLowerCase());
          },
        },
        {
          filter: 'setFilter',
        },
      ],
    },
  },
  {
    property: 'lastName',
    filterable: false,
  },
  {
    property: 'age',
    filterable: false,
  },
];
export const CustomMultipleFiltering: Story = {
  parameters: {
    docs: {
      ...generateCode(`
<sc-data-grid
  filterable
  advanced-filter
  .columns=${serialize(customMultipleFilteringColumns, { space: 4 })}
>
</sc-data-grid>
      `),
    },
  },
  render: renderTemplate(),
  args: {
    filterable: true,
    advancedFilter: true,
    data: gData(10),
    columns: customMultipleFilteringColumns,
  },
};

const columnsForCustomizeCellContent = [
  {
    property: 'firstName',
    flex: 1,
    header() {
      return html`
        <div style="display: flex; align-items: center;">
          <sc-dropdown-input hoist style="margin-right: 10px;">
            <sc-dropdown-option value="english">English</sc-dropdown-option>
            <sc-dropdown-option value="mandarin">Mandarin</sc-dropdown-option>
            <sc-dropdown-option value="hindi">Hindi</sc-dropdown-option>
            <sc-dropdown-option value="spanish">Spanish</sc-dropdown-option>
            <sc-dropdown-option value="french">French</sc-dropdown-option>
            <sc-dropdown-option value="french1">French1</sc-dropdown-option>
            <sc-dropdown-option value="french2">French2</sc-dropdown-option>
          </sc-dropdown-input>
          <sc-tooltip
            hoist
            class=" manual-tooltip"
            header="Action required"
            content="Morbi bibendum enim elementum a auctor."
            mode="dark"
            distance="10"
            trigger="click"
          >
            <sc-icon name="alert-circle--line"></sc-icon>
            <div slot="content">Morbi bibendum enim elementum a auctor.</div>
          </sc-tooltip>
        </div>
      `;
    },
    cell() {
      return html`
        <div style="display: flex; align-items: center;">
          <sc-dropdown-input hoist style="margin-right: 10px;">
            <sc-dropdown-option value="english">English</sc-dropdown-option>
            <sc-dropdown-option value="mandarin">Mandarin</sc-dropdown-option>
            <sc-dropdown-option value="hindi">Hindi</sc-dropdown-option>
            <sc-dropdown-option value="spanish">Spanish</sc-dropdown-option>
            <sc-dropdown-option value="french">French</sc-dropdown-option>
            <sc-dropdown-option value="french1">French1</sc-dropdown-option>
            <sc-dropdown-option value="french2">French2</sc-dropdown-option>
          </sc-dropdown-input>
          <sc-tooltip
            hoist
            class=" manual-tooltip"
            header="Action required"
            content="Morbi bibendum enim elementum a auctor."
            mode="dark"
            distance="10"
            trigger="click"
          >
            <sc-icon name="alert-circle--line"></sc-icon>
            <div slot="content">Morbi bibendum enim elementum a auctor.</div>
          </sc-tooltip>
        </div>
      `;
    },
  },
  {
    property: 'lastName',
    header: 'Last name',
    cell() {
      return html`
        <sc-tooltip
          class=" manual-tooltip"
          header="Action required"
          content="Morbi bibendum enim elementum a auctor."
          mode="dark"
          distance="10"
          trigger="hover"
        >
          Info &nbsp;&nbsp;
          <sc-icon name="alert-circle--line"></sc-icon>
          <div slot="content">Morbi bibendum enim elementum a auctor.</div>
        </sc-tooltip>
      `;
    },
  },
  {
    property: 'age',
  },
  {
    property: 'progress',
  },
];

export const CustomizeCellContent: Story = {
  parameters: {
    docs: {
      description: {
        story: `!!Notice: when you put popup elements(like dropdown, toast, etc) inside cell, it means table in editing mode.
        that means few features are not compatible. like row pinning, row spanning, col spanning.
        <br/>
        <b>Please always set trigger="click" when you inject a sc-tooltip into cell.</b>
        <br/>
        <span style="font-weight: bold; color: #d50000;">The example below is solely intended to highlight available features of the table. For implementation please follow table patterns and industry best practices.</span>
        `,
      },
      ...generateCode(`
      <sc-data-grid
        .columns=\${
          {
            property: 'firstName',
            flex: 1,
            header() {
              return html\`<sc-dropdown-input><\/sc-dropdown-input>\`;
            },
            cell() {
              return html\`
               <sc-dropdown-input><\/sc-dropdown-input>
               <sc-toltip><\/sc-toltip>
              \`;
            },
          },
          {
            property: 'lastName',
            cell() {
              return html\`
                <sc-tooltip>
                </sc-tooltip>
              \`;
            },
          },
          {
            property: 'age',
          },
          {
            property: 'progress',
          },
        }
      >
      </sc-data-grid>
        `),
    },
  },
  render: renderTemplate(),
  args: {
    sortable: true,
    masterCellRenderer(cell: any, renderCallback: (template: unknown) => void) {
      renderCallback(html`
        <div style="display: flex; align-items: center; padding: 10px;">
          <sc-dropdown-multi-select
            hoist
            style="--sc-dropdown-height: 300px; margin-right: 10px;"
          >
            <sc-dropdown-option value="english">English</sc-dropdown-option>
            <sc-dropdown-option value="mandarin">Mandarin</sc-dropdown-option>
            <sc-dropdown-option value="hindi">Hindi</sc-dropdown-option>
            <sc-dropdown-option value="spanish">Spanish</sc-dropdown-option>
            <sc-dropdown-option value="french">French</sc-dropdown-option>
            <sc-dropdown-option value="portugese">Portugese</sc-dropdown-option>
            <sc-dropdown-option value="thai">Thai</sc-dropdown-option>
          </sc-dropdown-multi-select>

          <sc-tooltip
            hoist
            header="Action required"
            content="Morbi bibendum enim elementum a auctor."
            placement="top"
            mode="dark"
            distance="10"
            skidding="0"
            trigger="click"
            content-max-width="144px"
          >
            <sc-icon name="alert-circle--line"></sc-icon>
            <div slot="content">Morbi bibendum enim elementum a auctor.</div>
          </sc-tooltip>
        </div>
      `);
    },
    isCellExpandable(cell: any) {
      return true;
    },
    data: gData(20),
    columns: columnsForCustomizeCellContent,
  },
};

const columnsForEditingMode = [
  {
    property: 'firstName',
    header: 'First name',
    flex: 1,
    enableResizing: true,
    editable: true,
  },
  {
    property: 'age',
    minSize: 60,
    flex: 1,
    editable: (cell: any) => {
      return true;
    },
    cellEditor: (props: any, params: any, sendValue: any) => {
      return html`
        ${params.value.youCanPutAnythingHere}
        <input
          type="text"
          @input=${(e: any) => {
            sendValue(Number(e.target.value) + 1);
          }}
        />
      `;
    },
    async cellEditorParams(props: any) {
      return {
        value: {
          youCanPutAnythingHere: 'You can put anything here',
        },
      };
    },
  },
  {
    property: 'date',
    minSize: 40,
    editable: true,
    flex: 1,
  },
  {
    property: 'isAdult',
    editable: true,
    flex: 1,
  },
];

export const EditingMode: Story = {
  parameters: {
    docs: {
      description: {
        story: `When enable editing mode, you can double click on editable cell to enter editing mode.

${WARNNING}
        `,
      },
      ...generateCode(`
<sc-data-grid
  .columns=\${[
    {
      property: 'firstName',
      flex: 1,
      enableResizing: true,
      editable: true,
    },
    {
      property: 'age',
      minSize: 60,
      flex: 1,
      editable: (cell: any) => {
        return true;
      },
      cellEditor: (props: any, params: any, sendValue: any) => {
        return html\`
        \${params.value.youCanPutAnythingHere}
        <input type="text" @input=\${(e) => {
          sendValue(Number(e.target.value) + 1)
        }}>

      \`
      },
      async cellEditorParams(props: any) {
        return {
          value: {
            youCanPutAnythingHere: 'You can put anything here'
          }
        }
      },
    },
    {
      property: 'date',
      minSize: 40,
      editable: true,
      flex: 1,
    },
    {
      property: 'isAdult',
      editable: true,
      flex: 1,
    },
  ]}
  @sc-change=\${e => {
    const { cell, value } = e.detail;
    dataGrid.data[cell.row.index][cell.column.columnDef.accessorKey] = value;
    dataGrid.data = [...dataGrid.data]
  }}
>
</sc-data-grid>
      `),
    },
  },
  render: renderTemplate({
    change(
      e: CustomEvent<{
        value: any;
        cell: any;
      }>,
      element: any
    ) {
      const { cell, value } = e.detail;
      console.log(cell, 'cell', value);
      element.data[cell.row.index][cell.column.columnDef.accessorKey] = value;
      element.data = [...element.data];
    },
  }),
  args: {
    columns: columnsForEditingMode,
  },
};

const draggableColumnDef = columns.map((column, index) => {
  return index === 0 ? { ...column, draggable: true } : column;
});

// const sorted = tableState.sorting.length > 0;
// const filtered = tableState.columnFilters.length > 0;
// const globalSorted = tableState.globalFilter;
// const grouped = tableState.grouping.length > 0;
// const isEnablePagination = tableOptions.isEnablePagination;
// const isManual = tableOptions.manualFiltering || tableOptions.manualSorting;
export const DraggableRow: Story = {
  parameters: {
    docs: {
      description: {
        story: `Draggable row does not work with below features:

- After applied sorting
- After applied filtering
- Row groupping
- Pagination
- Server side features
        ${WARNNING}
        `,
      },
      ...generateCode(`
<sc-data-grid
  enable-draggable-row
  enable-drag-entire-row
  .columns=\${${serialize(draggableColumnDef, { space: 12 })}}
  .renderDraggingRowsLabel=\${rows => {
    return rows.map(row => {
        return row.original.firstName
    })
  }}
>
</sc-data-grid>
      `),
    },
  },
  render: renderTemplate(),
  args: {
    data: basicData,
    columns: draggableColumnDef,
    enableDraggableRow: true,
    enableDragEntireRow: true,
    renderDraggingRowsLabel: rows => {
      return rows.map(row => {
        return `${(row.original as any).firstName} `;
      });
    },
  },
};

export const DraggableMultipleRow: Story = {
  parameters: {
    docs: {
      description: {
        story: `When you enable multiple row selection. you can drag selected rows to change the order.
        ${WARNNING}
        `,
      },
      ...generateCode(`
<sc-data-grid
  enable-draggable-row
  enable-drag-entire-row
  row-selection
  row-selection-mode="multiple"
  .columns=\${${serialize(draggableColumnDef, { space: 12 })}}
>
</sc-data-grid>
      `),
    },
  },
  render: renderTemplate(),
  args: {
    data: basicData,
    columns: draggableColumnDef,
    enableDraggableRow: true,
    enableDragEntireRow: true,
    rowSelection: true,
    rowSelectionMode: 'multiple',
  },
};

export const DraggableColumn: Story = {
  parameters: {
    docs: {
      description: {
        story: `Draggable column can be used to change the order of the columns and pin them:.

- Click and drag and column header to change the order.
- Hold \`ctrl\` while dragging to:
    - pin when on the left/right most column or
    - unpin when in the center area

        ${WARNNING}
        `,
      },
      ...generateCode(`
<sc-data-grid
  column-ordering
  enable-drag-column
  .columns=\${${serialize(draggableColumnDef, { space: 12 })}}
>
</sc-data-grid>
      `),
    },
  },
  render: renderTemplate(),
  args: {
    data: basicData,
    columns: draggableColumnDef,
    columnOrdering: true,
    enableDragColumn: true,
  },
};

const treeData = [
  {
    location: 'North America, California, San Francisco',
    count: 100,
  },
  {
    location: 'North America, California, San Jose',
    count: 120,
  },
  {
    location: 'North America, New York, New York',
    count: 130,
  },
  {
    location: 'Europe, UK, London',
    count: 200,
  },
  {
    location: 'Europe, Germany, Berlin',
    count: 250,
  },
  {
    location: 'Moon',
    count: 3,
  },
];
const treeColumns = [
  {
    property: 'location',
    rowGroupingTree: true,
    getGroupingTreePath: (originalRow: any) => originalRow.location.split(', '),
  },
  {
    property: 'count',
    filter: 'number',
    aggregationFn: 'sum',
    aggregatedCell: (props: any) => html`<sub>total: ${props.getValue()}</sub>`,
  },
] as TColumn<unknown>[];

export const TreeData: Story = {
  parameters: {
    docs: {
      ...generateCode(`
<sc-data-grid
  .data=\${${serialize(treeData, { space: 8 })}}
  .columns=\${${serialize(treeColumns, { space: 8 })}}>
  initial-expanded
</sc-data-grid>
      `),
    },
  },
  render: renderTemplate(),
  args: {
    data: treeData,
    columns: treeColumns,
    initialExpanded: true,
  },
};

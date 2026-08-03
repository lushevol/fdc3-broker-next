import { html, TemplateResult } from 'lit';
import { Conf, E_EXPAND_TYPE, TDirection } from '../elements/sc-table.js';

type Extract<T> = T extends Array<infer R> ? R : T;

const data = [
  { fruit: 'apple', color: 'green', weight: '100gr', action: 1 },
  { fruit: 'banana', color: 'yellow', weight: '140gr', action: 2 },
  { fruit: 'grapes', color: 'purple', weight: '140gr', action: 3 },
  { fruit: 'apple1', color: 'blue', weight: '100gr', action: 1 },
];
const nestedData = [
  { fruit: 'apple', color: 'green', weight: '100gr', action: 1 },
  { fruit: 'banana', color: 'yellow', weight: '140gr', action: 2 },
  { fruit: 'grapes', color: 'purple', weight: '140gr', action: 3 },
  { fruit: 'apple1', color: 'blue', weight: '100gr', action: 1 },
];

data.forEach((_: any) => {
  _.rowId = Math.random().toString(16).slice(2);
});
nestedData.forEach((_: any) => {
  _.rowId = Math.random().toString(16).slice(2);
});

const conf = [
  { property: 'fruit', header: 'Fruit' },
  {
    property: 'color',
    header: () => html`Color <sc-icon name="home--line"></sc-icon>`,
    cell: (value: string) => {
      return html`<sc-link>${value}</sc-link>`;
    },
    columnStyle: 'width: 200px',
    sort: true,
  },
  { property: 'weight', header: 'Weight' },
  {
    property: 'action',
    header: 'Action',
    cell: (value: number) => {
      if (value <= 1) return '';
      return html` <sc-button> Edit </sc-button> `;
    },
  },
];

const onSort = (cls: string) => {
  return ({ detail }: { detail: { value: string } }) => {
    const [columnKey, order] = detail.value.split(',') as [
      keyof Extract<typeof data>,
      TDirection
    ];
    const d = [
      ...(document.querySelector(`.${cls}`) as any).data,
    ] as typeof data;
    d.sort((a, b) => {
      const letterA = order === TDirection.desc ? b : a;
      const letterB = order === TDirection.desc ? a : b;
      const first = letterA[columnKey] as string | number;
      const second = letterB[columnKey] as string | number;

      if (typeof first === 'string' && typeof second === 'string') {
        return first.localeCompare(second);
      }
      if (typeof first === 'number' && typeof second === 'number') {
        return first - second;
      } else {
        return -1;
      }
    });

    (document.querySelector(`.${cls}`) as any).data = [...d];
  };
};
const onFilter = (cls: string) => {
  const conditions: Record<string, string> = {};
  return ({ detail }: { detail: { value: string, property: string } }) => {
    const property = detail.property;
    const values = detail.value;
    conditions[property] = values;
    let _data = [...data];
    for (const k in conditions) {
      const value = conditions[k];
      if (value.length) {
        // @ts-ignore
        _data = _data.filter(_ => value.includes(_[k]));
      }
    }
    (document.querySelector(`.${cls}`) as any).data = _data;
  };
};

const WARNNING = `
  <span style="font-weight: bold; color: #d50000;">This table component will be deprecated in the future. Please visit page: [Migration](https://confluence.global.standardchartered.com/display/APPPLAT/Migrate+to+SC+WebKit+2.0).</span>
`;
export default {
  title: 'Table/Table',
  component: 'sc-table',
  tags: ['autodocs'],
  
  parameters: {
    docs: {
      description: {
        component: `${WARNNING}`,
      },
    },
  },
  args: {
    data,
    conf,
    'select-all-rows': false,
    'expand-mode': 'single-only',
    expandable: false,
    'hide-header': false,
    'select-scope': 'all',
    compact: false,
    'sc-sort': onSort,
    'sc-filter': onFilter,
    'page-size': 10,
    total: data.length,
    'sticky-header': false,
    'column-chooser': false,
    pagination: false,
    'quick-jumper': false,
    'size-changer': false,
  },
  argTypes: {
    conf: {
      control: 'object',
      description: 'Set to config the header.',
      table: {
        type: { summary: 'object' },
        category: 'Attributes',
      },
    },
    data: {
      control: 'array',
      description: 'Set to render the rows.',
      table: {
        type: { summary: 'array' },
        category: 'Attributes',
      },
    },
    'sticky-header': {
      control: 'boolean',
      description: 'Set to show the sticky header.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    compact: {
      control: 'boolean',
      description: 'Enable compact mode. Make the row height lower',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'column-chooser': {
      control: 'boolean',
      description: 'Set to show the checkbox.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'select-all-rows': {
      control: 'boolean',
      description: 'Set to select all row by default if set column-chooser as true.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'hide-header': {
      control: 'boolean',
      description: 'Set to hide the header.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'select-scope': {
      control: 'inline-radio',
      options: ['all', 'page'],
      description: `Set to control select behaviour when set column-chooser as true.

      all -> select all rows of all pages
      page -> select all rows of current page
      `,
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'all' },
        category: 'Attributes',
      },
    },
    expandable: {
      control: 'boolean',
      description: 'Set to enable nested row.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'expand-mode': {
      control: 'inline-radio',
      options: ['single-only', 'multiple'],
      description:
        'Set to change different expand mode. Support \'single-only\' and \'multiple\' currently',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'multiple' },
        category: 'Attributes',
      },
    },
    rowExpandable: {
      control: 'object',
      description: `Set to control whether row can be expand or not. 
      Valid return value is 0[non-expandable], 1[expandable], 2[expanded by default].

-------

Arguments:

**rowData**: Data for each row`,
      table: {
        type: { summary: 'Function: (rowData) => number' },
        category: 'Property',
      },
    },
    rowExpandRender: {
      control: 'object',
      description: `Set to control what content should be render.

-------

Arguments:

**rowData**: Data for each row`,
      table: {
        type: { summary: 'Function: (rowData) => TemplateResult' },
        category: 'Property',
      },
    },
    selectedRows: {
      control: 'object',
      description: `Set to control which row should be selected if set column-chooser as true.

-------

Arguments:

**rowData**: Data for each row`,
      table: {
        type: { summary: 'Function: (rowData) => boolean' },
        category: 'Property',
      },
    },
    pagination: {
      control: 'boolean',
      description: 'Set to show the pagination.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    total: {
      control: 'number',
      description:
        'The total size of the pagination, will equals to the row data length if don\'t set it.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 0 },
        category: 'Attributes',
      },
    },
    'page-size': {
      control: 'number',
      description: 'The size of each page.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 10 },
        category: 'Attributes',
      },
    },
    'quick-jumper': {
      control: 'boolean',
      description: 'Set to show the quick jumper.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'size-changer': {
      control: 'boolean',
      description: 'Set to allow user to change the size of each page.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    sort: {
      control: 'text',
      description: `Sets the default sortale header, the format should be {property},{direction}, e.g 'fruit,asc'. 
      It will only take effect when use <sc-table-column> and set the column type as sort.`,
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'sc-page-change': {
      description: `Emitted when the selected page changes. Get the current page number by event.detail.page and 
      get the page size by event.detail.pageSize.`,
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-sort': {
      description: `Emitted when the sorting direction changed. 
      Get the string which format is \`\${column},\${key}\` and order by event.detail.value.`,
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-filter': {
      description:
        // eslint-disable-next-line max-len
        'Emitted when the filter conditions changed. get selected filter items by event.detail.value and current column property by event.detail.property',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-select': {
      description: `Emitted when click the checkbox in each row if set column-chooser as true. 
      The value include selectAll and selectedData which indicate if the select all checkbox is ticked.
      If has nested table, will include a map named selectedSubTableData which indicate selected child table rows.`,
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-tr-create': {
      description: `Emitted when the tr is created. Get the current row element by event.detail.tr and 
      get the row index by event.detial.lineIndex and get the row data by event.detail.item.`,
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-tr-mouseover': {
      description:
        'Emitted when the mouse is over on the tr. Get the interacted element by event.detail.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-tr-mouseout': {
      description:
        'Emitted when the mouse is out of the tr. Get the interacted element by event.detail.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-tr-tap': {
      description:
        'Emitted when click on tr. Get the interacted element by event.detail.element. Get the row data by event.detail.value.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-tr-expanded': {
      description:
        'Emitted when a row expanded. Get the data of expanded row by event.detail.value.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  conf: Conf[];
  data: [];
  sort: string;
  'sc-sort': (cls: string) => (arg: { detail: { value: string } }) => void;
  'sc-filter': (cls: string) => (arg: { detail: { value: string } }) => void;
  'column-chooser'?: boolean;
  'select-all-rows'?: boolean;
  'hide-header'?: boolean;
  'select-scope'?: string;
  rowExpandable?: (rowData: any) => E_EXPAND_TYPE;
  selectedRows?: (rowData: any) => boolean;
  rowExpandRender?: (rowData: any) => any;
  expandable?: boolean;
  'expand-mode'?: string;
  compact: boolean;
  pagination?: boolean;
  total: number;
  'page-size': number;
  'quick-jumper'?: boolean;
  'size-changer'?: boolean;
  'sticky-header'?: boolean;
}

let index = 0;

const Template: Story<ArgTypes> = (props: ArgTypes) => {
  const cls = `sc-table-qs-${index++}`;

  return html`
    <sc-table
      class="sc-table-default ${cls}"
      ?pagination=${props.pagination}
      @sc-sort=${props['sc-sort'](cls)}
      @sc-filter=${props['sc-filter'](cls)}
      page-size=${props['page-size']}
      ?select-all-rows=${props['select-all-rows']}
      total=${props['total']}
      ?size-changer=${props['size-changer']}
      ?quick-jumper=${props['quick-jumper']}
      ?column-chooser=${props['column-chooser']}
      .rowExpandRender=${props.rowExpandRender || (() => 'Placeholder')}
      .rowExpandable=${props.rowExpandable || (() => 1)}
      ?hide-header=${props['hide-header']}
      .select-scope=${props['select-scope']}
      ?expandable=${props['expandable']}
      expand-mode=${props['expand-mode']}
      ?sticky-header=${props['sticky-header']}
      ?compact=${props.compact}
      sort=${props.sort}
      .conf=${props.conf}
      .data=${props.data}
    >
    </sc-table>
    <script type="module">
      /**
       * @name conf
       * @type {Array.<{{
       *  property: string,  // The header key
       *  header: string | number | function, // The shown text of the header, set as function to customize the header
       *  cell: function, // Set to customize the cells, if set as empty, will use the data as value
       *  columnStyle: string, // Set to customize the header style
       *  sort: boolean // Set to support the sort function in current header
       *  filter: boolean // Set to support the filter function in current header
       * }}>}
       */
       const conf = [
          { property: 'fruit', header: 'Fruit' },
          { property: 'color',
            header: () => html\`Color <sc-icon name='home--line'></sc-icon>\`,
            cell: (value, properties) => {
              return html\`<sc-link>\${value}</sc-link>\`;
            };,
            columnStyle: 'min-width: 200px',
            sort: true,
            filter: true,
          },
          { property: 'weight', header: 'Weight' },
          { property: 'action',
            header: 'Action',
            cell: (value, properties) => {
              if (value <= 1) return '';
              return html\`<sc-button>Edit</sc-button>\`;
            };
          }
        ]
        const data = [
          { fruit: 'apple', color: 'green', weight: '100gr', action: 1 },
          { fruit: 'banana', color: 'yellow', weight: '140gr', action: 2 },
          { fruit: 'grapes', color: 'purple', weight: '140gr', action: 3},
          { fruit: 'apple1', color: 'green', weight: '100gr', action: 1 },
          { fruit: 'banana1', color: 'yellow', weight: '140gr', action: 2 },
          { fruit: 'grapes1', color: 'purple', weight: '140gr', action: 3},
          { fruit: 'apple2', color: 'green', weight: '100gr', action: 1 },
          { fruit: 'banana2', color: 'yellow', weight: '140gr', action: 2 },
          { fruit: 'grapes2', color: 'purple', weight: '140gr', action: 3},
          { fruit: 'apple3', color: 'green', weight: '100gr', action: 1 },
          { fruit: 'banana3', color: 'yellow', weight: '140gr', action: 2 },
          { fruit: 'grapes3', color: 'purple', weight: '140gr', action: 3}
        ]
        /**
         * <sc-table
         * ?pagination=\${pagination}
         * .conf=\${conf}
         * .data=\${data}
         * >
         * </sc-table>
         */
    </script>
  `;
};

export const Default = Template.bind({});
Default.args = {};

export const Empty = {
  parameters: {
    docs: {
      description: {
        story: `If data length is 0, will show empty tips. you also can customize tips by using slot:

\`\`\`html
<sc-table>
    <div slot="empty">There is not available records came from data if you can see me.</div>
</sc-table>
\`\`\`
        `,
      },
    },
  },
  render: (props: ArgTypes) => {
    return html`
    <sc-table
      .conf=${props.conf}
      .data=${props.data}
    >
    <div style="line-height: 200px; text-align: center;" slot="empty">There is not available records came from data if you can see me.</div>
    </sc-table>`;
  },
  args: {
    data: [],
  },
};

export const Pagination = Template.bind({});

Pagination.args = {
  pagination: true,
  'page-size': 5,
};

export const Chooser = Template.bind({});

Chooser.args = {
  'column-chooser': true,
  pagination: true,
  'page-size': 5,
};

export const noHeader = Template.bind({});

noHeader.args = {
  pagination: true,
  'page-size': 5,
  'hide-header': true,
};

const NestWithContentTemplate: Story<ArgTypes> = (props: ArgTypes) => {
  return html`
    <sc-table
      class="sc-table-default"
      ?pagination=${props.pagination}
      page-size=${props['page-size']}
      ?select-all-rows=${props['select-all-rows']}
      total=${props['total']}
      ?size-changer=${props['size-changer']}
      ?quick-jumper=${props['quick-jumper']}
      ?column-chooser=${props['column-chooser']}
      .rowExpandRender=${props.rowExpandRender || (() => 'Placeholder')}
      .rowExpandable=${props.rowExpandable || (() => 1)}
      ?hide-header=${props['hide-header']}
      .select-scope=${props['select-scope']}
      ?expandable=${props['expandable']}
      expand-mode=${props['expand-mode']}
      ?sticky-header=${props['sticky-header']}
      ?compact=${props.compact}
      .conf=${props.conf}
      .data=${props.data}
    >
    </sc-table>
    <script type="module">
      /**
       * <sc-table
       *     class="sc-table-default"
       *     .rowExpandRender=\${(rowData: any) => return html\`<div>nested content - \${rowData.fruit}</div>\`}
       *     .rowExpandable=${() => 1}
       *     hide-header
       *     expandable
       *     compact
       *     .conf=\${conf}
       *     .data=\${data}
       *   >
       * </sc-table>
       */
    </script>
  `;
};

export const nestWithDefaultExpanded = NestWithContentTemplate.bind({});

nestWithDefaultExpanded.args = {
  expandable: true,
  'expand-mode': 'single-only',
  rowExpandable(rowData) {
    if (rowData.fruit === 'apple') {
      return 2;
    }
    return 1;
  },
  rowExpandRender(rowData) {
    return html`<div>nested content - ${rowData.fruit}</div>`;
  },
};
export const nestWithAccordion = NestWithContentTemplate.bind({});

nestWithAccordion.args = {
  expandable: true,
  'expand-mode': 'single-only',
  rowExpandable(rowData) {
    if (rowData.fruit === 'apple') {
      return 0;
    }
    return 1;
  },
  rowExpandRender(rowData) {
    return html`<div>nested content - ${rowData.fruit}</div>`;
  },
};
export const nestWithContent = NestWithContentTemplate.bind({});

nestWithContent.args = {
  expandable: true,
  rowExpandable(rowData) {
    if (rowData.fruit === 'apple') {
      return 0;
    }
    return 1;
  },
  rowExpandRender(rowData) {
    return html`<div>nested content - ${rowData.fruit}</div>`;
  },
};

const NestWithTableTemplate: Story<ArgTypes> = (props: ArgTypes) => {
  return html`
    <sc-table
      class="nest-with-table"
      ?pagination=${props.pagination}
      page-size=${props['page-size']}
      ?select-all-rows=${props['select-all-rows']}
      total=${props['total']}
      ?size-changer=${props['size-changer']}
      ?quick-jumper=${props['quick-jumper']}
      ?column-chooser=${props['column-chooser']}
      .rowExpandRender=${props.rowExpandRender || (() => 'Placeholder')}
      .rowExpandable=${props.rowExpandable || (() => 1)}
      ?hide-header=${props['hide-header']}
      .select-scope=${props['select-scope']}
      ?expandable=${props['expandable']}
      ?sticky-header=${props['sticky-header']}
      ?compact=${props.compact}
    >
    </sc-table>
    <script type="module">
      // Make sure attach unique id on each item of data below.
      const data = ${JSON.stringify(data, null, 2)};
      const conf = ${JSON.stringify(conf, null, 2)};
      const nestedData = ${JSON.stringify(nestedData, null, 2)};
      
      const table = document.querySelector('.nest-with-table');
      table.conf = conf;
      table.data = data;
      table.addEventListener('sc-select', (e) => {
        console.log(e.detail);
      })
      table.rowExpandable = (rowData) => {
        if (rowData.fruit === 'banana') {
          return 0;
        }
        return 1;
      }
      table.rowExpandRender = () => {
        return html\`
          <sc-table
          column-chooser
            class="sc-table-default"
            .rowExpandRender=\${() => {
    return html\`Deepest\`;
  }}
            expandable
            compact
            .conf=\${conf}
            .data=\${nestedData}
          >
          </sc-table>
        \`;
      }

    </script>
  `;
};


export const nestWithTable = NestWithTableTemplate.bind({});

nestWithTable.args = {
  expandable: true,
  'column-chooser': true,
};
// @ts-ignore
nestWithTable.decorators = [Story => {
  // @ts-ignore
  window.html = html;
  return Story();
}];

const FilterableTableTemplate: Story<ArgTypes> = (props: ArgTypes) => {
  return html`
    <sc-table
      class="filterable-table"
      ?pagination=${props.pagination}
      page-size=${props['page-size']}
      total=${props['total']}
      ?size-changer=${props['size-changer']}
      ?quick-jumper=${props['quick-jumper']}
      ?column-chooser=${props['column-chooser']}
      ?hide-header=${props['hide-header']}
      .select-scope=${props['select-scope']}
      ?expandable=${props['expandable']}
      .expandMode=${props['expand-mode']}
      ?sticky-header=${props['sticky-header']}
      ?compact=${props.compact}
      .conf=${props.conf}
      .data=${props.data}
    >
    </sc-table>
    <script type="module">
      /**
        * const conf = [....];
        * this.data = [
        *  { fruit: 'apple', color: 'green', weight: '100gr', action: 1 },
        *  { fruit: 'banana', color: 'yellow', weight: '140gr', action: 2 },
        *  { fruit: 'grapes', color: 'purple', weight: '140gr', action: 3 },
        *  { fruit: 'apple1', color: 'blue', weight: '100gr', action: 1 },
        * ]
      */
      const conf = [
        {
          "property": "fruit",
          "header": "Fruit",
          "sort": false,
          "filter": true,
          // If you want customize filter options or fetch from backend.
          // You can put lookup function inside filterParams. that function need to return
          // { label: string, value: string }[] or Promise{ label: string, value: string }[]<>
          // ATTENTION PLEASE: keyword is optional parameter
          filterParams: {
            lookup: (keyword) => {
              return new Promise(res => {
                setTimeout(() => {
                  res(this.data.filter(_ => keyword ? _.fruit.includes(keyword) : true).map(d => ({
                    label: d.fruit,
                    value: d.fruit,
                  })));
                }, 1000);
              });
            },
          }
        },
        {
          "property": "color",
          "columnStyle": "width: 200px",
          "sort": false,
          "filter": true,
          // If you want customize filter options or fetch from backend.
          // You can put lookup function inside filterParams. that function need to return
          // { label: string, value: string }[] or Promise{ label: string, value: string }[]<>
          // ATTENTION PLEASE: keyword is optional parameter
          filterParams: {
            lookup: (keyword) => {
              return new Promise(res => {
                setTimeout(() => {
                  res(this.data.filter(_ => keyword ? _.fruit.includes(keyword) : true).map(d => ({
                    label: d.fruit,
                    value: d.fruit,
                  })));
                }, 1000);
              });
            },
          }
        },
        {
          "property": "weight",
          "header": "Weight",
          "sort": false,
          "filter": true,
          // If you want customize filter options or fetch from backend.
          // You can put lookup function inside filterParams. that function need to return
          // { label: string, value: string }[] or Promise{ label: string, value: string }[]<>
          // ATTENTION PLEASE: keyword is optional parameter
          filterParams: {
            lookup: (keyword) => {
              return new Promise(res => {
                setTimeout(() => {
                  res(this.data.filter(_ => keyword ? _.fruit.includes(keyword) : true).map(d => ({
                    label: d.fruit,
                    value: d.fruit,
                  })));
                }, 1000);
              });
            },
          }
        },
        {
          "property": "action",
          "header": "Action",
          "sort": false,
          "filter": true,
          // If you want customize filter options or fetch from backend.
          // You can put lookup function inside filterParams. that function need to return
          // { label: string, value: string }[] or Promise{ label: string, value: string }[]<>
          // ATTENTION PLEASE: keyword is optional parameter
          filterParams: {
            lookup: (keyword) => {
              return new Promise(res => {
                setTimeout(() => {
                  res(this.data.filter(_ => keyword ? _.fruit.includes(keyword) : true).map(d => ({
                    label: d.fruit,
                    value: d.fruit,
                  })));
                }, 1000);
              });
            },
          }
        }
      ];
      const data = [
        { fruit: 'apple', color: 'green', weight: '100gr', action: 1 },
        { fruit: 'banana', color: 'yellow', weight: '140gr', action: 2 },
        { fruit: 'grapes', color: 'purple', weight: '140gr', action: 3 },
        { fruit: 'apple1', color: 'blue', weight: '100gr', action: 1 },
      ];
      const table = document.querySelector('.filterable-table');
      const conditions = {};
      table.addEventListener('sc-filter', e => {
        const property = e.detail.property;
        const values = e.detail.value;
        conditions[property] = values;
        let _data = [...data];
        for (const k in conditions) {
          const value = conditions[k];
          if (value.length) {
            _data = _data.filter(_ => value.includes(_[k]));
          }
        }
        table.data = _data;
      });
      /**
       * <sc-table
       *     .conf=\${conf}
       *     .data=\${data}
       *   >
       * </sc-table>
       *
       */
    </script>
  `;
};

export const FilterableTable = FilterableTableTemplate.bind({});

FilterableTable.args = {
  expandable: false,
  conf: conf.map(_ => ({ ..._, sort: false, filter: true, filterParams: {
    lookup(keyword) {
      return new Promise(res => {
        setTimeout(function () {
          res(data.filter(_ => keyword ? _.fruit.includes(keyword) : true).map(d => ({
            label: d.fruit,
            value: d.fruit,
          })));
        }, 1000);
      });
    },
  } })),
};



const DefaultSelectTemplate: Story<ArgTypes> = (props: ArgTypes) => {

  return html`
    <sc-table
      class="select-default"
      ?pagination=${props.pagination}
      page-size=${props['page-size']}
      ?select-all-rows=${props['select-all-rows']}
      total=${props['total']}
      ?size-changer=${props['size-changer']}
      ?quick-jumper=${props['quick-jumper']}
      ?column-chooser=${props['column-chooser']}
      .rowExpandRender=${props.rowExpandRender || (() => 'Placeholder')}
      .selectedRows=${props.selectedRows || (() => false)}
      .rowExpandable=${props.rowExpandable || (() => 1)}
      ?hide-header=${props['hide-header']}
      .select-scope=${props['select-scope']}
      ?expandable=${props['expandable']}
      expand-mode=${props['expand-mode']}
      ?sticky-header=${props['sticky-header']}
      ?compact=${props.compact}
      .conf=${props.conf}
      .data=${props.data}
    >
    </sc-table>
    <script type="module">
      const table = document.querySelector('select-default');
      table.selectedRows = (rowData: any) => {
        return rowData.fruit !== 'banana';
      };
    </script>
  `;
};

export const defaultSelect = DefaultSelectTemplate.bind({});

defaultSelect.args = {
  'column-chooser': true,
  'select-all-rows': true,
  selectedRows: (rowData: any) => {
    return rowData.fruit !== 'banana';
  },
};

const stickyColumnConf = [
  {
    property: 'fruit',
    header: 'fruit',
    cell: (value: any) => {
      return html`<sc-link>${value}</sc-link>`;
    },
    columnStyle: 'min-width: 120px;',
    pinned: 'left',
  },
  {
    property: 'color', columnStyle: 'min-width: 120px', header: 'Color',
    pinned: 'left',
  },
  {
    property: 'weight', columnStyle: 'min-width: 120px', header: 'Weight1',
  },
  { property: 'weight', columnStyle: 'min-width: 120px', header: 'Weight2' },
  { property: 'weight', columnStyle: 'min-width: 120px', header: 'Weight3' },
  { property: 'weight', columnStyle: 'min-width: 120px', header: 'Weight4' },
  { property: 'weight', header: 'Weight5' },
  { property: 'weight', columnStyle: 'min-width: 120px', header: 'Weight6' },
  { property: 'weight', columnStyle: 'min-width: 120px', header: 'Weight7' },
  { property: 'weight', columnStyle: 'min-width: 120px', header: 'Weight8' },
  { property: 'weight', columnStyle: 'min-width: 120px', header: 'Weight9' },
  { property: 'weight', columnStyle: 'min-width: 120px', header: 'Weight10', pinned: 'right' },
];


const StickyColumnTemplate: Story<ArgTypes> = (props: ArgTypes) => {

  return html`
  <sc-table
    class="sticky-column"
    ?pagination=${props.pagination}
    page-size=${props['page-size']}
    ?select-all-rows=${props['select-all-rows']}
    total=${props['total']}
    ?size-changer=${props['size-changer']}
    ?quick-jumper=${props['quick-jumper']}
    ?column-chooser=${props['column-chooser']}
    .rowExpandRender=${props.rowExpandRender || (() => 'Placeholder')}
    .selectedRows=${props.selectedRows || (() => false)}
    .rowExpandable=${props.rowExpandable || (() => 1)}
    ?hide-header=${props['hide-header']}
    ?expandable=${props['expandable']}
    .expand-mode=${props['expand-mode']}
    ?sticky-header=${props['sticky-header']}
    ?compact=${props.compact}
  >
  </sc-table>
  <script type="module">
    const table = document.querySelector('.sticky-column');
    table.data = ${JSON.stringify(data, null, 2)};
    /**
    * Set pinned property on conf if you want to make a column pinned
    * Set pinned: 'left' to pinned on left
    * Set pinned: 'right' to pinned on right
    */
    table.conf = ${JSON.stringify(stickyColumnConf, null, 2)};
  </script>
`;
};

export const StickyColumn = StickyColumnTemplate.bind({});

StickyColumn.args = {
  'column-chooser': true,
  expandable: true,
};
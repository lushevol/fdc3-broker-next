import { html, TemplateResult } from 'lit';

const data = [
  {
    field: {
      value: 'Request ID',
    },
    value: {
      value: 'REQ1237',
    },
  },
  {
    field: {
      value: 'Effective Date',
    },
    value: {
      value: '22 Feb 2022',
    },
  },
  {
    field: {
      value: 'Effective Date-1',
    },
    value: {
      value: '22 Feb 2023',
    },
  },
  {
    field: {
      value: 'Effective Date-2',
    },
    value: {
      value: '22 Feb 2024',
    },
  },
  {
    field: {
      value: 'Effective Date-3',
    },
    value: {
      value: '22 Feb 2024',
    },
  },
];
const customData = [
  {
    field: {
      value: 'Request ID',
      style: 'color: var(--sc-color-red)',
    },
    value: {
      value: (currentRowIndex: number, currentColIndex: number) => html`
        <sc-link
          >REQ1237, I'm in row ${currentRowIndex}, col
          ${currentColIndex}</sc-link
        >
      `,
    },
  },
  {
    field: {
      value: 'Effective Date',
    },
    value: {
      value: '22 Feb 2022',
      style: 'text-align: right',
    },
  },
  {
    field: {
      value: (currentRowIndex: number, currentColIndex: number) => html`
        Effective Date-2, I'm in row ${currentRowIndex}, col ${currentColIndex}
      `,
    },
    value: {
      value: '22 Feb 2023',
    },
  },
  {
    field: {
      value: 'Effective Date-2',
    },
    value: {
      value: '22 Feb 2024',
    },
  },
  {
    field: {
      value: 'Effective Date-3',
    },
    value: {
      value: '22 Feb 2024',
    },
  },
];
export default {
  title: 'Table/Data View',
  component: 'sc-data-view',
  parameters: {
    docs: {
      description: {
        component:
          'Data View is a component that provides a partial view with the data.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'array',
      description: 'Sets the data.',
      table: {
        type: { summary: 'array' },
        defaultValue: { summary: [] },
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
    mode: {
      control: 'inline-radio',
      options: ['table', 'view'],
      description: 'The view mode.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'table' },
        category: 'Attributes',
      },
    },
    columns: {
      control: 'number',
      description: 'Sets how many columns in each row.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 1 },
        category: 'Attributes',
      },
    },
    'horizontal-align': {
      control: 'inline-radio',
      options: ['left', 'center', 'right'],
      description: 'Horizontal alignment of text inside cell.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'left' },
        category: 'Attributes',
      },
    },
    'vertical-align': {
      control: 'inline-radio',
      options: ['top', 'middle', 'bottom'],
      description: 'Vertical alignment of text inside cell.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'middle' },
        category: 'Attributes',
      },
    },
  },
  args: {
    columns: 1,
    mode: 'table',
    'horizontal-align': 'left',
    'vertical-align': 'middle',
    data,
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  data: any[];
  mode?: string;
  columns?: number;
  compact: boolean;
  'horizontal-align'?: string;
  'vertical-align'?: string;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-data-view
    mode=${props.mode}
    columns=${props.columns}
    .data=${props.data}
    ?compact=${props.compact}
    horizontal-align=${props['horizontal-align']}
    vertical-align=${props['vertical-align']}
  ></sc-data-view>
  <script type="module">
    /**
     * @name data
     * @type {Array.<{{
     *  field: {
     *    value: string | number | function, // The shown text of the field, set as function to customize the field
     *    style: string // Set to customize the field style
     *  }
     *  value: {
     *    value: string | number | function, // The shown text of the value, set as function to customize the value
     *    style: string // Set to customize the value style
     *  }
     * }}>}
     */
    const data = [
      {
        field: {
          value: 'Request ID',
        },
        value: {
          value: 'REQ1237',
        },
      },
      {
        field: {
          value: 'Effective Date',
        },
        value: {
          value: '22 Feb 2022',
        },
      },
      {
        field: {
          value: 'Effective Date-1',
        },
        value: {
          value: '22 Feb 2023',
        },
      },
      {
        field: {
          value: 'Effective Date-2',
        },
        value: {
          value: '22 Feb 2024',
        },
      },
      {
        field: {
          value: 'Effective Date-3',
        },
        value: {
          value: '22 Feb 2024',
        },
      },
    ];
    const customData = [
      {
        field: {
          value: 'Request ID',
          style: 'color: var(--sc-color-red)',
        },
        value: {
          value: (currentRowIndex, currentColIndex, row) => html\`
            <sc-link
              >REQ1237, I'm in row \${currentRowIndex}, col
              \${currentColIndex}</sc-link
            >
          \`,
        },
      },
      {
        field: {
          value: 'Effective Date',
        },
        value: {
          value: '22 Feb 2022',
          style: 'text-align: right',
        },
      },
      {
        field: {
          value: (currentRowIndex, currentColIndex, row) => html\`
            <sc-link
              >Effective Date-2, I'm in row \${currentRowIndex}, col
              \${currentColIndex}</sc-link
            >
          \`,
        },
        value: {
          value: '22 Feb 2023',
        },
      },
      {
        field: {
          value: 'Effective Date-2',
        },
        value: {
          value: '22 Feb 2024',
        },
      },
      {
        field: {
          value: 'Effective Date-3',
        },
        value: {
          value: '22 Feb 2024',
        },
      },
    ];
    /**
     * <sc-data-view
     *  .mode=\${mode}
     *  .columns=\${columns}
     *  .data=\${data}
     *  .horizontal-align=\${horizontal-align}
     *  .vertical-align=\${vertical-align}
     * >
     * </sc-data-view>
     */
  </script>
`;

export const Default = Template.bind({});
Default.args = {
  data,
};

export const ViewMode = Template.bind({});
ViewMode.args = {
  mode: 'view',
  data,
};

export const CustomData = Template.bind({});
CustomData.args = {
  data: customData,
};

export const ViewModeWithCustomData = Template.bind({});
ViewModeWithCustomData.args = {
  mode: 'view',
  data: customData,
};

export const CustomDataWithAligment = Template.bind({});
CustomDataWithAligment.args = {
  data: customData,
  'horizontal-align': 'center',
  'vertical-align': 'top',
};

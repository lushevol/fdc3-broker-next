import { html, nothing, TemplateResult } from 'lit';

export default {
  title: 'Components/Pagination',
  component: 'sc-pagination',
  parameters: {
    docs: {
      description: {
        component:
          'Pagination component display active page and navigate between multiple page.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['default', 'document'],
      description: 'The mode of the pagination.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Attributes',
      },
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'The size of the pagination.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
        category: 'Attributes',
      },
    },
    alignment: {
      control: 'inline-radio',
      options: ['left', 'center', 'right'],
      description: 'The alignment of the pagination.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'center' },
        category: 'Attributes',
      },
    },
    label: {
      control: 'boolean',
      description: 'Set to show the label.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'no-truncation': {
      control: 'boolean',
      description: 'Set to hide truncation between pages.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'mode', neq: 'document' },
    },
    'jump-first-last-page': {
      control: 'boolean',
      description: 'Set to show first page and last page jumpers.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
        category: 'Attributes',
      },
    },
    total: {
      control: 'number',
      description:
        'The total number of items. In `document` mode, this is optional and only used to render the `1-10 of 100 items` label.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 0 },
        category: 'Attributes',
      },
    },
    'total-pages': {
      control: 'number',
      description:
        'The total pages/slides. In `document` mode, this is required to calculate the navigation limits `Document 1 of 10` text.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 0 },
        category: 'Attributes',
      },
      if: { arg: 'mode', eq: 'document' },
    },
    'current-page': {
      control: 'number',
      description: 'The current selected page.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 1 },
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
      description: 'Sets to show the quick jumper.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'size-changer': {
      control: 'boolean',
      description: 'Sets to allow user to change the size of each page.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'no-margin': {
      control: 'boolean',
      description: 'Set to remove top and bottom margin from the pagination.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    loading: {
      control: 'boolean',
      description: 'Whether loading state is active.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'loading-target': {
      control: 'text',
      description:
        'Target showing spinner (page `number` or `prev`, `next`, `first`, `last`, `jump-prev`, `jump-next`)',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'null' },
        category: 'Attributes',
      },
    },
    'disabled-pages': {
      control: 'array',
      description: 'Sets the pages that should be shown in a disabled state.',
      table: {
        type: { summary: 'array' },
        category: 'Attributes',
      },
      if: { arg: 'mode', neq: 'document' },
    },
    'page-size-options': {
      control: 'object',
      description: 'Set to define custom page size options.',
      table: {
        type: { summary: 'number[]' },
        category: 'Attributes',
      },
    },
    'sc-change': {
      description: `Emitted when the selected page changes. Get the current page number by event.detail.page 
      and get the page size by event.detail.pageSize.`,
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
  },
  args: {
    mode: 'default',
    size: 'md',
    alignment: 'center',
    label: false,
    'no-truncation': false,
    'jump-first-last-page': false,
    total: 0,
    'total-pages': 10,
    'current-page': 1,
    'page-size': 10,
    'quick-jumper': false,
    'size-changer': false,
    'no-margin': false,
    loading: false,
    'loading-target': '',
    'disabled-pages': [],
    'page-size-options': [],
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  mode: string;
  size: string;
  alignment: string;
  label?: boolean;
  'no-truncation'?: boolean;
  'jump-first-last-page'?: boolean;
  total?: number;
  'total-pages'?: number;
  'current-page'?: number;
  'page-size'?: number;
  'quick-jumper'?: boolean;
  'size-changer'?: boolean;
  'no-margin'?: boolean;
  'disabled-pages': number[];
  'page-size-options': number[];
  loading?: boolean;
  'loading-target'?: string;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <div style="padding-bottom:80px">
    <sc-pagination
      mode=${props.mode}
      size=${props.size}
      alignment=${props.alignment}
      ?label=${props.label}
      ?no-truncation=${props['no-truncation']}
      ?jump-first-last-page=${props['jump-first-last-page']}
      total=${props.total}
      total-pages=${props['total-pages'] || 0}
      current-page=${props['current-page'] || 1}
      page-size=${props['page-size'] || 10}
      ?quick-jumper=${props['quick-jumper']}
      ?size-changer=${props['size-changer']}
      ?no-margin=${props['no-margin']}
      ?loading=${props.loading}
      loading-target=${props['loading-target'] || nothing}
      disabled-pages=${JSON.stringify(props['disabled-pages'])}
      page-size-options=${JSON.stringify(props['page-size-options'])}
    />
  </div>
`;

export const Default = Template.bind({});
Default.args = {
  total: 100,
};

export const SizeChanger = Template.bind({});
SizeChanger.args = {
  total: 100,
  'size-changer': true,
};

export const QuickJumper = Template.bind({});
QuickJumper.args = {
  total: 100,
  'quick-jumper': true,
};

export const CustomizedPage = Template.bind({});
CustomizedPage.args = {
  total: 100,
  'current-page': 3,
};

export const CustomizedPageSize = Template.bind({});
CustomizedPageSize.args = {
  total: 100,
  'page-size': 30,
  'size-changer': true,
};

export const CustomizedPageSizeOptions = Template.bind({});
CustomizedPageSizeOptions.args = {
  total: 100,
  'size-changer': true,
  'page-size-options': [5, 20, 50],
};

export const DocumentMode = Template.bind({});
DocumentMode.args = {
  mode: 'document',
  'total-pages': 10,
  'current-page': 3,
};

export const DocumentModeWithLabel = Template.bind({});
DocumentModeWithLabel.args = {
  mode: 'document',
  label: true,
  total: 100,
  'total-pages': 10,
};

export const DoubleTruncation = Template.bind({});
DoubleTruncation.args = {
  total: 300,
  'current-page': 15,
};

export const DisabledPages = Template.bind({});
DisabledPages.args = {
  total: 100,
  'disabled-pages': [3, 5, 7],
};

export const LoadingState = (props: ArgTypes) => html`
  <div>
    <p style="margin-bottom: 16px; color: #666; font-size: 14px;">
      Use <code>loading</code> and <code>loading-target</code> properties to
      show a spinner on a specific element.
    </p>
    <pre
      style="
      background: #f5f5f5;
      padding: 16px;
      margin-bottom: 16px;
      font-size: 12px;"
    >
      const pagination = document.querySelector('sc-pagination');

      // When user clicks a page
      pagination.addEventListener('sc-change', async (e) => {
        pagination.loading = true;
        pagination.loadingTarget = e.detail.page;

        await fetchData(e.detail.page);

        pagination.loading = false;
      });</pre>
    <sc-pagination
      mode=${props.mode}
      size=${props.size || 'md'}
      alignment=${props.alignment}
      ?label=${props.label}
      ?no-truncation=${props['no-truncation']}
      ?jump-first-last-page=${props['jump-first-last-page']}
      total=${props.total || 0}
      total-pages=${props['total-pages'] || 0}
      current-page=${props['current-page'] || 1}
      page-size=${props['page-size'] || 10}
      ?loading=${props.loading}
      loading-target=${props['loading-target'] || nothing}
    ></sc-pagination>
  </div>
`;
LoadingState.args = {
  total: 100,
  loading: true,
  'loading-target': '3',
};

import { html, TemplateResult } from 'lit';

export default {
  title: 'Layout/Search Layout',
  component: 'sc-search-layout',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Search layout is a generic layout to show search criteria and search result',
      },
    },
    layout: 'fullscreen',
  },
  argTypes: {
    height: {
      control: 'inline-radio',
      options: ['cover', 'auto'],
      description: 'Set if layout covers full window height',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'auto' },
        category: 'Attributes',
      },
    },
    title: {
      control: 'text',
      description: 'Sets title',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'Attributes',
      },
    },
    description: {
      control: 'text',
      description: 'Sets description',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'Attributes',
      },
    },
    'hide-image': {
      control: 'boolean',
      description: 'Sets if hide the image at the right position of banner.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'image-src': {
      control: 'text',
      description: 'Sets custom image src',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'Attributes',
      },
      if: { arg: 'hide-image', eq: false },
    },
    'multiple-search': {
      control: 'boolean',
      description: 'Sets to show only one search field or both basic and advanced search fields.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'single-search-placeholder': {
      control: 'text',
      description: 'Sets placeholder of single search field',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'Attributes',
      },
      if: { arg: 'multiple-search', eq: false },
    },
    loading: {
      control: 'boolean',
      description: 'Show spinner in the search result area',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'header-primary-actions': {
      control: 'object',
      description: 'Primary dropdown actions passed to internal sc-landing-layout header.',
      table: {
        type: { summary: 'Array<{label: string; value: string}>' },
        defaultValue: { summary: '[]' },
        category: 'Attributes',
      },
    },
    'header-secondary-actions': {
      control: 'object',
      description: 'Secondary dropdown actions passed to internal sc-landing-layout header.',
      table: {
        type: { summary: 'Array<{label: string; value: string}>' },
        defaultValue: { summary: '[]' },
        category: 'Attributes',
      },
    },
    'header-optional-actions': {
      control: 'object',
      description: 'Optional actions shown in more-horizontal menu.',
      table: {
        type: { summary: 'Array<{label: string; value: string}>' },
        defaultValue: { summary: '[]' },
        category: 'Attributes',
      },
    },
    'slot[name=\'title\']': {
      control: 'text',
      description: 'Sets to customize the title.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'description\']': {
      control: 'text',
      description: 'Sets to customize the description.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'basic-search\']': {
      control: 'text',
      description: 'Sets to customize the basic search conditions.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'advance-search\']': {
      control: 'text',
      description: 'Sets to customize the advance search conditions.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'result\']': {
      control: 'text',
      description: 'Sets to customize the search result.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'empty-message\']': {
      control: 'text',
      description: 'Sets to customize the message when there isn\'t search result.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'header-action-slot\']': {
      control: 'text',
      description: 'Fallback custom header action content when action props are empty.',
      table: {
        category: 'Slots',
      },
    },
  },
  args: {
    height: 'auto',
    title: '',
    description: '',
    'hide-image': false,
    'image-src': '',
    'multiple-search': false,
    'single-search-placeholder': '',
    loading: false,
    'header-primary-actions': [],
    'header-secondary-actions': [],
    'header-optional-actions': [],
    'slot[name=\'title\']': '',
    'slot[name=\'description\']': '',
    'slot[name=\'basic-search\']': '',
    'slot[name=\'advance-search\']': '',
    'slot[name=\'result\']': '',
    'slot[name=\'empty-message\']': '',
    'slot[name=\'header-action-slot\']': '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  height?: string;
  title?: string;
  description?: string;
  'hide-image'?: boolean;
  'image-src'?: string;
  'multiple-search'?: boolean;
  'single-search-placeholder'?: string;
  loading?: boolean;
  'header-primary-actions'?: { label: string; value: string }[];
  'header-secondary-actions'?: { label: string; value: string }[];
  'header-optional-actions'?: { label: string; value: string }[];
  'slot[name=\'title\']'?: TemplateResult;
  'slot[name=\'description\']'?: TemplateResult;
  'slot[name=\'basic-search\']'?: TemplateResult;
  'slot[name=\'advance-search\']'?: TemplateResult;
  'slot[name=\'result\']'?: TemplateResult;
  'slot[name=\'empty-message\']'?: TemplateResult;
  'slot[name=\'header-action-slot\']'?: TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => {
  return html`
    <sc-search-layout 
      height=${props.height}
      ?multiple-search=${props['multiple-search']}
      single-search-placeholder=${props['single-search-placeholder']}
      ?loading=${props.loading}
      ?hide-image=${props['hide-image']}
      image-src=${props['image-src']}
      .headerPrimaryActions=${props['header-primary-actions'] || []}
      .headerSecondaryActions=${props['header-secondary-actions'] || []}
      .headerOptionalActions=${props['header-optional-actions'] || []}
    >
      <div slot="title">
        ${props['title']
    ? props['title']
    : props['slot[name=\'title\']']
}
      </div>
      <div slot="description">
        ${props['description']
    ? props['description']
    : props['slot[name=\'description\']']
}
      </div>
      <div slot="basic-search">
        ${props['slot[name=\'basic-search\']']}
      </div>
      <div slot='advance-search'>
          ${props['slot[name=\'advance-search\']']}
      </div>
      <div slot='result'>
          ${props['slot[name=\'result\']']}
      </div>
      ${props['slot[name=\'empty-message\']'] ? html`
        <div slot='empty-message'>
          ${props['slot[name=\'empty-message\']']}
        </div>
      ` : null}
      <div slot='header-action-slot'>
        ${props['slot[name=\'header-action-slot\']']}
      </div>
    </sc-search-layout>
  `;
};

export const Default = Template.bind({});
Default.args = {
  title: 'Search Layout',
  description: 'To get started, please search using either customer name, ' +
    'relationship numbers or their entity identification numbers',
  'single-search-placeholder': 'Search for name, description...',
  'slot[name=\'basic-search\']': html`
    <sc-grid-row>
      <sc-grid-column xs='6' md='4' lg='4' style="margin-bottom:12px;">
        <sc-text-input border-type='box' placeholder="Input text">
          Text Input 1
        </sc-text-input>
      </sc-grid-column>
      <sc-grid-column xs='6' md='4' lg='4' style="margin-bottom:12px;" >
        <sc-text-input border-type='box' placeholder="Input text">
          Text Input 2
        </sc-text-input>
      </sc-grid-column>
      <sc-grid-column xs='6' md='4' lg='4' style="margin-bottom:12px;" >
        <sc-text-input border-type='box' placeholder="Input text">
          Text Input 3
        </sc-text-input>
      </sc-grid-column>
      <sc-grid-column xs='6' md='4' lg='4' style="margin-bottom:12px;" >
        <sc-text-input border-type='box' placeholder="Input text">
          Text Input 4
        </sc-text-input>
      </sc-grid-column>
      <sc-grid-column xs='6' md='4' lg='4' style="margin-bottom:12px;" >
        <sc-text-input border-type='box' placeholder="Input text">
          Text Input 5
        </sc-text-input>
      </sc-grid-column>
    </sc-grid-row>
  `,
  'slot[name=\'advance-search\']': html`
    <sc-grid-row>
      <sc-grid-column xs='6' md='4' lg='3' style="margin-bottom:12px;">
        <sc-text-input border-type='box' placeholder="Input text">
          Advance search 1
        </sc-text-input>
      </sc-grid-column>
      <sc-grid-column xs='6' md='4' lg='3' style="margin-bottom:12px;" >
        <sc-text-input border-type='box' placeholder="Input text">
          Advance search 2
        </sc-text-input>
      </sc-grid-column>
      <sc-grid-column xs='6' md='4' lg='3' style="margin-bottom:12px;" >
        <sc-text-input border-type='box' placeholder="Input text">
          Advance search 3
        </sc-text-input>
      </sc-grid-column>
      <sc-grid-column xs='6' md='4' lg='3' style="margin-bottom:12px;" >
        <sc-text-input border-type='box' placeholder="Input text">
          Advance search 4
        </sc-text-input>
      </sc-grid-column>
    </sc-grid-row>
  `,
  'slot[name=\'result\']': html`
    <sc-grid-row>
      <sc-grid-column xs='6' md='4' lg='3' style='margin-bottom:12px;'>
        <sc-card>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla morbi ultrices massa,
            consectetur mi ullamcorper sed cras aliquam. Et phasellus varius nisl et cras sagittis.
          </div>
        </sc-card>
      </sc-grid-column>
      <sc-grid-column xs='6' md='4' lg='3' style='margin-bottom:12px;'>
        <sc-card>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla morbi ultrices massa,
            consectetur mi ullamcorper sed cras aliquam. Et phasellus varius nisl et cras sagittis.
          </div>
        </sc-card>
      </sc-grid-column>
      <sc-grid-column xs='6' md='4' lg='3' style='margin-bottom:12px;'>
        <sc-card>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla morbi ultrices massa,
            consectetur mi ullamcorper sed cras aliquam. Et phasellus varius nisl et cras sagittis.
          </div>
        </sc-card>
      </sc-grid-column>
      <sc-grid-column xs='6' md='4' lg='3' style='margin-bottom:12px;'>
        <sc-card>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla morbi ultrices massa,
            consectetur mi ullamcorper sed cras aliquam. Et phasellus varius nisl et cras sagittis.
          </div>
        </sc-card>
      </sc-grid-column>
      <sc-grid-column xs='6' md='4' lg='3' style='margin-bottom:12px;'>
        <sc-card>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla morbi ultrices massa,
            consectetur mi ullamcorper sed cras aliquam. Et phasellus varius nisl et cras sagittis.
          </div>
        </sc-card>
      </sc-grid-column>
      <sc-grid-column xs='6' md='4' lg='3' style='margin-bottom:12px;'>
        <sc-card>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla morbi ultrices massa,
            consectetur mi ullamcorper sed cras aliquam. Et phasellus varius nisl et cras sagittis.
          </div>
        </sc-card>
      </sc-grid-column>
    </sc-grid-row>
  `,
};


export const EmptyMessage = Template.bind({});
EmptyMessage.args = {
  title: 'Single search - empty message',
  description: 'To get started, please search using either customer name, ' +
    'relationship numbers or their entity identification numbers',
  'single-search-placeholder': 'Search for name, description...',
  'image-src':
    'images/home-hero-people.svg',
  'slot[name=\'empty-message\']': html`
    <div>
      <span>Search for an existing individual or entity or <sc-link>start new onboarding</sc-link>.</span>
    </div>
  `,
};

export const WithHeaderActions = Template.bind({});
WithHeaderActions.args = {
  title: 'Search Layout with Header Actions',
  description: 'Header actions are rendered on the right side of the title row.',
  'single-search-placeholder': 'Search for name, description...',
  'header-primary-actions': [
    { label: 'Primary actions', value: 'start-search' },
    { label: 'Start search', value: 'start-search' },
    { label: 'Pin search', value: 'pin-search' },
  ],
  'header-secondary-actions': [
    { label: 'Secondary actions', value: 'clear-filters' },
    { label: 'Clear filters', value: 'clear-filters' },
    { label: 'Save filter', value: 'save-filter' },
  ],
  'header-optional-actions': [
    { label: 'Export', value: 'export' },
    { label: 'Share', value: 'share' },
  ],
  'slot[name=\'result\']': html`
    <sc-grid-row>
      <sc-grid-column xs='12' md='6' lg='4' style='margin-bottom:12px;'>
        <sc-card>
          <div>Inspect emitted sc-action from the component events panel.</div>
        </sc-card>
      </sc-grid-column>
    </sc-grid-row>
  `,
};
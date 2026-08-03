import { html, TemplateResult } from 'lit';

export default {
  title: 'Layout/Landing Layout',
  component: 'sc-landing-layout',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Landing layout is a generic layout to show banner and content',
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
    'banner-title': {
      control: 'text',
      description: 'Sets banner title',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'Attributes',
      },
    },
    'banner-body': {
      control: 'text',
      description: 'Sets to change the banner body.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'banner-text-alignment': {
      control: 'inline-radio',
      options: ['left', 'center', 'right'],
      description: 'The preferred alignment of the banner title and description.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'left' },
        category: 'Attributes',
      },
    },
    'banner-image-src': {
      control: 'text',
      description: 'Sets to show a image at the right of banner.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'banner-image-position': {
      control: 'inline-radio',
      options: ['left', 'right'],
      description: 'Sets to show the image at the right or left of banner.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'right' },
        category: 'Attributes',
      },
    },
    'banner-background-color': {
      control: 'inline-radio',
      options: ['white', 'gradient-blue'],
      description: 'Sets banner background color.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'white' },
        category: 'Attributes',
      },
    },
    'header-primary-actions': {
      control: 'object',
      description: 'Primary dropdown actions in banner title row. Format: [{ label, value }].',
      table: {
        type: { summary: 'Array<{label: string; value: string}>' },
        defaultValue: { summary: '[]' },
        category: 'Attributes',
      },
    },
    'header-secondary-actions': {
      control: 'object',
      description: 'Secondary dropdown actions in banner title row. Format: [{ label, value }].',
      table: {
        type: { summary: 'Array<{label: string; value: string}>' },
        defaultValue: { summary: '[]' },
        category: 'Attributes',
      },
    },
    'header-optional-actions': {
      control: 'object',
      description: 'Optional actions shown under more-horizontal trigger. Format: [{ label, value }].',
      table: {
        type: { summary: 'Array<{label: string; value: string}>' },
        defaultValue: { summary: '[]' },
        category: 'Attributes',
      },
    },
    'slot[name=\'banner-title\']': {
      control: 'text',
      description: 'Sets to customize the banner title.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'banner-body\']': {
      control: 'text',
      description: 'Sets to customize the banner description.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'content\']': {
      control: 'text',
      description: 'Sets to customize the page content.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'header-action-slot\']': {
      control: 'text',
      description: 'Fallback custom header action content when action properties are empty.',
      table: {
        category: 'Slots',
      },
    },
  },
  args: {
    height: 'auto',
    'banner-title': '',
    'banner-body': '',
    'banner-text-alignment': 'left',
    'banner-image-src': '',
    'banner-image-position': 'right',
    'banner-background-color': 'white',
    'header-primary-actions': [],
    'header-secondary-actions': [],
    'header-optional-actions': [],
    'slot[name=\'banner-title\']': '',
    'slot[name=\'banner-body\']': '',
    'slot[name=\'content\']': '',
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
  'banner-title'?: string;
  'banner-body'?: string;
  'banner-text-alignment'?: string,
  'banner-image-src'?: string,
  'banner-image-position'?: string,
  'banner-background-color'?: string,
  'header-primary-actions'?: { label: string; value: string }[],
  'header-secondary-actions'?: { label: string; value: string }[],
  'header-optional-actions'?: { label: string; value: string }[],
  'slot[name=\'banner-title\']'?: TemplateResult,
  'slot[name=\'banner-body\']'?: TemplateResult,
  'slot[name=\'content\']'?: TemplateResult,
  'slot[name=\'header-action-slot\']'?: TemplateResult,
}

const Template: Story<ArgTypes> = (props: ArgTypes) => {
  return html`
    <sc-landing-layout 
      height=${props['height']}
      banner-text-alignment=${props['banner-text-alignment']}
      banner-image-src=${props['banner-image-src']}
      banner-image-position=${props['banner-image-position']}
      banner-background-color=${props['banner-background-color']}
      .headerPrimaryActions=${props['header-primary-actions'] || []}
      .headerSecondaryActions=${props['header-secondary-actions'] || []}
      .headerOptionalActions=${props['header-optional-actions'] || []}
    >
      <div slot="banner-title">
        ${props['banner-title']
    ? props['banner-title']
    : props['slot[name=\'banner-title\']']
}
      </div>
      <div slot="banner-body">
        ${props['banner-body']
    ? props['banner-body']
    : props['slot[name=\'banner-body\']']
}
      </div>
      <div slot='content'>
          ${props['slot[name=\'content\']']}
      </div>
      <div slot='header-action-slot'>
        ${props['slot[name=\'header-action-slot\']']}
      </div>
    </sc-landing-layout>
  `;
};

export const Default = Template.bind({});
Default.args = {
  'banner-title': 'Landing layout',
  'banner-body': 'Default',
  'slot[name=\'content\']': html`
    <sc-box>
        <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla morbi ultrices massa,
        consectetur mi ullamcorper sed cras aliquam. Et phasellus varius nisl et cras sagittis.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla morbi ultrices massa,
        consectetur mi ullamcorper sed cras aliquam. Et phasellus varius nisl et cras sagittis.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla morbi ultrices massa,
        consectetur mi ullamcorper sed cras aliquam. Et phasellus varius nisl et cras sagittis.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla morbi ultrices massa,
        consectetur mi ullamcorper sed cras aliquam. Et phasellus varius nisl et cras sagittis.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla morbi ultrices massa,
        consectetur mi ullamcorper sed cras aliquam. Et phasellus varius nisl et cras sagittis.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla morbi ultrices massa,
        consectetur mi ullamcorper sed cras aliquam. Et phasellus varius nisl et cras sagittis.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla morbi ultrices massa,
        consectetur mi ullamcorper sed cras aliquam. Et phasellus varius nisl et cras sagittis.
        </div>
    </sc-box>
  `,
};

export const WithImage = Template.bind({});
WithImage.args = {
  height: 'cover',
  'banner-title': 'Banner title',
  'slot[name=\'banner-body\']': html`
    <div>This is description</div>
    <div style='margin-top: 12px;'>
        <sc-button fill>Click here</sc-button>
    </div>
  `,
  'banner-image-src':
    'images/home-hero-people.svg',
  'slot[name=\'content\']': html`
    <sc-box>
        <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla morbi ultrices massa,
        consectetur mi ullamcorper sed cras aliquam. Et phasellus varius nisl et cras sagittis.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla morbi ultrices massa,
        consectetur mi ullamcorper sed cras aliquam. Et phasellus varius nisl et cras sagittis.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla morbi ultrices massa,
        consectetur mi ullamcorper sed cras aliquam. Et phasellus varius nisl et cras sagittis.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla morbi ultrices massa,
        consectetur mi ullamcorper sed cras aliquam. Et phasellus varius nisl et cras sagittis.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla morbi ultrices massa,
        consectetur mi ullamcorper sed cras aliquam. Et phasellus varius nisl et cras sagittis.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla morbi ultrices massa,
        consectetur mi ullamcorper sed cras aliquam. Et phasellus varius nisl et cras sagittis.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla morbi ultrices massa,
        consectetur mi ullamcorper sed cras aliquam. Et phasellus varius nisl et cras sagittis.
        </div>
    </sc-box>
  `,
};

export const WithHeaderActions = Template.bind({});
WithHeaderActions.args = {
  'banner-title': 'Landing layout with actions',
  'banner-body': 'Use header action props or fallback slot when props are empty.',
  'header-primary-actions': [
    { label: 'Primary actions', value: 'approve' },
    { label: 'Approve', value: 'approve' },
    { label: 'Publish', value: 'publish' },
  ],
  'header-secondary-actions': [
    { label: 'Secondary actions', value: 'save-draft' },
    { label: 'Save draft', value: 'save-draft' },
    { label: 'Preview', value: 'preview' },
  ],
  'header-optional-actions': [
    { label: 'Archive', value: 'archive' },
    { label: 'Delete', value: 'delete' },
  ],
  'slot[name=\'content\']': html`
    <sc-box>
      <div>Open Action logger in Storybook to inspect emitted sc-action events.</div>
    </sc-box>
  `,
};

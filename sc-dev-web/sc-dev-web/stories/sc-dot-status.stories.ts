import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Dot Status',
  component: 'sc-dot-status',
  parameters: {
    docs: {
      description: {
        component:
          'Dot status are pre-defined color dot or icons used to display status.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['default', 'icon'],
      description: 'The preferred mode of the dot status.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Attributes',
      },
    },
    type: {
      control: 'inline-radio',
      description: 'The preferred dot status color.',
      options: ['info', 'neutral', 'error', 'warning', 'success', 'minor-error', 'pending', 'draft', 'urgent-error'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'disabled' },
        category: 'Attributes',
      },
      if: { arg: 'mode', eq: 'default' },
    },
    status: {
      control: 'inline-radio',
      description: 'The preffered dot status icon.',
      options: ['error', 'warning', 'minor-error', 'success', 'info', 'pending', 'pending-approval', 
              'draft', 'missing-info', 'rejected', 'on-hold', 'not-started'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'draft' },
        category: 'Attributes',
      },
      if: { arg: 'mode', eq: 'icon' },      
    },
    outline: {
      control: 'boolean',
      description: 'Show icon as outline.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'mode', eq: 'icon' },
    },
    compact: {
      control: 'boolean',
      description: 'Show in compact mode.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    label: { 
      control: 'text',
      description: 'Label to show on screen. Provide empty space to remove label.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
      if: { arg: 'compact', eq: false },
    },
    inline: { 
      control: 'boolean',
      description: 'Show dot status as inline.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },      
  },
  args: {
    mode: 'default',
    type: 'disabled',
    status: 'draft',
    label: '',
    outline: false,
    compact: false,
    inline: false,
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  mode?: string;
  type?: string;
  status?: string;
  outline?: boolean,
  compact?: boolean,
  label?: string,
  inline?: boolean;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => 
  html`
    <sc-dot-status 
      mode=${props.mode} 
      type=${props.type} 
      status=${props.status} 
      ?outline=${props.outline}
      ?compact=${props.compact}
      label=${props.label} 
      ?inline=${props.inline}     
    >
    </sc-dot-status>
  `;

export const Default = Template.bind({});
Default.args = {
  mode: 'default',
  type: 'success',
};

export const NoLabel = Template.bind({});
NoLabel.args = {
  mode: 'default',
  type: 'info',
  compact: true,
};

export const Icon = Template.bind({});
Icon.args = {
  mode: 'icon',
  status: 'draft',
};

export const IconOutline = Template.bind({});
IconOutline.args = {
  mode: 'icon',
  status: 'success',
  outline: true,
};
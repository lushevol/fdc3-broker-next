import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Progress Bar',
  component: 'sc-progress-bar',
  parameters: {
    docs: {
      description: {
        component: 'Progress bars are used to show the status of an ongoing operation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the progress bar.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'sm' },
        category: 'Attributes',
      },
    },
    type: {
      control: 'inline-radio',
      options: ['info', 'success', 'warning', 'error'],
      description: 'The color of the progress bar.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'success' },
        category: 'Attributes',
      },
    },
    value: {
      control: 'number',
      description: 'The current progress as a percentage, 0 to 100.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    indeterminate: {
      control: 'boolean',
      description: 'When true, percentage is ignored and the progress bar is drawn in an indeterminate state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'show-label': {
      control: 'boolean',
      description: 'show the progress bar label',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'slot[name=\'label\']': {
      control: 'text',
      description: 'Sets to customize label.',
      table: {
        category: 'Slots',
      },
      if: { arg: 'indeterminate', eq: true },
    },
    slot: {
      control: 'text',
      description: 'Sets to customize content.',
      table: {
        category: 'Slots',
      },
    },
  },
  args: {
    size: 'sm',
    type: 'success',
    value: 0,
    indeterminate: false,
    'show-label': false,
    'slot[name=\'label\']': '',
    slot: '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  size?: string;
  type?: string;
  value?: string;
  indeterminate?: boolean;
  'show-label'?: boolean;
  'slot[name=\'label\']'?: TemplateResult;
  slot?: TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) =>
  html`
    <sc-progress-bar
      class="sc-progress-bar"
      size=${props.size}
      type=${props.type}
      value=${props.value}
      ?indeterminate=${props.indeterminate}
      ?show-label=${props['show-label']}
    >
      ${props.indeterminate ? html`<div slot='label'>${props['slot[name=\'label\']']}</div>` : ''}
      ${props.slot}
    </sc-progress-bar>
  `;

  const AllSizesTemplate: Story<ArgTypes> = (props: ArgTypes) =>
  html`
    <sc-progress-bar
      class="sc-progress-bar"
      size='sm'
      type=${props.type}
      value=${props.value}
      ?indeterminate=${props.indeterminate}
      ?show-label=${props['show-label']}
    >
      ${props.indeterminate ? html`<div slot='label'>${props['slot[name=\'label\']']}</div>` : ''}
      ${props.slot}
    </sc-progress-bar>
  `;
export const Default = Template.bind({});
Default.args = {
  value: '10',
};

export const showLabel = Template.bind({});
showLabel.args = {
  value: '50',
  'show-label': true,
};

export const Information = AllSizesTemplate.bind({});
Information.args = {
  value: '20',
  type: 'info',
};

export const Success = AllSizesTemplate.bind({});
Success.args = {
  value: '30',
  type: 'success',
};

export const Warning = AllSizesTemplate.bind({});
Warning.args = {
  value: '50',
  type: 'warning',
};

export const Error = AllSizesTemplate.bind({});
Error.args = {
  value: '70',
  type: 'error',
};

export const Label = AllSizesTemplate.bind({});
Label.args = {
  value: '90',
  slot: html`Due on 25 Dec 2025`,
};

export const Indeterminate = AllSizesTemplate.bind({});
Indeterminate.args = {
  value: '70',
  indeterminate: true,
};

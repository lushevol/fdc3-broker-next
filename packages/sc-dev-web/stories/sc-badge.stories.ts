import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Badge',
  component: 'sc-badge',
  parameters: {
    docs: {
      description: {
        component: 'Badges are used to draw attention and display statuses or counts.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['number', 'text', 'dot'],
      description: 'Sets the preferred type of the badge.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'number' },
        category: 'Attributes',
      },
    },
    color: {
      control: 'inline-radio',
      options: ['blue', 'dark-blue', 'green', 'red', 'amber', 'grey', 'transparent'],
      description: 'Sets the preferred color for the badge',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'blue' },
        category: 'Attributes',
      },
    },
    number: { 
      control: 'number',
      description: 'Set the number to show. Note that number will be truncated to thousands.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
      if: { arg: 'type', eq: 'number' },
    },
    label: { 
      control: 'text',
      description: 'Set the label to show.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
      if: { arg: 'type', eq: 'text' },
    },
    outlined: {
      control: 'boolean',
      description: 'Draws the badge as outlined mode.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'type', neq: 'dot' },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg', 'default'],
      description: 'Sets the size for the badge',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
        category: 'Attributes',
      },
    },
  },
  args: {
    type: 'number',
    color: 'blue',
    number: null,
    label: '',
    outlined: false,
    size: 'md',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  type: string;
  color: string;
  number?: number;
  label?: string;
  outlined?: boolean;
  size?: string;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-badge 
    type=${props.type}
    color=${props.color} 
    number=${props.number}
    label=${props.label}
    ?outlined=${props.outlined}
    size=${props.size}
  >
  </sc-badge>
`;

export const Default = Template.bind({});
Default.args = {
  type: 'number',
  number: 9,
};

export const Number = Template.bind({});
Number.args = {
  type: 'number',
  color: 'green',
  number: 99999,
};

export const Dot = Template.bind({});
Dot.args = {
  type: 'text',
  color: 'red',
};

export const Outlined = Template.bind({});
Outlined.args = {
  outlined: true,
  number: 9,
};
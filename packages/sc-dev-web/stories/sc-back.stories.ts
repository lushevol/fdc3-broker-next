import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Back',
  component: 'sc-back',
  parameters: {
    docs: {
      description: {
        component:
          'Back is used to display navigation link for user to navigate to previous page or differnt page.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['href', 'history'],
      description: 'Sets the preferred mode.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'href' },
        category: 'Attributes',
      },
    },
    label: {
      control: 'text',
      options: ['href', 'history'],
      description: 'Sets the preferred label.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'href' },
        category: 'Attributes',
      },
    },
    to: { 
      control: 'text',
      description: 'Sets the link to navigate to.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '#' },
        category: 'Attributes',
      },
      if: { arg: 'mode', eq: 'href' }, 
    },
    disabled: { 
      control: 'boolean',
      description: 'Show back as disabled.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
  },
  args: {
    mode: 'href',
    label: 'Back',
    to: '#',
    disabled: false,
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  mode: string,
  label?: string,
  to?: string,
  disabled?: boolean
}

const Template: Story<ArgTypes> = ({ 
  mode = 'href',
  label = 'Back',
  to = '#',
  disabled = false,
}: ArgTypes) =>
  html`
    <sc-back 
      mode=${mode}
      label=${label}
      to=${to}
      ?disabled=${disabled}      
    >
    </sc-back> 
  `;

export const Default = Template.bind({});
Default.args = {
  to: '#',
};

export const CustomLabel = Template.bind({});
CustomLabel.args = {
  to: '#',
  label: 'Custom label',
};

export const Disabled = Template.bind({});
Disabled.args = {
  to: '#',
  disabled: true,
};

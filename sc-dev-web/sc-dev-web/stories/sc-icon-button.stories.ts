import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Button/Icon Button',
  component: 'sc-icon-button',
  parameters: {
    docs: {
      description: {
        component:
          'Icon button represent actions that are available to the user.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'text', 'link'],
      description: 'Sets the button type.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
        category: 'Attributes',
      },
    },
    state: {
      control: 'inline-radio',
      options: ['default', 'error'],
      description: 'Sets the button state.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Attributes',
      },
    },
    size: {
      control: 'inline-radio',
      options: ['xxs', 'xs', 'sm', 'md', 'lg'],
      description: 'Sets the button size.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'sm' },
        category: 'Attributes',
      }, 
    },    
    name: { 
      control: 'text',
      description: 'The name of the icon.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'no-pill': {
      control: 'boolean',
      description: 'Sets if not round border.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },    
    disabled: { 
      control: 'boolean',
      description: 'Sets disabled attribute.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
  },
  args: {
    type: 'primary',
    state: 'default',
    size: 'sm',
    name: 'thumbs-up--fill',
    'no-pill': false,
    disabled: false,
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  type: string;  
  state: string;
  size: string;
  name: string;
  'no-pill': boolean;
  disabled: boolean;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-icon-button
    type=${props.type}
    state=${props.state}
    size=${props.size}
    name=${props.name}
    ?no-pill=${props['no-pill']}
    ?disabled=${props.disabled}    
  >
  </sc-icon-button>
`;

export const Primary = Template.bind({});
Primary.args = {
  type: 'primary',
  disabled: false,
  size: 'md',
};

export const PrimaryError = Template.bind({});
PrimaryError.args = {
  type: 'primary',
  state: 'error',
  disabled: false,
  size: 'md',
};

export const Secondary = Template.bind({});
Secondary.args = {
  type: 'secondary',
  disabled: false,
  size: 'md',
};

export const SecondaryError = Template.bind({});
SecondaryError.args = {
  type: 'secondary',
  state: 'error',
  disabled: false,
  size: 'md',
};

export const Text = Template.bind({});
Text.args = {
  type: 'text',
  disabled: false,
  size: 'md',
};

export const Link = Template.bind({});
Link.args = {
  type: 'link',
  disabled: false,
  size: 'md',
};

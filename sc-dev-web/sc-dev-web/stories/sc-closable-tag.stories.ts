import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Tag/Closable Tag',
  component: 'sc-closable-tag',
  parameters: {
    docs: {
      description: {
        component:
          'Closable tags are used as labels to organize things or to indicate a selection and allow it to be closed.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['primary', 'success', 'warning', 'error', 'disabled', 'transparent',
        'blue', 'dark-blue', 'red', 'amber', 'green', 'grey', 'black', 'white', 'grey-dash'],
      description: 'Sets the preferred type of tag.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
        category: 'Attributes',
      },
    },
    mode: {
      control: 'inline-radio',
      options: ['default', 'filled', 'link'],
      description: 'Sets the preferred mode.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Attributes',
      },
    },
    value: { 
      control: 'text',
      description: 'Value of the tag.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    disabled: { 
      control: 'boolean',
      description: 'Show tag as disabled.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'max-width': { 
      control: 'text',
      description: 'Max width of the tag.',
      table: {
        type: { summary: 'max-width' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    'icon-name': { 
      control: 'text',
      description: 'The name of the icon.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    slot: {
      control: 'text',
      description: 'Sets the text of the tag.',
      table: {
        category: 'Slots',
      },
    },
    'sc-remove': {
      description: `Emitted when the tag closes. Get the tag value by event.detail.tag and 
      get the interacted element by event.detail.target.`,
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
  },
  args: {
    type: 'primary',
    mode: 'default',
    value: '',
    disabled: false,    
    'max-width': '',    
    'icon-name': '',  
    slot: '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  type?: string;
  mode?: string;
  value?: string;
  disabled?: boolean;
  'max-width'?: string;
  'icon-name'?: string;
  slot?: TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-closable-tag 
    type=${props.type} 
    mode=${props.mode}
    value=${props.value}
    ?disabled=${props.disabled}     
    max-width=${props['max-width']}
    icon-name=${props['icon-name']}
  >
    ${props.slot}
  </sc-closable-tag>
  <br/>
  <br/>
  <div style="display: flex; gap: 8px;">
    <sc-closable-tag 
      type=${props.type}  
      ?disabled=${props.disabled}      
      max-width=${props['max-width']}
    >
      ${props.slot}
    </sc-closable-tag>
    <sc-closable-tag 
      type=${props.type}
      ?disabled=${props.disabled}   
      mode='filled'     
      max-width=${props['max-width']}
    >
      Filled ${props.slot}
    </sc-closable-tag>
    <sc-closable-tag 
      type=${props.type}
      ?disabled=${props.disabled}   
      mode='link'     
      max-width=${props['max-width']}
    >
      Link ${props.slot}
    </sc-closable-tag>
    <sc-closable-tag 
      type=${props.type} 
      mode=${props.mode}
      value=${props.value}
      disabled   
      max-width=${props['max-width']}
      icon-name=${props['icon-name']}
    >
      Disabled ${props.slot}
    </sc-closable-tag>
  </div>
`;

export const Default = Template.bind({});
Default.args = {
  type: 'primary',
  disabled: false,
  slot: html`Default`,
};

export const Primary = Template.bind({});
Primary.args = {
  type: 'primary',
  slot: html`Primary`,
};

export const Blue = Template.bind({});
Blue.args = {
  type: 'blue',
  slot: html`Blue`,
};

export const DarkBlue = Template.bind({});
DarkBlue.args = {
  type: 'dark-blue',
  slot: html`Dark Blue`,
};

export const Success = Template.bind({});
Success.args = {
  type: 'success',
  slot: html`Success`,
};

export const Green = Template.bind({});
Green.args = {
  type: 'green',
  slot: html`Green`,
};

export const Warning = Template.bind({});
Warning.args = {
  type: 'warning',
  slot: html`Warning`,
};

export const Amber = Template.bind({});
Amber.args = {
  type: 'amber',
  slot: html`Amber`,
};

export const Error = Template.bind({});
Error.args = {
  type: 'error',
  slot: html`Error`,
};

export const Red = Template.bind({});
Red.args = {
  type: 'red',
  slot: html`Red`,
};

export const Transparent = Template.bind({});
Transparent.args = {
  type: 'transparent',
  slot: html`Transparent`,
};

export const White = Template.bind({});
White.args = {
  type: 'white',
  slot: html`White`,
};

export const Black = Template.bind({});
Black.args = {
  type: 'black',
  slot: html`Black`,
};

export const Disabled = Template.bind({});
Disabled.args = {
  type: 'disabled',
  slot: html`Disabled`,
};

export const Grey = Template.bind({});
Grey.args = {
  type: 'grey',
  slot: html`Grey`,
};

export const GreyDash = Template.bind({});
GreyDash.args = {
  type: 'grey-dash',
  slot: html`Grey Dash`,
};

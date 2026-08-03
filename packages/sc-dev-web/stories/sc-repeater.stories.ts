import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Repeater',
  component: 'sc-repeater',
  parameters: {
    docs: {
      description: {
        component:
          'Compound inputs are triggers that add or remove form items dynamically.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    position: {  
      control: 'inline-radio',
      options: ['append', 'prepend','startingEmpty'],
      description: 'Sets the position of the duplicated item',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'append' },
        category: 'Attributes',
      },
    },

    disabled: { 
      control: 'boolean',
      description: 'Sets the disabled status',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },

    'button-expand': { 
      control: 'boolean',
      description: 'Sets to expand the button to full width',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },

    'sc-duplication-add': {
      description: 'Emitted when the duplication is added.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },

    'sc-duplication-remove': {
      description: 'Emitted when the duplication is removed.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },

    'sc-change': {
      description: 'Emitted when change is made, to get all fields and values. Get the fields with event.detail.fields'
      + 'and get the values with event.detail.values',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
  },

  args: {
    position: 'append',
    disabled: false,
    'button-expand': false,
  },
};




interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  'position'?: string;
  'disabled'?: boolean;
  'button-expand'?: boolean;
}

const Default: Story<ArgTypes> = (props: ArgTypes) => html`
<sc-repeater 
position=${props['position']}
?disabled=${props['disabled']} 
?button-expand=${props['button-expand']} 
>
<sc-text-input tooltip tooltip-placement="top" label-size="xs" value="" placeholder="" rows="5" prefix-icon="" 
suffix-icon="" suffix-label="" help-text="" border-type="box" max-length="10" success-message="" error-message="" hide> 
</sc-text-input>
</sc-repeater>
`;

export const Append = Default.bind({});
Append.args = {
  position: 'append',
  disabled: false,
};

export const Prepend = Default.bind({});
Prepend.args = {
  position: 'prepend',
  disabled: false,
};

export const StartingEmpty = Default.bind({});
StartingEmpty.args = {
  position: 'startingEmpty',
  disabled: false,
};

export const ButtonExpand = Default.bind({});
ButtonExpand.args = {
  position: 'append',
  'button-expand': true,
};


const SecondTemplate: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-repeater 
  position=${props['position']}
  ?disabled=${props['disabled']} 
  ?button-expand=${props['button-expand']} 
  >
  <sc-text-input tooltip tooltip-placement="top" label-size="xs" value="" placeholder="" rows="5" prefix-icon="" 
  suffix-icon="" suffix-label="" help-text="" border-type="box" max-length="" 
  success-message="" error-message="" disabled=''> 
  </sc-text-input>
  </sc-repeater>
`;


export const Disabled = SecondTemplate.bind({});
Disabled.args = {
  position: 'append',
  disabled: true,
};

const ThirdTemplate: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-repeater 
  position=${props['position']}
  ?disabled=${props['disabled']} 
  ?button-expand=${props['button-expand']} 
  >
  <div>
  <sc-text-input tooltip tooltip-placement="top" label-size="xs" value="" placeholder="" rows="5" prefix-icon="" 
  suffix-icon="" suffix-label="" help-text="" border-type="box" max-length="10" success-message="" error-message=""> 
  </sc-text-input>
  <sc-text-input tooltip tooltip-placement="top" label-size="xs" value="" placeholder="" rows="5" prefix-icon="" 
  suffix-icon="" suffix-label="" help-text="" border-type="box" max-length="10" success-message="" error-message=""> 
  </sc-text-input>
  </div>
  </sc-repeater>
  `;
  
export const Group = ThirdTemplate.bind({});
Group.args = {
  position: 'append',
  'button-expand': false,
};
import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Accordion',
  component: 'sc-accordion',
  parameters: {
    docs: {
      description: {
        component:
          'Accordion show a brief summary and expand to show additional content.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    summary: { 
      control: 'text', 
      description: 'Sets to change the summary text.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      }, 
    },
    'summary-line': { 
      control: 'number', 
      description: 'Sets the number of line to show before it gets truncated.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 0 },
        category: 'Attributes',
      }, 
    },
    'label-size': {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Sets to change the label size.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'sm' },
        category: 'Attributes',
      },
    },
    'icon-position': { 
      control: 'inline-radio',
      options: ['left', 'right'],
      description: 'The preferred position of the icon.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'right' },
        category: 'Attributes',
      },
    },
    'sub-summary': {
      control: 'text',
      description: 'Sets to change the sub summary text.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      }, 
    },
    tooltip: {
      control: 'text',
      description: 'Sets tooltip after the summary text.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      }, 
    },
    border: { 
      control: 'boolean', 
      description: 'Sets to if the accordion have border or not.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    open: { 
      control: 'boolean', 
      description: 'Sets to expands accordion.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },   
    disabled: { 
      control: 'boolean', 
      description: 'Disables the details so it can’t be toggled.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },    
    'slot[name=\'summary\']': {
      control: 'text',
      description: 'Sets to customize the summary text.',
      table: {
        category: 'Slots',
      }, 
    },
    'slot[name=\'label-content\']': {
      control: 'text',
      description: 'Sets to customize the label text, please set this slot only when the icon-position is left.',
      table: {
        category: 'Slots',
      }, 
    },
    slot: {
      control: 'text',
      description: 'Sets to customize content.',
      table: {
        category: 'Slots',
      }, 
    },
    'sc-show': {
      description: 'Emitted when the accordion opens. Get the state by event.detail.open.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
    'sc-hide': {
      description: 'Emitted when the accordion closes. Get the state by event.detail.open.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
  },
  args: {
    summary: '',
    'summary-line': 0,
    'icon-position': 'right',
    'label-size': 'sm',
    'sub-summary': '',
    tooltip: '',
    border: false,
    open: false,
    disabled: false,
    'slot[name=\'summary\']': '',
    'slot[name=\'label-content\']': '',
    slot: '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  summary?: string;
  'summary-line'?: string;
  'icon-position'?: string,
  'label-size'?: string,
  'sub-summary'?: string,
  tooltip?: string,
  border?: boolean,
  open?: boolean;
  disabled?: boolean;  
  'slot[name=\'summary\']'?: TemplateResult;  
  'slot[name=\'label-content\']'?: TemplateResult;
  slot?: TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-accordion 
    summary-line=${props['summary-line']}
    icon-position=${props['icon-position']}
    sub-summary=${props['sub-summary']}
    label-size=${props['label-size']}
    tooltip=${props.tooltip}
    ?border=${props.border}
    ?open=${props.open} 
    ?disabled=${props.disabled}
  >
    <div slot="summary">
      ${props['slot[name=\'summary\']'] 
    ? props['slot[name=\'summary\']'] 
    : props.summary
}
    <div slot="label-content">${props['slot[name=\'label-content\']']}</div>
    </div>
    ${props.slot} 
  </sc-accordion>
`;

const CustomTemplate: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-accordion 
    icon-position=${props['icon-position']}
    ?border=${props.border}
    ?open=${props.open} 
    ?disabled=${props.disabled}
  >
    <div slot="summary">
      What is SC WebKit
    </div>
    <div slot="label-content">
      ${props['slot[name=\'label-content\']']}
    </div>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
  </sc-accordion>
  <sc-accordion 
    icon-position=${props['icon-position']}    
    ?border=${props.border}
  >
    <div slot="summary">
      Getting started
    </div>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
  </sc-accordion>
  <sc-accordion 
    icon-position=${props['icon-position']}    
    ?border=${props.border}
  >
    <div slot="summary">
      Documentation
    </div>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
  </sc-accordion>
`;

export const Default = Template.bind({});
Default.args = {
  summary: 'Accordion title',
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

export const IconLeft = CustomTemplate.bind({});
IconLeft.args = {
  'icon-position': 'left',
};

export const IconRight = CustomTemplate.bind({});
IconRight.args = {
  'icon-position': 'right',
};

export const Label = CustomTemplate.bind({});
Label.args = {
  'icon-position': 'left',
  'slot[name=\'label-content\']': html`
    <sc-link onclick="alert('Link is clicked!')" slot="label-content" style="display:flex">Lorem <sc-icon name="clock--line" style="margin-left:8px;"></sc-icon></sc-link>
  `,
};

export const WithBorder = CustomTemplate.bind({});
WithBorder.args = {
  border: true,
};

export const Expand = CustomTemplate.bind({});
Expand.args = {
  open: true,
};

export const Disabled = CustomTemplate.bind({});
Disabled.args = {
  disabled: true,
};

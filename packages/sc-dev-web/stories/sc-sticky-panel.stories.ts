import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Sticky Panel',
  component: 'sc-sticky-panel',
  parameters: {
    docs: {
      description: {
        component:
          'Sticky panel have fixed position at the top of the screen ' +
          'and show a brief summary and expand to show additional content.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    summary: { 
      control: 'text', description: 'Header text.',
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
    open: false,
    disabled: false,
    'slot[name=\'summary\']': '',    
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
  open?: boolean;
  disabled?: boolean;  
  'slot[name=\'summary\']'?: TemplateResult;  
  slot?: TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <div style="padding-bottom:100px">
    <sc-sticky-panel 
      summary-line=${props['summary-line']}
      icon-position=${props['icon-position']}
      ?open=${props.open} 
      ?disabled=${props.disabled}
    >
      <div slot="summary">
        ${props['slot[name=\'summary\']'] 
    ? props['slot[name=\'summary\']'] 
    : props.summary
}
      </div>
      ${props.slot} 
    </sc-sticky-panel>
  </div>
`;

const CustomTemplate: Story<ArgTypes> = (props: ArgTypes) => html`
  <div style="padding-bottom:100px">
    <sc-sticky-panel 
      ?open=${props.open} 
      ?disabled=${props.disabled}
    >
      <div slot="summary">
        What is SC WebKit
      </div>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
    </sc-sticky-panel>
  </div>
`;

export const Default = Template.bind({});
Default.args = {
  summary: 'Panel title',
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

export const Expand = CustomTemplate.bind({});
Expand.args = {
  open: true,
};

export const Disabled = CustomTemplate.bind({});
Disabled.args = {
  disabled: true,
};

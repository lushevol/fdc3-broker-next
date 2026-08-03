import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Sheet/Bottom Sheet',
  component: 'sc-bottom-sheet',
  parameters: {
    docs: {
      description: {
        component:
          'Bottom sheet slide in from bottom to expose additional options and information.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: { 
      control: 'text',
      description: 'The label of bottom sheet.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      }, 
      if: { arg: 'no-header', neq: true },
    },
    height: { 
      control: 'text',
      description: 'Sets to customize the bottom sheet height.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'auto' },
        category: 'Attributes',
      },
      if: { arg: 'expandable', eq: false },
    },
    open: { 
      control: 'boolean', 
      description: 'Set to open and show bottom sheet.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    expandable: { 
      control: 'boolean',
      description: 'Sets to allow user to expand the bottom sheet to full height.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    'expand-height': { 
      control: 'number',
      description: `Sets the bottom sheet initial height when expandable is enabled. 
        Value is based on viewport\`s height (vh)`,
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'auto' },
        category: 'Attributes',
      },
      if: { arg: 'expandable', eq: true },
    },
    'no-header': { 
      control: 'boolean', 
      description: 'Set to hide header on bottom sheet. Set this to true will remove label and close icon',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    'no-close-icon': { 
      control: 'boolean', 
      description: 'Set to hide close icon on bottom sheet.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
      if: { arg: 'no-header', neq: true },
    },
    'disable-outside-click': { 
      control: 'boolean', 
      description: 'Set to disable user to close the bottom sheet by clicking outside the bottom sheet.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    'slot[name=\'label\']': {
      control: 'text',
      description: 'Sets to customize the label.',
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
      description: 'Emitted when the bottom sheet opens. Get the state by event.detail.open.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
    'sc-hide': {
      description: 'Emitted when the bottom sheet closes. Get the state by event.detail.open.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
  },
  args: {
    label: '',
    height: 'auto',
    open: false,
    expandable: false,
    'expand-height': '0',
    'no-header': false,
    'no-close-icon': false,
    'disable-outside-click': false,
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
  label?: string;
  height?: string;
  open?: boolean;
  expandable?: boolean;
  'expand-height'?: string;
  'no-header'?: boolean,
  'no-close-icon'?: boolean;
  'disable-outside-click'?: boolean;
  'slot[name=\'label\']'?: TemplateResult;
  slot?: TemplateResult;  
}

const Template: Story<ArgTypes> = (props: ArgTypes) => {
  const handleClick = (event : MouseEvent) => {
    const currentNode : HTMLElement | null = event.target as HTMLElement;
    if (currentNode) {
      const parentNode: HTMLElement | null = currentNode.parentNode as HTMLElement;
      if (parentNode) {
        const defaultModal:any = parentNode.nextElementSibling;
        if (defaultModal) {
          defaultModal.setAttribute('open', true);
          defaultModal.addEventListener('sc-hide', () => {
            defaultModal.removeAttribute('open');
          });
        }
      }
    }  
  };

  return html`
    <div style="padding:120px 0;position:relative;">   
      <div style="text-align:center"> 
        <sc-button class="bottomsheet-trigger" size="md" @click=${handleClick}>Open bottom sheet</sc-button>
      </div>
      <sc-bottom-sheet
        class="sc-bottom-sheet"
        height=${props.height}
        ?open=${props.open}
        ?expandable=${props.expandable}
        expand-height=${props['expand-height']}
        ?no-header=${props['no-header']}
        ?no-close-icon=${props['no-close-icon']}
        ?disable-outside-click=${props['disable-outside-click']}
      >
      <div slot="label">
        ${props['slot[name=\'label\']'] 
    ? props['slot[name=\'label\']'] 
    : props.label
}
      </div>
      ${props.slot} 
      </sc-bottom-sheet>
    </div>
  `;
};

export const Default = Template.bind({});
Default.args = {
  label: 'Default',
  height: '150px',
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

export const CustomHeight = Template.bind({});
CustomHeight.args = {
  label: 'Custom height',
  height: '150px',
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

export const Expandable = Template.bind({});
Expandable.args = {
  label: 'Expandable',
  expandable: true,
  'expand-height': '10',
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

export const NoCloseIcon = Template.bind({});
NoCloseIcon.args = {
  label: 'No close icon',
  'no-close-icon': true,
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

export const PreventCloseOutside = Template.bind({});
PreventCloseOutside.args = {
  label: 'Prevent close outside',
  'disable-outside-click': true,
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

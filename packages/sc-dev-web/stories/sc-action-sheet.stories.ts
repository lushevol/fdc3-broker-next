import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Sheet/Action Sheet',
  component: 'sc-action-sheet',
  parameters: {
    docs: {
      description: {
        component:
          'Action sheet slide in from a container to expose additional options and information.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: { 
      control: 'text',
      description: 'The label of action sheet.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      }, 
      if: { arg: 'no-header', neq: true },
    },
    'primary-action': {
      control: 'text',
      description: 'The preferred name of the primary action.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      }, 
    },
    'primary-action-label': {
      control: 'text',
      description: 'The preferred label of the primary action.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      }, 
    },
    'secondary-action': {
      control: 'text',
      description: 'The preferred name of the secondary action.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      }, 
    },
    'secondary-action-label': {
      control: 'text',
      description: 'The preferred label of the secondary action.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      }, 
    },
    'other-action': {
      control: 'text',
      description: 'The preferred name of the other action.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      }, 
    },
    'other-action-label': {
      control: 'text',
      description: 'The preferred label of the primary action.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      }, 
    },
    height: {
      control: 'text',
      description: 'Sets to customize the action sheet height.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'auto' },
        category: 'Attributes',
      }, 
    },
    open: { 
      control: 'boolean', 
      description: 'Set to open and show action sheet.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    contained: { 
      control: 'boolean', 
      description: `By default, the action sheet slides out of its containing block (usually the viewport). 
        To make the action sheet slide out of its parent element, 
        set this attribute and add position: relative to the parent.`,
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    'no-header': { 
      control: 'boolean', 
      description: 'Set to hide header on action sheet. Set this to true will remove label and close icon',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    'no-close-icon': { 
      control: 'boolean', 
      description: 'Set to hide close icon on action sheet.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
      if: { arg: 'no-header', neq: true },
    },
    'disable-outside-click': { 
      control: 'boolean', 
      description: 'Set to disable user to close the action sheet by clicking outside the action sheet.',
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
      description: 'Emitted when the action sheet opens. Get the state by event.detail.open.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
    'sc-hide': {
      description: 'Emitted when the action sheet closes. Get the state by event.detail.open.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
    'sc-action': {
      description: 'Emitted when click the action button. Get the action name by event.detail.name.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
      slot: {
        control: 'text',
        description: 'Action sheet content',
        table: {
          type: { summary: 'string' },
          category: 'Slots',
        },
      },
    },
  },
  args: {
    label: '',
    'primary-action': '',
    'primary-action-label': '',
    'secondary-action': '',
    'secondary-action-label': '',
    'other-action': '',
    'other-action-label': '',
    height: 'auto',
    open: false,
    contained: false,
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
  'primary-action'?: string;
  'primary-action-label'?: string;
  'secondary-action'?: string;
  'secondary-action-label'?: string;
  'other-action'?: string;
  'other-action-label'?: string;
  height: string,
  open?: boolean;
  contained?: boolean,
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
        <sc-button class="actionsheet-trigger" size="md" @click=${handleClick}>Open action sheet</sc-button>
      </div>
      <sc-action-sheet
        class="sc-action-sheet"
        primary-action=${props['primary-action']}
        primary-action-label=${props['primary-action-label']}
        secondary-action=${props['secondary-action']}
        secondary-action-label=${props['secondary-action-label']}
        other-action=${props['other-action']}
        other-action-label=${props['other-action-label']}
        height=${props.height}
        ?open=${props.open}
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
      </sc-action-sheet>
    </div>
  `;
};

export const Default = Template.bind({});
Default.args = {
  label: 'Default',
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

export const Actions = Template.bind({});
Actions.args = {
  label: 'Actions',
  'primary-action': 'submit',
  'primary-action-label': 'Submit',
  'secondary-action': 'cancel',
  'secondary-action-label': 'Cancel',
  'other-action': 'skip',
  'other-action-label': 'Skip',
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

export const CustomHeight = Template.bind({});
CustomHeight.args = {
  label: 'Custom height',
  'primary-action': 'submit',
  'primary-action-label': 'Submit',
  'secondary-action': 'cancel',
  'secondary-action-label': 'Cancel',
  'other-action': 'skip',
  'other-action-label': 'Skip',
  height: '200px',
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit`,
};

export const NoCloseIcon = Template.bind({});
NoCloseIcon.args = {
  label: 'No close icon',
  'primary-action': 'submit',
  'primary-action-label': 'Submit',
  'secondary-action': 'cancel',
  'secondary-action-label': 'Cancel',
  'other-action': 'skip',
  'other-action-label': 'Skip',
  'no-close-icon': true,
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

export const PreventCloseOutside = Template.bind({});
PreventCloseOutside.args = {
  label: 'Prevent close outside',
  'primary-action': 'submit',
  'primary-action-label': 'Submit',
  'secondary-action': 'cancel',
  'secondary-action-label': 'Cancel',
  'other-action': 'skip',
  'other-action-label': 'Skip',
  'disable-outside-click': true,
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};
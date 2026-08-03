import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Sheet/Side Sheet',
  component: 'sc-side-sheet',
  parameters: {
    docs: {
      description: {
        component:
          'Side sheet slide in from a container to expose additional options and information.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: { 
      control: 'text',
      description: 'The label of the side sheet.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
      if: { arg: 'no-header', neq: true },
    },
    size: { 
      control: 'inline-radio',
      options: ['xxs', 'xs', 'sm', 'md', 'lg'],
      description: 'Sets the preferred size of the side sheet.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'xs' },
        category: 'Attributes',
      },
    },    
    width: { 
      control: 'text',
      description: 'Customize the width of the side sheet. If specified, size will be ignored.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    position: { 
      control: 'inline-radio',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Sets the position of the side sheet.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'right' },
        category: 'Attributes',
      },
    },  
    open: { 
      control: 'boolean',
      description: 'Set to open and show side sheet.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    contained: { 
      control: 'boolean', 
      description: `By default, the side sheet slides out of its containing block (usually the viewport). 
      To make the side sheet slide out of its parent element, 
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
    'no-header-bottom-border': { 
      control: 'boolean', 
      description: 'Set to show header border on side sheet. Set this to true will remove header border',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
      if: { arg: 'no-header', neq: true },
    },
    'disable-outside-click': { 
      control: 'boolean', 
      description: 'Set to disable user to close the action sheet by clicking outside the side sheet.',
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
      description: 'Emitted when the side sheet opens. Get the state by event.detail.open.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
    'sc-hide': {
      description: 'Emitted when the side sheet closes. Get the state by event.detail.open.',
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
    },
    'no-footer': { 
      control: 'boolean', 
      description: 'Set to show footer on side sheet. Set this to true will remove footer',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
        category: 'Attributes',
      }, 
    },
    
    'no-footer-top-border': { 
      control: 'boolean', 
      description: 'Set to show footer border on side sheet. Set this to true will remove footer border',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
      if: { arg: 'no-footer', neq: true },
    },
    'primary-action': {
      control: 'text',
      description: 'The preferred name of the primary action.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
      if: { arg: 'no-footer', neq: true },
    },
    'primary-action-label': {
      control: 'text',
      description: 'The preferred label of the primary action.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      }, 
      if: { arg: 'no-footer', neq: true },
    },
    'secondary-action': {
      control: 'text',
      description: 'The preferred name of the secondary action.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      }, 
      if: { arg: 'no-footer', neq: true },
    },
    'secondary-action-label': {
      control: 'text',
      description: 'The preferred label of the secondary action.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      }, 
      if: { arg: 'no-footer', neq: true },
    },
    'other-action': {
      control: 'text',
      description: 'The preferred name of the other action.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      }, 
      if: { arg: 'no-footer', neq: true },
    },
    'other-action-label': {
      control: 'text',
      description: 'The preferred label of the primary action.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      }, 
      if: { arg: 'no-footer', neq: true },
    },
  },
  args: {
    label: '',
    size: 'xs',
    width: '',
    position: 'right',
    open: false,
    contained: false,
    'no-header': false,
    'no-close-icon': false,
    'no-header-bottom-border': false,
    'disable-outside-click': false,
    'slot[name=\'label\']': '',    
    slot: '', 
    'no-footer': true, 
    'no-footer-top-border': false,
    'primary-action': '',
    'primary-action-label': '',
    'secondary-action': '',
    'secondary-action-label': '',
    'other-action': '',
    'other-action-label': '',      
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  label?: string;
  size?: string,
  width?: string;
  position?: string;
  open?: boolean;
  contained?: boolean,
  'no-header'?: boolean,
  'no-close-icon'?: boolean;
  'no-header-bottom-border'?:boolean;
  'disable-outside-click'?: boolean;
  'slot[name=\'label\']'?: TemplateResult;
  slot?: TemplateResult;  
  'primary-action'?: string;
  'primary-action-label'?: string;
  'secondary-action'?: string;
  'secondary-action-label'?: string;
  'other-action'?: string;
  'other-action-label'?: string;
  'no-footer'?: boolean,
  'no-footer-top-border'?:boolean;
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
        <sc-button class="sidesheet-trigger" size="md" @click=${handleClick}>Open side sheet</sc-button>
      </div>
      <sc-side-sheet
        class="sc-side-sheet"
        label=${props.label}
        size=${props.size}
        width=${props.width}
        position=${props.position}
        ?open=${props.open}
        ?contained=${props.contained}
        ?no-header=${props['no-header']}
        ?no-close-icon=${props['no-close-icon']}
        ?disable-outside-click=${props['disable-outside-click']}
        primary-action=${props['primary-action']}
        primary-action-label=${props['primary-action-label']}
        secondary-action=${props['secondary-action']}
        secondary-action-label=${props['secondary-action-label']}
        other-action=${props['other-action']}
        other-action-label=${props['other-action-label']}
        ?no-footer=${props['no-footer']}
        ?no-header-bottom-border=${props['no-header-bottom-border']}
        ?no-footer-top-border=${props['no-footer-top-border']}
      >
      <div slot="label">
        ${props['slot[name=\'label\']'] 
    ? props['slot[name=\'label\']'] 
    : props.label
}
      </div>
      ${props.slot} 
      </sc-side-sheet>
    </div>
  `;
};

export const Default = Template.bind({});
Default.args = {
  label: 'Default',
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
  'primary-action': 'submit',
  'primary-action-label': 'Submit',
};

export const CustomWidth = Template.bind({});
CustomWidth.args = {
  label: 'Custom width',
  width: '300px',
  position: 'right',
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
  'primary-action': 'submit',
  'primary-action-label': 'Submit',
};

export const NoCloseIcon = Template.bind({});
NoCloseIcon.args = {
  label: 'No close icon',
  'no-close-icon': true,  
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
  'primary-action': 'submit',
  'primary-action-label': 'Submit',
};

export const PreventCloseOutside = Template.bind({});
PreventCloseOutside.args = {
  label: 'Prevent close outside',
  'disable-outside-click': true,
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
  'primary-action': 'submit',
  'primary-action-label': 'Submit',
};

export const Left = Template.bind({});
Left.args = {
  label: 'Left',
  position: 'left',  
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
    'primary-action': 'submit',
'primary-action-label': 'Submit',
};

export const Top = Template.bind({});
Top.args = {
  label: 'Top',
  position: 'top',  
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
  'primary-action': 'submit',
  'primary-action-label': 'Submit',
};

export const Bottom = Template.bind({});
Bottom.args = {
  label: 'Bottom',
  position: 'bottom',  
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
  'primary-action': 'submit',
  'primary-action-label': 'Submit',
};

import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Toast',
  component: 'sc-toast',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Toast is used to communicate a brief message or notification quickly ' +
          'with as little disruption as possible to the user’s experience.',
      },
    },
    layout: 'fullscreen',
  },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['success', 'warning', 'error'],
      description: 'Sets the preferred toast type.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'success' },
        category: 'Attributes',
      },
    },
    closable: { 
      control: 'boolean',
      description: 'Sets to control if the toast can be manually closed.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    open: { 
      control: 'boolean',
      description: 'Sets to show the toast.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
        category: 'Attributes',
      },
    },
    rows: { 
      control: 'string',
      description: 'Sets the max rows of the body. The value can be any number or auto. If want to show all, please set value as auto',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 3 },
        category: 'Attributes',
      },
    },
    placement: {
      control: 'inline-radio',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      description: 'Sets the preferred toast position.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'top-right' },
        category: 'Attributes',
      },
    },
    duration: {
      control: 'number',
      description: 'The number of milliseconds to wait before auto dismissing after user interaction, ' +
        'e.g. mouse move. ' +
        'Can set as \'Infinity\' if don\'t want to auto dismiss',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 3000 },
        category: 'Attributes',
      },
    },
    title: {
      control: 'text',
      description: 'Sets the title of toast.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'Attributes',
      },
    },
    'slot[name=\'icon\']': {
      control: 'text',
      description: 'Sets to customize the prefix icon of toast.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'close-icon\']': {
      control: 'text',
      description: 'Sets to customize the close icon.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'title\']': {
      control: 'text',
      description: 'Sets to customize the title of toast.',
      table: {
        category: 'Slots',
      },
    },
    slot: {
      control: 'text',
      description: 'Body of toast',
      table: {
        type: { summary: 'string' },
        category: 'Slots',
      },
    },
    'sc-show': {
      description: 'Emitted when the toast open. Get the state by event.detail.open.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-hide': {
      description: 'Emitted when the toast closes. Get the state by event.detail.open.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
  },
  args: {
    type: 'success',
    closable: false,
    open: false,
    placement: 'top-right',
    duration: 3000,
    title: '',
    slot: '',
    rows: 3,
    'slot[name=\'icon\']': '',
    'slot[name=\'close-icon\']': '',
    'slot[name=\'title\']': '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  type?: string;
  closable?: boolean;
  open?: boolean;
  placement?: string;
  duration?: number;
  title?: string;
  rows?: string | number;
  slot?: TemplateResult | string;
}

const Template: Story<ArgTypes> = ({
  type = 'success',
  open = false,
  closable = false,
  placement = 'top-right',
  duration = 3000,
  title = '',
  rows = 3,
  slot,
}: ArgTypes) => {
  const handleClick = (event: MouseEvent) => {
    const currentNode: HTMLElement | null = event.target as HTMLElement;
    if (currentNode) {
      const parentNode: HTMLElement | null = currentNode.parentNode as HTMLElement;
      if (parentNode) {
        const defaultToast: any = parentNode.nextElementSibling;
        if (defaultToast) {
          defaultToast.setAttribute('open', true);
          defaultToast.addEventListener('sc-hide', () => {
            defaultToast.removeAttribute('open');
          });
        }
      }
    }
  };

  return html`
    <div style="padding:120px 0;position:relative;">   
      <div style="text-align:center"> 
        <sc-button class="toast-trigger" size="md" @click=${handleClick}>Open toast</sc-button>
      </div>
      <sc-toast
        type=${type}
        ?closable=${closable}
        ?open=${open}
        placement=${placement}
        duration=${duration}
        title=${title}
        .rows=${rows}
      >
        ${slot}
      </sc-toast>
    </div>
  `;
};

export const Default = Template.bind({});
Default.args = {
  type: 'success',
  closable: false,
  title: 'File uploaded',
  slot: 'This is detail info',
};

export const NotDismiss = Template.bind({});
NotDismiss.args = {
  type: 'warning',
  closable: true,
  duration: Infinity,
  title: 'Warning!',
  slot: 'Message here',
};

export const CustomMessage  = Template.bind({});
CustomMessage.args = {
  type: 'error',
  closable: true,
  slot: html`
    <sc-icon name='clock--line'></sc-icon> Please try again
    <sc-icon name='arrow-ios-forward' slot='title'></sc-icon>
    <span slot='title' style="margin-left: 4px;">File upload failed</span>
  `,
};

export const AutoHeight = Template.bind({});
AutoHeight.args = {
  type: 'success',
  closable: false,
  title: 'File uploaded',
  slot: `Lorem ipsum dolor sit amet, consectetur adipisicing elit, 
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  rows: 'auto',
};

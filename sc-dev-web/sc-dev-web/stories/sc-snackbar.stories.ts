import { html, TemplateResult } from 'lit';
import { ScSnackbar } from '../src/components/ScSnackbar/ScSnackbar.js';
import { truncateArgType } from './utils/ArgTypes.js';
import { repeat } from 'lit-html/directives/repeat.js';

export default {
  title: 'Components/Snackbar',
  component: 'sc-snackbar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Snackbar is used to communicate a brief message or notification quickly ' +
          'with as little disruption as possible to the user’s experience.',
      },
    },
    layout: 'fullscreen',
  },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['success', 'warning', 'error', 'info', 'disabled', 'loading'],
      description: 'Sets the preferred snackbar type.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'success' },
        category: 'Attributes',
      },
    },
    closable: {
      control: 'boolean',
      description: 'Sets to control if the snackbar can be manually closed.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'icon-hide': {
      control: 'boolean',
      description: 'Sets to control if the snackbar show the left icon or not.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    open: {
      control: 'boolean',
      description: 'Sets to show the snackbar.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
        category: 'Attributes',
      },
    },
    placement: {
      control: 'inline-radio',
      options: ['top', 'bottom'],
      description: 'Sets the preferred snackbar position.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'top' },
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
    ...truncateArgType(),
    'slot[name=\'icon\']': {
      control: 'text',
      description: 'Sets to customize the prefix icon of snackbar.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'action\']': {
      control: 'text',
      description: 'Sets to show the action buttons in the snackbar.',
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
    slot: {
      control: 'text',
      description: 'Snackbar text',
      table: {
        type: { summary: 'string' },
        category: 'Slots',
      },
    },
    'sc-show': {
      description: 'Emitted when the snackbar open.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-hide': {
      description: 'Emitted when the snackbar closes.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
  },
  args: {
    type: 'success',
    closable: false,
    'icon-hide': false,
    open: false,
    placement: 'top',
    duration: 3000,
    truncate: false,
    slot: '',
    'slot[name=\'icon\']': '',
    'slot[name=\'action\']': '',
    'slot[name=\'close-icon\']': '',
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
  'icon-hide'?: boolean;
  open?: boolean;
  placement?: string;
  duration?: number;
  truncate?: boolean;
  slot?: TemplateResult | string;
}

const Template: Story<ArgTypes> = ({
  type = 'success',
  open = false,
  closable = false,
  'icon-hide': iconHide = false,
  placement = 'top',
  duration = 3000,
  truncate = false,
  slot,
}: ArgTypes) => {
  const handleClick = (event : MouseEvent) => {
    const currentNode : HTMLElement | null = event.target as HTMLElement;
    if (currentNode) {
      const parentNode: HTMLElement | null = currentNode.parentNode as HTMLElement;
      if (parentNode) {
        const defaultSnackbar:any = parentNode.nextElementSibling;
        if (defaultSnackbar) {
          defaultSnackbar.setAttribute('open', true);
          defaultSnackbar.addEventListener('sc-hide', () => {
            defaultSnackbar.removeAttribute('open');
          });
        }
      }
    }
  };

  return html`
    <div style="padding:120px 0;position:relative;">
      <div style="text-align:center">
        <sc-button class="snackbar-trigger" size="md" @click=${handleClick}>Open Snackbar</sc-button>
      </div>
      <sc-snackbar
        type=${type}
        ?closable=${closable}
        ?icon-hide=${iconHide}
        ?open=${open}
        placement=${placement}
        duration=${duration}
        ?truncate=${truncate}
      >
        ${slot}
      </sc-snackbar>
    </div>
  `;
};

export const Default = Template.bind({});
Default.args = {
  type: 'success',
  closable: false,
  slot: 'File upload message',
};

export const Actions  = Template.bind({});
Actions.args = {
  type: 'warning',
  closable: true,
  slot: html`
    File upload message
    <sc-button fill slot='action'>Save</sc-button>
    <sc-button slot='action'>Cancel</sc-button>
  `,
};

export const NotDismiss = Template.bind({});
NotDismiss.args = {
  type: 'error',
  closable: true,
  duration: Infinity,
  slot: 'File upload message',
};

export const NoIcon = Template.bind({});
NoIcon.args = {
  type: 'success',
  closable: true,
  'icon-hide': true,
  duration: Infinity,
  slot: 'Without left icon',
};

export const Multiple: Story<ArgTypes> = (props: ArgTypes) => {
  const handleClick = (event : MouseEvent) => {
    const btn = event.target as HTMLElement | undefined;
    const snack = btn?.nextElementSibling as ScSnackbar | undefined;
    snack?.setAttribute('open', '');
  };
  return html`
    <div style="display:flex;flex-direction:column;align-items:start;gap:.5rem;padding:.5rem;padding-bottom:10rem">
      ${repeat(
        Array.from({ length: 6 }),
        (_, i) => html`
          <sc-button class="snackbar-trigger" size="md" @click=${handleClick}
            >Open ${String.fromCharCode(65 + i)}</sc-button
          >
          <sc-snackbar
            id=${`snackbar-${i}`}
            type=${props.type}
            ?closable=${props.closable}
            ?icon-hide=${props['icon-hide']}
            ?open=${props.open}
            placement=${props.placement}
            duration=${props.duration}
            ?truncate=${props.truncate}
          >
            ${`${props.slot} ${String.fromCharCode(65 + i)}`}
          </sc-snackbar>
        `
      )}
    </div>
  `;
};
Multiple.args = {
  type: 'success',
  duration: 3000,
  slot: 'Snackbar message',
  placement: 'bottom',
};
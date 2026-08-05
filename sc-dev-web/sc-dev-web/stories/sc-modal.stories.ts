import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Modal',
  component: 'sc-modal',
  parameters: {
    docs: {
      description: {
        component:
          'Modal appear above the page and require the user’s immediate attention.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    header: { 
      control: 'text',
      description: 'The header of the modal.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
      if: { arg: 'no-header', eq: false },
    },
    title: { 
      control: 'text',
      description: 'The title of the modal.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'The preferred size of the modal.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
        category: 'Attributes',
      }, 
    },
    'expanded-view': {
      control: 'boolean',
      description: 'Set to expand the modal.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    color: {
      control: 'inline-radio',
      options: ['default', 'blue', 'green', 'amber', 'red'],
      description: 'The preferred color of the modal.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Attributes',
      }, 
    },
    icon: { 
      control: 'boolean', 
      description: 'Set to show the icon in front of the header.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
        category: 'Attributes',
      }, 
    },
    'no-header': { 
      control: 'boolean', 
      description: 'Sets to hide the header. Set this to true will remove header and close icon.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    'no-close-icon': { 
      control: 'boolean', 
      description: 'Sets to hide the close icon.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
      if: { arg: 'no-header', eq: false },
    },
    'no-padding': { 
      control: 'boolean', 
      description: 'Sets to remove all padding within the modal.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    open: { 
      control: 'boolean', 
      description: 'Sets to open and show modal.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    'no-footer': {
      control: 'boolean',
      description: 'Set to hide the footer.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'footer-type': {
      control: 'inline-radio',
      options: ['button', 'pagination', 'alternative'],
      description: 'Type of footer to display.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'button' },
        category: 'Attributes',
      },
    },
    'pagination-total': {
      control: 'number',
      description: 'Total number of items for pagination.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 100 },
        category: 'Attributes',
      },
      if: { arg: 'footer-type', eq: 'pagination' },
    },
    'pagination-label': {
      control: 'boolean',
      description: 'Sets to show pagination label.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'footer-type', eq: 'pagination' },
    },
    'pagination-page-size': {
      control: 'number',
      description: 'Number of items per page for pagination.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 10 },
        category: 'Attributes',
      },
      if: { arg: 'footer-type', eq: 'pagination' },
    },
    'pagination-size-changer': {
      control: 'boolean',
      description: 'Sets to show pagination size changer.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'footer-type', eq: 'pagination' },
    },
    'pagination-current-page': {
      control: 'number',
      description: 'Current page number for pagination.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 1 },
        category: 'Attributes',
      },
      if: { arg: 'footer-type', eq: 'pagination' },
    },
    'pagination-disabled-pages': {
      control: 'array',
      description: 'Array of disabled page numbers for pagination.',
      table: {
        type: { summary: 'number[]' },
        defaultValue: { summary: [] },
        category: 'Attributes',
      },
      if: { arg: 'footer-type', eq: 'pagination' },
    },
    'pagination-jump-first-last-page': {
      control: 'boolean',
      description: 'Sets to show jump to first/last page buttons in pagination.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
        category: 'Attributes',
      },
      if: { arg: 'footer-type', eq: 'pagination' },
    },
    'button-state-primary': {
      control: 'inline-radio',
      options: ['default', 'error', 'alert', 'success'],
      description: 'The preferred state of the primary button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Attributes',
      }, 
      if: { arg: 'footer-type', eq: 'button' },
    },
    'button-state-secondary': {
      control: 'inline-radio',
      options: ['default', 'error', 'alert', 'success'],
      description: 'The preferred state of the secondary button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Attributes',
      }, 
      if: { arg: 'footer-type', eq: 'button' },
    },
    'button-no-pill': {
      control: 'boolean',
      description: 'Sets to show buttons with no pill shape.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'footer-type', eq: 'button' },
    },
    'button-disable-primary': {
      control: 'boolean',
      description: 'Set to show primary button in the disabled state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'button-loading-primary': {
      control: 'boolean',
      description: 'Set to show primary button in the loading state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'footer-type', eq: 'button' },
    },
    'button-disable-secondary': {
      control: 'boolean',
      description: 'Set to show secondary button in the disable state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'button-loading-secondary': {
      control: 'boolean',
      description: 'Set to show secondary button in the loading state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'footer-type', eq: 'button' },
    },
    'button-text-primary': {
      control: 'text',
      description: 'Text of the primary button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'Attributes',
      },
      if: { arg: 'footer-type', eq: 'button' },
    },
    'button-text-secondary': {
      control: 'text',
      description: 'Text of the secondary button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'Attributes',
      },
      if: { arg: 'footer-type', eq: 'button' },
    },
    'button-text-tertiary': {
      control: 'text',
      description: 'Text of the tertiary button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'Attributes',
      },
      if: { arg: 'footer-type', eq: 'button' },
    },
    'button-text-left': {
      control: 'text',
      description: 'Text of the left button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'Attributes',
      },
      if: { arg: 'footer-type', eq: 'button' },
    },
    'disable-outside-click': {
      control: 'boolean',
      description: 'Disables closing the modal by clicking outside of it.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'slot[name=\'header\']': {
      control: 'text',
      description: 'Sets to customize the header.',
      table: {
        category: 'Slots',
      }, 
    },
    'slot[name=\'title\']': {
      control: 'text',
      description: 'Sets to customize the title.',
      table: {
        category: 'Slots',
      }, 
    },
    'slot[name=\'header-actions\']': {
      control: 'text',
      description: 'Sets to customize header actions.',
      table: {
        category: 'Slots',
      }, 
    },
    'slot[name=\'icon\']': {
      control: 'text',
      description: 'Set to customize icon.',
      table: {
        category: 'Slots',
      }, 
    },
    'slot[name=\'footer-button\']': {
      control: 'text',
      description: 'Set to customize icon.',
      table: {
        category: 'Slots',
      }, 
      if: { arg: 'footer-type', eq: 'button' },
    },
    'slot[name=\'footer-left\']': {
      control: 'text',
      description: 'Set to customize icon.',
      table: {
        category: 'Slots',
      }, 
      if: { arg: 'footer-type', eq: 'button' },
    },
    'slot[name=\'alternative-footer\']': {
      control: 'text',
      description: 'Set to customize icon.',
      table: {
        category: 'Slots',
      }, 
      if: { arg: 'footer-type', eq: 'alternative' },
    },
    slot: {
      control: 'text',
      description: 'Sets to customize content.',
      table: {
        category: 'Slots',
      }, 
    },
    'sc-show': {
      description: 'Emitted when the modal opens. Get the model state by event.detail.open.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
    'sc-hide': {
      description: 'Emitted when the modal closes. Get the model state by event.detail.open.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-action': {
      description: 'Emitted when the modal actions are triggered. Get the model action by event.detail.type.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
  },
  args: {
    header: '',
    title: '',
    size: 'md',
    'expanded-view': false,
    color: 'default',
    icon: false,
    open: false,
    'no-header': false,
    'no-close-icon': false,
    'no-padding': false,
    'disable-outside-click': false,
    'no-footer': false,
    'footer-type': 'button',
    'pagination-total': 100,
    'pagination-label': false,
    'pagination-page-size': 10,
    'pagination-size-changer': false,
    'pagination-current-page': 1,
    'pagination-disabled-pages': [],
    'pagination-jump-first-last-page': true,
    'button-state-primary': 'default',
    'button-state-secondary': 'default',
    'button-no-pill': false,
    'button-loading-primary': false,
    'button-disable-primary': false,
    'button-loading-secondary': false,
    'button-disable-secondary': false,
    'button-text-primary': '',
    'button-text-secondary': '',
    'button-text-tertiary': '',
    'button-text-left': '',
    'slot[name=\'header\']': '',
    'slot[name=\'title\']': '',
    'slot[name=\'header-actions\']': '',
    'slot[name=\'footer-button\']': '',
    'slot[name=\'footer-left\']': '',
    'slot[name=\'alternative-footer\']': '',
    'slot[name=\'icon\']': '',
    slot: '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  'header': string;
  'title'?: string;
  size?: string;
  'expanded-view'?: boolean;
  color?: string;
  icon?: boolean;
  'no-header'?: boolean;
  'no-close-icon'?: boolean;
  'no-padding'?: boolean;
  open?: boolean;
  'disable-outside-click'?: boolean;
  'no-footer'?: boolean;
  'footer-type': string;
  'pagination-total'?: number;
  'pagination-label'?: boolean;
  'pagination-page-size'?: number;
  'pagination-size-changer'?: boolean;
  'pagination-current-page'?: number;
  'pagination-disabled-pages'?: number[];
  'pagination-jump-first-last-page'?: boolean;
  'button-state-primary'?: string;
  'button-state-secondary'?: string;
  'button-no-pill'?: boolean;
  'button-loading-primary'?: boolean;
  'button-disable-primary'?: boolean;
  'button-loading-secondary'?: boolean;
  'button-disable-secondary'?: boolean;
  'button-text-primary'?: string;
  'button-text-secondary'?: string;
  'button-text-tertiary'?: string;
  'button-text-left'?: string;
  'slot[name=\'header\']'?: TemplateResult;
  'slot[name=\'title\']'?: TemplateResult;
  'slot[name=\'header-actions\']'?: TemplateResult;
  'slot[name=\'footer-button\']'?: TemplateResult;
  'slot[name=\'footer-left\']'?: TemplateResult;
  'slot[name=\'alternative-footer\']'?: TemplateResult;
  'slot[name=\'icon\']'?: TemplateResult;
  slot?: TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => {
  const handleClick = (event: MouseEvent) => {
    const currentNode: HTMLElement | null = event.target as HTMLElement;
    if (currentNode) {
      const parentNode: HTMLElement | null = currentNode.parentNode as HTMLElement;
      if (parentNode) {
        const defaultModal: any = parentNode.nextElementSibling;
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
        <sc-button class="tooltip-trigger" size="md" @click=${handleClick}>Open modal</sc-button>
      </div>
      <sc-modal
        header=${props['slot[name=\'header\']'] ? '' : props['header']}
        title=${props['slot[name=\'title\']'] ? '' : props['title']}
        ?icon=${props.icon}
        ?expanded-view=${props['expanded-view']}
        ?open=${props.open}
        ?disable-outside-click=${props['disable-outside-click']}
        ?no-header=${props['no-header']}
        ?no-close-icon=${props['no-close-icon']}
        ?no-padding=${props['no-padding']}
        ?no-footer=${props['no-footer']}
        size=${props.size}
        color=${props.color}
        footer-type=${props['footer-type']}
        pagination-total=${props['pagination-total']}
        ?pagination-label=${props['pagination-label']}
        pagination-page-size=${props['pagination-page-size']}
        ?pagination-size-changer=${props['pagination-size-changer']}
        pagination-current-page=${props['pagination-current-page']}
        .pagination-disabled-pages=${props['pagination-disabled-pages']}
        ?pagination-jump-first-last-page=${props['pagination-jump-first-last-page']}
        button-state-primary=${props['button-state-primary']}
        button-state-secondary=${props['button-state-secondary']}
        ?button-no-pill=${props['button-no-pill']}
        ?button-disable-primary=${props['button-disable-primary']}
        ?button-loading-primary=${props['button-loading-primary']}
        ?button-disable-secondary=${props['button-disable-secondary']}
        ?button-loading-secondary=${props['button-loading-secondary']}
        button-text-primary=${props['button-text-primary']}
        button-text-secondary=${props['button-text-secondary']}
        button-text-tertiary=${props['button-text-tertiary']}
        button-text-left=${props['button-text-left']}
      >
        <div slot='header'>
          ${props['slot[name=\'header\']']
            ? props['slot[name=\'header\']']
            : ''}
        </div>
        <div 
          slot='title' 
          style="margin-top: ${props['slot[name=\'title\']'] ? '.5rem' : '0'};"
        >${props['slot[name=\'title\']'] ? props['slot[name=\'title\']'] : ''}
        </div>
        ${props['slot[name=\'icon\']']
          ? html`
              <div slot="icon">${props['slot[name=\'icon\']']}</div>
            `
          : ''}
        <div slot="header-actions">${props['slot[name=\'header-actions\']']}</div>
        ${props['slot[name=\'footer-button\']']
          ? html`
              <div slot="footer-button">${props['slot[name=\'footer-button\']']}</div>
            `
          : ''}
        ${props['slot[name=\'footer-left\']']
        ? html`
            <div slot="footer-left">${props['slot[name=\'footer-left\']']}</div>
          `
        : ''}
        <div slot="alternative-footer">
          ${props['slot[name=\'alternative-footer\']']
            ? props['slot[name=\'alternative-footer\']']
            : html`
                <div 
                  style="display: flex;
                  justify-content: center;
                  align-items: center;
                  cursor: pointer;">
                  <sc-icon name="key" size="md" compact style="margin-right: 8px;"></sc-icon>
                  Activate device token
                </div>
              `}
        </div>
        ${props.slot}
      </sc-modal>
    </div>
  `;
};

export const Default = Template.bind({});
Default.args = {
  header: 'Default modal',
  open: false,
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

export const NoCloseIcon = Template.bind({});
NoCloseIcon.args = {
  header: 'No close icon',
  'no-close-icon': true,
  open: false,
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

export const PreventCloseOutside = Template.bind({});
PreventCloseOutside.args = {
  header: 'Close when click outside',
  open: false,
  'disable-outside-click': true,
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

export const NoHeader = Template.bind({});
NoHeader.args = {
  'no-header': true,
  open: false,
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

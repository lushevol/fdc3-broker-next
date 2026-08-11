import { html, nothing, TemplateResult } from 'lit';
import { truncateArgType } from './utils/ArgTypes.js';

export default {
  title: 'Components/Button/Button',
  component: 'sc-button',
  parameters: {
    docs: {
      description: {
        component:
          'Buttons represent actions that are available to the user.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'text', 'link'],
      description: 'Sets the button type.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
        category: 'Attributes',
      },
    },
    state: {
      control: 'inline-radio',
      options: ['default', 'error', 'alert', 'success'],
      description: 'Sets the button state.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Attributes',
      },
    },
    size: {
      control: 'inline-radio',
      options: ['xxs', 'xs', 'sm', 'md', 'lg'],
      description: 'Sets the button size.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
        category: 'Attributes',
      }, 
    },
    width: {
      control: 'text',
      description: 'Customize button width.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'auto' },
        category: 'Attributes',
      },
    },
    'left-icon': {
      control: 'text',
      description: 'Set the left icon name if need to show icon on button.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'right-icon': {
      control: 'text',
      description: 'Set the right icon name if need to show icon on button.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'no-pill': {
      control: 'boolean',
      description: 'Sets if not round border.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },    
    'no-border': {
      control: 'boolean',
      description: 'Sets to show no border.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },   
    compact: {
      control: 'boolean',
      description: 'Sets to show no padding.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },   
    ...truncateArgType(),
    loading: {
      control: 'boolean',
      description: 'Sets if show spinner on button.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    disabled: { 
      control: 'boolean',
      description: 'Sets disabled attribute.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    selectable: {
      control: 'inline-radio',
      options: [false, true, 'toggle'],
      description: 'Enable selected visual indicator. `selected` will be true when clicked or toggled.',
      table: {
        type: { summary: 'boolean|string' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    selected: { 
      control: 'boolean',
      description: 'Visual indicator that the button has already been clicked. ' +
        'Can be reset by toggle or removing attribute',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'selectable', truthy: true },
    },
    'slot[name=\'loading\']': {
      control: 'text',
      description: 'Sets to customize the label.',
      table: {
        category: 'Slots',
      }, 
    },   
    slot: {
      control: 'text',
      description: 'Button text',
      table: {
        type: { summary: 'string' },
        category: 'Slots',
      },
    },
  },
  args: {
    type: 'primary',
    state: 'default',
    size: 'sm',
    width: 'auto',
    'left-icon': '',
    'right-icon': '',
    'no-pill': false,
    'no-border': false,
    compact: false,
    truncate: false,
    loading: false,
    disabled: false,
    selectable: false,
    'slot[name=\'loading\']': '',
    slot: '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  type: string;
  state: string;
  size: string;
  width: string;
  'left-icon': string;
  'right-icon': string;
  'no-pill': boolean;
  'no-border': boolean;
  compact: boolean;
  truncate: boolean;
  loading: boolean;
  disabled: boolean;
  selectable: boolean | string;
  selected: boolean;
  'slot[name=\'loading\']': TemplateResult;
  slot: TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-button
    type=${props.type}  
    state=${props.state}
    size=${props.size}
    width=${props.width}
    left-icon=${props['left-icon']}
    right-icon=${props['right-icon']}
    ?no-pill=${props['no-pill']}
    ?no-border=${props['no-border']}
    ?compact=${props.compact}
    ?truncate=${props.truncate}
    ?loading=${props.loading}
    ?disabled=${props.disabled}
    selectable=${props.selectable || nothing}
    ?selected=${props.selected}
  >
    ${props['slot[name=\'loading\']']
    ? html`<div slot="loading">${props['slot[name=\'loading\']']}</div>`
    : ''
}    

    ${props.slot}
  </sc-button>
`;

export const Primary = Template.bind({});
Primary.args = {
  type: 'primary',
  disabled: false,
  size: 'sm',
  slot: html`Default`,
};

export const SecondaryButton = Template.bind({});
SecondaryButton.args = {
  type: 'secondary',
  state: 'default',
  disabled: false,
  size: 'sm',
  slot: html`Secondary`,
};

export const TextButton = Template.bind({});
TextButton.args = {
  type: 'text',
  state: 'default',
  disabled: false,
  size: 'sm',
  slot: html`Text`,
};

export const LinkButton = Template.bind({});
LinkButton.args = {
  type: 'link',
  state: 'default',
  disabled: false,
  size: 'sm',
  slot: html`Link`,
};

export const Loading = Template.bind({});
Loading.args = {
  type: 'primary',
  disabled: false,
  loading: true,
  slot: html`Loading`,
};

export const LoadingWithIcons = Template.bind({});
LoadingWithIcons.args = {
  type: 'primary',
  disabled: false,
  loading: true,
  state: 'default',
  'left-icon': 'upload',
  'right-icon': 'arrow-ios-forward',
  slot: html`Loading`,
};

export const PrimaryErrorWithIcon = Template.bind({});
PrimaryErrorWithIcon.args = {
  type: 'primary',
  state: 'error',
  disabled: false,
  'right-icon': 'arrow-ios-forward',
  slot: html`Logout`,
};

export const NotPill = Template.bind({});
NotPill.args = {
  type: 'primary',
  disabled: false,
  'no-pill': true,
  slot: html`Square button`,
};

export const NoBorder = Template.bind({});
NoBorder.args = {
  type: 'primary',
  disabled: false,
  'no-border': true,
  slot: html`No border button`,
};

export const SelectableButton = Template.bind({});
SelectableButton.args = {
  type: 'primary',
  disabled: false,
  selectable: 'toggle',
  slot: html`Click to select`,
};

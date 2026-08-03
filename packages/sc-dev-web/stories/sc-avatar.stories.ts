import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Avatar',
  component: 'sc-avatar',
  parameters: {
    docs: {
      description: {
        component:
          'Avatars can be used to represent people or objects. It supports images, icons, or letters.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    background: {
      control: 'inline-radio',
      options: ['red', 'green', 'blue', 'yellow', 'default'],
      description: 'Sets the background color of the avatar.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    shape: {
      control: 'inline-radio',
      description: 'Sets the shape of the avatar.',
      options: ['circle', 'square'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'circle' },
        category: 'Attributes',
      },
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Sets the size of the avatar.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
        category: 'Attributes',
      },
    },
    'show-badge': {
      control: 'boolean',
      description: 'Sets to show/hide badge content.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'badge-number': {
      control: 'number',
      description: 'Sets the number value of the badge content.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: null },
        category: 'Attributes',
      },
      if: { arg: 'badge-type', eq: 'number' },
    },
    'badge-label': {
      control: 'text',
      description: 'Sets to the label value of the badge content.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'Attributes',
      },
      if: { arg: 'badge-type', eq: 'text' },
    },
    'badge-type': {
      control: 'inline-radio',
      options: ['number', 'text', 'dot'],
      description: 'Sets the preferred type of the badge.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'number' },
        category: 'Attributes',
      },
    },
    'badge-color': {
      control: 'inline-radio',
      options: ['error', 'success', 'info', 'dark-blue', 'warning', 'disabled', 'default'],
      description: 'Sets the preferred color for the badge',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    outlined: {
      control: 'boolean',
      description: 'If true, avatar uses the outlined style. Default is false (filled)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    clickable: {
      control: 'boolean',
      description: 'Sets the avatar to be interactive.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    selected: {
      control: 'boolean',
      description: 'Sets the selected state (requires clickable).',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Sets the disabled state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    tooltip: {
      control: 'text',
      description: 'Tooltip content.',
      table: { type: { summary: 'string' }, category: 'Tooltip' },
    },
    'tooltip-on-hover': {
      control: 'boolean',
      description: 'Show tooltip on hover.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Tooltip',
      },
    },
    'tooltip-mode': {
      control: 'inline-radio',
      options: ['dark', 'light'],
      description: 'Sets the tooltip style mode.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'dark' },
        category: 'Tooltip',
      },
    },
    'tooltip-placement': {
      control: 'inline-radio',
      options: [
        'top',
        'right',
        'bottom',
        'left',
      ],
      description: 'Sets the tooltip placement position.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'top' },
        category: 'Tooltip',
      },
    },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  background?: string;
  shape?: string;
  size?: string;
  'show-badge'?: boolean;
  'badge-value'?: number | string;
  'badge-type'?: string;
  'badge-color'?: BADGE_COLOR;
  'badge-label'?: string;
  'badge-number'?: number;
  outlined?: boolean;
  clickable?: boolean;
  selected?: boolean;
  disabled?: boolean;
  tooltip?: string;
  'tooltip-on-hover'?: boolean;
  'tooltip-mode'?: string;
  'tooltip-placement'?: string;
}

enum BADGE_COLOR {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  DISABLED = 'disabled',
  DARK_BLUE = 'dark-blue',
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-avatar 
  background=${props['background']} 
  shape=${props['shape']} 
  size=${props['size']} 
  ?show-badge=${props['show-badge']} 
  badge-number=${props['badge-number']}
  badge-label=${props['badge-label']}
  badge-type=${props['badge-type']}
  badge-color=${props['badge-color']}
  ?outlined=${props['outlined']}
  ?clickable=${props['clickable']}
  ?selected=${props['selected']}
  ?disabled=${props['disabled']}
  tooltip=${ifDefined(props['tooltip'])}
  ?tooltip-on-hover=${props['tooltip-on-hover']}
  tooltip-mode=${ifDefined(props['tooltip-mode'])}
  tooltip-placement=${ifDefined(props['tooltip-placement'])}
  ></sc-avatar>
`;

const CustomTemplate: Story<ArgTypes> = (props: ArgTypes) => html`
<sc-avatar 
background=${props['background']} 
shape=${props['shape']} 
size=${props['size']} 
?show-badge=${props['show-badge']} 
badge-number=${props['badge-number']}
badge-label=${props['badge-label']}
badge-type=${props['badge-type']}
badge-color=${props['badge-color']}
src="images/avatar-image.png"
  ?outlined=${props['outlined']}
  ?clickable=${props['clickable']}
  ?selected=${props['selected']}
  ?disabled=${props['disabled']}
  tooltip=${ifDefined(props['tooltip'])}
  ?tooltip-on-hover=${props['tooltip-on-hover']}
  tooltip-mode=${ifDefined(props['tooltip-mode'])}
  tooltip-placement=${ifDefined(props['tooltip-placement'])}
></sc-avatar>
`;

export const Default = Template.bind({});
Default.args = {
  background: 'default',
  size: 'md',
  shape: 'circle',
  'show-badge': false,
  'badge-number': 24,
  'badge-type': 'number',
  outlined: false,
  clickable: false,
  selected: false,
  disabled: false,
  'tooltip-on-hover': false,
};

export const Interactive = Template.bind({});
Interactive.args = {
  ...Default.args,
  clickable: true,
};

export const Tooltip = Template.bind({});
Tooltip.args = {
  ...Default.args,
  tooltip: 'Full name',
  'tooltip-on-hover': true,
  'tooltip-mode': 'dark',
  'tooltip-placement': 'right',
};

export const Outlined = Template.bind({});
Outlined.args = {
  ...Default.args,
  outlined: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};

export const Image = CustomTemplate.bind({});
Image.args = {
  background: '',
  shape: 'circle',
  size: 'md',
};

export const ImageBadgeNumber = CustomTemplate.bind({});
ImageBadgeNumber.args = {
  background: '',
  shape: 'circle',
  size: 'md',
  'show-badge': true,
  'badge-number': 24,
  'badge-type': 'number',
};

export const ImageBadgeText = CustomTemplate.bind({});
ImageBadgeText.args = {
  background: '',
  shape: 'circle',
  size: 'md',
  'show-badge': true,
  'badge-type': 'text',
  'badge-label': 'all',
};

export const ImageBadgeDot = CustomTemplate.bind({});
ImageBadgeDot.args = {
  background: '',
  shape: 'circle',
  size: 'md',
  'show-badge': true,
  'badge-type': 'dot',
};


const SlottedElement: Story<ArgTypes> = (props: ArgTypes) => html`
<sc-avatar 
background=${props['background']} 
shape=${props['shape']} 
size=${props['size']} 
?show-badge=${props['show-badge']} 
badge-number=${props['badge-number']}
badge-label=${props['badge-label']}
badge-type=${props['badge-type']}
badge-color=${props['badge-color']}
  ?outlined=${props['outlined']}
  ?clickable=${props['clickable']}
  ?selected=${props['selected']}
  ?disabled=${props['disabled']}
  tooltip=${ifDefined(props['tooltip'])}
  ?tooltip-on-hover=${props['tooltip-on-hover']}
  tooltip-mode=${ifDefined(props['tooltip-mode'])}
  tooltip-placement=${ifDefined(props['tooltip-placement'])}
>SC</sc-avatar>
`;

export const Slot = SlottedElement.bind({});
Slot.args = {
  background: '',
  shape: 'circle',
  size: 'md',
};


export const SlotNumberBadge = SlottedElement.bind({});
SlotNumberBadge.args = {
  background: '',
  shape: 'circle',
  size: 'md',
  'show-badge': true,
  'badge-number': 24,
  'badge-type': 'number',
};


export const SlotTextBadge = SlottedElement.bind({});
SlotTextBadge.args = {
  background: '',
  shape: 'circle',
  size: 'md',
  'show-badge': true,
  'badge-type': 'text',
  'badge-label': 'all',
};


export const SlotDotBadge = SlottedElement.bind({});
SlotDotBadge.args = {
  background: '',
  shape: 'circle',
  size: 'md',
  'show-badge': true,
  'badge-type': 'dot',
};
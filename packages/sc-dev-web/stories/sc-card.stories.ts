import { html, TemplateResult } from 'lit';
import {
  TAG_ATTRIBUTES,
  CARD_SUPPLEMENTARY_ATTRIBUTES,
  handleCustomEvent,
} from '../src/shared/util.js';
import { truncateArgType } from './utils/ArgTypes.js';

function handleScAction(event: any): void {
  console.log('sc-action triggered:', {
    type: event.detail.type,
    target: event.detail.target,
  });
}


export default {
  title: 'Components/Card/Card',
  component: 'sc-card',
  parameters: {
    docs: {
      description: {
        component:
          'Card groups related information in a flexible-size container visually resembling a playing card.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      description: 'The direction of the card content.',
      options: ['horizontal', 'vertical'],
      control: 'inline-radio',
      table: {
        defaultValue: { summary: 'vertical' },
        category: 'Attributes',
      },
    },
    title: {
      control: 'text',
      description: 'Sets to change the card title.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'title-size': {
      control: 'inline-radio',
      options: ['xxs', 'xs', 'sm', 'md', 'lg'],
      description: 'Sets to change the title size.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'sm' },
        category: 'Attributes',
      },
    },
    'sub-title': {
      control: 'text',
      description: 'Sets to change the card sub title.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    body: {
      description: 'Sets to change the card body text.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'body-size': {
      control: 'inline-radio',
      options: ['xxs', 'xs', 'sm', 'md', 'lg'],
      description: 'Sets to change the body size.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'xs' },
        category: 'Attributes',
      },
    },
    'space-size': {
      control: 'inline-radio',
      options: ['xxs', 'xs', 'sm', 'md', 'lg'],
      description: 'Sets to change the card spacing.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'sm' },
        category: 'Attributes',
      },
    },
    'text-align': {
      control: 'inline-radio',
      options: ['left', 'center', 'right', 'justify'],
      description: 'Sets to change the card text alignment.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'left' },
        category: 'Attributes',
      },
    },
    'vertical-align': {
      control: 'inline-radio',
      options: ['top', 'middle', 'bottom'],
      description: 'Sets to change the card vertical alignment.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'middle' },
        category: 'Attributes',
      },
    },
    width: {
      control: 'text',
      description: 'The preferred width for the card.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    height: {
      control: 'text',
      description: 'The preferred height for the card.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'selected-on-click': {
      control: 'boolean',
      description: 'Sets to select the card on click.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'clickable', truthy: true },
    },
    selected: {
      control: 'boolean',
      description: 'Sets to select and highlight the card.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'clickable', truthy: true },
    },
    disabled: {
      control: 'boolean',
      description: 'Set to show the disabled state of the card.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'hover-highlight': {
      control: 'boolean',
      description: 'Sets to enable hover effect.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'no-border': {
      control: 'boolean',
      description: 'Sets to show card without border.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'action-button': {
      control: 'text',
      description: 'Set to show the action button.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    draggable: {
      control: 'boolean',
      description: 'Set to show the drag icon.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    icon: {
      control: 'text',
      description: 'The preferred icon for card.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'icon-size': {
      control: 'inline-radio',
      options: ['xxs', 'xs', 'sm', 'md', 'lg'],
      description: 'The preferred size for the icon.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'sm' },
        category: 'Attributes',
      },
      if: { arg: 'icon', truthy: true },
    },
    'icon-align': {
      control: 'inline-radio',
      options: ['left', 'center', 'right', 'justify'],
      description: 'The preferred alignment for icon.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'right' },
        category: 'Attributes',
      },
      if: { arg: 'icon', truthy: true },
    },
    'icon-vertical-align': {
      control: 'inline-radio',
      options: ['top', 'middle', 'bottom'],
      description: 'The preferred vertical alignment for icon.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'top' },
        category: 'Attributes',
      },
      if: { arg: 'icon-align', eq: 'right' },
    },
    'tags-group': {
      control: 'array',
      description: 'Sets the tags for the card.',
      table: {
        type: { summary: 'array' },
        category: 'Attributes',
      },
    },
    'supplementary-details': {
      control: 'array',
      description: 'Sets the tags for the card.',
      table: {
        type: { summary: 'array' },
        category: 'Attributes',
      },
    },
    clickable: {
      control: 'boolean',
      description: 'Set to make the card clickable.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'button-no-pill': {
      control: 'boolean',
      description: 'Set to show the no pill state for the buttons.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'clickable', truthy: false },
    },
    'button-state-primary': {
      control: 'inline-radio',
      options: ['default', 'error'],
      description: 'The state for the primary button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Attributes',
      },
      if: { arg: 'clickable', truthy: false },
    },
    'button-state-secondary': {
      control: 'inline-radio',
      options: ['default', 'error'],
      description: 'The state for the secondary button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Attributes',
      },
      if: { arg: 'clickable', truthy: false },
    },
    'button-text-primary': {
      control: 'text',
      description: 'The text for the primary button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Decision' },
        category: 'Attributes',
      },
      if: { arg: 'clickable', truthy: false },
    },
    'button-text-secondary': {
      control: 'text',
      description: 'The text for the secondary button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Way out' },
        category: 'Attributes',
      },
      if: { arg: 'clickable', truthy: false },
    },
    'button-text-left': {
      control: 'text',
      description: 'The text for the left button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Learn more' },
        category: 'Attributes',
      },
      if: { arg: 'clickable', truthy: false },
    },
    'button-truncate': truncateArgType().truncate,
    expandable: {
      control: 'boolean',
      description: 'Set to show an expandable card.',
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
    'slot[name=\'prefix\']': {
      control: 'text',
      description: 'Sets to customize the prefix.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'suffix\']': {
      control: 'text',
      description: 'Sets to customize the suffix.',
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
    'slot[name=\'sub-title\']': {
      control: 'text',
      description: 'Sets to customize the sub title.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'body\']': {
      control: 'text',
      description: 'Sets to customize the body.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'footer\']': {
      control: 'text',
      description: 'Sets to customize the footer.',
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
    'sc-action': {
      description:
        `Emitted when clicking on the icon, action or drag button. Get the interacted element by event.detail.target.
        Also emitted when clicking on the buttons. Get the button type by event.detail.type.`,
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'sc-card-click': {
      description:
        'Emitted when selecting the card. Get the selected value by event.detail.value.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
      if: { arg: 'selected-on-click', truthy: true },
    },
  },
  args: {
    direction: 'horizontal',
    title: '',
    'title-size': 'sm',
    'sub-title': '',
    body: '',
    'body-size': 'xs',
    'space-size': 'sm',
    'text-align': 'left',
    'vertical-align': 'middle',
    width: '100%',
    height: 'auto',
    icon: '',
    'icon-size': 'sm',
    'icon-align': 'right',
    'icon-vertical-align': 'top',
    selected: false,
    'selected-on-click': false,
    disabled: false,
    'hover-highlight': false,
    'no-border': false,
    'action-button': '',
    draggable: false,
    'tags-group': [],
    'supplementary-details': [],
    clickable: false,
    'button-no-pill': false,
    'button-state-primary': 'default',
    'button-state-secondary': 'default',
    'button-text-primary': 'Decision',
    'button-text-secondary': 'Way out',
    'button-text-left': 'Learn more',
    'button-truncate': false,
    expandable: false,
    'slot[name=\'header\']': '',
    'slot[name=\'footer\']': '',
    'slot[name=\'prefix\']': '',
    'slot[name=\'suffix\']': '',
    'slot[name=\'title\']': '',
    'slot[name=\'sub-title\']': '',
    'slot[name=\'body\']': '',
    slot: '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
}

interface ArgTypes {
  direction: string;
  title?: string;
  'title-size'?: string;
  'sub-title'?: string;
  body?: string;
  'body-size'?: string;
  'space-size'?: string;
  'text-align'?: string;
  'vertical-align'?: string;
  width?: string;
  height?: string;
  selected?: boolean;
  'selected-on-click'?: boolean;
  disabled?: boolean;
  'hover-highlight'?: boolean;
  'no-border'?: boolean;
  'action-button'?: string;
  draggable?: boolean;
  icon?: string;
  'icon-size'?: string;
  'icon-align'?: string;
  'icon-vertical-align'?: string;
  'tags-group'?: TAG_ATTRIBUTES[];
  'supplementary-details'?: CARD_SUPPLEMENTARY_ATTRIBUTES[];
  clickable?: boolean;
  'button-no-pill'?: boolean;
  'button-state-primary'?: string;
  'button-state-secondary'?: string;
  'button-text-primary'?: string;
  'button-text-secondary'?: string;
  'button-text-left'?: string;
  'button-truncate'?: boolean;
  expandable?: boolean;
  'slot[name=\'header\']'?: TemplateResult;
  'slot[name=\'footer\']'?: TemplateResult;
  'slot[name=\'prefix\']'?: TemplateResult;
  'slot[name=\'suffix\']'?: TemplateResult;
  'slot[name=\'title\']'?: TemplateResult;
  'slot[name=\'sub-title\']'?: TemplateResult;
  'slot[name=\'body\']'?: TemplateResult;
  slot?: TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-card
    direction=${props.direction}
    title-size=${props['title-size']}
    body-size=${props['body-size']}
    space-size=${props['space-size']}
    text-align=${props['text-align']}
    vertical-align=${props['vertical-align']}
    width=${props['width']}
    height=${props['height']}
    ?selected=${props['selected']}
    ?selected-on-click=${props['selected-on-click']}
    ?disabled=${props['disabled']}
    ?hover-highlight=${props['hover-highlight']}
    ?no-border=${props['no-border']}
    ?draggable=${props.draggable}
    action-button=${props['action-button']}
    icon=${props['icon']}
    icon-size=${props['icon-size']}
    icon-align=${props['icon-align']}
    icon-vertical-align=${props['icon-vertical-align']}
    .tagsGroup=${props['tags-group']}
    .supplementaryDetails=${props['supplementary-details']}
    ?clickable=${props['clickable']}
    ?button-no-pill=${props['button-no-pill']}
    button-state-primary=${props['button-state-primary']}
    button-state-secondary=${props['button-state-secondary']}
    button-text-primary=${props['button-text-primary']}
    button-text-secondary=${props['button-text-secondary']}
    button-text-left=${props['button-text-left']}
    ?button-truncate=${props['button-truncate']}
    ?expandable=${props.expandable}
    @sc-action=${(e: any) => handleScAction(e)}
    @sc-card-click=${handleCustomEvent}
  >
    <div slot="title">
      ${props['slot[name=\'title\']'] ? props['slot[name=\'title\']'] : props.title}
    </div>
    <div slot="sub-title">
      ${props['slot[name=\'sub-title\']']
        ? props['slot[name=\'sub-title\']']
        : props['sub-title']}
    </div>
    <div slot="body">
      ${props['slot[name=\'body\']'] ? props['slot[name=\'body\']'] : props.body}
    </div>
    ${props['slot[name=\'prefix\']']
      ? html`<div slot="prefix">${props['slot[name=\'prefix\']']}</div>`
      : ''}
    ${props['slot[name=\'suffix\']']
      ? html`<div slot="suffix">${props['slot[name=\'suffix\']']}</div>`
      : ''}
    ${props['slot[name=\'header\']']
      ? html`<div slot="header">${props['slot[name=\'header\']']}</div>`
      : ''}
    <div slot="footer" style="display:flex;width:100%;">
      ${props['slot[name=\'footer\']']}
    </div>
    <sc-icon-button
      type="text"
      size="sm"
      name="search"
      slot="card-action-button"
      @click=${() => console.log('hello')}
    ></sc-icon-button>
    ${props.slot}
  </sc-card>
`;

export const Default = Template.bind({});
Default.args = {
  title: 'Introduction to web developement',
  'sub-title': 'Architecture',
  body: `Lorem ipsum dolor sit amet, 
  consectetur adipiscing elit, 
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
  Ut enim ad minim veniam, 
  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  Lorem ipsum dolor sit amet, 
  consectetur adipiscing elit, 
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  'tags-group': [
    { type: 'red', iconName: 'alert-circle--line', content: 'High risk' },
    {
      type: 'amber',
      iconName: 'alert-triangle--line',
      content: 'Pending approval',
    },
    { type: 'primary', iconName: 'info-circle--line', content: 'Information' },
  ] as TAG_ATTRIBUTES[],
  'supplementary-details': [
    { iconName: 'clock--line', details: '9 APIs' },
    { iconName: 'calendar--line', details: '20 September 2023' },
    { iconName: 'clock--line', details: '23 min read' },
  ],
};

export const ActionButton = Template.bind({});
ActionButton.args = {
  title: 'Introduction to web developement',
  'sub-title': 'Architecture',
  body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
  'action-button': 'more-vertical',
};

export const ActionButtonVertical = Template.bind({});
ActionButtonVertical.args = {
  title: 'Introduction to web developement',
  'sub-title': 'Architecture',
  body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
  'action-button': 'more-vertical',
  direction: 'vertical',
};

export const Selected = Template.bind({});
Selected.args = {
  title: 'Introduction to web developement',
  'sub-title': 'Architecture',
  body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
  selected: true,
  'selected-on-click': true,
};

export const Clickable = Template.bind({});
Clickable.args = {
  title: 'Introduction to web developement',
  'sub-title': 'Architecture',
  body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
  'action-button': 'more-vertical',
  clickable: true,
};

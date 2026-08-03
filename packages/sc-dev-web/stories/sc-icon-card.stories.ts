import { html, TemplateResult } from 'lit';
import { TAG_ATTRIBUTES, CARD_SUPPLEMENTARY_ATTRIBUTES } from '../src/shared/util.js';
import { truncateArgType } from './utils/ArgTypes.js';

function handleScAction(event: any): void {
  console.log('sc-action triggered:', {
    type: event.detail.type,
    target: event.detail.target,
  });
}

export default {
  title: 'Components/Card/Icon Card',
  component: 'sc-icon-card',
  parameters: {
    docs: {
      description: {
        component:
          'Icon card are surfaces that display content and actions on a single topic.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['default', 'icon'],
      description: 'The preferred mode for icon card.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Attributes',
      },  
    },    
    src: { 
      control: 'text',
      description: 'Sets the image URL.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },  
      if: { arg: 'mode', eq: 'default' },
    },
    icon: { 
      control: 'text',
      description: 'Sets the icon name.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },  
      if: { arg: 'mode', eq: 'icon' },
    },
    'icon-size': { 
      control: 'inline-radio',
      description: 'Sets the icon size.',
      options: ['xxs', 'xs', 'sm', 'md', 'lg'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'sm' },
        category: 'Attributes',
      },  
      if: { arg: 'mode', eq: 'icon' },
    },      
    'icon-align': { 
      control: 'inline-radio',
      options: ['left', 'center', 'right', 'justify'],
      description: 'The preferred alignment for icon.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'left' },
        category: 'Attributes',
      },  
      if: { arg: 'mode', eq: 'icon' },
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
        defaultValue: { summary: 'sm' },
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
    'image-align': {
      control: 'inline-radio',
      options: ['left', 'center', 'right', 'justify'],
      description: 'Sets to change the card image alignment.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'left' },
        category: 'Attributes',
      }, 
      if: { arg: 'mode', eq: 'default' },
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
    selected: { 
      control: 'boolean',
      description: 'Sets to select and highlight the card.',
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
    layout: {
      control: 'inline-radio',
      options: ['title-in', 'title-out'],
      description: 'The preferred layout for the card.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'title-in' },
        category: 'Attributes',
      },  
    },  
    size: {
      control: 'inline-radio',
      options: ['full', 'half', 'one-third', 'one-fourth', 'custom'],
      description: 'The preferred size of the card.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'full' },
        category: 'Attributes',
      },  
    },   
    width: { 
      control: 'text',
      description: 'The preferred width for the card.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '100%' },
        category: 'Attributes',
      }, 
      if: { arg: 'size', eq: 'custom' },
    },
    height: { 
      control: 'text', 
      description: 'The preferred height for the card.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
      if: { arg: 'size', eq: 'custom' },
    },   
    direction: {
      description: 'The direction of the card content.',
      options: ['horizontal', 'vertical'],
      control: 'inline-radio',
      table: { 
        defaultValue: { summary: 'vertical' },
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
    disabled: { 
      control: 'boolean',
      description: 'Set to show the disabled state of the card.',
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
      if: { arg: 'icon-vertical-align', eq: 'top' },
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
    'slot[name=\'image\']': {
      control: 'text',
      description: 'Sets to customize the image.',
      table: {
        category: 'Slots',
      }, 
      if: { arg: 'mode', eq: 'default' },
    },
    'slot[name=\'icon\']': {
      control: 'text',
      description: 'Sets to customize the icon.',
      table: {
        category: 'Slots',
      }, 
      if: { arg: 'mode', eq: 'icon' },
    },
    slot: {
      control: 'text',
      description: 'Sets to customize content.',
      table: {
        category: 'Slots',
      }, 
    },
    'sc-action': {
      description: 'Emitted when clicking on the icon, action or drag button. Get the interacted element by event.detail.target',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
  },
  args: {
    mode: 'default',
    src: '',
    icon: '',
    'icon-size': 'sm',
    'icon-align': 'left',
    'icon-vertical-align': 'top',
    title: '',
    'title-size': 'sm',
    body: '',
    'body-size': 'sm',
    'space-size': 'sm',
    'image-align': 'left',
    'text-align': 'left',
    layout: 'title-in',
    size: 'full',    
    width: '100%',
    height: 'auto',
    selected: false,
    'hover-highlight': false,
    'no-border': false,
    direction: 'horizontal',
    'sub-title': '',
    'vertical-align': 'middle',
    'selected-on-click': false,
    disabled: false,
    'action-button': '',
    draggable: false,
    'tags-group': [],
    'supplementary-details': [],
    clickable: false,
    'button-no-pill': false,
    'button-state-secondary': 'default',
    'button-text-primary': 'Decision',
    'button-text-secondary': 'Way out',
    'button-text-left': 'Learn more',
    'button-truncate': false,
    expandable: false,
    'slot[name=\'header\']': '',    
    'slot[name=\'title\']': '',    
    'slot[name=\'body\']': '',  
    'slot[name=\'image\']': '', 
    'slot[name=\'icon\']': '', 
    'slot[name=\'footer\']': '',    
    'slot[name=\'sub-title\']': '',    
    slot: '',  
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
}

interface ArgTypes {
    mode?: string;
    src?: string;
    icon?: string;
    'icon-size'?: string;
    'icon-align'?: string;
    'icon-vertical-align'?: string;
    title?: string;
    'title-size'?: string;
    body?: string;
    'body-size'?: string;
    'space-size'?: string;
    'image-align'?: string;
    'text-align'?: string;
    selected?: boolean;
    'hover-highlight'?: boolean;
    'no-border'?: boolean;
    layout?: string;
    size?: string;
    width?: string;
    height?: string;
    direction: string;
    'sub-title'?: string;
    'vertical-align'?: string;
    'selected-on-click'?: boolean;
    disabled?: boolean;
    'action-button'?: string;
    draggable?: boolean;
    'tags-group'?: TAG_ATTRIBUTES[];
    'supplementary-details'?: CARD_SUPPLEMENTARY_ATTRIBUTES[];
    'clickable'?: boolean;
    'button-no-pill'?: boolean;
    'button-state-secondary'?: string;
    'button-text-primary'?: string;
    'button-text-secondary'?: string;
    'button-text-left'?: string;
    'button-truncate'?: boolean;
    expandable?: boolean;
    'slot[name=\'header\']'?: TemplateResult;
    'slot[name=\'title\']'?: TemplateResult;
    'slot[name=\'body\']'?: TemplateResult;
    'slot[name=\'image\']'?: TemplateResult;
    'slot[name=\'icon\']'?: TemplateResult;
    'slot[name=\'footer\']'?: TemplateResult; 
    'slot[name=\'sub-title\']'?: TemplateResult;    
    slot?: TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-icon-card 
    mode=${props['mode']}
    src=${props['src']}
    icon=${props['icon']}
    icon-size=${props['icon-size']}
    icon-align=${props['icon-align']}
    title-size=${props['title-size']}
    body-size=${props['body-size']}
    space-size=${props['space-size']}
    image-align=${props['image-align']}
    text-align=${props['text-align']}
    ?selected=${props['selected']}
    ?hover-highlight=${props['hover-highlight']}
    ?no-border=${props['no-border']}
    layout=${props['layout']}
    size=${props['size']}
    width=${props['width']}
    height=${props['height']}
    direction=${props.direction}
    vertical-align=${props['vertical-align']}
    ?selected-on-click=${props['selected-on-click']}
    ?disabled=${props['disabled']}
    action-button=${props['action-button']}
    ?draggable=${props.draggable}
    icon-vertical-align=${props['icon-vertical-align']}
    .tagsGroup=${props['tags-group']}
    .supplementaryDetails=${props['supplementary-details']}
    ?clickable=${props['clickable']}
    ?button-no-pill=${props['button-no-pill']}
    button-state-secondary=${props['button-state-secondary']}
    button-text-primary=${props['button-text-primary']}
    button-text-secondary=${props['button-text-secondary']}
    button-text-left=${props['button-text-left']}
    ?button-truncate=${props['button-truncate']}
    ?expandable=${props.expandable}
    @sc-action=${(e: any) => handleScAction(e)}
  >
    <div slot="title">
      ${props['slot[name=\'title\']'] ? props['slot[name=\'title\']'] : props.title}
    </div>
    <div slot="sub-title">
      ${props['slot[name=\'sub-title\']'] ? props['slot[name=\'sub-title\']'] : props['sub-title']}
    </div>
    <div slot="body">
      ${props['slot[name=\'body\']'] ? props['slot[name=\'body\']'] : props.body}
    </div>
    ${props['src'] === '' ? html`
      <div slot="image">
        ${props['slot[name=\'image\']'] ? props['slot[name=\'image\']'] : ''}
      </div>
    ` : ''}
    <div slot="icon">
      ${props['slot[name=\'icon\']'] ? props['slot[name=\'icon\']'] : ''}
    </div>
    ${props['slot[name=\'header\']'] ? html`
      <div slot="header">
        ${props['slot[name=\'header\']']}
      </div>
    ` : ''}
    <div slot="footer" style='display:flex;width:100%;'>
      ${props['slot[name=\'footer\']']}
    </div>
    ${props.slot}
  </sc-icon-card>
`;

export const Default = Template.bind({});
Default.args = {
  src: 'images/logo.svg',
  icon: 'info-circle--line',
  title: 'Standard Chartered',
  'sub-title': 'Architecture',
  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',  
  'tags-group': [
    { type: 'red', iconName: 'alert-circle--line', content: 'High risk' },
    { type: 'amber', iconName: 'alert-triangle--line', content: 'Pending approval' },
    { type: 'primary', iconName: 'info-circle--line', content: 'Information' },
  ] as TAG_ATTRIBUTES[],
  'supplementary-details': [
    { iconName: 'clock--line', details: '9 APIs' },
    { iconName: 'calendar--line', details: '20 September 2023' },
    { iconName: 'clock--line', details: '23 min read' },
  ],
};

export const TitleInLayout = Template.bind({});
TitleInLayout.args = {
  src: 'images/logo.svg',
  title: 'Standard Chartered',
  'title-size': 'lg',
  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',  
  'image-align': 'left',
  'text-align': 'left',
};

export const TitleOutLayout = Template.bind({});
TitleOutLayout.args = {
  src: 'images/logo.svg',
  title: 'Standard Chartered',
  'title-size': 'lg',
  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',  
  'image-align': 'left',
  'text-align': 'left',
  layout: 'title-out',    
};

export const HalfSize = Template.bind({});
HalfSize.args = {
  src: 'images/logo.svg',
  title: 'Standard Chartered',
  layout: 'title-out',
  size: 'half',
};

export const OneThirdSize = Template.bind({});
OneThirdSize.args = {
  src: 'images/logo.svg',
  title: 'Standard Chartered',
  layout: 'title-out',
  size: 'one-third',  
};

export const Icon = Template.bind({});
Icon.args = {
  mode: 'icon',
  icon: 'checkmark-circle--line',
  'icon-size': 'lg',
  title: 'Registration completed!',
  'title-size': 'md',
  'hover-highlight': true,
};
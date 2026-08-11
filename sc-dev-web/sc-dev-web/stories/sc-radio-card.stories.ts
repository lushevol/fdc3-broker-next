import { html, TemplateResult } from 'lit';
import { TAG_ATTRIBUTES, CARD_SUPPLEMENTARY_ATTRIBUTES } from '../src/shared/util.js';

export default {
  title: 'Components/Card/Radio Card',
  component: 'sc-radio-card',
  parameters: {
    docs: {
      description: {
        component:
          `Radio card groups related information in a flexible-size container visually resembling 
          a playing card and show radio button for user action.`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    'radio-position': {
      control: 'inline-radio',
      options: ['left', 'right'],
      description: 'Sets to change the radio button position.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'left' },
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
    'sub-title-size': {
      control: 'inline-radio',
      options: ['xxs', 'xs', 'sm', 'md', 'lg'],
      description: 'Sets to change the sub title size.',
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
    checked: { 
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
    disabled: { 
      control: 'boolean',
      description: 'Sets to disabled radio button.',
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
        defaultValue: { summary: 'md' },
        category: 'Attributes',
      },  
    },    
    'icon-vertical-align': { 
      control: 'inline-radio',
      options: ['top', 'middle', 'bottom'],
      description: 'The preferred vertical alignment for icon.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'middle' },
        category: 'Attributes',
      },  
    },
    clickable: {
      control: 'boolean',
      description: 'Set to make the card clickable and get custom event i.e sc-action',
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
    'sc-change': {
      description: 'Emitted when the checked state changes. Get the radio state by event.detail.checked.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },       
    },
    'sc-action': {
      description: 'Emitted when clickable=true and click on card. Get the radio state by event.detail.checked.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },       
    },
  },
  args: {
    'radio-position': 'left',
    title: '',
    'title-size': 'sm',
    'sub-title': '',
    'sub-title-size': 'sm',
    body: '',
    'body-size': 'sm',
    'space-size': 'sm',
    'text-align': 'left',
    'vertical-align': 'middle',
    width: '100%',
    height: 'auto',
    icon: '',
    'icon-size': 'md',
    'icon-vertical-align': 'middle',    
    checked: false,
    'hover-highlight': false,
    'no-border': false,
    disabled: false,
    'tags-group': [
      { type: 'red', iconName: 'alert-circle--line', content: 'High risk' },
      { type: 'amber', iconName: 'alert-triangle--line', content: 'Pending approval' },
      { type: 'primary', iconName: 'info-circle--line', content: 'Information' },
    ],
    'supplementary-details': [
      { iconName: 'clock--line', details: '9 APIs' },
      { iconName: 'calendar--line', details: '20 September 2023' },
      { iconName: 'clock--line', details: '23 min read' },
    ],
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
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  'radio-position'?: string;
  title?: string;
  'title-size'?: string;
  'sub-title'?: string;
  'sub-title-size'?: string;
  body?: string;
  'body-size'?: string;
  'space-size'?: string;
  'text-align'?: string;
  'vertical-align'?: string;
  width?: string;
  height?: string;
  checked?: boolean;
  'hover-highlight'?: boolean;
  'no-border'?: boolean;
  disabled?: boolean;
  icon?: string;
  'tags-group'?: TAG_ATTRIBUTES[];
  'supplementary-details'?: CARD_SUPPLEMENTARY_ATTRIBUTES[];
  'icon-size'?: string;
  'icon-vertical-align'?: string;
  'slot[name=\'header\']'?: TemplateResult;    
  'slot[name=\'footer\']'?: TemplateResult; 
  'slot[name=\'prefix\']'?: TemplateResult;
  'slot[name=\'suffix\']'?: TemplateResult;
  'slot[name=\'title\']'?: TemplateResult;
  'slot[name=\'sub-title\']'?: TemplateResult;    
  'slot[name=\'body\']'?: TemplateResult;
  slot?: TemplateResult;
  clickable: boolean;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => {
  const handleCustomEvent = (e: Event) => {
    console.log(e);
    console.log((e as CustomEvent).detail.checked);
  };

  return html`
  <sc-radio-card 
    radio-position=${props['radio-position']}
    title-size=${props['title-size']}
    sub-title-size=${props['sub-title-size']}
    body-size=${props['body-size']}
    space-size=${props['space-size']}
    text-align=${props['text-align']}
    vertical-align=${props['vertical-align']}
    width=${props['width']}
    height=${props['height']}
    ?checked=${props['checked']}
    ?hover-highlight=${props['hover-highlight']}
    ?no-border=${props['no-border']}
    ?disabled=${props['disabled']}
    ?clickable=${props['clickable']}
    icon=${props['icon']} 
    icon-size=${props['icon-size']}
    icon-vertical-align=${props['icon-vertical-align']}
    .tagsGroup=${props['tags-group']}
    .supplementaryDetails=${props['supplementary-details']}
    @sc-action=${handleCustomEvent}
    @sc-change=${handleCustomEvent}
    >
      <div slot="title">
        ${props['slot[name=\'title\']']
    ? props['slot[name=\'title\']'] 
    : props.title
}
      </div>
      <div slot="sub-title">
        ${props['slot[name=\'sub-title\']']
    ? props['slot[name=\'sub-title\']'] 
    : props['sub-title']
}
      </div>
      <div slot="body">
        ${props['slot[name=\'body\']']
    ? props['slot[name=\'body\']'] 
    : props.body
}
      </div>
      <div slot="prefix">${props['slot[name=\'prefix\']']}</div>
      <div slot="suffix">${props['slot[name=\'suffix\']']}</div>
      <div slot="header">${props['slot[name=\'header\']']}</div>
      <div slot="footer">${props['slot[name=\'footer\']']}</div>
      ${props.slot}
  </sc-radio-card>
`;
};

export const Default = Template.bind({});
Default.args = {
  title: 'Women in Entrepreneurship (WiE) in Asia',
  'sub-title': 'Singapore',
  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
};

export const IconAndHover = Template.bind({});
IconAndHover.args = {
  title: 'Women in Entrepreneurship (WiE) in Asia',
  'sub-title': 'Singapore',
  icon: 'arrow-ios-forward', 
  'icon-size': 'md',
  'hover-highlight': true,
};

export const Selected = Template.bind({});
Selected.args = {
  title: 'Women in Entrepreneurship (WiE) in Asia',
  'title-size': 'lg',
  'sub-title': 'Singapore',
  'sub-title-size': 'xs',
  'text-align': 'left',
  'space-size': 'md',
  checked: true,  
  slot: html`Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,   
};

export const Diasbled = Template.bind({});
Diasbled.args = {
  title: 'Women in Entrepreneurship (WiE) in Asia',
  'title-size': 'lg',
  'sub-title': 'Singapore',
  'sub-title-size': 'xs',
  'text-align': 'left',
  'space-size': 'md',
  checked: true,
  disabled: true,
  slot: html`Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,   
};

export const WithHeaderAndFooter = Template.bind({});
WithHeaderAndFooter.args = {
  'radio-position': 'left',
  title: 'Women in Entrepreneurship (WiE) in Asia',
  'title-size': 'md',
  'space-size': 'sm',
  'slot[name=\'header\']': html`
    <div style='margin-left:15px'>
      <h3>Spotlight</h3>
    </div>
  `,
  'slot[name=\'footer\']': html`
    <div style='margin-left:15px;margin-bottom:15px'>
      <sc-tag type='primary'>#bettertogether</sc-tag><sc-tag type='primary'>#diversity</sc-tag>
    </div>
  `,
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

export const WithoutBorder = Template.bind({});
WithoutBorder.args = {
  title: 'Women in Entrepreneurship (WiE) in Asia',
  'title-size': 'md',
  'sub-title': 'Singapore',
  'sub-title-size': 'xs',
  'space-size': 'xxs',
  'no-border': true,
};

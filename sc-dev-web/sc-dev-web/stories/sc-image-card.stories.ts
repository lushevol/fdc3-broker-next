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
  title: 'Components/Card/Image Card',
  component: 'sc-image-card',
  parameters: {
    docs: {
      description: {
        component:
            'Image card groups related information in a flexible-size container visually resembling a playing card.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    'image-position': {
      control: 'inline-radio',
      options: ['left', 'right', 'background'],
      description: 'Sets to change the image position.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'left' },
        category: 'Attributes',
      },  
    },
    direction: {
      type: '"horizontal" | "vertical"',
      description: 'The direction of the card.',
      options: ['horizontal', 'vertical'],
      control: 'inline-radio',
      table: { 
        type: { summary: 'string' },
        defaultValue: { summary: 'horizontal' },
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
    },
    'background-color': { 
      control: 'text',
      description: 'Sets to change the card background color.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },  
      if: { arg: 'image-position', eq: 'background' },
    },
    'background-position': { 
      control: 'text',
      description: 'Sets to change the image background position.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },  
      if: { arg: 'image-position', eq: 'background' },
    },
    'background-repeat': { 
      control: 'text',
      description: 'Sets to change the image background repeat value.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },  
      if: { arg: 'image-position', eq: 'background' },
    },
    'background-size': { 
      control: 'text',
      description: 'Sets to change the image background size.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },  
      if: { arg: 'image-position', eq: 'background' },
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
    'no-border': { 
      control: 'boolean',
      description: 'Sets to show card without border.',
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
    'button-type-primary': {
      control: 'text',
      description: 'The type for the primary button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Attributes',
      },
      if: { arg: 'clickable', truthy: false },
    },
    'button-type-secondary': {
      control: 'text',
      description: 'The type for the secondary button.',
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
      description: 'Emitted when click on the icon. Get the interacted element by event.detail.target.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
  },
  args: {
    'image-position': 'left',
    src: '',
    'background-color': '',
    'background-position': '',
    'background-repeat': '',
    'background-size': '',
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
    height: '100%',
    icon: '',
    'icon-size': 'sm',    
    'icon-vertical-align': 'middle',
    selected: false,
    'hover-highlight': false,
    'no-border': false,
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
    clickable: false,
    'button-no-pill': false,
    'button-type-primary': 'default',
    'button-type-secondary': 'default',
    'button-text-primary': 'Decision',
    'button-text-secondary': 'Way out',
    'button-text-left': 'Learn more',
    'button-truncate': false,
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
    'image-position'?:string;
    direction?:string;
    'src'?: string;
    'background-color'?: string;
    'background-position'?:string;
    'background-repeat'?: string;
    'background-size'?: string;
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
    selected?: boolean;
    'hover-highlight'?: boolean;
    'no-border'?: boolean;
    icon?: string;
    'icon-size'?: string;
    'icon-vertical-align'?: string,
    'tags-group'?: TAG_ATTRIBUTES[];
    'supplementary-details'?: CARD_SUPPLEMENTARY_ATTRIBUTES[];
    'clickable'?: boolean;
    'button-no-pill'?: boolean;
    'button-type-primary'?: string;
    'button-type-secondary'?: string;
    'button-text-primary'?: string;
    'button-text-secondary'?: string;
    'button-text-left'?: string;
    'button-truncate'?: boolean;
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
    <div style="${props.direction === 'vertical' ? 'width: 300px' : 'height: 270px'}">
      <sc-image-card 
        image-position=${props['image-position']}
        direction=${props['direction']}
        src=${props['src']}
        title=${props['title']}
        sub-title=${props['sub-title']}
        background-color=${props['background-color']}
        background-position=${props['background-position']}
        background-repeat=${props['background-repeat']}
        background-size=${props['background-size']}
        title-size=${props['title-size']}
        sub-title-size=${props['sub-title-size']}
        body-size=${props['body-size']}
        space-size=${props['space-size']}
        text-align=${props['text-align']}
        vertical-align=${props['vertical-align']}
        width=${props['width']}
        height=${props['height']}
        ?selected=${props['selected']}
        ?hover-highlight=${props['hover-highlight']}
        ?no-border=${props['no-border']}
        icon=${props['icon']} 
        icon-size=${props['icon-size']}
        icon-vertical-align=${props['icon-vertical-align']}
        .tagsGroup=${props['tags-group']}
        .supplementaryDetails=${props['supplementary-details']}
        ?clickable=${props['clickable']}
        ?button-no-pill=${props['button-no-pill']}
        button-type-primary=${props['button-type-primary']}
        button-type-secondary=${props['button-type-secondary']}
        button-text-primary=${props['button-text-primary']}
        button-text-secondary=${props['button-text-secondary']}
        button-text-left=${props['button-text-left']}
        ?button-truncate=${props['button-truncate']}
        @sc-action=${(e: any) => handleScAction(e)}
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
        ${props['slot[name=\'prefix\']']
          ? html`
            <div slot="prefix">${props['slot[name=\'prefix\']']}</div>
              ` 
          : '' 
        }
        ${props['slot[name=\'suffix\']']
          ? html`
            <div slot="suffix">${props['slot[name=\'suffix\']']}</div>
              ` 
          : '' 
        }
        ${props['slot[name=\'header\']']
          ? html`
            <div slot="header">${props['slot[name=\'header\']']}</div>
              ` 
          : '' 
        }
        ${props['slot[name=\'footer\']']
          ? html`
            <div slot="footer">${props['slot[name=\'footer\']']}</div>
              ` 
          : '' 
        }
        ${props.slot}
      </sc-image-card>
    </div>
`;


export const Default = Template.bind({});
Default.args = {
  'image-position': 'left',
  direction: 'horizontal',
  src: 'images/illustration.png',
  title: 'China Diversity & Inclusion (D&I) Melody 彩虹天空 - 渣打中国 D&I 原创主题曲',
  'sub-title': 'Valued Behaviours: Better together',
  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  height: '100%',
};

export const Direction = Template.bind({});
Direction.args = {
  direction: 'vertical',
  src: 'images/illustration.png',
  title: 'China Diversity & Inclusion (D&I) Melody 彩虹天空 - 渣打中国 D&I 原创主题曲',
  'sub-title': 'Valued Behaviours: Better together',
  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  height: 'auto',
};

export const IconAndHover = Template.bind({});
IconAndHover.args = {
  'image-position': 'left',
  direction: 'horizontal',
  src: 'images/illustration.png',
  title: 'China Diversity & Inclusion (D&I) Melody 彩虹天空 - 渣打中国 D&I 原创主题曲',
  'sub-title': 'Valued Behaviours: Better together',
  'sub-title-size': 'xs',
  'hover-highlight': true,
  icon: 'arrow-ios-forward', 
  'icon-size': 'sm',    
};

export const SelectedAndTextAligment = Template.bind({});
SelectedAndTextAligment.args = {
  'image-position': 'left',
  direction: 'horizontal',
  src: 'images/illustration.png',
  title: 'China Diversity & Inclusion (D&I) Melody 彩虹天空 - 渣打中国 D&I 原创主题曲',
  'title-size': 'md',
  'sub-title': 'Valued Behaviours: Better together',
  'sub-title-size': 'xs',
  'text-align': 'center',
  'space-size': 'md',
  selected: true,
};

export const WithoutBorder = Template.bind({});
WithoutBorder.args = {
  'image-position': 'right',
  direction: 'horizontal',
  src: 'images/illustration.png',
  title: 'China Diversity & Inclusion (D&I) Melody 彩虹天空 - 渣打中国 D&I 原创主题曲',
  'title-size': 'md',
  'sub-title': 'Valued Behaviours: Better together',
  'sub-title-size': 'sm',
  'space-size': 'xxs',
  'no-border': true,
  'slot[name=\'footer\']': html`
        <div style='margin-left:15px;margin-bottom:15px'>
        <sc-tag type='primary'>#bettertogether</sc-tag><sc-tag type='primary'>#diversity</sc-tag>
        </div>
    `,
};

export const BackgroundImage = Template.bind({});
BackgroundImage.args = {
  'image-position': 'background',
  direction: 'horizontal',
  src: 'images/pride.png',
  'background-position': '90% -4%',
  'background-repeat': 'no-repeat',
  'background-color': 'cadetblue',
  'slot[name=\'title\']': html`
        <div style='color:#fff'><h4>China Diversity & Inclusion (D&I) Melody 彩虹天空 - 渣打中国 D&I 原创主题曲</h4></div>
    `,
};

export const Clickable = Template.bind({});
Clickable.args = {
  src: 'images/illustration.png',
  direction: 'horizontal',
  title: 'China Diversity & Inclusion (D&I) Melody 彩虹天空 - 渣打中国 D&I 原创主题曲',
  'sub-title': 'Architecture',
  body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`, 
  clickable: true,
};

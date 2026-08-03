import { html, TemplateResult } from 'lit';
import { CARD_SUPPLEMENTARY_ATTRIBUTES, TAG_ATTRIBUTES } from '../src/shared/util.js';
import '@scdevkit/webkit-ext';
import { CountryIconLibrary, MainIconLibrary } from '@scdevkit/icons';

function handleScAction(event: any): void {
  console.log('sc-action triggered:', {
    type: event.detail.type,
    target: event.detail.target,
  });
}

export default {
  title: 'Components/Card/Content Card',
  component: 'sc-content-card',
  parameters: {
    docs: {
      description: {
        component:
            'Content card displays article content, such as icons, title descriptions, and sub-title descriptions, etc.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: { 
      control: 'text',
      description: 'Sets to change the card title.',
      table: {
        type: { summary: 'string' },
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
    href: {
      control: 'text',
      description: 'Sets to change the link URL.',
      table: {
        type: { summary: 'string' },
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
    },
    height: { 
      control: 'text', 
      description: 'The preferred height for the card.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '100%' },
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
    icon: { 
      control: 'text',
      description: 'The preferred icon for card.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },  
    },     
    clickable: {
      control: 'boolean',
      description: 'Set to make the card clickable.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
        category: 'Attributes',
      },
    },
    'no-actions': {
      control: 'boolean',
      description: 'Sets to hide the actions.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    }, 
    actions: {
      control: 'array',
      description: 'Set to customize the actions. <br/> actions=[html`<div>Edit</div>`]',
      table: {
        type: { summary: 'array' },
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
      description: 'Emitted when click on the icon. Get the interacted element by event.detail.target.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
  },
  args: {
    title: '',
    'sub-title': '',
    body: '',
    href: 'https://www.google.com',
    width: '100%',
    height: '100%',
    icon: '',
    'no-actions': false,
    actions: '',
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
    clickable: true,
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
    title?: string;
    'sub-title'?: string;
    body?: string;
    'href'?: string;
    width?: string;
    height?: string;
    icon?: string;
    'no-actions': boolean;
    actions: any[];
    'tags-group'?: TAG_ATTRIBUTES[];
    'supplementary-details': CARD_SUPPLEMENTARY_ATTRIBUTES[];
    'clickable'?: boolean;
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
  <sc-icon-provider .iconLibraries=${[MainIconLibrary, CountryIconLibrary]}>
    <sc-content-card 
      title=${props['title'] as string}
      sub-title=${props['sub-title'] as string}
      body=${props['body']} 
      href=${props['href'] as string}
      icon=${props['icon'] as string}
      .actions=${props.actions} 
      ?no-actions=${props['no-actions']}
      .tagsGroup=${props['tags-group']}
      .supplementaryDetails=${props['supplementary-details']}
      ?clickable=${props['clickable'] as boolean}
      @sc-action=${(e: any) => handleScAction(e)}
    >
    </sc-content-card>
  </sc-icon-provider>
`;

const CusTemplate: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-icon-provider .iconLibraries=${[MainIconLibrary, CountryIconLibrary]}>
    <sc-content-card 
      href=${props['href'] as string}
      icon=${props['icon'] as string}
      .actions=${props.actions} 
      ?no-actions=${props['no-actions']}
      .tagsGroup=${props['tags-group']}
      ?clickable=${props['clickable'] as boolean}
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
            : props['sub-title']}
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
    </sc-content-card>
  </sc-icon-provider>
`;

export const Default = Template.bind({});
Default.args = {
  title: 'How do I name my plugin?',
  'sub-title': 'UX Essentials',
  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  icon: 'file-text--line', 
};

export const Customize = CusTemplate.bind({});
Customize.args = {
  href: '',
  title: 'How do I name my plugin?',
  'sub-title': 'UX Essentials',
  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  icon: '', 
};

export const CustomActions = Template.bind({});
CustomActions.args = {
  title: 'How do I name my plugin?',
  'sub-title': 'UX Essentials',
  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  icon: 'file-text--line',
  actions: [
    html`<div @click=${() => console.log('edit')}>Edit</div>`,
  ],
};

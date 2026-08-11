import { html, TemplateResult } from 'lit';
import { TAG_ATTRIBUTES } from '../src/shared/util.js';
import '@scdevkit/webkit-ext';
import { CountryIconLibrary, MainIconLibrary } from '@scdevkit/icons';

function handleScAction(event: any): void {
  console.log('sc-action triggered:', {
    type: event.detail.type,
    target: event.detail.target,
  });
}

export default {
  title: 'Components/Card/Link Card',
  component: 'sc-link-card',
  parameters: {
    docs: {
      description: {
        component:
            'Link card displays metadata in the link, such as images, URLs, and title descriptions. Clicking on it will redirect you to the page.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
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
    title: { 
      control: 'text',
      description: 'Sets to change the card title.',
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
    'link-text': {
      control: 'text',
      description: 'Sets to change the link text.',
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
    target: {
      control: 'text',
      description: 'Sets to change the link target attribute.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '_blank' },
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
    icon: { 
      control: 'text',
      description: 'The preferred icon for card.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },  
    },     
    'link-icon-name': { 
      control: 'text',
      description: 'The icon for link.',
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
    src: 'images/link-card-bg.png',
    title: '',
    body: '',
    'link-text': 'Link address can go as far as 2 lines if needed Link address can go as far as 2 lines if neededLink address can go as far as 2 lines if needed Link address can go as far as 2 lines if neededLink address can go as far as 2 lines if needed Link address can go as far as 2 lines if neededLink address can go as far as 2 lines if needed Link address can go as far as 2 lines if neededLink address can go as far as 2 lines if needed Link address can go as far as 2 lines if neededLink address can go as far as 2 lines if needed Link address can go as far as 2 lines if neededLink address can go as far as 2 lines if needed Link address can go as far as 2 lines if neededLink address can go as far as 2 lines if needed Link address can go as far as 2 lines if neededLink address can go as far as 2 lines if needed Link address can go as far as 2 lines if neededLink address can go as far as 2 lines if needed Link address can go as far as 2 lines if needed',
    href: 'https://www.google.com',
    target: '_blank',
    width: '100%',
    height: '100%',
    icon: '',
    'link-icon-name': 'link-alt',
    'no-actions': false,
    actions: '',
    'tags-group': [
      { type: 'red', iconName: 'alert-circle--line', content: 'High risk' },
      { type: 'amber', iconName: 'alert-triangle--line', content: 'Pending approval' },
      { type: 'primary', iconName: 'info-circle--line', content: 'Information' },
    ],
    clickable: true,
    'slot[name=\'header\']': '',    
    'slot[name=\'footer\']': '',    
    'slot[name=\'prefix\']': '',    
    'slot[name=\'suffix\']': '',    
    'slot[name=\'title\']': '',    
    'slot[name=\'body\']': '',  
    slot: '', 
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
}

interface ArgTypes {
    direction?:string;
    'src'?: string;
    title?: string;
    body?: string;
    'link-text'?: string;
    'href'?: string;
    'target'?: string;
    width?: string;
    height?: string;
    icon?: string;
    'link-icon-name'?: string;
    'no-actions': boolean;
    actions: any[];
    'tags-group'?: TAG_ATTRIBUTES[];
    'clickable'?: boolean;
    'slot[name=\'header\']'?: TemplateResult;    
    'slot[name=\'footer\']'?: TemplateResult; 
    'slot[name=\'prefix\']'?: TemplateResult;
    'slot[name=\'suffix\']'?: TemplateResult;
    'slot[name=\'title\']'?: TemplateResult;
    'slot[name=\'body\']'?: TemplateResult;
    slot?: TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-icon-provider .iconLibraries=${[MainIconLibrary, CountryIconLibrary]}>
    <sc-link-card 
      style="--sc-link-card-image-width:${props.direction === 'vertical' ? '100%' : '18.75rem'};--sc-link-card-image-height:12.25rem;"
      title=${props['title'] as string}
      body=${props['body']} 
      link-text=${props['link-text'] as string}
      href=${props['href'] as string}
      target=${props['target'] as string}
      direction=${props['direction']}
      src=${props['src']}
      icon=${props['icon'] as string}
      link-icon-name=${props['link-icon-name'] as string}
      .actions=${props.actions} 
      ?no-actions=${props['no-actions']}
      .tagsGroup=${props['tags-group']}
      ?clickable=${props['clickable'] as boolean}
      @sc-action=${(e: any) => handleScAction(e)}
    >
    </sc-link-card>
  </sc-icon-provider>
`;

const CusTemplate: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-icon-provider .iconLibraries=${[MainIconLibrary, CountryIconLibrary]}>
    <sc-link-card 
      style="--sc-link-card-image-width:${props.direction === 'vertical' ? '100%' : '18.75rem'};--sc-link-card-image-height:12.25rem;"
      link-text=${props['link-text'] as string}
      href=${props['href'] as string}
      target=${props['target'] as string}
      direction=${props['direction']}
      src=${props['src']}
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
    </sc-link-card>
  </sc-icon-provider>
`;

export const Default = Template.bind({});
Default.args = {
  direction: 'horizontal',
  src: 'images/link-card-bg.png',
  title: 'Getting started',
  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  height: '100%',
};

export const Direction = Template.bind({});
Direction.args = {
  direction: 'vertical',
  src: 'images/link-card-bg.png',
  title: 'Getting started',
  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  height: 'auto',
};

export const Icon = Template.bind({});
Icon.args = {
  direction: 'horizontal',
  src: '',
  title: 'Getting started',
  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  icon: 'file-text--line', 
  'link-icon-name': 'newwindow',
};

export const Customize = CusTemplate.bind({});
Customize.args = {
  direction: 'horizontal',
  src: '',
  href: '',
  title: 'Getting started',
  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  icon: '', 
};

export const CustomActions = Template.bind({});
CustomActions.args = {
  direction: 'horizontal',
  src: 'images/link-card-bg.png',
  title: 'Getting started',
  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  height: '100%',
  actions: [
    html`<div @click=${() => console.log('edit')}>Edit</div>`,
  ],
};

import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/List Item',
  component: 'sc-list-item',
  parameters: {
    docs: {
      description: {
        component:
          'List item show a single item containing title and body and allow additional customization via slot.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Sets to change the list title.',
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
    'title-line': { 
      control: 'number', 
      description: 'Sets the number of line to show before it gets truncated.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 0 },
        category: 'Attributes',
      }, 
    },
    body: {
      control: 'text',
      description: 'Sets to change the body text.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'body-line': { 
      control: 'number', 
      description: 'Sets the number of line to show before it gets truncated.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 0 },
        category: 'Attributes',
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
  },
  args: {
    title: '',
    'title-size': 'sm',
    'title-line': 0,
    body: '',
    'body-line': 0,
    'slot[name=\'title\']': '',    
    'slot[name=\'body\']': '',  
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
}

interface ArgTypes {
  title?: string;
  'title-size'?: string;
  'title-line'?: string;
  body?: string;
  'body-line'?: string;
  'slot[name=\'title\']'?: TemplateResult;
  'slot[name=\'body\']'?: TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) =>
  html`
    <sc-list-item 
      title-size=${props['title-size']}
      title-line=${props['title-line']}
      body-line=${props['body-line']}
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
    </sc-list-item>
  `;

export const Default = Template.bind({});
Default.args = {
  title: `SCB Singapore, in partnership with Singapore Management University’s Lien Centre 
    for Social Innovation`,
  body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
    incididunt ut labore et dolore magna aliqua`,
};

export const TitleSize = Template.bind({});
TitleSize.args = {
  title: `SCB Singapore, in partnership with Singapore Management University’s Lien Centre 
    for Social Innovation`,
  'title-size': 'lg',
  body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
     incididunt ut labore et dolore magna aliqua`,  
};

export const TitleOnly = Template.bind({});
TitleOnly.args = {
  title: `SCB Singapore, in partnership with Singapore Management University’s Lien Centre 
    for Social Innovation`,
  'title-size': 'md',
};

export const TruncateLine = Template.bind({});
TruncateLine.args = {
  title: `SCB Singapore, in partnership with Singapore Management University’s Lien Centre 
    for Social Innovation`,
  'title-line': '1',
  body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
     incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, 
     consectetur adipiscing elit, sed do eiusmod tempor
     incididunt ut labore et dolore magna aliqua`,  
  'body-line': '1',
};
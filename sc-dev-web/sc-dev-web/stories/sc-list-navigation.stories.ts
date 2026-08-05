import { html, TemplateResult } from 'lit';

const items = [
  {
    key: '1',
    title: 'Menu 1',
    body: 'Menu body 1',
  }, {
    key: '2',
    title: 'Menu 2',
    body: 'Menu body 2',
    children: [
      {
        key: '2-1',
        title: 'Menu 2-1',
        titleLine: 0,
        body: 'Menu body 2-1',
        selected: true,
      }, 
      {
        key: '2-2',
        title: 'Menu 2-2',
        body: 'Menu body 2-2',
        children: [
          {
            key: '2-2-1',
            title: 'Menu 2-2-1',
            body: 'Menu body 2-2-1',
          },  
        ],
      }, 
    ],
  }, {
    key: '3',
    title: 'Menu 3',
    body: 'Menu body 3',
  }, 
];

const disabledItems = [
  {
    key: '1',
    title: 'Menu 1',
    body: 'Menu body 1',
  }, {
    key: '2',
    title: 'Menu 2',
    body: 'Menu body 2',
    children: [
      {
        key: '2-1',
        title: 'Menu 2-1',
        titleLine: 0,
        body: 'Menu body 2-1',
        selected: true,
        disabled: true,
      }, 
    ],
  }, {
    key: '3',
    title: 'Menu 3',
    body: 'Menu body 3',
    disabled: true,
  }, 
];

export default {
  title: 'Components/List Navigation/List Navigation',
  component: 'sc-list-navigation',
  parameters: {
    docs: {
      description: {
        component:
          `List navigation present information in a concise, 
          easy-to-follow format through a continuous, vertical index of text or images.`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    'space-size': {
      control: 'inline-radio',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'none'],
      description: 'Sets to change the spacing.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'none' },
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
    'body-line': {
      control: 'number',
      description: 'Sets the number of line to show before it gets truncated.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 0 },
        category: 'Attributes',
      },
    },
    box: { 
      control: 'boolean',
      description: 'Sets to show list navigation in box.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },  
    },
    items: {
      control: 'array',
      description: `Set to render navigation items. If the navigation has only one category,
      can render the navigation items by slot, if has multiple categories, please use this.`,
      table: {
        type: { summary: 'array' },
        category: 'Attributes',
      },
    },
    searchable: { 
      control: 'boolean',
      description: 'Sets to show search field.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },  
    },
    'show-right-arrow': { 
      control: 'boolean',
      description: 'Sets to show the right arrow for each list item.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },  
    },
    'no-border': { 
      control: 'boolean',
      description: 'Sets to show the border for each list item.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },  
    },
    radius: {
      control: 'inline-radio',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'none'],
      description: 'Sets to change the box radius.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'none' },
        category: 'Attributes',
      }, 
      if: { arg: 'box', eq: true },
    },
    'sc-select': {
      description: 'Emitted when select the item. Get the selected keys by event.detail.selectedKeys',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
  },
  args: {
    items,
    'space-size': 'none',
    box: false,
    searchable: false,
    'show-right-arrow': false,
    'no-border': false,
    radius: 'xxs',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  'space-size'?: string;
  items?: any[];
  box?: boolean;
  searchable?: boolean;
  'show-right-arrow'?: boolean;
  'no-border'?: boolean;
  'title-line'?: string;
  'body-line'?: string;
  radius?: string;  
}

const Template: Story<ArgTypes> = (props: ArgTypes) =>
  html`
    <sc-list-navigation
      space-size=${props['space-size']}
      radius=${props['radius']}
      ?box=${props['box']}
      title-line=${props['title-line']}
      body-line=${props['body-line']}
    >
      <sc-list-navigation-item href='#' title='Downtime' body='Off'>
      </sc-list-navigation-item>
      <sc-list-navigation-item href='#' title='App Limits' body='Set time limits for apps'>
      </sc-list-navigation-item>
      <sc-list-navigation-item href='#' title='Always Allowed' body='Choose apps to allow at all times'>
      </sc-list-navigation-item>
    </sc-list-navigation>
  `;

const CategoryTemplate: Story<ArgTypes> = (props: ArgTypes) =>
  html`
    <sc-list-navigation
      space-size=${props['space-size']}
      radius=${props['radius']}
      ?box=${props['box']}
      ?searchable=${props.searchable}
      ?show-right-arrow=${props['show-right-arrow']}
      ?no-border=${props['no-border']}
      .items=${props.items}
      title-line=${props['title-line']}
      body-line=${props['body-line']}
    >
    </sc-list-navigation>
  `;


const IconTemplate: Story<ArgTypes> = ({}: ArgTypes) =>
  html`
    <sc-list-navigation>
      <sc-list-navigation-item href='#' title='Downtime' body='Off' prefix='checkmark-circle--line' selected>
      </sc-list-navigation-item>
      <sc-list-navigation-item href='#' title='App Limits' body='Set time limits for apps' prefix='info-circle--line'>
      </sc-list-navigation-item>
      <sc-list-navigation-item href='#' title='Always Allowed' body='Choose apps to allow at all times' 
        prefix='alert-triangle--line'
      >
      </sc-list-navigation-item>
    </sc-list-navigation>
  `;

export const Default = CategoryTemplate.bind({});
Default.args = {
  items,
};

export const Searchable = CategoryTemplate.bind({});
Searchable.args = {
  searchable: true,
};

export const SingleCategory = CategoryTemplate.bind({});
SingleCategory.args = {
  items: JSON.parse(JSON.stringify(items)).map((i: any) => { i.children = []; return i; }),
};

export const TitleOnly = CategoryTemplate.bind({});
TitleOnly.args = {
  items: [{
    key: '1',
    title: 'Menu 1',
  }, {
    key: '2',
    title: 'Menu 2',
    children: [
      {
        key: '2-1',
        title: 'Menu 2-1',
        selected: true,
      }, 
      {
        key: '2-2',
        title: 'Menu 2-2',
        children: [
          {
            key: '2-2-1',
            title: 'Menu 2-2-1',
          },  
        ],
      }, 
    ],
  }],
};

export const ShowRightArrow = CategoryTemplate.bind({});
ShowRightArrow.args = {
  items: JSON.parse(JSON.stringify(items)).map((i: any) => { i.children = []; return i; }),
  'show-right-arrow': true,
};

export const NoBorder = CategoryTemplate.bind({});
NoBorder.args = {
  items: JSON.parse(JSON.stringify(items)).map((i: any) => { i.children = []; return i; }),
  'no-border': true,
};

export const WithPrefixIcon = CategoryTemplate.bind({});
WithPrefixIcon.args = {
  items: JSON.parse(JSON.stringify(items)).map((i: any) => { i.prefix = 'home--line'; return i; }),
};

export const WithSuffixIcon = CategoryTemplate.bind({});
WithSuffixIcon.args = {
  items: JSON.parse(JSON.stringify(items)).map((i: any) => { i.suffix = 'home--line'; return i; }),
};

export const DefaultSlot = IconTemplate.bind({});
DefaultSlot.args = {};

export const Box = Template.bind({});
Box.args = {
  box: true,
  'space-size': 'md',
};

export const Disabled = CategoryTemplate.bind({});
Disabled.args = {
  items: disabledItems,
};
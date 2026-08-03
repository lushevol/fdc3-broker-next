import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/List Navigation/List Navigation Item',
  component: 'sc-list-navigation-item',
  parameters: {
    docs: {
      description: {
        component:
          `List navigation item show a single item containing
          title and body and allow additional customization via slot.`,
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
    selected: {
      control: 'boolean',
      description: 'Sets to show the list item as selected state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    prefix: {
      control: 'text',
      description: 'Sets to change the prefix.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    suffix: {
      control: 'text',
      description: 'Sets to change the suffix icon.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'arrow-ios-forward' },
        category: 'Attributes',
      },
    },
    'no-suffix': {
      control: 'boolean',
      description: 'Sets to show or hide suffix icon.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    href: {
      control: 'text',
      description: 'Sets to change the navigation URL.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'no-border': {
      control: 'boolean',
      description: 'Sets to show the list item without border.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Sets to show the disabled list item.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
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
    'sc-action': {
      description: 'Emitted when click the list navigation item. Get the interacted element by event.detail.target.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
  },
  args: {
    title: '',
    'title-size': 'sm',
    'title-line': 0,
    body: '',
    'body-line': 0,
    selected: false,
    'no-border': false,
    disabled: false,
    href: '',
    prefix: '',
    suffix: 'arrow-ios-forward',
    'no-suffix': false,
    'slot[name=\'prefix\']': '',
    'slot[name=\'suffix\']': '',
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
    selected?: boolean;
    disabled?: boolean;
    'no-border'?: boolean;
    'prefix'?: string;
    'suffix'?: string;
    'no-suffix'?: boolean;
    href?: string;
    'slot[name=\'prefix\']'?: TemplateResult;
    'slot[name=\'suffix\']'?: TemplateResult;
    'slot[name=\'title\']'?: TemplateResult;
    'slot[name=\'body\']'?: TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) =>
  html`
        <sc-list-navigation-item
            title-size=${props['title-size']}
            title-line=${props['title-line']}
            body-line=${props['body-line']}
            ?selected=${props['selected']}
            ?disabled=${props['disabled']}
            ?no-border=${props['no-border']}
            prefix=${props['prefix']}
            suffix=${props['suffix']}
            ?no-suffix=${props['no-suffix']}
            href=${props['href']}
        >
            <div slot="prefix">
                ${props['slot[name=\'prefix\']']
    ? props['slot[name=\'prefix\']']
    : props.prefix
}
            </div>
            <div slot="suffix">
                ${props['slot[name=\'suffix\']']
    ? props['slot[name=\'suffix\']']
    : props.suffix
}
            </div>
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
        </sc-list-navigation-item>
    `;

export const Default = Template.bind({});
Default.args = {
  title: `SCB Singapore, in partnership with Singapore Management University’s Lien Centre
        for Social Innovation`,
  body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua`,
};

export const Selected = Template.bind({});
Selected.args = {
  title: `SCB Singapore, in partnership with Singapore Management University’s Lien Centre
        for Social Innovation`,
  body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua`,
  selected: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  title: `SCB Singapore, in partnership with Singapore Management University’s Lien Centre
        for Social Innovation`,
  body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua`,
  disabled: true,
};

export const TitleSize = Template.bind({});
TitleSize.args = {
  title: `SCB Singapore, in partnership with Singapore Management University’s Lien Centre
        for Social Innovation`,
  'title-size': 'md',
  body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua`,
  prefix: 'info-circle--line',
};

export const NoArrow = Template.bind({});
NoArrow.args = {
  title: `SCB Singapore, in partnership with Singapore Management University’s Lien Centre
        for Social Innovation`,
  'title-size': 'md',
  body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua`,
  prefix: 'info-circle--line',
  'no-suffix': true,
};


export const TruncateLine = Template.bind({});
TruncateLine.args = {
  title: `SCB Singapore, in partnership with Singapore Management University’s Lien Centre
        for Social Innovation`,
  'title-size': 'md',
  'title-line': '1',
  body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
     incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet,
     consectetur adipiscing elit, sed do eiusmod tempor
     incididunt ut labore et dolore magna aliqua`,
  'body-line': '1',
  prefix: 'info-circle--line',
};

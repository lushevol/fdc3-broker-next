import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Banner',
  component: 'sc-banner',
  parameters: {
    docs: {
      description: {
        component:
          'Banner is used to display information to the user along with some visual illustration.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Sets to change the banner title.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    body: {
      control: 'text',
      description: 'Sets to change the banner body.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'title-size': {
      control: 'inline-radio',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'The preferrred title size',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'lg' },
        category: 'Attributes',
      },
    },
    'body-size': {
      control: 'inline-radio',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'The preferrred body size',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'xs' },
        category: 'Attributes',
      },
    },
    'space-size': {
      control: 'inline-radio',
      options: ['xxs', 'xs', 'sm', 'md', 'lg'],
      description: 'Sets to change the banner spacing.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
        category: 'Attributes',
      },
    },
    'background-color': {
      control: 'inline-radio',
      description: 'Sets to change the banner background color.',
      options: ['prosper-blue', 'alt-blue', 'light-blue', 'white'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'prosper-blue' },
        category: 'Attributes',
      },
    },
    'text-alignment': {
      control: 'inline-radio',
      options: ['left', 'center', 'right', 'justify'],
      description: 'The preferred alignment of the title and description.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'left' },
        category: 'Attributes',
      },
    },
    'image-src': {
      control: 'text',
      description: 'Sets to show a image at the right of banner.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'image-position': {
      control: 'inline-radio',
      options: ['left', 'right', 'background'],
      description: 'Sets to show the image at the right or left of banner.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'right' },
        category: 'Attributes',
      },
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
    'border-radius': {
      control: 'inline-radio',
      description: 'Set border radius(rem) of the banner.',
      options: ['none', 'sm'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'sm' },
        category: 'Attributes',
      },
    },
    closable: {
      control: 'boolean',
      description: 'Set to allow the banner to be closable.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    trustpoint: {
      control: 'boolean',
      description: 'Sets to show the title with trustpoint style.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'title-size', eq: 'xl' },
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
      description: 'Sets to customize the description.',
      table: {
        category: 'Slots',
      },
    },
  },
  args: {
    title: '',
    body: '',
    'title-size': 'lg',
    'body-size': 'xs',
    'space-size': 'md',
    'background-color': 'prosper-blue',
    'text-alignment': 'left',
    'image-src': '',
    'image-position': 'right',
    'background-position': 'right 1rem center',
    'background-repeat': 'no-repeat',
    'background-size': '30%',
    'border-radius': 'small',
    closable: false,
    trustpoint: false,
    'slot[name=\'title\']': '',
    'slot[name=\'body\']': '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  title?: string;
  body?: string;
  'title-size': string;
  'body-size': string;
  'space-size'?: string;
  'background-color'?: string,
  'text-alignment'?: string,
  'image-src'?: string,
  'image-position'?: string,
  'background-position'?:string;
  'background-repeat'?: string;
  'background-size'?: string;
  'border-radius'?: string,
  closable?: boolean,
  trustpoint?: boolean,
  'slot[name=\'title\']'?: TemplateResult,
  'slot[name=\'body\']'?: TemplateResult,
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-banner
    title-size=${props['title-size']}
    body-size=${props['body-size']}
    space-size=${props['space-size']}
    background-color=${props['background-color']}
    text-alignment=${props['text-alignment']}
    image-src=${props['image-src']}
    image-position=${props['image-position']}
    ?closable=${props['closable']}
    ?trustpoint=${props['trustpoint']}
    background-position=${props['background-position']}
    background-repeat=${props['background-repeat']}
    background-size=${props['background-size']}
    border-radius=${props['border-radius']}
  >
    <div slot="title">
      ${props.title
    ? props.title
    : props['slot[name=\'title\']']
}
    </div>
    <div slot="body">
      ${props.body
    ? props.body
    : props['slot[name=\'body\']']
}
    </div>
  </sc-banner>
`;

export const Default = Template.bind({});
Default.args = {
  'slot[name=\'title\']': html`
  Lorem ipsum dolor sit amet, consectetur adipiscing elit 
    – sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  `,
  'slot[name=\'body\']': html`
    <div style="display: flex; align-items: center;">
    More information here
    </div>
  `,
  'background-color': 'prosper-blue',
  'image-src': 'images/presentation.svg',
};

export const Closable = Template.bind({});
Closable.args = {
  'slot[name=\'title\']': html`
  Lorem ipsum dolor sit amet, consectetur adipiscing elit 
    <span style="color: var(--sc-color-grey-650);">– sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
  `,
  'slot[name=\'body\']': html`
    <div style="display: flex; color: var(--sc-color-blue-500); align-items: center;">
    More information here
    </div>
  `,
  'background-color': 'white',
  'image-src': 'images/presentation.svg',
  closable: true,
};

export const WithoutImage = Template.bind({});
WithoutImage.args = {
  'slot[name=\'title\']': html`
  Lorem ipsum dolor sit amet, consectetur adipiscing elit 
    <span style="color: var(--sc-color-grey-650);">– sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
  `,
  'slot[name=\'body\']': html`
    <div style="display: flex; color: var(--sc-color-blue-500); align-items: center;">
    More information here
    </div>
  `,
  'background-color': 'white',
  'image-src': '',
};

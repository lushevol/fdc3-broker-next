import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Divider',
  component: 'sc-divider',
  parameters: {
    docs: {
      description: {
        component: 'Divider are used to visually separate or group elements.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xxs', 'xs', 'sm', 'md', 'lg'],
      description: 'The preferred size of the divider.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'xxs' },
        category: 'Attributes',
      },
    },
    mode: {
      control: 'inline-radio',
      options: ['default', 'filled', 'card-header'],
      description: 'The preferred mode of the divider.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Attributes',
      },
    },
    compact: {
      control: 'boolean',
      description: 'Draws the divider without margin.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'line-width': {
      control: 'inline-radio',
      options: ['xxs', 'xs', 'sm', 'md', 'lg'],
      description: 'The preferred line width of the divider.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'xxs' },
        category: 'Attributes',
      },
    },
    'line-height': {
      control: 'inline-radio',
      options: ['xxs', 'xs', 'sm', 'md', 'lg'],
      description: 'The preferred lie height of the divider.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'xxs' },
        category: 'Attributes',
      },
      if: { arg: 'vertical', eq: false },
    },
    'text-align': {
      control: 'inline-radio',
      options: ['left', 'center', 'right'],
      description: 'The preferred text alignment of the divider.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'center' },
        category: 'Attributes',
      },
      if: { arg: 'vertical', eq: true },
    },
    vertical: {
      control: 'boolean',
      description: 'Draws the divider in a vertical orientation.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    title: {
      control: 'text',
      description: 'Set the label of the divider.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
      if: { arg: 'mode', neq: 'filled' },
    },   
    'card-number': {
      control: 'number',
      description: 'Add a front number to the card header.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
      if: { arg: 'mode', eq: 'card-header' },
    },  
    'optional-text': {
      control: 'boolean',
      description: 'Show an \'(optional)\' text on the card header.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'mode', eq: 'card-header' },
    },  
    'slot[name=\'title\']': {
      control: 'text',
      description: 'Set to customize the content.',
      table: {
        category: 'Slots',
      }, 
      if: { arg: 'mode', neq: 'filled' },
    },
  },
  args: {
    size: 'xxs',
    mode: 'default',
    compact: false,
    'line-width': 'xxs',
    'line-height': 'xxs',
    'text-align': 'left',
    vertical: true,
    title: '',
    'card-number': null,
    'optional-text': false,
    'slot[name=\'title\']': '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  size?: string;
  mode?: string;
  compact?: boolean;
  'line-width'?: string;
  'line-height'?: string;
  'text-align'?: string;
  vertical?: boolean;
  title?: string;
  'card-number'?: number;
  'optional-text'?: boolean;
  'slot[name=\'title\']'?: TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  ${props.mode === 'default' ? html`
  <sc-divider 
  title=${props.title}
  size=${props.size}
  line-width=${props['line-width']}
  line-height=${props['line-height']}
  text-align=${props['text-align']}
  ?vertical=${props.vertical}
  ?compact=${props.compact}
  >
</sc-divider>` : ''}  
  ${props.mode === 'filled' ? html`
  <sc-divider 
    mode='filled'
    line-width=${props['line-width']}
    line-height=${props['line-height']}
    ></sc-divider>
  ` : ''}
  ${props.mode === 'card-header' ? html`
  <sc-divider 
    mode='card-header'
    card-number=${props['card-number']} 
    ?optional-text=${props['optional-text']}>
    <div slot="title" style="font-weight: 500">Sample content</div>
  </sc-divider>` : ''}
`;

const LineDividerTemplate: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-divider 
    title=${props.title}
    size=${props.size}
    line-width=${props['line-width']}
    line-height=${props['line-height']}
    text-align=${props['text-align']}
    ?vertical=${props.vertical}
    ?compact=${props.compact}
    >
  </sc-divider>
`;

export const Default = Template.bind({});
Default.args = {
  vertical: true,
};

export const CardHeader = Template.bind({});
CardHeader.args = {
  mode: 'card-header',
  'card-number': 9,
  'optional-text': true,  
};

export const TextDivider = Template.bind({});
TextDivider.args = {
  'text-align': 'left',
  size: 'xs',
  'line-width': 'xs',
  compact: true,
  vertical: true,
};

export const FilledDivider = Template.bind({});
FilledDivider.args = {
  mode: 'filled',
};

export const LineDivider = LineDividerTemplate.bind({});
LineDivider.args = {
  vertical: true,
  size: '',
};

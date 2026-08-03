import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Spinner',
  component: 'sc-spinner',
  parameters: {
    docs: {
      description: {
        component:
          'Spinners are used to show the progress of a determinate operation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['component', 'page'],
      description: 'Sets the preferred type of the spinner.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'component' },
        category: 'Attributes',
      },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Sets the size of component spinner.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'sm' },
        category: 'Attributes',
      },
    },
    color: {
      control: 'inline-radio',
      options: ['blue', 'white'],
      description: 'Sets the color of component spinner.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'blue' },
        category: 'Attributes',
      },
      if: { arg: 'type', eq: 'component' },
    },
    message: {
      control: 'text',
      description: 'Defines the text content displayed with spinner.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'Attributes',
      },
    },
    'slot[name=\'message\']': {
      control: 'text',
      description: 'Defines the text message displayed with spinner.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'Slots',
      },
    },
  },
  args: {
    type: 'component',
    size: 'sm',
    color: 'blue',
    'slot[name=\'message\']': '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  type?: string;
  size?: string;
  color?: string;
  message?: string;
  'slot[name=\'message\']': TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <div style="text-align:center">
    <sc-spinner
      type=${props.type || 'sm'}
      size=${props.size || 'component'}
      color=${props.color || 'blue'}
      message=${props.message || ''}
    >
    ${props['slot[name=\'message\']']
    ? html`<div slot="message">${props['slot[name=\'message\']']}</div>`
    : ''}
    </sc-spinner>
  </div>
`;

export const Component = Template.bind({});
Component.args = {
  size: 'sm',
};

export const ComponentWhite = Template.bind({});
ComponentWhite.args = {
  size: 'sm',
  color: 'white',
};

export const Page = Template.bind({});
Page.args = {
  type: 'page',
};

export const Message = Template.bind({});
Message.args = {
  type: 'page',
  message: 'Please wait content is loading...',
};

import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Typography/Paragraph',
  component: 'sc-paragraph',
  parameters: {
    docs: {
      description: {
        component:
          'Used to display the paragraph in page.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Set different size of paragraph.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'md' },
        category: 'Attributes',
      },
    },
    ellipsis: {
      control: 'boolean',
      description: 'Display ellipsis when text overflows.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    rows: { 
      control: 'number',
      description: 'Sets to show the text rows if ellipsis equal true.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 1 },
        category: 'Attributes',
      },
      if: { arg: 'ellipsis', eq: true }, 
    },
    slot: {
      control: 'text',
      description: 'The paragraph content.',
      table: {
        category: 'Slots',
      }, 
    },
  },
  args: {
    size: 'md',
    ellipsis: false,
    rows: 1,
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  size: string,
  ellipsis?: boolean,
  rows?: number,
  slot?: TemplateResult;
}

const Template: Story<ArgTypes> = ({ 
  size = 'md',
  ellipsis = false,
  rows = 1,
  slot,
}: ArgTypes) =>
  html`
    <sc-paragraph 
      size=${size}
      ?ellipsis=${ellipsis}
      rows=${rows}
    >
      ${slot || `Lorem ipsum dolor sit amet, 
      consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`}
    </sc-paragraph> 
  `;

export const Default = Template.bind({});
Default.args = {};

export const Ellipsis = Template.bind({});
Ellipsis.args = {
  ellipsis: true,
};

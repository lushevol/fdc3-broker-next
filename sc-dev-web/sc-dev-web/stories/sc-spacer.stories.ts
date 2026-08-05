import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Spacer',
  component: 'sc-spacer',
  parameters: {
    docs: {
      description: {
        component:
          'Spacer are used to create some white-space between elements.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    vertical: {
      control: 'boolean',
      description: 'Draws the spacer in a vertical orientation.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    size: {
      control: 'inline-radio',
      description: 'Set the size of the spacer.',
      options: ['04', '08', '12', '16', '20', '24', '32', '40', '48', '56', '64'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '04' },
        category: 'Attributes',
      },
    },
  },
  args: {
    vertical: false,
    size: '04',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  vertical?: boolean;
  size?: string;
}

const Template: Story<ArgTypes> = ({
  vertical = false,
  size = '04',
}: ArgTypes) =>
  html`
    Content 1
    <sc-spacer size=${size} ?vertical=${vertical}></sc-spacer>
    Content 2
    <sc-spacer size=${size} ?vertical=${vertical}></sc-spacer>
    Content 3
  `;

export const Default = Template.bind({});
Default.args = {
  vertical: false,
  size: '04',
};

export const Horizontal = Template.bind({});
Horizontal.args = {
  vertical: false,
  size: '16',
};

export const Vertical = Template.bind({});
Vertical.args = {
  vertical: true,
  size: '16',
};

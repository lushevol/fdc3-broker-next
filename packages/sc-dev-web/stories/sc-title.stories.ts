import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Typography/Title',
  component: 'sc-title',
  parameters: {
    docs: {
      description: {
        component:
          'Used to display the title in page.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: 'inline-radio',
      options: [1, 2, 3, 4, 5, 6],
      description: 'Set content importance. Match with h1, h2, h3, h4, h5 h6.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 1 },
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
    hero: { 
      control: 'boolean',
      description: 'Set to show the hero title.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    slot: {
      control: 'text',
      description: 'The title content.',
      table: {
        category: 'Slots',
      }, 
    },
  },
  args: {
    level: 1,
    ellipsis: false,
    rows: 1,
    hero: false,
    slot: '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  level: number,
  ellipsis?: boolean,
  rows?: number,
  hero?: boolean,
  slot?: TemplateResult;
}

const Template: Story<ArgTypes> = ({ 
  level = 1,
  ellipsis = false,
  rows = 1,
  hero = false,
  slot,
}: ArgTypes) =>
  html`
    <sc-title 
      level=${level}
      ?ellipsis=${ellipsis}
      rows=${rows}
      ?hero=${hero}      
    >
      ${slot || `This is the title${level}`}
    </sc-title> 
  `;

export const Default = Template.bind({});
Default.args = {};

export const HeroTitle = Template.bind({});
HeroTitle.args = {
  hero: true,
};

export const Ellipsis = Template.bind({});
Ellipsis.args = {
  ellipsis: true,
  rows: 2,
  slot: html`This is the quite long long long long long long long 
  long long long long long long long long long long long long long title`,
};

import { html, TemplateResult } from 'lit';
import { truncateArgType } from './utils/ArgTypes.js';

export default {
  title: 'Components/Link',
  component: 'sc-link',
  parameters: {
    docs: {
      description: {
        component:
          'Links are used as navigational elements and can be used on their own or inline with text.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    href: {
      control: 'text',
      description: 'URL to navigate to.',
      table: {
        type: { summary: 'text' },
        category: 'Attributes',
      },
    },   
    block: {
      control: 'boolean',
      description: 'Sets to render link as block.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },  
    inverse: {
      control: 'boolean',
      description: 'Sets link UI mode to inverse.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },  
    disabled: {
      control: 'boolean',
      description: 'Sets to disabled the link.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    target: {
      control: 'text',
      description: 'Link target',
      table: {
        type: { summary: 'text' },
        defaultValue: { summary: '_self' },
        category: 'Attributes',
      },
    },
    ...truncateArgType({ if: { arg: 'block', eq: true } }),
    slot: {
      control: 'text',
      description: 'Button text',
      table: {
        type: { summary: 'string' },
        category: 'Slots',
      },
    },
  },
  args: {
    href: '',
    block: false,
    inverse: false,
    disabled: false,
    target: '_self',
    truncate: false,
    slot: '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  href?: string;
  block?: boolean;
  inverse?: boolean;
  disabled?: boolean;
  truncate?: boolean;
  target?: string;
  slot?: TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) =>
  html`
    <div style="
      padding: 10px;
      background-color:${props.inverse ? '#525355' : 'transparent'};
      color:${props.inverse ? '#fff' : 'var(--sc-color-blue-900)'};
    ">
      Lorem ipsum dolor
      <sc-link 
        href=${props.href}
        ?block=${props.block} 
        ?inverse=${props.inverse} 
        ?disabled=${props.disabled} 
        ?truncate=${props.truncate} 
        target=${props.target} 
      >
        ${props.slot}
      </sc-link>
      consectetur adipiscing elit.
    </div>
  `;

export const Default = Template.bind({});
Default.args = {
  slot: html`Link`,
};

export const Block = Template.bind({});
Block.args = {
  block: true,
  slot: html`Link`,
};

export const Inverse = Template.bind({});
Inverse.args = {
  inverse: true,
  slot: html`Link`,
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  slot: html`Link`,
};

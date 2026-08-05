import { html, TemplateResult } from 'lit';
import { truncateArgType } from './utils/ArgTypes.js';

export default {
  title: 'Components/Bottom Navbar',
  component: 'sc-bottom-navbar',
  parameters: {
    docs: {
      description: {
        component:
          `Bottom navbar display two to five destinations at the bottom of a screen. 
          Each destination is represented by an icon and text label.`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    ...truncateArgType(),
    slot: {
      control: 'text',
      description: 'Sets to customize content.',
      table: {
        category: 'Slots',
      }, 
    },
    'sc-select': {
      description: 'Emitted when one of the item is selected.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
  },
  args: {  
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  truncate?: boolean;
  slot?: TemplateResult;  
}

const Template: Story<ArgTypes> = (props: ArgTypes) => {
  return html` 
    <sc-bottom-navbar ?truncate=${props.truncate}>
        ${props.slot} 
    </sc-bottom-navbar>
  `;
};

export const Default = Template.bind({});
Default.args = {
  slot: html`
    <sc-navbar-item name="home" label="Home" icon="home--line" active-icon="home--fill" active></sc-navbar-item>
    <sc-navbar-item name="search" label="Search" icon="search"></sc-navbar-item>
    `,
};

export const WithBadge = Template.bind({});
WithBadge.args = {
  slot: html`
    <sc-navbar-item name="home" label="Home" icon="home--line" active-icon="home--fill" active badge></sc-navbar-item>
    <sc-navbar-item name="search" label="Search" icon="search" badge="123"></sc-navbar-item>
    `,
};


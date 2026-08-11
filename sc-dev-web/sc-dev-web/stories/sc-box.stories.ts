import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Box',
  component: 'sc-box',
  parameters: {
    docs: {
      description: {
        component:
          'The Box component is a generic container for grouping other components.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    view: {
      control: 'inline-radio',
      description: 'Sets the preferred box view.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Attributes',
      },
      options: ['default', 'outline'],
    },
    type: {
      control: 'inline-radio',
      description: 'Sets the preferred box type.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Attributes',
      },
      options: ['default', 'info', 'success', 'warning', 'error', 'disabled', 'transparent'],
    },
    'space-size': {
      control: 'inline-radio',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'none'],
      description: 'The preferred space size for box.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'sm' },
        category: 'Attributes',
      },      
    },
    radius: {
      control: 'inline-radio',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'none'],
      description: 'The preferred radius of box.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'sm' },
        category: 'Attributes',
      },      
    },
    height: {
      control: 'text',
      description: 'The preferred height for the box.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'auto' },
        category: 'Attributes',
      },
    },
    slot: {
      control: 'text',
      description: 'Sets to customize content.',
      table: {
        category: 'Slots',
      }, 
    },
  },
  args: {
    view: 'default',
    type: 'default',
    'space-size': 'sm',
    radius: 'sm',
    height: 'auto',
    slot: '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  view: string;
  type: string;
  radius: string;
  'space-size': string;
  height?: string;
  slot?: TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-box radius=${props.radius} view=${props['view']} space-size=${props['space-size']} type=${props.type} height=${props['height']}> 
    <span>
      Dear colleagues,<br/><br/>
      As a reminder of the importance of adhering to our Clean Desk Policy.<br/>
      We all need to follow this to ensure data protection, business confidentiality as a priority.  
      Additionally, we should always remember that most spaces and desks are shared environments – 
      leave a desk or space as you would wish to find it.  
    </span>
  </sc-box>
`;

export const Default = Template.bind({});
Default.args = {};

export const Success = Template.bind({});
Success.args = {  
  type: 'success',
};

export const Warning = Template.bind({});
Warning.args = {
  type: 'warning',
};

export const Error = Template.bind({});
Error.args = {
  type: 'error',
};

export const Transparent = Template.bind({});
Transparent.args = {
  type: 'transparent',
};

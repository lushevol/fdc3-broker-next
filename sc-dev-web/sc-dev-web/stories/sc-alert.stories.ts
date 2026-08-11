import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Alert',
  component: 'sc-alert',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Alerts are used to display important messages and expand to show additional content.',
      },
    },
  },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['default', 'info', 'success', 'warning', 'error'],
      description: 'Sets the preferred alert type.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'info' },
        category: 'Attributes',
      },
    },
    mode: {
      control: 'inline-radio',
      options: ['default', 'banner'],
      description: 'Sets the preferred alert mode.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Attributes',
      },
    },
    title: {
      control: 'text',
      description: 'Sets the alert title.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    expand: {
      control: 'boolean',
      description: 'Sets to control if the alert can be expand.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'title', neq: '' },
    },
    closable: {
      control: 'boolean',
      description: 'Sets to control if the alert can closed.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },  
    },
    open: {
      control: 'boolean',
      description: 'Sets to show the alert.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: true },
        category: 'Attributes',
      },
    },
    icon: {
      control: 'boolean',
      description: 'Set to show the icon for the alert.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'mode', eq: 'banner' },
    },
    'full-width': {
      control: 'boolean',
      description: 'Set to show the full-width for the alert.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'mode', eq: 'banner' },
    },
    'slot[name=\'icon\']': {
      control: 'text',
      description: 'Sets to customize the icon of alert.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'title\']': {
      control: 'text',
      description: 'Sets to customize the title of alert.',
      table: {
        category: 'Slots',
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
    type: 'info',
    mode: 'default',
    title: '',
    open: true,
    icon: false,
    expand: false,
    closable: false,
    'full-width': false,
    'slot[name=\'icon\']': '',
    'slot[name=\'title\']': '',
    slot: '',    
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  type?: string;
  mode?: string;
  title?: string;
  expand?: boolean;
  closable?: boolean;
  open?: boolean;
  icon?: boolean;
  'full-width'?: boolean;
  'slot[name=\'icon\']'?: TemplateResult;  
  'slot[name=\'title\']'?: TemplateResult;  
  slot?: TemplateResult;  
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-alert
    type=${props.type}
    mode=${props.mode}
    title=${props.title}
    ?closable=${props.closable}
    ?expand=${props.expand}
    ?open=${props.open}    
    ?icon=${props.icon}    
    ?full-width=${props['full-width']}    
  >  
    ${props['slot[name=\'icon\']']
    ? html`
          <div slot="icon">${props['slot[name=\'icon\']']}</div>
        ` 
    : '' 
}    
    ${props['slot[name=\'title\']']
    ? html`<div slot="title">${props['slot[name=\'title\']']}</div>`
    : ''
}
    ${props.slot}
  </sc-alert>
`;

const HTMLTemplate: Story<ArgTypes> = ({
  type = 'info',
  mode = 'default',
  title = '',
  expand = false,
  closable = false,
  open = true,  
}: ArgTypes) => html`
  <sc-alert
    type=${type}
    mode=${mode}
    title=${title}
    ?expand=${expand}
    ?closable=${closable}
    ?open=${open}    
  >
    <div slot="title">
    I'm not <strong>just</strong> an alert, I'm an <em>alert</em> with HTML!
    </div>                        
    Lorem ipsum dolor sit amet, <b>consectetur adipiscing elit</b>. 
    <sc-icon name="clock--line"></sc-icon> Nulla morbi ultrices massa, 
    consectetur mi ullamcorper sed cras aliquam. Et phasellus varius nisl et cras sagittis.
  </sc-alert>
`;

export const Default = Template.bind({});
Default.args = {
  type: 'info',
  title: 'This is an alert. Change the attribute settings to customize this component.',
  closable: false,
  open: true,
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

export const Info = Template.bind({});
Info.args = {
  type: 'info',
  title: 'This is an alert. Change the attribute settings to customize this component.',
  closable: false,
  open: true,
};

export const Success = Template.bind({});
Success.args = {
  type: 'success',
  closable: false,
  open: true,
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

export const Warning = Template.bind({});
Warning.args = {
  type: 'warning',
  closable: false,
  open: true,
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

export const Error = Template.bind({});
Error.args = {
  type: 'error',
  closable: false,
  open: true,
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

export const Transparent = Template.bind({});
Transparent.args = {
  type: 'transparent',
  closable: false,
  open: true,
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};


export const Closable = Template.bind({});
Closable.args = {
  type: 'info',
  closable: true,
  open: true,
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

export const Collapsible = Template.bind({});
Collapsible.args = {
  type: 'error',
  title: 'Process failed due to a critical error',
  expand: true,
  open: true,
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};

export const HTMLContent = HTMLTemplate.bind({});
HTMLContent.args = {
  type: 'info',
  mode: 'banner',
  expand: true,
  open: true,  
};

export const CustomIcon = Template.bind({});
CustomIcon.args = {  
  type: 'warning',
  title: 'Custom icon',
  expand: true,
  open: true,
  'slot[name=\'icon\']': html`<sc-icon name='clock--line'></sc-icon>`,
  slot: html`
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
};
import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Breadcrumb/Breadcrumb Item',
  component: 'sc-breadcrumb-item',
  parameters: {
    docs: {
      description: {
        component:
        `A breadcrumb items are used inside breadcrumbs 
        to represent different links.`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    href: { 
      control: 'text',
      description: 'URL to direct the user to when the breadcrumb item is activated.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      }, 
    },
    target: { 
      control: 'inline-radio',
      options: ['blank', 'parent', 'self', 'top'],
      description: 'Tells the browser where to open the link. Only used when href is set.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'slot[name=\'prefix\']': {
      control: 'text',
      description: 'An optional prefix, usually an icon or icon button.',
      table: {
        category: 'Slots',
      }, 
    },
    'slot[name=\'suffix\']': {
      control: 'text',
      description: 'An optional suffix, usually an icon or icon button.',
      table: {
        category: 'Slots',
      }, 
    },
    slot: {
      control: 'text',
      description: 'Set to customize the content.',
      table: {
        category: 'Slots',
      }, 
    },
  },
  args: {
    href: null,    
    target: null,    
    'slot[name=\'prefix\']': '',
    'slot[name=\'suffix\']': '',
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
    target?: string;
    'slot[name=\'prefix\']'?: TemplateResult;
    'slot[name=\'suffix\']'?: TemplateResult;
    slot?: TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => {
  return html`
    <sc-breadcrumb-item 
      href=${props['href']}
      target=${props['target']}
    >
      <div slot="prefix">${props['slot[name=\'prefix\']']}</div>
      <div slot="suffix">${props['slot[name=\'suffix\']']}</div>
      ${props.slot}
    </sc-breadcrumb-item>
  `;
};

const CustomTemplate: Story<ArgTypes> =  (props: ArgTypes) => {
  return html`
    <sc-breadcrumb-item 
      href="#" 
      target="_blank"
    >
        ${props['slot[name=\'prefix\']']}
        ${props.slot}
        ${props['slot[name=\'suffix\']']}
    </sc-breadcrumb-item>
  `;
};

export const Default = Template.bind({});
Default.args = {
  href: '#',
  target: '_blank',
  slot: html`Welcome to Webkit`,
};

export const WithPrefix = CustomTemplate.bind({});
WithPrefix.args = {
  href: '#',
  target: '_blank',
  'slot[name=\'prefix\']': html`<sc-icon slot="prefix" name="home--line" compact></sc-icon>`,
  slot: html`Welcome to Webkit`,
};

export const WithSuffix = CustomTemplate.bind({});
WithSuffix.args = {
  href: '#',
  target: '_blank',
  'slot[name=\'suffix\']': html`<sc-icon slot="suffix" name="info-circle--line" compact></sc-icon>`,
  slot: html`Welcome to Webkit`,
};

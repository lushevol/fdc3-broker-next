import { html, TemplateResult } from 'lit';
import { truncateArgType } from './utils/ArgTypes.js';

export default {
  title: 'Components/Label',
  component: 'sc-label',
  parameters: {
    docs: {
      description: {
        component: 'Label represents a caption for an item.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text', 
      description: 'Sets the title for the label.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      }, 
    },
    'label-size': {
      control: 'inline-radio',
      description: 'The preferrred label size.',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'sm' },
        category: 'Attributes',
      },
      
    },
    trustpoint: {
      control: 'boolean',
      description: 'Sets to show the title with trustpoint style. Only works when label-size is \'md\' or \'lg\'',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'label-size', eq: 'lg' },
    },
    ...truncateArgType(),
    hint: {
      control: 'text',
      description: 'Sets the hint content.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'hint-placement': {
      control: 'inline-radio',
      description: 'The preferrred placement of the hint.',
      options: ['top', 'bottom', 'left', 'right'],      
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'right' },
        category: 'Attributes',
      },
    },
    tooltip: {
      control: 'text',
      description: 'Sets the tooltip content.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'tooltip-placement': {
      control: 'inline-radio',
      description: 'The preferrred placement of the tooltip.',
      options: ['top', 'bottom', 'left', 'right'],      
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'top' },
        category: 'Attributes',
      },
    },
    required: {
      control: 'boolean', 
      description: 'Indicates whether input field is mandatory.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    'slot[name=\'label\']': {
      control: 'text',
      description: 'Sets to customize the title of label.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'tooltip\']': {
      control: 'text',
      description: 'Sets to customize the tooltip of label.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'hint\']': {
      control: 'text',
      description: 'Sets to customize the hint of label.',
      table: {
        category: 'Slots',
      },
    },
  },
  args: {
    label: '',
    'label-size': 'sm',
    truncate: false,
    trustpoint: false,
    tooltip: '',
    hint: '',
    'tooltip-placement': 'top',
    'hint-placement': 'right',
    required: false,
    'slot[name=\'label\']': '',
    'slot[name=\'tooltip\']': '',
    'slot[name=\'hint\']': '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  label: string;
  'label-size': string;
  trustpoint?: boolean;
  truncate?: boolean;
  hint?: string;
  tooltip?: string;
  'tooltip-placement'?: string;
  'hint-placement'?: string;
  required?: boolean;  
  'slot[name=\'label\']': TemplateResult;
  'slot[name=\'tooltip\']': TemplateResult;
  'slot[name=\'hint\']': TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <div style="position:relative;padding: 20px;">
    <sc-label 
      label=${props.label} 
      label-size=${props['label-size']} 
      .trustpoint=${props['trustpoint']}
      ?truncate=${props.truncate}
      tooltip=${props.tooltip} 
      .hint=${props.hint} 
      tooltip-placement=${props['tooltip-placement']}
      hint-placement=${props['hint-placement']}
      ?required=${props.required}       
    >
      ${props['slot[name=\'label\']']
    ? html`
            <div slot="label">${props['slot[name=\'label\']']}</div>
          ` 
    : '' 
}
      ${props['slot[name=\'tooltip\']']
    ? html`
              <div slot="tooltip">${props['slot[name=\'tooltip\']']}</div>
            ` 
    : '' 
}
      ${props['slot[name=\'hint\']']
    ? html`
              <div slot="hint">${props['slot[name=\'hint\']']}</div>
            ` 
    : '' 
}
    </sc-label>
  </div>
`;

export const Default = Template.bind({});
Default.args = {
  label: 'Customer name',
};

export const Tooltip = Template.bind({});
Tooltip.args = {
  label: 'Customer name',
  tooltip: 'Name appear on identification card',
  'tooltip-placement': 'right',
};

export const Hint = Template.bind({});
Hint.args = {
  label: 'Customer name',
  hint: 'Name appear on identification card',
};

export const required = Template.bind({});
required.args = {
  label: 'Customer name',  
  tooltip: 'Name appear on identification card',
  'tooltip-placement': 'right',
  required: true,
};

export const LabelSize = Template.bind({});
LabelSize.args = {
  label: 'Customer name',
  'label-size': 'md',
  tooltip: 'Name appear on identification card',
};

export const TrustPoint = Template.bind({});
TrustPoint.args = {
  label: 'Customer name',
  'label-size': 'lg',
  trustpoint: true,
};

export const HTML = Template.bind({});
HTML.args = {
  'label-size': 'md',
  'slot[name=\'label\']': html`
    Customer <strong>name</strong>
  `,
  'slot[name=\'tooltip\']': html`
    Name appear on <strong>identification</strong> card
  `,  
};

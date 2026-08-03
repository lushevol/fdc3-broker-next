import { html, TemplateResult } from 'lit';
import { FormArgTypes, FormInputBaseArgTypesWithSlot } from './utils/FormArg.js';

export default {
  title: 'Components/Form Input/Formatted Input',
  component: 'sc-formatted-input',
  parameters: {
    docs: {
      description: {
        component:
          'Use formatted input to capture user data input in pre-defined format.',
      },
    },
    controls: {
      exclude: [
        'rows',
        'resizable',
        'slot',
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    clearable: { 
      control: 'boolean',
      description: 'Sets to allow user to clear the value.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    format: {
      control: 'text',
      description: 'Set to customize the format, can set the string of regular expression.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    blocks: {
      control: 'text',
      description: 'Set the value blocks, separate the numbers with commas, e.g ‘2,3,4’.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    delimiter: {
      control: 'text',
      description: 'The delimiters for connecting blocks.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
        defaultValue: { summary: ' - ' },
      },
    },    
    'max-length': { 
      control: 'number',
      description: 'Sets the max length of the input.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
    },
    rows: { 
      control: 'number',
      description: 'Sets the rows number of the input.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
    },
    resizable: { 
      control: 'boolean',
      description: 'Sets to allow user to resize the input.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    ...FormInputBaseArgTypesWithSlot('formatted input'),
  },
  args: {
    clearable: false,
    label: '',
    'label-size': '',
    tooltip: '',
    'tooltip-placement': 'top',
    hint: '',
    'hint-placement': 'right',
    placeholder: '',
    'help-text': '',
    value: '',
    'border-type': 'box',
    format: '',
    blocks: '',
    delimiter: '',
    'max-length': 0,
    rows: 1,
    resizable: false,
    required: false,
    readonly: false,
    'max-rows': false,
    'readonly-rows': 5,
    disabled: false,
    success: false,    
    error: false,
    'success-message': '',
    'error-message': '',
    size: 'md',
    'icon-size': '',
    'text-align': 'left',
    'slot[name=\'label\']': '',
    'slot[name=\'label-tooltip\']': '',
    'slot[name=\'label-hint\']': '',
    'slot[name=\'help\']': '',
    'slot[name=\'success\']': '',
    'slot[name=\'error\']': '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes extends FormArgTypes {
  clearable?: boolean;
  format?: string;
  blocks?: string;
  delimiter?: string;
  'max-length'?: number;
  rows?: number;
  resizable?: boolean;
  size?: string;
  'icon-size'?: string;
  'text-align'?: string;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
<div style="padding: 20px 30px">
  <sc-formatted-input 
    ?clearable=${props.clearable} 
    label=${props.label} 
    label-size=${props['label-size']}
    tooltip=${props.tooltip}
    tooltip-placement=${props['tooltip-placement']}
    hint=${props.hint}
    hint-placement=${props['hint-placement']}
    placeholder=${props['placeholder']}
    help-text=${props['help-text']}
    value=${props['value']}
    border-type=${props['border-type']}
    format=${props.format} 
    blocks=${props.blocks}    
    delimiter=${props.delimiter}
    max-length=${props['max-length']}
    rows=${props.rows}
    resizable=${props.resizable}
    ?required=${props['required']}
    ?readonly=${props['readonly']}
    ?max-rows=${props['max-rows']} 
    readonly-rows=${props['readonly-rows']} 
    ?disabled=${props['disabled']}
    ?truncate=${props.truncate}
    ?success=${props['success']}
    ?error=${props['error']}
    success-message=${props['success-message']}
    error-message=${props['error-message']}
    size=${props.size}
    icon-size=${props['icon-size']}
    text-align=${props['text-align']}
  > 
    ${props['slot[name=\'label\']']
    ? html`
          <div slot="label">${props['slot[name=\'label\']']}</div>
        ` 
    : '' 
}
    ${props['slot[name=\'label-tooltip\']']
    ? html`
            <div slot="label-tooltip">${props['slot[name=\'label-tooltip\']']}</div>
          ` 
    : '' 
}
    ${props['slot[name=\'label-hint\']']
    ? html`
            <div slot="label-hint">${props['slot[name=\'label-hint\']']}</div>
          ` 
    : '' 
}
    ${props['slot[name=\'help\']']
    ? html`
            <div slot="help">${props['slot[name=\'help\']']}</div>
          ` 
    : '' 
}
    ${props['slot[name=\'success\']']
    ? html`
            <div slot="success">${props['slot[name=\'success\']']}</div>
          ` 
    : '' 
}
    ${props['slot[name=\'error\']']
    ? html`
            <div slot="error">${props['slot[name=\'error\']']}</div>
          ` 
    : '' 
}
  </sc-formatted-input>
</div>
`;

export const Default = Template.bind({});
Default.args = {
  label: 'Default',
  blocks: '2,3,4',
  placeholder: 'XX - XXXX - XXX',
};

export const Error = Template.bind({});
Error.args = {
  label: 'Error',
  blocks: '2,3,4',
  placeholder: 'XX - XXXX - XXX',
  error: true,
  'error-message': 'Please provide valid justification',
};

export const SizeSmall = Template.bind({});
SizeSmall.args = {
  label: 'Small size',
  size: 'sm',
  blocks: '2,3,4',
  placeholder: 'XX - XXXX - XXX',
};

export const SizeLarge = Template.bind({});
SizeLarge.args = {
  label: 'Large size',
  size: 'lg',
  blocks: '2,3,4',
  placeholder: 'XX - XXXX - XXX',
};

export const CustomDelimiter = Template.bind({});
CustomDelimiter.args = {
  label: 'Custom delimiter',
  delimiter: ' , ',
  blocks: '2,3,4',
  placeholder: 'XX , XXXX , XXX',
};

export const CustomFormat = Template.bind({});
CustomFormat.args = {
  label: 'Custom format',
  format: '\w+@sc\.com',
  value: 'test123@sc.com',
  placeholder: 'Please input your email, e.g test@sc.com',
};

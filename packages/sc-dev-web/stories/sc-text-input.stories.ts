import { html, TemplateResult } from 'lit';
import { FormArgTypes, FormInputBaseArgTypesWithSlot } from './utils/FormArg.js';

export default {
  title: 'Components/Form Input/Text Input',
  component: 'sc-text-input',
  parameters: {
    docs: {
      description: {
        component:
          'Inputs collect data from the user and allow multiline lines of text.',
      },
    },
    controls: {
      exclude: [
        'slot',
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    ...FormInputBaseArgTypesWithSlot(),
    'slot[name=\'prefix\']': {
      control: 'text',
      description: 'Sets to customize the prefix icon for selected one.',
      table: {
        category: 'Slots',
      }, 
    },
    'prefix-icon': {
      control: 'text',
      description: 'Sets the prefix icon.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'suffix-icon': {
      control: 'text',
      description: 'Sets the suffix icon.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'suffix-label': {
      control: 'text',
      description: 'Sets the suffix label.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'max-length': { 
      control: 'number',
      description: 'Maximum character allowed.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
    },
    'show-character-count': {
      control: 'boolean',
      description: 'Sets to show the character counter.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    rows: { 
      control: 'number',
      description: 'Sets the number of row.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 5 },
        category: 'Attributes',
      },
    },
    clearable: { 
      control: 'boolean',
      description: 'Sets to allow user to clear the value.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    resizable: {
      control: 'inline-radio',
      description: 'Sets to allow user to resize the input if multiline.',
      options: [false, true, 'auto'],
      table: {
        type: { summary: 'boolean|string' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    multiline: { 
      control: 'boolean',
      description: 'Sets to render text input as multiline input.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
  },
  args: {
    label: '',
    'label-size': '',
    truncate: false,
    tooltip: '',
    'tooltip-placement': 'top',
    hint: '',
    'hint-placement': 'right',
    placeholder: '',
    'help-text': '',
    value: '',
    'border-type': 'box',
    'max-length': 100,
    rows: 5,
    multiline: false,
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
    'slot[name=\'label-tooltip\']': '',
    'slot[name=\'label-hint\']': '',
    'slot[name=\'help\']': '',
    'slot[name=\'success\']': '',
    'slot[name=\'error\']': '',
    'slot[name=\'prefix\']': '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes extends FormArgTypes {
  clearable?: boolean;
  reveal?: boolean;
  'max-length'?: number;
  'prefix-icon'?: string;
  'suffix-icon'?: string;
  'suffix-label'?: string;
  'show-character-count'?: boolean;
  rows?: number;
  multiline?: boolean;
  size?: string;
  'icon-size'?: string;
  'text-align'?: string;
  resizable?: boolean | 'auto';
}

const Template: Story<ArgTypes> = ({
  label = '',
  tooltip = '',
  hint = '',
  multiline = false,
  error = false,
  success = false,
  readonly = false,
  disabled = false,
  required = false,
  clearable = false,
  value = '',
  placeholder = '',
  rows,
  resizable = false,
  ...props
}: ArgTypes) => html`
<div style="padding: 20px 30px">
  <sc-text-input
    ?multiline=${multiline}
    ?clearable=${clearable}
    label=${label} 
    tooltip=${tooltip}
    tooltip-placement=${props['tooltip-placement']}
    hint=${hint}
    hint-placement=${props['hint-placement']}
    label-size=${props['label-size']}
    ?truncate=${props.truncate}
    ?disabled=${disabled}
    ?error=${error} 
    ?success=${success} 
    ?readonly=${readonly} 
    ?max-rows=${props['max-rows']} 
    readonly-rows=${props['readonly-rows']} 
    ?required=${required}
    ?show-character-count=${props['show-character-count']}
    value=${value} 
    placeholder=${placeholder}
    rows=${rows}
    resizable=${resizable}
    prefix-icon=${props['prefix-icon']}
    suffix-icon=${props['suffix-icon']}
    suffix-label=${props['suffix-label']}
    help-text=${props['help-text']}
    border-type=${props['border-type']}
    max-length=${props['max-length']}
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
            <div slot="label-tooltip">${props['slot[name=\'label-tooltip\']']}</div>
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
  ${props['slot[name=\'prefix\']']
      ? html`
              <div slot="prefix">${props['slot[name=\'prefix\']']}</div>
            ` 
      : '' 
  }
  </sc-text-input>
</div>
`;

export const Default = Template.bind({});
Default.args = {
  label: 'Business justification',
  multiline: false,
  size: 'md',
};

export const MultilineRow = Template.bind({});
MultilineRow.args = {
  label: 'Multiline with fixed rows',
  multiline: true,
  rows: 10,
  'max-length': 1000,
};

export const MultilineResizable = Template.bind({});
MultilineResizable.args = {
  label: 'Multiline and resizable',
  multiline: true,
  resizable: true,
  'max-length': 1000,
};

export const MultilineResizableAuto = Template.bind({});
MultilineResizableAuto.args = {
  label: 'Multiline and resizable auto',
  multiline: true,
  rows: 5,
  resizable: 'auto',
  'max-length': 1000,
};

export const ReadonlyMaxRowsWithNewlines = Template.bind({});
ReadonlyMaxRowsWithNewlines.args = {
  label: 'Readonly with max rows',
  multiline: true,
  readonly: true,
  'max-rows': true,
  'readonly-rows': 2,
  value: 'Line 1\\nLine 2\nLine 3\nLine 4',
};

export const Help = Template.bind({});
Help.args = {
  label: 'Text with help text',
  'help-text': 'Help text',
};

export const SizeSmall = Template.bind({});
SizeSmall.args = {
  label: 'Size small',
  size: 'sm',
  clearable: true,
};

export const SizeLarge = Template.bind({});
SizeLarge.args = {
  label: 'Size large',
  size: 'lg',
  clearable: true,
};

export const TextAlignRight = Template.bind({});
TextAlignRight.args = {
  label: 'Text align right',
  'text-align': 'right',
  'suffix-label': 'RMB',
  placeholder: '0.00',
  clearable: true,
};

export const Success = Template.bind({});
Success.args = {
  label: 'Text with success message',
  success: true,
  'success-message': 'Please ensure you have prior approval before proceed.',
  required: true,
};

export const Error = Template.bind({});
Error.args = {
  label: 'Business justification',
  'border-type': 'box',
  'help-text': 'Please provide business justification.',
  error: true,
  'error-message': 'Please provide valid justification',
  required: true,
};

export const ErrorWhenRequiredSymbolShow = Template.bind({});
ErrorWhenRequiredSymbolShow.args = {
  label: 'Required field',
  'border-type': 'box',
  error: true,
  'error-message': 'Please input the field.',
  required: true,
};

export const HTML = Template.bind({});
HTML.args = {
  'label-size': 'sm',
  value: 'Attending workshop',
  'slot[name=\'label\']': html`
    Your <strong>business</strong> justification
  `,
  'slot[name=\'label-tooltip\']': html`
    Make sure you enter <strong>busines</strong> justification `,
  'slot[name=\'help\']': html`
    Please provide <strong>business</strong> justification
  `,
};
import { html, TemplateResult } from 'lit';
import { FormArgTypes, FormInputBaseArgTypesWithSlot } from './utils/FormArg.js';

export default {
  title: 'Components/Form Input/Password Input',
  component: 'sc-password-input',
  parameters: {
    docs: {
      description: {
        component:
          'Password input allows user to show and hide text on input.',
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
    clearable: { 
      control: 'boolean',
      description: 'Sets to allow user to clear the value.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'max-length': {
      control: 'number',
      description: 'Maximun character allowed.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 16 },
        category: 'Attributes',
      },
    },   
    ...FormInputBaseArgTypesWithSlot('password'),
  },
  args: {
    clearable: false,
    label: '',
    tooltip: '',
    'tooltip-placement': 'top',
    hint: '',
    'hint-placement': 'right',
    placeholder: '',
    'help-text': '',
    value: '',
    'border-type': 'box',
    'max-length': 8,
    required: false,
    readonly: false,
    disabled: false,
    success: false,    
    error: false,
    'success-message': '',
    'error-message': '',
    'label-size': '',
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
  'max-length'?: number;
  size?: string;
  'icon-size'?: string;
  'text-align'?: string;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
<div style="padding: 20px 30px">
  <sc-password-input 
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
    max-length=${props['max-length']}
    ?required=${props['required']}
    ?readonly=${props['readonly']}
    ?disabled=${props['disabled']}
    ?truncate=${props['truncate']}
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
    ${props.slot}
  </sc-password-input>
</div>
`;

export const Default = Template.bind({});
Default.args = {
  label: 'Enter password',
};

export const SizeSmall = Template.bind({});
SizeSmall.args = {
  label: 'Small size',
  size: 'sm',
};

export const SizeLarge = Template.bind({});
SizeLarge.args = {
  label: 'Large size',
  size: 'lg',
};

export const Box = Template.bind({});
Box.args = {
  label: 'Enter password',
  'help-text': 'Enter number only',
  value: '123456781234',
  'border-type': 'box',
  success: true,
  'success-message': 'Password is valid',
  required: true,
};

export const Error = Template.bind({});
Error.args = {
  label: 'Enter password',
  placeholder: 'Input password here',
  'border-type': 'box',
  'help-text': 'Enter number only',
  error: true,
  'error-message': 'Please provide valid password format',
  required: true,
};

export const HTML = Template.bind({});
HTML.args = {
  'label-size': 'sm',
  value: '1234567812345678',
  'slot[name=\'label\']': html`
    Your <strong>password</strong> settings
  `,
  'slot[name=\'label-tooltip\']': html`
    Make sure you enter <strong>number</strong> only
  `,
  'slot[name=\'help\']': html`
    Please enter <strong>number</strong> only
  `,
};
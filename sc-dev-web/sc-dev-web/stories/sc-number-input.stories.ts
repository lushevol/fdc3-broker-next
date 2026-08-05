import { html, TemplateResult } from 'lit';
import { FormArgTypes, defaultArgsValue, FormInputBaseArgTypesWithSlot } from './utils/FormArg.js';

export default {
  title: 'Components/Form Input/Number Input',
  component: 'sc-number-input',
  parameters: {
    docs: {
      description: {
        component:
          'Use number input to enforce number entry by user.',
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
    'max-decimals': {
      control: 'number',
      description: 'The maximum decimal place.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
      if: { arg: 'type', eq: 'digit' },
    },  
    type: { 
      control: 'inline-radio',
      description: 'The preferrred icon size.',
      options: ['number', 'digit'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'number' },
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
    'hide-arrows': {
      control: 'boolean',
      description: 'Hides the increment/decrement arrows.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    min: {
      control: 'number',
      description: 'Sets the minimum number.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
    },    
    max: {
      control: 'number',
      description: 'Sets the maximum number.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
    },  
    ...FormInputBaseArgTypesWithSlot('number input'),
  },
  args: {
    clearable: false,
    'hide-arrows': false,
    min: 0,
    max: 99,
    ...defaultArgsValue,
    'label-size': '',
    size: 'md',
    'icon-size': '',
    'text-align': 'left',
    type: 'number',
    'max-decimals': 0,
    'readonly-rows': 5,
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes extends FormArgTypes  {
  clearable?: boolean;
  'hide-arrows'?: boolean;
  min: number;
  max: number;  
  size?: string;
  'icon-size'?: string;
  'text-align'?: string;
  type:string;
  'max-decimals':number;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
<div style="padding: 20px 30px;">
  <sc-number-input 
    ?clearable=${props.clearable} 
    ?hide-arrows=${props['hide-arrows']}
    label=${props.label} 
    label-size=${props['label-size']}
    ?truncate=${props.truncate}
    tooltip=${props.tooltip}
    tooltip-placement=${props['tooltip-placement']}
    hint=${props.hint}
    hint-placement=${props['hint-placement']}
    placeholder=${props['placeholder']}
    help-text=${props['help-text']}
    value=${props['value']}
    border-type=${props['border-type']}
    min=${props.min} 
    max=${props.max} 
    ?required=${props['required']}
    ?readonly=${props['readonly']}
    ?max-rows=${props['max-rows']} 
    readonly-rows=${props['readonly-rows']} 
    ?disabled=${props['disabled']}
    ?success=${props['success']}
    ?error=${props['error']}
    success-message=${props['success-message']}
    error-message=${props['error-message']}
    size=${props.size}
    icon-size=${props['icon-size']}
    text-align=${props['text-align']}
    type=${props['type']}
    max-decimals=${props['max-decimals']}
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
  </sc-number-input>
</div>
`;

export const Default = Template.bind({});
Default.args = {
  label: 'Enter number',
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
  label: 'Enter number',
  'help-text': 'Enter number only',
  value: '123456781234',
  'border-type': 'box',
  success: true,
  'success-message': 'Input is valid',
  required: true,
};

export const Error = Template.bind({});
Error.args = {
  label: 'Enter number',
  placeholder: 'Input number here',
  'border-type': 'box',
  min: 5,
  max: 10,
  'help-text': 'Enter number only',
  error: true,
  'error-message': 'Please provide number between 5 - 10',
  required: true,
};

export const HTML = Template.bind({});
HTML.args = {
  'label-size': 'sm',
  value: '1234567812345678',
  'slot[name=\'label\']': html`
    Your <strong>mobile</strong> number
  `,
  'slot[name=\'label-tooltip\']': html`
    Make sure you enter <strong>number</strong> only
  `,
  'slot[name=\'help\']': html`
    Please enter <strong>number</strong> only
  `,
};
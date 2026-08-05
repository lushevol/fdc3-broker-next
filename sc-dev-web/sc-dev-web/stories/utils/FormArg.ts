import { TemplateResult } from 'lit';
import { truncateArgType } from './ArgTypes.js';

export const LabelArgTypes = {
  label: { 
    control: 'text',
    description: 'Sets the label of the input field.',
    table: {
      type: { summary: 'string' },
      category: 'Attributes',
    },
  },
  'label-size': { 
    control: 'inline-radio',
    description:
      'The preferrred label size.',
    options: ['sm', 'md', 'lg'],
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'sm' },
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
    description:
      'The preferrred placement of the tooltip.',
    options: ['top', 'bottom', 'left', 'right'],
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'top' },
      category: 'Attributes',
    },
  },  
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
    description:
      'The preferrred placement of the tooltip.',
    options: ['top', 'bottom', 'left', 'right'],
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'right' },
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
  ...truncateArgType(),
};

export const LabelSlotArgTypes = {
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
};

export const FormBaseArgTypes = (type = 'input') => ({
  'help-text': {
    control: 'text',
    description: 'Sets the help text.',
    table: {
      type: { summary: 'string' },
      category: 'Attributes',
    },
  },
  value: {
    control: 'text',
    description: 'Sets the input field value.',
    table: {
      type: { summary: 'string' },
      category: 'Attributes',
    },
  },        
  placeholder: { 
    control: 'text',
    description: 'Sets the placeholder text.',
    table: {
      type: { summary: 'string' },
      category: 'Attributes',
    },
  },
  'border-type': {
    control: 'inline-radio',
    options: ['line', 'box'],
    description: 'Sets whether input field should show in border mode.',
    table: {
      type: { summary: 'string' },
      defaultValue: 'box',
      category: 'Attributes',
    },
  },
  readonly: {
    control: 'boolean',
    description: `Sets the ${type} as readonly.`,
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: false },
      category: 'Attributes',
    },
    if: { arg: 'disabled', eq: false },
  },
  'max-rows': { 
    control: 'boolean', 
    description: 'Set to show a maximum number of rows.',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: false },
      category: 'Attributes',
    }, 
    if: { arg: 'readonly', eq: true },
  },
  'readonly-rows': { 
    control: 'number',
    description: 'Maximum number of rows allowed in readonly state.',
    table: {
      type: { summary: 'number' },
      category: 'Attributes',
    },
    if: { arg: 'max-rows', eq: true },
  },
  disabled: {
    control: 'boolean',
    description: `Sets to disable ${type}.`,
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: false },
      category: 'Attributes',
    },
    if: { arg: 'readonly', eq: false },
  },
  success: {
    control: 'boolean',
    description: 'Sets to display success state.',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: false },
      category: 'Attributes',
    },
    if: { arg: 'error', eq: false },
  },
  error: {
    control: 'boolean',
    description: 'Sets to display error state.',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: false },
      category: 'Attributes',
    },
    if: { arg: 'success', eq: false },
  },  
  'success-message': {
    control: 'text',
    description: 'Sets the success message.',
    table: {
      type: { summary: 'string' },
      category: 'Attributes',
    },
    if: { arg: 'success', eq: true },
  },  
  'error-message': {
    control: 'text',
    description: 'Sets the error message.',
    table: {
      type: { summary: 'string' },
      category: 'Attributes',
    },
    if: { arg: 'error', eq: true },
  },  
});

export const FormBaseSlotArgTypes = {
  'slot[name=\'label\']': {
    control: 'text',
    description: 'Sets to customize input label.',
    table: {
      category: 'Slots',
    }, 
  },
  'slot[name=\'label-tooltip\']': {
    control: 'text',
    description: 'Sets to customize the tooltip of label.',
    table: {
      category: 'Slots',
    },
  },
  'slot[name=\'label-hint\']': {
    control: 'text',
    description: 'Sets to customize the hint of label.',
    table: {
      category: 'Slots',
    },
  },
  'slot[name=\'help\']': {
    control: 'text',
    description: 'Sets to customize the help text.',
    table: {
      category: 'Slots',
    }, 
  },
  'slot[name=\'success\']': {
    control: 'text',
    description: 'Sets to customize the success message.',
    table: {
      category: 'Slots',
    }, 
  },
  'slot[name=\'error\']': {
    control: 'text',
    description: 'Sets to customize the error message.',
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
};

export const FormBaseEventArgTypes = {
  'sc-input': {
    description: 'Emitted when the control receives input. Get the input content by event.detail.value.',
    table: {
      type: { summary: 'CustomEvent' },
      category: 'Custom Events',
    }, 
  },
  'sc-focus': {
    description: 'Emitted when the control gains focus.',
    table: {
      type: { summary: 'CustomEvent' },
      category: 'Custom Events',
    }, 
  },
  'sc-blur': {
    description: 'Emitted when the control loses focus.',
    table: {
      type: { summary: 'CustomEvent' },
      category: 'Custom Events',
    }, 
  },
  'sc-clear': {
    description: 'Emitted when clear content.',
    table: {
      type: { summary: 'CustomEvent' },
      category: 'Custom Events',
    }, 
  },
};

export const FormArgTypes = (type?: string) => ({
  ...LabelArgTypes,
  ...FormBaseArgTypes(type),
});

export const FormArgTypesWithSlot = (type?: string) => ({
  ...LabelArgTypes,
  ...FormBaseArgTypes(type),
  ...FormBaseSlotArgTypes,
  ...FormBaseEventArgTypes,
});

export const FormInputBaseArgTypesWithSlot = (type?: string) => {
  const result = FormArgTypesWithSlot(type);
  // @ts-ignore
  result['label-size'].table.defaultValue = undefined;
  result['label-size'].description = 'The preferrred label size. It\’s same with size property by default.';
  return {
    ...result,
    size: { 
      control: 'inline-radio',
      description: 'The preferrred field size.',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
        category: 'Attributes',
      },
    }, 
    'icon-size': { 
      control: 'inline-radio',
      description: 'The preferrred icon size.',
      options: ['default', 'sm', 'md', 'lg'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Attributes',
      },
    }, 
    'text-align': { 
      control: 'inline-radio',
      description: 'The preferrred icon size.',
      options: ['left', 'right'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'left' },
        category: 'Attributes',
      },
    }, 
  };
};

export const FormArgTypesWithoutEvent = (type?: string) => ({
  ...LabelArgTypes,
  ...FormBaseArgTypes(type),
  ...FormBaseSlotArgTypes,
});

export interface FormArgTypes {  
  label?: string;
  'label-size'?: string;
  truncate?: boolean;
  tooltip?: string;
  'tooltip-placement'?: string;
  hint?: string;
  'hint-placement'?: string;
  'help-text'?: string;
  value?: any;
  placeholder?: string;
  'border-type'?: string;  
  required?: boolean;
  readonly?: boolean;  
  'max-rows'?: boolean;
  'readonly-rows'?: number;
  disabled?: boolean;  
  success?: boolean;
  error?: boolean;
  'error-message'?: string;
  'success-message'?: string;
  'slot[name=\'label\']': TemplateResult;
  'slot[name=\'label-tooltip\']': TemplateResult;
  'slot[name=\'label-hint\']': TemplateResult;
  'slot[name=\'help\']': TemplateResult;
  'slot[name=\'success\']': TemplateResult;
  'slot[name=\'error\']': TemplateResult;
  'slot[name=\'prefix\']': TemplateResult;
  slot?: TemplateResult;  
}

export const defaultArgsValue = {
  label: '',
  'label-size': 'sm',
  truncate: false,
  tooltip: '',
  'tooltip-placement': 'top',
  hint: '',
  'hint-placement': 'right',
  placeholder: '',
  'help-text': '',
  value: '',
  'border-type': 'box',
  required: false,
  readonly: false,
  'max-rows': false,
  'readonly-rows': 5,
  disabled: false,
  success: false,    
  error: false,
  'success-message': '',
  'error-message': '',
  'slot[name=\'label\']': '',
  'slot[name=\'label-tooltip\']': '',
  'slot[name=\'label-hint\']': '',
  'slot[name=\'help\']': '',
  'slot[name=\'success\']': '',
  'slot[name=\'error\']': '',
};


export function removeUndefined(object: object) {
  return Object.fromEntries(
    Object.entries(object).filter(e => e[1] !== undefined)
  );
}
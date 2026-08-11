import { html, TemplateResult } from 'lit';
import {
  FormArgTypes,
  FormArgTypesWithSlot,
  defaultArgsValue,
} from './utils/FormArg.js';

const hiddenAttribute = ['sc-input', 'sc-focus', 'sc-blur', 'sc-clear'];

const {
  tooltip: tooltip1,
  'tooltip-placement': tp1,
  required,
  'label-size': ls1,
  truncate,
  hint: hint1,
  'hint-placement': HintPlacement1,
  ...usefulArgsTypes
} = FormArgTypesWithSlot('checkbox');

const {
  tooltip: tooltip2,
  'tooltip-placement': tp2,
  required: rq,
  'label-size': ls,
  hint,
  'hint-placement': HintPlacement,
  ...usefulArgs
} = defaultArgsValue;

const filteredAttributes = Object.fromEntries(
  Object.entries(usefulArgsTypes).filter(
    ([key]) => !hiddenAttribute.includes(key)
  )
);

export default {
  title: 'Components/Checkbox/Checkbox',
  component: 'sc-checkbox',
  parameters: {
    docs: {
      description: {
        component: 'Checkboxes allow the user to toggle an option on or off.',
      },
    },
    controls: {
      exclude: ['placeholder', 'border-type'],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Draws the checkbox in a checked state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    indeterminate: {
      control: 'boolean',
      description: 'Draws the checkbox in an indeterminate state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'sc-change': {
      description:
        'Emitted when the checked state changes. Get the checked state by event.detail.checked.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    ...filteredAttributes,
  },
  args: {
    ...usefulArgs,
    'help-text': '',
    value: '',
    checked: false,
    indeterminate: false,
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes extends FormArgTypes {
  checked?: boolean;
  indeterminate?: boolean;
}

const Template: Story<ArgTypes> = (props: ArgTypes) =>
  html`
    <sc-checkbox
      label=${props.label}
      label-size=${props['label-size']}
      tooltip=${props.tooltip}
      tooltip-placement=${props['tooltip-placement']}
      help-text=${props['help-text']}
      value=${props['value']}
      ?checked=${props.checked}
      ?indeterminate=${props.indeterminate}
      ?required=${props['required']}
      ?readonly=${props['readonly']}
      ?disabled=${props.disabled}
      ?success=${props['success']}
      ?error=${props['error']}
      success-message=${props['success-message']}
      error-message=${props['error-message']}
    >
      ${props['slot[name=\'label\']']
        ? html` <div slot="label">${props['slot[name=\'label\']']}</div> `
        : ''}
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
        ? html` <div slot="help">${props['slot[name=\'help\']']}</div> `
        : ''}
      ${props['slot[name=\'success\']']
        ? html` <div slot="success">${props['slot[name=\'success\']']}</div> `
        : ''}
      ${props['slot[name=\'error\']']
        ? html` <div slot="error">${props['slot[name=\'error\']']}</div> `
        : ''}
      ${props.slot}
    </sc-checkbox>
  `;

export const Default = Template.bind({});
Default.args = {
  slot: html`I agree with the terms and conditions`,
};

export const Checked = Template.bind({});
Checked.args = {
  label: 'Disclaimer',
  tooltip: 'Please read carefully before agree',
  'help-text': 'You must agree in order to proceed to next step.',
  required: true,
  checked: true,
  slot: html`I agree with the <strong>terms and conditions</strong>`,
};

export const Indeterminate = Template.bind({});
Indeterminate.args = {
  indeterminate: true,
  slot: html`I agree with the <strong>terms and conditions</strong>`,
};

export const Error = Template.bind({});
Error.args = {
  error: true,
  'error-message': 'Please accept the terms and conditions',
  slot: html`I agree with the <strong>terms and conditions</strong>`,
};

export const Disable = Template.bind({});
Disable.args = {
  indeterminate: true,
  disabled: true,
  slot: html`I agree with the <strong>terms and conditions</strong>`,
};

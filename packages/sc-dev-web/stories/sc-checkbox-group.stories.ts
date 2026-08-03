import { html, TemplateResult } from 'lit';
import { FormArgTypesWithSlot, FormArgTypes } from './utils/FormArg.js';

export default {
  title: 'Components/Checkbox/Checkbox Group',
  component: 'sc-checkbox-group',
  parameters: {
    docs: {
      description: {
        component:
          'Checkboxes group allows users to select one or more items from a list of choice.',
      },
    },
    controls: {
      exclude: [
        'placeholder',
        'border-type',
        'checked',
        'indeterminate',
        'slot',
        'sc-input',
        'sc-focus',
        'sc-blur',
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'inline-radio',
      description: 'Display the direction of checkbox.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
      options: ['vertical', 'horizontal'],
    },
    columns: {
      control: 'number',
      description: 'Display the columns of checkbox.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
      if: { arg: 'direction', eq: 'horizontal' },
    },
    'sc-change': {
      description:
        'Emitted when the checked state changes. Get the checked state by event.detail.value.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    ...FormArgTypesWithSlot('checkbox'),
  },
  args: {
    label: '',
    'label-size': 'lg',
    tooltip: '',
    'tooltip-placement': 'top',
    hint: '',
    'hint-placement': 'right',
    'help-text': '',
    value: '',
    required: false,
    readonly: false,
    'max-rows': false,
    'readonly-rows': 5,
    disabled: false,
    success: false,
    error: false,
    columns: null,
    'success-message': '',
    'error-message': '',
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
  direction?: string;
  columns?: number;
}

const Template: Story<ArgTypes> = (props: ArgTypes) =>
  html`
  <div style="padding: 20px 30px">
    <sc-checkbox-group
      label=${props.label}
      label-size=${props['label-size']}
      tooltip=${props.tooltip}
      tooltip-placement=${props['tooltip-placement']}
      help-text=${props['help-text']}
      value=${props['value']}
      direction=${props['direction']}
      columns=${props['columns']}
      hint=${props['hint']}
      hint-placement=${props['hint-placement']}
      ?required=${props['required']}
      ?readonly=${props['readonly']}
      ?max-rows=${props['max-rows']} 
      readonly-rows=${props['readonly-rows']} 
      ?disabled=${props.disabled}
      ?success=${props['success']}
      ?error=${props['error']}
      success-message=${props['success-message']}
      error-message=${props['error-message']}
      @sc-change=${(value: any) => {
        console.log(value);
      }}
    >
      ${props['slot[name=\'label\']']
        ? html` <div slot="label">${props['slot[name=\'label\']']}</div> `
        : ''}
      ${props['slot[name=\'label-tooltip\']']
        ? html`
            <div slot="label-tooltip">
              ${props['slot[name=\'label-tooltip\']']}
            </div>
          `
        : ''}
      ${props['slot[name=\'label-hint\']']
        ? html`
            <div slot="label-hint">
              ${props['slot[name=\'label-hint\']']}
            </div>
          `
        : ''}
      ${props['slot[name=\'help\']']
        ? html` <div slot="help">${props['slot[name=\'help\']']}</div> `
        : ''}
      ${props['slot[name=\'success\']']
        ? html` <div slot="success">${props['slot[name=\'success\']']}</div> `
        : ''}
      ${props['slot[name=\'error\']']
        ? html` <div slot="error">${props['slot[name=\'error\']']}</div> `
        : ''}
      <sc-checkbox value="1">Banana</sc-checkbox>
      <sc-checkbox value="2">Watermelon</sc-checkbox>
      <sc-checkbox value="3">Apple</sc-checkbox>
      <sc-checkbox value="4">Orange</sc-checkbox>
    </sc-checkbox-group>
  </div>
  `;

export const Default = Template.bind({});
Default.args = {};

export const Label = Template.bind({});
Label.args = {
  label: 'Your favourite fruits',
  'slot[name=\'help\']': html`You may select one or multiple fruits`,
};

export const Error = Template.bind({});
Error.args = {
  label: 'Your favourite fruits',
  required: true,
  error: true,
  'slot[name=\'error\']': html`Please select at least one`,
};

export const Horizontal = Template.bind({});
Horizontal.args = {
  label: 'Your favourite fruits',
  tooltip: 'Select one or multiple.',
  error: true,
  required: true,
  direction: 'horizontal',
  'slot[name=\'error\']': html`Please select at least one`,
};

const Template2: Story<ArgTypes> = (props: ArgTypes) =>
  html`
    <sc-checkbox-group
      label=${props.label}
      label-size=${props['label-size']}
      tooltip=${props.tooltip}
      tooltip-placement=${props['tooltip-placement']}
      help-text=${props['help-text']}
      value=${props['value']}
      direction=${props['direction']}
      ?required=${props['required']}
      ?readonly=${props['readonly']}
      ?max-rows=${props['max-rows']} 
      readonly-rows=${props['readonly-rows']} 
      ?disabled=${props.disabled}
      ?success=${props['success']}
      ?error=${props['error']}
      success-message=${props['success-message']}
      error-message=${props['error-message']}
      @sc-change=${(value: any) => {
        console.log(value);
      }}
    >
      <!-- Make sure to give role="parent" and value="all" in order to render parent checkbox -->
      <sc-checkbox role="parent" value="all">Parent checkbox</sc-checkbox>
      <sc-checkbox value="1">Banana</sc-checkbox>
      <sc-checkbox value="2">Watermelon</sc-checkbox>
      <sc-checkbox value="3">Apple</sc-checkbox>
      <sc-checkbox value="4">Orange</sc-checkbox>
    </sc-checkbox-group>
  `;

export const WithParent = Template2.bind({});
WithParent.args = {};

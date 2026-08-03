import { html, TemplateResult } from 'lit';
import { FormArgTypesWithoutEvent, FormArgTypes } from './utils/FormArg.js';

export default {
  title: 'Components/Radio Group',
  component: 'sc-radio-group',
  parameters: {
    docs: {
      description: {
        component:
          'Radio button groups for user action.',
      },
    },
    controls: {
      exclude: [
        'border-type',
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    ...FormArgTypesWithoutEvent('radio group'),
    value: { 
      control: 'text',
      description: 'Sets the default value of radio group.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      }, 
    },
    direction: { 
      control: 'inline-radio',
      description: 'Display the direction of all radios.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
      options: ['vertical', 'horizontal'],
    },
    columns: {
      control: 'number',
      description: 'Display the columns of radios.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
      if: { arg: 'direction', eq: 'horizontal' },
    },
    'sc-change': {
      description: `Emitted when the radio group’s selected value changes. 
      Get the radio group state by event.detail.value.`,
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
  },
  args: {
    label: '',
    'label-size': 'sm',
    tooltip: '',
    'tooltip-placement': 'top',
    hint: '',
    'hint-placement': 'right',
    required: false,
    'help-text': '',
    placeholder: '',
    value: '1',
    direction: 'vertical',
    columns: null,
    readonly: false,
    'max-rows': false,
    'readonly-rows': 5,
    disabled: false,
    success: false,
    error: false,
    'success-message': '',
    'error-message': '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes extends FormArgTypes {
  value?: string;
  direction?: string;
  columns?: number;
}

const DefaultTemplate: Story<ArgTypes> = props =>
  html`
  <div style="padding: 20px 30px">
    <sc-radio-group 
      value=${props.value} 
      direction=${props.direction}
      columns=${props.columns}
      label=${props.label} 
      tooltip=${props.tooltip}
      hint=${props.hint}
      help-text=${props['help-text']}
      tooltip-placement=${props['tooltip-placement']}
      hint-placement=${props['hint-placement']}
      label-size=${props['label-size']}
      ?error=${props.error} 
      ?success=${props.success} 
      ?readonly=${props.readonly} 
      ?max-rows=${props['max-rows']} 
      readonly-rows=${props['readonly-rows']} 
      ?disabled=${props.disabled} 
      ?required=${props.required}
      placeholder=${props.placeholder}
      success-message=${props['success-message']}
      error-message=${props['error-message']}
    >
      <sc-radio 
        value="1" 
        help-text='example radio help text'
      >Radio 1</sc-radio>
      <sc-radio value="2">Radio 2</sc-radio>
      <sc-radio value="3">Radio 3</sc-radio>
      <sc-radio value="4">Radio 4</sc-radio>
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
    </sc-radio-group>
  </div>
  `;

const SelectedValueTemplate: Story<ArgTypes> = ({ value }: ArgTypes) =>
  html`
    <sc-radio-group value=${value}>
      <sc-radio value="1">Radio 1</sc-radio>
      <sc-radio value="2">Radio 2</sc-radio>
      <sc-radio value="3">Radio 3</sc-radio>
      <sc-radio value="4">Radio 4</sc-radio>
    </sc-radio-group>
  `;

const DisabledTemplate: Story<ArgTypes> = ({ value }: ArgTypes) =>
  html`
    <sc-radio-group disabled value=${value}>
      <sc-radio disabled value="1">Radio 1</sc-radio>
      <sc-radio value="2">Radio 2</sc-radio>
      <sc-radio value="3">Radio 3</sc-radio>
      <sc-radio value="4">Radio 4</sc-radio>
    </sc-radio-group>
  `;

const HorizontalTemplate: Story<ArgTypes> = ({ value }: ArgTypes) =>
  html`
    <sc-radio-group value=${value} direction='horizontal'>
      <sc-radio value="1">Radio 1</sc-radio>
      <sc-radio value="2">Radio 2</sc-radio>
      <sc-radio value="3">Radio 3</sc-radio>
      <sc-radio value="4">Radio 4</sc-radio>
    </sc-radio-group>
  `;
export const Default = DefaultTemplate.bind({});

export const Selected = SelectedValueTemplate.bind({});

Selected.args = {
  value: '3',
};

export const Disabled = DisabledTemplate.bind({ value: '3' });

export const Horizontal = HorizontalTemplate.bind({});

Horizontal.args = {
  value: '3',
  direction: 'horizontal',
};

import { html, TemplateResult } from 'lit';
import { FormArgTypes, FormInputBaseArgTypesWithSlot } from './utils/FormArg.js';
import { MainIconLibrary } from '@scdevkit/icons';
const hiddenAttribute = ['border-type', 'icon-size', 'text-align'];
export default {
  title: 'Components/Form Input/Date Range Input',
  component: 'sc-date-range-input',
  parameters: {
    docs: {
      description: {
        component:
          'Select the range date.',
      },
    },
    controls: {
      exclude: [
        'placeholder',
      ],
    },
  },
  tags: ['autodocs'],  
  argTypes: {
    ...Object.fromEntries(
        Object.entries(FormInputBaseArgTypesWithSlot('date range input')).filter(([key])=> !hiddenAttribute.includes(key))
    ),
    hoist: { 
      control: 'boolean',
      description: 'Date range picker will be clipped if they’re inside a container that has overflow: auto|hidden. The hoist attribute forces the panel to use a fixed positioning strategy, allowing it to break out of the container.', // eslint-disable-line
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    picker: {
      control: 'inline-radio',
      options: ['month', 'year'],
      description: 'Sets to specify the type of range selector',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'label-position': {
      control: 'inline-radio',
      options: ['top', 'top-right'],
      description: 'The preferred placement of the label.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'top' },
        category: 'Attributes',
      },
    },
    'start-config': {
      control: 'text',
      description: 'The config for the first input, you can set the attributes which sc-date-input supports.',
      table: {
        type: { summary: 'object' },
        category: 'Attributes',
      },
    },
    'end-config': {
      control: 'text',
      description: 'The config for the second input, you can set the attributes which sc-date-input supports.',
      table: {
        type: { summary: 'object' },
        category: 'Attributes',
      },
    },
    'sc-change': {
      description: 'Emitted when switch the option. Get the date by event.detail.value.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
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
    'show-time': {
      control: 'boolean',
      description: 'Sets to show the time selection.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    format: {
      control: 'text',
      description: 'The date format, the values follow dayjs.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'DD MMM YYYY' },
        category: 'Attributes',
      },
    },
    seconds: {
      control: 'boolean',
      description: 'Sets to display time second list.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'show-time', eq: true },
    },
    'quick-selector': {
      control: 'boolean',
      description: 'Enables the quick selector feature.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'quick-selector-items': {
      control: 'array',
      description: 'Defines the items for the quick selector. Each item should have an amount and a unit.',
      table: {
        type: { summary: 'array' },
        defaultValue: {
          summary: `[ 
            { amount: -1, unit: 'year' },
            { amount: -1, unit: 'month' },
            { amount: -1, unit: 'week' },
            { amount: -1, unit: 'day' },
            { amount: 1, unit: 'day' },
            { amount: 1, unit: 'week' },
            { amount: 1, unit: 'month' },
            { amount: 1, unit: 'year' }
          ]`,
        },
        category: 'Attributes',
      },
      if: { arg: 'quick-selector', eq: true },
    },
    'disabled-dates': {
      control: 'array',
      description: 'Sets the disabled dates for the date picker.',
      table: {
        type: { summary: 'array' },
        category: 'Attributes',
      },
    },
    'disabled-days': {
      control: 'array',
      description: 'Sets the disabled days for the date picker.',
      table: {
        type: { summary: 'array' },
        category: 'Attributes',
      },
    },
    'first-day-of-week': {
      control: 'number',
      description: 'Sets the change the first day of each week.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
    },
    'min-year': {
      control: 'number',
      description: 'Sets the minimum year bound for picker navigation and year list.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
    },
    'max-year': {
      control: 'number',
      description: 'Sets the maximum year bound for picker navigation and year list.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
    },
  },
  args: {
    clearable: false,
    label: '',
    'label-size': '',
    'label-position': 'top',
    tooltip: '',
    'tooltip-placement': 'top',
    hint: '',
    'hint-placement': 'right',
    'help-text': '',
    value: '',
    format: 'DD MMM YYYY',
    'show-time': false,
    seconds: false,
    required: false,
    readonly: false,
    disabled: false,
    success: false,    
    error: false,
    'success-message': '',
    'error-message': '',
    size: 'md',
    'quick-selector': false,
    'quick-selector-items': [
      { amount: -1, unit: 'year' },
      { amount: -1, unit: 'month' },
      { amount: -1, unit: 'week' },
      { amount: -1, unit: 'day' },
      { amount: 1, unit: 'day' },
      { amount: 1, unit: 'week' },
      { amount: 1, unit: 'month' },
      { amount: 1, unit: 'year' },
    ],
    'disabled-dates': [],
    'disabled-days': [],
    'first-day-of-week': 1,
    'slot[name=\'label\']': '',
    'slot[name=\'label-tooltip\']': '',
    'slot[name=\'label-hint\']': '',
    'slot[name=\'help\']': '',
    'slot[name=\'success\']': '',
    'slot[name=\'error\']': '',
    slot: '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes extends FormArgTypes {
  clearable?: boolean,
  format?: string;
  seconds: boolean;
  'show-time': boolean;
  'label-position'?: string;
  'border-type'?: string;
  checked?: boolean;
  picker?: string;
  size?: string;
  'disabled-dates': string[];
  'disabled-days': number[];
  'first-day-of-week': number;
  'icon-size'?: string;
  'text-align'?: string;
  hoist?: boolean;
  'quick-selector'?: boolean;
  'quick-selector-items': string[];
  'min-year'?: number;
  'max-year'?: number;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
<sc-icon-provider .iconLibraries=${[MainIconLibrary]}>
  <div class='sc-date-range-input-story-container'>
    <sc-date-range-input 
      label=${props.label} 
      label-size=${props['label-size']}
      label-position=${props['label-position']}
      tooltip=${props.tooltip}
      tooltip-placement=${props['tooltip-placement']}
      hint=${props.hint}
      hint-placement=${props['hint-placement']}
      help-text=${props['help-text']}
      value=${props['value']}
      .format=${props['format']}
      ?clearable=${props['clearable']}
      ?show-time=${props['show-time']}
      ?seconds=${props['seconds']}
      ?required=${props['required']}
      ?readonly=${props['readonly']}
      ?disabled=${props['disabled']}
      ?truncate=${props.truncate}
      ?success=${props['success']}
      ?error=${props['error']}
      ?hoist=${props['hoist']}
      .picker=${props.picker}
      .minYear=${props['min-year']}
      .maxYear=${props['max-year']}
      success-message=${props['success-message']}
      error-message=${props['error-message']}
      disabled-dates=${JSON.stringify(props['disabled-dates'])}
      disabled-days=${JSON.stringify(props['disabled-days'])}
      first-day-of-week=${props['first-day-of-week']}
      size=${props.size}
      icon-size=${props['icon-size']}
      text-align=${props['text-align']}
      ?quick-selector=${props['quick-selector']}
      quick-selector-items=${JSON.stringify(props['quick-selector-items'])}
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
    </sc-date-range-input>
  </div>
  <style>
    .sc-date-range-input-story-container {
      min-height: 390px;
      padding: 20px 30px;
      margin-top: 0;
      overflow: visible;
      position: relative;
    }

    /* Storybook zoom wrappers (Canvas and Docs) can shift/clamp floating panels. */
    .docs-story :has(> .innerZoomElementWrapper),
    :has(> .innerZoomElementWrapper),
    .innerZoomElementWrapper,
    .innerZoomElementWrapper > div {
      transform: none !important;
      perspective: none !important;
      filter: none !important;
      overflow: visible !important;
    }

    #storybook-root,
    #storybook-root > div,
    .docs-story,
    .docs-story > div {
      overflow: visible !important;
    }
  </style>
</sc-icon-provider>
`;

export const Default = Template.bind({});
Default.args = {
  label: 'Date range input',
};

export const DisabledWeekend = Template.bind({});
DisabledWeekend.args = {
  label: 'Date input with disabled weekend',
  'disabled-days': [6,7],
};

export const FirstDayOfWeekend = Template.bind({});
FirstDayOfWeekend.args = {
  label: 'Date input',
  'first-day-of-week': 2,
};

export const YearSelector = Template.bind({});
YearSelector.args = {
  label: 'Year input',
  picker: 'year',
};

export const MonthSelector = Template.bind({});
MonthSelector.args = {
  label: 'Month input',
  picker: 'month',
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

export const HTML = Template.bind({});
HTML.args = {
  'label-size': 'sm',
  'slot[name=\'label\']': html`
    Turn on <strong>auto pilot</strong>?
  `,
  'slot[name=\'label-tooltip\']': html`
    Make sure you enter <strong>number</strong> only
  `,
  'slot[name=\'help\']': html`
    When <strong>turned on</strong>, system auto monitor and generate report.
  `,
};
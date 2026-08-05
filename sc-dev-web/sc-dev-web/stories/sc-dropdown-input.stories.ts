import { html, TemplateResult } from 'lit';
import { FormArgTypes, FormArgTypesWithoutEvent } from './utils/FormArg.js';
import { truncateArgType } from './utils/ArgTypes.js';

const virtualData = [
  {
    label: () => html`<div>label 1</div>`,
    value: 'value1',
  },
  {
    label: () => html`<div>label 2</div>`,
    value: 'value2',
    disabled: true,
  },
];

const customData = [{
  label: () => html`<div>label 1</div>`,
  value: 'value1',
  displayValue: 'C label 1',
}, {
  label: () => html`<div>label 2</div>`,
  value: 'value2',
  displayValue: 'C label 2',
}] as any;

const argTypes = {
  size: {
    control: 'inline-radio',
    description: 'The preferrred size of the dropdown.',
    options: ['sm', 'md', 'lg'],
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'md' },
      category: 'Attributes',
    },
  },
  clearable: {
    control: 'boolean',
    description: 'Set to allow user to clear the value.',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: false },
      category: 'Attributes',
    },
  },
  data: {
    control: 'array',
    description: 'Set to render virtual list.',
    table: {
      type: { summary: 'DATA_ITEM[]', detail: `type DATA_ITEM = {
        label: (TemplateResult | Element | string) | (() => TemplateResult | Element | string);
        value: string;
        children?: DATA_ITEM[];
        displayValue?: string; // Sets to customize the display value in the dropdown
        disabled?: boolean;
      }` },
      category: 'Attributes',
    },
  },
  'dropdown-header': {
    control: 'text',
    description: 'Sets the dropdown header of the dropdown.',
    table: {
      type: { summary: 'string' },
      category: 'Attributes',
    },
  },
  'prefix-icon': {
    control: 'text',
    description: 'Sets the prefix icon of the dropdown.',
    table: {
      type: { summary: 'string' },
      category: 'Attributes',
    },
  },
  ...truncateArgType(),
  loading: {
    control: 'boolean',
    description: 'Shows the loading state of the dropdown.',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: false },
      category: 'Attributes',
    },
  },
  'loading-text': {
    control: 'text',
    description: 'Sets the loading text of the dropdown.',
    table: {
      type: { summary: 'string' },
      category: 'Attributes',
    },
    if: { arg: 'loading', eq: true },
  },
  'empty-text': {
    control: 'text',
    description:
      'Sets the empty text of the dropdown to show that no options are available.',
    table: {
      type: { summary: 'string' },
      category: 'Attributes',
    },
  },
  'retry-button': {
    control: 'text',
    description:
      'Shows the text preferred for the retry button when options are loading or cannot be found.',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: '' },
      category: 'Attributes',
    },
  },
  'advanced-search-text': {
    control: 'text',
    description:
      'Sets the advanced search text and shows the advanced search for the dropdown.',
    table: {
      type: { summary: 'string' },
      category: 'Attributes',
    },
  },
  'advanced-search-icon': {
    control: 'text',
    description: 'Sets the advanced search icon of the dropdown.',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'search' },
      category: 'Attributes',
    },
    if: { arg: 'advanced-search-text', neq: '' },
  },
  'display-raw-value': {
    control: 'boolean',
    description: `Sets to show the option's value in dropdown input. 
    By default, the dropdown will show the option's content`,
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: false },
      category: 'Attributes',
    },
  },
  'only-filter-by-value': {
    control: 'boolean',
    description: `Only filter the options by value. 
    By default user can filter by option's value and content`,
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: false },
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
  'hide-tick-mark': {
    control: 'boolean',
    description: 'Hides tick mark for selected items',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: false },
      category: 'Attributes',
    },
  },
  'slot[name=\'prefix\']': {
    control: 'text',
    description: 'Sets to customize the prefix icon for selected one.',
    table: {
      category: 'Slots',
    }, 
  },
  'slot[name=\'empty-text\']': {
    control: 'text',
    description:
      'Sets the empty text of the dropdown to show that no options are available.',
    table: {
      category: 'Slots',
    },
  },
  'slot[name=\'side-sheet-content\']': {
    control: 'text',
    description:
      'Sets to customize the side sheet content for advanced search.',
    table: {
      category: 'Slots',
    },
    if: { arg: 'advanced-search-text', neq: '' },
  },
  hoist: {
    control: 'boolean',
    description:
      'Dropdown panels will be clipped if they’re inside a container that has overflow: auto|hidden. The hoist attribute forces the panel to use a fixed positioning strategy, allowing it to break out of the container.', // eslint-disable-line
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: false },
      category: 'Attributes',
    },
  },
  'sc-clear': {
    description: 'Emitted when clear content.',
    table: {
      type: { summary: 'CustomEvent' },
      category: 'Custom Events',
    },
  },
  'sc-select': {
    description:
      'Emitted when a dropdown option is selected. Get the selected value by event.detail.value.',
    table: {
      type: { summary: 'CustomEvent' },
      category: 'Custom Events',
    },
  },
  'sc-input': {
    description:
      'Emitted when a input changed. Get the input value by event.detail.value.',
    table: {
      type: { summary: 'CustomEvent' },
      category: 'Custom Events',
    },
  },
  'sc-show': {
    description:
      'Emitted when the dropdown opens.',
    table: {
      type: { summary: 'CustomEvent' },
      category: 'Custom Events',
    },
  },
  'sc-hide': {
    description:
      'Emitted when a dropdown closes.',
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
};

function handleCustomEvent(e: Event, eventType: string) {
  console.log(eventType, (e as CustomEvent).detail);
}

export default {
  title: 'Components/Dropdown/Dropdown',
  component: 'sc-dropdown-input',
  parameters: {
    docs: {
      description: {
        component:
          'Dropdowns expose additional content that “drops down” in a panel.',
      },
    },
    controls: {
      exclude: ['slot'],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    ...argTypes,
    ...FormArgTypesWithoutEvent('dropdown input'),
  },
  args: {
    size: 'md',
    clearable: false,
    data: virtualData,
    label: '',
    'label-size': '',
    'icon-size': '',
    'text-align': 'left',
    'dropdown-header': '',
    'prefix-icon': '',
    'border-type': 'box',
    truncate: false,
    loading: false,
    'loading-text': 'Loading items...',
    'retry-button': '',
    'advanced-search-text': '',
    'advanced-search-icon': 'search',
    'empty-text': 'No data found',
    tooltip: '',
    'tooltip-placement': 'top',
    hint: '',
    'hint-placement': 'right',
    placeholder: 'Please select',
    'help-text': '',
    value: '',
    'only-filter-by-value': false,
    'display-raw-value': false,
    required: false,
    readonly: false,
    'max-rows': false,
    'readonly-rows': 5,
    disabled: false,
    success: false,
    error: false,
    hoist: false,
    'hide-tick-mark': false,
    'success-message': '',
    'error-message': '',
    'slot[name=\'label\']': '',
    'slot[name=\'label-tooltip\']': '',
    'slot[name=\'label-hint\']': '',
    'slot[name=\'help\']': '',
    'slot[name=\'success\']': '',
    'slot[name=\'error\']': '',
    'slot[name=\'empty-text\']': '',
    'slot[name=\'side-sheet-content\']': '',
    'slot[name=\'prefix\']': '',
    'slot[name=\'prefix-icon\']': '',
    'sc-input': (e: any) => console.log('sc-input',e.detail.value),
    'sc-focus': (e: any) => console.log('sc-focus',e.detail.value),
    'sc-blur': (e: any) => console.log('sc-blur',e.detail.value),
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}
interface ArgTypes extends FormArgTypes {
  clearable?: boolean;
  size?: string;
  'icon-size'?: string;
  'text-align'?: string;
  'dropdown-header'?: string;
  'prefix-icon'?: string;
  truncate?: boolean;
  loading?: boolean;
  'loading-text'?: string;
  'retry-button'?: string;
  'advanced-search-text'?: string;
  'advanced-search-icon'?: string;
  'empty-text'?: string;
  'only-filter-by-value'?: boolean;
  'display-raw-value'?: boolean;
  'sc-input'?: string;
  'sc-focus'?:string;
  'sc-blur'?:string;
  'slot[name=\'empty-text\']'?: string;
  'slot[name=\'side-sheet-content\']'?: string;
  'hide-tick-mark': boolean;
  data?: string;
  hoist: boolean;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <div style="padding:20px 30px 100px; overflow: hidden; ${
  props['hoist'] ? 'border: 1px solid var(--sc-color-grey-150); padding: 1rem 1rem 100px' : ''
}">
    <sc-dropdown-input
      size=${props.size}
      ?clearable=${props.clearable}
      label=${props.label}
      label-size=${props['label-size']}
      dropdown-header=${props['dropdown-header']}
      prefix-icon=${props['prefix-icon']}
      border-type=${props['border-type']}
      ?truncate=${props.truncate}
      ?loading=${props.loading}
      loading-text=${props['loading-text']}
      retry-button=${props['retry-button']}
      advanced-search-text=${props['advanced-search-text']}
      advanced-search-icon=${props['advanced-search-icon']}
      empty-text=${props['empty-text']}
      tooltip=${props.tooltip}
      tooltip-placement=${props['tooltip-placement']}
      hint=${props.hint}
      hint-placement=${props['hint-placement']}
      placeholder=${props['placeholder']}
      help-text=${props['help-text']}
      value=${props['value']}
      ?required=${props['required']}
      ?readonly=${props['readonly']}
      ?max-rows=${props['max-rows']} 
      readonly-rows=${props['readonly-rows']} 
      ?disabled=${props['disabled']}
      ?success=${props['success']}
      ?error=${props['error']}
      icon-size=${props['icon-size']}
      text-align=${props['text-align']}
      ?hoist=${props['hoist']}
      ?hide-tick-mark=${props['hide-tick-mark']}
      success-message=${props['success-message']}
      error-message=${props['error-message']}
      ?only-filter-by-value=${props['only-filter-by-value']}
      ?display-raw-value=${props['display-raw-value']}
      @sc-input=${props['sc-input']}
      @sc-select=${(e: any) => handleCustomEvent(e, 'sc-select:')}
      @sc-clear=${(e: any) => handleCustomEvent(e, 'sc-clear:')}
      @sc-show=${(e: any) => handleCustomEvent(e, 'sc-show:')}
      @sc-hide=${(e: any) => handleCustomEvent(e, 'sc-hide:')}
      @sc-focus=${props['sc-focus']}
      @sc-blur=${props['sc-blur']}
    >
      <sc-dropdown-option value="english">English</sc-dropdown-option>
      <sc-dropdown-option disabled="true" value="mandarin">Mandarin</sc-dropdown-option>
      <sc-dropdown-option value="hindi">Hindi</sc-dropdown-option>
      <sc-dropdown-option value="spanish">Spanish</sc-dropdown-option>
      <sc-dropdown-option value="french">French</sc-dropdown-option>
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
      ${props['slot[name=\'empty-text\']']
        ? html`
            <div slot="empty-text">${props['slot[name=\'empty-text\']']}</div>
          `
        : ''}
      ${props['slot[name=\'side-sheet-content\']']
        ? html`
            <div slot="side-sheet-content">
              ${props['slot[name=\'side-sheet-content\']']}
            </div>
          `
        : ''}
      ${props['slot[name=\'prefix\']']
        ? html`
                    <div slot="prefix">${props['slot[name=\'prefix\']']}</div>
                  ` 
        : '' }
    </sc-dropdown-input>
  </div>
`;

export const Default = Template.bind({});

Default.args = {
  label: 'Dropdown',
  error: false,
  success: false,
  readonly: false,
  required: false,
  value: '',
};

export const SizeSmall = Template.bind({});
SizeSmall.args = {
  label: 'Small dropdown',
  error: false,
  success: false,
  readonly: false,
  required: false,
  value: '',
  size: 'sm',
};

export const SizeLarge = Template.bind({});
SizeLarge.args = {
  label: 'Large dropdown',
  size: 'lg',
};

export const Hoist = Template.bind({});

Hoist.args = {
  label: 'Dropdown',
  error: false,
  success: false,
  readonly: false,
  required: false,
  // @ts-ignore
  hoist: true,
  value: '',
};

export const Error = Template.bind({});
Error.args = {
  label: 'Dropdown',
  placeholder: 'Please select a language',
  'help-text': 'Select one',
  error: true,
  'error-message': 'Please select language',
  required: true,
};

export const HTML = Template.bind({});
HTML.args = {
  'label-size': 'md',
  value: 'english',
  'slot[name=\'label\']': html` Select <strong>preferred</strong> language `,
  'slot[name=\'label-tooltip\']': html`
    Select your <strong>preferred</strong> language
  `,
  'slot[name=\'help\']': html` Select <strong>one</strong> only `,
};

const virtualDropdownTemplate: Story<ArgTypes> = (props: ArgTypes) => {
  return html`
    <sc-dropdown-input
      size=${props.size}
      .data=${props.data}
      class="virtual-dropdown"
      label=${props.label}
      label-size=${props['label-size']}
      dropdown-header=${props['dropdown-header']}
      prefix-icon=${props['prefix-icon']}
      border-type=${props['border-type']}
      ?truncate=${props.truncate}
      ?loading=${props.loading}
      loading-text=${props['loading-text']}
      retry-button=${props['retry-button']}
      advanced-search-text=${props['advanced-search-text']}
      advanced-search-icon=${props['advanced-search-icon']}
      empty-text=${props['empty-text']}
      tooltip=${props.tooltip}
      tooltip-placement=${props['tooltip-placement']}
      hint=${props.hint}
      hint-placement=${props['hint-placement']}
      placeholder=${props['placeholder']}
      help-text=${props['help-text']}
      value=${props['value']}
      ?required=${props['required']}
      ?readonly=${props['readonly']}
      ?max-rows=${props['max-rows']} 
      readonly-rows=${props['readonly-rows']} 
      ?disabled=${props['disabled']}
      ?success=${props['success']}
      ?error=${props['error']}
      ?hide-tick-mark=${props['hide-tick-mark']}
      hoist
      success-message=${props['success-message']}
      error-message=${props['error-message']}
      @sc-input=${props['sc-input']}
      @sc-focus=${props['sc-focus']}
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
      ${props['slot[name=\'empty-text\']']
        ? html`
            <div slot="empty-text">${props['slot[name=\'empty-text\']']}</div>
          `
        : ''}
      ${props['slot[name=\'side-sheet-content\']']
        ? html`
            <div slot="side-sheet-content">
              ${props['slot[name=\'side-sheet-content\']']}
            </div>
          `
        : ''}
    </sc-dropdown-input>
    <script type="module">
      // If you want to use performant dropdown component.
      // Please make sure you pass data to it rather than <sc-dropdown-option>
      // Label can be a string, elementNode or result of html\`<div>text</div>\`.
      // also can be a function which return that three type

      const virtualData = [
        {
          label: () => html\`<div>label 1</div>\`,
          value: 'value1',
        },
        {
          label: () => html\`<div>label 2</div>\`,
          value: 'value2',
        },
      ];
      /**
       *  scDropdownInput.data = virtualData;
       */
    </script>
  `;
};

export const VirtualDropdown = virtualDropdownTemplate.bind({});

VirtualDropdown.args = {};

const HierarchicalDropdownTemplate: Story<ArgTypes> = (props: ArgTypes) => {
  return html`
    <sc-dropdown-input
      .data=${props.data}
      ?clearable=${props.clearable} 
      label=${props.label} 
      label-size=${props['label-size']}
      dropdown-header=${props['dropdown-header']}
      prefix-icon=${props['prefix-icon']}
      ?truncate=${props.truncate}
      ?loading=${props.loading}
      loading-text=${props['loading-text']}
      retry-button=${props['retry-button']}
      advanced-search-text=${props['advanced-search-text']}
      advanced-search-icon=${props['advanced-search-icon']}
      empty-text=${props['empty-text']}
      tooltip=${props.tooltip}
      tooltip-placement=${props['tooltip-placement']}
      placeholder=${props['placeholder']}
      help-text=${props['help-text']}
      value=${props['value']}
      border-type=${props['border-type']}
      ?required=${props['required']}
      ?readonly=${props['readonly']}
      ?max-rows=${props['max-rows']} 
      readonly-rows=${props['readonly-rows']} 
      ?disabled=${props['disabled']}
      ?success=${props['success']}
      ?error=${props['error']}
      ?hide-tick-mark=${props['hide-tick-mark']}
      hoist
      success-message=${props['success-message']}
      error-message=${props['error-message']}
    >
      ${
        props['slot[name=\'label\']']
          ? html` <div slot="label">${props['slot[name=\'label\']']}</div> `
          : ''
      }
      ${
        props['slot[name=\'label-tooltip\']']
          ? html`
              <div slot="label-tooltip">
                ${props['slot[name=\'label-tooltip\']']}
              </div>
            `
          : ''
      }
      ${
        props['slot[name=\'help\']']
          ? html` <div slot="help">${props['slot[name=\'help\']']}</div> `
          : ''
      }
      ${
        props['slot[name=\'success\']']
          ? html` <div slot="success">${props['slot[name=\'success\']']}</div> `
          : ''
      }
      ${
        props['slot[name=\'error\']']
          ? html` <div slot="error">${props['slot[name=\'error\']']}</div> `
          : ''
      }
      ${
        props['slot[name=\'empty-text\']']
          ? html`
              <div slot="empty-text">${props['slot[name=\'empty-text\']']}</div>
            `
          : ''
      }
      ${
        props['slot[name=\'side-sheet-content\']']
          ? html`
              <div slot="side-sheet-content">
                ${props['slot[name=\'side-sheet-content\']']}
              </div>
            `
          : ''
      }
    </sc-dropdown-input>
    <br></br>
    <br></br>
    <script type="module">
      // The maximum hierarchical level is 5, but better make sure it not exceed 3
      const virtualData = [{
        label: () => html\`<div>label 1</div>\`,
        value: 'value1',
        children: [{
          label: 'label 3',
          value: 'label3',
        }, {
          label: 'label 4',
          value: 'label4',
        }],
      }, {
        label: () => html\`<div>label 2</div>\`,
        value: 'value2',
      }];
      /**
      *  scMultipleDropdown.data = virtualData;
      */
    </script>
  `;
};

export const HierarchicalDropdown = HierarchicalDropdownTemplate.bind({});
const HierarchicalData = [
  {
    label: () => html`
      <div
        style="display: flex; justify-content: space-between; align-items: center; width: 100%;"
      >
        <div style="flex-grow: 1;">
          <div>Label 1</div>
          <div style="font-size: 10px;">SUBTEXT LEFT ROW1 • MORE SUBTEXT</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 14px;">
            Text right
            <sc-icon
              name="clock--line"
              size="xs"
              style="margin-left: 4px;"
            ></sc-icon>
          </div>
          <div style="color: red; font-size: 12px;">Status</div>
        </div>
      </div>
    `,
    value: 'value1',
    children: [
      {
        label: 'Label 3',
        value: 'label3',
        children: [
          {
            label: 'Label 5',
            value: 'label5',
            disabled: true,
          },
          {
            label: 'Label 6',
            value: 'label6',
          },
        ],
      },
      {
        label: 'Label 4',
        value: 'label4',
      },
    ],
  },
  {
    label: () => html`<div>Label 2</div>`,
    value: 'value2',
  },
] as any;

HierarchicalDropdown.args = {
  data: HierarchicalData,
};

const CustomDropdownTemplate: Story<ArgTypes> = (props: ArgTypes) => {
  return html`
    <sc-dropdown-input
      .data=${props.data}
      class="virtual-dropdown"
      label=${props.label} 
      label-size=${props['label-size']}
      tooltip=${props.tooltip}
      tooltip-placement=${props['tooltip-placement']}
      placeholder=${props['placeholder']}
      help-text=${props['help-text']}
      value=${props['value']}
      border-type=${props['border-type']}
      ?required=${props['required']}
      ?readonly=${props['readonly']}
      ?max-rows=${props['max-rows']} 
      readonly-rows=${props['readonly-rows']} 
      ?disabled=${props['disabled']}
      ?success=${props['success']}
      ?error=${props['error']}
      ?hide-tick-mark=${props['hide-tick-mark']}
      success-message=${props['success-message']}
      error-message=${props['error-message']}
      hoist
      @sc-input=${props['sc-input']}
      @sc-focus=${props['sc-focus']}
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
    </sc-dropdown-input>
    <script type="module">
      // The maximum hierarchical level is 5, but better make sure it not exceed 3
      const virtualData = [{
        label: () => html\`<div>label 1</div>\`,
        value: 'value1',
        displayValue: 'C-label 1',
      }, {
        label: () => html\`<div>label 2</div>\`,
        value: 'value2',
        displayValue: 'C-label 2',
      }];
      /**
      *  scDropdownInput.data = virtualData;
      */
    </script>
  `;
};

export const CustomDropdown = CustomDropdownTemplate.bind({});

CustomDropdown.args = {
  data: customData,
};

import { html, TemplateResult } from 'lit';
import { FormArgTypesWithSlot, FormArgTypes } from './utils/FormArg.js';
import { handleCustomEvent } from '../src/shared/util.js';

const virtualData = [{
  label: () => html`<div>Audrey</div>`,
  value: 'audrey',
}, {
  label: () => html`<div>Bently</div>`,
  value: 'bently',
}, {
  label: () => html`<div>Charlotte</div>`,
  value: 'charlotte',
}, {
  label: () => html`<div>Charlene</div>`,
  value: 'charlene',
}, {
  label: () => html`<div>Daniel</div>`,
  value: 'daniel',
}, {
  label: () => html`<div>Evelyn</div>`,
  value: 'evelyn',
}, {
  label: () => html`<div>Franklin</div>`,
  value: 'franklin',
}];

const HierarchicalData = [{
  label: () => html`
    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
      <div style="flex-grow: 1;">
        <div>Label 1</div>
        <div style="font-size: 10px;">
          SUBTEXT LEFT ROW1 • MORE SUBTEXT
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 14px;">
          Text right <sc-icon name="clock--line" size="xs" style="margin-left: 4px;"></sc-icon>
        </div>
        <div style="color: red; font-size: 12px;">
          Status
        </div>
      </div>
    </div>
  `,
  value: 'value1',
  children: [{
    label: 'Label 3',
    value: 'label3',
    children: [{
      label: 'Label 5',
      value: 'label5',
    }, {
      label: 'Label 6',
      value: 'label6',
    }],
  }, {
    label: 'Label 4',
    value: 'label4',
  }],
}, {
  label: () => html`<div>Label 2</div>`,
  value: 'value2',
}] as any;

const customData = [{
  label: () => html`<div>label 1</div>`,
  value: 'value1',
  displayValue: 'C label 1',
}, {
  label: () => html`<div>label 2</div>`,
  value: 'value2',
  displayValue: 'C label 2',
}] as any;

export default {
  title: 'Components/Dropdown/Dropdown Multi Select ',
  component: 'sc-dropdown-multi-select',
  parameters: {
    docs: {
      description: {
        component:
          `Similar to dropdowns, dropdown multi select expose additional content that “drops down” 
          in a panel and allow user to select multiple options.`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
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
    'multiple-rows': { 
      control: 'boolean',
      description: 'Set to allow multiple rows.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
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
    ...FormArgTypesWithSlot('dropdown multi select'),
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
    value: {
      control: 'array',
      description: 'The input’s default value.',
      table: {
        type: { summary: 'array' },
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
    'keep-input-on-select': {
      control: 'boolean',
      description: 'Sets to keep the search result after selection.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'auto-create-tag': {
      control: 'boolean',
      description: 'Automatically create a tag when input is not found.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'min-count': {
      control: 'number',
      description: 'Sets the minimum selected options users must keep selected.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
    },
    'max-count': {
      control: 'number',
      description: 'Sets to maximum options that user can select from the list.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
    },
    'tag-type': {
      control: 'text',
      description: 'Type of tag to create (e.g., info, warning, success).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'grey' },
        category: 'Attributes',
      },
    },
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
      description: 'Sets the empty text of the dropdown to show that no options are available.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'retry-button': {
      control: 'text',
      description: 'Shows the text preferred for the retry button when options are loading or cannot be found.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Retry' },
        category: 'Attributes',
      },
    },
    'advanced-search-text': {
      control: 'text',
      description: 'Sets the advanced search text and shows the advanced search for the dropdown.',
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
      description: 'Sets the empty text of the dropdown to show that no options are available.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'side-sheet-content\']': {
      control: 'text',
      description: 'Sets to customize the side sheet content for advanced search.',
      table: {
        category: 'Slots',
      },
      if: { arg: 'advanced-search-text', neq: '' },
    },
    'sc-clear': {
      description: 'Emitted when clear content.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
    hoist: { 
      control: 'boolean',
      description: 'Dropdown panels will be clipped if they’re inside a container that has overflow: auto|hidden. The hoist attribute forces the panel to use a fixed positioning strategy, allowing it to break out of the container.', // eslint-disable-line
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'sc-select': {
      description: 'Emitted when a dropdown option is selected. Get the selected values by event.detail.value. Get the deleted values by event.detail.deletedValues',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
    'select-all': {
      control: 'boolean',
      description: 'Shows the select all option.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
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
  },
  args: {
    data: virtualData,
    clearable: false,
    'multiple-rows': false,
    label: '',
    size: 'md',
    'dropdown-header': '',
    'prefix-icon': '',
    truncate: false,
    loading: false,
    'keep-input-on-select': false,
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
    value: [],
    'border-type': 'box',
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
    'select-all': false,
    'slot[name=\'prefix\']': '',
    'auto-create-tag': false,
    'tag-type': 'grey',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

type ArgTypes = FormArgTypes & {
  clearable?: boolean;
  size?: string;
  'multiple-rows'?: boolean;
  'dropdown-header': string;
  'prefix-icon': string;
  truncate?: boolean;
  loading: boolean;
  'loading-text': string;
  'retry-button': string;
  'advanced-search-text': string;
  'advanced-search-icon': string;
  'empty-text': string;
  'keep-input-on-select': boolean;
  'min-count': number;
  'max-count': number;
  data: any;
  'slot[name=\'empty-text\']': any,
  'slot[name=\'side-sheet-content\']': any,
  hoist?: boolean;
  'hide-tick-mark': boolean;
  dataLookup?: object;
  'select-all': boolean;
  'display-raw-value': boolean;
  'auto-create-tag': boolean;
  'tag-type': string;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
  <div style="padding:20px 30px 100px; overflow: hidden; ${
  props['hoist'] ? 'border: 1px solid var(--sc-color-grey-25); padding: 1rem 1rem 100px' : ''
}">
    <sc-dropdown-multi-select 
      ?clearable=${props.clearable} 
      ?multiple-rows=${props['multiple-rows']} 
      ?keep-input-on-select=${props['keep-input-on-select']}
      label=${props.label} 
      .minCount=${props['min-count']}
      .maxCount=${props['max-count']}
      label-size=${props['label-size']}
      size=${props['size']}
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
      hint=${props.hint}
      hint-placement=${props['hint-placement']}
      placeholder=${props['placeholder']}
      help-text=${props['help-text']}
      .value=${props['value']}
      border-type=${props['border-type']}
      ?required=${props['required']}
      ?readonly=${props['readonly']}
      ?max-rows=${props['max-rows']} 
      readonly-rows=${props['readonly-rows']} 
      ?disabled=${props['disabled']}
      ?success=${props['success']}
      ?error=${props['error']}
      ?hoist=${props['hoist']}
      success-message=${props['success-message']}
      error-message=${props['error-message']}
      ?select-all=${props['select-all']}
      ?display-raw-value=${props['display-raw-value']}
      @sc-select=${(e: CustomEvent) => handleCustomEvent(e)}
      ?hide-tick-mark=${props['hide-tick-mark']}
      ?auto-create-tag=${props['auto-create-tag']}
      .tagType=${props['tag-type']}
      @sc-show=${(e: CustomEvent) => console.log('sc-show:', e)}
      @sc-hide=${(e: CustomEvent) => console.log('sc-hide:', e)}
    >
      <sc-dropdown-option value="english">English</sc-dropdown-option>
      <sc-dropdown-option value="mandarin">Mandarin</sc-dropdown-option>
      <sc-dropdown-option value="hindi">Hindi</sc-dropdown-option>
      <sc-dropdown-option value="spanish">Spanish</sc-dropdown-option>
      <sc-dropdown-option value="french">French</sc-dropdown-option>
      <sc-dropdown-option disabled="true" value="portugese">Portugese</sc-dropdown-option>
      <sc-dropdown-option value="thai">Thai</sc-dropdown-option>
      <sc-dropdown-option value="long">An extremely long dropdown option value</sc-dropdown-option>
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
      ${props['slot[name=\'empty-text\']']
    ? html`
                <div slot="empty-text">${props['slot[name=\'empty-text\']']}</div>
              ` 
    : '' 
}
      ${props['slot[name=\'side-sheet-content\']']
    ? html`
                <div slot="side-sheet-content">${props['slot[name=\'side-sheet-content\']']}</div>
              ` 
    : '' 
}
      ${props['slot[name=\'prefix\']']
        ? html`
                    <div slot="prefix">${props['slot[name=\'prefix\']']}</div>
                  ` 
      : '' }
    </sc-dropdown-multi-select>
  </div>
`;


export const Default = Template.bind({});

Default.args = {
  label: 'Dropdown',
  error: false,
  success: false,
  readonly: false,
  required: false,
  value: [],
};

export const Hoist = Template.bind({});

Hoist.args = {
  label: 'Dropdown',
  error: false,
  success: false,
  readonly: false,
  required: false,
  hoist: true,
  value: [],
};

export const Error = Template.bind({});
Error.args = {
  label: 'Dropdown',
  'border-type': 'box',
  'help-text': 'Select one',
  error: true,
  'error-message': 'Please select language',
  required: true,
};

export const HTML = Template.bind({});
HTML.args = {
  'label-size': 'md',
  'slot[name=\'label\']': html`
    Select <strong>preferred</strong> language
  `,
  'slot[name=\'label-tooltip\']': html`
    Select your <strong>preferred</strong> language
  `,
  'slot[name=\'help\']': html`
    Select <strong>one</strong> only
  `,
};

const virtualDropdownTemplate: Story<ArgTypes> = (props: ArgTypes) => {
  return html`
    <sc-dropdown-multi-select 
      .data=${props.data}
      ?keep-input-on-select=${props['keep-input-on-select']}
      ?clearable=${props.clearable} 
      .minCount=${props['min-count']}
      .maxCount=${props['max-count']}
      ?multiple-rows=${props['multiple-rows']} 
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
      hint=${props.hint}
      hint-placement=${props['hint-placement']}
      placeholder=${props['placeholder']}
      help-text=${props['help-text']}
      .value=${props['value']}
      border-type=${props['border-type']}
      ?required=${props['required']}
      ?readonly=${props['readonly']}
      ?max-rows=${props['max-rows']} 
      readonly-rows=${props['readonly-rows']} 
      ?hide-tick-mark=${props['hide-tick-mark']}
      ?disabled=${props['disabled']}
      ?success=${props['success']}
      ?error=${props['error']}
      success-message=${props['success-message']}
      error-message=${props['error-message']}
      ?select-all=${props['select-all']}
      @sc-select=${(e: CustomEvent) => handleCustomEvent(e)}
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
      ${props['slot[name=\'empty-text\']']
    ? html`
                <div slot="empty-text">${props['slot[name=\'empty-text\']']}</div>
              ` 
    : '' 
}
      ${props['slot[name=\'side-sheet-content\']']
    ? html`
                <div slot="side-sheet-content">${props['slot[name=\'side-sheet-content\']']}</div>
              ` 
    : '' 
}
    </sc-dropdown-multi-select>
    <br></br>
    <script type="module">
      // If you want to use performant dropdown component.
      // Please make sure you pass data to it rather than <sc-dropdown-option>
      // Label can be a string, elementNode or result of html\`<div>text</div>\`.
      // also can be a function which return that three type
      const virtualData = [{
        label: () => html\`<div>label 1</div>\`,
        value: 'value1',
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

export const VirtualDropdown = virtualDropdownTemplate.bind({});

VirtualDropdown.args = {
};

export const DisabledOption = virtualDropdownTemplate.bind({});
DisabledOption.args = {
  label: 'Dropdown with disabled option',
  value: [],
  data: [{
    label: 'Label 1',
    value: 'value1',
    disabled: true,
  }, {
    label: 'Label 2',
    value: 'value2',
  }],
};


const HierarchicalDropdownTemplate: Story<ArgTypes> = (props: ArgTypes) => {
  return html`
    <sc-dropdown-multi-select 
      .data=${props.data}
      ?clearable=${props.clearable} 
      ?multiple-rows=${props['multiple-rows']} 
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
      hint=${props.hint}
      hint-placement=${props['hint-placement']}
      placeholder=${props['placeholder']}
      help-text=${props['help-text']}
      .value=${props['value']}
      border-type=${props['border-type']}
      ?required=${props['required']}
      ?readonly=${props['readonly']}
      ?max-rows=${props['max-rows']} 
      readonly-rows=${props['readonly-rows']} 
      ?hide-tick-mark=${props['hide-tick-mark']}
      ?disabled=${props['disabled']}
      ?success=${props['success']}
      ?error=${props['error']}
      success-message=${props['success-message']}
      error-message=${props['error-message']}
      ?select-all=${props['select-all']}
      @sc-select=${(e: CustomEvent) => handleCustomEvent(e)}
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
      ${props['slot[name=\'empty-text\']']
    ? html`
                <div slot="empty-text">${props['slot[name=\'empty-text\']']}</div>
              ` 
    : '' 
}
      ${props['slot[name=\'side-sheet-content\']']
    ? html`
                <div slot="side-sheet-content">${props['slot[name=\'side-sheet-content\']']}</div>
              ` 
    : '' 
}
    </sc-dropdown-multi-select>
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

HierarchicalDropdown.args = {
  data: HierarchicalData,
};

const DataLookupDropdownTemplate: Story<ArgTypes> = (props: ArgTypes) => {
  return html`
    <sc-dropdown-multi-select 
      .data=${props.data}
      .dataLookup=${props.dataLookup}
      .minCount=${props['min-count']}
      .maxCount=${props['max-count']}
      label=${props.label} 
      label-size=${props['label-size']}
      ?truncate=${props.truncate}
      tooltip=${props.tooltip}
      tooltip-placement=${props['tooltip-placement']}
      hint=${props.hint}
      hint-placement=${props['hint-placement']}
      placeholder=${props['placeholder']}
      help-text=${props['help-text']}
      .value=${props['value']}
      border-type=${props['border-type']}
      ?required=${props['required']}
      ?readonly=${props['readonly']}
      ?max-rows=${props['max-rows']} 
      readonly-rows=${props['readonly-rows']} 
      ?hide-tick-mark=${props['hide-tick-mark']}
      ?disabled=${props['disabled']}
      ?success=${props['success']}
      ?error=${props['error']}
      success-message=${props['success-message']}
      error-message=${props['error-message']}
      ?select-all=${props['select-all']}
      @sc-select=${(e: CustomEvent) => handleCustomEvent(e)}
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
    </sc-dropdown-multi-select>
    <script type="module">
      const virtualData = [{
        label: () => html\`<div>label 1</div>\`,
        value: 'value1',
      }, {
        label: () => html\`<div>label 2</div>\`,
        value: 'value2',
      }];
      const dataLookup = (value) => {
        return new Promise((resolve, reject) => {
          const _dropdownData = virtualData.map(d => ({
            value: d.value + value,
            label: d.label + value
          }))
          resolve(_dropdownData)
        })
      }
      
      /**
      *  <sc-dropdown-multi-select hoist 
      * .data=\${virtualData}
      * .dataLookup=\${dataLookup}
      * ></sc-dropdown-multi-select>
      */
    </script>
  `;
};

export const DataLookupDropdown = DataLookupDropdownTemplate.bind({});

const _dataLookup = (value: string) => {
  return new Promise((resolve, reject) => {
    const _dropdownData = virtualData.map((d, index) => ({
      value: `${value}_${index}`,
      label: `${value}_${index}`,
    }));
    resolve(_dropdownData);
  });
};

DataLookupDropdown.args = {
  dataLookup: _dataLookup,
};

const CustomDropdownTemplate:  Story<ArgTypes> = (props: ArgTypes) => {
  return html`
    <style>
      sc-dropdown-multi-select  {
        --sc-form-group-input-min-height: auto;
      }
    </style>
    <sc-dropdown-multi-select 
      .data=${props.data}
      .minCount=${props['min-count']}
      .maxCount=${props['max-count']}
      label=${props.label} 
      label-size=${props['label-size']}
      ?truncate=${props.truncate}
      tooltip=${props.tooltip}
      tooltip-placement=${props['tooltip-placement']}
      placeholder=${props['placeholder']}
      help-text=${props['help-text']}
      .value=${props['value']}
      border-type=${props['border-type']}
      ?required=${props['required']}
      ?readonly=${props['readonly']}
      ?max-rows=${props['max-rows']} 
      readonly-rows=${props['readonly-rows']} 
      ?hide-tick-mark=${props['hide-tick-mark']}
      ?disabled=${props['disabled']}
      ?success=${props['success']}
      ?error=${props['error']}
      success-message=${props['success-message']}
      error-message=${props['error-message']}
      ?select-all=${props['select-all']}
      @sc-select=${(e: CustomEvent) => handleCustomEvent(e)}
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
    </sc-dropdown-multi-select>
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

export const CustomDropdown = CustomDropdownTemplate.bind({});

CustomDropdown.args = {
  data: customData,
};

const SelectAllTemplate: Story<ArgTypes> = (props: ArgTypes) => html`
  <div style="padding:20px 30px 100px; overflow: hidden; ${
  props['hoist'] ? 'border: 1px solid var(--sc-color-grey-25); padding: 1rem 1rem 100px' : ''
}">
    <sc-dropdown-multi-select 
      ?clearable=${props.clearable} 
      ?multiple-rows=${props['multiple-rows']} 
      label=${props.label} 
      label-size=${props['label-size']}
      size=${props['size']}
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
      hint=${props.hint}
      hint-placement=${props['hint-placement']}
      placeholder=${props['placeholder']}
      help-text=${props['help-text']}
      .value=${props['value']}
      .minCount=${props['min-count']}
      .maxCount=${props['max-count']}
      border-type=${props['border-type']}
      ?required=${props['required']}
      ?readonly=${props['readonly']}
      ?max-rows=${props['max-rows']} 
      readonly-rows=${props['readonly-rows']} 
      ?hide-tick-mark=${props['hide-tick-mark']}
      ?disabled=${props['disabled']}
      ?success=${props['success']}
      ?error=${props['error']}
      ?hoist=${props['hoist']}
      success-message=${props['success-message']}
      error-message=${props['error-message']}
      ?select-all=${props['select-all']}
      ?display-raw-value=${props['display-raw-value']}
      @sc-select=${(e: CustomEvent) => handleCustomEvent(e)}
    >
      <sc-dropdown-option value="english">English</sc-dropdown-option>
      <sc-dropdown-option value="mandarin">Mandarin</sc-dropdown-option>
      <sc-dropdown-option value="hindi">Hindi</sc-dropdown-option>
      <sc-dropdown-option value="spanish">Spanish</sc-dropdown-option>
      <sc-dropdown-option value="french">French</sc-dropdown-option>
      <sc-dropdown-option value="portugese">Portugese</sc-dropdown-option>
      <sc-dropdown-option value="thai">Thai</sc-dropdown-option>
      <sc-dropdown-option value="long">An extremely long dropdown option value</sc-dropdown-option>
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
      ${props['slot[name=\'empty-text\']']
    ? html`
                <div slot="empty-text">${props['slot[name=\'empty-text\']']}</div>
              ` 
    : '' 
}
      ${props['slot[name=\'side-sheet-content\']']
    ? html`
                <div slot="side-sheet-content">${props['slot[name=\'side-sheet-content\']']}</div>
              ` 
    : '' 
}
    </sc-dropdown-multi-select>
  </div>
`;

export const SelectAll = SelectAllTemplate.bind({});
SelectAll.args = {
  label: 'Dropdown',
  value: [],
  'select-all': true,
};

export const AutoCreateTag = Template.bind({});

AutoCreateTag.args = {
  label: 'Dropdown',
  error: false,
  success: false,
  readonly: false,
  required: false,
  value: [],
  'auto-create-tag': true,
};

export const SetMinMax = Template.bind({});

SetMinMax.args = {
  label: 'Set min/max',
  error: false,
  success: false,
  readonly: false,
  required: false,
  'min-count': 2,
  'max-count': 4,
  value: ['english'],
};

import { html, TemplateResult } from 'lit';
import { FormArgTypesWithSlot, FormArgTypes } from './utils/FormArg.js';
import { truncateArgType } from './utils/ArgTypes.js';
import { loremIpsum } from './utils/utils.js';

export default {
  title: 'Components/Button Group',
  component: 'sc-button-group',
  parameters: {
    docs: {
      description: {
        component:
          'Use Button Group component to combines a set of buttons that have similar or related functionality.',
      },
    },
    controls: {
      exclude: [
        'border-type',
        'placeholder',
        'success',
        'success-message',
        'slot',
        'sc-input',
        'sc-focus',
        'sc-blur',
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    ...FormArgTypesWithSlot('button group'),
    value: {
      control: 'text',
      description: 'The value of the button group.',
      table: {
        type: { summary: 'array' },
        category: 'Attributes',
      },
    },
    size: { 
      control: 'inline-radio',
      description:
        'The preferrred button group size.',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
        category: 'Attributes',
      },
    },
    ...truncateArgType(),
    'single-select': {
      control: 'boolean',
      description: 'Enables deselection in single-select mode.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'enable-deselect': {
      control: 'boolean',
      description: 'Enables deselection if multiple is not true.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
      if: { arg: 'single-select', truthy: true },
    },
    'sc-select': {
      description: `Emitted when selected items are changed. Get the index by event.detail.index and 
      get the value by event.detail.value and get the interacted element by event.detail.target`,
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    'slot[name=\'success\']': {
      table: {
        disable: true,
      },
    },
    'slot[name=\'prefix-icon\']': {
      table: {
        disable: true,
      },
    },
    'slot[name=\'empty-readonly\']': {
      control: 'text',
      description: 'Sets to customize display when empty and readonly',
      table: {
        category: 'Slots',
      }, 
    },
  },
  args: {
    size: 'md',
    label: '',
    'label-size': 'md',
    tooltip: '',
    'tooltip-placement': 'top',
    hint: '',
    'hint-placement': 'right',
    'help-text': '',
    value: [],
    'single-select': false,
    truncate: false,
    required: false,
    readonly: false,
    disabled: false,
    success: false,
    error: false,
    'error-message': '',
    'slot[name=\'label\']': '',
    'slot[name=\'label-tooltip\']': '',
    'slot[name=\'label-hint\']': '',
    'slot[name=\'help\']': '',
    'slot[name=\'error\']': '',    
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes extends FormArgTypes {
  size: string;
  value: any[] | any;
  'single-select'?: boolean;
  'enable-deselect'?: boolean;
  truncate?: boolean;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
<div style="padding: 20px 30px">
  <sc-button-group
    size=${props.size}
    label=${props.label} 
    label-size=${props['label-size']}
    ?truncate=${props.truncate}
    tooltip=${props.tooltip}
    tooltip-placement=${props['tooltip-placement']}
    hint=${props.hint}
    hint-placement=${props['hint-placement']}
    help-text=${props['help-text']}
    .value=${props['value']}
    ?single-select=${props['single-select']}
    ?enable-deselect=${props['enable-deselect']}
    ?required=${props['required']}
    ?readonly=${props['readonly']}
    ?disabled=${props['disabled']}
    ?error=${props['error']}
    error-message=${props['error-message']}    
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
    ${props['slot[name=\'error\']']
    ? html`
              <div slot="error">${props['slot[name=\'error\']']}</div>
            ` 
    : '' 
}
    <sc-button-group-item value='1'>Option A</sc-button-group-item>
    <sc-button-group-item value='2'>${props.truncate ? loremIpsum : 'Option B'}</sc-button-group-item>
    <sc-button-group-item value='3'>Option C</sc-button-group-item>
  </sc-button-group>
</div>
`;

const ItemDisabledTemplate: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-button-group
    size=${props.size}
    label-size=${props['label-size']}
    ?truncate=${props.truncate}
    tooltip=${props.tooltip}
    tooltip-placement=${props['tooltip-placement']}
    help-text=${props['help-text']}
    .value=${props['value']}
    ?required=${props['required']}
    ?readonly=${props['readonly']}
    ?disabled=${props['disabled']}
    ?error=${props['error']}
    error-message=${props['error-message']}
    ?single-select=${props['single-select']}
  >
    <sc-button-group-item value='1' disabled>Option A</sc-button-group-item>
    <sc-button-group-item value='2'>${props.truncate ? loremIpsum : 'Option B'}</sc-button-group-item>
    <sc-button-group-item value='3'>Option C</sc-button-group-item>
  </sc-button-group>
`;

export const Default = Template.bind({});
Default.args = {
  label: 'Select options',
  'single-select': false,
  'enable-deselect': false,
};

export const SingleSelect = Template.bind({});
SingleSelect.args = {
  label: 'Select options',
  value: ['1'],
  'single-select': true,
  truncate: true,
};

export const Readonly = Template.bind({});
Readonly.args = {
  label: 'Select options',
  value: ['1', '3'],
  'single-select': true,
  readonly: true,
  truncate: true,
};

export const ItemDisabled = ItemDisabledTemplate.bind({});
ItemDisabled.args = {
  value: '3',
};

export const Disabled = ItemDisabledTemplate.bind({});
Disabled.args = {
  disabled: true,
  value: '3',
};

export const Error = Template.bind({});
Error.args = {
  label: 'Select options',
  error: true,
  'error-message': 'There is an error with your selection',
};
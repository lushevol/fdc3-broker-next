import { html, TemplateResult } from 'lit';
import { truncateArgType } from './utils/ArgTypes.js';

export default {
  title: 'Components/Form Input/Input Group',
  component: 'sc-input-group',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'sc-input-group provides a layout wrapper of child inputs. \n' +
          'Can wrap sc-dropdown-input, sc-text-input, sc-number-input, sc-card-number-input, sc-time-input as child',
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'The title of label.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
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
    'label-size': {
      control: 'inline-radio',
      description: 'The preferrred label size. It\’s same with size property by default.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
      options: ['xxs', 'xs', 'sm', 'md', 'lg'],
    },
    tooltip: {
      control: 'text',
      description: 'Tooltip content.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'tooltip-placement': {
      control: 'inline-radio',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'The preferred placement of the tooltip.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'right' },
        category: 'Attributes',
      },
    },
    hint: {
      control: 'text',
      description: 'hint content.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'hint-placement': {
      control: 'inline-radio',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'The preferred placement of the hint.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'right' },
        category: 'Attributes',
      },
    },
    required: {
      control: 'boolean',
      description: 'Makes the input a required field.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    ...truncateArgType(),
    error: {
      control: 'boolean',
      description: 'Sets to display error state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'error-message': {
      control: 'text',
      description: 'The input’s error message.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    success: {
      control: 'boolean',
      description: 'Sets to display success state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'success-message': {
      control: 'text',
      description: 'The input’s success message.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'help-text': {
      control: 'text',
      description: 'The input’s help text.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    width: {
      control: 'text',
      description: 'The width of input group.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '100%' },
        category: 'Attributes',
      },
    },
    'slot[name=\'label\']': {
      control: 'text',
      description: 'Sets to customize the label of input group.',
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
  },
  args: {
    required: false,
    label: '',
    size: 'md',
    'label-size': '',
    truncate: false,
    tooltip: '',
    'tooltip-placement': 'top',
    hint: '',
    'hint-placement': 'right',
    error: false,
    'error-message': '',
    success: false,
    'success-message': '',
    'help-text': '',
    width: '100%',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  required?: boolean;
  label: string;
  'label-size': string;
  tooltip?: string;
  'tooltip-placement'?: string;
  hint?: string;
  'hint-placement'?: string;
  'help-text'?: string;
  'error-message'?: string;
  'success-message'?: string;
  error?: boolean;
  success?: boolean;
  truncate?: boolean;
  width: string;
  size?: string;
  'slot[name=\'label-tooltip\']': TemplateResult;
  'slot[name=\'label-hint\']': TemplateResult;
  'slot[name=\'help\']': TemplateResult;
  'slot[name=\'success\']': TemplateResult;
  'slot[name=\'error\']': TemplateResult;
}

const Template: Story<ArgTypes> = props =>
  html`
  <div style="padding: 20px 30px">
    <sc-input-group
      ?required=${props.required} 
      label=${props.label} 
      label-size=${props['label-size']} 
      tooltip=${props.tooltip} 
      tooltip-placement=${props['tooltip-placement']}
      hint=${props.hint} 
      hint-placement=${props['hint-placement']}
      ?error=${props.error} 
      ?success=${props.success}
      ?truncate=${props.truncate}
      error-message=${props['error-message']}
      help-text=${props['help-text']}
      success-message=${props['success-message']}
      width=${props.width}
      .size=${props.size}
    >
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
      <sc-text-input label='text input label'></sc-text-input>
      <sc-text-input></sc-text-input>
    </sc-input-group>
  </div>
  `;

export const Default = Template.bind({});
Default.args = {
  label: 'Label',
};

export const SizeSmall = Template.bind({});
SizeSmall.args = {
  label: 'Small',
  size: 'sm',
};

export const SizeLarge = Template.bind({});
SizeLarge.args = {
  label: 'Large',
  size: 'lg',
};

const CustomWidthTemplate: Story<ArgTypes> = (props: ArgTypes) =>
  html`
    <sc-input-group
      ?required=${props.required} 
      label=${props.label} 
      label-size=${props['label-size']} 
      tooltip=${props.tooltip} 
      tooltip-placement=${props['tooltip-placement']}
      hint=${props.hint} 
      hint-placement=${props['hint-placement']}
      ?error=${props.error} 
      ?success=${props.success}
      error-message=${props['error-message']}
      help-text=${props['help-text']}
      success-message=${props['success-message']}
      width=${props.width}
      .size=${props.size}
    >
        <sc-label label='Group label' required></sc-label>
        <sc-dropdown-input width="40%" label='Select from dropdown' error value='spanish' help-text='Help text'>
            <sc-dropdown-option value="english">English</sc-dropdown-option>
            <sc-dropdown-option value="mandarin">Mandarin</sc-dropdown-option>
            <sc-dropdown-option value="hindi">Hindi</sc-dropdown-option>
            <sc-dropdown-option value="spanish">Spanish</sc-dropdown-option>
            <sc-dropdown-option value="french">French</sc-dropdown-option>
            <div slot='empty-text'>No data, please try another value</div>
        </sc-dropdown-input>
        <sc-text-input width="60%" label='text input label'></sc-text-input>
    </sc-input-group>
  `;

export const CustomWidth = CustomWidthTemplate.bind({});
CustomWidth.args = {
  label: 'Label',
  width: '80%',
};

export const WithError = CustomWidthTemplate.bind({});
WithError.args = {
  label: 'Label',
  error: true,
  'error-message': 'Error message',
  'help-text': 'Group help text',
};


const CustomLabelTemplate: Story<ArgTypes> = (props: ArgTypes) =>
  html`
    <sc-input-group 
      ?required=${props.required} 
      label=${props.label} 
      label-size=${props['label-size']} 
      tooltip=${props.tooltip} 
      tooltip-placement=${props['tooltip-placement']}
      hint=${props.hint} 
      hint-placement=${props['hint-placement']}
      ?error=${props.error} 
      ?success=${props.success}
      error-message=${props['error-message']}
      help-text=${props['help-text']}
      success-message=${props['success-message']}
      width=${props.width}
      .size=${props.size}
    >
      <sc-label slot='label' label='Group label' tooltip='tooltip info' required></sc-label>
      <sc-text-input label='text input label' error type="password"></sc-text-input>
      <sc-card-number-input no-suffix-icon></sc-card-number-input>
      <sc-number-input ></sc-number-input>
      <sc-time-input error placeholder="Select time here" label='Time input'>
          <div slot="error">Error message</div>
      </sc-time-input>
    </sc-input-group>
  `;

export const CustomLabel = CustomLabelTemplate.bind({});
CustomLabel.args = {
};
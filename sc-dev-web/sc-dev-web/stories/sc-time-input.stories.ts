import { html, TemplateResult } from 'lit';
import { FormArgTypes, defaultArgsValue, FormInputBaseArgTypesWithSlot } from './utils/FormArg.js';

export default {
  title: 'Components/TimeInput',
  component: 'sc-time-input',
  parameters: {
    controls: {
      exclude: ['icon-size', 'text-align'],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    'hour-step': {
      control: 'number',
      description: 'The hour step.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 1 },
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
    hoist: { 
      control: 'boolean',
      description: 'Time panels will be clipped if they’re inside a container that has overflow: auto|hidden. The hoist attribute forces the panel to use a fixed positioning strategy, allowing it to break out of the container.', // eslint-disable-line
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'minute-step': {
      control: 'number',
      description: 'The minute step.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 1 },
        category: 'Attributes',
      },
    },
    'second-step': {
      control: 'number',
      description: 'The second step.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 1 },
        category: 'Attributes',
      },
    },
    'disabled-hours': {
      control: 'text',
      description: 'Sets to disable hours.',
      table: {
        type: { summary: 'array' },
        category: 'Attributes',
      },
    },
    'disabled-minutes': {
      control: 'text',
      description: 'Sets to disable minutes.',
      table: {
        type: { summary: 'array' },
        category: 'Attributes',
      },
    },
    'disabled-seconds': {
      control: 'text',
      description: 'Sets to disable seconds.',
      table: {
        type: { summary: 'array' },
        category: 'Attributes',
      },
    },
    format: {
      control: 'text',
      description: 'The time format, the values follow dayjs.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'HH:mm' },
        category: 'Attributes',
      },
    },
    seconds: {
      control: 'boolean',
      description: 'Sets to display second list.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    ...FormInputBaseArgTypesWithSlot('time input'),
    'sc-input': {
      description: 'Emitted when selects the time. Get the Date by event.detail.value.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
  },
  args: {
    'hour-step': 1,
    'minute-step': 1,
    'second-step': 1,
    'disabled-hours': '[]',
    'disabled-minutes': '[]',
    'disabled-seconds': '[]',
    format: '',
    clearable: false,
    hoist: false,
    slot: '',
    ...defaultArgsValue,
    'label-size': '',
    size: 'md',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes extends FormArgTypes {
  clearable?: boolean;
  hoist: boolean;
  'hour-step': number,
  'minute-step': number,
  'second-step': number,
  'disabled-hours': string,
  'disabled-minutes': string,
  'disabled-seconds': string,
  format: string,
  seconds: boolean,
  size?: string;
  'icon-size'?: string;
  'text-align'?: string;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => {
  return html`
  <div style='height: 400px;padding: 20px 30px;'>
    <sc-time-input
      class='sc-time-input'
      ?clearable=${props.clearable}
      ?hoist=${props.hoist}
      label=${props.label}
      ?seconds=${props.seconds}
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
      hour-step=${props['hour-step'] || 1}
      minute-step=${props['minute-step'] || 1}
      second-step=${props['second-step'] || 1}
      disabled-hours=${props['disabled-hours'] || '[]'}
      disabled-minutes=${props['disabled-minutes'] || '[]'}
      disabled-seconds=${props['disabled-seconds'] || '[]'}
      format=${props.format || 'HH:mm'}
      ?required=${props['required']}
      ?readonly=${props['readonly']}
      ?disabled=${props['disabled']}
      ?success=${props['success']}
      ?error=${props['error']}
      success-message=${props['success-message']}
      error-message=${props['error-message']}
      size=${props.size}
      icon-size=${props['icon-size']}
      text-align=${props['text-align']}
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
    </sc-time-input>
  </div>
`;
};

export const Default = Template.bind({});

Default.args = {
  label: 'Time input',
  value: '',
  seconds: false,
  error: false,
  success: false,
  required: false,
  readonly: false,
};

export const SizeSmall = Template.bind({});
SizeSmall.args = {
  label: 'Small time input',
  placeholder: 'Please select time',
  value: '',
  size: 'sm',
  seconds: false,
  error: false,
  success: false,
  required: false,
  readonly: false,
};

export const SizeLarge = Template.bind({});
SizeLarge.args = {
  label: 'Large time input',
  placeholder: 'Please select time',
  value: '',
  size: 'lg',
  seconds: false,
  error: false,
  success: false,
  required: false,
  readonly: false,
};

export const CustomFormat = Template.bind({});

CustomFormat.args = {
  label: 'Time input',
  format: 'HH:mm:ss',
  value: '',
  seconds: true,
  clearable: true,
  error: false,
  success: false,
  required: false,
  readonly: false,
};

export const DefaultValue = Template.bind({});
DefaultValue.args = {
  label: 'Time input',
  placeholder: 'Please select time',
  format: 'HH:mm:ss',
  value: '15:30:00',
  clearable: true,
  seconds: true,
  error: false,
  success: false,
  required: false,
  readonly: false,
  'help-text': `The default value should following the format you set,
    e.g if the format is hh:mm:ss a,the value should be like: 07:25:00 pm`,
};

export const WithAMPM = Template.bind({});
WithAMPM.args = {
  label: 'Time input with AM PM',
  format: 'hh:mm:ss A',
  value: '03:30:00 pm',
  clearable: true,
  seconds: true,
  error: false,
  success: false,
  required: false,
  readonly: false,
};

export const TimeInputWithError = Template.bind({});
TimeInputWithError.args = {
  label: 'Time input with error',
  format: 'hh:mm:ss A',
  seconds: true,
  clearable: true,
  value: '11:11:11 pm',
  error: true,
  'error-message': 'invalid time format',
};

export const DisabledItem = Template.bind({});
DisabledItem.args = {
  label: 'Time input with AM PM',
  placeholder: 'Please select time',
  format: 'hh:mm:ss A',
  value: '03:30:00 pm',
  'disabled-hours': '[5, 10, 15]',
  'disabled-minutes': '[2, 10, 20]',
  clearable: true,
  seconds: true,
  error: false,
  success: false,
  required: false,
  readonly: false,
};

export const DisabledTimeInput = Template.bind({});
DisabledTimeInput.args = {
  label: 'Time input with AM PM',
  format: 'hh:mm:ss A',
  value: '03:30:00 pm',
  disabled: true,
  error: false,
};

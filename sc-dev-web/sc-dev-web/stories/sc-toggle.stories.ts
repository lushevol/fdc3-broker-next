import { html, TemplateResult } from 'lit';
import { FormArgTypesWithSlot, FormArgTypes } from './utils/FormArg.js';

export default {
  title: 'Components/Toggle',
  component: 'sc-toggle',
  parameters: {
    docs: {
      description: {
        component:
          'Use toggle to quickly switch between multiple possible states.',
      },
    },
    controls: {
      exclude: [
        'placeholder',
        'border-type',
        'slot',
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      description: 'Sets the size of toggle label.',
      options: ['xxs', 'xs', 'sm', 'md', 'lg'],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'xs' },
        category: 'Attributes',
      },
    },
    'sc-select': {
      description: 'Emitted when the option changes. Get the selected value by event.detail.value.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    ...FormArgTypesWithSlot('card number input'),
  },
  args: {
    label: '',
    'label-size': 'sm',
    tooltip: '',
    'tooltip-placement': 'top',
    hint: '',
    'hint-placement': 'right',
    'help-text': '',
    value: '',
    size: 'xs',
    required: false,
    readonly: false,
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
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes extends FormArgTypes {
  size?: string;
}

const Template: Story<ArgTypes> = (props: ArgTypes) =>
  html`
  <div style="padding: 20px 30px">
    <sc-toggle
      label=${props.label}
      label-size=${props['label-size']}
      tooltip=${props.tooltip}
      tooltip-placement=${props['tooltip-placement']}
      hint=${props.hint}
      hint-placement=${props['hint-placement']}
      placeholder=${props['placeholder']}
      help-text=${props['help-text']}
      value=${props['value']}
      size=${props['size']}
      ?required=${props['required']}
      ?readonly=${props['readonly']}
      ?disabled=${props['disabled']}
      ?truncate=${props['truncate']}
      ?success=${props['success']}
      ?error=${props['error']}
      success-message=${props['success-message']}
      error-message=${props['error-message']}
    >
      <sc-toggle-option value="light">
        Light
      </sc-toggle-option>
      <sc-toggle-option value="dark">
        Dark
      </sc-toggle-option>
      <sc-toggle-option value="auto">
        Auto
      </sc-toggle-option>
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
    </sc-toggle>
  </div>
  `;

export const Default = Template.bind({});
Default.args = {
  label: 'Select your preferred mode',
};

export const Error = Template.bind({});
Error.args = {
  label: 'Select your preferred mode',
  'help-text': 'Choose between light mode, dark mode or system select.',
  error: true,
  'error-message': 'Please select valid mode',
  required: true,
};

export const HTML = Template.bind({});
HTML.args = {
  'label-size': 'sm',
  value: 'dark',
  'slot[name=\'label\']': html`
    Your <strong>preferred</strong> mode
  `,
  'slot[name=\'label-tooltip\']': html`
    Make sure you select <strong>one</strong> only
  `,
  'slot[name=\'help\']': html`
    Choose between <strong>light mode</strong>, <strong>dark mode</strong> or <strong>system select</strong>.
  `,
};

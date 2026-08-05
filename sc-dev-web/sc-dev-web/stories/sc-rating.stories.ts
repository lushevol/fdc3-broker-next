import { html, TemplateResult } from 'lit';
import { FormArgTypesWithSlot, FormArgTypes } from './utils/FormArg.js';

export default {
  title: 'Components/Rating',
  component: 'sc-rating',
  tags: ['autodocs'],
  parameters: {
    controls: {
      exclude: [
        'border-type',
      ],
    },
  },
  argTypes: {
    mode: {
      control: 'inline-radio',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
        defaultValue: { summary: 'default' },
      },
      options: ['default', 'button'],
    },
    max: {
      control: 'number',
      min: 1,
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
    },
    size: {
      control: 'inline-radio',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'lg' },
        category: 'Attributes',
      },
      options: ['xxs', 'xs', 'sm', 'md', 'lg'],
      if: { arg: 'mode', eq: 'default' },
    },
    ...FormArgTypesWithSlot('rating'),
    value: {
      control: 'number',
      min: 0,
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
    },
    'first-lower-text': { 
      control: 'text',
      description: 'Set the first lower text (\'Least likely\').',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'last-lower-text': { 
      control: 'text',
      description: 'Set the last lower text (\'Most likely\').',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    options: {
      control: 'text',
      table: {
        type: { summary: 'array' },
        category: 'Attributes',
      },
      if: { arg: 'mode', eq: 'button' },
    },
    inline: {
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'sc-change': {
      description: 'Emitted when the selected item changes. Get the current rating by event.detail.value.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
  },
  args: {
    mode: 'default',
    max: 5,
    size: 'lg',
    value: 0,
    inline: false,
    label: '',
    'label-size': 'md',
    tooltip: '',
    'tooltip-placement': 'top',
    hint: '',
    'hint-placement': 'right',
    required: false,
    'help-text': '',
    placeholder: '',
    readonly: false,
    disabled: false,
    success: false,
    error: false,
    'first-lower-text': '',
    'last-lower-text': '',
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
  size?: string;
  options?: string;
  mode: string;
  'first-lower-text': string;
  'last-lower-text': string;
  value?: number;
  max?: number;
  readonly?: boolean;
  inline?: boolean;
}

const Template: Story<ArgTypes> = ({
  size = 'lg',
  mode = 'default',
  options,
  value = 0,
  max = 5,
  readonly = false,
  inline = false,
  ...props
}: ArgTypes) => html`
${(() => {
  const defaultFirstLowerText =
    mode === 'button'
      ? props['first-lower-text'] || 'Least likely'
      : props['first-lower-text'];
  const defaultLastLowerText =
    mode === 'button'
      ? props['last-lower-text'] || 'Most likely'
      : props['last-lower-text'];
  return html`
<div style="padding: 20px 30px">
  <sc-rating
    size=${size}
    value=${value}
    max=${max}
    mode=${mode}
    options=${options}
    ?readonly=${readonly}
    ?inline=${inline}
    label=${props.label} 
    label-size=${props['label-size']}
    first-lower-text=${defaultFirstLowerText}
    last-lower-text=${defaultLastLowerText}
    tooltip=${props.tooltip}
    tooltip-placement=${props['tooltip-placement']}
    hint=${props.hint}
    hint-placement=${props['hint-placement']}
    placeholder=${props['placeholder']}
    help-text=${props['help-text']}
    border-type=${props['border-type']}
    ?required=${props['required']}
    ?disabled=${props['disabled']}
    ?success=${props['success']}
    ?error=${props['error']}
    ?truncate=${props['truncate']}
    success-message=${props['success-message']}
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
  </sc-rating>
</div>
  `;
})()}
`;

export const Default = Template.bind({});
Default.args = {
  size: 'lg',
};

export const Readonly = Template.bind({});
Readonly.args = {
  size: 'lg',
  readonly: true,
};

export const ButtonMode = Template.bind({});
ButtonMode.args = {
  mode: 'button',
  max: 10,
};

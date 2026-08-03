import { html, TemplateResult } from 'lit';

export default {
  title: 'Components/Copy',
  component: 'sc-copy',
  parameters: {
    docs: {
      description: {
        component:
          'Copies text data to the clipboard when the user clicks the trigger.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['default', 'text'],
      description: 'The preferred mode of the copy button.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
        category: 'Attributes',
      },
    },
    'tooltip-placement': {
      control: 'inline-radio',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'The preferred placement of the tooltip.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'top' },
        category: 'Attributes',
      },
      if: { arg: 'mode', eq: 'default' },
    },
    'help-text': {
      control: 'text',
      description: 'A custom message to show in the tooltip.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
      if: { arg: 'mode', eq: 'default' },
    },
    label: {
      control: 'text',
      description: 'Label to show on screen.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
      if: { arg: 'mode', eq: 'text' },
    },
    value: {
      control: 'text',
      description: 'The text value to copy.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the copy button.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      },
    },
    'success-message': {
      control: 'text',
      description: 'A custom message to show after copying.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
      if: { arg: 'mode', eq: 'text' },
    },
    'error-message': {
      control: 'text',
      description: 'A custom message to show when a copy error occurs.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
      if: { arg: 'mode', eq: 'text' },
    },
    'feedback-duration': {
      control: 'number',
      description:
        'The length of time (milliseconds) to show feedback before restoring the default trigger.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 1000 },
        category: 'Attributes',
      },
    },
    from: {
      control: 'text',
      description:
        'An id that references an element in the same document from which data will be copied. ' +
        'If both this and value are present, this value will take precedence. ' +
        'To copy an attribute, append the attribute name wrapped in square brackets, e.g. from="el[value]". ' +
        'To copy a property, append a dot and the property name, e.g. from="el.value"',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'slot[name=\'help-text\']': {
      control: 'text',
      description: 'Sets to customize the tooltip help text.',
      table: {
        category: 'Slots',
      },
      if: { arg: 'mode', eq: 'default' },
    },
    'slot[name=\'label\']': {
      control: 'text',
      description: 'Sets to customize the copy icon or label.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'copy-success\']': {
      control: 'text',
      description: 'Sets to customize the copy success icon.',
      table: {
        category: 'Slots',
      },
    },
    'slot[name=\'copy-error\']': {
      control: 'text',
      description: 'Sets to customize the copy error icon.',
      table: {
        category: 'Slots',
      },
    },
  },
  args: {
    mode: 'default',
    'tooltip-placement': 'top',
    'help-text': '',
    label: '',
    value: '',
    'success-message': '',
    'error-message': '',
    'feedback-duration': 1000,
    from: '',
    disabled: false,
    'slot[name=\'help-text\']': '',
    'slot[name=\'label\']': '',
    'slot[name=\'copy-success\']': '',
    'slot[name=\'copy-error\']': '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
}

interface ArgTypes {
  mode: string;
  'tooltip-placement'?: string;
  'help-text'?: string;
  label?: string;
  value?: string;
  disabled?: boolean;
  'success-message'?: string;
  'error-message'?: string;
  'feedback-duration'?: number;
  from?: string;
  'slot[name=\'help-text\']'?: TemplateResult;
  'slot[name=\'label\']'?: TemplateResult;
  'slot[name=\'copy-success\']'?: TemplateResult;
  'slot[name=\'copy-error\']'?: TemplateResult;
}

const Template: Story<ArgTypes> = (props: ArgTypes) =>
  props.mode === 'default'
    ? html`
        <div style="position:relative; display: flex">
          <sc-copy
            mode="default"
            tooltip-placement=${props['tooltip-placement']}
            ?disabled=${props.disabled}
            help-text=${props['help-text']}
            error-message=${props['error-message']}
            success-message=${props['success-message']}
            feedback-duration=${props['feedback-duration']}
            from=${props.from}
            value=${props.value}
          >
            ${props['slot[name=\'help-text\']']              
    ? html`<div slot="help-text">${props['slot[name=\'help-text\']']}</div>`
    : ''
}        
            ${props['slot[name=\'copy-success\']']
    ? html`<div slot="copy-success">${props['slot[name=\'copy-success\']']}</div>`
    : ''
}
            ${props['slot[name=\'copy-error\']']
    ? html`<div slot="copy-error">${props['slot[name=\'copy-error\']']}</div>`
    : ''
}
          </sc-copy>
          <span id="copy-el" style="color: var(--sc-copy-display-message); font-size: 0.875rem"
            >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua</span
          >
        </div>
      `
    : html`
        <div>
          <sc-copy
            mode="text"
            label=${props.label}
            ?disabled=${props.disabled}
            error-message=${props['error-message']}
            success-message=${props['success-message']}
            from=${props.from}
            value=${props.value}
          >
            ${props['slot[name=\'help-text\']']              
    ? html`<div slot="help-text">${props['slot[name=\'help-text\']']}</div>`
    : ''
}            
            ${props['slot[name=\'label\']']
    ? html`<div slot="label">${props['slot[name=\'label\']']}</div>`
    : ''
}
            ${props['slot[name=\'copy-success\']']
    ? html`<div slot="copy-success">${props['slot[name=\'copy-success\']']}</div>`
    : ''
}
            ${props['slot[name=\'copy-error\']']
    ? html`<div slot="copy-error">${props['slot[name=\'copy-error\']']}</div>`
    : ''
}
          </sc-copy>
          <br />
          <span id="copy-el" style="color:  var(--sc-copy-display-message)"
            >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua</span
          >
        </div>
      `;

export const Default = Template.bind({});
Default.args = {
  mode: 'default',
  from: 'copy-el',
};

export const Error = Template.bind({});
Error.args = {
  mode: 'default',
};

export const Disabled = Template.bind({});
Disabled.args = {
  mode: 'default',
  from: 'copy-el',
  disabled: true,
};

export const CustomMessage = Template.bind({});
CustomMessage.args = {
  mode: 'default',
  from: 'copy-el',
  'help-text': 'Click to copy',
  'success-message': 'Copied successfully!',
};

export const TextDefault = Template.bind({});
TextDefault.args = {
  mode: 'text',
  from: 'copy-el',
};

export const TextError = Template.bind({});
TextError.args = {
  mode: 'text',
};

export const TextDisabled = Template.bind({});
TextDisabled.args = {
  mode: 'text',
  from: 'copy-el',
  disabled: true,
};

export const TextCustomMessage = Template.bind({});
TextCustomMessage.args = {
  mode: 'text',
  from: 'copy-el',
  label: 'Click to copy',
  'success-message': 'Copied successfully!',
};

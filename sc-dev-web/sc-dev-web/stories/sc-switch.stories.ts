import { html, TemplateResult } from 'lit';
import { FormArgTypesWithoutEvent, FormArgTypes } from './utils/FormArg.js';

export default {
  title: 'Components/Switch',
  component: 'sc-switch',
  parameters: {
    docs: {
      description: {
        component:
          'Switches toggle the state of a single setting on or off.',
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
    'label-position': {
      control: 'inline-radio',
      options: ['top', 'left', 'right'],
      description: 'The preferred placement of the label.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'right' },
        category: 'Attributes',
      },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the switch.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'sm' },
        category: 'Attributes',
      },
    },
    checked: { 
      control: 'boolean', 
      description: 'Draws the switch in a checked state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    loading: { 
      control: 'boolean', 
      description: 'Draws the switch in a loading state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    'text-icon-label': {
      control: 'inline-radio',
      options: [null, 'text-label', 'icon-label'],
      description: 'The preferred type of inner label.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: null },
        category: 'Attributes',
      },
      if: { arg: 'size', eq: 'lg' },
    },
    'sc-change': {
      description: 'Emitted when switch the option. Get the state by event.detail.checked.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
    ...FormArgTypesWithoutEvent('switch'),
    success: {
      table: {
        disable: true,
      },
    },
    'success-message': {
      table: {
        disable: true,
      },
    },
    'slot[name=\'success\']': {
      table: {
        disable: true,
      },
    },
    error: {
      table: {
        disable: true,
      },
    },
    'error-message': {
      table: {
        disable: true,
      },
    },
    'slot[name=\'error\']': {
      table: {
        disable: true,
      },
    },
  },
  args: {
    label: '',
    'label-size': 'md',
    'label-position': 'right',
    tooltip: '',
    'tooltip-placement': 'top',
    hint: '',
    'hint-placement': 'right',
    'help-text': '',
    value: '',
    size: 'sm',
    checked: false,    
    required: false,
    readonly: false,
    disabled: false,
    loading: false,
    'text-icon-label': null,
    'slot[name=\'label\']': '',
    'slot[name=\'label-tooltip\']': '',
    'slot[name=\'label-hint\']': '',
    'slot[name=\'help\']': '',
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes extends FormArgTypes {
  'label-position'?: string;
  size?: string;
  checked?: boolean;
  loading?: boolean;
  'text-icon-label'?: string;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => html`
<div style="padding: 20px 0">
  <sc-switch 
    label=${props.label} 
    label-size=${props['label-size']}
    label-position=${props['label-position']}
    tooltip=${props.tooltip}
    tooltip-placement=${props['tooltip-placement']}
    hint=${props.hint}
    hint-placement=${props['hint-placement']}
    help-text=${props['help-text']}
    value=${props['value']}
    size=${props['size']}
    ?checked=${props.checked}
    ?required=${props['required']}
    ?readonly=${props['readonly']}
    ?disabled=${props['disabled']}
    ?truncate=${props['truncate']}
    ?loading=${props.loading}
    text-icon-label=${props['text-icon-label']}
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
    ${props.slot}
  </sc-switch>
</div>
`;

export const Default = Template.bind({});
Default.args = {
  label: 'Turn on auto pilot?',
  'help-text': 'When turned on, system auto monitor and generate report.',
  value: 'on',  
};

export const LabelTop = Template.bind({});
LabelTop.args = {
  label: 'Turn on auto pilot?',
  'label-position': 'top',
  'help-text': 'When turned on, system auto monitor and generate report.',
  value: 'on',  
};

export const LabelLeft = Template.bind({});
LabelLeft.args = {
  label: 'Turn on auto pilot?',
  'label-position': 'left',
  'help-text': 'When turned on, system auto monitor and generate report.',
  value: 'on',  
};

export const LabelRight = Template.bind({});
LabelRight.args = {
  label: 'Turn on auto pilot?',
  'label-position': 'right',
  'help-text': 'When turned on, system auto monitor and generate report.',
  value: 'on',  
};

export const TextLabel = Template.bind({});
TextLabel.args = {
  size: 'lg',
  label: 'Turn on auto pilot?',
  'help-text': 'When turned on, system auto monitor and generate report.',
  value: 'on',
  'text-icon-label': 'text-label',
};

export const IconLabel = Template.bind({});
IconLabel.args = {
  size: 'sm',
  label: 'Turn on auto pilot?',
  'help-text': 'When turned on, system auto monitor and generate report.',
  value: 'on',
  'text-icon-label': 'icon-label',
};

export const Loading = Template.bind({});
Loading.args = {
  label: 'Turn on auto pilot?',
  'help-text': 'When turned on, system auto monitor and generate report.',
  value: 'on',
  loading: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Turn on auto pilot?',
  'help-text': 'When turned on, system auto monitor and generate report.',
  value: 'on',
  disabled: true,
};

export const HTML = Template.bind({});
HTML.args = {
  'label-size': 'md',
  value: 'on',
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
import { html, nothing, TemplateResult } from 'lit';
import { FormArgTypes, removeUndefined } from './utils/FormArg.js';
import { ifDefined } from 'lit/directives/if-defined.js';

export default {
  title: 'Components/Slider',
  component: 'sc-slider',
  parameters: {
    docs: {
      description: {
        component: 'A flexible slider component supporting number, range, and string types.',
      },
    },
    controls: {
      exclude: ['stops'],
    },
  },
  tags: ['autodocs'],
  argTypes: removeUndefined({
    ...FormArgTypes('slider'),
    'border-type': undefined,
    placeholder: undefined,
    value: {
      control: 'object',
      description: 'Current value of the slider. For range, use [min, max].',
      table: {
        type: { summary: 'number | string | [number, number]' },
        category: 'Attributes',
      },
    },
    type: {
      control: 'inline-radio',
      options: ['number', 'range', 'string'],
      description: 'Type of the slider.',
      table: {
        type: { summary: '"number" | "range" | "string"' },
        category: 'Attributes',
      },
    },
    min: {
      control: 'number',
      description: 'Minimum value.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
      if: { arg: 'type', neq: 'string' },
    },
    max: {
      control: 'number',
      description: 'Maximum value.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
      if: { arg: 'type', neq: 'string' },
    },
    step: {
      control: 'number',
      description: 'Step size.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
      if: { arg: 'type', neq: 'string' },
    },
    'stop-step': {
      control: 'number',
      description: 'Interval for rendering stops.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
      if: { arg: 'type', neq: 'string' },
    },
    'no-badge': {
      control: 'boolean',
      description: 'Hide tooltip. Always true when type=string.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
      if: { arg: 'type', neq: 'string' },
    },
    'no-input': {
      control: 'boolean',
      description: 'Hide input fields. Always true when type=string.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
      if: { arg: 'type', neq: 'string' },
    },
    realtime: {
      control: 'boolean',
      description: 'Emit change event in while dragging. Otherwise emit only after dragging.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
    },
    compact: {
      control: 'boolean',
      description:
        'Removes excess margin when label is empty. ' +
        'Always true when type=string. Warn: Badge can overflow above.',
      table: {
        type: { summary: 'boolean' },
        category: 'Attributes',
      },
      if: { arg: 'label', eq: '' },
    },
    'sc-change': {
      description: 'Emitted when the slider value changes. Get value from event.detail.value.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      },
    },
    slot: {
      control: 'object',
      description: 'Sets to customize content. Use sc-slider-stop for string type.',
      table: {
        category: 'Slots',
      },
    },
  }),
  args: {
    value: 50,
    type: 'number',
    min: 0,
    max: 100,
    step: 1,
    'stop-step': undefined,
    'no-badge': false,
    'no-input': false,
    compact: false,
    realtime: false,
    disabled: false,
    readonly: false,
    label: 'Slider',
    error: false,
    success: false,
  },
};


interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes extends FormArgTypes {
  value?: number | string | [number, number];
  type: 'string' | 'number' | 'range';
  min?: number;
  max?: number;
  step?: number;
  'stop-step'?: number;
  'no-badge'?: boolean;
  'no-input'?: boolean;
  compact?: boolean;
  realtime?: boolean;
  slot?: TemplateResult;
}

const Template: Story<ArgTypes> = (args: ArgTypes): TemplateResult => html`
  <sc-slider
    .value=${args.value ?? ''}
    type=${args.type}
    min=${ifDefined(args.min)}
    max=${ifDefined(args.max)}
    step=${ifDefined(args.step)}
    ?no-badge=${args['no-badge']}
    ?no-input=${args['no-input']}
    ?compact=${args.compact}
    ?realtime=${args.realtime}
    ?disabled=${args.disabled}
    ?readonly=${args.readonly}
    ?truncate=${args.truncate}
    label=${ifDefined(args.label)}
    label-size=${ifDefined(args['label-size'])}
    ?error=${args.error}
    error-message=${ifDefined(args['error-message'])}
    ?success=${args.success}
    success-message=${ifDefined(args['success-message'])}
    hint=${ifDefined(args.hint)}
    hint-placement=${ifDefined(args['hint-placement'])}
    ?required=${args.required}
    help-text=${ifDefined(args['help-text'])}
    tooltip=${args.tooltip ?? ''}
    tooltip-placement=${ifDefined(args['tooltip-placement'])}
    stop-step=${ifDefined(args['stop-step'])}
    @sc-change=${(e: CustomEvent) => {
      // For Storybook action panel
      // eslint-disable-next-line no-console
      console.log('sc-change', e.detail.value);
    }}
  >
    ${args['slot'] ?? ''}
  </sc-slider>
`;

export const Default = Template.bind({});

export const Range = Template.bind({});
Range.args = {
  value: [20, 80],
  type: 'range',
  label: 'Range',
  min: 0,
  max: 100,
  step: 1,
};

export const StringStops = Template.bind({});
StringStops.args = {
  value: 'm',
  type: 'string',
  label: 'string stops',
  slot: html`<sc-slider-stop value="l">Low</sc-slider-stop>
    <sc-slider-stop value="m">Medium</sc-slider-stop>
    <sc-slider-stop value="h">High</sc-slider-stop>
    <sc-slider-stop value="vh">Very High</sc-slider-stop>`,
};

export const WithStops = Template.bind({});
WithStops.args = {
  value: 50,
  type: 'number',
  label: 'with step stops',
  'stop-step': 20,
  step: 5,
};
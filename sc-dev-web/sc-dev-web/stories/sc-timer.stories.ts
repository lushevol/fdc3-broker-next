import { html, TemplateResult } from 'lit';
import { truncateArgType } from './utils/ArgTypes.js';

export default {
  title: 'Components/Timer',
  component: 'sc-timer',
  parameters: {
    docs: {
      description: {
        component:
          'Timer component are use to indicate movement of time for a process that is taken place.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    'duration-value': {
      control: 'text',
      description:
        'Used to specify duration value in seconds or minutes or hours.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'duration-unit': {
      control: 'text',
      description:
        'Used to specify duration unit with second or minute or hour.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    label: {
      control: 'text',
      description: 'Used to specific label and description.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    'need-hour-digit': {
      control: 'boolean',
      description: 'Used to specify whether hour digit is required or not.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Attributes',
      },
    },
    'no-background': {
      control: 'boolean',
      description: 'Used to specify whether background is needed or not.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Attributes',
      },
    }, 
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Used to specify size in terms of height.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'sm' },
        category: 'Attributes',
      },
    },
    'state-interval-time': {
      control: 'number',
      description:
        'Used to specify interval time between states default, warning and alert in seconds.',
      table: {
        type: { summary: 'number' },
        category: 'Attributes',
      },
    },
    'time-out-message': {
      control: 'text',
      description:
        'Used to specify timeout message which is displayed after time out, instead of label.',
      table: {
        type: { summary: 'string' },
        category: 'Attributes',
      },
    },
    ...truncateArgType(),
    'sc-timer-start': {
      description: 'Emitted when the timer starts.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
    'sc-timer-end': {
      description: 'Emitted when the timer ends.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
    'sc-timer-tick': {
      description: 'Emitted when there is a state change between default, warning and alert.',
      table: {
        type: { summary: 'CustomEvent' },
        category: 'Custom Events',
      }, 
    },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  'duration-value'?: number;
  'duration-unit'?: string;
  label?: string;
  'need-hour-digit'?: boolean;
  size?: string;
  'state-interval-time'?: number;
  'time-out-message'?: string;
  'no-background'?: boolean;
  truncate?: boolean;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => {
  return html`
    <sc-timer
      duration-value=${props['duration-value']}
      duration-unit=${props['duration-unit']}
      label=${props['label']}
      ?need-hour-digit=${props['need-hour-digit']}
      ?no-background=${props['no-background']}
      ?truncate=${props['truncate']}
      size=${props['size']}
      state-interval-time=${props['state-interval-time']}
      time-out-message=${props['time-out-message']}
    ></sc-timer>
  `;
};

export const Timer = Template.bind({});
Timer.args = {
  'duration-value': 15,
  'duration-unit': 'second',
  label: 'Timer',
  'need-hour-digit': false,
  'no-background': false,
  size: 'sm',
  'state-interval-time': 5,
  'time-out-message': 'Submission time out. Please resubmit the form again',
};

const TimerwithHourdigitTemplate: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-timer
    duration-value=${props['duration-value']}
    duration-unit=${props['duration-unit']}
    label=${props['label']}
    ?need-hour-digit=${props['need-hour-digit']}
    ?no-background=${props['no-background']}
    ?truncate=${props['truncate']}
    size=${props['size']}
    state-interval-time=${props['state-interval-time']}
    time-out-message=${props['time-out-message']}
  ></sc-timer>
`;

export const TimerWithHourDigit = TimerwithHourdigitTemplate.bind({});
TimerWithHourDigit.args = {
  'duration-value': 2,
  'duration-unit': 'hour',
  label: 'Timer with Hour digit',
  'need-hour-digit': true,
  'no-background': false,
  size: 'sm',
  'state-interval-time': 2400,
  'time-out-message': 'Submission time out. Please resubmit the form again',
};

const TimerWithDifferentSizesTemplate: Story<ArgTypes> = (
  props: ArgTypes
) => html`
  <sc-timer
    duration-value=${props['duration-value']}
    duration-unit=${props['duration-unit']}
    label=${props['label']}
    ?need-hour-digit=${props['need-hour-digit']}
    ?no-background=${props['no-background']}
    ?truncate=${props['truncate']}
    size=${props['size']}
    state-interval-time=${props['state-interval-time']}
    time-out-message=${props['time-out-message']}
  ></sc-timer>
`;

export const SmallTimer = TimerWithDifferentSizesTemplate.bind({});
SmallTimer.args = {
  'duration-value': 15,
  'duration-unit': 'second',
  label: 'This is small size',
  'need-hour-digit': false,
  'no-background': false,
  size: 'sm',
  'state-interval-time': 5,
  'time-out-message': 'Submission time out. Please resubmit the form again',
};

export const LargeTimer = TimerWithDifferentSizesTemplate.bind({});
LargeTimer.args = {
  'duration-value': 2,
  'duration-unit': 'minute',
  label: 'This is large size',
  'need-hour-digit': false,
  'no-background': false,
  size: 'lg',
  'state-interval-time': 40,
  'time-out-message': 'Submission time out. Please resubmit the form again',
};

const NoBackgroundTemplate: Story<ArgTypes> = (
  props: ArgTypes
) => html`
  <sc-timer
    duration-value=${props['duration-value']}
    duration-unit=${props['duration-unit']}
    label=${props['label']}
    ?need-hour-digit=${props['need-hour-digit']}
    ?no-background=${props['no-background']}
    ?truncate=${props['truncate']}
    size=${props['size']}
    state-interval-time=${props['state-interval-time']}
    time-out-message=${props['time-out-message']}
  ></sc-timer>
`;

export const NoBackground = NoBackgroundTemplate.bind({});
NoBackground.args = {
  'duration-value': 30,
  'duration-unit': 'second',
  label: 'No background',
  'need-hour-digit': false,
  'no-background': true,
  size: 'sm',
  'state-interval-time': 10,
  'time-out-message': 'Submission time out. Please resubmit the form again',
};
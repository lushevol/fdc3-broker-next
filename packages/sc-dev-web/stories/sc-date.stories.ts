import { html, TemplateResult } from 'lit';
import { Dayjs } from 'dayjs';

export default {
  title: 'Components/Date Display',
  component: 'sc-date',
  parameters: {
    docs: {
      description: {
        component:
          'Date component are use to convert time format to the bank standard format',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    date: {
      control: 'text',
      description:
        'Used to input a time date, support string, number, Date, Dayjs type.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '2025-06-16T09:05:52.831Z' },
        category: 'Attributes',
      },
    },
    'date-type': { 
      control: 'inline-radio',
      options: ['full-date', 'short-date'],
      description: 'The date format type.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'full-date' },
        category: 'Attributes',
      },
    },
    'show-time': { 
      control: 'boolean', 
      description: 'Date displays year, month, day with hours, minutes, seconds or not.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    'time-only': { 
      control: 'boolean', 
      description: 'Date only displays hours, minutes, seconds or not.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    'hide-seconds': { 
      control: 'boolean', 
      description: 'Date hidden in seconds or not.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    'show-timezone': { 
      control: 'boolean', 
      description: 'Date show timezone or not.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'Attributes',
      }, 
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Used to specify font size.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
        category: 'Attributes',
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
  'date'?: string | number | Date | Dayjs;
  'date-type'?: string;
  'show-time'?: boolean;
  'time-only'?: boolean;
  'hide-seconds'?: boolean;
  'show-timezone'?: boolean;
  size?: string;
}

const Template: Story<ArgTypes> = (props: ArgTypes) => {
  return html`
    <sc-date
      date=${props['date'] as string}
      date-type=${props['date-type'] as 'full-date'}
      ?show-time=${props['show-time']}
      ?time-only=${props['time-only']}
      ?hide-seconds=${props['hide-seconds']}
      ?show-timezone=${props['show-timezone']}
      size=${props.size as string}
    ></sc-date>
  `;
};

export const Default = Template.bind({});
Default.args = {
  date: '2025-06-16T09:05:52.831Z',
  'date-type': 'full-date',
  'show-time': false,
  'time-only': false,
  'hide-seconds': false,
  'show-timezone': false,
  size: 'md',
};

const DateWithShortDateTemplate: Story<ArgTypes> = (props: ArgTypes) => html`
  <sc-date
      date=${props['date'] as string}
      date-type=${props['date-type'] as 'short-date'}
      ?show-time=${props['show-time']}
      ?time-only=${props['time-only']}
      ?hide-seconds=${props['hide-seconds']}
      ?show-timezone=${props['show-timezone']}
      size=${props.size as string}
  ></sc-date>
`;

export const ShortDate = DateWithShortDateTemplate.bind({});
ShortDate.args = {
  date: '2025-06-16T09:05:52.831Z',
  'date-type': 'short-date',
  'show-time': false,
  'time-only': false,
  'hide-seconds': false,
  'show-timezone': false,
  size: 'md',
};

const DateWithShowTimeTemplate: Story<ArgTypes> = (
  props: ArgTypes
) => html`
  <sc-date
    date=${props['date'] as string}
    date-type=${props['date-type'] as 'full-date'}
    ?show-time=${props['show-time']}
    ?time-only=${props['time-only']}
    ?hide-seconds=${props['hide-seconds']}
    ?show-timezone=${props['show-timezone']}
    size=${props.size as string}
  ></sc-date>
`;

export const DateWithTime = DateWithShowTimeTemplate.bind({});
DateWithTime.args = {
  date: '2025-06-16T09:05:52.831Z',
  'date-type': 'short-date',
  'show-time': true,
  'time-only': false,
  'hide-seconds': false,
  'show-timezone': false,
  size: 'md',
};

const DateWithTimeOnlyTemplate: Story<ArgTypes> = (
  props: ArgTypes
) => html`
  <sc-date
    date=${props['date'] as string}
    date-type=${props['date-type'] as 'full-date'}
    ?show-time=${props['show-time']}
    ?time-only=${props['time-only']}
    ?hide-seconds=${props['hide-seconds']}
    ?show-timezone=${props['show-timezone']}
    size=${props.size as string}
  ></sc-date>
`;

export const TimeOnly = DateWithTimeOnlyTemplate.bind({});
TimeOnly.args = {
  date: '2025-06-16T09:05:52.831Z',
  'date-type': 'short-date',
  'show-time': false,
  'time-only': true,
  'hide-seconds': false,
  'show-timezone': false,
  size: 'md',
};

const DateWithHideSecondsTemplate: Story<ArgTypes> = (
  props: ArgTypes
) => html`
  <sc-date
    date=${props['date'] as string}
    date-type=${props['date-type'] as 'full-date'}
    ?show-time=${props['show-time']}
    ?time-only=${props['time-only']}
    ?hide-seconds=${props['hide-seconds']}
    ?show-timezone=${props['show-timezone']}
    size=${props.size as string}
  ></sc-date>
`;

export const DateAndTimeWithoutSeconds = DateWithHideSecondsTemplate.bind({});
DateAndTimeWithoutSeconds.args = {
  date: '2025-06-16T09:05:52.831Z',
  'date-type': 'short-date',
  'show-time': true,
  'time-only': false,
  'hide-seconds': true,
  'show-timezone': false,
  size: 'md',
};

const DateWithShowTimezoneTemplate: Story<ArgTypes> = (
  props: ArgTypes
) => html`
  <sc-date
    date=${props['date'] as string}
    date-type=${props['date-type'] as 'full-date'}
    ?show-time=${props['show-time']}
    ?time-only=${props['time-only']}
    ?hide-seconds=${props['hide-seconds']}
    ?show-timezone=${props['show-timezone']}
    size=${props.size as string}
  ></sc-date>
`;

export const DateWithTimezone = DateWithShowTimezoneTemplate.bind({});
DateWithTimezone.args = {
  date: '2025-06-16T09:05:52.831Z',
  'date-type': 'short-date',
  'show-time': false,
  'time-only': false,
  'hide-seconds': false,
  'show-timezone': true,
  size: 'md',
};
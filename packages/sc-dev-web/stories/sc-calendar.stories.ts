import { html, TemplateResult } from 'lit';
import { Provider } from './utils/Provider.js';
import '@scdevkit/webkit-ext';

export default {
  title: 'Calendar/Calendar',
  component: 'sc-calendar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'View Calendar events',
      },
    },
    controls: {
      exclude: [],
    },
  },
  argTypes: {
    'calendar-view': {
      control: { type: 'radio' },
      options: ['default', 'continuous', 'multi-month'],
      description: 'Calendar view type',
      table: { type: { summary: 'string' }, category: 'Attributes' },
    },
    locale: {
      control: { type: 'radio' },
      options: ['en', 'zh-CN'],
      description: 'Locale for calendar',
      table: { type: { summary: 'string' }, category: 'Attributes' },
    },
    'show-header-toolbar': {
      control: 'boolean',
      description: 'Show header toolbar',
      table: { type: { summary: 'boolean' }, category: 'Attributes' },
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner',
      table: { type: { summary: 'boolean' }, category: 'Attributes' },
    },
    events: {
      control: 'object',
      description: 'Calendar events',
      table: { type: { summary: 'array' }, category: 'Attributes' },
    },
    'available-calendars': {
      control: 'object',
      description: 'Available calendars',
      table: { type: { summary: 'array' }, category: 'Attributes' },
    },
    'selected-calendars': {
      control: 'object',
      description: 'Selected calendars',
      table: { type: { summary: 'array' }, category: 'Attributes' },
    },
    'sc-calendar-view-change': {
      description: 'Emitted when the calendar view changes.',
      table: { type: { summary: 'CustomEvent' }, category: 'Custom Events' },
    },
    'sc-action': {
      description: 'Emitted when an action is triggered (new event, share, etc).',
      table: { type: { summary: 'CustomEvent' }, category: 'Custom Events' },
    },
  },
  args: {
    'calendar-view': 'default',
    locale: 'en',
    'show-header-toolbar': false,
    loading: false,
    events: [
      {
        id: '1',
        title: 'Team Meeting',
        start: '2025-10-10T10:00:00',
        end: '2025-10-10T11:00:00',
        extendedProps: {
          calendarSource: { source: 'default', name: 'Calendar', isDefault: true },
          status: 'default',
        },
      },
      {
        id: '2',
        title: 'Project Review',
        start: '2025-10-12T14:00:00',
        end: '2025-10-12T15:00:00',
        extendedProps: {
          calendarSource: { source: 'default', name: 'Calendar', isDefault: true },
          status: 'default',
        },
      },
    ],
    'available-calendars': [],
    'selected-calendars': [],
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface CalendarArgs {
  'calendar-view': string;
  locale: string;
  'show-header-toolbar': boolean;
  loading: boolean;
  events: any[];
  'available-calendars': any[];
  'selected-calendars': any[];
}

const Template: Story<CalendarArgs> = (props: CalendarArgs) => Provider(html`
  <sc-calendar
    locale=${props.locale}
    calendar-view=${props['calendar-view']}
    ?show-header-toolbar=${props['show-header-toolbar']}
    ?loading=${props.loading}
    .events=${props.events}
    .availableCalendars=${props['available-calendars']}
    .selectedCalendars=${props['selected-calendars']}
    @sc-calendar-view-change=${(e: CustomEvent) => {
      console.log('Calendar view changed:', e.detail);
    }}
    @sc-action=${(e: CustomEvent) => {
      console.log('Calendar action:', e.detail);
    }}
  ></sc-calendar>
`);

export const Default = Template.bind({});
Default.args = {
  locale: 'en',
  'calendar-view': 'default',
  'show-header-toolbar': false,
  loading: false,
  events: [
    { 
      id: '1', 
      title: 'ServiceBench Standup', 
      start: '2025-10-06T09:00:00', 
      end: '2025-10-06T10:00:00', 
      extendedProps: { 
        calendarSource: {
          source: 'Outlook',
          name: 'Calendar',
          isDefault: true,
        },
        location: { displayName: 'nyc', locationType: 'default' }, 
        showAs: 'busy', 
        originalStartTimeZone: 'Asia/Singapore', 
        originalEndTimeZone: 'Asia/Singapore',
        recurrenceDetails: {
          pattern: {
            type: 'weekly', 
            interval: 1, 
          },
          range: {
            type: 'endDate', 
            startDate: '2025-10-06T09:00:00',
            endDate: '2025-10-31T10:00:00', 
            recurrenceTimeZone: 'Asia/Singapore',
          },
        },
      },
      rrule: {
        freq: 'WEEKLY',
        interval: 1,
        byweekday: ['MO', 'TU', 'WE', 'TH', 'FR'],
        dtstart: '2025-10-06T09:00:00',
        until: '2025-10-31T10:00:00',
      },
    },
    { 
      id: '3', 
      title: 'KMS Meeting', 
      start: '2025-10-06T11:30:00', 
      end: '2025-10-06T14:30:00', 
      allDay: false, 
      extendedProps: { 
        calendarSource: {
          source: 'Outlook',
          name: 'Calendar',
          isDefault: true,
        },
        showAs: 'tentative', 
        originalStartTimeZone: 'Asia/Singapore', 
        originalEndTimeZone: 'Asia/Singapore', 
      }, 
    },
    { 
      id: '4', 
      title: 'Project Deadline', 
      start: '2025-10-07', 
      end: '2025-10-07', 
      allDay: true, 
      extendedProps: { 
        calendarSource: {
          source: 'Outlook',
          name: 'Calendar',
          isDefault: true,
        },
        location: { displayName: 'la', locationType: 'default' }, 
        showAs: 'busy', 
        originalStartTimeZone: 'Asia/Singapore', 
        originalEndTimeZone: 'Asia/Singapore', 
      }, 
    },
    { 
      id: '5', 
      title: 'Doctor Appointment', 
      start: '2025-10-08T01:00:00', 
      end: '2025-10-08T08:00:00', 
      allDay: false, 
      extendedProps: { 
        calendarSource: {
          source: 'Outlook',
          name: 'Calendar',
          isDefault: true,
        },
        location: { displayName: 'chi', locationType: 'default' }, 
        showAs: 'oof', 
        originalStartTimeZone: 'Asia/Singapore', 
        originalEndTimeZone: 'Asia/Singapore', 
      }, 
    },
    { 
      id: '6', 
      title: 'Lunch with Sarah', 
      start: '2025-10-09T12:00:00', 
      end: '2025-10-09T13:00:00', 
      allDay: false, 
      extendedProps: { 
        calendarSource: {
          source: 'Outlook',
          name: 'Calendar',
          isDefault: true,
        },
        showAs: 'busy', 
        originalStartTimeZone: 'Asia/Singapore', 
        originalEndTimeZone: 'Asia/Singapore', 
      }, 
    },
  ],
  'available-calendars': ['Outlook-Calendar'],
  'selected-calendars': ['Outlook-Calendar'],
};

export const WithHeaderToolbar = Template.bind({});
WithHeaderToolbar.args = {
  ...Default.args,
  'show-header-toolbar': true,
};
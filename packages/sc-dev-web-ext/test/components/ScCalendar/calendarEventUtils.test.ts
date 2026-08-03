import { expect } from '@open-wc/testing';
import {
  formatWithTimezone,
  createCalendarEvent,
  transformEvent,
} from '../../../src/components/ScCalendar/calendarEventUtils.js';
import { timeZoneMapping } from '../../../src/components/ScCalendar/constants.js';

describe('calendarEventUtils', () => {
  describe('formatWithTimezone', () => {
    it('returns undefined if dateStr or timeZone is missing', () => {
      expect(formatWithTimezone(undefined, 'UTC')).to.be.undefined;
      expect(formatWithTimezone('2025-03-17T10:00:00', undefined)).to.be.undefined;
    });

    it('formats date with timezone', () => {
      const result = formatWithTimezone('2025-03-17T10:00:00', 'UTC');
      expect(result).to.match(/2025-03-17T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}/);
    });

    it('uses timeZoneMapping if available', () => {
      const tz = 'TestZone';
      const orig = timeZoneMapping;
      orig[tz] = 'UTC';
      const result = formatWithTimezone('2025-03-17T10:00:00', tz);
      expect(result).to.match(/2025-03-17T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}/);
      delete orig[tz];
    });
  });

  describe('createCalendarEvent', () => {
    it('creates event without rrule', () => {
      const info = {
        event: {
          id: '1',
          title: 'Test',
          start: new Date('2025-03-17T10:00:00'),
          end: new Date('2025-03-17T11:00:00'),
          allDay: false,
          extendedProps: {
            calendarSource: { source: 'src', name: 'default', isDefault: true },
            attendees: [],
            reminder: null,
            eventType: 'meeting',
            sensitivity: 'normal',
            details: 'details',
            createdDateTime: '2025-03-01T10:00:00',
            lastModifiedDateTime: '2025-03-01T10:00:00',
            changeKey: 'ck',
            categories: [],
            transactionId: 'tx',
            originalStartTimeZone: 'UTC',
            originalEndTimeZone: 'UTC',
            iCalUId: 'ical',
            reminderMinutesBeforeStart: 15,
            isReminderOn: true,
            hasAttachments: false,
            importance: 'normal',
            isCancelled: false,
            isOrganizer: true,
            responseRequested: true,
            seriesMasterId: 'smid',
            showAs: 'busy',
            type: 'type',
            webLink: 'http://test',
            onlineMeetingUrl: 'http://meeting',
            isOnlineMeeting: false,
            onlineMeetingProvider: 'teams',
            allowNewTimeProposals: true,
            isDraft: false,
            hideAttendees: false,
            responseStatus: 'accepted',
            body: 'body',
            location: 'loc',
            locations: [],
            organizer: 'org',
            onlineMeeting: 'meeting',
          },
        },
      };
      const evt = createCalendarEvent(info);
      expect(evt.id).to.equal('1');
      expect(evt.title).to.equal('Test');
      expect(evt.rrule).to.be.undefined;
      expect(evt.extendedProps?.calendarSource?.name).to.equal('default');
    });

    it('creates event with rrule', () => {
      const info = {
        event: {
          id: '2',
          title: 'Recurring',
          start: new Date('2025-03-17T10:00:00'),
          end: new Date('2025-03-17T11:00:00'),
          allDay: false,
          extendedProps: {
            calendarSource: { source: 'src', name: 'default', isDefault: true },
          },
          _def: {
            recurringDef: {
              typeData: {
                rruleSet: {
                  _rrule: [{
                    origOptions: {
                      freq: 2, // WEEKLY
                      interval: 1,
                      byweekday: [{ weekday: 1 }, { weekday: 2 }],
                      dtstart: '2025-03-17T10:00:00',
                      until: '2025-04-17T10:00:00',
                      count: 5,
                    },
                  }],
                },
              },
            },
          },
        },
      };
      const evt = createCalendarEvent(info);
      expect(evt.rrule).to.exist;
      expect(evt.rrule?.freq).to.equal('WEEKLY');
      expect(evt.rrule?.byweekday).to.deep.equal(['TU', 'WE']);
      expect(evt.rrule?.count).to.equal(5);
    });

    it('sets bysetpos=1 for monthly events starting in the first week', () => {
      const info = {
        event: {
          id: 'monthly1',
          title: 'First Monday Monthly',
          start: new Date('2025-03-03T10:00:00'),
          end: new Date('2025-03-03T11:00:00'),
          allDay: false,
          extendedProps: {
            calendarSource: { source: 'src', name: 'default', isDefault: true },
          },
          _def: {
            recurringDef: {
              typeData: {
                rruleSet: {
                  _rrule: [{
                    origOptions: {
                      freq: 1,
                      interval: 1,
                      byweekday: [{ weekday: 1 }],
                      dtstart: '2025-03-03T10:00:00',
                    },
                  }],
                },
              },
            },
          },
        },
      };
      const evt = createCalendarEvent(info);
      expect(evt.rrule?.freq).to.equal('MONTHLY');
      expect(evt.rrule?.bysetpos).to.equal(1);
    });
  });

  describe('transformEvent', () => {
    it('transforms event without rrule', () => {
      const event = {
        id: '1',
        title: 'Test',
        start: '2025-03-17T10:00:00',
        end: '2025-03-17T11:00:00',
        allDay: false,
        extendedProps: {
          calendarSource: { source: 'src', name: 'default', isDefault: true },
          showAs: 'busy',
          originalStartTimeZone: 'UTC',
          originalEndTimeZone: 'UTC',
        },
      };
      const transformed = transformEvent(event);
      expect(transformed.start).to.match(/2025-03-17T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}/);
      expect(transformed.end).to.match(/2025-03-17T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}/);
      expect(transformed.backgroundColor).to.contain('blue');
      expect(transformed.borderColor).to.contain('blue');
      expect(transformed.textColor).to.exist;
    });

    it('transforms event with rrule and computes duration', () => {
      const event = {
        id: '2',
        title: 'Recurring',
        start: '2025-03-17T10:00:00',
        end: '2025-03-17T11:30:00',
        allDay: false,
        extendedProps: {
          calendarSource: { source: 'src', name: 'custom', isDefault: false },
          showAs: 'busy',
          originalStartTimeZone: 'UTC',
          originalEndTimeZone: 'UTC',
        },
        rrule: {
          freq: 'WEEKLY' as const,
          interval: 1,
          byweekday: ['MO'],
          dtstart: '2025-03-17T10:00:00',
          until: '2025-04-17T10:00:00',
          count: 5,
        },
      };
      const transformed = transformEvent(event);
      expect(transformed.duration).to.equal('01:30');
      expect(transformed.backgroundColor).to.exist;
      expect(transformed.borderColor).to.exist;
      expect(transformed.textColor).to.exist;
      expect(transformed.rrule?.until).to.match(/2025-04-17T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}/); // Accept any hour
    });

    it('assigns colorMapping for unknown calendar source', () => {
      const event = {
        id: '4',
        title: 'Unknown Source',
        start: '2025-03-17T10:00:00',
        end: '2025-03-17T11:00:00',
        allDay: false,
        extendedProps: {
          calendarSource: { source: 'src', name: 'newSource', isDefault: false },
          showAs: 'busy',
          originalStartTimeZone: 'UTC',
          originalEndTimeZone: 'UTC',
        },
      };
      const transformed = transformEvent(event);
      expect(transformed.backgroundColor).to.exist;
      expect(transformed.borderColor).to.exist;
    });
  });
});
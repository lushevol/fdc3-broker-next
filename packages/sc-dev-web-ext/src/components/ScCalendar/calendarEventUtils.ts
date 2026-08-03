import { CALENDAR_EVENT } from '../../shared/util.js';
import { colorMapping, colorClassMapping, timeZoneMapping } from './constants.js';

export function formatWithTimezone(dateStr: string | undefined, timeZone: string | undefined): string | undefined {
  if (!dateStr || !timeZone) return undefined;
  const ianaTimeZone = timeZoneMapping[timeZone] || timeZone;
  const date = new Date(dateStr);

  const options: Intl.DateTimeFormatOptions = {
    timeZone: ianaTimeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  const dateTimeFormat = new Intl.DateTimeFormat('en-US', options);
  const formattedParts = dateTimeFormat.formatToParts(date);

  const year = formattedParts.find(part => part.type === 'year')?.value;
  const month = formattedParts.find(part => part.type === 'month')?.value;
  const day = formattedParts.find(part => part.type === 'day')?.value;
  const hour = formattedParts.find(part => part.type === 'hour')?.value;
  const minute = formattedParts.find(part => part.type === 'minute')?.value;
  const second = formattedParts.find(part => part.type === 'second')?.value;

  if (!year || !month || !day || !hour || !minute || !second) return undefined;

  const offsetDate = new Date(date.toLocaleString('en-US', { timeZone: ianaTimeZone }));
  const timezoneOffset = (offsetDate.getTime() - date.getTime()) / 60000;
  const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60).toString().padStart(2, '0');
  const offsetMinutes = (Math.abs(timezoneOffset) % 60).toString().padStart(2, '0');
  const offsetSign = timezoneOffset >= 0 ? '+' : '-';

  return `${year}-${month}-${day}T${hour}:${minute}:${second}${offsetSign}${offsetHours}:${offsetMinutes}`;
}

export function createCalendarEvent(info: any): CALENDAR_EVENT {
  const rruleOptions = info.event._def?.recurringDef?.typeData?.rruleSet?._rrule[0]?.origOptions;
  let rrule: {
    freq: 'YEARLY' | 'MONTHLY' | 'WEEKLY' | 'DAILY';
    interval?: number;
    byweekday?: string[];
    bysetpos?: number;
    dtstart?: string;
    until?: string;
    count?: number;
  } | undefined = undefined;

  if (rruleOptions) {
    const freqMap = ['YEARLY', 'MONTHLY', 'WEEKLY', 'DAILY'] as const;
    const byweekdayMap = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

    rrule = {
      freq: freqMap[rruleOptions.freq],
      interval: rruleOptions.interval,
      byweekday: rruleOptions.byweekday?.map((day: { weekday: number }) => byweekdayMap[day.weekday]),
      dtstart: rruleOptions.dtstart,
      until: rruleOptions.until,
      count: rruleOptions.count,
    };

    if (
      rrule.freq === 'MONTHLY' &&
      rrule.byweekday &&
      info.event.start &&
      new Date(info.event.start).getDate() <= 7 
    ) {
      rrule.bysetpos = 1;
    }
  }

  return {
    id: info.event.id,
    title: info.event.title,
    start: info.event.start?.toISOString(),
    end: info.event.end?.toISOString(),
    allDay: info.event.allDay,
    extendedProps: {
      calendarSource: {
        source: info.event.extendedProps.calendarSource.source,
        name: info.event.extendedProps.calendarSource.name,
        isDefault: info.event.extendedProps.calendarSource.isDefault,
      },
      attendees: info.event.extendedProps.attendees,
      reminder: info.event.extendedProps.reminder,
      eventType: info.event.extendedProps.eventType,
      sensitivity: info.event.extendedProps.sensitivity,
      details: info.event.extendedProps.details,
      createdDateTime: info.event.extendedProps.createdDateTime,
      lastModifiedDateTime: info.event.extendedProps.lastModifiedDateTime,
      changeKey: info.event.extendedProps.changeKey,
      categories: info.event.extendedProps.categories,
      transactionId: info.event.extendedProps.transactionId,
      originalStartTimeZone: info.event.extendedProps.originalStartTimeZone,
      originalEndTimeZone: info.event.extendedProps.originalEndTimeZone,
      iCalUId: info.event.extendedProps.iCalUId,
      reminderMinutesBeforeStart: info.event.extendedProps.reminderMinutesBeforeStart,
      isReminderOn: info.event.extendedProps.isReminderOn,
      hasAttachments: info.event.extendedProps.hasAttachments,
      importance: info.event.extendedProps.importance,
      isCancelled: info.event.extendedProps.isCancelled,
      isOrganizer: info.event.extendedProps.isOrganizer,
      responseRequested: info.event.extendedProps.responseRequested,
      seriesMasterId: info.event.extendedProps.seriesMasterId,
      showAs: info.event.extendedProps.showAs,
      type: info.event.extendedProps.type,
      webLink: info.event.extendedProps.webLink,
      onlineMeetingUrl: info.event.extendedProps.onlineMeetingUrl,
      isOnlineMeeting: info.event.extendedProps.isOnlineMeeting,
      onlineMeetingProvider: info.event.extendedProps.onlineMeetingProvider,
      allowNewTimeProposals: info.event.extendedProps.allowNewTimeProposals,
      isDraft: info.event.extendedProps.isDraft,
      hideAttendees: info.event.extendedProps.hideAttendees,
      responseStatus: info.event.extendedProps.responseStatus,
      body: info.event.extendedProps.body,
      location: info.event.extendedProps.location,
      locations: info.event.extendedProps.locations,
      organizer: info.event.extendedProps.organizer,
      onlineMeeting: info.event.extendedProps.onlineMeeting,
    },
    rrule,
  };
}

export function transformEvent(event: CALENDAR_EVENT) {
  const startWithTimezone = formatWithTimezone(event.start, event.extendedProps?.originalStartTimeZone);
  const endWithTimezone = formatWithTimezone(event.end, event.extendedProps?.originalEndTimeZone);

  let updatedRRule = event.rrule;
  let duration = null;

  if (event.rrule) {
    const { freq, interval, byweekday, dtstart, until, count, bysetpos, bymonth } = event.rrule;
    if (!freq) {
      console.error('The \'freq\' property is required in the rrule.', event.rrule);
      throw new Error('The \'freq\' property is required in the rrule.');
    }
    const startDate = new Date(startWithTimezone!);
    const endDate = endWithTimezone ? new Date(endWithTimezone!) : null;
    const updatedDtstart =
      dtstart && typeof dtstart === 'string' && startWithTimezone && typeof startWithTimezone === 'string'
        ? `${dtstart.split('T')[0]}T${startWithTimezone.split('T')[1]}`
        : startWithTimezone;
    let updatedUntil = undefined;
    if (
      until &&
      typeof until === 'string' &&
      endWithTimezone &&
      typeof endWithTimezone === 'string' &&
      until.includes('T') &&
      endWithTimezone.includes('T')
    ) {
      updatedUntil = `${until.split('T')[0]}T${endWithTimezone.split('T')[1]}`;
    } else if (until) {
      updatedUntil = until;
    }
    updatedRRule = {
      freq,
      interval,
      byweekday,
      dtstart: updatedDtstart,
      ...(updatedUntil ? { until: updatedUntil } : {}),
      ...(count ? { count } : {}),
      ...(bysetpos ? { bysetpos } : {}),
      ...(bymonth ? { bymonth } : {}),
    };
    if (startDate && endDate) {
      const durationMs = endDate.getTime() - startDate.getTime();
      const durationMinutes = Math.floor(durationMs / 60000);
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  }

  const statusColorClass = colorClassMapping[event.extendedProps?.status || 'default'];
  const transformedEvent = {
    ...event,
    start: startWithTimezone,
    end: endWithTimezone,
    rrule: updatedRRule,
    duration,
    statusColorClass,
  };


  let eventColor = undefined;
  if (event.extendedProps?.calendarSource) {
    const sourceName = event.extendedProps.calendarSource.name || 'default';
    eventColor = colorMapping[sourceName]?.fill;
  }
  if (!eventColor && event.extendedProps?.showAs === 'oof') {
    eventColor = 'var(--sc-calendar-event-oof-background-color, var(--sc-color-purple-100))';
  }
  if (!eventColor) {
    eventColor = 'var(--sc-calendar-event-blue-background-color, var(--sc-color-blue-100))';
  }

  transformedEvent.backgroundColor = eventColor;
  transformedEvent.borderColor = eventColor;

  transformedEvent.textColor = 'var(--sc-calendar-event-color, var(--sc-color-blue-900))';

  return transformedEvent;
}
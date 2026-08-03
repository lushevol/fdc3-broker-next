import '../../../../elements/sc-date-picker.js';
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import { fixture, html } from '@open-wc/testing-helpers';

import { calendar } from '../../../../src/components/ScDatePicker/helpers/calendar.js';
import { getWeekdays } from '../../../../src/components/ScDatePicker/helpers/get-weekdays.js';

import { 
  labelSelectedDate, 
  labelShortWeek, 
  labelToday, 
  labelWeek, 
  weekNumberTemplate, 
} from '../../../../src/components/ScDatePicker/constants.js';
import { toFormatters } from '../../../../src/components/ScDatePicker/helpers/to-formatters.js';
import type { ScMonthCalendar } from '../../../../src/components/ScDatePicker/MonthCalendar/ScMonthCalendar';
import { scMonthCalendarName } from '../../../../src/components/ScDatePicker/MonthCalendar/constants.js';
import type { MonthCalendarData } from '../../../../src/components/ScDatePicker/MonthCalendar/typings';
import dayjs from 'dayjs/esm/index.js';

describe(scMonthCalendarName, () => {
  const elementSelectors = {
    calendarCaption: '.calendar-caption',
    calendarDay: 'td.calendar-day',
    calendarDayWeekNumber: 'th.calendar-day.week-number',
    calendarTable: '.calendar-table',
    disabledCalendarDay: 'td.calendar-day[aria-disabled="true"]',
    hiddenCalendarDay: 'td.calendar-day[aria-hidden="true"]',
    monthCalendar: '.month-calendar',
    selectedCalendarDay: 'td.calendar-day[aria-selected="true"]',
    tabbableCalendarDay: 'td.calendar-day[tabindex="0"]',
    todayCalendarDay: 'td.calendar-day.day--today',
    weekday: 'th.weekday',
  } as const;
  
  const locale = 'en-US';
  const formatters = toFormatters(locale);
  const calendarInit: any = {
    date: dayjs('2020-02-02').toDate(),
    dayFormat: formatters.dayFormat,
    disabledDates: [],
    disabledDays: [],
    firstDayOfWeek: 0,
    fullDateFormat: formatters.fullDateFormat,
    locale,
    max: dayjs('2100-12-31').toDate(),
    min: dayjs('1970-01-01').toDate(),
    showWeekNumber: false,
    weekNumberTemplate,
    weekNumberType: 'first-4-day-week',
  };

  const weekdaysInit = {
    firstDayOfWeek: calendarInit.firstDayOfWeek,
    longWeekdayFormat: formatters.longWeekdayFormat,
    narrowWeekdayFormat: formatters.narrowWeekdayFormat,
    shortWeekLabel: labelShortWeek,
    showWeekNumber: calendarInit.showWeekNumber,
    weekLabel: labelWeek,
  };
  const calendarResult = calendar(calendarInit);
  const data: MonthCalendarData = {
    calendar: calendarResult.calendar,
    currentDate: calendarInit.date,
    date: calendarInit.date,
    // @ts-ignore
    disabledDatesSet: calendarResult.disabledDatesSet,
    // @ts-ignore
    disabledDaysSet: calendarResult.disabledDaysSet,
    formatters,
    max: calendarInit.max as Date,
    min: calendarInit.min as Date,
    selectedDateLabel: labelSelectedDate,
    showCaption: false,
    showWeekNumber: false,
    todayDate: calendarInit.date,
    todayLabel: labelToday,
    weekdays: getWeekdays(weekdaysInit),
  };

  test.each<{
    $_shouldRender: boolean;
    _message: string;
    data: MonthCalendarData | undefined;
  }>([
    { $_shouldRender: true, _message: '', data },
    { $_shouldRender: false, _message: 'nothing', data: undefined },
  ])('renders $_message(data=$data)', async ({
    $_shouldRender,
    data,
  }) => {
    const el = await fixture<ScMonthCalendar>(
      html`<sc-month-calendar .data=${data}></sc-month-calendar>`
    );

    const monthCalendar = el.query<HTMLDivElement>(
      elementSelectors.monthCalendar
    );
    const calendarTable = el.query<HTMLTableElement>(
      elementSelectors.calendarTable
    );

    if ($_shouldRender) {
      expect(monthCalendar).toBeInTheDocument();
      expect(calendarTable).toBeInTheDocument();
    } else {
      expect(monthCalendar).not.toBeInTheDocument();
      expect(calendarTable).not.toBeInTheDocument();
    }
  });
  
  // it('renders first day of calendar month of current date when it has a different month than selected date', 
  //   async () => {
  //     const testCurrentDate = new Date('2020-03-03');
  //     const testCalendar = calendar({
  //       ...calendarInit,
  //       date: testCurrentDate,
  //     });
  //     const el = await fixture<ScMonthCalendar>(
  //       html`<sc-month-calendar .data=${{
  //         ...data,
  //         calendar: testCalendar.calendar,
  //         currentDate: testCurrentDate,
  //       }}></sc-month-calendar>`
  //     );

  //     const expected = Date.UTC(2020,3,1);
  //     const tabbableCalendarDay = el.query<HTMLTableCellElement>(
  //       `${elementSelectors.tabbableCalendarDay}[aria-label="${formatters.fullDateFormat(expected)}"]`
  //     );

  //     expect(tabbableCalendarDay).toBeInTheDocument();
  //     expect(tabbableCalendarDay?.fullDate).toEqual(expected);
  //   });

  it('sets start date and updates aria-grabbed on mousedown', async () => {
    const testCurrentDate = dayjs('2025-05-01').toDate();
    const testCalendar = calendar({
      ...calendarInit,
      date: testCurrentDate,
    });
    const el = await fixture<ScMonthCalendar>(html`
      <sc-month-calendar drag-to-select .data=${{
        ...data,
        calendar: testCalendar.calendar,
        currentDate: testCurrentDate,
      }}></sc-month-calendar>
    `);
    await el.updateComplete;
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    const day15 = el.shadowRoot!.querySelector<HTMLElement>('[aria-label="May 15, 2025"]');
    if (!day15) throw new Error('Day 15 not found');
  
    const eventPromise = new Promise<CustomEvent>(resolve => {
      el.addEventListener('sc-select-items', e => resolve(e as CustomEvent));
    });
  
    day15.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    day15.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    day15.click();
  
    const event: any = await Promise.race([
      eventPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Event not fired')), 3000)),
    ]);
  
    expect(event.detail.valueAsDate).toEqual(dayjs('2025-05-15').toDate());
    expect(day15.getAttribute('aria-grabbed')).toBe('true');
  });  

  it('does not start drag selection on disabled day', async () => {
    const testCurrentDate = dayjs('2025-05-01').toDate();
    const testCalendar = calendar({
      ...calendarInit,
      date: testCurrentDate,
      disabledDates: [dayjs('2025-05-15').toDate()],
    });
    const el = await fixture<ScMonthCalendar>(html`
      <sc-month-calendar drag-to-select .data=${{
        ...data,
        calendar: testCalendar.calendar,
        currentDate: testCurrentDate,
      }}></sc-month-calendar>
    `);
    await el.updateComplete;
  
    const day15 = el.shadowRoot!.querySelector<HTMLElement>('[aria-label="May 15, 2025"]');
    if (!day15) throw new Error('Day 15 not found');
    day15.setAttribute('aria-disabled', 'true');
  
    // Spy on emit
    let emitted = false;
    el.addEventListener('sc-select-items', () => { emitted = true; });
  
    day15.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  
    expect(emitted).toBe(false);
  });  
  
  it('updates drag range on mouseenter when dragging', async () => {
    const testCurrentDate = dayjs('2025-05-01').toDate();
    const testCalendar = calendar({
      ...calendarInit,
      date: testCurrentDate,
    });
    const el = await fixture<ScMonthCalendar>(html`
      <sc-month-calendar drag-to-select .data=${{
        ...data,
        calendar: testCalendar.calendar,
        currentDate: testCurrentDate,
      }}></sc-month-calendar>
    `);
    await el.updateComplete;
  
    const day10 = el.shadowRoot!.querySelector<HTMLElement>('[aria-label="May 10, 2025"]');
    const day15 = el.shadowRoot!.querySelector<HTMLElement>('[aria-label="May 15, 2025"]');
    if (!day10 || !day15) throw new Error('Days not found');
  
    day10.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    day15.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  
    expect(day10.getAttribute('aria-grabbed')).toBe('true');
    expect(day15.getAttribute('aria-grabbed')).toBe('true');
  });

    it('emits sc-select-items with range on mouseup and resets drag state', async () => {
    const testCurrentDate = dayjs('2025-05-01').toDate();
    const testCalendar = calendar({
      ...calendarInit,
      date: testCurrentDate,
    });
    const el = await fixture<ScMonthCalendar>(html`
      <sc-month-calendar drag-to-select .data=${{
        ...data,
        calendar: testCalendar.calendar,
        currentDate: testCurrentDate,
      }}></sc-month-calendar>
    `);
    await el.updateComplete;
  
    const day10 = el.shadowRoot!.querySelector<HTMLElement>('[aria-label="May 10, 2025"]');
    const day15 = el.shadowRoot!.querySelector<HTMLElement>('[aria-label="May 15, 2025"]');
    if (!day10 || !day15) throw new Error('Days not found');
  
    let eventDetail: any = null;
    el.addEventListener('sc-select-items', (e: any) => {
      eventDetail = e.detail;
    });
  
    day10.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    day15.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    day15.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
  
    expect(eventDetail).not.toBeNull();
    expect(eventDetail.startAsDate).toEqual(dayjs('2025-05-10').toDate());
    expect(eventDetail.endAsDate).toEqual(dayjs('2025-05-15').toDate());
  });

    it('limits drag selection to maxDays (14 days)', async () => {
    const testCurrentDate = dayjs('2025-05-01').toDate();
    const testCalendar = calendar({
      ...calendarInit,
      date: testCurrentDate,
    });
    const el = await fixture<ScMonthCalendar>(html`
      <sc-month-calendar drag-to-select .data=${{
        ...data,
        calendar: testCalendar.calendar,
        currentDate: testCurrentDate,
      }}></sc-month-calendar>
    `);
    await el.updateComplete;
  
    const day10 = el.shadowRoot!.querySelector<HTMLElement>('[aria-label="May 10, 2025"]');
    const day31 = el.shadowRoot!.querySelector<HTMLElement>('[aria-label="May 31, 2025"]');
    if (!day10 || !day31) throw new Error('Days not found');
  
    let eventDetail: any = null;
    el.addEventListener('sc-select-items', (e: any) => {
      eventDetail = e.detail;
    });
  
    day10.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    day31.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    day31.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
  
    expect(eventDetail).not.toBeNull();
    expect(eventDetail.endAsDate).toEqual(dayjs('2025-05-24').toDate());
  });

  it('does not start drag selection on hidden day', async () => {
    const testCurrentDate = dayjs('2025-05-01').toDate();
    const testCalendar = calendar({
      ...calendarInit,
      date: testCurrentDate,
    });
    const el = await fixture<ScMonthCalendar>(html`
      <sc-month-calendar drag-to-select .data=${{
        ...data,
        calendar: testCalendar.calendar,
        currentDate: testCurrentDate,
      }}></sc-month-calendar>
    `);
    await el.updateComplete;
  
    const day15 = el.shadowRoot!.querySelector<HTMLElement>('[aria-label="May 15, 2025"]');
    if (!day15) throw new Error('Day 15 not found');
    day15.setAttribute('aria-hidden', 'true');
  
    let emitted = false;
    el.addEventListener('sc-select-items', () => { emitted = true; });
  
    day15.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  
    expect(emitted).toBe(false);
  });
});

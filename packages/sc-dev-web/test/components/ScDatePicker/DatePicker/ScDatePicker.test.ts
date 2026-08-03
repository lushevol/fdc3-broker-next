import '../../../../elements/sc-date-picker.js';
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';

import { DateTimeFormat, MAX_DATE } from '../../../../src/components/ScDatePicker/constants.js';
import type { ScDatePicker } from '../../../../src/components/ScDatePicker/DatePicker/ScDatePicker.js';
import { scDatePickerName } from '../../../../src/components/ScDatePicker/DatePicker/constants.js';
import { toDateString } from '../../../../src/components/ScDatePicker/helpers/to-date-string.js';
import { toFormatters } from '../../../../src/components/ScDatePicker/helpers/to-formatters.js';
import { toResolvedDate } from '../../../../src/components/ScDatePicker/helpers/to-resolved-date.js';
import type { MaybeDate } from '../../../../src/components/ScDatePicker/helpers/typings.js';
import type { ScMonthCalendar } from '../../../../src/components/ScDatePicker/MonthCalendar/ScMonthCalendar.js';
import type { 
  Formatters, 
  StartView, 
} from '../../../../src/components/ScDatePicker/typings';
import type { ScYearGrid } from '../../../../src/components/ScDatePicker/YearGrid/ScYearGrid';
import { getDate } from '../../../../src/components/ScDatePicker/helpers/get-date.js';

describe(scDatePickerName, () => {
  const elementSelectors = {
    body: '.body',
    calendar: '.calendar',
    calendarDay: '.calendar-day',
    calendarDayWithLabel: (label: string) => `.calendar-day[aria-label="${label}"]`,
    disabledCalendarDay: '.calendar-day[aria-disabled="true"]',
    header: '.header',
    selectedCalendarDay: '.calendar-day[aria-selected="true"]',
    todayCalendarDay: '.calendar-day.day--today',
    selectedYear: '.year-grid-button[aria-selected="true"]',
    selectedYearMonth: '.selected-year-month',
    yearGrid: '.year-grid',
    yearGridButton: '.year-grid-button',
  } as const;
  const formatters: Formatters = toFormatters(DateTimeFormat().resolvedOptions().locale);
  const todayDate = new Date();

  test.each<{
    $_hiddenElements:('body' | 'calendar' | 'header' | 'yearGrid')[];
    $_visibleElements: ('body' | 'calendar' | 'header' | 'yearGrid')[],
    startView: StartView | undefined,
    rangeDays?: number,
      }>([
        {
          $_hiddenElements: ['yearGrid'],
          $_visibleElements: ['body', 'calendar', 'header'],
          startView: undefined,
        },
        {
          $_hiddenElements: ['yearGrid'],
          $_visibleElements: ['body', 'calendar', 'header'],
          startView: 'calendar',
        },
        {
          $_hiddenElements: ['yearGrid'],
          $_visibleElements: ['body', 'calendar', 'header'],
          startView: 'calendar',
          rangeDays: 31,
        },
        {
          $_hiddenElements: ['calendar'],
          $_visibleElements: ['body', 'header', 'yearGrid'],
          startView: 'yearGrid',
        },
      ])('renders (startView=$startView)', async ({
        $_hiddenElements,
        $_visibleElements,
        startView,
        rangeDays,
      }) => {
        const el = await fixture<ScDatePicker>(
          html`<sc-date-picker locale="en-US" .startView=${startView as never} .rangeDays=${rangeDays ?? 0}></sc-date-picker>`
        );

        $_visibleElements.forEach(n => {
          const element: any = el.query(elementSelectors[n]);

          // Verify body class to ensure .start-view--{calendar|yearGrid} is always set
          if (n === 'body') {
            expect(element).toHaveClass(`start-view--${startView || 'calendar'}`);
          }
        });

        $_hiddenElements.forEach(n => {
          const element: any = el.query(elementSelectors[n]);

          expect(element).not.toBeInTheDocument();
        });

        if (startView === 'yearGrid') {
          const yearGrid = el.query<ScYearGrid>(elementSelectors.yearGrid);

          expect(yearGrid).toBeInTheDocument();
          expect(yearGrid).toHaveAttribute('exportparts', 'year-grid,year,toyear');
        } else {
          const calendar = el.query<ScMonthCalendar>(elementSelectors.calendar);

          expect(calendar).toBeInTheDocument();
          expect(calendar).toHaveAttribute(
            'exportparts',
            'table,caption,weekdays,weekday,weekday-value,week-number,calendar-day,today,calendar'
          );
        }
      });

  it('selects new date', async () => {
    const testValue = '2020-02-02';
    const testValueDate = getDate(testValue);
    const el = await fixture<ScDatePicker>(
      html`<sc-date-picker
        locale="en-US"
        .max=${'2020-03-03'}
        .min=${'2020-01-01'}
        .value=${testValue}
      ></sc-date-picker>`
    );

    expect(el.valueAsDate).toEqual(testValueDate);
    expect(el.valueAsNumber).toBe(+testValueDate);

    const newSelectedDate = getDate(
      getDate(testValue).setUTCDate(15)
    );
    const calendar = el.query<ScMonthCalendar>(
      elementSelectors.calendar
    );
    const newSelectedCalendarDay =
      calendar?.query<HTMLTableCellElement>(
        `${elementSelectors.calendarDay}[data-day="${newSelectedDate.getDate()}"]`
      );

    expect(newSelectedCalendarDay).toBeInTheDocument();

    newSelectedCalendarDay?.focus();
    newSelectedCalendarDay?.click();

    await elementUpdated(calendar as ScMonthCalendar);
    await elementUpdated(el);

    const selectedDate = calendar?.query<HTMLTableCellElement>(
      elementSelectors.selectedCalendarDay
    );
    el.nevigationNextMonth();

    expect(el.valueAsDate).toEqual(newSelectedDate);
    expect(el.valueAsNumber).toBe(+newSelectedDate);

    expect(selectedDate).toBeInTheDocument();
    expect(selectedDate).toHaveAttribute('data-day', `${newSelectedDate.getDate()}`);
    const selectedDateCell = selectedDate?.fullDate as Date;
    expect(selectedDateCell?.getUTCFullYear()).toEqual(newSelectedDate.getUTCFullYear());
    expect(selectedDateCell?.getUTCMonth()).toEqual(newSelectedDate.getUTCMonth());
    expect(selectedDateCell?.getUTCDate()).toEqual(newSelectedDate.getUTCDate());
  });

  it('keeps year grid page within min/max bounds', async () => {
    const el = await fixture<ScDatePicker>(
      html`<sc-date-picker
        locale="en-US"
        .startView=${'yearGrid' as never}
        .min=${'2026-01-01'}
        .max=${'2026-12-31'}
        .value=${'2026-07-22'}
      ></sc-date-picker>`
    );

    await elementUpdated(el);

    const yearGrid = el.query<ScYearGrid>(elementSelectors.yearGrid);
    expect(yearGrid).toBeInTheDocument();

    const yearButtons = Array.from(
      yearGrid?.shadowRoot?.querySelectorAll<HTMLButtonElement>('button[data-year]') ?? []
    );
    const years = yearButtons
      .map(button => Number(button.getAttribute('data-year')))
      .filter(year => Number.isFinite(year));

    expect(years.length).toBeGreaterThan(0);
    expect(Math.max(...years)).toBeLessThan(2100);
    expect(years).toContain(2026);
  });

  test.each<{
    $_minDate: Date,
    $_newMinDate: Date;
    min: MaybeDate | undefined,
    newMin: MaybeDate | undefined,
  }>([
    {
      $_minDate: todayDate, $_newMinDate: toResolvedDate('2020-02-02'), min: '', newMin: '2020-02-02',
    },
    {
      $_minDate: todayDate, $_newMinDate: toResolvedDate('2020-02-02'), min: null, newMin: '2020-02-02',
    },
    {
      $_minDate: todayDate, $_newMinDate: toResolvedDate('2020-02-02'), min: undefined, newMin: '2020-02-02',
    },
    {
      $_minDate: todayDate, $_newMinDate: toResolvedDate('2020-02-01'), min: '', newMin: '2020-02-01',
    },
    {
      $_minDate: todayDate, $_newMinDate: toResolvedDate('2020-02-01'), min: null, newMin: '2020-02-01',
    },
    {
      $_minDate: todayDate, $_newMinDate: toResolvedDate('2020-02-01'), min: undefined, newMin: '2020-02-01',
    },
    {
      $_minDate: toResolvedDate('2020-02-02'), $_newMinDate: toResolvedDate('2020-02-02'), 
      min: '2020-02-02', newMin: '',
    },
    {
      $_minDate: toResolvedDate('2020-02-02'), $_newMinDate: toResolvedDate('2020-02-02'), 
      min: '2020-02-02', newMin: null,
    },
    {
      $_minDate: toResolvedDate('2020-02-02'), $_newMinDate: todayDate, min: '2020-02-02', newMin: undefined,
    },
  ])('updates optional min (min=$min, newMin=$newMin)', async ({
    $_minDate,
    $_newMinDate,
    min,
    newMin,
  }) => {
    const el = await fixture<ScDatePicker>(
      html`<sc-date-picker
        locale="en-US"
        .max=${'2100-12-31'}
        .min=${min as never}
        .value=${min as never}
      ></sc-date-picker>`
    );

    const calendar = el.query<ScMonthCalendar>(
      elementSelectors.calendar
    );

    const minDate = calendar?.query<HTMLTableCellElement>(
      `${elementSelectors.calendarDay}[data-day="${$_minDate.getDate()}"]`
    );

    expect(minDate).toBeInTheDocument();
    expect(minDate).toHaveAttribute('data-day', `${$_minDate.getDate()}`);
    expect(new Date(minDate?.fullDate as any).toDateString()).toEqual(new Date($_minDate).toDateString());

    el.min = el.value = newMin as never;

    await elementUpdated(calendar as ScMonthCalendar);
    await elementUpdated(el);

    const calendar2 = el.query<ScMonthCalendar>(
      elementSelectors.calendar
    );

    const minDate2 = calendar2?.query<HTMLTableCellElement>(
      `${elementSelectors.calendarDay}[data-day="${$_newMinDate.getDate()}"]`
    );

    expect(minDate2).toBeInTheDocument();
    expect(minDate2).toHaveAttribute('data-day', `${$_newMinDate.getDate()}`);
    expect(new Date(minDate2?.fullDate as any).toDateString()).toEqual(new Date($_newMinDate).toDateString());
  });

  type NullishDateString = null | string | undefined;
  interface TestUpdatesOptionalMax {
    $_max: string,
    $_value: string;
    max: NullishDateString,
    value: NullishDateString,
  }
  test.each<{
    after: TestUpdatesOptionalMax;
    before: TestUpdatesOptionalMax,
  }>([
    // max='',value=''
    {
      after: { $_max: '2020-02-20', $_value: '2020-02-20', max: '2020-02-20', value: '2020-02-20' },
      // same max and value subsequently
      before: { $_max: toDateString(MAX_DATE), $_value: toDateString(todayDate), max: '', value: '' },
    },
    {
      after: { $_max: '2020-02-21', $_value: '2020-02-20', max: '2020-02-21', value: '2020-02-20' },
      // larger max subsequently
      before: { $_max: toDateString(MAX_DATE), $_value: toDateString(todayDate), max: '', value: '' },
    },
    {
      after: { $_max: '2020-02-19', $_value: '2020-02-19', max: '2020-02-19', value: '2020-02-20' },
      // smaller max subsequently
      before: { $_max: toDateString(MAX_DATE), $_value: toDateString(todayDate), max: '', value: '' },
    },

    // max=null,value=null
    {
      after: { $_max: '2020-02-20', $_value: '2020-02-20', max: '2020-02-20', value: '2020-02-20' },
      // same max and value subsequently (null)
      before: { $_max: toDateString(MAX_DATE), $_value: toDateString(todayDate), max: null, value: null },
    },
    {
      after: { $_max: '2020-02-21', $_value: '2020-02-20', max: '2020-02-21', value: '2020-02-20' },
      // larger max subsequently
      before: { $_max: toDateString(MAX_DATE), $_value: toDateString(todayDate), max: null, value: null },
    },
    {
      after: { $_max: '2020-02-19', $_value: '2020-02-19', max: '2020-02-19', value: '2020-02-20' },
      // smaller max subsequently
      before: { $_max: toDateString(MAX_DATE), $_value: toDateString(todayDate), max: null, value: null },
    },

    // max=undefined,value=undefined
    {
      after: { $_max: '2020-02-20', $_value: '2020-02-20', max: '2020-02-20', value: '2020-02-20' },
      // same max and value subsequently
      before: { $_max: toDateString(MAX_DATE), $_value: toDateString(todayDate), max: undefined, value: undefined },
    },
    {
      after: { $_max: '2020-02-21', $_value: '2020-02-20', max: '2020-02-21', value: '2020-02-20' },
      // larger max subsequently
      before: { $_max: toDateString(MAX_DATE), $_value: toDateString(todayDate), max: undefined, value: undefined },
    },
    {
      after: { $_max: '2020-02-19', $_value: '2020-02-19', max: '2020-02-19', value: '2020-02-20' },
      // smaller max subsequently
      before: { $_max: toDateString(MAX_DATE), $_value: toDateString(todayDate), max: undefined, value: undefined },
    },

    // max=2020-02-02,value=2020-02-02
    {
      after: { $_max: '2020-02-02', $_value: '2020-02-02', max: '', value: '2100-12-12' },
      // max='' and value=2100-12-12 subsequently
      before: { $_max: '2020-02-02', $_value: '2020-02-02', max: '2020-02-02', value: '2020-02-02' },
    },
    {
      after: { $_max: '2020-02-02', $_value: '2020-02-02', max: null, value: '2100-12-12' },
      // max=null and value=2100-12-12 subsequently
      before: { $_max: '2020-02-02', $_value: '2020-02-02', max: '2020-02-02', value: '2020-02-02' },
    },
    {
      after: { $_max: toDateString(MAX_DATE), $_value: '2100-12-12', max: undefined, value: '2100-12-12' },
      // max=undefined and value=2100-12-12 subsequently
      before: { $_max: '2020-02-02', $_value: '2020-02-02', max: '2020-02-02', value: '2020-02-02' },
    },
  ])('updates optional max (before: $before, after: $after)', async ({
    after,
    before,
  }) => {
    const el = await fixture<ScDatePicker>(
      html`<sc-date-picker
        locale="en-US"
        .max=${before.max as never}
        .min=${'1970-01-01'}
        .value=${before.max as never}
      ></sc-date-picker>`
    );

    const $a = [before, after].map<[number, TestUpdatesOptionalMax]>((n, i) => [i, n]);
    for (const [
      i,
      {
        $_max: $expectedMax,
        // eslint-disable-next-line
        $_value: $expectedValue,
        max: $testMax,
        value: $testValue,
      },
    ] of $a) {
      const calendar = el.query<ScMonthCalendar>(
        elementSelectors.calendar
      );

      if (i) {
        el.max = $testMax as never;
        el.value = $testValue;

        calendar && await elementUpdated(calendar);
        await elementUpdated(el);
      }

      if (i) {
        expect(toDateString((el as any)._max)).toBe($expectedMax);
        expect(toDateString(el.valueAsDate)).toBe($expectedValue);
      }
    }
  });

  it('handles quickSelect items and generates correct labels', async () => {
    const quickSelectorItems = [
      { amount: -1, unit: 'day' },
      { amount: 1, unit: 'day' },
      { amount: -1, unit: 'month' },
      { amount: 1, unit: 'month' },
      { amount: -1, unit: 'year' },
      { amount: 1, unit: 'year' },
      { amount: -1, unit: 'week' },
      { amount: 1, unit: 'week' },
    ];

    const el = await fixture<ScDatePicker>(
      html`<sc-date-picker
        locale="en-US"
        .quickSelector=${true}
        .quickSelectorItems=${quickSelectorItems}
      ></sc-date-picker>`
    );

    const quickSelector = el.shadowRoot?.querySelector('.quick-selector');
    expect(quickSelector).toBeInTheDocument();

    const quickSelectorItemsElements = el.shadowRoot?.querySelectorAll('.quick-selector-item');
    expect(quickSelectorItemsElements?.length).toBe(quickSelectorItems.length);

    for (let i = 0; i < quickSelectorItems.length; i++) {
      const { amount, unit } = quickSelectorItems[i];
      const quickSelectorItem = quickSelectorItemsElements?.[i] as HTMLElement;

      const expectedLabel = (el as any).generateQuickSelectorLabel(amount, unit);
      expect(quickSelectorItem.textContent?.trim()).toBe(expectedLabel);

      quickSelectorItem?.click();
      const today = getDate();
      let expectedDate: Date;
      switch (unit) {
        case 'year':
          expectedDate = getDate(Date.UTC(today.getFullYear() + amount, today.getMonth(), today.getDate()));
          break;
        case 'month': {
          const currentDate = today.getDate();
          const targetMonth = today.getMonth() + amount;
          expectedDate = getDate(Date.UTC(today.getFullYear(), targetMonth, 1));
          const daysInTargetMonth = getDate(Date.UTC(expectedDate.getFullYear(), expectedDate.getMonth() + 1, 0)).getDate();
          expectedDate.setUTCDate(Math.min(currentDate, daysInTargetMonth));
          break;
        }
        case 'week':
          expectedDate = getDate(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + amount * 7));
          break;
        case 'day':
          expectedDate = getDate(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + amount));
          break;
        default:
          expectedDate = getDate(today.getTime());
      }

      await elementUpdated(el);
      const valueStr = typeof el.value === 'string'
        ? el.value
        : el.value instanceof Date
          ? el.value.toISOString().slice(0, 10)
          : '';
      expect(valueStr).toBe(expectedDate.toISOString().slice(0, 10));
    }
  });

  it('clamps the selected day when switching to a shorter month from month grid', async () => {
    const el = await fixture<ScDatePicker>(
      html`<sc-date-picker
        .value=${'2026-03-31'}
      ></sc-date-picker>`
    );
    const picker = el as any;

    el.updateMonth({
      detail: { monthValue: 3 },
    } as CustomEvent<any>);

    await elementUpdated(el);

    expect(toDateString(picker._currentDate)).toBe('2026-04-30');
    expect(toDateString(picker._selectedDate)).toBe('2026-03-31');
  });

  it('does not auto-select the clamped day when switching month grid in calendar mode', async () => {
    const el = await fixture<ScDatePicker>(
      html`<sc-date-picker
        .value=${'2026-03-31'}
      ></sc-date-picker>`
    );

    el.updateMonth({
      detail: { monthValue: 3 },
    } as CustomEvent<any>);

    await elementUpdated(el);

    const calendar = el.query<ScMonthCalendar>(elementSelectors.calendar);
    const selectedDate = calendar?.query<HTMLTableCellElement>(elementSelectors.selectedCalendarDay);

    expect(selectedDate).not.toBeInTheDocument();
  });

  it('set different picker', async () => {
    const el = await fixture<ScDatePicker>(
      html`<sc-date-picker
        locale="en-US"
        picker=month
      ></sc-date-picker>`
    );
    await el.updateComplete;
    expect(el._shownView).toEqual('monthGrid');
    const el2 = await fixture<ScDatePicker>(
      html`<sc-date-picker
        locale="en-US"
        picker=year
      ></sc-date-picker>`
    );
    await el2.updateComplete;
    expect(el2._shownView).toEqual('yearGrid');
  });

  it.each([
    { value: '99', expectedYear: 99 },
    { value: '9', expectedYear: 9 },
    { value: '1', expectedYear: 1 },
    { value: '0', expectedYear: 0 },
    { value: '-1', expectedYear: -1 },
    { value: '-9', expectedYear: -9 },
    { value: '-99', expectedYear: -99 },
    { value: '-999', expectedYear: -999 },
    { value: '-888', expectedYear: -888 },
    { value: '19999', expectedYear: 19999 },
  ])('keeps exact year for picker=year (value=$value)', async ({ value, expectedYear }) => {
    const el = await fixture<ScDatePicker>(
      html`<sc-date-picker locale="en-US" picker="year" .value=${value}></sc-date-picker>`
    );

    await el.updateComplete;

    expect(el.valueAsDate.getFullYear()).toBe(expectedYear);
  });

  it.each([
    { year: '0', expectedTitle: '0' },
    { year: '-1', expectedTitle: '-1' },
    { year: '-11', expectedTitle: '-11' },
    { year: '-111', expectedTitle: '-111' },
    { year: '-1111', expectedTitle: '-1111' },
    { year: '-11111', expectedTitle: '-11111' },
  ])('keeps exact title year when switching to monthGrid (year=$year)', async ({ year, expectedTitle }) => {
    const el = await fixture<ScDatePicker>(
      html`<sc-date-picker locale="en-US" .value=${`${year}-03-09`}></sc-date-picker>`
    );

    await el.updateComplete;

    const title = el.query<HTMLParagraphElement>(elementSelectors.selectedYearMonth);
    expect(title?.textContent?.trim()).toContain(`Mar ${expectedTitle}`);

    title?.click();
    await elementUpdated(el);

    const switchedTitle = el.query<HTMLParagraphElement>(elementSelectors.selectedYearMonth);
    expect(switchedTitle?.textContent?.trim()).toBe(expectedTitle);
  });

  it('renders year zero in the month-year title', async () => {
    const el = await fixture<ScDatePicker>(
      html`<sc-date-picker locale="en-US" .value=${'0'}></sc-date-picker>`
    );

    await el.updateComplete;

    expect(el.query(elementSelectors.selectedYearMonth)?.textContent).toContain('Jan 0');
  });

  it('updates header month title when navigating with arrows in calendar view', async () => {
    const el = await fixture<ScDatePicker>(
      html`<sc-date-picker locale="en-US" .value=${'2026-05-12'}></sc-date-picker>`
    );

    await el.updateComplete;

    const readTitle = () =>
      el.query<HTMLParagraphElement>(elementSelectors.selectedYearMonth)?.textContent?.trim() || '';

    const before = readTitle();
    const nextButton = el.query<HTMLButtonElement>('[data-navigation="next"]');
    nextButton?.click();
    await el.updateComplete;
    const after = readTitle();

    expect(before).toContain('May 2026');
    expect(after).toContain('Jun 2026');
  });

  it('updates header title when navigating with double arrows in month picker view', async () => {
    const el = await fixture<ScDatePicker>(
      html`<sc-date-picker locale="en-US" picker="month" .value=${'2025-02-10'}></sc-date-picker>`
    );

    await el.updateComplete;

    const readTitle = () =>
      el.query<HTMLParagraphElement>(elementSelectors.selectedYearMonth)?.textContent?.trim() || '';

    const before = readTitle();
    const nextYearButton = el.query<HTMLElement>('sc-icon[name="arrowhead-right"]');
    nextYearButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await el.updateComplete;
    const after = readTitle();

    expect(before).toContain('Feb 2025');
    expect(after).toContain('Feb 2026');
  });

  it('updates selected month button when navigating with single arrows in month picker view', async () => {
    const el = await fixture<ScDatePicker>(
      html`<sc-date-picker locale="en-US" picker="month" .startView=${'monthGrid' as never} .value=${'2026-03-10'}></sc-date-picker>`
    );

    await el.updateComplete;

    const readSelectedMonth = () => {
      const monthGrid = el.shadowRoot?.querySelector('sc-month-grid');
      return monthGrid?.shadowRoot?.querySelector<HTMLButtonElement>('button[aria-selected="true"]')
        ?.getAttribute('data-month');
    };

    const before = readSelectedMonth();
    const prevMonthButton = el.query<HTMLElement>('sc-icon[name="arrow-ios-backward"]');
    prevMonthButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await el.updateComplete;
    const after = readSelectedMonth();

    expect(before).toBe('Mar');
    expect(after).toBe('Feb');
  });

  it('defaults to max date when max is earlier than today and value is empty', async () => {
    const maxDate = getDate();
    maxDate.setUTCDate(maxDate.getUTCDate() - 1);
    const max = toDateString(maxDate);

    const el = await fixture<ScDatePicker>(
      html`<sc-date-picker
        locale="en-US"
        .min=${'1970-01-01'}
        .max=${max}
        .value=${''}
      ></sc-date-picker>`
    );

    const calendar = el.query<ScMonthCalendar>(elementSelectors.calendar);
    const selectedDate = calendar?.query<HTMLTableCellElement>(elementSelectors.todayCalendarDay);

    expect(selectedDate).toBeInTheDocument();
    expect(new Date(selectedDate?.fullDate as any).toDateString()).toEqual(getDate(max).toDateString());
    const currentDate = (el as any)._currentDate as Date;
    expect(currentDate.getFullYear()).toBe(getDate(max).getFullYear());
    expect(currentDate.getMonth()).toBe(getDate(max).getMonth());
  });

  it('defaults to min date when min is later than today and value is empty', async () => {
    const minDate = getDate();
    minDate.setUTCDate(minDate.getUTCDate() + 1);
    const min = toDateString(minDate);

    const el = await fixture<ScDatePicker>(
      html`<sc-date-picker
        locale="en-US"
        .min=${min}
        .max=${'2100-12-31'}
        .value=${''}
      ></sc-date-picker>`
    );

    const calendar = el.query<ScMonthCalendar>(elementSelectors.calendar);
    const selectedDate = calendar?.query<HTMLTableCellElement>(elementSelectors.todayCalendarDay);

    expect(selectedDate).toBeInTheDocument();
    expect(new Date(selectedDate?.fullDate as any).toDateString()).toEqual(getDate(min).toDateString());
    const currentDate = (el as any)._currentDate as Date;
    expect(currentDate.getFullYear()).toBe(getDate(min).getFullYear());
    expect(currentDate.getMonth()).toBe(getDate(min).getMonth());
  });

  it('shows previous month in start panel when max is earlier than today and value is empty', async () => {
    const maxDate = getDate();
    maxDate.setUTCDate(maxDate.getUTCDate() - 1);
    const max = toDateString(maxDate);

    const expectedShownMonth = getDate(max);
    expectedShownMonth.setUTCMonth(expectedShownMonth.getUTCMonth() - 1);

    const el = await fixture<ScDatePicker>(
      html`<sc-date-picker
        locale="en-US"
        .min=${'1970-01-01'}
        .max=${max}
        .value=${''}
        .positionType=${'start'}
        .rangeDays=${31}
      ></sc-date-picker>`
    );

    const selectedDate = el.query<HTMLTableCellElement>(elementSelectors.selectedCalendarDay);

    expect(selectedDate).not.toBeInTheDocument();
    const currentDate = (el as any)._currentDate as Date;
    expect(currentDate.getFullYear()).toBe(expectedShownMonth.getFullYear());
    expect(currentDate.getMonth()).toBe(expectedShownMonth.getMonth());
  });

  it('keeps the range start year when switching from monthGrid to yearGrid', async () => {
    const selectedValue = '1000-02-06';
    const selectedDate = getDate(selectedValue);
    const el = await fixture<ScDatePicker>(
      html`<sc-date-picker
        locale="en-US"
        .positionType=${'start'}
        .rangeDays=${31}
        .value=${selectedValue}
        .startView=${'monthGrid'}
      ></sc-date-picker>`
    );

    await elementUpdated(el);

    expect(el.query(elementSelectors.selectedYearMonth)?.textContent).toContain(
      formatters.shortMonthYearFormat(selectedDate)
    );

    el.query(elementSelectors.selectedYearMonth)?.dispatchEvent(
      new MouseEvent('click', { bubbles: true, composed: true })
    );

    await elementUpdated(el);

    expect(el.query(elementSelectors.selectedYearMonth)?.textContent).toContain('1000');
    expect(el.query(elementSelectors.selectedYearMonth)?.textContent).not.toContain('2026');
  });

  it('blocks month navigation when next or previous month would exceed minYear/maxYear', async () => {
    const el = await fixture<ScDatePicker>(
      html`<sc-date-picker
        locale="en-US"
        .value=${'2000-01-15'}
        .minYear=${2000}
        .maxYear=${2000}
      ></sc-date-picker>`
    );

    await el.updateComplete;

    const readTitle = () =>
      el.query<HTMLParagraphElement>(elementSelectors.selectedYearMonth)?.textContent?.trim() || '';
    const before = readTitle();
    const buttons = el.queryAll<HTMLElement>('[data-navigation="next"]');
    const nextMonthButton = buttons[0] as HTMLButtonElement;
    nextMonthButton?.click();
    await el.updateComplete;
    const afterNext = readTitle();

    expect(before).toContain('Jan 2000');
    expect(afterNext).toContain('Feb 2000');

    // Move to Dec 2000, then ensure next month does not navigate into 2001.
    const innerNext = buttons[0] as HTMLButtonElement;
    Array.from({ length: 10 }).forEach(() => innerNext?.click());
    await el.updateComplete;
    const beforeBlockedNext = readTitle();
    innerNext?.click();
    await el.updateComplete;
    const afterBlockedNext = readTitle();

    expect(beforeBlockedNext).toContain('Dec 2000');
    expect(afterBlockedNext).toContain('Dec 2000');

    // Set current date explicitly to Jan 2000 before asserting previous bound.
    (el as any)._currentDate = getDate('2000-01-02');
    await el.updateComplete;
    const prevButtons = el.queryAll<HTMLElement>('[data-navigation="previous"]');
    const prevMonthButton = prevButtons[0] as HTMLButtonElement;
    const beforeBlockedPrev = readTitle();
    prevMonthButton?.click();
    await el.updateComplete;
    const afterBlockedPrev = readTitle();

    expect(beforeBlockedPrev).toContain('Jan 2000');
    expect(afterBlockedPrev).toContain('Jan 2000');
  });

  it('blocks year page navigation beyond minYear/maxYear in year grid view', async () => {
    const el = await fixture<ScDatePicker>(
      html`<sc-date-picker
        locale="en-US"
        .value=${'2000-06-01'}
        .startView=${'yearGrid'}
        .minYear=${1990}
        .maxYear=${2005}
      ></sc-date-picker>`
    );

    await el.updateComplete;

    const readTitle = () =>
      el.query<HTMLParagraphElement>(elementSelectors.selectedYearMonth)?.textContent?.trim() || '';

    expect(readTitle()).toContain('2000');

    const nextButtons = el.queryAll<HTMLElement>('[data-navigation="next"]');
    const yearPageNextButton = nextButtons[0] as HTMLButtonElement;
    yearPageNextButton?.click();
    await el.updateComplete;

    // Title stays unchanged because year page cannot move past maxYear range.
    expect(readTitle()).toContain('2000');
  });

  it('opens empty year picker on the page containing the current year', async () => {
    const currentYear = getDate().getUTCFullYear();
    const el = await fixture<ScDatePicker>(
      html`<sc-date-picker
        locale="en-US"
        .picker=${'year'}
        .startView=${'yearGrid'}
        .value=${''}
      ></sc-date-picker>`
    );

    await el.updateComplete;

    const title = el.query<HTMLParagraphElement>(elementSelectors.selectedYearMonth)?.textContent?.trim() || '';
    const yearGrid = el.query<ScYearGrid>(elementSelectors.yearGrid);
    const yearButton = yearGrid?.shadowRoot?.querySelector<HTMLButtonElement>(`button[data-year="${currentYear}"]`);

    expect(title).toContain(String(currentYear));
    expect(yearButton).toBeInTheDocument();
  });

  it('constrains year-grid rendered years by minYear/maxYear bounds', async () => {
    const el = await fixture<ScDatePicker>(
      html`<sc-date-picker
        locale="en-US"
        .picker=${'year'}
        .startView=${'yearGrid'}
        .value=${''}
        .minYear=${2000}
        .maxYear=${3000}
      ></sc-date-picker>`
    );

    await el.updateComplete;

    const yearGrid = el.query<ScYearGrid>(elementSelectors.yearGrid);
    const yearButtons = Array.from(
      yearGrid?.shadowRoot?.querySelectorAll<HTMLButtonElement>('button[data-year]') || []
    );
    const years = yearButtons.map(btn => Number(btn.getAttribute('data-year')));

    expect(years.length).toBeGreaterThan(0);
    expect(Math.min(...years)).toBeGreaterThanOrEqual(2000);
    expect(Math.max(...years)).toBeLessThanOrEqual(3000);
    expect(years).not.toContain(-271801);
  });

  it('marks out-of-bound years disabled in year grid when picker is calendar', async () => {
    const el = await fixture<ScDatePicker>(
      html`<sc-date-picker
        locale="en-US"
        .picker=${'calendar'}
        .startView=${'yearGrid'}
        .value=${'3000-01-01'}
        .minYear=${2000}
        .maxYear=${3000}
      ></sc-date-picker>`
    );

    await el.updateComplete;

    const yearGrid = el.query<ScYearGrid>(elementSelectors.yearGrid);
    const yearButtons = Array.from(
      yearGrid?.shadowRoot?.querySelectorAll<HTMLButtonElement>('button[data-year]') || []
    );
    const outOfRangeButtons = yearButtons.filter(btn => {
      const y = Number(btn.getAttribute('data-year'));
      return y < 2000 || y > 3000;
    });
    const inRangeButtons = yearButtons.filter(btn => {
      const y = Number(btn.getAttribute('data-year'));
      return y >= 2000 && y <= 3000;
    });

    expect(inRangeButtons.length).toBeGreaterThan(0);
    outOfRangeButtons.forEach(btn => {
      expect(btn.getAttribute('aria-disabled')).toBe('true');
    });
    inRangeButtons.forEach(btn => {
      expect(btn.getAttribute('aria-disabled')).toBe('false');
    });
  });

});

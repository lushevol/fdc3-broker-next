import '../../../../elements/sc-date-picker.js';
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import { fixture, html } from '@open-wc/testing-helpers';
import { DateTimeFormat } from '../../../../src/components/ScDatePicker/constants.js';
import { toDateString } from '../../../../src/components/ScDatePicker/helpers/to-date-string.js';
import { toFormatters } from '../../../../src/components/ScDatePicker/helpers/to-formatters.js';

import type { ScDatePicker } from '../../../../src/components/ScDatePicker/DatePicker/ScDatePicker.js';
import type { ScDateRangePicker } from '../../../../src/components/ScDatePicker/DateRangePicker/ScDateRangePicker.js';
import { scDatePickerName } from '../../../../src/components/ScDatePicker/DatePicker/constants.js';
import { scDateRangePickerName } from '../../../../src/components/ScDatePicker/DateRangePicker/constants.js';
import { getDate } from '../../../../src/components/ScDatePicker/helpers/get-date.js';

describe(scDateRangePickerName, () => {
  const monthYearFormatter = DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  });

  const elementSelectors = {
    datePicker: scDatePickerName,
  } as const;
  const formatters = toFormatters(DateTimeFormat().resolvedOptions().locale);
  
  it('renders', async () => {
    const el = await fixture<ScDateRangePicker>(
      html`<sc-date-range-picker></sc-date-range-picker>`
    );
    // eslint-disable-next-line
    const datePickers = el.shadowRoot!.querySelectorAll(elementSelectors.datePicker);
    expect(Array.from(datePickers).length).toEqual(2);
  });

  it('handles onDatePickerValueUpdated with quickSelect correctly and emits sc-select event', async () => {
    const el = await fixture<ScDateRangePicker>(
      html`<sc-date-range-picker></sc-date-range-picker>`
    );

    const today = getDate();
    const todayValueStr = toDateString(today);

    const emitSpy = jest.spyOn(el, 'emit');

    const pastDate = getDate(today);
    pastDate.setDate(today.getDate() - 5);
    const pastEvent = new CustomEvent('value-updated', {
      detail: {
        value: toDateString(pastDate),
        valueAsDate: pastDate,
        quickSelect: true,
      },
    });

    el.onDatePickerValueUpdated(pastEvent, 'start');

    await el.updateComplete;

    expect(el._selectedStartDate).toBe(toDateString(pastDate));
    expect(el._selectedEndDate).toBe(todayValueStr);

    expect((el as any)._value).toEqual({
      start: toDateString(pastDate),
      end: todayValueStr,
    });

    expect(emitSpy).toHaveBeenCalledWith('sc-select', {
      detail: {
        isKeypress: false,
        value: {
          start: toDateString(pastDate),
          end: todayValueStr,
        },
        valueAsDate: pastDate,
        valueAsNumber: +pastDate,
        quickSelect: true,
      },
    });

    const futureDate = getDate(today);
    futureDate.setDate(today.getDate() + 5);
    const futureEvent = new CustomEvent('value-updated', {
      detail: {
        value: toDateString(futureDate),
        valueAsDate: futureDate,
        quickSelect: true,
      },
    });

    el.onDatePickerValueUpdated(futureEvent, 'end');

    await el.updateComplete;

    expect(el._selectedStartDate).toBe(todayValueStr);
    expect(el._selectedEndDate).toBe(toDateString(futureDate));

    expect((el as any)._value).toEqual({
      start: todayValueStr,
      end: toDateString(futureDate),
    });

    expect(emitSpy).toHaveBeenCalledWith('sc-select', {
      detail: {
        isKeypress: false,
        value: {
          start: todayValueStr,
          end: toDateString(futureDate),
        },
        valueAsDate: futureDate,
        valueAsNumber: +futureDate,
        quickSelect: true,
      },
    });

    const customStartDate = getDate(today);
    customStartDate.setDate(today.getDate() - 10);
    const customStartEvent = new CustomEvent('value-updated', {
      detail: {
        value: toDateString(customStartDate),
        valueAsDate: customStartDate,
        quickSelect: false,
      },
    });

    el.onDatePickerValueUpdated(customStartEvent, 'start');

    await el.updateComplete;

    expect(el._selectedStartDate).toBe(toDateString(customStartDate));
    expect((el as any)._value).toEqual({
      start: toDateString(customStartDate),
      end: toDateString(futureDate),
    });

    const customEndDate = getDate(today);
    customEndDate.setDate(today.getDate() + 10);
    const customEndEvent = new CustomEvent('value-updated', {
      detail: {
        value: toDateString(customEndDate),
        valueAsDate: customEndDate,
        quickSelect: false,
      },
    });

    el.onDatePickerValueUpdated(customEndEvent, 'end');

    await el.updateComplete;

    expect(el._selectedEndDate).toBe(toDateString(customEndDate));
    expect((el as any)._value).toEqual({
      start: toDateString(customStartDate),
      end: toDateString(customEndDate),
    });
  });

  it('defaults selection to end panel when today is later than max', async () => {
    const maxDate = getDate();
    maxDate.setUTCDate(maxDate.getUTCDate() - 1);
    const max = toDateString(maxDate);

    const expectedStartMonth = getDate(max);
    expectedStartMonth.setUTCMonth(expectedStartMonth.getUTCMonth() - 1);

    const el = await fixture<ScDateRangePicker>(
      html`<sc-date-range-picker locale="en-US" .min=${'1970-01-01'} .max=${max}></sc-date-range-picker>`
    );

    const [startPicker, endPicker] = Array.from(
      el.shadowRoot!.querySelectorAll(scDatePickerName)
    ) as ScDatePicker[];

    await startPicker.updateComplete;
    await endPicker.updateComplete;

    const startMonth = startPicker.shadowRoot?.querySelector('.selected-year-month')?.textContent || '';
    const endMonth = endPicker.shadowRoot?.querySelector('.selected-year-month')?.textContent || '';
    const expectedStartMonthShort = expectedStartMonth.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    const expectedStartMonthLong = expectedStartMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const expectedEndMonthShort = maxDate.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    const expectedEndMonthLong = maxDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const endCalendar = endPicker.shadowRoot?.querySelector('sc-month-calendar') as any;
    const endToday = endCalendar?.shadowRoot?.querySelector('.calendar-day.day--today');
    expect(startPicker.value).toBe('');
    expect(endPicker.value).toBe('');
    expect(
      startMonth.includes(expectedStartMonthShort) || startMonth.includes(expectedStartMonthLong)
    ).toBe(true);
    expect(
      endMonth.includes(expectedEndMonthShort) || endMonth.includes(expectedEndMonthLong)
    ).toBe(true);
    expect(endToday).toBeInTheDocument();
  });

  it('defaults selection to start panel when today is earlier than min', async () => {
    const minDate = getDate();
    minDate.setUTCDate(minDate.getUTCDate() + 1);
    const min = toDateString(minDate);

    const expectedEndMonth = getDate(minDate);
    expectedEndMonth.setUTCMonth(expectedEndMonth.getUTCMonth() + 1);

    const el = await fixture<ScDateRangePicker>(
      html`<sc-date-range-picker locale="en-US" .min=${min} .max=${'2100-12-31'}></sc-date-range-picker>`
    );

    const [startPicker, endPicker] = Array.from(
      el.shadowRoot!.querySelectorAll(scDatePickerName)
    ) as ScDatePicker[];

    await startPicker.updateComplete;
    await endPicker.updateComplete;

    const endMonth = endPicker.shadowRoot?.querySelector('.selected-year-month')?.textContent || '';
    const expectedEndMonthShort = expectedEndMonth.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    const expectedEndMonthLong = expectedEndMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const startCalendar = startPicker.shadowRoot?.querySelector('sc-month-calendar') as any;
    const startToday = startCalendar?.shadowRoot?.querySelector('.calendar-day.day--today');
    expect(startPicker.value).toBe('');
    expect(endPicker.value).toBe('');
    expect(
      endMonth.includes(expectedEndMonthShort) || endMonth.includes(expectedEndMonthLong)
    ).toBe(true);
    expect(startToday).toBeInTheDocument();
  });
});

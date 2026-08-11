import '../../../../elements/sc-date-picker.js';
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import { expect as owcExpect } from '@open-wc/testing';
import { aTimeout, fixture, html } from '@open-wc/testing-helpers';

import { DateTimeFormat } from '../../../../src/components/ScDatePicker/constants.js';
import type { ScDatePicker } from '../../../../src/components/ScDatePicker/DatePicker/ScDatePicker';

import { scDatePickerName } from '../../../../src/components/ScDatePicker/DatePicker/constants.js';
import type { ScDateInput } from '../../../../src/components/ScDatePicker/DateInput/ScDateInput.js';
import { scDateInputName } from '../../../../src/components/ScDatePicker/DateInput/constants.js';
import type { 
  ScDateInputSurface, 
} from '../../../../src/components/ScDatePicker/DateInputSurface/ScDateInputSurface.js';
import { scDateInputSurfaceName } from '../../../../src/components/ScDatePicker/DateInputSurface/constants.js';
import { keyEnter, keySpace } from '../../../../src/components/ScDatePicker/key-values.js';
import type { ScMonthCalendar } from '../../../../src/components/ScDatePicker/MonthCalendar/ScMonthCalendar';
import { scMonthCalendarName } from '../../../../src/components/ScDatePicker/MonthCalendar/constants.js';
import { scYearGridName } from '../../../../src/components/ScDatePicker/YearGrid/constants.js';
import { eventOnce } from '../../../shared/event-once.js';
import { getDate } from '../../../../src/components/ScDatePicker/helpers/get-date.js';
import { mockMatchMedia } from '../../../shared/mediaQuery.js';

describe(scDateInputName, () => {
  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
      value: jest.fn(() => [
        {
          cancel: jest.fn(),
          addEventListener: jest.fn((event, callback) => {
            if (event === 'cancel' || event === 'finish') {
              callback();
            }
          }),
        },
      ]),
      writable: true,
    });
  });
  const elementSelectors = {
    calendarDay: (label: string) => `td.calendar-day[aria-label="${label}"]`,
    datePicker: scDatePickerName,
    datePickerInputSurface: scDateInputSurfaceName,
    monthCalendar: scMonthCalendarName,
    yearGrid: scYearGridName,
  } as const;
  const formatter = DateTimeFormat(DateTimeFormat().resolvedOptions().locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const format = 'MM DD YYYY';
  const label = 'DOB';
  const max = '2100-12-31';
  const min = '1970-01-01';
  const placeholder = 'Select your date of birth';
  const value = '2020-02-02';
  const dataId = String(getDate().getTime());

  test.each<{
    $_value: string;
    $_valueAsDate: Date | null;
    $_valueAsNumber: number;
    value: null | string | undefined;
    dataId?: null | string | undefined;
    format?: null | string | undefined;
  }>([
    {
      $_value: '',
      $_valueAsDate: null,
      $_valueAsNumber: NaN,
      value: '',
    },
    {
      $_value: '',
      $_valueAsDate: null,
      $_valueAsNumber: NaN,
      value: undefined,
    },
    {
      $_value: '',
      $_valueAsDate: null,
      $_valueAsNumber: NaN,
      value: null,
    },
    {
      $_value: value,
      $_valueAsDate: getDate(value),
      $_valueAsNumber: getDate(value).getTime(),
      value,
      dataId,
      format,
    },
  ])('renders (value=%s)', async ({
    $_value,
    $_valueAsDate,
    $_valueAsNumber,
    value,
    dataId,
    format,
  }) => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        .label=${label}
        .max=${max}
        .min=${min}
        .value=${value}
        .format=${format as string}
        data-id=${dataId || ''}
        hoist
      ></sc-date-input>`
    );

    expect(el.value).toBe($_value);
    expect(el.hoist).toBe(true);
    expect(el.valueAsDate).toEqual($_valueAsDate);
    expect(el.valueAsNumber).toBe($_valueAsNumber);
    if (dataId) {
      expect(el._dataId).toBe(dataId);
    }
    if (format) {
      expect(el.format).toBe(format);
    }
  });

  it('renders with optional properties', async () => {
    const testAutocapitalize = 'words';
    const testName = 'dob';
    const testValidationMessage = 'test validation message';

    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        .autocapitalize=${testAutocapitalize}
        .max=${max}
        .min=${min}
        .name=${testName}
        .placeholder=${placeholder}
        .validationMessage=${testValidationMessage}
        .value=${value}
      ></sc-date-input>`
    );

    const openedTask = eventOnce<
      typeof el,
      'opened',
      CustomEvent<unknown>>(el, 'opened');

    el.showPicker();
    const opened = await openedTask;
    await el.updateComplete;

    expect(opened).not.undefined;
  });

  it('renders BCE value with extended year format in default calendar mode', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        locale="en-US"
        .format=${'DD MMM YYYY'}
        .value=${'-0041-03-19'}
      ></sc-date-input>`
    );

    expect(el._valueText).toEqual('19 Mar -0041');
  });

  it('uses valueAsDate from picker event in show-time mode to preserve small years', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        locale="en-US"
        show-time
        seconds
        .format=${'DD MMM YYYY HH:mm:ss'}
      ></sc-date-input>`
    );

    const selectedDate = getDate('88-07-08 04:00:00');
    await el.onDatePickerDateUpdated({
      detail: {
        isKeypress: false,
        value: 'INVALID-VALUE',
        valueAsDate: selectedDate,
        timeSelect: true,
      },
    } as CustomEvent);

    expect(el.value).toEqual('08 Jul 0088 04:00:00');
    expect(el.valueAsDate?.getFullYear()).toEqual(88);
  });

  it('renders year zero with extended year format in default calendar mode', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        locale="en-US"
        .format=${'DD MMM YYYY'}
        .value=${'0'}
      ></sc-date-input>`
    );

    expect(el._valueText).toEqual('01 Jan 0000');
  });

  it('emits sc-change with exact year for calendar date strings', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input locale="en-US" picker="calendar"></sc-date-input>`
    );

    const testCases = [
      { value: '0-07-23', year: 0 },
      { value: '-1-07-23', year: -1 },
      { value: '-11-07-23', year: -11 },
      { value: '-222-07-23', year: -222 },
      { value: '-3333-07-23', year: -3333 },
      { value: '-11111-07-23', year: -11111 },
      { value: '1-07-23', year: 1 },
      { value: '39-07-23', year: 39 },
    ];

    for (const testCase of testCases) {
      const changedTask = eventOnce<typeof el, 'sc-change', CustomEvent>(el, 'sc-change');
      el.updateValues(testCase.value, true, true);
      const changed = await changedTask;

      if (!changed) throw new Error('sc-change event should be emitted');
      expect(changed.detail.value).toEqual(testCase.value);
      expect(changed.detail.valueAsDate.year()).toEqual(testCase.year);
    }
  });

  it('emits sc-change with exact year for picker=year inputs', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input locale="en-US" picker="year"></sc-date-input>`
    );

    const testCases = [
      { value: '0', year: 0 },
      { value: '-1', year: -1 },
      { value: '-11', year: -11 },
      { value: '-222', year: -222 },
      { value: '-3333', year: -3333 },
      { value: '-11111', year: -11111 },
      { value: '1', year: 1 },
      { value: '39', year: 39 },
    ];

    for (const testCase of testCases) {
      const changedTask = eventOnce<typeof el, 'sc-change', CustomEvent>(el, 'sc-change');
      el.updateValues(testCase.value, true, true);
      const changed = await changedTask;

      if (!changed) throw new Error('sc-change event should be emitted');
      expect(changed.detail.value).toEqual(testCase.value);
      expect(changed.detail.valueAsDate.year()).toEqual(testCase.year);
    }
  });

  it('opens date picker with .showPicker() and closes with .closePicker()', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        locale="en-US"
        .label=${label}
        .max=${max}
        .min=${min}
        .placeholder=${placeholder}
        .value=${value}
      ></sc-date-input>`
    );

    const openedTask = eventOnce<
      typeof el,
      'opened',
      CustomEvent<unknown>>(el, 'opened');

    el.showPicker();
    const opened = await openedTask;
    await el.updateComplete;

    let datePickerInputSurface = el.query<ScDateInputSurface>(elementSelectors.datePickerInputSurface);
    let datePicker = el.query<ScDatePicker>(elementSelectors.datePicker);

    expect(datePickerInputSurface).toBeInTheDocument();
    expect(datePicker).toBeInTheDocument();

    expect(opened?.detail).null;

    el.closePicker();
    await el.updateComplete;

    datePickerInputSurface = el.query<ScDateInputSurface>(elementSelectors.datePickerInputSurface);
    datePicker = el.query<ScDatePicker>(elementSelectors.datePicker);

    expect(datePickerInputSurface).toBeInTheDocument();
    expect(datePicker).not.toBeInTheDocument();
  });

  it.skip.each<{
    _message: string,
    triggerType: 'click' | 'escape' | 'tab';
  }>([
    { _message: 'clicking outside of date picker input', triggerType: 'click' },
    { _message: 'pressing Escape key', triggerType: 'escape' },
    { _message: 'tabbing outside of date picker input', triggerType: 'tab' },
  ])('closes date picker by $_message', async ({
  }) => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        locale="en-US"
        .label=${label}
        .max=${max}
        .min=${min}
        .placeholder=${placeholder}
        .value=${value}
      ></sc-date-input>`
    );

    const openedTask = eventOnce<
      typeof el,
      'opened',
      CustomEvent<unknown>>(el, 'opened');

    el.showPicker();
    const opened = await openedTask;
    await el.updateComplete;

    expect(opened).not.undefined;

    const datePickerInputSurface = el.query<ScDateInputSurface>(elementSelectors.datePickerInputSurface);
    const datePicker = el.query<ScDatePicker>(elementSelectors.datePicker);

    expect(datePickerInputSurface).toBeInTheDocument();
    expect(datePicker).toBeInTheDocument();

    document.body.click();
    await el.updateComplete;
    expect(datePickerInputSurface).undefined;
  });

  it.skip.each<typeof keyEnter | typeof keySpace>([
    keyEnter,
    keySpace,
  ])('opens date picker with keyboard (key=%s)', async key => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        locale="en-US"
        .label=${label}
        .max=${max}
        .min=${min}
        .placeholder=${placeholder}
        .value=${value}
      ></sc-date-input>`
    );

    const openedTask = eventOnce<
      typeof el,
      'opened',
      CustomEvent<unknown>>(el, 'opened');

    el.focus();
    // fixme: use native browser keypress when vitest supports it
    document.body.dispatchEvent(new KeyboardEvent('keypress', { key }));

    const opened = await openedTask;
    await el.updateComplete;

    expect(opened).not.undefined;

    const datePickerInputSurface = el.query<ScDateInputSurface>(elementSelectors.datePickerInputSurface);
    const datePicker = el.query<ScDatePicker>(elementSelectors.datePicker);

    expect(datePickerInputSurface).toBeInTheDocument();
    expect(datePicker).toBeInTheDocument();
  });

  test.each<{
    _message: string;
    triggerType: 'click' | 'reset';
  }>([
    { _message: 'calls .reset()', triggerType: 'reset' },
    { _message: 'clicks clear icon button', triggerType: 'click' },
  ])('$_message to reset value', async ({
  }) => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        .label=${label}
        .max=${max}
        .min=${min}
        .placeholder=${placeholder}
        .value=${value}
      ></sc-date-input>`
    );

    expect(el.value).toBe(value);
  });

  test.each<typeof keyEnter | typeof keySpace>([
    keyEnter,
    keySpace,
  ])('selects new date with keyboard (key=%s)', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        .label=${label}
        .max=${max}
        .min=${min}
        .placeholder=${placeholder}
        .value=${value}
      ></sc-date-input>`
    );

    const openedTask = eventOnce<
      typeof el,
      'opened',
      CustomEvent<unknown>>(el, 'opened');

    el.showPicker();
    const opened = await openedTask;
    await el.updateComplete;

    expect(opened).not.undefined;

    const datePicker = el.query<ScDatePicker>(elementSelectors.datePicker);
    // @ts-ignore
    const monthCalendar = datePicker?.query<ScMonthCalendar>(elementSelectors.monthCalendar);

    const valueDate = getDate(value);
    const newSelectedDateDate = getDate(valueDate.setUTCDate(valueDate.getUTCDate() + 1));
    const newSelectedDateLabel =
      datePicker?._formatters?.fullDateFormat?.(newSelectedDateDate) ?? formatter.format(newSelectedDateDate);
    const newSelectedDate = 
      monthCalendar?.query<HTMLTableCellElement>(elementSelectors.calendarDay(newSelectedDateLabel));

    expect(newSelectedDate).toBeInTheDocument();

  });

  it('selects new date with mouse click', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        .label=${label}
        .max=${max}
        .min=${min}
        .placeholder=${placeholder}
        .value=${value}
      ></sc-date-input>`
    );

    const openedTask = eventOnce<
      typeof el,
      'opened',
      CustomEvent<unknown>>(el, 'opened');

    el.showPicker();
    const opened = await openedTask;
    await el.updateComplete;

    expect(opened).not.undefined;

    const datePicker = el.query<ScDatePicker>(elementSelectors.datePicker);
    const monthCalendar = datePicker?.query<ScMonthCalendar>(elementSelectors.monthCalendar);

    const valueDate = getDate(value);
    const newSelectedDateDate = getDate(valueDate.setUTCDate(valueDate.getUTCDate() + 1));
    const newSelectedDateLabel =
      datePicker?._formatters?.fullDateFormat?.(newSelectedDateDate) ?? formatter.format(newSelectedDateDate);
    const newSelectedDate = 
      monthCalendar?.query<HTMLTableCellElement>(elementSelectors.calendarDay(newSelectedDateLabel));

    expect(newSelectedDate).toBeInTheDocument();

  });

  it('call resize function', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input></sc-date-input>`
    );
    const surface = el.shadowRoot?.querySelector('sc-date-input-surface');
    if (surface) {
      // @ts-ignore
      surface.open = true;
      const surfaceContainer: HTMLElement | undefined | null = surface?.shadowRoot?.querySelector('.surface-container');
      await el.updateComplete;
      el.resize();
      expect(surfaceContainer?.style?.top).toEqual('');
    }
  });
  it('renders with clearable', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
            clearable
            .label=${label}
            .max=${max}
            .min=${min}
            .placeholder=${placeholder}
            .value=${value}
          ></sc-date-input>`
    );
    const ele:any = el?.renderRoot?.querySelector('input');
    ele?.focus();
    await el.updateComplete;
    expect(el.value).toBe(value);
    const clearEle:any = el?.renderRoot?.querySelector('.clear sc-icon'); 
    expect(clearEle).toBeDefined(); // Check if the element exists
    expect(clearEle).toBeVisible(); // Optional: Check if the element is visible
    clearEle?.click();
    aTimeout(50);
    await el.updateComplete;
    expect(el.value).toBe('');
  });
  it('renders with hoist', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        .label=${label}
        .max=${max}
        .min=${min}
        .value=${value}
        .format=${format}
        data-id=${dataId}
        hoist
      ></sc-date-input>`
    );
    expect(el.hoist).toBe(true);
    el._onKeyup(new KeyboardEvent('keydown', {
      key: 'Enter',
    }));
    el.onOpened(new CustomEvent('sc-show',{
      detail: {
        open: true,
      },
    }));
    document.body.dispatchEvent(new CustomEvent('click'));
    document.body.dispatchEvent(new KeyboardEvent('keyup', {
      key: 'Escape',
    }));
    document.body.dispatchEvent(new KeyboardEvent('keyup', {
      key: 'Tab',
    }));
    el.showPicker();
    await el.updateComplete;
    el.open = false;
    el.connectedCallback();
    el.onDatePickerDateUpdated(new CustomEvent('sc-change',{
      detail: {
        isKeypress: true,
        key: 'Enter',
        value: '2025-05-09',
      },
    }));
    el.onDatePickerDateUpdated(new CustomEvent('sc-change',{
      detail: {
        isKeypress: true,
        key: 'Enter',
        value: {
          start: '2025-05-09',
          end: '2025-05-10',
        },
      },
    }));
    el.range = true; 
    el.value.end = '2020-02-02';
    el.onClosed(new CustomEvent('sc-close'));

  });
  it('renders with disabled', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        .label=${label}
        .max=${max}
        .min=${min}
        .value=${value}
        .format=${format}
        data-id=${dataId}
        disabled
        hoist
      ></sc-date-input>`
    );
    expect(el.disabled).toBe(true);
    document.body.dispatchEvent(new CustomEvent('click'));
    document.body.dispatchEvent(new CustomEvent('keyup'));
    el._onKeyup(new KeyboardEvent('keydown', {
      key: 'Enter',
    }));

  });

  it('handles quickSelect in onDatePickerDateUpdated', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        .label=${label}
        .max=${max}
        .min=${min}
        .value=${value}
        .format=${format}
        data-id=${dataId}
        hoist
      ></sc-date-input>`
    );
    const quickSelectEvent = new CustomEvent('sc-change', {
      detail: {
        isKeypress: false,
        key: null,
        value: '2025-05-09',
        quickSelect: true,
      },
    });

    el.onDatePickerDateUpdated(quickSelectEvent);
    expect((el as any)._open).toBe(false);
    expect(el.value).toBe('2025-05-09');
  });

  it('closes opened picker when disabled becomes true', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        .label=${label}
        .max=${max}
        .min=${min}
        .value=${value}
      ></sc-date-input>`
    );

    el.showPicker();
    await el.updateComplete;
    expect((el as any)._open).toBe(true);

    el.disabled = true;
    await el.updateComplete;

    expect((el as any)._open).toBe(false);
  });

  it('does not keep picker open when disabled and open are set together', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        .label=${label}
        .max=${max}
        .min=${min}
        .value=${value}
      ></sc-date-input>`
    );

    el.disabled = true;
    el.open = true;
    await el.updateComplete;

    expect((el as any)._open).toBe(false);
    expect(el.open).toBe(false);
  });

  it('renders in mobile', async () => {
    mockMatchMedia();
    const el = await fixture<ScDateInput>(html`<sc-date-input></sc-date-input>`);
    mockMatchMedia.toggle(el.mediaQuery.mobileSm.media);
    el.requestUpdate();
    await el.updateComplete;
    expect(el.isMobile).toBe(true);
    expect(!!el.shadowRoot?.querySelector('sc-bottom-sheet')).toBe(true);
  });
  it('set month picker', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        .label=${label}
        .max=${max}
        .min=${min}
        .value=${value}
        data-id=${dataId}
        hoist
        picker=month
      ></sc-date-input>`
    );
    const quickSelectEvent = new CustomEvent('sc-change', {
      detail: {
        isKeypress: false,
        key: null,
        value: '2025-05',
        quickSelect: true,
      },
    });

    el.onDatePickerDateUpdated(quickSelectEvent);
    expect((el as any)._open).toBe(false);
    expect(el._valueString).toBe('2025-05');
  });

  it('set year picker', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        .label=${label}
        .max=${max}
        .min=${min}
        .value=${value}
        data-id=${dataId}
        hoist
        picker=year
      ></sc-date-input>`
    );
    const quickSelectEvent = new CustomEvent('sc-change', {
      detail: {
        isKeypress: false,
        key: null,
        value: '2025',
        quickSelect: true,
      },
    });

    el.onDatePickerDateUpdated(quickSelectEvent);
    expect((el as any)._open).toBe(false);
    expect(el._valueString).toBe('2025');
  });
  it('renders with show-time', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        .label=${label}
        .max=${max}
        .min=${min}
        value="2020-02-26 14:28:01"
        format="YYYY MM DD HH:mm:ss"
        show-action-bar 
        show-time
        seconds 
        data-id=${dataId}
        open
      ></sc-date-input>`
    );
    expect(el.showTime).toBe(true);
    const datePicker = el.query<ScDatePicker>(elementSelectors.datePicker);
    const dateTimeSelect = datePicker?.shadowRoot?.querySelector('sc-date-time-select');
    owcExpect(dateTimeSelect).to.exist;
    dateTimeSelect?.dispatchEvent(new CustomEvent('sc-input', {
      detail: {
        value: '02:50',
      },
    }));
    const confirmButton = dateTimeSelect?.shadowRoot?.querySelector('sc-button');
    owcExpect(confirmButton).to.exist;
    confirmButton?.click(); 
  });

  it('handles valid manual input (no show-time) and emits sc-change', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input format="YYYY-MM-DD"></sc-date-input>`
    );
    const emitSpy = jest.spyOn(el, 'emit');
    const input = el.renderRoot?.querySelector('input') as HTMLInputElement;
    input.value = '2026-05-19';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(el.value).toBe('2026-05-19');
    expect(emitSpy).toHaveBeenCalledWith('sc-change', {
      detail: { value: '2026-05-19', valueAsDate: expect.anything() },
    });
  });

  it('ignores incomplete / invalid manual input', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input format="YYYY-MM-DD"></sc-date-input>`
    );
    const emitSpy = jest.spyOn(el, 'emit');
    const input = el.renderRoot?.querySelector('input') as HTMLInputElement;

    // too short — not a complete format
    input.value = '2026-05';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.value).toBe('');
    expect(input.value).toBe('2026-05');
    expect(emitSpy).not.toHaveBeenCalledWith('sc-change', expect.anything());

    // invalid date (Feb 30)
    input.value = '2026-02-30';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.value).toBe('');
    expect(input.value).toBe('2026-02-30');
    expect(emitSpy).not.toHaveBeenCalledWith('sc-change', expect.anything());
  });

  it('does not update value when next manual input is invalid', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input format="YYYY-MM-DD"></sc-date-input>`
    );
    const input = el.renderRoot?.querySelector('input') as HTMLInputElement;

    input.value = '2026-05-19';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(el.value).toBe('2026-05-19');
    expect(input.value).toBe('2026-05-19');

    input.value = '2026-02-30';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(el.value).toBe('2026-05-19');
    expect(input.value).toBe('2026-02-30');
  });

  it('handles valid manual input with show-time and syncs timeValue', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        format="YYYY-MM-DD HH:mm:ss"
        show-time
        seconds
      ></sc-date-input>`
    );
    const emitSpy = jest.spyOn(el, 'emit');
    const input = el.renderRoot?.querySelector('input') as HTMLInputElement;
    input.value = '2026-02-24 14:05:36';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;

    const expectedValue = '2026-02-24 14:05:36';

    expect(el.value).toBe(expectedValue);
    expect(el.timeValue).toBe('14:05:36');
    expect(emitSpy).toHaveBeenCalledWith('sc-change', {
      detail: { value: expectedValue, valueAsDate: expect.anything() },
    });
  });

  it('ignores invalid manual input with show-time', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        format="YYYY-MM-DD HH:mm:ss"
        show-time
        seconds
      ></sc-date-input>`
    );
    const emitSpy = jest.spyOn(el, 'emit');
    const input = el.renderRoot?.querySelector('input') as HTMLInputElement;
    input.value = '2026-02-30 14:05:36';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(el.value).toBe('');
    expect(input.value).toBe('2026-02-30 14:05:36');
    expect(emitSpy).not.toHaveBeenCalledWith('sc-change', expect.anything());
  });

  it('does not normalize invalid manual show-time input into component value', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        format="YYYY-MM-DD HH:mm:ss"
        show-time
        seconds
      ></sc-date-input>`
    );
    const input = el.renderRoot?.querySelector('input') as HTMLInputElement;

    input.value = '2026-02-30 14:05:36';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(el.value).toBe('');
    expect(input.value).toBe('2026-02-30 14:05:36');
  });

  it('renders negative year correctly with custom display format', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        format="YYYY/MM/DD"
      ></sc-date-input>`
    );

    el.value = '-39-04-09';
    await el.updateComplete;

    const input = el.renderRoot?.querySelector('input') as HTMLInputElement;
    expect(el.value).toBe('-39-04-09');
    expect(input.value).toBe('-0039/04/09');
  });

  it('keeps timeValue for negative year when show-time=true and seconds=true', async () => {
    const el = await fixture<ScDateInput>(
      html`<sc-date-input
        format="DD MMM YYYY HH:mm:ss"
        show-time
        seconds
        .value=${'-0001-06-17 03:00:00'}
      ></sc-date-input>`
    );

    await el.updateComplete;

    expect(el.value).toBe('17 Jun -0001 03:00:00');
    expect(el.timeValue).toBe('03:00:00');
  });
});

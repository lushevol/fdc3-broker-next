import '../../../../elements/sc-date-picker.js';
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import { fixture, html } from '@open-wc/testing-helpers';

import type { ScDateRangeInput } from '../../../../src/components/ScDatePicker/DateRangeInput/ScDateRangeInput.js';
import { scDateInputName } from '../../../../src/components/ScDatePicker/DateInput/constants.js';
import { scDateRangeInputName } from '../../../../src/components/ScDatePicker/DateRangeInput/constants.js';
import { getDate } from '../../../../src/components/ScDatePicker/helpers/get-date.js';

describe(scDateRangeInputName, () => {
  const rangeValue = {
    start: '2026-02-06 02:05:20',
    end: '2026-02-24 02:05:36',
  };

  const elementSelectors = {
    datePickerInput: scDateInputName,
  } as const;
  
  it('renders', async () => {
    const el = await fixture<ScDateRangeInput>(
      html`<sc-date-range-input></sc-date-range-input>`
    );
    el.highLightDivider(true);
    el.highLightDivider(false);
    // eslint-disable-next-line
    const datePickerInputs = el.shadowRoot!.querySelectorAll(elementSelectors.datePickerInput);
    expect(Array.from(datePickerInputs).length).toEqual(2);
    expect(Number.isFinite(+(el._dataId))).toEqual(true);
    expect(el.getAttribute('data-id')).toEqual(el._dataId);
  });
  it('renders when border type is box', async () => {
    const el = await fixture<ScDateRangeInput>(
      html`<sc-date-range-input border-type='box'></sc-date-range-input>`
    );
    el.highLightDivider(true);
    el.highLightDivider(false);
    // eslint-disable-next-line
    const datePickerInputs = el.shadowRoot!.querySelectorAll(elementSelectors.datePickerInput);
  
    expect(Array.from(datePickerInputs).length).toEqual(2);
  });
  it('call click handler', async () => {
    const el = await fixture<ScDateRangeInput>(
      html`<sc-date-range-input></sc-date-range-input>`
    );
    const startDatePickerInputs = el.shadowRoot!.querySelectorAll(elementSelectors.datePickerInput)[0];
    startDatePickerInputs.click(); 
    expect(el._startShown).toEqual(true);
    const endDatePickerInputs = el.shadowRoot!.querySelectorAll(elementSelectors.datePickerInput)[1];
    endDatePickerInputs.click();
    expect(el._endShown).toEqual(true);
  });
  it('call clear handler', async () => {
    const el = await fixture<ScDateRangeInput>(
      html`<sc-date-range-input></sc-date-range-input>`
    );
    el.handleClear(new Event(''));
    expect(el.value).toEqual('');
  });
  it('renders hoist', async () => {
    const el = await fixture<ScDateRangeInput>(
      html`<sc-date-range-input hoist></sc-date-range-input>`
    );
    expect(el.hoist).toEqual(true);
  });
  it('onDateChange returns early if value is a string', async () => {
    const el = await fixture<ScDateRangeInput>(
      html`<sc-date-range-input></sc-date-range-input>`
    );
    const event = new CustomEvent('sc-change', { detail: { value: 'string-value' } });
    const emitSpy = jest.spyOn(el, 'emit');
    const stopSpy = jest.spyOn(event, 'stopPropagation');
    const preventSpy = jest.spyOn(event, 'preventDefault');
    el.value = { start: '2023-01-01', end: '2023-01-02' };
    el.onDateChange(event, 'start');
    expect(stopSpy).toHaveBeenCalled();
    expect(preventSpy).toHaveBeenCalled();
    expect(el.value).toEqual({ start: '2023-01-01', end: '2023-01-02' });
    expect(emitSpy).not.toHaveBeenCalled();
  });
  it('onDateChange updates value and emits for end', async () => {
    const el = await fixture<ScDateRangeInput>(
      html`<sc-date-range-input></sc-date-range-input>`
    );
    el.value = { start: '2023-01-01' };
    const event = new CustomEvent('sc-change', { detail: { value: { end: '2023-01-02' } } });
    const emitSpy = jest.spyOn(el, 'emit');
    const stopSpy = jest.spyOn(event, 'stopPropagation');
    const preventSpy = jest.spyOn(event, 'preventDefault');
    el.onDateChange(event, 'end');
    expect(stopSpy).toHaveBeenCalled();
    expect(preventSpy).toHaveBeenCalled();
    expect(el.value.end).toBe('2023-01-02');
    expect(el._endShown).toBe(false);
    expect(emitSpy).toHaveBeenCalledWith('sc-change', { detail: { value: el.value } });
  });
  it('onDateChange does not emit if start is missing', async () => {
    const el = await fixture<ScDateRangeInput>(
      html`<sc-date-range-input></sc-date-range-input>`
    );
    el.value = {};
    const event = new CustomEvent('sc-change', { detail: { value: { end: '2023-01-02' } } });
    const emitSpy = jest.spyOn(el, 'emit');
    el.onDateChange(event, 'end');
    expect(el.value.end).toBe('2023-01-02');
    expect(emitSpy).not.toHaveBeenCalled();
  });
  it('closePicker after body click', async () => {
    const el = await fixture<ScDateRangeInput>(
      html`<sc-date-range-input></sc-date-range-input>`
    );
    const endDatePickerInputs = el.shadowRoot!.querySelectorAll(elementSelectors.datePickerInput)[1];
    endDatePickerInputs.click();
    expect(el._startShown).toBe(false);
    expect(el._endShown).toBe(true);
    el.closePicker();
    expect(el._startShown).toBe(false);
    expect(el._endShown).toBe(false);
  });
  it('renders with show-time', async () => {
    const el = await fixture<ScDateRangeInput>(
      html`<sc-date-range-input 
      .value=${rangeValue} 
      seconds 
      show-time 
      format="MM/DD/YYYY HH:mm:ss a" 
      ></sc-date-range-input>`
    );
    const value = el.value as { start: string; end: string };

    expect(el.showTime).toEqual(true);
    expect(value).toEqual(rangeValue);
    expect(getDate(value.start).getHours()).toEqual(2);
    expect(getDate(value.start).getMinutes()).toEqual(5);
    expect(getDate(value.start).getSeconds()).toEqual(20);
    expect(getDate(value.end).getHours()).toEqual(2);
    expect(getDate(value.end).getMinutes()).toEqual(5);
    expect(getDate(value.end).getSeconds()).toEqual(36);
  });

  it('updates start value and emits when manual input is valid (with show-time)', async () => {
    const el = await fixture<ScDateRangeInput>(
      html`<sc-date-range-input
        show-time
        seconds
        format="YYYY-MM-DD HH:mm:ss"
      ></sc-date-range-input>`
    );
    const emitSpy = jest.spyOn(el, 'emit');
    const startDateInput = el.shadowRoot!.querySelectorAll(elementSelectors.datePickerInput)[0] as any;
    const input = startDateInput?.renderRoot?.querySelector('input') as HTMLInputElement;

    input.value = '2026-02-06 02:05:20';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await startDateInput.updateComplete;
    await el.updateComplete;

    expect(el.value.start).toBe('2026-02-06 02:05:20');
    expect(startDateInput.timeValue.start).toBe('02:05:20');
    expect(emitSpy).toHaveBeenCalledWith('sc-change', {
      detail: { value: el.value, valueAsDate: expect.anything() },
    });
  });

  it('keeps range object value when picker emits timeSelect in show-time mode', async () => {
    const el = await fixture<ScDateRangeInput>(
      html`<sc-date-range-input
        show-time
        seconds
        format="DD MMM YYYY HH:mm:ss"
      ></sc-date-range-input>`
    );

    const startDateInput = el.shadowRoot!.querySelectorAll(elementSelectors.datePickerInput)[0] as any;
    const emittedRangeValue = {
      start: '08 Jul 0088 04:00:00',
      end: '14 Aug 0088 05:00:00',
    };

    await startDateInput.onDatePickerDateUpdated({
      detail: {
        isKeypress: false,
        value: emittedRangeValue,
        valueAsDate: getDate('88-07-08 04:00:00'),
        timeSelect: true,
      },
    } as CustomEvent);

    expect(el.value).toEqual(emittedRangeValue);
    expect((el.value as any).start).toEqual('08 Jul 0088 04:00:00');
    expect((el.value as any).end).toEqual('14 Aug 0088 05:00:00');
  });

  it('does not update range value when manual start input is invalid', async () => {
    const el = await fixture<ScDateRangeInput>(
      html`<sc-date-range-input
        show-time
        seconds
        format="YYYY-MM-DD HH:mm:ss"
      ></sc-date-range-input>`
    );
    const emitSpy = jest.spyOn(el, 'emit');
    const startDateInput = el.shadowRoot!.querySelectorAll(elementSelectors.datePickerInput)[0] as any;
    const input = startDateInput?.renderRoot?.querySelector('input') as HTMLInputElement;

    input.value = '2026-02-30 02:05:20';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await startDateInput.updateComplete;
    await el.updateComplete;

    expect(el.value?.start).toBeFalsy();
    expect(emitSpy).not.toHaveBeenCalledWith('sc-change', expect.anything());
  });

  test.each([
    ['-1', '17 Feb -0001'],
    ['-60', '17 Feb -0060'],
    ['-800', '17 Feb -0800'],
    ['-9999', '17 Feb -9999'],
  ])('keeps negative year display for range start input (%s)', async (yearInput, expectedDisplay) => {
    const el = await fixture<ScDateRangeInput>(
      html`<sc-date-range-input format="DD MMM YYYY"></sc-date-range-input>`
    );

    const startDateInput = el.shadowRoot!.querySelectorAll(elementSelectors.datePickerInput)[0] as any;
    const input = startDateInput?.renderRoot?.querySelector('input') as HTMLInputElement;

    input.value = `17 Feb ${yearInput}`;
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    await startDateInput.updateComplete;
    await el.updateComplete;

    expect(input.value).toBe(expectedDisplay);
  });

  it('rejects manual end month input earlier than start month', async () => {
    const el = await fixture<ScDateRangeInput>(
      html`<sc-date-range-input picker="month" format="MMM YYYY" .value=${{ start: '1000-03', end: '' }}></sc-date-range-input>`
    );

    const emitSpy = jest.spyOn(el, 'emit');
    const endDateInput = el.shadowRoot!.querySelectorAll(elementSelectors.datePickerInput)[1] as any;
    const input = endDateInput?.renderRoot?.querySelector('input') as HTMLInputElement;

    input.value = 'Aug 0999';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await endDateInput.updateComplete;
    await el.updateComplete;

    expect(el.value?.start).toBe('1000-03');
    expect(el.value?.end).toBeFalsy();
    expect(input.value).toBe('');
    expect(emitSpy).not.toHaveBeenCalledWith('sc-change', expect.objectContaining({
      detail: expect.objectContaining({
        value: expect.objectContaining({ end: expect.anything() }),
      }),
    }));
  });

  it('rejects manual start month input later than end month', async () => {
    const el = await fixture<ScDateRangeInput>(
      html`<sc-date-range-input picker="month" format="MMM YYYY" .value=${{ start: '', end: '0999-08' }}></sc-date-range-input>`
    );

    const emitSpy = jest.spyOn(el, 'emit');
    const startDateInput = el.shadowRoot!.querySelectorAll(elementSelectors.datePickerInput)[0] as any;
    const input = startDateInput?.renderRoot?.querySelector('input') as HTMLInputElement;

    input.value = 'Mar 1000';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await startDateInput.updateComplete;
    await el.updateComplete;

    expect(el.value?.start).toBeFalsy();
    expect(el.value?.end).toBe('0999-08');
    expect(input.value).toBe('');
    expect(emitSpy).not.toHaveBeenCalledWith('sc-change', expect.objectContaining({
      detail: expect.objectContaining({
        value: expect.objectContaining({ start: expect.anything() }),
      }),
    }));
  });
  
  it('does not open picker when disabled', async () => {
    const el = await fixture<ScDateRangeInput>(
      html`<sc-date-range-input disabled></sc-date-range-input>`
    );

    el.handleClick(new Event('click'), 'start');
    expect(el._startShown).toBe(false);
    expect(el._endShown).toBe(false);
  });

  it('closes shown picker when disabled becomes true', async () => {
    const el = await fixture<ScDateRangeInput>(
      html`<sc-date-range-input></sc-date-range-input>`
    );

    el.handleClick(new Event('click'), 'start');
    expect(el._startShown).toBe(true);

    el.disabled = true;
    await el.updateComplete;

    expect(el._startShown).toBe(false);
    expect(el._endShown).toBe(false);
  });
});

import '../../../../elements/sc-date-picker.js';
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import { fixture, html } from '@open-wc/testing-helpers';

import { toResolvedDate } from '../../../../src/components/ScDatePicker/helpers/to-resolved-date.js';
import type { ScMonthGrid } from '../../../../src/components/ScDatePicker/MonthGrid/ScMonthGrid';
import { scMonthGridName } from '../../../../src/components/ScDatePicker/MonthGrid/constants.js';
import { toFormatters } from '../../../../src/components/ScDatePicker/helpers/to-formatters.js';

const formatters = toFormatters('en-US');

describe(scMonthGridName, () => {
  it('renders', async () => {
    const todayDate = toResolvedDate();
    const el = await fixture<ScMonthGrid>(
      html`<sc-month-grid></sc-month-grid>`
    );
    expect(el.data.date.toString()).toEqual(todayDate.toString());
  });
  it('set the default data', async () => {
    const el = await fixture<ScMonthGrid>(
      html`<sc-month-grid .data=${{
        date: new Date('2026-01-01'),
        formatters,
        currentDate: new Date('2026-01-01'),
        min: new Date('1998-01-01'),
        max: new Date('2100-01-01'),
        picker: 'month',
      }}></sc-month-grid>`
    );
    const buttons = el.shadowRoot?.querySelectorAll('button');
    expect(buttons?.[0].getAttribute('aria-selected')).toEqual('true');
  });

  it('highlights March as today month for start picker on 2026-03-31', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 2, 31, 12, 0, 0));

    const el = await fixture<ScMonthGrid>(
      html`<sc-month-grid .data=${{
        date: new Date('2026-12-01'),
        formatters,
        currentDate: new Date('2026-12-01'),
        min: new Date('1998-01-01'),
        max: new Date('2100-01-01'),
        picker: 'month',
      }}></sc-month-grid>`
    );

    await el.updateComplete;

    const todayMonthButton = el.shadowRoot?.querySelector<HTMLButtonElement>('button.month--today');
    expect(todayMonthButton?.getAttribute('data-month-value')).toEqual('3');

    jest.useRealTimers();
  });

  it('highlights April as today month for end picker on 2026-03-31', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 2, 31, 12, 0, 0));

    const el = await fixture<ScMonthGrid>(
      html`<sc-month-grid .positionType=${'end'} .data=${{
        date: new Date('2026-12-01'),
        formatters,
        currentDate: new Date('2026-12-01'),
        min: new Date('1998-01-01'),
        max: new Date('2100-01-01'),
        picker: 'month',
      }}></sc-month-grid>`
    );

    await el.updateComplete;

    const todayMonthButton = el.shadowRoot?.querySelector<HTMLButtonElement>('button.month--today');
    expect(todayMonthButton?.getAttribute('data-month-value')).toEqual('4');

    jest.useRealTimers();
  });

  it('renders month labels for year 25 without throwing', async () => {
    const el = await fixture<ScMonthGrid>(
      html`<sc-month-grid .data=${{
        date: new Date('0025-04-11'),
        formatters,
        currentDate: new Date('0025-04-11'),
        min: new Date('0001-01-01'),
        max: new Date('2100-01-01'),
        picker: 'month',
      }}></sc-month-grid>`
    );

    await el.updateComplete;

    const monthButtons = el.shadowRoot?.querySelectorAll('button.month-grid-button');
    expect(monthButtons?.length).toEqual(12);
    expect(monthButtons?.[0].getAttribute('aria-label')).toBeTruthy();
  });

  it('uses currentDate as selected month in picker=month mode', async () => {
    const el = await fixture<ScMonthGrid>(
      html`<sc-month-grid .data=${{
        date: new Date('2026-03-10'),
        formatters,
        currentDate: new Date('2026-02-10'),
        min: new Date('1998-01-01'),
        max: new Date('2100-01-01'),
        picker: 'month',
      }}></sc-month-grid>`
    );

    await el.updateComplete;

    const selected = el.shadowRoot?.querySelector<HTMLButtonElement>('button[aria-selected="true"]');
    expect(selected?.getAttribute('data-month')).toEqual('Feb');
  });
});
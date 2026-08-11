import '../../../../elements/sc-date-picker.js';
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import { fixture, html } from '@open-wc/testing-helpers';

import type { ScYearGrid } from '../../../../src/components/ScDatePicker/YearGrid/ScYearGrid';
import { scYearGridName } from '../../../../src/components/ScDatePicker/YearGrid/constants.js';
import { labelSelectedYear, labelToyear } from '../../../../src/components/ScDatePicker/constants.js';
import { getDate } from '../../../../src/components/ScDatePicker/helpers/get-date.js';
import { toFormatters } from '../../../../src/components/ScDatePicker/helpers/to-formatters.js';

const locale = 'en-US';
const formatters = toFormatters(locale);

describe(scYearGridName, () => {
  const pageForYear = (year: number, minYear: number) => Math.floor((year - minYear) / 20);

  it('renders', async () => {
    const el = await fixture<ScYearGrid>(
      html`<sc-year-grid locale="en-US"></sc-year-grid>`
    );
    expect(el.page).toEqual(0);
  });
  it('sets range', async () => {
    const minYear = 2024;
    const page = pageForYear(2024, minYear);
    const el = await fixture<ScYearGrid>(
      html`<sc-year-grid locale="en-US" .data=${{
        date: new Date('2026-01-01'),
        min: new Date('2024-01-01'),
        max: new Date('2027-01-01'),
        picker: 'year' as const,
        selectedYearLabel: labelSelectedYear,
        toyearLabel: labelToyear,
        formatters,
      }} .page=${page}></sc-year-grid>`
    );
    expect(el.shadowRoot?.querySelectorAll('button[aria-disabled="true"]')?.length).toEqual(16);
  });

  it('highlights current year for start picker on 1900-12-31', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(1900, 11, 31, 12, 0, 0));
    const minYear = 1900;
    const page = pageForYear(1900, minYear);

    const el = await fixture<ScYearGrid>(
      html`<sc-year-grid locale="en-US" .data=${{
        date: new Date('1900-01-01'),
        min: new Date('1900-01-01'),
        max: new Date('2100-01-01'),
        picker: 'year' as const,
        selectedYearLabel: labelSelectedYear,
        toyearLabel: labelToyear,
        formatters,
      }} .page=${page}></sc-year-grid>`
    );

    await el.updateComplete;

    const todayYearButton = el.shadowRoot?.querySelector<HTMLButtonElement>('button.year--today');
    expect(todayYearButton?.getAttribute('data-year')).toEqual('1900');

    jest.useRealTimers();
  });

  it('highlights next year for end picker on 1900-12-31', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(1900, 11, 31, 12, 0, 0));
    const minYear = 1900;
    const page = pageForYear(1900, minYear);

    const el = await fixture<ScYearGrid>(
      html`<sc-year-grid locale="en-US" .positionType=${'end'} .data=${{
        date: new Date('1900-01-01'),
        min: new Date('1900-01-01'),
        max: new Date('2100-01-01'),
        picker: 'year' as const,
        selectedYearLabel: labelSelectedYear,
        toyearLabel: labelToyear,
        formatters,
      }} .page=${page}></sc-year-grid>`
    );

    await el.updateComplete;

    const todayYearButton = el.shadowRoot?.querySelector<HTMLButtonElement>('button.year--today');
    expect(todayYearButton?.getAttribute('data-year')).toEqual('1901');

    jest.useRealTimers();
  });

  it('supports BCE year rendering and selection', async () => {
    const minYear = -800;
    const page = pageForYear(-500, minYear);
    const el = await fixture<ScYearGrid>(
      html`<sc-year-grid locale="en-US" .data=${{
        date: getDate('-500'),
        min: getDate('-800'),
        max: getDate('-100'),
        picker: 'year' as const,
        selectedYearLabel: labelSelectedYear,
        toyearLabel: labelToyear,
        formatters,
      }} .page=${page}></sc-year-grid>`
    );

    await el.updateComplete;

    const selectedButton = el.shadowRoot?.querySelector<HTMLButtonElement>('button[aria-selected="true"]');
    expect(selectedButton).toBeInTheDocument();
    expect(selectedButton?.getAttribute('data-year')).toEqual('-500');
    expect(selectedButton?.getAttribute('aria-label')).toEqual('-500');
  });

  it('renders year zero explicitly in the year grid', async () => {
    const minYear = -1;
    const page = pageForYear(0, minYear);
    const el = await fixture<ScYearGrid>(
      html`<sc-year-grid locale="en-US" .data=${{
        date: getDate('0'),
        min: getDate('-1'),
        max: getDate('2'),
        picker: 'year' as const,
        selectedYearLabel: labelSelectedYear,
        toyearLabel: labelToyear,
        formatters,
      }} .page=${page}></sc-year-grid>`
    );

    await el.updateComplete;

    const yearButtons = Array.from(el.shadowRoot?.querySelectorAll('button[data-year]') ?? []);
    const yearZeroButton = yearButtons.find(button => button.getAttribute('data-year') === '0');

    expect(yearZeroButton).toBeInTheDocument();
    expect(yearZeroButton?.getAttribute('aria-label')).toEqual('0');
  });
});
import { ScDatePicker } from '../src/components/ScDatePicker/DatePicker/ScDatePicker.js';

import { ScDateRangePicker } from '../src/components/ScDatePicker/DateRangePicker/ScDateRangePicker.js';

import { ScDateInput } from '../src/components/ScDatePicker/DateInput/ScDateInput.js';

import { ScDateRangeInput } from '../src/components/ScDatePicker/DateRangeInput/ScDateRangeInput.js';

import { ScDateInputSurface } from '../src/components/ScDatePicker/DateInputSurface/ScDateInputSurface.js';

import { ScMonthGrid } from '../src/components/ScDatePicker/MonthGrid/ScMonthGrid.js';

import { ScYearGrid } from '../src/components/ScDatePicker/YearGrid/ScYearGrid.js';

import { ScYearGridButton } from '../src/components/ScDatePicker/YearGridButton/ScYearGridButton.js';

import { ScMonthCalendar } from '../src/components/ScDatePicker/MonthCalendar/ScMonthCalendar.js';

import { ScDateSelectTime } from '../src/components/ScDatePicker/DateSelectTime/ScDateSelectTime.js';

export * from '../src/components/ScDatePicker/DatePicker/ScDatePicker.js';
export * from '../src/components/ScDatePicker/DateRangePicker/ScDateRangePicker.js';
export * from '../src/components/ScDatePicker/DateInput/ScDateInput.js';
export * from '../src/components/ScDatePicker/DateRangeInput/ScDateRangeInput.js';
export * from '../src/components/ScDatePicker/DateInputSurface/ScDateInputSurface.js';
export * from '../src/components/ScDatePicker/MonthGrid/ScMonthGrid.js';
export * from '../src/components/ScDatePicker/YearGrid/ScYearGrid.js';
export * from '../src/components/ScDatePicker/YearGridButton/ScYearGridButton.js';
export * from '../src/components/ScDatePicker/MonthCalendar/ScMonthCalendar.js';
export * from '../src/components/ScDatePicker/DateSelectTime/ScDateSelectTime.js';

if (!window.customElements.get('sc-date-picker')) window.customElements.define('sc-date-picker', ScDatePicker);
if (!window.customElements.get('sc-date-range-picker')) window.customElements.define('sc-date-range-picker', ScDateRangePicker);
if (!window.customElements.get('sc-date-input')) window.customElements.define('sc-date-input', ScDateInput);
if (!window.customElements.get('sc-date-range-input')) window.customElements.define('sc-date-range-input', ScDateRangeInput);
if (!window.customElements.get('sc-date-input-surface')) window.customElements.define('sc-date-input-surface', ScDateInputSurface);
if (!window.customElements.get('sc-month-grid')) window.customElements.define('sc-month-grid', ScMonthGrid);
if (!window.customElements.get('sc-year-grid')) window.customElements.define('sc-year-grid', ScYearGrid);
if (!window.customElements.get('sc-year-grid-button')) window.customElements.define('sc-year-grid-button', ScYearGridButton);
if (!window.customElements.get('sc-month-calendar')) window.customElements.define('sc-month-calendar', ScMonthCalendar);
if (!window.customElements.get('sc-date-time-select')) window.customElements.define('sc-date-time-select', ScDateSelectTime);

declare global {
  interface HTMLElementTagNameMap {
    'sc-date-picker': ScDatePicker;
    'sc-date-range-picker': ScDateRangePicker;
    'sc-date-input': ScDateInput;
    'sc-date-range-input': ScDateRangeInput;
    'sc-date-input-surface': ScDateInputSurface;
    'sc-month-grid': ScMonthGrid;
    'sc-year-grid': ScYearGrid;
    'sc-year-grid-button': ScYearGridButton;
    'sc-month-calendar': ScMonthCalendar;
    'sc-date-time-select': ScDateSelectTime;
  }
}

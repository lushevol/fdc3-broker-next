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


window.customElements.define('sc-date-picker', ScDatePicker);
window.customElements.define('sc-date-range-picker', ScDateRangePicker);
window.customElements.define('sc-date-input', ScDateInput);
window.customElements.define('sc-date-range-input', ScDateRangeInput);
window.customElements.define('sc-date-input-surface', ScDateInputSurface);
window.customElements.define('sc-month-grid', ScMonthGrid);
window.customElements.define('sc-year-grid', ScYearGrid);
window.customElements.define('sc-year-grid-button', ScYearGridButton);
window.customElements.define('sc-month-calendar', ScMonthCalendar);
window.customElements.define('sc-date-time-select', ScDateSelectTime);

declare global {
  interface HTMLElementTagNameMap {
    'sc-date-picker': ScDatePicker,
    'sc-date-range-picker': ScDateRangePicker,
    'sc-date-input': ScDateInput,
    'sc-date-range-input': ScDateRangeInput,
    'sc-date-input-surface': ScDateInputSurface,
    'sc-month-grid': ScMonthGrid,
    'sc-year-grid': ScYearGrid,
    'sc-year-grid-button': ScYearGridButton,
    'sc-month-calendar': ScMonthCalendar,
    'sc-date-time-select': ScDateSelectTime,
  }
}

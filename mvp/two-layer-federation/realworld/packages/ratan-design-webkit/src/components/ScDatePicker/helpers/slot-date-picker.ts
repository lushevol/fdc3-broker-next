import { html, type TemplateResult } from 'lit';

import { scDatePickerName } from '../DatePicker/constants.js';
import type { SlotDatePickerInit } from './typings.js';
import { warnUndefinedElement } from './warn-undefined-element.js';

export function slotDatePicker({
  chooseMonthLabel,
  chooseYearLabel,
  disabledDates,
  disabledDays,
  firstDayOfWeek,
  locale,
  max,
  min,
  minYear,
  maxYear,
  nextMonthLabel,
  onDatePickerDateUpdated,
  onDatePickerFirstUpdated,
  previousMonthLabel,
  selectedDateLabel,
  selectedYearLabel,
  shortWeekLabel,
  showWeekNumber,
  startView,
  picker,
  todayLabel,
  toyearLabel,
  value,
  weekLabel,
  weekNumberTemplate,
  weekNumberType,
  range,
  rangeDays,
  positionType,
  showActionBar,
  quickSelector,
  quickSelectorItems,
  showTime,
  seconds,
  format,
  timeValue,
}: SlotDatePickerInit): TemplateResult {
  warnUndefinedElement(scDatePickerName);
  if (range) {
    return html`<sc-date-range-picker
      ?show-week-number=${showWeekNumber}
      ?quick-selector=${quickSelector}
      ?show-time=${showTime}
      ?seconds=${seconds}
      .format=${format}
      .timeValue=${timeValue}
      .quickSelectorItems=${quickSelectorItems}
      .chooseMonthLabel=${chooseMonthLabel}
      .chooseYearLabel=${chooseYearLabel}
      .disabled-dates=${disabledDates}
      .disabledDays=${disabledDays}
      .firstDayOfWeek=${firstDayOfWeek}
      .rangeDays=${rangeDays}
      .locale=${locale}
      .max=${max}
      .min=${min}
      .minYear=${minYear}
      .maxYear=${maxYear}
      .nextMonthLabel=${nextMonthLabel}
      .previousMonthLabel=${previousMonthLabel}
      .selectedDateLabel=${selectedDateLabel}
      .selectedYearLabel=${selectedYearLabel}
      .shortWeekLabel=${shortWeekLabel}
      .startView=${startView}
      .picker=${picker}
      .todayLabel=${todayLabel}
      .toyearLabel=${toyearLabel}
      .value=${value}
      .weekLabel=${weekLabel}
      .weekNumberTemplate=${weekNumberTemplate}
      .weekNumberType=${weekNumberType}
      @sc-select=${onDatePickerDateUpdated}
      @sc-first-updated=${onDatePickerFirstUpdated}
    ></sc-date-range-picker>`;
  }
  return html`<sc-date-picker
    ?show-week-number=${showWeekNumber}
    ?show-action-bar=${showActionBar}
    ?quick-selector=${quickSelector}
    ?show-time=${showTime}
    ?seconds=${seconds}
    .format=${format}
    .timeValue=${timeValue}
    .quickSelectorItems=${quickSelectorItems}
    .chooseMonthLabel=${chooseMonthLabel}
    .chooseYearLabel=${chooseYearLabel}
    .disabledDates=${disabledDates}
    .disabledDays=${disabledDays}
    .rangeDays=${rangeDays as number}
    .positionType=${positionType}
    .firstDayOfWeek=${firstDayOfWeek}
    .locale=${locale}
    .max=${max}
    .min=${min}
    .minYear=${minYear}
    .maxYear=${maxYear}
    .nextMonthLabel=${nextMonthLabel}
    .previousMonthLabel=${previousMonthLabel}
    .selectedDateLabel=${selectedDateLabel}
    .selectedYearLabel=${selectedYearLabel}
    .shortWeekLabel=${shortWeekLabel}
    .startView=${startView}
    .picker=${picker}
    .todayLabel=${todayLabel}
    .toyearLabel=${toyearLabel}
    .value=${value}
    .weekLabel=${weekLabel}
    .weekNumberTemplate=${weekNumberTemplate}
    .weekNumberType=${weekNumberType}
    @sc-select=${onDatePickerDateUpdated}
    @sc-first-updated=${onDatePickerFirstUpdated}
  ></sc-date-picker>`;
}

import { css } from 'lit';

export const monthCalendarStyling = css`
:host {
  --_border-width: 0px;
  --_inset: 0px;
  --_size: var(--sc-month-calendar-size, 2rem);

  display: block;
  font-size: 0.75rem;
}

table,
thead,
tbody,
tr,
th,
td {
  position: relative;
  padding: 0;
}

thead, tbody, tr {
  width: 100%
}

th, td {
  flex: 1;
  height: auto;
  aspect-ratio: 1 / 1;
}

.calendar-table,
.calendar-day {
  text-align: center;
}

.calendar-table {
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;

  border-collapse: collapse;
  border-spacing: 0;
  width: var(--sc-date-month-calendar-width, auto);
}

.weekday {
  max-height: 28px;
  height: 28px;
  color: var(--sc-date-picker-weekday-color, var(--sc-color-blue-700));
  font-weight: 400;
  display: var(--sc-date-picker-weekday-display, table-cell);
  align-items: center;
  justify-content: center;
}

.weekday-value {
  max-height: 16px;
  height: 16px;
  color: var(--_on-weekday);
  line-height: 1;
}

.calendar-day,
.calendar-day:not(.week-number):not([aria-hidden="true"])::before,
.calendar-day:not(.week-number):not([aria-hidden="true"])::after {
  position: relative;
  width: var(--_size);
  height: var(--_size);
  top: var(--_inset);
  right: var(--_inset);
  bottom: var(--_inset);
  left: var(--_inset);
  inset: var(--_inset);
  border: var(--_border-width) solid var(--_border-color);
  border-radius: var(--sc-month-calendar-border-radius, var(--sc-radius-sm));
  outline: none;
}

.calendar-day {
  min-width: var(--_size);
  min-height: var(--_size);
  max-width: var(--_size);
  max-height: var(--_size);
  font-size: 0.875rem;
}
.calendar-day.week-number {
  color: var(--_on-week-number);
}
.calendar-day[aria-disabled="true"] {
  color: var(--_on-disabled);
}
@media (any-hover: hover) {
  .calendar-day:not(.week-number):not([aria-hidden="true"]):not([aria-disabled="true"]):hover {
    cursor: pointer;
  }
}

.calendar-day:not(.week-number):not([aria-hidden="true"])::before,
.calendar-day:not(.week-number):not([aria-hidden="true"])::after {
  --_size: (var(--_size) - (var(--_inset) * 2) - (var(--_border-width) * 2));

  content: attr(data-day);
  display: block;
  align-items: center;
  justify-content: center;

  position: absolute;
  width: var(--_size);
  height: var(--_size);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-day::before {
  z-index: 1;
}
  
.calendar-day:not([aria-disabled="true"]):not([aria-selected="true"]):not(.is-between):focus-visible::before,
.calendar-day:not([aria-disabled="true"]):not([aria-selected="true"]):not(.is-between):focus-visible::before,
.calendar-day:not([aria-disabled="true"]):not([aria-selected="true"]):not(.is-between):focus-visible::before,
.calendar-day:not([aria-disabled="true"]):not([aria-selected="true"]):not(.is-between):hover::before {
  background-color: var(--_on-hover);
  color: var(--_selected-on-hover);
  transition: background-color 0.1s ease, color 0.1s ease;
}

.calendar-day[aria-grabbed="true"]::before {
  background-color: var(--sc-month-calendar-grabbed-color, var(--sc-color-grey-100)) !important;
  color: inherit !important;
  z-index: 2 !important;
}

.calendar-day[aria-grabbed="true"]::before {
  background-color: var(--sc-month-calendar-grabbed-color, var(--sc-color-grey-100)) !important;
  color: inherit !important;
}

.calendar-day[aria-selected="true"]::before {
  color: var(--_on-primary);
}

.calendar-day.is-between {
  background: var(--_selected-range);
  border-radius: inherit;
}

.calendar-day.day--today {
  color: var(--_primary)
}

.day--today.calendar-day:not(.week-number):not([aria-hidden="true"])::after {
  border: 1px solid var(--_primary);
  border-radius: var(--sc-radius-sm);
}

.calendar-day:not(.week-number):not([aria-hidden="true"])::after {
  content: '';
}

.calendar-day[aria-selected="true"]::after {
  background-color: var(--sc-date-picker-selected-background-color, var(--sc-color-blue-650));
}

.calendar-day[aria-grabbed="true"]::before {
  background-color: var(--sc-month-calendar-grabbed-color, var(--sc-color-grey-100));
}

.calendar-day[aria-grabbed="true"]::after {
  background-color: var(--sc-month-calendar-grabbed-color, var(--sc-color-grey-100));
}

.calendar-day[aria-grabbed="true"]:not(.grabbed-start):not(.grabbed-end)::before {
  --sc-month-calendar-border-radius: 0;
}

.calendar-day[aria-grabbed="true"]:not(.grabbed-start):not(.grabbed-end)::after {
  --sc-month-calendar-border-radius: 0;
}

.calendar-day[aria-grabbed="true"].grabbed-start.grabbed-end::before {
  --sc-month-calendar-border-radius: 0.25rem;
}

.calendar-day[aria-grabbed="true"].grabbed-start::before {
  --sc-month-calendar-border-radius: .25rem 0 0 .25rem;
}

.calendar-day[aria-grabbed="true"].grabbed-end::before {
  --sc-month-calendar-border-radius: 0 .25rem .25rem 0;
}

.calendar-today-quick-selector {
  display: flex; 
  justify-content: center; 
  align-items: center;
}
`;

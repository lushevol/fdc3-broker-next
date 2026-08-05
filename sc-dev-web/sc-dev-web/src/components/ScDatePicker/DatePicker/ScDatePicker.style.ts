import { css } from 'lit';

export const datePickerStyling = css`
:host {
  --_col: 7;
  --_row: 6;
  --_shape: 0.5rem;

  --_body-h: var(--sc-date-picker-body-h, calc(0.25rem + calc(var(--sc-month-calendar-size, 2rem) * 7))); /** 228px */;
  --_h: calc(var(--_header-h) + var(--_body-h)); /** 52 + 228 = 280 */
  --_header-h: var(--sc-date-picker-header-h, 3rem);
  --_w: calc((1rem * 2) + (var(--sc-month-calendar-size, 2rem) * var(--_col))); /** 32 + 224 = 256 */
  --_qsw: calc((1rem * 2) + (var(--sc-month-calendar-size, 2rem) * var(--_col)) + 16rem); /** 32 + 224 + 256 = 512 */

  display: flex;
  flex-direction: column;

  min-width: var(--date-picker-min-width, var(--_w));
  min-height: var(--date-picker-min-height, var(--_h));
  max-width: var(--date-picker-max-width, var(--_w));
  max-height: var(--date-picker-max-height, var(--_h));
  width: 100%;
  height: 100%;
  background-color: var(--_surface);
  color: var(--sc-date-picker-color, var(--sc-color-blue-850));
  border-radius: var(--sc-date-picker-border-radius, var(--_shape));
  overscroll-behavior: contain;
}

:host([startview="calendar"][showweeknumber]) {
  --_col: 8;
}

:host([quick-selector]) {
  --date-picker-min-width: var(--sc-date-picker-quick-selector-min-width, var(--_qsw, 32rem));
  --date-picker-max-width: var(--sc-date-picker-quick-selector-max-width, var(--_qsw, 32rem));
  --date-picker-min-height: auto;
  --date-picker-max-height: auto;
}

.container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.date-picker-container {
  display: flex;
  flex-direction: row;
}

:host([show-time]){
  --date-picker-max-width: none;
  --date-picker-max-height: none;
  --date-picker-min-width: auto;
}

.date-picker-container__with-time {
  display: flex;
  background-color: var(--_surface);
}

.date-picker-container:not(.container-action-bar) {
  height: auto;
}

.date-picker-container.container-quick-selector {
  background-color: var(--_surface);
  border-radius: var(--sc-date-picker-border-radius, var(--_shape));
  box-shadow: var(--sc-date-picker-box-shadow, 0px 0.5rem 1.5rem 0px rgba(26, 26, 26, 0.15));
}

.date-picker-container.container-quick-selector:not(.container-without-border) {
  border: 1px solid var(--sc-date-picker-border-color, var(--sc-color-grey-150));
  border-left: var(
    --sc-date-picker-border-left, 
    1px solid var(--sc-date-picker-border-color, var(--sc-color-grey-150))
  );
  border-right: var(
    --sc-date-picker-border-right, 
    1px solid var(--sc-date-picker-border-color, var(--sc-color-grey-150))
  );
}

.quick-selector {
  flex-shrink: 0;
  width: 16rem;
  background-color: var(--_surface);
  padding: 0.5rem;
  border-radius: var(--sc-date-picker-border-radius, var(--_shape));
}

.quick-selector-header {
  color: var(--sc-date-picker-quick-selector-header-color, var(--sc-color-grey-700));
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 2rem;
  margin-left: 0.25rem;
}

.quick-selector-items {
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  overflow: auto;
}
.date-picker-container.container-action-bar .quick-selector-items {
  max-height: 16rem;
}
.date-picker-container:not(.container-action-bar) .quick-selector-items {
  max-height: 13.5rem;
}

.quick-selector-item {
  cursor: pointer;
  padding: 0.5rem;
  color: var(--sc-date-picker-quick-selector-item-color, var(--sc-color-grey-800));
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1rem;
  transition: all 0.1s ease-in-out;
}

.quick-selector-item:hover {
  color: var(--sc-date-picker-quick-selector-item-hover-color, var(--sc-color-blue-650));
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
  border-radius: 0.375rem;
  background: var(--sc-date-picker-quick-selector-item-hover-background-color, var(--sc-color-blue-100));
}
.date-picker-container__with-time:not(.without-border),
.container:not(.without-border) {
  border: 1px solid var(--sc-date-picker-border-color, var(--sc-color-grey-150));
  border-left: var(
    --sc-date-picker-border-left, 
    1px solid var(--sc-date-picker-border-color, var(--sc-color-grey-150))
  );
  border-right: var(
    --sc-date-picker-border-right, 
    1px solid var(--sc-date-picker-border-color, var(--sc-color-grey-150))
  );
  border-radius: var(--sc-date-picker-border-radius, var(--_shape));
  box-shadow: var(--sc-date-picker-box-shadow, 0px 0.5rem 1.5rem 0px rgba(26, 26, 26, 0.15));
}
.header {
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  min-height: var(--_header-h);
  max-height: var(--_header-h);
  height: 100%;
  font-weight: 600;
  padding: var(--sc-date-calendar-padding, 0 1.5rem);
  border-radius: var(--sc-date-picker-border-radius, var(--_shape));
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  position: relative;
}

.header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: var(--sc-date-calendar-horizontial-padding, 1rem);
  right: var(--sc-date-calendar-horizontial-padding, 1rem);
  height: 1px;
  background-color: var(--sc-date-picker-header-divider-border-color, var(--sc-color-grey-150));
}

.header sc-icon {
  cursor: pointer;
}

/** #region header */
.month-and-year-selector {
  display: flex;
  align-items: center;
  font-size: 1rem;
  cursor: pointer;
  user-select: none;
}

.selected-year-month {
  margin: 0;
  white-space: nowrap;
}

.year-dropdown {
  transition: transform 300ms cubic-bezier(0, 0, .4, 1);
  will-change: transform;
}
:host([startview="yearGrid"]) .year-dropdown {
  transform: rotateZ(180deg);
}

.pagination {
  display: flex;
  margin: 0 -4px 0 0;
  cursor: pointer;
}
/** #endregion header */

.body {
  border-radius: var(--_shape);
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  margin-top: 0.375rem;
}

.calendar,
.year-grid {
  min-height: var(--_body-h);
  max-height: var(--_body-h);
  height: 100%;
  overflow-x: hidden; /** NOTE(rongsen): Disabling overflow-x to avoid infrequent overflowing. */
  overflow-y: auto;
}

.calendar {
  padding: var(--sc-date-calendar-padding, 0 1rem 0.5rem);
}

.year-grid {
  padding: 0.25rem 1.25rem 0.5rem 0.75rem;
  overscroll-behavior: contain;
}
.action-bar {
  border-top: 1px solid;
  border-top-color: var(--sc-date-picker-action-bar-color, var(--sc-color-grey-100));
  margin: 0 1rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.action-bar > :first-child {
  flex: 1;
}
`;

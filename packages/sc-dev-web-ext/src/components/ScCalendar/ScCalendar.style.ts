import { css } from 'lit';

export const ScCalendarDatePickerPopupStyles = css`
  .sc-calendar-date-picker-trigger {
    position: relative;
    display: inline-block;
  }

  .sc-calendar-popup {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 0.5rem;
    background: var(--sc-calendar-date-picker-popup, var(--sc-color-white));
    border-radius: 0.5rem;
    z-index: 1000;
    height: var(--sc-calendar-date-picker-popup-height, 19.85rem);
    width: var(--sc-calendar-date-picker-popup-width, 16.125rem);
  }
`;

export default css`
  :host {
    --sc-list-navigation-margin: var(--sc-calendar-list-navigation-margin, 0 1rem);
  }

  .sc-calendar-dropdown {
    position: absolute;
  }

  .sc-calendar-dropdown-divider {
    display: block;
    padding-left: 0.875rem;
    padding-right: 0.875rem;
  }

  .sc-menu-dropdown-panel sc-menu-item {
    display: flex;
    align-items: center;
  }
    
  .sc-menu-dropdown-panel sc-icon {
    vertical-align: middle;
    display: inline-flex;
    padding-bottom: 0.25rem;
    padding-right: 0.25rem;
  }

  .sc-calendar {
    --sc-layout-top-offset: 0rem;
    --sc-layout-bottom-offset: 0rem;
    --sc-layout-right-offset: 0rem;
    --sc-layout-left-offset: 0.8rem;
    --sc-column-extra-top-offset: 0rem;
    --sc-layout-left-panel-padding-x: 0rem;
    --sc-layout-main-content-padding-x: 0rem;
    --sc-layout-left-slot-spacing-tablet: 0rem;
    --sc-layout-right-slot-spacing-tablet: 0rem;
    --sc-layout-left-header-padding-x: 0rem;
    --sc-layout-right-panel-padding-x: 0rem;
    --sc-layout-left-panel-padding-top: 0rem;
    --sc-layout-left-panel-padding-bottom: 0rem;
    --sc-layout-background-color: var(--sc-calendar-background-color, var(--sc-color-white));

    --sc-action-bar-border-left: 1px solid var(--sc-calendar-action-bar-border-color, var(--sc-color-grey-150));
    --sc-action-bar-border-bottom: 0;
    --sc-column-action-bar-sticky-bar-height: 3.5rem;
    --sc-action-bar-container-padding: var(--sc-calendar-action-bar-container-padding, 1.25rem);

    --sc-list-navigation-item-selected-background-color: var(--sc-calendar-list-navigation-item-selected-background-color, var(--sc-color-white));
  }

  .sc-calendar-new-event-dropdown {
    --sc-dropdown-item-background-selected-color: transparent;
  }

  .fc {
    border-top: var(--sc-calendar-border-top, 1px solid var(--sc-calendar-border-color, var(--sc-color-grey-150)));
    --fc-today-bg-color: var(--sc-calendar-today-background-color, var(--sc-color-blue-50));
    --fc-highlight-color: var(--sc-calendar-highlight-background-color, var(--sc-color-blue-500));
    --fc-small-font-size: var(--sc-calendar-small-font-size, 0.8em);
    --fc-now-indicator-color: var(--sc-calendar-now-indicator-color, var(--sc-shades-orange-500));
    --fc-border-color: var(--sc-calendar-border-color, var(--sc-color-grey-150));
    --fc-page-bg-color: var(--sc-calendar-page-background-color, var(--sc-color-white));
  }

  .fc-direction-ltr .fc-toolbar > * > :not(:first-child) {
    margin-left: 0;
  }

  .fc .fc-col-header-cell.fc-day-today {
    position: relative;
  }
  .fc .fc-col-header-cell.fc-day-today::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-top: 1px solid var(--sc-calendar-month-today-border-color, var(--sc-color-blue-500));
    border-left: 1px solid var(--sc-calendar-month-today-border-color, var(--sc-color-blue-500));
    border-right: 1px solid var(--sc-calendar-month-today-border-color, var(--sc-color-blue-500));
    border-radius: 0;
    z-index: 4;
  }

  .fc .fc-daygrid-day.fc-day-today,
  .fc .fc-timegrid-col.fc-day-today {
    position: relative;
  }
  .fc .fc-daygrid-day.fc-day-today::after,
  .fc .fc-timegrid-col.fc-day-today::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-left: 1px solid var(--sc-calendar-month-today-border-color, var(--sc-color-blue-500));
    border-right: 1px solid var(--sc-calendar-month-today-border-color, var(--sc-color-blue-500));
    border-radius: 0;
    z-index: 3;
  }

  .fc .fc-shareButton-button,
  .fc .fc-newEventButton-button,
  .fc .fc-today-button,
  .fc .fc-prev-button,
  .fc .fc-next-button,
  .fc .fc-divider-button,
  .fc .fc-timeGridWeek-button,
  .fc .fc-workWeek-button,
  .fc .fc-timeGridDay-button,
  .fc .fc-dayGridMonth-button {
    display: none;
  }

  .fc .fc-prev-button.fc-button-primary,
  .fc .fc-next-button.fc-button-primary {
    border: 1px solid transparent;
    outline: none;
  }

  .fc .fc-prev-button.fc-button-primary:hover,
  .fc .fc-next-button.fc-button-primary:hover {
    border: 1px solid transparent;
    outline: none;
  }

  .fc .fc-button {
    font-size: .8em;
  }

  .sc-calendar-share-button {
    margin-right: .75rem;
    margin-top: var(--sc-calendar-share-button-margin-top, 0.125rem);
  }

  .sc-calendar-refresh-button {
    margin-right: .75rem;
    margin-top: var(--sc-calendar-share-button-margin-top, 0);
  }

  .sc-calendar-new-event-button {
    margin-top: 0.125rem;
  }
  
  .fc .fc-scroller::-webkit-scrollbar,
  .fc .fc-scroller-liquid-absolute::-webkit-scrollbar,
  .fc .fc-scroller-harness::-webkit-scrollbar,
  .fc .fc-scroller-harness-liquid::-webkit-scrollbar {
    width: 0.4rem;
  }
  
  .fc .fc-scroller::-webkit-scrollbar-thumb,
  .fc .fc-scroller-liquid-absolute::-webkit-scrollbar-thumb,
  .fc .fc-scroller-harness::-webkit-scrollbar-thumb,
  .fc .fc-scroller-harness-liquid::-webkit-scrollbar-thumb {
    background-color: var(--sc-scrollbar-background-color, var(--sc-color-grey-250));
    border-radius: var(--sc-radius-sm, .375rem);
  }
  
  .sc-calendar-right {
    height: 100%;
  }

  .sc-calendar-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }

  .sc-calendar-spinner-text {
    margin-top: 0.25rem;
    font-size: 0.75rem;
  }
  
  .sc-calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 1.25rem !important;
    height: var(--sc-calendar-header-height, 3rem);
    background: var(--sc-calendar-header-background-color, var(--sc-color-white));
    border-top: var(--sc-calendar-header-border-top, 1px solid var(--sc-calendar-header-border-top-color, var(--sc-color-grey-150)));
    border-left: var(--sc-calendar-header-border-left, 1px solid var(--sc-calendar-header-border-left-color, var(--sc-color-grey-150)));
  }

  .sc-calendar-left {
    border-top: 1px solid var(--sc-calendar-header-border-top-color, var(--sc-color-grey-150));
  }

  @media (max-width: 1272px) {
    .sc-calendar-header {
      padding: 0rem;
    }
  }

  .sc-calendar-divider {
    margin-right: 0.75rem;
    align-self: center;
  }
  
  .sc-calendar-date-picker {
    --sc-date-picker-border-radius: var(--sc-calendar-date-picker, 0);
    --sc-date-picker-box-shadow: none;
    --sc-date-picker-border-left: var(
      --sc-calendar-date-picker-border-left, 
      1px solid var(--sc-date-picker-border-color, var(--sc-color-grey-150))
    );
    --sc-date-picker-border-right: 0;
    --date-picker-min-width: 18.75rem;
    --date-picker-max-width: 18.75rem;
    --sc-month-calendar-size: 2.375rem;
    --sc-date-picker-body-h: 17rem;
    --sc-month-grid-col: 3.375rem;
    --sc-year-grid-col: 3rem;
    --sc-date-picker-color: var(--sc-calendar-date-picker-color, var(--sc-color-blue-900));
    --_surface: var(--sc-calendar-date-picker-background-color, var(--sc-color-white));
  }

  @media (max-width: 1272px) {
    .sc-calendar-date-picker {
      margin-top: -1px;
    }
  }

  .fc .fc-timegrid-slot-minor {
    border-top-style: solid !important;
    border-top-color: var(--sc-calendar-timegrid-slot-minor-top-border-color, var(--sc-color-grey-50));
  }
  
  .fc .fc-scrollgrid {
    border: 0;
    border-top: 1px solid var(--sc-calendar-main-border-top-color, var(--sc-color-grey-150));
  }
  
  .fc .fc-toolbar.fc-header-toolbar {
    display: flex;
    justify-content: space-between;
    padding: .2rem 1.25rem;
    margin-bottom: 0;
    border-right: 1px solid var(--sc-calendar-header-toolbar-border-right-color, var(--sc-color-grey-150));
    border-left: 1px solid var(--sc-calendar-header-toolbar-border-left-color, var(--sc-color-grey-150));
    align-items: center;
    height: var(--sc-calendar-header-toolbar-height, 4.17rem);
  }

  .fc .fc-toolbar-chunk {
    display: flex;
    align-items: center;
  }
  
  .fc .fc-bg-event .fc-event-title {
    color: var(--sc-calendar-background-event-text-color, var(--sc-color-white));
  }

  .fc .fc-event {
    cursor: pointer;
    height: calc(100% - 0.125rem);
  }

  .input-container {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }

  .start-input-container,
  .end-input-container {
    display: flex;
    align-items: flex-end; 
    gap: .5rem;
  }

  .checkbox-container {
    display: flex;
    flex-direction: row;
    align-items: flex-end; 
    gap: .5rem;
    margin-left: 1rem;
  }

  .text-right {
    text-align: right
  }

  /* fully expanded "now" indicator line */
  .fc-timeGrid-view .fc-timegrid-now-indicator-container,
  .fc-timeGridWeek-view .fc-timegrid-now-indicator-container,
  .fc-timeGridDay-view .fc-timegrid-now-indicator-container,
  .fc-workWeek-view .fc-timegrid-now-indicator-container {
    overflow: visible !important;
  }

  .fc-timeGrid-view .fc-timegrid-now-indicator-line {
    width: calc(100% / var(--fc-days-in-view)) !important;
    --fc-now-indicator-line-width: calc(100% / var(--fc-days-in-view)) !important;
  }

  .fc-timeGrid-view .fc-day .fc-timegrid-now-indicator-line {
    transform: translateX(calc(-1 * var(--fc-now-indicator-shift)));
  }

  .fc-timeGridWeek-view .fc-timegrid-now-indicator-line {
    width: calc(700% + 6px) !important;
    --fc-now-indicator-line-width: calc(700% + 6px) !important;
  }

  .fc-workWeek-view .fc-timegrid-now-indicator-line {
    width: calc(500% + 6px) !important;
    --fc-now-indicator-line-width: calc(500% + 6px) !important;
  }

  .fc-timeGridWeek-view .fc-day:nth-child(2) .fc-timegrid-now-indicator-line,
  .fc-workWeek-view .fc-day:nth-child(2) .fc-timegrid-now-indicator-line {
    --fc-now-indicator-shift: 0%;
  }

  .fc-timeGridWeek-view .fc-day:nth-child(3) .fc-timegrid-now-indicator-line {
    --fc-now-indicator-shift: 14.29%;
  }
  .fc-workWeek-view .fc-day:nth-child(3) .fc-timegrid-now-indicator-line {
    --fc-now-indicator-shift: 20%;
  }

  .fc-timeGridWeek-view .fc-day:nth-child(4) .fc-timegrid-now-indicator-line {
    --fc-now-indicator-shift: 28.57%;
  }
  .fc-workWeek-view .fc-day:nth-child(4) .fc-timegrid-now-indicator-line {
    --fc-now-indicator-shift: 40%;
  }

  .fc-timeGridWeek-view .fc-day:nth-child(5) .fc-timegrid-now-indicator-line {
    --fc-now-indicator-shift: 42.86%;
  }
  .fc-workWeek-view .fc-day:nth-child(5) .fc-timegrid-now-indicator-line {
    --fc-now-indicator-shift: 60%;
  }

  .fc-timeGridWeek-view .fc-day:nth-child(6) .fc-timegrid-now-indicator-line {
    --fc-now-indicator-shift: 57.14%;
  }
  .fc-workWeek-view .fc-day:nth-child(6) .fc-timegrid-now-indicator-line {
    --fc-now-indicator-shift: 80%;
  }

  .fc-timeGridWeek-view .fc-day:nth-child(7) .fc-timegrid-now-indicator-line {
    --fc-now-indicator-shift: 71.43%;
  }

  .fc-timeGridWeek-view .fc-day:nth-child(8) .fc-timegrid-now-indicator-line {
    --fc-now-indicator-shift: 85.71%;
  }

  .fc-timeGridWeek-view .fc-day .fc-timegrid-now-indicator-line,
  .fc-workWeek-view .fc-day .fc-timegrid-now-indicator-line {
    transform: translateX(calc(-1 * var(--fc-now-indicator-shift)));
  }

  /* dot marker */
  .fc-timeGrid-view .fc-timegrid-now-indicator-container .fc-timegrid-now-indicator-arrow,
  .fc-timeGridWeek-view .fc-timegrid-now-indicator-container .fc-timegrid-now-indicator-arrow,
  .fc-timeGridDay-view .fc-timegrid-now-indicator-container .fc-timegrid-now-indicator-arrow,
  .fc-workWeek-view .fc-timegrid-now-indicator-container .fc-timegrid-now-indicator-arrow {
    border: none !important;
  }

  .fc-timeGrid-view .fc-timegrid-now-indicator-line::before,
  .fc-timeGridWeek-view .fc-timegrid-now-indicator-line::before,
  .fc-timeGridDay-view .fc-timegrid-now-indicator-line::before,
  .fc-workWeek-view .fc-timegrid-now-indicator-line::before {
    content: '';
    display: block;
    width: 0.5rem;
    height: 0.5rem;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="4" fill="%23EF6923"/></svg>') no-repeat center center;
    background-size: contain;
    position: absolute;
    top: 50%;
    left: -0.5rem;
    transform: translateY(-50%);
    z-index: 4;
  }

  /* Style for the header and timestamps in timeGridWeek and workWeek views */
  .fc-timeGrid-view .fc-col-header-cell,
  .fc-timeGridWeek-view .fc-col-header-cell,
  .fc-timeGridDay-view .fc-col-header-cell,
  .fc-workWeek-view .fc-col-header-cell {
    background: var(--sc-calendar-week-header-background, var(--sc-color-grey-50));
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
  }

  .fc-timeGrid-view .fc-timegrid-axis,
  .fc-timeGridWeek-view .fc-timegrid-axis,
  .fc-timeGridDay-view .fc-timegrid-axis,
  .fc-workWeek-view .fc-timegrid-axis {
    background: var(--sc-calendar-week-timestamp-background, var(--sc-color-grey-50));
  }

  .fc table {
    font-size: 0.75rem;
    font-weight: 400;
  }

  .sc-calendar-action-bar {
    --column-layout-sticky-bar-height: 3.5rem;
  }

  .sc-calendar-action-bar-left {
    display: flex; 
    gap: 0.5rem; 
    align-items: center;
    --sc-button-padding-sm: 0.25rem 0.5rem;
  }

  .sc-calendar-action-bar-left-actions {
    display: flex; 
    align-items: center;
  }

  .sc-calendar-event-container {
    display: flex;
    width: 100%;
    border-radius: 0.25rem 0 0 0.25rem;
  }
  
  .sc-calendar-event-status-block {
    width: 0.5rem;
    border-radius: 0.25rem 0 0 0.25rem;
    flex-shrink: 0;
    height: 100%;
    margin-left: -1.8px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .sc-calendar-event-status-block.month-view {
    height: 75%;
    margin-left: 0;
  }

  .sc-calendar-event-status-block.month-view-all-day {
    margin-left: -0.8px;
  }

  .sc-calendar-event-title-text {
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 0.8rem;
  }

  .sc-calendar-event-title-text.sc-calendar-event-all-day {
    max-width: calc(100% - 0.25rem);
  }

  .sc-calendar-event-time-text {
    margin-left: 0.8rem;
  }

  .sc-calendar-list-navigation {
    position: relative;
    margin-top: 0.5rem;
  }

  .sc-calendar-context-menu-item {
    --sc-menu-item-hover-color: var(--sc-calendar-dropdown-item-hover-color, var(--sc-color-blue-900)); 
    --sc-menu-item-background-hover-color: var(--sc-calendar-dropdown-item-background-hover-color, var(--sc-color-blue-100));
  }

  .sc-calendar-action-bar-right-container {
    display: flex; 
    align-items: center;
  }

  .sc-calendar-view-buttons {
    display: flex; 
    margin-top: 0.1rem;
  }

  .sc-calendar-action-bar-right-divider {
    margin-bottom: 0.1rem;
  }

  .sc-calendar-action-bar-right-buttons {
    display: flex; 
    gap: 0.5rem; 
    padding-left: 1rem;
    margin-top: 0.1rem;
  }
`;

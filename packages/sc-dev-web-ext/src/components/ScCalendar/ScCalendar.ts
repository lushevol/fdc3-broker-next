import { LitElement, html, css } from 'lit';
import { property, state, query } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import ScCalendarStyle, { ScCalendarDatePickerPopupStyles } from './ScCalendar.style.js';
// eslint-disable-next-line import/extensions
import zhCnLocale from '@fullcalendar/core/locales/zh-cn';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth';
import rrulePlugin from '@fullcalendar/rrule';
import { Calendar as FullCalendar, CalendarOptions } from '@fullcalendar/core';
import { CALENDAR_VIEW, 
  LOCATION, 
  CALENDAR_EVENT, 
  CALENDAR_DAY_HEADER_CONTENT, 
  ScEventInit,
  Debouncer,
  locales } from '../../shared/util.js';
import { createEventContent, handleDayCellDidMount } from './calendarRenderUtils.js';
import { getViewAndHeaderToolbar, getDayHeaderContent } from './calendarViewUtils.js';
import { CUSTOM_EVENTS_TYPE } from '../../shared/sc-custom-events.js';
import { colorMapping, colorClassMapping } from './constants.js';
import { replaceButtons, openDatePicker, closeDatePicker } from './calendarDomUtils.js';
// eslint-disable-next-line import/extensions
import { mediaQuery, getGlobalMediaQuery } from '../../shared/mediaQuery.js';
import { navigateToWorkWeek, navigateToWeek, navigateToDay } from './calendarNavigationUtils.js';
import { formatWithTimezone, createCalendarEvent, transformEvent } from './calendarEventUtils.js';
import { msg } from '../../i18n/localization.js';
import {
  processCalendarMetadata,
  getCalendarKeys,
  getEditableCalendars,
  buildCalendarList,
  updateCalendarListSuffixes,
  getInitialSelectedCalendars,
} from './calendarListUtils.js';
import {
  assignCalendarColors,
  getPrimaryColor,
} from './calendarColorUtils.js';

const coreCss = css`:root{--fc-small-font-size:.85em;--fc-page-bg-color:#fff;--fc-neutral-bg-color:hsla(0,0%,82%,.3);--fc-neutral-text-color:grey;--fc-border-color:#ddd;--fc-event-bg-color:#3788d8;--fc-event-border-color:#3788d8;--fc-event-text-color:#fff;--fc-event-selected-overlay-color:rgba(0,0,0,.25);--fc-more-link-bg-color:#d0d0d0;--fc-more-link-text-color:inherit;--fc-event-resizer-thickness:8px;--fc-event-resizer-dot-total-width:8px;--fc-event-resizer-dot-border-width:1px;--fc-non-business-color:hsla(0,0%,84%,.3);--fc-bg-event-color:#8fdf82;--fc-bg-event-opacity:0.3;--fc-highlight-color:rgba(188,232,241,.3);--fc-today-bg-color:rgba(255,220,40,.15);--fc-now-indicator-color:red}.fc-not-allowed,.fc-not-allowed .fc-event{cursor:not-allowed}.fc{display:flex;flex-direction:column;}.fc,.fc *,.fc :after,.fc :before{box-sizing:border-box}.fc table{border-collapse:collapse;border-spacing:0;}.fc th{text-align:center}.fc td,.fc th{padding:0;vertical-align:top}.fc a[data-navlink]{cursor:pointer}.fc a[data-navlink]:hover{text-decoration:underline}.fc-direction-ltr{direction:ltr;text-align:left}.fc-direction-rtl{direction:rtl;text-align:right}.fc-theme-standard td,.fc-theme-standard th{border:1px solid var(--fc-border-color)}.fc-liquid-hack td,.fc-liquid-hack th{position:relative}@font-face{font-family:fcicons;font-style:normal;font-weight:400;src:url(\"data:application/x-font-ttf;charset=utf-8;base64,AAEAAAALAIAAAwAwT1MvMg8SBfAAAAC8AAAAYGNtYXAXVtKNAAABHAAAAFRnYXNwAAAAEAAAAXAAAAAIZ2x5ZgYydxIAAAF4AAAFNGhlYWQUJ7cIAAAGrAAAADZoaGVhB20DzAAABuQAAAAkaG10eCIABhQAAAcIAAAALGxvY2ED4AU6AAAHNAAAABhtYXhwAA8AjAAAB0wAAAAgbmFtZXsr690AAAdsAAABhnBvc3QAAwAAAAAI9AAAACAAAwPAAZAABQAAApkCzAAAAI8CmQLMAAAB6wAzAQkAAAAAAAAAAAAAAAAAAAABEAAAAAAAAAAAAAAAAAAAAABAAADpBgPA/8AAQAPAAEAAAAABAAAAAAAAAAAAAAAgAAAAAAADAAAAAwAAABwAAQADAAAAHAADAAEAAAAcAAQAOAAAAAoACAACAAIAAQAg6Qb//f//AAAAAAAg6QD//f//AAH/4xcEAAMAAQAAAAAAAAAAAAAAAQAB//8ADwABAAAAAAAAAAAAAgAANzkBAAAAAAEAAAAAAAAAAAACAAA3OQEAAAAAAQAAAAAAAAAAAAIAADc5AQAAAAABAWIAjQKeAskAEwAAJSc3NjQnJiIHAQYUFwEWMjc2NCcCnuLiDQ0MJAz/AA0NAQAMJAwNDcni4gwjDQwM/wANIwz/AA0NDCMNAAAAAQFiAI0CngLJABMAACUBNjQnASYiBwYUHwEHBhQXFjI3AZ4BAA0N/wAMJAwNDeLiDQ0MJAyNAQAMIw0BAAwMDSMM4uINIwwNDQAAAAIA4gC3Ax4CngATACcAACUnNzY0JyYiDwEGFB8BFjI3NjQnISc3NjQnJiIPAQYUHwEWMjc2NCcB87e3DQ0MIw3VDQ3VDSMMDQ0BK7e3DQ0MJAzVDQ3VDCQMDQ3zuLcMJAwNDdUNIwzWDAwNIwy4twwkDA0N1Q0jDNYMDA0jDAAAAgDiALcDHgKeABMAJwAAJTc2NC8BJiIHBhQfAQcGFBcWMjchNzY0LwEmIgcGFB8BBwYUFxYyNwJJ1Q0N1Q0jDA0Nt7cNDQwjDf7V1Q0N1QwkDA0Nt7cNDQwkDLfWDCMN1Q0NDCQMt7gMIw0MDNYMIw3VDQ0MJAy3uAwjDQwMAAADAFUAAAOrA1UAMwBoAHcAABMiBgcOAQcOAQcOARURFBYXHgEXHgEXHgEzITI2Nz4BNz4BNz4BNRE0JicuAScuAScuASMFITIWFx4BFx4BFx4BFREUBgcOAQcOAQcOASMhIiYnLgEnLgEnLgE1ETQ2Nz4BNz4BNz4BMxMhMjY1NCYjISIGFRQWM9UNGAwLFQkJDgUFBQUFBQ4JCRULDBgNAlYNGAwLFQkJDgUFBQUFBQ4JCRULDBgN/aoCVgQIBAQHAwMFAQIBAQIBBQMDBwQECAT9qgQIBAQHAwMFAQIBAQIBBQMDBwQECASAAVYRGRkR/qoRGRkRA1UFBAUOCQkVDAsZDf2rDRkLDBUJCA4FBQUFBQUOCQgVDAsZDQJVDRkLDBUJCQ4FBAVVAgECBQMCBwQECAX9qwQJAwQHAwMFAQICAgIBBQMDBwQDCQQCVQUIBAQHAgMFAgEC/oAZEhEZGRESGQAAAAADAFUAAAOrA1UAMwBoAIkAABMiBgcOAQcOAQcOARURFBYXHgEXHgEXHgEzITI2Nz4BNz4BNz4BNRE0JicuAScuAScuASMFITIWFx4BFx4BFx4BFREUBgcOAQcOAQcOASMhIiYnLgEnLgEnLgE1ETQ2Nz4BNz4BNz4BMxMzFRQWMzI2PQEzMjY1NCYrATU0JiMiBh0BIyIGFRQWM9UNGAwLFQkJDgUFBQUFBQ4JCRULDBgNAlYNGAwLFQkJDgUFBQUFBQ4JCRULDBgN/aoCVgQIBAQHAwMFAQIBAQIBBQMDBwQECAT9qgQIBAQHAwMFAQIBAQIBBQMDBwQECASAgBkSEhmAERkZEYAZEhIZgBEZGREDVQUEBQ4JCRUMCxkN/asNGQsMFQkIDgUFBQUFBQ4JCBUMCxkNAlUNGQsMFQkJDgUEBVUCAQIFAwIHBAQIBf2rBAkDBAcDAwUBAgICAgEFAwMHBAMJBAJVBQgEBAcCAwUCAQL+gIASGRkSgBkSERmAEhkZEoAZERIZAAABAOIAjQMeAskAIAAAExcHBhQXFjI/ARcWMjc2NC8BNzY0JyYiDwEnJiIHBhQX4uLiDQ0MJAzi4gwkDA0N4uINDQwkDOLiDCQMDQ0CjeLiDSMMDQ3h4Q0NDCMN4uIMIw0MDOLiDAwNIwwAAAABAAAAAQAAa5n0y18PPPUACwQAAAAAANivOVsAAAAA2K85WwAAAAADqwNVAAAACAACAAAAAAAAAAEAAAPA/8AAAAQAAAAAAAOrAAEAAAAAAAAAAAAAAAAAAAALBAAAAAAAAAAAAAAAAgAAAAQAAWIEAAFiBAAA4gQAAOIEAABVBAAAVQQAAOIAAAAAAAoAFAAeAEQAagCqAOoBngJkApoAAQAAAAsAigADAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAA4ArgABAAAAAAABAAcAAAABAAAAAAACAAcAYAABAAAAAAADAAcANgABAAAAAAAEAAcAdQABAAAAAAAFAAsAFQABAAAAAAAGAAcASwABAAAAAAAKABoAigADAAEECQABAA4ABwADAAEECQACAA4AZwADAAEECQADAA4APQADAAEECQAEAA4AfAADAAEECQAFABYAIAADAAEECQAGAA4AUgADAAEECQAKADQApGZjaWNvbnMAZgBjAGkAYwBvAG4Ac1ZlcnNpb24gMS4wAFYAZQByAHMAaQBvAG4AIAAxAC4AMGZjaWNvbnMAZgBjAGkAYwBvAG4Ac2ZjaWNvbnMAZgBjAGkAYwBvAG4Ac1JlZ3VsYXIAUgBlAGcAdQBsAGEAcmZjaWNvbnMAZgBjAGkAYwBvAG4Ac0ZvbnQgZ2VuZXJhdGVkIGJ5IEljb01vb24uAEYAbwBuAHQAIABnAGUAbgBlAHIAYQB0AGUAZAAgAGIAeQAgAEkAYcBvAE0AbwBvAG4ALgAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=\") format(\"truetype\")}.fc-icon{speak:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;font-family:fcicons!important;font-style:normal;font-variant:normal;font-weight:400;height:1em;line-height:1;text-align:center;text-transform:none;-webkit-user-select:none;-moz-user-select:none;user-select:none;width:1em}.fc-icon-chevron-left:before{content:\"\\e900\"}.fc-icon-chevron-right:before{content:\"\\e901\"}.fc-icon-chevrons-left:before{content:\"\\e902\"}.fc-icon-chevrons-right:before{content:\"\\e903\"}.fc-icon-minus-square:before{content:\"\\e904\"}.fc-icon-plus-square:before{content:\"\\e905\"}.fc-icon-x:before{content:\"\\e906\"}.fc .fc-button{border-radius:0;font-family:inherit;font-size:inherit;line-height:inherit;margin:0;overflow:visible;text-transform:none}.fc .fc-button:focus{outline:1px dotted;outline:5px auto -webkit-focus-ring-color}.fc .fc-button{-webkit-appearance:button}.fc .fc-button:not(:disabled){cursor:pointer}.fc .fc-button{background-color:transparent;border:1px solid transparent;border-radius:.25em;font-weight:400;line-height:1.5;padding:.4em .65em;text-align:center;-webkit-user-select:none;-moz-user-select:none;user-select:none;vertical-align:middle}.fc .fc-button:hover{text-decoration:none}.fc .fc-button:focus{box-shadow:0 0 0 .2rem rgba(44,62,80,.25);outline:0}.fc .fc-button:disabled{opacity:.65}.fc .fc-button-primary{background-color:var(--fc-button-bg-color);border-color:var(--fc-button-border-color);color:var(--fc-button-text-color)}.fc .fc-button-primary:hover{background-color:var(--fc-button-hover-bg-color);border-color:var(--fc-button-hover-border-color);color:var(--fc-button-text-color)}.fc .fc-button-primary:disabled{background-color:var(--fc-button-bg-color);border-color:var(--fc-button-border-color);color:var(--fc-button-text-color)}.fc .fc-button-primary:focus{box-shadow:0 0 0 .2rem rgba(76,91,106,.5)}.fc .fc-button-primary:not(:disabled).fc-button-active,.fc .fc-button-primary:not(:disabled):active{background-color:var(--fc-button-active-bg-color);border-color:var(--fc-button-active-border-color);color:var(--fc-button-text-color)}.fc .fc-button-primary:not(:disabled).fc-button-active:focus,.fc .fc-button-primary:not(:disabled):active:focus{box-shadow:0 0 0 .2rem rgba(76,91,106,.5)}.fc .fc-button .fc-icon{font-size:1.5em;vertical-align:middle}.fc .fc-button-group{display:inline-flex;position:relative;vertical-align:middle;align-items:center;}.fc .fc-button-group>.fc-button{flex:1 1 auto;position:relative}.fc .fc-button-group>.fc-button.fc-button-active,.fc .fc-button-group>.fc-button:active,.fc .fc-button-group>.fc-button:focus,.fc .fc-button-group>.fc-button:hover{z-index:1}.fc-direction-ltr .fc-button-group>.fc-button:not(:first-child){border-bottom-left-radius:0;border-top-left-radius:0;margin-left:-1px}.fc-direction-ltr .fc-button-group>.fc-button:not(:last-child){border-bottom-right-radius:0;border-top-right-radius:0}.fc-direction-rtl .fc-button-group>.fc-button:not(:first-child){border-bottom-right-radius:0;border-top-right-radius:0;margin-right:-1px}.fc-direction-rtl .fc-button-group>.fc-button:not(:last-child){border-bottom-left-radius:0;border-top-left-radius:0}.fc .fc-toolbar{align-items:center;display:flex;justify-content:space-between}.fc .fc-toolbar.fc-footer-toolbar{margin-top:1.5em}.fc .fc-toolbar-title{font-size:1.75em;margin:0}.fc-direction-rtl .fc-toolbar-ltr{flex-direction:row-reverse}.fc .fc-scroller{-webkit-overflow-scrolling:touch;position:relative}.fc .fc-scroller-liquid{height:100%}.fc .fc-scroller-liquid-absolute{bottom:0;left:0;position:absolute;right:0;top:0}.fc .fc-scroller-harness{direction:ltr;overflow:hidden;position:relative}.fc .fc-scroller-harness-liquid{height:100%}.fc-direction-rtl .fc-scroller-harness>.fc-scroller{direction:rtl}.fc-theme-standard .fc-scrollgrid{border:1px solid var(--fc-border-color)}.fc .fc-scrollgrid,.fc .fc-scrollgrid table{table-layout:fixed;width:100%}.fc .fc-scrollgrid table{border-left-style:hidden;border-right-style:hidden;border-top-style:hidden}.fc .fc-scrollgrid{border-bottom-width:0;border-collapse:separate;border-right-width:0}.fc .fc-scrollgrid-liquid{height:100%}.fc .fc-scrollgrid-section,.fc .fc-scrollgrid-section table,.fc .fc-scrollgrid-section>td{height:1px}.fc .fc-scrollgrid-section-liquid>td{height:100%}.fc .fc-scrollgrid-section>*{border-left-width:0;border-top-width:0}.fc .fc-scrollgrid-section-footer>*,.fc .fc-scrollgrid-section-header>*{border-bottom-width:0}.fc .fc-scrollgrid-section-body table,.fc .fc-scrollgrid-section-footer table{border-bottom-style:hidden}.fc .fc-scrollgrid-section-sticky>*{background:var(--fc-page-bg-color);position:sticky;z-index:3}.fc .fc-scrollgrid-section-header.fc-scrollgrid-section-sticky>*{top:0}.fc .fc-scrollgrid-section-footer.fc-scrollgrid-section-sticky>*{bottom:0}.fc .fc-scrollgrid-sticky-shim{height:1px;margin-bottom:-1px}.fc-sticky{position:sticky}.fc .fc-view-harness{flex-grow:1;position:relative}.fc .fc-view-harness-active>.fc-view{bottom:0;left:0;position:absolute;right:0;top:0}.fc .fc-col-header-cell-cushion{display:inline-block;padding:2px 4px}.fc .fc-bg-event,.fc .fc-highlight,.fc .fc-non-business{bottom:0;left:0;position:absolute;right:0;top:0}.fc .fc-non-business{background:var(--fc-non-business-color)}.fc .fc-bg-event{background:var(--fc-bg-event-color);opacity:var(--fc-bg-event-opacity)}.fc .fc-bg-event .fc-event-title{font-size:var(--fc-small-font-size);font-style:italic;margin:.5em}.fc .fc-highlight{background:var(--fc-highlight-color)}.fc .fc-cell-shaded,.fc .fc-day-disabled{background:var(--fc-neutral-bg-color)}a.fc-event,a.fc-event:hover{text-decoration:none}.fc-event.fc-event-draggable,.fc-event[href]{cursor:pointer}.fc-event .fc-event-main{position:relative;z-index:2}.fc-event-dragging:not(.fc-event-selected){opacity:.75}.fc-event-dragging.fc-event-selected{box-shadow:0 2px 7px rgba(0,0,0,.3)}.fc-event .fc-event-resizer{display:none;position:absolute;z-index:4}.fc-event-selected .fc-event-resizer,.fc-event:hover .fc-event-resizer{display:block}.fc-event-selected .fc-event-resizer{background:var(--fc-page-bg-color);border-color:inherit;border-radius:calc(var(--fc-event-resizer-dot-total-width)/2);border-style:solid;border-width:var(--fc-event-resizer-dot-border-width);height:var(--fc-event-resizer-dot-total-width);width:var(--fc-event-resizer-dot-total-width)}.fc-event-selected .fc-event-resizer:before{bottom:-20px;content:\"\";left:-20px;position:absolute;right:-20px;top:-20px}.fc-event-selected,.fc-event:focus{box-shadow:0 2px 5px rgba(0,0,0,.2)}.fc-event-selected:before,.fc-event:focus:before{bottom:0;content:\"\";left:0;position:absolute;right:0;top:0;z-index:3}.fc-event-selected:after,.fc-event:focus:after{background:var(--fc-event-selected-overlay-color);bottom:-1px;content:\"\";left:-1px;position:absolute;right:-1px;top:-1px;z-index:1}.fc-h-event{background-color:var(--fc-event-bg-color);border:1px solid var(--fc-event-border-color);display:block}.fc-h-event .fc-event-main{color:var(--fc-event-text-color)}.fc-h-event .fc-event-main-frame{display:flex}.fc-h-event .fc-event-time{max-width:100%;overflow:hidden}.fc-h-event .fc-event-title-container{flex-grow:1;flex-shrink:1;min-width:0}.fc-h-event .fc-event-title{display:inline-block;left:0;max-width:100%;overflow:hidden;right:0;vertical-align:top}.fc-h-event.fc-event-selected:before{bottom:-10px;top:-10px}.fc-direction-ltr .fc-daygrid-block-event:not(.fc-event-start),.fc-direction-rtl .fc-daygrid-block-event:not(.fc-event-end){border-bottom-left-radius:0;border-left-width:0;border-top-left-radius:0}.fc-direction-ltr .fc-daygrid-block-event:not(.fc-event-end),.fc-direction-rtl .fc-daygrid-block-event:not(.fc-event-start){border-bottom-right-radius:0;border-right-width:0;border-top-right-radius:0}.fc-h-event:not(.fc-event-selected) .fc-event-resizer{bottom:0;top:0;width:var(--fc-event-resizer-thickness)}.fc-direction-ltr .fc-h-event:not(.fc-event-selected) .fc-event-resizer-start,.fc-direction-rtl .fc-h-event:not(.fc-event-selected) .fc-event-resizer-end{cursor:w-resize;left:calc(var(--fc-event-resizer-thickness)*-.5)}.fc-direction-ltr .fc-h-event:not(.fc-event-selected) .fc-event-resizer-end,.fc-direction-rtl .fc-h-event:not(.fc-event-selected) .fc-event-resizer-start{cursor:e-resize;right:calc(var(--fc-event-resizer-thickness)*-.5)}.fc-h-event.fc-event-selected .fc-event-resizer{margin-top:calc(var(--fc-event-resizer-dot-total-width)*-.5);top:50%}.fc-direction-ltr .fc-h-event.fc-event-selected .fc-event-resizer-start,.fc-direction-rtl .fc-h-event.fc-event-selected .fc-event-resizer-end{left:calc(var(--fc-event-resizer-dot-total-width)*-.5)}.fc-direction-ltr .fc-h-event.fc-event-selected .fc-event-resizer-end,.fc-direction-rtl .fc-h-event.fc-event-selected .fc-event-resizer-start{right:calc(var(--fc-event-resizer-dot-total-width)*-.5)}.fc .fc-popover{box-shadow:0 2px 6px rgba(0,0,0,.15);position:absolute;z-index:9999}.fc .fc-popover-header{align-items:center;display:flex;flex-direction:row;justify-content:space-between;padding:3px 4px}.fc .fc-popover-title{margin:0 2px}.fc .fc-popover-close{cursor:pointer;font-size:1.1em;opacity:.65}.fc-theme-standard .fc-popover{background:var(--fc-page-bg-color);border:1px solid var(--fc-border-color)}.fc-theme-standard .fc-popover-header{background:var(--fc-neutral-bg-color)}`;
const dayGridCss = css`:root{--fc-daygrid-event-dot-width:8px}.fc-daygrid-day-events:after,.fc-daygrid-day-events:before,.fc-daygrid-day-frame:after,.fc-daygrid-day-frame:before,.fc-daygrid-event-harness:after,.fc-daygrid-event-harness:before{clear:both;content:\"\";display:table}.fc .fc-daygrid-body{position:relative;z-index:1}.fc .fc-daygrid-day.fc-day-today{background-color:var(--fc-today-bg-color)}.fc .fc-daygrid-day-frame{min-height:100%;position:relative}.fc .fc-daygrid-day-top{display:flex;flex-direction:row-reverse}.fc .fc-day-other .fc-daygrid-day-top{opacity:.3}.fc .fc-daygrid-day-number{padding:4px;position:relative;z-index:4}.fc .fc-daygrid-month-start{font-size:1.1em;font-weight:700}.fc .fc-daygrid-day-events{margin-top:1px}.fc .fc-daygrid-body-balanced .fc-daygrid-day-events{left:0;position:absolute;right:0}.fc .fc-daygrid-body-unbalanced .fc-daygrid-day-events{min-height:2em;position:relative}.fc .fc-daygrid-body-natural .fc-daygrid-day-events{margin-bottom:1em}.fc .fc-daygrid-event-harness{position:relative}.fc .fc-daygrid-event-harness-abs{left:0;position:absolute;right:0;top:0}.fc .fc-daygrid-bg-harness{bottom:0;position:absolute;top:0}.fc .fc-daygrid-day-bg .fc-non-business{z-index:1}.fc .fc-daygrid-day-bg .fc-bg-event{z-index:2}.fc .fc-daygrid-day-bg .fc-highlight{z-index:3}.fc .fc-daygrid-event{margin-top:1px;z-index:6}.fc .fc-daygrid-event.fc-event-mirror{z-index:7}.fc .fc-daygrid-day-bottom{font-size:.85em;margin:0 2px}.fc .fc-daygrid-day-bottom:after,.fc .fc-daygrid-day-bottom:before{clear:both;content:\"\";display:table}.fc .fc-daygrid-more-link{border-radius:3px;cursor:pointer;line-height:1;margin-top:1px;max-width:100%;overflow:hidden;padding:2px;position:relative;white-space:nowrap;z-index:4}.fc .fc-daygrid-more-link:hover{background-color:rgba(0,0,0,.1)}.fc .fc-daygrid-week-number{background-color:var(--fc-neutral-bg-color);color:var(--fc-neutral-text-color);min-width:1.5em;padding:2px;position:absolute;text-align:center;top:0;z-index:5}.fc .fc-more-popover .fc-popover-body{min-width:220px;padding:10px}.fc-direction-ltr .fc-daygrid-event.fc-event-start,.fc-direction-rtl .fc-daygrid-event.fc-event-end{margin-left:2px}.fc-direction-ltr .fc-daygrid-event.fc-event-end,.fc-direction-rtl .fc-daygrid-event.fc-event-start{margin-right:2px}.fc-direction-ltr .fc-daygrid-more-link{float:left}.fc-direction-ltr .fc-daygrid-week-number{border-radius:0 0 3px 0;left:0}.fc-direction-rtl .fc-daygrid-more-link{float:right}.fc-direction-rtl .fc-daygrid-week-number{border-radius:0 0 0 3px;right:0}.fc-liquid-hack .fc-daygrid-day-frame{position:static}.fc-daygrid-event{border-radius:3px;font-size:var(--fc-small-font-size);position:relative;white-space:nowrap}.fc-daygrid-block-event .fc-event-time{font-weight:700}.fc-daygrid-block-event .fc-event-time,.fc-daygrid-block-event .fc-event-title{padding:1px}.fc-daygrid-dot-event{align-items:center;display:flex;padding:2px 0}.fc-daygrid-dot-event .fc-event-title{flex-grow:1;flex-shrink:1;font-weight:700;min-width:0;overflow:hidden}.fc-daygrid-dot-event.fc-event-mirror,.fc-daygrid-dot-event:hover{background:rgba(0,0,0,.1)}.fc-daygrid-dot-event.fc-event-selected:before{bottom:-10px;top:-10px}.fc-daygrid-event-dot{border:calc(var(--fc-daygrid-event-dot-width)/2) solid var(--fc-event-border-color);border-radius:calc(var(--fc-daygrid-event-dot-width)/2);box-sizing:content-box;height:0;margin:0 4px;width:0}.fc-direction-ltr .fc-daygrid-event .fc-event-time{margin-right:3px}.fc-direction-rtl .fc-daygrid-event .fc-event-time{margin-left:3px}`;
const timeGridCss = css`.fc-v-event{background-color:var(--fc-event-bg-color);border:1px solid var(--fc-event-border-color);display:block}.fc-v-event .fc-event-main{color:var(--fc-event-text-color);height:100%}.fc-v-event .fc-event-main-frame{display:flex;flex-direction:column;height:100%}.fc-v-event .fc-event-time{flex-grow:0;flex-shrink:0;max-height:100%;overflow:hidden}.fc-v-event .fc-event-title-container{flex-grow:1;flex-shrink:1;min-height:0}.fc-v-event .fc-event-title{bottom:0;max-height:100%;overflow:hidden;top:0}.fc-v-event:not(.fc-event-start){border-top-left-radius:0;border-top-right-radius:0;border-top-width:0}.fc-v-event:not(.fc-event-end){border-bottom-left-radius:0;border-bottom-right-radius:0;border-bottom-width:0}.fc-v-event.fc-event-selected:before{left:-10px;right:-10px}.fc-v-event .fc-event-resizer-start{cursor:n-resize}.fc-v-event .fc-event-resizer-end{cursor:s-resize}.fc-v-event:not(.fc-event-selected) .fc-event-resizer{height:var(--fc-event-resizer-thickness);left:0;right:0}.fc-v-event:not(.fc-event-selected) .fc-event-resizer-start{top:calc(var(--fc-event-resizer-thickness)/-2)}.fc-v-event:not(.fc-event-selected) .fc-event-resizer-end{bottom:calc(var(--fc-event-resizer-thickness)/-2)}.fc-v-event.fc-event-selected .fc-event-resizer{left:50%;margin-left:calc(var(--fc-event-resizer-dot-total-width)/-2)}.fc-v-event.fc-event-selected .fc-event-resizer-start{top:calc(var(--fc-event-resizer-dot-total-width)/-2)}.fc-v-event.fc-event-selected .fc-event-resizer-end{bottom:calc(var(--fc-event-resizer-dot-total-width)/-2)}.fc .fc-timegrid .fc-daygrid-body{z-index:2}.fc .fc-timegrid-divider{padding:0 0 2px}.fc .fc-timegrid-body{min-height:100%;position:relative;z-index:1}.fc .fc-timegrid-axis-chunk{position:relative}.fc .fc-timegrid-axis-chunk>table,.fc .fc-timegrid-slots{position:relative;z-index:1}.fc .fc-timegrid-slot{border-bottom:0;height:1.5em}.fc .fc-timegrid-slot:empty:before{content:\"\\00a0\"}.fc .fc-timegrid-slot-minor{border-top-style:dotted}.fc .fc-timegrid-slot-label-cushion{display:inline-block;white-space:nowrap}.fc .fc-timegrid-slot-label{vertical-align:middle}.fc .fc-timegrid-axis-cushion,.fc .fc-timegrid-slot-label-cushion{padding:0 4px}.fc .fc-timegrid-axis-frame-liquid{height:100%}.fc .fc-timegrid-axis-frame{align-items:center;display:flex;justify-content:flex-end;overflow:hidden}.fc .fc-timegrid-axis-cushion{flex-shrink:0;max-width:60px}.fc-direction-ltr .fc-timegrid-slot-label-frame{text-align:right}.fc-direction-rtl .fc-timegrid-slot-label-frame{text-align:left}.fc-liquid-hack .fc-timegrid-axis-frame-liquid{bottom:0;height:auto;left:0;position:absolute;right:0;top:0}.fc .fc-timegrid-col.fc-day-today{background-color:var(--fc-today-bg-color)}.fc .fc-timegrid-col-frame{min-height:100%;position:relative}.fc-media-screen.fc-liquid-hack .fc-timegrid-col-frame{bottom:0;height:auto;left:0;position:absolute;right:0;top:0}.fc-media-screen .fc-timegrid-cols{bottom:0;left:0;position:absolute;right:0;top:0}.fc-media-screen .fc-timegrid-cols>table{height:100%}.fc-media-screen .fc-timegrid-col-bg,.fc-media-screen .fc-timegrid-col-events,.fc-media-screen .fc-timegrid-now-indicator-container{left:0;position:absolute;right:0;top:0}.fc .fc-timegrid-col-bg{z-index:2}.fc .fc-timegrid-col-bg .fc-non-business{z-index:1}.fc .fc-timegrid-col-bg .fc-bg-event{z-index:2}.fc .fc-timegrid-col-bg .fc-highlight{z-index:3}.fc .fc-timegrid-bg-harness{left:0;position:absolute;right:0}.fc .fc-timegrid-col-events{z-index:3}.fc .fc-timegrid-now-indicator-container{bottom:0;overflow:visible !important}.fc-direction-ltr .fc-timegrid-col-events{margin:0 2.5% 0 2px}.fc-direction-rtl .fc-timegrid-col-events{margin:0 2px 0 2.5%}.fc-timegrid-event-harness{position:absolute}.fc-timegrid-event-harness>.fc-timegrid-event{bottom:0;left:0;position:absolute;right:0;top:0}.fc-timegrid-event-harness-inset .fc-timegrid-event,.fc-timegrid-event.fc-event-mirror,.fc-timegrid-more-link{box-shadow:0 0 0 0.125rem var(--fc-page-bg-color)}.fc-timegrid-event,.fc-timegrid-more-link{border-radius:3px;font-size:var(--fc-small-font-size)}.fc-timegrid-event{margin-bottom:1px}.fc-timegrid-event .fc-event-main{padding:1px 1px 0}.fc-timegrid-event .fc-event-time{font-size:var(--fc-small-font-size);margin-bottom:1px;white-space:nowrap}.fc-timegrid-event-short .fc-event-main-frame{flex-direction:row;overflow:hidden}.fc-timegrid-event-short .fc-event-time:after{content:\"\\00a0-\\00a0\"}.fc-timegrid-event-short .fc-event-title{font-size:var(--fc-small-font-size)}.fc-timegrid-more-link{background:var(--fc-more-link-bg-color);color:var(--fc-more-link-text-color);cursor:pointer;margin-bottom:1px;position:absolute;z-index:9999}.fc-timegrid-more-link-inner{padding:3px 2px;top:0}.fc-direction-ltr .fc-timegrid-more-link{right:0}.fc-direction-rtl .fc-timegrid-more-link{left:0}.fc .fc-timegrid-now-indicator-arrow,.fc .fc-timegrid-now-indicator-line{pointer-events:none}.fc .fc-timegrid-now-indicator-line{width:var(--fc-now-indicator-line-width);border-color:var(--fc-now-indicator-color);border-style:solid;border-width:1px 0 0;left:0;position:absolute;right:0;z-index:4}.fc .fc-timegrid-now-indicator-arrow{border-color:var(--fc-now-indicator-color);border-style:solid;margin-top:-5px;position:absolute;z-index:4}.fc-direction-ltr .fc-timegrid-now-indicator-arrow{border-bottom-color:transparent;border-top-color:transparent;border-width:5px 0 5px 6px;left:0}.fc-direction-rtl .fc-timegrid-now-indicator-arrow{border-bottom-color:transparent;border-top-color:transparent;border-width:5px 6px 5px 0;right:0}`;

export interface CalendarMetadata {
  id: string;
  name: string;
  source?: string;
  color?: string;
  hexColor?: string;
  canEdit?: boolean;
  canShare?: boolean;
  canViewPrivateItems?: boolean;
  isDefaultCalendar?: boolean;
  isRemovable?: boolean;
  owner?: {
    name?: string;
    address?: string;
  };
  groupClassId?: string;
  changeKey?: string;
  defaultOnlineMeetingProvider?: string;
  isTallyingResponses?: boolean;
  allowedOnlineMeetingProviders?: string[];
  [key: string]: any;
}

// referencing https://fullcalendar.io/demos
export class ScCalendar extends LitElement {   
  // @ts-ignore
  static styles = [ScCalendarStyle, ScCalendarDatePickerPopupStyles, coreCss, dayGridCss, timeGridCss];

  @property({ type: locales }) locale = 'en';

  @property({ type: CALENDAR_VIEW, attribute: 'calendar-view' }) calendarView = 'default';
  
  @property({ type: Boolean, attribute: 'year-navigation' }) yearNavigation = false;
  
  @property({ type: Boolean, attribute: 'show-header-toolbar' }) showHeaderToolbar = false;

  @property({ type: String }) width = '100%';

  @property({ type: String, attribute: 'list-start-date' }) listStartDate: string;

  @property({ type: Boolean }) loading = false;

  // event object https://fullcalendar.io/docs/event-object
  // using rrule for recurrence https://fullcalendar.io/docs/rrule-plugin
  @property({ type: Array }) events: CALENDAR_EVENT[] = [];

  @property({ type: Array, attribute: 'available-calendars' })
  get availableCalendars(): (string | CalendarMetadata)[] {
    return this._availableCalendars;
  }
  set availableCalendars(value: (string | CalendarMetadata)[] | Set<string>) {
    if (Array.isArray(value)) {
      this._availableCalendars = value;
    } else if (value instanceof Set) {
      this._availableCalendars = Array.from(value);
    } else {
      this._availableCalendars = [];
    }
    this._processCalendarMetadata();
  }

  @state() private _availableCalendars: (string | CalendarMetadata)[] = [];
  
  @state() private _calendarMetadataMap: Map<string, CalendarMetadata> = new Map();

  @property({ type: Array, attribute: 'selected-calendars' })
  get selectedCalendars(): (string | CalendarMetadata)[] {
    return this._selectedCalendars;
  }
  set selectedCalendars(value: (string | CalendarMetadata)[]) {
    if (Array.isArray(value)) {
      this._selectedCalendars = value;
    } else {
      this._selectedCalendars = [];
    }
  }

  @state() _selectedCalendars: (string | CalendarMetadata)[] = [];
  
  @property({ type: Array }) locations: LOCATION[] = [];

  @property({ type: Array }) toolbar: string[] = [];

  @state() showDatePicker = false;

  @state() selectedDate: string | null = null;

  @state() options: CalendarOptions;
  
  @state() debouncer: Debouncer | null = null;

  @state() startDate: Date | null = null;

  @state() endDate: Date | null = null;

  @state() today = new Date();

  @state() dateHeader = '';

  @state() currentView: string;

  @state() calendarList: any[];
  
  @state() _calendar: FullCalendar | null = null;

  @state() private _contextMenuOpen = false;

  @state() private _contextMenuX = 0;

  @state() private _contextMenuY = 0;

  @state() private _selectedCalendarKey: string | null = null;

  @state() isDesktop = false;

  @state() isMobileLg = false;
  
  @state() isMobileSm = false; 

  @state() private _openMoreMenu = false;
  
  @query('sc-column-layout') columnLayout!: HTMLElement;

  private _calendarRef = createRef();

  lastEmittedState: { startDate: Date | null; endDate: Date | null; view: string | null } = {
    startDate: null,
    endDate: null,
    view: null,
  };
  
  constructor() {
    super();
    this.updateDateHeader = this.updateDateHeader.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  private handleDocumentClick(event: MouseEvent) {
    if (!this._contextMenuOpen) {
      return;
    }

    const target = event.target as HTMLElement;
    const contextMenu = this.shadowRoot?.querySelector('.sc-calendar-context-menu');
    
    if (contextMenu && !contextMenu.contains(target)) {
      this.handleContextMenuClose();
    }
  }

  private _processCalendarMetadata() {
    processCalendarMetadata(this._availableCalendars, this._calendarMetadataMap);
  }

  private _getCalendarKeys(): string[] {
    return getCalendarKeys(this._calendarMetadataMap);
  }

  getCalendarMetadata(key: string): CalendarMetadata | undefined {
    return this._calendarMetadataMap.get(key);
  }

  getAllCalendarMetadata(): Map<string, CalendarMetadata> {
    return new Map(this._calendarMetadataMap);
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this._calendarRef.value && !this._calendar) {
      this.createCalendar();
    }
    this.handleResize();
    window.addEventListener('resize', this.handleResize.bind(this));
    document.addEventListener('click', this.handleDocumentClick, true);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._calendar) {
      this._calendar.destroy();
      this._calendar = null;
    }
    window.removeEventListener('resize', this.handleResize.bind(this));
    document.removeEventListener('click', this.handleDocumentClick, true);
  }

  async firstUpdated() {
    this.createCalendar();
    this.handleResize();
    await this.updateComplete;

    const mq = getGlobalMediaQuery();
    if (mq) {
      this.handleMediaQueryChange(
        mq.desktop.matches,
        mq.mobileLg.matches,
        mq.mobileSm.matches
      );
    }

    const onFirstResize = () => {
      const mq = getGlobalMediaQuery();
      if (mq) {
        this.handleMediaQueryChange(
          mq.desktop.matches,
          mq.mobileLg.matches,
          mq.mobileSm.matches
        );
      }
      window.removeEventListener('resize', onFirstResize);
    };
    window.addEventListener('resize', onFirstResize);
  }

  async createCalendar() { 
    await this.updateCalendarOptions();
    const calendarOptions = this.options;

    if (this._calendarRef.value) {
      const currentView = this.getInitialView();
      const currentDate = this._calendar?.getDate() || new Date();

      if (this._calendar) {
        this._calendar.destroy();
      }

      this._calendar = new FullCalendar(this._calendarRef.value as HTMLElement, {
        ...calendarOptions,
        datesSet: () => {
          this.updateDateHeader();
        },
      });

      this._calendar.render();
      this._calendar.changeView(currentView);
      this._calendar.gotoDate(currentDate);
      this.currentView = currentView;

      if (this.calendarView !== 'default') {
        replaceButtons({
          shadowRoot: this.shadowRoot,
          calendarApi: this.getCalendarApi(),
          currentView: this.currentView,
          locale: this.locale,
          handleClick: this.handleClick.bind(this),
          handleDropdownSelect: this.handleDropdownSelect.bind(this),
          _calendar: this._calendar,
        });
      }

      const buttonGroup = this.shadowRoot?.querySelector('.sc-calendar-view-buttons');
      if (buttonGroup) {
        (buttonGroup as any).value = [currentView];
      }
    } else {
      console.error('Calendar reference is undefined.');
    }
  }

  private _removeDatePickerOutsideListener: (() => void) | null = null;

  private openDatePicker() {
    openDatePicker({
      setShowDatePicker: (val: any) => (this.showDatePicker = val),
      getPopup: () => this.shadowRoot?.querySelector('.sc-calendar-popup') as HTMLElement,
      onClose: () => this.closeDatePicker(),
      isActive: () => this.showDatePicker,
      setRemoveListener: (fn: any) => (this._removeDatePickerOutsideListener = fn),
    });
  }

  private closeDatePicker() {
    closeDatePicker({
      setShowDatePicker: (val: any) => (this.showDatePicker = val),
      removeListener: this._removeDatePickerOutsideListener,
      setRemoveListener: (fn: any) => (this._removeDatePickerOutsideListener = fn),
    });
  }

  getCalendarApi() {
    const calendar = this._calendar! as any;
    return calendar;
  }

  getPrimaryColor(color: string): { fill: string; stroke: string } {
    return getPrimaryColor(color, colorClassMapping);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
  
    if (changedProperties.has('_availableCalendars')) {
      const calendarKeys = this._getCalendarKeys();
      assignCalendarColors(calendarKeys, this._calendarMetadataMap, colorMapping, colorClassMapping);
      this._selectedCalendars = getInitialSelectedCalendars(this._availableCalendars, this._selectedCalendars);
      const selectedIds = new Set(this._selectedCalendars.map(c => typeof c === 'string' ? c : c.id));
      this.calendarList = buildCalendarList(
        calendarKeys,
        this._calendarMetadataMap,
        selectedIds,
        colorMapping,
        this.renderCalendarItemPrefix.bind(this),
        this.renderCalendarItemSuffix.bind(this)
      );
      this.setupCalendarListHoverListeners();
      // Force dropdown re-render after colorMapping is updated
      this.requestUpdate();
    }
  
    if (
      changedProperties.has('locale') || 
      changedProperties.has('calendarView') || 
      changedProperties.has('yearNavigation') || 
      changedProperties.has('showHeaderToolbar') || 
      changedProperties.has('listStartDate')
    ) { 
      const hasMeaningfulChange = Array.from(changedProperties.keys()).some(key => {
        return changedProperties.get(key) !== this[key as keyof this];
      });

      if (hasMeaningfulChange) {
        this.createCalendar();
      }
    } else if (changedProperties.has('events')) {
      if (this._calendar) {
        this._calendar.removeAllEvents();
        const transformedEvents = this.events
          ? this.events.map(event => transformEvent(event))
          : [];
        this._calendar.addEventSource(transformedEvents);
      }
    }
  }

  updateDateHeader() {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    const monthOptions: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    const calendarApi = this.getCalendarApi();

    if (!calendarApi) {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const startOfWeek = new Date(today);
      const endOfWeek = new Date(today);

      startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
      endOfWeek.setDate(today.getDate() + (dayOfWeek === 0 ? 0 : 7 - dayOfWeek));

      const startDay = startOfWeek.getDate();
      const endDay = endOfWeek.getDate();
      const endMonthYear = endOfWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      if (startOfWeek.getMonth() !== endOfWeek.getMonth()) {
        this.dateHeader = `${startDay} ${startOfWeek.toLocaleDateString('en-US', { month: 'short' })} - ${endDay} ${endOfWeek.toLocaleDateString('en-US', { month: 'short' })} ${endOfWeek.getFullYear()}`;
      } else {
        this.dateHeader = `${startDay} - ${endDay} ${endMonthYear}`;
      }
      return;
    }

    const initialView = calendarApi?.view?.type;
    const currentView = Array.isArray(initialView) ? initialView[0] : initialView;
    const visibleRangeStart = calendarApi?.view?.activeStart;
    const visibleRangeEnd = new Date(calendarApi?.view?.activeEnd);
    visibleRangeEnd.setDate(visibleRangeEnd.getDate() - 1);

    if (currentView === 'dayGridMonth') {
      if (visibleRangeStart.getDate() !== 1) {
        const nextMonth = new Date(visibleRangeStart);
        nextMonth.setDate(1);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        this.dateHeader = nextMonth.toLocaleDateString('en-US', monthOptions);
      } else {
        this.dateHeader = visibleRangeStart.toLocaleDateString('en-US', monthOptions);
      }
    } else if (currentView === 'timeGridDay') {
      this.dateHeader = visibleRangeStart.toLocaleDateString('en-US', options);
    } else if (
      currentView === 'timeGridWeek' ||
      currentView === 'workWeek' ||
      currentView === 'customView' ||
      currentView === 'timeGrid'
    ) {
      const startDay = visibleRangeStart.getDate();
      const endDay = visibleRangeEnd.getDate();

      if (visibleRangeStart.getMonth() !== visibleRangeEnd.getMonth()) {
        this.dateHeader = `${startDay} ${visibleRangeStart.toLocaleDateString('en-US', { month: 'short' })} - ${endDay} ${visibleRangeEnd.toLocaleDateString('en-US', { month: 'short' })} ${visibleRangeEnd.getFullYear()}`;
      } else {
        this.dateHeader = `${startDay} - ${endDay} ${visibleRangeEnd.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
      }
    } else {
      this.dateHeader = this.today.toLocaleDateString('en-US', options);
    }

    this.scheduleEmitWithDebouncer(visibleRangeStart, visibleRangeEnd, currentView);
  }

  private scheduleEmitWithDebouncer(startDate: Date, endDate: Date, view: string) {
    this.debouncer = Debouncer.debounce(
      this.debouncer,
      {
        run: (callback: () => void) => setTimeout(callback, 300),
        cancel: (timer: number) => clearTimeout(timer),
      },
      () => this.emitIfStateChanged(startDate, endDate, view)
    );
  }

  private emitIfStateChanged(startDate: Date, endDate: Date, view: string) {
    const { startDate: lastStartDate, endDate: lastEndDate, view: lastView } = this.lastEmittedState;

    if (
      !lastStartDate ||
      !lastEndDate ||
      lastView !== view ||
      lastStartDate.getTime() !== startDate.getTime() ||
      lastEndDate.getTime() !== endDate.getTime()
    ) {
      this.emit('sc-calendar-view-change', {
        detail: {
          startDate,
          endDate,
          view,
        },
      });

      this.lastEmittedState = { startDate, endDate, view };
    }
  }

  async createCustomView(startDate: Date, endDate: Date, weekends = true) {
    const dateIncrement = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const viewType = startDate.getTime() === endDate.getTime() ? 'timeGridDay' : 'timeGrid';
  
    const customViewConfig = {
      buttonText: 'Custom View',
      duration: { days: dateIncrement },
      dateIncrement: { days: dateIncrement },
      weekends,
      visibleRange: () => {
        return { start: startDate, end: endDate };
      },
      dayHeaderContent: (args: any) => {
        const today = new Date();
        const isToday = args.date.getDate() === today.getDate() &&
                        args.date.getMonth() === today.getMonth() &&
                        args.date.getFullYear() === today.getFullYear();
        const date = args.date.getDate();
        const dayFormat = dateIncrement > 5 ? 'short' : 'long'; 
        const day = args.date.toLocaleDateString('default', { weekday: dayFormat });
  
        if (isToday) {
          return {
            html: `
              <div class="fc-day-today" style="color: var(--sc-calendar-week-header-color, var(--sc-color-blue-460));">
                ${date} ${day}
              </div>
            `,
          };
        } else {
          return {
            html: `${date} ${day}`,
          };
        }
      },
    };
  
    if (this._calendar && customViewConfig) {
      Object.entries(customViewConfig).forEach(([key, value]) => {
        if (key !== 'type') { 
          this._calendar!.setOption(key as keyof CalendarOptions, value);
        }
      });
    } else {
      console.error('Calendar instance or customViewConfig is not available.');
    }
  
    const calendarApi = this.getCalendarApi();
    this.currentView = viewType;
    if (calendarApi && typeof calendarApi.changeView === 'function') {
      calendarApi.changeView(viewType, startDate);
    }

    const buttonGroup = this.shadowRoot?.querySelector('.sc-calendar-view-buttons');
    if (buttonGroup) {
      (buttonGroup as any).value = ['timeGridWeek'];
    }
  }

  private handleResize(): void {
    const calendarApi = this.getCalendarApi();
    calendarApi?.updateSize();
    calendarApi?.changeView(this.currentView || this.getInitialView());
  }

  private getEditableCalendars() {
    return getEditableCalendars(this._calendarMetadataMap);
  }

  private getNewEventDropdownData() {
    const editableCalendars = this.getEditableCalendars();
    const renderPrefixSvg = (calendarKey: string) => {
      const calendarName = this._calendarMetadataMap.get(calendarKey)?.name ?? calendarKey;
      const colorObj = colorMapping[calendarName] ?? colorClassMapping.default;
      return html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" style="vertical-align: middle; margin-right: 0.5rem;"><circle cx="8" cy="8" r="7.5" fill="${colorObj.fill}" stroke="${colorObj.stroke}"></circle></svg>`;
    };

    if (editableCalendars.length === 0) {
      return [
        { label: msg('Appointment', { id: 'sc-calendar-appointment' }), value: 'appointment' },
        { label: msg('Meeting', { id: 'sc-calendar-meeting' }), value: 'meeting' },
      ];
    }

    if (editableCalendars.length === 1) {
      return [
        {
          label: html`${renderPrefixSvg(editableCalendars[0].value)}${msg('Appointment', { id: 'sc-calendar-appointment' })}`,
          value: `appointment:${editableCalendars[0].value}`,
        },
        {
          label: html`${renderPrefixSvg(editableCalendars[0].value)}${msg('Meeting', { id: 'sc-calendar-meeting' })}`,
          value: `meeting:${editableCalendars[0].value}`,
        },
      ];
    }

    const sourceMap = new Map<string, { displayName: string; calendars: typeof editableCalendars }>();
    for (const cal of editableCalendars) {
      const sourceKey = cal.metadata?.source ?? 'default';
      const sourceDisplayName = cal.metadata?.sourceDisplayName ?? sourceKey;
      if (!sourceMap.has(sourceKey)) {
        sourceMap.set(sourceKey, { displayName: sourceDisplayName, calendars: [] });
      }
      sourceMap.get(sourceKey)!.calendars.push(cal);
    }

    const buildEventTypeChildren = (eventType: 'appointment' | 'meeting') => {
      if (sourceMap.size === 1) {
        const [{ calendars }] = sourceMap.values();
        return calendars.map(cal => ({
          label: html`${renderPrefixSvg(cal.value)}${cal.label}`,
          value: `${eventType}:${cal.value}`,
        }));
      }

      return Array.from(sourceMap.values()).map(({ displayName, calendars }) => ({
        label: displayName,
        value: `${eventType}:source:${displayName}`,
        children: calendars.map(cal => ({
          label: html`${renderPrefixSvg(cal.value)}${cal.label}`,
          value: `${eventType}:${cal.value}`,
        })),
      }));
    };

    return [
      {
        label: msg('Appointment', { id: 'sc-calendar-appointment' }),
        value: 'appointment',
        children: buildEventTypeChildren('appointment'),
      },
      {
        label: msg('Meeting', { id: 'sc-calendar-meeting' }),
        value: 'meeting',
        children: buildEventTypeChildren('meeting'),
      },
    ];
  }

  private renderDefaultActionBarLeftBack() {
    const calendarApi = this.getCalendarApi();
    if (this.isMobileSm || this.isMobileLg) {
      return html``;
    }
    return html`
      <sc-button
        type="text"
        state="default"
        size="sm"
        @click=${() => {
          calendarApi?.today();
          this.updateDateHeader();
        }}
      >
        ${msg('Today', { id: 'sc-calendar-today' })}
      </sc-button>

      <sc-icon-button
        type="text"
        state="default"
        size="sm"
        name="arrow-ios-backward"
        @click=${() => {
          calendarApi?.prev();
          this.updateDateHeader();
        }}
      ></sc-icon-button>

      <sc-icon-button
        type="text"
        state="default"
        size="sm"
        name="arrow-ios-forward"
        @click=${() => {
          calendarApi?.next();
          this.updateDateHeader();
        }}
      ></sc-icon-button>
    `;
  }

  private renderDefaultActionBarLeftActions() {
    return html`
      <div class="sc-calendar-date-picker-trigger">
        <sc-button
          type="text"
          state="default"
          size="sm"
          right-icon="arrow-ios-downward"
          @click=${this.openDatePicker}
        >
          ${this.dateHeader}
        </sc-button>
        ${this.showDatePicker ? html`
          <div
            class="sc-calendar-popup"
            @click=${(e: Event) => e.stopPropagation()}
          >
            <sc-date-picker
              class="sc-calendar-date-picker-popup"
              drag-to-select
              show-action-bar
              first-day-of-week="1"
              .value=${this.selectedDate}
              .default-date=${this.selectedDate || new Date().toISOString().slice(0, 10)}
              @sc-select-items=${(e: CustomEvent) => this.handleDateSelect(e, { fromPopup: true })}
            ></sc-date-picker>
          </div>
        ` : ''}
      </div>
    `;
  }

  @mediaQuery(['desktop', 'mobileLg', 'mobileSm'], { waitAfterUpdate: true })
  handleMediaQueryChange(isDesktop: boolean, isMobileLg: boolean, isMobileSm: boolean) {
    this.isDesktop = isDesktop;
    this.isMobileLg = isMobileLg;
    this.isMobileSm = isMobileSm;

    const calendarApi = this.getCalendarApi();
    if (calendarApi && this.currentView === 'workWeek') {
      const dayHeaderContent = (args: CALENDAR_DAY_HEADER_CONTENT) => {
        const today = new Date();
        const isToday = args.date.getDate() === today.getDate() &&
                        args.date.getMonth() === today.getMonth() &&
                        args.date.getFullYear() === today.getFullYear();
        const date = args.date.getDate();
        const isMobile = this.isMobileSm || this.isMobileLg;
        const dayFormat = isMobile ? 'short' : 'long';
        const day = args.date.toLocaleDateString(this.locale || 'default', { weekday: dayFormat });
        if (isToday) {
          return {
            html: `
              <div class="fc-day-today" style="color: var(--sc-calendar-week-header-color, var(--sc-color-blue-460));">
                ${date} ${day}
              </div>
            `,
          };
        } else {
          return {
            html: `${date} ${day}`,
          };
        }
      };
      this._calendar?.setOption('dayHeaderContent', dayHeaderContent.bind(this));
      calendarApi.updateSize();
    }
  }

  private renderShareButton() {
    if (this.isDesktop) {
      return html`<sc-button
        type="secondary"
        left-icon="share--line"
        size="sm"
        @click=${() => this.handleClick('share', undefined)}
      >
        ${msg('Share', { id: 'sc-calendar-share' })}
      </sc-button>`;
    } else {
      return html`<sc-icon-button
        type="secondary"
        state="default"
        size="sm"
        name="share--line"
        @click=${() => this.handleClick('share', undefined)}
      ></sc-icon-button>`;
    }
  }

  private handleFilterClick() {
    (this.columnLayout as any)?.handleOuterCollapseLeft?.('show');
    this._openMoreMenu = false;
  }

  private renderDefaultActionBarRightButtons() {
    const dropdownData = this.getNewEventDropdownData();
    const viewOptions = [
      { label: msg('Work week', { id: 'sc-calendar-work-week' }), value: 'workWeek' },
      { label: msg('Week', { id: 'sc-calendar-week' }), value: 'timeGridWeek' },
      { label: msg('Day', { id: 'sc-calendar-day' }), value: 'timeGridDay' },
      { label: msg('Month', { id: 'sc-calendar-month' }), value: 'dayGridMonth' },
    ];
    const selectedOption = viewOptions.find(option => option.value === (this.currentView || 'workWeek'));
    const buttonText = selectedOption?.label || msg('Work week', { id: 'sc-calendar-work-week' });

    if (this.isMobileSm || this.isMobileLg) {
      const calendarApi = this.getCalendarApi();
      const currentView = this.currentView || 'workWeek';
      
      let parentLabel = '';
      let parentIcon = '';
      switch (currentView) {
        case 'workWeek':
          parentLabel = msg('Work week', { id: 'sc-calendar-work-week' });
          parentIcon = 'calendar--line';
          break;
        case 'timeGridWeek':
          parentLabel = msg('Week', { id: 'sc-calendar-week' });
          parentIcon = 'calendar--line';
          break;
        case 'timeGridDay':
          parentLabel = msg('Day', { id: 'sc-calendar-day' });
          parentIcon = 'calendar--line';
          break;
        case 'dayGridMonth':
          parentLabel = msg('Month', { id: 'sc-calendar-month' });
          parentIcon = 'calendar--line';
          break;
        default:
          parentLabel = msg('Work week', { id: 'sc-calendar-work-week' });
          parentIcon = 'calendar--line';
      }
      return html`
        <div class="sc-calendar-action-bar-right-container" style="position: relative;">
          <sc-icon-button
            type="secondary"
            state="default"
            size="sm"
            name="more-horizontal"
            @click=${() => this._openMoreMenu = !this._openMoreMenu}
          ></sc-icon-button>
          ${this._openMoreMenu ? html`
            <sl-dropdown 
              class="sc-calendar-dropdown"
              hoist 
              placement="bottom-start"
              distance="24"
              ?open=${this._openMoreMenu} 
              @sl-hide=${() => this._openMoreMenu = false} 
            >
              <div slot="trigger" aria-haspopup="true" aria-expanded="true"></div>
              <sc-menu class="sc-menu-dropdown-panel">
                <sc-menu-item @click=${() => { calendarApi?.today(); this.updateDateHeader(); this._openMoreMenu = false; }}>
                  <sc-icon name="undo--line"></sc-icon> ${msg('Go to today', { id: 'sc-calendar-today' })}
                </sc-menu-item>
                <sc-menu-item @click=${() => { calendarApi?.prev(); this.updateDateHeader(); this._openMoreMenu = false; }}>
                  <sc-icon name="arrow-ios-backward"></sc-icon> ${msg('Go to previous week', { id: 'sc-calendar-prev-week' })}
                </sc-menu-item>
                <sc-menu-item @click=${() => { calendarApi?.next(); this.updateDateHeader(); this._openMoreMenu = false; }}>
                  <sc-icon name="arrow-ios-forward"></sc-icon> ${msg('Go to next week', { id: 'sc-calendar-next-week' })}
                </sc-menu-item>
                <sc-menu-item>
                  <sc-icon name="${parentIcon}"></sc-icon> ${parentLabel}
                  <sc-menu slot="submenu">
                    <sc-menu-item 
                      @click=${() => { this.handleViewChange('workWeek'); this._openMoreMenu = false; }}
                      ?checked=${currentView === 'workWeek'}
                      type="checkbox"
                    >
                      ${msg('Work week', { id: 'sc-calendar-work-week' })}
                    </sc-menu-item>
                    <sc-menu-item 
                      @click=${() => { this.handleViewChange('timeGridWeek'); this._openMoreMenu = false; }}
                      ?checked=${currentView === 'timeGridWeek'}
                      type="checkbox"
                    >
                      ${msg('Week', { id: 'sc-calendar-week' })}
                    </sc-menu-item>
                    <sc-menu-item 
                      @click=${() => { this.handleViewChange('timeGridDay'); this._openMoreMenu = false; }}
                      ?checked=${currentView === 'timeGridDay'}
                      type="checkbox"
                    >
                      ${msg('Day', { id: 'sc-calendar-day' })}
                    </sc-menu-item>
                    <sc-menu-item 
                      @click=${() => { this.handleViewChange('dayGridMonth'); this._openMoreMenu = false; }}
                      ?checked=${currentView === 'dayGridMonth'}
                      type="checkbox"
                    >
                      ${msg('Month', { id: 'sc-calendar-month' })}
                    </sc-menu-item>
                  </sc-menu>
                </sc-menu-item>
                <sc-divider size="xxs" line-width="xxs" vertical class="sc-calendar-dropdown-divider"></sc-divider>
                <sc-menu-item @click=${() => this.handleFilterClick()}>
                  <sc-icon name="funnel--line"></sc-icon> ${msg('Filter', { id: 'sc-calendar-filter' })}
                </sc-menu-item>
                <sc-divider vertical class="sc-calendar-dropdown-divider"></sc-divider>
                <sc-menu-item @click=${() => { this.handleClick('refresh'); this._openMoreMenu = false; }}>
                  <sc-icon name="refresh"></sc-icon> ${msg('Refresh', { id: 'sc-calendar-refresh' })}
                </sc-menu-item>
                <sc-menu-item @click=${() => { this.handleClick('share'); this._openMoreMenu = false; }}>
                  <sc-icon name="share--line"></sc-icon> ${msg('Share', { id: 'sc-calendar-share' })}
                </sc-menu-item>
              </sc-menu>
            </sl-dropdown>
          ` : ''}
          <sc-button-dropdown
            class="sc-calendar-new-event-dropdown"
            button-text="${msg('New', { id: 'sc-calendar-new' })}"
            type="primary"
            size="sm"
            hide-tick-mark
            .data=${dropdownData}
            @sc-select=${this.handleDropdownSelect}
          ></sc-button-dropdown>
        </div>
      `;
    } else {
      return html`
        <div class="sc-calendar-action-bar-right-container">
          <sc-button-dropdown
            class="sc-calendar-view-buttons"
            value=${selectedOption?.value}
            button-text=${buttonText}
            type="text"
            size="sm"
            left-icon="calendar--line"
            .data=${viewOptions}
            @sc-select=${(event: CustomEvent) => {
              const selectedView = event.detail.value;
              this.handleViewChange(selectedView);
            }}
          >
          </sc-button-dropdown>
          <sc-divider 
            class="sc-calendar-action-bar-right-divider"
            size="xxs" 
            line-width="xxs" 
            line-height="sm"
          ></sc-divider>
          <div class="sc-calendar-action-bar-right-buttons">
            <sc-icon-button
              type="secondary"
              state="default"
              size="sm"
              name="refresh"
              @click=${() => this.handleClick('refresh', undefined)}
            ></sc-icon-button>
            ${this.renderShareButton()}
            <sc-button-dropdown
              class="sc-calendar-new-event-dropdown"
              button-text="${msg('New', { id: 'sc-calendar-new' })}"
              type="primary"
              size="sm"
              hide-tick-mark
              .data=${dropdownData}
              @sc-select=${this.handleDropdownSelect}
            >
            </sc-button-dropdown>
          </div>
        </div>
      `;
    }
  }

  private handleViewChange(selectedView: string) {
    const calendarApi = this.getCalendarApi();
    if (!calendarApi) return;

    this.currentView = selectedView;
    const currentDate = calendarApi.getDate();

    this._calendar?.setOption('dateIncrement', undefined);

    const setDayHeaderContent = (dayFormat: string) => (args: any) => {
      const today = new Date();
      const isToday = args.date.getDate() === today.getDate() &&
                      args.date.getMonth() === today.getMonth() &&
                      args.date.getFullYear() === today.getFullYear();
      const date = args.date.getDate();
      const day = args.date.toLocaleDateString('default', { weekday: dayFormat });

      return isToday
        ? { html: `<div class="fc-day-today" style="color: var(--sc-calendar-week-header-color, var(--sc-color-blue-460));">${date} ${day}</div>` }
        : { html: `${date} ${day}` };
    };

    if (selectedView === 'dayGridMonth') {
      const firstOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      this._calendar?.setOption('weekends', true);
      this._calendar?.setOption('dayHeaderContent', undefined);
      calendarApi.changeView('dayGridMonth', firstOfMonth);
    } else if (selectedView === 'workWeek') {
      const mondayOfCurrentWeek = new Date(currentDate);
      mondayOfCurrentWeek.setDate(currentDate.getDate() - (currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1));
      this._calendar?.setOption('weekends', false);
      const dayFormat = (this.isMobileSm || this.isMobileLg) ? 'short' : 'long';
      this._calendar?.setOption('dayHeaderContent', setDayHeaderContent(dayFormat));
      calendarApi.changeView('workWeek', mondayOfCurrentWeek);
    } else if (selectedView === 'timeGridDay') {
      this._calendar?.setOption('weekends', true);
      this._calendar?.setOption('dayHeaderContent', (args: any) => {
        const today = new Date();
        const isToday = args.date.toDateString() === today.toDateString();
        const day = args.date.toLocaleDateString(this.locale, {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
        const color = isToday ? 'var(--sc-calendar-today-text-color, var(--sc-color-blue-500))'
          : 'var(--sc-calendar-not-today-text-color, var(--sc-color-blue-900))';
        return { html: `<div style="color: ${color};">${day}</div>` };
      });
      calendarApi.changeView('timeGridDay', currentDate);
    } else {
      const mondayOfCurrentWeek = new Date(currentDate);
      mondayOfCurrentWeek.setDate(currentDate.getDate() - (currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1));
      this._calendar?.setOption('weekends', true);
      this._calendar?.setOption('dayHeaderContent', setDayHeaderContent('short'));
      calendarApi.changeView('timeGridWeek', mondayOfCurrentWeek);
    }

    this.updateDateHeader();
  }
  
  updateCalendarOptions(customViewConfig?: any) {
    const customViews = this.getCustomViews(this.listStartDate, this.locale, customViewConfig);
    // Use action bar for default view, otherwise use legacy toolbar mode
    const useActionBar = this.calendarView === 'default';
    const headerToolbar = useActionBar 
      ? false 
      : getViewAndHeaderToolbar(this.calendarView, this.yearNavigation, this.showHeaderToolbar).headerToolbar;

    this.options = {
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, multiMonthPlugin, rrulePlugin],
      initialView: this.getInitialView(),
      headerToolbar,
      allDayText: msg('All day', { id: 'sc-calendar-all-day' }),
      customButtons: {
        shareButton: {
          text: msg('Share', { id: 'sc-calendar-share' }),
        },
        newEventButton: {
          text: msg('New event', { id: 'sc-calendar-new-event' }),
        },
        divider: {
          text: '|',
        },
      },
      buttonText: {
        timeGridWeek: msg('Week', { id: 'sc-calendar-week' }),
        timeGridDay: msg('Day', { id: 'sc-calendar-day' }),
        dayGridMonth: msg('Month', { id: 'sc-calendar-month' }),
      },
      eventDidMount: info => {
        if (info.el.classList.contains('fc-new-event-button')) {
          info.el.setAttribute('data-custom', 'new-event-button');
        }
      },
      scrollTime: (() => {
        const now = new Date();
        now.setMinutes(0, 0, 0); 
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      })(),
      locales: [zhCnLocale],
      locale: this.locale,
      handleWindowResize: true,
      height: '100%',
      expandRows: true,
      selectable: true,
      select: info => this.handleClick('New event with datetime', 
        { start: info.startStr, end: info.endStr } as CALENDAR_EVENT),
      eventClick: info => {
        const calendarEvent = createCalendarEvent(info);
        this.handleClick('Existing event', calendarEvent);
      },
      navLinks: true,
      navLinkDayClick: (date: Date) => {
        this.currentView = 'timeGridDay';
        navigateToDay({
          date,
          calendarApi: this.getCalendarApi(),
          _calendar: this._calendar,
          shadowRoot: this.shadowRoot,
          locale: this.locale,
        });
      },
      editable: true,
      eventStartEditable: false,
      eventDurationEditable: true,
      dayMaxEvents: true,
      nowIndicator: true,
      firstDay: 1,
      fixedMirrorParent: document.body,
      slotLabelFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      },
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      },
      dayCellDidMount: handleDayCellDidMount.bind(this),        
      events: this.events ? this.events.map(event => {
        const startWithTimezone = formatWithTimezone(event.start, event.extendedProps?.originalStartTimeZone);
        const endWithTimezone = formatWithTimezone(event.end, event.extendedProps?.originalEndTimeZone);

        let rruleObj: any = undefined;
        if (event.rrule) {
          rruleObj = {
            freq: event.rrule.freq,
            interval: event.rrule.interval,
            dtstart: event.rrule.dtstart ? new Date(event.rrule.dtstart) : undefined,
            until: event.rrule.until ? new Date(event.rrule.until) : undefined,
            bysetpos: event.rrule.bysetpos,
            byweekday: event.rrule.byweekday,
            count: event.rrule.count,
            bymonth: event.rrule.bymonth,
          };
      
          if (
            rruleObj.freq === 'MONTHLY' &&
            rruleObj.byweekday &&
            event.start &&
            new Date(event.start).getDate() <= 7 &&
            !rruleObj.bysetpos
          ) {
            rruleObj.bysetpos = 1;
          }
      
          if (
            rruleObj.freq === 'YEARLY' &&
            !rruleObj.bymonth &&
            event.start
          ) {
            rruleObj.bymonth = new Date(event.start).getMonth() + 1;
          }
      
          Object.keys(rruleObj).forEach(key => rruleObj[key] === undefined && delete rruleObj[key]);
        }

        const calendarSource = event.extendedProps?.calendarSource;
        if (calendarSource && !calendarSource.isDefault) {
          const sourceName = calendarSource.name || 'default';
          const uniqueNames = Object.keys(colorMapping)
            .concat(sourceName)
            .filter((value, index, self) => self.indexOf(value) === index);
          uniqueNames.sort();
          const colorKeys = Object.keys(colorClassMapping).filter(key => key !== 'default');
          uniqueNames.forEach((name, index) => {
            if (!colorMapping[name]) {
              const colorKey = colorKeys[index % colorKeys.length];
              colorMapping[name] = colorClassMapping[colorKey];
            }
          });
        }

        const statusColorClass = colorClassMapping[event.extendedProps?.status || 'default'];

        const transformedEvent = {
          ...event,
          start: startWithTimezone,
          end: endWithTimezone,
          rrule: rruleObj,
          statusColorClass,
        };

        transformedEvent.backgroundColor = calendarSource && !calendarSource.isDefault
          ? colorMapping[calendarSource.name || 'default']?.fill 
          : (event.extendedProps?.showAs === 'oof' 
            ? 'var(--sc-calendar-event-oof-background-color, var(--sc-color-purple-100))' 
            : 'var(--sc-calendar-event-blue-background-color, var(--sc-color-blue-100))');

        transformedEvent.borderColor = calendarSource && !calendarSource.isDefault
          ? colorMapping[calendarSource.name || 'default']?.fill 
          : (event.extendedProps?.showAs === 'oof' 
            ? 'var(--sc-calendar-event-oof-background-color, var(--sc-color-purple-100))' 
            : 'var(--sc-calendar-event-blue-background-color, var(--sc-color-blue-100))');

        transformedEvent.textColor = 'var(--sc-calendar-event-color, var(--sc-color-blue-900))';

        return transformedEvent;
      }) : [],
      eventContent: createEventContent.bind(this), 
      views: {
        timeGridWeek: {
          slotLabelInterval: '00:30:00', 
          slotDuration: '00:15:00',
          weekends: true,
          dayHeaderContent: args => {
            const today = new Date();
            const isToday = args.date.getDate() === today.getDate() &&
                            args.date.getMonth() === today.getMonth() &&
                            args.date.getFullYear() === today.getFullYear();
            const date = args.date.getDate();
            const day = args.date.toLocaleDateString(this.locale, { weekday: 'short' });
            if (isToday) {
              return {
                html: `
                  <div class="fc-day-today" style="color: var(--sc-calendar-week-header-color, var(--sc-color-blue-460));">
                    ${date} ${day}
                  </div>
                `,
              };
            } else {
              return {
                html: `${date} ${day}`,
              };
            }
          },
        },
        timeGridDay: {
          slotLabelInterval: '00:30:00',
          slotDuration: '00:15:00',
          dayHeaderContent: args => {
            const today = new Date();
            const isToday = args.date.toDateString() === today.toDateString(); 
            const day = args.date.toLocaleDateString(this.locale, {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
            const color = isToday ? 'var(--sc-calendar-today-text-color, var(--sc-color-blue-500))' 
              : 'var(--sc-calendar-not-today-text-color, var(--sc-color-blue-900))'; 
            return {
              html: `<div style="color: ${color};">${day}</div>`,
            };
          },
        },
        ...customViews,
      },
      ...(this.calendarView === 'list' && { dayHeaderContent: getDayHeaderContent.bind(this) }),
      ...(this.calendarView === 'multi-month' && { multiMonthMaxColumns: 1 }),
    };
  }

  getCustomViews(listStartDate: string | null, locale: string, customViewConfig?: any) {
    const startDate = new Date(listStartDate || Date.now());
    const customViews = {
      listSevenDay: {
        type: 'list',
        buttonText: 'list',
        dateIncrement: { days: 7 },
        visibleRange: () => {
          const start = new Date(startDate);
          const end = new Date(start);
          end.setDate(start.getDate() + 7);
          return { start, end };
        },
      },
      workWeek: {
        type: 'timeGridWeek',
        buttonText: 'Work week',
        weekends: false,
        dayHeaderContent: function (this: ScCalendar, args: CALENDAR_DAY_HEADER_CONTENT) {
          const today = new Date();
          const isToday = args.date.getDate() === today.getDate() &&
                          args.date.getMonth() === today.getMonth() &&
                          args.date.getFullYear() === today.getFullYear();
          const date = args.date.getDate();
          const isMobile = this.isMobileSm || this.isMobileLg;
          const dayFormat = isMobile ? 'short' : 'long';
          const day = args.date.toLocaleDateString(this.locale || 'default', { weekday: dayFormat });
          
          if (isToday) {
            return {
              html: `
                <div class="fc-day-today" style="color: var(--sc-calendar-week-header-color, var(--sc-color-blue-460));">
                  ${date} ${day}
                </div>
              `,
            };
          } else {
            return {
              html: `${date} ${day}`,
            };
          }
        }.bind(this),
      },
      customView: {
        type: 'timeGrid',
        buttonText: 'Custom View',
        duration: { days: 1 },
        dateIncrement: { days: 1 },
        visibleRange: () => {
          const start = new Date(startDate);
          const end = new Date(start);
          end.setDate(start.getDate() + 1);
          return { start, end };
        },
      },
    };

    if (customViewConfig) {
      customViews.customView = customViewConfig;
    }

    return customViews;
  }

  handleDateSelect(event: any, opts?: { fromPopup?: boolean }) {
      const { startAsDate, endAsDate, type } = event.detail;

      if (type === 'mouseup') {
        if (startAsDate && endAsDate) {
          this.startDate = startAsDate;
          this.endDate = endAsDate;

          if (this.startDate!.getTime() > this.endDate!.getTime()) {
            [this.startDate, this.endDate] = [this.endDate, this.startDate];
          }
        }
      }

      if (this.startDate && this.endDate) {
        if (this.startDate.getTime() === this.endDate.getTime()) {
          const calendarApi = this.getCalendarApi();
          const view = this.currentView;
          if (view === 'workWeek' || view === 'default') {
            navigateToWorkWeek({
              date: this.startDate,
              calendarApi,
              _calendar: this._calendar,
              shadowRoot: this.shadowRoot,
            });
          } else if (view === 'timeGridDay' || view === 'dayGridMonth') {
            navigateToDay({
              date: this.startDate,
              calendarApi,
              _calendar: this._calendar,
              shadowRoot: this.shadowRoot,
              locale: this.locale,
            });
          } else if (view === 'timeGridWeek') {
            navigateToWeek({
              date: this.startDate,
              calendarApi,
              _calendar: this._calendar,
              shadowRoot: this.shadowRoot,
            });
          } else {
            const selectedView = this.currentView;
            if (selectedView === 'workWeek') {
              if (this.options && this.options.views && this.options.views['workWeek']) {
                navigateToWorkWeek({
                  date: this.startDate,
                  calendarApi,
                  _calendar: this._calendar,
                  shadowRoot: this.shadowRoot,
                });
              } else {
                navigateToWeek({
                  date: this.startDate,
                  calendarApi,
                  _calendar: this._calendar,
                  shadowRoot: this.shadowRoot,
                });
              }
            } else if (selectedView === 'timeGridWeek') {
              navigateToWeek({
                date: this.startDate,
                calendarApi,
                _calendar: this._calendar,
                shadowRoot: this.shadowRoot,
              });
            } else if (selectedView === 'timeGridDay') {
              navigateToDay({
                date: this.startDate,
                calendarApi,
                _calendar: this._calendar,
                shadowRoot: this.shadowRoot,
                locale: this.locale,
              });
            } else if (selectedView === 'dayGridMonth') {
              navigateToWeek({
                date: this.startDate,
                calendarApi,
                _calendar: this._calendar,
                shadowRoot: this.shadowRoot,
              });
            } else {
              if (this.options && this.options.views && this.options.views['workWeek']) {
                navigateToWorkWeek({
                  date: this.startDate,
                  calendarApi,
                  _calendar: this._calendar,
                  shadowRoot: this.shadowRoot,
                });
              } else {
                navigateToWeek({
                  date: this.startDate,
                  calendarApi,
                  _calendar: this._calendar,
                  shadowRoot: this.shadowRoot,
                });
              }
            }
          }
        } else {
          this.createCustomView(this.startDate, this.endDate, true);
        }
      }

      this.startDate = null;
      this.endDate = null;
    }

  private handleListNavigationContextMenu(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this._contextMenuX = event.pageX;
    this._contextMenuY = event.pageY;
    this._contextMenuOpen = true;

    this.requestUpdate();
  }

  private handleContextMenuClose() {
    this._contextMenuOpen = false;
  }

  private renderCalendarItemPrefix(
    fillColor: string, 
    strokeColor: string, 
    calendarKey: string, 
    isChecked: boolean
  ) {
    return html`
      <div style="display: flex; gap: 0.5rem;">        
        <sc-checkbox 
          ?checked=${isChecked} 
          data-key=${calendarKey}
        ></sc-checkbox>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="none"
          style="flex-shrink: 0;"
        >
          <circle 
            cx="8" 
            cy="8" 
            r="7.5" 
            fill="${fillColor}" 
            stroke="${strokeColor}">
          </circle>
        </svg>
      </div>
    `;
  }

  private handleContextMenuSelect(event: CustomEvent) {
    const menuItem = event.detail.item;
    const action = menuItem?.value;
    
    if (!action) {
      this.handleContextMenuClose();
      return;
    }

    const metadata = this._selectedCalendarKey 
      ? this._calendarMetadataMap.get(this._selectedCalendarKey) 
      : undefined;

    if (action === 'properties') {
      this.handleClick('calendar-properties', { calendarKey: this._selectedCalendarKey, metadata });
    } else if (action === 'share') {
      this.handleClick('share', { calendarKey: this._selectedCalendarKey, metadata });
    }

    this.handleContextMenuClose();
  }

  handleCalendarSelect(event: any) {
    const selectedId = event.detail.selectedKeys[0];
    const existingIndex = this._selectedCalendars.findIndex(
      c => (typeof c === 'string' ? c : c.id) === selectedId
    );
    if (existingIndex !== -1) {
      this._selectedCalendars = [
        ...this._selectedCalendars.slice(0, existingIndex),
        ...this._selectedCalendars.slice(existingIndex + 1),
      ];
    } else {
      const calendar = this._availableCalendars.find(
        cal => (typeof cal === 'string' ? cal : cal.id) === selectedId
      );
      if (calendar !== undefined) {
        this._selectedCalendars = [...this._selectedCalendars, calendar];
      }
    }
    
    const selected = this._selectedCalendars.find(
      c => (typeof c === 'string' ? c : c.id) === selectedId
    ) ?? this._availableCalendars.find(
      cal => (typeof cal === 'string' ? cal : cal.id) === selectedId
    );

    this.emit('sc-select', {
      detail: {
        selected,
        value: this._selectedCalendars,
      },
    });
  
    this.updateCalendarListSuffixes();
  }

  private updateCalendarListSuffixes() {
    const selectedIds = new Set(this._selectedCalendars.map(c => typeof c === 'string' ? c : c.id));
    this.calendarList = updateCalendarListSuffixes(
      this.calendarList,
      selectedIds,
      this._calendarMetadataMap,
      colorMapping,
      this.renderCalendarItemPrefix.bind(this),
      this.renderCalendarItemSuffix.bind(this)
    );
  }

  private renderCalendarItemSuffix(calendarKey: string) {
    return html`
      <div class="sc-calendar-suffix-wrapper" slot="suffix">
        <sc-icon 
          name="more-horizontal" 
          size="sm" 
          class="sc-calendar-item-more-icon"
          data-key="${calendarKey}"
          @click=${(e: MouseEvent) => this.handleSuffixIconClick(e, calendarKey)}
          style="
            cursor: pointer; 
            opacity: 0; 
            transition: opacity 0.2s ease-in-out; 
            pointer-events: none; 
            margin: 0 0.5rem;"
        ></sc-icon>
      </div>
    `;
  }

  private handleSuffixIconClick(event: MouseEvent, calendarKey: string) {
    event.preventDefault();
    event.stopPropagation();

    this._contextMenuX = event.pageX;
    this._contextMenuY = event.pageY;
    this._contextMenuOpen = true;
    this._selectedCalendarKey = calendarKey;
  }

  private async setupCalendarListHoverListeners() {
    await this.updateComplete;

    const listNavigation = this.shadowRoot?.querySelector('sc-list-navigation');
    if (!listNavigation) return;

    await (listNavigation as any).updateComplete;

    if (!listNavigation.shadowRoot) return;

    const childItems = listNavigation.shadowRoot.querySelectorAll('sc-list-navigation-item');
    if (!childItems || childItems.length === 0) return;

    await Promise.all(
      Array.from(childItems).map(item => (item as any).updateComplete)
    );

    childItems.forEach(item => {
      if (!item.shadowRoot) return;

      const suffixSlot = item.shadowRoot.querySelector('slot[name="suffix"]');
      if (!suffixSlot) return;

      const assignedElements = (suffixSlot as HTMLSlotElement).assignedElements();
      const wrapper = assignedElements[0] as HTMLElement;
      if (!wrapper) return;

      const icon = wrapper.querySelector('sc-icon') as HTMLElement;
      if (!icon) return;

      item.addEventListener('mouseenter', () => {
        icon.style.opacity = '1';
        icon.style.pointerEvents = 'auto';
      });

      item.addEventListener('mouseleave', () => {
        icon.style.opacity = '0';
        icon.style.pointerEvents = 'none';
      });
    });
  }

  handleDropdownSelect(event: any) {
    const selectedValue = event.detail.value;
        const [eventType, calendarKey] = selectedValue.includes(':') 
      ? selectedValue.split(':') 
      : [selectedValue, null];
    
    // Only handle known event types
    if (eventType !== 'appointment' && eventType !== 'meeting') {
      return;
    }
    
    const calendarMetadata = calendarKey ? this._calendarMetadataMap.get(calendarKey) : null;
    const targetCalendar = calendarMetadata || this.getEditableCalendars()[0]?.metadata;
    const eventTypeLabel = eventType === 'appointment' ? 'New appointment' : 'New meeting';
    
    this.handleClick(eventTypeLabel, {
      eventType,
      calendar: targetCalendar ? {
        key: calendarKey,
        id: targetCalendar.id,
        name: targetCalendar.name,
        canEdit: targetCalendar.canEdit,
        isDefault: targetCalendar.isDefaultCalendar,
        color: targetCalendar.color,
        hexColor: targetCalendar.hexColor,
      } : null,
    });
  }

  handleClick(type: string, payload?: any) {
    this.emit('sc-action', {
      detail: {
        type,
        info: payload,
      },
    });
  }
  
  getInitialView() {
    switch (this.calendarView) {
    case 'continuous':
      return 'dayGridYear';
    case 'multi-month':
      return 'multiMonthYear';
    case 'list':
      return 'listSevenDay';
    default:
      return 'workWeek';
    }
  }
    
  emit<T extends string & keyof CUSTOM_EVENTS_TYPE>(name: T, options?: ScEventInit<T> | undefined): void {
    const event = new CustomEvent(name, {
      bubbles: false,
      cancelable: false,
      composed: false,
      detail: {},
      ...options,
    });

    this.dispatchEvent(event);
    return event as any;
  }

  render() {  
    return html`      
      <sc-column-layout
        class="sc-calendar"
        layout="Main Content Right"
        height="cover"
        left-column-collapsible
        unfloatable
        hide-zoom
        left-divider-invisible
      >
        <div slot="left-header" class="sc-calendar-header">
          <sc-title level="5" rows="1">${this.dateHeader}</sc-title>
        </div>
        <div slot="left" class="sc-calendar-left">
          ${this.calendarView === 'default' ? html`
          
            <sc-date-picker 
              drag-to-select
              class="sc-calendar-date-picker"
              first-day-of-week="1"
              @sc-select-items=${this.handleDateSelect}
            >
            </sc-date-picker>
            <div 
              class="sc-calendar-list-navigation"
              @contextmenu=${this.handleListNavigationContextMenu}
            >
              <sc-list-navigation 
                .items=${this.calendarList}
                no-border
                @sc-select=${this.handleCalendarSelect}
              >
              </sc-list-navigation>
              
              ${this._contextMenuOpen ? html`
                <div
                  class="sc-calendar-context-menu"
                  style="
                    position: fixed; 
                    left: ${this._contextMenuX}px; 
                    top: ${this._contextMenuY}px;
                    z-index: 9999;
                  "
                  @click=${(e: Event) => e.stopPropagation()}
                >
                  <sc-menu @sc-select=${this.handleContextMenuSelect}>
                    <sc-menu-item 
                      class="sc-calendar-context-menu-item"
                      value="properties"
                    >
                      ${msg('Calendar properties', { id: 'sc-calendar-properties' })}
                    </sc-menu-item>
                    <sc-menu-item 
                      class="sc-calendar-context-menu-item"
                      value="share"
                    >
                      ${msg('Sharing permissions', { id: 'sc-calendar-sharing-permissions' })}
                    </sc-menu-item>
                  </sc-menu>
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>
        <div slot="right" class="sc-calendar-right">
          ${this.calendarView === 'default' ? html`
            <sc-action-bar
              class="sc-calendar-action-bar"
              hide-right-helper
              hide-shadow
              no-sticky
              hide-back
            >
              <div slot="left-actions" class="sc-calendar-action-bar-left">
                <div class="sc-calendar-action-bar-left">
                  ${this.renderDefaultActionBarLeftBack()}
                </div>
                ${!this.isDesktop ? html`
                  <div class="sc-calendar-action-bar-left-actions">
                    ${this.renderDefaultActionBarLeftActions()}
                  </div>
                ` : ''}
              </div>
              <div slot="right-groups">
                <slot name="sc-calendar-action-bar-right">
                  ${this.renderDefaultActionBarRightButtons()}
                </slot>
              </div>
            </sc-action-bar>
          ` : ''}
          ${this.loading ? html`
          <div class="sc-calendar-spinner">
            <sc-spinner type="component" size="md" color="blue"></sc-spinner>
            <div class="sc-calendar-spinner-text">${msg('Loading your events...', { id: 'sc-calendar-loading-events' })}</div>
          </div>` : ''}
          <div ${ref(this._calendarRef)}></div>
        </div>
      </sc-column-layout>
    `;
  }
}

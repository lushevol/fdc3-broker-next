import { html, nothing, PropertyValues, type TemplateResult } from 'lit';
import { property, queryAsync, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { confirmKeySet, MAX_DATE, MIN_DATE, labelSelectedDate, 
  labelToday, navigationKeySetGrid } from '../constants.js';
import { focusElement } from '../helpers/focus-element.js';
import { isInCurrentMonth } from '../helpers/is-in-current-month.js';
import { toClosestTarget } from '../helpers/to-closest-target.js';
import { toDateString } from '../helpers/to-date-string.js';
import { toNextSelectedDate } from '../helpers/to-next-selected-date.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { keyHome } from '../key-values.js';
import { RootElement } from '../root-element/root-element.js';
import { baseStyling, resetShadowRoot } from '../ScDatePicker.style.js';
import type { Formatters, InferredFromSet, SupportedKey } from '../typings.js';
import { monthCalendarStyling } from './ScMonthCalendar.style.js';
import type { MonthCalendarData, MonthCalendarProperties, MonthCalendarRenderCalendarDayInit } from './typings.js';
import ScTheme from '../../../styles/ScTheme.js';

export class ScMonthCalendar extends RootElement implements MonthCalendarProperties {
  public static shadowRootOptions = {
    ...RootElement.shadowRootOptions,
    delegatesFocus: true,
  };
  public static styles = ScTheme.getStyles().concat([
    baseStyling,
    resetShadowRoot,
    monthCalendarStyling,
  ]);

  @state() _selectedDate: Date | undefined = undefined;

  @state() clickType = '';
  /**
   * NOTE(motss): This is required to avoid selected date being focused on each update.
   * Selected date should ONLY be focused during navigation with keyboard, e.g.
   * initial render, switching between views, etc.
   */
  _shouldFocusSelectedDate = false;

  
  @property({ type: Object, attribute: true }) public data?: MonthCalendarData;

  @property({ type: Boolean }) public range = false;

  @property({ type: String }) positionType = '';

  @queryAsync('.calendar-day[aria-selected="true"]') public selectedCalendarDay!: Promise<HTMLTableCellElement | null>;

  @state() private _startDate: Date | null = null;

  @state() private _endDate: Date | null = null;

  @state() private isDragging = false;

  @property({ type: Boolean, attribute: 'drag-to-select' }) dragToSelect = false;

  @property({ type: Number, attribute: 'max-selected-days' }) maxSelectedDays = 14;

  private _isDragging = false;

  public constructor() {
    super();

    const todayDate = toResolvedDate();

    if (!this.data) {
      this.data = {
        calendar: [],
        currentDate: todayDate,
        date: todayDate,
        disabledDatesSet: new Set(),
        disabledDaysSet: new Set(),
        formatters: undefined,
        max: todayDate,
        min: todayDate,
        selectedDateLabel: labelSelectedDate,
        showCaption: false,
        showWeekNumber: false,
        todayDate,
        todayLabel: labelToday,
        weekdays: [],
      };
    }
  }

  updateSelectedDate = (event: KeyboardEvent): void => {
    const key = event.key as SupportedKey;
    const type = event.type as 'click' | 'keydown' | 'keyup';

    if (type === 'keydown') {
      /**
       * NOTE: `@material/mwc-dialog` captures Enter keyboard event then closes the dialog.
       * This is not what `month-calendar` expects so here stops all event propagation immediately for
       * all key events.
       */
      event.stopImmediatePropagation();

      const isConfirmKey = confirmKeySet.has(key as InferredFromSet<typeof confirmKeySet>);

      if (
        !navigationKeySetGrid.has(key as InferredFromSet<typeof navigationKeySetGrid>) &&
        !isConfirmKey
      ) return;

      // Prevent scrolling with arrow keys or Space key
      event.preventDefault();

      // Bail out for Enter/ Space key as they should go to keyup handler.
      if (isConfirmKey) return;

      const {
        currentDate,
        date,
        disabledDatesSet,
        disabledDaysSet,
        max,
        min,
      } = this.data as MonthCalendarData;

      this._selectedDate = toNextSelectedDate({
        currentDate,
        date,
        disabledDatesSet,
        disabledDaysSet,
        hasAltKey: event.altKey,
        key,
        maxTime: +max,
        minTime: +min,
      });
      this._shouldFocusSelectedDate = true;
    } else if (
      type === 'click' ||
      (
        type === 'keyup' &&
        confirmKeySet.has(key as InferredFromSet<typeof confirmKeySet>)
      )
    ) {
      const selectedCalendarDay =
        toClosestTarget<HTMLTableCellElement>(event, '.calendar-day');

      /** NOTE: Required condition check else these will trigger unwanted re-rendering */
      if (
        // eslint-disable-next-line
        selectedCalendarDay == null ||
        [
          'aria-disabled',
          'aria-hidden',
        ].some(
          attrName =>
            selectedCalendarDay.getAttribute(attrName) === 'true'
        )
      ) {
        return;
      }
      this._selectedDate = selectedCalendarDay.fullDate;
      this.clickType = this.positionType;      
    }

    const selectedDate = this._selectedDate;
    // eslint-disable-next-line
    if (selectedDate == null) return;

    const isKeypress = Boolean(key);
    const newSelectedDate = new Date(selectedDate);

    this.emit('sc-select', {
      detail: {
        isKeypress,
        value: toDateString(newSelectedDate),
        valueAsDate: newSelectedDate,
        valueAsNumber: +newSelectedDate,
        clickType: this.clickType,
        ...(isKeypress && { key }),
      },
    });

    /**
     * Reset `_selectedDate` after click or keyup event
     */
    // this._selectedDate = undefined;
  };

  handleMouseDown = (event: MouseEvent): void => {
    event.stopImmediatePropagation();
    event.preventDefault();
    const selectedCalendarDay = toClosestTarget<HTMLTableCellElement>(event, '.calendar-day');
    if (
      !selectedCalendarDay ||
      ['aria-disabled', 'aria-hidden'].some(attrName => selectedCalendarDay.getAttribute(attrName) === 'true')
    ) {
      return;
    }

    if (this._startDate) {
      this.updateAriaGrabbed(this._startDate, false);
    }

    this._startDate = new Date(selectedCalendarDay.fullDate);
    if (this._startDate) {
      this.updateAriaGrabbed(this._startDate, true);
    }
    this.emit('sc-select-items', {
      detail: {
        isMouseEvent: true,
        value: toDateString(this._startDate),
        valueAsDate: this._startDate,
        valueAsNumber: +this._startDate,
        type: event.type,
      },
    });
    this._shouldFocusSelectedDate = true;
    this._isDragging = true;
  };
  
  handleMouseEnter = (event: MouseEvent): void => {
    if (this._isDragging) {
      const selectedCalendarDay = toClosestTarget<HTMLTableCellElement>(event, '.calendar-day');
      if (
        !selectedCalendarDay ||
        ['aria-disabled', 'aria-hidden'].some(attrName => selectedCalendarDay.getAttribute(attrName) === 'true')
      ) {
        return;
      }
      this._endDate = new Date(selectedCalendarDay.fullDate);
      if (this._startDate && this._endDate) {
        let dragStart = this._startDate;
        let dragEnd = this._endDate;
        if (dragStart > dragEnd) {
          [dragStart, dragEnd] = [dragEnd, dragStart];
        }
        let actualEndDate = dragEnd;
        const diffDays = Math.abs((dragEnd.getTime() - dragStart.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > this.maxSelectedDays) {
          actualEndDate = new Date(dragStart.getTime() + (this.maxSelectedDays * 24 * 60 * 60 * 1000));
        }
        this.updateAriaGrabbedRange(dragStart, actualEndDate, true);
      }
    } 
  };
  
  handleMouseUp = (event: MouseEvent): void => {
    this._isDragging = false;
    const selectedCalendarDay = toClosestTarget<HTMLTableCellElement>(event, '.calendar-day');
    if (
      !selectedCalendarDay ||
      ['aria-disabled', 'aria-hidden'].some(attrName => selectedCalendarDay.getAttribute(attrName) === 'true')
    ) {
      return;
    }

    this._endDate = new Date(selectedCalendarDay.fullDate);

    if (this._startDate && this._endDate) {
      let dragStart = this._startDate;
      let dragEnd = this._endDate;
      if (dragStart > dragEnd) {
        [dragStart, dragEnd] = [dragEnd, dragStart];
      }
      let actualEndDate = dragEnd;
      const diffDays = Math.abs((dragEnd.getTime() - dragStart.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > this.maxSelectedDays) {
        actualEndDate = new Date(dragStart.getTime() + (this.maxSelectedDays * 24 * 60 * 60 * 1000));
      }
      this.updateAriaGrabbedRange(dragStart, actualEndDate, true);
      this.emit('sc-select-items', {
        detail: {
          isMouseEvent: true,
          start: toDateString(dragStart),
          startAsDate: dragStart,
          startAsNumber: +dragStart,
          end: toDateString(actualEndDate),
          endAsDate: actualEndDate,
          endAsNumber: +actualEndDate,
          type: event.type,
        },
      });
    }

    this._startDate = null;
    this._endDate = null;
  };

  private updateAriaGrabbed(date: Date, isGrabbed: boolean): void {
    const calendarDays = this.shadowRoot?.querySelectorAll('.calendar-day');
    calendarDays?.forEach(day => {
      const fullDate = (day as any).fullDate;
      if (fullDate && new Date(fullDate).getTime() === date.getTime()) {
        day.setAttribute('aria-grabbed', isGrabbed ? 'true' : 'false');
        if (isGrabbed && !day.classList.contains('day--today')) {
          day.classList.add('grabbed-start', 'grabbed-end');
        } else {
          day.classList.remove('grabbed-start', 'grabbed-end');
        }
      }
    });
  }

  private updateAriaGrabbedRange(startDate: Date | null, endDate: Date | null, isGrabbed: boolean): void {
    if (!startDate || !endDate) return;

    let actualEndDate = endDate;
    const diffDays = Math.abs((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > this.maxSelectedDays) {
      if (endDate > startDate) {
        actualEndDate = new Date(startDate.getTime() + (this.maxSelectedDays * 24 * 60 * 60 * 1000));
      } else {
        actualEndDate = new Date(startDate.getTime() - (this.maxSelectedDays * 24 * 60 * 60 * 1000));
      }
    }

    const calendarDays = this.shadowRoot?.querySelectorAll('.calendar-day');

    let firstGrabbed: HTMLElement | null = null;
    let lastGrabbed: HTMLElement | null = null;

    calendarDays?.forEach(day => {
      if (!(day instanceof HTMLElement)) {
        return;
      }

      const fullDate = (day as any).fullDate;

      if (fullDate) {
        const date = new Date(fullDate);

        if ((startDate <= actualEndDate ? (date >= startDate && date <= actualEndDate) : (date <= startDate && date >= actualEndDate)) && !day.classList.contains('day--today')) {
          day.setAttribute('aria-grabbed', isGrabbed ? 'true' : 'false');
          if (!firstGrabbed) {
            firstGrabbed = day;
          }
          lastGrabbed = day;
        } else {
          day.setAttribute('aria-grabbed', 'false');
        }
        day.classList.remove('grabbed-start', 'grabbed-end');
      }
    });

    if (firstGrabbed) {
      (firstGrabbed as HTMLElement).classList.add('grabbed-start');
    }
    if (lastGrabbed) {
      (lastGrabbed as HTMLElement).classList.add('grabbed-end');
    }
  }

  protected $renderCalendarDay({
    ariaDisabled,
    ariaLabel,
    ariaSelected,
    className,
    day,
    fullDate,
    part,
    tabIndex,
    title,
  }: MonthCalendarRenderCalendarDayInit): TemplateResult {
    return html`
    <td
      .fullDate=${fullDate}
      aria-disabled=${ariaDisabled as 'false' | 'true'}
      aria-label=${ariaLabel as string}
      aria-selected=${this.dragToSelect ? 'false' : (ariaSelected as 'false' | 'true')}
      aria-grabbed=${this.dragToSelect && this.isDragging ? 'true' : 'false'}
      class="calendar-day ${className}"
      data-day=${day}
      part=${part}
      role=gridcell
      tabindex=${tabIndex}
      title=${ifDefined(title)}
      @mousedown=${this.dragToSelect ? this.handleMouseDown : null}
      @mouseup=${this.dragToSelect ? this.handleMouseUp : null}
      @mouseenter=${this.dragToSelect ? this.handleMouseEnter : null}
    >
    </td>
    `;
  }

  isTodayOrNextMonthTodayState(todayDate:number,curTime:number) {
    const _todayDate = new Date(todayDate);
    const _todayYear = _todayDate.getFullYear();
    const _todayMonth = _todayDate.getMonth();
    const _todayDay = _todayDate.getDate();
    const _curDate = new Date(curTime);
    const _curYear = _curDate.getFullYear();
    const _curMonth = _curDate.getMonth();
    const _curDay = _curDate.getDate();

    return _todayDay === _curDay && _todayYear === _curYear && _todayMonth === _curMonth;
  }

  renderMobileStyle() {
    if (this.isMobile) {
      return html`
        <style>
          table,
          thead,
          tbody,
          tr,
          th,
          td {
            display: var(--sc-date-table-display, initial);
            flex: 1;
          }

          tr {
            display: var(--sc-date-table-tr-display, initial);;
          }
        </style>
      `;
    }
    return nothing;
  }

  protected override render(): TemplateResult | typeof nothing {
    const {
      calendar,
      currentDate,
      date,
      disabledDatesSet,
      disabledDaysSet,
      formatters,
      max,
      min,
      selectedDateLabel,
      showCaption = false,
      showWeekNumber = false,
      todayDate,
      todayLabel,
      weekdays,
    } = this.data as MonthCalendarData;

    const { _selectedDate, range, positionType } = this;
    let calendarContent: TemplateResult | typeof nothing = nothing;
    if (calendar.length) {
      const { id } = this;

      const { monthYearFormat } = formatters as Formatters;
      const calendarCaptionId = `calendar-caption-${id}`;
      const [, [, secondMonthSecondCalendarDay]] = calendar;
      const secondMonthSecondCalendarDayFullDate = secondMonthSecondCalendarDay.fullDate;
      /**
       * NOTE(motss): Tabbable date is the date to be tabbed when switching between months.
       * When there is a selected date in the current month, tab to focus on selected date.
       * Otherwise, set the first day of month tabbable so that tapping on Tab focuses that.
       */
      const tabbableDate = !date ? currentDate : isInCurrentMonth(date, currentDate) ?
        date :
        toNextSelectedDate({
          currentDate,
          date,
          disabledDatesSet,
          disabledDaysSet,
          hasAltKey: false,
          key: keyHome,
          maxTime: +max,
          minTime: +min,
        });

      calendarContent = html`
      ${this.renderMobileStyle()}
      <table
        @keydown=${this.updateSelectedDate}
        @click=${this.updateSelectedDate}
        @keyup=${this.updateSelectedDate}
        aria-labelledby=${
  ifDefined(showCaption && secondMonthSecondCalendarDayFullDate ? calendarCaptionId : undefined)
}
        class=calendar-table
        part=table
        role=grid
        tabindex=-1
      >
        ${
  showCaption && secondMonthSecondCalendarDayFullDate ? html`
          <caption id=${calendarCaptionId}>
            <div class=calendar-caption part=caption>${
  monthYearFormat(secondMonthSecondCalendarDayFullDate)
}</div>
          </caption>
          ` : nothing
}

        <thead>
          <tr class=weekdays part=weekdays role=row>${
  weekdays.map(
    ({ label }, idx) =>
      html`
                <th
                  aria-label=${label}
                  class=${`weekday${showWeekNumber && idx < 1 ? ' week-number' : ''}`}
                  part=weekday
                  role=columnheader
                  title=${label}
                >
                  <div class=weekday-value part=weekday-value>${label.substring(0, 2)}</div>
                </th>`
  )
}</tr>
        </thead>

        <tbody>${
  calendar.map(calendarRow => {
    return html`
            <tr role=row>${
  calendarRow.map((calendarCol, i) => {
    const { disabled, fullDate, label, value } = calendarCol;

    /** Week label, if any */
    if (!fullDate && value && showWeekNumber && i < 1) {
      return html`<th
                    abbr=${label}
                    aria-label=${label}
                    class="calendar-day week-number"
                    part=week-number
                    role=rowheader
                    scope=row
                    title=${label}
                  >${value}</th>`;
    }

    /** Empty day */
    if (!value || !fullDate) {
      return html`<td class="calendar-day day--empty" aria-hidden="true" part=calendar-day></td>`;
    }
    const curTime = +new Date(fullDate);
    const shouldTab = tabbableDate.getDate() === Number(value);
    const _realSelectedDate = new Date(_selectedDate || date);
    const _selectedYear = _realSelectedDate.getFullYear();
    const _selectedMonth = _realSelectedDate.getMonth();
    const _selectedDay = _realSelectedDate.getDate();
    const _curDate = new Date(curTime);
    const _curYear = _curDate.getFullYear();
    const _curMonth = _curDate.getMonth();
    const _curDay = _curDate.getDate();

    const isSelected = _selectedYear === _curYear && _selectedMonth === _curMonth && _selectedDay === _curDay;
    
    const isToday = this.isTodayOrNextMonthTodayState(+todayDate,curTime);
    let isBetweenRange = false;
    const selectedDate = this._selectedDate || date;
    if (+max !== +MAX_DATE && +selectedDate) {
      isBetweenRange = curTime >= +selectedDate && curTime <= +max;
    }
    if (+min !== +MIN_DATE && +selectedDate && this.positionType !== 'start') {
      isBetweenRange = curTime >= +min && curTime <= +selectedDate;
    }

    const className = `${isBetweenRange && range ? 'is-between' : ''} ${isToday ? 'day--today' : ''}`;
    const title = isSelected ?
      selectedDateLabel :
      isToday ?
        todayLabel :
        undefined;

    return this.$renderCalendarDay({
      ariaDisabled: String(disabled),
      ariaLabel: label,
      ariaSelected: String(isSelected),
      className,
      day: value,
      fullDate,
      part: `calendar-day${isToday ? ' today' : ''}`,
      tabIndex: shouldTab ? 0 : -1,
      title,
    } as MonthCalendarRenderCalendarDayInit);
  })
}</tr>`;
  })
}</tbody>
      </table>
      `;
    }

    return html`<div class=month-calendar part=calendar>${calendarContent}</div>`;
  }

  protected override shouldUpdate(): boolean {
    // eslint-disable-next-line
    return this.data != null && this.data.formatters != null;
  }

  protected override async updated(): Promise<void> {
    if (this._shouldFocusSelectedDate) {
      await focusElement(this.selectedCalendarDay);
      this._shouldFocusSelectedDate = false;
    }
  }
}

declare global {
  // #region HTML element type extensions
  // interface HTMLButtonElement {
  //   year: number;
  // }

  // interface HTMLElement {
  //   part: HTMLElementPart;
  // }

  interface HTMLTableCellElement {
    day: string;
    fullDate: Date;
  }
  // #endregion HTML element type extensions

}

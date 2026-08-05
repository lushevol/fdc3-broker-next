import { html, nothing, type TemplateResult } from 'lit';
import { state, property, queryAsync } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { calendar } from '../helpers/calendar.js';
import { getWeekdays } from '../helpers/get-weekdays.js';
import { toUTCDate } from '../helpers/to-utc-date.js';

import { DateTimeFormat, MAX_DATE, MIN_DATE, startViews, maxMonthDays } from '../constants.js';
import { isInCurrentMonth } from '../helpers/is-in-current-month.js';
import { dateValidator } from '../helpers/date-validator.js';
import { generatePage, generateRange } from '../helpers/generate-page.js';
import { focusElement } from '../helpers/focus-element.js';
import { clampValue } from '../helpers/clamp-value.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { toDateString } from '../helpers/to-date-string.js';
import { toFormatters } from '../helpers/to-formatters.js';
import type { MaybeDate } from '../helpers/typings.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import type { ScMonthCalendar } from '../MonthCalendar/ScMonthCalendar.js';
import { RootElement } from '../root-element/root-element.js';
import { baseStyling, resetShadowRoot, webkitScrollbarStyling } from '../ScDatePicker.style.js';
import type { ScYearGrid } from '../YearGrid/ScYearGrid.js';
import type { ScMonthGrid } from '../MonthGrid/ScMonthGrid.js';
import { datePickerStyling } from './ScDatePicker.style.js';
import type { CustomEventDetail, ValueUpdatedEvent, Formatters, StartView, DatePickerProperties } from '../typings.js';
import type { DatePickerChangedProperties } from './typings.js';
import { MAX_ITEM } from '../YearGrid/constants.js';
import ScTheme from '../../../styles/ScTheme.js';
import type { ScIcon } from '../../ScIcon/ScIcon.js';
import dayjs from 'dayjs/esm/index.js';
import { getDate } from '../helpers/get-date.js';
import '../../../../elements/sc-icon.js';
import '../../../../elements/sc-button.js';

const yearOnlyRegex = /^([+-]?\d+)$/;

const toYearDate = (value: unknown): Date | unknown => {
  if (typeof value !== 'string') return value;

  const trimmed = value.trim();
  const yearMatch = trimmed.match(yearOnlyRegex);
  if (!yearMatch) return value;

  return toUTCDate(Number(yearMatch[1]), 0, 1);
};

const toMonthYearLabel = (date: Date, shortMonthYearFormat: (date: Date) => string): string => {
  const year = date.getFullYear();
  if (year <= 0) {
    return `${dayjs(date).format('MMM')} ${String(year)}`;
  }
  return shortMonthYearFormat(date);
};

const toYearLabel = (date: Date, yearFormat: (date: Date) => string): string => {
  const year = date.getFullYear();
  if (year <= 0) return String(year);
  return yearFormat(date);
};

export class ScDatePicker extends DatePickerMixin(DatePickerMinMaxMixin(RootElement)) implements DatePickerProperties {
  public static styles = ScTheme.getStyles().concat([
    baseStyling,
    resetShadowRoot,
    datePickerStyling,
    webkitScrollbarStyling,
  ]);

  _focusNavButtonWithKey = false;

  _useBoundaryDefaultAnchor = false;

  _formatters: Formatters;

  _valueAsDate: Date;

  today: Date;

  @state() private _currentDate: Date;

  @state() private _max: Date;

  @state() private _min: Date;

  @state() private _selectedDate: Date;

  @state() private _selectedYearPage = 0;

  @state() clickType = '';

  private readonly timeRegex = /(?<=\s)\d{2}:\d{2}(?::\d{2})?(?:\s?(?:A|P)M)?$/i;

  @queryAsync('sc-month-calendar') private readonly _monthCalendar!: Promise<ScMonthCalendar | null>;

  @queryAsync('[data-navigation="next"]') private readonly _navigationNext!: Promise<HTMLButtonElement | null>;

  @queryAsync('[data-navigation="previous"]') private readonly _navigationPrevious!: Promise<HTMLButtonElement | null>;

  @queryAsync('.year-dropdown') private readonly _yearDropdown!: Promise<ScIcon | null>;

  @queryAsync('sc-month-grid') private readonly _monthGrid!: Promise<ScMonthGrid | null>;

  @queryAsync('sc-year-grid') private readonly _yearGrid!: Promise<ScYearGrid | null>;

  @property({ attribute: false, type: Boolean }) withoutBorder = false;

  @property({ attribute: false, type: Boolean }) range = false;

  @property() dataId = '';
  
  @property({ attribute: 'range-days', type: Number }) rangeDays = 0;


  @property({ type: Boolean, attribute: 'drag-to-select' }) dragToSelect = false;

  get _shownView() {
    return this.picker === 'month' ? 'monthGrid' : this.picker === 'year' ? 'yearGrid' : 'calendar';
  }

  private syncSelectedYearPage(currentYear = this._currentDate.getUTCFullYear()): void {
    const minYear = this._min?.getUTCFullYear?.() ?? MIN_DATE.getUTCFullYear();
    const maxYear = this._max?.getUTCFullYear?.() ?? MAX_DATE.getUTCFullYear();
    this._selectedYearPage = generatePage(
      minYear,
      maxYear,
      currentYear,
      MAX_ITEM
    );
  }

  private get _effectiveYearBounds(): { minYear: number; maxYear: number } {
    const fallbackMinYear = MIN_DATE.getUTCFullYear();
    const fallbackMaxYear = MAX_DATE.getUTCFullYear();
    const parsedMinYear = Number(this.minYear);
    const parsedMaxYear = Number(this.maxYear);
    const hasMinYear = Number.isFinite(parsedMinYear);
    const hasMaxYear = Number.isFinite(parsedMaxYear);
    const minYear = hasMinYear ? parsedMinYear : fallbackMinYear;
    const maxYear = hasMaxYear ? parsedMaxYear : fallbackMaxYear;

    if (minYear > maxYear) {
      return { minYear: maxYear, maxYear: minYear };
    }
    return { minYear, maxYear };
  }

  constructor() {
    super();
    const todayDate = toResolvedDate();
    this._min = getDate(MIN_DATE);
    this._max = getDate(MAX_DATE);
    this.today = todayDate;
    this._currentDate = getDate(todayDate);
    this._formatters = toFormatters(this.locale);
    const monthStep = Math.ceil(this.rangeDays / maxMonthDays);
    this._currentDate.setUTCMonth(this._currentDate.getMonth() + monthStep);
    this.syncSelectedYearPage(this._currentDate.getUTCFullYear());
  }

  async navigateToNextPage() {
    if (this._useBoundaryDefaultAnchor) {
      return;
    }

    const allSelectedDaysElements = await this.queryAllSelectedDays();
    if (this.positionType === 'end' && (!allSelectedDaysElements || allSelectedDaysElements.length === 0)) {
      if (!this._selectedDate) {
        if (this.picker === 'month') {
          // move to next year
          this.navigateYear();
          return;
        }
        if (this.picker === 'year') {
          // move to next list of years
          this.navigateYearPage();
          return;
        }
        // move to next month
        const currentDate = this._currentDate;
        const newCurrentDate = toUTCDate(
          currentDate.getUTCFullYear(),
          currentDate.getMonth() + 1,
          2
        );
        this._currentDate = newCurrentDate;
      }
    }

  }
  
  protected override async firstUpdated(): Promise<void> {
    const valueAsDate = this._valueAsDate;
    if (this._selectedDate) {
      this._currentDate = getDate(this._selectedDate);
    }
    this.navigateToNextPage();
    this.emit('sc-first-updated', { 
      detail: {
        focusableElements: await this.queryAllFocusable(),
        value: valueAsDate && toDateString(valueAsDate, this.picker, this.showTime),
        valueAsDate: valueAsDate && getDate(valueAsDate),
        valueAsNumber: +valueAsDate,
      }, 
    });
  }

  async nevigationNextMonth(monthStep = 1) {
    if (!this._selectedDate) {
      const next = await this._navigationNext;
      Array.from({ length: monthStep }).forEach(() => next?.click());
    }
  }

  navigateMonth = (ev: MouseEvent): void =>{
    ev.stopPropagation();
    ev.preventDefault();
    const currentDate = this._currentDate;
    const isPreviousNavigation = (
      ev.currentTarget as HTMLButtonElement
    ).getAttribute('data-navigation') === 'previous';

    const newCurrentDate = toUTCDate(
      currentDate.getFullYear(),
      currentDate.getMonth() + (isPreviousNavigation ? -1 : 1),
      2
    );
    const { minYear, maxYear } = this._effectiveYearBounds;
    const targetYear = newCurrentDate.getUTCFullYear();
    if (targetYear < minYear || targetYear > maxYear) {
      return;
    }
    this._currentDate = newCurrentDate;

    /**
     * `.detail=1` means mouse click in `@click` for all browsers except IE11.
     */
    this._focusNavButtonWithKey = ev.detail === 0;
  };

  navigateYear = (ev?: MouseEvent): void => {
    ev?.stopPropagation();
    ev?.preventDefault();
    const isPreviousNavigation = (
      ev?.currentTarget as HTMLButtonElement
    )?.getAttribute('data-navigation') === 'previous';

    let currentYear = this._currentDate.getFullYear();
    currentYear = currentYear + (isPreviousNavigation ? -1 : 1);

    const { minYear, maxYear } = this._effectiveYearBounds;
    if (currentYear < minYear || currentYear > maxYear) {
      return;
    }

    const newCurrentDate = toUTCDate(
      currentYear,
      this._currentDate.getMonth(),
      this._currentDate.getDate()
    );
    this._currentDate = newCurrentDate;
    const yearRange = generateRange(
      minYear,
      maxYear,
      this._selectedYearPage, 
      MAX_ITEM
    );
    const { end, start } = yearRange;
    if (currentYear > end) {
      this._selectedYearPage = this._selectedYearPage + 1;      
    } else if (currentYear < start) {
      this._selectedYearPage = this._selectedYearPage - 1;
    }
    this.requestUpdate();
  };

  navigateYearPage = (ev?: MouseEvent): void => {
    ev?.stopPropagation();
    ev?.preventDefault();
    const isPreviousNavigation = (
      ev?.currentTarget as HTMLButtonElement
    )?.getAttribute('data-navigation') === 'previous';

    const { minYear, maxYear } = this._effectiveYearBounds;
    const nextPage = Number(this._selectedYearPage) + (isPreviousNavigation ? -1 : 1);
    const clampedPage = nextPage <= 0 ? 0 : nextPage;
    const pageRange = generateRange(minYear, maxYear, clampedPage, MAX_ITEM);
    if (pageRange.start > maxYear || pageRange.end < minYear) {
      return;
    }
    this._selectedYearPage = clampedPage;
  };

  queryAllSelectedDays = async () : Promise<HTMLElement[]> => {
    const selected = (await this._monthCalendar)?.queryAll('[aria-selected="true"]') as HTMLElement[];    
    return selected;
  };

  queryAllFocusable = async () : Promise<HTMLElement[]> => {
    const isStartViewCalendar = this.startView === 'calendar';
    const focusable = [
      ...this.queryAll('sc-icon'),
      (await (isStartViewCalendar ? this._monthCalendar : this._yearGrid))
        ?.query(`.${
          isStartViewCalendar ? 'calendar-day' : 'year-grid-button'
        }[aria-selected="true"]`),
    ].filter(Boolean) as HTMLElement[];

    return focusable;
  };

  renderCalendar = (): TemplateResult => { // can render the month based on currentDate here!!!
    const {
      _currentDate,
      _max,
      _min,
      _selectedDate,
      disabledDates,
      disabledDays,
      firstDayOfWeek,
      locale,
      selectedDateLabel,
      shortWeekLabel,
      showWeekNumber,
      todayLabel,
      weekLabel,
      weekNumberTemplate,
      weekNumberType,
      positionType,
    } = this;
    const currentDate = _currentDate;
    const formatters = this._formatters;
    const max = _max;
    const min = _min;
    const selectedDate = _selectedDate;
    const {
      dayFormat,
      fullDateFormat,
      longWeekdayFormat,
      narrowWeekdayFormat,
    } = this._formatters;

    const weekdays = getWeekdays({
      firstDayOfWeek,
      longWeekdayFormat,
      narrowWeekdayFormat,
      shortWeekLabel,
      showWeekNumber,
      weekLabel,
    });
    const {
      calendar: calendarMonth,
      disabledDatesSet,
      disabledDaysSet,
    } = calendar({
      date: currentDate,
      dayFormat,
      disabledDates: disabledDates.map((n: any) => toResolvedDate(n)),
      disabledDays,
      firstDayOfWeek,
      fullDateFormat,
      locale,
      max,
      min,
      showWeekNumber,
      weekNumberTemplate,
      weekNumberType,
    });

    return html`
    <sc-month-calendar
      .data=${{
    calendar: calendarMonth,
    currentDate,
    date: selectedDate,
    disabledDatesSet,
    disabledDaysSet,
    formatters,
    max,
    min,
    selectedDateLabel,
    showWeekNumber,
    todayDate: this.today,
    todayLabel,
    weekdays,
  }}
      @sc-select=${this.updateSelectedDate}
      ?range=${this.range}
      .positionType=${positionType as string}
      class=calendar
      exportparts=table,caption,weekdays,weekday,weekday-value,week-number,calendar-day,today,calendar
    ></sc-month-calendar>
    `;
  };

  renderNavigationButton = (
    navigationType: 'next' | 'previous',
  ): TemplateResult => {
    const isStartViewYearGrid = this.startView === 'yearGrid';
    const isPreviousNavigationType = navigationType === 'previous';
    const label = isPreviousNavigationType ? this.previousMonthLabel : this.nextMonthLabel;

    return html`
      ${isPreviousNavigationType ? html`<sc-icon 
        size=sm 
        data-navigation=${navigationType} 
        label=${label} 
        @click=${this.navigateYear} 
        name=arrowhead-left
      >
      </sc-icon>` : ''}
      <sc-icon 
        size=sm
        data-navigation=${navigationType} 
        label=${label} 
        @click=${isStartViewYearGrid ? this.navigateYearPage : this.navigateMonth} 
        name=${isPreviousNavigationType ? 'arrow-ios-backward' : 'arrow-ios-forward'}
      >
      </sc-icon>
      ${!isPreviousNavigationType ? html`<sc-icon 
        size=sm
        data-navigation=${navigationType} 
        label=${label} 
        @click=${this.navigateYear} 
        name=arrowhead-right
      >
      </sc-icon>` : ''}
      `;
  };

  renderMonthGrid = (): TemplateResult => {
    const {
      _selectedDate,
      _max,
      _min,
      selectedMonthLabel,
      _currentDate,
      tomonthLabel,
      positionType,
      picker,
      range,
    } = this;

    return html`
    <sc-month-grid
      class=month-grid
      ?show-time=${this.showTime}
      .data=${{
    date: _selectedDate,
    formatters: this._formatters,
    selectedMonthLabel,
    tomonthLabel,
    max: _max,
    min: _min,
    currentDate: _currentDate,
    picker,
  }}
      .positionType=${positionType as string}
      ?range=${range}
      @sc-month-updated=${this.updateMonth}
    ></sc-month-grid>
    `;
  };

  renderYearGrid = (): TemplateResult => {
    const {
      _selectedDate,
      _currentDate,
      _formatters,
      _selectedYearPage,
      _min,
      _max,
      selectedYearLabel,
      toyearLabel,
      positionType,
      picker,
      range,
      dataId,
    } = this;

    return html`
    <sc-year-grid
      class=year-grid
      .data=${{
    date: _selectedDate,
    currentDate: _currentDate,
    formatters: _formatters,
    min: _min,
    max: _max,
    dataId,
    selectedYearLabel,
    toyearLabel,
    picker,
  }}
      .page=${_selectedYearPage}
      ?range=${range}
      .positionType=${positionType as string}
      @sc-year-updated=${this.updateYear}
      exportparts=year-grid,year,toyear
    ></sc-year-grid>
    `;
  };

  selectToday = (): void => {
    const selectedDate = this.today;
    this._selectedDate = selectedDate;
    this._currentDate = getDate(selectedDate);
    /**
     * Always update `value` just like other native element such as `input`.
     */
    this.value = toDateString(selectedDate, this.picker, this.showTime);
    this.emit('sc-select', {
      detail: {
        isKeypress: false,
        value: this.value,
        valueAsDate: getDate(selectedDate),
        valueAsNumber: +selectedDate,
      },
    });
  };

  updateSelectedDate = (event: CustomEvent<ValueUpdatedEvent>): void => {
    const { value, clickType } = event.detail;
    const selectedDate = getDate(value);
    this.clickType = clickType as string;
    this._selectedDate = selectedDate;
    this._currentDate = getDate(selectedDate);
    /**
     * Always update `value` just like other native element such as `input`.
     */
    this.value = selectedDate;

    if ('stopPropagation' in event && typeof event.stopPropagation === 'function') {
      event.stopPropagation();
    }
    if ('preventDefault' in event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
    this.value = toDateString(selectedDate, this.picker, this.showTime);
    if (this.timeValue) {
      this.value = this.value?.replace(this.timeRegex, this.timeValue);
    }
    this.emit('sc-select', {
      detail: {
        isKeypress: false,
        value: this.value,
        valueAsDate: getDate(selectedDate),
        valueAsNumber: +selectedDate,
        quickSelect: clickType === 'quick-select',
      },
    });
  };

  updateStartView = (ev: MouseEvent): void => {
    ev.stopPropagation();
    ev.preventDefault();
    if (this.startView === 'monthGrid') {
      this.startView = 'yearGrid';
      return;
    }
    this.startView = 'monthGrid';
  };

  updateMonth = ({
    detail: { monthValue },
  }: CustomEvent<CustomEventDetail['sc-month-updated']['detail']>): void => {
    const todayDate = toResolvedDate();    
    const date = dateValidator(this._currentDate, getDate(todayDate));
    let nextSelectedDate = dayjs(date.date).date(1).month(monthValue);
    const daysInTargetMonth = nextSelectedDate.daysInMonth();
    nextSelectedDate = nextSelectedDate.date(Math.min(date.date.getDate(), daysInTargetMonth));
    this._currentDate = nextSelectedDate.toDate();
    if (this.picker === 'month') {
      this._selectedDate = getDate(this._currentDate);
      this.value = toDateString(this._selectedDate);
      this.emit('sc-select', {
        detail: {
          isKeypress: false,
          // quickSelect: true,
          value: this.value,
          valueAsDate: getDate(this._selectedDate),
          valueAsNumber: +this._selectedDate,
        },
      });
      return;
    }
    this.startView = this._shownView;
  };

  updateYear = ({
    detail: { year },
  }: CustomEvent<CustomEventDetail['sc-year-updated']['detail']>): void => {
    const todayDate = toResolvedDate();    
    const date = dateValidator(this._currentDate, getDate(todayDate));
    this._selectedDate = getDate(date.date.setFullYear(year));
    this.updateComplete.then(async() => {
      const allSelectedDaysElements = await this.queryAllSelectedDays();
      if (this.positionType === 'end' && this._selectedDate && (!allSelectedDaysElements || allSelectedDaysElements?.length === 0)) {
        if (getDate().getMonth() === this._selectedDate.getMonth()) {
          const allDaysCountInCurrMonth = dayjs(this._selectedDate).daysInMonth() || 31;
          this._selectedDate = dayjs(this._selectedDate).add(allDaysCountInCurrMonth, 'day').toDate();  
        }
      }
      this._currentDate = getDate(this._selectedDate);
    });
    if (this.picker === 'year') {
      this.value = toDateString(this._selectedDate);
      this.emit('sc-select', {
        detail: {
          isKeypress: false,
          value: this.value,
          valueAsDate: getDate(this._selectedDate),
          valueAsNumber: +this._selectedDate,
        },
      });
      return;
    }
    this.startView = this._shownView;
  };

  private timeInputChange(e: CustomEvent) {
    this.timeValue = e.detail.value;
    this.value = this.value.replace(this.timeRegex, this.timeValue);
    const selectedDate = getDate(this.value);
    this.emit('sc-select', {
      detail: {
        isKeypress: false,
        value: this.value,
        valueAsDate: selectedDate,
        valueAsNumber: +selectedDate,
      },
    });
    this.requestUpdate();
  }

  private timeSelectConfirm(e: CustomEvent) {
    const nextValue = e.detail?.value || this.timeValue || this.value;
    if (nextValue) {
      this.timeValue = nextValue;
      this.value = this.value.replace(this.timeRegex, this.timeValue);
    }
    const selectedDate = getDate(this._selectedDate || this.value);
    this.emit('sc-select', {
      detail: {
        isKeypress: false,
        value: this.value,
        valueAsDate: selectedDate,
        valueAsNumber: +selectedDate,
        timeSelect: true,
      },
    });
  }
  
  protected override render(): TemplateResult {
    if (this.showTime) {
      return html`
      <div 
      class=${classMap({
        'date-picker-container__with-time': true,
        'without-border': this.withoutBorder,
      })}
      >
        ${this.renderMainPicker()}
        <sc-date-time-select 
        ?seconds=${this.seconds}
        format=${this._timeFormat}
        value=${this.timeValue as string}
        @sc-input=${this.timeInputChange}
        @sc-select=${this.timeSelectConfirm}
        ></sc-date-time-select>
      </div>
      `;
    }
    return this.renderMainPicker();
  }
  protected renderMainPicker(): TemplateResult {
    const {
      _currentDate,
      _selectedYearPage,
      showWeekNumber,
      startView,
      withoutBorder,
      showActionBar,
      quickSelector,
      quickSelectorItems,
    } = this;
    const formatters = this._formatters;
    const isStartViewYearGrid = startView === 'yearGrid';
    const isStartViewCalendarGrid = startView === 'calendar';
    const { shortMonthYearFormat, yearFormat } = formatters;
    const titleDate = isStartViewCalendarGrid || this.startView === 'monthGrid'
      ? _currentDate
      : (this._selectedDate || _currentDate);
    const selectedYear = toYearLabel(titleDate, yearFormat);
    const selectedYearMonth = toMonthYearLabel(titleDate, shortMonthYearFormat);
    const { minYear, maxYear } = this._effectiveYearBounds;
    const yearRange = generateRange(minYear, maxYear, _selectedYearPage, MAX_ITEM);
    const showMonthGridAsYearOnly = !isStartViewCalendarGrid && titleDate.getFullYear() <= 0;
    const showDateStr = 
      isStartViewYearGrid ? selectedYear : isStartViewCalendarGrid ? selectedYearMonth : (showMonthGridAsYearOnly ? selectedYear : selectedYearMonth);
    const validQuickSelector = quickSelector && quickSelectorItems;

    const unitPriority: Record<string, number> = { year: 1, month: 2, week: 3, day: 4 };
    const sortedQuickSelectorItems = validQuickSelector
      ? quickSelectorItems
          .sort((a: any, b: any) => {
            if (a.amount < 0 && b.amount < 0) {
              if (unitPriority[a.unit] !== unitPriority[b.unit]) {
                return unitPriority[a.unit] - unitPriority[b.unit];
              }
              return a.amount - b.amount; 
            }

            if (a.amount > 0 && b.amount > 0) {
              if (unitPriority[a.unit] !== unitPriority[b.unit]) {
                return unitPriority[b.unit] - unitPriority[a.unit];
              }
              return a.amount - b.amount;
            }

            return a.amount - b.amount;
          })
          .map(
            item => html`
              <div class="quick-selector-item" 
                @mousedown=${(e: MouseEvent) => e.preventDefault()}
                @click=${() => this.handleQuickSelect(item.amount, item.unit)}>
                ${this.generateQuickSelectorLabel(item.amount, item.unit)}
              </div>
            `
          )
      : nothing;

    return html`
      <div class="date-picker-container 
        ${showActionBar ? 'container-action-bar' : ''}
        ${validQuickSelector ? 'container-quick-selector' : ''} 
        ${validQuickSelector && withoutBorder ? 'container-without-border' : ''}"
      >
        ${validQuickSelector ? html`
          <div class="quick-selector" style="width: 16rem;">
            <div class="quick-selector-header">Quick select</div>
            <div><sc-divider vertical size="xxs" line-width="xxs"><sc-divider></div>
            <div class="quick-selector-items">
              ${sortedQuickSelectorItems}
            </div>
          </div>
        ` : nothing}
        <div class='container 
          ${withoutBorder || validQuickSelector || this.showTime || this.isMobile ? 'without-border' : ''} 
          ${showActionBar ? 'with-action-bar' : ''}'
        >
          <div class="header" part="header">
            <div class="pagination">
              ${this.renderNavigationButton('previous')}
            </div>
            <div class="month-and-year-selector">
              <p class="selected-year-month" @click=${this.updateStartView}>${showDateStr}</p>
            </div>
            <div class="pagination">
              ${this.renderNavigationButton('next')}
            </div>
          </div>

          <div class="body ${classMap({
            [`start-view--${startView}`]: true,
            'show-week-number': showWeekNumber,
          })}" part="body">
            ${
              (isStartViewCalendarGrid ? this.renderCalendar : isStartViewYearGrid ? this.renderYearGrid : this.renderMonthGrid)()
            }
          </div>

          ${showActionBar ? html`
            <div class="action-bar">
              <sc-button @click=${this.selectToday}
                          type="link"
                          size="xxs" 
                          width="100%" 
                          no-pill="true">
                Today
              </sc-button>
            </div>` : nothing}
        </div>
      </div>
    `;
  }

  private handleQuickSelect(amount: number, unit: 'year' | 'month' | 'week' | 'day'): void {
    const today = getDate();
    let newDate: Date;

    switch (unit) {
      case 'year':
        newDate = dayjs(today).add(amount, 'year').toDate();
        break;
      case 'month': {
        let temp = dayjs(today).add(amount, 'month');
        const daysInTargetMonth = temp.daysInMonth();
        temp = temp.date(Math.min(today.getDate(), daysInTargetMonth));
        newDate = temp.toDate();
        break;
      }
      case 'week':
        newDate = dayjs(today).add(amount, 'week').toDate();
        break;
      case 'day':
        newDate = dayjs(today).add(amount, 'day').toDate();
        break;
      default:
        newDate = getDate(today.getTime());
    }

    const daysInMonth = getDate(Date.UTC(newDate.getUTCFullYear(), newDate.getMonth() + 1, 0)).getDate();
    if (newDate.getDate() > daysInMonth) {
      newDate.setUTCDate(daysInMonth);
    }
 
    this.updateSelectedDate({
      detail: {
        value: dayjs(newDate.getTime()).format('YYYY-MM-DD'),
        clickType: 'quick-select',
      },
    } as CustomEvent<ValueUpdatedEvent>);
  }

  private generateQuickSelectorLabel(amount: number, unit: string): string {
    const absAmount = Math.abs(amount);
    const direction = amount > 0 ? 'after' : 'before';
    const pluralUnit = absAmount > 1 ? `${unit}s` : unit;
    return `${absAmount} ${pluralUnit} ${direction}`;
  }

  protected override async updated(changedProperties: Map<string | number | symbol, unknown>): Promise<void> {
    super.updated(changedProperties);

    const {
      _currentDate,
      _max,
      _min,
      _navigationNext,
      _navigationPrevious,
      _yearDropdown,
      startView,
    } = this;

    /**
     * NOTE: Focus `.year-dropdown` when switching from year grid to calendar view.
     */
    if (
      changedProperties.get('startView') === 'yearGrid' as StartView &&
      startView === 'calendar'
    ) {
      (await _yearDropdown)?.focus();
    }

    /**
     * NOTE: Focus new navigation button when navigating months with keyboard, e.g.
     * next button will not show in Dec 2020 when `max=2020-12-31` so previous button should be
     * focused instead.
     */
    if (startView === 'calendar') {
      if (changedProperties.has('_currentDate') && this._focusNavButtonWithKey) {
        isInCurrentMonth(_min, _currentDate) && focusElement(_navigationNext);
        isInCurrentMonth(_max, _currentDate) && focusElement(_navigationPrevious);

        this._focusNavButtonWithKey = false;
      }
      const monthCalendar = await this._monthCalendar;
      if (monthCalendar) {
        monthCalendar.dragToSelect = this.dragToSelect;
      }
    }

    if (changedProperties.has('dragToSelect')) {
      const monthCalendar = await this._monthCalendar;
      if (monthCalendar) {
        monthCalendar.dragToSelect = this.dragToSelect;
      }
    }
  }

  public override willUpdate(changedProperties: DatePickerChangedProperties): void {
    if (changedProperties.has('locale')) {
      const newLocale = (
        this.locale || DateTimeFormat().resolvedOptions().locale
      ) as string;

      this._formatters = toFormatters(newLocale);
      this.locale = newLocale;
    }

    const dateRangeProps = [
      'max',
      'min',
      'maxYear',
      'minYear',
      'value',
    ] as (keyof Pick<DatePickerProperties, 'max' | 'min' | 'maxYear' | 'minYear' | 'value'>)[];
    if (
      dateRangeProps.some(n => changedProperties.has(n))
    ) {
      const todayDate = getDate(toResolvedDate());
      const [
        newMax,
        newMin,
        newValue,
      ] = (
        [
          ['max', MAX_DATE],
          ['min', MIN_DATE],
          ['value', todayDate],
        ] as [keyof Pick<DatePickerProperties, 'max' | 'min' | 'value'>, Date][]
      ).map(
        ([propKey, resetValue]) => {
          let currentValue = this[propKey];
          /** If the current picker is year and user only pass the year as minimum and maximum value,
           *  then manually trans the year to a valid date
           */
          const shouldTreatAsYearOnlyValue =
            propKey === 'value' &&
            typeof currentValue === 'string' &&
            yearOnlyRegex.test(currentValue);

          if ((this.picker === 'year' || shouldTreatAsYearOnlyValue) && currentValue) {
            currentValue = getDate(toYearDate(currentValue) as string | number | Date);
          }
          const defaultValue = toResolvedDate(
            /**
             * The value from `changedProperties` can only be undefined when first init.
             * This also means that subsequent changes will not affect the outcome because any
             * invalid value will be dropped in favor of previous valid value.
             */
            toYearDate((changedProperties.get(propKey) as MaybeDate ?? resetValue) as unknown) as MaybeDate
          );
          const valueWithReset = currentValue === undefined ? resetValue : currentValue;

          return dateValidator(valueWithReset, defaultValue);
        }
      );

      const { minYear, maxYear } = this._effectiveYearBounds;
      const hasCustomMinYear = Number.isFinite(Number(this.minYear));
      const hasCustomMaxYear = Number.isFinite(Number(this.maxYear));
      const yearBoundMinDate = hasCustomMinYear ? toUTCDate(minYear, 0, 1) : MIN_DATE;
      const yearBoundMaxDate = hasCustomMaxYear ? toUTCDate(maxYear, 11, 31) : MAX_DATE;
      const boundedMinDate = toResolvedDate(
        clampValue(+yearBoundMinDate, +yearBoundMaxDate, +newMin.date)
      );
      const boundedMaxDate = toResolvedDate(
        clampValue(+yearBoundMinDate, +yearBoundMaxDate, +newMax.date)
      );
      const effectiveMinDate = +boundedMinDate <= +boundedMaxDate ? boundedMinDate : boundedMaxDate;
      const effectiveMaxDate = +boundedMinDate <= +boundedMaxDate ? boundedMaxDate : boundedMinDate;

      /**
       * NOTE: Ensure new `value` is clamped between new `min` and `max` as `newValue` will only
       * contain valid date but its value might be a out-of-range date.
       */
      const valueDate = toResolvedDate(
        clampValue(+effectiveMinDate, +effectiveMaxDate, +newValue.date)
      );

      const hasSelectedValue = Boolean(this.value);
      const isTodayBeforeMin = +todayDate < +effectiveMinDate;
      const isTodayAfterMax = +todayDate > +effectiveMaxDate;
      const isTodayOutOfRange = isTodayBeforeMin || isTodayAfterMax;
      const shouldUseBoundaryAsDefault = !hasSelectedValue && isTodayOutOfRange;
      const isRangePanel = this.positionType === 'start' || this.positionType === 'end';
      this._useBoundaryDefaultAnchor = shouldUseBoundaryAsDefault && this.picker !== 'year';

      this._min = effectiveMinDate;
      this._max = effectiveMaxDate;
      if (shouldUseBoundaryAsDefault) {
        const defaultDate = getDate(valueDate);

        if (isRangePanel && this.picker !== 'year') {
          if (isTodayAfterMax && this.positionType === 'start') {
            defaultDate.setMonth(defaultDate.getMonth() - 1);
          }
          if (isTodayBeforeMin && this.positionType === 'end') {
            defaultDate.setMonth(defaultDate.getMonth() + 1);
          }
        } else if (this.positionType === 'end' && this.rangeDays > 0) {
          const monthStep = Math.ceil(this.rangeDays / maxMonthDays);
          defaultDate.setMonth(defaultDate.getMonth() + monthStep);
        }

        this._currentDate = defaultDate;
      } else if (!(this.positionType === 'start' || this.positionType === 'end') || this.picker === 'year') {
        this._currentDate = getDate(valueDate);
      }

      const selectedDate = getDate(valueDate);

      if (this.value) {
        this._selectedDate = selectedDate;
        this._currentDate = selectedDate;
      }
      this._valueAsDate = selectedDate;
      this.today = this._useBoundaryDefaultAnchor ? getDate(valueDate) : getDate(todayDate);

      this.syncSelectedYearPage(this._currentDate.getUTCFullYear());
    
      /**
       * Always override `min` and `max` when they are set with falsy values.
       */
      if (!this.max) this.max = toDateString(effectiveMaxDate, this.picker, this.showTime);
      if (!this.min) this.min = toDateString(effectiveMinDate, this.picker, this.showTime);

      /**
       * Always override `value` when its value is not a string and dispatch `date-updated` event.
       */
      if (!this.value && this.picker !== 'year' && !isRangePanel && !shouldUseBoundaryAsDefault) {
        const valueStr = toDateString(valueDate, this.picker, this.showTime);
        this.value = valueStr;
      }

    }

    if (changedProperties.has('startView')) {
      const oldStartView =
        (changedProperties.get('startView') || 'calendar') as StartView;

      const {
        _max,
        _min,
        _selectedDate,
        startView,
      } = this;

      /**
       * NOTE: Reset to old `startView` to ensure a valid value.
       */
      if (!startViews.includes(startView)) {
        this.startView = oldStartView;
      }

      if (startView === 'calendar' && this._selectedDate) {
        const newSelectedYear = getDate(
          clampValue(
            +_min,
            +_max,
            +_selectedDate
          )
        );

        this._selectedDate = newSelectedYear;
      }
    }
  }

  public get valueAsDate(): Date {
    return this._valueAsDate;
  }

  public get valueAsNumber(): number {
    return +this._valueAsDate;
  }
}

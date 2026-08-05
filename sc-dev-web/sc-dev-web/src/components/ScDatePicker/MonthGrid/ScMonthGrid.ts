import { html, type TemplateResult } from 'lit';
import { property, queryAsync, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { labelSelectedMonth, labelTomonth, MAX_DATE, MIN_DATE, navigationKeySetGrid } from '../constants.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { toClosestTarget } from '../helpers/to-closest-target.js';
import { toMonthList } from '../helpers/to-month-list.js';
import { RootElement } from '../root-element/root-element.js';
import { baseStyling, resetButton, resetShadowRoot } from '../ScDatePicker.style.js';
import type { Formatters, InferredFromSet } from '../typings.js';
import { monthGridStyling } from './ScMonthGrid.style.js';
import { toNextSelectedMonth } from './to-next-selected-month.js';
import type { 
  MonthGridChangedProperties, 
  MonthGridData, 
  MonthGridProperties, 
  MonthGridRenderButtonInit, 
} from './typings.js';
import ScTheme from '../../../styles/ScTheme.js';
import dayjs from 'dayjs/esm/index.js';
import { getDate } from '../helpers/get-date.js';
import { toUTCDate } from '../helpers/to-utc-date.js';

export class ScMonthGrid extends RootElement implements MonthGridProperties {
  public static styles = ScTheme.getStyles().concat([
    baseStyling,
    resetButton,
    resetShadowRoot,
    monthGridStyling,
  ]);

  _todayMonth: number;

  @state() protected $focusingMonth: number;

  @property({ attribute: true, type: Object }) public data: MonthGridData;

  @property({ type: String }) positionType = '';

  @property({ type: Boolean }) range = false;

  @queryAsync('.month-grid') public monthGrid!: Promise<HTMLDivElement | null>;

  constructor() {
    super();

    const todayDate = toResolvedDate();
    if (!this.data) {
      this.data = {
        date: todayDate,
        formatters: undefined,
        selectedMonthLabel: labelSelectedMonth,
        tomonthLabel: labelTomonth,
      };
    }

    this.$focusingMonth = this._todayMonth = todayDate.getMonth();
  }

  protected override shouldUpdate(): boolean {
    // eslint-disable-next-line
    return this.data != null && this.data.formatters != null;
  }

  public override willUpdate(changedProperties: MonthGridChangedProperties): void {
    if (changedProperties.has('data') && this.data) {
      const { date, currentDate, picker } = this.data;
      const focusDate = picker === 'month' ? (currentDate ?? date) : date;

      if (focusDate) {
        this.$focusingMonth = focusDate.getMonth();
      }
    }
  }
  
  protected $renderButton({
    ariaLabel,
    ariaSelected,
    ariaDisabled,
    className,
    part,
    tabIndex,
    title,
    month,
    monthValue,
  }: MonthGridRenderButtonInit): TemplateResult {
    return html`
    <button
      aria-label=${ariaLabel as string}
      aria-selected=${ariaSelected as 'false' | 'true'}
      aria-disabled=${ariaDisabled as 'false' | 'true'}
      class="month-grid-button${className}"
      data-month-value=${monthValue}
      data-month=${month}
      part=${part}
      tabindex=${tabIndex}
      title=${ifDefined(title)}
    ></button>
    `;
  }

  updateMonth = (event: KeyboardEvent): void => {
    const isDisabled =
        toClosestTarget(event, 'button[data-month-value]')
          ?.getAttribute('aria-disabled') === 'true';
    if (isDisabled) return;
    if (event.type === 'keydown') {
      event.stopImmediatePropagation();

      const key =
      event.key as InferredFromSet<typeof navigationKeySetGrid>;

      if (!navigationKeySetGrid.has(key)) return;

      // Stop scrolling with arrow keys
      event.preventDefault();

      const focusingMonth = toNextSelectedMonth({
        key,
        month: this.$focusingMonth,
      });

      const focusingMonthGridButton = this.query<HTMLButtonElement>(
        `button[data-month-value="${focusingMonth}"]`
      );

      this.$focusingMonth = focusingMonth;
      focusingMonthGridButton?.focus();
    } else if (event.type === 'click') {
      const selectedMonthStr =
        toClosestTarget(event, 'button[data-month-value]')
          ?.getAttribute('data-month-value');

      const selectedMonth =
        toClosestTarget(event, 'button[data-month]')
          ?.getAttribute('data-month');

      /** Do nothing when not tapping on the month button */
      // eslint-disable-next-line
      if (selectedMonthStr == null) return;

      const monthValue = Number(selectedMonthStr) - 1;

      this.$focusingMonth = monthValue;
      this.emit('sc-month-updated', {
        detail: {
          monthValue,
          month: selectedMonth,
        },
      });
    }
  };

  protected render(): TemplateResult {
    const {
      date,
      formatters,
      currentDate,
      selectedMonthLabel,
      tomonthLabel,
      min,
      max,
      picker,
    } = this.data as MonthGridData;
    const focusingMonth = this.$focusingMonth;

    const { monthFormat } = formatters as Formatters;
    const monthList = toMonthList();
    const today = dayjs(toResolvedDate());
    this._todayMonth = (this.positionType === 'end' ? today.add(1, 'month') : today)
      .toDate()
      .getMonth();

    return html`
    <div
      @keydown=${this.updateMonth}
      @click=${this.updateMonth}
      class=month-grid
      part=month-grid
    >${
  monthList.map((month, index) => {
    const selectedDate = picker === 'month' ? (currentDate ?? date) : date;
    const selectedYear = String(currentDate?.getFullYear() ?? date?.getFullYear() ?? 0);
    const isSelected = index === selectedDate?.getMonth() && +selectedYear === selectedDate?.getFullYear();
    const _minYear = String(min?.getFullYear());
    const _maxYear = String(max?.getFullYear());
    const isDisabled = 
      picker === 'month' && (
        (min && selectedYear === _minYear && index < min.getMonth()) || 
        (max && selectedYear === _maxYear && index > max.getMonth()) ||
        min && selectedYear < _minYear || max && selectedYear > _maxYear
      );
    const toYear = currentDate?.getFullYear() ?? date?.getFullYear() ?? new Date().getFullYear();
    const isToday = this._todayMonth === index;

    const title = isSelected ?
      selectedMonthLabel :
      isToday
        ? tomonthLabel
        : undefined;

    let isBetweenRange = false;
    if (picker === 'month') {
      const curTime = +toUTCDate(+selectedYear, index, 1);
      const selectedDate = date;
      if (+(max ?? 0) !== +MAX_DATE && +selectedDate) {
        isBetweenRange = curTime >= +selectedDate && curTime <= +(max ?? MAX_DATE);
      }
      if (+(min ?? 0) !== +MIN_DATE && +selectedDate && this.positionType !== 'start') {
        isBetweenRange = curTime >= +(min ?? MIN_DATE) && curTime <= +selectedDate;
      }
    }
    
    const className = `${isBetweenRange && this.range ? ' is-between' : ''} ${isToday ? ' month--today' : ''} ${picker === 'month' ? ' action-bar' : ''}`;
    return this.$renderButton({
      ariaLabel: monthFormat(toUTCDate(toYear, index, 2)),
      ariaSelected: isSelected ? 'true' : 'false',
      ariaDisabled: isDisabled ? 'true' : 'false',
      className,
      date,
      part: `month${isToday ? ' tomonth' : ''}`,
      tabIndex: (index + 1) === focusingMonth ? 0 : -1,
      title,
      tomonthLabel,
      month,
      monthValue: index + 1,
    } as MonthGridRenderButtonInit);
  })
}</div>
    `;
  }
}

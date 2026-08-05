import { html, type TemplateResult } from 'lit';
import { property, queryAsync, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { labelSelectedYear, labelToyear, MAX_DATE, MIN_DATE, navigationKeySetGrid } from '../constants.js';
import { toClosestTarget } from '../helpers/to-closest-target.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { RootElement } from '../root-element/root-element.js';
import { baseStyling, resetButton, resetShadowRoot } from '../ScDatePicker.style.js';
import type { Formatters, InferredFromSet } from '../typings.js';
import { yearGridStyling } from './ScYearGrid.style.js';
import { toNextSelectedYear } from './to-next-selected-year.js';
import type { 
  YearGridChangedProperties, 
  YearGridData, 
  YearGridProperties, 
  YearGridRenderButtonInit, 
} from './typings.js';
import ScTheme from '../../../styles/ScTheme.js';
import { MAX_ITEM } from './constants.js';
import dayjs from 'dayjs/esm/index.js';
import { getDate } from '../helpers/get-date.js';
import { toUTCDate } from '../helpers/to-utc-date.js';
import { generateRange } from '../helpers/generate-page.js';

export class ScYearGrid extends RootElement implements YearGridProperties {
  public static styles = ScTheme.getStyles().concat([
    baseStyling,
    resetButton,
    resetShadowRoot,
    yearGridStyling,
  ]);

  _todayYear: number;

  @state() protected $focusingYear: number;

  @property({ attribute: true, type: Object }) public data: YearGridData;

  @property({ type: Number }) public page = 0;

  @property({ type: String }) positionType = '';

  @property({ type: Boolean }) range = '';
  
  @queryAsync('.year-grid') public yearGrid!: Promise<HTMLDivElement | null>;

  constructor() {
    super();

    const todayDate = toResolvedDate();
    if (!this.data) {
      this.data = {
        date: todayDate,
        min: MIN_DATE,
        max: MAX_DATE,
        formatters: undefined,
        selectedYearLabel: labelSelectedYear,
        toyearLabel: labelToyear,
      };
    }
    this.$focusingYear = this._todayYear = todayDate.getUTCFullYear();
  }

  protected override shouldUpdate(): boolean {
    // eslint-disable-next-line
    return this.data != null && this.data.formatters != null;
  }

  public override willUpdate(changedProperties: YearGridChangedProperties): void {
    if (changedProperties.has('data') && this.data) {
      const { date } = this.data;

      if (date) {
        this.$focusingYear = date.getUTCFullYear();
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
    year,
  }: YearGridRenderButtonInit): TemplateResult {
    return html`
    <button
      .year=${year}
      aria-label=${ariaLabel as string}
      aria-selected=${ariaSelected as 'false' | 'true'}
      aria-disabled=${ariaDisabled as 'false' | 'true'}
      class="year-grid-button${className}"
      data-year=${year}
      part=${part}
      tabindex=${tabIndex}
      title=${ifDefined(title)}
    ></button>
    `;
  }

  updateYear = (event: KeyboardEvent): void => {
    const isDisabled =
        toClosestTarget(event, 'button[data-year]')
          ?.getAttribute('aria-disabled') === 'true';
    if (isDisabled) return;
    if (event.type === 'keydown') {
      /**
       * NOTE: `@material/mwc-dialog` captures Enter keyboard event then closes the dialog.
       * This is not what `year-grid` expects so here stops all event propagation immediately for
       * all key events.
       */
      event.stopImmediatePropagation();

      const key =
      event.key as InferredFromSet<typeof navigationKeySetGrid>;

      if (!navigationKeySetGrid.has(key)) return;

      // Stop scrolling with arrow keys
      event.preventDefault();

      // Focus new year with Home, End, and arrow keys
      const { min, max } = this.data;
      const focusingYear = toNextSelectedYear({
        key,
        max,
        min,
        year: this.$focusingYear,
      });

      const focusingYearGridButton = this.query<HTMLButtonElement>(
        `button[data-year="${focusingYear}"]`
      );

      this.$focusingYear = focusingYear;
      focusingYearGridButton?.focus();
    } else if (event.type === 'click') {
      
      const selectedYearStr =
        toClosestTarget(event, 'button[data-year]')
          ?.getAttribute('data-year');

      /** Do nothing when not tapping on the year button */
      // eslint-disable-next-line
      if (selectedYearStr == null) return;

      const year = Number(selectedYearStr);

      this.$focusingYear = year;

      this.emit('sc-year-updated', {
        detail: {
          year,
        },
      });
    }
  };

  protected render(): TemplateResult {
    const {
      date,
      min,
      max,
      formatters,
      selectedYearLabel,
      toyearLabel,
      picker,
    } = this.data as YearGridData;
    const focusingYear = this.$focusingYear;

    const { yearFormat } = formatters as Formatters;
    const page = this.page <= 0 ? 0 : this.page;
    const { start, end } = generateRange(
      min.getUTCFullYear(),
      max.getUTCFullYear(),
      page,
      MAX_ITEM
    );
    const showList = Array.from({ length: Math.max(end - start + 1, 0) }, (_, idx) => start + idx);

    const today = dayjs(toResolvedDate());
    this._todayYear = (this.positionType === 'end' ? today.add(1, 'month') : today)
      .toDate()
      .getFullYear();

    return html`
    <div
      @click=${this.updateYear}
      @keydown=${this.updateYear}
      @keyup=${this.updateYear}
      class="year-grid"
      part="year-grid"
    >${
  showList.map(year => {
    const yearDate = toUTCDate(year, 0, 1);
    let yearLabel = String(year);
    try {
      if (Number.isFinite(yearDate.getTime())) {
        yearLabel = year > 0 ? yearFormat(yearDate) : String(year);
      }
    } catch {
      yearLabel = String(year);
    }
    const isSelected = year === date?.getFullYear();
    const isToday = this._todayYear === year;
    const isDisabled = year > max?.getFullYear() || year < min?.getFullYear();
    const title = isSelected ?
      selectedYearLabel :
      isToday
        ? toyearLabel
        : undefined;
    
    let isBetweenRange = false;
    if (picker === 'year') {
      const curTime = +toUTCDate(year, 0, 1);
      const selectedDate = date;
      if (+(max ?? 0) !== +MAX_DATE && +selectedDate) {
        isBetweenRange = curTime > +selectedDate && curTime <= +(max ?? MAX_DATE);
      }
      if (+(min ?? 0) !== +MIN_DATE && +selectedDate) {
        isBetweenRange = curTime >= +(min ?? MIN_DATE) && curTime < +selectedDate;
      }
    }
    const className = `${isBetweenRange && this.range ? ' is-between' : ''} ${isToday ? ' year--today' : ''} ${picker === 'year' ? ' action-bar' : ''}`;

    return this.$renderButton({
      ariaLabel: yearLabel,
      ariaSelected: isSelected ? 'true' : 'false',
      ariaDisabled: isDisabled ? 'true' : 'false',
      className,
      date,
      part: `year${isToday ? ' toyear' : ''}`,
      tabIndex: year === focusingYear ? 0 : -1,
      title,
      toyearLabel,
      year,
    } as YearGridRenderButtonInit);
  })
}</div>
    `;
  }
}

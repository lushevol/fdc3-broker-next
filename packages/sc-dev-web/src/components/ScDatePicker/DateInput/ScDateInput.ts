
import { html, nothing, type TemplateResult } from 'lit';
import { property, queryAsync, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { DateTimeFormat } from '../constants.js';
import type { ScDatePicker } from '../DatePicker/ScDatePicker.js';
import { scDatePickerName } from '../DatePicker/constants.js';
import type { ScDateInputSurface } from '../DateInputSurface/ScDateInputSurface.js';
import { scDateInputSurfaceName, scDateInputBottomSheet } from '../DateInputSurface/constants.js';
import { slotDatePicker } from '../helpers/slot-date-picker.js';
import { warnUndefinedElement } from '../helpers/warn-undefined-element.js';
import { keyEnter, keyEscape, keySpace, keyTab } from '../key-values.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import { ElementMixin } from '../mixins/element-mixin.js';
import { baseStyling } from '../ScDatePicker.style.js';
import type { ChangedProperties } from '../typings.js';
import { scDateInputClearLabel, scDateInputType } from './constants.js';
import { datePickerInputStyling } from './ScDateInput.style.js';
import type { DateInputProperties } from './typings.js';
import ScTheme from '../../../styles/ScTheme.js';
import '../../../../elements/sc-icon.js';
import '../../../../elements/sc-bottom-sheet.js';
import { FormInputBase } from '../../ScFormInput/FormInputBase.js';
import dayjs from 'dayjs/esm/index.js';
import customParseFormat from 'dayjs/esm/plugin/customParseFormat/index.js';
import { resizePosition } from '../../../shared/position.js';
import { LayerHierarchyMixin, layerStyle } from '../../../mixins/layer-hierarchy-mixin.js';
import { watch } from '../../../shared/watch.js';
import { getDate } from '../helpers/get-date.js';
import { formatWithExtendedYear } from '../helpers/format-with-extended-year.js';
import { ScBottomSheet } from '../../ScSheet/ScBottomSheet.js';
import { keyed } from 'lit/directives/keyed.js';

dayjs.extend(customParseFormat);

const defaultDateTimeFormatWithSeconds = 'DD MMM YYYY HH:mm:ss';
const defaultDateTimeFormat = 'DD MMM YYYY HH:mm';

const toDisplayYear = (date: Date): string => {
  const year = date.getFullYear();
  const abs = String(Math.abs(year)).padStart(4, '0');
  return year < 0 ? `-${abs}` : abs;
};

const formatDisplayText = (date: Date, format: string | undefined, picker: string | undefined, formatter: (value: any) => string): string => {
  const valueFormat = format ?? 'DD MMM YYYY';
  if (picker === 'year') {
    return toDisplayYear(date);
  }

  if (date.getFullYear() <= 0) {
    return formatWithExtendedYear(date, valueFormat);
  }

  return formatter(date);
};

const toComparableRangeDate = (value: string, picker: string | undefined): Date => {
  if (picker === 'month') {
    return getDate(`${value}-01`);
  }
  if (picker === 'year') {
    return getDate(`${value}-01-01`);
  }
  return getDate(value);
};

export class ScDateInput extends LayerHierarchyMixin(ElementMixin(DatePickerMixin(
  DatePickerMinMaxMixin(FormInputBase)
))) implements DateInputProperties {
  public static styles = ScTheme.getStyles().concat([
    baseStyling,
    datePickerInputStyling,
    layerStyle,
  ]);

  _disconnect: () => void = () => undefined;

  _checkInputScroll: () => void = () => undefined;

  _onKeyup: (event: KeyboardEvent) => void = () => undefined;

  _onClick: (event: MouseEvent | KeyboardEvent) => void = () => undefined;

  _focusElement: HTMLElement | undefined = undefined;

  _lazyLoading = false;

  _picker: ScDatePicker | undefined = undefined;

  _valueAsDate: Date | undefined;

  _value: any;

  _dataId = String(new Date().getTime() + Math.random());

  _valueFormatter = this.$toValueFormatter();

  _valueString: string | { start: string; end: string } = '';
  @state() private _disabled = false;

  @state() private _hasInputDraft = false;

  @state() private _inputDraft = '';

  @state() private _lazyLoaded = false;

  @state() private _open = false;

  @queryAsync('.sc-form-control') protected $input!: Promise<HTMLInputElement | null>;
  
  @queryAsync('sc-icon[name="calendar--line"]') protected $calendarIcon!: Promise<HTMLInputElement | null>;

  @queryAsync('.icon-cover') protected $calendarIconCover!: Promise<HTMLInputElement | null>;

  @queryAsync(scDateInputSurfaceName) protected $inputSurface!: Promise<ScDateInputSurface | null>;

  @queryAsync(scDateInputBottomSheet) protected $inputBottomSheet!: Promise<ScBottomSheet | null>;

  @queryAsync(scDatePickerName) protected $picker!: Promise<ScDatePicker | null>;

  @property({ type: String }) public clearLabel = scDateInputClearLabel;

  @property({ type: String, attribute: 'display-value' }) public displayValue?: string;

  @property({ type: Number, attribute: 'range-days' }) rangeDays = 0;

  @property({ type: Boolean }) open = false;

  @property({ type: String, attribute: 'position-type' }) positionType: string;

  @watch('_open')
  updateOpen() {
    if (!!this.hoist) {
      if (this._open) {
        this._checkInputScroll();
      }
      else {
        window.cancelAnimationFrame(this.requestId);
      }
    }

    if (this._open && this.value) {
      this.updateTimeValue && this.updateTimeValue();
    }
  }

  @watch('picker')
  updateFormat() {
    if (this.picker === 'year') {
      this.format = 'YYYY';
      this.startView = 'yearGrid';
    } else if (this.picker === 'month') {
      this.format = 'MMM YYYY';
      this.startView = 'monthGrid';
    }
    if (this.picker !== 'calendar') {
      this.showTime = false;
      this.showActionBar = false;
    }
  }

  @watch('showTime')
  updateShowTime() {
    // this.showTime is true and this.format is default value, and user doesn't set format manually
    if (this.showTime && this.format === 'DD MMM YYYY') {
      this.format = this.seconds ? defaultDateTimeFormatWithSeconds : defaultDateTimeFormat;
    }
    this.updateValues(this._value);
  }

  @watch('seconds')
  updateSeconds() {
    if ([defaultDateTimeFormatWithSeconds, defaultDateTimeFormat].includes(this.format as string)) {
      this.format = this.seconds ? defaultDateTimeFormatWithSeconds : defaultDateTimeFormat;
    }
    this.updateValues(this._value);
  }

  private requestId: number;
  private lastInputTop: number;

  public iconTrailing = 'clear';

  public type = scDateInputType;
 
  public disconnectedCallback(): void {
    super.disconnectedCallback();

    this._disconnect();
  }

  resize = async () => {
    const inputSurface = await this.$inputSurface;
    const input = await this.$input;
    const surfaceContainer: HTMLElement | undefined | null = 
      inputSurface?.shadowRoot?.querySelector('.surface-container');
    resizePosition(input, surfaceContainer, 0, this.positionType, this.hoist);
  };

  public async connectedCallback(): Promise<void> {
    super.connectedCallback();
    this._value = this.value;

    this._open = this.open;
    const dataId = this.getAttribute('data-id');
    if (dataId) {
      this._dataId = dataId;
    } else {
      this.setAttribute('data-id', this._dataId);
      const calendarIconCover = await this.$calendarIconCover;
      calendarIconCover?.setAttribute('data-id', this._dataId);
    }
    const input = await this.$input;
    if (input) {

      const onResize = this.resize;

      const onBodyKeyup = async (ev: KeyboardEvent) => {
        if (this._disabled && !this._open) return;

        if (ev.key === keyEscape) {
          this.closePicker();
        } else if (ev.key === keyTab) {
          const inputSurface = await this.$inputSurface;
          const isTabInsideInputSurface = (ev.composedPath() as HTMLElement[]).find(
            n => n.nodeType === Node.ELEMENT_NODE &&
            n.isEqualNode(inputSurface)
          );

          if (!isTabInsideInputSurface) this.closePicker();
        }
      };

      const onBodyClick = (e: MouseEvent) => {
        if (this._disabled && !this._open) return;
        const target = (e.composedPath?.()?.[0] as HTMLElement) || (e.target as HTMLInputElement);
        // @ts-ignore
        const dateInput = this.shadowRoot.querySelector('sc-date-input');
        if (target.getAttribute('data-id') !== this._dataId 
          || (dateInput && dateInput.getAttribute('data-id') !== this._dataId)) {
          this.closePicker();
        }
      };

      const onClick = async (event: MouseEvent | KeyboardEvent) => {
        event.preventDefault();
        if (this._disabled) return;

        this._open = !this._open;
        await this.updateComplete;
        setTimeout(()=>{
          if (this._open) {
            onResize();
          }
        },0);
      };
      const onKeyup = (ev: KeyboardEvent) => {
        if (this._disabled) return;
        if (ev.key === keyEnter) {
          onClick(ev);
        }
      };

      this._checkInputScroll = () => {
        const currTop = input.getBoundingClientRect().top;
        if (currTop !== this.lastInputTop) {
          this.resize();
          this.lastInputTop = currTop;
        }
        this.requestId = requestAnimationFrame(this._checkInputScroll);
      };
      this._onKeyup = onKeyup;
      this._onClick = onClick;
      window.addEventListener('resize', onResize);
      window.addEventListener('scroll', onResize);
      document.body.addEventListener('keyup', onBodyKeyup);
      document.body.addEventListener('click', onBodyClick);

      this._disconnect = () => {
        window.removeEventListener('resize', onResize);
        window.removeEventListener('scroll', onResize);
        window.cancelAnimationFrame(this.requestId);
        document.body.removeEventListener('keyup', onBodyKeyup);
        document.body.removeEventListener('click', onBodyClick);
        input.removeEventListener('keyup', onKeyup);
        input.removeEventListener('click', onClick);
      };
    }
    // set timeValue if showTime is true and value not null
    if (this.showTime && this.value) {
      this.updateTimeValue && this.updateTimeValue();
    } 
  }

  public override willUpdate(changedProperties: ChangedProperties<DateInputProperties>): void {
    super.willUpdate(changedProperties);
    if (changedProperties.has('locale')) {
      this.locale = (
        this.locale || DateTimeFormat().resolvedOptions().locale
      ) as string;
      this._valueFormatter = this.$toValueFormatter();
      this.updateValues(this.value);
    }

    if (changedProperties.has('value')) {
      this.updateValues(this.value);
    }

    if (changedProperties.has('disabled') || changedProperties.has('readonly')) {
      this._disabled = this.disabled || this.readonly;
      if (this._disabled && this._open) {
        this.closePicker();
      }
    }

    if (changedProperties.has('open')) {
      if (this._disabled && this.open) {
        this.open = false;
        this._open = false;
        return;
      }
      this._open = this.open;
    }

    if (this._disabled && this._open) {
      this.closePicker();
    }
  }

  protected $renderContent(): TemplateResult {
    warnUndefinedElement(scDateInputSurfaceName);
    if (this.isMobile) {
      return html`
        <sc-bottom-sheet 
          height=${this.range ? '80%' : '60%'}
          @sc-show=${this.onOpened}
          ?open=${this._open}
          no-header
          no-close-icon
          .anchor=${this as HTMLElement}
          @sc-hide=${this.onClosed}
        >
          <div @click=${(event: MouseEvent) => { event.preventDefault(); event.stopPropagation(); }}>
            ${this._open ? this.$renderSlot() : nothing}
          </div>
        </sc-bottom-sheet>
      `;
    }
    return html`
    <sc-date-input-surface
      part=surface
      class=${
  classMap({
    'with-label': this.hasLabel,
    hoist: !!this.hoist,
    'high-ground': !!this.hoist,
  })
}
      @sc-show=${this.onOpened}
      ?open=${this._open}
      ?stayOpenOnBodyClick=${true}
      .anchor=${this as HTMLElement}
      @sc-hide=${this.onClosed}
    >${
  /**
       * NOTE(motss): This removes/ renders datePicker with a clean slate.
       */
  this._open ? 
    keyed(JSON.stringify(this.value), html`${this.$renderSlot()}`)
  : nothing
}</sc-date-input-surface>
    `;
  }

  protected $renderSlot(): TemplateResult {
    const {
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
    } = this;
    const timeValueStr = timeValue || this.defaultTimeValue;
    return slotDatePicker({
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
      onDatePickerDateUpdated: this.onDatePickerDateUpdated,
      onDatePickerFirstUpdated: this.onDatePickerFirstUpdated,
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
      timeValue: timeValueStr,
    });
  }

  protected $toValueFormatter() {
    return {
      format: (value: any) => dayjs(value).format(this.format),
    };
  }

  public closePicker = (): void =>  {
    this._open = false;
    this.emit('sc-close', {
      detail: {
        type: 'date-input',
        position: this.positionType,
      },
    });
  };

  /* c8 ignore start */
  lazyLoad = async (): Promise<void> => {
    if (this._lazyLoaded || this._lazyLoading) return;

    const deps = [
      scDatePickerName,
      scDateInputSurfaceName,
    ] as const;

    // eslint-disable-next-line
    if (deps.some(n => globalThis.customElements.get(n) == null)) {
      this._lazyLoading = true;

      const tasks = deps.map(n => globalThis.customElements.whenDefined(n));
      const imports = [
        import('../../../../elements/sc-date-picker.js'),
      ];

      try {
        await Promise.all(imports);
        await Promise.all(tasks);
      } catch (error) {
        console.error(error);
      }
    }

    /**
     * NOTE(motss): `lazyLoad()` is called within `render()` so this needs to wait for next update
     * to re-trigger update when it updates `_lazyLoaded`.
     */
    await this.updateComplete;

    this._lazyLoading = false;
    this._lazyLoaded = true;
  };

  onClosed = (event: CustomEvent): void => {
    this.stopDefaultEvent(event);
    if (
      (this.range && this._value?.end === this.value?.end) ||
      this.showTime
    ) {
      return;
    }
    this._open = false;
  };

  onDatePickerDateUpdated = async (ev: CustomEvent): Promise<void> => {
    const {
      isKeypress,
      key,
      value,
      valueAsDate,
      quickSelect,
      timeSelect,
    } = ev.detail;
    /**
     * NOTE(motss): When it is triggered by mouse click or the following keys,
     * update `.value` and close the input surface containing the date picker.
     */
    if (quickSelect || timeSelect) {
      this._open = false;
    }
    if ((this.range && typeof value === 'string' && !timeSelect) || (this.showTime && !timeSelect)) return;

    const nextValue = this.range
      ? value
      : (timeSelect
        ? (typeof value === 'string' && !Number.isNaN(+getDate(value))
          ? value
          : (valueAsDate ?? value))
        : (valueAsDate ?? value));
    if (!isKeypress || (key === keyEnter || key === keySpace)) {
      this._hasInputDraft = false;
      this._inputDraft = '';
      this.updateValues(nextValue, true);
      isKeypress && (await this.$inputSurface)?.close();
    }

    if (this.isMobile && this.range && this.value?.end) {
      this._open = false;
    }
  };

  onDatePickerFirstUpdated = ({
    currentTarget,
    detail: {
      focusableElements: [focusableElement],
    },
  }: CustomEvent): void => {
    this._focusElement = focusableElement;
    this._picker = currentTarget as ScDatePicker;
  };

  onOpened = async ({ detail }: CustomEvent): Promise<void> => {
    await this._picker?.updateComplete;
    await this.updateComplete;

    this._focusElement?.focus();
    this.emit('sc-show', { detail });
  };

  onResetClick = (ev: MouseEvent): void => {
    if (this._disabled) return;

    /**
     * NOTE(motss): To prevent triggering the `focus` event of `TextField` element.
     */
    ev.preventDefault();

    this.reset();
  };

  updateValues = (value: any, emit?: boolean, preserveInputDraft = false): void => {
    let _valueAsDate;
    const getDateString = this.getDateString?.bind(this) ?? ((_:any) => '');
    if (value && (value.start || value.end)) {
      const startDate = value.start ? getDate(value.start) : getDate(this.value.start);
      const endDate = value.end ? getDate(value.end) : getDate(this.value.end);
      // @ts-ignore
      this.value = {
        start: value.start ? getDateString(startDate) : this.value.start,
        end: value.end ? getDateString(endDate) : this.value.end,
      };
      this._valueString = {
        start: value.start ? getDateString(startDate) : this.value.start,
        end: value.end ? getDateString(endDate) : this.value.end,
      };

      _valueAsDate = {
        start: dayjs(startDate),
        end: dayjs(endDate),
      };
    } else if (value) {
      const valueDate = getDate(value);
      this._valueAsDate = valueDate;
      this.value = getDateString(valueDate);
      this._valueString = getDateString(valueDate);
      _valueAsDate = dayjs(valueDate);
    } else {
      this._valueAsDate = undefined;
      this.value = '';
    }

    if (this.showTime) {
      this.updateTimeValue && this.updateTimeValue();
    }

    if (!preserveInputDraft) {
      this._hasInputDraft = false;
      this._inputDraft = '';
    }

    if (emit) {
      this.emit('sc-change', {
        detail: {
          value: this._valueString,
          valueAsDate: _valueAsDate,
        },
      });
    }
  };

  onManualInput = (event: Event): void => {
    // Prevent FormInputBase's generic input listener from writing raw text into this.value.
    if ('stopImmediatePropagation' in event && typeof event.stopImmediatePropagation === 'function') {
      event.stopImmediatePropagation();
    }
    event.stopPropagation();

    if (this._disabled || this.readonly) return;
    const target = event.target as HTMLInputElement | null;
    const inputValue = target?.value ?? '';

    this._hasInputDraft = true;
    this._inputDraft = inputValue;

    if (!inputValue) return;

    const format = this.format as string;
    const hasYearToken = /Y{2,}/.test(format);
    const hasSignedYearInput = /(?:^|\s|-)\+[0-9]+$|(?:^|\s|-)-[0-9]+$/.test(inputValue);
    const allowVariableYearLength = hasYearToken && hasSignedYearInput;

    // Only proceed when the input length matches the format length.
    if (!allowVariableYearLength && inputValue.length !== format.length) return;

    // Parse strictly against the configured format for regular years.
    const parsedByFormat = dayjs(inputValue, format, true);
    let normalizedInput = '';

    if (parsedByFormat.isValid()) {
      normalizedInput = parsedByFormat.format(format);
      if (normalizedInput !== inputValue) return;
    } else {
      // Fall back to getDate for signed/extended years that dayjs strict parsing does not support.
      if (!allowVariableYearLength) return;
      const parsedByGetDate = getDate(inputValue);
      if (!dayjs(parsedByGetDate).isValid()) return;
      normalizedInput = this.getDateString?.(parsedByGetDate) ?? '';
      if (!normalizedInput) return;
    }

    if (this.range && (this.displayValue === 'start' || this.displayValue === 'end')) {
      const currentRangeValue =
        this.value && typeof this.value === 'object' ? this.value : { start: '', end: '' };
      const nextRangeValue = {
        ...currentRangeValue,
        [this.displayValue]: normalizedInput,
      };

      if (nextRangeValue.start && nextRangeValue.end) {
        const startDate = toComparableRangeDate(nextRangeValue.start, this.picker);
        const endDate = toComparableRangeDate(nextRangeValue.end, this.picker);

        if (+startDate > +endDate) {
          this._hasInputDraft = false;
          this._inputDraft = '';
          if (target) {
            target.value = this._valueText || '';
          }
          this.requestUpdate();
          return;
        }
      }

      this.updateValues(
        nextRangeValue,
        true
      );
      return;
    }

    this.updateValues(normalizedInput, true);
  };

  public render() {
    const {
      _lazyLoaded,
      _open,
    } = this;

    if (!_lazyLoaded && _open) this.lazyLoad();

    return html`
    ${this.renderBaseFormInput()}
    ${this.$renderContent()}
    `;
  }

  clearValue(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this._hasInputDraft = false;
    this._inputDraft = '';
    this.value = '';
    this.emit('sc-clear');
    this.closePicker();
  }

  renderMoreIcons() {
    if (this.readonly || this.disabled) return nothing;
    return html`
      <div class="more-icons-container" @click=${this._onClick} data-id=${this._dataId}>
        <div>${this.renderClearablePart()}</div>
        <div class="sc-form-calendar-icon suffix-container">
          <sc-icon size=${this.getCurrentIconSize()} name='calendar--line'></sc-icon>
          <div class=icon-cover data-id=${this._dataId}></div>
        </div>
      </div>
    `;
  }

  override renderFormControl() {
    /**
     * NOTE(motss): All these code are copied from original implementation with minor modification.
     */
    const {
      disabled,
      borderType,
      placeholder,
      required,
      readonly,
      value,
      clearable,
    } = this;

    return readonly ? html`
        <div 
          class='sc-form-control' 
          style='padding-left: 0; padding-right: 0'
        >${this._valueText || value}</div>
      ` : html`
      <input
        part='form-control'
        ?clearable=${clearable}
        ?disabled=${disabled}
        ?required=${required}
        .value=${this._valueText}
        class='${borderType} sc-form-control'
        placeholder=${placeholder || 'Select date'}
        type=text
        data-id=${this._dataId}
        @click=${this._onClick}
        @keyup=${this._onKeyup}
        @input=${this.onManualInput}
      >`;
  }

  /**
   * FIXME(motss): Unable to test the lazy loading in `wtr` due to:
   * 1. Unable to dynamically import `.js` file
   * 2. Unable to dedupe the same custom element caused by dynamic import with import maps
   *
   * Therefore, defer testing the lazy loading until there is a way to test it in `wtr`.
   */
  protected renderTrailingIcon(): TemplateResult {
    return html`
    <sc-button
      .disabled=${this._disabled}
      @click=${this.onResetClick}
      aria-label=${this.clearLabel}
      name='cross'
    >
    </sc-button>
    `;
  }
  /* c8 ignore stop */

  public reset(): void {
    if (this._disabled) return;

    this._hasInputDraft = false;
    this._inputDraft = '';
    this._valueAsDate = undefined;
    this.value = '';
  }

  public showPicker(): void {
    if (this._disabled) return;

    this._open = true;
  }

  public get valueAsDate(): Date | null {
    return this._valueAsDate || null;
  }

  public get valueAsNumber(): number {
    return Number(this._valueAsDate || NaN);
  }
  public get _valueText() {
    let valueText: any = '';
    if (this._hasInputDraft) {
      valueText = this._inputDraft;
      return valueText;
    }
    if (this.range) {
      if (this.displayValue === 'start' && this.value?.start) {
        const date = getDate(this.value.start);
        valueText = formatDisplayText(date, this.format as string, this.picker, this._valueFormatter.format);
      } else if (this.displayValue === 'end' && this.value?.end) {
        const date = getDate(this.value.end);
        valueText = formatDisplayText(date, this.format as string, this.picker, this._valueFormatter.format);
      } else {
        valueText = null;
      }
    } else {
      if (this._valueAsDate) {
        valueText = formatDisplayText(this._valueAsDate, this.format as string, this.picker, this._valueFormatter.format);
      } else {
        valueText = '';
      }
    }

    return valueText;
  }
}

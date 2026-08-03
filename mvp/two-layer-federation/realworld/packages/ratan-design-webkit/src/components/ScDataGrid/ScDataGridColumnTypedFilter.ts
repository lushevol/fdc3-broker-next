import { css, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import '../../../elements/sc-date-picker.js';
import '../../../elements/sc-dropdown-input.js';
import '../../../elements/sc-number-input.js';
import '../../../elements/sc-text-input.js';
import { debounce } from '../../shared/debounce.js';
import ScElement from '../../shared/sc-element.js';
import { isEmptyish, isNotEmptyish } from '../../shared/util.js';
import { watch } from '../../shared/watch.js';
import ScTheme from '../../styles/ScTheme.js';
import {
  AnyFilterMode,
  BindFilterValue,
  FilterDef,
  IFilterModeBetweenValue,
  TypedFilterData,
} from './types/features/ColumnFilterDef.js';
import { E_CELL_DATA_TYPE } from './widgets/CellDataType.js';
import { getFilterModes } from './widgets/FilterModes.js';

export class ScDataGridColumnTypedFilter<
  K extends string & keyof T,
  T extends AnyFilterMode = AnyFilterMode
> extends ScElement {
  static styles = ScTheme.getStyles().concat([
    css`
      .container {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 0.5rem;
      }
      .between-wrap {
        display: flex;
        gap: 0.5rem;

        & + {
          flex: 1;
        }
      }
    `,
  ]);

  @property({ attribute: false }) data?: TypedFilterData<K, T>;
  @property({ attribute: false }) columnType: E_CELL_DATA_TYPE;
  @property({ attribute: false }) filterDef?: FilterDef;
  @property({ attribute: false })
  bindFilterValue: BindFilterValue<TypedFilterData<K, T> | undefined>;

  @state() _tmpMode?: K;
  @state() _tmpValue?: T[K];
  @state() _modes: { label: string; value: string; displayValue: string }[] =
    [];

  @watch('data')
  handleFilterChange() {
    if (this.data?.mode && !isEmptyish(this.data.value)) {
      this._tmpMode = this.data.mode;
      this._tmpValue = this.data.value;
    } else {
      this._tmpValue = undefined;
    }
  }

  @watch('columnType')
  handleColumnTypeChange() {
    const userModes = this.filterDef?.filterParams?.modes ?? [];
    const allModes = getFilterModes(this.filterDef?.filter ?? this.columnType);
    const modes = userModes.length
      ? (userModes
          .map(v => allModes.find(o => o.value === v))
          .filter(v => !!v) as typeof allModes)
      : allModes;
    this._modes = modes.map(v => ({
      ...v,
      displayValue: v.label,
    }));

    if (!this._tmpMode) {
      const defMode =
        this.filterDef?.filterParams?.defaultMode ?? modes[0]?.value;
      if (defMode && modes.findIndex(({ value }) => value === defMode) > -1)
        this._tmpMode = defMode as K;
    }
  }

  private _changeFilter(mode: K | undefined, newValue: T[K] | undefined) {
    let value = newValue;
    if (this._tmpMode !== mode || this._tmpValue !== value) {
      // reset if previous value is either 'between', 'empty', 'notEmpty'
      if (
        this._tmpMode &&
        this._tmpMode !== mode &&
        ['between', 'empty', 'notEmpty'].includes(this._tmpMode)
      )
        value = undefined;

      // store key as default
      this._tmpMode = mode;
      this._tmpValue = value;

      if (isNotEmptyish(mode) && isNotEmptyish(value)) {
        this.data = { mode, value };
      } else {
        this.data = undefined;
      }
      this.bindFilterValue(this.data);
    }
  }

  _renderInputType<R = unknown>(
    value: R | undefined,
    placeholder: string | null,
    onChange: (value: R | undefined) => void
  ) {
    switch (this.filterDef?.filter ?? this.columnType) {
      case E_CELL_DATA_TYPE.number: {
        const cb = debounce(
          (e: CustomEvent) =>
            onChange(
              isNotEmptyish(e.detail.value)
                ? (Number(e.detail.value) as R)
                : undefined
            ),
          300
        );
        return html`<sc-number-input
          placeholder=${placeholder ?? 'Filter...'}
          .value=${value ?? null}
          clearable
          @sc-input=${(e: CustomEvent) => {
            e.stopImmediatePropagation();
            cb(e);
          }}
          @sc-clear=${() => onChange(undefined)}
          @sc-blur=${() => cb.flush()}
        ></sc-number-input>`;
      }
      case E_CELL_DATA_TYPE.date:
        return html`<sc-date-input
          placeholder=${placeholder ?? 'Filter...'}
          .value=${value ?? null}
          clearable
          @sc-change=${(e: CustomEvent) => {
            e.stopImmediatePropagation();
            onChange(e.detail.value);
          }}
          @sc-clear=${() => onChange(undefined)}
        ></sc-date-input>`;
      case E_CELL_DATA_TYPE.text:
      default: {
        const cb = debounce((e: CustomEvent) => onChange(e.detail.value), 300);
        return html`<sc-text-input
          placeholder=${placeholder ?? 'Filter...'}
          .value=${value ?? ''}
          clearable
          @sc-input=${(e: CustomEvent) => {
            e.stopImmediatePropagation();
            cb(e);
          }}
          @sc-clear=${() => onChange(undefined)}
          @sc-blur=${() => cb.flush()}
        ></sc-text-input>`;
      }
    }
  }

  _renderBetween<R extends IFilterModeBetweenValue<number | string | Date>>(
    onChange: (value: R | undefined) => void
  ) {
    const filterValue = (this._tmpValue ?? {}) as R;
    if (this.columnType === E_CELL_DATA_TYPE.date) {
      return html`<sc-date-range-input
        .value=${filterValue?.start || filterValue?.end
          ? filterValue
          : undefined}
        @sc-change=${(e: CustomEvent<{ value: R }>) => {
          onChange(e.detail.value);
          e.stopImmediatePropagation();
        }}
        clearable
        @sc-clear=${() => onChange(undefined)}
        border-type="box"
        size="md"
        .startConfig=${{ placeholder: 'From' }}
        .endConfig=${{ placeholder: 'To' }}
      ></sc-date-range-input>`;
    }
    return html`<div class="between-wrap">
      ${this._renderInputType(filterValue?.start, 'From', start =>
        onChange({ ...filterValue, start })
      )}
      ${this._renderInputType(filterValue?.end, 'To', end =>
        onChange({ ...filterValue, end })
      )}
    </div>`;
  }

  _renderInputs(onChange: (value: unknown) => void) {
    if (this._tmpMode === 'between') {
      return this._renderBetween(value =>
        onChange(value?.start || value?.end ? value : undefined)
      );
    } else if (this._tmpMode === 'empty' || this._tmpMode === 'notEmpty') {
      this.updateComplete.then(() => onChange(true as T[K]));
      return nothing;
    }
    return this._renderInputType(this._tmpValue, null, value =>
      onChange(value)
    );
  }

  render() {
    return html`<div class="container">
      <sc-dropdown-input
        .data=${this._modes}
        .value=${this._tmpMode}
        hoist
        @sc-select=${(e: CustomEvent<{ value: K }>) =>
          this._changeFilter(e.detail.value, this._tmpValue)}
        ?clearable=${isNotEmptyish(this._tmpValue)}
        @sc-clear=${() => this._changeFilter(undefined, undefined)}
      ></sc-dropdown-input>
      ${this._renderInputs(value =>
        this._changeFilter(this._tmpMode, value as T[K])
      )}
    </div>`;
  }
}

if (!customElements.get('sc-data-grid-column-typed-filter')) customElements.define('sc-data-grid-column-typed-filter', ScDataGridColumnTypedFilter);

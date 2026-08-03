import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import style, { classNamePrefix } from './ScDataGridCompositeFilter.style.js';
import { StyleToolMixin } from './mixins/style-tool-mixin.js';
import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import '../../../elements/sc-modal.js';
import '../../../elements/sc-button.js';
import '../../../elements/sc-icon.js';
import { ColumnFilter, FilterFn, Table, flexRender } from '@tanstack/lit-table';
import { ROW_SELECTION_COLUMN_ID } from './mixins/features/row-selection-mixin.js';
import { repeat } from 'lit/directives/repeat.js';

export class ScDataGridCompositeFilter extends StyleToolMixin(classNamePrefix)(
  ScElement
) {
  static styles = ScTheme.getStyles().concat([style]);
  @property({ type: Object }) table: Table<unknown>;

  @state()
  values = new Map<string, any>();

  get columns() {
    return this.table
      .getVisibleLeafColumns()
      .filter(column => column.id !== ROW_SELECTION_COLUMN_ID)
      .filter(column => column.getCanFilter());
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.columns.forEach(column => {
      this.values.set(column.id, column.getFilterValue());
    });
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.values = new Map();
  }
  handleModalHide() {
    this.values = new Map();
    this.emit('sc-hide');
  }

  updateValues = (columnId: string, value: any) => {
    this.values.set(columnId, value);

    const columnFilters: ColumnFilter[] = [];
    this.values.forEach((value, columnId) => {
      columnFilters.push({
        id: columnId,
        value,
      });
    });
    this.table.setColumnFilters(columnFilters);
    this.emitFilterEvent();
    this.requestUpdate();
  };

  renderContent() {
    return html` <div class="${this.makeClassName('content')}">
      ${repeat(
        this.columns,
        column => column.id,
        column => {
          const header = this.table
            .getLeafHeaders()
            .find(header => header.column === column);
          let title;
          if (header) {
            title = flexRender(column.columnDef.header, header.getContext());
          } else {
            title = column.id;
          }
          return html`<div class="${this.makeClassName('item')}">
            <div class="${this.makeClassName('field-title')}">${title}</div>
            ${column.getFilterWidget()?.({
              value: this.values.get(column.id),
              bindFilterValue: value => this.updateValues(column.id, value),
              table: this.table,
              column,
              filterDef: {
                ...(column.columnDef.meta ??= {}),
                filterFn: column.columnDef.filterFn as FilterFn<unknown> | undefined,
              },
            })}
          </div>`;
        }
      )}
    </div>`;
  }

  emitFilterEvent() {
    this.emit('sc-filter');
  }
  resetAllColumnFilters() {
    this.table.resetColumnFilters(true);

    this.columns.forEach(column => {
      this.values.set(column.id, column.getFilterValue());
    });
    this.requestUpdate();
    this.emitFilterEvent();
  }
  render() {
    return html` <sc-modal
      no-header
      no-footer
      no-padding
      no-close-icon
      open
      size="lg"
      @sc-hide=${this.handleModalHide}
    >
      <div class="${this.makeClassName('root')}">
        <div class="${this.makeClassName('header')}">
          <div class="${this.makeClassName('title')}">Filters</div>
          <sc-icon
            class="close-icon"
            name="cross"
            size="sm"
            @click=${this.handleModalHide}
          ></sc-icon>
        </div>
        ${this.renderContent()}

        <div class="${this.makeClassName('footer')}">
          <sc-button
            type="link"
            size="sm"
            no-pill
            compact
            @click=${this.resetAllColumnFilters}
          >
            Clear filters
          </sc-button>
        </div>
      </div>
    </sc-modal>`;
  }
}

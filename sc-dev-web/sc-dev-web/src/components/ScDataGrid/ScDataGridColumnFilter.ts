import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { PopupMixin } from '../../mixins/popup-mixin.js';
import ScElement from '../../shared/sc-element.js';
import ScTheme from '../../styles/ScTheme.js';
import style, { classNamePrefix } from './ScDataGridColumnFilter.style.js';
import '../../../elements/sc-dropdown-input.js';
import '../../../elements/sc-button.js';
import { Column, FilterFn, Table } from '@tanstack/lit-table';
import { watch } from '../../shared/watch.js';
import { StyleToolMixin } from './mixins/style-tool-mixin.js';
import { keyEscape } from '../../shared/key-values.js';
import { PopupHandledMixin } from '../../mixins/popup-handled-mixin.js';
import { when } from 'lit/directives/when.js';
import { renderMultipleDropdown } from './widgets/FilterType.js';

export class ScDataGridColumnFilter extends StyleToolMixin(classNamePrefix)(
  PopupHandledMixin(PopupMixin(ScElement))
) {
  static styles = ScTheme.getStyles().concat([style]);

  @property({ type: Object })
  column?: Column<unknown, unknown>;
  @property({ type: Object })
  table: Table<unknown>;

  filterValue: unknown;
  protected _renderCount = 0;

  @watch('column')
  handleColumnInstanceChange() {
    this.filterValue = this.column?.getFilterValue();
    this._renderCount = 0;
  }

  // disabled hide on scroll
  override popupHandleWinScroll = undefined;

  renderPlaceholder() {
    return nothing;
  }

  handleFilterChange = (value: unknown) => {
    this.filterValue = value;
    this.column?.setFilterValue(this.filterValue);
    this.emitFilterEvent();
    this.requestUpdate();
  };

  get type() {
    if (!this.column) {
      return false;
    }
    return this.column.getColumnFilterType();
  }

  // it conflicts with filter close icon button
  handleFocusout() {
    if (this.isPopupActive && !this.shadowRoot?.activeElement) {
      this.hidePopup();
    }
  }
  handleKeydown(e: KeyboardEvent) {
    if (e.key === keyEscape && this.isPopupActive) {
      e.stopPropagation();
      e.preventDefault();
      this.hidePopup();
    }
  }
 
  connectedCallback(): void {
    super.connectedCallback();
    // this.addEventListener('focusout', this.handleFocusout);
    this.addEventListener('keydown', this.handleKeydown);
    this.setAttribute('tabindex', '-1');
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    // this.removeEventListener('focusout', this.handleFocusout);
    this.removeEventListener('keydown', this.handleKeydown);
  }

  emitFilterEvent() {
    this.emit('sc-filter');
  }

  renderContent() {
    const column = this.column;
    const filterWidget = column?.getFilterWidget();
    if (!column || !filterWidget) return nothing;

    /// this ensures that filter cache is used instead of template result on 1st render
    if (filterWidget === renderMultipleDropdown && this._renderCount++ === 0)
      this.updateComplete.then(() => this.requestUpdate());

    return html`<div
      class="${this.makeClassName('content')}"
      style="width: ${column.getSize()}px"
    >
      ${filterWidget({
        value: this.filterValue,
        bindFilterValue: this.handleFilterChange,
        table: this.table,
        column,
        filterDef: {
          ...(column.columnDef.meta ??= {}),
          filterFn: column.columnDef.filterFn as FilterFn<unknown> | undefined,
        },
      })}
    </div>`;
  }
  render() {
    return html`
      <sl-popup placement="bottom-start" strategy="fixed" flip shift distance="8">
        ${this.type ? this.renderContent() : this.renderPlaceholder()}
      </sl-popup>
    `;
  }
}

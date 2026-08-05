import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item.component.js';
import SlPopup from '@shoelace-style/shoelace/dist/components/popup/popup.component.js';
import { TemplateResult, html, nothing, render } from 'lit';
import { property, state } from 'lit/decorators.js';
import ScElement from '../../shared/sc-element.js';
import ScTheme from '../../styles/ScTheme.js';
import style, { classNamePrefix } from './ScDataGridColumnManager.style.js';
import { StyleToolMixin } from './mixins/style-tool-mixin.js';
import {
  Column,
  ColumnOrderState,
  Header,
  Table,
  VisibilityState,
  flexRender,
} from '@tanstack/lit-table';
import { PopupMixin } from '../../mixins/popup-mixin.js';
import { PopupHandledMixin } from '../../mixins/popup-handled-mixin.js';
import '../../../elements/sc-checkbox.js';
import '../../../elements/sc-text-input.js';
import { repeat } from 'lit/directives/repeat.js';
import { dragHandler, renderExpand } from './widgets/svg.js';
import { debounce } from '../../shared/debounce.js';
import { styleMap } from 'lit/directives/style-map.js';
import { classMap } from 'lit/directives/class-map.js';
import { watch } from '../../shared/watch.js';

const ALL = Symbol('ALL').toString() as unknown as Column<unknown, unknown>;

export class ScDataGridColumnManager extends StyleToolMixin(classNamePrefix)(
  PopupHandledMixin(PopupMixin(ScElement))
) {
  static styles = ScTheme.getStyles().concat([style]);

  static get scopedElements() {
    return {
      'sl-menu-item': SlMenuItem,
      'sl-popup': SlPopup,
    };
  }

  @property({ type: Object }) table: Table<unknown>;
  @property({ type: Object }) columnVisibility?: VisibilityState;
  @property({ type: Array }) columnOrder?: ColumnOrderState;
  @property({ type: Boolean, attribute: 'enable-order', reflect: true })
  enableOrder?: boolean;
  @property({ type: Boolean, attribute: 'enable-visibility', reflect: true })
  enableVisibility?: boolean;
  @property({ type: Boolean, attribute: 'dynamic-column-width', reflect: true })
  dynamicColumnWidth?: boolean;

  @state()
  searchText = '';
  @state()
  matchedColumns = new Set<Column<unknown, unknown>>();

  @state()
  hasExpandableHeader = false;

  @state()
  expandedHeaders: Set<Column<unknown, unknown>> = new Set();
  
  private _cachedLabelText = new Map<string, string>();

  @watch('searchText')
  handleSearchTextChange() {
    const matchHeaders = this.flattenHeaders
      .filter(haeder => !haeder.isPlaceholder)
      .filter(header => {
        const text = this.renderLabelText(header);
        return text.toLowerCase().includes(this.searchText.toLowerCase());
      });
    const matchedColumns = new Set<Column<unknown, unknown>>();
    matchHeaders.forEach(header => {
      let currentColumn: Column<unknown, unknown> | undefined = header.column;
      while (currentColumn) {
        matchedColumns.add(currentColumn);
        currentColumn = currentColumn.parent;
      }
    });
    this.matchedColumns = matchedColumns;
  }

  allExpandableHeaders: Set<Column<unknown, unknown>> = new Set();

  detectExpandable(headers: Header<unknown, unknown>[]) {
    while (headers.length) {
      const header = headers.shift();
      if (header) {
        const isExpandable =
          !header.isPlaceholder && header.subHeaders.length > 0;
        if (isExpandable) {
          this.hasExpandableHeader = true;
          this.allExpandableHeaders.add(header.column);
        }
        if (header.column.getIsPinned()) {
          this.updateColumnMeta(header.column);
        }
        headers.push(...header.subHeaders);
      }
    }
  }

  @watch(['table', 'columnVisibility', 'columnOrder'])
  handleTableChange() {
    this.detectExpandable(this.highestHeaders);
    this._cachedLabelText.clear();
  }

  get highestHeaders() {
    return this.table.getHighestHeaders();
  }

  get flattenHeaders() {
    return this.table.getFlattenHeaders();
  }

  get toggleableColumns() {
    return this.flattenHeaders
      .filter(header => !this.isDisableVisibility(header.column))
      .map(header => header.column);
  }

  handleSelectAll(e: CustomEvent<{ checked: boolean }>) {
    const isChecked = e.detail.checked;
    this.table.setColumnVisibility(old => {
      return {
        ...old,
        ...this.toggleableColumns.reduce(
          (obj, column) => ({
            ...obj,
            [column.id]: isChecked,
          }),
          {}
        ),
      };
    });
  }
  handleSearch = debounce((e: CustomEvent<{ value: string }>) => {
    this.searchText = e.detail.value;
  }, 500);
  handleClearSearch() {
    this.searchText = '';
  }

  override popupHandleWinMousedown = (e: Event) => {
    if (
      this.isPopupActive &&
      !e
        .composedPath()
        .find(el => el === this || el === this.popupElement.anchor)
    ) {
      this.hidePopup();
    }
  };

  getIsAllColumnsVisible() {
    return !this.toggleableColumns.some(column => !column.getIsVisible?.());
  }
  getIsSomeColumnsVisible() {
    return this.toggleableColumns.some(column => column.getIsVisible?.());
  }

  renderActions() {
    return html`
      <div class="${this.makeClassName('actions-wrapper')}">
        ${this.renderExpandedTrigger(ALL)}
        <sc-checkbox
          ?disabled=${!this.enableVisibility}
          ?checked=${this.getIsAllColumnsVisible()}
          ?indeterminate=${this.getIsSomeColumnsVisible() &&
          !this.getIsAllColumnsVisible()}
          @sc-change=${this.handleSelectAll}
        ></sc-checkbox>
        <sc-text-input
          clearable
          placeholder="Search"
          prefix-icon="search"
          size="sm"
          @sc-clear=${this.handleClearSearch}
          @sc-input=${(e: CustomEvent) => this.handleSearch(e)}
        >
        </sc-text-input>
      </div>
    `;
  }
  handleCheckboxChange(
    e: CustomEvent<{ checked: boolean }>,
    header: Header<unknown, unknown>
  ) {
    header
      .getLeafHeaders()
      .forEach(header => header.column.toggleVisibility(e.detail.checked));
    this.updateColumnWidth();
  }
  updateColumnWidth() {
    if (!this.dynamicColumnWidth) {
      return;
    }
    const node = this.shadowRoot?.host.getRootNode();
    if (node && node instanceof ShadowRoot) {
      const dataGrid = node.host;
      this.table.calculateTableSizing(dataGrid.clientWidth);
    }
  }

  getCheckboxContentFromComposedPath(e: DragEvent) {
    const path = e.composedPath();
    if (path) {
      const checkboxContent = path.find(el => {
        if (el instanceof HTMLElement) {
          return el.classList.contains(this.makeClassName('checkbox-content'));
        }
      });
      return checkboxContent as HTMLElement;
    }
    return null;
  }

  draggedEl: HTMLElement | null;

  handleDragstart(e: DragEvent) {
    const checkboxContent = this.getCheckboxContentFromComposedPath(e);
    if (checkboxContent && e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      this.draggedEl = checkboxContent;
      this.draggedEl.classList.add(this.makeClassName('drag-active'));
    }
  }

  handleDragover(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';

      const checkboxContent = this.getCheckboxContentFromComposedPath(e);
      if (this.draggedEl === checkboxContent) {
        return;
      }
      if (checkboxContent) {
        const { top, bottom } = checkboxContent.getBoundingClientRect();
        if (e.clientY < (top + bottom) / 2) {
          checkboxContent.setAttribute('placement', 'before');
        } else {
          checkboxContent.setAttribute('placement', 'after');
        }
      }
    }
  }
  handleDrop(e: DragEvent) {
    const checkboxContent = this.getCheckboxContentFromComposedPath(e);
    if (this.draggedEl === checkboxContent) {
      return;
    }
    if (checkboxContent && this.draggedEl) {
      const placement = checkboxContent.getAttribute('placement');
      const sourceHeaderId = this.draggedEl.dataset.id as string;
      const targetHeaderId = checkboxContent.dataset.id as string;
      const columnOrder: string[] = [];

      const sourceHeader = this.flattenHeaders.find(
        header => header.id === sourceHeaderId
      ) as Header<unknown, unknown>;
      const targetHeader = this.flattenHeaders.find(
        header => header.id === targetHeaderId
      ) as Header<unknown, unknown>;

      const sourceHeaders = this.table.getDeepestHeader(sourceHeader);
      const targetHeaders = this.table.getDeepestHeader(targetHeader);

      const allHeaders = this.highestHeaders.flatMap(header =>
        this.table.getDeepestHeader(header)
      );
      for (let i = 0, len = allHeaders.length; i < len; ++i) {
        let header = allHeaders[i];
        if (sourceHeaders.includes(header)) {
          continue;
        }

        const matchedHeaders: Header<unknown, unknown>[] = [];
        while (targetHeaders.includes(header)) {
          matchedHeaders.push(header);
          i += 1;
          header = allHeaders[i];
        }

        if (matchedHeaders.length) {
          if (placement === 'before') {
            columnOrder.push(
              ...this.table
                .getDeepestHeader(sourceHeader)
                .map(header => header.column.id)
            );
            columnOrder.push(...matchedHeaders.map(header => header.column.id));
          } else if (placement === 'after') {
            columnOrder.push(...matchedHeaders.map(header => header.column.id));
            columnOrder.push(
              ...this.table
                .getDeepestHeader(sourceHeader)
                .map(header => header.column.id)
            );
          }
          i -= 1;
        } else {
          columnOrder.push(
            ...this.table
              .getDeepestHeader(header)
              .map(header => header.column.id)
          );
        }
      }
      checkboxContent.removeAttribute('placement');
      this.table.setColumnOrder(columnOrder);
    }
  }
  handleDragend(e: DragEvent) {
    const checkboxContent = this.getCheckboxContentFromComposedPath(e);
    checkboxContent?.removeAttribute('placement');
    this.draggedEl?.classList.remove(this.makeClassName('drag-active'));
    this.draggedEl = null;
  }
  handleDragleave(e: DragEvent) {
    const checkboxContent = this.getCheckboxContentFromComposedPath(e);
    checkboxContent?.removeAttribute('placement');
  }

  isDisableVisibility(column: Column<unknown, unknown>) {
    if (!this.enableVisibility) {
      return true;
    }
    const lock = column.columnDef.meta?.lock ?? false;
    if (typeof lock === 'boolean') {
      return lock;
    }
    return lock === 'visibility';
  }
  isDisableOrderring(header: Header<unknown, unknown>) {
    if (!this.enableOrder) {
      return true;
    }
    const leafHeaders = header.getLeafHeaders();
    return leafHeaders.every(header => {
      const lock = header.column.columnDef.meta?.lock ?? false;
      if (typeof lock === 'boolean') {
        return lock;
      }
      return lock === 'ordering';
    });
  }

  renderLabel(header: Header<unknown, unknown>) {
    const columnManagerLabel = header.column.columnDef.meta?.columnManagerLabel;
    if (columnManagerLabel) {
      if (typeof columnManagerLabel === 'function') {
        return columnManagerLabel({
          table: this.table,
          column: header.column,
        });
      } else {
        return columnManagerLabel;
      }
    }
    return flexRender(header.column.columnDef.header, header.getContext());
  }
  renderLabelText(header: Header<unknown, unknown>) {
    if (!this._cachedLabelText.has(header.id)) {
      const label = this.renderLabel(header);
      if (typeof label === 'string') {
        return label;
      }
      const div = document.createElement('div');
      render(label, div);
      this._cachedLabelText.set(header.id, div.textContent || '');
    }
    return this._cachedLabelText.get(header.id) ?? '';
  }

  updateColumnMeta(column: Column<unknown, unknown>) {
    const columnMetaRef = column.columnDef.meta || {};
    if (columnMetaRef.lock === 'visibility') {
      columnMetaRef.lock = true;
    } else {
      columnMetaRef.lock = columnMetaRef.lock ?? 'ordering';
    }
  }

  handleExpand(column: Column<unknown, unknown>) {
    if (column === ALL) {
      if (this.expandedHeaders.has(ALL)) {
        this.expandedHeaders = new Set();
      } else {
        this.expandedHeaders = new Set([...this.allExpandableHeaders]);
      }
    } else if (this.expandedHeaders.has(column)) {
      this.expandedHeaders.delete(column);
    } else {
      this.expandedHeaders.add(column);
    }

    this.expandedHeaders = new Set(this.expandedHeaders);
    if (
      [...this.expandedHeaders].filter(id => id !== ALL).length ===
      this.allExpandableHeaders.size
    ) {
      this.expandedHeaders.add(ALL);
    } else {
      this.expandedHeaders.delete(ALL);
    }
  }
  getIsExpanded(column: Column<unknown, unknown>) {
    const isAll = column === ALL;
    if (isAll) {
      return this.expandedHeaders.has(ALL);
    }
    return [...this.expandedHeaders]
      .map(expandedHeader => expandedHeader)
      .includes(column);
  }

  renderExpandedTrigger(column: Column<unknown, unknown>, visible = true) {
    if (!this.hasExpandableHeader) {
      return nothing;
    }
    return html` <div
      @click=${() => this.handleExpand(column)}
      style=${styleMap({
        visibility: visible ? 'visible' : 'hidden',
        pointerEvents: visible ? 'auto' : 'none',
      })}
      class=${classMap({
        [this.makeClassName('expanded')]: true,
        [this.makeClassName('expanded-active')]: this.getIsExpanded(column),
      })}
    >
      ${renderExpand()}
    </div>`;
  }
  renderSubheaders(header: Header<unknown, unknown>) {
    if (header.isPlaceholder) {
      return nothing;
    } else {
      if (!this.getIsExpanded(header.column)) {
        return nothing;
      }
      return html` <div
        style=${styleMap({
          marginLeft: `${header.depth * 20}px`,
        })}
      >
        ${repeat(
          header.subHeaders,
          header => header.id,
          header => {
            return this.renderHierarchicalHeaders(header);
          }
        )}
      </div>`;
    }
  }

  // ANA: Column<unknown, unknown> is the actual working item
  getIsAllColumnsVisibleUnder(header: Header<unknown, unknown>) {
    return !header
      .getLeafHeaders()
      .filter(header => !header.isPlaceholder)
      .filter(header => header.subHeaders.length === 0)
      .some(header => !header.column.getIsVisible?.());
  }
  getIsSomeColumnsVisibleUnder(header: Header<unknown, unknown>) {
    return header
      .getLeafHeaders()
      .filter(header => !header.isPlaceholder)
      .filter(header => header.subHeaders.length === 0)
      .some(header => header.column.getIsVisible?.());
  }

  renderResetItem() {
    return html`
      <sl-menu-item
        class="${this.makeClassName('menu-item')}"
        @click=${() => {
          this.table.resetColumnVisibility();
          this.table.resetColumnOrder();
          this.updateColumnWidth();
        }}
      >
        Reset
      </sl-menu-item>
    </div>`;
  }

  renderHierarchicalHeaders(
    header: Header<unknown, unknown>
  ): TemplateResult<1> | typeof nothing {
    const label = this.renderLabel(header);
    if (!this.matchedColumns.has(header.column)) {
      return nothing;
    }

    // use header.id to anchor the drag and drop
    return html`
      <div
        draggable="${this.isDisableOrderring(header) ? 'false' : 'true'}"
        data-id="${header.id}"
        @dragstart=${this.handleDragstart}
        @dragover=${this.handleDragover}
        @drop=${this.handleDrop}
        @dragend=${this.handleDragend}
        @dragleave=${this.handleDragleave}
        class="${this.makeClassName('checkbox-content')}"
      >
        ${header.isPlaceholder
          ? this.renderExpandedTrigger(header.column, false)
          : header.subHeaders.length
          ? this.renderExpandedTrigger(header.column)
          : this.renderExpandedTrigger(header.column, false)}
        <sc-checkbox
          @mousedown=${(e: Event) => e.preventDefault()}
          ?disabled=${this.isDisableVisibility(header.column)}
          ?checked=${this.getIsAllColumnsVisibleUnder(header)}
          ?indeterminate=${this.getIsSomeColumnsVisibleUnder(header) &&
          !this.getIsAllColumnsVisibleUnder(header)}
          @sc-change=${(e: CustomEvent) => this.handleCheckboxChange(e, header)}
          value="${header.column.id}"
        ></sc-checkbox>
        <div
          ?disabled=${this.isDisableOrderring(header)}
          class="${this.makeClassName('drag')}"
        >
          ${dragHandler()}
        </div>
        <div
          @mousedown=${(e: Event) => e.preventDefault()}
          data-test=${header.column.id}
          class="${this.makeClassName('column-label')}"
        >
          ${label}
        </div>
      </div>
      ${this.renderSubheaders(header)}
    `;
  }

  renderColumnGroups() {
    return html`
      <div class="${this.makeClassName('columns-wrapper')}">
        ${repeat(
          this.highestHeaders,
          header => header.id,
          header => {
            return html`${this.renderHierarchicalHeaders(header)}`;
          }
        )}
      </div>
    `;
  }

  render() {
    return html`
      <sl-popup
        shift
        auto-size="both"
        strategy="fixed"
        placement="bottom-end"
        flip
        distance="8"
        skidding="10"
      >
        <div class="${this.makeClassName('root')}">
          ${this.renderResetItem()}
          ${this.renderActions()} ${this.renderColumnGroups()}
        </div>
      </sl-popup>
    `;
  }
}

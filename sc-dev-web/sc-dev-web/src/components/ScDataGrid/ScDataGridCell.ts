import { PropertyValueMap, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import ScElement from '../../shared/sc-element.js';
import ScTheme from '../../styles/ScTheme.js';
import style, { classNamePrefix } from './ScDataGridCell.style.js';
import { Cell, Header, Row, Table, flexRender } from '@tanstack/lit-table';
import { classMap } from 'lit/directives/class-map.js';
import { StyleToolMixin } from './mixins/style-tool-mixin.js';
import { SortDirection } from './types/features/RowSortingDef.js';
import { debounce } from '../../shared/debounce.js';
import { cache } from 'lit/directives/cache.js';
import { ROW_SELECTION_COLUMN_ID } from './mixins/features/row-selection-mixin.js';
import { ColumnStyleDef } from './types/features/ColumnStyleDef.js';
import { styleMap } from 'lit/directives/style-map.js';
import { StyleInfo } from './types/utils.js';
import { renderExpand, renderFilter, renderSort } from './widgets/svg.js';
import '../../../elements/sc-icon.js';
import { CUSTOM_EVENTS_TYPE } from '../../shared/sc-custom-events.js';

export class ScDataGridCell extends StyleToolMixin(classNamePrefix)(ScElement) {
  static styles = ScTheme.getStyles().concat([style]);

  @property({
    type: Boolean,
    attribute: 'is-row-indeterminated',
    reflect: true,
  })
  isRowIndeterminated?: boolean;
  @property({ type: Boolean, attribute: 'is-column-filtered', reflect: true })
  isColumnFiltered?: boolean;
  @property({ type: Boolean, attribute: 'is-row-selected', reflect: true })
  isRowSelected?: boolean;
  @property({
    type: Boolean,
    attribute: 'is-hide-row-selection',
    reflect: true,
  })
  isHideRowSelection?: boolean;
  @property({ type: Boolean, attribute: 'is-selection-radio', reflect: true })
  isSelectionRadio?: boolean;
  @property({ type: Boolean, attribute: 'is-placeholder', reflect: true })
  isPlaceholder?: boolean;
  @property({ type: Boolean, attribute: 'is-draggable', reflect: true })
  isDraggable?: boolean;
  @property({ type: Boolean, attribute: 'is-cell-spanning', reflect: true })
  isCellSpanning?: boolean;
  @property({ type: Boolean, attribute: 'is-can-expand', reflect: true })
  isCanExpand?: boolean;
  @property({ type: Boolean, attribute: 'is-aggregated', reflect: true })
  isAggregated?: boolean;
  @property({ type: Boolean, attribute: 'is-expanded', reflect: true })
  isExpanded: boolean;
  @property({ type: Object }) table: Table<unknown>;
  @property({ type: Object }) header?: Header<unknown, unknown>;
  @property({ type: Object }) cell?: Cell<unknown, unknown>;
  @property({ type: Object }) getCellStyle?: ColumnStyleDef['getCellStyle'];
  @property({ type: Object }) getHeaderStyle?: ColumnStyleDef['getHeaderStyle'];
  @property({ type: Object }) customizedRowStyle?: StyleInfo;
  @property({ type: Boolean, reflect: true }) sortable?: boolean;
  @property({ type: String, reflect: true }) sort?: SortDirection;
  @property({ type: Number, attribute: 'row-index', reflect: true })
  rowIndex?: number;
  @property({ type: String, attribute: 'row-id', reflect: true })
  rowId?: string;
  @property({ type: Boolean, reflect: true }) filterable?: boolean;

  @property({ type: Boolean }) enableKeyboard = false;

  currentCellHeight = -1;
  resizeObserver: ResizeObserver;
  emitHeightUpdate = debounce((height: number) => {
    if (isNaN(height)) {
      return;
    }
    if (height === this.currentCellHeight) {
      return;
    }
    const rowEl = this.parentElement?.parentElement;
    const column = this.header?.column ?? this.cell?.column;
    const columnId = column?.id;
    if (!rowEl || !columnId) {
      return;
    }
    this.currentCellHeight = height;
    this.emit('sc-dimension-update', {
      detail: {
        height,
        rowIndex: this.rowIndex,
        rowId: this.rowId,
        columnId,
      },
    });
  }, 30);

  get columnSpan() {
    return (
      this.header?.colSpan ?? (this.cell?.getSpannedColumns().length ?? 0) + 1
    );
  }

  constructor() {
    super();
    this.resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        const height = Math.ceil(entry.borderBoxSize[0].blockSize);
        this.emitHeightUpdate(Number(height));
      }
    });
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.isCellSpanning) {
      this.resizeObserver.observe(this);
    }
  }
  emitScShowFromCell(e: Event) {
    this.emit('sc-show', {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {
        e,
      },
    });
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties);

    this.shadowRoot?.addEventListener(
      'sl-show',
      (e: Event) => {
        this.emitScShowFromCell(e);
      },
      {
        capture: true,
      }
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (!this.isCellSpanning) {
      this.resizeObserver.disconnect();
    }
  }

  getTitle(renderContent: unknown) {
    return typeof renderContent === 'string' ? renderContent : '';
  }

  renderHeader() {
    if (!this.header) {
      return nothing;
    }
    const renderContent = this.header.render();
    return html` <div
      title=${this.getTitle(renderContent)}
      class="${this.makeClassName('content')}"
    >
      ${renderContent}
    </div>`;
  }
  renderCell() {
    if (!this.cell) {
      return nothing;
    }
    if (this.cell.column.id === ROW_SELECTION_COLUMN_ID) {
      return html` <div class="${this.makeClassName('content')}">
        ${flexRender(this.cell.column.columnDef.cell, this.cell.getContext())}
      </div>`;
    }
    if (this.isPlaceholder) {
      return nothing;
    }
    const renderContent = this.cell.render();
    return html` <div
      title=${this.getTitle(renderContent)}
      class="${this.makeClassName('content')}"
    >
      ${renderContent}
    </div>`;
  }
  renderCellBaseonType(cell: Cell<unknown, unknown>) {
    const renderFn = cell.getRenderFnBaseonType();
    return flexRender(renderFn, cell.getContext());
  }

  renderContent() {
    return this.getOneUnderCriteria(
      this.renderHeader(),
      this.renderCell(),
      nothing
    );
  }

  get scope() {
    return this.getOneUnderCriteria('header', 'cell', false);
  }

  getOneUnderCriteria<H, C, N = undefined>(header: H, cell: C, neither: N) {
    if (this.header) {
      return header;
    } else if (this.cell) {
      return cell;
    } else {
      return neither;
    }
  }

  handleSort(e: MouseEvent) {
    this.emit('sc-sort', {
      detail: {
        isMulti: e.shiftKey,
      },
    });
  }

  renderSort() {
    if (!this.sortable) {
      return nothing;
    }
    return html` <div
      @click=${this.handleSort}
      class="${this.makeClassName('sort')}"
    >
      <div class="${this.makeClassName('indicator-box')}">
        ${renderSort({
          asc: this.sort === 'asc',
          desc: this.sort === 'desc',
        })}
      </div>
    </div>`;
  }

  renderFilter() {
    if (!this.filterable) {
      return nothing;
    }
    return html` <div
      class=${classMap({
        [this.makeClassName('filter')]: true,
      })}
      style=${styleMap({
        '--sc-filter-active-color': this.isColumnFiltered
          ? 'var(--sc-color-blue-500)'
          : '',
      })}
      @mousedown=${() => {
        this.emit('sc-change', {
          detail: {
            type: 'mousedown',
          },
        });
      }}
      @mouseup=${() => {
        this.emit('sc-change', {
          detail: {
            type: 'mouseup',
            target: this,
          },
        });
      }}
    >
      <div class="${this.makeClassName('indicator-box')}">
        ${renderFilter()}
      </div>
    </div>`;
  }
  renderHeaderSuffixIndicator() {
    if (!this.header) {
      return nothing;
    }
    if (this.header.isPlaceholder) {
      return nothing;
    }
    return html` ${this.renderSort()} ${this.renderFilter()} `;
  }
  renderCellSuffixIndicator() {
    return nothing;
  }
  renderSuffixIndicator() {
    return html`
      ${this.getOneUnderCriteria(
        this.renderHeaderSuffixIndicator(),
        this.renderCellSuffixIndicator(),
        nothing
      )}
    `;
  }
  renderHeaderPrefixIndicator() {
    return nothing;
  }
  handleRowExpand(cell: Cell<unknown, unknown>, e: Event) {
    this.emit('sc-expand', {
      detail: {
        value: cell,
      },
    });
    e.stopPropagation();
  }

  emitDragEvent(
    eventName: string & keyof CUSTOM_EVENTS_TYPE,
    e: DragEvent,
    row: Row<unknown>
  ) {
    this.emit(eventName, {
      detail: {
        event: e,
        row,
      },
    });
  }
  handleDragstart(e: DragEvent, row: Row<unknown>) {
    this.emitDragEvent('sc-dragstart', e, row);
  }
  handleDragover(e: DragEvent, row: Row<unknown>) {
    this.emitDragEvent('sc-dragover', e, row);
  }
  handleDrop(e: DragEvent, row: Row<unknown>) {
    this.emitDragEvent('sc-drop', e, row);
  }
  handleDragend(e: DragEvent, row: Row<unknown>) {
    this.emitDragEvent('sc-dragend', e, row);
  }
  handleDragleave(e: DragEvent, row: Row<unknown>) {
    this.emitDragEvent('sc-dragleave', e, row);
  }
  renderCellPrefixIndicator() {
    if (!this.cell) {
      return nothing;
    }
    const row = this.cell.row;
    const draggable = cache(
      this.isDraggable
        ? html` <sc-icon
            draggable="true"
            @dragstart=${(e: DragEvent) => this.handleDragstart(e, row)}
            @dragover=${(e: DragEvent) => this.handleDragover(e, row)}
            @drop=${(e: DragEvent) => this.handleDrop(e, row)}
            @dragend=${(e: DragEvent) => this.handleDragend(e, row)}
            @dragleave=${(e: DragEvent) => this.handleDragleave(e, row)}
            name="drag-handle"
            size="sm"
            style="cursor: pointer; color: var(--sc-data-grid-draggable-icon-color);"
          ></sc-icon>`
        : nothing
    );
    const expandable = cache(
      this.isCanExpand
        ? html`
            <div
              @click=${(e: Event) => this.handleRowExpand(this.cell as any, e)}
              class=${classMap({
                [this.makeClassName('expanded')]: true,
                [this.makeClassName('expanded-active')]: this.isExpanded,
              })}
            >
              ${renderExpand()}
            </div>
          `
        : nothing
    );
    return html` ${draggable} ${expandable} `;
  }
  renderPrefixIndicator() {
    return html`
      ${this.cell?.getIsGroupingTreeColumn() && this.cell?.row.depth
        ? html`<div
            class="${this.makeClassName('indent')}"
            style="width: calc(1rem * ${this.cell.row.depth +
            (this.isCanExpand ? 0 : 1.625)});"
          ></div>`
        : undefined}
      ${this.getOneUnderCriteria(
        this.renderHeaderPrefixIndicator(),
        this.renderCellPrefixIndicator(),
        nothing
      )}
    `;
  }

  get customizedStyle() {
    return (
      this.getOneUnderCriteria(
        this.header ? this.getHeaderStyle?.(this.header) ?? {} : {},
        {
          ...this.customizedRowStyle,
          ...(this.cell ? this.getCellStyle?.(this.cell) ?? {} : {}),
        },
        {}
      ) ?? ({} as any)
    );
  }
  toggleBodyEditing = () => {
    this.emit('sc-change', {
      detail: {
        cell: this.cell,
        target: this,
      },
    });
  };
  toggleHeaderEditing() {
    //
  }
  toggleEditing() {
    const event = this.getOneUnderCriteria(
      this.toggleHeaderEditing,
      this.toggleBodyEditing,
      () => {}
    );
    event();
  }

  render() {
    return html` <div
      class=${classMap({
        [this.makeClassName('root')]: true,
        [this.makeClassName('of-header')]: this.scope === 'header',
        [this.makeClassName('of-body')]: this.scope === 'cell',
      })}
      style=${styleMap(this.customizedStyle)}
      @dblclick=${this.toggleEditing}
    >
      ${this.renderPrefixIndicator()} ${this.renderContent()}
      ${this.renderSuffixIndicator()}
    </div>`;
  }
}

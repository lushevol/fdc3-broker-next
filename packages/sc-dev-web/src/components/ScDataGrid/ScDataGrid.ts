import { TemplateResult, html, nothing } from 'lit';
import '../../../env/env.js';
import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import '../../../elements/sc-pagination.js';
import '../../../elements/sc-search-field.js';
import style, { classNamePrefix } from './ScDataGrid.style.js';
import { TanstackMixin } from './mixins/tanstack-mixin.js';
import { StyleToolMixin } from './mixins/style-tool-mixin.js';
import {
  Cell,
  Column,
  createColumnHelper,
  Header,
  HeaderGroup,
  Row,
} from '@tanstack/lit-table';
import { repeat } from 'lit/directives/repeat.js';
import { watch } from '../../shared/watch.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { FeaturesMixin } from './mixins/features/entry-mixin.js';
import { getTag } from '../../shared/isEuqalWith/getTag.js';
import { booleanTag } from '../../shared/isEuqalWith/tags.js';
import {
  EPosition,
  ERowPosition,
  RowHeightEventType,
  StyleInfo,
  TPosition,
} from './types/utils.js';
import { ref } from 'lit/directives/ref.js';
import { RowHeightObserverMixin } from './mixins/row-height-observer-mixin.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { VerticalScrollerMixin } from './mixins/vertical-scroller-mixin.js';
import { HorizontalScrollerMixin } from './mixins/horizontal-scroller-mixin.js';
import { OverlappingMixin } from './mixins/overlapping-mixin.js';
import { ToolkitMixin } from './mixins/toolkit-mixin.js';
import './ScDataGridCell.js';
import './ScDataGridMasterCell.js';
import './ScDataGridColumnFilter.js';
import './ScDataGridColumnSetFilter.js';
import './widgets/selection.js';
import { MasterRowMixin } from './mixins/master-row.mixin.js';
import { ROW_SELECTION_COLUMN_ID } from './mixins/features/row-selection-mixin.js';
import { columnVisibility, renderFilter } from './widgets/svg.js';
import { HasSlotController } from '../../shared/slot.js';
import { TColumn } from './types/ColumnDef.js';

type TFinalizedColumnDefObj =
  | ReturnType<typeof columnHelper.accessor>
  | ReturnType<typeof columnHelper.group>;

const columnHelper = createColumnHelper();

const HTML_RESULT = 1;

export class ScDataGrid extends TanstackMixin(
  HorizontalScrollerMixin(
    VerticalScrollerMixin(
      RowHeightObserverMixin(
        MasterRowMixin(
          ToolkitMixin(
            OverlappingMixin(
              FeaturesMixin(StyleToolMixin(classNamePrefix)(ScElement))
            )
          )
        )
      )
    )
  )
) {
  static styles = ScTheme.getStyles().concat([style]);

  constructor() {
    super();
    const features = [this.whenSizingUpdate];
    this.initializeTable({
      onStateChange: () => {
        features.forEach(feature => feature());
      },
      getFeatureOptions: this.getFeatureOptions,
    });
  }

  finalizedColumnDefObj(column: TColumn<unknown, any>): TFinalizedColumnDefObj {
    const {
      // @ts-ignore
      property,
      // @ts-ignore
      columns,
      flex,
      pinned,
      draggable,
      sortable,
      sortingOrder,
      comparator,
      filterable,
      rowSpanning,
      colSpanning,
      rowGrouping,
      rowGroupingTree,
      getGroupingTreePath,
      sort,
      columnManagerLabel,
      hide,
      lock,
      cellEditor,
      cellEditorParams,
      getCellStyle,
      filterLookup,
      filterWidget,
      getHeaderStyle,
      cellDataType,
      filterType,
      filter,
      filterParams,
      filterModes,
      editable,
      ...opts
    } = column;

    // notice some property might be undefined
    const sortingFnConf = comparator ? { sortingFn: comparator } : {};
    const sortableConf =
      getTag(sortable) === booleanTag ? { enableSorting: sortable } : {};

    const columnFilterableConf =
      getTag(filterable) === booleanTag
        ? { enableColumnFilter: filterable }
        : {};

    if (Array.isArray(columns) && columns.length > 0) {
      return columnHelper.group({
        ...opts,
        ...sortableConf,
        ...sortingFnConf,
        ...columnFilterableConf,
        header: column.header as any,
        columns: columns.map(column => {
          column.hide = column.hide ?? hide;
          column.lock = column.lock ?? lock;
          return this.finalizedColumnDefObj(column);
        }),
        meta: {
          ...opts.meta,
          size: opts.size,
          flex,
          rowSpanning,
          draggable,
          colSpanning,
          pinned,
          rowGrouping: rowGrouping && !rowGroupingTree,
          rowGroupingTree: rowGroupingTree && !rowGrouping,
          getGroupingTreePath,
          columnManagerLabel,
          hide,
          lock,
          cellDataType,
          filterType,
          filter,
          filterParams,
          filterModes,
          cellEditorParams,
          cellEditor,
          editable,
          filterLookup,
          filterWidget,
          getCellStyle,
          getHeaderStyle,
          sort,
          sortingOrder: this.finalizeColumnDefSortingOrder(sortingOrder),
        },
      });
    }

    return columnHelper.accessor(property, {
      ...opts,
      ...sortableConf,
      ...sortingFnConf,
      ...columnFilterableConf,
      meta: {
        ...opts.meta,
        size: opts.size,
        flex,
        rowSpanning,
        draggable,
        colSpanning,
        pinned,
        rowGrouping: rowGrouping && !rowGroupingTree,
        rowGroupingTree: rowGroupingTree && !rowGrouping,
        getGroupingTreePath,
        columnManagerLabel,
        hide,
        lock,
        cellDataType,
        filterType,
        filter,
        filterParams,
        filterModes,
        cellEditorParams,
        cellEditor,
        editable,
        filterLookup,
        filterWidget,
        getCellStyle,
        getHeaderStyle,
        sort,
        sortingOrder: this.finalizeColumnDefSortingOrder(sortingOrder),
      },
    });
  }
  @watch('columns')
  handleColumnsChange() {
    this.tanstackColumns =
      this.columns?.map(this.finalizedColumnDefObj.bind(this)) ?? [];

    // resolve id conflict
    const resolveId = (column: (typeof this.tanstackColumns)[0]) => {
      if (column.id) return column.id;
      if ('accessorKey' in column && column.accessorKey)
        return column.accessorKey.replace(/\./g, '_');
      if (column.header && typeof column.header === 'string')
        return column.header;
    };
    this.tanstackColumns.forEach((colDef, index, list) => {
      if (!colDef.id) {
        const id = resolveId(colDef);
        colDef.id = `${id}${
          // count backward conflict ids
          list.slice(0, index).filter(c => resolveId(c) === id).length +
            // only count explicit forward ids
            list.slice(index + 1).filter(c => c.id === id).length || ''
        }`;
      }
    });

    this.updateColumnDefs();
  }

  @watch('data')
  handleDataChange() {
    this.data.forEach(
      (item: any, i) =>
        (item.uuid ??= `r${i}.${this.pageIndex * this.pageSize}.${Math.random()
          .toString(36)
          .substring(2, 9)}`)
    );
    this.table.setOptions(prev => {
      return {
        ...prev,
        data: this.data ?? [],
      };
    });

    const { getRowMaxHeight, getRowMinHeight, getRowHeight } = this;
    this.updateComplete.then(() => {
      // server side
      this.updatePrefixSum(ERowPosition.center);
      this.updatePrefixSum(ERowPosition.top);
      this.updatePrefixSum(ERowPosition.bottom);
      this.updatePrefixSum(ERowPosition.header);
      this.updateMasterRowPrefixSum();
      if (getRowMaxHeight) {
        this.table.setRowMaxHeight(
          this.finalizePredefinedRowHeight(getRowMaxHeight)
        );
      }
      if (getRowMinHeight) {
        this.table.setRowMinHeight(
          this.finalizePredefinedRowHeight(getRowMinHeight)
        );
      }
      if (getRowHeight) {
        this.table.setRowHeight(this.finalizePredefinedRowHeight(getRowHeight));
      }
      this.resyncHorizontalScroll();
    });
  }

  private readonly hasSlotController = new HasSlotController(
    this,
    'empty',
    'actions',
    'header-actions',
    'data-export'
  );

  generatePinnedClass(position?: TPosition) {
    return position === EPosition.left || position === EPosition.right
      ? {
          [this.makeClassName(`pinned-${position.toLowerCase()}`)]: true,
        }
      : {
          [this.makeClassName(`tbody-${position?.toLocaleLowerCase()}`)]: true,
        };
  }

  renderHeaderBox(
    renderContent: TemplateResult<typeof HTML_RESULT>,
    position: TPosition
  ) {
    const isCenter = position === EPosition.center;
    return html` <div
      class=${classMap({
        [this.makeClassName('thead')]: true,
        ...this.generatePinnedClass(position),
        [this.makeClassName('scroller')]: isCenter,
      })}
      style=${styleMap({
        ...this.finalizeSize(position),
        height: `${this.getRowTotalSize(ERowPosition.header)}px`,
      })}
      position=${ifDefined(position)}
      ${ref(this.observeHorizontalScroller(position))}
      @mouseenter=${() => this._showScrollbars(true)}
      @mouseleave=${() => this._showScrollbars()}
    >
      ${renderContent}
    </div>`;
  }

  renderHeaderArea() {
    const { left, right } = this.table.getState().columnPinning;
    const leftHeader = this.table.getLeftHeaderGroups();
    const centerHeader = this.table.getCenterHeaderGroups();
    const rightHeader = this.table.getRightHeaderGroups();

    return html`
      <div
        class="${this.makeClassName('header-area')}"
        style=${styleMap({
          display: this.hideHeader ? 'none' : 'flex',
        })}
      >
        ${leftHeader.length && left?.length
          ? this.renderHeaderBox(this.renderHeader(leftHeader), EPosition.left)
          : nothing}
        ${this.renderHeaderBox(
          this.renderHeader(centerHeader),
          EPosition.center
        )}
        ${rightHeader.length && right?.length
          ? this.renderHeaderBox(
              this.renderHeader(rightHeader),
              EPosition.right
            )
          : nothing}
        ${this.renderShadow(EPosition.left)}
        ${this.renderShadow(EPosition.right)}
      </div>
    `;
  }

  renderHeader(header: HeaderGroup<unknown>[]) {
    return html`
      ${repeat(
        header,
        headerGroup => headerGroup.id,
        (headerGroup, rowIndex) => {
          // header group comes from left/center/right
          // we dont need prefix for header/row id
          const headerId = `${this.staticConst.headerIdPrefix}${
            headerGroup.id.split('_')[1]
          }`;

          const headers: Header<unknown, unknown>[] = [];
          headerGroup.headers.forEach(_header => {
            if (_header.column.id === ROW_SELECTION_COLUMN_ID) {
              headers.unshift(_header);
            } else {
              headers.push(_header);
            }
          });

          const customizedHeaderRowStyle =
            this.getHeaderStyle?.(headerGroup) ?? {};

          return html`
            <div
              class=${classMap({
                [this.makeClassName('row')]: true,
                [this.makeClassName('row-of-header')]: true,
              })}
              style=${styleMap({
                ...this.getRowHeightStyle(headerId, ERowPosition.header),
                ...customizedHeaderRowStyle,
                transform: `translateY(${
                  this.getRowPrefixSum(ERowPosition.header)[rowIndex]
                }px)`,
              })}
              row-id="${headerId}"
            >
              ${repeat(
                headers,
                header => header.id,
                header => {
                  const sortingOrder =
                    header.column.columnDef.meta?.sortingOrder ?? [];
                  const sortable = header.column.getCanSort();
                  const sort = header.column.getIsSorted();
                  const sortDirection = sortable ? sort || 'none' : undefined;
                  const filterable = header.column.getCanFilter();
                  const isDraggable = this.enableDragColumn;
                  const colIndex = header.getColIndex();
                  const klass = classMap({
                    [this.makeClassName('cell')]: true,
                    [this.makeClassName('header-cell')]: true,
                    [this.makeClassName(`row-${rowIndex}`)]: true,
                    ...Array.from({ length: header.colSpan }, (_, i) =>
                      this.cleanClassName(`cell--${headerId}--${colIndex + i}`)
                    ).reduce((o, k) => ({ ...o, [k]: true }), {}),
                  });

                  return html` <div
                    class=${klass}
                    tabindex="-1"
                    draggable=${ifDefined(isDraggable ? 'true' : undefined)}
                    @mousedown=${isDraggable ? this.handleHeaderMousedown : nothing}
                    @dragstart=${isDraggable ? this.handleHeaderDragstart : nothing}
                    @dragend=${isDraggable ? this.handleHeaderDragend : nothing}
                    @drop=${isDraggable ? this.handleHeaderDrop : nothing}
                    @dragover=${isDraggable ? this.handleHeaderDragover : nothing}
                    @dragleave=${isDraggable ? this.handleHeaderDragleave : nothing}
                  >
                    <sc-data-grid-cell
                      style=${styleMap({
                        width: `${header.getSize()}px`,
                      })}
                      .table=${this.table}
                      .header=${header}
                      .filterable=${filterable}
                      .sortable=${sortable}
                      .sort=${sortDirection}
                      .rowIndex=${rowIndex}
                      .rowId=${headerId}
                      col-index=${colIndex}
                      ?enableKeyboard=${this.enableKeyboard}
                      .getHeaderStyle=${header.column.columnDef.meta
                        ?.getHeaderStyle}
                      ?is-column-filtered=${header.column.getIsFiltered()}
                      ?is-hide-row-selection=${this.rowSelectionMode === 'single'}
                      ?is-row-selected=${this.table.getIsSelectedAll()}
                      ?is-row-indeterminated=${this.table.getIsIndeterminate()}
                      @sc-dimension-update=${(
                        e: CustomEvent<RowHeightEventType>
                      ) => {
                        this.handleRowHeightUpdate(
                          e.detail,
                          ERowPosition.header
                        );
                      }}
                      @sc-change=${(e: CustomEvent) =>
                        this.toggleColumnFilter(e, header.column, this.table)}
                      @sc-sort=${(e: CustomEvent) => {
                        const isMulti = e.detail.isMulti;
                        this.handleSort(
                          header,
                          sortDirection,
                          sortingOrder,
                          isMulti
                        );
                        this.updatePrefixSum(ERowPosition.center);
                        this.updateMasterRowPrefixSum();
                      }}
                    ></sc-data-grid-cell>
                    ${this.renderSeparator(header)}
                  </div>`;
                }
              )}
            </div>
          `;
        }
      )}
    `;
  }

  renderSeparator(header: Header<unknown, unknown>) {
    return html` <div
      @dblclick=${() => this.resetSizeHandler(header)}
      @mousedown=${this.getResizeHandler(header)}
      class=${classMap({
        [this.makeClassName('separator')]: true,
        [this.makeClassName('separator-can-resize')]:
          header.column.getCanResize(),
        [this.makeClassName('separator-resizing')]:
          header.column.getIsResizing(),
      })}
    >
      <div class="${this.makeClassName('separator-placeholder')}"></div>
    </div>`;
  }

  renderVerticalScroller() {
    return html` <div class="${this.makeClassName('vertical-scroller')}">
      <div
        ${ref(this.observeVerticalScroller)}
        class="${this.makeClassName('vertical-scroller-container')} disappear"
        @mouseenter=${() => this._showScrollbars(true)}
        @mouseleave=${() => this._showScrollbars()}
      >
        <div
          class="${this.makeClassName('vertical-scroller-content')}"
          style=${styleMap({
            height: `${this.getVerticalScrollRatio() * 100}%`,
          })}
        ></div>
      </div>
    </div>`;
  }

  private _showScrollbars(keep?: boolean): void {
    const scrollers = Array.from(
      this.shadowRoot?.querySelectorAll<HTMLElement>(
        `.${this.makeClassName(
          'vertical-scroller-container'
        )}, .${this.makeClassName('horizontal-scroller-container')}`
      ) ?? []
    );

    scrollers?.forEach(scroller => {
      scroller.classList.add('appear');
      scroller.classList.remove('disappear');
      if (!keep) {
        // reflow transition
        scroller.offsetHeight;
        scroller.classList.add('disappear');
        scroller.classList.remove('appear');
      }
    });
  }

  getRowId(row: HTMLDivElement) {
    return row.getAttribute('row-id');
  }

  handleRowEnter(rowId: string) {
    this.getRowsViaAttribute(rowId).forEach(row => {
      row.classList.add(this.makeClassName('row-of-body-hover'));
    });
  }
  handleRowLeave(rowId: string) {
    this.getRowsViaAttribute(rowId).forEach(row => {
      row.classList.remove(this.makeClassName('row-of-body-hover'));
    });
  }
  handleRowClick(e: Event) {
    const target = e.target as HTMLDivElement;
    const row = target.closest<HTMLDivElement>(`.${this.makeClassName('row')}`);
    if (row) {
      const rowId = this.getRowId(row);
      this.emit('sc-tr-tap', {
        detail: {
          value: rowId,
        },
      });
      if (this.rowSelection && this.enableClickSelection) {
        if (rowId) {
          const row = this.table.getRow(rowId);
          if (row) {
            this.handleSelectSingle(row)(!row.getIsRowSelected());
          }
        }
      }
    }
  }

  transformDis(rowPosition: ERowPosition, rowIndex: number) {
    let extraDis = 0;
    if (rowPosition === ERowPosition.center) {
      extraDis = this.getMasterRowsSize(rowIndex);
    }
    return this.getRowPrefixSum(rowPosition)[rowIndex] + extraDis;
  }

  makeCustomEvent(eventName: string, e: DragEvent, row: Row<unknown>) {
    return new CustomEvent(eventName, {
      detail: {
        event: e,
        row,
      },
    });
  }
  /**
   * iterated render cells for each row
   * @param rows positioned rows
   * @param getPositionCells filter all cells to positioned cells to fit pinned left/right
   * @returns render result
   */
  renderCellsOfEachRows(
    rows: Row<unknown>[],
    getPositionCells: (
      cells: Cell<unknown, unknown>[]
    ) => Cell<unknown, unknown>[],
    position: TPosition,
    rowPosition: ERowPosition
  ) {
    const rowLength = rows.length;
    return html`
      ${repeat(
        rows,
        row => row.id,
        (row, rowIndex) => {
          let unvisibleColumns: string[] = [];
          const visibleCells = row.getVisibleCells();

          const cells: Cell<unknown, unknown>[] = [];
          getPositionCells(visibleCells).forEach(cell => {
            if (cell.column.id === ROW_SELECTION_COLUMN_ID) {
              cells.unshift(cell);
            } else {
              cells.push(cell);
            }
          });
          const customizedRowStyle = this.getRowStyle?.(row) ?? {};
          const isHideRowSelection = row.getIsUnvisibleSelection();
          const isSelectionRadio = this.table.getIsSelectionRadio();

          const rowHeight = row.getHeight();
          const rowMaxHeight = row.getMaxHeight();
          const rowMinheight = row.getMinHeight();

          const isEnableDraggableRow = this.table.getIsEnableDraggableRow();
          const isRowDraggable = row.getIsDraggable();
          const isEnableDragEntireRow = this.enableDragEntireRow;

          return html`
            <div
              class=${classMap({
                [this.makeClassName('row')]: true,
                [this.makeClassName('row-of-body')]: true,
                [this.makeClassName('active-draggable-row')]: true,
                [this.makeClassName('row-of-body-zebra')]: rowIndex % 2 === 1,
                [this.makeClassName('row-of-body-non-zebra')]:
                  rowIndex % 2 === 0,
                [this.makeClassName('row-selected')]: row.getIsSelected(),
                [this.makeClassName('last-row-of-body')]:
                  rowIndex === rowLength - 1,
              })}
              style=${styleMap({
                ...this.getRowHeightStyle(row.id, rowPosition),
                ...customizedRowStyle,
                transform: `translateY(${this.transformDis(
                  rowPosition,
                  rowIndex
                )}px)`,
              })}
              @mouseenter=${() => this.handleRowEnter(row.id)}
              @mouseleave=${() => this.handleRowLeave(row.id)}
              @click=${this.handleRowClick}
              row-id="${row.id}"
              row-index="${rowIndex}"
              row-position="${rowPosition}"
              draggable="${isEnableDragEntireRow &&
              isEnableDraggableRow &&
              isRowDraggable
                ? 'true'
                : 'false'}"
              @dragstart=${(e: DragEvent) =>
                this.handleDragstart(
                  this.makeCustomEvent('sc-dragstart', e, row)
                )}
              @dragover=${(e: DragEvent) =>
                this.handleDragover(
                  this.makeCustomEvent('sc-dragover', e, row)
                )}
              @drop=${(e: DragEvent) =>
                this.handleDrop(this.makeCustomEvent('sc-drop', e, row))}
              @dragend=${(e: DragEvent) =>
                this.handleDragend(this.makeCustomEvent('sc-dragend', e, row))}
              @dragleave=${(e: DragEvent) =>
                this.handleDragleave(
                  this.makeCustomEvent('sc-dragleave', e, row)
                )}
            >
              ${this.renderDraggableIndicator()}
              ${repeat(
                cells,
                cell => cell.id,
                (cell, cellIndex) => {
                  if (unvisibleColumns.includes(cell.column.id)) {
                    return nothing;
                  }
                  const spannedColumns = cell.getSpannedColumns();
                  unvisibleColumns = [
                    ...unvisibleColumns,
                    ...spannedColumns.map(col => col.id),
                  ];

                  const colIndex: number =
                    cell.column.getHeader()?.getColIndex() ??
                    cell.column.getIndex();
                  const columns = [...spannedColumns, cell.column];
                  const totalSize = columns.reduce(
                    (acc, column) => acc + (column?.getSize() ?? 0),
                    0
                  );
                  const {
                    isExpandable,
                    isExpanded,
                    isPlaceholder,
                    isAggregated,
                  } = cell.getUIState();

                  const poolId = this.makePoolId(
                    row.id,
                    cell.column.id,
                    rowPosition
                  );
                  const cacheEl = this.cellPool.get(poolId);

                  const isColumnDraggable =
                    isEnableDraggableRow &&
                    isRowDraggable &&
                    cell.column.getIsDraggable();

                  const isCellSelectable =
                    cell.column.id === ROW_SELECTION_COLUMN_ID;

                  let isRowSelected = false;
                  let isRowIndeterminated = false;
                  if (isCellSelectable) {
                    isRowSelected = row.getIsRowSelected();
                    isRowIndeterminated = row.getIsIndeterminate();
                  }

                  const isSkipCell = cell.getIsSkipSinceRowSpanning();
                  if (isSkipCell) {
                    return this.renderRowSpanningPlaceholder(totalSize);
                  }

                  const klass = classMap({
                    [this.makeClassName('cell')]: true,
                    [this.makeClassName('cell-editable')]: cell.getIsEditable(),
                    [this.makeClassName('last-cell-of-row')]:
                      cellIndex === cells.length - 1,
                    [this.makeClassName('body-cell')]: true,
                    ...columns
                      .map((_, i) =>
                        this.cleanClassName(`cell--${row.id}--${colIndex + i}`)
                      )
                      .reduce((o, k) => ({ ...o, [k]: true }), {}),
                  });

                  if (cacheEl) {
                    cacheEl.style.setProperty('width', `${totalSize}px`);
                    if (rowHeight) {
                      cacheEl.style.setProperty(
                        '--sc-grid-cell-height',
                        `${rowHeight}px`
                      );
                    }
                    if (rowMaxHeight) {
                      cacheEl.style.setProperty(
                        '--sc-grid-cell-max-height',
                        `${rowMaxHeight}px`
                      );
                    }
                    if (rowMinheight) {
                      cacheEl.style.setProperty(
                        '--sc-grid-cell-min-height',
                        `${rowMinheight}px`
                      );
                    }
                    cacheEl.cell = cell;
                    cacheEl.isCanExpand = isExpandable;
                    cacheEl.isDraggable = isColumnDraggable;
                    cacheEl.isExpanded = isExpanded;
                    cacheEl.getCellStyle =
                      cell.column.columnDef.meta?.getCellStyle;
                    cacheEl.isPlaceholder = isPlaceholder;
                    cacheEl.isAggregated = isAggregated;
                    cacheEl.isRowIndeterminated = isRowIndeterminated;
                    cacheEl.isRowSelected = isRowSelected;
                    cacheEl.isHideRowSelection = isHideRowSelection;
                    cacheEl.isSelectionRadio = isSelectionRadio;
                    cacheEl.rowIndex = rowIndex;
                    cacheEl.rowId = row.id;
                    cacheEl.setAttribute('col-index', `${colIndex}`);

                    return html` <div class="${klass}" tabindex="-1">
                      ${cell.getIsRowSpanningRoot()
                        ? this.renderRowSpanningPlaceholder(totalSize)
                        : cacheEl}
                    </div>`;
                  }

                  return html` <div class="${klass}" tabindex="-1">
                    <sc-data-grid-cell
                      style=${styleMap({
                        width: `${totalSize}px`,
                        ...(rowHeight
                          ? { '--sc-grid-cell-height': `${rowHeight}px` }
                          : {}),
                        ...(rowMaxHeight
                          ? { '--sc-grid-cell-max-height': `${rowHeight}px` }
                          : {}),
                        ...(rowMinheight
                          ? { '--sc-grid-cell-min-height': `${rowHeight}px` }
                          : {}),
                      })}
                      id=${this.cleanClassName(cell.id)}
                      .table=${this.table}
                      .cell=${cell}
                      .rowIndex=${rowIndex}
                      col-index=${colIndex}
                      .rowId=${row.id}
                      ?enableKeyboard=${this.enableKeyboard}
                      .getCellStyle=${cell.column.columnDef.meta?.getCellStyle}
                      ?is-can-expand=${isExpandable}
                      ?is-draggable=${isColumnDraggable}
                      ?is-expanded=${isExpanded}
                      ?is-placeholder=${isPlaceholder}
                      ?is-aggregated=${isAggregated}
                      ?is-row-indeterminated=${isRowIndeterminated}
                      ?is-row-selected=${isRowSelected}
                      ?is-hide-row-selection=${isHideRowSelection}
                      ?is-row-selection-radio=${isSelectionRadio}
                      @sc-dragstart=${this.handleDragstart}
                      @sc-dragover=${this.handleDragover}
                      @sc-drop=${this.handleDrop}
                      @sc-dragend=${this.handleDragend}
                      @sc-dragleave=${this.handleDragleave}
                      @sc-change=${(e: CustomEvent) => {
                        this.toggleEditingPanel(e);
                      }}
                      @sc-expand=${(
                        e: CustomEvent<{ value: Cell<unknown, unknown> }>
                      ) => {
                        this.handleRowExpand(e.detail.value);
                        this.updatePrefixSum(ERowPosition.center);
                        this.updatePrefixSum(ERowPosition.top);
                        this.updatePrefixSum(ERowPosition.bottom);
                        this.updatePrefixSum(ERowPosition.header);
                        this.updateMasterRowPrefixSum();
                      }}
                      ${ref((el?: Element) => this.collectToPool(poolId, el))}
                      @sc-dimension-update=${(
                        e: CustomEvent<RowHeightEventType>
                      ) => {
                        this.handleRowHeightUpdate(e.detail, rowPosition);
                      }}
                    ></sc-data-grid-cell>
                  </div>`;
                }
              )}
            </div>
          `;
        }
      )}
    `;
  }
  renderRowSpanningPlaceholder(size: number) {
    return html` <div style="width: ${size}px;"></div>`;
  }

  renderDetailContent(row: Row<unknown>, rowIndex: number) {
    const masterCell = row.getCell(row.getMasterCellId());
    const isRowExpanded = row.getIsMasterExpanded();
    const resuableEl = this.getReuableMasterCell(row.id);
    if (resuableEl) {
      resuableEl.style.setProperty(
        '--sc-master-row-height',
        this.getMasterRowHeightStyle(row.id)
      );
      resuableEl.style.setProperty(
        '--sc-master-row-translateY',
        `${
          this.getRowPrefixSum(ERowPosition.center)[rowIndex + 1] +
          this.getMasterRowsSize(rowIndex)
        }px`
      );
      resuableEl.expandedCell = masterCell;
      resuableEl.masterCellRenderer = this.masterCellRenderer;
      resuableEl.setAttribute('row-index', `${rowIndex}`);
      return resuableEl;
    }
    return isRowExpanded
      ? html` <sc-data-grid-master-cell
          style=${styleMap({
            '--sc-master-row-height': this.getMasterRowHeightStyle(row.id),
            '--sc-master-row-translateY': `${
              this.getRowPrefixSum(ERowPosition.center)[rowIndex + 1] +
              this.getMasterRowsSize(rowIndex)
            }px`,
          })}
          row-index="${rowIndex}"
          row-id=${row.id}
          col-span=${row.getVisibleCells().length}
          .expandedCell=${masterCell}
          .masterCellRenderer=${this.masterCellRenderer}
          @sc-dimension-update=${(e: CustomEvent) => {
            this.handleMasterRowHeightUpdate(e, row.id, rowIndex);
          }}
          tabindex="-1"
          ${ref(this.collectMasterCell(row.id))}
        ></sc-data-grid-master-cell>`
      : nothing;
  }
  renderRowSpanning(
    cell: Cell<unknown, unknown>,
    row: Row<unknown>,
    rowId: string,
    rowIndex: number,
    customizedRowStyle: StyleInfo,
    stickyPosition: TPosition,
    rowPosition: ERowPosition
  ) {
    let spanningHeight = 0;
    const spannedRowsId = [...cell.getSpannedRowIndexes()]
      .map(row => row.cellId)
      .map(cellId => {
        const [rowId] = cellId.split('_');
        return rowId;
      });
    if (spannedRowsId.length) {
      [...spannedRowsId, rowId].forEach(rowId => {
        const h = this.getFinalizedRowHeight(rowId, ERowPosition.center);
        if (h) {
          spanningHeight += h;
        }
      });
    }
    if (!spanningHeight) {
      return nothing;
    }

    const spannedColumns = cell.getSpannedColumns();

    const colIndex = cell.column.getIndex();
    const columns = [...spannedColumns, cell.column];
    const totalSize = columns.reduce(
      (acc, column) => acc + (column?.getSize() ?? 0),
      0
    );
    const className = this.cleanClassName(
      [...spannedRowsId, rowId]
        .map(id =>
          columns.map((_, i) => `cell--${id}--${colIndex + i}`).join(' ')
        )
        .join(' ')
    );

    return html` <div
      class="${classMap({
        [this.makeClassName('row-spanning-wrapper')]: true,
        [this.makeClassName('row-of-body-zebra')]: rowIndex % 2 === 1,
        [this.makeClassName('row-of-body-non-zebra')]: rowIndex % 2 === 0,
        [this.makeClassName('cell-editable')]: cell.getIsEditable(),
        [this.makeClassName('row-selected')]: row.getIsSelected(),
        [this.makeClassName('cell')]: true,
        [this.makeClassName('body-cell')]: true,
      })}"
      row-id=${rowId}
      @mouseenter=${() => this.handleRowEnter(rowId)}
      @mouseleave=${() => this.handleRowLeave(rowId)}
      style=${styleMap({
        height: `${spanningHeight}px`,
        width: `${totalSize}px`,
        transform: `translate(${cell.column.getStart(
          stickyPosition.toLowerCase() as any
        )}px, ${this.transformDis(rowPosition, rowIndex)}px)`,
      })}
    >
      <sc-data-grid-cell
        class=${className}
        tabindex="-1"
        col-index=${cell.column.getIndex()}
        .rowId=${rowId}
        ?enableKeyboard=${this.enableKeyboard}
        .customizedRowStyle=${customizedRowStyle}
        .getCellStyle=${cell.column.columnDef.meta?.getCellStyle}
        is-cell-spanning
        .table=${this.table}
        .cell=${cell}
        @sc-change=${(e: CustomEvent) => {
          this.toggleEditingPanel(e);
        }}
      ></sc-data-grid-cell>
    </div>`;
  }

  renderEmpty() {
    if (this.isEmpty) {
      return html` <div class=${this.makeClassName('empty')}>
        <slot name="empty">
          <div class=${this.makeClassName('empty-box')}>
            ${renderEmptyIcon()}
              <div style="font-weight: 700; margin-bottom: 1.25rem;">
                No data to show
              </div>
              <slot name="empty-text">
                <div>
                  This table will automatically update when there is information
                </div>
                <div>or when users take action within the application.</div>
              </slot>
          </div>
        </slot>
      </div>`;
    }
    return nothing;
  }

  renderHorizontalScroller() {
    return html`
      <div class="${this.makeClassName('horizontal-scroller')}">
        <div
          style=${styleMap({
            ...this.finalizeSize(EPosition.left),
          })}
        ></div>
        <div
          class="${this.makeClassName(
            'horizontal-scroller-container'
          )} disappear"
          ${ref(this.observeHorizontalScroller(EPosition.center))}
          @mouseenter=${() => this._showScrollbars(true)}
          @mouseleave=${() => this._showScrollbars()}
        >
          <div
            class="${this.makeClassName('horizontal-scroller-content')}"
            style=${styleMap({
              width: `${this.getHorizontalScrollRatio() * 100}%`,
            })}
          ></div>
        </div>
        <div
          style=${styleMap({
            ...this.finalizeSize(EPosition.right),
          })}
        ></div>
      </div>
    `;
  }

  renderPositionedArea(
    rows: Row<unknown>[],
    stickyPosition: TPosition,
    rowPosition: ERowPosition
  ) {
    return this.renderGridBox(
      this.renderCellsOfEachRows(
        rows,
        this.makeGetPositionCellsFn(stickyPosition),
        stickyPosition,
        rowPosition
      ),
      stickyPosition,
      rowPosition
    );
  }
  getBoxShadowWidth(stickyPosition: TPosition) {
    let columns: Column<unknown, unknown>[] = [];

    if (stickyPosition === EPosition.left) {
      columns = this.table.getLeftVisibleLeafColumns();
    } else if (stickyPosition === EPosition.right) {
      columns = this.table.getRightVisibleLeafColumns();
    }
    return columns.reduce((size, cur) => {
      return size + cur.getSize();
    }, 0);
  }

  renderShadow(stickyPosition: TPosition, height?: number) {
    const heightStyle = height ? { height: `${height}px` } : {};
    return html` <div
      class=${classMap({
        [this.makeClassName('box-shadow-wrapper')]: true,
        [this.makeClassName(
          `box-shadow-wrapper-${stickyPosition.toLowerCase()}`
        )]: true,
      })}
      style=${styleMap({
        width: `${this.getBoxShadowWidth(stickyPosition)}px`,
        ...heightStyle,
      })}
    >
      <div
        class=${classMap({
          [this.makeClassName('box-shadow')]: true,
          [this.makeClassName(`box-shadow-${stickyPosition.toLowerCase()}`)]:
            true,
        })}
      ></div>
    </div>`;
  }
  renderMasterDetailContent(
    rows: {
      id: string;
    }[],
    gridHeight: number
  ) {
    const expandedMasterRowIds = Array.from(
      this.tableState.masterCell?.keys() ?? []
    );
    return html` <div
      class="${this.makeClassName('master-detial-layer')}"
      style=${styleMap({
        height: `${gridHeight}px`,
      })}
    >
      ${repeat(
        expandedMasterRowIds,
        rowId => rowId,
        rowId => {
          const row = this.table.getRowModel().rowsById[rowId];
          if (row && this.getIsParentVisible(row)) {
            const rowIndex = rows.findIndex(item => item.id === row.id);
            return this.renderDetailContent(row, rowIndex);
          }
          return nothing;
        }
      )}
    </div>`;
  }

  renderBodyArea() {
    const { left, right } = this.table.getState().columnPinning;
    const gridHeight = this.getGridHeight(ERowPosition.center);
    const rows = this.getRowsByPosition(ERowPosition.center);
    return html`<div
      class=${classMap({
        [this.makeClassName('body-area')]: true,
        [this.makeClassName('empty-body-area')]: this.isEmpty,
      })}
    >
      <div
        ${ref(this.observeVerticalScroller)}
        class="${this.makeClassName('body-area-viewport')}"
        @mouseenter=${() => this._showScrollbars(true)}
        @mouseleave=${() => this._showScrollbars()}
      >
        ${left?.length
          ? this.renderPositionedArea(
              this.centerRows,
              EPosition.left,
              ERowPosition.center
            )
          : nothing}
        ${this.renderPositionedArea(
          this.centerRows,
          EPosition.center,
          ERowPosition.center
        )}
        ${right?.length
          ? this.renderPositionedArea(
              this.centerRows,
              EPosition.right,
              ERowPosition.center
            )
          : nothing}
        ${this.renderShadow(EPosition.left, gridHeight)}
        ${this.renderShadow(EPosition.right, gridHeight)}
        ${this.renderMasterDetailContent(rows, gridHeight)}
      </div>

      ${this.renderVerticalScroller()}
    </div>`;
  }

  renderPinnedBodyArea(rows: Row<unknown>[], rowPosition: ERowPosition) {
    const { left, right } = this.table.getState().columnPinning;
    return html` <div class=${classMap({
      [this.makeClassName('pinned-body-area')]: true,
      [rowPosition]: true,
      empty: !rows.length,
    })}>
      <div class="${this.makeClassName('pinned-body-area-viewport')}">

      ${
        left?.length
          ? this.renderPositionedArea(rows, EPosition.left, rowPosition)
          : nothing
      }
        ${this.renderPositionedArea(rows, EPosition.center, rowPosition)}
        ${
          right?.length
            ? this.renderPositionedArea(rows, EPosition.right, rowPosition)
            : nothing
        }
      </div>
      </div>
    </div>`;
  }

  getGridHeight(rowPosition: ERowPosition) {
    let height = 0;
    if (this.isEmpty) {
      return height;
    }
    if (rowPosition === ERowPosition.top) {
      height = this.getRowTotalSize(rowPosition) ?? 0;
    } else if (rowPosition === ERowPosition.center) {
      height =
        this.getRowTotalSize(rowPosition) + (this.getMasterRowTotlaSize() ?? 0);
    } else if (rowPosition === ERowPosition.bottom) {
      height = this.getRowTotalSize(rowPosition) ?? 0;
    }
    return height;
  }

  /**
   * render grid box for all grid area.differencinte top/bottom pinned body with normal body, also contoll scroll part
   * @param renderContent actual render content, like slot
   * @param stickyPosition pinned position
   * @param isRowPinned pinned row or not
   * @returns render result
   */
  renderGridBox(
    renderContent: TemplateResult<typeof HTML_RESULT>,
    stickyPosition: TPosition,
    rowPosition: ERowPosition
  ) {
    const isCenter = stickyPosition === EPosition.center;
    const gridHeight = this.getGridHeight(rowPosition);
    return html` <div
      class=${classMap({
        [this.makeClassName('tbody')]: true,
        ...this.generatePinnedClass(stickyPosition),
        [this.makeClassName('scroller')]: isCenter,
      })}
      style=${styleMap({
        ...this.finalizeSize(stickyPosition),
        height: `${gridHeight}px`,
      })}
      position=${ifDefined(stickyPosition)}
      ${ref(
        rowPosition !== ERowPosition.center
          ? this.refPlaceholder
          : this.observeBodyHeight
      )}
      ${ref(this.observeHorizontalScroller(stickyPosition))}
    >
      ${renderContent}

      <div
        class="${this.makeClassName('row-spanning-layer')}"
        style=${styleMap({
          height: `${gridHeight}px`,
        })}
      >
        <!-- get all cell id, cell id combine by row.id _ column.id -->
        ${Array.from(this.tableState.rowSpanning?.keys() ?? []).map(cellId => {
          const [rowId, columnId] = cellId.split('_');
          const column = this.table.getColumn(columnId);
          if (!column) {
            return nothing;
          }
          const columnPinPosition = column.getIsPinned() || 'center';
          if (
            columnPinPosition.toLowerCase() !== stickyPosition.toLowerCase()
          ) {
            return nothing;
          }
          if (rowPosition !== ERowPosition.center) {
            return nothing;
          }
          const row = this.table.getRow(rowId);
          const rowIndex = this.getRowsByPosition(rowPosition).findIndex(
            item => item.id === row.id
          );
          const cell = row.getCell(cellId);
          const customizedRowStyle = this.getRowStyle?.(row) ?? {};
          if (row && cell) {
            return this.renderRowSpanning(
              cell,
              row,
              row.id,
              rowIndex,
              customizedRowStyle,
              stickyPosition,
              rowPosition
            );
          }
          return nothing;
        })}
      </div>
    </div>`;
  }

  renderPagination() {
    if (!this.pagination || this.table.getRowCount() === 0) {
      return nothing;
    }
    const { pageSize, pageIndex } = this.table.getState().pagination;
    const total = this.table.getRowCount();

    return html` <sc-pagination
      mode="default"
      size="sm"
      alignment="right"
      .total=${total}
      .currentPage=${pageIndex + 1}
      .pageSize=${pageSize}
      .pageSizeOptions=${this.pageSizeOptions}
      @sc-change=${(e: CustomEvent) => {
        this.handlePageChange(e);
      }}
      ?label=${this.label}
      ?no-truncation=${this.noTruncation}
      ?quick-jumper=${this.quickJumper}
      ?size-changer=${this.sizeChanger}
      ?jump-first-last-page=${this.jumpFirstLastPage}
    >
    </sc-pagination>`;
  }
  enableFloatingFunctionalRow() {
    const isEnableColumnVisibility = this.columnVisibility;
    const isEnableColumnOrdering = this.columnOrdering;
    const isEnableAdvancedFilter = this.getHasAdvancedFilter();
    const isEnableSearchFilter = this.getHasSearchFilter();

    return {
      isEnableColumnVisibility,
      isEnableColumnOrdering,
      isEnableAdvancedFilter,
      isEnableSearchFilter,
      isEnableFunctionalRow:
        isEnableColumnVisibility ||
        isEnableColumnOrdering ||
        isEnableAdvancedFilter ||
        isEnableSearchFilter ||
        this.hasHeaderActionsSlot,
    };
  }
  get showActionsBar() {
    let res = false;
    if (this.hasActionsSlot) {
      res = true;
    }
    if (this.rowSelection) {
      if (this.selectionQuantity || this.selectAllButton) {
        res = true;
      }
    }
    return res;
  }
  get hasActionsSlot() {
    return this.hasSlotController.test('actions');
  }
  get hasHeaderActionsSlot() {
    return this.hasSlotController.test('header-actions');
  }
  /**
   * selected count & actions content
   * @returns remplate
   */
  renderActionsBar() {
    if (!this.showActionsBar && !this.shouldRenderDataExportBar()) {
      return nothing;
    }
    return html` <div class="${this.makeClassName('actions-bar')}">
      ${this.renderSelectionInfo()}
      <div style="flex: 1;"></div>
      ${this.hasActionsSlot
        ? html` <div class="${this.makeClassName('customized-actions')}">
            <slot name="actions"></slot>
          </div>`
        : nothing}
      ${this.shouldRenderDataExportBar()
        ? this.renderDataExportBar()
        : nothing}
    </div>`;
  }

  renderSelectionInfo() {
    if (!this.rowSelection) {
      return nothing;
    }
    const isSelctedAll = this.table.getIsSelectedAll();
    const label = isSelctedAll ? 'Deselect' : 'Select';
    const state = this.table.getState();
    let count = Object.keys(state.rowSelection ?? {}).length,
      total = this.table.getAllSelectableRows(false).length;

    if (state.grouping.length && this.countRowGroupSelection) {
      count = 0;
      // grouped rows
      const groupRows = this.table.getAllGroupRows().filter(row => row.getIsRowSelectable());
      count += groupRows.filter(
        row => row.getIsSubRowsSelected() === 'all'
      ).length;
      // only selectable
      const selectedRows = this.table.getSelectedRowModel().rows;
      count += selectedRows.filter(row => row.getIsRowSelectable()).length;
      
      total += groupRows.length;
    }

    return html`
      ${this.selectionQuantity
        ? html` <div class="${this.makeClassName('selection-info')}">
            <div class="${this.makeClassName('selection-info-bold')}">
              ${count}
            </div>
            <div class="${this.makeClassName('selection-info-text')}">
              &nbsp;of&nbsp;
            </div>
            <div class="${this.makeClassName('selection-info-bold')}">
              ${total}
            </div>
            <div class="${this.makeClassName('selection-info-text')}">
              &nbsp;items selected
            </div>
          </div>`
        : nothing}
      ${this.selectAllButton
        ? html` <sc-button
            style=${styleMap({
              marginLeft: this.selectionQuantity ? '0' : '-1rem',
            })}
            type="link"
            state="default"
            size="sm"
            width="auto"
            @click=${() => this.handleSelectAll(!isSelctedAll)}
          >
            ${label} all
          </sc-button>`
        : nothing}
    `;
  }
  /**
   * filter, column manager
   * @returns template
   */
  renderHeaderTools() {
    const {
      isEnableColumnVisibility,
      isEnableColumnOrdering,
      isEnableAdvancedFilter,
      isEnableFunctionalRow,
      isEnableSearchFilter,
    } = this.enableFloatingFunctionalRow();
    if (!isEnableFunctionalRow) {
      return nothing;
    }
    return html`<div class="${this.makeClassName('header-tools')}">
      <div class="${this.makeClassName('header-tools-main')}">
        ${isEnableSearchFilter
          ? html` <sc-search-field
              style="width: 100%; margin-bottom: -5px;"
              size="md"
              placeholder="Search"
              clearable
              @sc-clear=${this.handleGlobalFilter}
              @sc-input=${this.handleGlobalFilter}
            ></sc-search-field>`
          : nothing}
      </div>
      ${this.hasHeaderActionsSlot
        ? html` <div class="${this.makeClassName('header-actions')}">
            <slot name="header-actions"></slot>
          </div>`
        : nothing}
      ${isEnableAdvancedFilter || isEnableColumnVisibility || isEnableColumnOrdering
      ? html`<div class="${this.makeClassName('header-tools-icons')}">
        ${isEnableAdvancedFilter
          ? html`<div
              class=${classMap({
                [this.makeClassName('header-tools-icon')]: true,
                [this.makeClassName('header-tools-filter')]: true,
              })}
              style=${styleMap({
                '--sc-filter-active-color': this.tableState.columnFilters
                  ?.length
                  ? 'var(--sc-color-blue-500)'
                  : '',
              })}
              @click=${() => this.toggleCompositeFilter()}
            >
              ${renderFilter()}
            </div>`
          : nothing}
        ${isEnableColumnVisibility || isEnableColumnOrdering
          ? html`<div
              class=${classMap({
                [this.makeClassName('header-tools-icon')]: true,
                [this.makeClassName('header-tools-visibility')]: true,
              })}
              @click=${this.toggleColumnVisibility}
            >
              ${columnVisibility()}
            </div>`
          : nothing}
      </div>`
      : nothing}
    </div>`;
  }

  // ANA: Consider use sc-data-grid-column to host the column definition in the future.
  render() {
    return html`
      <div
        class=${classMap({
          [this.makeClassName('table-wrapper')]: true,
          'keyboard-enabled': this.enableKeyboard,
        })}
        @focusin=${this.enableKeyboard ? this.handleFocusIn : nothing}
        @focusout=${this.enableKeyboard ? this.handleFocusOut : nothing}
        @keydown=${this.enableKeyboard ? this.handleKeyDown : nothing}
        @keyup=${this.enableKeyboard ? this.handleKeyUp : nothing}
      >
        <div class="${this.makeClassName('table')}" tabindex="0">
          ${this.renderHeaderTools()} ${this.renderActionsBar()}
          ${this.renderHeaderArea()}
          ${this.renderPinnedBodyArea(this.topRows, ERowPosition.top)}
          ${this.renderBodyArea()}
          ${this.renderPinnedBodyArea(this.bottomRows, ERowPosition.bottom)}
          ${this.renderHorizontalScroller()} ${this.renderEmpty()}
          ${this.renderPagination()}
        </div>
      </div>

      <sc-data-grid-editing></sc-data-grid-editing>
      <sc-data-grid-overlapping></sc-data-grid-overlapping>
      <sc-data-grid-dragging-shadow></sc-data-grid-dragging-shadow>

      ${this.getHasColumnFilter()
        ? html`<sc-data-grid-column-filter
            @sc-filter=${() => {
              this.emitExternalScFilterEvent();
            }}
          ></sc-data-grid-column-filter>`
        : nothing}
      ${this.getHasAdvancedFilter() && this.isCompositeFilterActive
        ? html`<sc-data-grid-composite-filter
            .table=${this.table}
            @sc-hide=${() => this.toggleCompositeFilter(false)}
            @sc-filter=${() => {
              this.emitExternalScFilterEvent();
            }}
          ></sc-data-grid-composite-filter>`
        : nothing}
      ${this.columnVisibility || this.columnOrdering
        ? html`<sc-data-grid-column-manager
            .table=${this.table}
            .columnVisibility=${this.tableState.columnVisibility}
            .columnOrder=${this.tableState.columnOrder}
            ?enable-order=${this.columnOrdering}
            ?enable-visibility=${this.columnVisibility}
            ?dynamic-column-width=${this.dynamicColumnWidth}
          ></sc-data-grid-column-manager>`
        : nothing}
    `;
  }
}

function renderEmptyIcon() {
  /* eslint-disable max-len */
  return html`
    <svg
      style="height: 5rem;"
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M44.1945 43.0449H28.8529C28.5033 43.0453 28.1682 43.1836 27.921 43.4295C27.6738 43.6754 27.5347 44.0087 27.5343 44.3564V78.2674L27.3584 78.3207L23.5949 79.467C23.4165 79.5211 23.2239 79.5026 23.0592 79.4155C22.8946 79.3285 22.7714 79.18 22.7167 79.0027L11.5219 42.6348C11.4674 42.4574 11.486 42.2658 11.5735 42.102C11.6611 41.9382 11.8104 41.8157 11.9887 41.7614L17.7883 39.9952L34.6015 34.8769L40.4011 33.1107C40.4894 33.0837 40.5821 33.0743 40.674 33.083C40.766 33.0916 40.8553 33.1183 40.9369 33.1613C41.0184 33.2043 41.0907 33.263 41.1494 33.3338C41.2082 33.4046 41.2524 33.4863 41.2794 33.5741L44.1409 42.87L44.1945 43.0449Z"
        fill="white"
      />
      <path
        d="M49.1667 43.609L45.5179 31.71C45.4572 31.5117 45.358 31.3273 45.2259 31.1674C45.0938 31.0074 44.9314 30.875 44.748 30.7778C44.5646 30.6805 44.3639 30.6202 44.1572 30.6005C43.9504 30.5807 43.7419 30.6018 43.5433 30.6625L34.9166 33.2988L17.1293 38.7357L8.50257 41.3729C8.10181 41.4958 7.76626 41.7724 7.56956 42.142C7.37285 42.5116 7.33107 42.944 7.45338 43.3443L19.9242 84.0103C20.0236 84.3335 20.2241 84.6164 20.4963 84.8174C20.7685 85.0185 21.098 85.1271 21.4366 85.1275C21.5933 85.1275 21.7491 85.104 21.8988 85.0578L27.8125 83.2508L27.9985 83.1932V82.9991L27.8125 83.0557L21.844 84.8804C21.4903 84.9881 21.1082 84.9513 20.7816 84.7781C20.455 84.6049 20.2106 84.3094 20.1019 83.9565L7.632 43.2896C7.57815 43.1147 7.55939 42.9309 7.57677 42.7488C7.59416 42.5667 7.64735 42.3898 7.73332 42.2283C7.81928 42.0667 7.93632 41.9237 8.07773 41.8073C8.21915 41.691 8.38215 41.6036 8.55743 41.5503L17.1842 38.9131L34.9715 33.4771L43.5982 30.8399C43.7312 30.7994 43.8694 30.7787 44.0084 30.7786C44.3067 30.7793 44.5969 30.8753 44.8366 31.0526C45.0763 31.2299 45.2528 31.4791 45.3403 31.7638L48.9724 43.609L49.03 43.7947H49.2235L49.1667 43.609Z"
        fill="#D4D4D4"
        stroke="#D4D4D4"
        stroke-width="3"
      />
      <path
        d="M33.8462 32.4326C33.9312 32.4067 34.0235 32.4152 34.1021 32.457C34.1609 32.4884 34.2084 32.5367 34.2397 32.5947L34.2661 32.6562L35.4614 36.5684V36.5693C35.4874 36.6549 35.4788 36.7472 35.437 36.8262C35.4055 36.8855 35.3572 36.9335 35.2993 36.9648L35.2388 36.9912L18.8979 42.001C18.8664 42.0107 18.8333 42.0146 18.8003 42.0146C18.7287 42.0144 18.6588 41.992 18.6011 41.9492C18.5577 41.917 18.5222 41.8754 18.4985 41.8271L18.479 41.7764L17.2827 37.8643C17.2697 37.8219 17.2658 37.7766 17.27 37.7324C17.2743 37.6884 17.2864 37.6454 17.3071 37.6064C17.3278 37.5674 17.3562 37.533 17.3901 37.5049C17.4241 37.4768 17.4634 37.4553 17.5054 37.4424L33.8462 32.4326Z"
        fill="#D4D4D4"
        stroke="#D4D4D4"
      />
      <path
        d="M25.1025 34.7883C26.1085 34.7883 26.924 33.9481 26.924 32.9116C26.924 31.8751 26.1085 31.0349 25.1025 31.0349C24.0965 31.0349 23.281 31.8751 23.281 32.9116C23.281 33.9481 24.0965 34.7883 25.1025 34.7883Z"
        fill="#D4D4D4"
        stroke="#D4D4D4"
        stroke-width="3"
      />
      <path
        d="M25.1025 34.0155C25.7427 34.0155 26.2616 33.4966 26.2616 32.8564C26.2616 32.2162 25.7427 31.6973 25.1025 31.6973C24.4623 31.6973 23.9434 32.2162 23.9434 32.8564C23.9434 33.4966 24.4623 34.0155 25.1025 34.0155Z"
        fill="white"
      />
      <path
        d="M62.4512 84.7722H33.3229C33.1286 84.772 32.9425 84.6868 32.8051 84.5355C32.6678 84.3841 32.5906 84.1789 32.5903 83.9648V45.4918C32.5905 45.2777 32.6678 45.0725 32.8051 44.9211C32.9424 44.7697 33.1286 44.6846 33.3229 44.6843H62.4512C62.6454 44.6846 62.8316 44.7697 62.9689 44.9211C63.1063 45.0725 63.1835 45.2777 63.1837 45.4918V83.9648C63.1835 84.1788 63.1063 84.3841 62.9689 84.5355C62.8316 84.6868 62.6454 84.772 62.4512 84.7722Z"
        fill="white"
      />
      <path
        d="M48.9314 43.6196H29.3856C28.9672 43.6202 28.566 43.7868 28.2701 44.0828C27.9742 44.3788 27.8077 44.7802 27.8071 45.1988V83.08L27.9928 83.0234V45.1988C27.9933 44.8294 28.1402 44.4752 28.4013 44.214C28.6624 43.9528 29.0164 43.8059 29.3856 43.8054H48.989L48.9314 43.6196ZM65.9701 43.6196H29.3856C28.9672 43.6202 28.566 43.7868 28.2701 44.0828C27.9742 44.3788 27.8077 44.7802 27.8071 45.1988V87.7432C27.8077 88.1618 27.9742 88.5632 28.2701 88.8592C28.566 89.1552 28.9672 89.3218 29.3856 89.3224H65.9701C66.3886 89.3218 66.7898 89.1552 67.0857 88.8592C67.3816 88.5632 67.548 88.1618 67.5486 87.7432V45.1988C67.548 44.7802 67.3816 44.3788 67.0857 44.0828C66.7898 43.7868 66.3886 43.6202 65.9701 43.6196ZM67.3629 87.7432C67.3625 88.1126 67.2156 88.4668 66.9545 88.728C66.6934 88.9892 66.3394 89.1361 65.9701 89.1366H29.3856C29.0164 89.1361 28.6624 88.9892 28.4013 88.728C28.1402 88.4668 27.9933 88.1126 27.9928 87.7432V45.1988C27.9933 44.8294 28.1402 44.4752 28.4013 44.214C28.6624 43.9528 29.0164 43.8059 29.3856 43.8054H65.9701C66.3394 43.8059 66.6934 43.9528 66.9545 44.214C67.2156 44.4752 67.3625 44.8294 67.3629 45.1988V87.7432Z"
        fill="#B2B2B2"
      />
      <path
        d="M29.3856 43.6196H48.9314L48.989 43.8054H29.3856M29.3856 43.6196C28.9672 43.6202 28.566 43.7868 28.2701 44.0828C27.9742 44.3788 27.8077 44.7802 27.8071 45.1988M29.3856 43.6196H65.9701C66.3886 43.6202 66.7898 43.7868 67.0857 44.0828C67.3816 44.3788 67.548 44.7802 67.5486 45.1988V87.7432C67.548 88.1618 67.3816 88.5632 67.0857 88.8592C66.7898 89.1552 66.3886 89.3218 65.9701 89.3224H29.3856C28.9672 89.3218 28.566 89.1552 28.2701 88.8592C27.9742 88.5632 27.8077 88.1618 27.8071 87.7432V45.1988M27.8071 45.1988V83.08L27.9928 83.0234V45.1988M27.9928 45.1988C27.9933 44.8294 28.1402 44.4752 28.4013 44.214C28.6624 43.9528 29.0164 43.8059 29.3856 43.8054M27.9928 45.1988V87.7432C27.9933 88.1126 28.1402 88.4668 28.4013 88.728C28.6624 88.9892 29.0164 89.1361 29.3856 89.1366H65.9701C66.3394 89.1361 66.6934 88.9892 66.9545 88.728C67.2156 88.4668 67.3625 88.1126 67.3629 87.7432V45.1988C67.3625 44.8294 67.2156 44.4752 66.9545 44.214C66.6934 43.9528 66.3394 43.8059 65.9701 43.8054H29.3856"
        stroke="#858687"
        stroke-width="3"
      />
      <path
        d="M56.008 47.4725H38.711C38.4867 47.4723 38.2717 47.3915 38.1131 47.248C37.9545 47.1044 37.8652 46.9098 37.865 46.7068V42.9634C37.8652 42.7604 37.9545 42.5658 38.1131 42.4223C38.2717 42.2787 38.4867 42.198 38.711 42.1978H56.008C56.2323 42.198 56.4473 42.2787 56.6059 42.4223C56.7645 42.5658 56.8537 42.7604 56.854 42.9634V46.7068C56.8537 46.9098 56.7645 47.1044 56.6059 47.248C56.4473 47.3915 56.2323 47.4723 56.008 47.4725Z"
        fill="#858687"
      />
      <path
        d="M47.678 42.1847C48.7144 42.1847 49.5546 41.3692 49.5546 40.3632C49.5546 39.3573 48.7144 38.5417 47.678 38.5417C46.6415 38.5417 45.8013 39.3573 45.8013 40.3632C45.8013 41.3692 46.6415 42.1847 47.678 42.1847Z"
        fill="#B2B2B2"
        stroke="#858687"
        stroke-width="3"
      />
      <path
        d="M47.6779 41.5224C48.2876 41.5224 48.7818 41.0034 48.7818 40.3632C48.7818 39.7231 48.2876 39.2041 47.6779 39.2041C47.0682 39.2041 46.574 39.7231 46.574 40.3632C46.574 41.0034 47.0682 41.5224 47.6779 41.5224Z"
        fill="white"
      />
      <path
        d="M74.6739 10.517L73.5381 9.86366C73.1828 9.65939 72.7268 9.78382 72.5199 10.1416L67.3276 19.1005C67.1201 19.4583 67.2402 19.9139 67.5949 20.1182L68.7307 20.7715C69.086 20.9757 69.542 20.8513 69.7496 20.4936L74.9419 11.5346C75.1488 11.1769 75.0293 10.7212 74.6739 10.517Z"
        fill="#D4D4D4"
      />
      <path
        d="M88.9545 26.8528L80.168 31.6844C79.8177 31.8774 79.69 32.3171 79.8837 32.6667L80.5032 33.7847C80.6969 34.1342 81.1384 34.2611 81.4893 34.0682L90.2759 29.2366C90.6268 29.0437 90.7538 28.6039 90.5601 28.2544L89.9406 27.1364C89.7469 26.7869 89.3054 26.6599 88.9545 26.8528Z"
        fill="#D4D4D4"
      />
      <path
        d="M92.2696 49.3433L82.4787 47.1441C82.0881 47.0563 81.6995 47.3008 81.6114 47.6903L81.3297 48.936C81.2416 49.3255 81.4869 49.7124 81.8775 49.8002L91.6684 51.9994C92.0589 52.0872 92.4476 51.8427 92.5357 51.4532L92.8174 50.2075C92.9061 49.818 92.6602 49.4311 92.2696 49.3433Z"
        fill="#D4D4D4"
      />
      <path
        d="M28.6039 13.2732L27.6617 14.1393C27.3674 14.4102 27.3492 14.8675 27.6209 15.1609L34.4282 22.5077C34.6999 22.8011 35.159 22.8194 35.4534 22.5487L36.3955 21.6825C36.6898 21.4117 36.708 20.9544 36.4363 20.661L29.629 13.3141C29.3573 13.0208 28.8982 13.0025 28.6039 13.2732Z"
        fill="#D4D4D4"
      />
      <path
        d="M50.0984 4.21987L48.8167 4.24507C48.416 4.25295 48.0978 4.58294 48.1054 4.98211L48.3035 14.9784C48.3116 15.3775 48.6431 15.6947 49.0437 15.6868L50.3254 15.6616C50.726 15.6538 51.0443 15.3238 51.0361 14.9246L50.838 4.92838C50.8304 4.5292 50.499 4.21199 50.0984 4.21987Z"
        fill="#D4D4D4"
      />
    </svg>
  `;
}

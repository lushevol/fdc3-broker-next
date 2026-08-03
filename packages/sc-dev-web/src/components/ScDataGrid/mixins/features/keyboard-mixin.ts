import { HeaderGroup } from '@tanstack/lit-table';
import { Column } from '@tanstack/table-core';
import { property } from 'lit/decorators.js';
import { TConstructor, safeMixin } from '../../../../shared/mixin.js';
import { clamp } from '../../../../shared/number.js';
import ScElement from '../../../../shared/sc-element.js';
import { storybook } from '../../../../shared/storybook.decorators.js';
import * as Keys from '../../../ScDatePicker/key-values.js';
import { classNamePrefix } from '../../ScDataGrid.style.js';
import { ScDataGridCell } from '../../ScDataGridCell.js';
import { ScDataGridMasterCell } from '../../ScDataGridMasterCell.js';
import { ERowPosition } from '../../types/utils.js';
import { RowHeightObserverMixin } from '../row-height-observer-mixin.js';
import { StyleToolMixin } from '../style-tool-mixin.js';
import { TableStateMixin } from '../table-state-mixin.js';
import { TanstackMixin } from '../tanstack-mixin.js';
import { ColumnFilterMixin } from './column-filter-mixin.js';
import { ColumnOrderingMixin } from './column-order-mixin.js';
import { ColumnResizeStrategy, ColumnSizingMixin } from './column-sizing-mixin.js';
import { RowPinningMixin } from './row-pinning-mixin.js';
import {
  ROW_SELECTION_COLUMN_ID,
  RowSelectionMixin,
} from './row-selection-mixin.js';
import { RowSortingMixin } from './row-sorting-mixin.js';

export type TMixin = {
  enableKeyboard: boolean;
  handleFocusIn(event: FocusEvent): void;
  handleFocusOut(event: FocusEvent): void;
  handleKeyDown(event: KeyboardEvent): void;
  handleKeyUp(event: KeyboardEvent): void;
  setFocusCell(rowId: string, rowIdx: number, colIdx: number): void;
};

export const KeyboardMixin = safeMixin(
  <T extends TConstructor<ScElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin extends ColumnOrderingMixin(
      ColumnFilterMixin(
        ColumnSizingMixin(
          RowPinningMixin(
            RowSortingMixin(
              RowSelectionMixin(
                RowHeightObserverMixin(
                  TanstackMixin(
                    TableStateMixin(StyleToolMixin(classNamePrefix)(superClass))
                  )
                )
              )
            )
          )
        )
      )
    ) {
      @storybook('boolean', {
        description: 'Set to enable keyboard navigation & shortcuts',
        defaultValue: true,
      })
      @property({
        type: Boolean,
        attribute: 'enable-keyboard',
        reflect: true,
      })
      enableKeyboard = false;

      private _focusCell?: ScDataGridCell;
      // track row/col to ensure focus continuity even with col/row spans
      private _focusRowIdx?: number;
      private _focusColIdx?: number;

      private _getHeaderRowId(headerGroup: HeaderGroup<unknown>): string {
        const split = headerGroup.id.split('_');
        return (
          this.staticConst.headerIdPrefix +
          (split[1] ?? split[0] ?? headerGroup.depth)
        );
      }

      handleFocusIn(ev: FocusEvent): void {
        const target = ev.target as HTMLElement;
        const el = target.querySelector<ScDataGridCell>('sc-data-grid-cell');
        if (target.classList.contains('sc-data-grid-cell') && el) {
          this._focusCell = el;
          this._focusRowIdx = (el.cell ?? el.header)?.getRowIndex();
          this._focusColIdx = (el.cell ?? el.header)?.getColIndex();
        } else {
          // refocus on first tabable element
          if (target.classList.contains('sc-data-grid-table')) {
            const selector =
              'sc-data-grid-cell.cell--sc-data-grid-header-0--0, sc-data-grid-cell.cell--0--0';
            target.querySelector<HTMLElement>(selector)?.focus();
          } else if (
            target.classList.contains('sc-data-grid-body-area-viewport')
          ) {
            const cols = this.table
              .getHeaderGroups()[0]
              .headers.reduce((t, h) => h.colSpan + t, 0);
            const rows = this.table.getExpandedRowModel().rows;
            const rowId = this.cleanClassName(rows[rows.length - 1]?.id);
            const selector = `sc-data-grid-cell.cell--${rowId}--${cols - 1}`;
            target.querySelector<HTMLElement>(selector)?.focus();
          }
        }
      }
      handleFocusOut(ev: FocusEvent): void {
        const target = ev.target as HTMLElement;
        if (target.classList.contains('sc-data-grid-cell')) {
          this._focusCell = undefined;
        }
      }

      handleKeyDown(ev: KeyboardEvent): void {
        const fCell = this._focusCell;
        if (
          !fCell ||
          this._focusRowIdx === undefined ||
          this._focusColIdx === undefined ||
          fCell.rowId === undefined
        )
          return;
        let rowIdx = this._focusRowIdx;
        let colIdx = this._focusColIdx;
        let rowId = fCell.rowId;

        root: switch (ev.key) {
          case Keys.keyArrowLeft:
          case Keys.keyArrowRight:
            if (this.shadowRoot?.activeElement !== fCell.parentElement) return;
            const direction = ev.key === Keys.keyArrowLeft ? -1 : 1;
            const columnCount = this.table.getVisibleLeafColumns().length;
            colIdx = (fCell.cell ?? fCell.header)?.getColIndex() ?? colIdx;

            if (fCell.header && ev.shiftKey !== ev.altKey) {
              if (ev.shiftKey && this.columnOrdering) {

                const focusAfterUpdate = () => {
                  this.addEventListener(
                    'ie-table-state-update',
                    async () => {
                      await this.updateComplete;
                      this.setFocusCell(rowId, rowIdx, colIdx);
                    },
                    { once: true }
                  );
                };        

                const column = fCell.header.column;
                const colSpan = fCell.header.colSpan,
                  colId = column.id;
                const columns = this.table.getVisibleColumnHeaders().map(h => h.column);
                const pinned = column.getIsPinned();

                const leftCount = this.table.getLeftVisibleLeafColumns().length;
                const rightCount = this.table.getRightVisibleLeafColumns().length;
                
                // colIdx + direction < this.table.getLeftVisibleLeafColumns().length ||
                // colIdx + direction * fCell.columnSpan >=
                //   columnCount - this.table.getRightVisibleLeafColumns().length

                if (direction < 0) {
                  if (colIdx - 1 < leftCount) {
                    if (pinned !== 'left') {
                      if (ev.ctrlKey) {
                        column.pin('left');
                        focusAfterUpdate();
                      }
                      break root;
                    }
                  } else if (colIdx - 1 <= columnCount - rightCount - 1) {
                    if (pinned === 'right') {
                      if (ev.ctrlKey) {
                        column.pin(false);
                        focusAfterUpdate();
                      }
                      break root;
                    }
                  }
                  if (
                    ev.ctrlKey ||
                    (colIdx > 0 && columns[colIdx - 1].getIsOrderingLocked())
                  )
                    break root;

                  for (let i = colIdx; i < colIdx + colSpan; i++) {
                    if (columns[i].hasId(colId))
                      swapListPosition(columns, i, i - 1);
                  }
                  colIdx--;
                } else {
                  if (colIdx + colSpan > columnCount - rightCount - 1) {
                    if (pinned !== 'right') {
                      if (ev.ctrlKey) {
                        for (let i = rightCount + 1; i > 0; i--) {
                          columns[columnCount - i].pin('right');
                        }
                        focusAfterUpdate();
                      }
                      break root;
                    }
                  } else if (colIdx + colSpan >= leftCount) {
                    if (pinned === 'left') {
                      if (ev.ctrlKey) {
                        column.pin(false);
                        focusAfterUpdate();
                      }
                      break root;
                    }
                  }
                  if (
                    ev.ctrlKey ||
                    (colIdx + colSpan < columnCount &&
                      columns[colIdx + colSpan].getIsOrderingLocked())
                  )
                    break root;

                  for (let i = colIdx + colSpan - 1; i >= colIdx; i--) {
                    if (columns[i].hasId(colId))
                      swapListPosition(columns, i, i + 1);
                  }
                  colIdx += colSpan;
                  
                  if (fCell.header.column.columnDef.meta?.lock) break root;
                }
                if (pinned) {
                  if (pinned === 'left') {
                    for (let i = 0; i < leftCount; i++) {
                      columns[i].pin('left');
                    }
                  } else {
                    for (let i = rightCount; i > 0; i--) {
                      columns[columnCount - i].pin('right');
                    }
                  }
                }

                const order = columns.map(col => col.id);
                this.table.setColumnOrder(order);
                focusAfterUpdate();
              } else if (
                ev.altKey &&
                this.enableResizing &&
                fCell.header.column.getCanResize()
              ) {
                this._resizeColumn(fCell.header.column, direction);
              }
            } else {
              if (ev.ctrlKey && fCell.cell) {
                colIdx = direction < 0 ? 0 : columnCount - 1;
              } else {
                colIdx = clamp(
                  colIdx + (direction < 0 ? -1 : fCell.columnSpan),
                  0,
                  columnCount - 1
                );
              }
              this.setFocusCell(rowId, rowIdx, colIdx);
            }
            break;

          case Keys.keyArrowUp:
          case Keys.keyArrowDown:
          case Keys.keyHome:
          case Keys.keyEnd:
          case Keys.keyTab:
            const headerGroups = this.table.getHeaderGroups();
            const dataRows = this.table.getAllRows();
            rowId = fCell.header
              ? this._getHeaderRowId(headerGroups[rowIdx])
              : dataRows[rowIdx].id;

            if (rowIdx === -1) return;
            switch (ev.key) {
              case Keys.keyArrowUp:
                if (fCell.header) {
                  if (ev.shiftKey) break;
                  rowIdx = Math.max(0, rowIdx - 1);
                  rowId = this._getHeaderRowId(headerGroups[rowIdx]);
                } else if (fCell.cell) {
                  if (dataRows[rowIdx].getIsMasterExpanded()) {
                    const masterCell = this._getMasterCell(rowId);
                    if (masterCell === this.shadowRoot?.activeElement) {
                      // refocus cell
                      break;
                    }
                  }

                  if (rowIdx === 0) {
                    // 1st row, move to last header row
                    rowIdx = headerGroups.length - 1;
                    rowId = this._getHeaderRowId(headerGroups[rowIdx]);
                  } else {
                    rowIdx = ev.ctrlKey ? 0 : rowIdx - 1;
                    rowId = dataRows[rowIdx].id;
                  }
                  
                  // prev row is master
                  if (dataRows[rowIdx].getIsMasterExpanded()) {
                    const masterCell = this._getMasterCell(rowId);
                    if (masterCell && masterCell !== this.shadowRoot?.activeElement) {
                      masterCell.focus();
                      this._focusCell = fCell;
                      this._focusColIdx = colIdx;
                      this._focusRowIdx = rowIdx;
                      break root;
                    }
                  }
                }
                break;

              case Keys.keyArrowDown:
                if (fCell.header) {
                  if (ev.shiftKey) break;
                  if (rowIdx === headerGroups.length - 1) {
                    // last header row, move to body rows
                    rowIdx = 0;
                    rowId = dataRows[rowIdx].id;
                  } else {
                    rowIdx = rowIdx + 1;
                    rowId = this._getHeaderRowId(headerGroups[rowIdx]);
                  }
                } else if (fCell.cell) {
                  if (fCell.cell.row.getIsMasterExpanded()) {
                    const masterCell = this._getMasterCell(rowId);
                    if (
                      masterCell &&
                      masterCell !== this.shadowRoot?.activeElement
                    ) {
                      masterCell.focus();
                      this._focusCell = fCell;
                      break root;
                    }
                  }
                  if (ev.ctrlKey) {
                    rowIdx = dataRows.length - 1;
                  } else {
                    rowIdx = Math.min(
                      dataRows.length - 1,
                      rowIdx + fCell.cell.getSpannedRowIndexes().size + 1
                    );
                  }
                  rowId = dataRows[rowIdx].id;
                }
                break;

              case Keys.keyHome: // top left
                if (fCell.cell) {
                  rowIdx = 0;
                  rowId = dataRows[rowIdx].id;
                  colIdx = 0;
                }
                break;

              case Keys.keyEnd: // bottom right
                if (fCell.cell) {
                  rowIdx = dataRows.length - 1;
                  rowId = dataRows[rowIdx].id;
                  colIdx = (fCell.cell?.row.getVisibleCells().length ?? 1) - 1;
                }
                break;

              case Keys.keyTab:
                const columnCount = fCell.table.getVisibleLeafColumns().length;
                const colSpan =
                  fCell?.header?.colSpan ??
                  1 + (fCell?.cell?.getSpannedColumns().length ?? 0);

                if (ev.shiftKey) {
                  if (fCell.cell && dataRows[rowIdx].getIsMasterExpanded()) {
                    const masterCell = this._getMasterCell(rowId);
                    if (masterCell === this.shadowRoot?.activeElement) {
                      // refocus cell
                      colIdx = columnCount - 1;
                      break;
                    }
                  }
                  colIdx -= colSpan;
                  if (colIdx < 0) {
                    if (rowIdx === 0) {
                      if (fCell.header) {
                        // do nothing, let browser move focus to previous element
                        return;
                      }
                      // move to last header row
                      rowIdx = headerGroups.length - 1;
                      rowId = this._getHeaderRowId(headerGroups[rowIdx]);
                    } else if (fCell.cell) {
                      // move to prev row
                      rowIdx -= 1;
                      rowId = dataRows[rowIdx].id;

                      // prev row is master
                      if (dataRows[rowIdx].getIsMasterExpanded()) {
                        const masterCell = this._getMasterCell(rowId);
                        if (masterCell && masterCell !== this.shadowRoot?.activeElement) {
                          masterCell.focus();
                          this._focusCell = fCell;
                          this._focusColIdx = 0;
                          this._focusRowIdx = rowIdx;
                          break root;
                        }
                      }
                    }
                    colIdx = columnCount - 1;
                  }
                } else {
                  colIdx += colSpan;
                  if (colIdx > columnCount - 1) {
                    if (fCell.header) {
                      if (rowIdx === headerGroups.length - 1) {
                        // move to body rows
                        rowIdx = 0;
                        rowId = dataRows[rowIdx].id;
                      } else {
                        // move to next header row
                        rowIdx += 1;
                        rowId = this._getHeaderRowId(headerGroups[rowIdx]);
                      }
                    } else if (fCell.cell) {
                      if (rowIdx === dataRows.length - 1) {
                        // do nothing, let browser move focus to next element
                        return;
                      }
                      if (fCell.cell.row.getIsMasterExpanded()) {
                        const masterCell = this._getMasterCell(rowId);
                        if (
                          masterCell &&
                          masterCell !== this.shadowRoot?.activeElement
                        ) {
                          masterCell.focus();
                          this._focusCell = fCell;
                          break root;
                        }
                      }

                      rowIdx += 1;
                      rowId = dataRows[rowIdx].id;
                    }
                    colIdx = 0;
                  }
                }
                break;

              default:
                return;
            }
            this.setFocusCell(rowId, rowIdx, colIdx);
            break;

          case Keys.keyPageUp:
          case Keys.keyPageDown:
            const viewport = this.shadowRoot?.querySelector(
              '.sc-data-grid-body-area-viewport'
            );
            if (fCell.cell && viewport) {
              const viewHeight = viewport.clientHeight;
              const dataRows = this.table.getAllRows();
              const n = ev.key === Keys.keyPageDown ? 1 : -1;
              let scroll = 0;
              while (true) {
                const height =
                  this.getFinalizedRowHeight(
                    dataRows[rowIdx].id,
                    ERowPosition.center
                  ) ?? 0;
                if (
                  scroll + height > viewHeight ||
                  rowIdx + n < 0 ||
                  rowIdx + n > dataRows.length - 1
                )
                  break;
                scroll += height;
                rowIdx += n;
              }
              viewport.scrollTop += scroll * n;
              this.setFocusCell(dataRows[rowIdx].id, rowIdx, colIdx);
            }
            break;

          case Keys.keySpace: // toggle checkbox
            if (ev.repeat) break;
            if (fCell.header) {
              if (
                !this.table.getIsSingleSelectionMode() &&
                fCell.header.column.id === ROW_SELECTION_COLUMN_ID
              ) {
                this.handleSelectAll(!this.table.getIsSelectedAll());
              }
            } else if (fCell.cell?.row) {
              if (
                this.rowSelection &&
                (this.enableClickSelection ||
                  fCell.cell.column.id === ROW_SELECTION_COLUMN_ID)
              ) {
                this.handleSelectSingle(fCell.cell.row)(
                  !fCell.cell.row.getIsSelected()
                );
              }
            }
            break;

          case Keys.keyEnter: // header sort / edit mode
            if (ev.repeat) break;
            if (fCell.header) {
              if (ev.ctrlKey) {
                if (fCell.filterable) {
                  this.toggleColumnFilter(
                    new CustomEvent('mouseup', {
                      detail: {
                        type: 'mouseup',
                        target: fCell as unknown as HTMLDivElement,
                      },
                    }),
                    fCell.header.column,
                    this.table
                  );
                  this.columnFilterEl.then(el => el.focus());
                }
              } else if (fCell.sortable) {
                this.handleSort(
                  fCell.header,
                  fCell.sort,
                  fCell.header.column.columnDef.meta?.sortingOrder ?? [],
                  ev.shiftKey
                );
              }
            } else if (fCell.cell) {
              if (fCell.cell.getIsEditable()) {
                fCell.toggleEditing();
              } else if (fCell.isCanExpand) {
                fCell.handleRowExpand(fCell.cell, ev);
              }
            }
            break;

          default:
            return;
        }
        ev.preventDefault();
        ev.stopImmediatePropagation();
      }

      handleKeyUp(ev: KeyboardEvent): void {
        const fCell = this._focusCell;
        if (!fCell) return;

        switch (ev.key) {
          case Keys.keyArrowLeft:
          case Keys.keyArrowRight:
            if (
              fCell.header &&
              ev.altKey &&
              this.enableResizing &&
              fCell.header.column.getCanResize()
            ) {
              this.table.setColumnSizingInfo(old => ({
                ...old,
                isResizingColumn: false,
                startOffset: null,
                startSize: null,
                deltaOffset: null,
                deltaPercentage: null,
                columnSizingStart: [],
              }));
            }
            break;
          default:
            return;
        }
        ev.preventDefault();
        ev.stopImmediatePropagation();
      }

      private _resizeColumn(
        column: Column<unknown, unknown>,
        direction: -1 | 1
      ) {
        const fixedResize =
          this.columnResizeStrategy === ColumnResizeStrategy.fixed;
        const nextColumn = fixedResize
          ? column.getAdjacentColumns().nextColumn
          : undefined;

        const columnId = column.id;

        if (this.tableState.columnSizingInfo?.isResizingColumn !== columnId) {
          // treat startOffset as the startSize of next column
          const startOffset = nextColumn?.getSize() ?? 0;
          const startSize = column.getSize();
          const columnSizingStart: [string, number][] = [[columnId, startSize]];

          this.table.setColumnSizingInfo(old => ({
            ...old,
            startOffset,
            startSize,
            deltaOffset: 0,
            deltaPercentage: 0,
            columnSizingStart,
            isResizingColumn: columnId,
          }));
        }

        const info = this.tableState.columnSizingInfo;
        if (info && info?.isResizingColumn === columnId) {
          const accel =
            Math.min((Math.abs(info.deltaOffset ?? 0) / 10) >> 0, 16) || 1;
          const deltaOffset = clamp(
            (info.deltaOffset ?? 0) + accel * 2 * direction,
            -((info.startSize ?? 0) - (column.columnDef.minSize ?? 0)),
            column.columnDef.maxSize
              ? (info.startSize ?? 0) + column.columnDef.maxSize
              : Number.POSITIVE_INFINITY
          );
          const sizes = { [columnId]: (info.startSize ?? 0) + deltaOffset };
          if (nextColumn) {
            sizes[nextColumn.id] = Math.max(
              (info.startOffset ?? 0) - deltaOffset,
              nextColumn.columnDef.minSize ?? 0
            );
          }

          this.table.setColumnSizingInfo(old => ({
            ...old,
            deltaOffset,
            deltaPercentage: deltaOffset / (old.startSize ?? 0),
          }));
          this.table.setColumnSizing(old => ({
            ...old,
            ...sizes,
          }));
          Object.entries(sizes).forEach(([id, size]) => {
            const col = this.table.getColumn(id);
            if (col) col.columnDef.size = size;
          });
        }
      }

      private _getMasterCell(rowId: string) {
        return this.shadowRoot?.querySelector<ScDataGridMasterCell>(
          `sc-data-grid-master-cell[row-id="${rowId}"]`
        );
      }

      setFocusCell(rowId: string, rowIdx: number, colIdx: number): void {
        const className = `cell--${this.cleanClassName(rowId)}--${colIdx}`;
        const el = this.shadowRoot?.querySelector<HTMLElement>(
          `.sc-data-grid-cell.${className}`
        );
        if (el) {
          el.focus();
          // override focus values so ensure linear continuity
          const cell = el.querySelector<ScDataGridCell>('sc-data-grid-cell');
          if (cell) {
            this._focusCell = cell;
            this._focusRowIdx = rowIdx;
            this._focusColIdx = colIdx;
          }
        }
      }
    }
    return Mixin;
  }
);

function swapListPosition(list: unknown[], i: number, j: number): void {
  if (i !== j) {
    const temp = list[i];
    list[i] = list[j];
    list[j] = temp;
  }
}

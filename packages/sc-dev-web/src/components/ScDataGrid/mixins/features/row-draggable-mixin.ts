import { TemplateResult, html } from 'lit';
import { TConstructor, safeMixin } from '../../../../shared/mixin.js';
import { TableStateMixin } from '../table-state-mixin.js';
import { watch } from '../../../../shared/watch.js';
import { Feature } from '../../types/Feature.js';
import { property, query, state } from 'lit/decorators.js';
import { storybook } from '../../../../shared/storybook.decorators.js';
import { Row } from '@tanstack/lit-table';
import { PaginationMixin } from './pagination-mixin.js';
import ScElement from '../../../../shared/sc-element.js';
import { RowSelectionMixin } from './row-selection-mixin.js';
import { RowHeightObserverMixin } from '../row-height-observer-mixin.js';
import { ERowPosition } from '../../types/utils.js';
import { MasterRowMixin } from '../master-row.mixin.js';
import { RowPinningMixin } from './row-pinning-mixin.js';
import { ScDataGridDraggingShadow } from '../../ScDataGridDraggingShadow.js';
import { memo } from '../../../../shared/memo.js';

export type TMixin = {
  handleDragstart(
    e: CustomEvent<{
      event: DragEvent;
      row: Row<unknown>;
    }>
  ): void;

  handleDragover(
    e: CustomEvent<{
      event: DragEvent;
      row: Row<unknown>;
    }>
  ): void;
  handleDrop(
    e: CustomEvent<{
      event: DragEvent;
      row: Row<unknown>;
    }>
  ): void;
  handleDragend(
    e: CustomEvent<{
      event: DragEvent;
      row: Row<unknown>;
    }>
  ): void;
  handleDragleave(
    e: CustomEvent<{
      event: DragEvent;
      row: Row<unknown>;
    }>
  ): void;
  renderDraggableIndicator(): TemplateResult<1>;
  getRowDraggableOptions(): Record<string, any>;
  enableDragEntireRow?: boolean;
  enableDraggableRow?: boolean;
  renderDraggingRowsLabel: (rows: Row<unknown>[]) => any;
  getDraggingRows(): Row<unknown>[];
};

export const RowDraggableMixin = safeMixin(
  <T extends TConstructor<ScElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin
      extends TableStateMixin(
        RowSelectionMixin(
          PaginationMixin(
            RowHeightObserverMixin(MasterRowMixin(RowPinningMixin(superClass)))
          )
        )
      )
      implements Feature<'rowDraggable'>
    {
      @storybook('object', {
        description: 'Set to render customized label for dragging rows.',
        defaultValue: (rows: Row<unknown>[]) => {
          const draggingRowLen = rows.length;
          return `${draggingRowLen} row${draggingRowLen > 1 ? 's' : ''}`;
        },
      })
      @property({ type: Object })
      renderDraggingRowsLabel: (rows: Row<unknown>[]) => any = rows => {
        const draggingRowLen = rows.length;
        return `${draggingRowLen} row${draggingRowLen > 1 ? 's' : ''}`;
      };

      @storybook('boolean', {
        description: 'Dragging the entire row to change the order of rows.',
        defaultValue: false,
      })
      @property({
        type: Boolean,
        reflect: true,
        attribute: 'enable-drag-entire-row',
      })
      enableDragEntireRow?: boolean;

      @storybook('boolean', {
        description: 'Enable or diable draggable row feature.',
        defaultValue: false,
      })
      @property({
        type: Boolean,
        reflect: true,
        attribute: 'enable-draggable-row',
      })
      enableDraggableRow?: boolean;

      draggingRows: Row<unknown>[] = [];
      previousOverRow: Row<unknown> | null;

      @query('sc-data-grid-dragging-shadow')
      draggingShadow: ScDataGridDraggingShadow;

      @watch(['data', 'rowPinning'])
      handleOrderedRowIdViaDragging() {
        const { top, bottom } = this.rowPinning;
        const allRows = this.table.getRowModel().rows;

        const topAndBottom = new Set([...(top ?? []), ...(bottom ?? [])]);
        const centerRows = allRows.filter(d => !topAndBottom.has(d.id));

        const orderedDraggableRows = this.table.getState().orderedDraggableRows;
        if (centerRows !== orderedDraggableRows) {
          this.table.setOrderedDraggableRows(centerRows);
        }
      }

      getDraggingRows() {
        if (this.rowSelection && this.rowSelectionMode === 'multiple') {
          return this.table.getSelectedRowModel().rows;
        }
        return [];
      }

      @watch('enableDraggableRow')
      updateRowDraggable() {
        this.table.setOptions(prev => {
          return {
            ...prev,
            enableDraggableRow: this.enableDraggableRow,
          };
        });
      }

      getRowDraggableOptions() {
        return {};
      }

      private _allowRowDrop(row: Row<unknown>): boolean {
        return row.getIsDraggable() && this.draggingRows.length > 0;
      }

      getIsEnableDraggableFeature() {
        return this.enableDragEntireRow && this.table.getIsEnableDraggableRow();
      }

      handleDragstart(
        e: CustomEvent<{
          event: DragEvent;
          row: Row<unknown>;
        }>
      ) {
        const { event, row } = e.detail;
        event.stopPropagation();
        if (!this.getIsEnableDraggableFeature()) {
          return;
        }
        if (!row.getIsDraggable()) {
          return;
        }

        const draggingRows = Array.from(this.selectedRowsInOrder).filter(
          row => !row.getIsPinned()
        );
        const allDraggingRows = draggingRows.includes(row)
          ? draggingRows
          : [row];

        const rowEls = allDraggingRows.map(
          row =>
            this.shadowRoot?.querySelector(
              `[row-id="${row.id}"]`
            ) as HTMLElement
        );

        if (rowEls.length && event.dataTransfer) {
          event.dataTransfer.effectAllowed = 'move';
          event.dataTransfer.setDragImage(document.createElement('div'), 0, 0);

          this.draggingRows = allDraggingRows;

          rowEls.forEach(rowEl => {
            rowEl.style.setProperty(
              '--sc-data-grid-draggable-row-active',
              '0.4'
            );
          });

          this.emit('sc-dragstart', {
            detail: {
              rows: this.draggingRows,
            },
          });
          this.previousOverRow = null;
        }
      }

      getDraggingRowsLabel = memo(
        draggingRows => [draggingRows, this.renderDraggingRowsLabel],
        (draggingRows, renderDraggingRowsLabel) => {
          return renderDraggingRowsLabel(draggingRows as Row<unknown>[]);
        }
      );
      handleDragover(
        e: CustomEvent<{
          event: DragEvent;
          row: Row<unknown>;
        }>
      ) {
        const { event, row } = e.detail;

        event.preventDefault();
        event.stopPropagation();

        if (!this.getIsEnableDraggableFeature()) {
          return;
        }

        if (!this._allowRowDrop(row)) {
          event.dataTransfer && (event.dataTransfer.dropEffect = 'none');
          return;
        }
        this.draggingShadow.showPopup();

        this.draggingShadow.label = this.getDraggingRowsLabel(
          this.draggingRows
        );

        this.draggingShadow.updateDraggingShadowPosition(
          event.clientX,
          event.clientY
        );

        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = 'move';

          if (this.draggingRows.includes(row)) {
            return;
          }
          const rowEl = this.shadowRoot?.querySelector(`[row-id="${row.id}"]`);
          if (rowEl) {
            const { top, bottom } = rowEl.getBoundingClientRect();
            if (event.clientY < (top + bottom) / 2) {
              rowEl.setAttribute('placement', 'before');
            } else {
              rowEl.setAttribute('placement', 'after');
            }

            if (this.previousOverRow !== row) {
              this.emit('sc-dragover', {
                detail: {
                  rows: this.draggingRows,
                  targetRow: row,
                },
              });
              this.previousOverRow = row;
            }
          }
        }
      }
      handleDrop(
        e: CustomEvent<{
          event: DragEvent;
          row: Row<unknown>;
        }>
      ) {
        const { event, row } = e.detail;
        event.stopPropagation();
        if (!this.getIsEnableDraggableFeature()) {
          return;
        }
        if (!this._allowRowDrop(row)) {
          return;
        }

        const rowEl = this.shadowRoot?.querySelector(`[row-id="${row.id}"]`);

        if (this.draggingRows.includes(row)) {
          return;
        }
        if (this.draggingRows.length && rowEl) {
          const placement = rowEl.getAttribute('placement');
          const orderedDraggableRows =
            this.table.getState().orderedDraggableRows;

          const orderedRowIdsViaDragging = [];
          for (let i = 0, len = orderedDraggableRows.length; i < len; ++i) {
            const currentRow = orderedDraggableRows[i];
            if (this.draggingRows.includes(currentRow)) {
              continue;
            }
            if (currentRow.id === row.id) {
              if (placement === 'before') {
                orderedRowIdsViaDragging.push(
                  ...this.draggingRows.map(r => r.id)
                );
                orderedRowIdsViaDragging.push(currentRow.id);
              } else if (placement === 'after') {
                orderedRowIdsViaDragging.push(currentRow.id);
                orderedRowIdsViaDragging.push(
                  ...this.draggingRows.map(r => r.id)
                );
              }
            } else {
              orderedRowIdsViaDragging.push(currentRow.id);
            }
          }
          rowEl.removeAttribute('placement');
          this.table.setOrderedRowIdViaDragging(orderedRowIdsViaDragging);

          const flatRows = orderedDraggableRows.reduce((res, row) => {
            return res.set(row.id, row);
          }, new Map());
          this.table.setOrderedDraggableRows(
            orderedRowIdsViaDragging.map(rowId => flatRows.get(rowId))
          );

          this.updatePrefixSum(ERowPosition.center);
          this.updateMasterRowPrefixSum();

          this.updateComplete.then(() => {
            requestAnimationFrame(() => {
              this.table.updateRowSpanning();
            });
          });

          this.emit('sc-drop', {
            detail: {
              rows: this.draggingRows,
              targetRow: row,
              placement,
            },
          });
        }
      }
      handleDragend(
        e: CustomEvent<{
          event: DragEvent;
          row: Row<unknown>;
        }>
      ) {
        const { event, row } = e.detail;
        event.stopPropagation();
        if (!this.getIsEnableDraggableFeature()) {
          return;
        }
        if (!row.getIsDraggable()) {
          return;
        }

        const rowEl = this.shadowRoot?.querySelector(`[row-id="${row.id}"]`) as
          | HTMLElement
          | undefined;
        rowEl?.removeAttribute('placement');

        const rowEls = this.draggingRows.map(
          row =>
            this.shadowRoot?.querySelector(
              `[row-id="${row.id}"]`
            ) as HTMLElement
        );

        rowEls.forEach(rowEl => {
          rowEl.style.removeProperty('--sc-data-grid-draggable-row-active');
        });

        this.draggingRows = [];

        this.draggingShadow.hidePopup();

        this.emit('sc-dragend', {
          detail: {
            targetRow: row,
          },
        });
        this.previousOverRow = null;
      }
      handleDragleave(
        e: CustomEvent<{
          event: DragEvent;
          row: Row<unknown>;
        }>
      ) {
        const { event, row } = e.detail;
        event.stopPropagation();

        if (!this.getIsEnableDraggableFeature()) {
          return;
        }
        if (!this._allowRowDrop(row)) {
          return;
        }

        const rowEl = this.shadowRoot?.querySelector(`[row-id="${row.id}"]`);
        rowEl?.removeAttribute('placement');

        if (!this.draggingRows.includes(row) && this.previousOverRow) {
          this.emit('sc-dragleave', {
            detail: {
              rows: this.draggingRows,
              targetRow: row,
            },
          });
          this.previousOverRow = null;
        }
      }
      renderDraggableIndicator() {
        return html`<div class="draggable-row-indicator"></div>`;
      }
    }
    return Mixin;
  }
);

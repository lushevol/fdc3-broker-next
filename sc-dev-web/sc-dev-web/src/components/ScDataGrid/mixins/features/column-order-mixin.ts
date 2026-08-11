import ScElement from '../../../../shared/sc-element.js';
import { TConstructor, safeMixin } from '../../../../shared/mixin.js';
import { TableStateMixin } from '../table-state-mixin.js';
import { Feature } from '../../types/Feature.js';
import { property } from 'lit/decorators.js';
import { storybook } from '../../../../shared/storybook.decorators.js';
import { ScDataGridCell } from '../../ScDataGridCell.js';
import { ColumnOrderState, Header, Updater } from '@tanstack/table-core';
import { debounce, DebouncedFunction } from '../../../../shared/debounce.js';
import { INTERNAL_EVENTS } from '../../../../shared/sc-custom-events.js';

export type TMixin = {
  getColumnOrderingOptions(): Record<string, any>;
  columnOrdering: boolean;
  enableDragColumn: boolean;
  handleHeaderMousedown(event: MouseEvent): void;
  handleHeaderDragstart(event: DragEvent): void;
  handleHeaderDragend(event: DragEvent): void;
  handleHeaderDragleave(event: DragEvent): void;
  handleHeaderDragover(event: DragEvent): void;
  handleHeaderDrop(event: DragEvent): void;
  _handleManageColumnChange: DebouncedFunction<() => void>;
};

export const ColumnOrderingMixin = safeMixin(
  <T extends TConstructor<ScElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin
      extends TableStateMixin(superClass)
      implements Feature<'columnOrdering'>
    {
      @storybook('boolean', {
        description: 'Set to reorder columns',
        defaultValue: false,
      })
      @property({ type: Boolean, attribute: 'column-ordering', reflect: true })
      columnOrdering = false;

      @storybook('boolean', {
        description: 'Dragging the column header to change the order.',
        defaultValue: false,
      })
      @property({
        type: Boolean,
        reflect: true,
        attribute: 'enable-drag-column',
      })
      enableDragColumn = false;

      private _dragHeader?: Header<unknown, unknown>;
      private _clone?: HTMLElement;

      connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener(
          INTERNAL_EVENTS['sc-column-order'],
          this._handleManageColumnChange
        );
        this.addEventListener(
          INTERNAL_EVENTS['sc-column-visibility'],
          this._handleManageColumnChange
        );
      }
      disconnectedCallback(): void {
        super.disconnectedCallback();
        this.removeEventListener(
          INTERNAL_EVENTS['sc-column-order'],
          this._handleManageColumnChange
        );
        this.removeEventListener(
          INTERNAL_EVENTS['sc-column-visibility'],
          this._handleManageColumnChange
        );
      }

      _handleManageColumnChange = debounce(() => {
        const table = this.table;
        const columns = table.getColumnHeaders().map(({ column }) => ({
          id: column.id,
          column,
          visible: column.getIsVisible(),
          locked: column.getIsOrderingLocked(),
          pinned: column.getIsPinned(),
          builtin: !![
            ...(this.builtInColumns.prefix ?? []),
            ...(this.builtInColumns.suffix ?? []),
          ].find(v => v.id === column.id),
        }));
        this.emit('sc-column-order', { detail: { columns, table } });
      }, 50);

      updateColumnOrdering() {}

      getColumnOrderingOptions() {
        return {
          onColumnOrderChange: (order: Updater<ColumnOrderState>) => {
            const columnOrder = order instanceof Function ? order(this.table.getState().columnOrder) : order;
            // fixes column order from manager not including build in prefix (ie row selection)
            const prefixes = (this.builtInColumns.prefix ?? [])
              .map(c => `${c.id ?? ('accessorKey' in c && c.accessorKey)}`)
              .filter(id => !columnOrder.includes(id));
            columnOrder.splice(0, 0, ...prefixes);

            // console.log(order);
            this.table.setState(old => ({
              ...old,
              columnOrder,
            }));
            this.internalEmit(INTERNAL_EVENTS['sc-column-order']);
          },
        };
      }

      handleHeaderMousedown(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (target.tagName !== 'SC-DATA-GRID-CELL')
          event.preventDefault();
      }

      handleHeaderDragstart(event: DragEvent) {
        event.stopPropagation();
        const el = event.currentTarget as HTMLElement;
        const cell = el.querySelector<ScDataGridCell>('sc-data-grid-cell');
        const header = cell?.header;
        const column = header?.column;
        const dt = event.dataTransfer;
        if (dt && column && cell && !header?.isPlaceholder) {
          if (
            !['ordering', true].includes(
              column.columnDef.meta?.lock ?? false
            ) ||
            (event.ctrlKey && column.getCanPin())
          ) {
            this._dragHeader = header;
            dt.effectAllowed = 'move';

            const clone = el.cloneNode(true) as HTMLElement;
            el.classList.add('drag-start');
            const rect = el.getBoundingClientRect();
            clone.style.width = `${rect.width}px`;
            clone.style.height = `${rect.height}px`;
            clone.classList.add('drag-clone');
            const cellClone = clone.querySelector<ScDataGridCell>('sc-data-grid-cell');
            if (cellClone) cellClone.header = cell.header;
            const headerArea = this.shadowRoot?.querySelector('.sc-data-grid-header-area');
            if (headerArea) {
              const rect = headerArea.getBoundingClientRect();
              clone.style.setProperty('--offset-x', `${rect.x + event.offsetX}px`);
              clone.style.setProperty('--offset-y', `${rect.y + event.offsetY}px`);
              headerArea.appendChild(clone);
            }
            this._clone = clone;
            dt.setDragImage(document.createElement('span'), 0, 0);
            return;
          }
        }
        event.preventDefault();
      }
      handleHeaderDragend(event: DragEvent) {
        event.stopPropagation();
        const el = event.currentTarget as HTMLElement;
        el.classList.remove('drag-start');
        this._dragHeader = undefined;
        this._clone?.remove();
        this._clone = undefined;
      }
      handleHeaderDragover(event: DragEvent) {
        this.handleHeaderDragleave(event);

        const header = this._dragHeader;
        const column = header?.column;
        const el = event.currentTarget as HTMLElement;
        const cell = el.querySelector<ScDataGridCell>('sc-data-grid-cell');
        const target = cell?.header;

        if (column && target && cell) {
          const srcIndex = header.getColIndex();
          const targetIndex = target.getColIndex();

          const columns = this.table.getVisibleColumnHeaders();
          const leftCount = this.table.getLeftVisibleLeafColumns().length;
          const rightCount = this.table.getRightVisibleLeafColumns().length;

          if (event.ctrlKey) {
            if (target.column.getIsOrderingLocked() && srcIndex !== targetIndex)
              return;

            const pinned = header.column.getIsPinned();
            if (pinned === 'left') {
              if (targetIndex < leftCount - 1) return;
            } else if (pinned === 'right') {
              if (targetIndex > columns.length - rightCount) return;
            } else if (
              targetIndex > leftCount &&
              targetIndex < columns.length - rightCount - 1
            ) {
              return;
            }
            // can only pin/unpin
            if (column.getIsOrderingLocked() && srcIndex !== targetIndex)
              return;

          } else {
            if (
              column.getIsOrderingLocked() ||
              target.column.getIsOrderingLocked()
            )
              return;

            const pinned = header.column.getIsPinned();
            if (pinned === 'left') {
              if (targetIndex > leftCount - 1) return;
            } else if (pinned === 'right') {
              if (targetIndex < columns.length - rightCount) return;
            } else if (
              targetIndex < leftCount ||
              targetIndex > columns.length - rightCount - 1
            ) {
              return;
            }
          }

          el.classList.add('drop-valid');
          if (targetIndex < srcIndex) {
            el.classList.add('drop-before');
          } else {
            if (targetIndex === srcIndex) {
              if (event.ctrlKey) {
                if (
                  srcIndex === leftCount ||
                  srcIndex === columns.length - rightCount
                ) {
                  el.classList.add('drop-before');
                } else if (
                  srcIndex === leftCount - 1 ||
                  srcIndex === columns.length - rightCount - 1
                ) {
                  el.classList.add('drop-after');
                }
              }
            } else {
              el.classList.add('drop-after');
            }
          }
          event.preventDefault();
        }

        if (this._clone) {
          this._clone.style.display = 'block';
          this._clone.style.setProperty('--client-x', `${event.clientX}px`);
          this._clone.style.setProperty('--client-y', `${event.clientY}px`);
        }
      }
      handleHeaderDragleave(event: DragEvent) {
        event.stopPropagation();
        const el = event.currentTarget as HTMLElement;
        el.classList.remove('drop-valid', 'drop-before', 'drop-after');
        if (this._clone) {
          this._clone.style.display = 'none';
        }
      }
      handleHeaderDrop(event: DragEvent) {
        const el = event.currentTarget as ScDataGridCell;
        const valid = el.classList.contains('drop-valid');

        this.handleHeaderDragleave(event);

        const source = this._dragHeader;
        const target =
          el.querySelector<ScDataGridCell>('sc-data-grid-cell')?.header;
        if (valid && source && target) {
          const sourceIds = source.getLeafsOnly().map(h => h.column.id);
          const targetIds = target.getLeafsOnly().map(h => h.column.id);

          const order = this.table
            .getVisibleColumnHeaders()
            .map(h => h.column.id);
          const sourceIndex = order.indexOf(sourceIds[0]);
          const targetIndex = order.indexOf(targetIds[0]);

          function updateOrder() {
            if (sourceIndex < targetIndex) {
              order.splice(sourceIndex, sourceIds.length);
              order.splice(
                order.indexOf(targetIds[0]) + targetIds.length,
                0,
                ...sourceIds
              );
            } else {
              order.splice(sourceIndex, sourceIds.length);
              order.splice(targetIndex, 0, ...sourceIds);
            }
          }

          if (event.ctrlKey || source.column.getIsPinned()) {
            const column = source.column;
            let leftCount = this.table.getLeftVisibleLeafColumns().length;
            let rightCount = this.table.getRightVisibleLeafColumns().length;

            if (
              targetIndex <=
              leftCount -
                (event.ctrlKey && column.getIsPinned() === 'left' ? 2 : 0)
            ) {
              updateOrder();
              if (column.getIsPinned() !== 'left') leftCount++;
              for (let i = 0; i < leftCount; i++) {
                this.table.getColumn(order[i])?.pin('left');
              }
            } else if (
              targetIndex >=
              order.length -
                rightCount +
                (event.ctrlKey && column.getIsPinned() === 'right' ? 1 : -1)
            ) {
              updateOrder();
              if (column.getIsPinned() !== 'right') rightCount++;
              for (let i = order.length - rightCount; i < order.length; i++) {
                this.table.getColumn(order[i])?.pin('right');
              }
            } else {
              if (column.getIsPinned()) column.pin(false);
              updateOrder();
            }
          } else if (!sourceIds.filter(v => targetIds.includes(v)).length) {
            updateOrder();
          }
          this.table.setColumnOrder(order);
          this._dragHeader = undefined;
        }
      }
    }
    return Mixin;
  }
);

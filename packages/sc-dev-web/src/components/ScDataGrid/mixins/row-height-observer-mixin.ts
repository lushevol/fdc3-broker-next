import { TConstructor, safeMixin } from '../../../shared/mixin.js';
import { debounce } from '../../../shared/debounce.js';
import ScElement from '../../../shared/sc-element.js';
import type { ScDataGridCell } from '../ScDataGridCell.js';
import { ERowPosition, RowHeightEventType } from '../types/utils.js';
import { TableStateMixin } from './table-state-mixin.js';
import { storybook } from '../../../shared/storybook.decorators.js';
import { property } from 'lit/decorators.js';
import { Row } from '@tanstack/lit-table';
import { watch } from '../../../shared/watch.js';

export type TMixin = {
  compact: boolean;
  hideHeader: boolean;
  handleRowHeightUpdate(
    rowHeightInfo: RowHeightEventType,
    rowPosition: ERowPosition
  ): void;
  getRowHeightStyle(
    rowId: string,
    rowPosition: ERowPosition
  ): {
    height?: string;
  };
  getFinalizedRowHeight(
    rowId: string,
    rowPosition: ERowPosition
  ): number | undefined;
  makePoolId(
    rowId: string,
    columnId: string,
    rowPosition: ERowPosition
  ): string;
  collectToPool(poolId: string, el?: Element): void;
  cellPool: Map<string, ScDataGridCell>;
  getRowPrefixSum(rowPosition: ERowPosition): number[];
  updateRowHeight(paras: RowHeightEventType, rowPosition: ERowPosition): void;
  getRowTotalSize(rowPosition: ERowPosition): number;
  rowHeightMap: Record<ERowPosition, Map<string, Map<string, number>>>;
  rowHeight: Record<ERowPosition, Map<string, number>>;
  rowPrefixSum: Record<ERowPosition, number[]>;
  updatePrefixSum(rowPosition: ERowPosition): void;
  getRowsByPosition(rowPosition: ERowPosition): {
    id: string;
  }[];
  getRowHeight?: (row: Row<unknown>) => number | undefined | null;
  getRowMaxHeight?: (row: Row<unknown>) => number | undefined | null;
  getRowMinHeight?: (row: Row<unknown>) => number | undefined | null;
  finalizePredefinedRowHeight(
    getHeightFn: (row: Row<unknown>) => number | null | undefined
  ): Record<string, number>;
};

export const RowHeightObserverMixin = safeMixin(
  <T extends TConstructor<ScElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin extends TableStateMixin(superClass) {
      @storybook('boolean', {
        description: 'Enable compact mode. Make the row height lower.',
        defaultValue: false,
      })
      @property({ type: Boolean, reflect: true })
      compact = false;

      @storybook('boolean', {
        description: 'Set to hide the header.',
        defaultValue: false,
      })
      @property({ type: Boolean, reflect: true, attribute: 'hide-header' })
      hideHeader = false;

      @storybook('object', {
        description: 'Set to ',
        defaultValue: () => null,
      })
      @property({ type: Object })
      getRowHeight?: (row: Row<unknown>) => number | undefined | null;

      @storybook('object', {
        description: 'Set to ',
        defaultValue: () => null,
      })
      @property({ type: Object })
      getRowMaxHeight?: (row: Row<unknown>) => number | undefined | null;

      @storybook('object', {
        description: 'Set to ',
        defaultValue: () => null,
      })
      @property({ type: Object })
      getRowMinHeight?: (row: Row<unknown>) => number | undefined | null;

      // 4 parts: header, top center bottom
      /**
       * top map key: row id
       * sub map key: column index
       */
      rowHeightMap: Record<ERowPosition, Map<string, Map<string, number>>> = {
        header: new Map<string, Map<string, number>>(),
        top: new Map<string, Map<string, number>>(),
        center: new Map<string, Map<string, number>>(),
        bottom: new Map<string, Map<string, number>>(),
      };

      /**
       * map key: row id
       * map value: row maximum height
       */
      rowHeight: Record<ERowPosition, Map<string, number>> = {
        header: new Map<string, number>(),
        top: new Map<string, number>(),
        center: new Map<string, number>(),
        bottom: new Map<string, number>(),
      };

      /**
       * prefix sum array
       */
      rowPrefixSum: Record<ERowPosition, number[]> = {
        header: [],
        top: [],
        center: [],
        bottom: [],
      };

      finalizePredefinedRowHeight(
        getHeightFn: (row: Row<unknown>) => number | null | undefined
      ) {
        const res: Record<string, number> = {};
        this.table.getCoreRowModel().flatRows.forEach(row => {
          const height = getHeightFn(row);
          if (height) {
            res[row.id] = height;
          }
        });
        return res;
      }

      @watch('getRowMaxHeight')
      onGetRowMaxheightChange() {
        const { getRowMaxHeight } = this;
        if (!getRowMaxHeight) {
          this.table.resetRowMaxHeight();
        } else {
          this.table.setRowMaxHeight(
            this.finalizePredefinedRowHeight(getRowMaxHeight)
          );
        }
      }
      @watch('getRowMinHeight')
      onGetRowMinHeightChange() {
        const { getRowMinHeight } = this;
        if (!getRowMinHeight) {
          this.table.resetRowMinHeight();
        } else {
          this.table.setRowMinHeight(
            this.finalizePredefinedRowHeight(getRowMinHeight)
          );
        }
      }

      @watch('getRowHeight')
      onGetRowHeightChange() {
        const { getRowHeight } = this;
        if (!getRowHeight) {
          this.table.resetRowHeight();
        } else {
          this.table.setRowHeight(
            this.finalizePredefinedRowHeight(getRowHeight)
          );
        }
      }

      forceUpdate = debounce(() => {
        this.requestUpdate();
      }, 17);

      makeRowIdByHeader = (row: { id: string }) => {
        return `${this.staticConst.headerIdPrefix}${row.id}`;
      };

      getRowsByPosition(rowPosition: ERowPosition) {
        let rows: { id: string }[] = [];
        if (rowPosition === ERowPosition.top) {
          rows = this.table.getTopRows();
        } else if (rowPosition === ERowPosition.center) {
          rows = this.table.getCenterRowsAfterDragging();
        } else if (rowPosition === ERowPosition.bottom) {
          rows = this.table.getBottomRows();
        } else {
          rows = this.table.getHeaderGroups();
        }
        return rows;
      }

      makeGetIdFn(rowPosition: ERowPosition) {
        let getId = (row: { id: string }) => row.id;
        if (rowPosition === ERowPosition.header) {
          getId = this.makeRowIdByHeader;
        }
        return getId;
      }
      updatePrefixSum(rowPosition: ERowPosition) {
        const rows = this.getRowsByPosition(rowPosition);
        const getId = this.makeGetIdFn(rowPosition);
        let sum = 0;
        const res: number[] = [0];
        const rowHeights = this.rowHeight[rowPosition];
        const prev =
          this.rowPrefixSum[rowPosition]?.slice(1).map(
            (v, i, arr) => v - (arr[i - 1] || 0)
          ) || Array.from(rowHeights.values()).slice(0, rows.length);
        const maxHeight = Math.max(...prev, 0);

        rows.forEach((row, i) => {
          const rowHeight = rowHeights.get(getId(row));
          sum += rowHeight ?? prev[i] ?? maxHeight;
          res.push(sum);
        });

        this.rowPrefixSum[rowPosition] = res;
      }

      getRowTotalSize(rowPosition: ERowPosition) {
        if (!this.rowPrefixSum[rowPosition])
          this.updatePrefixSum(rowPosition);
        const list = this.rowPrefixSum[rowPosition];
        return list[list.length - 1] || 0;
      }

      getRowPrefixSum(rowPosition: ERowPosition) {
        return this.rowPrefixSum[rowPosition];
      }

      updateRowHeight(paras: RowHeightEventType, rowPosition: ERowPosition) {
        const { rowId, columnId, height } = paras;
        const particularAreaRowHeight = this.rowHeightMap[rowPosition];
        const particularRowHeight = particularAreaRowHeight.get(rowId);

        let canUpdate = false;
        if (!particularRowHeight) {
          particularAreaRowHeight.set(rowId, new Map([[columnId, height]]));
          canUpdate = true;
        } else if (particularRowHeight.get(columnId) !== height) {
          particularRowHeight.set(columnId, height);
          canUpdate = true;
        }
        if (canUpdate) {
          this.rowHeight[rowPosition].set(
            rowId,
            this.getFinalizedRowHeight(rowId, rowPosition)
          );
          this.forceUpdate();
        }
      }
      getRowHeightStyle(rowId: string, rowPosition: ERowPosition) {
        const res: { height?: string, overflow?: string } = {};

        const height = this.rowHeight[rowPosition].get(rowId);

        if (typeof height !== 'undefined') {
          res.height = `${height}px`;
          if (height === 0) 
            res.overflow = 'hidden';
        }
        return res;
      }

      getFinalizedRowHeight(rowId: string, rowPosition: ERowPosition) {
        const rowHeightMap = this.rowHeightMap[rowPosition].get(rowId);
        if (rowHeightMap) {
          return Math.max(...Array.from(rowHeightMap.values()));
        }
        return 0;
      }

      handleRowHeightUpdate(
        rowHeightInfo: RowHeightEventType,
        rowPosition: ERowPosition
      ) {
        this.updateRowHeight(rowHeightInfo, rowPosition);
        this.updatePrefixSum(rowPosition);
      }

      cellPool = new Map<string, ScDataGridCell>();

      makePoolId(rowId: string, columnId: string, rowPosition: ERowPosition) {
        return `${rowId}-${columnId}-scope:${rowPosition}`;
      }

      collectToPool(poolId: string, el?: Element) {
        if (el) {
          if (!this.cellPool.get(poolId)) {
            this.cellPool.set(poolId, el as ScDataGridCell);
          }
        }
      }
    }
    return Mixin;
  }
);

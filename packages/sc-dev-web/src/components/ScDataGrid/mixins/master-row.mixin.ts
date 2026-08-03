import { TConstructor, safeMixin } from '../../../shared/mixin.js';
import ScElement from '../../../shared/sc-element.js';
import { TableStateMixin } from './table-state-mixin.js';
import { type ScDataGridMasterCell } from '../ScDataGridMasterCell.js';

export type TMixin = {
  getMasterRowHeightStyle(rowId: string): string;

  handleMasterRowHeightUpdate(
    e: CustomEvent<{
      height: number;
    }>,
    rowId: string,
    rowIndex: number
  ): void;
  collectMasterCell(rowId: string): (masterCell?: Element) => void;
  getReuableMasterCell(rowId: string): ScDataGridMasterCell | undefined;
  getMasterRowsSize(rowIndex: number): number;
  getMasterRowTotlaSize(): number;
  updateMasterRowPrefixSum(): void;
};

export const MasterRowMixin = safeMixin(
  <T extends TConstructor<ScElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin extends TableStateMixin(superClass) {
      /**
       * map key: row id
       * map value row height
       */
      masterRowHeight = new Map<string, number>();
      masterRowPrefixSum: number[] = [];
      cachedMasterCell: Map<string, ScDataGridMasterCell> = new Map();

      getMasterRowHeightStyle(rowId: string) {
        const masterRowHeight =
          this.table.getState().masterRowHeight ?? new Map();
        const height = masterRowHeight.get(rowId);
        if (height) {
          return `${height}px`;
        }
        return '0';
      }
      getReuableMasterCell(rowId: string) {
        return this.cachedMasterCell.get(rowId);
      }
      collectMasterCell(rowId: string) {
        return (masterCell?: Element) => {
          if (masterCell) {
            this.cachedMasterCell.set(
              rowId,
              masterCell as ScDataGridMasterCell
            );
          }
        };
      }

      getMasterRowTotlaSize() {
        // @ts-ignore
        return this.masterRowPrefixSum.at(-1) ?? 0;
      }

      getMasterRowsSize(rowIndex: number) {
        return (
          this.masterRowPrefixSum[rowIndex] ??
          // @ts-ignore
          this.masterRowPrefixSum.at(-1) ??
          0
        );
      }

      updateMasterRowPrefixSum() {
        const rows = this.table.getCenterRowsAfterDragging();
        let sum = 0;
        const res: number[] = [];
        rows.forEach(row => {
          const rowHeight = this.masterRowHeight.get(row.id) ?? 0;
          res.push(sum);
          sum = sum + rowHeight;
        });
        res.push(sum);
        this.masterRowPrefixSum = res;
      }
      handleMasterRowHeightUpdate(
        e: CustomEvent<{
          height: number;
        }>,
        rowId: string,
        rowIndex: number
      ) {
        this.table.setMasterRowHeight(old => {
          old.set(rowId, e.detail.height);
          return new Map(old);
        });
        this.masterRowHeight.set(rowId, e.detail.height);
        this.updateMasterRowPrefixSum();
      }
    }
    return Mixin;
  }
);

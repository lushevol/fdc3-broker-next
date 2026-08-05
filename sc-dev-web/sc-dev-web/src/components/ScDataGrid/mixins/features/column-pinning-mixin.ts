import { LitElement } from 'lit';
import { TConstructor, safeMixin } from '../../../../shared/mixin.js';
import { Cell, ColumnPinningState } from '@tanstack/lit-table';
import { watch } from '../../../../shared/watch.js';
import { TableStateMixin } from '../table-state-mixin.js';
import { Feature } from '../../types/Feature.js';
import { EPosition, TPosition } from '../../types/utils.js';

export type TMixin = {
  updateColumnPinning(): void;
  getPositionIndex(position: string): 0 | 1 | 2;
  makeGetPositionCellsFn(
    position: TPosition
  ): (cells: Cell<unknown, unknown>[]) => Cell<unknown, unknown>[];
  getColumnPinningOptions(): Record<string, any>;
};
export const ColumnPinningMixin = safeMixin(
  <T extends TConstructor<LitElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin
      extends TableStateMixin(superClass)
      implements Feature<'columnPinning'>
    {
      @watch('columns')
      updateColumnPinning() {
        this.updateColumnPinningState();
      }
      getColumnPinningOptions() {
        return {};
      }

      updateColumnPinningState() {
        const pinningState: Required<ColumnPinningState> = {
          left: [],
          right: [],
        };
        const columns = this.table.getAllLeafColumns();
        columns.forEach(column => {
          const pinned = column.getIsInheritedPinned();
          if (pinned === 'left') {
            pinningState.left.push(column.id);
          }
          if (pinned === 'right') {
            pinningState.right.unshift(column.id);
          }
        });
        this.table.setColumnPinning(pinningState);
      }

      getPositionIndex(position: string) {
        if (position === EPosition.left) {
          return 0;
        } else if (position === EPosition.center) {
          return 1;
        }
        return 2;
      }

      /**
       * all cells -> filtered cells by position
       * @param position pinned position
       * @returns cells -> filtered cells
       */
      makeGetPositionCellsFn(position: TPosition) {
        const finalizedPos =
          position === EPosition.center ? false : position.toLowerCase();
        return (cells: Cell<unknown, unknown>[]) => {
          return cells.filter(
            cell => cell.column.getIsPinned() === finalizedPos
          );
        };
      }
    }
    return Mixin;
  }
);

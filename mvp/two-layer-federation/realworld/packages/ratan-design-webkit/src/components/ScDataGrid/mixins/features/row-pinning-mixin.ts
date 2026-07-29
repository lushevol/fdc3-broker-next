import { LitElement } from 'lit';
import { TConstructor, safeMixin } from '../../../../shared/mixin.js';
import { TableStateMixin } from '../table-state-mixin.js';
import { watch } from '../../../../shared/watch.js';
import { Feature } from '../../types/Feature.js';
import { property } from 'lit/decorators.js';
import { storybook } from '../../../../shared/storybook.decorators.js';
import { Row, RowPinningState } from '@tanstack/lit-table';

export type TMixin = {
  rowPinning: RowPinningState;
  getRowPinningOptions(): {
    keepPinnedRows: boolean;
  };
  getAllRows(): Row<unknown>[];
};

export const RowPinningMixin = safeMixin(
  <T extends TConstructor<LitElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin
      extends TableStateMixin(superClass)
      implements Feature<'rowPinning'>
    {
      @storybook('object', {
        description: 'Set to pin rows on top or bottom',
        defaultValue: { top: [], bottom: [] },
      })
      @property({ type: Object })
      rowPinning: RowPinningState = { top: [], bottom: [] };

      @watch('rowPinning')
      updateRowPinning() {
        this.table.setRowPinning(this.rowPinning);
      }
      getRowPinningOptions() {
        return {
          keepPinnedRows: false,
        };
      }

      getAllRows() {
        return [
          ...this.table.getTopRows(),
          ...this.table.getCenterRows(),
          ...this.table.getBottomRows(),
        ];
      }
    }
    return Mixin;
  }
);

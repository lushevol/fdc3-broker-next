import { LitElement } from 'lit';
import { TConstructor, safeMixin } from '../../../../shared/mixin.js';
import { TableStateMixin } from '../table-state-mixin.js';
import { watch } from '../../../../shared/watch.js';
import { Feature } from '../../types/Feature.js';
import {
  RowModel,
  Table,
  TableState,
  Updater,
  functionalUpdate,
  getGroupedRowModel,
} from '@tanstack/lit-table';

export type TMixin = {
  getGroupingOptions(): {
    getGroupedRowModel: (table: Table<unknown>) => () => RowModel<unknown>;
    onGroupingChange(updater: Updater<TableState['grouping']>): void;
  };
};

// ANA: server-side grouping isn't easy to do. need more research and more testing
// ANA: grouping has a highest priority, when enable for a column. will disable others, like master detail

export const GroupingMixin = safeMixin(
  <T extends TConstructor<LitElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin
      extends TableStateMixin(superClass)
      implements Feature<'grouping'>
    {
      @watch('columns')
      updateGrouping() {
        const groupingState = this.table
          .getAllLeafColumns()
          .filter(column => column.columnDef.meta?.rowGrouping)
          .map(column => column.id);
        this.table.setGrouping(groupingState);
      }
      getGroupingOptions() {
        return {
          getGroupedRowModel: getGroupedRowModel(),
          onGroupingChange: (updater: Updater<TableState['grouping']>) => {
            this.updateGroupingState(updater);
          },
        };
      }

      updateGroupingState(updater: Updater<TableState['grouping']>) {
        const rowSpanning = this.table.getRowSpanning();
        if (rowSpanning) {
          this.table.setRowSpanning(rowSpanning);
        }
        this.table.setState((old: TableState) => {
          return {
            ...old,
            grouping: functionalUpdate(updater, (old as any)['grouping']),
          };
        });
      }
    }
    return Mixin;
  }
);

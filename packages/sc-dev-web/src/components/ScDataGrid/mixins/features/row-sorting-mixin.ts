import { TConstructor, safeMixin } from '../../../../shared/mixin.js';
import { TableStateMixin } from '../table-state-mixin.js';
import { watch } from '../../../../shared/watch.js';
import { Feature } from '../../types/Feature.js';
import { SortDirection } from '../../types/features/RowSortingDef.js';
import { storybook } from '../../../../shared/storybook.decorators.js';
import { property } from 'lit/decorators.js';
import {
  ColumnSort,
  Header,
  TableState,
  Updater,
  functionalUpdate,
  getSortedRowModel,
} from '@tanstack/lit-table';
import ScElement from '../../../../shared/sc-element.js';

export type TMixin = {
  handleSort(
    header: Header<unknown, unknown>,
    direction: SortDirection | 'none' | undefined,
    sortingOrder: SortDirection[],
    isMulti: boolean,
  ): void;
  finalizeColumnDefSortingOrder(
    sortingOrder?: SortDirection[]
  ): SortDirection[];
  sortingOrder: SortDirection[];
  sortable: boolean;
  manualSorting: boolean;
  getRowSortingOptions(): {
    enableMultiSort: boolean;
  };
};

const DEFAULT_SORTING_ORDER: SortDirection[] = ['asc', 'desc', 'none'];
export const RowSortingMixin = safeMixin(
  <T extends TConstructor<ScElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin
      extends TableStateMixin(superClass)
      implements Feature<'rowSorting'>
    {
      @storybook('boolean', {
        description: 'Set to toggle sorting',
        defaultValue: false,
      })
      @property({ type: Boolean, reflect: true })
      sortable = false;

      @storybook('object', {
        description: 'Set to config default sorting order',
        defaultValue: DEFAULT_SORTING_ORDER,
      })
      @property({ type: Array })
      sortingOrder = DEFAULT_SORTING_ORDER;

      @watch('sortable')
      onSortableChange() {
        this.table.setOptions(prev => {
          return {
            ...prev,
            columns: [...prev.columns], // for reference
            defaultColumn: {
              ...prev.defaultColumn,
              enableSorting: this.sortable,
            },
          };
        });
      }

      @storybook('boolean', {
        description:
          'Set to enable manual sorting for the data grid, Listen sc-sort to update grid data if true',
        defaultValue: false,
      })
      @property({ type: Boolean, attribute: 'manual-sorting', reflect: true })
      manualSorting = false;

      updateSortingState(updater: Updater<TableState['sorting']>) {
        this.table.setState((old: TableState) => {
          return {
            ...old,
            sorting: functionalUpdate(updater, (old as any)['sorting']),
          };
        });
      }

      get manualSortingOpt() {
        if (this.manualSorting) {
          return {
            manualSorting: true,
          };
        }
        return {
          getSortedRowModel: getSortedRowModel(),
        };
      }

      @watch('manualSorting')
      handleManualSortingChange() {
        this.table.setOptions(prev => {
          const { getSortedRowModel, manualSorting, ...opt } = prev;
          return {
            ...opt,
            ...this.manualSortingOpt,
          };
        });
      }

      getRowSortingOptions() {
        return {
          enableMultiSort: true,
          onSortingChange: (updater: Updater<TableState['sorting']>) => {
            this.updateSortingState(updater);
          },
        };
      }

      getNextDirection(
        direction: SortDirection,
        sortingOrder: SortDirection[] // coming from columndef.meta
      ) {
        const currentIndex = sortingOrder.indexOf(direction);
        const nextIndex = (currentIndex + 1) % sortingOrder.length;
        return sortingOrder[nextIndex];
      }

      @watch('columns')
      updateRowSorting() {
        const sorting = new Set<ColumnSort>();
        this.table.getAllColumns().forEach(column => {
          const sort = column.columnDef.meta?.sort;
          if (sort) {
            sorting.add({
              id: column.id,
              desc: sort === 'desc',
            });
          }
        });
        this.table.setSorting([...sorting]);
      }

      handleSort(
        header: Header<unknown, unknown>,
        direction: SortDirection,
        sortingOrder: SortDirection[],
        isMulti: boolean
      ) {
        const nextDirection = this.getNextDirection(direction, sortingOrder);
        if (nextDirection === 'none') {
          const sorting = this.tableState.sorting ?? [];
          this.table.setSorting(
            sorting.filter(item => item.id !== header.column.id)
          );
        } else {
          header.column.toggleSorting(nextDirection === 'desc', isMulti);
        }

        this.emit('sc-sort', {
          detail: {
            value: this.table.getState().sorting,
          },
        });

        this.updateComplete.then(() => {
          requestAnimationFrame(() => {
            this.table.updateRowSpanning();
          });
        });
      }
      finalizeColumnDefSortingOrder(sortingOrder?: SortDirection[]) {
        return sortingOrder?.length
          ? sortingOrder
          : this.sortingOrder;
      }
    }
    return Mixin;
  }
);

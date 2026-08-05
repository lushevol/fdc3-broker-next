import { TConstructor, safeMixin } from '../../../shared/mixin.js';
import {
  Row,
  TableOptionsResolved,
  createTable,
  getCoreRowModel,
} from '@tanstack/lit-table';
import {
  type TMixin as TTableStateMixin,
  TableStateMixin,
} from './table-state-mixin.js';
import { ColumnSpanningFeature } from '../custom-features/column-spanning.js';
import { RowSpanningFeature } from '../custom-features/row-spanning.js';
import { ToolkitFeature } from '../custom-features/toolkit.js';
import { ColumnTypeFeature } from '../custom-features/column-type.js';
import { RowHeightFeature } from '../custom-features/row-height.js';
import { EditingCellFeature } from '../custom-features/editing.js';
import { GroupingTreeFeature } from '../custom-features/grouping-tree.js';
import { RowDraggableFeature } from '../custom-features/row-draggable.js';
import ScElement from '../../../shared/sc-element.js';

type TOptions = {
  onStateChange: () => void;
  getFeatureOptions: () => Record<string, any>;
};
type TMixin = {
  initializeTable(options: TOptions): void;
  centerRows: Row<unknown>[];
  topRows: Row<unknown>[];
  bottomRows: Row<unknown>[];
  isEmpty: boolean;
} & TTableStateMixin;

export const TanstackMixin = safeMixin(
  <T extends TConstructor<ScElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin extends TableStateMixin(superClass) {
      get defaultConf() {
        return {
          data: [] as any,
          columns: [] as any,
          // if set manualXX, will skip table.options.getXXRowModel but invoke getPreXXRowModel
          getCoreRowModel: getCoreRowModel(),
          renderFallbackValue: null,
          state: {},
          // debugTable: true,
          // debugHeaders: true,
          // debugColumns: true,
          mergeOptions: (defaultOptions, options) => {
            const finalizedOptions = {
              ...defaultOptions,
              ...options,
            };
            // sync up with tableInstance.state
            // same with src\components\ScDataGrid\ScDataGrid.ts:90
            this.tableState = finalizedOptions.state ?? {};
            return finalizedOptions;
          },
          getRowId(row: any, index: number, parent?: Row<any>) {
            return (
              row.uuid ?? `${parent ? [parent.id, index].join('.') : index}`
            );
          },
          defaultColumn: {},
        } as TableOptionsResolved<unknown>;
      }

      initializeTable(options: TOptions) {
        const featureOptions = options.getFeatureOptions();
        this.table = createTable({
          _features: [
            ColumnSpanningFeature,
            RowSpanningFeature,
            ToolkitFeature,
            ColumnTypeFeature,
            RowHeightFeature,
            EditingCellFeature,
            GroupingTreeFeature,
            RowDraggableFeature,
          ],
          ...this.defaultConf,
          ...featureOptions,

          onStateChange: (updater: any) => {
            const newTableState = updater(this.tableState);
            // put a deep comparer here, request or not
            // if (isEqualWith(newTableState, this.tableState, () => {})) {
            //   return;
            // }

            this.tableState = newTableState;
            this.updateTableInstanceState();
            options.onStateChange();
            queueMicrotask(() => {
              this.requestUpdate();
              this.internalEmit('ie-table-state-update');
            });
          },
        });

        this.tableState = {
          ...this.table.initialState,
        };
        this.updateTableInstanceState();
      }

      updateTableInstanceState() {
        // setOptions wont trigger onStateChange
        // packages\table-core\src\core\table.ts:359
        // packages\table-core\src\core\table.ts:371
        this.table.setOptions(prev => {
          return {
            ...prev,
            state: {
              ...this.tableState,
            },
          };
        });
      }

      get centerRows() {
        return this.table.getCenterRowsAfterDragging();
      }
      get topRows() {
        return this.table.getTopRows();
      }
      get bottomRows() {
        return this.table.getBottomRows();
      }

      get isEmpty() {
        return this.centerRows.length === 0;
      }
    }
    return Mixin;
  }
);

import {
  createRow,
  flattenBy,
  functionalUpdate,
  getGroupedRowModel,
  getMemoOptions,
  memo,
  Row,
  RowData,
  RowModel,
  Table,
  TableOptionsResolved,
  TableState,
  Updater,
} from '@tanstack/lit-table';
import { LitElement } from 'lit';
import { safeMixin, TConstructor } from '../../../../shared/mixin.js';
import { watch } from '../../../../shared/watch.js';
import { Feature } from '../../types/Feature.js';
import { TableStateMixin } from '../table-state-mixin.js';

export type TMixin = {
  getGroupingTreeOptions(): {
    getGroupedRowModel: (table: Table<unknown>) => () => RowModel<unknown>;
    onGroupingTreeColumnIdChange(
      updater: Updater<TableState['groupingTreeColumnId']>
    ): void;
  };
};

export const GroupingTreeMixin = safeMixin(
  <T extends TConstructor<LitElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin
      extends TableStateMixin(superClass)
      implements Feature<'groupingTree'>
    {
      @watch('columns')
      updateGroupingTree() {
        const column = this.table
          .getAllLeafColumns()
          .find(column => column.columnDef.meta?.rowGroupingTree);
        if (column) this.table.setGrouping([column.id]);
        this.table.setGroupTreeColumnId(column?.id);
      }

      getGroupingTreeOptions() {
        return {
          getGroupedRowModel: getGroupedRowModel(),
          onGroupingTreeColumnIdChange: (
            updater: Updater<TableState['groupingTreeColumnId']>
          ) => {
            this.updateGroupingTreeState(updater);
          },
        };
      }

      updateGroupingTreeState(
        updater: Updater<TableState['groupingTreeColumnId']>
      ) {
        const wasGroupTree = this.table.getIsGroupTree();
        this.table.setState((old: TableState) => {
          return {
            ...old,
            groupingTreeColumnId: functionalUpdate<string | undefined>(
              updater,
              (old as any)['groupingTreeColumnId']
            ),
          };
        });
        const isGroupTree = this.table.getIsGroupTree();

        if (isGroupTree !== wasGroupTree) {
          this.table.setOptions((old: TableOptionsResolved<unknown>) => ({
            ... old,
            getGroupedRowModel: isGroupTree
              ? getGroupedTreeRowModel()
              : getGroupedRowModel(),
          }));
          this.table._getGroupedRowModel = undefined;
        }
      }
    }
    return Mixin;
  }
);

function getGroupedTreeRowModel<TData extends RowData>(): (
  table: Table<TData>
) => () => RowModel<TData> {
  return table =>
    memo(
      () => [table.getState().grouping, table.getState().groupingTreeColumnId, table.getPreGroupedRowModel()],
      (grouping, treeColumnId, rowModel) => {
        if (!treeColumnId || !rowModel.rows.length || !grouping.length) {
          rowModel.rows.forEach(row => {
            row.depth = 0;
            row.parentId = undefined;
          });
          return rowModel;
        }

        const flatRows: Row<TData>[] = [];
        const rowsById: Record<string, Row<TData>> = {};
        
        const recurse = (groups: Branch<TData>, depth = 0, parentId?: string): Row<TData>[] => {
          const rows = Object.keys(groups).map((key, index) => {
            let id = `${treeColumnId}:${index}:${key}`;
            id = parentId ? `${parentId}>${key}` : key;

            const subRows = recurse(groups[key], depth + 1, id);

            // Flatten the leaf rows of the rows in this group
            const leafRows = depth
              ? flattenBy(subRows, row => row.subRows)
              : subRows;

            const row = createRow(
              table,
              id,
              leafRows[0]?.original,
              index,
              depth,
              undefined,
              parentId
            );

            Object.assign(row, {
              groupingColumnId: treeColumnId,
              groupingValue: key,
              subRows,
              leafRows,
              getValue: (columnId: string) => {
                // Don't aggregate columns that are in the grouping
                if (treeColumnId === columnId) {
                  if (!row._valuesCache.hasOwnProperty(columnId)) {
                    row._valuesCache[columnId] = key;
                  }
                  return row._valuesCache[columnId];
                }

                if (!row._groupingValuesCache.hasOwnProperty(columnId)) {
                  // Aggregate the values
                  const column = table.getColumn(columnId);
                  const aggregateFn = column?.getAggregationFn();
                  if (aggregateFn) {
                    row._groupingValuesCache[columnId] = aggregateFn(
                      columnId,
                      leafRows,
                      subRows
                    );
                  }
                }
                return row._groupingValuesCache[columnId];
              },
            });

            return row;
          });
          groups[leaf]?.forEach(row => {
            row.depth = depth;
            row.parentId = parentId;
            rows.push(row);
          });

          rows.forEach(row => {
            flatRows.push(row);
            rowsById[row.id] = row;
          });
          return rows;
        };

        const groups = groupByPath(rowModel.rows);
        const rows = recurse(groups, 0);
        rows.forEach(subRow => {
          flatRows.push(subRow);
          rowsById[subRow.id] = subRow;
        });

        const res = { rows, flatRows, rowsById };
        return res;
      },
      getMemoOptions(
        table.options,
        'debugTable',
        'getGroupedTreeRowModel',
        () => {
          table._queue(() => {
            table._autoResetExpanded();
            table._autoResetPageIndex();
          });
        }
      )
    );
}


const leaf = Symbol('leaf');

type Branch<TData> = {
  [key: string]: Branch<TData>;
  [leaf]?: Row<TData>[];
};

function groupByPath<TData extends RowData>(rows: Row<TData>[]) {
  const groupMap: Branch<TData> = {};
  rows.forEach(row => {
    const path = row.getGroupTreeFullPath();
    if (!path?.length) return;

    for (let i = 0, map = groupMap; i < path.length; i++) {
      if (i < path.length - 1) {
        map = map[path[i]] ??= {};
      } else {
        // last / leaf
        (map[leaf] ??= []).push(row);
      }
    }
  });
  return groupMap;
}

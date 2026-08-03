import { LitElement } from 'lit';
import { TConstructor, safeMixin } from '../../../shared/mixin.js';
import { ColumnDef, RowData, Table, TableState } from '@tanstack/lit-table';
import { property, state } from 'lit/decorators.js';
import { storybook } from '../../../shared/storybook.decorators.js';
import { TColumn } from '../types/ColumnDef.js';
import type { Virtualizer } from '@tanstack/virtual-core';

export type TMixin = {
  table: Table<unknown>;
  verticalVirtualizer: Virtualizer<HTMLElement, HTMLElement>;
  /**
   * same with table.getState()
   */
  tableState: Partial<TableState>;
  tanstackColumns: ColumnDef<unknown, any>[];
  columns: TColumn<unknown, any>[];
  data: unknown[];
  staticConst: {
    headerIdPrefix: string;
  };
  updateColumnDefs(): void;
  builtInColumns: {
    prefix?: ColumnDef<unknown, any>[];
    suffix?: ColumnDef<unknown, any>[];
  };
  removeColumnFromBuiltInColumns(
    columnId: string,
    type: 'prefix' | 'suffix'
  ): void;
  getColumnIndex(columnId: string, type: 'prefix' | 'suffix'): number;
};

export const TableStateMixin = safeMixin(
  <T extends TConstructor<LitElement>>(
    superClass: T
  ): TConstructor<TMixin> & T => {
    class Mixin extends superClass {
      table: Table<unknown>;

      tableState: Partial<TableState> = {};
      verticalVirtualizer: Virtualizer<HTMLElement, HTMLElement>;

      @state() tanstackColumns: ColumnDef<RowData, any>[] = [];
      @state() builtInColumns: {
        prefix: ColumnDef<RowData, any>[];
        suffix: ColumnDef<RowData, any>[];
      } = {
        prefix: [],
        suffix: [],
      };

      @storybook('object', {
        description: 'Set to render the rows',
      })
      @property({ type: Array })
      columns: TColumn<RowData, any>[] = [];

      @storybook('object', {
        description:
          'Set to config the header. Can set uuid(the unique identifier id) for each row. Defaults to the row\'s index',
      })
      @property({ type: Array })
      data: unknown[] = [];

      staticConst = {
        headerIdPrefix: 'sc-data-grid-header-',
      };

      getColumnIndex(columnId: string, type: 'prefix' | 'suffix') {
        return this.builtInColumns[type].findIndex(
          item => item.id === columnId
        );
      }

      removeColumnFromBuiltInColumns(
        columnId: string,
        type: 'prefix' | 'suffix'
      ) {
        const index = this.getColumnIndex(columnId, type);
        if (index !== -1) {
          this.builtInColumns[type].splice(index, 1);
        }
      }

      updateColumnDefs() {        
        const columnVisibility = this.tanstackColumns
          .map(colDef => ({
            [colDef.id ?? (colDef as any).accessorKey ?? '']:
              colDef.meta?.hide !== true,
          }))
          .reduce((acc, cur) => ({ ...acc, ...cur }), {});
        const columnOrder = this.getDefaultColumnOrder();

        // set other important initial state here
        this.table.initialState = {
          ...this.table.initialState,
          columnVisibility,
          columnOrder,
        };

        if (this.tanstackColumns.find(c => c.meta?.pinned === 'left')) {
          this.builtInColumns.prefix.forEach(
            c => ((c.meta ?? (c.meta = {})).pinned = 'left')
          );
        }
        if (this.tanstackColumns.find(c => c.meta?.pinned === 'right')) {
          this.builtInColumns.suffix.forEach(
            c => ((c.meta ?? (c.meta = {})).pinned = 'right')
          );
        }

        const columns = [
          ...this.builtInColumns.prefix,
          ...this.tanstackColumns,
          ...this.builtInColumns.suffix,
        ];
        this.table.setOptions(prev => {
          return {
            ...prev,
            columns,
          };
        });

        // fixes initial column order
        this.table.setColumnOrder(columnOrder);
      }

      /** Default column order based from column definition. */
      getDefaultColumnOrder() {
        const center: string[] = [];
        const left: string[] = [];
        const right: string[] = [];
        
        function traverse(columns: ColumnDef<unknown>[]) {
          columns.forEach(c => {
            if ('columns' in c && c.columns) {
              traverse(c.columns);
            } else {
              const id = c.id || 'accessorKey' in c && c.accessorKey;
              if (id) {
                if (c.meta?.pinned === 'left') {
                  left.push(id);
                } else if (c.meta?.pinned === 'right') {
                  right.push(id);
                } else {
                  center.push(id); 
                }
              }
            }
          });
        }
        traverse(this.tanstackColumns);

        return [
          ...this.builtInColumns.prefix.map(c => `${c.id}`),
          ...left,
          ...center,
          ...right,
          ...this.builtInColumns.suffix.map(c => `${c.id}`),
        ];
      }
    }
    return Mixin;
  }
);

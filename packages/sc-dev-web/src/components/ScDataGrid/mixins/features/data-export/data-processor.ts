import { Column, NoInfer, Row, Table } from '@tanstack/lit-table';
import { DataExportConfiguration, DataModifier } from './types.js';
import { litHtmlToString } from './data-export-utils.js';
import { ExcelExporterInstance } from './excel-exporter.js';
import { isEmptyish } from '../../../../../shared/util.js';
import { ROW_SELECTION_COLUMN_ID } from '../row-selection-mixin.js';

export class DataProcessor {
  /**
   * Retrieves rows from the table based on the specified modifier
   */
  static getRowsByModifier(table: Table<any>, modifier: DataModifier = 'pre-paginated'): Row<any>[] {
    const modelGetters = {
      filtered: () => table.getFilteredRowModel().rows,
      sorted: () => table.getSortedRowModel().rows,
      'pre-paginated': () => table.getPrePaginationRowModel().rows,
      paginated: () => table.getPaginationRowModel().rows,
      core: () => table.getCoreRowModel().rows,
      all: () => table.getRowModel().rows,
      grouped: () => table.getGroupedRowModel?.() ? table.getGroupedRowModel().rows : table.getPrePaginationRowModel().rows,
      expanded: () => table.getExpandedRowModel?.() ? table.getExpandedRowModel().rows : table.getPrePaginationRowModel().rows,
      faceted: () => table.getGlobalFacetedRowModel?.() ? table.getGlobalFacetedRowModel().rows : table.getPrePaginationRowModel().rows,
    };

    return modelGetters[modifier]?.() || table.getPrePaginationRowModel().rows;
  }

  /**
   * Processes headers and columns based on configuration
   */
  static processHeadersAndColumns(
    table: Table<any>,
    configuration: DataExportConfiguration,
    columns: any[],
    preserveTags?: string[]
  ): { fileHeaderIdsSet: string[]; header: string[]; exportColumns: Column<any, unknown>[] } {
    let exportColumns: Column<any, unknown>[] = table.getAllLeafColumns();

    if (configuration.headers) {
      return {
        fileHeaderIdsSet: Object.keys(configuration.headers),
        header: Object.values(configuration.headers),
        exportColumns,
      };
    }

    if (configuration.respectColumnVisibility) {
      exportColumns = exportColumns.filter(col => col.getIsVisible());
    }

    if (configuration.respectColumnOrder === false) {
      const colIds = columns.map(col => col.id);
      exportColumns = colIds
        .map(id => exportColumns.find(col => col.id === id))
        .filter((col): col is Column<any, unknown> => !!col);
    }

    const fileHeaderIdsSet = exportColumns.map(col => col.id ?? (col as any).property);
    const header = exportColumns.map(col => {
      const header = col.getHeader();
      return header?.getRenderedTextContent() ?? col.id;
    });

    return { fileHeaderIdsSet, header, exportColumns };
  }

  /**
   * Processes and filters data rows based on configuration
   */
  static processDataRows(
    rows: Row<any>[],
    configuration: DataExportConfiguration,
    table: Table<unknown>,
    exportColumns: Column<any, unknown>[],
    fileHeaderIdsSet: string[]
  ): Record<string, any>[] {
    const preserveTags = configuration.type === 'xlsx' ? Object.keys(ExcelExporterInstance.handlers) : undefined;
    const rowMapper = this.defaultRowMapper(table, exportColumns, preserveTags);

    return rows
      .filter(row => !configuration.rowFilter || configuration.rowFilter(row))
      .map(rowMapper)
      .filter(mapped => !configuration.dataFilter || configuration.dataFilter(mapped))
      .map(mapped => configuration.dataMapper ? configuration.dataMapper(mapped) : mapped)
      .map(mapped => Object.fromEntries(
        Object.entries(mapped).filter(([key]) => fileHeaderIdsSet.includes(key))
      ));
  }

  /**
   * Default row mapper that converts table rows to exportable data
   */
  static defaultRowMapper(table: Table<unknown>, exportColumns?: Column<unknown>[], preserveTags?: string[]) {
    return (row: Row<any>) => {
      const columns = exportColumns || table.getVisibleLeafColumns();
      const cells = row.getVisibleCells();
      return columns.reduce((result, col) => {
        const colId = col.id;
        const cell = cells.find(cell => cell.column.id === colId);
        const value = cell?.getValue();
        if (
          cell?.getIsDefaultCellRenderer() === false ||
          col?.getCellDataType() === 'date'
        ) {
          if (colId === `${ROW_SELECTION_COLUMN_ID}`)
            result[colId] = row.getIsSelected() ? '✓' : '';

          const text = cell?.getRenderedTextContent();
          if (text)
            result[colId] ??= text;
        }
        result[colId] ??= isEmptyish(value) ? '' : `${value}`;
        return result;
      }, <Record<string, string>>{});
    };
  }
}

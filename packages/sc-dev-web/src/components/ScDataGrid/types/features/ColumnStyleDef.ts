import { Cell, Header } from '@tanstack/lit-table';
import { StyleInfo } from '../utils.js';
export interface ColumnStyleDef {
  getCellStyle?: (cell: Cell<unknown, unknown>) => StyleInfo;
  getHeaderStyle?: (header: Header<unknown, unknown>) => StyleInfo;
}

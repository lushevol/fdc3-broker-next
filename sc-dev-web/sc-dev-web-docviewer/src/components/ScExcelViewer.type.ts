export interface CellStyle {
  fill?: string;
  color?: string;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: string;
  verticalAlign?: string;
  border?: string;
}
export interface CellValue {
  value: any;
  col: number;
  row: number;
  style?: CellStyle;
  colspan?: number;
  rowspan?: number;
}

export interface SheetData {
  name: string;
  rows: Array<{
    cells: CellValue[];
  }>;
  maxRow: number;
  maxCol: number;
  worksheet?: any; // ExcelJS.Worksheet
}
export interface ExcelData {
  sheetNames: string[];
  sheets: SheetData[];
  workbook?: any; // ExcelJS.Workbook
}

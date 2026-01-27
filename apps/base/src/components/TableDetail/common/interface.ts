import type { GridColDef, GridValueOptionsParams } from '@mui/x-data-grid';

export type ExtendedGridColDef = GridColDef & {
  value?: unknown;
  options?: unknown[];
  optionsUrl?: string;
  placeholder?: string;
  readOnly?: boolean;
  multiline?: boolean;
  required?: boolean;
  hiddenImage?: boolean;
  isImage?: boolean;
  isDate?: boolean;
  isTime?: boolean;
  valueOptions?: unknown[] | ((params: GridValueOptionsParams) => unknown[]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderEditCell?: (params: any) => React.ReactNode;
};

export interface ModalProps<T = Record<string, any>> {
  title?: React.ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
  isDraggable?: boolean;
  isResizeble?: boolean;
  isLoading?: boolean;
  actionComponents: React.ReactNode;
  columns: ExtendedGridColDef[];
  record: T;
  onChange: (value: unknown, field: string) => void;
  resetId: number;
}

export interface FieldProps<T = Record<string, any>> {
  column: ExtendedGridColDef;
  columnId: number;
  record: T;
  onChange: (value: unknown, field: string) => void;
  resetId: number;
}

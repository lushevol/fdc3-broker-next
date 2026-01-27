import type { ExtendedGridColDef } from '../../TableDetail/common/interface';

export interface TableProps<T = Record<string, any>> {
  columns: ExtendedGridColDef[];
  rows: T[];
  openDetail: boolean;
  record: T;
  onChange: (value: unknown, field: string) => void;
  onUpdate: () => void;
  onVerify: () => void;
  onDeactivate: () => void;
  onSave: () => void;
  onReset: () => void;
  onClose: () => void;
  resetId: number;
  isLoading: boolean;
  columnVisibilityModel?: Record<string, boolean>;
}

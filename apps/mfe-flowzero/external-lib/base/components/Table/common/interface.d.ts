import { GridColDef } from "@mui/x-data-grid";
export interface TableProps {
  columns: GridColDef[];
  rows: any[];
  openDetail: boolean;
  record: any;
  onChange: (value: any, field: string) => void;
  onUpdate: () => void;
  onVerify: () => void;
  onDeactivate: () => void;
  onSave: () => void;
  onReset: () => void;
  onClose: () => void;
  resetId: number;
  isLoading: boolean;
  columnVisibilityModel?: any;
}

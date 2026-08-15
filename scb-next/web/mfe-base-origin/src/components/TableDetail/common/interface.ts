import { GridColDef } from "@mui/x-data-grid";
import { AdminRecord } from "../../../admin/common/interface";

export type TableColumn = GridColDef<AdminRecord> & {
  editorType?: "autoComplete";
  hiddenImage?: boolean;
  multiline?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  valueOptions?: string[];
};

export interface ModalProps {
  title?: React.ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
  isDraggable?: boolean;
  isResizeble?: boolean;
  isLoading?: boolean;
  actionComponents: React.ReactNode;
  columns: TableColumn[];
  record: AdminRecord;
  onChange: (value: unknown, field: string) => void;
  resetId: number;
}

export interface FieldProps {
  column: TableColumn;
  columnId: number;
  record: AdminRecord;
  onChange: (value: unknown, field: string) => void;
  resetId: number;
}

import { AdminRecord } from "../../../admin/common/interface";
import { TableColumn } from "../../TableDetail/common/interface";

export interface TableProps {
  columns: TableColumn[];
  rows: AdminRecord[];
  openDetail: boolean;
  record?: AdminRecord;
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

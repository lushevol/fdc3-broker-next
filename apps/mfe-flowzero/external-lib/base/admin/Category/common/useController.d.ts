import { GridColDef } from "@mui/x-data-grid";

import { CategoryProps } from "./interface";
declare const useController: (props: CategoryProps) => {
  store: import("../../../hooks/model/root").RootModel;
  onCreateNew: () => void;
  columns: GridColDef<any, any, any>[];
  rows: any;
  onClose: () => void;
  onOpen: (row: any, mode: any) => () => void;
  onChange: (value: any, field: string) => void;
  openDetail: boolean;
  record: any;
  onReset: () => void;
  onSave: () => Promise<void>;
  resetId: number;
  onVerify: () => Promise<void>;
  onUpdate: () => Promise<void>;
  isLoading: boolean;
  onOpenAudit: (row: any) => () => void;
  onDeactivate: () => Promise<void>;
  auditColumns: GridColDef<any, any, any>[];
  auditRows: any;
  openAudit: boolean;
  onCloseAudit: () => void;
  refreshTab: () => void;
  getAuditData: (_category: any) => void;
};
export default useController;

import { GridColDef } from "@mui/x-data-grid";
declare const useAudit: () => {
  store: import("../../../hooks/model/root").RootModel;
  auditColumns: GridColDef<any, any, any>[];
  auditRows: any;
  openAudit: boolean;
  onCloseAudit: () => void;
  onOpenAudit: (row: any) => () => void;
  getAuditData: (_category: any) => void;
};
export default useAudit;

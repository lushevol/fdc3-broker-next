import { GridColDef } from "@mui/x-data-grid";
import React from "react";
declare const useAudit: () => {
  store: import("../../../hooks/model/root").RootModel;
  auditColumns: GridColDef<any, any, any>[];
  auditRows: any;
  openAudit: boolean;
  onCloseAudit: () => void;
  importMap: undefined;
  setImportMap: React.Dispatch<React.SetStateAction<undefined>>;
  onOpenAudit: (row: any) => () => void;
  getAuditData: (_importMap: any) => void;
};
export default useAudit;

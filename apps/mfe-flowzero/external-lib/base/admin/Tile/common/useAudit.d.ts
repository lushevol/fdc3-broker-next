import { GridColDef } from "@mui/x-data-grid";
import React from "react";
declare const useAudit: () => {
  store: import("../../../hooks/model/root").RootModel;
  auditColumns: GridColDef<any, any, any>[];
  auditRows: any;
  openAudit: boolean;
  onCloseAudit: () => void;
  tile: undefined;
  setTile: React.Dispatch<React.SetStateAction<undefined>>;
  onOpenAudit: (row: any) => () => void;
  getAuditData: (_tile: any) => void;
};
export default useAudit;

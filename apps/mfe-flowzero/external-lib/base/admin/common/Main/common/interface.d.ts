import { GridColDef } from "@mui/x-data-grid";

import { TableProps } from "../../../../components/Table/common/interface";
export interface FormProps extends TableProps {
  onCreateNew: () => void;
  titleCreateNew: string;
  openAudit: boolean;
  onCloseAudit: () => void;
  auditColumns: GridColDef[];
  auditRows: any[];
  disabledCreateNew?: boolean;
}

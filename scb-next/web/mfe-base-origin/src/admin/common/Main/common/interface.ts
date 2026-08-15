import { TableProps } from "../../../../components/Table/common/interface";
import { GridColDef } from "@mui/x-data-grid";
import { AdminRecord } from "../../interface";

export interface FormProps extends TableProps {
  onCreateNew: () => void;
  titleCreateNew: string;
  openAudit: boolean;
  onCloseAudit: () => void;
  auditColumns: GridColDef<AdminRecord>[];
  auditRows: AdminRecord[];
  disabledCreateNew?: boolean;
}

import { TableProps } from "../../../../components/Table/common/interface";
import { GridColDef } from "ratan-design-origin/data-grid";

export interface FormProps extends TableProps {
  onCreateNew: () => void;
  titleCreateNew: string;
  openAudit: boolean;
  onCloseAudit: () => void;
  auditColumns: GridColDef[];
  auditRows: any[];
  disabledCreateNew?: boolean;
}

import { AgGridReactProps } from "ag-grid-react";
import {
  LimitationActionType,
  LimitationRecord,
} from "src/Cashflow_Authorization_Limits/Main/common/interface";

export interface LimitationDataGridProps {
  gridData: AgGridReactProps["rowData"];
  onOpenDetailsDialog: (
    open: boolean,
    data: LimitationRecord,
    type: LimitationActionType
  ) => void;
  onDeleteLimitation: (data: LimitationRecord) => Promise<void>;
  onApproveAddLimitation: (data: LimitationRecord) => Promise<void>;
  onRejectAddLimitation: (data: LimitationRecord) => Promise<void>;
  onApproveEditLimitation: (data: LimitationRecord) => Promise<void>;
  onRejectEditLimitation: (data: LimitationRecord) => Promise<void>;
  onApproveDeleteLimitation: (data: LimitationRecord) => Promise<void>;
  onRejectDeleteLimitation: (data: LimitationRecord) => Promise<void>;
}

export interface ActionProps {
  data: LimitationRecord;
  onClick: (
    type: LimitationActionType,
    data: LimitationRecord
  ) => Promise<void>;
}

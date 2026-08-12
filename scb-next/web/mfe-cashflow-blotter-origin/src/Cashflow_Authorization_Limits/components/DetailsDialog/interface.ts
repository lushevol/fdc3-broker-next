import {
  LimitationActionType,
  LimitationRecord,
  LimitationRecordKeyInfo,
} from "src/Cashflow_Authorization_Limits/Main/common/interface";

export interface LimitationDetailsDialogProps {
  open: boolean;
  data?: LimitationRecordKeyInfo;
  type: LimitationActionType;
  onClose: () => void;
  onSubmit: (data: LimitationRecord) => Promise<void>;
}

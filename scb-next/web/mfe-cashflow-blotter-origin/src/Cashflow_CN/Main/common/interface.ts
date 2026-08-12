import { MessageInstance } from "antd/es/message/interface";
import { ModalStaticFunctions } from "antd/es/modal/confirm";
import { Dispatch } from "redux";

import { TileProps } from "../../../Root/routing/common/interface";

export interface MainProps extends TileProps {}

export interface WorkflowActionExtraOptions {
  dispatch: Dispatch<any>;
  modalApi: Omit<ModalStaticFunctions, "warn">;
  messageApi: MessageInstance;
}

export enum CashflowState {
  NA = "NA",
  PROJECTED = "PROJECTED",
  QUEUED = "QUEUED",
  WAITING = "WAITING",
  HOLD = "HOLD",
  READY = "READY",
  RELEASED = "RELEASED",
  SETTLED = "SETTLED",
  NOSTRO_MATCHED = "NOSTRO_MATCHED",
  NETTED = "NETTED",
  CASHFLOW_SUPPRESSED = "CASHFLOW_SUPPRESSED",
  SWIFT_SUPPRESSED = "SWIFT_SUPPRESSED",
  DEAD = "DEAD",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
  SPLIT = "SPLIT",
}

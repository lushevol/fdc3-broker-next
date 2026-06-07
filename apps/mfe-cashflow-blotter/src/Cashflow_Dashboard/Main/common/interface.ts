import { TileProps } from "../../../Root/routing/common/interface";

export interface MainProps extends TileProps {}

export type GraphCashFlowDashBoard = {
  Status_Num?: CashflowStatusNum;
};

export type CashflowStatusNum = {
  Wating_Today_Num: {
    loading: boolean;
    value: number;
  };
  Error_Num: {
    loading: boolean;
    value: number;
  };
  Queued_Num: {
    loading: boolean;
    value: number;
  };
  Nack_Num: {
    loading: boolean;
    value: number;
  };
  Hold_Num: {
    loading: boolean;
    value: number;
  };
  Group_Pending_Num: {
    loading: boolean;
    value: number;
  };
  Group_Error_Num: {
    loading: boolean;
    value: number;
  };
  Failed_Today_Num: {
    loading: boolean;
    value: number;
  };
  Swift_Error_Num: {
    loading: boolean;
    value: number;
  };
  Accounting_Error_Num: {
    loading: boolean;
    value: number;
  };
  Group_Pending_Validation_Num: {
    loading: boolean;
    value: number;
  };
};

export enum TILE_MENU {
  CASHFLOW_CN = "/cashflow_cn",
  CASHFLOW_GROUP_MANAGEMENT = "/cashflow_group_management",
}

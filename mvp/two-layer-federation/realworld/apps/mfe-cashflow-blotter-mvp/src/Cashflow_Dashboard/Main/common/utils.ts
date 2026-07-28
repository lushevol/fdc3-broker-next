import dayjs from "dayjs";
import isNil from "lodash/isNil";
import { DateFormat } from "src/Cashflow_CN/components/CashflowDetails/MultiExceptions/common/utils";

import { hasPermission } from "../../../Root/import/ratanutils";
import { GraphCashFlowDashBoard } from "./interface";

export const hasViewPermission = hasPermission(
  "RATAN_CASHFLOW_GROUP_BLOTTER:ACCESS_FMO_POST_TRADE_PORTAL"
);

export const generateEmptyDashboardData = (): GraphCashFlowDashBoard => ({
  Status_Num: {
    Wating_Today_Num: {
      loading: false,
      value: 0,
    },
    Error_Num: {
      loading: false,
      value: 0,
    },
    Queued_Num: {
      loading: false,
      value: 0,
    },
    Nack_Num: {
      loading: false,
      value: 0,
    },
    Hold_Num: {
      loading: false,
      value: 0,
    },
    Group_Pending_Num: {
      loading: false,
      value: 0,
    },
    Group_Error_Num: {
      loading: false,
      value: 0,
    },
    Failed_Today_Num: {
      loading: false,
      value: 0,
    },
    Accounting_Error_Num: {
      loading: false,
      value: 0,
    },
    Swift_Error_Num: {
      loading: false,
      value: 0,
    },
    Group_Pending_Validation_Num: {
      loading: false,
      value: 0,
    },
  },
});

export const omitValue = (v?: string | number | null): string => {
  return isNil(v) || v === "" ? "-" : v + "";
};

// return the offset working day from now.
// if offset is 0, then return today date.
// if offset > 0, then return offset working day after today.
// e.g. today is Thursday, offset is 4, then return next Tuesday date.
export const getDateByWorkdayOffset = (offset: number): string => {
  let currentDate = dayjs();
  let remainingOffset = Math.abs(offset);
  while (remainingOffset > 0) {
    currentDate =
      offset > 0 ? currentDate.add(1, "day") : currentDate.subtract(1, "day");
    const dayOfWeek = currentDate.day();
    if (![0, 6].includes(dayOfWeek)) remainingOffset--;
  }

  return currentDate.format(DateFormat);
};

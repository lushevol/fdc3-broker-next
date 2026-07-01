import dayjs from "dayjs";
import { DateFormat } from "src/Cashflow_CN/components/CashflowDetails/MultiExceptions/common/utils";

import { hasPermission } from "../../../Root/import/ratanutils";
import { filterControllers } from "../../components/QuickSearch/const";
import { SearchCriteria } from "../store/interface";

export const hasViewPermission = hasPermission(
  "RATAN_CASHFLOW_GROUP_BLOTTER:ACCESS_FMO_POST_TRADE_PORTAL"
);
export const hasExportPermission = hasPermission(
  "RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Export_Data"
);
export const hasManualSTPPermission = hasPermission(
  "RATAN_CASHFLOW_GROUP_BLOTTER:F_ManualStp"
);

export const hasManualResendPermission = hasManualSTPPermission;

export const convertFilter2GroupSearchCriteria = (
  filters: Filter[],
  convertDate?: boolean
): SearchCriteria => {
  return filters.reduce((res, cur) => {
    const filterItem = filterControllers.find(
      (f) => f.key === cur.field && !f.hide
    );
    if (filterItem) {
      if (filterItem.type === "date" && convertDate) {
        res[filterItem.name] = dayjs(cur.values, DateFormat);
      } else {
        res[filterItem.name] = cur.values;
      }
    }
    return res;
  }, {} as SearchCriteria);
};

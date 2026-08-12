import { BookingEntityNameIdOptions } from "src/Cashflow_CN/Main/config/ratanConfig/local/BookingEntity";
import { CurrencyList } from "src/Cashflow_CN/Main/config/ratanConfig/local/cashflowQuickSearchConfig";

const config = {
  quickSearchLabelWidth: 175,
  quickSearchFormWidth: 240,
  quickSearchItemsSplitting: [
    {
      label: "SCB Booking Entity",
      field: "entityFmId",
      component: "QuickSearchAutoComplete",
      valueList: BookingEntityNameIdOptions,
    },
    {
      label: "Nostro Agent",
      field: "nostroAgent",
      component: "QuickSearchInput",
    },
    {
      label: "Currency",
      field: "currency",
      component: "QuickSearchAutoComplete",
      valueList: CurrencyList,
    },
  ],
};

export default config;

import { BookingEntityNameIdOptions } from "src/Cashflow_CN/Main/config/ratanConfig/local/BookingEntity";
import {
  clientTypeOptions,
  countryOptions,
} from "src/Cashflow_Dashboard/components/QuickSearch/const";

export const dashboardCustomFields = [
  {
    indexedTerm: "Country",
    operator: "EQ",
    valueList: countryOptions,
    businessTerm: "",
    dataType: "",
    subSelection: "",
  },
  {
    indexedTerm: "Entity.Booking_Entity_SCI_FMID",
    operator: "EQ",
    valueList: BookingEntityNameIdOptions,
    businessTerm: "",
    dataType: "",
    subSelection: "",
  },
  {
    indexedTerm: "Entity.Counterparty_SCI_FMID",
    operator: "EQ",
    valueList: "",
    businessTerm: "",
    dataType: "",
    subSelection: "",
  },
  {
    indexedTerm: "Entity.Counterparty_SCI_FMCODE",
    operator: "EQ",
    valueList: "",
    businessTerm: "",
    dataType: "",
    subSelection: "",
  },
  {
    indexedTerm: "Entity.Counterparty_SCI_DOMICILE_COUNTRY",
    operator: "EQ",
    valueList: "",
    businessTerm: "",
    dataType: "",
    subSelection: "",
  },
  {
    indexedTerm: "Entity.Counterparty_Client_Type",
    operator: "EQ",
    valueList: clientTypeOptions.toString(),
    businessTerm: "",
    dataType: "",
    subSelection: "",
  },
  {
    indexedTerm: "Cashflow.Cashflow_State",
    operator: "EQ",
    valueList: "",
    businessTerm: "",
    dataType: "",
    subSelection: "",
  },
  {
    indexedTerm: "Cashflow.Cashflow_Sub_State",
    operator: "EQ",
    valueList: "",
    businessTerm: "",
    dataType: "",
    subSelection: "",
  },
];

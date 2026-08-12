import { BookingEntityNameIdOptions } from "src/Cashflow_CN/Main/config/ratanConfig/local/BookingEntity";

import { FilterItemConfig } from "./type";

export const filterControllers: FilterItemConfig[] = [
  {
    label: "Cashflow Id",
    name: "Cashflow_Id",
    key: "Cashflow_Id",
    type: "input",
    options: [],
  },
  {
    label: "Trade Id",
    name: "Trade_Id",
    key: "Trade_Id",
    type: "input",
    options: [],
  },
  {
    label: "Major Version",
    name: "Major_Version",
    key: "Major_Version",
    type: "input",
    options: [],
  },
  {
    label: "Status",
    name: "Status",
    key: "Status",
    type: "multiSelect",
    options: [
      {
        label: "PENDING",
        value: "PENDING",
      },
      {
        label: "DELIVERED",
        value: "DELIVERED",
      },
      {
        label: "END",
        value: "END",
      },
      {
        label: "ERROR",
        value: "ERROR",
      },
      {
        label: "OFFSET",
        value: "OFFSET",
      },
    ],
  },
  {
    label: "Cashflow Status",
    name: "Cashflow_Status",
    key: "Cashflow.Cashflow_State",
    type: "select",
    options: [],
  },
  {
    label: "Group Status",
    name: "Group_Status",
    key: "Group_Status",
    type: "multiSelect",
    options: [
      {
        label: "PENDING",
        value: "PENDING",
      },
      {
        label: "PENDING_PRE_GROUP",
        value: "PENDING_PRE_GROUP",
      },
      {
        label: "READY",
        value: "READY",
      },
      {
        label: "PENDING_WITHDRAWAL",
        value: "PENDING_WITHDRAWAL",
      },
      {
        label: "COMPLETED",
        value: "COMPLETED",
      },
      {
        label: "PENDING_TRADE_VALIDATION",
        value: "PENDING_TRADE_VALIDATION",
      },
    ],
  },
  {
    label: "Entity",
    name: "Booking_Entity_Id",
    key: "Entity.Booking_Entity_SCI_FMID",
    type: "multiSelect",
    options: BookingEntityNameIdOptions,
  },
  {
    label: "VD prior to",
    name: "Value_Date",
    key: "Value_Date",
    type: "date",
    options: [],
  },
];

export const cashflowStatusOptions = [
  {
    label: "SUSPENDED",
    value: "SUSPENDED",
  },
  {
    label: "SUSPENDED_MATURED",
    value: "SUSPENDED_MATURED",
  },
];

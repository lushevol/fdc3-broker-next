import {
  priceCellFormatterWithComma,
  displayCountDownTime,
  styleForCountDownTime,
} from "../../utils";
import { TooltipCell } from "../../../ratancomponents/DataGrid/TooltipCell";
import { Time } from "../../../Root/import/index";
import { getEnable } from "../../../ratanutils/componentEnabling";

// copied from ratan-cashflow/src/utils/index.ts
export const formatterBooleanValue = (value: string) => {
  if (value === "true") {
    return "Yes";
  } else if (value === "false") {
    return "No";
  }
  return value;
};

export const CASHFLOW_DEFAULT_FILTER: any[] = [
  {
    field: "Cashflow.Cashflow_State",
    operator: "NOTIN",
    values: ["NETTED", "DEAD"],
  },
  getEnable("Filter_CN_Cashflow") && {
    field: "Portfolio.Booking_Entity_Trade_Portfolio_Name",
    operator: "NOTIN",
    values: ratanConfig.cashflow.defaultQueryPortfolios,
  },
].filter(Boolean);

export const CASHFLOW_DEFAULT_FILTER_CN: any[] = [
  {
    field: "Cashflow.Cashflow_State",
    operator: "NOTIN",
    values: ["NETTED", "DEAD"],
  },
];

export const CASHFLOW_SUB_STATUS: any[] = [
  {
    field: "Cashflow.Cashflow_Sub_State",
    operator: "IN",
    values: ["Pending Operator", "Pending Verification"],
  },
];
// remove 'Cashflow.' in bau query param
export const CASHFLOW_SUB_STATUS_BAU: any[] = [
  {
    field: "Cashflow_Sub_Status",
    operator: "IN",
    values: ["Pending Operator", "Pending Verification"],
  },
];

export const BUILDER_DEFAULT_VALUE: CascaderFilter[] = [
  {
    field: ["Cashflow", "Cashflow_Id"],
    operator: "EQ",
    values: "",
    name: "TextInput",
  },
  {
    field: ["Cashflow", "Cashflow_Version"],
    operator: "EQ",
    values: "",
    name: "TextInput",
  },
];

const cashflowId = {
  headerName: "Cashflow Id",
  field: "Cashflow.Cashflow_Id",
  width: 150,
};

const entryTime = {
  headerName: "Entry Time",
  field: "Data_Flow.Data_Publication_Date_Time",
  width: 200,
  cellRenderer: Time,
};

export const payerName = {
  headerName: "Payer Name",
  field: "Cashflow.Payment_Payer_Party_Reference",
  width: 150,
  valueGetter: (params: any) => {
    const { Cashflow, Entity } = params.data;
    if (Cashflow?.Payment_Payer_Party_Reference === "party1") {
      return Entity?.Booking_Entity_SCI_FMCODE;
    } else {
      return Entity?.Counterparty_SCI_FMCODE;
    }
  },
};

export const receiverName = {
  headerName: "Receiver Name",
  field: "Cashflow.Payment_Receiver_Party_Reference",
  width: 200,
  valueGetter: (params: any) => {
    const { Cashflow, Entity } = params.data;
    if (Cashflow?.Payment_Receiver_Party_Reference === "party1") {
      return Entity?.Booking_Entity_SCI_FMCODE;
    } else {
      return Entity?.Counterparty_SCI_FMCODE;
    }
  },
};

const currency = {
  headerName: "Payment Currency",
  field: "Cashflow.Payment_Currency",
  width: 200,
};

const amount = {
  headerName: "Payment Amount:",
  field: "Cashflow.Payment_Amount",
  width: 150,
  valueFormatter: priceCellFormatterWithComma,
  cellRenderer: TooltipCell,
};

const product = {
  headerName: "Product",
  field: "Instrument_Common.Source_System_Instrument_Sub_Type",
  width: 150,
};

const tradeStatus = {
  headerName: "Trade Status",
  field: "Trade_State",
  width: 150,
};

const cashflowAffirmationStatus = {
  headerName: "Cashflow Affirmation Status",
  field: "Cashflow.Cashflow_Affirmation_Status",
  width: 250,
};

const payReceiveIndicator = {
  headerName: "Pay/Receive",
  field: "Cashflow.Pay_Receive_Indicator",
  width: 200,
};

export const componentCashflowGrid = [
  cashflowId,
  entryTime,
  payReceiveIndicator,
  payerName,
  receiverName,
  currency,
  amount,
  product,
  tradeStatus,
  cashflowAffirmationStatus,
];

export const customizeCashflowFields = [
  {
    headerName: "Ratan Cutoff Count Down",
    field: "",
    hide: false,
    pinned: "right",
    lockPinned: true,
    filterValueGetter: (params: any) =>
      displayCountDownTime(params.data?.Cashflow?.STP_Cutoff_Date_Time),
    valueFormatter: (params: any) =>
      displayCountDownTime(params.data?.Cashflow?.STP_Cutoff_Date_Time),
    cellClass: (params: any) =>
      styleForCountDownTime(params.data?.Cashflow?.STP_Cutoff_Date_Time),
  },
  {
    headerName: "Netting Cutoff Count Down",
    field: "",
    hide: false,
    pinned: "right",
    lockPinned: true,
    filterValueGetter: (params: any) =>
      displayCountDownTime(params.data?.Cashflow?.Netting_Cuttoff_Date),
    valueFormatter: (params: any) =>
      displayCountDownTime(params.data?.Cashflow?.Netting_Cuttoff_Date),
    cellClass: (params: any) =>
      styleForCountDownTime(params.data?.Cashflow?.Netting_Cuttoff_Date),
  },
];

interface NostroDetailsConfigType {
  field: string;
  label: string;
  isRequired?: boolean;
  componentType?: string;
  hasDivider?: boolean;
  title?: string;
  options?: {
    label: string;
    value: string | boolean;
  }[];
  hasBr?: true;
}

export const NOSTRO_DETAILS_CONFIG: NostroDetailsConfigType[] = [
  {
    field: "settlementMeans",
    label: "Settlement Means",
  },
  {
    field: "settlementAccount",
    label: "Settlement Account",
  },
  {
    field: "sendersCorrespondent53Swift",
    label: "Correspondent Swift",
    title: "53: Senders Correspondent Swift",
  },
  {
    field: "sendersCorrespondent53Fullname",
    label: "Full Name",
  },
  {
    field: "sendersCorrespondent53Address",
    label: "Address",
  },
  {
    field: "sendersCorrespondent53City",
    label: "City & Post Code",
  },
  {
    field: "sendersCorrespondent53Account",
    label: "Account",
  },
  {
    field: "noticeToReceive",
    label: "Notice to Receive",
    componentType: "CheckboxItem",
  },
  {
    field: "ebbsNostroAccount",
    label: "Account ",
    title: "eBBS information",
  },
];

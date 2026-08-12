import { Time } from "Import/index";
import {
  customColumSort,
  displayCountDownTime,
  styleForCountDownTime,
} from "Import/ratanutils";
import { NstpExceptionCell } from "src/Cashflow_CN/components/CashflowDetails/components/NstpExceptionCell";
import { isPOP } from "src/Cashflow_CN/components/CashflowDetails/MultiExceptions/common/pop";
import {
  isSCPAY,
  mandatoryTooltipText,
} from "src/Cashflow_CN/components/CashflowDetails/MultiExceptions/common/scpay";

import { formatterBooleanValue } from "../utils";
import { updateFieldInGroupConfig } from "../utils/groupCustomFormUtils";
import { NetType } from "../workflow/netCashflow/netCashflowRightMenu";
import { SplitActionType } from "../workflow/splitting/common/interface";
import { customizeStateStyle } from "../workflow/splitting/common/utils";
import {
  SplittingAmount,
  SplittingDeleteButton,
  SplittingLookUpSSIBtn,
} from "../workflow/splitting/SplittingDialog/SplitAmountComp";
import {
  AmountType,
  PreviewCustomType,
  SwiftSlashTooltip,
  WrapHoliday,
  WrapTime,
} from "./components";

/**
 * To be do
 * @author LuShuai
 * @description 1.When Rosetta supports ratanBusinessTerm, remove the businessTerm config in this 2.add type FieldsType
 */
export const cashflowCustomFields = {
  "Cashflow.Cashflow_Id": {
    index: 1,
    colDefs: {
      width: 130,
      hide: false,
      comparator: (valueA: any, valueB: any) =>
        customColumSort(valueA, valueB, "Id"),
      cellStyle: { "user-select": "text" },
    },
  },
  "Cashflow.Cashflow_State": {
    index: 2,
    colDefs: {
      width: 110,
      hide: false,
      cellStyle: (params) => {
        if (
          params.value === "QUEUED" &&
          !params.data.Cashflow?.Cashflow_Sub_State
        ) {
          return { color: "orange" };
        }
      },
    },
  },
  "Cashflow.Cashflow_Version": {
    index: 3,
    colDefs: {
      hide: false,
      width: 80,
    },
  },
  "Cashflow.Cashflow_Business_Version": {
    index: 4,
    colDefs: {
      hide: false,
      width: 80,
    },
  },
  "Cashflow.Cashflow_Minor_Version": {
    index: 5,
    colDefs: {
      hide: false,
      width: 80,
    },
  },
  "Cashflow.Cashflow_Affirmation_Status": {
    index: 6,
    colDefs: {
      width: 115,
      hide: false,
    },
    disabledFilter: ["trade", "cashflow"],
  },
  "Cashflow.Cashflow_Sub_State_Type": {
    index: 7,
    colDefs: {
      width: 130,
      hide: false,
    },
  },
  "Cashflow.Payment_Date": {
    index: 8,
    colDefs: {
      width: 105,
      hide: false,
      cellRenderer: WrapHoliday,
    },
  },
  "Cashflow.Payment_Currency": {
    index: 9,
    colDefs: {
      width: 70,
      hide: false,
    },
  },
  "Cashflow.Event_Date": {
    index: 10,
    colDefs: {
      width: 95,
      hide: false,
      cellRenderer: WrapTime,
    },
  },
  "Cashflow.Netting_Id": {
    index: 11,
    colDefs: {
      width: 100,
      hide: false,
    },
  },
  "Entity.Counterparty_SCI_FMCODE": {
    index: 12,
    colDefs: {
      width: 160,
      hide: false,
    },
    disabledFilter: ["cashflow", "rule"],
  },
  "Cashflow.Payment_Amount": {
    index: 13,
    colDefs: {
      width: 120,
      hide: false,
      comparator: (valueA: any, valueB: any) =>
        customColumSort(valueA, valueB, "Number"),
      cellRenderer: AmountType,
    },
  },
  "Cashflow.Payment_Cutoff_Time": {
    businessTerm: "Release Time",
    index: 14,
    colDefs: {
      width: 140,
      hide: false,
      // pinned: "right",
      // lockPinned: true,
      cellRenderer: Time,
    },
  },
  Trade_Id: {
    index: 15,
    colDefs: {
      width: 110,
      hide: false,
      comparator: (valueA: any, valueB: any) =>
        customColumSort(valueA, valueB, "Id"),
    },
  },
  Parent_Trade_Id: {
    index: 16,
    colDefs: {
      width: 110,
      hide: false,
      comparator: (valueA: any, valueB: any) =>
        customColumSort(valueA, valueB, "Id"),
    },
  },
  Trade_State: {
    index: 17,
    colDefs: {
      width: 110,
      hide: false,
    },
  },
  Settlement_Method: {
    index: 18,
    colDefs: {
      width: 90,
      hide: false,
    },
  },
  Delivery_Method: {
    index: 19,
    colDefs: {
      width: 70,
      hide: false,
    },
  },
  "Cashflow.Cashflow_Sub_State": {
    index: 20,
    colDefs: {
      width: 130,
      hide: false,
    },
  },
  "FMO_Comments.FMO_Comment": {
    index: 21,
    colDefs: {
      width: 100,
      valueGetter: (params: any) => {
        const { FMO_Comments } = params.data;
        if (FMO_Comments instanceof Array && FMO_Comments.length > 0) {
          //Only display lastest user comment in cashflow blotter
          const userCommentsList = FMO_Comments.filter(
            (item: any) =>
              item.FMO_Comment_Updater !== "System" &&
              item.FMO_Comment_Updater !== "Razor"
          );
          if (
            userCommentsList.length > 0 &&
            userCommentsList[userCommentsList.length - 1].hasOwnProperty(
              "FMO_Comment"
            )
          )
            return userCommentsList[userCommentsList.length - 1].FMO_Comment;
        }
      },
    },
  },
  "Entity.Booking_Entity_SCI_FMID": {
    index: 22,
    colDefs: {
      width: 100,
      hide: false,
    },
  },
  "Portfolio.Booking_Entity_Trade_Portfolio_Name": {
    index: 23,
    colDefs: {
      width: 120,
      hide: false,
    },
  },
  "Data_Flow.Data_Publication_Date_Time": {
    index: 24,
    colDefs: {
      width: 150,
      cellRenderer: Time,
    },
  },
  "Cashflow.Is_Amended_Post_Settlement": {
    colDefs: {
      width: 70,
      filterValueGetter: (params) =>
        formatterBooleanValue(params.data.Cashflow.Is_Amended_Post_Settlement),
      valueFormatter: (params) =>
        formatterBooleanValue(params.data.Cashflow.Is_Amended_Post_Settlement),
    },
  },
  "Cashflow.Is_Private_Banking_Cashflow": {
    colDefs: {
      width: 70,
      filterValueGetter: (params) =>
        formatterBooleanValue(params.data.Cashflow.Is_Private_Banking_Cashflow),
      valueFormatter: (params) =>
        formatterBooleanValue(params.data.Cashflow.Is_Private_Banking_Cashflow),
    },
  },
  "Cashflow.Is_STP_RATAN": {
    index: 25,
    colDefs: {
      width: 70,
      filterValueGetter: (params) =>
        formatterBooleanValue(params.data.Cashflow.Is_STP_RATAN),
      valueFormatter: (params) =>
        formatterBooleanValue(params.data.Cashflow.Is_STP_RATAN),
    },
  },
  "Cashflow.Is_STP": {
    colDefs: {
      width: 70,
      filterValueGetter: (params) =>
        formatterBooleanValue(params.data.Cashflow.Is_STP),
      valueFormatter: (params) =>
        formatterBooleanValue(params.data.Cashflow.Is_STP),
    },
  },
  "Entity.Booking_Entity_SCI_FMCODE": {
    index: 26,
    colDefs: {
      width: 180,
    },
  },
  "Cashflow.Is_Cashflow_Unnet": {
    index: 27,
    colDefs: {
      width: 70,
    },
  },
  "Cashflow.Netting_Cuttoff_Date": {
    colDefs: {
      width: 135,
      cellRenderer: Time,
    },
  },
  "Instrument_Common.ISDA_Taxonomy": {
    colDefs: {
      width: 110,
    },
  },
  "Settlement_Instruction.Account.Beneficiary_BIC_code": {
    colDefs: {
      width: 125,
    },
  },
  "Settlement_Instruction.Account.Beneficiary_Account_Name": {
    colDefs: {
      width: 200,
    },
  },
  "Instrument_Common.Parent_Trade_Instrument": {
    colDefs: {
      width: 130,
    },
  },
  "Instrument_Common.Equity_Instrument_Reference": {
    colDefs: {
      width: 130,
    },
  },
  "Entity.Counterparty_SCI_FMID": {
    colDefs: {
      width: 105,
    },
  },
  "Entity.Counterparty_Client_Type": {
    colDefs: {
      width: 85,
    },
  },
  "Instrument_Common.CFI_Code": {
    colDefs: {
      width: 90,
    },
  },
  "Instrument_Common.Financial_Instrument_Code": {
    colDefs: {
      width: 210,
    },
  },
  "Entity.General_Ledger_Business_Unit_Name": {
    colDefs: {
      width: 140,
    },
  },
  "Entity.Counterparty_CIF_Code": {
    colDefs: {
      width: 200,
    },
  },
  "Entity.Counterparty_Murex_Display_Shortcode": {
    colDefs: {
      width: 155,
    },
  },
  "Data_Flow.Data_Source_System_Domain_Name": {
    colDefs: {
      width: 80,
    },
  },
  "Data_Flow.Data_Type": {
    colDefs: {
      width: 125,
    },
  },
  "Data_Flow.Data_Source_System": {
    colDefs: {
      width: 85,
    },
  },
  "Data_Flow.Data_Source_System_Country_Code": {
    colDefs: {
      width: 70,
    },
  },
  "Data_Flow.Data_Sender": {
    colDefs: {
      width: 125,
    },
  },
  "Data_Flow.Data_Publication_Id": {
    colDefs: {
      width: 200,
    },
  },
  Trade_Version: {
    colDefs: {
      width: 80,
    },
  },
  Position_Id: {
    colDefs: {
      width: 120,
    },
  },
  "Cashflow.Validation_Status": {
    colDefs: {
      width: 140,
    },
  },
  "Cashflow.Status_Event_Type": {
    colDefs: {
      width: 170,
    },
  },
  "Cashflow.Prev_Cashflow_Id": {
    colDefs: {
      width: 125,
    },
  },
  "Cashflow.Payment_Payer_Party_Reference": {
    colDefs: {
      width: 80,
    },
  },
  "Cashflow.Payment_Type": {
    colDefs: {
      width: 110,
    },
  },
  "Cashflow.Payment_Receiver_Party_Reference": {
    colDefs: {
      width: 80,
    },
  },
  "Cashflow.Payment_Date_Business_Day_Convention": {
    colDefs: {
      width: 70,
    },
  },
  "Cashflow.Payer_Name": {
    colDefs: {
      width: 155,
    },
  },
  "Cashflow.Pay_Receive_Indicator": {
    colDefs: {
      width: 85,
    },
  },
  "Cashflow.Next_Cashflow_Id": {
    colDefs: {
      width: 125,
    },
  },
  "Cashflow.NSTP_Reason": {
    colDefs: {
      width: 125,
    },
  },
  "Cashflow.Murex_Structure_Id": {
    colDefs: {
      width: 65,
    },
  },
  "Cashflow.Cashflow_Event_Type": {
    colDefs: {
      width: 110,
    },
  },
  "Cashflow.Cashflow_Sub_State_Updater": {
    colDefs: {
      width: 110,
    },
  },
  "Cashflow.NSTP_Exception": {
    colDefs: {
      width: 150,
      cellRenderer: NstpExceptionCell,
    },
  },
  "Cashflow.Remaining_Amount": {
    colDefs: {
      width: 120,
      cellRenderer: AmountType,
    },
  },
};

export const CASHFLOW_DEFAULT_FILTER: any[] = [
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

const cashflowIdOfNettingPreview = {
  headerName: "Cashflow Id",
  field: "Cashflow.Cashflow_Id",
  width: 150,
  cellStyle: (params) => {
    const { Resullt, Type } = params.data || {};
    if (!Resullt && Type === "single") return { backgroundColor: "#3f66007d" };
  },
};

const entryTime = {
  headerName: "Entry Time",
  field: "Data_Flow.Data_Publication_Date_Time",
  width: 210,
  cellRenderer: Time,
};

const dataSourceSystem = {
  headerName: "Data Source",
  field: "Data_Flow.Data_Source_System",
  width: 150,
};

const cashflowVersion = {
  headerName: "Version",
  field: "Cashflow.Cashflow_Version",
  width: 100,
};

const cashflowState = {
  headerName: "Cashflow State",
  field: "Cashflow.Cashflow_State",
  width: 150,
};

const cashflowEventType = {
  headerName: "Cashflow Event Type",
  field: "Cashflow.Cashflow_Event_Type",
  width: 150,
};

const allotment = {
  headerName: "Allotment",
  field: "Instrument_Common.Source_System_Instrument_Sub_Type",
  width: 150,
};

const paymentDate = {
  headerName: "Value Date",
  field: "Cashflow.Payment_Date",
  width: 140,
};

const paymentAmount = {
  headerName: "Payment Amount",
  field: "Cashflow.Payment_Amount",
  width: 150,
  cellRenderer: AmountType,
};

const splittingPaymentAmount = {
  headerName: "Payment Amount",
  field: "Cashflow.Payment_Amount",
  width: 200,
  cellRenderer: SplittingAmount,
};

const paymentCurreny = {
  headerName: "Currency",
  field: "Cashflow.Payment_Currency",
  width: 125,
};

const bookingEntityFMCode = {
  headerName: "Booking Entity",
  field: "Entity.Booking_Entity_SCI_FMCODE",
  width: 200,
};

const counterpartyFMCode = {
  headerName: "Counterparty FMCODE",
  field: "Entity.Counterparty_SCI_FMCODE",
  width: 200,
};

const bicNetFlag = {
  headerName: "BIC Net Flag",
  field: "Entity.Counterparty_SCI_BIC_Net_Flag",
  width: 100,
};

const beneficiaryBic = {
  headerName: "Beneficiary BIC",
  field: "Entity.Counterparty_SCI_BIC_Code",
  width: 150,
};
const payReceiveIndicator = {
  headerName: "Pay/Receive",
  field: "Cashflow.Pay_Receive_Indicator",
  width: 150,
};

const taxonomy = {
  headerName: "ISDA Taxonomy",
  field: "Instrument_Common.ISDA_Taxonomy",
  width: 195,
};

const paymentType = {
  headerName: "Payment Type",
  field: "Cashflow.Payment_Type",
  width: 150,
};

const cashflowSubState = {
  headerName: "Cashflow Sub State",
  field: "Cashflow.Cashflow_Sub_State",
  width: 180,
};
const cashflowSubStateType = {
  headerName: "Cashflow Sub State Type",
  field: "Cashflow.Cashflow_Sub_State_Type",
  width: 220,
};

const cfiCode = {
  headerName: "CFI Code(FIC Code)",
  field: "Instrument_Common.Financial_Instrument_Code",
  width: 170,
};

const customType = {
  headerName: "",
  field: "Type",
  width: 50,
  hide: true,
  cellRenderer: PreviewCustomType,
};

const actionCol = {
  headerName: "",
  field: "",
  width: 60,
  cellRenderer: SplittingDeleteButton,
};

const lookUpSSIActionCol = {
  headerName: "Action",
  field: "",
  width: 150,
  pinned: "right",
  lockPinned: true,
  cellRenderer: SplittingLookUpSSIBtn,
};

const splitCashflowState = (splitAction: SplitActionType) => ({
  headerName: "Cashflow State",
  field: "Cashflow.Cashflow_State",
  width: 150,
  cellStyle: (param) =>
    customizeStateStyle(param.data.Cashflow?.Cashflow_State, splitAction),
});

export const componentCashflowNetPreviewGrid = (netType: NetType) => [
  customType,
  cashflowIdOfNettingPreview,
  ...(netType === NetType.BeneficiaryBICNetting
    ? [bicNetFlag, beneficiaryBic]
    : []),
  cashflowVersion,
  bookingEntityFMCode,
  counterpartyFMCode,
  cashflowState,
  paymentDate,
  paymentCurreny,
  payReceiveIndicator,
  paymentAmount,
  taxonomy,
  paymentType,
  cashflowSubState,
  cashflowSubStateType,
  cashflowEventType,
  cfiCode,
  dataSourceSystem,
  entryTime,
  allotment,
];

export const splittingCashflowSourceGrid = [
  customType,
  cashflowIdOfNettingPreview,
  paymentAmount,
  cashflowState,
  bookingEntityFMCode,
  counterpartyFMCode,
  paymentCurreny,
  payReceiveIndicator,
  cashflowVersion,
  paymentDate,
  taxonomy,
  paymentType,
  cashflowSubState,
  cashflowSubStateType,
  cashflowEventType,
  cfiCode,
  dataSourceSystem,
  entryTime,
  allotment,
];

export const splittingCashflowPreviewGrid = (splitAction: SplitActionType) => {
  const cols = [
    cashflowIdOfNettingPreview,
    splittingPaymentAmount,
    splitCashflowState(splitAction),
    bookingEntityFMCode,
    counterpartyFMCode,
    paymentCurreny,
    payReceiveIndicator,
    cashflowVersion,
    paymentDate,
    taxonomy,
    paymentType,
    cashflowSubState,
    cashflowSubStateType,
    cashflowEventType,
    cfiCode,
    dataSourceSystem,
    entryTime,
    allotment,
  ];

  if (splitAction === SplitActionType.MANUAL_SPLIT) {
    cols.unshift(actionCol);
    cols.push(lookUpSSIActionCol);
  }
  return cols;
};
const nullHandle = (s: string) => (s === "null" ? undefined : s);

//should disable fields below in custom view.
export const customizeCashflowFields = [
  {
    headerName: "Release Timer",
    headerTooltip: "Release Timer",
    field: "",
    hide: false,
    pinned: "right",
    lockPinned: true,
    width: 130,
    filterValueGetter: (params: any) =>
      displayCountDownTime(
        nullHandle(params.data.Cashflow.Payment_Cutoff_Time)
      ),
    valueFormatter: (params: any) =>
      displayCountDownTime(
        nullHandle(params.data.Cashflow.Payment_Cutoff_Time)
      ),
    cellClass: (params: any) =>
      styleForCountDownTime(
        nullHandle(params.data.Cashflow.Payment_Cutoff_Time)
      ),
  },
  {
    headerName: "Event Reason",
    headerTooltip: "Event Reason",
    field: "Cashflow.Cashflow_Event_Reason",
    hide: false,
    pinned: "right",
    lockPinned: true,
    width: 140,
  },
];

const getSCPAYTooltips = (form?: any) => {
  if (isSCPAY(form?.getFieldsValue?.() ?? {})) {
    return mandatoryTooltipText;
  }
  return "";
};

/** Business rule: update SSI group titles based on message type.
 *  - If Msg = MT202:
 *    50a/52a groups title show "52a: Ordering Institution"
 *    58a/59a groups title show "58a: Beneficiary Customer"
 *  - If Msg != MT202:
 *   50a/52a groups title show "50a: Ordering Customer"
 *    58a/59a groups title show "59a: Beneficiary Customer"
 **/
export const resolveGroupTitle = (groupKey: string, swiftType: string) => {
  const titleMap = {
    "50a:": {
      MT202: "52a: Ordering Institution",
      default: "50a: Ordering Customer",
    },
    "52a:": {
      MT202: "52a: Ordering Institution",
      default: "50a: Ordering Customer",
    },
    "58a:": {
      MT202: "58a: Beneficiary Customer",
      default: "59a: Beneficiary Customer",
    },
    "59a:": {
      MT202: "58a: Beneficiary Customer",
      default: "59a: Beneficiary Customer",
    },
  } as const;

  const config = titleMap[groupKey as keyof typeof titleMap];
  if (!config) return undefined;
  return swiftType === "MT202" ? config.MT202 : config.default;
};

export const SSI_DETAILS_CONFIG_CN_Group: CustomFormGroupConfigProps[] = [
  {
    row: [
      {
        itemConfig: [
          {
            field: "ssiType",
            label: "SSI Type",
            componentType: "SelectItem",
            options: [
              {
                label: "Primary",
                value: "Primary",
              },
              {
                label: "Secondary",
                value: "Secondary",
              },
            ],
          },
          {
            field: "swiftType",
            label: "Msg",
            componentType: "SelectItem",
            options: [
              {
                label: "MT103",
                value: "MT103",
              },
              {
                label: "MT202",
                value: "MT202",
              },
            ],
            onChange: (
              value: string,
              configs: CustomFormGroupConfigProps[],
              form?: any
            ) => {
              /**
               * here should update params as the sctrue changed.
               */

              const groupTitleUpdaterMap = {
                "50a:": (group, value) => {
                  group.title = resolveGroupTitle("50a:", value) ?? group.title;
                },
                "52a:": (group, value) => {
                  group.title = resolveGroupTitle("52a:", value) ?? group.title;
                },
                "58a:": (group, value) => {
                  group.title = resolveGroupTitle("58a:", value) ?? group.title;
                },
                "59a:": (group, value) => {
                  group.title = resolveGroupTitle("59a:", value) ?? group.title;
                },
              };

              const itemUpdaterMap = {
                beneficiaryAccount: (item, value, form) => {
                  item.tooltipText = getSCPAYTooltips(form);
                },
                popDubai: (item, value, form) => {
                  item.hidden = !isPOP(form?.getFieldsValue?.() ?? {});
                },
              };

              updateFieldInGroupConfig({
                config: configs,
                value,
                form,
                groupTitleUpdaterMap,
                itemUpdaterMap,
              });

              return configs;
            },
          },
        ],
      },
      {
        itemConfig: [
          {
            field: "settlementMeans",
            label: "Settlement Means",
            componentType: "SelectItem",
            options: [
              {
                label: "NOS",
                value: "NOS",
              },
              {
                label: "Over-Account",
                value: "Over-Account",
              },
              {
                label: "FXBRREC",
                value: "FXBRREC",
              },
              {
                label: "CLG",
                value: "CLG",
              },
              {
                label: "CLS SUSP",
                value: "CLS SUSP",
              },
              {
                label: "CPN SUSP",
                value: "CPN SUSP",
              },
              {
                label: "FATCASUS",
                value: "FATCASUS",
              },
              {
                label: "GBFXSUS",
                value: "GBFXSUS",
              },
              {
                label: "HKCT",
                value: "HKCT",
              },
              {
                label: "HKNOTE",
                value: "HKNOTE",
              },
              {
                label: "MMSUS",
                value: "MMSUS",
              },
              {
                label: "NOSCENT",
                value: "NOSCENT",
              },
              {
                label: "Non Nostro",
                value: "Non-Nostro",
              },
              {
                label: "TBFXSUS",
                value: "TBFXSUS",
              },
              {
                label: "WMSUS",
                value: "WMSUS",
              },
              {
                label: "NOX",
                value: "NOX",
              },
              {
                label: "FXBRREC-M",
                value: "FXBRREC-M",
              },
            ],
            onChange: (
              value: string,
              config: CustomFormGroupConfigProps[],
              form?: any
            ) => {
              const itemUpdaterMap = {
                beneficiaryAccount: (item, value, form) => {
                  item.tooltipText = getSCPAYTooltips(form);
                },
                popDubai: (item, value, form) => {
                  item.hidden = !isPOP(form?.getFieldsValue?.() ?? {});
                },
              };
              updateFieldInGroupConfig({
                config: config,
                value,
                form,
                itemUpdaterMap,
              });
              return config;
            },
          },
          {
            field: "settlementAccount",
            label: "Settlement Account",
            onChange: (
              value: string,
              configs: CustomFormGroupConfigProps[],
              form?: any
            ) => {
              const itemUpdaterMap = {
                popDubai: (item, value, form) => {
                  item.hidden = !isPOP(form?.getFieldsValue?.() ?? {});
                },
              };
              updateFieldInGroupConfig({
                config: configs,
                value,
                form,
                itemUpdaterMap,
              });
              return configs;
            },
          },
          {
            field: "coveredPayment",
            label: "Covered Payment",
            componentType: "CheckboxItem",
            hasDivider: true,
          },
        ],
      },
    ],
  },
  {
    title: "58a: Beneficiary Customer",
    row: [
      {
        itemConfig: [
          {
            field: "beneficiaryBic",
            label: "BIC",
          },
          {
            field: "beneficiaryName",
            label: "Full Name",
          },
          {
            field: "beneficiaryName2",
            label: "Full Name1",
          },
        ],
      },
      {
        itemConfig: [
          {
            field: "beneficiaryAddress",
            label: "Address",
            col: 12,
          },
          {
            field: "",
            label: "",
            col: 4,
            hidden: true,
            notSubmit: true,
          },
          {
            field: "beneficiaryAccount",
            label: "Account",
          },
        ],
      },
      {
        itemConfig: [
          {
            field: "isThirdPartyPayment",
            label: "TPP",
            componentType: "CheckboxItem",
          },
          {
            field: "charges",
            label: "Charges",
            componentType: "SelectItem",
            options: [
              {
                label: "OUR",
                value: "OUR",
              },
              {
                label: "BEN",
                value: "BEN",
              },
              {
                label: "SHA",
                value: "SHA",
              },
            ],
          },
          {
            field: "beneficiaryCity",
            label: "Country",
          },
        ],
      },
      {
        childGroup: [
          {
            title: "Hybrid Address",
            row: [
              {
                itemConfig: [
                  {
                    field: "beneficiaryAddress1",
                    label: "Address1",
                    col: 12,
                  },
                  {
                    field: "beneficiaryAddress2",
                    label: "Address2",
                    col: 12,
                  },
                ],
              },
              {
                itemConfig: [
                  {
                    field: "beneficiaryCountryIsoCode",
                    label: "Country Code",
                  },
                  {
                    field: "beneficiaryPostCode",
                    label: "Post Code",
                  },
                  {
                    field: "beneficiaryCityName",
                    label: "Town Name",
                    hasDivider: true,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "57a: Account With Institution",
    row: [
      {
        itemConfig: [
          {
            field: "accountWithInstitutionBic",
            label: "BIC",
            onChange: (
              value: string,
              configs: CustomFormGroupConfigProps[],
              form?: any
            ) => {
              const itemUpdaterMap = {
                popDubai: (item, value, form) => {
                  item.hidden = !isPOP(form?.getFieldsValue?.() ?? {});
                },
              };
              updateFieldInGroupConfig({
                config: configs,
                value,
                form,
                itemUpdaterMap,
              });
              return configs;
            },
          },
          {
            field: "accountWithInstitutionName",
            label: "Full Name",
            hasBr: true,
          },
          {
            field: "accountWithInstitutionAccount",
            label: "Account",
            hasBr: true,
            tooltipText: <SwiftSlashTooltip />,
          },
        ],
      },
      {
        itemConfig: [
          {
            field: "accountWithInstitutionAddress",
            label: "Address",
            col: 12,
          },
          {
            field: "",
            label: "",
            col: 4,
            notSubmit: true,
            hidden: true,
          },
          {
            field: "accountWithInstitutionCity",
            label: "Country",
          },
        ],
      },
      {
        childGroup: [
          {
            title: "Hybrid Address",
            row: [
              {
                itemConfig: [
                  {
                    field: "accountWithInstitutionAddress1",
                    label: "Address1",
                    col: 12,
                  },
                  {
                    field: "accountWithInstitutionAddress2",
                    label: "Address2",
                    col: 12,
                  },
                ],
              },
              {
                itemConfig: [
                  {
                    field: "accountWithInstitutionCountryIsoCode",
                    label: "Country Code",
                  },
                  {
                    field: "accountWithInstitutionPostCode",
                    label: "Post Code",
                  },
                  {
                    field: "accountWithInstitutionCityName",
                    label: "Town Name",
                    hasDivider: true,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "56a: Intermediary Institution",
    row: [
      {
        itemConfig: [
          {
            field: "intermediaryBic",
            label: "BIC",
          },
          {
            field: "intermediaryName",
            label: "Full Name",
          },
          {
            field: "intermediaryAccount",
            label: "Account",
            tooltipText: <SwiftSlashTooltip />,
          },
        ],
      },
      {
        itemConfig: [
          {
            field: "intermediaryAddress",
            label: "Address",
            col: 12,
          },
          {
            field: "",
            label: "",
            col: 4,
            notSubmit: true,
            hidden: true,
          },
          {
            field: "intermediaryCity",
            label: "Country",
          },
        ],
      },
      {
        childGroup: [
          {
            title: "Hybrid Address",
            row: [
              {
                itemConfig: [
                  {
                    field: "intermediaryAddress1",
                    label: "Address1",
                    col: 12,
                  },
                  {
                    field: "intermediaryAddress2",
                    label: "Address2",
                    col: 12,
                  },
                ],
              },
              {
                itemConfig: [
                  {
                    field: "intermediaryCountryIsoCode",
                    label: "Country Code",
                  },
                  {
                    field: "intermediaryPostcode",
                    label: "Post Code",
                  },
                  {
                    field: "intermediaryCityName",
                    label: "Town Name",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "54a: Receiver's Correspondent",
    row: [
      {
        itemConfig: [
          {
            field: "receiversCorrespondentBic",
            label: "BIC",
          },
          {
            field: "receiversCorrespondentName",
            label: "Full Name",
          },
          {
            field: "receiversCorrespondentAccount",
            label: "Account",
            tooltipText: <SwiftSlashTooltip />,
          },
        ],
      },
      {
        itemConfig: [
          {
            field: "receiversCorrespondentAddress",
            label: "Address",
            col: 12,
          },
          {
            field: "",
            label: "",
            col: 4,
            notSubmit: true,
            hidden: true,
          },
          {
            field: "receiversCorrespondentCity",
            label: "Country",
          },
        ],
      },
      {
        childGroup: [
          {
            title: "Hybrid Address",
            row: [
              {
                itemConfig: [
                  {
                    field: "receiversCorrespondentAddress1",
                    label: "Address1",
                    col: 12,
                  },
                  {
                    field: "receiversCorrespondentAddress2",
                    label: "Address2",
                    col: 12,
                  },
                ],
              },
              {
                itemConfig: [
                  {
                    field: "receiversCorrespondentCountryIsoCode",
                    label: "Country Code",
                  },
                  {
                    field: "receiversCorrespondentPostCode",
                    label: "Post Code",
                  },
                  {
                    field: "receiversCorrespondentCityName",
                    label: "Town Name",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "50a: Ordering Customer",
    row: [
      {
        itemConfig: [
          {
            field: "orderCustomerBic",
            label: "BIC",
          },
          {
            field: "orderCustomerName",
            label: "Full Name",
          },
          {
            field: "orderCustomerAccount",
            label: "Account",
          },
        ],
      },
      {
        itemConfig: [
          {
            field: "orderCustomerAddress",
            label: "Address",
            col: 12,
          },
          {
            field: "",
            label: "",
            col: 4,
            notSubmit: true,
            hidden: true,
          },
          {
            field: "orderCustomerCity",
            label: "Country",
          },
        ],
      },
      {
        childGroup: [
          {
            title: "Hybrid Address",
            row: [
              {
                itemConfig: [
                  {
                    field: "orderCustomerAddress1",
                    label: "Address1",
                    col: 12,
                  },
                  {
                    field: "orderCustomerAddress2",
                    label: "Address2",
                    col: 12,
                  },
                ],
              },
              {
                itemConfig: [
                  {
                    field: "orderCustomerCountryIsoCode",
                    label: "Country Code",
                  },
                  {
                    field: "orderCustomerPostCode",
                    label: "Post Code",
                  },
                  {
                    field: "orderCustomerCityName",
                    label: "Town Name",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "72: Sender To Receiver",
    row: [
      {
        itemConfig: [
          {
            field: "senderToReceiver1",
            label: "Line 1",
          },
          {
            field: "senderToReceiver2",
            label: "Line 2",
          },
          {
            field: "senderToReceiver3",
            label: "Line 3",
          },
        ],
      },
      {
        itemConfig: [
          {
            field: "senderToReceiver4",
            label: "Line 4",
          },
          {
            field: "senderToReceiver5",
            label: "Line 5",
          },
          {
            field: "senderToReceiver6",
            label: "Line 6",
          },
        ],
      },
    ],
  },
  {
    title: "70: Remittance Information",
    row: [
      {
        itemConfig: [
          {
            field: "remittanceInformation1",
            label: "Line 1",
          },
          {
            field: "remittanceInformation2",
            label: "Line 2",
          },
          {
            field: "remittanceInformation3",
            label: "Line 3",
          },
        ],
      },
      {
        itemConfig: [
          {
            field: "remittanceInformation4",
            label: "Line 4",
            hasDivider: true,
          },
        ],
      },
    ],
  },
  {
    // title: "77: Purpose of Payment",
    row: [
      {
        itemConfig: [
          {
            field: "popDubai",
            label: "77: Purpose of Payment",
            hidden: true,
            col: 24,
          },
        ],
      },
    ],
  },
  {
    row: [
      {
        itemConfig: [
          {
            field: "entity",
            label: "",
            hidden: true,
            notSubmit: false,
          },
          {
            field: "tradingCurrency",
            label: "",
            hidden: true,
            notSubmit: false,
          },
        ],
      },
    ],
  },
];
/**
 * Copy Nostro Config from Container and add CN cashflow specific fields
 */
export const NOSTRO_DETAILS_CONFIG_CN: CustomFormConfigProps[] = [
  {
    field: "settlementMeans",
    label: "Settlement Means",
    componentType: "SelectItem",
    options: [
      {
        label: "NOS",
        value: "NOS",
      },
      {
        label: "Over-Account",
        value: "Over-Account",
      },
      {
        label: "FXBRREC",
        value: "FXBRREC",
      },
      {
        label: "CLG",
        value: "CLG",
      },
      {
        label: "CLS SUSP",
        value: "CLS SUSP",
      },
      {
        label: "CPN SUSP",
        value: "CPN SUSP",
      },
      {
        label: "FATCASUS",
        value: "FATCASUS",
      },
      {
        label: "GBFXSUS",
        value: "GBFXSUS",
      },
      {
        label: "HKCT",
        value: "HKCT",
      },
      {
        label: "HKNOTE",
        value: "HKNOTE",
      },
      {
        label: "MMSUS",
        value: "MMSUS",
      },
      {
        label: "NOSCENT",
        value: "NOSCENT",
      },
      {
        label: "Non Nostro",
        value: "Non-Nostro",
      },
      {
        label: "TBFXSUS",
        value: "TBFXSUS",
      },
      {
        label: "WMSUS",
        value: "WMSUS",
      },
      {
        label: "NOX",
        value: "NOX",
      },
      {
        label: "FXBRREC-M",
        value: "FXBRREC-M",
      },
    ],
    onChange: (value: string, configs: CustomFormConfigProps[], form?: any) => {
      return configs.map((item: any) => {
        if (item.field === "beneficiaryAccount") {
          item.tooltipText = getSCPAYTooltips(form);
        }
        if (item.field === "popDubai") {
          item.hidden = !isPOP(form?.getFieldsValue?.() ?? {});
        }
        return item;
      });
    },
  },
  {
    field: "settlementAccount",
    label: "Settlement Account",
  },
  {
    field: "nostroType",
    label: "Nostro Type",
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
  {
    field: "dedicatedPortfolio",
    label: "Portfolio ",
    hidden: true,
    notSubmit: false,
  },
];

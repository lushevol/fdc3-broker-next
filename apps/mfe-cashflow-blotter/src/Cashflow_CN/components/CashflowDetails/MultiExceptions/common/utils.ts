import cloneDeep from "lodash/cloneDeep";
import _get from "lodash/get";
import { ForwardedRef, useEffect, useRef } from "react";
import { emptyOrNilOptional } from "src/Cashflow_CN/Main/utils";
import { getUser, hasPermission } from "src/Root/import/ratanutils";

import { HistoryDataType } from "../components/ActionHistory/interface";
import { NostroFormDetails } from "../components/Nostro/interface";
import { VostroFormDetails } from "../components/Vostro/interface";
import { parseMakerIdFromHistory } from "../hooks/useData";
import {
  CommonExceptionsNames,
  ExceptionBundle,
  ExceptionBundleStatus,
  ExceptionCategory,
  ExceptionItem,
  ExceptionStatusTypes,
  FormErrorType,
  MultiExceptionsNames,
  NonePermission,
  Submiter,
  UserProfile,
  UserType,
  Verifier,
} from "./interface";

export const DateFormat = "YYYY-MM-DD";
export const TimeFormat = "HH:mm:ss";

export const EDIT = "Edit";
export const ADHOC = "Edit (Adhoc SSI)";
export const FIXING_MISSING_NOSTRO = "Edit ";

const MissingVostroExceptionCode = ["RATAN-201000001", "Missing Vostro"];
const MultiVostroExceptionCode = ["RATAN-201000002", "Multi Vostro"];
const SSIMissMatchedExceptionCode = ["RATAN-201000003", "SI Mismatch"];
const MissingNostroExceptionCode = ["RATAN-201000005", "Missing Nostro"];
const ValidateBeneInfoExceptionCode = ["RATAN-201000006", "Validate Bene Info"];
const GoodStampingExceptionCode = ["RATAN-201000010", "Per SSI Adhoc"];
const AdhocSSIExceptionCode = ["RATAN-202000005", "Adhoc SSI"];

export const editingActions = [EDIT, ADHOC, FIXING_MISSING_NOSTRO];

export const getUserProfile = (): UserProfile => {
  const canMake = hasPermission(
    "RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Multi_Exception_Initiate"
  );
  const canCheck = hasPermission(
    "RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Multi_Exception_Verify"
  );
  if (canCheck) return Verifier;
  return canMake ? Submiter : NonePermission;
};

export const hasHighRiskExceptionPermission = () =>
  hasPermission(
    "RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Multi_Exception_Verify_High_Risk"
  );

export const assembleSubmitRequestBody = ({
  cashflowDetails,
  exceptions,
  payload,
  action,
  filterExceptionNames = [],
}: {
  cashflowDetails: CNCashflow;
  exceptions: ExceptionItem[];
  payload: { [n: string]: any };
  action: ExceptionBundleStatus;
  filterExceptionNames?: string[];
}): ExceptionBundle => {
  exceptions = cloneDeep(exceptions);
  const exceptionList = exceptions
    .filter((exp) => {
      // used when reject, only send checked exceptions.
      if (filterExceptionNames?.length) {
        const sectionName = matchException(exp);
        return filterExceptionNames.includes(sectionName);
      }
      return true;
    })
    .map((exp) => {
      const sectionName = matchException(exp);
      if (sectionName) {
        exp.Actions?.forEach((act) => {
          if (act.Action_Name?.toLowerCase() === action?.toLowerCase()) {
            // vostro exception request body should contain both v/n.
            if (sectionName === MultiExceptionsNames.Vostro) {
              const vostroPayload = payload[MultiExceptionsNames.Vostro];
              const nostroPayload = payload[MultiExceptionsNames.Nostro];
              const isMissingNostroExp = isMissingNostroException(exp);
              act.Request_Body = {
                fitVostro:
                  vostroPayload || (isMissingNostroExp ? {} : undefined),
                fitNostro: nostroPayload,
              } as unknown as string;
            } else {
              act.Request_Body = payload[sectionName];
            }
          }
        });
      }
      return exp;
    })
    // Delete this when submit api receive Logic Model.
    .map((i) => {
      return {
        ...convertLM2sH_Obj(i),
        actions: i.Actions?.map((j) => convertLM2sH_Obj(j)) ?? [],
        stashing: undefined,
      };
    });
  return {
    cashflowId: cashflowDetails.Cashflow?.Cashflow_Id,
    cashflowVersion: cashflowDetails.Cashflow?.Cashflow_Version,
    businessVersion: cashflowDetails.Cashflow?.Cashflow_Business_Version,
    minorVersion: cashflowDetails.Cashflow?.Cashflow_Minor_Version,
    action,
    ...payload[MultiExceptionsNames.Comment],
    exceptions: exceptionList,
  };
};

// track exception to get it's formData name
export const matchException = (
  exception: ExceptionItem
): typeof MultiExceptionsNames.Nostro | CommonExceptionsNames => {
  const { Exception_Category } = exception;
  if (Exception_Category === ExceptionCategory.NSTP)
    return MultiExceptionsNames.NSTP;
  if (Exception_Category === ExceptionCategory.HIGH_RISK_NSTP)
    return MultiExceptionsNames.HIGH_RISK_NSTP;
  else if (Exception_Category === ExceptionCategory.HARD_BLOCKER)
    return MultiExceptionsNames.HARD_BLOCKER;
  else if (Exception_Category === ExceptionCategory.OTHER)
    return MultiExceptionsNames.Other;
  else if (Exception_Category === ExceptionCategory.AFFIRMATION)
    return MultiExceptionsNames.Affirmation;
  else if (Exception_Category === ExceptionCategory.BACKVALUE)
    return MultiExceptionsNames.Backvalue;
  else if (Exception_Category === ExceptionCategory.SSI)
    return MultiExceptionsNames.Vostro;
  return "";
};

export const isMissingVostroException = (exception: ExceptionItem) => {
  const exceptionName = matchException(exception);
  return (
    exceptionName === MultiExceptionsNames.Vostro &&
    MissingVostroExceptionCode.includes(exception.Exception_Code + "")
  );
};

export const isMultiVostroException = (exception: ExceptionItem) => {
  const exceptionName = matchException(exception);
  return (
    exceptionName === MultiExceptionsNames.Vostro &&
    MultiVostroExceptionCode.includes(exception.Exception_Code + "")
  );
};

export const isSSIGoodStamping = (exception: ExceptionItem) => {
  const exceptionName = matchException(exception);
  return (
    exceptionName === MultiExceptionsNames.Vostro &&
    GoodStampingExceptionCode.includes(exception.Exception_Code as string) &&
    exception.Status === ExceptionStatusTypes.INACTIVE
  );
};

export const isMissingNostroException = (exception: ExceptionItem) => {
  const exceptionName = matchException(exception);
  return (
    exceptionName === MultiExceptionsNames.Vostro &&
    MissingNostroExceptionCode.includes(exception.Exception_Code + "")
  );
};

export const isSSIMissMatchedException = (exception: ExceptionItem) => {
  const exceptionName = matchException(exception);
  return (
    exceptionName === MultiExceptionsNames.Vostro &&
    SSIMissMatchedExceptionCode.includes(exception.Exception_Code + "")
  );
};

export const isValidateBeneInfoException = (exception: ExceptionItem) => {
  const exceptionName = matchException(exception);
  return (
    exceptionName === MultiExceptionsNames.Vostro &&
    ValidateBeneInfoExceptionCode.includes(exception.Exception_Code + "")
  );
};

export const isAdhocSSIException = (exception: ExceptionItem) => {
  const exceptionName = matchException(exception);
  return (
    exceptionName === MultiExceptionsNames.Vostro &&
    AdhocSSIExceptionCode.includes(exception.Exception_Code + "")
  );
};

export const isRebookException = (exception: ExceptionItem) => {
  const exceptionName = matchException(exception);
  return (
    exceptionName === MultiExceptionsNames.HIGH_RISK_NSTP &&
    exception.Exception_Code === "Rebook"
  );
};

// refer to mapping above
export const extractMeaningfulTitleOfSSIException = (
  exp: ExceptionItem
): string => {
  const name = matchException(exp);
  if (name === MultiExceptionsNames.Vostro) {
    return emptyOrNilOptional(
      emptyOrNilOptional(exp.Exception_Code, exp.Description),
      "SSI"
    );
  }
  return "SSI";
};

export const dataAccuracyVerification = (
  data: {
    [x: string]: any;
  },
  makerSubmittedData: {
    [x: string]: any;
  }
): { ok: boolean; msg: FormErrorType[] } => {
  let ok = true;
  const msg: FormErrorType[] = [];
  // vostro & vostro
  if (data[MultiExceptionsNames.Vostro]) {
    const { settlementAccount: VostroAccount, settlementMeans: VostroMeans } =
      data[MultiExceptionsNames.Vostro] || {};
    const { settlementAccount: NostroAccount, settlementMeans: NostroMeans } =
      data[MultiExceptionsNames.Nostro] || {};
    if (VostroAccount !== NostroAccount || NostroMeans !== VostroMeans) {
      VostroAccount !== NostroAccount &&
        msg.push({
          type: "form",
          section: MultiExceptionsNames.Vostro,
          field: "settlementAccount",
          errorType: "warning",
          errorMsg: "Different with Nostro",
        });
      NostroMeans !== VostroMeans &&
        msg.push({
          type: "form",
          section: MultiExceptionsNames.Vostro,
          field: "settlementMeans",
          errorType: "warning",
          errorMsg: "Different with Nostro",
        });
      ok = false;
    }
  }
  // when ssi exception (whatever vostro/nostro)
  if (makerSubmittedData[MultiExceptionsNames.Vostro]) {
    const diffs = diffObject(
      data[MultiExceptionsNames.Vostro] || {},
      makerSubmittedData[MultiExceptionsNames.Vostro],
      // skip comparasion
      [
        "ssiId",
        "settlementCode",
        "entity",
        "tradingCurrency",
        // only when fedwire shall compare the settlement method. #6219556
        ...(isMakerOrCheckInputFedwire(
          makerSubmittedData[MultiExceptionsNames.Vostro],
          data[MultiExceptionsNames.Vostro]
        )
          ? []
          : ["settlementMethod"]),
      ]
    );
    diffs.forEach((field) =>
      msg.push({
        type: "form",
        section: MultiExceptionsNames.Vostro,
        field,
        errorType: "warning",
        errorMsg: "Different With Maker Input",
      })
    );
    ok &&= !diffs.length;
    const diffs2 = diffObject(
      data[MultiExceptionsNames.Nostro],
      makerSubmittedData[MultiExceptionsNames.Nostro]
    );
    diffs2.forEach((field) =>
      msg.push({
        type: "form",
        section: MultiExceptionsNames.Nostro,
        field,
        errorType: "warning",
        errorMsg: "Different With Maker Input",
      })
    );
    ok &&= !diffs2.length;
  }
  if (makerSubmittedData[MultiExceptionsNames.Affirmation]) {
    const diffs = diffObject(
      data[MultiExceptionsNames.Affirmation],
      makerSubmittedData[MultiExceptionsNames.Affirmation]
    );
    diffs.forEach((field) =>
      msg.push({
        type: "form",
        section: MultiExceptionsNames.Affirmation,
        field,
        errorType: "warning",
        errorMsg: "Different With Maker Input",
      })
    );
    ok &&= !diffs.length;
  }
  if (makerSubmittedData[MultiExceptionsNames.Backvalue]) {
    const diffs = diffObject(
      data[MultiExceptionsNames.Backvalue],
      makerSubmittedData[MultiExceptionsNames.Backvalue]
    );
    diffs.forEach((field) =>
      msg.push({
        type: "form",
        section: MultiExceptionsNames.Backvalue,
        field,
        errorType: "warning",
        errorMsg: "Different With Maker Input",
      })
    );
    ok &&= !diffs.length;
  }
  return { ok, msg };
};

// compare source with target
export const diffObject = (
  source: { [x: string]: string | number },
  target: { [x: string]: string | number },
  skipKeys: string[] = []
) => {
  return Object.keys(source).filter((k) => {
    if (skipKeys.includes(k)) return false;
    return (source[k] || "") !== (target[k] || "");
  });
};

export const convertStrBoolIntoYN = (input: any) => {
  if (typeof input !== "string") return input;
  switch (input.toLowerCase()) {
    case "false":
      return "N";
    case "true":
      return "Y";
    default:
      return input;
  }
};

export const convertAllStrBoolValueInObjIntoYN = (obj: Object) => {
  const copy = cloneDeep(obj);
  Object.keys(copy).forEach((k) => (copy[k] = convertStrBoolIntoYN(copy[k])));
  return copy;
};

export const useForwardRef = <T>(
  ref: ForwardedRef<T>,
  initialValue: any = null
) => {
  const targetRef = useRef<T>(initialValue);

  useEffect(() => {
    if (!ref) return;

    if (typeof ref === "function") {
      ref(targetRef.current);
    } else {
      ref.current = targetRef.current;
    }
  }, [ref]);

  return targetRef;
};

export const SSILogicModelMapping = [
  {
    path: "Account.Beneficiary_Account_Name",
    type: "vostro",
    field: "beneficiaryName",
  },
  {
    path: "Account.Beneficiary_Account_Name_2",
    type: "vostro",
    field: "beneficiaryName2",
  },
  {
    path: "Account.Beneficiary_Account_Number",
    type: "vostro",
    field: "beneficiaryAccount",
  },
  {
    path: "Account.Beneficiary_BIC_code",
    type: "vostro",
    field: "beneficiaryBic",
  },
  {
    path: "Account.Beneficiary_Bank_Account_Name",
    type: "vostro",
    field: "accountWithInstitutionName",
  },
  {
    path: "Account.Beneficiary_Bank_Account_Number",
    type: "vostro",
    field: "accountWithInstitutionAccount",
  },
  {
    path: "Account.Beneficiary_Bank_BIC_code",
    type: "vostro",
    field: "accountWithInstitutionBic",
  },
  {
    path: "Account.Beneficiary_Bank_City",
    type: "vostro",
    field: "accountWithInstitutionCity",
  },
  {
    path: "Account.Beneficiary_Bank_Street_Address",
    type: "vostro",
    field: "accountWithInstitutionAddress",
  },
  {
    path: "Account.Beneficiary_City",
    type: "vostro",
    field: "beneficiaryCity",
  },
  {
    path: "Account.Beneficiary_Correspondent_Account_Name",
    type: "vostro",
    field: "receiversCorrespondentName",
  },
  {
    path: "Account.Beneficiary_Correspondent_Account_Number",
    type: "vostro",
    field: "receiversCorrespondentAccount",
  },
  {
    path: "Account.Beneficiary_Correspondent_BIC_code",
    type: "vostro",
    field: "receiversCorrespondentBic",
  },
  {
    path: "Account.Beneficiary_Correspondent_City",
    type: "vostro",
    field: "receiversCorrespondentCity",
  },
  {
    path: "Account.Beneficiary_Correspondent_Street_Address",
    type: "vostro",
    field: "receiversCorrespondentAddress",
  },
  {
    path: "Account.Beneficiary_Street_Address",
    type: "vostro",
    field: "beneficiaryAddress",
  },
  {
    path: "Account.Booking_Entity_Correspondent_Account_Name",
    type: "nostro",
    field: "sendersCorrespondent53Fullname",
  },
  {
    path: "Account.Booking_Entity_Correspondent_Account_Number",
    type: "nostro",
    field: "sendersCorrespondent53Account",
  },
  {
    path: "Account.Booking_Entity_Correspondent_BIC_code",
    type: "nostro",
    field: "sendersCorrespondent53Swift",
  },
  {
    path: "Account.Booking_Entity_Correspondent_City",
    type: "nostro",
    field: "sendersCorrespondent53City",
  },
  {
    path: "Account.Booking_Entity_Correspondent_Street_Address",
    type: "nostro",
    field: "sendersCorrespondent53Address",
  },
  {
    path: "Account.Counterparty_CMS_Account_Number",
    type: "vostro",
    field: "cmsAccount",
  },
  {
    path: "Account.EBBS_Account_Number",
    type: "nostro",
    field: "ebbsNostroAccount",
  },
  // {
  //   path: "Account.EBBS_Bridge_Account_Number",
  //   type: "nostro",
  //   field: "",
  // },
  {
    path: "Account.Intermediary_Account_Name",
    type: "vostro",
    field: "intermediaryName",
  },
  {
    path: "Account.Intermediary_Account_Number",
    type: "vostro",
    field: "intermediaryAccount",
  },
  {
    path: "Account.Intermediary_BIC_code",
    type: "vostro",
    field: "intermediaryBic",
  },
  {
    path: "Account.Intermediary_City",
    type: "vostro",
    field: "intermediaryPostcode",
  },
  {
    path: "Account.Intermediary_Street_Address",
    type: "vostro",
    field: "intermediaryAddress",
  },
  {
    path: "Account.Ordering_Customer_Account_Name",
    type: "vostro",
    field: "orderCustomerName",
  },
  {
    path: "Account.Ordering_Customer_Account_Number",
    type: "vostro",
    field: "orderCustomerAccount",
  },
  {
    path: "Account.Ordering_Customer_BIC_Code",
    type: "vostro",
    field: "orderCustomerBic",
  },
  {
    path: "Account.Ordering_Customer_City",
    type: "vostro",
    field: "orderCustomerCity",
  },
  {
    path: "Account.Ordering_Customer_Street_Address",
    type: "vostro",
    field: "orderCustomerAddress",
  },
  {
    path: "Account.SCB_Nostro_Account_Number",
    type: "nostro/vostro",
    field: "settlementAccount",
  },
  {
    path: "Account.SCB_Nostro_Account_Type",
    type: "nostro/vostro",
    field: "settlementMeans",
  },
  {
    path: "Charge_Bearer",
    type: "vostro",
    field: "charges",
  },
  {
    path: "Is_Third_Party_Payment",
    type: "vostro",
    field: "isThirdPartyPayment",
    path2field: (value: string) => {
      return convertStrBoolIntoYN(value);
    },
  },
  {
    path: "Nostro_Swift_Message_Type",
    type: "nostro",
    field: "noticeToReceive",
    path2field: (value: string) => {
      switch (value) {
        case "Y":
        case "MT210":
          return "Y";

        default:
          return "N";
      }
    },
  },
  {
    path: "Remittance_Information_1",
    type: "vostro",
    field: "remittanceInformation1",
  },
  {
    path: "Remittance_Information_2",
    type: "vostro",
    field: "remittanceInformation2",
  },
  {
    path: "Remittance_Information_3",
    type: "vostro",
    field: "remittanceInformation3",
  },
  {
    path: "Remittance_Information_4",
    type: "vostro",
    field: "remittanceInformation4",
  },
  {
    path: "SSI_Priority",
    type: "vostro",
    field: "ssiType",
  },
  {
    path: "Settlement_Code",
    type: "vostro",
    field: "settlementCode",
  },
  // {
  //   path: "SSI_Source",
  //   type: "vostro",
  //   field: "",
  // },
  // {
  //   path: "SSI_Unique_Id",
  //   type: "",
  //   field: "",
  // },
  {
    path: "Sender_To_Receiver_Information_1",
    type: "vostro",
    field: "senderToReceiver1",
  },
  {
    path: "Sender_To_Receiver_Information_2",
    type: "vostro",
    field: "senderToReceiver2",
  },
  {
    path: "Sender_To_Receiver_Information_3",
    type: "vostro",
    field: "senderToReceiver3",
  },
  {
    path: "Sender_To_Receiver_Information_4",
    type: "vostro",
    field: "senderToReceiver4",
  },
  {
    path: "Sender_To_Receiver_Information_5",
    type: "vostro",
    field: "senderToReceiver5",
  },
  {
    path: "Sender_To_Receiver_Information_6",
    type: "vostro",
    field: "senderToReceiver6",
  },
  {
    path: "Swift_Message_Type",
    type: "vostro",
    field: "swiftType",
  },
  {
    path: "SSI_Id",
    type: "vostro",
    field: "ssiId",
  },
  {
    path: "Swift_Payment_Method",
    type: "vostro",
    field: "coveredPayment",
    path2field: (value: string) => {
      switch (value) {
        case "Y":
        case "Cover":
          return "Y";

        default:
          return "N";
      }
    },
  },
  {
    path: "Settlement_Method",
    type: "vostro",
    field: "settlementMethod",
  },
  {
    path: "Account.POP_Dubai",
    type: "vostro",
    field: "popDubai",
  },
  {
    path: "Nostro_Type",
    type: "nostro",
    field: "nostroType",
    path2field: (value: string) => {
      switch (value) {
        case undefined:
        case "":
        case null:
        case "DEFAULT":
          return "DEFAULT";

        default:
          return value;
      }
    },
  },
  {
    path: "Dedicated.Portfolio",
    type: "nostro",
    field: "dedicatedPortfolio",
  },
];

export const generateEmptyVostro = (): VostroFormDetails => ({
  settlementCode: "",
  ssiSource: "",
  ssiStatus: "",
  effectiveDate: "",
  fmid: "",
  counterpartName: "",
  swiftType: "",
  country: "",
  security: "",
  debitCredit: "",
  settlementMethod: "",
  deliveryMethod: "",
  settlementMeans: "",
  settlementType: "",
  systemCode: "",
  ssiId: "",
  entity: "",
  tradingCurrency: "",
  typology: "",
  ssiType: "",
  settlementAccount: "",
  productGroup: "",
  productFamily: "",
  productType: "",
  coveredPayment: "",
  cmsAccount: "",
  charges: "",
  isThirdpartyPayment: "",

  beneficiaryBic: "",
  beneficiaryName: "",
  beneficiaryName2: "",
  beneficiaryAddress: "",
  beneficiaryCity: "",
  beneficiaryPostcode: "",
  beneficiaryAccount: "",

  accountWithInstitutionBic: "",
  accountWithInstitutionName: "",
  accountWithInstitutionAddress: "",
  accountWithInstitutionCity: "",
  accountWithInstitutionPostcode: "",
  accountWithInstitutionAccount: "",

  receiversCorrespondentBic: "",
  receiversCorrespondentName: "",
  receiversCorrespondentAddress: "",
  receiversCorrespondentCity: "",
  receiversCorrespondentPostcode: "",
  receiversCorrespondentAccount: "",

  intermediaryBic: "",
  intermediaryName: "",
  intermediaryAddress: "",
  intermediaryCity: "",
  intermediaryPostcode: "",
  intermediaryAccount: "",

  orderCustomerBic: "",
  orderCustomerName: "",
  orderCustomerAddress: "",
  orderCustomerCity: "",
  orderCustomerPostcode: "",
  orderCustomerAccount: "",

  remittanceInformation1: "",
  remittanceInformation2: "",
  remittanceInformation3: "",
  remittanceInformation4: "",

  senderToReceiver1: "",
  senderToReceiver2: "",
  senderToReceiver3: "",
  senderToReceiver4: "",
  senderToReceiver5: "",
  senderToReceiver6: "",

  eventRowKey: "",
  bookingEntity: "",
  cfiCode: "",
  popDubai: "",
});

export const generateEmptyNostro = (): NostroFormDetails => ({
  id: "",
  legalEntity: "",
  legalEntityFmid: "",
  settlementCurrency: "",
  settlementMeans: "",
  settlementAccount: "",
  nostroType: "",
  dedicatedPortfolio: "",
  noticeToReceive: "",
  nostroSettlementMessageType: "",

  ebbsNostroAccount: "",
  ebbsBridgeAccount: "",
  sendersCorrespondent53Swift: "",
  sendersCorrespondent53Fullname: "",
  sendersCorrespondent53Address: "",
  sendersCorrespondent53City: "",
  sendersCorrespondent53PostCode: "",
  sendersCorrespondent53Account: "",

  createdAt: "",
  updatedAt: "",

  primaryFlag: "",
});

export const SSILogicModel2OldField = SSILogicModelMapping.reduce<{
  [p: string]: string;
}>((res, cur) => {
  res[cur.path] = cur.field;
  return res;
}, {});

export const SSIOldField2LogicModel = SSILogicModelMapping.reduce<{
  [p: string]: string;
}>((res, cur) => {
  res[cur.field] = cur.path;
  return res;
}, {});

const extractSSIValue = (ssi: SSI, config: any) => {
  const value = _get(ssi || {}, config.path);
  if (config.path2field) {
    return config.path2field(value);
  }
  return value;
};

export const revertSSI = (
  ssi?: SSI
): { vostro: VostroFormDetails; nostro: NostroFormDetails } => {
  return SSILogicModelMapping.reduce(
    (res, cur) => {
      if (!ssi) return res;
      if (cur.type === "nostro/vostro") {
        res["nostro"][cur.field] = extractSSIValue(ssi, cur);
        res["vostro"][cur.field] = extractSSIValue(ssi, cur);
      } else {
        res[cur.type][cur.field] = extractSSIValue(ssi, cur);
      }
      return res;
    },
    {
      vostro: generateEmptyVostro(),
      nostro: generateEmptyNostro(),
    }
  );
};

// Logic_Model => logicModel
const convertLogicModel2SmallHump = (k: string) => {
  const res = k.replace(/_/g, "");
  return res[0].toLowerCase() + res.slice(1);
};

const convertLM2sH_Obj = (o: Object) => {
  return Object.keys(o).reduce((res, cur) => {
    res[convertLogicModel2SmallHump(cur)] = o[cur];
    return res;
  }, {});
};

export const allowVostroEmptyWhenFixingMissingNostro = (
  cashflow?: CNCashflow
) => {
  return cashflow?.Cashflow?.Pay_Receive_Indicator === "Receive";
};

// Y/N
const VostroBooleanFields = ["isThirdPartyPayment", "coveredPayment"];
const NostroBooleanFields = ["noticeToReceive"];

export const isVostroFormDataEmpty = (data: { [n: string]: any }) => {
  if (typeof data !== "object") return false;
  return Object.entries(data).every(([k, v]) => {
    return VostroBooleanFields.includes(k) ? v === "N" || !v : !v;
  });
};

export const missingNostroSubmitPreCheck = (data: { [n: string]: any }) => {
  const vostroData = data[MultiExceptionsNames.Vostro];
  const isVostroEmpty = isVostroFormDataEmpty(vostroData);
  // if vostro is empty in receive + missing nostro, then vostro could be empty.
  // if pass all null object, BE will treat as user input, not correct.
  if (isVostroEmpty) data[MultiExceptionsNames.Vostro] = undefined;
};

// only keep number/alphabetics/underline/space
export const removeSpecialCharacters = (origin: string): string => {
  return origin.replace(/[^\s\w]/g, "");
};

export const getUserRole = () => {
  const { role } = getUser();
  return role;
};

export const findIfSubmitByYou = (
  userRole: UserType,
  actionHistoryListData: HistoryDataType[]
) => {
  const { id } = getUser();
  const makerIds = parseMakerIdFromHistory(userRole, actionHistoryListData);
  const res = makerIds.includes(id);
  return res;
};

export const trimObject = (obj: PlainObject) => {
  if (typeof obj === "object" && obj) {
    Object.keys(obj).forEach((k) => {
      if (typeof obj[k] === "string") obj[k] = (obj[k] as string).trim();
    });
  }
};

const SETTLEMENT_METHOD_FEDWIRE = "FEDWIRE";
export const isMakerOrCheckInputFedwire = (
  makerInput: Record<string, any>,
  checkerInput: Record<string, any>
) => {
  return (
    toUpperCase(makerInput.settlementMethod) === SETTLEMENT_METHOD_FEDWIRE ||
    toUpperCase(checkerInput.settlementMethod) === SETTLEMENT_METHOD_FEDWIRE
  );
};

export const toUpperCase = (str?: string | null): string => {
  if (str) return String.prototype.toUpperCase.call(str);
  return "";
};

export const vostroInformExtractWrapper = (
  cashflowDetails: GraphqlCashflowDetails
) => {
  const entity =
    cashflowDetails.cashflow?.Entity?.Booking_Entity_SCI_FMID ?? "";
  const tradingCurrency =
    cashflowDetails.cashflow?.Cashflow?.Payment_Currency ?? "";

  const wrapper = (obj: VostroFormDetails): VostroFormDetails => ({
    ...obj,
    entity,
    tradingCurrency,
  });

  return {
    wrapper,
  };
};

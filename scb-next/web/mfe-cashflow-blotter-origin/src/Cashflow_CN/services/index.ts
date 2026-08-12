import { getWrappedAxiosService } from "src/Root/analysis";
import { featureScopedEnabled } from "src/Root/common/utils/featureFlagController";
import { Service } from "src/Root/import";

import {
  ExceptionBundle,
  ExceptionCategory,
  ExceptionStatusType,
  UserType,
} from "../components/CashflowDetails/MultiExceptions/common/interface";
import { ManualNettingResponse } from "../components/NettingPreview/common/interface";
import {
  SettlementMethodUpdateRequestBody,
  SettlementMethodUpdateResponse,
} from "../Main/workflow/settlementMethodUpdate/type";
import {
  AmendSplitDataType,
  ManualSplitDataType,
  UnSplitDataType,
} from "../Main/workflow/splitting/common/interface";
import { CashflowSwiftSuppressionApi } from "../Main/workflow/swiftSuppress/interface";
import {
  AccountingDetailResponse,
  AccountingRepublishResponse,
  ExceptionBundleActionResult,
  UploadConfirmationResponse,
} from "./type";

const service =
  featureScopedEnabled("Axios_GraphQL_Monitor_Wrapper") &&
  getWrappedAxiosService
    ? getWrappedAxiosService("/cashflow_blotter_cn/cashflow_cn")
    : Service.service;

const PREFIX = "/api/ratan";

// High API Timeout For High Volume
const HIGH_TIMEOUT = 6 * 60 * 1000;

const FIX_MULTI_EXCEPTIONS_BUNDLE = `${PREFIX}/v1/camunda/task/NSTPSSI/`;
const BULK_FIX_MULTI_EXCEPTIONS_BUNDLE = `${PREFIX}/v2/camunda/task/NSTPSSI/`;
const CASHFLOW_USER_STATUS_UPDATE =
  "/api/ratan/v2/ratan/cashflow/move/status/user";
const SWIFT_SUPPRESS_MAKER = "/api/ratan/v1/ratan/lifecycle/suppress/maker";
const SWIFT_SUPPRESS_CHECKER = "/api/ratan/v1/ratan/lifecycle/suppress/checker";
const BULK_FAILED = "/api/ratan/v1/camunda/task/bulk/fail";
const CASHFLOW_NETTING = "/api/ratan/v1/cashSettlement/cashflows/netting";
const CASHFLOW_NETTING_PREVIEW =
  "/api/ratan/v1/cashSettlement/cashflows/preview";
// Hold
const HOLD = "/api/ratan/v1/ratan/lifecycle/hold";
// Unhold
const UNHOLD = "/api/ratan/v1/ratan/lifecycle/unhold";
const QUERY_COUNTRY_INFO = "/api/ratan/v1/cashflow/country/countryInfo";

// accounting republish
const ACCOUNTING_REPUBLISH = "/api/ratan/v1/accounting/job/republish";

export const CASHFLOW_NOTIFICATION_SUBSCRIPTIONS =
  "/api/ratan/notification/subscriptions";

//Auth Limit
export const CHECK_AUTH_LIMIT =
  "/api/ratan/v1/profileLimitation/checkLimitation";

// Swift Service
export const RATAN_SWIFT = "/api/ratan/v2/ratan/swift/";

// EBBS Acounting
export const EBBS_ACOUNTING_DETAIL = "/api/ratan/v1/accounting/fetch/";

//CCIL Netting
const CASHFLOW_CCIL_NETTING =
  "/api/ratan/v1/cashSettlement/cashflows/ccil/netting";
const CASHFLOW_CCIL_NETTING_PREVIEW =
  "/api/ratan/v1/cashSettlement/cashflows/ccil/preview";

// Bene Bic Netting
const CASHFLOW_BENE_BIC_NETTING =
  "/api/ratan/v1/cashSettlement/cashflows/bic/netting";
const CASHFLOW_BENE_BIC_NETTING_PREVIEW =
  "/api/ratan/v1/cashSettlement/cashflows/bic/preview";

// manual settle
const MANUAL_SETTLE_MAKER = "/api/ratan/v1/ratan/lifecycle/settle/maker";
const MANUAL_SETTLE_CHECKER = "/api/ratan/v1/ratan/lifecycle/settle/checker";

// all exception codes
const EXCEPTION_CODES =
  "/api/ratan/v1/rep/exceptions/nstpExceptionCodes/byStatus";

// counterparty
const COUNTERPARTY = `${PREFIX}/da/v1/counterparty`;

// split
const ROUNDING_CURRENCY = `${PREFIX}/v2/roundingConfig`;
const CASHFLOW_MANUAL_SPLIT = `${PREFIX}/v1/cashSettlement/cashflows/manualSplit`;
const CASHFLOW_AMEND_SPLIT = `${PREFIX}/v1/cashSettlement/cashflows/amendSplitAmount`;
const CASHFLOW_UN_SPLIT = `${PREFIX}/v1/cashSettlement/cashflows/unsplit`;
const CONFIRMATION_UPLOAD = `${PREFIX}/v1/netting/confirmation/upload`;

//Settlement Method Update
const CASHFLOW_SETTLEMENT_METHOD_UPDATE = `${PREFIX}/v1/fx/utilization/cashflow/settlementMethod/stamping`;

export const cashflowUserStatusUpdate = (data: any) =>
  service.post(CASHFLOW_USER_STATUS_UPDATE, data);

export const cashflowSwiftSuppressionMakerAction: CashflowSwiftSuppressionApi =
  (data) => service.post(SWIFT_SUPPRESS_MAKER, data);

export const cashflowSwiftSuppressionCheckerAction: CashflowSwiftSuppressionApi =
  (data) => service.post(SWIFT_SUPPRESS_CHECKER, data);

export const cashflowBulkFail = (data: any) => service.post(BULK_FAILED, data);

export const cashflowNetting = (data: any) =>
  service.post(CASHFLOW_NETTING, data, { timeout: HIGH_TIMEOUT });

export const cashflowNettingPreview = (data: any) =>
  service.post(CASHFLOW_NETTING_PREVIEW, data, { timeout: HIGH_TIMEOUT });

export const cashflowHold = (data: any) => service.post(HOLD, data);
export const cashflowUnhold = (data: any) => service.post(UNHOLD, data);

export const getCountryInfo = (data: any) =>
  service.post(QUERY_COUNTRY_INFO, data);

export const checkAuthLimit = (
  data: any
): Promise<{ success: boolean; reason: string }> =>
  service.get(
    `${CHECK_AUTH_LIMIT}/${data.profile}/${data.currency}/${data.amount}`
  );

export const getSwiftMessageByCashflowId = (
  cfid: string
): Promise<{
  swiftType: string;
  mtMessageList: string[] | null;
  mxMessageLists: swiftmessageList[] | null;
}> => {
  return service.get(`${RATAN_SWIFT}${cfid}`);
};

export const getEBBSAcountingDetail = (
  cfid: string
): Promise<AccountingDetailResponse[]> => {
  return service.get(`${EBBS_ACOUNTING_DETAIL}${cfid}`);
};

export const cashflowCcilNetting = (
  data: any
): Promise<ManualNettingResponse> =>
  service.post(CASHFLOW_CCIL_NETTING, data, { timeout: HIGH_TIMEOUT });

export const cashflowCcilNettingPreview = (data: any) =>
  service.post(CASHFLOW_CCIL_NETTING_PREVIEW, data, { timeout: HIGH_TIMEOUT });

export const cashflowBeneBICNetting = (
  data: any
): Promise<ManualNettingResponse> =>
  service.post(CASHFLOW_BENE_BIC_NETTING, data, { timeout: HIGH_TIMEOUT });
export const cashflowBeneBICNettingPreview = (data: any) =>
  service.post(CASHFLOW_BENE_BIC_NETTING_PREVIEW, data, {
    timeout: HIGH_TIMEOUT,
  });

export const postExceptionBundleAction = async (
  payload: ExceptionBundle,
  role: UserType
): Promise<ExceptionBundleActionResult> => {
  return service.post(
    `${FIX_MULTI_EXCEPTIONS_BUNDLE}${role.toLowerCase()}`,
    payload,
    { timeout: HIGH_TIMEOUT }
  );
};

export const postBulkExceptionBundleAction = async (
  payload: ExceptionBundle[],
  role: UserType
): Promise<ExceptionBundleActionResult[]> => {
  return service.post(
    `${BULK_FIX_MULTI_EXCEPTIONS_BUNDLE}${role.toLowerCase()}`,
    payload,
    { timeout: HIGH_TIMEOUT }
  );
};

export const postAccountingRepublish = async (
  externalSystemKeys: string[]
): Promise<AccountingRepublishResponse> => {
  return service.post(ACCOUNTING_REPUBLISH, externalSystemKeys);
};

export const postSettleMaker = (data: any) =>
  service.post(MANUAL_SETTLE_MAKER, data);

export const postSettleChecker = (data: any) =>
  service.post(MANUAL_SETTLE_CHECKER, data);

export const queryAllExceptionCodes = (
  subStates: ExceptionStatusType[] = [
    "PENDING_OPERATOR",
    "PENDING_VERIFICATION",
  ]
): Promise<
  { label: string; value: string; exceptionCategory: ExceptionCategory }[]
> => service.post(EXCEPTION_CODES, subStates);

export const queryCounterPartyDetailsList = (
  fmIds: string[]
): Promise<CounterPartyDetailsFMEntity[]> => {
  return service.post(COUNTERPARTY, fmIds);
};

export const cashflowManualSplit = (
  data: ManualSplitDataType
): Promise<any> => {
  return service.post(CASHFLOW_MANUAL_SPLIT, data);
};

export const cashflowAmendSplit = (data: AmendSplitDataType): Promise<any> => {
  return service.post(CASHFLOW_AMEND_SPLIT, data);
};

export const cashflowUnSplit = (data: UnSplitDataType): Promise<any> => {
  return service.post(CASHFLOW_UN_SPLIT, data);
};

export const getCurrencyRounding = (currency: string): Promise<any> =>
  service.get(`${ROUNDING_CURRENCY}/${currency}`);

export const postSettlementMethodUpdate = async (
  data: SettlementMethodUpdateRequestBody
): Promise<SettlementMethodUpdateResponse[]> => {
  return service.post(CASHFLOW_SETTLEMENT_METHOD_UPDATE, data);
};

export const uploadConfirmationFile = (
  file: File
): Promise<UploadConfirmationResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("topic", "TDS3_Trade_Murex_Message_Process_In");

  return service.post(CONFIRMATION_UPLOAD, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

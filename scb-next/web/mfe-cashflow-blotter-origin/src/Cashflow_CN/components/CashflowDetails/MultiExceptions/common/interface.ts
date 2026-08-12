import { FormInstance } from "antd";
import { ValidateStatus } from "antd/es/form/FormItem";

export type CashflowDataModal = CNCashflow;
export enum CashflowSubStateTypes {
  PendingOperator = "Pending Operator",
  PendingVerification = "Pending Verification",
}

export enum CashflowSubStateTypeTypes {
  PendingException = "Pending Exception",
  PendingAck = "Pending Ack",
}

export enum CashflowStateTypes {
  WAITING = "WAITING",
  READY = "READY",
}

export type CashflowSubStateType = `${CashflowSubStateTypes}`;

export const Submiter = "Submiter";
export const Verifier = "Verifier";
export const NonePermission = "NonePermission";
export const Maker = "Maker";
export const Maker_Of_Ready_State = "Maker_Of_Ready_State"; // maker when Cashflow state is Ready. Only allowed adhoc now.
export const Checker = "Checker";
export const Visitor = "Visitor";

export type UserType =
  | typeof Maker
  | typeof Maker_Of_Ready_State
  | typeof Checker
  | typeof Visitor;
export type UserProfile =
  | typeof Submiter
  | typeof Verifier
  | typeof NonePermission;

export const MultiExceptionsNames = {
  Vostro: "vostro",
  Nostro: "nostro",
  Affirmation: "affirmation",
  Backvalue: "back_value",
  NSTP: "nstp",
  HIGH_RISK_NSTP: "high_risk_nstp",
  HARD_BLOCKER: "hard_blocker",
  Other: "other",
  Comment: "comment",
};

export type CommonExceptionsNames =
  | typeof MultiExceptionsNames.Vostro
  | typeof MultiExceptionsNames.Affirmation
  | typeof MultiExceptionsNames.Backvalue
  | typeof MultiExceptionsNames.NSTP
  | typeof MultiExceptionsNames.Other;

export const MultiExceptionsFormNames = {
  VostroForm: MultiExceptionsNames.Vostro + "Form",
  NostroForm: MultiExceptionsNames.Nostro + "Form",
  AffirmationForm: MultiExceptionsNames.Affirmation + "Form",
  BackvalueForm: MultiExceptionsNames.Backvalue + "Form",
  NstpForm: MultiExceptionsNames.NSTP + "Form",
  OtherForm: MultiExceptionsNames.Other + "Form",
  CommentsForm: MultiExceptionsNames.Comment + "Form",
};

export interface MultiExceptionsProps {
  cashflowDetails: GraphqlCashflowDetails;
  refreshCashflow: () => Promise<any>;
  counterPartyDetails?: CounterPartyDetailsFMEntity;
  closeDialog?: () => void;
}

export interface AntFormCustomValidate {
  validateStatus: ValidateStatus;
  help: string;
  hasFeedback: boolean;
}
export interface FormRef {
  getForm: () => FormInstance;
  setValidateStatus: (vs: { [n: string]: AntFormCustomValidate }) => void;
  clearValidateStatus: () => void;
}

export interface ExceptionBundle {
  cashflowId: string;
  businessVersion: string;
  cashflowVersion: string;
  minorVersion: string;
  action: ExceptionBundleStatus;
  comment: string;
  exceptions: ExceptionItem[];
}

export type ExceptionItem = RatanException;

export enum ExceptionBundleStatusTypes {
  Submit = "Submit",
  Approve = "Approve",
  Reject = "Reject",
}

export type ExceptionBundleStatus = `${ExceptionBundleStatusTypes}`;

export enum ExceptionCategory {
  NSTP = "NSTP",
  HIGH_RISK_NSTP = "HIGH_RISK_NSTP",
  OTHER = "OTHER",
  AFFIRMATION = "AFFIRMATION",
  BACKVALUE = "BACK_VALUE",
  SSI = "SSI",
  HARD_BLOCKER = "HARD_BLOCKER",
}

export enum ExceptionStatusTypes {
  PENDING_OPERATOR = "PENDING_OPERATOR",
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
}

export type ExceptionStatusType = `${ExceptionStatusTypes}`;

export const CashflowSubState_ExceptionStatus = {
  [CashflowSubStateTypes.PendingOperator]:
    ExceptionStatusTypes.PENDING_OPERATOR,
  [CashflowSubStateTypes.PendingVerification]:
    ExceptionStatusTypes.PENDING_VERIFICATION,
};

type FormSectionNames =
  | typeof MultiExceptionsNames.Vostro
  | typeof MultiExceptionsNames.Nostro
  | typeof MultiExceptionsNames.Affirmation
  | typeof MultiExceptionsNames.Backvalue;

export interface FormErrorType {
  type: "form" | "message";
  section: FormSectionNames;
  field: string;
  errorType: "error" | "warning";
  errorMsg?: string;
}

export interface RefStructType {
  getForm: () => FormInstance<any>;
  setValidateStatus: (vs: { [n: string]: AntFormCustomValidate }) => void;
  clearValidateStatus: () => void;
  forceRefreshValidation: (data: any) => void;
  setFormConfig: (config: any[]) => void;
  valuesChange: (obj: any) => void;
}

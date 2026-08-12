export type ActionType =
  | "SwiftSuppressionMaker"
  | "SwiftSuppressionChecker"
  | "UndoSwiftSuppressionMaker"
  | "UndoSwiftSuppressionChecker"
  | "CashflowSuppressionMaker"
  | "CashflowSuppressionChecker"
  | "CashflowUnSuppressionMaker"
  | "CashflowUnSuppressionChecker";
export type SubStateType =
  | "Swift Suppression"
  | "Undo Swift Suppression"
  | "Cashflow Suppression"
  | "Undo Cashflow Suppression";
export type SubmitAction =
  | "ManualSuppress"
  | "ManualUnSuppress"
  | "ManualSwiftSuppress"
  | "ManualSwiftUnSuppress"
  | "Approve"
  | "Reject";

export interface CashflowSwiftSuppressionRequest {
  action: SubmitAction;
  comment: string;
  cashflows: {
    cashflowId: string;
    businessVersion: string;
    cashflowVersion: string;
    minorVersion: string;
  }[];
}

interface CashflowSwiftSuppressionResponse {}

export type CashflowSwiftSuppressionApi = (
  p: CashflowSwiftSuppressionRequest
) => Promise<CashflowSwiftSuppressionResponse>;

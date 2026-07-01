export enum BulkUserType {
  Maker = "Maker",
  Checker = "Checker",
}

export type AuthLimitResult = {
  success: boolean;
  reason: string;
};

export enum BulkResultStatus {
  None = "None",
  Submiting = "Submiting",
  SubmitSuccess = "SubmitSuccess",
  SubmitFailed = "SubmitFailed",
  NotificationUpdated = "NotificationUpdated",
}

export type CashflowDisplay = {
  cashflowId?: string | null;
  tradeId?: string | null;
  counterpartyCode?: string | null;
  entityCode?: string | null;
  currency?: string | null;
  amount?: string | null;
  valueData?: string | null;
  payRec?: string | null;
  exceptions: RatanException[];
  hasInsufficientException: boolean;
  isSubmitByYou: boolean;
  affirmationEmail?: string;
  authLimitResult?: Promise<AuthLimitResult>;
  InsufficientReason?: string;
  bulkActionResult: {
    status: BulkResultStatus;
    message: string;
  };
  rawCashflow: GraphqlCashflowDetails;
};

export type CashflowEligibleResult = {
  eligibleForBulk: {
    cashflows: CashflowDisplay[];
  };
  insufficientForBulk: {
    cashflows: CashflowDisplay[];
  };
};

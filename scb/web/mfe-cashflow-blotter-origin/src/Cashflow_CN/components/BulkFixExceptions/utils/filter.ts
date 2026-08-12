import { checkAuthLimit } from "src/Cashflow_CN/services";
import { ExceptionBundleActionResult } from "src/Cashflow_CN/services/type";

import {
  CashflowStateTypes,
  CashflowSubStateType,
  CashflowSubStateTypes,
  CashflowSubStateTypeTypes,
  ExceptionBundleStatusTypes,
  MultiExceptionsNames,
  Submiter,
  UserProfile,
  Verifier,
} from "../../CashflowDetails/MultiExceptions/common/interface";
import {
  findIfSubmitByYou,
  getUserRole,
  hasHighRiskExceptionPermission,
  isRebookException,
  matchException,
} from "../../CashflowDetails/MultiExceptions/common/utils";
import { affirmationSubmitFormDataType } from "../../CashflowDetails/MultiExceptions/components/Affirmation/interface";
import { histroyDataHandling } from "../../CashflowDetails/MultiExceptions/hooks/useData";
import { filterExceptionsByCurrentCashflowSubState } from "../../CashflowDetails/MultiExceptions/utils/filter";
import {
  BulkResultStatus,
  BulkUserType,
  CashflowDisplay,
  CashflowEligibleResult,
} from "../type";
import { getUserType } from "./rightmenu";

export const cashflowEligibleFilter = (
  cashflows: GraphqlCashflowDetails[],
  currentUserType: BulkUserType
): CashflowEligibleResult => {
  const res: CashflowEligibleResult = {
    eligibleForBulk: {
      cashflows: [],
    },
    insufficientForBulk: {
      cashflows: [],
    },
  };

  const userRole = getUserRole();

  cashflows.forEach((cashflow) => {
    const displayCashflow = transformCashflowToDisplay(
      cashflow,
      currentUserType
    );
    const { valid, message } = validEligibleByCashflow(displayCashflow);
    if (!valid) {
      displayCashflow.InsufficientReason = message;
      res.insufficientForBulk.cashflows.push(displayCashflow);
    } else {
      if (currentUserType === BulkUserType.Checker) {
        const authResp = queryAndVerifyAuthLimits(cashflow, userRole);
        displayCashflow.authLimitResult = authResp;
      }
      res.eligibleForBulk.cashflows.push(displayCashflow);
    }
  });

  return res;
};

export const presubmitBulkActionValidation = async (
  cashflow: CashflowDisplay,
  action: ExceptionBundleStatusTypes
): Promise<{
  valid: boolean;
  message: string;
}> => {
  if (
    [
      BulkResultStatus.SubmitSuccess,
      BulkResultStatus.NotificationUpdated,
      BulkResultStatus.Submiting,
    ].includes(cashflow.bulkActionResult.status)
  ) {
    return {
      valid: false,
      message: "this cashflow is updated, can't be update again",
    };
  } else if (
    action &&
    [ExceptionBundleStatusTypes.Approve].includes(action) &&
    cashflow.authLimitResult
  ) {
    const { success, reason } = await cashflow.authLimitResult;
    return {
      valid: success,
      message: reason,
    };
  }

  return {
    valid: true,
    message: "",
  };
};

export const validEligibleByCashflow = (
  cashflow: CashflowDisplay
): {
  valid: boolean;
  message: string;
} => {
  if (cashflow.isSubmitByYou) {
    return {
      valid: false,
      message: "this cashflow is updated by you.",
    };
  } else if (cashflow.hasInsufficientException) {
    return {
      valid: false,
      message: "contains exception which is insufficient for bulk",
    };
  } else if (cashflow.exceptions.length === 0) {
    return {
      valid: false,
      message: "no eligible exception",
    };
  } else if (hasHighRiskExceptionsButNoPermission(cashflow.exceptions)) {
    return {
      valid: false,
      message: "has high risk exception but no permission",
    };
  } else if (hasHardBlockerExceptions(cashflow.exceptions)) {
    return {
      valid: false,
      message: "has hard blocker exception",
    };
  }

  return {
    valid: true,
    message: "",
  };
};

export const findExceptionsWithReject = (exceptions: RatanException[]) => {
  return exceptions.filter((e) =>
    e.Actions?.some(
      (a) =>
        a.Action_Name?.toLowerCase() ===
        ExceptionBundleStatusTypes.Reject.toLowerCase()
    )
  );
};

export const findAffirmationException = (exceptions: RatanException[]) => {
  return exceptions?.find(
    (exp) => matchException(exp) === MultiExceptionsNames.Affirmation
  );
};

export const findBackValueDateException = (exceptions: RatanException[]) => {
  return exceptions?.find(
    (exp) => matchException(exp) === MultiExceptionsNames.Backvalue
  );
};

export const findActiveBackValueDateException = (
  exceptions: RatanException[]
) => {
  const bvdExp = findBackValueDateException(exceptions);
  return bvdExp?.Status?.toUpperCase() !== "CLOSED" ? bvdExp : undefined;
};

export const findAffirmationDataFromExceptionsStashing = (
  exceptions: RatanException[]
): affirmationSubmitFormDataType | null => {
  const affirmationExp = findAffirmationException(exceptions);
  if (affirmationExp?.Stashing?.Maker_Request_Body) {
    try {
      const formData = JSON.parse(
        affirmationExp.Stashing.Maker_Request_Body
      ) as affirmationSubmitFormDataType;
      return formData;
    } catch (error) {
      return null;
    }
  }
  return null;
};

export const findInsufficientException = (exceptions: RatanException[]) => {
  return exceptions.find((exp) => !exp.Bulk_Eligible);
};

export const transformCashflowToDisplay = (
  cashflow: GraphqlCashflowDetails,
  userType: BulkUserType
): CashflowDisplay => {
  const exceptions = filterExceptionsByCurrentCashflowSubState(
    cashflow.ratanException ?? [],
    cashflow.cashflow?.Cashflow?.Cashflow_Sub_State as CashflowSubStateType
  );
  const hasInsufficientException = !!findInsufficientException(exceptions);
  return {
    cashflowId: cashflow.cashflow?.Cashflow?.Cashflow_Id,
    tradeId: cashflow.cashflow?.Trade_Id,
    counterpartyCode: cashflow.cashflow?.Entity?.Counterparty_SCI_FMCODE,
    entityCode: cashflow.cashflow?.Entity?.Booking_Entity_SCI_FMCODE,
    currency: cashflow.cashflow?.Cashflow?.Payment_Currency,
    amount: cashflow.cashflow?.Cashflow?.Payment_Amount,
    valueData: cashflow.cashflow?.Cashflow?.Payment_Date,
    payRec: cashflow.cashflow?.Cashflow?.Pay_Receive_Indicator,
    isSubmitByYou: findIfSubmitByYou(
      userType,
      histroyDataHandling(cashflow.cashflowAuditTrail ?? [])
    ),
    affirmationEmail:
      findAffirmationDataFromExceptionsStashing(exceptions)?.phone_email,
    exceptions,
    hasInsufficientException,
    bulkActionResult: {
      status: BulkResultStatus.None,
      message: "",
    },
    rawCashflow: cashflow,
  };
};

export const setProcessingToCashflowDisplay = (
  cashflow: CashflowDisplay
): CashflowDisplay => {
  return {
    ...cashflow,
    bulkActionResult: {
      status: BulkResultStatus.Submiting,
      message: "",
    },
  };
};

export const setInitResultStatusToCashflowDisplay = (
  cashflow: CashflowDisplay
): CashflowDisplay => {
  return {
    ...cashflow,
    bulkActionResult: {
      status: BulkResultStatus.None,
      message: "",
    },
  };
};

export const assignResultToCashflowDisplay = (
  displayCashflows: CashflowDisplay[],
  result: ExceptionBundleActionResult[]
) => {
  return displayCashflows.map((cashflow) => {
    const target = result.find((res) => res.cashflowId === cashflow.cashflowId);
    if (target) {
      cashflow.bulkActionResult.status =
        target.status === 200
          ? BulkResultStatus.SubmitSuccess
          : BulkResultStatus.SubmitFailed;
      cashflow.bulkActionResult.message = target.errorMessage;
      return cashflow;
    } else {
      return cashflow;
    }
  });
};

export const assignNotificationToCashflowDisplay = (
  displayCashflows: CashflowDisplay[],
  updatedEligibleCashflows: CNCashflow[],
  userType: BulkUserType
): CashflowDisplay[] => {
  return displayCashflows.map((cashflow) => {
    const target = updatedEligibleCashflows.find(
      (i) => i.Cashflow?.Cashflow_Id === cashflow.cashflowId
    );
    if (target) {
      const notificationUserType = getUserType(target);
      if (notificationUserType === userType) {
        cashflow.bulkActionResult.status = BulkResultStatus.None;
        cashflow.bulkActionResult.message = "";
        // skip if submit successfully, don't overwrite state.
      } else if (
        cashflow.bulkActionResult.status !== BulkResultStatus.SubmitSuccess
      ) {
        cashflow.bulkActionResult.status = BulkResultStatus.NotificationUpdated;
        cashflow.bulkActionResult.message = "Cashflow Status Updated";
      }
    }
    return cashflow;
  });
};

export const queryAndVerifyAuthLimits = async (
  cashflowDetails: GraphqlCashflowDetails,
  userRole: string
): Promise<{ success: boolean; reason: string }> => {
  try {
    const currency = cashflowDetails.cashflow?.Cashflow?.Payment_Currency;
    const amount = cashflowDetails.cashflow?.Cashflow?.Payment_Amount;
    const res = await checkAuthLimit({
      profile: userRole,
      currency,
      amount,
    });
    return res;
  } catch (error) {
    return {
      success: false,
      reason: "query auth limit failed",
    };
  }
};

export const cashflowStateFilter = (cashflow: CNCashflow): boolean => {
  const { Cashflow_State, Cashflow_Sub_State_Type } = cashflow?.Cashflow ?? {};
  return (
    Cashflow_State === CashflowStateTypes.WAITING &&
    Cashflow_Sub_State_Type === CashflowSubStateTypeTypes.PendingException
  );
};

export const cashflowStageFilter = (
  cashflow: CNCashflow,
  userProfile: UserProfile
): BulkUserType | "" => {
  if (!cashflowStateFilter(cashflow)) return "";
  const { Cashflow_Sub_State } = cashflow?.Cashflow ?? {};
  if (
    userProfile === Verifier &&
    Cashflow_Sub_State === CashflowSubStateTypes.PendingVerification
  ) {
    return BulkUserType.Checker;
  } else if (
    [Submiter, Verifier].includes(userProfile) &&
    Cashflow_Sub_State === CashflowSubStateTypes.PendingOperator
  ) {
    return BulkUserType.Maker;
  }
  return "";
};

export const findAllHighRiskExceptions = (exceptions: RatanException[]) => {
  return exceptions.filter(
    (exp) => matchException(exp) === MultiExceptionsNames.HIGH_RISK_NSTP
  );
};

export const hasRebookExceptions = (exceptions: RatanException[]) => {
  return findAllHighRiskExceptions(exceptions).some((e) =>
    isRebookException(e)
  );
};

export const hasHighRiskExceptionsButNoPermission = (
  exceptions: RatanException[]
) => {
  return hasRebookExceptions(exceptions) && !hasHighRiskExceptionPermission();
};

export const hasHardBlockerExceptions = (exceptions: RatanException[]) => {
  return exceptions.some(
    (exp) => matchException(exp) === MultiExceptionsNames.HARD_BLOCKER
  );
};

import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { ExceptionBundleActionResult } from "src/Cashflow_CN/services/type";
import { mockCashflow1 } from "src/Cashflow_CN/test/mockData/cashflow";
import { mockMultipleGraphqlDetails1, mockSingleCashflowDetails1 } from "src/Cashflow_CN/test/mockData/cashflowDetails";
import * as multiExceptionUtils from "../../CashflowDetails/MultiExceptions/common/utils";
import * as cashflowServices from "src/Cashflow_CN/services";
import * as rightMenuUtils from "./rightmenu";

import { CashflowStateTypes, CashflowSubStateTypes, CashflowSubStateTypeTypes, ExceptionBundleStatusTypes, ExceptionCategory, MultiExceptionsNames, Submiter, Verifier } from "../../CashflowDetails/MultiExceptions/common/interface";
import { mockCashflowDisplay } from "../test/mockData/cashflows";
import { BulkResultStatus, BulkUserType, CashflowDisplay } from "../type";
import { assignNotificationToCashflowDisplay, assignResultToCashflowDisplay, cashflowEligibleFilter, cashflowStageFilter, cashflowStateFilter, findActiveBackValueDateException, findAffirmationDataFromExceptionsStashing, findAffirmationException, findAllHighRiskExceptions, findBackValueDateException, findExceptionsWithReject, findInsufficientException, hasHighRiskExceptionsButNoPermission, hasRebookExceptions, presubmitBulkActionValidation, queryAndVerifyAuthLimits, setInitResultStatusToCashflowDisplay, setProcessingToCashflowDisplay, transformCashflowToDisplay, validEligibleByCashflow } from "./filter";

describe('filter', () => {
  it("cashflowEligibleFilter", () => {
    const cashflowEligibleResult = cashflowEligibleFilter(mockMultipleGraphqlDetails1, BulkUserType.Checker);
    expect(cashflowEligibleResult.eligibleForBulk.cashflows.length).toBe(0);
    expect(cashflowEligibleResult.insufficientForBulk.cashflows.length).toBe(mockMultipleGraphqlDetails1.length);
  });
  it("presubmitBulkActionValidation", async () => {
    const mockCashflowDisplay: CashflowDisplay = {
      exceptions: [],
      hasInsufficientException: false,
      isSubmitByYou: false,
      bulkActionResult: {
        status: BulkResultStatus.None,
        message: ""
      },
      rawCashflow: mockSingleCashflowDetails1
    }
    const validRes = await presubmitBulkActionValidation(mockCashflowDisplay, ExceptionBundleStatusTypes.Submit);
    expect(validRes.valid).toBe(true);
  });
  it("validEligibleByCashflow", () => {
    const res = validEligibleByCashflow(mockCashflowDisplay);
    expect(res.valid).toBe(true);
  });
  it("findExceptionsWithReject", () => {
    const res = findExceptionsWithReject(mockMultipleGraphqlDetails1[0].ratanException!);
    expect(res.length).toBe(1);
  });
  it("findAffirmationException", () => {
    const res = findAffirmationException(mockMultipleGraphqlDetails1[0].ratanException!);
    expect(res).toBeUndefined();
  });
  it("findBackValueDateException", () => {
    const res = findBackValueDateException(mockMultipleGraphqlDetails1[0].ratanException!);
    expect(res).toBeUndefined();
  });
  it("findActiveBackValueDateException", () => {
    const res = findActiveBackValueDateException(mockMultipleGraphqlDetails1[0].ratanException!);
    expect(res).toBeUndefined();
  });
  it("findAffirmationDataFromExceptionsStashing", () => {
    const res = findAffirmationDataFromExceptionsStashing(mockMultipleGraphqlDetails1[0].ratanException!);
    expect(res).toBeNull();
  });
  it("findInsufficientException", () => {
    const res = findInsufficientException(mockMultipleGraphqlDetails1[0].ratanException!);
    expect(res).toBeDefined();
  });
  it("transformCashflowToDisplay", () => {
    const res = transformCashflowToDisplay(mockMultipleGraphqlDetails1[0], BulkUserType.Maker);
    expect(res.cashflowId).toBeDefined();
  });
  it("setProcessingToCashflowDisplay", () => {
    const res = setProcessingToCashflowDisplay(mockCashflowDisplay);
    expect(res.bulkActionResult.status).toBe(BulkResultStatus.Submiting);
  });
  it("setInitResultStatusToCashflowDisplay", () => {
    const res = setInitResultStatusToCashflowDisplay(mockCashflowDisplay);
    expect(res.bulkActionResult.status).toBe(BulkResultStatus.None);
  });
  it("assignResultToCashflowDisplay", () => {
    const res = assignResultToCashflowDisplay([mockCashflowDisplay], []);
    expect(res.length).toBe(1);
  });
  it("assignNotificationToCashflowDisplay", () => {
    const res = assignNotificationToCashflowDisplay([mockCashflowDisplay], [mockCashflow1], BulkUserType.Maker);
    expect(res.length).toBe(1);
  });
  it("queryAndVerifyAuthLimits", async () => {
    const res = await queryAndVerifyAuthLimits(mockMultipleGraphqlDetails1[0], "FMO_BR_APR");
    expect(res).toBeDefined();
  });
  it("cashflowStateFilter", () => {
    const res = cashflowStateFilter(mockCashflow1);
    expect(res).toBe(true);
  });
  it("cashflowStateFilter - READY", () => {
    const res = cashflowStateFilter(
      merge(
        cloneDeep(mockCashflow1),
        {
          Cashflow: {
            Cashflow_State: "READY",
          }
        }
      ),
    );
    expect(res).toBe(false);
  });
  it("cashflowStageFilter - checker", () => {
    const res = cashflowStageFilter(mockCashflow1, Verifier);
    expect(res).toBe(BulkUserType.Checker);
  });
  it("cashflowStageFilter - maker", () => {
    const res = cashflowStageFilter(
      merge(
        mockCashflow1,
        {
          Cashflow: {
            Cashflow_Sub_State: "Pending Operator",
          }
        }
      ),
      Submiter
    );
    expect(res).toBe(BulkUserType.Maker);
  });
  it("findAllHighRiskExceptions", () => {
    const res = findAllHighRiskExceptions(mockMultipleGraphqlDetails1[0].ratanException!);
    expect(res).toStrictEqual([]);
  });
  it("hasRebookExceptions", () => {
    const res = hasRebookExceptions(mockMultipleGraphqlDetails1[0].ratanException!);
    expect(res).toBe(false);
  });
  it("hasHighRiskExceptionsButNoPermission", () => {
    const res = hasHighRiskExceptionsButNoPermission(mockMultipleGraphqlDetails1[0].ratanException!);
    expect(res).toBe(false);
  });
});

describe("cashflowEligibleFilter", () => {
  it("should classify cashflows as insufficient when they are not valid", () => {
    const mockCashflows = [
      {
        cashflow: { Cashflow: { Cashflow_Id: "1" } },
        ratanException: [],
      },
    ];
    const result = cashflowEligibleFilter(mockCashflows, BulkUserType.Maker);
    expect(result.eligibleForBulk.cashflows.length).toBe(0);
    expect(result.insufficientForBulk.cashflows.length).toBe(1);
    expect(result.insufficientForBulk.cashflows[0].InsufficientReason).toBe(
      "no eligible exception"
    );
  });

  it("should classify cashflows as eligible when they are valid", () => {
    const mockCashflows = [
      {
        cashflow: { Cashflow: { Cashflow_Id: "1" } },
        ratanException: [{ Bulk_Eligible: true }],
      },
    ];
    const result = cashflowEligibleFilter(mockCashflows, BulkUserType.Maker);
    expect(result.eligibleForBulk.cashflows.length).toBe(1);
    expect(result.insufficientForBulk.cashflows.length).toBe(0);
  });

  it("should classify cashflows as eligible when they are valid for checker role", () => {
    const mockCashflows = [
      {
        cashflow: { Cashflow: { Cashflow_Id: "1" } },
        ratanException: [{ Bulk_Eligible: true }],
      },
    ];
    const result = cashflowEligibleFilter(mockCashflows, BulkUserType.Checker);
    expect(result.eligibleForBulk.cashflows.length).toBe(1);
    expect(result.insufficientForBulk.cashflows.length).toBe(0);
  });

  it("should handle empty cashflows array", () => {
    const result = cashflowEligibleFilter([], BulkUserType.Maker);
    expect(result.eligibleForBulk.cashflows.length).toBe(0);
    expect(result.insufficientForBulk.cashflows.length).toBe(0);
  });
});

describe("presubmitBulkActionValidation", () => {
  it("should return invalid when bulkActionResult status is SubmitSuccess", async () => {
    const mockCashflowDisplay: CashflowDisplay = {
      exceptions: [],
      hasInsufficientException: false,
      isSubmitByYou: false,
      bulkActionResult: {
        status: BulkResultStatus.SubmitSuccess,
        message: "",
      },
      rawCashflow: mockSingleCashflowDetails1,
    };
    const result = await presubmitBulkActionValidation(
      mockCashflowDisplay,
      ExceptionBundleStatusTypes.Submit
    );
    expect(result.valid).toBe(false);
    expect(result.message).toBe("this cashflow is updated, can't be update again");
  });

  it("should return invalid when bulkActionResult status is NotificationUpdated", async () => {
    const mockCashflowDisplay: CashflowDisplay = {
      exceptions: [],
      hasInsufficientException: false,
      isSubmitByYou: false,
      bulkActionResult: {
        status: BulkResultStatus.NotificationUpdated,
        message: "",
      },
      rawCashflow: mockSingleCashflowDetails1,
    };
    const result = await presubmitBulkActionValidation(
      mockCashflowDisplay,
      ExceptionBundleStatusTypes.Submit
    );
    expect(result.valid).toBe(false);
    expect(result.message).toBe("this cashflow is updated, can't be update again");
  });

  it("should return invalid when bulkActionResult status is Submiting", async () => {
    const mockCashflowDisplay: CashflowDisplay = {
      exceptions: [],
      hasInsufficientException: false,
      isSubmitByYou: false,
      bulkActionResult: {
        status: BulkResultStatus.Submiting,
        message: "",
      },
      rawCashflow: mockSingleCashflowDetails1,
    };
    const result = await presubmitBulkActionValidation(
      mockCashflowDisplay,
      ExceptionBundleStatusTypes.Submit
    );
    expect(result.valid).toBe(false);
    expect(result.message).toBe("this cashflow is updated, can't be update again");
  });

  it("should return invalid when action is Approve and authLimitResult fails", async () => {
    const mockCashflowDisplay: CashflowDisplay = {
      exceptions: [],
      hasInsufficientException: false,
      isSubmitByYou: false,
      bulkActionResult: {
        status: BulkResultStatus.None,
        message: "",
      },
      authLimitResult: Promise.resolve({
        success: false,
        reason: "Authorization limit exceeded",
      }),
      rawCashflow: mockSingleCashflowDetails1,
    };
    const result = await presubmitBulkActionValidation(
      mockCashflowDisplay,
      ExceptionBundleStatusTypes.Approve
    );
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Authorization limit exceeded");
  });

  it("should return valid when action is Approve and authLimitResult succeeds", async () => {
    const mockCashflowDisplay: CashflowDisplay = {
      exceptions: [],
      hasInsufficientException: false,
      isSubmitByYou: false,
      bulkActionResult: {
        status: BulkResultStatus.None,
        message: "",
      },
      authLimitResult: Promise.resolve({
        success: true,
        reason: "",
      }),
      rawCashflow: mockSingleCashflowDetails1,
    };
    const result = await presubmitBulkActionValidation(
      mockCashflowDisplay,
      ExceptionBundleStatusTypes.Approve
    );
    expect(result.valid).toBe(true);
    expect(result.message).toBe("");
  });

  it("should return valid when no conditions are violated", async () => {
    const mockCashflowDisplay: CashflowDisplay = {
      exceptions: [],
      hasInsufficientException: false,
      isSubmitByYou: false,
      bulkActionResult: {
        status: BulkResultStatus.None,
        message: "",
      },
      rawCashflow: mockSingleCashflowDetails1,
    };
    const result = await presubmitBulkActionValidation(
      mockCashflowDisplay,
      ExceptionBundleStatusTypes.Submit
    );
    expect(result.valid).toBe(true);
    expect(result.message).toBe("");
  });
});

describe("validEligibleByCashflow", () => {
  it("should return invalid when cashflow is submitted by the user", () => {
    const mockCashflowDisplay: CashflowDisplay = {
      isSubmitByYou: true,
      hasInsufficientException: false,
      exceptions: [],
      bulkActionResult: {
        status: BulkResultStatus.None,
        message: "",
      },
      rawCashflow: mockSingleCashflowDetails1,
    };
    const result = validEligibleByCashflow(mockCashflowDisplay);
    expect(result.valid).toBe(false);
    expect(result.message).toBe("this cashflow is updated by you.");
  });

  it("should return invalid when cashflow has insufficient exceptions", () => {
    const mockCashflowDisplay: CashflowDisplay = {
      isSubmitByYou: false,
      hasInsufficientException: true,
      exceptions: [],
      bulkActionResult: {
        status: BulkResultStatus.None,
        message: "",
      },
      rawCashflow: mockSingleCashflowDetails1,
    };
    const result = validEligibleByCashflow(mockCashflowDisplay);
    expect(result.valid).toBe(false);
    expect(result.message).toBe("contains exception which is insufficient for bulk");
  });

  it("should return invalid when cashflow has no exceptions", () => {
    const mockCashflowDisplay: CashflowDisplay = {
      isSubmitByYou: false,
      hasInsufficientException: false,
      exceptions: [],
      bulkActionResult: {
        status: BulkResultStatus.None,
        message: "",
      },
      rawCashflow: mockSingleCashflowDetails1,
    };
    const result = validEligibleByCashflow(mockCashflowDisplay);
    expect(result.valid).toBe(false);
    expect(result.message).toBe("no eligible exception");
  });

  it.skip("should handle edge case where exceptions array is undefined", () => {
    const mockCashflowDisplay: CashflowDisplay = {
      isSubmitByYou: false,
      hasInsufficientException: false,
      exceptions: undefined as unknown as RatanException[],
      bulkActionResult: {
        status: BulkResultStatus.None,
        message: "",
      },
      rawCashflow: mockSingleCashflowDetails1,
    };
    const result = validEligibleByCashflow(mockCashflowDisplay);
    expect(result.valid).toBe(false);
    expect(result.message).toBe("no eligible exception");
  });
});
it("should return invalid if has hard blocker exception", () => {
  const mockCashflow: CashflowDisplay = {
    isSubmitByYou: false,
    hasInsufficientException: false,
    exceptions: [
      {
        Exception_Category: ExceptionCategory.HARD_BLOCKER,
      } as any,
    ],
  } as any;

  const result = validEligibleByCashflow(mockCashflow);
  expect(result.valid).toBe(false);
  expect(result.message).toBe("has hard blocker exception");
});


describe("findActiveBackValueDateException", () => {
  it("should return the back value date exception when it is not closed", () => {
    const mockExceptions = [
      {
        Status: "OPEN",
        Exception_Category: ExceptionCategory.BACKVALUE,
      },
    ];
    const result = findActiveBackValueDateException(mockExceptions);
    expect(result).toBeDefined();
    expect(result?.Status).toBe("OPEN");
  });

  it("should return undefined when the back value date exception is closed", () => {
    const mockExceptions = [
      {
        Status: "CLOSED",
        Exception_Category: ExceptionCategory.BACKVALUE,
      },
    ];
    const result = findActiveBackValueDateException(mockExceptions);
    expect(result).toBeUndefined();
  });

  it("should return undefined when there is no back value date exception", () => {
    const mockExceptions = [
      {
        Status: "OPEN",
        Exception_Name: MultiExceptionsNames.Affirmation,
      },
    ];
    const result = findActiveBackValueDateException(mockExceptions);
    expect(result).toBeUndefined();
  });

  it("should return undefined when exceptions array is empty", () => {
    const mockExceptions: RatanException[] = [];
    const result = findActiveBackValueDateException(mockExceptions);
    expect(result).toBeUndefined();
  });

  it("should return undefined when exceptions array is undefined", () => {
    const mockExceptions = undefined as unknown as RatanException[];
    const result = findActiveBackValueDateException(mockExceptions);
    expect(result).toBeUndefined();
  });

  it("should return undefined when exceptions array is null", () => {
    const mockExceptions = null as unknown as RatanException[];
    const result = findActiveBackValueDateException(mockExceptions);
    expect(result).toBeUndefined();
  });

  it("should return undefined when back value date exception has no status", () => {
    const mockExceptions = [
      {
        Exception_Category: ExceptionCategory.BACKVALUE,
      },
    ];
    const result = findActiveBackValueDateException(mockExceptions);
    expect(result).toEqual({ "Exception_Category": "BACK_VALUE" });
  });

  it("should return undefined when back value date exception has an invalid status", () => {
    const mockExceptions = [
      {
        Status: "INVALID",
        Exception_Category: ExceptionCategory.BACKVALUE,
      },
    ];
    const result = findActiveBackValueDateException(mockExceptions);
    expect(result).toEqual({ "Exception_Category": "BACK_VALUE", "Status": "INVALID" });
  });
});

describe("assignResultToCashflowDisplay", () => {
  it("should assign SubmitSuccess status when result status is 200", () => {
    const displayCashflows: CashflowDisplay[] = [
      {
        cashflowId: "1",
        bulkActionResult: {
          status: BulkResultStatus.None,
          message: "",
        },
      } as CashflowDisplay,
    ];
    const result: ExceptionBundleActionResult[] = [
      {
        cashflowId: "1",
        status: 200,
        errorMessage: "",
        errorCode: "",
      },
    ];
    const updatedCashflows = assignResultToCashflowDisplay(displayCashflows, result);
    expect(updatedCashflows[0].bulkActionResult.status).toBe(BulkResultStatus.SubmitSuccess);
    expect(updatedCashflows[0].bulkActionResult.message).toBe("");
  });

  it("should assign SubmitFailed status when result status is not 200", () => {
    const displayCashflows: CashflowDisplay[] = [
      {
        cashflowId: "1",
        bulkActionResult: {
          status: BulkResultStatus.None,
          message: "",
        },
      } as CashflowDisplay,
    ];
    const result: ExceptionBundleActionResult[] = [
      {
        cashflowId: "1",
        status: 500,
        errorMessage: "Internal Server Error",
        errorCode: "",
      },
    ];
    const updatedCashflows = assignResultToCashflowDisplay(displayCashflows, result);
    expect(updatedCashflows[0].bulkActionResult.status).toBe(BulkResultStatus.SubmitFailed);
    expect(updatedCashflows[0].bulkActionResult.message).toBe("Internal Server Error");
  });

  it("should not modify cashflow if no matching result is found", () => {
    const displayCashflows: CashflowDisplay[] = [
      {
        cashflowId: "1",
        bulkActionResult: {
          status: BulkResultStatus.None,
          message: "",
        },
      } as CashflowDisplay,
    ];
    const result: ExceptionBundleActionResult[] = [
      {
        cashflowId: "2",
        status: 200,
        errorMessage: "",
        errorCode: "",
      },
    ];
    const updatedCashflows = assignResultToCashflowDisplay(displayCashflows, result);
    expect(updatedCashflows[0].bulkActionResult.status).toBe(BulkResultStatus.None);
    expect(updatedCashflows[0].bulkActionResult.message).toBe("");
  });

  it("should handle empty displayCashflows array", () => {
    const displayCashflows: CashflowDisplay[] = [];
    const result: ExceptionBundleActionResult[] = [
      {
        cashflowId: "1",
        status: 200,
        errorMessage: "",
        errorCode: "",
      },
    ];
    const updatedCashflows = assignResultToCashflowDisplay(displayCashflows, result);
    expect(updatedCashflows.length).toBe(0);
  });

  it("should handle empty result array", () => {
    const displayCashflows: CashflowDisplay[] = [
      {
        cashflowId: "1",
        bulkActionResult: {
          status: BulkResultStatus.None,
          message: "",
        },
      } as CashflowDisplay,
    ];
    const result: ExceptionBundleActionResult[] = [];
    const updatedCashflows = assignResultToCashflowDisplay(displayCashflows, result);
    expect(updatedCashflows[0].bulkActionResult.status).toBe(BulkResultStatus.None);
    expect(updatedCashflows[0].bulkActionResult.message).toBe("");
  });

  it("should handle multiple cashflows and results", () => {
    const displayCashflows: CashflowDisplay[] = [
      {
        cashflowId: "1",
        bulkActionResult: {
          status: BulkResultStatus.None,
          message: "",
        },
      } as CashflowDisplay,
      {
        cashflowId: "2",
        bulkActionResult: {
          status: BulkResultStatus.None,
          message: "",
        },
      } as CashflowDisplay,
    ];
    const result: ExceptionBundleActionResult[] = [
      {
        cashflowId: "1",
        status: 200,
        errorMessage: "",
        errorCode: "",
      },
      {
        cashflowId: "2",
        status: 500,
        errorMessage: "Error processing cashflow",
        errorCode: "",
      },
    ];
    const updatedCashflows = assignResultToCashflowDisplay(displayCashflows, result);
    expect(updatedCashflows[0].bulkActionResult.status).toBe(BulkResultStatus.SubmitSuccess);
    expect(updatedCashflows[0].bulkActionResult.message).toBe("");
    expect(updatedCashflows[1].bulkActionResult.status).toBe(BulkResultStatus.SubmitFailed);
    expect(updatedCashflows[1].bulkActionResult.message).toBe("Error processing cashflow");
  });

  it("should handle edge case where cashflowId is undefined in result", () => {
    const displayCashflows: CashflowDisplay[] = [
      {
        cashflowId: "1",
        bulkActionResult: {
          status: BulkResultStatus.None,
          message: "",
        },
      } as CashflowDisplay,
    ];
    const result: ExceptionBundleActionResult[] = [
      {
        cashflowId: undefined as unknown as string,
        status: 200,
        errorMessage: "",
        errorCode: "",
      },
    ];
    const updatedCashflows = assignResultToCashflowDisplay(displayCashflows, result);
    expect(updatedCashflows[0].bulkActionResult.status).toBe(BulkResultStatus.None);
    expect(updatedCashflows[0].bulkActionResult.message).toBe("");
  });
});

describe("assignNotificationToCashflowDisplay", () => {
  it("should update bulkActionResult to NotificationUpdated when userType does not match and status is not SubmitSuccess", () => {
    const displayCashflows: CashflowDisplay[] = [
      {
        cashflowId: "1",
        bulkActionResult: {
          status: BulkResultStatus.None,
          message: "",
        },
      } as CashflowDisplay,
    ];
    const updatedEligibleCashflows: CNCashflow[] = [
      {
        Cashflow: {
          Cashflow_Id: "1",
        },
      } as CNCashflow,
    ];
    const userType = BulkUserType.Maker;

    vi.spyOn(rightMenuUtils, "getUserType").mockReturnValue(BulkUserType.Checker);

    const result = assignNotificationToCashflowDisplay(displayCashflows, updatedEligibleCashflows, userType);

    expect(result[0].bulkActionResult.status).toBe(BulkResultStatus.NotificationUpdated);
    expect(result[0].bulkActionResult.message).toBe("Cashflow Status Updated");
  });

  it("should not overwrite bulkActionResult when status is SubmitSuccess", () => {
    const displayCashflows: CashflowDisplay[] = [
      {
        cashflowId: "1",
        bulkActionResult: {
          status: BulkResultStatus.SubmitSuccess,
          message: "",
        },
      } as CashflowDisplay,
    ];
    const updatedEligibleCashflows: CNCashflow[] = [
      {
        Cashflow: {
          Cashflow_Id: "1",
        },
      } as CNCashflow,
    ];
    const userType = BulkUserType.Maker;

    vi.spyOn(rightMenuUtils, "getUserType").mockReturnValue(BulkUserType.Checker);

    const result = assignNotificationToCashflowDisplay(displayCashflows, updatedEligibleCashflows, userType);

    expect(result[0].bulkActionResult.status).toBe(BulkResultStatus.SubmitSuccess);
    expect(result[0].bulkActionResult.message).toBe("");
  });

  it("should reset bulkActionResult to None when userType matches", () => {
    const displayCashflows: CashflowDisplay[] = [
      {
        cashflowId: "1",
        bulkActionResult: {
          status: BulkResultStatus.NotificationUpdated,
          message: "Previous message",
        },
      } as CashflowDisplay,
    ];
    const updatedEligibleCashflows: CNCashflow[] = [
      {
        Cashflow: {
          Cashflow_Id: "1",
        },
      } as CNCashflow,
    ];
    const userType = BulkUserType.Maker;

    vi.spyOn(rightMenuUtils, "getUserType").mockReturnValue(BulkUserType.Maker);

    const result = assignNotificationToCashflowDisplay(displayCashflows, updatedEligibleCashflows, userType);

    expect(result[0].bulkActionResult.status).toBe(BulkResultStatus.None);
    expect(result[0].bulkActionResult.message).toBe("");
  });

  it("should not modify cashflow if no matching updatedEligibleCashflows are found", () => {
    const displayCashflows: CashflowDisplay[] = [
      {
        cashflowId: "1",
        bulkActionResult: {
          status: BulkResultStatus.None,
          message: "",
        },
      } as CashflowDisplay,
    ];
    const updatedEligibleCashflows: CNCashflow[] = [
      {
        Cashflow: {
          Cashflow_Id: "2",
        },
      } as CNCashflow,
    ];
    const userType = BulkUserType.Maker;

    const result = assignNotificationToCashflowDisplay(displayCashflows, updatedEligibleCashflows, userType);

    expect(result[0].bulkActionResult.status).toBe(BulkResultStatus.None);
    expect(result[0].bulkActionResult.message).toBe("");
  });

  it("should handle empty displayCashflows array", () => {
    const displayCashflows: CashflowDisplay[] = [];
    const updatedEligibleCashflows: CNCashflow[] = [
      {
        Cashflow: {
          Cashflow_Id: "1",
        },
      } as CNCashflow,
    ];
    const userType = BulkUserType.Maker;

    const result = assignNotificationToCashflowDisplay(displayCashflows, updatedEligibleCashflows, userType);

    expect(result.length).toBe(0);
  });

  it("should handle empty updatedEligibleCashflows array", () => {
    const displayCashflows: CashflowDisplay[] = [
      {
        cashflowId: "1",
        bulkActionResult: {
          status: BulkResultStatus.None,
          message: "",
        },
      } as CashflowDisplay,
    ];
    const updatedEligibleCashflows: CNCashflow[] = [];
    const userType = BulkUserType.Maker;

    const result = assignNotificationToCashflowDisplay(displayCashflows, updatedEligibleCashflows, userType);

    expect(result[0].bulkActionResult.status).toBe(BulkResultStatus.None);
    expect(result[0].bulkActionResult.message).toBe("");
  });

  it("should handle edge case where Cashflow_Id is undefined in updatedEligibleCashflows", () => {
    const displayCashflows: CashflowDisplay[] = [
      {
        cashflowId: "1",
        bulkActionResult: {
          status: BulkResultStatus.None,
          message: "",
        },
      } as CashflowDisplay,
    ];
    const updatedEligibleCashflows: CNCashflow[] = [
      {
        Cashflow: {
          Cashflow_Id: undefined as unknown as string,
        },
      } as CNCashflow,
    ];
    const userType = BulkUserType.Maker;

    const result = assignNotificationToCashflowDisplay(displayCashflows, updatedEligibleCashflows, userType);

    expect(result[0].bulkActionResult.status).toBe(BulkResultStatus.None);
    expect(result[0].bulkActionResult.message).toBe("");
  });
});

describe("queryAndVerifyAuthLimits", () => {
  it("should return success true when checkAuthLimit resolves successfully", async () => {
    const mockCashflowDetails = {
      cashflow: {
        Cashflow: {
          Payment_Currency: "USD",
          Payment_Amount: "1000",
        },
      },
    } as GraphqlCashflowDetails;

    const mockUserRole = "Checker";

    vi.spyOn(cashflowServices, "checkAuthLimit").mockResolvedValue({
      success: true,
      reason: "",
    });

    const result = await queryAndVerifyAuthLimits(mockCashflowDetails, mockUserRole);

    expect(result.success).toBe(true);
    expect(result.reason).toBe("");
  });

  it("should return success false with reason when checkAuthLimit resolves with failure", async () => {
    const mockCashflowDetails = {
      cashflow: {
        Cashflow: {
          Payment_Currency: "USD",
          Payment_Amount: "1000",
        },
      },
    } as GraphqlCashflowDetails;

    const mockUserRole = "Checker";

    vi.spyOn(cashflowServices, "checkAuthLimit").mockResolvedValue({
      success: false,
      reason: "Authorization limit exceeded",
    });

    const result = await queryAndVerifyAuthLimits(mockCashflowDetails, mockUserRole);

    expect(result.success).toBe(false);
    expect(result.reason).toBe("Authorization limit exceeded");
  });

  it("should return success false with default reason when checkAuthLimit throws an error", async () => {
    const mockCashflowDetails = {
      cashflow: {
        Cashflow: {
          Payment_Currency: "USD",
          Payment_Amount: "1000",
        },
      },
    } as GraphqlCashflowDetails;

    const mockUserRole = "Checker";

    vi.spyOn(cashflowServices, "checkAuthLimit").mockRejectedValue(new Error("Network error"));

    const result = await queryAndVerifyAuthLimits(mockCashflowDetails, mockUserRole);

    expect(result.success).toBe(false);
    expect(result.reason).toBe("query auth limit failed");
  });

  it("should handle edge case when Payment_Currency is undefined", async () => {
    const mockCashflowDetails = {
      cashflow: {
        Cashflow: {
          Payment_Currency: undefined,
          Payment_Amount: "1000",
        },
      },
    } as GraphqlCashflowDetails;

    const mockUserRole = "Checker";

    vi.spyOn(cashflowServices, "checkAuthLimit").mockResolvedValue({
      success: true,
      reason: "",
    });

    const result = await queryAndVerifyAuthLimits(mockCashflowDetails, mockUserRole);

    expect(result.success).toBe(true);
    expect(result.reason).toBe("");
  });

  it("should handle edge case when Payment_Amount is undefined", async () => {
    const mockCashflowDetails = {
      cashflow: {
        Cashflow: {
          Payment_Currency: "USD",
          Payment_Amount: undefined,
        },
      },
    } as GraphqlCashflowDetails;

    const mockUserRole = "Checker";

    vi.spyOn(cashflowServices, "checkAuthLimit").mockResolvedValue({
      success: true,
      reason: "",
    });

    const result = await queryAndVerifyAuthLimits(mockCashflowDetails, mockUserRole);

    expect(result.success).toBe(true);
    expect(result.reason).toBe("");
  });

  it("should handle edge case when cashflowDetails is null", async () => {
    const mockCashflowDetails = null as unknown as GraphqlCashflowDetails;

    const mockUserRole = "Checker";

    vi.spyOn(cashflowServices, "checkAuthLimit").mockResolvedValue({
      success: false,
      reason: "Invalid cashflow details",
    });

    const result = await queryAndVerifyAuthLimits(mockCashflowDetails, mockUserRole);

    expect(result.success).toBe(false);
    expect(result.reason).toBe("query auth limit failed");
  });

  it("should handle edge case when cashflowDetails.cashflow is undefined", async () => {
    const mockCashflowDetails = {
      cashflow: undefined,
    } as unknown as GraphqlCashflowDetails;

    const mockUserRole = "Checker";

    vi.spyOn(cashflowServices, "checkAuthLimit").mockResolvedValue({
      success: false,
      reason: "Invalid cashflow details",
    });

    const result = await queryAndVerifyAuthLimits(mockCashflowDetails, mockUserRole);

    expect(result.success).toBe(false);
    expect(result.reason).toBe("Invalid cashflow details");
  });
});

describe("cashflowStateFilter", () => {
  it("should return true when Cashflow_State is WAITING and Cashflow_Sub_State_Type is PendingException", () => {
    const mockCashflow: CNCashflow = {
      Cashflow: {
        Cashflow_State: CashflowStateTypes.WAITING,
        Cashflow_Sub_State_Type: CashflowSubStateTypeTypes.PendingException,
      },
    };
    const result = cashflowStateFilter(mockCashflow);
    expect(result).toBe(true);
  });

  it("should return false when Cashflow_State is not WAITING", () => {
    const mockCashflow: CNCashflow = {
      Cashflow: {
        Cashflow_State: "READY",
        Cashflow_Sub_State_Type: CashflowSubStateTypeTypes.PendingException,
      },
    };
    const result = cashflowStateFilter(mockCashflow);
    expect(result).toBe(false);
  });

  it("should return false when Cashflow_Sub_State_Type is not PendingException", () => {
    const mockCashflow: CNCashflow = {
      Cashflow: {
        Cashflow_State: CashflowStateTypes.WAITING,
        Cashflow_Sub_State_Type: "OtherStateType" as CashflowSubStateTypeTypes,
      },
    };
    const result = cashflowStateFilter(mockCashflow);
    expect(result).toBe(false);
  });

  it("should return false when Cashflow is undefined", () => {
    const mockCashflow: CNCashflow = {
      Cashflow: undefined,
    };
    const result = cashflowStateFilter(mockCashflow);
    expect(result).toBe(false);
  });
});

describe("cashflowStageFilter", () => {
  it("should return Checker when userProfile is Verifier and Cashflow_Sub_State is PendingVerification", () => {
    const mockCashflow: CNCashflow = {
      Cashflow: {
        Cashflow_State: CashflowStateTypes.WAITING,
        Cashflow_Sub_State_Type: CashflowSubStateTypeTypes.PendingException,
        Cashflow_Sub_State: CashflowSubStateTypes.PendingVerification,
      },
    };
    const result = cashflowStageFilter(mockCashflow, Verifier);
    expect(result).toBe(BulkUserType.Checker);
  });

  it("should return Maker when userProfile is Submiter and Cashflow_Sub_State is PendingOperator", () => {
    const mockCashflow: CNCashflow = {
      Cashflow: {
        Cashflow_State: CashflowStateTypes.WAITING,
        Cashflow_Sub_State_Type: CashflowSubStateTypeTypes.PendingException,
        Cashflow_Sub_State: CashflowSubStateTypes.PendingOperator,
      },
    };
    const result = cashflowStageFilter(mockCashflow, Submiter);
    expect(result).toBe(BulkUserType.Maker);
  });

  it("should return empty string when Cashflow_State does not pass cashflowStateFilter", () => {
    const mockCashflow: CNCashflow = {
      Cashflow: {
        Cashflow_State: "READY",
        Cashflow_Sub_State_Type: CashflowSubStateTypeTypes.PendingException,
        Cashflow_Sub_State: CashflowSubStateTypes.PendingVerification,
      },
    };
    const result = cashflowStageFilter(mockCashflow, Verifier);
    expect(result).toBe("");
  });

  it("should return empty string when userProfile does not match any condition", () => {
    const mockCashflow: CNCashflow = {
      Cashflow: {
        Cashflow_State: CashflowStateTypes.WAITING,
        Cashflow_Sub_State_Type: CashflowSubStateTypeTypes.PendingException,
        Cashflow_Sub_State: "OtherState" as CashflowSubStateTypes,
      },
    };
    const result = cashflowStageFilter(mockCashflow, Verifier);
    expect(result).toBe("");
  });

  it("should return empty string when Cashflow is undefined", () => {
    const mockCashflow: CNCashflow = {
      Cashflow: undefined,
    };
    const result = cashflowStageFilter(mockCashflow, Verifier);
    expect(result).toBe("");
  });
});

describe("hasRebookExceptions", () => {
  it("should return true when there are high-risk exceptions that are rebook exceptions", () => {
    const mockExceptions: RatanException[] = [
      {
        Exception_Category: ExceptionCategory.HIGH_RISK_NSTP,
      },
    ];
    vi.spyOn(multiExceptionUtils, "isRebookException").mockReturnValue(true);
    const result = hasRebookExceptions(mockExceptions);
    expect(result).toBe(true);
  });

  it("should return false when there are no high-risk exceptions", () => {
    const mockExceptions: RatanException[] = [
      {
        Exception_Category: "OtherException",
      },
    ];
    const result = hasRebookExceptions(mockExceptions);
    expect(result).toBe(false);
  });

  it("should return false when high-risk exceptions are not rebook exceptions", () => {
    const mockExceptions: RatanException[] = [
      {
        Exception_Category: ExceptionCategory.HIGH_RISK_NSTP,
      },
    ];
    vi.spyOn(multiExceptionUtils, "isRebookException").mockReturnValue(false);
    const result = hasRebookExceptions(mockExceptions);
    expect(result).toBe(false);
  });

  it("should return false when exceptions array is empty", () => {
    const mockExceptions: RatanException[] = [];
    const result = hasRebookExceptions(mockExceptions);
    expect(result).toBe(false);
  });
});

describe("hasHighRiskExceptionsButNoPermission", () => {
  it("should return true when there are high-risk exceptions and no permission", () => {
    const mockExceptions: RatanException[] = [
      {
        Exception_Category: ExceptionCategory.HIGH_RISK_NSTP,
      },
    ];
    vi.spyOn(multiExceptionUtils, "isRebookException").mockReturnValue(true);
    vi.spyOn(multiExceptionUtils, "hasHighRiskExceptionPermission").mockReturnValue(false);
    const result = hasHighRiskExceptionsButNoPermission(mockExceptions);
    expect(result).toBe(true);
  });

  it("should return false when there are no high-risk exceptions", () => {
    const mockExceptions: RatanException[] = [
      {
        Exception_Category: "OtherException",
      },
    ];
    const result = hasHighRiskExceptionsButNoPermission(mockExceptions);
    expect(result).toBe(false);
  });

  it("should return false when there are high-risk exceptions but permission exists", () => {
    const mockExceptions: RatanException[] = [
      {
        Exception_Category: ExceptionCategory.HIGH_RISK_NSTP,
      },
    ];
    vi.spyOn(multiExceptionUtils, "isRebookException").mockReturnValue(true);
    vi.spyOn(multiExceptionUtils, "hasHighRiskExceptionPermission").mockReturnValue(true);
    const result = hasHighRiskExceptionsButNoPermission(mockExceptions);
    expect(result).toBe(false);
  });

  it("should return false when exceptions array is empty", () => {
    const mockExceptions: RatanException[] = [];
    const result = hasHighRiskExceptionsButNoPermission(mockExceptions);
    expect(result).toBe(false);
  });
});

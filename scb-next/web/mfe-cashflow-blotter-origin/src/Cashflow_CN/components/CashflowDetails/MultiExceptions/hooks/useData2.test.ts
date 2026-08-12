import { configureStore, createReducer } from "@reduxjs/toolkit";
import { ReduxProviderWrapper, renderHook } from "@Test/test-utils";
import cloneDeep from "lodash/cloneDeep";
import React from "react";
import { act } from "react-dom/test-utils";

import { ExceptionCategory } from "../common/interface";
import useData from "./useData";

const cashflowDetailsData = require("../data/cashflowDetails.json") as GraphqlCashflowDetails;

afterEach(() => {
  vi.clearAllMocks();
});

describe("initBackvalueData", () => {
  it("should set backvalueDefaultFormData when backvalue exception is CLOSED", () => {
    const mockCashflowDetails = cloneDeep(cashflowDetailsData) as GraphqlCashflowDetails;
    const backValueException = mockCashflowDetails.ratanException!.find(i => i.Exception_Category === "BACK_VALUE");
    backValueException!.Status = "CLOSED";
    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetails }), { wrapper }
    );
    act(() => {
      result.current.initBackvalueData({
        cashflowDetails: mockCashflowDetails,
        userRole: "Maker",
        cashflowSubState: "Pending Operator",
      });
    });

    expect(result.current.backvalueDefaultFormData).toEqual({
      swiftPaymentDate: "",
    });
  });

  it("should set backvalueDefaultFormData from Maker_Request_Body when user is Maker and exception is not CLOSED", () => {
    const mockCashflowDetails = cloneDeep(cashflowDetailsData) as GraphqlCashflowDetails;
    const backValueException = mockCashflowDetails.ratanException!.find(i => i.Exception_Category === "BACK_VALUE");
    backValueException!.Status = "PENDING_OPERATOR";
    backValueException!.Stashing = {
      Maker_Request_Body: JSON.stringify({ swiftPaymentDate: "2024-06-19" }),
      Maker_Id: "123456",
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetails }), { wrapper }
    ); act(() => {
      result.current.initBackvalueData({
        cashflowDetails: mockCashflowDetails,
        userRole: "Maker",
        cashflowSubState: "Pending Operator",
      });
    });

    expect(result.current.backvalueDefaultFormData).toEqual({
      swiftPaymentDate: "2024-06-19",
    });
  });

  it("should set backvalueDefaultFormData from Checker_Request_Body when user is Checker and exception is not CLOSED", () => {
    const mockCashflowDetails = cloneDeep(cashflowDetailsData) as GraphqlCashflowDetails;
    const backValueException = mockCashflowDetails.ratanException!.find(i => i.Exception_Category === "BACK_VALUE");
    backValueException!.Status = "PENDING_VERIFICATION";
    backValueException!.Stashing = {
      Checker_Request_Body: JSON.stringify({ swiftPaymentDate: "2024-06-20" }),
      Checker_Id: "123456",
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetails }), { wrapper }
    ); act(() => {
      result.current.initBackvalueData({
        cashflowDetails: mockCashflowDetails,
        userRole: "Checker",
        cashflowSubState: "Pending Verification",
      });
    });

    expect(result.current.backvalueDefaultFormData).toEqual({
      swiftPaymentDate: "2024-06-20"
    });
  });

  it("should set backvalueDefaultFormData from Checker_Request_Body when user is Checker but not previous round and exception is not CLOSED", () => {
    const mockCashflowDetails = cloneDeep(cashflowDetailsData) as GraphqlCashflowDetails;
    const backValueException = mockCashflowDetails.ratanException!.find(i => i.Exception_Category === "BACK_VALUE");
    backValueException!.Status = "PENDING_VERIFICATION";
    backValueException!.Stashing = {
      Checker_Request_Body: JSON.stringify({ swiftPaymentDate: "2024-06-20" }),
      Checker_Id: "another_user",
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetails }), { wrapper }
    ); act(() => {
      result.current.initBackvalueData({
        cashflowDetails: mockCashflowDetails,
        userRole: "Checker",
        cashflowSubState: "Pending Verification",
      });
    });

    expect(result.current.backvalueDefaultFormData).toEqual(null);
  });

  it("should not set backvalueDefaultFormData if exception is not Backvalue", () => {
    let mockCashflowDetails = cloneDeep(cashflowDetailsData) as GraphqlCashflowDetails;
    mockCashflowDetails = { ...mockCashflowDetails, ratanException: mockCashflowDetails.ratanException!.filter(i => i.Exception_Category !== "BACK_VALUE") };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetails }), { wrapper }
    ); act(() => {
      result.current.initBackvalueData({
        cashflowDetails: mockCashflowDetails,
        userRole: "Maker",
        cashflowSubState: "Pending Operator",
      });
    });

    expect(result.current.backvalueDefaultFormData).toBeNull();
  });

  it("should handle invalid Maker_Request_Body gracefully", () => {
    const mockCashflowDetails = cloneDeep(cashflowDetailsData) as GraphqlCashflowDetails;
    const backValueException = mockCashflowDetails.ratanException!.find(i => i.Exception_Category === "BACK_VALUE");
    backValueException!.Status = "PENDING_OPERATOR";
    backValueException!.Stashing = {
      Maker_Request_Body: "invalid_json",
      Maker_Id: "123456",
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetails }), { wrapper }
    );
    act(() => {
      result.current.initBackvalueData({
        cashflowDetails: mockCashflowDetails,
        userRole: "Maker",
        cashflowSubState: "Pending Operator",
      });
    });

    expect(result.current.backvalueDefaultFormData).toEqual({
      swiftPaymentDate: "",
    });
  });

  it("should handle no Stashing gracefully", () => {
    const mockCashflowDetails = cloneDeep(cashflowDetailsData) as GraphqlCashflowDetails;
    const backValueException = mockCashflowDetails.ratanException!.find(i => i.Exception_Category === "BACK_VALUE");
    backValueException!.Status = "PENDING_OPERATOR";
    backValueException!.Stashing = undefined;

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetails }), { wrapper }
    ); act(() => {
      result.current.initBackvalueData({
        cashflowDetails: mockCashflowDetails,
        userRole: "Maker",
        cashflowSubState: "Pending Operator",
      });
    });

    expect(result.current.backvalueDefaultFormData).toEqual(null);
  });
});

describe("hasHighRiskExceptionsButNoPermission", () => {
  it("should return false when there are no high-risk exceptions", () => {
    const tempCashflowDetailsData = cloneDeep(cashflowDetailsData);
    tempCashflowDetailsData.cashflow.Cashflow_Sub_State = "Pending Verification";
    tempCashflowDetailsData.ratanException = [
      {
        Exception_Code: "Non High Risk",
        Status: "PENDING_VERIFICATION",
      },
    ];
    vi.spyOn(require("../common/utils"), "hasHighRiskExceptionPermission").mockReturnValue(false);

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: tempCashflowDetailsData }), { wrapper }
    );

    expect(result.current.hasHighRiskExceptionsButNoPermission).toBe(false);
  });

  it("should return false when there are high-risk exceptions but permission exists", () => {
    const tempCashflowDetailsData = cloneDeep(cashflowDetailsData);
    tempCashflowDetailsData.cashflow.Cashflow_Sub_State = "Pending Verification";
    tempCashflowDetailsData.ratanException = [
      {
        Exception_Category: "HIGH_RISK_NSTP",
        Exception_Code: "High Risk NSTP",
        Status: "PENDING_VERIFICATION",
      },
    ];
    vi.spyOn(require("../common/utils"), "hasHighRiskExceptionPermission").mockReturnValue(true);

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: tempCashflowDetailsData }), { wrapper }
    );

    expect(result.current.hasHighRiskExceptionsButNoPermission).toBe(false);
  });

  it("should return false when there are high-risk exceptions but no permission", () => {
    const tempCashflowDetailsData = cloneDeep(cashflowDetailsData);
    tempCashflowDetailsData.cashflow.Cashflow_Sub_State = "Pending Verification";
    tempCashflowDetailsData.ratanException = [
      {
        Exception_Category: "HIGH_RISK_NSTP",
        Exception_Code: "High Risk NSTP",
        Status: "PENDING_VERIFICATION",
      },
    ];
    vi.spyOn(require("../common/utils"), "hasHighRiskExceptionPermission").mockReturnValue(false);

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: tempCashflowDetailsData }), { wrapper }
    );
    expect(result.current.hasHighRiskExceptionsButNoPermission).toBe(true);
  });

  it("should return false when there are no exceptions at all", () => {
    const tempCashflowDetailsData = cloneDeep(cashflowDetailsData);
    tempCashflowDetailsData.cashflow.Cashflow_Sub_State = "Pending Verification";
    tempCashflowDetailsData.ratanException = [];

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: tempCashflowDetailsData }), { wrapper }
    );

    expect(result.current.hasHighRiskExceptionsButNoPermission).toBe(false);
  });

  it("should handle undefined ratanException gracefully", () => {
    const tempCashflowDetailsData = cloneDeep(cashflowDetailsData);
    tempCashflowDetailsData.cashflow.Cashflow_Sub_State = "Pending Verification";
    delete tempCashflowDetailsData.ratanException;

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: tempCashflowDetailsData }), { wrapper }
    );

    expect(result.current.hasHighRiskExceptionsButNoPermission).toBe(false);
  });
});

describe("hasRebookExceptions", () => {
  it("should return true when there are high-risk NSTP exceptions with rebook flag", () => {
    const tempCashflowDetailsData = cloneDeep(cashflowDetailsData);
    tempCashflowDetailsData.cashflow.Cashflow_Sub_State = "Pending Verification";
    tempCashflowDetailsData.ratanException = [
      {
        Exception_Category: "HIGH_RISK_NSTP",
        Exception_Code: "High Risk NSTP",
        Status: "PENDING_VERIFICATION",
        Actions: [{ Action_Name: "Rebook" }],
      },
    ];

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: tempCashflowDetailsData }), { wrapper }
    );

    expect(result.current.hasRebookExceptions).toBe(false);
  });

  it("should return false when there are high-risk NSTP exceptions without rebook flag", () => {
    const tempCashflowDetailsData = cloneDeep(cashflowDetailsData);
    tempCashflowDetailsData.cashflow.Cashflow_Sub_State = "Pending Verification";
    tempCashflowDetailsData.ratanException = [
      {
        Exception_Category: "HIGH_RISK_NSTP",
        Exception_Code: "High Risk NSTP",
        Status: "PENDING_VERIFICATION",
        Actions: [{ Action_Name: "Approve" }],
      },
    ];

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: tempCashflowDetailsData }), { wrapper }
    );

    expect(result.current.hasRebookExceptions).toBe(false);
  });

  it("should return false when there are no high-risk NSTP exceptions", () => {
    const tempCashflowDetailsData = cloneDeep(cashflowDetailsData);
    tempCashflowDetailsData.cashflow.Cashflow_Sub_State = "Pending Verification";
    tempCashflowDetailsData.ratanException = [
      {
        Exception_Code: "Non High Risk",
        Status: "PENDING_VERIFICATION",
        Actions: [{ Action_Name: "Rebook" }],
      },
    ];

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: tempCashflowDetailsData }), { wrapper }
    );

    expect(result.current.hasRebookExceptions).toBe(false);
  });

  it("should return false when there are no exceptions at all", () => {
    const tempCashflowDetailsData = cloneDeep(cashflowDetailsData);
    tempCashflowDetailsData.cashflow.Cashflow_Sub_State = "Pending Verification";
    tempCashflowDetailsData.ratanException = [];

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: tempCashflowDetailsData }), { wrapper }
    );

    expect(result.current.hasRebookExceptions).toBe(false);
  });

  it("should handle undefined ratanException gracefully", () => {
    const tempCashflowDetailsData = cloneDeep(cashflowDetailsData);
    tempCashflowDetailsData.cashflow.Cashflow_Sub_State = "Pending Verification";
    delete tempCashflowDetailsData.ratanException;

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: tempCashflowDetailsData }), { wrapper }
    );

    expect(result.current.hasRebookExceptions).toBe(false);
  });
});
describe("useData - hasHardBlockerExceptions", () => {
  it("should return false when no HARD_BLOCKER exception", () => {

    const tempCashflowDetailsData = cloneDeep(cashflowDetailsData);
    tempCashflowDetailsData.ratanException = [
      {
        Exception_Category: ExceptionCategory.NSTP,
        Exception_Code: ExceptionCategory.NSTP,
        Status: "PENDING_VERIFICATION",
      },
    ];

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: tempCashflowDetailsData }), { wrapper }
    );

    expect(result.current.hasRebookExceptions).toBe(false);

  });

  it("should return true when there is HARD_BLOCKER exception", () => {
    const tempCashflowDetailsData = cloneDeep(cashflowDetailsData);
    tempCashflowDetailsData.ratanException = [
      {
        Exception_Category: ExceptionCategory.HARD_BLOCKER,
        Exception_Code: ExceptionCategory.HARD_BLOCKER,
        Status: "PENDING_VERIFICATION",
      },
    ];

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: tempCashflowDetailsData }), { wrapper }
    );

    expect(result.current.hasRebookExceptions).toBe(false);
  });
});
describe("handleSelectVostroRecord", () => {
  it("should correctly set the settlement method and vostro details when a valid record is provided", () => {
    const mockRecord = {
      vostro: {
        settlementMethod: "SWIFT",
        settlementAccount: "123456",
        settlementMeans: "Bank Transfer",
        entity: "",
        tradingCurrency: "",
      },
    };

    const mockRevertSSI = vi.fn().mockReturnValue(mockRecord);
    vi.spyOn(require("../common/utils"), "revertSSI").mockImplementation(mockRevertSSI);
    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: { ratanVostroCandidates: [] } as any }), { wrapper }
    );


    act(() => {
      result.current.handleSelectVostroRecord(mockRecord as any);
    });

    expect(result.current.settlementMethod).toBe("SWIFT");
    expect(result.current.vostroDetailsData).toEqual(mockRecord.vostro);
    expect(mockRevertSSI).toHaveBeenCalledWith(mockRecord);
  });

  it("should handle a record with missing settlementMethod gracefully", () => {
    const mockRecord = {
      vostro: {
        settlementMethod: undefined,
        settlementAccount: "123456",
        settlementMeans: "Bank Transfer",
        entity: "",
        tradingCurrency: "",
      },
    };

    const mockRevertSSI = vi.fn().mockReturnValue(mockRecord);
    vi.spyOn(require("../common/utils"), "revertSSI").mockImplementation(mockRevertSSI);


    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: { ratanVostroCandidates: [] } as any }), { wrapper }
    );

    act(() => {
      result.current.handleSelectVostroRecord(mockRecord as any);
    });

    expect(result.current.settlementMethod).toBeUndefined();
    expect(result.current.vostroDetailsData).toEqual(mockRecord.vostro);
    expect(mockRevertSSI).toHaveBeenCalledWith(mockRecord);
  });

  it("should handle an empty record gracefully", () => {
    const mockRecord = {};

    const mockRevertSSI = vi.fn().mockReturnValue({ vostro: {} });
    vi.spyOn(require("../common/utils"), "revertSSI").mockImplementation(mockRevertSSI);


    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: { ratanVostroCandidates: [] } as any }), { wrapper }
    );



    act(() => {
      result.current.handleSelectVostroRecord(mockRecord as any);
    });

    expect(result.current.settlementMethod).toBeUndefined();
    expect(result.current.vostroDetailsData).toEqual({
      entity: "",
      tradingCurrency: "",
    });
    expect(mockRevertSSI).toHaveBeenCalledWith(mockRecord);
  });

  it("should handle an exception thrown by revertSSI gracefully", () => {
    const mockRecord = { vostro: { settlementMethod: "SWIFT" } };

    const mockRevertSSI = vi.fn().mockImplementation(() => {
      throw new Error("Error in revertSSI");
    });
    vi.spyOn(require("../common/utils"), "revertSSI").mockImplementation(mockRevertSSI);

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: { ratanVostroCandidates: [] } as any }), { wrapper }
    );

    expect(() => {
      act(() => {
        result.current.handleSelectVostroRecord(mockRecord as any);
      });
    }).toThrow();
  });
});
describe("handleSelectNostroRecord", () => {
  it("should correctly set the nostro details when a valid record is provided", () => {
    const mockRecord = {
      nostro: {
        settlementAccount: "987654",
        settlementMeans: "Bank Transfer",
      },
    };

    const mockRevertSSI = vi.fn().mockReturnValue(mockRecord);
    vi.spyOn(require("../common/utils"), "revertSSI").mockImplementation(mockRevertSSI);


    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: { ratanVostroCandidates: [] } as any }), { wrapper }
    );


    act(() => {
      result.current.handleSelectNostroRecord(mockRecord as any);
    });

    expect(result.current.nostroDetailsData).toEqual(mockRecord.nostro);
    expect(mockRevertSSI).toHaveBeenCalledWith(mockRecord);
  });

  it("should handle a record with missing settlementAccount gracefully", () => {
    const mockRecord = {
      nostro: {
        settlementAccount: undefined,
        settlementMeans: "Bank Transfer",
      },
    };

    const mockRevertSSI = vi.fn().mockReturnValue(mockRecord);
    vi.spyOn(require("../common/utils"), "revertSSI").mockImplementation(mockRevertSSI);

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: { ratanVostroCandidates: [] } as any }), { wrapper }
    );

    act(() => {
      result.current.handleSelectNostroRecord(mockRecord as any);
    });

    expect(result.current.nostroDetailsData).toEqual(mockRecord.nostro);
    expect(mockRevertSSI).toHaveBeenCalledWith(mockRecord);
  });

  it("should handle an empty record gracefully", () => {
    const mockRecord = {};

    const mockRevertSSI = vi.fn().mockReturnValue({ nostro: {} });
    vi.spyOn(require("../common/utils"), "revertSSI").mockImplementation(mockRevertSSI);

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: { ratanVostroCandidates: [] } as any }), { wrapper }
    );

    act(() => {
      result.current.handleSelectNostroRecord(mockRecord as any);
    });

    expect(result.current.nostroDetailsData).toEqual({});
    expect(mockRevertSSI).toHaveBeenCalledWith(mockRecord);
  });

  it("should handle a null record gracefully", () => {
    const mockRevertSSI = vi.fn().mockReturnValue({ nostro: null });
    vi.spyOn(require("../common/utils"), "revertSSI").mockImplementation(mockRevertSSI);

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: { ratanVostroCandidates: [] } as any }), { wrapper }
    );

    act(() => {
      result.current.handleSelectNostroRecord(null as any);
    });

    expect(result.current.nostroDetailsData).toBeNull();
    expect(mockRevertSSI).toHaveBeenCalledWith(null);
  });

  it("should handle an exception thrown by revertSSI gracefully", () => {
    const mockRecord = { nostro: { settlementAccount: "987654" } };

    const mockRevertSSI = vi.fn().mockImplementation(() => {
      throw new Error("Error in revertSSI");
    });
    vi.spyOn(require("../common/utils"), "revertSSI").mockImplementation(mockRevertSSI);

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: { ratanVostroCandidates: [] } as any }), { wrapper }
    );

    expect(() => {
      act(() => {
        result.current.handleSelectNostroRecord(mockRecord as any);
      });
    }).toThrow();
  });
});

describe("hasAuthLimit", () => {
  it("should set isAuthLimit to true when cashflow sub-state is not Pending Verification", () => {
    const mockCashflowDetails = {
      cashflow: {
        Cashflow: {
          Cashflow_Sub_State: "READY",
        },
      },
    } as any;

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetails }), { wrapper }
    );
    act(() => {
      result.current.hasAuthLimit(mockCashflowDetails);
    });

    expect(result.current.isAuthLimit).toBe(true);
  });

  it("should set isAuthLimit to true when checkAuthLimit resolves successfully", async () => {
    const mockCashflowDetails = {
      cashflow: {
        Cashflow: {
          Cashflow_Sub_State: "Pending Verification",
          Payment_Currency: "USD",
          Payment_Amount: 1000,
        },
      },
    } as any;

    vi.spyOn(require("../../../../services/index"), "checkAuthLimit").mockResolvedValue({ success: true });

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetails }), { wrapper }
    );
    await act(async () => {
      result.current.hasAuthLimit(mockCashflowDetails);
    });

    expect(result.current.isAuthLimit).toBe(true);
  });

  it("should set isAuthLimit to false when checkAuthLimit resolves with success: false", async () => {
    const mockCashflowDetails = {
      cashflow: {
        Cashflow: {
          Cashflow_Sub_State: "Pending Verification",
          Payment_Currency: "USD",
          Payment_Amount: 1000,
        },
      },
    } as any;

    vi.spyOn(require("../../../../services/index"), "checkAuthLimit").mockResolvedValue({ success: false });

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetails }), { wrapper }
    );
    await act(async () => {
      result.current.hasAuthLimit(mockCashflowDetails);
    });

    expect(result.current.isAuthLimit).toBe(false);
  });

  it("should set isAuthLimit to true when checkAuthLimit throws an error", async () => {
    const mockCashflowDetails = {
      cashflow: {
        Cashflow: {
          Cashflow_Sub_State: "Pending Verification",
          Payment_Currency: "USD",
          Payment_Amount: 1000,
        },
      },
    } as any;

    vi.spyOn(require("../../../../services/index"), "checkAuthLimit").mockRejectedValue(new Error("Network error"));

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetails }), { wrapper }
    );
    await act(async () => {
      result.current.hasAuthLimit(mockCashflowDetails);
    });

    expect(result.current.isAuthLimit).toBe(true);
  });

  it("should handle missing Payment_Currency and Payment_Amount gracefully", async () => {
    const mockCashflowDetails = {
      cashflow: {
        Cashflow: {
          Cashflow_Sub_State: "Pending Verification",
        },
      },
    } as any;

    vi.spyOn(require("../../../../services/index"), "checkAuthLimit").mockResolvedValue({ success: true });

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetails }), { wrapper }
    );
    await act(async () => {
      result.current.hasAuthLimit(mockCashflowDetails);
    });

    expect(result.current.isAuthLimit).toBe(true);
  });

  it("should handle undefined cashflow gracefully", async () => {
    const mockCashflowDetails = {} as any;

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetails }), { wrapper }
    );
    await act(async () => {
      result.current.hasAuthLimit(mockCashflowDetails);
    });

    expect(result.current.isAuthLimit).toBe(true);
  });
});

describe("initAffirmationData", () => {
  const mockCashflowDetails = {
    ratanException: [],
    ratanAffirmation: null,
  } as any;

  const mockAffirmationException = {
    Exception_Code: "Pending Affirmation",
    Exception_Category: "AFFIRMATION",
    Exception_Type: "BUSINESS",
    Description: "",
    Status: "PENDING_VERIFICATION",
    Stashing: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should set affirmationDefaultFormData when affirmation exception is CLOSED", () => {
    const cashflowDetails = {
      ...mockCashflowDetails,
      ratanException: [{ ...mockAffirmationException, Status: "CLOSED" }],
      ratanAffirmation: { test: "affirmationData" },
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails }), { wrapper }
    );

    act(() => {
      result.current.initAffirmationData({
        cashflowDetails,
        userRole: "Checker",
        cashflowSubState: "Pending Verification",
        isSubmitByYou: false,
      });
    });

    expect(result.current.affirmationDefaultFormData).toEqual({ test: "affirmationData" });
  });

  it("should set affirmationDefaultFormData when affirmation exception is CLOSED and no ratanAffirmation", () => {
    const cashflowDetails = {
      ...mockCashflowDetails,
      ratanException: [{ ...mockAffirmationException, Status: "CLOSED" }],
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails }), { wrapper }
    );
    act(() => {
      result.current.initAffirmationData({
        cashflowDetails,
        userRole: "Checker",
        cashflowSubState: "Pending Verification",
        isSubmitByYou: false,
      });
    });

    expect(result.current.affirmationDefaultFormData).toEqual({});
  });

  it("should set affirmationDefaultFormData when no affirmation exception exists but ratanAffirmation is present", () => {
    const cashflowDetails = {
      ...mockCashflowDetails,
      ratanAffirmation: { test: "affirmationData" },
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails }), { wrapper }
    );

    act(() => {
      result.current.initAffirmationData({
        cashflowDetails,
        userRole: "Visitor",
        cashflowSubState: "Pending Verification",
        isSubmitByYou: false,
      });
    });

    expect(result.current.affirmationDefaultFormData).toEqual({ test: "affirmationData" });
  });

  it("should not set affirmationDefaultFormData when no affirmation exception exists and ratanAffirmation is null", () => {
    const cashflowDetails = {
      ...mockCashflowDetails,
      ratanAffirmation: null,
    };
    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails }), { wrapper }
    );

    act(() => {
      result.current.initAffirmationData({
        cashflowDetails,
        userRole: "Visitor",
        cashflowSubState: "Pending Verification",
        isSubmitByYou: false,
      });
    });

    expect(result.current.affirmationDefaultFormData).toBeNull();
  });

  it("should handle missing ratanException gracefully", () => {
    const cashflowDetails = {
      ...mockCashflowDetails,
      ratanException: undefined,
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails }), { wrapper }
    );

    act(() => {
      result.current.initAffirmationData({
        cashflowDetails,
        userRole: "Visitor",
        cashflowSubState: "Pending Verification",
        isSubmitByYou: false,
      });
    });

    expect(result.current.affirmationDefaultFormData).toBeNull();
  });

  it("should handle missing cashflowDetails gracefully", () => {
    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: {} as any }), { wrapper }
    );

    act(() => {
      result.current.initAffirmationData({
        cashflowDetails: {} as any,
        userRole: "Visitor",
        cashflowSubState: "Pending Verification",
        isSubmitByYou: false,
      });
    });

    expect(result.current.affirmationDefaultFormData).toBeNull();
  });

  it("should set affirmationDefaultFormData when user is maker", () => {
    const cashflowDetails = {
      ...mockCashflowDetails,
      ratanException: [{ ...mockAffirmationException, Status: "PENDING_OPERATOR" }],
      ratanAffirmation: { test: "affirmationData" },
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails }), { wrapper }
    );

    act(() => {
      result.current.initAffirmationData({
        cashflowDetails,
        userRole: "Maker",
        cashflowSubState: "Pending Operator",
        isSubmitByYou: true,
      });
    });

    expect(result.current.affirmationDefaultFormData).toEqual({ "Affirmed_At": undefined, "Affirmed_By": undefined, "Phone_Email": undefined });
  });

  it("should set affirmationDefaultFormData when user is checker", () => {
    const cashflowDetails = {
      ...mockCashflowDetails,
      ratanException: [{ ...mockAffirmationException, Status: "PENDING_VERIFICATION" }],
      ratanAffirmation: { test: "affirmationData" },
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails }), { wrapper }
    );

    act(() => {
      result.current.initAffirmationData({
        cashflowDetails,
        userRole: "Checker",
        cashflowSubState: "Pending Verification",
        isSubmitByYou: false,
      });
    });

    expect(result.current.affirmationDefaultFormData).toEqual({ "Affirmed_At": undefined, "Affirmed_By": undefined, "Phone_Email": undefined });
  });
});

describe("initSIData", () => {
  const mockCashflowDetails = {
    cashflow: {
      Settlement_Instruction: {
        Settlement_Method: "SWIFT",
      },
    },
    ratanException: [],
    ratanVostroCandidates: [],
    ratanNostroCandidates: [],
  } as any;

  const mockStampedVostro = {
    settlementAccount: "123456",
    settlementMeans: "Bank Transfer",
    ssiType: "",
    swiftType: "",
    tradingCurrency: "",
    entity: "",
  };

  const mockStampedNostro = {
    settlementAccount: "654321",
    settlementMeans: "Wire Transfer",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(require("../common/utils"), "revertSSI").mockReturnValue({
      vostro: mockStampedVostro,
      nostro: mockStampedNostro,
    });
  });

  it("should set settlement method to the default when Settlement_Method is undefined", () => {
    const cashflowDetails = {
      ...mockCashflowDetails,
      cashflow: {
        Settlement_Instruction: {},
      },
      ratanException: [
        {
          Exception_Code: "Missing Nostro",
          Exception_Category: "SSI",
          Exception_Type: "BUSINESS",
          Description: "MULTI_VOSTRO_ERROR",
          Status: "PENDING_OPERATOR",
          Stashing: {
            Maker_Request_Body: JSON.stringify({
              vostro: mockStampedVostro,
              nostro: mockStampedNostro,
            }),
            Maker_Id: "123456",
          },
        },
      ],
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails }), { wrapper }
    );

    act(() => {
      result.current.initSIData({
        cashflowDetails,
        userRole: "Visitor",
        cashflowSubState: "Pending Operator",
      });
    });

    expect(result.current.settlementMethod).toBe("CASH");
  });

  it("should set settlement method from Settlement_Instruction", () => {
    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetails }), { wrapper }
    );

    act(() => {
      result.current.initSIData({
        cashflowDetails: mockCashflowDetails,
        userRole: "Visitor",
        cashflowSubState: "Pending Verification",
      });
    });

    expect(result.current.settlementMethod).toBe("SWIFT");
  });

  it("should set stamped vostro and nostro details when no vostro exception exists", () => {
    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetails }), { wrapper }
    );
    act(() => {
      result.current.initSIData({
        cashflowDetails: mockCashflowDetails,
        userRole: "Visitor",
        cashflowSubState: "Pending Verification",
      });
    });

    expect(result.current.vostroDetailsData).toEqual(mockStampedVostro);
    expect(result.current.nostroDetailsData).toEqual(mockStampedNostro);
  });

  it("should handle missing vostro exception gracefully", () => {
    const cashflowDetails = {
      ...mockCashflowDetails,
      ratanException: undefined,
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails }), { wrapper }
    );

    act(() => {
      result.current.initSIData({
        cashflowDetails,
        userRole: "Visitor",
        cashflowSubState: "Pending Verification",
      });
    });

    expect(result.current.vostroDetailsData).toEqual(mockStampedVostro);
    expect(result.current.nostroDetailsData).toEqual(mockStampedNostro);
  });

  it("should handle missing Settlement_Instruction gracefully", () => {
    const cashflowDetails = {
      ...mockCashflowDetails,
      cashflow: {},
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails }), { wrapper }
    );

    act(() => {
      result.current.initSIData({
        cashflowDetails,
        userRole: "Visitor",
        cashflowSubState: "Pending Verification",
      });
    });

    expect(result.current.settlementMethod).toBe("CASH");
    expect(result.current.vostroDetailsData).toEqual(mockStampedVostro);
    expect(result.current.nostroDetailsData).toEqual(mockStampedNostro);
  });

  it("should handle missing cashflow gracefully", () => {
    const cashflowDetails = {} as any;

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails }), { wrapper }
    );

    act(() => {
      result.current.initSIData({
        cashflowDetails,
        userRole: "Visitor",
        cashflowSubState: "Pending Verification",
      });
    });

    expect(result.current.settlementMethod).toBe("CASH");
    expect(result.current.vostroDetailsData).toEqual(mockStampedVostro);
    expect(result.current.nostroDetailsData).toBe(mockStampedNostro);
  });

  it("should handle mismatched exceptions for Maker role", () => {
    const cashflowDetails = {
      ...mockCashflowDetails,
      ratanException: [
        {
          Exception_Code: "Missing Nostro",
          Exception_Category: "SSI",
          Exception_Type: "BUSINESS",
          Description: "MULTI_VOSTRO_ERROR",
          Status: "PENDING_OPERATOR",
          Stashing: {
            Maker_Request_Body: JSON.stringify({
              vostro: mockStampedVostro,
              nostro: mockStampedNostro,
            }),
            Maker_Id: "123456",
          },
        },
      ],
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails }), { wrapper }
    );

    act(() => {
      result.current.initSIData({
        cashflowDetails,
        userRole: "Maker",
        cashflowSubState: "Pending Operator",
      });
    });

    expect(result.current.vostroDetailsData).toEqual(mockStampedVostro);
    expect(result.current.nostroDetailsData).toEqual(mockStampedNostro);
  });

  it("should handle mismatched exceptions for Checker role", () => {
    const cashflowDetails = {
      ...mockCashflowDetails,
      ratanException: [
        {
          Exception_Code: "SI Mismatch",
          Exception_Category: "SSI",
          Exception_Type: "BUSINESS",
          Description: "",
          Status: "PENDING_VERIFICATION",
          Stashing: {
            Maker_Request_Body: JSON.stringify({
              vostro: mockStampedVostro,
              nostro: mockStampedNostro,
            }),
            Checker_Id: "123456",
            Checker_Request_Body: "{\"Remittance_Information_4\":\"704\",\"Nostro_Swift_Message_Type\":\"N\",\"Account\":{\"SCB_Nostro_Account_Number\":\"USD MAIN\",\"SCB_Nostro_Account_Type\":\"NOS\",\"EBBS_Account_Number\":\"\",\"EBBS_Bridge_Account_Number\":\"\",\"Booking_Entity_Correspondent_BIC_code\":\"SCBLUS33XXX\",\"Booking_Entity_Correspondent_Account_Name\":\"STANCHART NY\",\"Booking_Entity_Correspondent_Street_Address\":\"1095 AVENUE OF THE AMERICAS 10036\",\"Booking_Entity_Correspondent_City\":\"NEW YORK\",\"Booking_Entity_Correspondent_Account_Number\":\"\",\"Beneficiary_Account_Name\":\"HSBC BANK CHINA COMPANY LIMITED\",\"Beneficiary_Account_Name_2\":\"FRHSBC SHANGHAI\",\"Beneficiary_Account_Number\":\"58123456789\",\"Beneficiary_BIC_code\":\"58123456\",\"Beneficiary_Bank_Account_Name\":\"57test value\",\"Beneficiary_Bank_Account_Number\":\"57123456789\",\"Beneficiary_Bank_BIC_code\":\"57123456\",\"Beneficiary_Bank_City\":\"57city\",\"Beneficiary_Bank_Street_Address\":\"57adress\",\"Beneficiary_City\":\"SHA\",\"Beneficiary_Correspondent_Account_Name\":\"54test value\",\"Beneficiary_Correspondent_Account_Number\":\"54123456789\",\"Beneficiary_Correspondent_BIC_code\":\"12345678\",\"Beneficiary_Correspondent_City\":\"54city\",\"Beneficiary_Correspondent_Street_Address\":\"54adress\",\"Beneficiary_Street_Address\":\"5F MARINE TOWER\",\"Counterparty_CMS_Account_Number\":\"54cms\",\"Intermediary_Account_Name\":\"56test value\",\"Intermediary_Account_Number\":\"56123456789\",\"Intermediary_BIC_code\":\"56123456\",\"Intermediary_City\":\"56city\",\"Intermediary_Street_Address\":\"56adress\",\"Ordering_Customer_Account_Name\":\"50test value\",\"Ordering_Customer_Account_Number\":\"50123456789\",\"Ordering_Customer_BIC_Code\":\"50123456\",\"Ordering_Customer_City\":\"50 city\",\"Ordering_Customer_Street_Address\":\"50 address\"},\"Swift_Payment_Method\":\"Y\",\"SCB_Entity_SCI_FMID\":\"\",\"SSI_Id\":\"\",\"Swift_Message_Type\":\"MT103\",\"Sender_To_Receiver_Information_4\":\"724\",\"CFI_Code\":\"\",\"Sender_To_Receiver_Information_3\":\"723\",\"Sender_To_Receiver_Information_2\":\"722\",\"SSI_Source\":null,\"Sender_To_Receiver_Information_1\":\"721\",\"SSI_Priority\":\"Primary\",\"Payment_Currency\":\"\",\"Sender_To_Receiver_Information_6\":\"726\",\"Counterparty_SCI_FMID\":\"\",\"Sender_To_Receiver_Information_5\":\"725\",\"Charge_Bearer\":\"OUR\",\"SSI_Unique_Id\":\"\",\"Is_Third_Party_Payment\":\"Y\",\"Remittance_Information_1\":\"701\",\"Remittance_Information_2\":\"702\",\"Remittance_Information_3\":\"703\"}",
          },
        },
      ],
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails }), { wrapper }
    );

    act(() => {
      result.current.initSIData({
        cashflowDetails,
        userRole: "Checker",
        cashflowSubState: "Pending Verification",
      });
    });

    expect(result.current.vostroDetailsData).toEqual(mockStampedVostro);
    expect(result.current.nostroDetailsData).toEqual(mockStampedNostro);
  });

  it("should handle mismatched exceptions for Checker role who submited", () => {
    const cashflowDetails = {
      ...mockCashflowDetails,
      ratanException: [
        {
          Exception_Code: "SI Mismatch",
          Exception_Category: "SSI",
          Exception_Type: "BUSINESS",
          Description: "",
          Status: "PENDING_VERIFICATION",
          Stashing: {
            Maker_Id: "123456",
            Maker_Request_Body: JSON.stringify({
              vostro: mockStampedVostro,
              nostro: mockStampedNostro,
            }),
            Checker_Id: "",
            Checker_Request_Body: "{\"Remittance_Information_4\":\"704\",\"Nostro_Swift_Message_Type\":\"N\",\"Account\":{\"SCB_Nostro_Account_Number\":\"USD MAIN\",\"SCB_Nostro_Account_Type\":\"NOS\",\"EBBS_Account_Number\":\"\",\"EBBS_Bridge_Account_Number\":\"\",\"Booking_Entity_Correspondent_BIC_code\":\"SCBLUS33XXX\",\"Booking_Entity_Correspondent_Account_Name\":\"STANCHART NY\",\"Booking_Entity_Correspondent_Street_Address\":\"1095 AVENUE OF THE AMERICAS 10036\",\"Booking_Entity_Correspondent_City\":\"NEW YORK\",\"Booking_Entity_Correspondent_Account_Number\":\"\",\"Beneficiary_Account_Name\":\"HSBC BANK CHINA COMPANY LIMITED\",\"Beneficiary_Account_Name_2\":\"FRHSBC SHANGHAI\",\"Beneficiary_Account_Number\":\"58123456789\",\"Beneficiary_BIC_code\":\"58123456\",\"Beneficiary_Bank_Account_Name\":\"57test value\",\"Beneficiary_Bank_Account_Number\":\"57123456789\",\"Beneficiary_Bank_BIC_code\":\"57123456\",\"Beneficiary_Bank_City\":\"57city\",\"Beneficiary_Bank_Street_Address\":\"57adress\",\"Beneficiary_City\":\"SHA\",\"Beneficiary_Correspondent_Account_Name\":\"54test value\",\"Beneficiary_Correspondent_Account_Number\":\"54123456789\",\"Beneficiary_Correspondent_BIC_code\":\"12345678\",\"Beneficiary_Correspondent_City\":\"54city\",\"Beneficiary_Correspondent_Street_Address\":\"54adress\",\"Beneficiary_Street_Address\":\"5F MARINE TOWER\",\"Counterparty_CMS_Account_Number\":\"54cms\",\"Intermediary_Account_Name\":\"56test value\",\"Intermediary_Account_Number\":\"56123456789\",\"Intermediary_BIC_code\":\"56123456\",\"Intermediary_City\":\"56city\",\"Intermediary_Street_Address\":\"56adress\",\"Ordering_Customer_Account_Name\":\"50test value\",\"Ordering_Customer_Account_Number\":\"50123456789\",\"Ordering_Customer_BIC_Code\":\"50123456\",\"Ordering_Customer_City\":\"50 city\",\"Ordering_Customer_Street_Address\":\"50 address\"},\"Swift_Payment_Method\":\"Y\",\"SCB_Entity_SCI_FMID\":\"\",\"SSI_Id\":\"\",\"Swift_Message_Type\":\"MT103\",\"Sender_To_Receiver_Information_4\":\"724\",\"CFI_Code\":\"\",\"Sender_To_Receiver_Information_3\":\"723\",\"Sender_To_Receiver_Information_2\":\"722\",\"SSI_Source\":null,\"Sender_To_Receiver_Information_1\":\"721\",\"SSI_Priority\":\"Primary\",\"Payment_Currency\":\"\",\"Sender_To_Receiver_Information_6\":\"726\",\"Counterparty_SCI_FMID\":\"\",\"Sender_To_Receiver_Information_5\":\"725\",\"Charge_Bearer\":\"OUR\",\"SSI_Unique_Id\":\"\",\"Is_Third_Party_Payment\":\"Y\",\"Remittance_Information_1\":\"701\",\"Remittance_Information_2\":\"702\",\"Remittance_Information_3\":\"703\"}",
          },
        },
      ],
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails }), { wrapper }
    );

    act(() => {
      result.current.initSIData({
        cashflowDetails,
        userRole: "Checker",
        cashflowSubState: "Pending Verification",
      });
    });

    expect(result.current.vostroDetailsData).toEqual(mockStampedVostro);
    expect(result.current.nostroDetailsData).toEqual(mockStampedNostro);
  });

  it("should handle missing Maker_Request_Body gracefully", () => {
    const cashflowDetails = {
      ...mockCashflowDetails,
      ratanException: [
        {
          Exception_Code: "SI Mismatch",
          Exception_Category: "SSI",
          Exception_Type: "BUSINESS",
          Description: "",
          Status: "PENDING_VERIFICATION",
          Stashing: {},
        },
      ],
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails }), { wrapper }
    );

    act(() => {
      result.current.initSIData({
        cashflowDetails,
        userRole: "Checker",
        cashflowSubState: "Pending Verification",
      });
    });

    expect(result.current.vostroDetailsData).toEqual(mockStampedVostro);
    expect(result.current.nostroDetailsData).toEqual(mockStampedNostro);
  });

  it.skip("should handle invalid Maker_Request_Body gracefully", () => {
    const cashflowDetails = {
      ...mockCashflowDetails,
      ratanException: [
        {
          Exception_Code: "SI Mismatch",
          Exception_Category: "SSI",
          Exception_Type: "BUSINESS",
          Description: "",
          Status: "PENDING_VERIFICATION",
          Stashing: {
            Maker_Request_Body: "invalid_json",
          },
        },
      ],
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails }), { wrapper }
    );

    act(() => {
      result.current.initSIData({
        cashflowDetails,
        userRole: "Checker",
        cashflowSubState: "Pending Verification",
      });
    });

    expect(result.current.vostroDetailsData).toEqual(mockStampedVostro);
    expect(result.current.nostroDetailsData).toEqual(mockStampedNostro);
  });

  it("should handle missing Stash gracefully", () => {
    const cashflowDetails = {
      ...mockCashflowDetails,
      ratanException: [
        {
          Exception_Code: "SI Mismatch",
          Exception_Category: "SSI",
          Exception_Type: "BUSINESS",
          Description: "",
          Status: "PENDING_OPERATOR",
        },
      ],
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails }), { wrapper }
    );

    act(() => {
      result.current.initSIData({
        cashflowDetails,
        userRole: "Checker",
        cashflowSubState: "Pending Operator",
      });
    });

    expect(result.current.vostroDetailsData).toEqual(mockStampedVostro);
    expect(result.current.nostroDetailsData).toEqual(mockStampedNostro);
  });

  it("should handle mismatched exceptions for visitor role", () => {
    vi.spyOn(require("../common/utils"), "getUserProfile").mockReturnValue("NonePermission");
    const cashflowDetails = {
      ...mockCashflowDetails,
      ratanException: [
        {
          Exception_Code: "SI Mismatch",
          Exception_Category: "SSI",
          Exception_Type: "BUSINESS",
          Description: "",
          Status: "PENDING_VERIFICATION",
          Stashing: {
            Maker_Id: "123456",
            Maker_Request_Body: JSON.stringify({
              vostro: mockStampedVostro,
              nostro: mockStampedNostro,
            }),
            Checker_Id: "",
            Checker_Request_Body: "{\"Remittance_Information_4\":\"704\",\"Nostro_Swift_Message_Type\":\"N\",\"Account\":{\"SCB_Nostro_Account_Number\":\"USD MAIN\",\"SCB_Nostro_Account_Type\":\"NOS\",\"EBBS_Account_Number\":\"\",\"EBBS_Bridge_Account_Number\":\"\",\"Booking_Entity_Correspondent_BIC_code\":\"SCBLUS33XXX\",\"Booking_Entity_Correspondent_Account_Name\":\"STANCHART NY\",\"Booking_Entity_Correspondent_Street_Address\":\"1095 AVENUE OF THE AMERICAS 10036\",\"Booking_Entity_Correspondent_City\":\"NEW YORK\",\"Booking_Entity_Correspondent_Account_Number\":\"\",\"Beneficiary_Account_Name\":\"HSBC BANK CHINA COMPANY LIMITED\",\"Beneficiary_Account_Name_2\":\"FRHSBC SHANGHAI\",\"Beneficiary_Account_Number\":\"58123456789\",\"Beneficiary_BIC_code\":\"58123456\",\"Beneficiary_Bank_Account_Name\":\"57test value\",\"Beneficiary_Bank_Account_Number\":\"57123456789\",\"Beneficiary_Bank_BIC_code\":\"57123456\",\"Beneficiary_Bank_City\":\"57city\",\"Beneficiary_Bank_Street_Address\":\"57adress\",\"Beneficiary_City\":\"SHA\",\"Beneficiary_Correspondent_Account_Name\":\"54test value\",\"Beneficiary_Correspondent_Account_Number\":\"54123456789\",\"Beneficiary_Correspondent_BIC_code\":\"12345678\",\"Beneficiary_Correspondent_City\":\"54city\",\"Beneficiary_Correspondent_Street_Address\":\"54adress\",\"Beneficiary_Street_Address\":\"5F MARINE TOWER\",\"Counterparty_CMS_Account_Number\":\"54cms\",\"Intermediary_Account_Name\":\"56test value\",\"Intermediary_Account_Number\":\"56123456789\",\"Intermediary_BIC_code\":\"56123456\",\"Intermediary_City\":\"56city\",\"Intermediary_Street_Address\":\"56adress\",\"Ordering_Customer_Account_Name\":\"50test value\",\"Ordering_Customer_Account_Number\":\"50123456789\",\"Ordering_Customer_BIC_Code\":\"50123456\",\"Ordering_Customer_City\":\"50 city\",\"Ordering_Customer_Street_Address\":\"50 address\"},\"Swift_Payment_Method\":\"Y\",\"SCB_Entity_SCI_FMID\":\"\",\"SSI_Id\":\"\",\"Swift_Message_Type\":\"MT103\",\"Sender_To_Receiver_Information_4\":\"724\",\"CFI_Code\":\"\",\"Sender_To_Receiver_Information_3\":\"723\",\"Sender_To_Receiver_Information_2\":\"722\",\"SSI_Source\":null,\"Sender_To_Receiver_Information_1\":\"721\",\"SSI_Priority\":\"Primary\",\"Payment_Currency\":\"\",\"Sender_To_Receiver_Information_6\":\"726\",\"Counterparty_SCI_FMID\":\"\",\"Sender_To_Receiver_Information_5\":\"725\",\"Charge_Bearer\":\"OUR\",\"SSI_Unique_Id\":\"\",\"Is_Third_Party_Payment\":\"Y\",\"Remittance_Information_1\":\"701\",\"Remittance_Information_2\":\"702\",\"Remittance_Information_3\":\"703\"}",
          },
        },
      ],
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails }), { wrapper }
    );

    act(() => {
      result.current.initSIData({
        cashflowDetails,
        userRole: "Visitor",
        cashflowSubState: "Pending Verification",
      });
    });

    expect(result.current.vostroDetailsData).toEqual(mockStampedVostro);
    expect(result.current.nostroDetailsData).toEqual(mockStampedNostro);
  });

  it("should handle missing vostro exceptions for visitor role", () => {
    vi.spyOn(require("../common/utils"), "getUserProfile").mockReturnValue("NonePermission");
    const cashflowDetails = {
      ...mockCashflowDetails,
      ratanException: [
        {
          Exception_Code: "Missing Vostro",
          Exception_Category: "SSI",
          Exception_Type: "BUSINESS",
          Description: "",
          Status: "PENDING_VERIFICATION",
          Stashing: {
            Maker_Id: "123456",
            Maker_Request_Body: JSON.stringify({
              vostro: mockStampedVostro,
              nostro: mockStampedNostro,
            }),
            Checker_Id: "",
            Checker_Request_Body: "{\"Remittance_Information_4\":\"704\",\"Nostro_Swift_Message_Type\":\"N\",\"Account\":{\"SCB_Nostro_Account_Number\":\"USD MAIN\",\"SCB_Nostro_Account_Type\":\"NOS\",\"EBBS_Account_Number\":\"\",\"EBBS_Bridge_Account_Number\":\"\",\"Booking_Entity_Correspondent_BIC_code\":\"SCBLUS33XXX\",\"Booking_Entity_Correspondent_Account_Name\":\"STANCHART NY\",\"Booking_Entity_Correspondent_Street_Address\":\"1095 AVENUE OF THE AMERICAS 10036\",\"Booking_Entity_Correspondent_City\":\"NEW YORK\",\"Booking_Entity_Correspondent_Account_Number\":\"\",\"Beneficiary_Account_Name\":\"HSBC BANK CHINA COMPANY LIMITED\",\"Beneficiary_Account_Name_2\":\"FRHSBC SHANGHAI\",\"Beneficiary_Account_Number\":\"58123456789\",\"Beneficiary_BIC_code\":\"58123456\",\"Beneficiary_Bank_Account_Name\":\"57test value\",\"Beneficiary_Bank_Account_Number\":\"57123456789\",\"Beneficiary_Bank_BIC_code\":\"57123456\",\"Beneficiary_Bank_City\":\"57city\",\"Beneficiary_Bank_Street_Address\":\"57adress\",\"Beneficiary_City\":\"SHA\",\"Beneficiary_Correspondent_Account_Name\":\"54test value\",\"Beneficiary_Correspondent_Account_Number\":\"54123456789\",\"Beneficiary_Correspondent_BIC_code\":\"12345678\",\"Beneficiary_Correspondent_City\":\"54city\",\"Beneficiary_Correspondent_Street_Address\":\"54adress\",\"Beneficiary_Street_Address\":\"5F MARINE TOWER\",\"Counterparty_CMS_Account_Number\":\"54cms\",\"Intermediary_Account_Name\":\"56test value\",\"Intermediary_Account_Number\":\"56123456789\",\"Intermediary_BIC_code\":\"56123456\",\"Intermediary_City\":\"56city\",\"Intermediary_Street_Address\":\"56adress\",\"Ordering_Customer_Account_Name\":\"50test value\",\"Ordering_Customer_Account_Number\":\"50123456789\",\"Ordering_Customer_BIC_Code\":\"50123456\",\"Ordering_Customer_City\":\"50 city\",\"Ordering_Customer_Street_Address\":\"50 address\"},\"Swift_Payment_Method\":\"Y\",\"SCB_Entity_SCI_FMID\":\"\",\"SSI_Id\":\"\",\"Swift_Message_Type\":\"MT103\",\"Sender_To_Receiver_Information_4\":\"724\",\"CFI_Code\":\"\",\"Sender_To_Receiver_Information_3\":\"723\",\"Sender_To_Receiver_Information_2\":\"722\",\"SSI_Source\":null,\"Sender_To_Receiver_Information_1\":\"721\",\"SSI_Priority\":\"Primary\",\"Payment_Currency\":\"\",\"Sender_To_Receiver_Information_6\":\"726\",\"Counterparty_SCI_FMID\":\"\",\"Sender_To_Receiver_Information_5\":\"725\",\"Charge_Bearer\":\"OUR\",\"SSI_Unique_Id\":\"\",\"Is_Third_Party_Payment\":\"Y\",\"Remittance_Information_1\":\"701\",\"Remittance_Information_2\":\"702\",\"Remittance_Information_3\":\"703\"}",
          },
        },
      ],
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails }), { wrapper }
    );

    act(() => {
      result.current.initSIData({
        cashflowDetails,
        userRole: "Visitor",
        cashflowSubState: "Pending Verification",
      });
    });

    expect(result.current.vostroDetailsData).toEqual({ "accountWithInstitutionAddress": undefined, "accountWithInstitutionCity": undefined, "beneficiaryAddress": undefined, "beneficiaryCity": undefined, "entity": "", "intermediaryAddress": undefined, "intermediaryPostcode": undefined, "orderCustomerAddress": undefined, "orderCustomerCity": undefined, "popDubai": undefined, "receiversCorrespondentAddress": undefined, "receiversCorrespondentCity": undefined, "remittanceInformation1": undefined, "remittanceInformation2": undefined, "remittanceInformation3": undefined, "remittanceInformation4": undefined, "senderToReceiver1": undefined, "senderToReceiver2": undefined, "senderToReceiver3": undefined, "senderToReceiver4": undefined, "senderToReceiver5": undefined, "senderToReceiver6": undefined, "settlementAccount": "", "settlementMeans": "", "ssiType": "", "swiftType": "", "tradingCurrency": "" });
    expect(result.current.nostroDetailsData).toEqual({ settlementAccount: "654321", settlementMeans: "Wire Transfer" });
  });

  it("should handle other exceptions for visitor role", () => {
    vi.spyOn(require("../common/utils"), "getUserProfile").mockReturnValue("NonePermission");
    const cashflowDetails = {
      ...mockCashflowDetails,
      ratanException: [
        {
          Exception_Code: "Missing Nostro",
          Exception_Category: "SSI",
          Exception_Type: "BUSINESS",
          Description: "",
          Status: "PENDING_VERIFICATION",
          Stashing: {
            Maker_Id: "123456",
            Maker_Request_Body: JSON.stringify({
              vostro: mockStampedVostro,
              nostro: mockStampedNostro,
            }),
            Checker_Id: "",
            Checker_Request_Body: "{\"Remittance_Information_4\":\"704\",\"Nostro_Swift_Message_Type\":\"N\",\"Account\":{\"SCB_Nostro_Account_Number\":\"USD MAIN\",\"SCB_Nostro_Account_Type\":\"NOS\",\"EBBS_Account_Number\":\"\",\"EBBS_Bridge_Account_Number\":\"\",\"Booking_Entity_Correspondent_BIC_code\":\"SCBLUS33XXX\",\"Booking_Entity_Correspondent_Account_Name\":\"STANCHART NY\",\"Booking_Entity_Correspondent_Street_Address\":\"1095 AVENUE OF THE AMERICAS 10036\",\"Booking_Entity_Correspondent_City\":\"NEW YORK\",\"Booking_Entity_Correspondent_Account_Number\":\"\",\"Beneficiary_Account_Name\":\"HSBC BANK CHINA COMPANY LIMITED\",\"Beneficiary_Account_Name_2\":\"FRHSBC SHANGHAI\",\"Beneficiary_Account_Number\":\"58123456789\",\"Beneficiary_BIC_code\":\"58123456\",\"Beneficiary_Bank_Account_Name\":\"57test value\",\"Beneficiary_Bank_Account_Number\":\"57123456789\",\"Beneficiary_Bank_BIC_code\":\"57123456\",\"Beneficiary_Bank_City\":\"57city\",\"Beneficiary_Bank_Street_Address\":\"57adress\",\"Beneficiary_City\":\"SHA\",\"Beneficiary_Correspondent_Account_Name\":\"54test value\",\"Beneficiary_Correspondent_Account_Number\":\"54123456789\",\"Beneficiary_Correspondent_BIC_code\":\"12345678\",\"Beneficiary_Correspondent_City\":\"54city\",\"Beneficiary_Correspondent_Street_Address\":\"54adress\",\"Beneficiary_Street_Address\":\"5F MARINE TOWER\",\"Counterparty_CMS_Account_Number\":\"54cms\",\"Intermediary_Account_Name\":\"56test value\",\"Intermediary_Account_Number\":\"56123456789\",\"Intermediary_BIC_code\":\"56123456\",\"Intermediary_City\":\"56city\",\"Intermediary_Street_Address\":\"56adress\",\"Ordering_Customer_Account_Name\":\"50test value\",\"Ordering_Customer_Account_Number\":\"50123456789\",\"Ordering_Customer_BIC_Code\":\"50123456\",\"Ordering_Customer_City\":\"50 city\",\"Ordering_Customer_Street_Address\":\"50 address\"},\"Swift_Payment_Method\":\"Y\",\"SCB_Entity_SCI_FMID\":\"\",\"SSI_Id\":\"\",\"Swift_Message_Type\":\"MT103\",\"Sender_To_Receiver_Information_4\":\"724\",\"CFI_Code\":\"\",\"Sender_To_Receiver_Information_3\":\"723\",\"Sender_To_Receiver_Information_2\":\"722\",\"SSI_Source\":null,\"Sender_To_Receiver_Information_1\":\"721\",\"SSI_Priority\":\"Primary\",\"Payment_Currency\":\"\",\"Sender_To_Receiver_Information_6\":\"726\",\"Counterparty_SCI_FMID\":\"\",\"Sender_To_Receiver_Information_5\":\"725\",\"Charge_Bearer\":\"OUR\",\"SSI_Unique_Id\":\"\",\"Is_Third_Party_Payment\":\"Y\",\"Remittance_Information_1\":\"701\",\"Remittance_Information_2\":\"702\",\"Remittance_Information_3\":\"703\"}",
          },
        },
      ],
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useData({ cashflowDetails }), { wrapper }
    );



    act(() => {
      result.current.initSIData({
        cashflowDetails,
        userRole: "Visitor",
        cashflowSubState: "Pending Verification",
      });
    });

    expect(result.current.vostroDetailsData).toEqual(mockStampedVostro);
    expect(result.current.nostroDetailsData).toEqual(mockStampedNostro);
  });
});

describe("initHistoryAndSICandidatesData", () => {
  let mockSetActionHistoryListData: vi.SpyInstance;
  let mockSetVostroListData: vi.SpyInstance;
  let mockSetNostroListData: vi.SpyInstance;

  beforeEach(() => {
    mockSetActionHistoryListData = vi.spyOn(React, "useState").mockImplementation(() => [[], vi.fn()]);
    mockSetVostroListData = vi.spyOn(React, "useState").mockImplementation(() => [[], vi.fn()]);
    mockSetNostroListData = vi.spyOn(React, "useState").mockImplementation(() => [[], vi.fn()]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize history and SI candidates data successfully", () => {
    const mockCashflowDetails = {
      cashflowAuditTrail: [
        { Action: "APPROVE", User_PSID: "12345" },
        { Action: "SETTLEASGROSS", User_PSID: "67890" },
      ],
      ratanVostroCandidates: [{ SSI_Id: "vostro1" }],
      ratanNostroCandidates: [{ SSI_Id: "nostro1" }],
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { initHistoryAndSICandidatesData } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetails as any }), { wrapper }
    ).result.current;


    initHistoryAndSICandidatesData(mockCashflowDetails as any);

    expect(mockSetActionHistoryListData).toHaveBeenCalled();
    expect(mockSetVostroListData).toHaveBeenCalledWith(
      expect.arrayContaining([{ SSI_Id: "vostro1" }])
    );
    expect(mockSetNostroListData).toHaveBeenCalledWith(
      expect.arrayContaining([{ SSI_Id: "nostro1" }])
    );
  });

  it("should handle empty cashflowAuditTrail gracefully", () => {
    const mockCashflowDetails = {
      cashflowAuditTrail: [],
      ratanVostroCandidates: [{ SSI_Id: "vostro1" }],
      ratanNostroCandidates: [{ SSI_Id: "nostro1" }],
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { initHistoryAndSICandidatesData } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetails as any }), { wrapper }
    ).result.current;


    initHistoryAndSICandidatesData(mockCashflowDetails as any);

    expect(mockSetActionHistoryListData).toHaveBeenCalledWith([]);
    expect(mockSetVostroListData).toHaveBeenCalledWith(
      expect.arrayContaining([{ SSI_Id: "vostro1" }])
    );
    expect(mockSetNostroListData).toHaveBeenCalledWith(
      expect.arrayContaining([{ SSI_Id: "nostro1" }])
    );
  });

  it("should handle missing cashflowAuditTrail gracefully", () => {
    const mockCashflowDetails = {
      ratanVostroCandidates: [{ SSI_Id: "vostro1" }],
      ratanNostroCandidates: [{ SSI_Id: "nostro1" }],
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { initHistoryAndSICandidatesData } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetails as any }), { wrapper }
    ).result.current;


    initHistoryAndSICandidatesData(mockCashflowDetails as any);

    expect(mockSetActionHistoryListData).toHaveBeenCalledWith([]);
    expect(mockSetVostroListData).toHaveBeenCalledWith(
      expect.arrayContaining([{ SSI_Id: "vostro1" }])
    );
    expect(mockSetNostroListData).toHaveBeenCalledWith(
      expect.arrayContaining([{ SSI_Id: "nostro1" }])
    );
  });

  it("should handle undefined ratanVostroCandidates and ratanNostroCandidates gracefully", () => {
    const mockCashflowDetails = {
      cashflowAuditTrail: [
        { Action: "APPROVE", User_PSID: "12345" },
        { Action: "SETTLEASGROSS", User_PSID: "67890" },
      ],
      ratanVostroCandidates: undefined,
      ratanNostroCandidates: undefined,
    };

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { initHistoryAndSICandidatesData } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetails as any }), { wrapper }
    ).result.current;

    initHistoryAndSICandidatesData(mockCashflowDetails as any);

    expect(mockSetActionHistoryListData).toHaveBeenCalled();
    expect(mockSetVostroListData).toHaveBeenCalledWith([]);
    expect(mockSetNostroListData).toHaveBeenCalledWith([]);
  });

  it("should filter out system actions from cashflowAuditTrail", () => {
    const mockCashflowDetails = {
      cashflowAuditTrail: [
        { Action: "APPROVE", User_PSID: "12345" },
        { Action: "SYSTEM_ACTION", User_PSID: "system" },
      ],
      ratanVostroCandidates: [{ SSI_Id: "vostro1" }],
      ratanNostroCandidates: [{ SSI_Id: "nostro1" }],
    };
    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [],
          initialTargetCashflows: [],
          // amountSetting: {
          //   precision: 2,
          //   type: RoundingType.ROUNDING_OFF,
          // },
          // splitAction: SplitActionType.COMPONENT_SPLIT,
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { initHistoryAndSICandidatesData } = renderHook(() =>
      useData({ cashflowDetails: mockCashflowDetails as any }), { wrapper }
    ).result.current;


    initHistoryAndSICandidatesData(mockCashflowDetails as any);

    expect(mockSetActionHistoryListData).toHaveBeenCalled();
  });
});
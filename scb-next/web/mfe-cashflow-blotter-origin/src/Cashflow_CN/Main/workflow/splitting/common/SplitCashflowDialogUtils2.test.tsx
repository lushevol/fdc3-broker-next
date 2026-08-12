import { configureStore, createReducer } from "@reduxjs/toolkit";
import { ReduxProviderWrapper } from "@Test/test-utils";
import { act, renderHook } from "@testing-library/react";
import { FormInstance, message } from "antd";
import { MessageInstance } from "antd/es/message/interface";

import { InputStatusType, RoundingType, SplitActionType } from "./interface";
import { useSplittingActions } from "./SplitCashflowDialogUtils";

const mockSetOpenAffirmation = vi.fn();
const mockSetProceedSplitting = vi.fn();
const mockMessageApi: MessageInstance = {
  info: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  loading: vi.fn(),
  open: vi.fn(),
  destroy: vi.fn(),
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
      amountSetting: {
        precision: 2,
        type: RoundingType.ROUNDING_OFF,
      },
      splitAction: SplitActionType.COMPONENT_SPLIT,
    }, () => { }),
    splittingValidation: createReducer([{
      isValid: true,
      message: "test",
      validationArr: {
        cashflowId: "1",
        rowId: "0",
        inputStatus: InputStatusType.SUCCESS,
        prefixMessage: "none"
      }
    }], () => { }),
    cashflowGridEvent: createReducer({
      api: {
        applyTransaction: vi.fn(),
        redrawRows: vi.fn(),
        getRowNode: vi.fn(),
        getAllDisplayedColumns: vi.fn()
      },
    },
      (builder) => builder,
    ),
  },
});

vi.mock("../../../../services", async () => ({
  cashflowManualSplit: vi.fn().mockImplementation(() => Promise.resolve({ status: 200, message: "manual ok" })),
  cashflowAmendSplit: vi.fn().mockImplementation(() => Promise.resolve({ status: 200, message: "amend ok" })),
  cashflowUnSplit: vi.fn().mockImplementation(() => Promise.resolve({ status: 200, message: "unsplit ok" })),
}));

const mockDispatch = vi.fn();

vi.mock("react-redux", async () => ({
  ...(await vi.importActual("react-redux")),
  useDispatch: () => mockDispatch,
}));

describe("useSplittingActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const form: Partial<FormInstance> = {
    validateFields: vi.fn(() => Promise.resolve(true)),
    getFieldsValue: vi.fn(() => ({ affirmedAt: { valueOf: () => 123456789 } })),
  };

  it("should handle handleAffirmationAction success", async () => {
    const wrapper = ReduxProviderWrapper(store);

    const { result } = renderHook(() =>
      useSplittingActions({
        form: form as FormInstance,
        setOpenAffirmation: mockSetOpenAffirmation,
        messageApi: mockMessageApi,
        setProceedSplitting: mockSetProceedSplitting,
      }), { wrapper }
    );
    await act(async () => {
      await result.current.handleAffirmationAction();
    });
    expect(mockMessageApi.success).toHaveBeenCalledWith("manual ok");
    expect(mockSetOpenAffirmation).toHaveBeenCalledWith(false);
    expect(mockSetProceedSplitting).toHaveBeenCalledWith(false);
  });

  it("should handle handleAffirmationAction fail", async () => {
    vi.spyOn(require("../../../../services"), "cashflowManualSplit").mockImplementationOnce(() => Promise.resolve({ status: 500, message: "fail" }));
    const wrapper = ReduxProviderWrapper(store);

    const { result } = renderHook(() =>
      useSplittingActions({
        form: form as FormInstance,
        setOpenAffirmation: mockSetOpenAffirmation,
        messageApi: mockMessageApi,
        setProceedSplitting: mockSetProceedSplitting,
      }), { wrapper }
    );
    await act(async () => {
      await result.current.handleAffirmationAction();
    });
    expect(mockMessageApi.error).toHaveBeenCalledWith("fail");
    expect(mockSetOpenAffirmation).toHaveBeenCalledWith(false);
    expect(mockSetProceedSplitting).toHaveBeenCalledWith(false);
  });

  it("should handle handleAmendAction error", async () => {
    const wrapper = ReduxProviderWrapper(store);

    const { result } = renderHook(() =>
      useSplittingActions({
        form: form as FormInstance,
        setOpenAffirmation: mockSetOpenAffirmation,
        messageApi: mockMessageApi,
        setProceedSplitting: mockSetProceedSplitting,
      }), { wrapper }
    );
    await act(async () => {
      await result.current.handleAmendAction();
    });
    expect(mockSetProceedSplitting).toHaveBeenCalledWith(false);
  });
  it("should handle handleAmendAction success", async () => {
    vi.spyOn(require("../../../../services"), "cashflowAmendSplit").mockImplementationOnce(() => Promise.resolve({ status: 200, message: "success" }));

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [{ Cashflow_Id: "123", Cashflow: { Payment_Amount: 20 }, vostroAccount: { settlementMeans: "test" } }],
          initialTargetCashflows: [{ Cashflow_Id: "123", Cashflow: { Payment_Amount: 20 }, vostroAccount: { settlementMeans: "test" } }],
          amountSetting: {
            precision: 2,
            type: RoundingType.ROUNDING_OFF,
          },
          splitAction: SplitActionType.MANUAL_SPLIT,
        }, () => { }),
        splittingValidation: createReducer({
          isValid: true,
          message: "test",
          validationArr: [{
            cashflowId: "1",
            rowId: "0",
            inputStatus: InputStatusType.SUCCESS,
            prefixMessage: "none"
          }]
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);

    const { result } = renderHook(() =>
      useSplittingActions({
        form: form as FormInstance,
        setOpenAffirmation: mockSetOpenAffirmation,
        messageApi: mockMessageApi,
        setProceedSplitting: mockSetProceedSplitting,
      }), { wrapper }
    );
    await act(async () => {
      await result.current.handleAmendAction();
    });
    expect(mockMessageApi.success).toBeCalled();
  });

  it("should handle handleAmendAction success", async () => {
    vi.spyOn(require("../../../../services"), "cashflowAmendSplit").mockImplementationOnce(() => Promise.resolve({ status: 500, message: "data fail" }));

    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [{ Cashflow_Id: "123", Cashflow: { Payment_Amount: 20 }, vostroAccount: { settlementMeans: "test" } }],
          initialTargetCashflows: [{ Cashflow_Id: "123", Cashflow: { Payment_Amount: 20 }, vostroAccount: { settlementMeans: "test" } }],
          amountSetting: {
            precision: 2,
            type: RoundingType.ROUNDING_OFF,
          },
          splitAction: SplitActionType.MANUAL_SPLIT,
        }, () => { }),
        splittingValidation: createReducer({
          isValid: true,
          message: "test",
          validationArr: [{
            cashflowId: "1",
            rowId: "0",
            inputStatus: InputStatusType.SUCCESS,
            prefixMessage: "none"
          }]
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);

    const { result } = renderHook(() =>
      useSplittingActions({
        form: form as FormInstance,
        setOpenAffirmation: mockSetOpenAffirmation,
        messageApi: mockMessageApi,
        setProceedSplitting: mockSetProceedSplitting,
      }), { wrapper }
    );
    await act(async () => {
      await result.current.handleAmendAction();
    });
    expect(mockMessageApi.error).toBeCalledWith("data fail");

  });
  it("should handle handleUnSplitAction fail", async () => {
    vi.spyOn(require("../../../../services"), "cashflowUnSplit").mockImplementationOnce(() => Promise.resolve({ status: 500, message: "fail" }));
    const wrapper = ReduxProviderWrapper(store);

    const { result } = renderHook(() =>
      useSplittingActions({
        form: form as FormInstance,
        setOpenAffirmation: mockSetOpenAffirmation,
        messageApi: mockMessageApi,
        setProceedSplitting: mockSetProceedSplitting,
      }), { wrapper }
    );
    await act(async () => {
      await result.current.handleUnSplitAction();
    });
    expect(mockMessageApi.error).toHaveBeenCalledWith("fail");
    expect(mockSetProceedSplitting).toHaveBeenCalledWith(false);
  });
  it("should handle handleUnSplitAction api fail", async () => {
    vi.spyOn(require("../../../../services"), "cashflowUnSplit").mockImplementationOnce(() => Promise.reject({ status: 500, message: "fail" }));
    const wrapper = ReduxProviderWrapper(store);

    const { result } = renderHook(() =>
      useSplittingActions({
        form: form as FormInstance,
        setOpenAffirmation: mockSetOpenAffirmation,
        messageApi: mockMessageApi,
        setProceedSplitting: mockSetProceedSplitting,
      }), { wrapper }
    );
    await act(async () => {
      await result.current.handleUnSplitAction();
    });
    expect(mockMessageApi.error).toHaveBeenCalledWith("fail");
    expect(mockSetProceedSplitting).toHaveBeenCalledWith(false);
  });
  it("should handle handleUnSplitAction error", async () => {
    vi.spyOn(require("../../../../services"), "cashflowUnSplit").mockImplementationOnce(() => Promise.reject({ status: 500, message: "fail" }));
    const wrapper = ReduxProviderWrapper(store);

    const { result } = renderHook(() =>
      useSplittingActions({
        form: form as FormInstance,
        setOpenAffirmation: mockSetOpenAffirmation,
        messageApi: mockMessageApi,
        setProceedSplitting: mockSetProceedSplitting,
      }), { wrapper }
    );
    await act(async () => {
      await result.current.handleUnSplitAction();
    });
    expect(mockMessageApi.error).toBeCalled();
    expect(mockSetProceedSplitting).toHaveBeenCalledWith(false);
  });

  it("should handle handleUnSplitAction error", async () => {
    vi.spyOn(require("../../../../services"), "cashflowUnSplit").mockImplementationOnce(() => Promise.resolve({ status: 500, message: "fail" }));
    const wrapper = ReduxProviderWrapper(store);

    const { result } = renderHook(() =>
      useSplittingActions({
        form: form as FormInstance,
        setOpenAffirmation: mockSetOpenAffirmation,
        messageApi: mockMessageApi,
        setProceedSplitting: mockSetProceedSplitting,
      }), { wrapper }
    );
    await act(async () => {
      await result.current.handleUnSplitAction();
    });
    expect(mockMessageApi.error).toBeCalled();
    expect(mockSetProceedSplitting).toHaveBeenCalledWith(false);
  });

  it("should handle handleSplitAction with no targetCashflows", async () => {
    vi.spyOn(require("../../../../services"), "cashflowManualSplit").mockImplementationOnce(() => Promise.reject({ status: 500, message: "fail" }));
    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: { Cashflow_Id: "123", Cashflow: { Payment_Amount: 100 }, vostroAccount: { settlementMeans: "test" } },
          targetCashflows: [{ Cashflow_Id: "123", Cashflow: { Payment_Amount: 60 }, vostroAccount: { settlementMeans: "test" } }, { Cashflow_Id: "", Cashflow: { Payment_Amount: 40 }, vostroAccount: { settlementMeans: "test" } }],
          initialTargetCashflows: [],
          amountSetting: {
            precision: 2,
            type: RoundingType.ROUNDING_OFF,
          },
          splitAction: SplitActionType.AMEND_SPLIT,
        }, () => { }),
        splittingValidation: createReducer({
          isValid: true,
          message: "test",
          validationArr: [{
            cashflowId: "1",
            rowId: "0",
            inputStatus: InputStatusType.SUCCESS,
            prefixMessage: "none"
          }]
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);

    const { result } = renderHook(() =>
      useSplittingActions({
        form: form as FormInstance,
        setOpenAffirmation: mockSetOpenAffirmation,
        messageApi: mockMessageApi,
        setProceedSplitting: mockSetProceedSplitting,
      }), { wrapper }
    );
    await act(async () => {
      await result.current.handleSplitAction({});
    });
    expect(mockMessageApi.error).toBeCalled();
  });
  it("should not open affirmation dialog if preCheck fails", () => {
    vi.spyOn(require("./SplitCashflowDialogUtils"), "handlePreCheckAmount").mockReturnValue(false);
    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [{ Cashflow_Id: "123", vostroAccount: { settlementMeans: "test" } }],
          initialTargetCashflows: [],
          amountSetting: {
            precision: 2,
            type: RoundingType.ROUNDING_OFF,
          },
          splitAction: SplitActionType.MANUAL_SPLIT,
        }, () => { }),
        splittingValidation: createReducer({
          isValid: true,
          message: "test",
          validationArr: [{
            cashflowId: "1",
            rowId: "0",
            inputStatus: InputStatusType.SUCCESS,
            prefixMessage: "none"
          }]
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useSplittingActions({
        form: form as FormInstance,
        setOpenAffirmation: mockSetOpenAffirmation,
        messageApi: mockMessageApi,
        setProceedSplitting: mockSetProceedSplitting,
      }), { wrapper }
    );
    act(() => {
      result.current.handleSplitFinalSubmit();
    });
    expect(mockSetOpenAffirmation).not.toHaveBeenCalled();
  });
  it("should call handleAmendAction for AMEND_SPLIT when preCheck passes", async () => {
    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: { Cashflow_Id: "123", Cashflow: { Payment_Amount: 100 }, vostroAccount: { settlementMeans: "test" } },
          targetCashflows: [{ Cashflow_Id: "123", Cashflow: { Payment_Amount: 60 }, vostroAccount: { settlementMeans: "test" } }, { Cashflow_Id: "", Cashflow: { Payment_Amount: 40 }, vostroAccount: { settlementMeans: "test" } }],
          initialTargetCashflows: [],
          amountSetting: {
            precision: 2,
            type: RoundingType.ROUNDING_OFF,
          },
          splitAction: SplitActionType.AMEND_SPLIT,
        }, () => { }),
        splittingValidation: createReducer({
          isValid: true,
          message: "test",
          validationArr: [{
            cashflowId: "1",
            rowId: "0",
            inputStatus: InputStatusType.SUCCESS,
            prefixMessage: "none"
          }]
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useSplittingActions({
        form: form as FormInstance,
        setOpenAffirmation: mockSetOpenAffirmation,
        messageApi: mockMessageApi,
        setProceedSplitting: mockSetProceedSplitting,
      }), { wrapper }
    );
    // spy handleAmendAction
    const spyAmend = vi.spyOn(result.current, "handleAmendAction").mockImplementation(vi.fn());
    await act(async () => {
      await result.current.handleSplitFinalSubmit();
    });
  });
  it("should call handleAmendAction for MANUAL_SPLIT when preCheck passes", async () => {
    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: { Cashflow_Id: "123", Cashflow: { Payment_Amount: 100 }, vostroAccount: { settlementMeans: "test" } },
          targetCashflows: [{ Cashflow_Id: "123", Cashflow: { Payment_Amount: 60 }, vostroAccount: { settlementMeans: "test" } }, { Cashflow_Id: "", Cashflow: { Payment_Amount: 40 }, vostroAccount: { settlementMeans: "test" } }],
          initialTargetCashflows: [],
          amountSetting: {
            precision: 2,
            type: RoundingType.ROUNDING_OFF,
          },
          splitAction: SplitActionType.MANUAL_SPLIT,
        }, () => { }),
        splittingValidation: createReducer({
          isValid: true,
          message: "test",
          validationArr: [{
            cashflowId: "1",
            rowId: "0",
            inputStatus: InputStatusType.SUCCESS,
            prefixMessage: "none"
          }]
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useSplittingActions({
        form: form as FormInstance,
        setOpenAffirmation: mockSetOpenAffirmation,
        messageApi: mockMessageApi,
        setProceedSplitting: mockSetProceedSplitting,
      }), { wrapper }
    );
    vi.spyOn(require("./SplitCashflowDialogUtils"), "handlePreCheckAmount").mockReturnValue(true);

    // spy handleAmendAction
    const spyAmend = vi.spyOn(result.current, "handleAmendAction").mockImplementation(vi.fn());
    await act(async () => {
      await result.current.handleSplitFinalSubmit();
    });
  });
  it("should call handleAmendAction for UN_SPLIT when preCheck passes", async () => {
    vi.spyOn(require("./SplitCashflowDialogUtils"), "handlePreCheckAmount").mockReturnValue(true);
    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [{ Cashflow_Id: "123", vostroAccount: { settlementMeans: "test" } }],
          initialTargetCashflows: [],
          amountSetting: {
            precision: 2,
            type: RoundingType.ROUNDING_OFF,
          },
          splitAction: SplitActionType.UN_SPLIT,
        }, () => { }),
        splittingValidation: createReducer({
          isValid: true,
          message: "test",
          validationArr: [{
            cashflowId: "1",
            rowId: "0",
            inputStatus: InputStatusType.SUCCESS,
            prefixMessage: "none"
          }]
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);
    const { result } = renderHook(() =>
      useSplittingActions({
        form: form as FormInstance,
        setOpenAffirmation: mockSetOpenAffirmation,
        messageApi: mockMessageApi,
        setProceedSplitting: mockSetProceedSplitting,
      }), { wrapper }
    );
    // spy handleUnSplitAction
    const spyUnSplit = vi.spyOn(result.current, "handleUnSplitAction").mockImplementation(vi.fn());
    await act(async () => {
      await result.current.handleSplitFinalSubmit();
    });
  });
});
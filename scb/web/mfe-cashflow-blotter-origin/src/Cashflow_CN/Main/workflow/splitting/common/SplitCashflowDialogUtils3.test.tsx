
import { configureStore, createReducer } from "@reduxjs/toolkit";
import { ReduxProviderWrapper } from "@Test/test-utils";
import { act, renderHook } from "@testing-library/react";

import { InputStatusType, RoundingType, SplitActionType, SplitCashflowState, SplitValidationArrItem } from "./interface";
import {
  useSplittingAmountHandler
} from "./SplitCashflowDialogUtils";

const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

describe("useSplittingAmountHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should validate input as zero and dispatch error", () => {
    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: {},
          targetCashflows: [{ Cashflow_Id: "123", Cashflow: { Cashflow_State: SplitCashflowState.FAILED, Payment_Amount:"20" }, vostroAccount: { settlementMeans: "test" } },
          { Cashflow_Id: "124", Cashflow: { Cashflow_State: SplitCashflowState.FAILED, Payment_Amount:"30" }, vostroAccount: { settlementMeans: "test" } }
          ],
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

    const { result } = renderHook(() => useSplittingAmountHandler(), { wrapper });
    act(() => {
      result.current.handleAmountConfim(12, 0);
    });
    expect(mockDispatch).toBeCalled();
  });

  it("should generate correct prefix message", () => {
    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: { Cashflow: { Payment_Amount: "100" } },
          targetCashflows: [
            { Cashflow: { Payment_Amount: "40", Cashflow_Id: "1" } },
            { Cashflow: { Payment_Amount: "30", Cashflow_Id: "2" } },
          ],
          initialTargetCashflows: [],
          amountSetting: {
            precision: 2,
            type: RoundingType.ROUNDING_OFF,
          },
          splitAction: SplitActionType.MANUAL_SPLIT,
        }, () => { }),
        splittingValidation: createReducer({
          isValid: true,
          message: "",
          validationArr: [],
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);

    const { result } = renderHook(() => useSplittingAmountHandler(), { wrapper });

    const prefix = result.current.generateOnChangePrefix(10, 0);
    expect(prefix).toContain("Still");
    expect(prefix).toContain("amount available to be split");
    expect(typeof prefix).toBe("string");
  });

  it("should not delete row if rowIndex is 0", () => {
    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: { Cashflow: { Payment_Amount: "100" } },
          targetCashflows: [
            { Cashflow: { Payment_Amount: "40", Cashflow_Id: "1" } },
            { Cashflow: { Payment_Amount: "30", Cashflow_Id: "2" } },
          ],
          initialTargetCashflows: [],
          amountSetting: {
            precision: 2,
            type: RoundingType.ROUNDING_OFF,
          },
          splitAction: SplitActionType.MANUAL_SPLIT,
        }, () => { }),
        splittingValidation: createReducer({
          isValid: true,
          message: "",
          validationArr: [
            { cashflowId: "1", rowId: 0, inputStatus: InputStatusType.SUCCESS, prefixMessage: "" },
            { cashflowId: "2", rowId: 1, inputStatus: InputStatusType.SUCCESS, prefixMessage: "" },
          ],
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);

    const { result } = renderHook(() => useSplittingAmountHandler(), { wrapper });
    act(() => {
      result.current.handleDeleteRow(0);
    });
    expect(mockDispatch).not.toBeCalled();

  });
  it("should delete row and adjust last row amount if rowIndex > 0", () => {
    const store = configureStore({
      reducer: {
        splittingWorkflow: createReducer({
          splitStatus: "INIT",
          isOpenSplittingDialog: false,
          isOpenLookUpSSIDialog: false,
          targetRowIndex: null,
          isChildCashflowDialogVisible: false,
          sourceCashflow: { Cashflow: { Payment_Amount: "100" } },
          targetCashflows: [
            { Cashflow: { Payment_Amount: "40", Cashflow_Id: "1" } },
            { Cashflow: { Payment_Amount: "30", Cashflow_Id: "2" } },
            { Cashflow: { Payment_Amount: "20", Cashflow_Id: "3" } },
          ],
          initialTargetCashflows: [],
          amountSetting: {
            precision: 2,
            type: RoundingType.ROUNDING_OFF,
          },
          splitAction: SplitActionType.MANUAL_SPLIT,
        }, () => { }),
        splittingValidation: createReducer({
          isValid: true,
          message: "",
          validationArr: [
            { cashflowId: "1", rowId: 0, inputStatus: InputStatusType.SUCCESS, prefixMessage: "" },
            { cashflowId: "2", rowId: 1, inputStatus: InputStatusType.SUCCESS, prefixMessage: "" },
            { cashflowId: "3", rowId: 2, inputStatus: InputStatusType.SUCCESS, prefixMessage: "" },
          ],
        }, () => { }),
      },
    });
    const wrapper = ReduxProviderWrapper(store);

    const { result } = renderHook(() => useSplittingAmountHandler(), { wrapper });
    act(() => {
      result.current.handleDeleteRow(2);
    });
    expect(mockDispatch).toBeCalled();

  });

});
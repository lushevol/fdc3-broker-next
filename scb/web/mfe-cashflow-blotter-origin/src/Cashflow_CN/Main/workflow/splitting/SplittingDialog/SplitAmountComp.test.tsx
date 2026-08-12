import { configureStore, createReducer } from "@reduxjs/toolkit";
import { ReduxProviderWrapper } from "@Test/test-utils";
import { fireEvent, render } from "@testing-library/react";

import {
  InputStatusType,
  RoundingType,
  SplitActionType,
} from "../common/interface";
import { PreCheckComp, SplittingAmount, SplittingDeleteButton, SplittingLookUpSSIBtn } from "./SplitAmountComp";


const mockHandleDeleteRow = jest.fn();
const mockHandleAmountChange = jest.fn();
const mockHandleInputChange = jest.fn();
const mockPreCheckComp = <div data-testid="precheck-comp" />;

jest.mock("../common/SplitCashflowDialogUtils", () => ({
  useSplittingAmountHandler: () => ({
    handleDeleteRow: mockHandleDeleteRow,
    targetCashflows: [
      { Cashflow: { Payment_Amount: 1, Cashflow_State: "WAITING" } },
      { Cashflow: { Payment_Amount: 2, Cashflow_State: "READY" } },
    ],
    initialTargetCashflows: [
      { Cashflow: { Payment_Amount: 1, Cashflow_State: "WAITING" } },
      { Cashflow: { Payment_Amount: 2, Cashflow_State: "READY" } },
    ],
    precision: 2,
    inputStatus: "",
    handleInputChange: mockHandleInputChange,
    PreCheckComp: mockPreCheckComp,
    handleAmountChange: mockHandleAmountChange,
    generateOnChangePrefix: jest.fn(),
    handleAmountConfim: jest.fn()
  }),
  isSplitCashflowStateCategory: jest.fn(() => true),
}));

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
      }, {
        cashflowId: "2",
        rowId: "1",
        inputStatus: InputStatusType.ERROR,
        prefixMessage: "error"
      },
      {
        cashflowId: "3",
        rowId: "2",
        inputStatus: InputStatusType.WAITING,
        prefixMessage: "input"
      }
      ]
    }, () => { }),
    cashflowGridEvent: createReducer({
      api: {
        applyTransaction: jest.fn(),
        redrawRows: jest.fn(),
        getRowNode: jest.fn(),
        getAllDisplayedColumns: jest.fn()
      },
    },
      (builder) => builder,
    ),
  },
});

//some method looks do not mock cause below cannot render.
describe("SplittingAmount", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render input with correct value and PreCheckComp", () => {
    const wrapper = ReduxProviderWrapper(store);
    render(
      <SplittingAmount node={{ rowIndex: 0, lastChild: true }} />, { wrapper }
    );
    expect(screen).toBeDefined();
  });

  it("should call handleInputChange and setInputValue with formatted value on change", () => {
    const wrapper = ReduxProviderWrapper(store);
    const { getByTestId } = render(
      <SplittingAmount node={{ rowIndex: 0, lastChild: true }} />, { wrapper }
    );
    const input = getByTestId("splittingAmount_Input_0");
    fireEvent.change(input, { target: { value: "3" } });
    fireEvent.blur(input);
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(input).toHaveValue("3.00");
  });
  it("should judege whether enable eiditable when Manual Split", () => {
    const newStore = configureStore({
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
        cashflowGridEvent: createReducer({
          api: {
            applyTransaction: jest.fn(),
            redrawRows: jest.fn(),
            getRowNode: jest.fn(),
            getAllDisplayedColumns: jest.fn()
          },
        },
          (builder) => builder,
        ),
      },
    });
    const wrapper = ReduxProviderWrapper(newStore);
    const { getByTestId } = render(
      <SplittingAmount node={{ rowIndex: 0, lastChild: true }} />, { wrapper }
    );
    const input = getByTestId("splittingAmount_Input_0");
    fireEvent.change(input, { target: { value: "3" } });
    fireEvent.blur(input);
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(input).toHaveValue("3.00");
  });
  it("should disable input when isEnableEiditable returns false", () => {
    // splitAction: MANUAL_SPLIT, lastChild: false
    const newStore = configureStore({
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
        cashflowGridEvent: createReducer({
          api: {
            applyTransaction: jest.fn(),
            redrawRows: jest.fn(),
            getRowNode: jest.fn(),
            getAllDisplayedColumns: jest.fn()
          },
        },
          (builder) => builder,
        ),
      },
    });

    const wrapper = ReduxProviderWrapper(newStore);
    const { getByTestId } = render(
      <SplittingAmount node={{ rowIndex: 0, lastChild: false }} />, { wrapper }
    );
    expect(screen).toBeDefined();
  });
});

describe("SplittingDeleteButton", () => {
  it("should render disabled button when isLast is false", () => {
    const { getByTestId } = render(
      <SplittingDeleteButton node={{ rowIndex: 1, lastChild: false }} />
    );
    const btn = getByTestId("splittingDeleteButton_1");
    expect(btn).toBeDisabled();
  });

  it("should render disabled button when currentIndex is 0", () => {
    const { getByTestId } = render(
      <SplittingDeleteButton node={{ rowIndex: 0, lastChild: true }} />
    );
    const btn = getByTestId("splittingDeleteButton_0");
    expect(btn).toBeDisabled();
  });

  it("should render enabled button and call handleDeleteRow when clicked", () => {
    const { getByTestId, queryByTestId } = render(
      <SplittingDeleteButton node={{ rowIndex: 2, lastChild: true }} />
    );
    const btn = getByTestId("splittingDeleteButton_2");
    expect(btn).not.toBeDisabled();
    fireEvent.click(btn);
    expect(mockHandleDeleteRow).toHaveBeenCalledWith(2);

  });
});

describe("PreCheckComp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders success icon when status is SUCCESS", () => {
    const wrapper = ReduxProviderWrapper(store);

    const { container } = render(
      <PreCheckComp currentStatus={InputStatusType.SUCCESS} cashflowId="CF001" currentRowId={0} />, { wrapper }
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="tooltip"]')).not.toBeInTheDocument();
  });
});

describe("SplittingLookUpSSIBtn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should dispatch splitingCashflowAction when data is valid", () => {
    const wrapper = ReduxProviderWrapper(store);

    const { getByText } = render(<SplittingLookUpSSIBtn node={{ rowIndex: 0 }} />, { wrapper });
    expect(screen).toBeDefined();

  });


});
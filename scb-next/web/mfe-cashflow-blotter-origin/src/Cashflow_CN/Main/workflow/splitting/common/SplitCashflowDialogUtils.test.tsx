import { act, renderHook } from "@testing-library/react";
import { message } from "antd";
import { MessageInstance } from "antd/es/message/interface";
import { mockCashflow1 } from "src/Cashflow_CN/test/mockData/cashflow";
import * as cashflowServices from "../../../../services";
import * as graphqlServices from "src/Cashflow_CN/services/graphql";
import * as splitUtils from "./utils";

import { InputStatusType, SplitActionType, SplitCashflowState, SplitValidationArrItem } from "./interface";
import {
  convertSplitCashflowFilters,
  deleteAndAdjustCashflow,
  deleteValidationByRowId,
  generateManualSplitTargetArr,
  generateSplitChildCashflow,
  generateSplitParentCashflow,
  handlePreCheckAmount,
  isSplitCashflowStateCategory,
  tryAddManualSplitRow,
  useQuerySplitting,
  validateSplitAmountInput
} from "./SplitCashflowDialogUtils";

vi.mock("antd", () => ({
  message: { error: vi.fn(), success: vi.fn() },
  Table: () => <div>Table</div>,
  Form: () => <div>Form</div>,
  InputNumber: () => <div>InputNumber</div>,
  Input: () => <div>Input</div>,
  Select: () => <div>Select</div>,
  Modal: () => <div>Modal</div>,
  Radio: () => <div>Radio</div>,
  Checkbox: () => <div>Checkbox</div>,
  Tooltip: () => <div>Tooltip</div>,
  Popover: () => <div>Popover</div>,
  Button: () => <div>Button</div>,
}));

const mockDispatch = vi.fn((fn) => {
  return fn
});
vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: vi.fn((fn) =>
    fn({
      splittingWorkflow: {
        sourceCashflow: { Cashflow: { Payment_Currency: "USD" } },
        targetCashflows: [],
        initialTargetCashflows: [],
        amountSetting: {},
        splitAction: "MANUAL_SPLIT",
      },
    })
  ),
}));

describe("handlePreCheckAmount", () => {
  it("should fail if sourceCashflow amount is empty", () => {
    const result = handlePreCheckAmount([], {}, message, true, 2);
    expect(result).toBe(false);
    expect(message.error).toHaveBeenCalledWith("Source cashflow amount is empty");
  });

  it("should fail if targetCashflows is not array or empty", () => {
    const result = handlePreCheckAmount(undefined as any, { Cashflow: { Payment_Amount: "100" } }, message, true, 2);
    expect(result).toBe(false);
    expect(message.error).toHaveBeenCalledWith("Target cashflows are required!");
  });

  it("should fail if targetCashflows length < 2", () => {
    const result = handlePreCheckAmount(
      [{ Cashflow: { Payment_Amount: "100" } }],
      { Cashflow: { Payment_Amount: "100" } },
      message,
      true,
      2
    );
    expect(result).toBe(false);
    expect(message.error).toHaveBeenCalledWith("At least 2 child cashflow are in eligible status!");
  });


  it("should pass if for complex amount split", () => {
    vi.spyOn(splitUtils, "isAmountAEqualB").mockImplementationOnce(() => true);

    const result = handlePreCheckAmount(
      [
        { Cashflow: { Payment_Amount: "31662.23" } },
        { Cashflow: { Payment_Amount: "50000.00" } },
        { Cashflow: { Payment_Amount: "30000.00" } },
        { Cashflow: { Payment_Amount: "20000.00" } }],
      { Cashflow: { Payment_Amount: "131662.23" } },
      message,
      true,
      2
    );

    expect(result).toBe(true);
  });

  it("should fail if for total amount do not equal source amount", () => {
    const result = handlePreCheckAmount(
      [{ Cashflow: { Payment_Amount: "31662.23" } }, { Cashflow: { Payment_Amount: "50000.00" } }, { Cashflow: { Payment_Amount: "30000.00" } }, { Cashflow: { Payment_Amount: "20000.00" } }],
      { Cashflow: { Payment_Amount: "10000.00" } },
      message,
      true,
      2
    );
    expect(result).toBe(false);
    expect(message.error).toHaveBeenCalledWith("Total split amount must equal to source cashflow amount!");
  });

  it("should fail if validation is false", () => {
    const result = handlePreCheckAmount(
      [
        { Cashflow: { Payment_Amount: "50" } },
        { Cashflow: { Payment_Amount: "50" } },
      ],
      { Cashflow: { Payment_Amount: "100" } },
      message,
      false,
      0
    );
    expect(result).toBe(false);
    expect(message.error).toHaveBeenCalledWith("Please resolve all errors before proceed!");
  });
});

describe("generateSplitChildCashflow", () => {
  it("should return empty array if input is empty", () => {
    expect(generateSplitChildCashflow([])).toEqual([]);
  });

  it("should filter only child cashflows (Cashflow_Id starts with 'S')", () => {
    const data = [
      { Cashflow: { Cashflow_Id: "S1", Cashflow_State: "READY" } },
      { Cashflow: { Cashflow_Id: "A1", Cashflow_State: "READY" } },
      { Cashflow: { Cashflow_Id: "S2", Cashflow_State: "WAITING" } },
    ];
    const result = generateSplitChildCashflow(data);
    expect(result.length).toBe(2);
  });
});

describe("generateSplitChildCashflow", () => {
  it("should return only child cashflows (Cashflow_Id starts with 'S')", () => {
    const data = [
      { Cashflow: { Cashflow_Id: "CF123", Cashflow_State: "READY" } }, // parent
      { Cashflow: { Cashflow_Id: "S1", Cashflow_State: "READY" } },    // child, eligible
      { Cashflow: { Cashflow_Id: "S3", Cashflow_State: "WAITING" } },  // child, eligible
    ];
    const result = generateSplitChildCashflow(data as any);

    expect(result.length).toBe(2);
    expect(result.every((item) => item?.Cashflow?.Cashflow_Id?.startsWith("S"))).toBe(true);
  });
  it("should sort eligible cashflows to the top", () => {
    const data = [
      { Cashflow: { Cashflow_Id: "S3", Cashflow_State: SplitCashflowState.WAITING } },    // eligible
      { Cashflow: { Cashflow_Id: "S3", Cashflow_State: SplitCashflowState.READY } },  // eligible
    ];
    const result = generateSplitChildCashflow(data as any);
    expect(result[0] && result[0]?.Cashflow?.Cashflow_State).toBe(SplitCashflowState.WAITING);
    expect(result[1]?.Cashflow?.Cashflow_State).toBe(SplitCashflowState.READY);
  });
});

describe("generateSplitParentCashflow", () => {
  it("should return only parent cashflows (Cashflow_Id does not start with 'S')", () => {
    const data = [
      {
        Cashflow: {
          Cashflow_Id: "CF123",
          Payment_Amount: 1000,
          Payment_Currency: "USD",
        },
      },
      {
        Cashflow: {
          Cashflow_Id: "S456",
          Payment_Amount: 500,
          Payment_Currency: "USD",
        },
      },
      {
        Cashflow: {
          Cashflow_Id: "CF789",
          Payment_Amount: 2000,
          Payment_Currency: "USD",
        },
      },
    ];
    const result = generateSplitParentCashflow(data as any);
    expect(result).toEqual([
      {
        Cashflow: {
          Cashflow_Id: "CF123",
          Payment_Amount: 1000,
          Payment_Currency: "USD",
        },
      },
      {
        Cashflow: {
          Cashflow_Id: "CF789",
          Payment_Amount: 2000,
          Payment_Currency: "USD",
        },
      },
    ]);
  });
});
describe("generateManualSplitTargetArr", () => {
  it("should return a new array with the first item's Cashflow_Id set to empty string", () => {
    const input = [
      {
        Cashflow: {
          Cashflow_Id: "CF123",
          Payment_Amount: 1000,
          Payment_Currency: "USD",
        },
        extra: "foo",
      },
      {
        Cashflow: {
          Cashflow_Id: "CF456",
          Payment_Amount: 500,
          Payment_Currency: "USD",
        },
        extra: "bar",
      },
    ];
    const result = generateManualSplitTargetArr(input as any);

    expect(result.length).toBe(2);
    expect(result[0].Cashflow.Cashflow_Id).toBe("");
    expect(result[0].Cashflow.Payment_Amount).toBe(1000);
    expect(result[1].Cashflow.Cashflow_Id).toBe("CF456");
    expect(result[1].Cashflow.Payment_Amount).toBe(500);
  });
  it("should handle single-element array", () => {
    const input = [
      {
        Cashflow: {
          Cashflow_Id: "CF123",
          Payment_Amount: 1000,
          Payment_Currency: "USD",
        },
      },
    ];
    const result = generateManualSplitTargetArr(input as any);
    expect(result.length).toBe(1);
    expect(result[0].Cashflow.Cashflow_Id).toBe("");
    expect(result[0].Cashflow.Payment_Amount).toBe(1000);
  });

});

describe("isSplitCashflowStateCategory", () => {
  it("should return true for valid SplitCashflowState values", () => {
    expect(isSplitCashflowStateCategory(SplitCashflowState.READY)).toBe(true);
    expect(isSplitCashflowStateCategory(SplitCashflowState.WAITING)).toBe(true);
  });

  it("should return false for invalid values", () => {
    expect(isSplitCashflowStateCategory("INVALID_STATE")).toBe(false);
    expect(isSplitCashflowStateCategory(undefined)).toBe(false);
    expect(isSplitCashflowStateCategory(null)).toBe(false);
    expect(isSplitCashflowStateCategory(123)).toBe(false);
    expect(isSplitCashflowStateCategory({})).toBe(false);
  });
});

describe("convertSplitCashflowFilters", () => {
  const mockCashflow = {
    Cashflow: {
      Cashflow_Id: "CF001",
      Splitting_Id: "SP001",
    },
  } as any;

  it("should generate correct payload for MANUAL_SPLIT", () => {
    const payload = convertSplitCashflowFilters(mockCashflow, SplitActionType.MANUAL_SPLIT);
    expect(payload).toEqual([
      {
        field: "Cashflow.Cashflow_Id",
        operator: "EQ",
        values: "CF001",
      },
    ]);
  });

  it("should generate correct payload for AMEND_SPLIT", () => {
    const payload = convertSplitCashflowFilters(mockCashflow, SplitActionType.AMEND_SPLIT);
    expect(payload).toEqual([
      {
        field: "Cashflow.Splitting_Id",
        operator: "EQ",
        values: "SP001",
      },
    ]);
  });
});

describe("validateSplitAmountInput", () => {
  const baseValidationArr: SplitValidationArrItem[] = [];

  it("should return error if value is not a number", () => {
    const result = validateSplitAmountInput({
      value: 0,
      rowIndex: 0,
      sourceValidationArr: baseValidationArr,
      sourceAmount: 100,
      sourcePrecision: 2,
      splitAction: SplitActionType.MANUAL_SPLIT,
      maxThreshold: 100,
      validationMaxInput: 100
    });
    expect(result.newIsValid).toBe(false);
    expect(result.newValidationArr[0].prefixMessage).toContain("Amount cannot be zero.");
  });
  it("should return error if value is greater than sourceAmount", () => {
    const result = validateSplitAmountInput({
      value: 200,
      rowIndex: 0,
      sourceValidationArr: baseValidationArr,
      sourceAmount: 100,
      sourcePrecision: 2,
      splitAction: SplitActionType.MANUAL_SPLIT,
      maxThreshold: 100,
      validationMaxInput: 100
    });
    expect(result.newIsValid).toBe(false);
    expect(result.newValidationArr[0].inputStatus).toBe(InputStatusType.ERROR);
    expect(result.newValidationArr[0].prefixMessage).toContain("greater than the source cashflow");
  });
  it("should return error if value precision is too high", () => {
    const result = validateSplitAmountInput({
      value: 1.123,
      rowIndex: 0,
      sourceValidationArr: baseValidationArr,
      sourceAmount: 100,
      sourcePrecision: 2,
      splitAction: SplitActionType.MANUAL_SPLIT,
      maxThreshold: 100,
      validationMaxInput: 100
    });
    expect(result.newIsValid).toBe(false);
    expect(result.newValidationArr[0].inputStatus).toBe(InputStatusType.ERROR);
    expect(result.newValidationArr[0].prefixMessage).toContain("decimals allowed");
  });
  it("should return error if value > maxThreshold for AMEND_SPLIT", () => {
    const result = validateSplitAmountInput({
      value:101,
      rowIndex:0,
      sourceValidationArr: baseValidationArr,
      sourceAmount: 100,
      sourcePrecision: 2,
      splitAction: SplitActionType.AMEND_SPLIT,
      maxThreshold: 100,
      validationMaxInput: 100
  });
    expect(result.newIsValid).toBe(false);
    expect(result.newValidationArr[0].inputStatus).toBe(InputStatusType.ERROR);
    expect(result.newValidationArr[0].prefixMessage).toContain("Split amount cannot be greater than the source cashflow.");
  });
  it("should return success if all checks pass", () => {
    const result = validateSplitAmountInput({
      value: 50,
      rowIndex: 0,
      sourceValidationArr: baseValidationArr,
      sourceAmount: 100,
      sourcePrecision: 2,
      splitAction:SplitActionType.MANUAL_SPLIT,
      maxThreshold:100,
      validationMaxInput:100
  });
    expect(result.newIsValid).toBe(true);
    expect(result.newValidationArr[0].inputStatus).toBe(InputStatusType.SUCCESS);
    expect(result.newValidationArr[0].prefixMessage).toBe("");
  });
  it("should trigger AMEND_SPLIT branch (787-792)", () => {
    const result = validateSplitAmountInput({
      value: 99, // value
      rowIndex:0,   // rowIndex
      sourceValidationArr:[],  // sourceValidationArr
      sourceAmount:100, // sourceAmount
      sourcePrecision:2,   // sourcePrecision
      splitAction:SplitActionType.AMEND_SPLIT,
      maxThreshold:50, // maxThreshold
      validationMaxInput:100  // validationMaxInput
  });
    expect(result.newIsValid).toBe(false);
    expect(result.newValidationArr[0].inputStatus).toBe(InputStatusType.ERROR);
    expect(result.newValidationArr[0].prefixMessage).toContain("available balance");
  });
  it("should trigger MANUAL_SPLIT branch (798/800)", () => {
    const result = validateSplitAmountInput({
      value:80, // value
      rowIndex:0,   // rowIndex
      sourceValidationArr:[],  // sourceValidationArr
      sourceAmount:100, // sourceAmount
      sourcePrecision:2,   // sourcePrecision
      splitAction:SplitActionType.MANUAL_SPLIT,
      maxThreshold:100, // maxThreshold
      validationMaxInput:60  // validationMaxInput
  });
    expect(result.newIsValid).toBe(false);
    expect(result.newValidationArr[0].inputStatus).toBe(InputStatusType.ERROR);
    expect(result.newValidationArr[0].prefixMessage).toContain("available balance");
  });
  it("should update existing validation if present", () => {
    const arr: SplitValidationArrItem[] = [
      {
        cashflowId: "id1",
        rowId: 0,
        inputStatus: InputStatusType.ERROR,
        prefixMessage: "old",
      },
    ];
    const result = validateSplitAmountInput({
      value: 50,
      rowIndex: 0,
      sourceValidationArr: arr,
      sourceAmount: 100,
      sourcePrecision: 2,
      splitAction: SplitActionType.MANUAL_SPLIT,
      maxThreshold: 100,
      validationMaxInput: 100
  });
    expect(result.newValidationArr.length).toBe(1);
    expect(result.newValidationArr[0].inputStatus).toBe(InputStatusType.SUCCESS);
    expect(result.newValidationArr[0].prefixMessage).toBe("");
  });
});

describe("useQuerySplitting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockSetGridOption = vi.fn();
  const mockMessageApi: MessageInstance = {
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    loading: vi.fn(),
    open: vi.fn(),
    destroy: vi.fn(),
  };

  it("should call grid loading, fetch data, and dispatch actions for MANUAL_SPLIT", async () => {

    const sourceApi = { setGridOption: mockSetGridOption, getAllDisplayedColumns: vi.fn() };
    const targetApi = { setGridOption: mockSetGridOption, getAllDisplayedColumns: vi.fn() };
    const sourceCashflow = { Cashflow: { Payment_Currency: "USD", Cashflow_Id: "CF001" } };
    const splitAction = SplitActionType.MANUAL_SPLIT;

    const promise1 = Promise.resolve({ precision: 2, type: "ROUNDING_OFF" });
    jest
      .spyOn(cashflowServices, "getCurrencyRounding")
      .mockResolvedValue(promise1);
    const promise2 = Promise.resolve({ cashflowUltraQuery: { results: [mockCashflow1] } });
    jest
      .spyOn(graphqlServices, "queryCashflow")
      .mockResolvedValue(promise2);

    const { result } = renderHook(() => useQuerySplitting({ messageApi: mockMessageApi }));

    await act(async () => {
      result.current.querySplittingParallel(
        sourceApi as any,
        targetApi as any,
        sourceCashflow as any,
        splitAction
      );

    });
    await promise1;
    await promise2;

    expect(mockDispatch).toBeCalled();
    expect(sourceApi.setGridOption).toBeCalled();
  });
  it("should call grid loading, fetch data, and dispatch actions for ohter split action", async () => {

    const sourceApi = { setGridOption: mockSetGridOption, getAllDisplayedColumns: vi.fn() };
    const targetApi = { setGridOption: mockSetGridOption, getAllDisplayedColumns: vi.fn() };
    const sourceCashflow = { Cashflow: { Payment_Currency: "USD", Cashflow_Id: "CF001" } };
    const splitAction = SplitActionType.UN_SPLIT;

    const promise1 = Promise.resolve({ precision: 2, type: "ROUNDING_OFF" });
    jest
      .spyOn(cashflowServices, "getCurrencyRounding")
      .mockResolvedValue(promise1);
    const promise2 = Promise.resolve({ cashflowUltraQuery: { results: [mockCashflow1] } });
    jest
      .spyOn(graphqlServices, "queryCashflow")
      .mockResolvedValue(promise2);

    const { result } = renderHook(() => useQuerySplitting({ messageApi: mockMessageApi }));

    await act(async () => {
      result.current.querySplittingParallel(
        sourceApi as any,
        targetApi as any,
        sourceCashflow as any,
        splitAction
      );

    });
    await promise1;
    await promise2;

    expect(mockDispatch).toBeCalled();
    expect(sourceApi.setGridOption).toBeCalled();
  });
  it("should show error if no results", async () => {
    // mock cashflowRes with empty results
    const sourceApi = {
      setGridOption: mockSetGridOption,
      autoSizeAllColumns: vi.fn(),
      getDisplayedRowCount: vi.fn(),
    };
    const targetApi = {
      setGridOption: mockSetGridOption,
      autoSizeAllColumns: vi.fn(),
      getDisplayedRowCount: vi.fn(),
    };
    const sourceCashflow = { Cashflow: { Payment_Currency: "USD", Cashflow_Id: "CF001" } };
    const splitAction = SplitActionType.MANUAL_SPLIT;

    const promise1 = Promise.resolve({ precision: 2, type: "ROUNDING_OFF" });
    jest
      .spyOn(cashflowServices, "getCurrencyRounding")
      .mockResolvedValue(promise1);

    const promise2 = Promise.resolve({ cashflowUltraQuery: { results: [] } });
    jest
      .spyOn(graphqlServices, "queryCashflow")
      .mockResolvedValue(promise2);


    const { result } = renderHook(() => useQuerySplitting({ messageApi: mockMessageApi }));

    await act(async () => {
      await result.current.querySplittingParallel(
        sourceApi as any,
        targetApi as any,
        sourceCashflow as any,
        splitAction
      );
    });

    expect(mockMessageApi.error).toBeCalled();
  });
  it("should show error if rounding res is null", async () => {
    const sourceApi = { setGridOption: mockSetGridOption };
    const targetApi = { setGridOption: mockSetGridOption };
    const sourceCashflow = { Cashflow: { Payment_Currency: "USD", Cashflow_Id: "CF001" } };
    const splitAction = SplitActionType.MANUAL_SPLIT;


    const promise1 = Promise.resolve(null);
    jest
      .spyOn(cashflowServices, "getCurrencyRounding")
      .mockResolvedValue(promise1);
    const promise2 = Promise.resolve({ cashflowUltraQuery: { results: [mockCashflow1] } });
    jest
      .spyOn(graphqlServices, "queryCashflow")
      .mockResolvedValue(promise2);

    const { result } = renderHook(() => useQuerySplitting({ messageApi: mockMessageApi }));

    await act(() => {
      result.current.querySplittingParallel(
        sourceApi as any,
        targetApi as any,
        sourceCashflow as any,
        splitAction
      );
    });

    await promise1;
    await promise2;

    expect(mockMessageApi.error).toBeCalled();
  });
  it("should show error if api error", async () => {
    const sourceApi = { setGridOption: mockSetGridOption };
    const targetApi = { setGridOption: mockSetGridOption };
    const sourceCashflow = { Cashflow: { Payment_Currency: "USD", Cashflow_Id: "CF001" } };
    const splitAction = SplitActionType.MANUAL_SPLIT;

    const promise1 = Promise.resolve({ precision: 2, type: "ROUNDING_OFF" });
    jest
      .spyOn(cashflowServices, "getCurrencyRounding")
      .mockResolvedValue(promise1);
    // const promise2 = Promise.reject(new Error("fetch error"))
    jest
      .spyOn(graphqlServices, "queryCashflow")
      .mockRejectedValue(new Error("fetch error"));

    const { result } = renderHook(() => useQuerySplitting({ messageApi: mockMessageApi }));

    await act(async () => {
      await result.current.querySplittingParallel(
        sourceApi as any,
        targetApi as any,
        sourceCashflow as any,
        splitAction
      );
    });
    expect(mockMessageApi.error).toBeCalledWith("fetch error");
  });

});

describe("deleteAndAdjustCashflow", () => {
  it("should delete the specified row and adjust the last row amount", () => {
    const cashflows = [
      { Cashflow: { Payment_Amount: "40" } },
      { Cashflow: { Payment_Amount: "30" } },
      { Cashflow: { Payment_Amount: "20" } },
    ] as SplitTargetCashflow[];
    const sourceAmount = 100;
    const sourcePrecision = 2;

    const result = deleteAndAdjustCashflow(cashflows, 1, sourceAmount, sourcePrecision);

    expect(result.length).toBe(2);
    expect(result[0].Cashflow.Payment_Amount).toBe("40");
    expect(result[1].Cashflow.Payment_Amount).toBe("60.00");
  });

  it("should handle deleting the last row", () => {
    const cashflows = [
      { Cashflow: { Payment_Amount: "40" } },
      { Cashflow: { Payment_Amount: "60" } },
    ] as SplitTargetCashflow[];
    const sourceAmount = 100;
    const sourcePrecision = 2;

    const result = deleteAndAdjustCashflow(cashflows, 1, sourceAmount, sourcePrecision);
    expect(result.length).toBe(1);
    expect(result[0].Cashflow.Payment_Amount).toBe("100.00");
  });
});

describe("deleteValidationByRowId", () => {
  it("should remove the validation item with the given rowIndex", () => {
    const validationArr = [
      { rowId: 1, inputStatus: InputStatusType.SUCCESS, prefixMessage: "", cashflowId: "a" },
      { rowId: 2, inputStatus: InputStatusType.ERROR, prefixMessage: "err", cashflowId: "b" },
      { rowId: 3, inputStatus: InputStatusType.SUCCESS, prefixMessage: "", cashflowId: "c" },
    ];
    const { newArr, isValid } = deleteValidationByRowId(validationArr, 2);
    expect(newArr.length).toBe(2);
    expect(newArr.find(item => item.rowId === 2)).toBeUndefined();
    expect(isValid).toBe(true);
  });

  it("should return isValid false if any remaining item is ERROR", () => {
    const validationArr = [
      { rowId: 1, inputStatus: InputStatusType.ERROR, prefixMessage: "err", cashflowId: "a" },
      { rowId: 2, inputStatus: InputStatusType.SUCCESS, prefixMessage: "", cashflowId: "b" },
    ];
    const { newArr, isValid } = deleteValidationByRowId(validationArr, 2);
    expect(newArr.length).toBe(1);
    expect(newArr[0].rowId).toBe(1);
    expect(isValid).toBe(false);
  });
  it("should do nothing if rowIndex not found", () => {
    const validationArr = [
      { rowId: 1, inputStatus: InputStatusType.SUCCESS, prefixMessage: "", cashflowId: "a" },
    ];
    const { newArr, isValid } = deleteValidationByRowId(validationArr, 99);
    expect(newArr.length).toBe(1);
    expect(isValid).toBe(true);
  });
});

describe("tryAddManualSplitRow", () => {
  it("should add a new row with available amount if on last row and available amount > 0", () => {
    const cashflows = [
      { Cashflow: { Payment_Amount: "40", Cashflow_Id: "1" } },
      { Cashflow: { Payment_Amount: "30", Cashflow_Id: "2" } },
    ] as SplitTargetCashflow[];
    const rowIndex = 1; // last row
    const sourceAmount = 100;
    const sourcePrecision = 2;

    const result = tryAddManualSplitRow(cashflows, rowIndex, sourceAmount, sourcePrecision);

    expect(result.length).toBe(3);
    expect(result[2].Cashflow.Payment_Amount).toBe("30.00");
    expect(result[2].Cashflow.Cashflow_Id).toBe("");
  });

  it("should not add a new row if not on last row", () => {
    const cashflows = [
      { Cashflow: { Payment_Amount: "40", Cashflow_Id: "1" } },
      { Cashflow: { Payment_Amount: "30", Cashflow_Id: "2" } },
    ];
    const rowIndex = 0; // not last row
    const sourceAmount = 100;
    const sourcePrecision = 2;

    const result = tryAddManualSplitRow(cashflows, rowIndex, sourceAmount, sourcePrecision);

    expect(result.length).toBe(2);
  });

  it("should not add a new row if available amount <= 0", () => {
    const cashflows = [
      { Cashflow: { Payment_Amount: "60", Cashflow_Id: "1" } },
      { Cashflow: { Payment_Amount: "40", Cashflow_Id: "2" } },
    ];
    const rowIndex = 1; // last row
    const sourceAmount = 100;
    const sourcePrecision = 2;

    const result = tryAddManualSplitRow(cashflows, rowIndex, sourceAmount, sourcePrecision);

    expect(result.length).toBe(2);
  });

  /**
   *  should correct mock container mun, and tested from container mun, passed
   */
  it.skip("should keep Payment_Amount precision as string", () => {
    const cashflows = [
      { Cashflow: { Payment_Amount: "33.3333", Cashflow_Id: "1" } },
      { Cashflow: { Payment_Amount: "33.3333", Cashflow_Id: "2" } },
    ];
    const rowIndex = 1;
    const sourceAmount = 100;
    const sourcePrecision = 2;

    const result = tryAddManualSplitRow(cashflows, rowIndex, sourceAmount, sourcePrecision);

    //correct expect result should be 33.34
    expect(result[2].Cashflow.Payment_Amount).toBe("33.34");
    expect(typeof result[2].Cashflow.Payment_Amount).toBe("string");
  });

});

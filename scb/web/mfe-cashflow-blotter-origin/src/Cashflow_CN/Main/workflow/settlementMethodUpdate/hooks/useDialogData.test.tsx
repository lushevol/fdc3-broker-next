import { configureStore, createReducer } from "@reduxjs/toolkit";
import { ReduxProviderWrapper, renderHook } from "@Test/test-utils";
import { act, waitFor } from "@testing-library/react";
import { openSettlementMethodUpdateDialogAction } from "src/Cashflow_CN/Main/store/actions";
import { queryCashflow } from "src/Cashflow_CN/services/graphql";

import { ResultStatus } from "../type";
import {
  assignResultToCashflowDisplay,
  cashflowEligibleFilter,
  queryGraqlFilter,
} from "../utils/filter";
import {
  setInitResultStatusToCashflowDisplay,
  setProcessingToCashflowDisplay,
} from "../utils/utils";
import {
  classifyCashflows,
  getCashflowsByTrade,
  useDialogData,
} from "./useDialogData";

jest.mock("src/Cashflow_CN/services/graphql", () => ({
  queryCashflow: jest.fn(),
}));

jest.mock("src/Cashflow_CN/Main/store/actions", () => ({
  openSettlementMethodUpdateDialogAction: jest.fn().mockReturnValue({
    type: "settlementMethodUpdate/openDialog",
    payload: {},
  }),
}));

jest.mock("../utils/filter", () => ({
  queryGraqlFilter: jest.fn().mockReturnValue([]),
  cashflowEligibleFilter: jest.fn(),
  assignResultToCashflowDisplay: jest.fn(),
  assignNotificationToCashflowDisplay: jest.fn(),
}));

jest.mock("../utils/utils", () => ({
  ...jest.requireActual("../utils/utils"),
  setProcessingToCashflowDisplay: jest.fn((c) => ({
    ...c,
    actionResult: { status: "Submiting", message: "" },
  })),
  setInitResultStatusToCashflowDisplay: jest.fn((c) => ({
    ...c,
    actionResult: { status: "None", message: "" },
  })),
}));

afterEach(() => {
  jest.clearAllMocks();
});

const buildCashflow = (id: string, tradeId = "7150113553") =>
  ({
    Trade_Id: tradeId,
    Settlement_Method: "GROSS",
    Cashflow: { Cashflow_Id: id, Cashflow_State: "READY" },
    Entity: {},
    Instrument_Common: { ISDA_Taxonomy: "ForeignExchange:Forward" },
    Data_Flow: { Data_Source_System: "Stella" },
  } as CNCashflow);

const buildDisplayCashflow = (id: string) => ({
  cashflowId: id,
  tradeId: "7150113553",
  settlementMethod: "GROSS",
  actionResult: { status: ResultStatus.None, message: "" },
});

const mockCashflowData = [buildCashflow("007372111189")];

const mockQueryResult = [
  buildCashflow("007372111189"),
  buildCashflow("007372111188"),
];

const mockEligibleResult = {
  eligibleForUpdate: {
    cashflows: [
      buildDisplayCashflow("007372111189"),
      buildDisplayCashflow("007372111188"),
    ],
  },
  insufficientForUpdate: { cashflows: [] },
};

const createWrapper = (cashflowData = mockCashflowData) => {
  const store = configureStore({
    reducer: {
      settlementMethodUpdateWorkflow: createReducer(
        {
          isOpenDialog: true,
          cashflowData,
          cashflowDataByTrade: cashflowData,
        },
        () => {}
      ),
    },
  });
  const wrapper = ReduxProviderWrapper(store);

  return { store, wrapper };
};

describe("getCashflowsByTrade", () => {
  it("should return empty array when data is empty", async () => {
    const result = await getCashflowsByTrade([]);
    expect(result).toEqual([]);
    expect(queryCashflow).not.toHaveBeenCalled();
  });

  it("should call queryCashflow with correct params when data is not empty", async () => {
    (queryCashflow as jest.Mock).mockResolvedValue({
      cashflowUltraQuery: { results: mockQueryResult },
    });

    const result = await getCashflowsByTrade(mockCashflowData);

    expect(queryGraqlFilter).toHaveBeenCalledWith(mockCashflowData);
    expect(queryCashflow).toHaveBeenCalledWith({
      filters: [],
      columnDefs: expect.any(Array),
      requireMandatoryFields: true,
      disabledDefault: true,
    });
    expect(result).toEqual(mockQueryResult);
  });

  it("should throw Error when queryCashflow throws", async () => {
    (queryCashflow as jest.Mock).mockRejectedValue(new Error("API Error"));
    await expect(getCashflowsByTrade(mockCashflowData)).rejects.toThrow(
      "Error occurred while query cashflows"
    );
  });
});

describe("classifyCashflows", () => {
  it("should return emptyCashflowEligibleResult when data is empty", () => {
    const result = classifyCashflows([]);
    expect(result).toEqual({
      eligibleForUpdate: { cashflows: [] },
      insufficientForUpdate: { cashflows: [] },
    });
    expect(cashflowEligibleFilter).not.toHaveBeenCalled();
  });

  it("should call cashflowEligibleFilter and return result when data is not empty", () => {
    (cashflowEligibleFilter as jest.Mock).mockReturnValue(mockEligibleResult);
    const result = classifyCashflows(mockQueryResult);
    expect(cashflowEligibleFilter).toHaveBeenCalledWith(mockQueryResult);
    expect(result).toEqual(mockEligibleResult);
  });
});

describe("useDialogData - initial state", () => {
  beforeEach(() => {
    (queryCashflow as jest.Mock).mockResolvedValue({
      cashflowUltraQuery: { results: [] },
    });
    (cashflowEligibleFilter as jest.Mock).mockReturnValue(mockEligibleResult);
  });

  it("should initialize classifiedCashflows as empty result", () => {
    const { wrapper } = createWrapper([]);
    const { result } = renderHook(() => useDialogData(), { wrapper });
    expect(result.current.classifiedCashflows).toEqual({
      eligibleForUpdate: { cashflows: [] },
      insufficientForUpdate: { cashflows: [] },
    });
  });

  it("should expose onActionResultHandler as function", () => {
    const { wrapper } = createWrapper([]);
    const { result } = renderHook(() => useDialogData(), { wrapper });
    expect(typeof result.current.onActionResultHandler).toBe("function");
  });
});

describe("useDialogData - useEffect", () => {
  it("should set isClassifyLoading to false after getCashflowsByTrade resolves with empty result", async () => {
    (queryCashflow as jest.Mock).mockResolvedValue({
      cashflowUltraQuery: { results: [] },
    });
    (cashflowEligibleFilter as jest.Mock).mockReturnValue({
      eligibleForUpdate: { cashflows: [] },
      insufficientForUpdate: { cashflows: [] },
    });

    const { wrapper } = createWrapper(mockCashflowData);
    const { result } = renderHook(() => useDialogData(), { wrapper });

    await waitFor(() => {
      expect(result.current.isClassifyLoading).toBe(false);
    });
  });

  it("should NOT dispatch when getAllCashflows is empty", async () => {
    (queryCashflow as jest.Mock).mockResolvedValue({
      cashflowUltraQuery: { results: [] },
    });

    const { wrapper } = createWrapper(mockCashflowData);
    renderHook(() => useDialogData(), { wrapper });

    await waitFor(() => {
      expect(openSettlementMethodUpdateDialogAction).not.toHaveBeenCalled();
    });
  });

  it("should NOT dispatch when cashflowData is empty", async () => {
    const { wrapper } = createWrapper([]);
    const { result } = renderHook(() => useDialogData(), { wrapper });

    await waitFor(() => {
      expect(result.current.isClassifyLoading).toBe(false);
    });
    expect(openSettlementMethodUpdateDialogAction).not.toHaveBeenCalled();
  });
});

describe("useDialogData - onActionResultHandler", () => {
  beforeEach(() => {
    (queryCashflow as jest.Mock).mockResolvedValue({
      cashflowUltraQuery: { results: mockQueryResult },
    });
    (cashflowEligibleFilter as jest.Mock).mockReturnValue(mockEligibleResult);
  });

  it("should set processing status for selected cashflowIds", async () => {
    const { wrapper } = createWrapper(mockCashflowData);
    const { result } = renderHook(() => useDialogData(), { wrapper });

    await waitFor(() => {
      expect(result.current.classifiedCashflows).toEqual(mockEligibleResult);
    });

    (assignResultToCashflowDisplay as jest.Mock).mockReturnValue(
      mockEligibleResult.eligibleForUpdate.cashflows
    );

    await act(async () => {
      await result.current.onActionResultHandler(
        ["007372111189"],
        Promise.resolve([
          {
            tradeId: "7150113553",
            cashflowIds: ["007372111189"],
            success: true,
            errorMessage: "",
          },
        ])
      );
    });

    expect(setProcessingToCashflowDisplay).toHaveBeenCalled();
  });

  it("should call assignResultToCashflowDisplay with result after promise resolves", async () => {
    const { wrapper } = createWrapper(mockCashflowData);
    const { result } = renderHook(() => useDialogData(), { wrapper });

    await waitFor(() => {
      expect(result.current.classifiedCashflows).toEqual(mockEligibleResult);
    });

    const mockResults = [
      {
        tradeId: "7150113553",
        cashflowIds: ["007372111189"],
        success: true,
        errorMessage: "",
      },
    ];
    (assignResultToCashflowDisplay as jest.Mock).mockReturnValue(
      mockEligibleResult.eligibleForUpdate.cashflows
    );

    let response: any;
    await act(async () => {
      response = await result.current.onActionResultHandler(
        ["007372111189"],
        Promise.resolve(mockResults)
      );
    });

    expect(assignResultToCashflowDisplay).toHaveBeenCalled();
    expect(response).toEqual(mockResults);
  });

  it("should reset status when resultPromise rejects and status is not NotificationUpdated", async () => {
    const { wrapper } = createWrapper(mockCashflowData);
    const { result } = renderHook(() => useDialogData(), { wrapper });

    await waitFor(() => {
      expect(result.current.classifiedCashflows).toEqual(mockEligibleResult);
    });

    await act(async () => {
      await result.current.onActionResultHandler(
        ["007372111189"],
        Promise.reject(new Error("Submit failed"))
      );
    });

    expect(setInitResultStatusToCashflowDisplay).toHaveBeenCalled();
  });

  it("should return empty array when resultPromise rejects", async () => {
    const { wrapper } = createWrapper(mockCashflowData);
    const { result } = renderHook(() => useDialogData(), { wrapper });

    await waitFor(() => {
      expect(result.current.classifiedCashflows).toEqual(mockEligibleResult);
    });

    let response: any;
    await act(async () => {
      response = await result.current.onActionResultHandler(
        ["007372111189"],
        Promise.reject(new Error("Submit failed"))
      );
    });

    expect(response).toEqual([]);
  });

  it("should keep onActionResultHandler referentially stable across renders", () => {
    const { wrapper } = createWrapper([]);
    const { result, rerender } = renderHook(() => useDialogData(), { wrapper });
    const firstRef = result.current.onActionResultHandler;
    rerender();
    expect(result.current.onActionResultHandler).toBe(firstRef);
  });
});

import { configureStore, createReducer } from "@reduxjs/toolkit";
import { ReduxProviderWrapper, renderHook } from "@Test/test-utils";
import { act, waitFor } from "@testing-library/react";
import { closeSettlementMethodUpdateDialogAction } from "src/Cashflow_CN/Main/store/actions";

import { handleDialogTitle } from "../utils/utils";
import { useDialogController } from "./useDialogController";

vi.mock("src/Cashflow_CN/Main/store/actions", () => ({
  closeSettlementMethodUpdateDialogAction: vi.fn().mockReturnValue({
    type: "settlementMethodUpdate/closeDialog",
    payload: {},
  }),
}));

vi.mock("../utils/utils", () => ({
  handleDialogTitle: vi.fn(),
  BULK_UPDATE_LIMIT: 100,
}));

afterEach(() => {
  vi.clearAllMocks();
});

const buildCashflow = (id: string) => ({
  cashflowId: id,
  tradeId: "7150113553",
  settlementMethod: "GROSS",
  actionResult: { status: 0, message: "" },
});
const mockCashflowData = [buildCashflow("007372111189")];

const createWrapper = ({
  cashflowData = mockCashflowData,
  cashflowDataByTrade = mockCashflowData,
} = {}) => {
  const store = configureStore({
    reducer: {
      settlementMethodUpdateWorkflow: createReducer(
        {
          isOpenDialog: true,
          cashflowData,
          cashflowDataByTrade,
        },
        () => {}
      ),
    },
  });
  const wrapper = ReduxProviderWrapper(store);

  return { store, wrapper };
};

describe("useDialogController - initial state", () => {
  it("should initialize title as 'Settlement Method Update'", () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useDialogController(), { wrapper });
    expect(result.current.title).toBe("Settlement Method Update");
  });

  it("should initialize isLimit as false", () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useDialogController(), { wrapper });
    expect(result.current.isLimit).toBe(false);
  });

  it("should expose closeDialog as function", () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useDialogController(), { wrapper });
    expect(typeof result.current.closeDialog).toBe("function");
  });

  it("should expose messageApi", () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useDialogController(), { wrapper });
    expect(result.current.messageApi).toBeDefined();
  });

  it("should expose messageContextHolder", () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useDialogController(), { wrapper });
    expect(result.current.messageContextHolder).toBeDefined();
  });
});

describe("useDialogController - isOpenDialog", () => {
  it("should return isOpenDialog as true from store", () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useDialogController(), { wrapper });
    expect(result.current.isOpenDialog).toBe(true);
  });
});

describe("useDialogController - closeDialog", () => {
  it("should dispatch closeSettlementMethodUpdateDialogAction when closeDialog is called", () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useDialogController(), { wrapper });

    act(() => {
      result.current.closeDialog();
    });

    expect(closeSettlementMethodUpdateDialogAction).toHaveBeenCalledTimes(1);
  });

  it("should keep closeDialog referentially stable across renders", () => {
    const { wrapper } = createWrapper();
    const { result, rerender } = renderHook(() => useDialogController(), {
      wrapper,
    });
    const firstRef = result.current.closeDialog;
    rerender();
    expect(result.current.closeDialog).toBe(firstRef);
  });
});

describe("useDialogController - useEffect isLimit", () => {
  it("should set isLimit to true when cashflowDataByTrade.length > 100", async () => {
    const cashflowDataByTrade = Array.from({ length: 101 }, (_, i) =>
      buildCashflow(`id_${i}`)
    );
    const { wrapper } = createWrapper({
      cashflowData: cashflowDataByTrade,
      cashflowDataByTrade,
    });
    const { result } = renderHook(() => useDialogController(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLimit).toBe(true);
    });
  });

  it("should NOT set isLimit when cashflowDataByTrade.length === 100", async () => {
    const cashflowDataByTrade = Array.from({ length: 100 }, (_, i) =>
      buildCashflow(`id_${i}`)
    );
    const { wrapper } = createWrapper({
      cashflowData: cashflowDataByTrade,
      cashflowDataByTrade,
    });
    const { result } = renderHook(() => useDialogController(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLimit).toBe(false);
    });
  });

  it("should NOT set isLimit when cashflowDataByTrade.length < 100", async () => {
    const cashflowDataByTrade = [buildCashflow("id_1")];
    const { wrapper } = createWrapper({
      cashflowData: cashflowDataByTrade,
      cashflowDataByTrade,
    });
    const { result } = renderHook(() => useDialogController(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLimit).toBe(false);
    });
  });

  it("should NOT set isLimit when cashflowDataByTrade is empty", async () => {
    const { wrapper } = createWrapper({
      cashflowData: [],
      cashflowDataByTrade: [],
    });
    const { result } = renderHook(() => useDialogController(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLimit).toBe(false);
    });
  });
});

describe("useDialogController - useEffect title", () => {
  it("should call handleDialogTitle when cashflowData.length !== cashflowDataByTrade.length", async () => {
    const cashflowData = [buildCashflow("id_1")];
    const cashflowDataByTrade = [buildCashflow("id_1"), buildCashflow("id_2")];
    (handleDialogTitle as vi.Mock).mockReturnValue(<span>Custom Title</span>);

    const { wrapper } = createWrapper({ cashflowData, cashflowDataByTrade });
    renderHook(() => useDialogController(), { wrapper });

    await waitFor(() => {
      expect(handleDialogTitle).toHaveBeenCalledWith(cashflowDataByTrade);
    });
  });

  it("should update title to ReactNode returned by handleDialogTitle", async () => {
    const cashflowData = [buildCashflow("id_1")];
    const cashflowDataByTrade = [buildCashflow("id_1"), buildCashflow("id_2")];
    (handleDialogTitle as vi.Mock).mockReturnValue(<span>Custom Title</span>);

    const { wrapper } = createWrapper({ cashflowData, cashflowDataByTrade });
    const { result } = renderHook(() => useDialogController(), { wrapper });

    await waitFor(() => {
      expect(result.current.title).toEqual(<span>Custom Title</span>);
    });
  });

  it("should NOT call handleDialogTitle when cashflowData.length === cashflowDataByTrade.length", async () => {
    const cashflowData = [buildCashflow("id_1")];
    const cashflowDataByTrade = [buildCashflow("id_1")];

    const { wrapper } = createWrapper({ cashflowData, cashflowDataByTrade });
    renderHook(() => useDialogController(), { wrapper });

    await waitFor(() => {
      expect(handleDialogTitle).not.toHaveBeenCalled();
    });
  });

  it("should keep title as default string when lengths are equal", async () => {
    const cashflowData = [buildCashflow("id_1")];
    const cashflowDataByTrade = [buildCashflow("id_1")];

    const { wrapper } = createWrapper({ cashflowData, cashflowDataByTrade });
    const { result } = renderHook(() => useDialogController(), { wrapper });

    await waitFor(() => {
      expect(result.current.title).toBe("Settlement Method Update");
    });
  });

  it("should NOT call handleDialogTitle when both cashflowData and cashflowDataByTrade are empty", async () => {
    const { wrapper } = createWrapper({
      cashflowData: [],
      cashflowDataByTrade: [],
    });
    renderHook(() => useDialogController(), { wrapper });

    await waitFor(() => {
      expect(handleDialogTitle).not.toHaveBeenCalled();
    });
  });
});

describe("useDialogController - useEffect both conditions", () => {
  it("should set isLimit=true AND update title when length>100 and lengths differ", async () => {
    const cashflowData = [buildCashflow("id_1")];
    const cashflowDataByTrade = Array.from({ length: 101 }, (_, i) =>
      buildCashflow(`id_${i}`)
    );
    (handleDialogTitle as vi.Mock).mockReturnValue(<span>Large Title</span>);

    const { wrapper } = createWrapper({ cashflowData, cashflowDataByTrade });
    const { result } = renderHook(() => useDialogController(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLimit).toBe(true);
      expect(result.current.title).toEqual(<span>Large Title</span>);
    });
  });
});

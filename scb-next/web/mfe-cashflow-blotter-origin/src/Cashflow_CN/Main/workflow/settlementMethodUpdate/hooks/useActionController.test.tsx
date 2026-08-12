import { configureStore, createReducer } from "@reduxjs/toolkit";
import { ReduxProviderWrapper, renderHook } from "@Test/test-utils";
import { act } from "@testing-library/react";
import { openWithCurrentStateSettlementMethodUpdateDialogAction } from "src/Cashflow_CN/Main/store/actions";
import { useContainerDispatcher } from "src/Root/import";
import { submitAsyncTask } from "src/Root/NotificationCenter";

import { ResultStatus } from "../type";
import { submitResultFeedback } from "../utils/utils";
import { useActionController } from "./useActionController";

vi.mock("src/Root/rtk-query/baseGraphQLApi", async () => ({
  baseGraphQLApi: {
    injectEndpoints: vi.fn().mockReturnValue({ endpoints: {} }),
    reducerPath: "graphqlApi",
    reducer: (state = {}) => state,
  },
}));

vi.mock("src/Cashflow_CN/Main/store/reducers", async () => {
  const { createReducer: cr } = require("@reduxjs/toolkit");
  return {
    __esModule: true,
    default: cr({}, () => {}),
  };
});

vi.mock("src/Cashflow_CN/Main/store/actions", async () => ({
  openWithCurrentStateSettlementMethodUpdateDialogAction: jest
    .fn()
    .mockReturnValue({
      type: "settlementMethodUpdate/openWithCurrentState",
      payload: {},
    }),
}));

vi.mock("src/Root/import", async () => ({
  useContainerDispatcher: vi.fn(),
}));

vi.mock("src/Root/NotificationCenter", async () => ({
  submitAsyncTask: vi.fn(),
}));

vi.mock("../utils/utils", async () => ({
  submitResultFeedback: vi.fn(),
}));

vi.mock("./useSubmit", async () => ({
  useSubmit: vi.fn(() => ({
    submit: mockSubmit,
    isSubmitting: false,
  })),
}));

vi.mock("react-redux", async () => ({
  ...(await vi.importActual("react-redux")),
  useDispatch: () => mockDispatch,
}));

afterEach(() => {
  vi.clearAllMocks();
});

const mockDispatch = vi.fn();
const mockDispatchLoading = vi.fn();
const mockSubmit = vi.fn();

vi.mock("react-redux", async () => ({
  ...(await vi.importActual("react-redux")),
  useDispatch: () => mockDispatch,
}));

const mockEligibleCashflows = [
  {
    cashflowId: "007372111189",
    tradeId: "7150113553",
    settlementMethod: "GROSS",
    actionResult: { status: ResultStatus.None, message: "" },
  },
  {
    cashflowId: "007372111188",
    tradeId: "7150113556",
    settlementMethod: "GROSS",
    actionResult: { status: ResultStatus.None, message: "" },
  },
];

const mockClassifiedCashflows = {
  eligibleForUpdate: { cashflows: mockEligibleCashflows },
  insufficientForUpdate: { cashflows: [] },
};

const mockResponse = [
  {
    tradeId: "7150113553",
    cashflowIds: ["007372111189"],
    success: true,
    errorMessage: "",
  },
  {
    tradeId: "7150113556",
    cashflowIds: ["007372111188"],
    success: false,
    errorMessage: "Error",
  },
];

const createWrapper = () => {
  const store = configureStore({
    reducer: {
      settlementMethodUpdateWorkflow: createReducer(
        { isOpenDialog: true, cashflowData: [], cashflowDataByTrade: [] },
        () => {}
      ),
    },
  });
  const wrapper = ReduxProviderWrapper(store);
  return { store, wrapper };
};

const buildHookProps = (overrides: any = {}) => ({
  messageApi: { error: vi.fn() },
  classifiedCashflows: mockClassifiedCashflows,
  submitExtraForm: vi.fn().mockReturnValue({ comment: "" }),
  onActionResultHandler: vi.fn().mockResolvedValue(mockResponse),
  closeDialog: vi.fn(),
  ...overrides,
});

beforeEach(() => {
  mockSubmit.mockResolvedValue(mockResponse);
  (useContainerDispatcher as vi.Mock).mockReturnValue({
    dispacthLoading: mockDispatchLoading,
  });
  (submitResultFeedback as vi.Mock).mockReturnValue({
    type: "warning",
    content: "1 trades succeed !\n1 trades failed !",
  });
});

describe("useActionController - initial state", () => {
  it("should expose onClickAction as function", () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useActionController(buildHookProps()), {
      wrapper,
    });
    expect(typeof result.current.onClickAction).toBe("function");
  });

  it("should compute updateCashflowIds from eligibleForUpdate cashflows", () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useActionController(buildHookProps()), {
      wrapper,
    });
    expect(typeof result.current.onClickAction).toBe("function");
  });
});

describe("useActionController - onClickAction success", () => {
  it("should call onActionResultHandler with correct cashflowIds", async () => {
    const { wrapper } = createWrapper();
    const props = buildHookProps();
    const { result } = renderHook(() => useActionController(props), {
      wrapper,
    });

    await act(async () => {
      await result.current.onClickAction();
    });

    expect(props.onActionResultHandler).toHaveBeenCalledWith(
      ["007372111189", "007372111188"],
      expect.any(Promise)
    );
  });

  it("should call submit once", async () => {
    const { wrapper } = createWrapper();
    const props = buildHookProps();
    const { result } = renderHook(() => useActionController(props), {
      wrapper,
    });

    await act(async () => {
      await result.current.onClickAction();
    });

    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });

  it("should call submitAsyncTask with processor and notify", async () => {
    const { wrapper } = createWrapper();
    const props = buildHookProps();
    const { result } = renderHook(() => useActionController(props), {
      wrapper,
    });

    await act(async () => {
      await result.current.onClickAction();
    });

    expect(submitAsyncTask).toHaveBeenCalledWith(
      expect.objectContaining({
        processor: expect.any(Promise),
        notify: expect.any(Function),
      })
    );
  });

  it("should call closeDialog after submitAsyncTask", async () => {
    const { wrapper } = createWrapper();
    const props = buildHookProps();
    const { result } = renderHook(() => useActionController(props), {
      wrapper,
    });

    await act(async () => {
      await result.current.onClickAction();
    });

    expect(props.closeDialog).toHaveBeenCalledTimes(1);
  });

  it("should call dispacthLoading(false) after setTimeout", async () => {
    vi.useFakeTimers();
    const { wrapper } = createWrapper();
    const props = buildHookProps();
    const { result } = renderHook(() => useActionController(props), {
      wrapper,
    });

    await act(async () => {
      await result.current.onClickAction();
    });

    act(() => {
      vi.runAllTimers();
    });

    expect(mockDispatchLoading).toHaveBeenCalledWith(false);
    vi.useRealTimers();
  });

  it("should NOT call messageApi.error on success", async () => {
    const { wrapper } = createWrapper();
    const props = buildHookProps();
    const { result } = renderHook(() => useActionController(props), {
      wrapper,
    });

    await act(async () => {
      await result.current.onClickAction();
    });

    expect(props.messageApi.error).not.toHaveBeenCalled();
  });
});

describe("useActionController - notify isSuccess=true", () => {
  it("should return correct notification shape", async () => {
    let capturedNotify: any;
    (submitAsyncTask as vi.Mock).mockImplementation(({ notify }) => {
      capturedNotify = notify;
    });

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useActionController(buildHookProps()), {
      wrapper,
    });

    await act(async () => {
      await result.current.onClickAction();
    });

    const notification = capturedNotify({
      data: mockResponse,
      isSuccess: true,
    });

    expect(notification.title).toBe("Settlement Method Update Task Done");
    expect(notification.description).toBe(
      "1 trades succeed !\n1 trades failed !"
    );
    expect(notification.type).toBe("warning");
    expect(typeof notification.onClick).toBe("function");
  });

  it("should call submitResultFeedback with response data", async () => {
    let capturedNotify: any;
    (submitAsyncTask as vi.Mock).mockImplementation(({ notify }) => {
      capturedNotify = notify;
    });

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useActionController(buildHookProps()), {
      wrapper,
    });

    await act(async () => {
      await result.current.onClickAction();
    });

    capturedNotify({ data: mockResponse, isSuccess: true });
    expect(submitResultFeedback).toHaveBeenCalledWith(mockResponse);
  });

  it("should dispatch openWithCurrentState when onClick called", async () => {
    let capturedNotify: any;
    (submitAsyncTask as vi.Mock).mockImplementation(({ notify }) => {
      capturedNotify = notify;
    });

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useActionController(buildHookProps()), {
      wrapper,
    });

    await act(async () => {
      await result.current.onClickAction();
    });

    const notification = capturedNotify({
      data: mockResponse,
      isSuccess: true,
    });
    notification.onClick();

    expect(mockDispatch).toHaveBeenCalledWith(
      openWithCurrentStateSettlementMethodUpdateDialogAction()
    );
  });
});

describe("useActionController - notify isSuccess=false", () => {
  it("should return correct notification shape", async () => {
    let capturedNotify: any;
    (submitAsyncTask as vi.Mock).mockImplementation(({ notify }) => {
      capturedNotify = notify;
    });

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useActionController(buildHookProps()), {
      wrapper,
    });

    await act(async () => {
      await result.current.onClickAction();
    });

    const notification = capturedNotify({ data: null, isSuccess: false });

    expect(notification.title).toBe("Settlement Method Update Task Failed");
    expect(typeof notification.onClick).toBe("function");
    expect(notification.description).toBeUndefined();
  });

  it("should NOT call submitResultFeedback", async () => {
    let capturedNotify: any;
    (submitAsyncTask as vi.Mock).mockImplementation(({ notify }) => {
      capturedNotify = notify;
    });

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useActionController(buildHookProps()), {
      wrapper,
    });

    await act(async () => {
      await result.current.onClickAction();
    });

    capturedNotify({ data: null, isSuccess: false });
    expect(submitResultFeedback).not.toHaveBeenCalled();
  });

  it("should dispatch openWithCurrentState when onClick called", async () => {
    let capturedNotify: any;
    (submitAsyncTask as vi.Mock).mockImplementation(({ notify }) => {
      capturedNotify = notify;
    });

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useActionController(buildHookProps()), {
      wrapper,
    });

    await act(async () => {
      await result.current.onClickAction();
    });

    const notification = capturedNotify({ data: null, isSuccess: false });
    notification.onClick();

    expect(mockDispatch).toHaveBeenCalledWith(
      openWithCurrentStateSettlementMethodUpdateDialogAction()
    );
  });
});

describe("useActionController - updateCashflowIds", () => {
  it("should handle empty eligibleForUpdate cashflows", async () => {
    const { wrapper } = createWrapper();
    const props = buildHookProps({
      classifiedCashflows: {
        eligibleForUpdate: { cashflows: [] },
        insufficientForUpdate: { cashflows: [] },
      },
    });
    const { result } = renderHook(() => useActionController(props), {
      wrapper,
    });

    await act(async () => {
      await result.current.onClickAction();
    });

    expect(props.onActionResultHandler).toHaveBeenCalledWith(
      [],
      expect.any(Promise)
    );
  });

  it("should convert cashflowId to string", async () => {
    const { wrapper } = createWrapper();
    const props = buildHookProps({
      classifiedCashflows: {
        eligibleForUpdate: {
          cashflows: [
            {
              cashflowId: 123,
              tradeId: "7150113553",
              settlementMethod: "GROSS",
            },
          ],
        },
        insufficientForUpdate: { cashflows: [] },
      },
    });
    const { result } = renderHook(() => useActionController(props), {
      wrapper,
    });

    await act(async () => {
      await result.current.onClickAction();
    });

    expect(props.onActionResultHandler).toHaveBeenCalledWith(
      ["123"],
      expect.any(Promise)
    );
  });
});

import { act, renderHook } from "@Test/test-utils";
import { postSettlementMethodUpdate } from "src/Cashflow_CN/services";

import { ResultStatus } from "../type";
import { handlePayload } from "../utils/utils";
import { useSubmit } from "./useSubmit";

jest.mock("src/Cashflow_CN/services", () => ({
  postSettlementMethodUpdate: jest.fn(),
}));

jest.mock("../utils/utils", () => ({
  handlePayload: jest.fn(),
}));

afterAll(() => {
  jest.clearAllMocks();
});

const mockFormPayload = {
  comment: "test comment",
};

const mockPostBody = {
  trades: [{ tradeId: "7150113553", cashflowIds: ["007372111189"] }],
  settlementMethod: "UTIL",
  comment: "test comment",
};

const mockResponse = [
  {
    tradeId: "7150113553",
    cashflowIds: ["007372111189"],
    success: true,
    errorMessage: "",
  },
];

const mockClassifiedCashflows = {
  eligibleForUpdate: {
    cashflows: [
      {
        cashflowId: "007372111189",
        tradeId: "7150113553",
        settlementMethod: "GROSS",
        actionResult: { status: ResultStatus.None, message: "" },
      },
    ],
  },
  insufficientForUpdate: { cashflows: [] },
};

const buildHookProps = (overrides: any = {}) => ({
  classifiedCashflows: mockClassifiedCashflows,
  submitExtraForm: jest.fn().mockReturnValue(mockFormPayload),
  ...overrides,
});

describe("useSubmit - initial state", () => {
  it("should initialize isSubmitting as false", () => {
    const { result } = renderHook(() => useSubmit(buildHookProps()));
    expect(result.current.isSubmitting).toBe(false);
  });

  it("should expose submit function", () => {
    const { result } = renderHook(() => useSubmit(buildHookProps()));
    expect(typeof result.current.submit).toBe("function");
  });
});

describe("useSubmit - submit success", () => {
  beforeEach(() => {
    (handlePayload as jest.Mock).mockReturnValue(mockPostBody);
    (postSettlementMethodUpdate as jest.Mock).mockResolvedValue(mockResponse);
  });

  it("should set isSubmitting to true during submission", async () => {
    let submittingDuring = false;
    (postSettlementMethodUpdate as jest.Mock).mockImplementation(async () => {
      submittingDuring = true;
      return mockResponse;
    });

    const { result } = renderHook(() => useSubmit(buildHookProps()));

    await act(async () => {
      await result.current.submit();
    });

    expect(submittingDuring).toBe(true);
  });

  it("should set isSubmitting back to false after submission", async () => {
    const { result } = renderHook(() => useSubmit(buildHookProps()));

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.isSubmitting).toBe(false);
  });

  it("should call submitExtraForm once", async () => {
    const submitExtraForm = jest.fn().mockResolvedValue(mockFormPayload);
    const { result } = renderHook(() =>
      useSubmit(buildHookProps({ submitExtraForm }))
    );

    await act(async () => {
      await result.current.submit();
    });

    expect(submitExtraForm).toHaveBeenCalledTimes(1);
  });

  it("should call handlePayload with correct args", async () => {
    const { result } = renderHook(() => useSubmit(buildHookProps()));

    await act(async () => {
      await result.current.submit();
    });

    expect(handlePayload).toHaveBeenCalledWith(
      mockClassifiedCashflows.eligibleForUpdate.cashflows,
      mockFormPayload
    );
  });

  it("should call postSettlementMethodUpdate with postBody", async () => {
    const { result } = renderHook(() => useSubmit(buildHookProps()));

    await act(async () => {
      await result.current.submit();
    });

    expect(postSettlementMethodUpdate).toHaveBeenCalledWith(mockPostBody);
  });

  it("should return response from postSettlementMethodUpdate", async () => {
    const { result } = renderHook(() => useSubmit(buildHookProps()));

    let response: any;
    await act(async () => {
      response = await result.current.submit();
    });

    expect(response).toEqual(mockResponse);
  });
});

describe("useSubmit - formPayload is undefined", () => {
  it("should throw error when submitExtraForm returns undefined", async () => {
    const submitExtraForm = jest.fn().mockReturnValue(undefined);
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() =>
      useSubmit(buildHookProps({ submitExtraForm }))
    );

    await act(async () => {
      await expect(result.current.submit()).rejects.toThrow(
        "Form payload is missing. Please complete the form before submitting."
      );
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message:
          "Form payload is missing. Please complete the form before submitting.",
      })
    );
    consoleSpy.mockRestore();
  });

  it("should set isSubmitting back to false when formPayload is undefined", async () => {
    const submitExtraForm = jest.fn().mockReturnValue(undefined);
    jest.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() =>
      useSubmit(buildHookProps({ submitExtraForm }))
    );

    await act(async () => {
      await result.current.submit().catch(() => {});
    });

    expect(result.current.isSubmitting).toBe(false);
  });
});

describe("useSubmit - postSettlementMethodUpdate throws", () => {
  beforeEach(() => {
    (handlePayload as jest.Mock).mockReturnValue(mockPostBody);
    (postSettlementMethodUpdate as jest.Mock).mockRejectedValue(
      new Error("Network Error")
    );
  });

  it("should throw error when postSettlementMethodUpdate fails", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result } = renderHook(() => useSubmit(buildHookProps()));

    await act(async () => {
      await expect(result.current.submit()).rejects.toThrow("Network Error");
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Network Error" })
    );
    consoleSpy.mockRestore();
  });

  it("should set isSubmitting back to false when postSettlementMethodUpdate fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useSubmit(buildHookProps()));

    await act(async () => {
      await result.current.submit().catch(() => {});
    });

    expect(result.current.isSubmitting).toBe(false);
  });
});

describe("useSubmit - submitExtraForm throws", () => {
  it("should throw error when submitExtraForm rejects", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const submitExtraForm = jest
      .fn()
      .mockImplementation(() => { throw new Error("Form Error"); });

    const { result } = renderHook(() =>
      useSubmit(buildHookProps({ submitExtraForm }))
    );

    await act(async () => {
      await expect(result.current.submit()).rejects.toThrow("Form Error");
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Form Error" })
    );
    consoleSpy.mockRestore();
  });

  it("should set isSubmitting back to false when submitExtraForm throws", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const submitExtraForm = jest
      .fn()
      .mockImplementation(() => { throw new Error("Form Error"); });

    const { result } = renderHook(() =>
      useSubmit(buildHookProps({ submitExtraForm }))
    );

    await act(async () => {
      await result.current.submit().catch(() => {});
    });

    expect(result.current.isSubmitting).toBe(false);
  });
});

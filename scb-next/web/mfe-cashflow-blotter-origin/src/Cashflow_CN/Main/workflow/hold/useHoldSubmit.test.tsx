import { act, renderHook, screen } from "@testing-library/react";
import { message } from "antd";
import * as cashflowServices from "src/Cashflow_CN/services";
import { mockCashflow1 } from "src/Cashflow_CN/test/mockData/cashflow";

import { ResponseCode } from "../earlyMaterialization/interface";
import { HoldActionName } from "./index";
import { useHoldSubmit } from "./useHoldSubmit";

// mock services
vi.mock("src/Cashflow_CN/services", () => ({
  cashflowHold: vi.fn(),
  cashflowUnhold: vi.fn(),
  cashflowUserStatusUpdate: vi.fn(),
}));

const { cashflowHold, cashflowUnhold, cashflowUserStatusUpdate } = cashflowServices;

describe("useHoldSubmit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle HOLD success", async () => {
    cashflowHold.mockResolvedValue({ status: 200 });
    const { result } = renderHook(() =>
      useHoldSubmit([mockCashflow1], HoldActionName.HOLD, message)
    );
    const res = await act(() => result.current.handleSubmit("comment"));
    expect(cashflowHold).toHaveBeenCalled();
    const successTag = screen.getByText("Hold successfully submitted");
    expect(successTag).toBeInTheDocument();
    expect(res).toBe(true);
  });

  it("should handle HOLD failure", async () => {
    cashflowHold.mockResolvedValue({ status: 500, errorMessage: "fail" });
    const { result } = renderHook(() =>
      useHoldSubmit([mockCashflow1], HoldActionName.HOLD, message)
    );
    const res = await act(() => result.current.handleSubmit("comment"));
    const messageTag = screen.getByText("fail");
    expect(messageTag).toBeInTheDocument();
    expect(res).toBe(false);
  });

    it("should handle HOLD failure with api rejected", async () => {
    cashflowHold.mockRejectedValue(new Error("fail"));
    const { result } = renderHook(() =>
      useHoldSubmit([mockCashflow1], HoldActionName.HOLD, message)
    );
    const res = await act(() => result.current.handleSubmit("comment"));
    const messageTag = screen.getByText("fail");
    expect(messageTag).toBeInTheDocument();
    expect(res).toBe(false);
  });

  it("should handle UNHOLD success", async () => {
    cashflowUnhold.mockResolvedValue({ status: 200 });
    const { result } = renderHook(() =>
      useHoldSubmit([mockCashflow1], HoldActionName.UNHOLD, message)
    );
    const res = await act(() => result.current.handleSubmit("comment"));
    const messageTag = screen.getByText("Unhold successfully submitted!");
    expect(messageTag).toBeInTheDocument();
    expect(res).toBe(true);
  });

  it("should handle UNHOLD failed with api success", async () => {
    cashflowUnhold.mockResolvedValue({ status: 500, errorMessage: "unhold fail" });
    const { result } = renderHook(() =>
      useHoldSubmit([mockCashflow1], HoldActionName.UNHOLD, message)
    );
    const res = await act(() => result.current.handleSubmit("comment"));
    const messageTag = screen.getByText("unhold fail");
    expect(messageTag).toBeInTheDocument();
    expect(res).toBe(false);
  });

  it("should handle UNHOLD failed with api rejected", async () => {
    cashflowUnhold.mockRejectedValue(new Error("unhold fail"));
    const { result } = renderHook(() =>
      useHoldSubmit([mockCashflow1], HoldActionName.UNHOLD, message)
    );
    const res = await act(() => result.current.handleSubmit("comment"));
    const messageTag = screen.getByText("unhold fail");
    expect(messageTag).toBeInTheDocument();
    expect(res).toBe(false);
  });

  it("should handle SEND_TO_WAITING success", async () => {
    cashflowUserStatusUpdate.mockResolvedValue({
      success: true,
      errorMessage: null,
      responses: [],
    });
    const { result } = renderHook(() =>
      useHoldSubmit([mockCashflow1], HoldActionName.SEND_TO_WAITING, message)
    );
    const res = await act(() => result.current.handleSubmit("comment"));
    const messageTag = screen.getByText("Send To WAITING Action Success!");
    expect(messageTag).toBeInTheDocument();
    expect(res).toBe(true);
  });

  it("should handle SEND_TO_WAITING failure", async () => {
    cashflowUserStatusUpdate.mockResolvedValue({
      success: false,
      errorMessage: null,
      responses: [
        {
          cashflowId: "1",
          errorMessage: "fail",
          success: false,
        },
      ],
    });
    const { result } = renderHook(() =>
      useHoldSubmit([mockCashflow1], HoldActionName.SEND_TO_WAITING, message)
    );
    const res = await act(() => result.current.handleSubmit("comment"));
    const messageTag = screen.getByText("1 failed: fail");
    expect(messageTag).toBeInTheDocument();
    expect(res).toBe(false);
  });

    it("should handle SEND_TO_WAITING failure with api rejected", async () => {
    cashflowUserStatusUpdate.mockRejectedValue(new Error("api fail"));
    const { result } = renderHook(() =>
      useHoldSubmit([mockCashflow1], HoldActionName.SEND_TO_WAITING, message)
    );
    const res = await act(() => result.current.handleSubmit("comment"));
    const messageTag = screen.getByText("Send To WAITING action failed");
    expect(messageTag).toBeInTheDocument();
    expect(res).toBe(false);
  });

  it("should handle unknown action", async () => {
    const { result } = renderHook(() =>
      useHoldSubmit([mockCashflow1], "UNKNOWN_ACTION", message)
    );
    const res = await act(() => result.current.handleSubmit("comment"));
    const messageTag = screen.getByText("No match action");
    expect(messageTag).toBeInTheDocument();
    expect(res).toBe(false);
  });
});

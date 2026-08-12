import { message } from "antd";
import { MessageInstance } from "antd/es/message/interface";
import {
  RuleMutationResponse,
} from "src/Cashflow_Splitting_Static/services/api.type";

import { ActionType } from "../../state/types";
import { generateMessage } from "./useDataGrid";

vi.mock("antd", () => {
  return {
    message: {
      info: vi.fn(),
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      loading: vi.fn(),
      open: vi.fn(),
      destroy: vi.fn(),
    } as MessageInstance,
    modalApi: {
      info: vi.fn(),
      success: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      warning: vi.fn(),
      confirm: vi.fn(),
    },
    // Table: () => <div>Table</div>,
    // Form: () => <div>Form</div>,
  };
});

describe("generateMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show success for single fulfilled result with status 200", () => {
    const results = [
      { status: "fulfilled", value: { status: 200, errorMessage: "ok" } },
    ] as PromiseSettledResult<RuleMutationResponse>[];
    generateMessage(results, ActionType.Delete);
    expect(message.success).toHaveBeenCalledWith("ok");
    expect(message.error).not.toHaveBeenCalled();
  });

  it("should show error for single fulfilled result with status not 200", () => {
    const results = [
      { status: "fulfilled", value: { status: 500, errorMessage: "fail" } },
    ] as PromiseSettledResult<RuleMutationResponse>[];
    generateMessage(results, ActionType.RejectCreation);
    expect(message.error).toHaveBeenCalledWith("fail");
    expect(message.success).not.toHaveBeenCalled();
  });

  it("should show error for single rejected result", () => {
    const results = [{ status: "rejected", reason: "network error" }] as PromiseSettledResult<RuleMutationResponse>[];
    generateMessage(results, ActionType.RejectDelete);
    expect(message.error).toHaveBeenCalledWith(`${ActionType.RejectDelete} Failed`);
    expect(message.success).not.toHaveBeenCalled();
  });

  it("should show success for all multi fulfilled status 200", () => {
    const results = [
      { status: "fulfilled", value: { status: 200, errorMessage: "ok" } },
      { status: "fulfilled", value: { status: 200, errorMessage: "ok2" } },
    ] as PromiseSettledResult<RuleMutationResponse>[];
    generateMessage(results, ActionType.Delete);
    expect(message.success).toHaveBeenCalledWith(`2 Rules ${ActionType.Delete} Success!`);
    expect(message.error).not.toHaveBeenCalled();
  });

  it("should show error for partial success in multi results", () => {
    const results = [
      { status: "fulfilled", value: { status: 200, errorMessage: "ok" } },
      { status: "fulfilled", value: { status: 500, errorMessage: "fail" } },
      { status: "fulfilled", value: { status: 500, errorMessage: "fail2" } },
    ] as PromiseSettledResult<RuleMutationResponse>[];
    generateMessage(results, ActionType.Delete);
    expect(message.error).toHaveBeenCalledWith(`1 Rules ${ActionType.Delete} Success, 2 Rules ${ActionType.Delete} Failed`);
    expect(message.success).not.toHaveBeenCalled();
  });

  it("should show error for all failed in multi results", () => {
    const results = [
      { status: "fulfilled", value: { status: 500, errorMessage: "fail" } },
      { status: "fulfilled", value: { status: 500, errorMessage: "fail2" } },
    ] as PromiseSettledResult<RuleMutationResponse>[];
    generateMessage(results, ActionType.Delete);
    expect(message.error).toHaveBeenCalledWith(`2 Rules ${ActionType.Delete} Failed`);
  });
});
import { act, renderHook } from "@testing-library/react";
import { postService } from "../../../hooks/service";
import useAdminRequest from "./useAdminRequest";

vi.mock("../../../hooks/service", () => ({
  postService: vi.fn(),
}));

const mockedPostService = postService as vi.MockedFunction<typeof postService>;

describe("useAdminRequest", () => {
  beforeEach(() => {
    mockedPostService.mockReset();
  });

  it("returns response data and clears stale errors", async () => {
    const clearError = vi.fn();
    mockedPostService.mockResolvedValueOnce({ data: { data: ["value"] } });
    const { result } = renderHook(() => useAdminRequest(clearError));

    await expect(
      result.current("load", "/admin/data", { token: "token" }, [])
    ).resolves.toEqual(["value"]);

    expect(clearError).toHaveBeenCalledTimes(1);
  });

  it("aborts an older request with the same key", async () => {
    const signals: AbortSignal[] = [];
    mockedPostService.mockImplementation((_path, _data, config) => {
      signals.push(config?.signal as AbortSignal);
      return new Promise(() => undefined);
    });
    const { result } = renderHook(() => useAdminRequest());

    act(() => {
      void result.current("load", "/admin/data", {}, []);
      void result.current("load", "/admin/data", {}, []);
    });

    expect(signals[0].aborted).toBe(true);
    expect(signals[1].aborted).toBe(false);
  });

  it("does not abort a request with a different key", () => {
    const signals: AbortSignal[] = [];
    mockedPostService.mockImplementation((_path, _data, config) => {
      signals.push(config?.signal as AbortSignal);
      return new Promise(() => undefined);
    });
    const { result } = renderHook(() => useAdminRequest());

    act(() => {
      void result.current("load", "/admin/data", {}, []);
      void result.current("audit", "/admin/audit", {}, []);
    });

    expect(signals.every((signal) => !signal.aborted)).toBe(true);
  });

  it("propagates request failures", async () => {
    const failure = new Error("request failed");
    mockedPostService.mockRejectedValueOnce(failure);
    const { result } = renderHook(() => useAdminRequest());

    await expect(
      result.current("load", "/admin/data", {}, [])
    ).rejects.toBe(failure);
  });
});

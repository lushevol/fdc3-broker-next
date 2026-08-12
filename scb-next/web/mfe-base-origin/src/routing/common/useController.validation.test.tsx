import { renderHook, waitFor } from "@testing-library/react";
import useController from "./useController";

const mockDispatchErrorMessage = vi.fn();
const mockStoreData = vi.fn();
const mockValidate = vi.fn();

vi.mock("../../hooks/provider", () => ({
  useContext: () => [{ token: undefined }, vi.fn()],
}));

vi.mock("../../hooks/dispathcer", () => ({ default: () => ({
  dispacthErrorMessage: mockDispatchErrorMessage,
  dispacthTheme: vi.fn(),
}) }));

vi.mock("../../services", () => ({ default: () => ({
  validate: mockValidate,
}) }));

vi.mock("../../utils/common", () => ({
  clearStorageWhenLogout: vi.fn(),
  getEnv: () => "LOCAL",
  storeData: (...args: unknown[]) => mockStoreData(...args),
  waitFor: vi.fn().mockResolvedValue(undefined),
}));

describe("routing controller validation", () => {
  beforeEach(() => {
    mockDispatchErrorMessage.mockReset();
    mockStoreData.mockReset();
    mockValidate.mockReset().mockResolvedValue(true);
    window.history.replaceState(
      {},
      "",
      "/?openfintoken=invalid%0Atoken"
    );
    Object.defineProperty(window, "fin", {
      configurable: true,
      value: {},
    });
  });

  it("rejects an invalid OpenFin token before storage", async () => {
    renderHook(() => useController());

    await waitFor(() =>
      expect(mockDispatchErrorMessage).toHaveBeenCalledWith(
        "Invalid authentication token."
      )
    );
    expect(mockStoreData).not.toHaveBeenCalled();
  });
});

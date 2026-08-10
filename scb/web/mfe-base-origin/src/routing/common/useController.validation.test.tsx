import { renderHook, waitFor } from "@testing-library/react";
import useController from "./useController";

const mockDispatchErrorMessage = jest.fn();
const mockStoreData = jest.fn();
const mockValidate = jest.fn();

jest.mock("../../hooks/provider", () => ({
  useContext: () => [{ token: undefined }, jest.fn()],
}));

jest.mock("../../hooks/dispathcer", () => () => ({
  dispacthErrorMessage: mockDispatchErrorMessage,
  dispacthTheme: jest.fn(),
}));

jest.mock("../../services", () => () => ({
  validate: mockValidate,
}));

jest.mock("../../utils/common", () => ({
  clearStorageWhenLogout: jest.fn(),
  getEnv: () => "LOCAL",
  storeData: (...args: unknown[]) => mockStoreData(...args),
  waitFor: jest.fn().mockResolvedValue(undefined),
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

import { act, renderHook } from "@testing-library/react";
import useController from "./useController";

const mockLogout = vi.fn(() => Promise.resolve());
const mockDispacthIsOnLogout = vi.fn();
const mockButtonEvent = vi.fn();
const mockModalEvent = vi.fn();
const mockGetJWTPayload = vi.fn();

let mockRefreshToken: string | undefined;

vi.mock("../../../hooks/provider", () => ({
  useContext: () => [{ refreshToken: mockRefreshToken }, vi.fn()],
}));

vi.mock("../../../hooks/dispathcer", () => () => ({
  dispacthIsOnLogout: mockDispacthIsOnLogout,
}));

vi.mock("../../../analytics", () => () => ({
  ButtonEvent: mockButtonEvent,
  ModalEvent: mockModalEvent,
}));

vi.mock("../../../services", () => () => ({ logout: mockLogout }));

vi.mock("../../../hooks/service", () => ({
  relogin: vi.fn(() => Promise.resolve()),
}));

vi.mock("../../../utils/common", () => ({
  getJWTPayload: (...args: unknown[]) => mockGetJWTPayload(...args),
  waitFor: () => Promise.resolve(),
}));

describe("Timeout useController", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-10T00:00:00.000Z"));
    mockRefreshToken = undefined;
    vi.clearAllMocks();
    mockGetJWTPayload.mockReturnValue({
      exp: (Date.now() + 10_000) / 1000,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps the prompt open while refresh is pending and arms logout when it arrives", async () => {
    const setOpen = vi.fn();
    const { rerender } = renderHook(() => useController({ setOpen }));

    await act(async () => undefined);

    expect(mockLogout).not.toHaveBeenCalled();
    expect(setOpen).not.toHaveBeenCalledWith(false);

    mockRefreshToken = "Bearer delayed-refresh-token";
    rerender();

    expect(mockGetJWTPayload).toHaveBeenCalledWith(mockRefreshToken);

    await act(async () => {
      vi.advanceTimersByTime(7_999);
    });
    expect(mockLogout).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(setOpen).toHaveBeenCalledWith(false);
  });
});

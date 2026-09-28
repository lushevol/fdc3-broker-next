import { act, renderHook } from "@testing-library/react";
import useController from "./useController";

const mockLogout = jest.fn(() => Promise.resolve());
const mockDispacthIsOnLogout = jest.fn();
const mockButtonEvent = jest.fn();
const mockModalEvent = jest.fn();
const mockGetJWTPayload = jest.fn();
const mockRelogin = jest.fn(() => undefined);

const MINUTE = 60_000;
// Deliberately custom expiry: the controller must use the token's deadline.
const CUSTOM_FOUR_HOUR_LIFETIME = 240 * MINUTE;

let mockRefreshToken: string | undefined;

jest.mock("../../../hooks/provider", () => ({
  useContext: () => [{ refreshToken: mockRefreshToken }, jest.fn()],
}));

jest.mock("../../../hooks/dispathcer", () => () => ({
  dispacthIsOnLogout: mockDispacthIsOnLogout,
}));

jest.mock("../../../analytics", () => () => ({
  ButtonEvent: mockButtonEvent,
  ModalEvent: mockModalEvent,
}));

jest.mock("../../../services", () => () => ({ logout: mockLogout }));

jest.mock("../../../hooks/service", () => ({
  relogin: () => mockRelogin(),
}));

jest.mock("../../../utils/common", () => ({
  getJWTPayload: (...args: unknown[]) => mockGetJWTPayload(...args),
  waitFor: () => Promise.resolve(),
}));

describe("Timeout useController", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-08-10T00:00:00.000Z"));
    mockRefreshToken = undefined;
    jest.clearAllMocks();
    mockLogout.mockResolvedValue(undefined);
    mockGetJWTPayload.mockReturnValue({
      exp: (Date.now() + 10_000) / 1000,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("Given a pending refresh token, When it arrives later, Then the alert remains open until its logout cutoff", async () => {
    const setOpen = jest.fn();
    const { rerender } = renderHook(() => useController({ setOpen }));

    await act(async () => {
      jest.advanceTimersByTime(3_000);
    });

    expect(mockLogout).not.toHaveBeenCalled();
    expect(setOpen).not.toHaveBeenCalledWith(false);

    mockRefreshToken = "Bearer delayed-refresh-token";
    rerender();

    expect(mockGetJWTPayload).toHaveBeenCalledWith(mockRefreshToken);

    await act(async () => {
      jest.advanceTimersByTime(4_999);
    });
    expect(mockLogout).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(1);
    });

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(setOpen).toHaveBeenCalledWith(false);
    expect(mockRelogin).not.toHaveBeenCalled();
  });

  it.each([15, 30, 60, 120, 239])(
    "Given an open alert and a custom token fixture expiring in four hours, When %i minutes pass without Extend, Then the alert remains and the session is not renewed",
    async (minutes) => {
      mockRefreshToken = "Bearer valid-refresh-token";
      mockGetJWTPayload.mockReturnValue({
        exp: (Date.now() + CUSTOM_FOUR_HOUR_LIFETIME) / 1000,
      });
      const setOpen = jest.fn();
      renderHook(() => useController({ setOpen }));

      await act(async () => {
        jest.advanceTimersByTime(minutes * MINUTE);
      });

      expect(mockRelogin).not.toHaveBeenCalled();
      expect(mockLogout).not.toHaveBeenCalled();
      expect(setOpen).not.toHaveBeenCalledWith(false);
    }
  );

  it("Given no manual extension, When the existing cutoff two seconds before refresh expiry is reached, Then logout starts exactly once", async () => {
    mockRefreshToken = "Bearer valid-refresh-token";
    mockGetJWTPayload.mockReturnValue({
      exp: (Date.now() + CUSTOM_FOUR_HOUR_LIFETIME) / 1000,
    });
    const setOpen = jest.fn();
    renderHook(() => useController({ setOpen }));

    await act(async () => {
      jest.advanceTimersByTime(CUSTOM_FOUR_HOUR_LIFETIME - 2_001);
    });
    expect(mockLogout).not.toHaveBeenCalled();
    expect(setOpen).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(1);
    });
    expect(mockDispacthIsOnLogout).toHaveBeenCalledWith(true);
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(setOpen).toHaveBeenCalledWith(false);
    expect(mockRelogin).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(CUSTOM_FOUR_HOUR_LIFETIME);
    });
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["at the logout cutoff", 2_000],
    ["inside the logout safety margin", 1_000],
    ["at refresh expiry", 0],
    ["after refresh expiry", -1_000],
    ["an hour after refresh expiry", -60 * MINUTE],
  ])(
    "Given the alert mounts %s, When the next timer runs, Then it logs out without extending the session",
    async (_description, remainingMilliseconds) => {
      mockRefreshToken = "Bearer overdue-refresh-token";
      mockGetJWTPayload.mockReturnValue({
        exp: (Date.now() + Number(remainingMilliseconds)) / 1000,
      });
      const setOpen = jest.fn();
      renderHook(() => useController({ setOpen }));

      await act(async () => {
        jest.advanceTimersByTime(0);
      });

      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(mockRelogin).not.toHaveBeenCalled();
      expect(setOpen).toHaveBeenCalledWith(false);
    }
  );

  it("Given the alert is waiting for a refresh token, When an already expired token arrives, Then it logs out immediately", async () => {
    const setOpen = jest.fn();
    const { rerender } = renderHook(() => useController({ setOpen }));

    await act(async () => {
      jest.advanceTimersByTime(CUSTOM_FOUR_HOUR_LIFETIME);
    });
    expect(mockLogout).not.toHaveBeenCalled();
    expect(mockRelogin).not.toHaveBeenCalled();
    expect(setOpen).not.toHaveBeenCalled();

    mockRefreshToken = "Bearer delayed-expired-refresh-token";
    mockGetJWTPayload.mockReturnValue({ exp: Date.now() / 1000 - 1 });
    rerender();
    await act(async () => {
      jest.advanceTimersByTime(0);
    });

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it("Given a refresh token is replaced, When the old cutoff passes, Then logout follows only the new token cutoff", async () => {
    mockRefreshToken = "Bearer original-refresh-token";
    const setOpen = jest.fn();
    const { rerender } = renderHook(() => useController({ setOpen }));
    const replacementExpiry = (Date.now() + 20_000) / 1000;

    await act(async () => {
      jest.advanceTimersByTime(5_000);
    });
    mockRefreshToken = "Bearer replacement-refresh-token";
    mockGetJWTPayload.mockReturnValue({ exp: replacementExpiry });
    rerender();

    await act(async () => {
      jest.advanceTimersByTime(3_000);
    });
    expect(mockLogout).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(9_999);
    });
    expect(mockLogout).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(1);
    });
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it("Given a refresh token is removed from the session, When its former cutoff passes, Then the stale timer does not log out", async () => {
    mockRefreshToken = "Bearer removed-refresh-token";
    const setOpen = jest.fn();
    const { rerender } = renderHook(() => useController({ setOpen }));

    mockRefreshToken = undefined;
    rerender();
    await act(async () => {
      jest.advanceTimersByTime(10_000);
    });

    expect(mockLogout).not.toHaveBeenCalled();
    expect(setOpen).not.toHaveBeenCalled();
  });

  it("Given an open alert, When the user chooses Extend, Then relogin is invoked and the alert closes with its previous logout deadline cancelled", async () => {
    mockRefreshToken = "Bearer valid-refresh-token";
    const setOpen = jest.fn();
    const { result } = renderHook(() => useController({ setOpen }));
    expect(mockRelogin).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.extend();
    });

    expect(mockRelogin).toHaveBeenCalledTimes(1);
    expect(setOpen).toHaveBeenCalledWith(false);
    expect(mockDispacthIsOnLogout).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(10_000);
    });
    expect(mockLogout).not.toHaveBeenCalled();
  });

  it("Given the user chooses Logout, When logout succeeds, Then the alert closes and its automatic logout cannot run again", async () => {
    mockRefreshToken = "Bearer valid-refresh-token";
    const setOpen = jest.fn();
    const { result } = renderHook(() => useController({ setOpen }));

    await act(async () => {
      await result.current.continuLogout();
    });

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockDispacthIsOnLogout).toHaveBeenCalledWith(true);
    expect(mockRelogin).not.toHaveBeenCalled();
    expect(setOpen).toHaveBeenCalledWith(false);

    await act(async () => {
      jest.advanceTimersByTime(10_000);
    });
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("Given the alert unmounts, When its former logout cutoff passes, Then it performs no logout or prompt update", async () => {
    mockRefreshToken = "Bearer valid-refresh-token";
    const setOpen = jest.fn();
    const { unmount } = renderHook(() => useController({ setOpen }));

    unmount();
    await act(async () => {
      jest.advanceTimersByTime(10_000);
    });

    expect(mockLogout).not.toHaveBeenCalled();
    expect(mockRelogin).not.toHaveBeenCalled();
    expect(setOpen).not.toHaveBeenCalled();
  });
});

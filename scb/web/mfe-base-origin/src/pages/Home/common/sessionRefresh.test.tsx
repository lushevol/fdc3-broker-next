import { act, renderHook } from "@testing-library/react";
import type { RootModel } from "../../../hooks/model/root";
import useController from "./useController";

const mockRefreshToken = jest.fn();
const mockDispatch = jest.fn();
let mockStore: RootModel;

jest.mock("../../../hooks/provider", () => ({
  useContext: () => [mockStore, mockDispatch],
}));
jest.mock("../../../hooks/service", () => ({
  getRefreshToken: (...args: unknown[]) => mockRefreshToken(...args),
}));
jest.mock("../../../hooks/service/util/extend", () => ({
  extend: jest.fn(),
}));
jest.mock("../../../hooks/dispathcer", () => () => ({
  dispacthLoading: jest.fn(),
  dispacthWorkspaces: jest.fn(),
  dispacthCurrentWorkspace: jest.fn(),
  addWorkspace: jest.fn(),
  dispacthErrorMessage: jest.fn(),
}));
jest.mock("../../../analytics", () => () => ({
  ButtonEvent: jest.fn(),
  TileEvent: jest.fn(),
  TabEvent: jest.fn(),
}));
jest.mock("../../../utils/login", () => ({
  handleLoginEntities: jest.fn(),
}));
jest.mock("../../../utils/common", () => ({
  aOrb: (value: unknown, fallback: unknown) => value || fallback,
  getJWTPayload: (token: string) => JSON.parse(token),
  validateWorkspace: jest.fn((workspaces: unknown) => workspaces),
}));
jest.mock("./util", () => ({
  setDetail: jest.fn(),
  refreshTabUtil: jest.fn(),
}));

const setVisibility = (state: DocumentVisibilityState) => {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    value: state,
  });
  document.dispatchEvent(new Event("visibilitychange"));
};

describe("Home session refresh", () => {
  const now = Date.parse("2026-09-21T00:00:00Z");
  const accessLifetime = 15 * 60_000;
  const refreshLifetime = 225 * 60_000 + 24_000;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(now);
    jest.clearAllMocks();
    setVisibility("visible");
    mockStore = {
      token: "access-token",
      expiredIn: (now + accessLifetime) / 1000,
      workspaces: [],
    };
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("acquires a refresh token once without following access-token rotations", async () => {
    const { rerender } = renderHook(() => useController());

    await act(async () => undefined);
    expect(mockRefreshToken).toHaveBeenCalledTimes(1);

    mockStore.refreshToken = JSON.stringify({
      exp: (now + refreshLifetime) / 1000,
    });
    mockStore.token = "next-access-token";
    mockStore.expiredIn = (now + accessLifetime) / 1000;
    rerender();
    await act(async () => undefined);

    expect(mockRefreshToken).toHaveBeenCalledTimes(1);
  });

  it("does not request a refresh token after the access token has expired", async () => {
    mockStore.expiredIn = (now - 1) / 1000;
    renderHook(() => useController());

    await act(async () => undefined);

    expect(mockRefreshToken).not.toHaveBeenCalled();
  });

  it("does not renew the refresh token when the page becomes hidden near expiry", async () => {
    mockStore.refreshToken = JSON.stringify({
      exp: (now + 60_000) / 1000,
    });
    renderHook(() => useController());

    await act(async () => undefined);
    expect(mockRefreshToken).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(40_000);
      setVisibility("hidden");
    });

    expect(mockRefreshToken).not.toHaveBeenCalled();

    act(() => {
      setVisibility("visible");
      setVisibility("hidden");
    });
    expect(mockRefreshToken).not.toHaveBeenCalled();
  });

  it("resumes normally when the page returns before access-token expiry", async () => {
    mockStore.refreshToken = JSON.stringify({
      exp: (now + refreshLifetime) / 1000,
    });
    const { result } = renderHook(() => useController());

    await act(async () => undefined);
    act(() => {
      setVisibility("hidden");
      jest.setSystemTime(now + accessLifetime - 1);
      setVisibility("visible");
    });

    expect(result.current.showTimeout).toBe(false);
  });

  it.each([15, 30, 60, 120, 225])(
    "shows the existing prompt when returning after %i minutes",
    async (minutesAway) => {
    mockStore.refreshToken = JSON.stringify({
      exp: (now + refreshLifetime) / 1000,
    });
    const { result } = renderHook(() => useController());

    await act(async () => undefined);
    act(() => {
      setVisibility("hidden");
      jest.setSystemTime(now + minutesAway * 60_000);
      setVisibility("visible");
    });

    expect(result.current.showTimeout).toBe(true);
    expect(mockRefreshToken).not.toHaveBeenCalled();
    }
  );

  it("reconciles refresh-token expiry when returning from suspension", async () => {
    mockStore.refreshToken = JSON.stringify({
      exp: (now + refreshLifetime) / 1000,
    });
    const { result } = renderHook(() => useController());

    await act(async () => undefined);
    act(() => {
      setVisibility("hidden");
      jest.setSystemTime(now + refreshLifetime + 1);
      setVisibility("visible");
    });

    expect(result.current.showTimeout).toBe(true);
    expect(mockRefreshToken).not.toHaveBeenCalled();
  });

  it("keeps the normal fifteen-minute session prompt", async () => {
    const { result } = renderHook(() => useController());

    await act(async () => undefined);
    act(() => {
      jest.advanceTimersByTime(accessLifetime);
    });

    expect(result.current.showTimeout).toBe(true);
  });

  it("opens the logout path at refresh-token expiry even with a valid access token", async () => {
    mockStore.expiredIn = (now + refreshLifetime + accessLifetime) / 1000;
    mockStore.refreshToken = JSON.stringify({
      exp: (now + refreshLifetime) / 1000,
    });
    const { result } = renderHook(() => useController());

    await act(async () => undefined);
    act(() => {
      jest.advanceTimersByTime(refreshLifetime - 1);
    });
    expect(result.current.showTimeout).toBe(false);

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current.showTimeout).toBe(true);
  });
});

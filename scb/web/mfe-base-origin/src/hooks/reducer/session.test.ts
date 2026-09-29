// Initialize the shared store before reducers, as the application Provider does.
import "../HooksBase";
import { reducers } from ".";
import { ActionType } from "./util/ActionType";

describe("Refresh ownership across authentication changes", () => {
  it("rejects an old refresh action queued after logout and another login", () => {
    const loggedOut = reducers(
      { token: "old-access", refreshToken: "old-refresh" },
      { type: ActionType.CLEAR, data: {} }
    );
    const loggedIn = reducers(loggedOut, {
      type: ActionType.SET_TOKEN,
      data: { token: "new-access" },
    });
    const staleReply = reducers(loggedIn, {
      type: ActionType.SET_REFRESH_TOKEN,
      data: { refreshToken: "old-refresh", sessionGeneration: 0 },
    });
    expect(staleReply.token).toBe("new-access");
    expect(staleReply.refreshToken).toBeUndefined();

    const currentReply = reducers(staleReply, {
      type: ActionType.SET_REFRESH_TOKEN,
      data: { refreshToken: "new-refresh", sessionGeneration: 1 },
    });
    expect(currentReply.refreshToken).toBe("new-refresh");
  });

  it.each([
    { token: undefined, isOnLogout: false },
    { token: "access", isOnLogout: true },
  ])("ignores a refresh reply outside an active session: %j", (state) => {
    const result = reducers(state, {
      type: ActionType.SET_REFRESH_TOKEN,
      data: { refreshToken: "late-refresh", sessionGeneration: 0 },
    });
    expect(result.refreshToken).toBeUndefined();
  });

  it("clears a stray refresh credential when starting a fresh login", () => {
    const result = reducers(
      { refreshToken: "stray-refresh" },
      { type: ActionType.SET_TOKEN, data: { token: "new-access" } }
    );
    expect(result.refreshToken).toBeUndefined();
    expect(result.token).toBe("new-access");
  });

  it("does not assign a legacy untagged reply to a later session", () => {
    const result = reducers(
      { token: "new-access", sessionGeneration: 1 },
      { type: ActionType.SET_REFRESH_TOKEN, data: { refreshToken: "old-refresh" } }
    );
    expect(result.refreshToken).toBeUndefined();
  });
});

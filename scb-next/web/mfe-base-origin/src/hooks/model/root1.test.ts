import { initialData } from "./root";
afterAll(() => {
  vi.clearAllMocks();
});
vi.mock("../../utils/common", () => {
  return {
    getJWTPayload: () => "JWT",
    storeData: vi.fn(),
    clearLocalStorage: vi.fn(),
    clearStorageWhenLogout: vi.fn(),
    uuidv4: () => "id",
    showErrorMsg: vi.fn(),
    show_error_msg: vi.fn(),
    getEnv: () => "LOCAL",
    getHostName: () => "localhost",
    getLocalStorage: () => ({
      setItem: (v) => { },
      getItem: (actionType) => {
        if (actionType === "SET_WORKSPACES") {
          return "[]";
        } else if (actionType === "SET_USER") {
          return "{}";
        } else if (actionType === "SET_TOKEN") {
          return "a b";
        } else if (actionType === "SET_THEME") {
          return "a b";
        } else if (actionType === "SET_TIME_TYPE") {
          return "local";
        } else if (actionType === "SET_ENTITIES") {
          return "[]";
        }
      },
      clear: () => { }
    }),
    getSessionStorage: () => ({
      setItem: (v) => { },
      getItem: () => undefined,
      clear: () => { }
    }),
  }
});
describe("Channel Util", () => {
  it("should be true", () => {
    expect(initialData).toEqual({ "newStyles": false, "clientBus": undefined, "currentWorkspace": undefined, "drawer": false,  "drawers": [], "entities": [], "entitlementsToken": undefined, "errorMsg": undefined, "expiredIn": 0, "iat": 0, "isLoading": true, "isOnLogout": false, "isOpenFin": false, "refreshTab": {}, "refreshToken": undefined, "rootVersion": "", "sseCallback": {}, "ssePayload": [], "theme": "a b", "timeType": "local", "token": "a b", "user": {}, "userLoginTime": undefined, "workspaces": [] });
  });
});

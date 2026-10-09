import { initialData } from "./root";
afterAll(() => {
  jest.clearAllMocks();
});
jest.mock("../../utils/common", () => {
  return {
    getJWTPayload: () => "JWT",
    storeData: jest.fn(),
    clearLocalStorage: jest.fn(),
    clearStorageWhenLogout: jest.fn(),
    uuidv4: () => "id",
    showErrorMsg: jest.fn(),
    show_error_msg: jest.fn(),
    getEnv: () => "LOCAL",
    getHostName: () => "localhost",
    getLocalStorage: () => ({
      setItem: (v) => { },
      getItem: () => undefined,
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
    expect(initialData).toEqual({ "clientBus": undefined, "currentWorkspace": { "containers": [], "id": "id", "isActive": false, "label": "Workspace 1" }, "drawer": false, "drawers": [], "entities": [], "entitlementsToken": undefined, "errorMsg": undefined, "expiredIn": 0, "iat": 0, "isLoading": true, "isOnLogout": false, "isOpenFin": false, "refreshTab": {}, "refreshToken": undefined, "rootVersion": "", "newStyles": false, "sseCallback": {}, "ssePayload": [], "theme": "dark", "timeType": "utc", "token": undefined, "user": undefined, "userLoginTime": undefined, "workspaces": [{ "containers": [], "id": "id", "isActive": false, "label": "Workspace 1" }] });
  });
});

import { getHooksBase } from "../HooksBase";
import { putService, postService, getService, deleteService, patchService, getRefreshToken, relogin, signal } from "./";
import { extend, extendToken, signal as signal2 } from "./util/extend";
afterAll(() => {
  vi.clearAllMocks();
});
vi.mock('./config', () => {
  return {
    put: async () => { return Promise.resolve({}) },
    post: async () => { return Promise.resolve({}) },
    get: async () => { return Promise.resolve({}) },
    patch: async () => { return Promise.resolve({}) },
    "delete": async () => { return Promise.resolve({}) }
  }
});
vi.mock('../../utils/common', () => {
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
      getItem: () => undefined,
      clear: () => { }
    }),
    getSessionStorage: () => ({
      setItem: (v) => { },
      getItem: () => undefined,
      clear: () => { }
    }),
    validateTile: () => true
  }
});

describe("Service Util", () => {
  it("should be true", () => {
    putService("/", {});
    postService("/", {});
    patchService("/", {});
    getService("/");
    deleteService("/");
    extendToken();
    extend(undefined, false, "123");
    extend(25000, false, "123");
    getRefreshToken();
    relogin();
    signal.getRefreshToken = new AbortController();
    signal.relogin = new AbortController();
    getRefreshToken();
    relogin();
    const { store } = getHooksBase();
    store.expiredIn = (new Date().getTime() / 1000) + 10000;
    extend(store.expiredIn, false, "123");
    store.isOnLogout = true;
    extend(store.expiredIn, true, "123");
    signal2.extendToken = new AbortController();
    extend(store.expiredIn, true, "123");
  });
});

import { getRefreshToken, relogin } from "..";
import { extend } from "../util/extend";
import { getEndPoint } from "./getEndpoint";

afterAll(() => {
  vi.clearAllMocks();
});
vi.mock('../config', () => {
  return { default: {
    put: async () => { return Promise.reject({}) },
    post: async () => { return Promise.reject({}) },
    get: async () => { return Promise.reject({}) },
    "delete": async () => { return Promise.resolve({}) }
  } }
});
vi.mock('../../../utils/common', () => {
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
describe("Extend Token Util", () => {
  it("should be true", () => {
    extend(25000, false, "123");
    getRefreshToken();
    relogin();
  });
  it("should be true", () => {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        pathname: "/",
        origin: "http://localhost"
      },
      writable: true
    });
    expect(getEndPoint("/mfe")).toBe("/api/mfe");
  });
});

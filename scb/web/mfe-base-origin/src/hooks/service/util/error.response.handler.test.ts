import { AxiosError, InternalAxiosRequestConfig } from "axios";
import { config } from "../config";
import { errorHandler } from "./error.response.handler";

describe("error.response.handler", () => {
  it("should be true", async () => {
    const error: AxiosError = {
      response: {
        data: {
          status: "ERROR",
          errorCode: 0,
          message: "Cancel: axios request cancelled"
        },
        status: 0,
        headers: {},
        statusText: "",
        config: config as InternalAxiosRequestConfig,
      },
      isAxiosError: false,
      toJSON: () => JSON.parse("{}"),
      name: "",
      message: "",
      config: config as InternalAxiosRequestConfig,
      code: "ERR_CANCELED",
    }
    try {
      await errorHandler(error);
    } catch (e) {
      expect(e.response.data.message).toBe("Cancel: axios request cancelled");
    }
  });
  it("should be true", async () => {
    const error: AxiosError = {
      response: {
        data: undefined,
        status: 0,
        headers: {},
        statusText: "",
        config: config as InternalAxiosRequestConfig,
      },
      isAxiosError: false,
      toJSON: () => JSON.parse("{}"),
      name: "",
      message: "Request failed with status code 401",
      config: config as InternalAxiosRequestConfig,
      code: "ERROR",
    }
    try {
      await errorHandler(error);
    } catch (e) {
      expect(e.message).toBe("Request failed with status code 401");
    }
  });
  it("should be true", async () => {
    const error: AxiosError = {
      response: {
        data: {},
        status: 0,
        headers: {},
        statusText: "",
        config: config as InternalAxiosRequestConfig,
      },
      isAxiosError: false,
      toJSON: () => JSON.parse("{}"),
      name: "",
      message: "",
      config: config as InternalAxiosRequestConfig,
      code: "ERROR",
    }
    try {
      await errorHandler(error);
    } catch (e) {
      expect(e.message).toBe("");
    }
  });
  it("should be true", async () => {
    const error: AxiosError = {
      response: {
        data: "error",
        status: 0,
        headers: {},
        statusText: "",
        config: config as InternalAxiosRequestConfig,
      },
      isAxiosError: false,
      toJSON: () => JSON.parse("{}"),
      name: "",
      message: "",
      config: config as InternalAxiosRequestConfig,
      code: "ERROR",
    }
    try {
      await errorHandler(error);
    } catch (e) {
      expect(e.message).toBe("");
    }
  });
  it("does not log authentication request configuration", async () => {
    const consoleInfo = jest
      .spyOn(console, "info")
      .mockImplementation(() => undefined);
    const error: AxiosError = {
      response: {
        data: {
          status: "ERROR",
          errorCode: 0,
          message: "AuthenticationException"
        },
        status: 0,
        headers: {},
        statusText: "",
        config: config as InternalAxiosRequestConfig,
      },
      isAxiosError: false,
      toJSON: () => JSON.parse("{}"),
      name: "",
      message: "",
      config: {
        ...config,
        data: JSON.stringify({ username: "user", password: "secret" }),
      } as InternalAxiosRequestConfig,
      code: "ERROR",
    }
    try {
      await errorHandler(error);
    } catch (e) {
      expect(e.response.data.message).toBe("AuthenticationException");
    }
    expect(consoleInfo).not.toHaveBeenCalledWith(error.config);
    consoleInfo.mockRestore();
  });
  it("should be true", async () => {
    const error: AxiosError = {
      response: {
        data: {
          status: "ERROR",
          errorCode: 0,
          errorMessage: "API ERROR"
        },
        status: 0,
        headers: {},
        statusText: "",
        config: config as InternalAxiosRequestConfig,
      },
      isAxiosError: false,
      toJSON: () => JSON.parse("{}"),
      name: "",
      message: "",
      config: config as InternalAxiosRequestConfig,
      code: "ERROR",
    }
    try {
      await errorHandler(error);
    } catch (e) {
      expect(e.response.data.errorMessage).toBe("API ERROR");
    }
  });
  it("should be true", async () => {
    const error: AxiosError = {
      response: {
        data: {
          status: "ERROR",
          errorCode: 0,
          message: "TOKEN_INVALID_EXPIRED"
        },
        status: 0,
        headers: {},
        statusText: "",
        config: config as InternalAxiosRequestConfig,
      },
      isAxiosError: false,
      toJSON: () => JSON.parse("{}"),
      name: "",
      message: "",
      config: config as InternalAxiosRequestConfig,
      code: "ERROR",
    }
    try {
      await errorHandler(error);
    } catch (e) {
      expect(e.response.data.status).toBe("ERROR");
    }
  });
  it("should be true", async () => {
    const error: AxiosError = {
      response: {
        data: undefined,
        status: 0,
        headers: {},
        statusText: "",
        config: config as InternalAxiosRequestConfig,
      },
      isAxiosError: false,
      toJSON: () => JSON.parse("{}"),
      name: "",
      message: "Network Error",
      config: config as InternalAxiosRequestConfig,
      code: "ERROR",
    }
    try {
      await errorHandler(error);
    } catch (e) {
      expect(e.message).toBe("Network Error");
    }
  });
  it("should be true", async () => {
    const error: AxiosError = {
      response: {
        data: undefined,
        status: 0,
        headers: {},
        statusText: "",
        config: config as InternalAxiosRequestConfig,
      },
      isAxiosError: false,
      toJSON: () => JSON.parse("{}"),
      name: "",
      message: "Unknown Error",
      config: config as InternalAxiosRequestConfig,
      code: "ERROR",
    }
    try {
      await errorHandler(error);
    } catch (e) {
      expect(e.message).toBe("Unknown Error");
    }
  });
});

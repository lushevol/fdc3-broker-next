import { render, screen, act } from "@testing-library/react";
import React from "react";
import Parent from "./";
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
const Comp = () => {
  throw new Error();
};

describe("ErrorBoundary component", () => {
  it("should be in the document", async () => {
    await render(
      <Parent>
        <Comp />
      </Parent>
    );
    const id = screen.getByTestId("FallbackError__page-id");
    expect(id).toBeInTheDocument;
  });
});

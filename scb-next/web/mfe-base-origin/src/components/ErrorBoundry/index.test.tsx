import { render, screen, act } from "@testing-library/react";
import React from "react";
import Parent from "./";
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

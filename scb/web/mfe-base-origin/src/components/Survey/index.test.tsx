import { render, screen } from "@testing-library/react";
import React from "react";
import Root from ".";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
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
    waitFor: ()=>Promise.resolve(),
  }
});
jest.mock("../../hooks/service", () => {
  return {
    putService: async (path, data, signal = undefined) => { return Promise.resolve({}) },
    postService: async (path, data, signal = undefined) => { return Promise.resolve({}) },
    getService: async (path, signal = undefined) => { return Promise.resolve({}) }
  }
});
const BEFORE_LOGOUT = () => {
  return (<Root surveyLink="" openPopUp={() => { }} setOpen={() => { }} />);
};

describe("Survey component", () => {
  it("Logout_Btn should be in the document", () => {
    render(<Provider data={{ user: { id: "123" }, token: "123", theme: "dark" }}>
      <ThemeProvider>
        <BEFORE_LOGOUT />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    expect(screen.getByText(/Leave Now?/i)).toBeInTheDocument();
    const iconButton = screen.getByTestId("Logout_Btn");
    expect(iconButton).toBeInTheDocument();
    iconButton.click();
  });
  it("Hide_Btn should be in the document", () => {
    render(<Provider data={{ user: { id: "123" }, token: "123", theme: "dark" }}>
      <ThemeProvider>
        <BEFORE_LOGOUT />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    expect(screen.getByText(/Leave Now?/i)).toBeInTheDocument();
    const iconButton = screen.getByTestId("Hide_Btn");
    expect(iconButton).toBeInTheDocument();
    iconButton.click();
  });
  it("Go_Btn should be in the document", () => {
    render(<Provider data={{ user: { id: "123" }, token: "123", theme: "dark" }}>
      <ThemeProvider>
        <BEFORE_LOGOUT />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    expect(screen.getByText(/Leave Now?/i)).toBeInTheDocument();
    const iconButton = screen.getByTestId("Go_Btn");
    expect(iconButton).toBeInTheDocument();
    iconButton.click();
  });
});

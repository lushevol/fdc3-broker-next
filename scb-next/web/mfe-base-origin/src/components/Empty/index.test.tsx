import { render, screen } from "@testing-library/react";
import React from "react";
import Root from ".";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import { PREFIX } from "./common/style";
vi.mock('../../utils/common', () => {
  return {
    getJWTPayload: (t) => ({ exp: "a", iat: "b", userLoginTime: new Date().toISOString() }),
    storeData: vi.fn(),
    clearLocalStorage: vi.fn(),
    clearStorageWhenLogout: vi.fn(),
    uuidv4: () => "id",
    showErrorMsg: vi.fn(),
    show_error_msg: vi.fn(),
    getEnv: () => "LOCAL",
    formatDate: (v) => v,
    formatDateToISO: (v) => v,
    isDate: (val: any) => {
      const result = new Date(val);
      return result instanceof Date && !isNaN(result.valueOf());
    },
    isNumber: (val: any) => {
      return !isNaN(`${val}` as unknown as number);
    },
    getHostName: () => "localhost",
    getSurveyLink: () => "https://surveys.sc.com/jfe/preview/previewId/b35e7b90-467e-473f-9ff3-8b6a099569d5/SV_cUVyvBdVELMVr02?Q_CHL=preview&Q_SurveyVersionID=current",
    getSSOLink: () => "",
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

describe("Empty component", () => {
  it("should be in the document", () => {
    render(<Provider data={{ theme: "dark" }}>
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </Provider>);
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    expect(screen.getByText(/Start customizing your workspace/i)).toBeInTheDocument();
    expect(screen.getByText(/find out what workspace preference options you have and how those options work./i)).toBeInTheDocument();
    expect(screen.getByText(/Find tile/i)).toBeInTheDocument();
    const Find_tile = screen.getByTestId(`${PREFIX}_Find_tile`);
    expect(Find_tile).toBeInTheDocument();
    Find_tile.click();
  });
  it("should be in the document", () => {
    render(<Provider data={{ theme: "light" }}>
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </Provider>);
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    expect(screen.getByText(/Start customizing your workspace/i)).toBeInTheDocument();
    expect(screen.getByText(/find out what workspace preference options you have and how those options work./i)).toBeInTheDocument();
    expect(screen.getByText(/Find tile/i)).toBeInTheDocument();
    const Find_tile = screen.getByTestId(`${PREFIX}_Find_tile`);
    expect(Find_tile).toBeInTheDocument();
    Find_tile.click();
  });
});

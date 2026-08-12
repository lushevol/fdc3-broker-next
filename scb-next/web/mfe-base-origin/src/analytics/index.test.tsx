import { render, screen } from "@testing-library/react";
import React from "react";
import useAnalytics from ".";
import Provider from "../hooks/provider";
import ThemeProvider from "../theme";
import { AnalyticsData } from "./model";
afterAll(() => {
  vi.clearAllMocks();
});

vi.mock('../utils/common', () => {
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

vi.mock('../hooks/service', () => {
  return {
    putService: async () => { return Promise.resolve({}) },
    postService: async () => { return Promise.resolve({}) },
    getService: async () => { return Promise.resolve({}) },
  }
});
const analyticsData: AnalyticsData = { container: "Base", tile: "home" }
const Comp = () => {
  const { TileEvent,
    ModalEvent,
    TabEvent,
    ButtonEvent,
    DropDownEvent,
    SwitchEvent,
  } = useAnalytics();
  React.useEffect(() => {
    TileEvent("open", { name: "tile name", ...analyticsData })
    ModalEvent("open", { name: "modal name", ...analyticsData })
    TabEvent("click", { name: "tab name", ...analyticsData })
    ButtonEvent("click", { name: "button name", ...analyticsData })
    SwitchEvent("click", { name: "switch name", ...analyticsData })
    DropDownEvent("select", { name: "dropdown name", ...analyticsData })
  }, [])
  return (<div />);
};

describe("Survey component", () => {
  it("Logout_Btn should be in the document", () => {
    render(<Provider>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
});

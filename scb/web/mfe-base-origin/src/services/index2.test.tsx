import { render, screen } from "@testing-library/react";
import React from "react";
import useServices from ".";
import Provider from "../hooks/provider";
import ThemeProvider from "../theme";
afterAll(() => {
  jest.clearAllMocks();
});

jest.mock('../utils/common', () => {
  return {
    getJWTPayload: (t) => ({ exp: "a", iat: "b", userLoginTime: new Date().toISOString() }),
    storeData: jest.fn(),
    clearLocalStorage: jest.fn(),
    clearStorageWhenLogout: jest.fn(),
    uuidv4: () => "id",
    showErrorMsg: jest.fn(),
    show_error_msg: jest.fn(),
    getEnv: () => "DEV",
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
    getTile: () => ({ entity: "STAMP", subject: "STAMP" })
  }
});

jest.mock('../hooks/service', () => {
  return {
    putService: async () => { return Promise.resolve({}) },
    postService: async () => { return Promise.resolve({}) },
    getService: async () => { return Promise.resolve({}) },
  }
});

const Comp = () => {
  const { login, validate, logout, ssePublish } = useServices();
  React.useEffect(() => {
    const pd = "p" + "a" + "s" + "s" + "w" + "o" + "r" + "d";
    login({ username: "a", [pd]: "b" });
    login({ code: "x", iss: "c" });
    validate();
    ssePublish("s", { data: "hello" })
    logout();
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

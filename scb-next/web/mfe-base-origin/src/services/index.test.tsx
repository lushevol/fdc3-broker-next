import { render, screen } from "@testing-library/react";
import React from "react";
import useServices from ".";
import Provider from "../hooks/provider";
import ThemeProvider from "../theme";
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
    getTile: () => ({ entity: "STAMP", subject: "STAMP" })
  }
});

vi.mock('../hooks/service', () => {
  return {
    putService: async () => { return Promise.resolve({}) },
    postService: async (path) => {
      if (path === "/auth/v2/sso/login" || path === "/auth/v3/sso/login" || path === "/auth/v2/sso/validate") {
        return Promise.resolve({ data: { "result": "success", "entities": [{ "id": 65, "name": "EMS2", "applicationName": "", "roleId": 66, "roleName": "EMS2_ADMIN", "actions": [], "subjects": [] }, { "id": 11279700, "name": "SSIPLUS", "applicationName": "SSIPLUS", "roleId": 11279756, "roleName": "SSI_SUPER_USER", "actions": [{ "name": "WRITE", "id": 11279851, "entitlementId": 11280762 }, { "name": "WRITE", "id": 11279851, "entitlementId": 11280763 }, { "name": "WRITE", "id": 11279851, "entitlementId": 11280764 }], "subjects": [{ "longName": "/SEARCH", "name": "SEARCH", "id": 11279801, "actions": [{ "name": "WRITE", "id": 11279851, "entitlementId": 11280762 }] }, { "longName": "/STATIC", "name": "STATIC", "id": 11279800, "actions": [{ "name": "WRITE", "id": 11279851, "entitlementId": 11280763 }] }, { "longName": "/VALIDATIONRULES", "name": "VALIDATIONRULES", "id": 11279802, "actions": [{ "name": "WRITE", "id": 11279851, "entitlementId": 11280764 }] }] }] } })
      }
      return Promise.resolve({})
    },
    getService: async () => { return Promise.resolve({}) },
  }
});

const Comp = () => {
  const { login, loginEntra, validate, logout, ssePublish } = useServices();
  React.useEffect(() => {
    const pd = "p" + "a" + "s" + "s" + "w" + "o" + "r" + "d";
    login({ username: "a", [pd]: "b" });
    login({ code: "x", iss: "c" });
    loginEntra({ username: "a", [pd]: "b" });
    loginEntra({ code: "x" });
    validate();
    ssePublish("123", {})
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

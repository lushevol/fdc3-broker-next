import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import Root from ".";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import { PREFIX } from "./common/style";
import useController from "./common/useController";
afterAll(() => {
  jest.clearAllMocks();
});

jest.mock('../../utils/common', () => {
  return {
    getJWTPayload: () => ({}),
    storeData: jest.fn(),
    clearLocalStorage: jest.fn(),
    clearStorageWhenLogout: jest.fn(),
    uuidv4: () => "id",
    showErrorMsg: jest.fn(),
    show_error_msg: jest.fn(),
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
    getHostName: () => "fmo-mfe-preprod.pi.dev.net",
    getSurveyLink: () => "https://surveys.sc.com/jfe/form/SV_cUVyvBdVELMVr02",
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

jest.mock("../../services", () => {
  const validate = async () => Promise.resolve({ data: { "result": true, "expiration": "2023-03-16T09:01:45.000+00:00" } });
  return () => ({
    validate,
    logout: () => { return Promise.resolve({}) },
    login: () => { return Promise.resolve({}) },
    loginEntra: () => { return Promise.resolve({}) },
    getuser: () => { return Promise.resolve(false) },
  })
})

const Comp = () => {
  const {
    username,
    password,
    setUsername,
    setPassword,
    onLogin,
    handleChange,
  } = useController();
  React.useEffect(() => {
    handleChange({} as React.SyntheticEvent, 1);
    setUsername("testrandomuser");
    setPassword("testrandom");
    onLogin({ username, password });
  }, []);
  return (<Root />);
};

const Comp2 = () => {
  return (<Root />);
};

describe("Routing component", () => {
  it("should be in the document", () => {
    render(<Provider data={{ theme: "light", token: undefined, user: undefined }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
  });
  it("should be in the document", () => {
    render(<Provider data={{ theme: "light", token: undefined, user: undefined }}>
      <ThemeProvider>
        <Comp2 />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();

    const cn = screen.getByPlaceholderText("Enter Username")
    expect(cn).toBeInTheDocument();
    fireEvent.change(cn, { target: { value: "dummy" } });
    fireEvent.keyUp(cn, { target: { value: "dummy" }, code: "dummy" });

    const pass = screen.getByPlaceholderText("Enter Password");
    expect(pass).toBeInTheDocument();
    fireEvent.change(pass, { target: { value: "dummy" } });
    fireEvent.keyUp(cn, { target: { value: "dummy" }, code: "dummy" });

    const login = screen.getByTestId(`${PREFIX}_login`)
    expect(login).toBeInTheDocument();
    login.click();
  });
  it("should be in the document", () => {
    render(<Provider data={{ theme: undefined, token: "abc", user: undefined }}>
      <ThemeProvider>
        <Comp2 />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();

    const cn = screen.getByPlaceholderText("Enter Username")
    expect(cn).toBeInTheDocument();
    fireEvent.change(cn, { target: { value: "dummy" } });

    const pass = screen.getByPlaceholderText("Enter Password");
    expect(pass).toBeInTheDocument();
    fireEvent.change(pass, { target: { value: "dummy" } });
    fireEvent.keyUp(cn, { code: "Enter" });
  });
  it("should be in the document", () => {
    render(<Provider data={{ theme: undefined, token: "abc", user: undefined }}>
      <ThemeProvider>
        <Comp2 />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();

    const sso = screen.getByTestId(`${PREFIX}_sso`)
    expect(sso).toBeInTheDocument();
    sso.click();
  });
  it("should be in the document", () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: "?code=lZByCzj8aYND2LL4DdkXvUPAD-U&iss=https://test-mfaintig-stg.51318.app.standardchartered.com:443/openam/oauth2/realms/root/realms/sso&client_id=51358ratan"
      },
      writable: true
    });
    render(<Provider data={{ theme: undefined, token: "abc", user: undefined }}>
      <ThemeProvider>
        <Comp2 />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
  });
});

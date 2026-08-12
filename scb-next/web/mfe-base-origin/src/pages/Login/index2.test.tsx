import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import Root from ".";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import { PREFIX } from "./common/style";
import useController from "./common/useController";
afterAll(() => {
  vi.clearAllMocks();
});

vi.mock('../../utils/common', () => {
  return {
    getJWTPayload: () => ({}),
    storeData: vi.fn(),
    clearLocalStorage: vi.fn(),
    clearStorageWhenLogout: vi.fn(),
    uuidv4: () => "id",
    showErrorMsg: vi.fn(),
    show_error_msg: vi.fn(),
    getEnv: () => "PROD",
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

vi.mock("../../services", () => {
  const validate = async () => Promise.resolve({ data: { "result": true, "expiration": "2023-03-16T09:01:45.000+00:00" } });
  return () => ({
    validate,
    logout: () => { return Promise.resolve({}) },
    login: () => { return Promise.resolve({}) },
    loginEntra: () => { return Promise.resolve({}) },
    getuser: () => { return Promise.resolve(true) },
  })
})

const Comp = () => {
  const {
    username,
    password,
    setUsername,
    setPassword,
    onLogin,
    onLoginUserNamePassword,
    handleChange,
  } = useController();
  React.useEffect(() => {
    handleChange({} as React.SyntheticEvent, 1);
    setUsername("testrandomuser");
    setPassword("testrandom");
    onLoginUserNamePassword()
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
    Object.defineProperty(window, 'location', {
      value: {
        search: "?show_normal_login=Y"
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
    const sso = screen.getByTestId(`${PREFIX}_sso`)
    expect(sso).toBeInTheDocument();
    sso.click();
    const cn = screen.getByPlaceholderText("Enter Username")
    expect(cn).toBeInTheDocument();
    fireEvent.change(cn, { target: { value: "dummy" } });

    const pass = screen.getByPlaceholderText("Enter Password");
    expect(pass).toBeInTheDocument();
    fireEvent.change(pass, { target: { value: "dummy" } });
    fireEvent.keyUp(cn, { code: "Enter" });
  });
  it("should be in the document", () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: "?show_normal_login=y"
      },
      writable: true
    });
    render(<Provider data={{ theme: "light", token: undefined, user: undefined }}>
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
    const cn = screen.getByPlaceholderText("Enter Username")
    expect(cn).toBeInTheDocument();
    fireEvent.change(cn, { target: { value: "dummy" } });

    const pass = screen.getByPlaceholderText("Enter Password");
    expect(pass).toBeInTheDocument();
    fireEvent.change(pass, { target: { value: "dummy" } });
    fireEvent.keyUp(cn, { code: "Enter" });
  });
  it("should be in the document", () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: "?show_normal_login=n"
      },
      writable: true
    });
    render(<Provider data={{ theme: undefined, token: undefined, user: undefined }}>
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
});

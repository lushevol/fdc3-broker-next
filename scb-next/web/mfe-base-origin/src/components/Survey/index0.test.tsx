import { render, screen } from "@testing-library/react";
import React from "react";
import useController from "./common/useController";
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
    getEnv: () => "UAT",
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
vi.mock("../../hooks/service", () => {
  return {
    putService: async (path, data, signal = undefined) => { return Promise.resolve({}) },
    postService: async (path, data, signal = undefined) => { return Promise.resolve({}) },
    getService: async (path, signal = undefined) => { return Promise.resolve({}) }
  }
});

const DIV = () => {
  const { continuLogout,
    stopLogout,
    openSurveyAndHide,
  } = useController({
    surveyLink: "",
    openPopUp: () => { },
    setOpen: () => { },
  });
  return (<div>
    <strong>Leave Now?</strong>
   
    <button
      onClick={() => {
        continuLogout();
      }}
      data-testid="Logout_Btn"
    >
      Logout
    </button>
    <button
      onClick={stopLogout}
      data-testid="Hide_Btn"
    >
      Hide Dialog
    </button>
    <button
      onClick={openSurveyAndHide}
      data-testid="Go_Btn"
    >
      Go to Survey & Logout
    </button>
  </div>);
};

describe("Survey component", () => {
  it("Go_Btn should be in the document", () => {
    render(<DIV />);
    expect(screen).toBeDefined();
    expect(screen.getByText(/Leave Now?/i)).toBeInTheDocument();
    const Go_Btn = screen.getByTestId("Go_Btn");
    expect(Go_Btn).toBeInTheDocument();
    Go_Btn.click();
    const Hide_Btn = screen.getByTestId("Hide_Btn");
    expect(Hide_Btn).toBeInTheDocument();
    Hide_Btn.click();
    const Logout_Btn = screen.getByTestId("Logout_Btn");
    expect(Logout_Btn).toBeInTheDocument();
    Logout_Btn.click();
  });
});

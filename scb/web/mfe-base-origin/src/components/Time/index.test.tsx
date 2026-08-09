import { render, screen } from "@testing-library/react";
import React from "react";
import Root from ".";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import { TimeProps } from "./common/interface";
import { includesArray } from "./common/useController";

afterAll(() => {
  jest.clearAllMocks();
});
jest.mock('../../utils/common', () => {
  return {
    getJWTPayload: () => "JWT",
    storeData: jest.fn(),
    clearLocalStorage: jest.fn(),
    clearStorageWhenLogout: jest.fn(),
    uuidv4: () => "id",
    showErrorMsg: jest.fn(),
    show_error_msg: jest.fn(),
    getEnv: () => "UAT",
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

const Comp = (props: TimeProps) => {
  return (<Root {...props} />);
};

describe("Time component", () => {
  it("should be in the document", () => {
    render(<Provider>
      <ThemeProvider>
        <Comp
          value={new Date().toISOString()}
          isAccurateToDay={false}
          field={["creationDate"]}
          colDef={{ field: "" }}
        />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
  it("should be in the document", () => {
    render(<Provider>
      <ThemeProvider>
        <Comp
          value="2023-03-20T00:00:00.000Z"
          isAccurateToDay={false}
          field={["creationDate"]}
          colDef={{ field: "" }}
        />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
  it("should be in the document", () => {
    render(<Provider data={{ timeType: "local" }}>
      <ThemeProvider>
        <Comp
          value={new Date().getTime()}
          isAccurateToDay={true}
          field={["creationDate"]}
          colDef={{ field: "" }}
        />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
  it("should be in the document", () => {
    render(<Provider data={{ timeType: "local" }}>
      <ThemeProvider>
        <Comp
          value={new Date().getTime()}
          isAccurateToDay={false}
          field=""
          colDef={{ field: "" }}
        />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
  it("should be in the document", () => {
    render(<Provider data={{ timeType: "local" }}>
      <ThemeProvider>
        <Comp
          value={new Date().getTime()}
          isAccurateToDay={false}
          field={["Trade_Id"]}
          colDef={{ field: "" }}
        />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
  it("should be in the document", () => {
    render(<Provider data={{ timeType: "local" }}>
      <ThemeProvider>
        <Comp
          value={new Date().getTime()}
          isAccurateToDay={false}
          field=""
          colDef={{ field: "Package_Id" }}
        />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
  it("should be in the document", () => {
    render(<Provider data={{ timeType: "local" }}>
      <ThemeProvider>
        <Comp
          value="null"
          colDef={{ field: "Package_Id" }}
        />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
});

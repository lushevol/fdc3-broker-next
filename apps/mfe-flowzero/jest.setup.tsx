import React from "react";

// Mock SystemJS
function mockImport(name) {
  return Promise.resolve({
    getRoot: function () {
      return <section>home</section>;
    },
  });
}
const globalAny: any = global;
globalAny.System = {
  import: jest.fn(mockImport),
};
const mockComponent = (c) => {
  return <section>{c.children}</section>;
};
const mockButton = ({ children, ...rest }) => {
  return <button {...rest}>{children}</button>;
};
const mockAntFormInstance = {
  getFieldValue: (name) => name,
};

jest.mock("ag-grid-react", () => {
  const mockComponent = (c) => {
    return <section>{c.children}</section>;
  };
  return {
    AgGridReact: mockComponent,
  };
});

const CN_NETTING_RESULT = {
  data: {
    resultList: [
      {
        originalCashflowList: [
          {
            dataSourceSystem: "Stella",
            cashflowId: "092023042702",
            cashflowState: "QUEUED",
            eventType: "New",
            paymentDate: "2023-04-24",
            amount: 1001.02,
            currency: "USD",
            payReceiveIndicator: "Receive",
            bookingFmid: "10075222",
            couterpartyFmid: "400640613",
            allotment: "Equity Swap",
            businessVersion: "0",
            cashflowVersion: "0",
            minorVersion: "56",
            netId: "",
          },
          {
            dataSourceSystem: "Stella",
            cashflowId: "092023042703",
            cashflowState: "QUEUED",
            eventType: "New",
            paymentDate: "2023-04-24",
            amount: 1001.02,
            currency: "USD",
            payReceiveIndicator: "Receive",
            bookingFmid: "10075222",
            couterpartyFmid: "400640613",
            allotment: "Equity Swap",
            businessVersion: "0",
            cashflowVersion: "0",
            minorVersion: "56",
            netId: "",
          },
        ],
        previewCashflowList: [
          {
            dataSourceSystem: "Ratan",
            cashflowId: null,
            cashflowState: "QUEUED",
            eventType: "New",
            paymentDate: "2023-04-24",
            amount: 3003.06,
            currency: "USD",
            payReceiveIndicator: "Receive",
            bookingFmid: "10075222",
            couterpartyFmid: "400640613",
            allotment: "Equity Swap",
            businessVersion: "0",
            cashflowVersion: "0",
            minorVersion: "0",
            netId: null,
          },
        ],
        errorMsg: null,
        valid: true,
      },
    ],
  },
  status: 200,
};

jest.mock("./src/Root/common/component/MfeThemeProvider", () => {
  return {
    __esModule: true,
    default: mockComponent,
  };
});
jest.mock("./src/Root/import", () => {
  const ErrorBoundry = mockComponent;
  const Splash = mockComponent;
  const Loader = mockComponent;
  const ContainerProvider = {
    default: mockComponent,
    useContext: () => [{}, () => {}],
  };
  const ThemeConfig = () => ({ config: {} });
  const ThemeUtil = {
    getTheme: () => ({}),
  };

  const ReactRouterDom = {
    __esModule: true,
    ...(jest.requireActual("react-router-dom") as any),
  };
  const Service = {
    service: {
      get: jest.fn(async () => ({})),
      post: jest.fn(async () => ({})),
      put: jest.fn(async () => ({})),
      delete: jest.fn(async () => ({})),
    },
    putService: async (path, data, signal = undefined) => {
      return {};
    },
    postService: async (path, data, signal = undefined) => {
      return {};
    },
    getService: async (path, signal = undefined) => {
      return {};
    },
  };
  const useContainerDispatcher = () => ({
    dispacthLoading: (input: any) => {},
    dispacthOpenCashflow: (querys: any, type: string) => {},
  });
  const hooks = {
    store: {},
    setStore: function (store) {
      this.store = store;
    },
    baseDispatch: () => {},
    setBaseDispatch: function (dispatch) {
      this.baseDispatch = dispatch;
    },
  };
  const getHooks = () => hooks;
  const Hooks = { getHooks, hooks };
  const Time = mockComponent;

  const CommonUtil = {
    getEnv: () => {
      return "PROD";
    },
    getLocalStorage: jest.fn(() => {
      return {
        getItem: () => {
          return "mocked_token";
        },
      };
    }),
    uuidv4: jest.fn(() => "test"),
  };
  const LoadingButton = mockButton;
  const Button = mockButton;
  const ExtendTokenService = (path) => {};
  const useAnalytics = () => ({
    ButtonEvent: jest.fn(),
    TileEvent: jest.fn(),
    ModalEvent: jest.fn(),
    TabEvent: jest.fn(),
    SwitchEvent: jest.fn(),
    DropDownEvent: jest.fn(),
  });
  return {
    ErrorBoundry,
    Splash,
    Loader,
    ReactRouterDom,
    Service,
    Hooks,
    ContainerProvider,
    useContainerDispatcher,
    ThemeConfig,
    ThemeUtil,
    Time,
    CommonUtil,
    LoadingButton,
    Button,
    ExtendTokenService,
    useAnalytics,
  };
});

const mockMatchMedia = () => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

mockMatchMedia();

const mockRequestIdleCallback = () => {
  window.requestIdleCallback = jest.fn((cb) => {
    cb({
      didTimeout: false,
      timeRemaining: function (): number {
        return 0;
      },
    });
    return 100;
  });
};

mockRequestIdleCallback();

const mockPerformanceApi = () => {
  window.performance.mark = jest.fn();
  window.performance.clearMarks = jest.fn();
  window.performance.measure = jest.fn(() => ({
    duration: 0,
    detail: null,
    entryType: "",
    name: "",
    startTime: 0,
    toJSON: jest.fn(),
  }));
  window.performance.clearMeasures = jest.fn();
  window.performance.now = jest.fn(() => Math.random() * 100);
};

mockPerformanceApi();

const mockFetchApi = (data) => {
  window.fetch = jest.fn().mockImplementation(
    () => Promise.resolve({
      ok: true,
      json: () => data,
    }
  ));
}

mockFetchApi({});

console.warn = (...args) => {};
console.error = (...args) => {};
console.log = (...args) => {};
jest.setTimeout(3_000);
process.env.MFE_APP_PREFIX_STYLE = "mocked";

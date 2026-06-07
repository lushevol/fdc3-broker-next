import { abort } from "process";
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
    useContext: () => [{}, () => { }],
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
    dispacthLoading: (input: any) => { },
    dispacthOpenCashflow: (querys: any, type: string) => { },
  });
  const hooks = {
    store: {},
    setStore: function (store) {
      this.store = store;
    },
    baseDispatch: () => { },
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
  const ExtendTokenService = (path) => { };
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

jest.mock("./src/Root/import/ratandialog", () => {
  return {
    CashflowDetailsCNDialog: (props) => {
      return <div data-testid="cashflow-details-dialog"></div>;
    },

  };
});

jest.mock("./src/Root/import/ratancomponents", () => {
  return {
    Version: (props) => {
      return <div data-testid="add-comment"></div>;
    },
    FilterTags: (props) => {
      return <div data-testid="details-dialog"></div>;
    },
    TooltipCell: (props) => {
      return <div data-testid="cashflow-details-dialog"></div>;
    },
    DataGridCommentCell: (props) => {
      return <div data-testid="data-grid-comment-cell"></div>;
    },
    UpdateAffirmationStatus: (props) => {
      const { submit, onCloseFunction } = props;
      return (
        <div data-testid="update-affirmation-status">
          <button
            data-testid="update-affirmation-status-submit"
            onClick={() =>
              submit(mockAntFormInstance, "2023-01-01", "00:00:00")
            }
          ></button>
          <button
            data-testid="update-affirmation-status-cancel"
            onClick={() => onCloseFunction()}
          ></button>
        </div>
      );
    },
    DataGrid: jest.fn((props) => {
      const { columnDefs, rowData, gridOptions } = props;
      const { onRowDoubleClicked } = gridOptions;
      return (
        <div {...props}>
          {rowData?.map((row, index) => (
            <div
              data-testid={`datagrid-row-${index}`}
              onDoubleClick={() =>
                onRowDoubleClicked?.({ node: { data: row } })
              }
            >
              {columnDefs.map(c => <div>{c.cellRenderer ? c.cellRenderer({ data: row }) : row[c.field]}</div>)}
            </div>
          ))}
        </div>
      );
    }),
    DataGridClasses: {},
    FilterSelector: (props) => {
      return <div data-testid="hold-dialog"></div>;
    },
    ViewSelector: (props) => {
      return <div data-testid="view-selector"></div>;
    },
    FieldLabel: (props) => {
      return <div data-testid="field-label"></div>;
    },
    DynamickFieldLabel: (props) => {
      return <div data-testid="dynamic-field-label"></div>;
    },
    Dialog: (props) => {
      return <div data-testid="dialog"></div>;
    },
    MuiDialog: (props) => {
      const {
        children,
        destoryWhenHidden,
        open,
        onClose,
        testId = "mui-dialog",
        ...rest
      } = props;
      return (
        <section
          {...rest}
          destoryWhenHidden={true}
          open={true}
          onClose={jest.fn()}
          data-testid={testId}
        >
          <button data-testid="MuiDialog-close-btn" onClick={onClose} />
          {children}
          {props.actions && <div>{props.actions}</div>}
        </section>
      );
    },
    useViewName: (props) => {
      return [];
    },
    Loading: (props) => {
      return <div data-testid="loading"></div>;
    },
    CustomForm: (props) => {
      return (
        <div {...props}>
          <button data-testid="custom-form-submit-btn" onClick={props.onSubmit}>
            submit
          </button>
          <button data-testid="custom-form-reject-btn" onClick={props.onReject}>
            reject
          </button>
        </div>
      );
    },
    ItemsComponent: (props) => {
      return <div data-testid="items-component"></div>;
    },
    QuickSearchInput: (props) => {
      return <div data-testid="quick-search-input"></div>;
    },
    QuickSearchDynamickSelect: (props) => {
      return <div data-testid="quick-search-dynamic-select"></div>;
    },
    QuickSearchPicker: (props) => {
      return <div data-testid="quick-search-picker"></div>;
    },
    QuickSearchSelect: (props) => {
      return <div data-testid="quick-search-select"></div>;
    },
    QuickSearchManyInOne: (props) => {
      return <div data-testid="quick-search-many-in-one"></div>;
    },
    PopoverDetails: (props) => {
      return <div data-testid="popover-details">{props.children}</div>;
    },
    SwiftMessageDialog: (props) => {
      return <div data-testid="swift-message-dialog">{props.children}</div>;
    },
    HistoryDetailsDialog: (props) => {
      return <div data-testid="history-details-dialog">{props.children}</div>;
    },
    CounterpartyDetailsV2: (props) => {
      return <div data-testid="counterparty-details-v2">{props.children}</div>;
    },
    EntityDetails: (props) => {
      return <div data-testid="entity-details">{props.children}</div>;
    },
    HandleHoliday: (props) => {
      return <div data-testid="handle-holiday">{props.children}</div>;
    },
    debounceGetDynamicList: jest.fn(),
    getDynamicListForPortfolio: jest.fn(),
    rtCreatePortal: (props) => { },
    ShowTimeCompare: jest.fn(),
    PRODUCT_DESCRIPTION_FIELDS: [],
    useRatanDispatcher: () => {
      return {
        dispatchVersionState: () => { },
        dispatchApiStatusList: () => { },
      };
    },
    useRatanContext: () => {
      return [
        {
          refreshState: 1,
        },
      ];
    },
    getRole: jest.fn(() => false),
    AdvancedSearch: (props) => {
      return <div data-testid="advanced-search">{props.children}</div>;
    },
    hydrate: jest.fn(() => {
      return {
        rules: [
          {
            field: "Cashflow.Payment_Currency",
            value: "USD",
            operator: "=",
          },
          {
            field: "Cashflow.Payment_Amount",
            value: "100",
            operator: "=",
          },
        ],
        combinator: "and",
      };
    }),
    dehydrate: jest.fn(() => ""),
    defaultOperators: [],
    QueryBuilder: (props) => {
      return <div data-testid="query-builder">{props.children}</div>;
    },
    SimpleAmount: jest.fn(({ value, formatOptions }) => value),
    generateTemplateFilterRecord: jest.fn(() => ({})),
    initialQuery: {
      combinator: "and",
      rules: [],
    },
    ratanFieldConfigPreprocessing: (props) => {
      return {
        ...props,
        valueList: [],
      };
    },
  };
});

jest.mock("./src/Root/import/ratanutils", () => {
  class MockNum {
    constructor(v) {
      this._value = v;
      this._rawValue = v;
    }
    static num(v) {
      return new MockNum(v);
    }
    static round(input, precision = 0) {
      const formatted = MockNum.num(input).format({ mantissa: precision });
      return MockNum.parseToNumber(formatted);

    }
    static parse(input, format) {
      return new MockNum(MockNum.parseToNumber(input, format));
    }
    static parseToNumber(input, format?) {
      return Number(input);
    }
    static random(lower = 0, upper = 1, floating) {
      return lower;
    }
    add(other) {
      return new MockNum(Number(this._value) + Number(other));
    }
    subtract(other) {
      return new MockNum(Number(this._value) - Number(other));
    }
    multiply(other) {
      return new MockNum(Number(this._value) * Number(other));
    }
    divide(other) {
      return new MockNum(Number(this._value) / Number(other));
    }
    value() {
      return this._value;
    }
    getRawValue() {
      return this._rawValue;
    }
    toString() {
      return this.format();
    }
    format(params) {
      const precision = params?.mantissa ?? 0;
      const factor = Math.pow(10, precision);
      const val = Math.floor(Number(this._value) * factor) / factor;
      return val.toFixed(precision);
    }
  }

  return {
    hasPermission: (ec: string) => true,
    getUser: () => ({ id: "123456", entitlements: ["TEST:entitlement_test"] }),
    getEnable: () => true,
    getRealIdOfTrade: jest.fn(() => "test"),
    conversionGroup: jest.fn(),
    conversionCascaderOptions: jest.fn(),
    conversionViewOptions: jest.fn(),
    conversionColDef: jest.fn(),
    conversionDQSLRequest: jest.fn(() => ""),
    getDisplayFields: jest.fn(() => ""),
    queryGraphql: jest.fn(async () => ({})),
    gql: jest.fn(() => ""),
    judgeDefaultFilter: jest.fn(),
    handleMultiFieldsQuery: jest.fn(() => []),
    sortBusinessFields: jest.fn(),
    queryCashflow: jest.fn(async () => ({
      cashflowsNew: {
        results: [
          {
            Cashflow: {
              Cashflow_Id: "test_cashflow_id",
            },
          },
        ],
        pageInfo: {
          lastPage: true,
          totalHits: 0,
          pageNo: 0,
          pageSize: 500,
        },
      },
    })),
    filtering: jest.fn(),
    isEmpty: jest.fn(() => false),
    getTimeDiff: jest.fn(async () => ({})),
    changeKeyToLabel: jest.fn(),
    priceCellFormatterWithComma: jest.fn(),
    deepClone: jest.fn((value) => value),
    formatMultiInputValue: jest.fn(),
    getRangepickerValue: jest.fn(),
    getOperator: jest.fn(),
    displayCountDownTime: jest.fn(),
    styleForCountDownTime: jest.fn(),
    customColumSort: jest.fn(),
    removeSpacesFromStrings: jest.fn(),
    randomString: jest.fn(),
    holidayDB: {
      clear() { },
    },
    cashflowNetting: jest.fn(async () => CN_NETTING_RESULT),
    cashflowNettingPreview: jest.fn(async () => CN_NETTING_RESULT),
    CASHFLOW_NOTIFICATION_SUBSCRIPTIONS: "",
    cashflowUserStatusUpdate: jest.fn(async () => ({})),
    onGridBodyScroll: jest.fn(),
    eventBus: {
      emit: jest.fn(),
      addListener: jest.fn(),
      removeAllListeners: jest.fn(),
    },
    eventTypes: jest.fn(),
    getBusinessFieldsFromCache: jest.fn(async () => ({
      cashflowFields: [
        {
          indexedTerm: "Entity.Booking_Entity_SCI_FMID",
          operator: "EQ",
          valueList: "",
          businessTerm: "",
          dataType: "",
          subSelection: "",
        },
      ],
      cashflowAndTradeFields: [
        {
          indexedTerm: "Entity.Booking_Entity_SCI_FMID",
          operator: "EQ",
          valueList: "",
          businessTerm: "",
          dataType: "",
          subSelection: "",
        },
      ],
    })),
    useParentData: jest.fn(() => {
      return { isInitComplete: true };
    }),
    isNumber: jest.fn(() => true),
    formatePrice: jest.fn((value) => value),
    swiftMessageDetails: jest.fn(() => "legacy swift test"),
    getValidationRulesFromRuleService: jest.fn(async () => []),
    queryTradeDetialsHeader: async () =>
      Promise.resolve({ tradeHeaders: { results: [] } }),
    queryCustomTradeData: async () =>
      Promise.resolve({ trades: { results: [] } }),
    queryTradeAllFields: async () =>
      Promise.resolve({ allData: { trades: { results: [] } } }),
    queryTradeVersionsData: async () =>
      Promise.resolve({ tradeVersions: { results: [] } }),
    queryCashflowDialogCashflowDetail: async () =>
      Promise.resolve({
        cashflows: { results: [] },
        cashflowsNew: { results: [] },
      }),
    queryCashFlowAuditTrail: async () =>
      Promise.resolve({ cashflowAuditTrail: [] }),
    cashflowHold: jest.fn(async () => ({})),
    cashflowUnhold: jest.fn(async () => ({})),
    getTradeStatusArray: jest.fn(() => []),
    getFilterDetails: async () => Promise.resolve([]),
    getFilterList: async () => Promise.resolve([]),
    postSaveFilter: async () => Promise.resolve([]),
    putUpdateFilter: async () => Promise.resolve([]),
    deleteFilter: async () => Promise.resolve([]),
    getEBBSAcountingDetail: jest.fn(async () => []),
    getSwiftMessageByCashflowId: jest.fn(async () => [""]),
    logger: {
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
    },
    Num: MockNum,
    num: MockNum.num
  };
});

jest.mock('./src/Root/import/packages/Analysis', () => {
  const mockNext = jest.fn((nextPoint: string) => ({
    next: mockNext,
    complete: jest.fn(),
    abort: jest.fn()
  }));
  return {
    useTimeCost: jest.fn(() => ({
      startTracking: jest.fn(() => ({
        completeTracking: jest.fn(),
        abortTracking: jest.fn(),
      }))
    })),
    useRTT: jest.fn(() => ({
      startTracking: jest.fn(() => ({
        completeTracking: jest.fn(),
        abortTracking: jest.fn(),
      }))
    })),
    useDisplayResolution: jest.fn(),
    useIterableCollect: jest.fn(() => ({
      startTracking: jest.fn((name: string) => mockNext)
    })),
    useBatchCollect: jest.fn(() => ({
      startTracking: jest.fn((name: string) => jest.fn()),
    })),
    useBatchCollectWithCount: jest.fn(() => ({
      startTracking: jest.fn((name: string) => jest.fn()),
    })),
    useE2Elatency: jest.fn((name: string) => ({
      initTrackingPoints: jest.fn(),
      addTrackingPoint: jest.fn(),
      completeTracking: jest.fn(),
      abortTracking: jest.fn(),
    })),
    E2ELatencyStoreWrap: ({ children }) => <div>{children}</div>,
    usePageView: jest.fn(),
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

console.warn = (...args) => { };
console.error = (...args) => { };
console.log = (...args) => { };
jest.setTimeout(3_000);
process.env.MFE_APP_PREFIX_STYLE = "mocked";

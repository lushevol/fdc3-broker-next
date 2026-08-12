import React from "react";
import "fake-indexeddb/auto";
const mockComponent = ({ children, ...rest }) => {
  return <section {...rest}>{children}</section>;
}
// Mock SystemJS
function mockImport(name) {
  return Promise.resolve({
    __esModule: true,
    default: mockComponent,
    [name]: mockComponent,
    getRoot: mockComponent,
  });
}
// @ts-ignore
global.System = {
  // @ts-ignore
  import: jest.fn(mockImport),
};
// @ts-ignore
global.requestIdleCallback = jest.fn((cb) => {
  cb({
    didTimeout: false,
    timeRemaining: function (): number {
      return 0;
    }
  });
  return 100;
});
// @ts-ignore
jest.mock('./src/Root/import', () => {
  const ErrorBoundry = mockComponent;
  const Splash = mockComponent;
  const Loader = mockComponent;
  const LoadingButton = mockComponent;
  const Button = mockComponent;
  const Time = mockComponent;
  const Dialog= jest.fn((props) => {
    const {title, children, onClose, onResize}= props;
    return <section title={title}>{children}
    <button data-testid="dialog-close" onClick={onClose}>Close</button>
    <button data-testid="dialog-resize" onClick={onResize}>Resize</button>
    </section>;
  });
  const ContainerProvider = {
    default: mockComponent,
    useContext: () => ([{}, () => { }])
  };
  const ThemeConfig = () => ({ config: {} });
  const ThemeUtil = {
    getTheme: () => ({}),
  };

  const ReactRouterDom = {
    __esModule: true,
    // @ts-ignore
    ...jest.requireActual('react-router-dom') as any,
  };
  // @ts-ignore
  const funct = async (path, data, signal = undefined) => { return Promise.resolve({}) };
  const service = {
    get: funct,
    post: funct,
    put: funct,
    patch: funct,
    delete: funct
  };
  const Service = {
    putService: funct,
    postService: funct,
    getService: funct,
    service
  };
  const useContainerDispatcher = () => ({
    dispacthLoading: (input: any) => { }
  });
  const user = JSON.parse(`{"sub":"1243644","iss":"single-ui-bff","entitlement":{"role":"FMO_OPS_SUP","actions":["RATAN_TRADE_BLOTTER:F_Custom_Query_Builder","RATAN_TRADE_BLOTTER:F_Custom_View_Builder_Private","RATAN_TRADE_BLOTTER:F_Custom_View_Builder_Public","RATAN_TRADE_BLOTTER:F_Export_Data","RATAN_TRADE_BLOTTER:F_Retrigger_Confirmation_Dispatch","RATAN_TRADE_BLOTTER:F_Trade_Affirmation_Status_Change","RATAN_TRADE_BLOTTER:UI_Read_Access","RATAN_TRADE_BLOTTER:UI_View_Brokerage_Detail","RATAN_TRADE_BLOTTER:UI_View_Confirmation_Status","RATAN_TRADE_BLOTTER:UI_View_Counterparty_Data","RATAN_TRADE_BLOTTER:UI_View_Trade_Audit_History","RATAN_TRADE_BLOTTER:UI_View_Trade_Data","RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_Nostro_Initiate","RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_Nostro_Verify","RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_SSI_Initiate","RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_SSI_Verify","RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_Suppress","RATAN_CASHFLOW_BLOTTER:F_Add_Settlement_Comment","RATAN_CASHFLOW_BLOTTER:F_Cashflow_Affirmation_Status_Change","RATAN_CASHFLOW_BLOTTER:F_Cashflow_Status_Change_Release","RATAN_CASHFLOW_BLOTTER:F_Custom_Query_Builder","RATAN_CASHFLOW_BLOTTER:F_Custom_View_Builder_Private","RATAN_CASHFLOW_BLOTTER:F_Custom_View_Builder_Public","RATAN_CASHFLOW_BLOTTER:F_Export_Data","RATAN_CASHFLOW_BLOTTER:F_Perform_Ad_Hoc_Netting","RATAN_CASHFLOW_BLOTTER:F_Perform_Cashflow_Split","RATAN_CASHFLOW_BLOTTER:F_Perform_Un_Net_Initiate","RATAN_CASHFLOW_BLOTTER:F_Perform_Un_Net_Verify","RATAN_CASHFLOW_BLOTTER:F_Reinstate","RATAN_CASHFLOW_BLOTTER:UI_Read_Access","RATAN_CASHFLOW_BLOTTER:UI_View_Cashflow_Data","RATAN_CASHFLOW_BLOTTER:UI_View_Counterparty_Data","RATAN_MO_EXCEPTION:F_Custom_View_Builder_Private","RATAN_MO_EXCEPTION:UI_Read_Access","RATAN_VALIDATION_EXCEPTION:F_Custom_View_Builder_Private","RATAN_VALIDATION_EXCEPTION:F_Custom_View_Builder_Public","RATAN_VALIDATION_EXCEPTION:F_Manually_Close_Exception","RATAN_VALIDATION_EXCEPTION:F_Replay_Exception","RATAN_VALIDATION_EXCEPTION:F_Trade_Affirmation_Status_Change","RATAN_VALIDATION_EXCEPTION:UI_Read_Access","RATAN_SETTLEMENT_EXCEPTION:F_Custom_View_Builder_Private","RATAN_SETTLEMENT_EXCEPTION:F_Custom_View_Builder_Public","RATAN_SETTLEMENT_EXCEPTION:F_Input_Delete_Modify_SI_Initiate","RATAN_SETTLEMENT_EXCEPTION:F_Input_Delete_Modify_SI_Verify","RATAN_SETTLEMENT_EXCEPTION:F_Manual_Fix","RATAN_SETTLEMENT_EXCEPTION:F_Manually_Close_Exception","RATAN_SETTLEMENT_EXCEPTION:F_Replay_Exception","RATAN_SETTLEMENT_EXCEPTION:UI_Read_Access","RATAN_WORKFLOW:UI_Read_Access","RATAN_SUPPRESSION_RULE:F_Input_Delete_Modify_Initiate","RATAN_SUPPRESSION_RULE:F_Input_Delete_Modify_Verify","RATAN_SUPPRESSION_RULE:UI_View_Rule_Audit_History","RATAN_SUPPRESSION_RULE:UI_View_Suppression_Rule_Table","RATAN_SETTLEMENT_STP_RULE:F_Input_Delete_Modify_Initiate","RATAN_SETTLEMENT_STP_RULE:F_Input_Delete_Modify_Verify","RATAN_SETTLEMENT_STP_RULE:UI_View_Rule_Audit_History","RATAN_SETTLEMENT_STP_RULE:UI_View_STP_Rule_Table","RATAN_CURRENCY_NSTP_RULE:F_Input_Delete_Modify_Initiate","RATAN_CURRENCY_NSTP_RULE:F_Input_Delete_Modify_Verify","RATAN_CURRENCY_NSTP_RULE:UI_View_NSTP_Rule_Table","RATAN_CURRENCY_NSTP_RULE:UI_View_Rule_Audit_History","RATAN_ISO_CURRENCY_MAPPING:UI_View_Currency_Mapping_Table","RATAN_ISO_CURRENCY_MAPPING:UI_View_Rule_Audit_History","RATAN_NETTING_RULE:F_Input_Delete_Modify_Initiate","RATAN_NETTING_RULE:F_Input_Delete_Modify_Verify","RATAN_NETTING_RULE:UI_View_Netting_Rule_Table","RATAN_NETTING_RULE:UI_View_Rule_Audit_History","RATAN_CURRENCY_CUTOFF:F_Input_Delete_Modify_CUTOFF_Initiate","RATAN_CURRENCY_CUTOFF:F_Input_Delete_Modify_CUTOFF_Verify","RATAN_CURRENCY_CUTOFF:UI_Read_Access","PORTAL_CDU_ISLAMIC:UI_Read_Access"],"dataEntitlementRoles":""},"exp":1678957305,"iat":1678928505,"userLoginTime":"2023-03-16T01:01:45.948Z[GMT]","jti":"single-ui-bff-id","id":"1243644","fullName":"1243644","name":"1243644","userId":"1243644"}`);
  const hooks = {
    store: { user, theme: "dark", token: "a a",  currentWorkspace:{
      id:"1",
      label: "Trade Blotter "
    } },
    setStore: function (store) {
      this.store = store;
    },
    baseDispatch: () => { },
    setBaseDispatch: function (dispatch) {
      this.baseDispatch = dispatch;
    },
  };
  const getHooks = jest.fn(() => hooks);
  const Hooks = { getHooks, hooks };
  let sessionstorage = {}
  let localstorage = {}
  const CommonUtil = {
    getEnv: () => { return "PROD" },
    isNumber: (val: any) => {
      return !isNaN(`${val}` as unknown as number);
    },
    isDate: (val: any) => {
      const result = new Date(val);
      return result instanceof Date && !isNaN(result.valueOf());
    },
    getSessionStorage: () => ({
      getItem: (key) => sessionstorage[key],
      setItem: (key, val) => { sessionstorage[key] = val },
      clear: () => sessionstorage = {},
      removeItem: (key) => delete sessionstorage[key],
    }),
    getLocalStorage: () => ({
      getItem: (key) => localstorage[key],
      setItem: (key, val) => { localstorage[key] = val },
      clear: () => localstorage = {},
      removeItem: (key) => delete localstorage[key],
    }),
    showErrorMsg: () => { },
    clearLocalStorage: () => { },
    storeData: (k, v) => {
      CommonUtil.getSessionStorage().setItem(k, v);
      CommonUtil.getLocalStorage().setItem(k, v);
    },
    formatDate: (value) => value,
    formatDateToISO: (value) => value,
    uuidv4: jest.fn(() => "test"),
  };
  const ExtendTokenService = (path)=>{}
  const useAnalytics = () => ({
    ButtonEvent: jest.fn(),
    TileEvent: jest.fn(),
    ModalEvent: jest.fn(),
    TabEvent: jest.fn(),
    SwitchEvent: jest.fn(),
    DropDownEvent: jest.fn(),
  });
  return {
    ExtendTokenService,
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
    CommonUtil,
    LoadingButton,
    Time,
    Button,
    Dialog,
    useAnalytics,
  }
});
console.error = (...args) => { };
console.log = (...args) => { };
console.info = (...args) => { };
// @ts-ignore
jest.setTimeout(3000);

Object.defineProperty(window, 'ratanConfig', {
  value: {
    trades: {
      tradesCustomFields: {
        "Direction": {
          "colDefs": {
            "hide": false,
            "valueGetter": "formatBuySell",
            "cellRenderer": "handleDirection"
          }
        },
      },
      customSearchFilter: [
        {
          "field": "Entity.Person.Trader_PSID",
          "filterText": "(\\\"Entity.Person.Trader_PSID\\\" = '{value}' and \\\"Data_Flow.Data_Source_System\\\" IN ('Blade', 'S2BX')) or (\\\"Entity.Person.Trader_Source_System_Person_Id\\\" = '{value}' and \\\"Data_Flow.Data_Source_System\\\" = 'S2BX')",
          "combineField": "Entity.Person.Trader_Source_System_Person_Id"
        }
      ],
    },
    cashflow:{
      defaultQueryPortfolios:[
        "BTB-SHANGHAI-IR-STL",
        "BTB_BEIJING_IR_STL",
      ],
    }
  },
  writable: true
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
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

jest.mock('@react-querybuilder/antd', () => {
  return {
    __esModule: true,
    default: mockComponent,
    QueryBuilderAntD: mockComponent,
    AntDValueSelector: mockComponent,
    AntDActionElement: mockComponent,
  }
});

jest.mock('file-saver', () => {
  return {
    saveAs: () => {}
  }
})
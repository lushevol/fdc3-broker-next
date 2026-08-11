import { render, screen } from "@testing-library/react";
import React from "react";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import useController from "./useController";
afterAll(() => {
  jest.clearAllMocks();
});
jest.mock("../../services", () => {
  const validate = () => Promise.resolve({ data: { "result": true, "expiration": "2023-03-16T09:01:45.000+00:00" } });
  return () => ({
    validate,
    logout: () => { return Promise.resolve({}) },
  })
});
jest.mock('../../utils/common', () => {
  return {
    getJWTPayload: (t) => ({ exp: undefined, iat: undefined, userLoginTime: new Date().toISOString() }),
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

const user = JSON.parse(`{"sub":"1243644","iss":"single-ui-bff","entitlement":{"role":"FMO_OPS_SUP","actions":["RATAN_TRADE_BLOTTER:F_Custom_Query_Builder","RATAN_TRADE_BLOTTER:F_Custom_View_Builder_Private","RATAN_TRADE_BLOTTER:F_Custom_View_Builder_Public","RATAN_TRADE_BLOTTER:F_Export_Data","RATAN_TRADE_BLOTTER:F_Match_Confirmed_Status_Change","RATAN_TRADE_BLOTTER:F_Retrigger_Confirmation_Dispatch","RATAN_TRADE_BLOTTER:F_Trade_Affirmation_Status_Change","RATAN_TRADE_BLOTTER:F_View_Confirmation","RATAN_TRADE_BLOTTER:UI_Read_Access","RATAN_TRADE_BLOTTER:UI_View_Brokerage_Detail","RATAN_TRADE_BLOTTER:UI_View_Cashflow_Status","RATAN_TRADE_BLOTTER:UI_View_Confirmation_Status","RATAN_TRADE_BLOTTER:UI_View_Counterparty_Data","RATAN_TRADE_BLOTTER:UI_View_Instrument_Detail","RATAN_TRADE_BLOTTER:UI_View_SSI_Data","RATAN_TRADE_BLOTTER:UI_View_Trade_Audit_History","RATAN_TRADE_BLOTTER:UI_View_Trade_Data","RATAN_TRADE_BLOTTER:UI_View_Trade_Version_Differences","RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_Nostro_Initiate","RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_Nostro_Verify","RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_SSI_Initiate","RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_SSI_Verify","RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_Suppress","RATAN_CASHFLOW_BLOTTER:F_Add_Settlement_Comment","RATAN_CASHFLOW_BLOTTER:F_Cashflow_Affirmation_Status_Change","RATAN_CASHFLOW_BLOTTER:F_Cashflow_Status_Change_Release","RATAN_CASHFLOW_BLOTTER:F_Custom_Query_Builder","RATAN_CASHFLOW_BLOTTER:F_Custom_View_Builder_Private","RATAN_CASHFLOW_BLOTTER:F_Custom_View_Builder_Public","RATAN_CASHFLOW_BLOTTER:F_Export_Data","RATAN_CASHFLOW_BLOTTER:F_Modify_Settlement_Means","RATAN_CASHFLOW_BLOTTER:F_Perform_Ad_Hoc_Netting","RATAN_CASHFLOW_BLOTTER:F_Perform_Cashflow_Split","RATAN_CASHFLOW_BLOTTER:F_Perform_Un_Net_Initiate","RATAN_CASHFLOW_BLOTTER:F_Perform_Un_Net_Verify","RATAN_CASHFLOW_BLOTTER:F_Reinstate","RATAN_CASHFLOW_BLOTTER:UI_Read_Access","RATAN_CASHFLOW_BLOTTER:UI_View_Cashflow_Data","RATAN_CASHFLOW_BLOTTER:UI_View_Cashflow_Status","RATAN_CASHFLOW_BLOTTER:UI_View_Counterparty_Data","RATAN_CASHFLOW_BLOTTER:UI_View_SSI_Data","RATAN_MO_EXCEPTION:F_Custom_View_Builder_Private","RATAN_MO_EXCEPTION:UI_Read_Access","RATAN_VALIDATION_EXCEPTION:F_Custom_View_Builder_Private","RATAN_VALIDATION_EXCEPTION:F_Custom_View_Builder_Public","RATAN_VALIDATION_EXCEPTION:F_Manually_Close_Exception","RATAN_VALIDATION_EXCEPTION:F_Replay_Exception","RATAN_VALIDATION_EXCEPTION:F_Trade_Affirmation_Status_Change","RATAN_VALIDATION_EXCEPTION:UI_Read_Access","RATAN_SETTLEMENT_EXCEPTION:F_Custom_View_Builder_Private","RATAN_SETTLEMENT_EXCEPTION:F_Custom_View_Builder_Public","RATAN_SETTLEMENT_EXCEPTION:F_Input_Delete_Modify_SI_Initiate","RATAN_SETTLEMENT_EXCEPTION:F_Input_Delete_Modify_SI_Verify","RATAN_SETTLEMENT_EXCEPTION:F_Manual_Fix","RATAN_SETTLEMENT_EXCEPTION:F_Manually_Close_Exception","RATAN_SETTLEMENT_EXCEPTION:F_Replay_Exception","RATAN_SETTLEMENT_EXCEPTION:UI_Read_Access","RATAN_WORKFLOW:UI_Read_Access","RATAN_SUPPRESSION_RULE:F_Input_Delete_Modify_Initiate","RATAN_SUPPRESSION_RULE:F_Input_Delete_Modify_Verify","RATAN_SUPPRESSION_RULE:UI_View_Rule_Audit_History","RATAN_SUPPRESSION_RULE:UI_View_Suppression_Rule_Table","RATAN_SETTLEMENT_STP_RULE:F_Input_Delete_Modify_Initiate","RATAN_SETTLEMENT_STP_RULE:F_Input_Delete_Modify_Verify","RATAN_SETTLEMENT_STP_RULE:UI_View_Rule_Audit_History","RATAN_SETTLEMENT_STP_RULE:UI_View_STP_Rule_Table","RATAN_CURRENCY_NSTP_RULE:F_Input_Delete_Modify_Initiate","RATAN_CURRENCY_NSTP_RULE:F_Input_Delete_Modify_Verify","RATAN_CURRENCY_NSTP_RULE:UI_View_NSTP_Rule_Table","RATAN_CURRENCY_NSTP_RULE:UI_View_Rule_Audit_History","RATAN_ISO_CURRENCY_MAPPING:UI_View_Currency_Mapping_Table","RATAN_ISO_CURRENCY_MAPPING:UI_View_Rule_Audit_History","RATAN_NETTING_RULE:F_Input_Delete_Modify_Initiate","RATAN_NETTING_RULE:F_Input_Delete_Modify_Verify","RATAN_NETTING_RULE:UI_View_Netting_Rule_Table","RATAN_NETTING_RULE:UI_View_Rule_Audit_History","RATAN_CURRENCY_CUTOFF:F_Input_Delete_Modify_CUTOFF_Initiate","RATAN_CURRENCY_CUTOFF:F_Input_Delete_Modify_CUTOFF_Verify","RATAN_CURRENCY_CUTOFF:UI_Read_Access","PORTAL_CDU_ISLAMIC:UI_Read_Access"],"dataEntitlementRoles":""},"exp":1678957305,"iat":1678928505,"userLoginTime":"2023-03-16T01:01:45.948Z[GMT]","jti":"single-ui-bff-id","id":"1243644","fullName":"1243644","name":"1243644","userId":"1243644"}`);
const token = "Bearer abc";

const Comp = () => {
  const { checkSession } = useController();
  React.useEffect(() => {
    checkSession();
  }, []);
  return (<div />);
};

describe("Routing component", () => {
  it("should be in the document", () => {
    Object.defineProperty(window, 'fin', {
      value: {},
      writable: true
    });
    render(<Provider data={{ theme: "light", token, user }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
});

vi.mock('./common', () => {
  return {
    getEnv: () => "LOCAL",
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
    uuidv4: () => "id",
    storeData: vi.fn(),
    getJWTPayload: (t) => ({ exp: "a", iat: "b", userLoginTime: new Date().toISOString(), entitlements: JSON.stringify({ "FSS_PAYMENTS_SERVICES_TH:FSS_PS_SUPER_USER": {} }) }),
    clearStorageWhenLogout: vi.fn(),
  }
});
import { AxiosResponse } from "axios";
import { handleEntities, handleLogin, handleUser, handleRefreshToken, handleEntitlementsToken, handleLoginEntities, dispacthUserLoginTime, handleDrawers } from "./login";

describe("Login Util", () => {
  it("should be true", () => {
    const entitlementsToken = "aaa"
    handleUser({ status: 200, data: { "userInfo": "{\"sub\":\"1243644\",\"iss\":\"single-ui-bff\",\"entitlements\":\"{\\\"role\\\":\\\"FMO_OPS_SUP\\\",\\\"actions\\\":[\\\"RATAN_TRADE_BLOTTER:F_Custom_Query_Builder\\\",\\\"RATAN_TRADE_BLOTTER:F_Custom_View_Builder_Private\\\",\\\"RATAN_TRADE_BLOTTER:F_Custom_View_Builder_Public\\\",\\\"RATAN_TRADE_BLOTTER:F_Export_Data\\\",\\\"RATAN_TRADE_BLOTTER:F_Match_Confirmed_Status_Change\\\",\\\"RATAN_TRADE_BLOTTER:F_Retrigger_Confirmation_Dispatch\\\",\\\"RATAN_TRADE_BLOTTER:F_Trade_Affirmation_Status_Change\\\",\\\"RATAN_TRADE_BLOTTER:F_View_Confirmation\\\",\\\"RATAN_TRADE_BLOTTER:UI_Read_Access\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Brokerage_Detail\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Cashflow_Status\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Confirmation_Status\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Counterparty_Data\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Instrument_Detail\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_SSI_Data\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Trade_Audit_History\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Trade_Data\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Trade_Version_Differences\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_Nostro_Initiate\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_Nostro_Verify\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_SSI_Initiate\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_SSI_Verify\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_Suppress\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Add_Settlement_Comment\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Cashflow_Affirmation_Status_Change\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Cashflow_Status_Change_Release\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Custom_Query_Builder\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Custom_View_Builder_Private\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Custom_View_Builder_Public\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Export_Data\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Modify_Settlement_Means\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Perform_Ad_Hoc_Netting\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Perform_Cashflow_Split\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Perform_Un_Net_Initiate\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Perform_Un_Net_Verify\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Reinstate\\\",\\\"RATAN_CASHFLOW_BLOTTER:UI_Read_Access\\\",\\\"RATAN_CASHFLOW_BLOTTER:UI_View_Cashflow_Data\\\",\\\"RATAN_CASHFLOW_BLOTTER:UI_View_Cashflow_Status\\\",\\\"RATAN_CASHFLOW_BLOTTER:UI_View_Counterparty_Data\\\",\\\"RATAN_CASHFLOW_BLOTTER:UI_View_SSI_Data\\\",\\\"RATAN_MO_EXCEPTION:F_Custom_View_Builder_Private\\\",\\\"RATAN_MO_EXCEPTION:UI_Read_Access\\\",\\\"RATAN_VALIDATION_EXCEPTION:F_Custom_View_Builder_Private\\\",\\\"RATAN_VALIDATION_EXCEPTION:F_Custom_View_Builder_Public\\\",\\\"RATAN_VALIDATION_EXCEPTION:F_Manually_Close_Exception\\\",\\\"RATAN_VALIDATION_EXCEPTION:F_Replay_Exception\\\",\\\"RATAN_VALIDATION_EXCEPTION:F_Trade_Affirmation_Status_Change\\\",\\\"RATAN_VALIDATION_EXCEPTION:UI_Read_Access\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:F_Custom_View_Builder_Private\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:F_Custom_View_Builder_Public\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:F_Input_Delete_Modify_SI_Initiate\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:F_Input_Delete_Modify_SI_Verify\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:F_Manual_Fix\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:F_Manually_Close_Exception\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:F_Replay_Exception\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:UI_Read_Access\\\",\\\"RATAN_WORKFLOW:UI_Read_Access\\\",\\\"RATAN_SUPPRESSION_RULE:F_Input_Delete_Modify_Initiate\\\",\\\"RATAN_SUPPRESSION_RULE:F_Input_Delete_Modify_Verify\\\",\\\"RATAN_SUPPRESSION_RULE:UI_View_Rule_Audit_History\\\",\\\"RATAN_SUPPRESSION_RULE:UI_View_Suppression_Rule_Table\\\",\\\"RATAN_SETTLEMENT_STP_RULE:F_Input_Delete_Modify_Initiate\\\",\\\"RATAN_SETTLEMENT_STP_RULE:F_Input_Delete_Modify_Verify\\\",\\\"RATAN_SETTLEMENT_STP_RULE:UI_View_Rule_Audit_History\\\",\\\"RATAN_SETTLEMENT_STP_RULE:UI_View_STP_Rule_Table\\\",\\\"RATAN_CURRENCY_NSTP_RULE:F_Input_Delete_Modify_Initiate\\\",\\\"RATAN_CURRENCY_NSTP_RULE:F_Input_Delete_Modify_Verify\\\",\\\"RATAN_CURRENCY_NSTP_RULE:UI_View_NSTP_Rule_Table\\\",\\\"RATAN_CURRENCY_NSTP_RULE:UI_View_Rule_Audit_History\\\",\\\"RATAN_ISO_CURRENCY_MAPPING:UI_View_Currency_Mapping_Table\\\",\\\"RATAN_ISO_CURRENCY_MAPPING:UI_View_Rule_Audit_History\\\",\\\"RATAN_NETTING_RULE:F_Input_Delete_Modify_Initiate\\\",\\\"RATAN_NETTING_RULE:F_Input_Delete_Modify_Verify\\\",\\\"RATAN_NETTING_RULE:UI_View_Netting_Rule_Table\\\",\\\"RATAN_NETTING_RULE:UI_View_Rule_Audit_History\\\",\\\"RATAN_CURRENCY_CUTOFF:F_Input_Delete_Modify_CUTOFF_Initiate\\\",\\\"RATAN_CURRENCY_CUTOFF:F_Input_Delete_Modify_CUTOFF_Verify\\\",\\\"RATAN_CURRENCY_CUTOFF:UI_Read_Access\\\",\\\"PORTAL_CDU_ISLAMIC:UI_Read_Access\\\"],\\\"dataEntitlementRoles\\\":\\\"\\\"}\",\"exp\":1678982979,\"iat\":1678954179,\"userLoginTime\":\"2023-03-16T08:09:39.52Z[GMT]\",\"jti\":\"single-ui-bff-id\"}" }, headers: {} } as AxiosResponse)
    handleUser({ status: 200, data: { "userxInfo": "{\"sub\":\"1243644\",\"iss\":\"single-ui-bff\",\"entitlements\":\"{\\\"role\\\":\\\"FMO_OPS_SUP\\\",\\\"actions\\\":[\\\"RATAN_TRADE_BLOTTER:F_Custom_Query_Builder\\\",\\\"RATAN_TRADE_BLOTTER:F_Custom_View_Builder_Private\\\",\\\"RATAN_TRADE_BLOTTER:F_Custom_View_Builder_Public\\\",\\\"RATAN_TRADE_BLOTTER:F_Export_Data\\\",\\\"RATAN_TRADE_BLOTTER:F_Match_Confirmed_Status_Change\\\",\\\"RATAN_TRADE_BLOTTER:F_Retrigger_Confirmation_Dispatch\\\",\\\"RATAN_TRADE_BLOTTER:F_Trade_Affirmation_Status_Change\\\",\\\"RATAN_TRADE_BLOTTER:F_View_Confirmation\\\",\\\"RATAN_TRADE_BLOTTER:UI_Read_Access\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Brokerage_Detail\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Cashflow_Status\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Confirmation_Status\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Counterparty_Data\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Instrument_Detail\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_SSI_Data\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Trade_Audit_History\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Trade_Data\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Trade_Version_Differences\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_Nostro_Initiate\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_Nostro_Verify\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_SSI_Initiate\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_SSI_Verify\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_Suppress\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Add_Settlement_Comment\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Cashflow_Affirmation_Status_Change\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Cashflow_Status_Change_Release\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Custom_Query_Builder\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Custom_View_Builder_Private\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Custom_View_Builder_Public\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Export_Data\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Modify_Settlement_Means\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Perform_Ad_Hoc_Netting\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Perform_Cashflow_Split\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Perform_Un_Net_Initiate\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Perform_Un_Net_Verify\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Reinstate\\\",\\\"RATAN_CASHFLOW_BLOTTER:UI_Read_Access\\\",\\\"RATAN_CASHFLOW_BLOTTER:UI_View_Cashflow_Data\\\",\\\"RATAN_CASHFLOW_BLOTTER:UI_View_Cashflow_Status\\\",\\\"RATAN_CASHFLOW_BLOTTER:UI_View_Counterparty_Data\\\",\\\"RATAN_CASHFLOW_BLOTTER:UI_View_SSI_Data\\\",\\\"RATAN_MO_EXCEPTION:F_Custom_View_Builder_Private\\\",\\\"RATAN_MO_EXCEPTION:UI_Read_Access\\\",\\\"RATAN_VALIDATION_EXCEPTION:F_Custom_View_Builder_Private\\\",\\\"RATAN_VALIDATION_EXCEPTION:F_Custom_View_Builder_Public\\\",\\\"RATAN_VALIDATION_EXCEPTION:F_Manually_Close_Exception\\\",\\\"RATAN_VALIDATION_EXCEPTION:F_Replay_Exception\\\",\\\"RATAN_VALIDATION_EXCEPTION:F_Trade_Affirmation_Status_Change\\\",\\\"RATAN_VALIDATION_EXCEPTION:UI_Read_Access\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:F_Custom_View_Builder_Private\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:F_Custom_View_Builder_Public\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:F_Input_Delete_Modify_SI_Initiate\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:F_Input_Delete_Modify_SI_Verify\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:F_Manual_Fix\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:F_Manually_Close_Exception\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:F_Replay_Exception\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:UI_Read_Access\\\",\\\"RATAN_WORKFLOW:UI_Read_Access\\\",\\\"RATAN_SUPPRESSION_RULE:F_Input_Delete_Modify_Initiate\\\",\\\"RATAN_SUPPRESSION_RULE:F_Input_Delete_Modify_Verify\\\",\\\"RATAN_SUPPRESSION_RULE:UI_View_Rule_Audit_History\\\",\\\"RATAN_SUPPRESSION_RULE:UI_View_Suppression_Rule_Table\\\",\\\"RATAN_SETTLEMENT_STP_RULE:F_Input_Delete_Modify_Initiate\\\",\\\"RATAN_SETTLEMENT_STP_RULE:F_Input_Delete_Modify_Verify\\\",\\\"RATAN_SETTLEMENT_STP_RULE:UI_View_Rule_Audit_History\\\",\\\"RATAN_SETTLEMENT_STP_RULE:UI_View_STP_Rule_Table\\\",\\\"RATAN_CURRENCY_NSTP_RULE:F_Input_Delete_Modify_Initiate\\\",\\\"RATAN_CURRENCY_NSTP_RULE:F_Input_Delete_Modify_Verify\\\",\\\"RATAN_CURRENCY_NSTP_RULE:UI_View_NSTP_Rule_Table\\\",\\\"RATAN_CURRENCY_NSTP_RULE:UI_View_Rule_Audit_History\\\",\\\"RATAN_ISO_CURRENCY_MAPPING:UI_View_Currency_Mapping_Table\\\",\\\"RATAN_ISO_CURRENCY_MAPPING:UI_View_Rule_Audit_History\\\",\\\"RATAN_NETTING_RULE:F_Input_Delete_Modify_Initiate\\\",\\\"RATAN_NETTING_RULE:F_Input_Delete_Modify_Verify\\\",\\\"RATAN_NETTING_RULE:UI_View_Netting_Rule_Table\\\",\\\"RATAN_NETTING_RULE:UI_View_Rule_Audit_History\\\",\\\"RATAN_CURRENCY_CUTOFF:F_Input_Delete_Modify_CUTOFF_Initiate\\\",\\\"RATAN_CURRENCY_CUTOFF:F_Input_Delete_Modify_CUTOFF_Verify\\\",\\\"RATAN_CURRENCY_CUTOFF:UI_Read_Access\\\",\\\"PORTAL_CDU_ISLAMIC:UI_Read_Access\\\"],\\\"dataEntitlementRoles\\\":\\\"\\\"}\",\"exp\":1678982979,\"iat\":1678954179,\"userLoginTime\":\"2023-03-16T08:09:39.52Z[GMT]\",\"jti\":\"single-ui-bff-id\"}" }, headers: {} } as AxiosResponse)
    handleUser({ status: 200, data: { "userInfo": "{\"sub\":\"1243644\",\"iss\":\"single-ui-bff\",\"entitxlement\":\"{\\\"role\\\":\\\"FMO_OPS_SUP\\\",\\\"actions\\\":[\\\"RATAN_TRADE_BLOTTER:F_Custom_Query_Builder\\\",\\\"RATAN_TRADE_BLOTTER:F_Custom_View_Builder_Private\\\",\\\"RATAN_TRADE_BLOTTER:F_Custom_View_Builder_Public\\\",\\\"RATAN_TRADE_BLOTTER:F_Export_Data\\\",\\\"RATAN_TRADE_BLOTTER:F_Match_Confirmed_Status_Change\\\",\\\"RATAN_TRADE_BLOTTER:F_Retrigger_Confirmation_Dispatch\\\",\\\"RATAN_TRADE_BLOTTER:F_Trade_Affirmation_Status_Change\\\",\\\"RATAN_TRADE_BLOTTER:F_View_Confirmation\\\",\\\"RATAN_TRADE_BLOTTER:UI_Read_Access\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Brokerage_Detail\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Cashflow_Status\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Confirmation_Status\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Counterparty_Data\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Instrument_Detail\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_SSI_Data\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Trade_Audit_History\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Trade_Data\\\",\\\"RATAN_TRADE_BLOTTER:UI_View_Trade_Version_Differences\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_Nostro_Initiate\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_Nostro_Verify\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_SSI_Initiate\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_SSI_Verify\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_Suppress\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Add_Settlement_Comment\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Cashflow_Affirmation_Status_Change\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Cashflow_Status_Change_Release\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Custom_Query_Builder\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Custom_View_Builder_Private\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Custom_View_Builder_Public\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Export_Data\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Modify_Settlement_Means\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Perform_Ad_Hoc_Netting\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Perform_Cashflow_Split\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Perform_Un_Net_Initiate\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Perform_Un_Net_Verify\\\",\\\"RATAN_CASHFLOW_BLOTTER:F_Reinstate\\\",\\\"RATAN_CASHFLOW_BLOTTER:UI_Read_Access\\\",\\\"RATAN_CASHFLOW_BLOTTER:UI_View_Cashflow_Data\\\",\\\"RATAN_CASHFLOW_BLOTTER:UI_View_Cashflow_Status\\\",\\\"RATAN_CASHFLOW_BLOTTER:UI_View_Counterparty_Data\\\",\\\"RATAN_CASHFLOW_BLOTTER:UI_View_SSI_Data\\\",\\\"RATAN_MO_EXCEPTION:F_Custom_View_Builder_Private\\\",\\\"RATAN_MO_EXCEPTION:UI_Read_Access\\\",\\\"RATAN_VALIDATION_EXCEPTION:F_Custom_View_Builder_Private\\\",\\\"RATAN_VALIDATION_EXCEPTION:F_Custom_View_Builder_Public\\\",\\\"RATAN_VALIDATION_EXCEPTION:F_Manually_Close_Exception\\\",\\\"RATAN_VALIDATION_EXCEPTION:F_Replay_Exception\\\",\\\"RATAN_VALIDATION_EXCEPTION:F_Trade_Affirmation_Status_Change\\\",\\\"RATAN_VALIDATION_EXCEPTION:UI_Read_Access\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:F_Custom_View_Builder_Private\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:F_Custom_View_Builder_Public\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:F_Input_Delete_Modify_SI_Initiate\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:F_Input_Delete_Modify_SI_Verify\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:F_Manual_Fix\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:F_Manually_Close_Exception\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:F_Replay_Exception\\\",\\\"RATAN_SETTLEMENT_EXCEPTION:UI_Read_Access\\\",\\\"RATAN_WORKFLOW:UI_Read_Access\\\",\\\"RATAN_SUPPRESSION_RULE:F_Input_Delete_Modify_Initiate\\\",\\\"RATAN_SUPPRESSION_RULE:F_Input_Delete_Modify_Verify\\\",\\\"RATAN_SUPPRESSION_RULE:UI_View_Rule_Audit_History\\\",\\\"RATAN_SUPPRESSION_RULE:UI_View_Suppression_Rule_Table\\\",\\\"RATAN_SETTLEMENT_STP_RULE:F_Input_Delete_Modify_Initiate\\\",\\\"RATAN_SETTLEMENT_STP_RULE:F_Input_Delete_Modify_Verify\\\",\\\"RATAN_SETTLEMENT_STP_RULE:UI_View_Rule_Audit_History\\\",\\\"RATAN_SETTLEMENT_STP_RULE:UI_View_STP_Rule_Table\\\",\\\"RATAN_CURRENCY_NSTP_RULE:F_Input_Delete_Modify_Initiate\\\",\\\"RATAN_CURRENCY_NSTP_RULE:F_Input_Delete_Modify_Verify\\\",\\\"RATAN_CURRENCY_NSTP_RULE:UI_View_NSTP_Rule_Table\\\",\\\"RATAN_CURRENCY_NSTP_RULE:UI_View_Rule_Audit_History\\\",\\\"RATAN_ISO_CURRENCY_MAPPING:UI_View_Currency_Mapping_Table\\\",\\\"RATAN_ISO_CURRENCY_MAPPING:UI_View_Rule_Audit_History\\\",\\\"RATAN_NETTING_RULE:F_Input_Delete_Modify_Initiate\\\",\\\"RATAN_NETTING_RULE:F_Input_Delete_Modify_Verify\\\",\\\"RATAN_NETTING_RULE:UI_View_Netting_Rule_Table\\\",\\\"RATAN_NETTING_RULE:UI_View_Rule_Audit_History\\\",\\\"RATAN_CURRENCY_CUTOFF:F_Input_Delete_Modify_CUTOFF_Initiate\\\",\\\"RATAN_CURRENCY_CUTOFF:F_Input_Delete_Modify_CUTOFF_Verify\\\",\\\"RATAN_CURRENCY_CUTOFF:UI_Read_Access\\\",\\\"PORTAL_CDU_ISLAMIC:UI_Read_Access\\\"],\\\"dataEntitlementRoles\\\":\\\"\\\"}\",\"exp\":1678982979,\"iat\":1678954179,\"userLoginTime\":\"2023-03-16T08:09:39.52Z[GMT]\",\"jti\":\"single-ui-bff-id\"}" }, headers: {} } as AxiosResponse)
    handleUser({ status: 200, data: { "userInfo": "{\"entitlements\":\"{\\\"FSS_PAYMENTS_SERVICES_TH:FSS_PS_SUPER_USER\\\":{\\\"FSS Payments Services\\\":[\\\"COUNTRY_TH\\\",\\\"MODULE_ContactDetails\\\",\\\"MODULE_Customer\\\",\\\"MODULE_ExternalAccount\\\",\\\"MODULE_Holiday\\\",\\\"MODULE_InterestedParty\\\",\\\"MODULE_InternalAccount\\\",\\\"MODULE_ReportsManagement\\\",\\\"MODULE_Rule\\\",\\\"MODULE_Transaction\\\"]},\\\"SSIPLUS:SSI_SUPER_USER\\\":{\\\"SEARCH\\\":[\\\"WRITE\\\"],\\\"WORKQUEUE\\\":[\\\"WRITE\\\"],\\\"VALIDATIONRULES\\\":[\\\"WRITE\\\"],\\\"STATIC\\\":[\\\"WRITE\\\"]}}\",\"max_age\":1696389431,\"sub\":\"2001208\",\"auth_time\":1696385831,\"iss\":\"single-ui-bff\",\"exp\":1696388401,\"iat\":1696387501,\"jti\":\"single-ui-bff-id\",\"oud\":\"{\\\"country\\\":\\\"SG\\\",\\\"lastName\\\":\\\"Anshar1\\\",\\\"psEmplStatus\\\":\\\"A\\\",\\\"description\\\":\\\"user account\\\",\\\"fullName\\\":\\\"Anshar1, Khairul\\\",\\\"emailId\\\":\\\"khairul.anshar1@sc.com\\\",\\\"cn\\\":\\\"2001208\\\",\\\"supervisorID\\\":\\\"1445298\\\",\\\"title\\\":\\\"Mgr, Development\\\",\\\"employeeStatus\\\":\\\"A\\\",\\\"userId\\\":\\\"2001208\\\",\\\"accountStatus\\\":\\\"active\\\",\\\"kbaActiveIndex\\\":\\\"1695273785741\\\",\\\"firstName\\\":\\\"Khairul\\\",\\\"preferredLocale\\\":\\\"SG\\\"}\"}" }, headers: {} } as AxiosResponse)
    handleUser({ status: 200, data: { entitlementsToken, "userInfo": "{\"entitlements\":\"{\\\"FSS_PAYMENTS_SERVICES_TH:FSS_PS_SUPER_USER\\\":{\\\"FSS Payments Services\\\":[\\\"COUNTRY_TH\\\",\\\"MODULE_ContactDetails\\\",\\\"MODULE_Customer\\\",\\\"MODULE_ExternalAccount\\\",\\\"MODULE_Holiday\\\",\\\"MODULE_InterestedParty\\\",\\\"MODULE_InternalAccount\\\",\\\"MODULE_ReportsManagement\\\",\\\"MODULE_Rule\\\",\\\"MODULE_Transaction\\\"]},\\\"SSIPLUS:SSI_SUPER_USER\\\":{\\\"SEARCH\\\":[\\\"WRITE\\\"],\\\"WORKQUEUE\\\":[\\\"WRITE\\\"],\\\"VALIDATIONRULES\\\":[\\\"WRITE\\\"],\\\"STATIC\\\":[\\\"WRITE\\\"]}}\",\"max_age\":1696389431,\"sub\":\"2001208\",\"auth_time\":1696385831,\"iss\":\"single-ui-bff\",\"exp\":1696388401,\"iat\":1696387501,\"jti\":\"single-ui-bff-id\",\"oud\":\"{\\\"country\\\":\\\"SG\\\",\\\"lastName\\\":\\\"Anshar1\\\",\\\"psEmplStatus\\\":\\\"A\\\",\\\"description\\\":\\\"user account\\\",\\\"fullName\\\":\\\"Anshar1, Khairul\\\",\\\"emailId\\\":\\\"khairul.anshar1@sc.com\\\",\\\"cn\\\":\\\"2001208\\\",\\\"supervisorID\\\":\\\"1445298\\\",\\\"title\\\":\\\"Mgr, Development\\\",\\\"employeeStatus\\\":\\\"A\\\",\\\"userId\\\":\\\"2001208\\\",\\\"accountStatus\\\":\\\"active\\\",\\\"kbaActiveIndex\\\":\\\"1695273785741\\\",\\\"firstName\\\":\\\"Khairul\\\",\\\"preferredLocale\\\":\\\"SG\\\"}\"}" }, headers: {} } as AxiosResponse)

    handleLogin({ status: 200, data: {}, headers: { "Single-UI-Authorization": "123" } } as unknown as AxiosResponse)
    const part1 = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9";
    const part2 = "eyJlbnRpdGxlbWVudHMiOiJ7XCJTU0lQTFVTOlNTSV9TVVBFUl9VU0VSXCI6e1wiU0VBUkNIXCI6W1wiV1JJVEVcIl0sXCJWQUxJREFUSU9OUlVMRVNcIjpbXCJXUklURVwiXSxcIlNUQVRJQ1wiOltcIldSSVRFXCJdfSxcIkVNUzI6RU1TMl9BRE1JTlwiOnt9fSIsInN1YiI6IjIwMDEyMDgiLCJpc3MiOiJzaW5nbGUtdWktYmZmIiwiZXhwIjoxNjkwMjc5MDQ0LCJpYXQiOjE2OTAyNzgxNDQsInVzZXJMb2dpblRpbWUiOiIyMDIzLTA3LTI1VDE3OjQyOjIzLjcwNTU4NTgrMDg6MDBbQXNpYS9TaW5nYXBvcmVdIiwianRpIjoic2luZ2xlLXVpLWJmZi1pZCJ9";
    const part3 = "Lbdb9cd2pX5Ovq16MtFH2P1rU3rc6vcT6a4Eiz79-WGaVtcSVYraQ4wckhkPxBGrmaMYtKudRyHOmZQtpVEUH2gGoT6WJCDm9BErYb3gwiDVykiFoj_MQShCIWpx3lmJQPzwXHjAxo82Q87bAWh0JC9TrzzYraZFWNXEDtp8X79ak-bOjuKiF9a9JsbxTNyLemdHnbZXd3UtRuw117OZU_m7GbbKkky4r6N7aXle6OjxyYyYqEgu7WUAGvGEBLbgT_5Fqi1N35r-VuALJq2TAIQ9pGFXcYGd-wbVmJchtQZQPCEUzZDa0YkTtkRN9Q6m4HkBjSMTO6wDTfW1wzj-Jw";
    handleLogin({ status: 200, data: {}, headers: { "single-ui-authorization": `Bearer ${part1}.${part2}.${part3}` } } as unknown as AxiosResponse)
    handleLogin({ status: 200, data: {}, headers: {} } as unknown as AxiosResponse)
    handleLogin({ status: 200, data: {} } as unknown as AxiosResponse)

    handleEntities({ status: 200, data: { entities: [] } } as unknown as AxiosResponse)
    handleEntities({ status: 200, data: {} } as unknown as AxiosResponse)

    handleRefreshToken({ status: 200, data: {}, headers: { "Single-UI-Refresh": "123" } } as unknown as AxiosResponse)
    handleRefreshToken({ status: 200, data: {}, headers: { "single-ui-refresh": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJlbnRpdGxlbWVudHMiOiJ7XCJTU0lQTFVTOlNTSV9TVVBFUl9VU0VSXCI6e1wiU0VBUkNIXCI6W1wiV1JJVEVcIl0sXCJWQUxJREFUSU9OUlVMRVNcIjpbXCJXUklURVwiXSxcIlNUQVRJQ1wiOltcIldSSVRFXCJdfSxcIkVNUzI6RU1TMl9BRE1JTlwiOnt9fSIsInN1YiI6IjIwMDEyMDgiLCJpc3MiOiJzaW5nbGUtdWktYmZmIiwiZXhwIjoxNjkwMjc5MDQ0LCJpYXQiOjE2OTAyNzgxNDQsInVzZXJMb2dpblRpbWUiOiIyMDIzLTA3LTI1VDE3OjQyOjIzLjcwNTU4NTgrMDg6MDBbQXNpYS9TaW5nYXBvcmVdIiwianRpIjoic2luZ2xlLXVpLWJmZi1pZCJ9.Lbdb9cd2pX5Ovq16MtFH2P1rU3rc6vcT6a4Eiz79-WGaVtcSVYraQ4wckhkPxBGrmaMYtKudRyHOmZQtpVEUH2gGoT6WJCDm9BErYb3gwiDVykiFoj_MQShCIWpx3lmJQPzwXHjAxo82Q87bAWh0JC9TrzzYraZFWNXEDtp8X79ak-bOjuKiF9a9JsbxTNyLemdHnbZXd3UtRuw117OZU_m7GbbKkky4r6N7aXle6OjxyYyYqEgu7WUAGvGEBLbgT_5Fqi1N35r-VuALJq2TAIQ9pGFXcYGd-wbVmJchtQZQPCEUzZDa0YkTtkRN9Q6m4HkBjSMTO6wDTfW1wzj-Jw" } } as unknown as AxiosResponse)
    handleRefreshToken({ status: 200, data: {}, headers: {} } as unknown as AxiosResponse)
    handleRefreshToken({ status: 200, data: {} } as unknown as AxiosResponse)

    handleEntitlementsToken({ status: 200, data: { entitlementsToken: "token" } } as unknown as AxiosResponse)
    handleEntitlementsToken({ status: 200, data: { entitlementsToken: undefined } } as unknown as AxiosResponse)
    handleEntitlementsToken({ status: 200, data: {} } as unknown as AxiosResponse)

    dispacthUserLoginTime({ exp: new Date().getTime(), iat: new Date().getTime() })
    dispacthUserLoginTime({ exp: new Date().getTime() })
    dispacthUserLoginTime({ iat: new Date().getTime() })
    dispacthUserLoginTime({ date: new Date().getTime() })

    const drawers: any = [
      {
        "tiles": [
          {
            "container": "@fm/base",
            "imageDarkTheme": "darkIcons/icon12.svg",
            "subject": "/importmap",
            "isTemplate": false,
            "emailSupport": "",
            "module": "/importmap",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon12.svg",
            "tile": "/importmap",
            "id": 1,
            "title": "Module Map",
            "entity": [
              "FMO PORTAL ADMIN"
            ]
          },
          {
            "container": "@fm/base",
            "imageDarkTheme": "darkIcons/icon13.svg",
            "subject": "/category",
            "isTemplate": false,
            "emailSupport": "",
            "module": "/category",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon13.svg",
            "tile": "/category",
            "id": 2,
            "title": "Drawer Category",
            "entity": [
              "FMO PORTAL ADMIN"
            ]
          },
          {
            "container": "@fm/base",
            "imageDarkTheme": "darkIcons/icon14.svg",
            "subject": "/tile",
            "isTemplate": false,
            "emailSupport": "",
            "module": "/tile",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon14.svg",
            "tile": "/tile",
            "id": 3,
            "title": "Tile Configuration",
            "entity": [
              "FMO PORTAL ADMIN"
            ]
          }
        ],
        "id": 1,
        "label": "Admin Module"
      },
      {
        "tiles": [
          {
            "container": "@fm/template_container",
            "imageDarkTheme": "darkIcons/icon01.svg",
            "subject": "",
            "isTemplate": true,
            "emailSupport": "",
            "module": "/template",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon01.svg",
            "tile": "/tile1",
            "id": 65,
            "title": "Date Range Picker Example",
            "entity": [
              ""
            ]
          },
          {
            "container": "@fm/template_container",
            "imageDarkTheme": "darkIcons/icon02.svg",
            "subject": "",
            "isTemplate": true,
            "emailSupport": "",
            "module": "/template",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon02.svg",
            "tile": "/modal",
            "id": 66,
            "title": "Modal Example",
            "entity": [
              ""
            ]
          },
          {
            "container": "@fm/template_container",
            "imageDarkTheme": "darkIcons/icon03.svg",
            "subject": "",
            "isTemplate": true,
            "emailSupport": "",
            "module": "/template",
            "subtitle": "3 Grid",
            "imageLightTheme": "lightIcons/icon03.svg",
            "tile": "/tile4",
            "id": 67,
            "title": "Search Block",
            "entity": [
              ""
            ]
          },
          {
            "container": "@fm/template_container",
            "imageDarkTheme": "darkIcons/icon04.svg",
            "subject": "",
            "isTemplate": true,
            "emailSupport": "",
            "module": "/template",
            "subtitle": "4 Grid",
            "imageLightTheme": "lightIcons/icon04.svg",
            "tile": "/tile5",
            "id": 68,
            "title": "Search Block",
            "entity": [
              ""
            ]
          },
          {
            "container": "@fm/template_container",
            "imageDarkTheme": "darkIcons/icon05.svg",
            "subject": "",
            "isTemplate": true,
            "emailSupport": "",
            "module": "/template",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon05.svg",
            "tile": "/simpletable",
            "id": 69,
            "title": "Simple Table",
            "entity": [
              ""
            ]
          },
          {
            "container": "@fm/template_container",
            "imageDarkTheme": "darkIcons/icon06.svg",
            "subject": "",
            "isTemplate": true,
            "emailSupport": "",
            "module": "/template",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon06.svg",
            "tile": "/gridtooltable",
            "id": 70,
            "title": "Grid Tool Table",
            "entity": [
              ""
            ]
          },
          {
            "container": "@fm/template_container",
            "imageDarkTheme": "darkIcons/icon07.svg",
            "subject": "",
            "isTemplate": true,
            "emailSupport": "",
            "module": "/template",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon07.svg",
            "tile": "/routingtile",
            "id": 71,
            "title": "Routing Tile",
            "entity": [
              ""
            ]
          },
          {
            "container": "@fm/template_container",
            "imageDarkTheme": "darkIcons/icon08.svg",
            "subject": "",
            "isTemplate": true,
            "emailSupport": "",
            "module": "/template",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon08.svg",
            "tile": "/modal",
            "id": 72,
            "title": "Inbound Blotter",
            "entity": [
              ""
            ]
          },
          {
            "container": "@fm/template_container",
            "imageDarkTheme": "darkIcons/icon09.svg",
            "subject": "",
            "isTemplate": true,
            "emailSupport": "",
            "module": "/template",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon09.svg",
            "tile": "/analytics",
            "id": 73,
            "title": "Analytics",
            "entity": [
              ""
            ]
          }
        ],
        "id": 2,
        "label": "Template"
      },
      {
        "tiles": [
          {
            "container": "@fm/mfe_fssservices_container",
            "imageDarkTheme": "darkIcons/icon10.svg",
            "subject": "FSS Payments Services",
            "isTemplate": false,
            "emailSupport": "FM_BPMS.SUPPORT@sc.com",
            "module": "/mfe_fssservices_tiles",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon10.svg",
            "tile": "/tile1",
            "id": 19,
            "title": "Payment Processing",
            "entity": [
              "FSS_PAYMENTS_SERVICES_TH",
              " FSS_PAYMENTS_SERVICES_SG"
            ]
          },
          {
            "container": "@fm/mfe_fssservices_peregrine_container",
            "imageDarkTheme": "darkIcons/icon11.svg",
            "subject": "FSS Services Peregrine",
            "isTemplate": false,
            "emailSupport": "FM_BPMS.SUPPORT@sc.com",
            "module": "/mfe_fssservices_peregrine_tiles",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon11.svg",
            "tile": "/peregrine",
            "id": 22,
            "title": "FSS Services – DAC",
            "entity": [
              "FSS_SERVICES_PEREGRINE",
              "FSS_SERVICES_PEREGRINE_AE",
              "FSS_SERVICES_PEREGRINE_HK",
              "FSS_SERVICES_PEREGRINE_LU"
            ]
          }
        ],
        "id": 5,
        "label": "FSS SERVICES"
      },
      {
        "tiles": [
          {
            "container": "@fm/loanIq_container",
            "imageDarkTheme": "darkIcons/icon11.svg",
            "subject": "",
            "isTemplate": true,
            "emailSupport": "",
            "module": "/template",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon11.svg",
            "tile": "/LoanIQ UI",
            "id": 74,
            "title": "LoanIQ UI",
            "entity": [
              ""
            ]
          }
        ],
        "id": 6,
        "label": "LoanIQ"
      },
      {
        "tiles": [
          {
            "container": "@fm/ssdr_container",
            "imageDarkTheme": "darkIcons/icon11.svg",
            "subject": "",
            "isTemplate": true,
            "emailSupport": "",
            "module": "/ssdr",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon11.svg",
            "tile": "/ssdr-admin-accessmanagement",
            "id": 75,
            "title": "Access Management",
            "entity": [
              ""
            ]
          },
          {
            "container": "@fm/ssdr_container",
            "imageDarkTheme": "darkIcons/icon11.svg",
            "subject": "",
            "isTemplate": true,
            "emailSupport": "",
            "module": "/ssdr",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon11.svg",
            "tile": "/ssdr-admin-staticmanagement",
            "id": 76,
            "title": "Static Management",
            "entity": [
              ""
            ]
          },
          {
            "container": "@fm/ssdr_container",
            "imageDarkTheme": "darkIcons/icon11.svg",
            "subject": "",
            "isTemplate": true,
            "emailSupport": "",
            "module": "/ssdr",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon11.svg",
            "tile": "/ssdr-query-builder",
            "id": 77,
            "title": "Query Builder",
            "entity": [
              ""
            ]
          }
        ],
        "id": 10,
        "label": "SSDR"
      },
      {
        "tiles": [
          {
            "container": "@fm/ssi_container",
            "imageDarkTheme": "darkIcons/icon11.svg",
            "subject": "SEARCH",
            "isTemplate": false,
            "emailSupport": "FM-TPT-JavaX-Studio@exchange.standardchartered.com",
            "module": "/ssi",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon11.svg",
            "tile": "/search",
            "id": 43,
            "title": "SSI",
            "entity": [
              "SSIPLUS"
            ]
          },
          {
            "container": "@fm/ssi_container",
            "imageDarkTheme": "darkIcons/icon11.svg",
            "subject": "STATIC",
            "isTemplate": false,
            "emailSupport": "FM-TPT-JavaX-Studio@exchange.standardchartered.com",
            "module": "/ssi",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon11.svg",
            "tile": "/static",
            "id": 44,
            "title": "Static",
            "entity": [
              "SSIPLUS"
            ]
          },
          {
            "container": "@fm/ssi_container",
            "imageDarkTheme": "darkIcons/icon11.svg",
            "subject": "VALIDATIONRULES",
            "isTemplate": false,
            "emailSupport": "FM-TPT-JavaX-Studio@exchange.standardchartered.com",
            "module": "/ssi",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon11.svg",
            "tile": "/validationrules",
            "id": 45,
            "title": "Validation rules and Market filter set",
            "entity": [
              "SSIPLUS"
            ]
          },
          {
            "container": "@fm/ssi_container",
            "imageDarkTheme": "darkIcons/icon11.svg",
            "subject": "WORKQUEUE",
            "isTemplate": false,
            "emailSupport": "FM-TPT-JavaX-Studio@exchange.standardchartered.com",
            "module": "/ssi",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon11.svg",
            "tile": "/queues",
            "id": 46,
            "title": "Work Queues",
            "entity": [
              "SSIPLUS"
            ]
          },
          {
            "container": "@fm/ssi_container",
            "imageDarkTheme": "darkIcons/icon11.svg",
            "subject": "IMPORTEXPORT",
            "isTemplate": false,
            "emailSupport": "FM-TPT-JavaX-Studio@exchange.standardchartered.com",
            "module": "/ssi",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon11.svg",
            "tile": "/import_export",
            "id": 47,
            "title": "Import/Export",
            "entity": [
              "SSIPLUS"
            ]
          }
        ],
        "id": 11,
        "label": "SSI plus"
      },
      {
        "tiles": [
          {
            "container": "@fm/stamp_container",
            "imageDarkTheme": "darkIcons/icon11.svg",
            "subject": "Mapping Query",
            "isTemplate": false,
            "emailSupport": "MLS_BAU@sc.com",
            "module": "/stamp",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon11.svg",
            "tile": "/stamp-mappingquery",
            "id": 48,
            "title": "Mapping Query",
            "entity": [
              "STAMP_STATIC"
            ]
          },
          {
            "container": "@fm/stamp_container",
            "imageDarkTheme": "darkIcons/icon11.svg",
            "subject": "Audit",
            "isTemplate": false,
            "emailSupport": "MLS_BAU@sc.com",
            "module": "/stamp",
            "subtitle": "",
            "imageLightTheme": "lightIcons/icon11.svg",
            "tile": "/stamp-audit",
            "id": 49,
            "title": "Audit",
            "entity": [
              "STAMP_STATIC"
            ]
          }
        ],
        "id": 12,
        "label": "Static Data Mapping"
      }
    ];
    handleLoginEntities(null, () => { }, drawers)
    handleLoginEntities([], () => { }, drawers)
    handleLoginEntities([{ name: "STAMP_STATIC" }], () => { }, drawers)
    handleLoginEntities([{ name: "RANDOM" }], () => { }, drawers)
    handleLoginEntities([{ name: "STAMP_STATIC" }], () => { }, drawers)
    handleDrawers({ status: 200, data: { drawers } } as unknown as AxiosResponse)
    handleDrawers({ status: 200, data: { drawers: [] } } as unknown as AxiosResponse)
  });
});

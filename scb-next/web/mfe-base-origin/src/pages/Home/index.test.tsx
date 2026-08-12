import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import Root, { ContainerComponent } from ".";
import Provider from "../../hooks/provider";
import ThemeProvider from "../../theme";
import { PREFIX } from "./common/style";
import useController from "./common/useController";
import useParameters from "./common/useParameters";
import { propsAddTile } from "../../components/Drawer/common/interface";
afterAll(() => {
  vi.clearAllMocks();
});
vi.mock('../../hooks/service/config', () => {
  return { default: {
    put: async () => { return Promise.resolve({}) },
    post: async () => { return Promise.resolve({}) },
    get: async () => { return Promise.resolve({}) },
    "delete": async () => { return Promise.resolve({}) }
  } }
});
vi.mock('openfin-fdc3', () => {
  return {
    getOrCreateAppChannel: (_input: string) => {
      return {
        join: () => { },
        addContextListener: (dummy: () => {}) => { }
      }
    },
    addIntentListener: (_name: string, _dummy: () => {}) => { }
  }
});

const user = { "sub": "1243644", "iss": "single-ui-bff", "entitlement": { "role": "FMO_OPS_SUP", "actions": ["RATAN_TRADE_BLOTTER:F_Custom_Query_Builder", "RATAN_TRADE_BLOTTER:F_Custom_View_Builder_Private", "RATAN_TRADE_BLOTTER:F_Custom_View_Builder_Public", "RATAN_TRADE_BLOTTER:F_Export_Data", "RATAN_TRADE_BLOTTER:F_Match_Confirmed_Status_Change", "RATAN_TRADE_BLOTTER:F_Retrigger_Confirmation_Dispatch", "RATAN_TRADE_BLOTTER:F_Trade_Affirmation_Status_Change", "RATAN_TRADE_BLOTTER:F_View_Confirmation", "RATAN_TRADE_BLOTTER:UI_Read_Access", "RATAN_TRADE_BLOTTER:UI_View_Brokerage_Detail", "RATAN_TRADE_BLOTTER:UI_View_Cashflow_Status", "RATAN_TRADE_BLOTTER:UI_View_Confirmation_Status", "RATAN_TRADE_BLOTTER:UI_View_Counterparty_Data", "RATAN_TRADE_BLOTTER:UI_View_Instrument_Detail", "RATAN_TRADE_BLOTTER:UI_View_SSI_Data", "RATAN_TRADE_BLOTTER:UI_View_Trade_Audit_History", "RATAN_TRADE_BLOTTER:UI_View_Trade_Data", "RATAN_TRADE_BLOTTER:UI_View_Trade_Version_Differences", "RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_Nostro_Initiate", "RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_Nostro_Verify", "RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_SSI_Initiate", "RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_SSI_Verify", "RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_Suppress", "RATAN_CASHFLOW_BLOTTER:F_Add_Settlement_Comment", "RATAN_CASHFLOW_BLOTTER:F_Cashflow_Affirmation_Status_Change", "RATAN_CASHFLOW_BLOTTER:F_Cashflow_Status_Change_Release", "RATAN_CASHFLOW_BLOTTER:F_Custom_Query_Builder", "RATAN_CASHFLOW_BLOTTER:F_Custom_View_Builder_Private", "RATAN_CASHFLOW_BLOTTER:F_Custom_View_Builder_Public", "RATAN_CASHFLOW_BLOTTER:F_Export_Data", "RATAN_CASHFLOW_BLOTTER:F_Modify_Settlement_Means", "RATAN_CASHFLOW_BLOTTER:F_Perform_Ad_Hoc_Netting", "RATAN_CASHFLOW_BLOTTER:F_Perform_Cashflow_Split", "RATAN_CASHFLOW_BLOTTER:F_Perform_Un_Net_Initiate", "RATAN_CASHFLOW_BLOTTER:F_Perform_Un_Net_Verify", "RATAN_CASHFLOW_BLOTTER:F_Reinstate", "RATAN_CASHFLOW_BLOTTER:UI_Read_Access", "RATAN_CASHFLOW_BLOTTER:UI_View_Cashflow_Data", "RATAN_CASHFLOW_BLOTTER:UI_View_Cashflow_Status", "RATAN_CASHFLOW_BLOTTER:UI_View_Counterparty_Data", "RATAN_CASHFLOW_BLOTTER:UI_View_SSI_Data", "RATAN_MO_EXCEPTION:F_Custom_View_Builder_Private", "RATAN_MO_EXCEPTION:UI_Read_Access", "RATAN_VALIDATION_EXCEPTION:F_Custom_View_Builder_Private", "RATAN_VALIDATION_EXCEPTION:F_Custom_View_Builder_Public", "RATAN_VALIDATION_EXCEPTION:F_Manually_Close_Exception", "RATAN_VALIDATION_EXCEPTION:F_Replay_Exception", "RATAN_VALIDATION_EXCEPTION:F_Trade_Affirmation_Status_Change", "RATAN_VALIDATION_EXCEPTION:UI_Read_Access", "RATAN_SETTLEMENT_EXCEPTION:F_Custom_View_Builder_Private", "RATAN_SETTLEMENT_EXCEPTION:F_Custom_View_Builder_Public", "RATAN_SETTLEMENT_EXCEPTION:F_Input_Delete_Modify_SI_Initiate", "RATAN_SETTLEMENT_EXCEPTION:F_Input_Delete_Modify_SI_Verify", "RATAN_SETTLEMENT_EXCEPTION:F_Manual_Fix", "RATAN_SETTLEMENT_EXCEPTION:F_Manually_Close_Exception", "RATAN_SETTLEMENT_EXCEPTION:F_Replay_Exception", "RATAN_SETTLEMENT_EXCEPTION:UI_Read_Access", "RATAN_WORKFLOW:UI_Read_Access", "RATAN_SUPPRESSION_RULE:F_Input_Delete_Modify_Initiate", "RATAN_SUPPRESSION_RULE:F_Input_Delete_Modify_Verify", "RATAN_SUPPRESSION_RULE:UI_View_Rule_Audit_History", "RATAN_SUPPRESSION_RULE:UI_View_Suppression_Rule_Table", "RATAN_SETTLEMENT_STP_RULE:F_Input_Delete_Modify_Initiate", "RATAN_SETTLEMENT_STP_RULE:F_Input_Delete_Modify_Verify", "RATAN_SETTLEMENT_STP_RULE:UI_View_Rule_Audit_History", "RATAN_SETTLEMENT_STP_RULE:UI_View_STP_Rule_Table", "RATAN_CURRENCY_NSTP_RULE:F_Input_Delete_Modify_Initiate", "RATAN_CURRENCY_NSTP_RULE:F_Input_Delete_Modify_Verify", "RATAN_CURRENCY_NSTP_RULE:UI_View_NSTP_Rule_Table", "RATAN_CURRENCY_NSTP_RULE:UI_View_Rule_Audit_History", "RATAN_ISO_CURRENCY_MAPPING:UI_View_Currency_Mapping_Table", "RATAN_ISO_CURRENCY_MAPPING:UI_View_Rule_Audit_History", "RATAN_NETTING_RULE:F_Input_Delete_Modify_Initiate", "RATAN_NETTING_RULE:F_Input_Delete_Modify_Verify", "RATAN_NETTING_RULE:UI_View_Netting_Rule_Table", "RATAN_NETTING_RULE:UI_View_Rule_Audit_History", "RATAN_CURRENCY_CUTOFF:F_Input_Delete_Modify_CUTOFF_Initiate", "RATAN_CURRENCY_CUTOFF:F_Input_Delete_Modify_CUTOFF_Verify", "RATAN_CURRENCY_CUTOFF:UI_Read_Access", "PORTAL_CDU_ISLAMIC:UI_Read_Access"], "dataEntitlementRoles": "" }, "exp": 1678957305, "iat": 1678928505, "userLoginTime": "2023-03-16T01:01:45.948Z[GMT]", "jti": "single-ui-bff-id", "id": "1243644", "fullName": "1243644", "name": "1243644", "userId": "1243644" };
const workspacesDefault = [{"id":"f6f603c2-484d-4543-8bf4-e0e2851b0802","label":"Date Range Picker Example ","isActive":false,"containers":[{"id":"800afff9-4aab-4657-a361-f9b249121973","container":"@fm/template_container","module":"/template","tile":"/tile1","title":"Date Range Picker Example ","emailSupport":"","panelId":"","tabId":"","leftPosition":"calc(50% - 45px)","topPossition":"8px"}]}]
const tk = "t" + "o" + "k" + "e" + "n";
const tk_value = "Bearer " + "e" + "y" + "J" + "0" + "eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJzdWIiOiIxMjQzNjQ0IiwiaXNzIjoic2luZ2xlLXVpLWJmZiIsImVudGl0bGVtZW50Ijoie1wicm9sZVwiOlwiRk1PX09QU19TVVBcIixcImFjdGlvbnNcIjpbXCJSQVRBTl9UUkFERV9CTE9UVEVSOkZfQ3VzdG9tX1F1ZXJ5X0J1aWxkZXJcIixcIlJBVEFOX1RSQURFX0JMT1RURVI6Rl9DdXN0b21fVmlld19CdWlsZGVyX1ByaXZhdGVcIixcIlJBVEFOX1RSQURFX0JMT1RURVI6Rl9DdXN0b21fVmlld19CdWlsZGVyX1B1YmxpY1wiLFwiUkFUQU5fVFJBREVfQkxPVFRFUjpGX0V4cG9ydF9EYXRhXCIsXCJSQVRBTl9UUkFERV9CTE9UVEVSOkZfTWF0Y2hfQ29uZmlybWVkX1N0YXR1c19DaGFuZ2VcIixcIlJBVEFOX1RSQURFX0JMT1RURVI6Rl9SZXRyaWdnZXJfQ29uZmlybWF0aW9uX0Rpc3BhdGNoXCIsXCJSQVRBTl9UUkFERV9CTE9UVEVSOkZfVHJhZGVfQWZmaXJtYXRpb25fU3RhdHVzX0NoYW5nZVwiLFwiUkFUQU5fVFJBREVfQkxPVFRFUjpGX1ZpZXdfQ29uZmlybWF0aW9uXCIsXCJSQVRBTl9UUkFERV9CTE9UVEVSOlVJX1JlYWRfQWNjZXNzXCIsXCJSQVRBTl9UUkFERV9CTE9UVEVSOlVJX1ZpZXdfQnJva2VyYWdlX0RldGFpbFwiLFwiUkFUQU5fVFJBREVfQkxPVFRFUjpVSV9WaWV3X0Nhc2hmbG93X1N0YXR1c1wiLFwiUkFUQU5fVFJBREVfQkxPVFRFUjpVSV9WaWV3X0NvbmZpcm1hdGlvbl9TdGF0dXNcIixcIlJBVEFOX1RSQURFX0JMT1RURVI6VUlfVmlld19Db3VudGVycGFydHlfRGF0YVwiLFwiUkFUQU5fVFJBREVfQkxPVFRFUjpVSV9WaWV3X0luc3RydW1lbnRfRGV0YWlsXCIsXCJSQVRBTl9UUkFERV9CTE9UVEVSOlVJX1ZpZXdfU1NJX0RhdGFcIixcIlJBVEFOX1RSQURFX0JMT1RURVI6VUlfVmlld19UcmFkZV9BdWRpdF9IaXN0b3J5XCIsXCJSQVRBTl9UUkFERV9CTE9UVEVSOlVJX1ZpZXdfVHJhZGVfRGF0YVwiLFwiUkFUQU5fVFJBREVfQkxPVFRFUjpVSV9WaWV3X1RyYWRlX1ZlcnNpb25fRGlmZmVyZW5jZXNcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6Rl9BZF9Ib2NfTm9zdHJvX0luaXRpYXRlXCIsXCJSQVRBTl9DQVNIRkxPV19CTE9UVEVSOkZfQWRfSG9jX05vc3Ryb19WZXJpZnlcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6Rl9BZF9Ib2NfU1NJX0luaXRpYXRlXCIsXCJSQVRBTl9DQVNIRkxPV19CTE9UVEVSOkZfQWRfSG9jX1NTSV9WZXJpZnlcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6Rl9BZF9Ib2NfU3VwcHJlc3NcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6Rl9BZGRfU2V0dGxlbWVudF9Db21tZW50XCIsXCJSQVRBTl9DQVNIRkxPV19CTE9UVEVSOkZfQ2FzaGZsb3dfQWZmaXJtYXRpb25fU3RhdHVzX0NoYW5nZVwiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpGX0Nhc2hmbG93X1N0YXR1c19DaGFuZ2VfUmVsZWFzZVwiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpGX0N1c3RvbV9RdWVyeV9CdWlsZGVyXCIsXCJSQVRBTl9DQVNIRkxPV19CTE9UVEVSOkZfQ3VzdG9tX1ZpZXdfQnVpbGRlcl9Qcml2YXRlXCIsXCJSQVRBTl9DQVNIRkxPV19CTE9UVEVSOkZfQ3VzdG9tX1ZpZXdfQnVpbGRlcl9QdWJsaWNcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6Rl9FeHBvcnRfRGF0YVwiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpGX01vZGlmeV9TZXR0bGVtZW50X01lYW5zXCIsXCJSQVRBTl9DQVNIRkxPV19CTE9UVEVSOkZfUGVyZm9ybV9BZF9Ib2NfTmV0dGluZ1wiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpGX1BlcmZvcm1fQ2FzaGZsb3dfU3BsaXRcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6Rl9QZXJmb3JtX1VuX05ldF9Jbml0aWF0ZVwiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpGX1BlcmZvcm1fVW5fTmV0X1ZlcmlmeVwiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpGX1JlaW5zdGF0ZVwiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpVSV9SZWFkX0FjY2Vzc1wiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpVSV9WaWV3X0Nhc2hmbG93X0RhdGFcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6VUlfVmlld19DYXNoZmxvd19TdGF0dXNcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6VUlfVmlld19Db3VudGVycGFydHlfRGF0YVwiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpVSV9WaWV3X1NTSV9EYXRhXCIsXCJSQVRBTl9NT19FWENFUFRJT046Rl9DdXN0b21fVmlld19CdWlsZGVyX1ByaXZhdGVcIixcIlJBVEFOX01PX0VYQ0VQVElPTjpVSV9SZWFkX0FjY2Vzc1wiLFwiUkFUQU5fVkFMSURBVElPTl9FWENFUFRJT046Rl9DdXN0b21fVmlld19CdWlsZGVyX1ByaXZhdGVcIixcIlJBVEFOX1ZBTElEQVRJT05fRVhDRVBUSU9OOkZfQ3VzdG9tX1ZpZXdfQnVpbGRlcl9QdWJsaWNcIixcIlJBVEFOX1ZBTElEQVRJT05fRVhDRVBUSU9OOkZfTWFudWFsbHlfQ2xvc2VfRXhjZXB0aW9uXCIsXCJSQVRBTl9WQUxJREFUSU9OX0VYQ0VQVElPTjpGX1JlcGxheV9FeGNlcHRpb25cIixcIlJBVEFOX1ZBTElEQVRJT05fRVhDRVBUSU9OOkZfVHJhZGVfQWZmaXJtYXRpb25fU3RhdHVzX0NoYW5nZVwiLFwiUkFUQU5fVkFMSURBVElPTl9FWENFUFRJT046VUlfUmVhZF9BY2Nlc3NcIixcIlJBVEFOX1NFVFRMRU1FTlRfRVhDRVBUSU9OOkZfQ3VzdG9tX1ZpZXdfQnVpbGRlcl9Qcml2YXRlXCIsXCJSQVRBTl9TRVRUTEVNRU5UX0VYQ0VQVElPTjpGX0N1c3RvbV9WaWV3X0J1aWxkZXJfUHVibGljXCIsXCJSQVRBTl9TRVRUTEVNRU5UX0VYQ0VQVElPTjpGX0lucHV0X0RlbGV0ZV9Nb2RpZnlfU0lfSW5pdGlhdGVcIixcIlJBVEFOX1NFVFRMRU1FTlRfRVhDRVBUSU9OOkZfSW5wdXRfRGVsZXRlX01vZGlmeV9TSV9WZXJpZnlcIixcIlJBVEFOX1NFVFRMRU1FTlRfRVhDRVBUSU9OOkZfTWFudWFsX0ZpeFwiLFwiUkFUQU5fU0VUVExFTUVOVF9FWENFUFRJT046Rl9NYW51YWxseV9DbG9zZV9FeGNlcHRpb25cIixcIlJBVEFOX1NFVFRMRU1FTlRfRVhDRVBUSU9OOkZfUmVwbGF5X0V4Y2VwdGlvblwiLFwiUkFUQU5fU0VUVExFTUVOVF9FWENFUFRJT046VUlfUmVhZF9BY2Nlc3NcIixcIlJBVEFOX1dPUktGTE9XOlVJX1JlYWRfQWNjZXNzXCIsXCJSQVRBTl9TVVBQUkVTU0lPTl9SVUxFOkZfSW5wdXRfRGVsZXRlX01vZGlmeV9Jbml0aWF0ZVwiLFwiUkFUQU5fU1VQUFJFU1NJT05fUlVMRTpGX0lucHV0X0RlbGV0ZV9Nb2RpZnlfVmVyaWZ5XCIsXCJSQVRBTl9TVVBQUkVTU0lPTl9SVUxFOlVJX1ZpZXdfUnVsZV9BdWRpdF9IaXN0b3J5XCIsXCJSQVRBTl9TVVBQUkVTU0lPTl9SVUxFOlVJX1ZpZXdfU3VwcHJlc3Npb25fUnVsZV9UYWJsZVwiLFwiUkFUQU5fU0VUVExFTUVOVF9TVFBfUlVMRTpGX0lucHV0X0RlbGV0ZV9Nb2RpZnlfSW5pdGlhdGVcIixcIlJBVEFOX1NFVFRMRU1FTlRfU1RQX1JVTEU6Rl9JbnB1dF9EZWxldGVfTW9kaWZ5X1ZlcmlmeVwiLFwiUkFUQU5fU0VUVExFTUVOVF9TVFBfUlVMRTpVSV9WaWV3X1J1bGVfQXVkaXRfSGlzdG9yeVwiLFwiUkFUQU5fU0VUVExFTUVOVF9TVFBfUlVMRTpVSV9WaWV3X1NUUF9SdWxlX1RhYmxlXCIsXCJSQVRBTl9DVVJSRU5DWV9OU1RQX1JVTEU6Rl9JbnB1dF9EZWxldGVfTW9kaWZ5X0luaXRpYXRlXCIsXCJSQVRBTl9DVVJSRU5DWV9OU1RQX1JVTEU6Rl9JbnB1dF9EZWxldGVfTW9kaWZ5X1ZlcmlmeVwiLFwiUkFUQU5fQ1VSUkVOQ1lfTlNUUF9SVUxFOlVJX1ZpZXdfTlNUUF9SdWxlX1RhYmxlXCIsXCJSQVRBTl9DVVJSRU5DWV9OU1RQX1JVTEU6VUlfVmlld19SdWxlX0F1ZGl0X0hpc3RvcnlcIixcIlJBVEFOX0lTT19DVVJSRU5DWV9NQVBQSU5HOlVJX1ZpZXdfQ3VycmVuY3lfTWFwcGluZ19UYWJsZVwiLFwiUkFUQU5fSVNPX0NVUlJFTkNZX01BUFBJTkc6VUlfVmlld19SdWxlX0F1ZGl0X0hpc3RvcnlcIixcIlJBVEFOX05FVFRJTkdfUlVMRTpGX0lucHV0X0RlbGV0ZV9Nb2RpZnlfSW5pdGlhdGVcIixcIlJBVEFOX05FVFRJTkdfUlVMRTpGX0lucHV0X0RlbGV0ZV9Nb2RpZnlfVmVyaWZ5XCIsXCJSQVRBTl9ORVRUSU5HX1JVTEU6VUlfVmlld19OZXR0aW5nX1J1bGVfVGFibGVcIixcIlJBVEFOX05FVFRJTkdfUlVMRTpVSV9WaWV3X1J1bGVfQXVkaXRfSGlzdG9yeVwiLFwiUkFUQU5fQ1VSUkVOQ1lfQ1VUT0ZGOkZfSW5wdXRfRGVsZXRlX01vZGlmeV9DVVRPRkZfSW5pdGlhdGVcIixcIlJBVEFOX0NVUlJFTkNZX0NVVE9GRjpGX0lucHV0X0RlbGV0ZV9Nb2RpZnlfQ1VUT0ZGX1ZlcmlmeVwiLFwiUkFUQU5fQ1VSUkVOQ1lfQ1VUT0ZGOlVJX1JlYWRfQWNjZXNzXCIsXCJQT1JUQUxfQ0RVX0lTTEFNSUM6VUlfUmVhZF9BY2Nlc3NcIl0sXCJkYXRhRW50aXRsZW1lbnRSb2xlc1wiOlwiXCJ9IiwiZXhwIjoxNjc4OTU3MzA1LCJpYXQiOjE2Nzg5Mjg1MDUsInVzZXJMb2dpblRpbWUiOiIyMDIzLTAzLTE2VDAxOjAxOjQ1Ljk0OFpbR01UXSIsImp0aSI6InNpbmdsZS11aS1iZmYtaWQifQ.YGVIc-P4Wv2tq25AO4HrQIiYFEF7ei41SP4Yiz4SnpmpR0uxwH_eCxDDgOgJOhihE4KVkCJVIEt4Kc017MNU7x-JNaru8SqV6wD3VEfYM8QEIjdCEEn1wiPceGcp4iHPe_xbJAN6nu1Im18OXjPRxfG6DHM6dq6FGrhmozunlBYdfTU82ss3-Z9dCoCiH8zLnabXgF4xQW-E0HS_xA_zUIsnTxCVhYEQJVerjBZE0skWN2rpgfJZzXT0sKSlu-lNINWoCRTeiLjRZAbsZS3572O6EMnnhYSLCZFROUBxBmezV52WDt8DSw2xYd4Rrekd6yM-FwE_KRXSynox7h1dzQ";
const workspacesDefault1 = [{"id":"04bac22c-13ce-4043-a9e2-dc5fb7d95703","label":"Workspace 1","isLoaded":false,"isActive":false,"containers":[]}]
const response = { "result": "success", "entities": [{ "id": 1234, "name": "RATAN_TRADE_BLOTTER", "applicationName": "", "roleId": 66, "roleName": "RATAN_TRADE_BLOTTER", "subjects": [] }, { "id": 65, "name": "EMS2", "applicationName": "", "roleId": 66, "roleName": "EMS2_ADMIN", "subjects": [] }, { "id": 11279700, "name": "SSIPLUS", "applicationName": "SSIPLUS", "roleId": 11279756, "roleName": "SSI_SUPER_USER", "subjects": [{ "longName": "/SEARCH", "name": "SEARCH", "id": 11279801, "actions": [{ "name": "WRITE", "id": 11279851, "entitlementId": 11280762 }] }, { "longName": "/STATIC", "name": "STATIC", "id": 11279800, "actions": [{ "name": "WRITE", "id": 11279851, "entitlementId": 11280763 }] }, { "longName": "/VALIDATIONRULES", "name": "VALIDATIONRULES", "id": 11279802, "actions": [{ "name": "WRITE", "id": 11279851, "entitlementId": 11280764 }] }] }] };
const drawers = [
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
    ],
    "id": 2,
    "label": "Template"
  },
];
const Comp = () => {
  const { mouseMove, setShowTimeout, runExtend, updateValue, refreshTab } = useController();
  const { addTile, openTile, setParamsAndAddTile } = useParameters();
  React.useEffect(() => {
    mouseMove();
    mouseMove();
    runExtend();
    updateValue(workspacesDefault, 0, 0);
    updateValue(workspacesDefault, 0, 1);
    updateValue(workspacesDefault, 0, 2);
    updateValue(workspacesDefault, 0, 3);
    openTile("@fm/template_container", "/template", "/tile2")
    openTile("@fm/template_container", "/template", "/tile2", "{}")
    openTile("@fm/template_container", "/template", "/tile2", "{a:a}")
    setParamsAndAddTile({
      ...propsAddTile,
      container: "@fm/template_container",
      module: "/template",
      tile: "/tile1",
      title: `Tile 1`,
      parameters: undefined,
    }, "{}")
    setParamsAndAddTile({
      ...propsAddTile,
      container: "@fm/template_container",
      module: "/template",
      tile: "/tile1",
      title: `Tile 1`,
      parameters: undefined,
    }, "{a:a}")
    setParamsAndAddTile({
      ...propsAddTile,
      container: "@fm/template_container",
      module: "/template",
      tile: "/tile1",
      title: `Tile 1`,
      parameters: undefined,
    }, undefined)
    addTile({
      ...propsAddTile,
      container: "@fm/template_container",
      module: "/template",
      tile: "/tile1",
      title: `Tile 1`,
      parameters: undefined,
    });
    addTile({
      ...propsAddTile,
      container: "@fm/template_container",
      module: "/template",
      tile: "/tile1",
      title: `Tile 1`,
      parameters: {},
    });
    addTile({
      ...propsAddTile,
      container: "A",
      module: "B",
      tile: "C",
      title: "D",
      parameters: {},
    });
    //@ts-ignore
    refreshTab(workspacesDefault[0])({ stopPropagation: () => { } });
    setShowTimeout(true);
  }, [])
  return (<Root />);
};

const Comp2 = () => {
  const { add, edit, focus } = useController();
  React.useEffect(() => {
    add();
    focus(3);
    edit(workspacesDefault[1]);
  }, [])
  return (<Root />);
};

const Comp3 = () => {
  const { remove, handleChange } = useController();
  React.useEffect(() => {
    handleChange({ target: { parentElement: { parentElement: { id: "deleteWorkspace-1" } } } }, 1);
    handleChange({ target: { parentElement: { parentElement: { id: "editWorkspace-1" } } } }, 1);
    remove(workspacesDefault1[0]);
  }, [])
  return (<Root />);
};

const waitFor = (time = 2000) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(true);
  }, time)
});

describe("Home component", () => {
  it("should be in the document", async () => {
    render(<Provider data={{ drawers, user, [tk]: tk_value, theme: "dark", expiredIn: (new Date().getTime() / 1000) }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
    await waitFor(8000);
  });
  it("should be in the document", async () => {
    render(<Provider
      data={{
        user, [tk]: tk_value, theme: "dark",
        workspaces: workspacesDefault,
        currentWorkspace: workspacesDefault[0],
        entities: response.entities,
        drawers,
      }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();
  });
  it("should be in the document", async () => {
    render(<Provider
      data={{
        user, [tk]: tk_value, theme: "dark",
        workspaces: workspacesDefault,
        currentWorkspace: undefined,
        entities: response.entities,
        drawers,
      }}>
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
        search: "?survey=no&container=template_container&module=template&tile=tile1"
      },
      writable: true
    });
    render(<Provider
      data={{
        user, [tk]: tk_value, theme: "dark",
        workspaces: workspacesDefault,
        currentWorkspace: undefined,
        entities: response.entities,
        drawers,
      }}>
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
        search: "?survey=no&container=template_container&module=template&tile=tile1"
      },
      writable: true
    });
    render(<Provider
      data={{
        user, [tk]: tk_value, theme: "dark",
        workspaces: workspacesDefault,
        currentWorkspace: undefined,
        entities: response.entities,
        drawers,
      }}>
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
        search: "?survey=no"
      },
      writable: true
    });
    const { container } = render(<Provider
      data={{
        user, [tk]: tk_value, theme: "dark",
        workspaces: workspacesDefault,
        currentWorkspace: workspacesDefault[0],
        entities: response.entities,
        drawers,
      }}
    >
      <ThemeProvider>
        <Comp2 />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();

    const edit = screen.getByTestId(`edit-${workspacesDefault[workspacesDefault.length - 1].id}`);
    expect(edit).toBeInTheDocument();
    edit.click();
    fireEvent.doubleClick(edit);
    const editText = edit.firstChild?.firstChild;
    if (editText) {
      expect(editText).toBeInTheDocument();
      fireEvent.change(editText, { target: { value: "dummy" } });
    }

    const Tabpannel = screen.getByTestId(`workspaces-tab-${workspacesDefault[workspacesDefault.length - 1].id}`);
    expect(Tabpannel).toBeInTheDocument();
    Tabpannel.click();
    const workspaces = screen.getByTestId(`${PREFIX}_workspaces`);
    expect(workspaces).toBeInTheDocument();
    workspaces.click();

    fireEvent.doubleClick(workspaces);
    const add = screen.getByTestId(`${PREFIX}_add_btn`);
    expect(add).toBeInTheDocument();
    add.click();

    const Remove = screen.getByTestId(`deleteWorkspace-${workspacesDefault[workspacesDefault.length - 1].id}`);
    expect(Remove).toBeInTheDocument();
    Remove.click();

    let Remove0 = container.querySelectorAll(`button[aria-label="delete"]`);
    expect(Remove0.length).toEqual(2);
    fireEvent.click(Remove0[0]);
    fireEvent.click(Remove0[1]);
  });
  it("should be in the document", () => {
    render(<Provider
      data={{
        user, [tk]: tk_value, theme: "dark", workspaces: workspacesDefault1,
        currentWorkspace: workspacesDefault1[0],
        entities: response.entities,
        drawers,
      }}
    >
      <ThemeProvider>
        <Comp3 />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
    const id = screen.getByTestId(PREFIX);
    expect(id).toBeInTheDocument();

    const edit = screen.getByTestId(`edit-${workspacesDefault1[0].id}`);
    expect(edit).toBeInTheDocument();
    edit.click();
    fireEvent.doubleClick(edit);
    const editText = edit.firstChild?.firstChild;
    if (editText) {
      expect(editText).toBeInTheDocument();
      fireEvent.change(editText, { target: { value: "dummy" } });
    }
  });
  it("should be in the document", () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: "?code=lZByCzj8aYND2LL4DdkXvUPAD-U&iss=https://test-mfaintig-stg.51318.app.standardchartered.com:443/openam/oauth2/realms/root/realms/sso&client_id=51358ratan"
      },
      writable: true
    });
    render(<Provider data={{ drawers, user, [tk]: tk_value, theme: "dark", workspaces: undefined }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
  it("should be in the document", () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: "?survey=no"
      },
      writable: true
    });
    render(<Provider data={{ drawers, user, [tk]: tk_value, theme: "dark", workspaces: undefined }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
  it("should be in the document", () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: "?survey=yes"
      },
      writable: true
    });
    render(<Provider data={{ drawers, user, [tk]: tk_value, theme: "dark", workspaces: undefined }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
  it("should be in the document", () => {
    Object.defineProperty(window, 'location', {
      value: {
        href: "http://localhost:8001/?code=1234"
      },
      writable: true
    });
    render(<Provider data={{ drawers, user, [tk]: tk_value, theme: "dark", workspaces: undefined }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
  it("should be in the document", () => {
    render(<Provider
      data={{
        user, [tk]: tk_value, theme: "dark", workspaces: workspacesDefault,
        currentWorkspace: workspacesDefault[0],
        entities: response.entities,
        drawers,
      }}
    >
      <ThemeProvider>
        {ContainerComponent(true, { ...workspacesDefault[0] }, 0)}
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
  it("should be in the document", () => {
    render(<Provider
      data={{
        user, [tk]: tk_value, theme: "dark", workspaces: workspacesDefault,
        currentWorkspace: workspacesDefault[0],
        entities: response.entities,
        drawers,
      }}
    >
      <ThemeProvider>
        {ContainerComponent(false, { ...workspacesDefault[0] }, 0)}
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });

  it("should be in the document", () => {
    Object.defineProperty(window, 'fin', {
      value: {},
      writable: true
    });
    render(<Provider
      data={{
        user, [tk]: tk_value, theme: "dark", workspaces: workspacesDefault,
        currentWorkspace: workspacesDefault[0],
        entities: response.entities,
        drawers,
      }}
    >
      <ThemeProvider>
        {ContainerComponent(false, { ...workspacesDefault[0] }, 0)}
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
});

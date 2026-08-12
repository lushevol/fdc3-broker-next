import React from "react";
import { render, screen } from "@testing-library/react";
import Root, { RoutingComponent } from ".";
import Provider from "../hooks/provider";
import ThemeProvider from "../theme";
afterAll(() => {
  vi.clearAllMocks();
});
vi.mock("../services", () => {
  const validate = async () => Promise.resolve(undefined);
  return () => ({
    validate,
    logout: () => { return Promise.resolve({}) },
  })
});
vi.mock('../utils/common', () => {
  return {
    getJWTPayload: () => ({}),
    storeData: vi.fn(),
    clearLocalStorage: vi.fn(),
    clearStorageWhenLogout: vi.fn(),
    uuidv4: () => "id",
    showErrorMsg: vi.fn(),
    show_error_msg: vi.fn(),
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

const user = JSON.parse(`{"sub":"1243644","iss":"single-ui-bff","entitlement":{"role":"FMO_OPS_SUP","actions":["RATAN_TRADE_BLOTTER:F_Custom_Query_Builder","RATAN_TRADE_BLOTTER:F_Custom_View_Builder_Private","RATAN_TRADE_BLOTTER:F_Custom_View_Builder_Public","RATAN_TRADE_BLOTTER:F_Export_Data","RATAN_TRADE_BLOTTER:F_Match_Confirmed_Status_Change","RATAN_TRADE_BLOTTER:F_Retrigger_Confirmation_Dispatch","RATAN_TRADE_BLOTTER:F_Trade_Affirmation_Status_Change","RATAN_TRADE_BLOTTER:F_View_Confirmation","RATAN_TRADE_BLOTTER:UI_Read_Access","RATAN_TRADE_BLOTTER:UI_View_Brokerage_Detail","RATAN_TRADE_BLOTTER:UI_View_Cashflow_Status","RATAN_TRADE_BLOTTER:UI_View_Confirmation_Status","RATAN_TRADE_BLOTTER:UI_View_Counterparty_Data","RATAN_TRADE_BLOTTER:UI_View_Instrument_Detail","RATAN_TRADE_BLOTTER:UI_View_SSI_Data","RATAN_TRADE_BLOTTER:UI_View_Trade_Audit_History","RATAN_TRADE_BLOTTER:UI_View_Trade_Data","RATAN_TRADE_BLOTTER:UI_View_Trade_Version_Differences","RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_Nostro_Initiate","RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_Nostro_Verify","RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_SSI_Initiate","RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_SSI_Verify","RATAN_CASHFLOW_BLOTTER:F_Ad_Hoc_Suppress","RATAN_CASHFLOW_BLOTTER:F_Add_Settlement_Comment","RATAN_CASHFLOW_BLOTTER:F_Cashflow_Affirmation_Status_Change","RATAN_CASHFLOW_BLOTTER:F_Cashflow_Status_Change_Release","RATAN_CASHFLOW_BLOTTER:F_Custom_Query_Builder","RATAN_CASHFLOW_BLOTTER:F_Custom_View_Builder_Private","RATAN_CASHFLOW_BLOTTER:F_Custom_View_Builder_Public","RATAN_CASHFLOW_BLOTTER:F_Export_Data","RATAN_CASHFLOW_BLOTTER:F_Modify_Settlement_Means","RATAN_CASHFLOW_BLOTTER:F_Perform_Ad_Hoc_Netting","RATAN_CASHFLOW_BLOTTER:F_Perform_Cashflow_Split","RATAN_CASHFLOW_BLOTTER:F_Perform_Un_Net_Initiate","RATAN_CASHFLOW_BLOTTER:F_Perform_Un_Net_Verify","RATAN_CASHFLOW_BLOTTER:F_Reinstate","RATAN_CASHFLOW_BLOTTER:UI_Read_Access","RATAN_CASHFLOW_BLOTTER:UI_View_Cashflow_Data","RATAN_CASHFLOW_BLOTTER:UI_View_Cashflow_Status","RATAN_CASHFLOW_BLOTTER:UI_View_Counterparty_Data","RATAN_CASHFLOW_BLOTTER:UI_View_SSI_Data","RATAN_MO_EXCEPTION:F_Custom_View_Builder_Private","RATAN_MO_EXCEPTION:UI_Read_Access","RATAN_VALIDATION_EXCEPTION:F_Custom_View_Builder_Private","RATAN_VALIDATION_EXCEPTION:F_Custom_View_Builder_Public","RATAN_VALIDATION_EXCEPTION:F_Manually_Close_Exception","RATAN_VALIDATION_EXCEPTION:F_Replay_Exception","RATAN_VALIDATION_EXCEPTION:F_Trade_Affirmation_Status_Change","RATAN_VALIDATION_EXCEPTION:UI_Read_Access","RATAN_SETTLEMENT_EXCEPTION:F_Custom_View_Builder_Private","RATAN_SETTLEMENT_EXCEPTION:F_Custom_View_Builder_Public","RATAN_SETTLEMENT_EXCEPTION:F_Input_Delete_Modify_SI_Initiate","RATAN_SETTLEMENT_EXCEPTION:F_Input_Delete_Modify_SI_Verify","RATAN_SETTLEMENT_EXCEPTION:F_Manual_Fix","RATAN_SETTLEMENT_EXCEPTION:F_Manually_Close_Exception","RATAN_SETTLEMENT_EXCEPTION:F_Replay_Exception","RATAN_SETTLEMENT_EXCEPTION:UI_Read_Access","RATAN_WORKFLOW:UI_Read_Access","RATAN_SUPPRESSION_RULE:F_Input_Delete_Modify_Initiate","RATAN_SUPPRESSION_RULE:F_Input_Delete_Modify_Verify","RATAN_SUPPRESSION_RULE:UI_View_Rule_Audit_History","RATAN_SUPPRESSION_RULE:UI_View_Suppression_Rule_Table","RATAN_SETTLEMENT_STP_RULE:F_Input_Delete_Modify_Initiate","RATAN_SETTLEMENT_STP_RULE:F_Input_Delete_Modify_Verify","RATAN_SETTLEMENT_STP_RULE:UI_View_Rule_Audit_History","RATAN_SETTLEMENT_STP_RULE:UI_View_STP_Rule_Table","RATAN_CURRENCY_NSTP_RULE:F_Input_Delete_Modify_Initiate","RATAN_CURRENCY_NSTP_RULE:F_Input_Delete_Modify_Verify","RATAN_CURRENCY_NSTP_RULE:UI_View_NSTP_Rule_Table","RATAN_CURRENCY_NSTP_RULE:UI_View_Rule_Audit_History","RATAN_ISO_CURRENCY_MAPPING:UI_View_Currency_Mapping_Table","RATAN_ISO_CURRENCY_MAPPING:UI_View_Rule_Audit_History","RATAN_NETTING_RULE:F_Input_Delete_Modify_Initiate","RATAN_NETTING_RULE:F_Input_Delete_Modify_Verify","RATAN_NETTING_RULE:UI_View_Netting_Rule_Table","RATAN_NETTING_RULE:UI_View_Rule_Audit_History","RATAN_CURRENCY_CUTOFF:F_Input_Delete_Modify_CUTOFF_Initiate","RATAN_CURRENCY_CUTOFF:F_Input_Delete_Modify_CUTOFF_Verify","RATAN_CURRENCY_CUTOFF:UI_Read_Access","PORTAL_CDU_ISLAMIC:UI_Read_Access"],"dataEntitlementRoles":""},"exp":1678957305,"iat":1678928505,"userLoginTime":"2023-03-16T01:01:45.948Z[GMT]","jti":"single-ui-bff-id","id":"1243644","fullName":"1243644","name":"1243644","userId":"1243644"}`);
const workspacesDefault = JSON.parse(`[{"id":"4cf8ffb7-1bcd-4718-95a3-ea1c13e873ed","label":"Tile 1 ","isLoaded":false,"isActive":false,"containers":[{"id":"d6bcbcb4-4260-410b-a362-1580c82ee609","container":"TemplateContainer","module":"/template","tile":"/tile1","title":"Tile 1 "}]},{"id":"d83bfcbd-c3da-46f2-b1ba-b607a18bd7ad","label":"Tile 2 ","isLoaded":true,"isActive":false,"containers":[{"id":"fe14fc89-12e5-40d2-8cef-52227d900895","container":"TemplateContainer","module":"/template","tile":"/tile2","title":"Tile 2 ","parameters":{"testId":"123"}}]},{"id":"9f701ba7-2020-4c57-a6d2-4ef1727ac1c0","label":"Trade Blotter ","isLoaded":true,"isActive":false,"containers":[{"id":"6e1e9524-2e19-4443-8143-aae86af206e3","container":"RatanContainer","module":"/trade_blotter","tile":"/trade","title":"Trade Blotter "}]},{"id":"d588c755-1949-465c-82eb-32f698bac642","label":"Cashflow Blotter ","isLoaded":true,"isActive":false,"containers":[{"id":"59830ac0-8323-498c-82e2-af97ac4334ed","container":"RatanContainer","module":"/cashflow_blotter","tile":"/cashflow_cn","title":"Cashflow Blotter "}]},{"id":"dd215265-08f7-43a8-9191-26f0e41d24b6","label":"Netting Eligibility Rules ","isLoaded":true,"isActive":false,"containers":[{"id":"6922ca51-6e01-486d-8c5f-c73acecc51ae","container":"RatanContainer","module":"/rules_blotter","tile":"/new_netting_rules","title":"Netting Eligibility Rules "}]},{"id":"c42f785d-3f09-4197-838d-a4a4d0ac0950","label":"Authorization Limits ","isLoaded":true,"isActive":false,"containers":[{"id":"c860bc4e-c9af-4b1e-97a1-7805a8480b35","container":"RatanContainer","module":"/authorization_limits_container","tile":"/authorization_limits","title":"Authorization Limits "}]},{"id":"4b90dc6f-d901-40ab-a9fc-90bd3e512281","label":"Tile 1 ","isLoaded":true,"isActive":false,"containers":[{"id":"fab8b25f-f008-4d4f-b00d-4084ad41995c","container":"abc","module":"/template","tile":"/tile1","title":"Tile 1 "}]},{"id":"681b6db5-f0ea-4a6d-a799-2b4ae2897d44","label":"Tile 2 ","isLoaded":true,"isActive":false,"containers":[{"id":"8d0425c3-3fac-460a-844a-4af20f1f839e","container":"CdupsContainer","module":"/template","tile":"/tile2","title":"Tile 2 "}]}]`)

const tk = "t" + "o" + "k" + "e" + "n";
const tk_value = "Bearer " + "e" + "y" + "J" + "0" + "eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJzdWIiOiIxMjQzNjQ0IiwiaXNzIjoic2luZ2xlLXVpLWJmZiIsImVudGl0bGVtZW50Ijoie1wicm9sZVwiOlwiRk1PX09QU19TVVBcIixcImFjdGlvbnNcIjpbXCJSQVRBTl9UUkFERV9CTE9UVEVSOkZfQ3VzdG9tX1F1ZXJ5X0J1aWxkZXJcIixcIlJBVEFOX1RSQURFX0JMT1RURVI6Rl9DdXN0b21fVmlld19CdWlsZGVyX1ByaXZhdGVcIixcIlJBVEFOX1RSQURFX0JMT1RURVI6Rl9DdXN0b21fVmlld19CdWlsZGVyX1B1YmxpY1wiLFwiUkFUQU5fVFJBREVfQkxPVFRFUjpGX0V4cG9ydF9EYXRhXCIsXCJSQVRBTl9UUkFERV9CTE9UVEVSOkZfTWF0Y2hfQ29uZmlybWVkX1N0YXR1c19DaGFuZ2VcIixcIlJBVEFOX1RSQURFX0JMT1RURVI6Rl9SZXRyaWdnZXJfQ29uZmlybWF0aW9uX0Rpc3BhdGNoXCIsXCJSQVRBTl9UUkFERV9CTE9UVEVSOkZfVHJhZGVfQWZmaXJtYXRpb25fU3RhdHVzX0NoYW5nZVwiLFwiUkFUQU5fVFJBREVfQkxPVFRFUjpGX1ZpZXdfQ29uZmlybWF0aW9uXCIsXCJSQVRBTl9UUkFERV9CTE9UVEVSOlVJX1JlYWRfQWNjZXNzXCIsXCJSQVRBTl9UUkFERV9CTE9UVEVSOlVJX1ZpZXdfQnJva2VyYWdlX0RldGFpbFwiLFwiUkFUQU5fVFJBREVfQkxPVFRFUjpVSV9WaWV3X0Nhc2hmbG93X1N0YXR1c1wiLFwiUkFUQU5fVFJBREVfQkxPVFRFUjpVSV9WaWV3X0NvbmZpcm1hdGlvbl9TdGF0dXNcIixcIlJBVEFOX1RSQURFX0JMT1RURVI6VUlfVmlld19Db3VudGVycGFydHlfRGF0YVwiLFwiUkFUQU5fVFJBREVfQkxPVFRFUjpVSV9WaWV3X0luc3RydW1lbnRfRGV0YWlsXCIsXCJSQVRBTl9UUkFERV9CTE9UVEVSOlVJX1ZpZXdfU1NJX0RhdGFcIixcIlJBVEFOX1RSQURFX0JMT1RURVI6VUlfVmlld19UcmFkZV9BdWRpdF9IaXN0b3J5XCIsXCJSQVRBTl9UUkFERV9CTE9UVEVSOlVJX1ZpZXdfVHJhZGVfRGF0YVwiLFwiUkFUQU5fVFJBREVfQkxPVFRFUjpVSV9WaWV3X1RyYWRlX1ZlcnNpb25fRGlmZmVyZW5jZXNcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6Rl9BZF9Ib2NfTm9zdHJvX0luaXRpYXRlXCIsXCJSQVRBTl9DQVNIRkxPV19CTE9UVEVSOkZfQWRfSG9jX05vc3Ryb19WZXJpZnlcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6Rl9BZF9Ib2NfU1NJX0luaXRpYXRlXCIsXCJSQVRBTl9DQVNIRkxPV19CTE9UVEVSOkZfQWRfSG9jX1NTSV9WZXJpZnlcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6Rl9BZF9Ib2NfU3VwcHJlc3NcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6Rl9BZGRfU2V0dGxlbWVudF9Db21tZW50XCIsXCJSQVRBTl9DQVNIRkxPV19CTE9UVEVSOkZfQ2FzaGZsb3dfQWZmaXJtYXRpb25fU3RhdHVzX0NoYW5nZVwiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpGX0Nhc2hmbG93X1N0YXR1c19DaGFuZ2VfUmVsZWFzZVwiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpGX0N1c3RvbV9RdWVyeV9CdWlsZGVyXCIsXCJSQVRBTl9DQVNIRkxPV19CTE9UVEVSOkZfQ3VzdG9tX1ZpZXdfQnVpbGRlcl9Qcml2YXRlXCIsXCJSQVRBTl9DQVNIRkxPV19CTE9UVEVSOkZfQ3VzdG9tX1ZpZXdfQnVpbGRlcl9QdWJsaWNcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6Rl9FeHBvcnRfRGF0YVwiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpGX01vZGlmeV9TZXR0bGVtZW50X01lYW5zXCIsXCJSQVRBTl9DQVNIRkxPV19CTE9UVEVSOkZfUGVyZm9ybV9BZF9Ib2NfTmV0dGluZ1wiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpGX1BlcmZvcm1fQ2FzaGZsb3dfU3BsaXRcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6Rl9QZXJmb3JtX1VuX05ldF9Jbml0aWF0ZVwiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpGX1BlcmZvcm1fVW5fTmV0X1ZlcmlmeVwiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpGX1JlaW5zdGF0ZVwiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpVSV9SZWFkX0FjY2Vzc1wiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpVSV9WaWV3X0Nhc2hmbG93X0RhdGFcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6VUlfVmlld19DYXNoZmxvd19TdGF0dXNcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6VUlfVmlld19Db3VudGVycGFydHlfRGF0YVwiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpVSV9WaWV3X1NTSV9EYXRhXCIsXCJSQVRBTl9NT19FWENFUFRJT046Rl9DdXN0b21fVmlld19CdWlsZGVyX1ByaXZhdGVcIixcIlJBVEFOX01PX0VYQ0VQVElPTjpVSV9SZWFkX0FjY2Vzc1wiLFwiUkFUQU5fVkFMSURBVElPTl9FWENFUFRJT046Rl9DdXN0b21fVmlld19CdWlsZGVyX1ByaXZhdGVcIixcIlJBVEFOX1ZBTElEQVRJT05fRVhDRVBUSU9OOkZfQ3VzdG9tX1ZpZXdfQnVpbGRlcl9QdWJsaWNcIixcIlJBVEFOX1ZBTElEQVRJT05fRVhDRVBUSU9OOkZfTWFudWFsbHlfQ2xvc2VfRXhjZXB0aW9uXCIsXCJSQVRBTl9WQUxJREFUSU9OX0VYQ0VQVElPTjpGX1JlcGxheV9FeGNlcHRpb25cIixcIlJBVEFOX1ZBTElEQVRJT05fRVhDRVBUSU9OOkZfVHJhZGVfQWZmaXJtYXRpb25fU3RhdHVzX0NoYW5nZVwiLFwiUkFUQU5fVkFMSURBVElPTl9FWENFUFRJT046VUlfUmVhZF9BY2Nlc3NcIixcIlJBVEFOX1NFVFRMRU1FTlRfRVhDRVBUSU9OOkZfQ3VzdG9tX1ZpZXdfQnVpbGRlcl9Qcml2YXRlXCIsXCJSQVRBTl9TRVRUTEVNRU5UX0VYQ0VQVElPTjpGX0N1c3RvbV9WaWV3X0J1aWxkZXJfUHVibGljXCIsXCJSQVRBTl9TRVRUTEVNRU5UX0VYQ0VQVElPTjpGX0lucHV0X0RlbGV0ZV9Nb2RpZnlfU0lfSW5pdGlhdGVcIixcIlJBVEFOX1NFVFRMRU1FTlRfRVhDRVBUSU9OOkZfSW5wdXRfRGVsZXRlX01vZGlmeV9TSV9WZXJpZnlcIixcIlJBVEFOX1NFVFRMRU1FTlRfRVhDRVBUSU9OOkZfTWFudWFsX0ZpeFwiLFwiUkFUQU5fU0VUVExFTUVOVF9FWENFUFRJT046Rl9NYW51YWxseV9DbG9zZV9FeGNlcHRpb25cIixcIlJBVEFOX1NFVFRMRU1FTlRfRVhDRVBUSU9OOkZfUmVwbGF5X0V4Y2VwdGlvblwiLFwiUkFUQU5fU0VUVExFTUVOVF9FWENFUFRJT046VUlfUmVhZF9BY2Nlc3NcIixcIlJBVEFOX1dPUktGTE9XOlVJX1JlYWRfQWNjZXNzXCIsXCJSQVRBTl9TVVBQUkVTU0lPTl9SVUxFOkZfSW5wdXRfRGVsZXRlX01vZGlmeV9Jbml0aWF0ZVwiLFwiUkFUQU5fU1VQUFJFU1NJT05fUlVMRTpGX0lucHV0X0RlbGV0ZV9Nb2RpZnlfVmVyaWZ5XCIsXCJSQVRBTl9TVVBQUkVTU0lPTl9SVUxFOlVJX1ZpZXdfUnVsZV9BdWRpdF9IaXN0b3J5XCIsXCJSQVRBTl9TVVBQUkVTU0lPTl9SVUxFOlVJX1ZpZXdfU3VwcHJlc3Npb25fUnVsZV9UYWJsZVwiLFwiUkFUQU5fU0VUVExFTUVOVF9TVFBfUlVMRTpGX0lucHV0X0RlbGV0ZV9Nb2RpZnlfSW5pdGlhdGVcIixcIlJBVEFOX1NFVFRMRU1FTlRfU1RQX1JVTEU6Rl9JbnB1dF9EZWxldGVfTW9kaWZ5X1ZlcmlmeVwiLFwiUkFUQU5fU0VUVExFTUVOVF9TVFBfUlVMRTpVSV9WaWV3X1J1bGVfQXVkaXRfSGlzdG9yeVwiLFwiUkFUQU5fU0VUVExFTUVOVF9TVFBfUlVMRTpVSV9WaWV3X1NUUF9SdWxlX1RhYmxlXCIsXCJSQVRBTl9DVVJSRU5DWV9OU1RQX1JVTEU6Rl9JbnB1dF9EZWxldGVfTW9kaWZ5X0luaXRpYXRlXCIsXCJSQVRBTl9DVVJSRU5DWV9OU1RQX1JVTEU6Rl9JbnB1dF9EZWxldGVfTW9kaWZ5X1ZlcmlmeVwiLFwiUkFUQU5fQ1VSUkVOQ1lfTlNUUF9SVUxFOlVJX1ZpZXdfTlNUUF9SdWxlX1RhYmxlXCIsXCJSQVRBTl9DVVJSRU5DWV9OU1RQX1JVTEU6VUlfVmlld19SdWxlX0F1ZGl0X0hpc3RvcnlcIixcIlJBVEFOX0lTT19DVVJSRU5DWV9NQVBQSU5HOlVJX1ZpZXdfQ3VycmVuY3lfTWFwcGluZ19UYWJsZVwiLFwiUkFUQU5fSVNPX0NVUlJFTkNZX01BUFBJTkc6VUlfVmlld19SdWxlX0F1ZGl0X0hpc3RvcnlcIixcIlJBVEFOX05FVFRJTkdfUlVMRTpGX0lucHV0X0RlbGV0ZV9Nb2RpZnlfSW5pdGlhdGVcIixcIlJBVEFOX05FVFRJTkdfUlVMRTpGX0lucHV0X0RlbGV0ZV9Nb2RpZnlfVmVyaWZ5XCIsXCJSQVRBTl9ORVRUSU5HX1JVTEU6VUlfVmlld19OZXR0aW5nX1J1bGVfVGFibGVcIixcIlJBVEFOX05FVFRJTkdfUlVMRTpVSV9WaWV3X1J1bGVfQXVkaXRfSGlzdG9yeVwiLFwiUkFUQU5fQ1VSUkVOQ1lfQ1VUT0ZGOkZfSW5wdXRfRGVsZXRlX01vZGlmeV9DVVRPRkZfSW5pdGlhdGVcIixcIlJBVEFOX0NVUlJFTkNZX0NVVE9GRjpGX0lucHV0X0RlbGV0ZV9Nb2RpZnlfQ1VUT0ZGX1ZlcmlmeVwiLFwiUkFUQU5fQ1VSUkVOQ1lfQ1VUT0ZGOlVJX1JlYWRfQWNjZXNzXCIsXCJQT1JUQUxfQ0RVX0lTTEFNSUM6VUlfUmVhZF9BY2Nlc3NcIl0sXCJkYXRhRW50aXRsZW1lbnRSb2xlc1wiOlwiXCJ9IiwiZXhwIjoxNjc4OTU3MzA1LCJpYXQiOjE2Nzg5Mjg1MDUsInVzZXJMb2dpblRpbWUiOiIyMDIzLTAzLTE2VDAxOjAxOjQ1Ljk0OFpbR01UXSIsImp0aSI6InNpbmdsZS11aS1iZmYtaWQifQ.YGVIc-P4Wv2tq25AO4HrQIiYFEF7ei41SP4Yiz4SnpmpR0uxwH_eCxDDgOgJOhihE4KVkCJVIEt4Kc017MNU7x-JNaru8SqV6wD3VEfYM8QEIjdCEEn1wiPceGcp4iHPe_xbJAN6nu1Im18OXjPRxfG6DHM6dq6FGrhmozunlBYdfTU82ss3-Z9dCoCiH8zLnabXgF4xQW-E0HS_xA_zUIsnTxCVhYEQJVerjBZE0skWN2rpgfJZzXT0sKSlu-lNINWoCRTeiLjRZAbsZS3572O6EMnnhYSLCZFROUBxBmezV52WDt8DSw2xYd4Rrekd6yM-FwE_KRXSynox7h1dzQ";

const entities = [
  {
    "id": 11274101,
    "name": "X_RATANONE",
    "applicationName": "RATAN",
    "roleId": 11274173,
    "roleName": "FMO_OPS",
    "subjects": [
      {
        "longName": "/RATAN_CASHFLOW_BLOTTER",
        "name": "RATAN_CASHFLOW_BLOTTER",
        "id": 11274218,
        "actions": [
          {
            "name": "F_Ad_Hoc_Nostro_Initiate",
            "id": 11274299,
            "entitlementId": 11275001
          },
          {
            "name": "F_Ad_Hoc_Nostro_Verify",
            "id": 11274950,
            "entitlementId": 11275003
          },
          {
            "name": "F_Ad_Hoc_SSI_Initiate",
            "id": 11274951,
            "entitlementId": 11275005
          },
          {
            "name": "F_Ad_Hoc_SSI_Verify",
            "id": 11274952,
            "entitlementId": 11275006
          },
          {
            "name": "F_Ad_Hoc_Suppress",
            "id": 11274953,
            "entitlementId": 11275008
          },
          {
            "name": "F_Add_Settlement_Comment",
            "id": 11274954,
            "entitlementId": 11275016
          },
          {
            "name": "F_Cashflow_Affirmation_Status_Change",
            "id": 11274955,
            "entitlementId": 11275017
          },
          {
            "name": "F_Cashflow_Status_Change_Release",
            "id": 11274956,
            "entitlementId": 11275028
          },
          {
            "name": "F_Custom_Query_Builder",
            "id": 11274957,
            "entitlementId": 11275033
          },
          {
            "name": "F_Custom_View_Builder_Private",
            "id": 11274958,
            "entitlementId": 11275062
          },
          {
            "name": "F_Custom_View_Builder_Public",
            "id": 11274959,
            "entitlementId": 11275065
          },
          {
            "name": "F_Export_Data",
            "id": 11274960,
            "entitlementId": 11275078
          },
          {
            "name": "F_Perform_Ad_Hoc_Netting",
            "id": 11274974,
            "entitlementId": 11275149
          },
          {
            "name": "F_Perform_Un_Net_Initiate",
            "id": 11274976,
            "entitlementId": 11275163
          },
          {
            "name": "F_Perform_Un_Net_Verify",
            "id": 11274977,
            "entitlementId": 11275170
          },
          {
            "name": "F_Reinstate",
            "id": 11274978,
            "entitlementId": 11275178
          },
          {
            "name": "ACCESS_FMO_POST_TRADE_PORTAL",
            "id": 11274984,
            "entitlementId": 11275242
          }
        ]
      },
      {
        "longName": "/RATAN_TRADE_BLOTTER",
        "name": "RATAN_TRADE_BLOTTER",
        "id": 11274226,
        "actions": [
          {
            "name": "F_Custom_Query_Builder",
            "id": 11274957,
            "entitlementId": 11274350
          },
          {
            "name": "F_Custom_View_Builder_Private",
            "id": 11274958,
            "entitlementId": 11274351
          },
          {
            "name": "F_Export_Data",
            "id": 11274960,
            "entitlementId": 11274352
          },
          {
            "name": "F_Retrigger_Confirmation_Dispatch",
            "id": 11274980,
            "entitlementId": 11274354
          },
          {
            "name": "F_Trade_Affirmation_Status_Change",
            "id": 11274981,
            "entitlementId": 11274355
          },
          {
            "name": "ACCESS_FMO_POST_TRADE_PORTAL",
            "id": 11274984,
            "entitlementId": 11275268
          },
          {
            "name": "UI_View_Trade_Audit_History",
            "id": 11274993,
            "entitlementId": 11274363
          }
        ]
      },
      {
        "longName": "/RATAN_MO_EXCEPTION",
        "name": "RATAN_MO_EXCEPTION",
        "id": 11274219,
        "actions": [
          {
            "name": "F_Custom_View_Builder_Private",
            "id": 11274958,
            "entitlementId": 11274305
          },
          {
            "name": "ACCESS_FMO_POST_TRADE_PORTAL",
            "id": 11274984,
            "entitlementId": 11275288
          }
        ]
      },
      {
        "longName": "/RATAN_VALIDATION_EXCEPTION",
        "name": "RATAN_VALIDATION_EXCEPTION",
        "id": 11274227,
        "actions": [
          {
            "name": "F_Custom_View_Builder_Private",
            "id": 11274958,
            "entitlementId": 11274415
          },
          {
            "name": "F_Replay_Exception",
            "id": 11274979,
            "entitlementId": 11274416
          },
          {
            "name": "F_Trade_Affirmation_Status_Change",
            "id": 11274981,
            "entitlementId": 11274417
          },
          {
            "name": "ACCESS_FMO_POST_TRADE_PORTAL",
            "id": 11274984,
            "entitlementId": 11275366
          }
        ]
      },
      {
        "longName": "/RATAN_SETTLEMENT_EXCEPTION",
        "name": "RATAN_SETTLEMENT_EXCEPTION",
        "id": 11274223,
        "actions": [
          {
            "name": "F_Custom_View_Builder_Private",
            "id": 11274958,
            "entitlementId": 11275051
          },
          {
            "name": "F_Input_Delete_Modify_SI_Initiate",
            "id": 11274964,
            "entitlementId": 11275107
          },
          {
            "name": "F_Input_Delete_Modify_SI_Verify",
            "id": 11274965,
            "entitlementId": 11275108
          },
          {
            "name": "F_Manual_Fix",
            "id": 11274967,
            "entitlementId": 11275126
          },
          {
            "name": "F_Replay_Exception",
            "id": 11274979,
            "entitlementId": 11275179
          },
          {
            "name": "ACCESS_FMO_POST_TRADE_PORTAL",
            "id": 11274984,
            "entitlementId": 11275299
          }
        ]
      },
      {
        "longName": "/RATAN_SETTLEMENT_STP_RULE",
        "name": "RATAN_SETTLEMENT_STP_RULE",
        "id": 11274224,
        "actions": [
          {
            "name": "F_Input_Delete_Modify_Initiate",
            "id": 11274963,
            "entitlementId": 11274319
          },
          {
            "name": "ACCESS_FMO_POST_TRADE_PORTAL",
            "id": 11274984,
            "entitlementId": 11275339
          }
        ]
      },
      {
        "longName": "/RATAN_SUPPRESSION_RULE",
        "name": "RATAN_SUPPRESSION_RULE",
        "id": 11274225,
        "actions": [
          {
            "name": "F_Input_Delete_Modify_Initiate",
            "id": 11274963,
            "entitlementId": 11274320
          },
          {
            "name": "ACCESS_FMO_POST_TRADE_PORTAL",
            "id": 11274984,
            "entitlementId": 11275316
          }
        ]
      },
      {
        "longName": "/RATAN_NETTING_RULE",
        "name": "RATAN_NETTING_RULE",
        "id": 11274220,
        "actions": [
          {
            "name": "ACCESS_FMO_POST_TRADE_PORTAL",
            "id": 11274984,
            "entitlementId": 11275352
          }
        ]
      },
      {
        "longName": "/RATAN_AUTO_NETTING_RULE",
        "name": "RATAN_AUTO_NETTING_RULE",
        "id": 11274214,
        "actions": [
          {
            "name": "ACCESS_FMO_POST_TRADE_PORTAL",
            "id": 11274984,
            "entitlementId": 11275397
          }
        ]
      },
      {
        "longName": "/RATAN_NOSTRO_BLOTTER",
        "name": "RATAN_NOSTRO_BLOTTER",
        "id": 11274221,
        "actions": [
          {
            "name": "ACCESS_FMO_POST_TRADE_PORTAL",
            "id": 11274984,
            "entitlementId": 11275190
          }
        ]
      },
      {
        "longName": "/RATAN_ENTITLEMENT_RULE",
        "name": "RATAN_ENTITLEMENT_RULE",
        "id": 11274217,
        "actions": [
          {
            "name": "ACCESS_FMO_POST_TRADE_PORTAL",
            "id": 11274984,
            "entitlementId": 11275214
          }
        ]
      }
    ]
  },
  {
    "id": 11499709,
    "name": "SSIPLUS",
    "applicationName": "SSIPLUS",
    "roleId": 11499770,
    "roleName": "SSI_SUPER_USER",
    "subjects": [
      {
        "longName": "/IMPORTEXPORT",
        "name": "IMPORTEXPORT",
        "id": 11528802,
        "actions": [
          {
            "name": "WRITE",
            "id": 11499856,
            "entitlementId": 11529780
          }
        ]
      },
      {
        "longName": "/SEARCH",
        "name": "SEARCH",
        "id": 11499803,
        "actions": [
          {
            "name": "WRITE",
            "id": 11499856,
            "entitlementId": 11501568
          }
        ]
      },
      {
        "longName": "/STATIC",
        "name": "STATIC",
        "id": 11499802,
        "actions": [
          {
            "name": "WRITE",
            "id": 11499856,
            "entitlementId": 11501569
          }
        ]
      },
      {
        "longName": "/VALIDATIONRULES",
        "name": "VALIDATIONRULES",
        "id": 11499804,
        "actions": [
          {
            "name": "WRITE",
            "id": 11499856,
            "entitlementId": 11501570
          }
        ]
      },
      {
        "longName": "/WORKQUEUES",
        "name": "WORKQUEUE",
        "id": 11499805,
        "actions": [
          {
            "name": "WRITE",
            "id": 11499856,
            "entitlementId": 11501571
          }
        ]
      }
    ]
  },
  {
    "id": 11929107,
    "name": "STAMP_STATIC",
    "applicationName": "ASSET CONTROL",
    "roleId": 11929157,
    "roleName": "STATIC_STAMP",
    "subjects": [
      {
        "longName": "/Test STAMP DATA MAPPING",
        "name": "Test STAMP DATA MAPPING",
        "id": 11937905,
        "actions": [
          {
            "name": "Create",
            "id": 11928928,
            "entitlementId": 12040737
          },
          {
            "name": "Delete",
            "id": 11928929,
            "entitlementId": 12040738
          },
          {
            "name": "Edit",
            "id": 11928930,
            "entitlementId": 12040739
          },
          {
            "name": "Read",
            "id": 11928931,
            "entitlementId": 12040740
          }
        ]
      },
      {
        "longName": "/TDS3 REVERSE MAPPING",
        "name": "TDS3 REVERSE MAPPING",
        "id": 12042950,
        "actions": [
          {
            "name": "Create",
            "id": 11928928,
            "entitlementId": 12043000
          },
          {
            "name": "Delete",
            "id": 11928929,
            "entitlementId": 12043001
          },
          {
            "name": "Edit",
            "id": 11928930,
            "entitlementId": 12043002
          },
          {
            "name": "Read",
            "id": 11928931,
            "entitlementId": 12043003
          }
        ]
      },
      {
        "longName": "/CFETS CROSS CURRENCY SWAP RATE MAPPING",
        "name": "CFETS CROSS CURRENCY SWAP RATE MAPPING",
        "id": 11930816,
        "actions": [
          {
            "name": "Create",
            "id": 11928928,
            "entitlementId": 11929237
          },
          {
            "name": "Delete",
            "id": 11928929,
            "entitlementId": 11929238
          },
          {
            "name": "Edit",
            "id": 11928930,
            "entitlementId": 11929239
          },
          {
            "name": "Read",
            "id": 11928931,
            "entitlementId": 11929240
          }
        ]
      },
      {
        "longName": "/CFETS IR SWAP RATE MAPPING",
        "name": "CFETS IR SWAP RATE MAPPING",
        "id": 11930817,
        "actions": [
          {
            "name": "Create",
            "id": 11928928,
            "entitlementId": 11929241
          },
          {
            "name": "Delete",
            "id": 11928929,
            "entitlementId": 11929242
          },
          {
            "name": "Edit",
            "id": 11928930,
            "entitlementId": 11929243
          },
          {
            "name": "Read",
            "id": 11928931,
            "entitlementId": 11929244
          }
        ]
      },
      {
        "longName": "/CFETS USER PORTFOLIO",
        "name": "CFETS USER PORTFOLIO",
        "id": 11930815,
        "actions": [
          {
            "name": "Create",
            "id": 11928928,
            "entitlementId": 11929245
          },
          {
            "name": "Delete",
            "id": 11928929,
            "entitlementId": 11929246
          },
          {
            "name": "Edit",
            "id": 11928930,
            "entitlementId": 11929247
          },
          {
            "name": "Read",
            "id": 11928931,
            "entitlementId": 11929248
          }
        ]
      },
      {
        "longName": "/Audit",
        "name": "Audit",
        "id": 11930814,
        "actions": [
          {
            "name": "Read",
            "id": 11928931,
            "entitlementId": 11929231
          }
        ]
      },
      {
        "longName": "/Mapping Query",
        "name": "Mapping Query",
        "id": 11930813,
        "actions": [
          {
            "name": "Write",
            "id": 11928932,
            "entitlementId": 11929232
          }
        ]
      }
    ]
  }
];
const Comp = () => {
  return (<Root />);
};

describe("Routing component", () => {
  it("should be in the document", () => {
    render(<Provider data={{ theme: "light", token: undefined, user: undefined, errorMsg: "error" }}>
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
  it("should be in the document", () => {
    render(<Provider
      data={{
        user, token: tk_value, theme: "dark",
      }}
    >
      <ThemeProvider>
        <Comp />
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
  it("should be in the document", () => {
    render(<Provider
      data={{
        user, token: tk_value, theme: "light", workspaces: workspacesDefault,
        currentWorkspace: workspacesDefault[0]
      }}
    >
      <ThemeProvider>
        <Comp />
        {RoutingComponent(tk_value, entities)}
      </ThemeProvider>
    </Provider>);
    expect(screen).toBeDefined();
  });
});

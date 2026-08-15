import { ActionType } from "../hooks/reducer/util/ActionType";
import {
  getJWTPayload,
  storeData,
  clearLocalStorage,
  uuidv4,
  showErrorMsg,
  show_error_msg,
  getEnv,
  isNumber,
  isDate,
  formatDate,
  formatDateToISO,
  getWindowOpen,
  getSSOLink,
  getLocation,
  getSurveyLink,
  isEmpty,
  clearStorageWhenLogout,
  validateTile,
  validateWorkspace,
  isValidationToFormateDate,
  waitFor,
  aOrb,
  getDate,
  getTenantId,
  getClientId,
  getEntraSSOLink,
} from "./common";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";
dayjs.extend(utc);
dayjs.extend(duration);

const part1 = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9";
const part2 = "eyJzdWIiOiIxMjQzNjQ0IiwiaXNzIjoic2luZ2xlLXVpLWJmZiIsImVudGl0bGVtZW50Ijoie1wicm9sZVwiOlwiRk1PX09QU19TVVBcIixcImFjdGlvbnNcIjpbXCJSQVRBTl9UUkFERV9CTE9UVEVSOkZfQ3VzdG9tX1F1ZXJ5X0J1aWxkZXJcIixcIlJBVEFOX1RSQURFX0JMT1RURVI6Rl9DdXN0b21fVmlld19CdWlsZGVyX1ByaXZhdGVcIixcIlJBVEFOX1RSQURFX0JMT1RURVI6Rl9DdXN0b21fVmlld19CdWlsZGVyX1B1YmxpY1wiLFwiUkFUQU5fVFJBREVfQkxPVFRFUjpGX0V4cG9ydF9EYXRhXCIsXCJSQVRBTl9UUkFERV9CTE9UVEVSOkZfTWF0Y2hfQ29uZmlybWVkX1N0YXR1c19DaGFuZ2VcIixcIlJBVEFOX1RSQURFX0JMT1RURVI6Rl9SZXRyaWdnZXJfQ29uZmlybWF0aW9uX0Rpc3BhdGNoXCIsXCJSQVRBTl9UUkFERV9CTE9UVEVSOkZfVHJhZGVfQWZmaXJtYXRpb25fU3RhdHVzX0NoYW5nZVwiLFwiUkFUQU5fVFJBREVfQkxPVFRFUjpGX1ZpZXdfQ29uZmlybWF0aW9uXCIsXCJSQVRBTl9UUkFERV9CTE9UVEVSOlVJX1JlYWRfQWNjZXNzXCIsXCJSQVRBTl9UUkFERV9CTE9UVEVSOlVJX1ZpZXdfQnJva2VyYWdlX0RldGFpbFwiLFwiUkFUQU5fVFJBREVfQkxPVFRFUjpVSV9WaWV3X0Nhc2hmbG93X1N0YXR1c1wiLFwiUkFUQU5fVFJBREVfQkxPVFRFUjpVSV9WaWV3X0NvbmZpcm1hdGlvbl9TdGF0dXNcIixcIlJBVEFOX1RSQURFX0JMT1RURVI6VUlfVmlld19Db3VudGVycGFydHlfRGF0YVwiLFwiUkFUQU5fVFJBREVfQkxPVFRFUjpVSV9WaWV3X0luc3RydW1lbnRfRGV0YWlsXCIsXCJSQVRBTl9UUkFERV9CTE9UVEVSOlVJX1ZpZXdfU1NJX0RhdGFcIixcIlJBVEFOX1RSQURFX0JMT1RURVI6VUlfVmlld19UcmFkZV9BdWRpdF9IaXN0b3J5XCIsXCJSQVRBTl9UUkFERV9CTE9UVEVSOlVJX1ZpZXdfVHJhZGVfRGF0YVwiLFwiUkFUQU5fVFJBREVfQkxPVFRFUjpVSV9WaWV3X1RyYWRlX1ZlcnNpb25fRGlmZmVyZW5jZXNcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6Rl9BZF9Ib2NfTm9zdHJvX0luaXRpYXRlXCIsXCJSQVRBTl9DQVNIRkxPV19CTE9UVEVSOkZfQWRfSG9jX05vc3Ryb19WZXJpZnlcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6Rl9BZF9Ib2NfU1NJX0luaXRpYXRlXCIsXCJSQVRBTl9DQVNIRkxPV19CTE9UVEVSOkZfQWRfSG9jX1NTSV9WZXJpZnlcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6Rl9BZF9Ib2NfU3VwcHJlc3NcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6Rl9BZGRfU2V0dGxlbWVudF9Db21tZW50XCIsXCJSQVRBTl9DQVNIRkxPV19CTE9UVEVSOkZfQ2FzaGZsb3dfQWZmaXJtYXRpb25fU3RhdHVzX0NoYW5nZVwiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpGX0Nhc2hmbG93X1N0YXR1c19DaGFuZ2VfUmVsZWFzZVwiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpGX0N1c3RvbV9RdWVyeV9CdWlsZGVyXCIsXCJSQVRBTl9DQVNIRkxPV19CTE9UVEVSOkZfQ3VzdG9tX1ZpZXdfQnVpbGRlcl9Qcml2YXRlXCIsXCJSQVRBTl9DQVNIRkxPV19CTE9UVEVSOkZfQ3VzdG9tX1ZpZXdfQnVpbGRlcl9QdWJsaWNcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6Rl9FeHBvcnRfRGF0YVwiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpGX01vZGlmeV9TZXR0bGVtZW50X01lYW5zXCIsXCJSQVRBTl9DQVNIRkxPV19CTE9UVEVSOkZfUGVyZm9ybV9BZF9Ib2NfTmV0dGluZ1wiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpGX1BlcmZvcm1fQ2FzaGZsb3dfU3BsaXRcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6Rl9QZXJmb3JtX1VuX05ldF9Jbml0aWF0ZVwiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpGX1BlcmZvcm1fVW5fTmV0X1ZlcmlmeVwiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpGX1JlaW5zdGF0ZVwiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpVSV9SZWFkX0FjY2Vzc1wiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpVSV9WaWV3X0Nhc2hmbG93X0RhdGFcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6VUlfVmlld19DYXNoZmxvd19TdGF0dXNcIixcIlJBVEFOX0NBU0hGTE9XX0JMT1RURVI6VUlfVmlld19Db3VudGVycGFydHlfRGF0YVwiLFwiUkFUQU5fQ0FTSEZMT1dfQkxPVFRFUjpVSV9WaWV3X1NTSV9EYXRhXCIsXCJSQVRBTl9NT19FWENFUFRJT046Rl9DdXN0b21fVmlld19CdWlsZGVyX1ByaXZhdGVcIixcIlJBVEFOX01PX0VYQ0VQVElPTjpVSV9SZWFkX0FjY2Vzc1wiLFwiUkFUQU5fVkFMSURBVElPTl9FWENFUFRJT046Rl9DdXN0b21fVmlld19CdWlsZGVyX1ByaXZhdGVcIixcIlJBVEFOX1ZBTElEQVRJT05fRVhDRVBUSU9OOkZfQ3VzdG9tX1ZpZXdfQnVpbGRlcl9QdWJsaWNcIixcIlJBVEFOX1ZBTElEQVRJT05fRVhDRVBUSU9OOkZfTWFudWFsbHlfQ2xvc2VfRXhjZXB0aW9uXCIsXCJSQVRBTl9WQUxJREFUSU9OX0VYQ0VQVElPTjpGX1JlcGxheV9FeGNlcHRpb25cIixcIlJBVEFOX1ZBTElEQVRJT05fRVhDRVBUSU9OOkZfVHJhZGVfQWZmaXJtYXRpb25fU3RhdHVzX0NoYW5nZVwiLFwiUkFUQU5fVkFMSURBVElPTl9FWENFUFRJT046VUlfUmVhZF9BY2Nlc3NcIixcIlJBVEFOX1NFVFRMRU1FTlRfRVhDRVBUSU9OOkZfQ3VzdG9tX1ZpZXdfQnVpbGRlcl9Qcml2YXRlXCIsXCJSQVRBTl9TRVRUTEVNRU5UX0VYQ0VQVElPTjpGX0N1c3RvbV9WaWV3X0J1aWxkZXJfUHVibGljXCIsXCJSQVRBTl9TRVRUTEVNRU5UX0VYQ0VQVElPTjpGX0lucHV0X0RlbGV0ZV9Nb2RpZnlfU0lfSW5pdGlhdGVcIixcIlJBVEFOX1NFVFRMRU1FTlRfRVhDRVBUSU9OOkZfSW5wdXRfRGVsZXRlX01vZGlmeV9TSV9WZXJpZnlcIixcIlJBVEFOX1NFVFRMRU1FTlRfRVhDRVBUSU9OOkZfTWFudWFsX0ZpeFwiLFwiUkFUQU5fU0VUVExFTUVOVF9FWENFUFRJT046Rl9NYW51YWxseV9DbG9zZV9FeGNlcHRpb25cIixcIlJBVEFOX1NFVFRMRU1FTlRfRVhDRVBUSU9OOkZfUmVwbGF5X0V4Y2VwdGlvblwiLFwiUkFUQU5fU0VUVExFTUVOVF9FWENFUFRJT046VUlfUmVhZF9BY2Nlc3NcIixcIlJBVEFOX1dPUktGTE9XOlVJX1JlYWRfQWNjZXNzXCIsXCJSQVRBTl9TVVBQUkVTU0lPTl9SVUxFOkZfSW5wdXRfRGVsZXRlX01vZGlmeV9Jbml0aWF0ZVwiLFwiUkFUQU5fU1VQUFJFU1NJT05fUlVMRTpGX0lucHV0X0RlbGV0ZV9Nb2RpZnlfVmVyaWZ5XCIsXCJSQVRBTl9TVVBQUkVTU0lPTl9SVUxFOlVJX1ZpZXdfUnVsZV9BdWRpdF9IaXN0b3J5XCIsXCJSQVRBTl9TVVBQUkVTU0lPTl9SVUxFOlVJX1ZpZXdfU3VwcHJlc3Npb25fUnVsZV9UYWJsZVwiLFwiUkFUQU5fU0VUVExFTUVOVF9TVFBfUlVMRTpGX0lucHV0X0RlbGV0ZV9Nb2RpZnlfSW5pdGlhdGVcIixcIlJBVEFOX1NFVFRMRU1FTlRfU1RQX1JVTEU6Rl9JbnB1dF9EZWxldGVfTW9kaWZ5X1ZlcmlmeVwiLFwiUkFUQU5fU0VUVExFTUVOVF9TVFBfUlVMRTpVSV9WaWV3X1J1bGVfQXVkaXRfSGlzdG9yeVwiLFwiUkFUQU5fU0VUVExFTUVOVF9TVFBfUlVMRTpVSV9WaWV3X1NUUF9SdWxlX1RhYmxlXCIsXCJSQVRBTl9DVVJSRU5DWV9OU1RQX1JVTEU6Rl9JbnB1dF9EZWxldGVfTW9kaWZ5X0luaXRpYXRlXCIsXCJSQVRBTl9DVVJSRU5DWV9OU1RQX1JVTEU6Rl9JbnB1dF9EZWxldGVfTW9kaWZ5X1ZlcmlmeVwiLFwiUkFUQU5fQ1VSUkVOQ1lfTlNUUF9SVUxFOlVJX1ZpZXdfTlNUUF9SdWxlX1RhYmxlXCIsXCJSQVRBTl9DVVJSRU5DWV9OU1RQX1JVTEU6VUlfVmlld19SdWxlX0F1ZGl0X0hpc3RvcnlcIixcIlJBVEFOX0lTT19DVVJSRU5DWV9NQVBQSU5HOlVJX1ZpZXdfQ3VycmVuY3lfTWFwcGluZ19UYWJsZVwiLFwiUkFUQU5fSVNPX0NVUlJFTkNZX01BUFBJTkc6VUlfVmlld19SdWxlX0F1ZGl0X0hpc3RvcnlcIixcIlJBVEFOX05FVFRJTkdfUlVMRTpGX0lucHV0X0RlbGV0ZV9Nb2RpZnlfSW5pdGlhdGVcIixcIlJBVEFOX05FVFRJTkdfUlVMRTpGX0lucHV0X0RlbGV0ZV9Nb2RpZnlfVmVyaWZ5XCIsXCJSQVRBTl9ORVRUSU5HX1JVTEU6VUlfVmlld19OZXR0aW5nX1J1bGVfVGFibGVcIixcIlJBVEFOX05FVFRJTkdfUlVMRTpVSV9WaWV3X1J1bGVfQXVkaXRfSGlzdG9yeVwiLFwiUkFUQU5fQ1VSUkVOQ1lfQ1VUT0ZGOkZfSW5wdXRfRGVsZXRlX01vZGlmeV9DVVRPRkZfSW5pdGlhdGVcIixcIlJBVEFOX0NVUlJFTkNZX0NVVE9GRjpGX0lucHV0X0RlbGV0ZV9Nb2RpZnlfQ1VUT0ZGX1ZlcmlmeVwiLFwiUkFUQU5fQ1VSUkVOQ1lfQ1VUT0ZGOlVJX1JlYWRfQWNjZXNzXCIsXCJQT1JUQUxfQ0RVX0lTTEFNSUM6VUlfUmVhZF9BY2Nlc3NcIl0sXCJkYXRhRW50aXRsZW1lbnRSb2xlc1wiOlwiXCJ9IiwiZXhwIjoxNjc4OTU3MzA1LCJpYXQiOjE2Nzg5Mjg1MDUsInVzZXJMb2dpblRpbWUiOiIyMDIzLTAzLTE2VDAxOjAxOjQ1Ljk0OFpbR01UXSIsImp0aSI6InNpbmdsZS11aS1iZmYtaWQifQ";
const part3 = "YGVIc-P4Wv2tq25AO4HrQIiYFEF7ei41SP4Yiz4SnpmpR0uxwH_eCxDDgOgJOhihE4KVkCJVIEt4Kc017MNU7x-JNaru8SqV6wD3VEfYM8QEIjdCEEn1wiPceGcp4iHPe_xbJAN6nu1Im18OXjPRxfG6DHM6dq6FGrhmozunlBYdfTU82ss3-Z9dCoCiH8zLnabXgF4xQW-E0HS_xA_zUIsnTxCVhYEQJVerjBZE0skWN2rpgfJZzXT0sKSlu-lNINWoCRTeiLjRZAbsZS3572O6EMnnhYSLCZFROUBxBmezV52WDt8DSw2xYd4Rrekd6yM-FwE_KRXSynox7h1dzQ";
const token = `Bearer ${part1}.${part2}.${part3}`;

afterAll(() => {
  vi.clearAllMocks();
});
vi.mock('../hooks', () => {
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
  return { getHooks }
});
vi.mock('../hooks/HooksBase', () => {
  const hooksBase = {
    store: {},
    setStore: function (store) {
      this.store = store;
    },
    baseDispatch: () => { },
    setBaseDispatch: function (dispatch) {
      this.baseDispatch = dispatch;
    },
  };
  const getHooksBase = () => hooksBase;
  return { getHooksBase }
});
vi.mock("./feature-flags.json", () => {
  return { default: {
    "ENABLE_ENTRA_SSO": {
      "local": false,
      "dev": false,
      "uat": false,
      "pre-prod": false,
      "prod": false
    }
  } }
});

describe("Common Util", () => {
  it("should be true", async () => {
    await waitFor();
    await waitFor(500);
    let data = getJWTPayload(token)
    expect(data).toBeDefined();
    expect(data.sub).toBe("1243644");
    data = getJWTPayload("");
    expect(data).toBeDefined();
    expect(data).toBe("");

    storeData("a", "b");
    clearLocalStorage(() => { });
    clearLocalStorage(() => { }, [ActionType.SET_THEME]);
    clearLocalStorage();
    clearStorageWhenLogout(() => { });
    const id = uuidv4();
    expect(id).toMatch(/^[0-9a-f-]{36}$/i);
    showErrorMsg("error");
    show_error_msg("error");
    const devSurvey = "https://surveys.sc.com/jfe/preview/previewId/b35e7b90-467e-473f-9ff3-8b6a099569d5/SV_cUVyvBdVELMVr02?Q_CHL=preview&Q_SurveyVersionID=current";
    const prodSurvey = "https://surveys.sc.com/jfe/form/SV_cUVyvBdVELMVr02"

    let env = getEnv();
    expect(env).toBe("LOCAL");
    let ssolink = getSSOLink();
    expect(ssolink).toBe("https://test-mfaintig-stg.51318.app.standardchartered.com:443/openam/oauth2/realms/root/realms/sso/authorize?client_id=51358ratan&redirect_uri=https://fmo-mfe-dev.uk.dev.net:8453/mfa/callback&response_type=code");
    expect(getSurveyLink()).toBe(devSurvey);
    getWindowOpen()("https://axess.sc.net/survey/0uhx", "survey");

    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        hostname: "fmo-mfe-dev.uk.dev.net"
      },
      writable: true
    });
    env = getEnv();
    expect(env).toBe("DEV");
    ssolink = getSSOLink();
    expect(ssolink).toBe("https://test-mfaintig-stg.51318.app.standardchartered.com:443/openam/oauth2/realms/root/realms/sso/authorize?client_id=51358ratan&redirect_uri=https://fmo-mfe-dev.uk.dev.net:8453/mfa/callback&response_type=code");
    expect(`${getLocation().hostname}`).toBe("fmo-mfe-dev.uk.dev.net");
    expect(getSurveyLink()).toBe(devSurvey);


    Object.defineProperty(window, 'location', {
      value: {
        hostname: "fmo-mfe.uk.dev.net"
      },
      writable: true
    });
    env = getEnv();
    expect(env).toBe("UAT");
    ssolink = getSSOLink();
    expect(ssolink).toBe("https://test-mfaintig-stg.51318.app.standardchartered.com:443/openam/oauth2/realms/root/realms/sso/authorize?client_id=51358ratanuat&redirect_uri=https://fmo-mfe.uk.dev.net:8453/mfa/callback&response_type=code");
    expect(`${getLocation().hostname}`).toBe("fmo-mfe.uk.dev.net");
    expect(getSurveyLink()).toBe(devSurvey);

    Object.defineProperty(window, 'location', {
      value: {
        hostname: "uklvadapp1342.uk.dev.net"
      },
      writable: true
    });
    env = getEnv();
    expect(env).toBe("UAT");
    ssolink = getSSOLink();
    expect(ssolink).toBe("https://test-mfaintig-stg.51318.app.standardchartered.com:443/openam/oauth2/realms/root/realms/sso/authorize?client_id=51358ratanuat&redirect_uri=https://fmo-mfe.uk.dev.net:8453/mfa/callback&response_type=code");
    expect(`${getLocation().hostname}`).toBe("uklvadapp1342.uk.dev.net");
    expect(getSurveyLink()).toBe(devSurvey);

    Object.defineProperty(window, 'location', {
      value: {
        hostname: "uklvadapp1344.uk.dev.net"
      },
      writable: true
    });
    env = getEnv();
    expect(env).toBe("UAT");
    ssolink = getSSOLink();
    expect(ssolink).toBe("https://test-mfaintig-stg.51318.app.standardchartered.com:443/openam/oauth2/realms/root/realms/sso/authorize?client_id=51358ratanuat&redirect_uri=https://fmo-mfe.uk.dev.net:8453/mfa/callback&response_type=code");
    expect(`${getLocation().hostname}`).toBe("uklvadapp1344.uk.dev.net");
    expect(getSurveyLink()).toBe(devSurvey);

    Object.defineProperty(window, 'location', {
      value: {
      hostname: "uklvadapp1346.uk.dev.net"
      },
      writable: true
    });
    env = getEnv();
    expect(env).toBe("UAT");
    ssolink = getSSOLink();
    expect(ssolink).toBe("https://test-mfaintig-stg.51318.app.standardchartered.com:443/openam/oauth2/realms/root/realms/sso/authorize?client_id=51358ratanuat&redirect_uri=https://fmo-mfe.uk.dev.net:8453/mfa/callback&response_type=code");
    expect(`${getLocation().hostname}`).toBe("uklvadapp1346.uk.dev.net");
    expect(getSurveyLink()).toBe(devSurvey);

    Object.defineProperty(window, 'location', {
      value: {
      hostname: "fmo-mfe-fmrp1.pi.dev.net"
      },
      writable: true
    });
    env = getEnv();
    expect(env).toBe("UAT");
    ssolink = getSSOLink();
    expect(ssolink).toBe("https://test-mfaintig-stg.51318.app.standardchartered.com:443/openam/oauth2/realms/root/realms/sso/authorize?client_id=51358ratanuat&redirect_uri=https://fmo-mfe.uk.dev.net:8453/mfa/callback&response_type=code");
    expect(`${getLocation().hostname}`).toBe("fmo-mfe-fmrp1.pi.dev.net");
    expect(getSurveyLink()).toBe(devSurvey);

    Object.defineProperty(window, 'location', {
      value: {
      hostname: "fmo-mfe-fmrp2.pi.dev.net"
      },
      writable: true
    });
    env = getEnv();
    expect(env).toBe("UAT");
    ssolink = getSSOLink();
    expect(ssolink).toBe("https://test-mfaintig-stg.51318.app.standardchartered.com:443/openam/oauth2/realms/root/realms/sso/authorize?client_id=51358ratanuat&redirect_uri=https://fmo-mfe.uk.dev.net:8453/mfa/callback&response_type=code");
    expect(`${getLocation().hostname}`).toBe("fmo-mfe-fmrp2.pi.dev.net");
    expect(getSurveyLink()).toBe(devSurvey);

    Object.defineProperty(window, 'location', {
      value: {
        hostname: "fmo-mfe-preprod.pi.dev.net"
      },
      writable: true
    });
    env = getEnv();
    expect(env).toBe("PRE-PROD");
    ssolink = getSSOLink();
    expect(ssolink).toBe("https://mfaig.global.standardchartered.com/openam/oauth2/realms/root/realms/sso/authorize?client_id=51358ratan&redirect_uri=https://fmo-mfe.gdc.standardchartered.com:8453/mfa/callback&response_type=code");
    expect(`${getLocation().hostname}`).toBe("fmo-mfe-preprod.pi.dev.net");
    expect(getSurveyLink()).toBe(prodSurvey);

    Object.defineProperty(window, 'location', {
      value: {
        hostname: "fmo-mfe-prod.pi.dev.net"
      },
      writable: true
    });
    env = getEnv();
    expect(env).toBe("PROD");
    ssolink = getSSOLink();
    expect(ssolink).toBe("https://mfaig.global.standardchartered.com/openam/oauth2/realms/root/realms/sso/authorize?client_id=51358ratan&redirect_uri=https://fmo-mfe.gdc.standardchartered.com:8453/mfa/callback&response_type=code");
    expect(`${getLocation().hostname}`).toBe("fmo-mfe-prod.pi.dev.net");
    expect(getSurveyLink()).toBe(prodSurvey);

    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        hostname: "ratan-aws-sit-ns4-fmo-mfe.ir.standardchartered.com"
      },
      writable: true
    });
    env = getEnv();
    expect(env).toBe("SIT");
    ssolink = getSSOLink();
    expect(ssolink).toBe("https://test-mfaintig-stg.51318.app.standardchartered.com:443/openam/oauth2/realms/root/realms/sso/authorize?client_id=51358ratan&redirect_uri=https://fmo-mfe-dev.uk.dev.net:8453/mfa/callback&response_type=code");
    expect(`${getLocation().hostname}`).toBe("ratan-aws-sit-ns4-fmo-mfe.ir.standardchartered.com");

    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        hostname: "ratan-aws-app-fmo-mfe.ir.standardchartered.com"
      },
      writable: true
    });
    env = getEnv();
    expect(env).toBe("EKS");
    ssolink = getSSOLink();
    expect(ssolink).toBe("https://test-mfaintig-stg.51318.app.standardchartered.com:443/openam/oauth2/realms/root/realms/sso/authorize?client_id=51358ratan&redirect_uri=https://fmo-mfe-dev.uk.dev.net:8453/mfa/callback&response_type=code");
    expect(`${getLocation().hostname}`).toBe("ratan-aws-app-fmo-mfe.ir.standardchartered.com");

    expect(isNumber("-2")).toBeTruthy();
    expect(isNumber("2")).toBeTruthy();
    expect(isNumber("0.2")).toBeTruthy();
    expect(isNumber("time")).toBeFalsy();
    expect(isNumber("")).toBeFalsy();
    expect(isNumber(undefined)).toBeFalsy();
    expect(isNumber(null)).toBeFalsy();



    const now = new Date();

    expect(isDate(now.toDateString())).toBeTruthy();
    expect(isDate(now.toLocaleDateString())).toBeTruthy();
    expect(isDate(now.toISOString())).toBeTruthy();
    expect(isDate(now.getTime())).toBeTruthy();
    expect(isDate("Mon Mar 20 2023 11:45:39 GMT+0800 (Singapore Standard Time)")).toBeTruthy();
    expect(isDate("0.2")).toBeFalsy();
    expect(isDate("time")).toBeFalsy();
    expect(isDate(`-${now.getTime()}`)).toBeFalsy();
    expect(isDate("2020-06-17T03:04:13Z")).toBeTruthy();
    expect(isDate("2020-02-02")).toBeTruthy();
    expect(isDate("1234567890")).toBeFalsy();
    expect(isDate("123456789012a")).toBeFalsy();

    expect(isValidationToFormateDate(now.toDateString())).toBeFalsy();
    expect(isValidationToFormateDate(now.toLocaleDateString())).toBeFalsy();
    expect(isValidationToFormateDate(now.toISOString())).toBeTruthy();
    expect(isValidationToFormateDate(now.getTime())).toBeFalsy();
    expect(isValidationToFormateDate("Mon Mar 20 2023 11:45:39 GMT+0800 (Singapore Standard Time)")).toBeFalsy();
    expect(isValidationToFormateDate("0.2")).toBeFalsy();
    expect(isValidationToFormateDate("time")).toBeFalsy();
    expect(isValidationToFormateDate(`-${now.getTime()}`)).toBeFalsy();
    expect(isValidationToFormateDate("2020-06-17T03:04:13Z")).toBeTruthy();
    expect(isValidationToFormateDate("2020-06-17T03:04:13")).toBeTruthy();
    expect(isValidationToFormateDate("2020-06-17T00:00:00Z")).toBeTruthy();
    expect(isValidationToFormateDate("2020-06-17 03:04:13")).toBeTruthy();
    expect(isValidationToFormateDate("2020-02-02")).toBeFalsy();
    expect(isValidationToFormateDate("1234567890")).toBeFalsy();
    expect(isValidationToFormateDate("123456789012a")).toBeFalsy();

    expect(formatDate(now.getTime(), true)).toBe(dayjs(now.getTime()).format("YYYY MMM DD"));
    expect(formatDate(now.getTime(), false)).not.toBe(dayjs(now.getTime()).format("YYYY-MM-DD HH:mm:ss"));
    expect(formatDate(`${now.getTime()}`, true)).toBe(dayjs(now.getTime()).format("YYYY MMM DD"));
    expect(formatDate(`${now.getTime()}`, false)).not.toBe(dayjs(now.getTime()).format("YYYY-MM-DD HH:mm:ss"));
    expect(formatDate("Mon Mar 20 2023 11:45:39 GMT+0800 (Singapore Standard Time)", true)).toBe("2023 Mar 20");
    expect(formatDate("time", false)).toBe("time");
    expect(formatDate(`-${now.getTime()}`, false)).toBe(`-${now.getTime()}`);
    expect(formatDate("0.2", false)).toBe("0.2");
    expect(formatDate("2020-06-17T03:04:13Z", true)).toBe("2020 Jun 17");
    expect(formatDate("FCS BAC UN+JPM UN+WFC UN 22Mar24", false)).toBe("FCS BAC UN+JPM UN+WFC UN 22Mar24");
    expect(formatDate("Mon Mar 20 2023 11:45:39 GMT+0800 (Singapore Standard Time)", false)).toBe("Mon Mar 20 2023 11:45:39 GMT+0800 (Singapore Standard Time)");
    expect(formatDate("2020-06-17 03:04:13", false)).not.toBe(dayjs(now.getTime()).format("YYYY-MM-DD HH:mm:ss"));
    expect(formatDateToISO(now.getTime(), true)).toBe(dayjs.utc(now.getTime()).format("YYYY MMM DD"));
    expect(formatDateToISO(now.getTime(), false)).not.toBe(dayjs.utc(now.getTime()).format());
    expect(formatDateToISO(`${now.getTime()}`, true)).toBe(dayjs.utc(now.getTime()).format("YYYY MMM DD"));
    expect(formatDateToISO(`${now.getTime()}`, false)).not.toBe(dayjs.utc(now.getTime()).format());
    expect(formatDateToISO("Mon Mar 20 2023 11:45:39 GMT+0800 (Singapore Standard Time)", true)).toBe("2023 Mar 20");
    expect(formatDateToISO("2023-05-17T17:36:38Z", false)).toBe("2023-05-17T17:36:38Z");
    expect(formatDateToISO("0.2", false)).toBe("0.2");
    expect(formatDateToISO("-2", false)).toBe("-2");
    expect(formatDateToISO("time", false)).toBe("time");
    expect(formatDateToISO(`-${now.getTime()}`, false)).toBe(`-${now.getTime()}`);
    expect(formatDateToISO("2020-06-17T03:04:13Z", true)).toBe("2020 Jun 17");
    expect(formatDateToISO("FCS BAC UN+JPM UN+WFC UN 22Mar24", false)).toBe("FCS BAC UN+JPM UN+WFC UN 22Mar24");
    expect(formatDateToISO("Mon Mar 20 2023 11:45:39 GMT+0800 (Singapore Standard Time)", false)).toBe("Mon Mar 20 2023 11:45:39 GMT+0800 (Singapore Standard Time)");
    expect(formatDate("x", true)).toBe("x");

    expect(isEmpty("null")).toBeTruthy();
    expect(isEmpty("")).toBeTruthy();
    expect(isEmpty(undefined)).toBeTruthy();
    expect(isEmpty(null)).toBeTruthy();
    expect(isEmpty("1")).toBeFalsy();
    const response = { "result": "success", "entities": [{ "id": 65, "name": "EMS2", "applicationName": "", "roleId": 66, "roleName": "EMS2_ADMIN", "subjects": [] }, { "id": 11279700, "name": "SSIPLUS", "applicationName": "SSIPLUS", "roleId": 11279756, "roleName": "SSI_SUPER_USER", "subjects": [{ "longName": "/SEARCH", "name": "SEARCH", "id": 11279801, "actions": [{ "name": "WRITE", "id": 11279851, "entitlementId": 11280762 }] }, { "longName": "/STATIC", "name": "STATIC", "id": 11279800, "actions": [{ "name": "WRITE", "id": 11279851, "entitlementId": 11280763 }] }, { "longName": "/VALIDATIONRULES", "name": "VALIDATIONRULES", "id": 11279802, "actions": [{ "name": "WRITE", "id": 11279851, "entitlementId": 11280764 }] }] }] };
    expect(validateTile(undefined, "a", "b")).toBeFalsy();
    expect(validateTile(undefined, undefined, "b")).toBeFalsy();
    expect(validateTile(undefined, undefined, undefined)).toBeFalsy();
    expect(validateTile([], "a", "b")).toBeFalsy();
    expect(validateTile([], ["a"], "b")).toBeFalsy();
    expect(validateTile(response.entities, "SSIPLUS", "b")).toBeFalsy();
    expect(validateTile(response.entities, ["SSIPLUS"], "b")).toBeFalsy();
    expect(validateTile(response.entities, "SSIPLUS", "SEARCH")).toBeTruthy();
    expect(validateTile(response.entities, ["SSIPLUS"], "SEARCH")).toBeTruthy();
    expect(validateTile(response.entities, "X_RATANONE", "RATAN_TRADE_BLOTTER")).toBeFalsy();
    expect(validateTile(response.entities, ["X_RATANONE"], "RATAN_TRADE_BLOTTER")).toBeFalsy();
    const newEntities = [...response.entities, { "id": 1234, "name": "RATAN_TRADE_BLOTTER", "applicationName": "", "roleId": 66, "roleName": "RATAN_TRADE_BLOTTER", "subjects": [] }]
    expect(validateTile(newEntities, "X_RATANONE", "RATAN_TRADE_BLOTTER")).toBeTruthy();
    const TileConfig = [{ "id": 0, "label": "Template", "tiles": [{ "title": "tile1", "pinImage": "", "imageDarkTheme": "http://localhost:8002/0eb22806fa99d395ee45.svg", "imageLightTheme": "http://localhost:8002/307bf3e3e51fa1c01526.svg", "disabled": false, "pinned": false, "container": "@fm/template_container", "module": "/template", "tile": "/tile1", "parameters": { "testId": "123" }, "emailSupport": "khairul.anshar1@sc.com", "isTemplate": true }, { "title": "Modal Example", "pinImage": "", "imageDarkTheme": "http://localhost:8002/13aa097f55f0ec719b1c.svg", "imageLightTheme": "http://localhost:8002/0bbc104086e3307c7e76.svg", "disabled": false, "pinned": false, "container": "@fm/template_container", "module": "/template", "tile": "/tile2", "parameters": { "testId": "123" }, "emailSupport": "khairul.anshar1@sc.com", "isTemplate": true }, { "title": "Date Range Picker Example", "pinImage": "", "imageDarkTheme": "http://localhost:8002/13aa097f55f0ec719b1c.svg", "imageLightTheme": "http://localhost:8002/0bbc104086e3307c7e76.svg", "disabled": false, "pinned": false, "container": "@fm/template_container", "module": "/template", "tile": "/tile3", "parameters": { "testId": "123" }, "emailSupport": "khairul.anshar1@sc.com", "isTemplate": true }, { "title": "Search Block 3 Grid", "pinImage": "", "imageDarkTheme": "http://localhost:8002/13aa097f55f0ec719b1c.svg", "imageLightTheme": "http://localhost:8002/0bbc104086e3307c7e76.svg", "disabled": false, "pinned": false, "container": "@fm/template_container", "module": "/template", "tile": "/tile4", "parameters": { "testId": "123" }, "emailSupport": "khairul.anshar1@sc.com", "isTemplate": true }, { "title": "Search Block 4 Grid", "pinImage": "", "imageDarkTheme": "http://localhost:8002/13aa097f55f0ec719b1c.svg", "imageLightTheme": "http://localhost:8002/0bbc104086e3307c7e76.svg", "disabled": false, "pinned": false, "container": "@fm/template_container", "module": "/template", "tile": "/tile5", "parameters": { "testId": "123" }, "emailSupport": "khairul.anshar1@sc.com", "isTemplate": true }, { "title": "Simple Table", "pinImage": "", "imageDarkTheme": "http://localhost:8002/13aa097f55f0ec719b1c.svg", "imageLightTheme": "http://localhost:8002/0bbc104086e3307c7e76.svg", "disabled": false, "pinned": false, "container": "@fm/template_container", "module": "/template", "tile": "/simpletable", "parameters": { "testId": "123" }, "emailSupport": "khairul.anshar1@sc.com", "isTemplate": true }, { "title": "Grid Tool Table", "pinImage": "", "imageDarkTheme": "http://localhost:8002/13aa097f55f0ec719b1c.svg", "imageLightTheme": "http://localhost:8002/0bbc104086e3307c7e76.svg", "disabled": false, "pinned": false, "container": "@fm/template_container", "module": "/template", "tile": "/gridtooltable", "parameters": { "testId": "123" }, "emailSupport": "khairul.anshar1@sc.com", "isTemplate": true }] }, { "id": 12, "label": "Trade Processing", "tiles": [{ "title": "Trade Blotter", "pinImage": "", "imageDarkTheme": "http://localhost:8002/cb9d3667b70c88434e37.svg", "disabled": false, "pinned": false, "container": "@fm/ratan_container", "module": "/trade_blotter", "tile": "/trade", "emailSupport": "FM_BPMS.SUPPORT@sc.com", "entity": "X_RATANONE", "subject": "RATAN_TRADE_BLOTTER" }] }, { "id": 3, "label": "Settlement", "tiles": [{ "title": "Cashflow Blotter ", "subtitle": "[FX & Equity]", "pinImage": "", "imageDarkTheme": "http://localhost:8002/3d3ad186b0e073dce32c.svg", "imageLightTheme": "http://localhost:8002/a4a3de2b602ec6982256.svg", "disabled": false, "pinned": false, "container": "@fm/ratan_container", "module": "/cashflow_blotter", "tile": "/cashflow_bau", "emailSupport": "FM_BPMS.SUPPORT@sc.com", "entity": "X_RATANONE", "subject": "RATAN_CASHFLOW_BLOTTER" }, { "title": "Cashflow Blotter", "pinImage": "", "imageDarkTheme": "http://localhost:8002/571302f67851ef1e804c.svg", "imageLightTheme": "http://localhost:8002/abb693aeda4f322d54a8.svg", "disabled": false, "pinned": false, "container": "@fm/ratan_container", "module": "/cashflow_blotter_cn", "tile": "/cashflow_cn", "emailSupport": "FM_BPMS.SUPPORT@sc.com", "entity": "X_RATANONE", "subject": "RATAN_STRATEGIC_CASHFLOW_BLOTTER" }, { "title": "Grouping Blotter", "pinImage": "", "imageDarkTheme": "http://localhost:8002/3d3ad186b0e073dce32c.svg", "imageLightTheme": "http://localhost:8002/a4a3de2b602ec6982256.svg", "disabled": false, "pinned": false, "container": "@fm/ratan_container", "module": "/cashflow_blotter_cn", "tile": "/cashflow_group_management", "emailSupport": "FM_BPMS.SUPPORT@sc.com", "entity": "X_RATANONE", "subject": "RATAN_CASHFLOW_GROUP_BLOTTER" }] }, { "id": 8, "label": "Exception Management", "tiles": [{ "title": "Validation Exceptions", "pinImage": "", "imageDarkTheme": "http://localhost:8002/f5923304e7855aba3101.svg", "imageLightTheme": "http://localhost:8002/fce8f0cd6ec14d9b276a.svg", "disabled": false, "pinned": false, "container": "@fm/ratan_container", "module": "/exceptions_blotter", "tile": "/validation", "emailSupport": "FM_BPMS.SUPPORT@sc.com", "entity": "X_RATANONE", "subject": "RATAN_VALIDATION_EXCEPTION" }, { "title": "Settlement Exceptions", "pinImage": "", "imageDarkTheme": "http://localhost:8002/90b42106fd6350bc74ff.svg", "imageLightTheme": "http://localhost:8002/8b930f3d44fd877a0bea.svg", "disabled": false, "pinned": false, "container": "@fm/ratan_container", "module": "/exceptions_blotter", "tile": "/settlement", "emailSupport": "FM_BPMS.SUPPORT@sc.com", "entity": "X_RATANONE", "subject": "RATAN_SETTLEMENT_EXCEPTION" }] }, { "id": 7, "label": "Business Rule", "tiles": [{ "title": "Authorization Limits", "pinImage": "", "imageDarkTheme": "http://localhost:8002/43383459d95dd19b892a.svg", "imageLightTheme": "http://localhost:8002/94720ddfa3e143608924.svg", "disabled": false, "pinned": false, "container": "@fm/ratan_container", "module": "/authorization_limits_container", "tile": "/authorization_limits", "emailSupport": "FM_BPMS.SUPPORT@sc.com", "entity": "X_RATANONE", "subject": "RATAN_PROFILE_LIMITS" }, { "title": "Settlement NSTP Rules", "subtitle": "New", "pinImage": "", "imageDarkTheme": "http://localhost:8002/440e650ae3d6a2d7b8f1.svg", "imageLightTheme": "http://localhost:8002/23438cf08c40a6137164.svg", "disabled": false, "pinned": false, "container": "@fm/ratan_container", "module": "/rules_blotter", "tile": "/new_nstp_rules", "emailSupport": "FM_BPMS.SUPPORT@sc.com", "entity": "X_RATANONE", "subject": "RATAN_SETTLEMENT_STP_RULE" }, { "title": "Settlement NSTP Rules", "subtitle": "[FX & Equity]", "pinImage": "", "imageDarkTheme": "http://localhost:8002/440e650ae3d6a2d7b8f1.svg", "imageLightTheme": "http://localhost:8002/23438cf08c40a6137164.svg", "disabled": false, "pinned": false, "container": "@fm/ratan_container", "module": "/rules_blotter", "tile": "/settlement_nstp_rules", "emailSupport": "FM_BPMS.SUPPORT@sc.com", "entity": "X_RATANONE", "subject": "RATAN_SETTLEMENT_STP_RULE" }, { "title": "Suppression Rules", "pinImage": "", "imageDarkTheme": "http://localhost:8002/822664ca20b06a043904.svg", "imageLightTheme": "http://localhost:8002/822664ca20b06a043904.svg", "disabled": false, "pinned": false, "container": "@fm/ratan_container", "module": "/rules_blotter", "tile": "/suppression_rules", "emailSupport": "FM_BPMS.SUPPORT@sc.com", "entity": "X_RATANONE", "subject": "RATAN_SUPPRESSION_RULE" }, { "title": "Suppression Rules", "subtitle": "[Swift]", "pinImage": "", "imageDarkTheme": "http://localhost:8002/822664ca20b06a043904.svg", "imageLightTheme": "http://localhost:8002/822664ca20b06a043904.svg", "disabled": false, "pinned": false, "container": "@fm/ratan_container", "module": "/rules_blotter", "tile": "/swift_suppression_rules", "emailSupport": "FM_BPMS.SUPPORT@sc.com", "entity": "X_RATANONE", "subject": "RATAN_SUPPRESSION_RULE" }, { "title": "Suppression Rules", "subtitle": "[Cashflow]", "pinImage": "", "imageDarkTheme": "http://localhost:8002/822664ca20b06a043904.svg", "imageLightTheme": "http://localhost:8002/822664ca20b06a043904.svg", "disabled": false, "pinned": false, "container": "@fm/ratan_container", "module": "/rules_blotter", "tile": "/cashflow_suppression_rules", "emailSupport": "FM_BPMS.SUPPORT@sc.com", "entity": "X_RATANONE", "subject": "RATAN_SUPPRESSION_RULE" }, { "title": "Auto Netting Rules", "pinImage": "", "imageDarkTheme": "http://localhost:8002/b5a77c811546ffaed4ac.svg", "imageLightTheme": "http://localhost:8002/b5a77c811546ffaed4ac.svg", "disabled": false, "pinned": false, "container": "@fm/ratan_container", "module": "/rules_blotter", "tile": "/netting_rules", "emailSupport": "FM_BPMS.SUPPORT@sc.com", "entity": "X_RATANONE", "subject": "RATAN_NETTING_RULE" }] }, { "id": 11, "label": "Static", "tiles": [{ "title": "Netting Static", "pinImage": "", "imageDarkTheme": "http://localhost:8002/440e650ae3d6a2d7b8f1.svg", "imageLightTheme": "http://localhost:8002/23438cf08c40a6137164.svg", "disabled": false, "pinned": false, "container": "@fm/ratan_container", "module": "/rules_blotter", "tile": "/new_netting_rules", "emailSupport": "FM_BPMS.SUPPORT@sc.com", "entity": "X_RATANONE", "subject": "RATAN_NETTING_RULE" }, { "title": "Nostro Static", "subtitle": "", "pinImage": "", "imageDarkTheme": "http://localhost:8002/440e650ae3d6a2d7b8f1.svg", "imageLightTheme": "http://localhost:8002/23438cf08c40a6137164.svg", "disabled": false, "pinned": false, "container": "@fm/ratan_container", "module": "/nostro_static_container", "tile": "/nostro_static", "emailSupport": "FM_BPMS.SUPPORT@sc.com", "entity": "X_RATANONE", "subject": "RATAN_NOSTRO_BLOTTER" }] }, { "id": 2, "label": "CDUPS", "tiles": [{ "title": "Inbound Details", "pinImage": "", "imageDarkTheme": "http://localhost:8002/3eccbb9976cf7ac84eed.svg", "imageLightTheme": "http://localhost:8002/dc38d4aec3225abfb4bd.svg", "disabled": false, "pinned": false, "container": "@fm/cdups_container", "module": "/cdups-main", "tile": "/inbound", "emailSupport": "CDU_Platform_Services-Core@exchange.standardchartered.com", "entity": "CDUPS", "subject": "inbounddocs.view" }] }, { "id": 0, "label": "FSS SERVICES", "tiles": [{ "title": "Payment Processing", "pinImage": "", "imageDarkTheme": "http://localhost:8002/0eb22806fa99d395ee45.svg", "imageLightTheme": "http://localhost:8002/307bf3e3e51fa1c01526.svg", "disabled": false, "pinned": false, "container": "@fm/mfe_fssservices_container", "module": "/mfe_fssservices_tiles", "tile": "/tile1", "parameters": { "testId": "123" }, "emailSupport": "FM_BPMS.SUPPORT@sc.com", "entity": "FSS_PAYMENTS_SERVICES_TH", "subject": "FSS Payments Services" }] }, { "id": 0, "label": "SSI plus", "tiles": [{ "title": "Search", "pinImage": "", "imageDarkTheme": "http://localhost:8002/0eb22806fa99d395ee45.svg", "imageLightTheme": "http://localhost:8002/307bf3e3e51fa1c01526.svg", "disabled": false, "pinned": false, "container": "@fm/ssi_container", "module": "/ssi", "tile": "/search", "parameters": { "testId": "123" }, "emailSupport": "FM-TPT-JavaX-Studio@exchange.standardchartered.com", "entity": "SSIPLUS", "subject": "SEARCH" }, { "title": "Static", "pinImage": "", "imageDarkTheme": "http://localhost:8002/13aa097f55f0ec719b1c.svg", "imageLightTheme": "http://localhost:8002/0bbc104086e3307c7e76.svg", "disabled": false, "pinned": false, "container": "@fm/ssi_container", "module": "/ssi", "tile": "/static", "parameters": { "testId": "123" }, "emailSupport": "FM-TPT-JavaX-Studio@exchange.standardchartered.com", "entity": "SSIPLUS", "subject": "STATIC" }, { "title": "Validation rules and Market filter set", "pinImage": "", "imageDarkTheme": "http://localhost:8002/13aa097f55f0ec719b1c.svg", "imageLightTheme": "http://localhost:8002/0bbc104086e3307c7e76.svg", "disabled": false, "pinned": false, "container": "@fm/ssi_container", "module": "/ssi", "tile": "/validationrules", "emailSupport": "FM-TPT-JavaX-Studio@exchange.standardchartered.com", "entity": "SSIPLUS", "subject": "VALIDATIONRULES" }, { "title": "Work Queues", "pinImage": "", "imageDarkTheme": "http://localhost:8002/13aa097f55f0ec719b1c.svg", "imageLightTheme": "http://localhost:8002/0bbc104086e3307c7e76.svg", "disabled": false, "pinned": false, "container": "@fm/ssi_container", "module": "/ssi", "tile": "/queues", "emailSupport": "FM-TPT-JavaX-Studio@exchange.standardchartered.com", "entity": "SSIPLUS", "subject": "WORKQUEUE" }] }]
    expect(validateWorkspace([], response.entities, TileConfig)).toEqual([
      expect.objectContaining({
        label: "Workspace 1",
        isActive: false,
        containers: [],
      }),
    ]);
    const workspaces = [{ "id": "fe847e91-351f-4183-9cdf-ee2c990eeca9", "label": "Modal Example ", "isLoaded": false, "isActive": false, "containers": [{ "id": "532a0821-e595-4188-b4d8-f005643b9cb5", "container": "@fm/template_container", "module": "/template", "tile": "/tile2", "title": "Modal Example ", "emailSupport": "khairul.anshar1@sc.com", "panelId": "", "tabId": "", "parameters": { "testId": "123" } }] }, { "id": "b62dd41a-3e82-4ca1-a0b3-3e2c0ad74dbc", "label": "Trade Blotter ", "isLoaded": true, "isActive": false, "containers": [{ "id": "4989d331-4eae-4689-93cb-429659517320", "container": "@fm/ratan_container", "module": "/trade_blotter", "tile": "/trade", "title": "Trade Blotter ", "emailSupport": "FM_BPMS.SUPPORT@sc.com", "panelId": "", "tabId": "" }] }, { "id": "25f9fa88-1940-4fc8-92b3-998f7864052e", "label": "Workspace 3", "isLoaded": true, "isActive": false, "containers": [] }]
    expect(validateWorkspace(workspaces, response.entities, TileConfig)).toEqual([workspaces[0], workspaces[2]]);
    expect(validateWorkspace(workspaces, newEntities, TileConfig)).toEqual(workspaces);
    expect(aOrb('a', 'b')).toEqual('a');
    expect(aOrb(undefined, 'b')).toEqual('b');
    expect(aOrb('a', undefined)).toEqual('a');
    expect(aOrb(0, 1)).toEqual(0);
    expect(aOrb(1, 0)).toEqual(1);
    const date = dayjs.utc(now.getTime());
    expect(getDate(date)).toEqual(date.format("YYYY MMM DD"));
    expect(getDate(undefined)).toEqual("");
    vi.spyOn(dayjs, 'utc').mockImplementationOnce((_t) => {
      throw new Error();
    });
    expect(formatDateToISO("2020-06-17T03:04:13Z", true)).toBe("2020-06-17T03:04:13Z");
  });
});

describe("getTenantId & getClientId", () => {
  it("should return NON_PROD ids when getEnv returns non-PROD", () => {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        hostname: "fmo-mfe-dev.uk.dev.net"
      },
      writable: true
    });
    
    expect(getTenantId()).toBe("cd823f6b-31c5-4241-b504-3707cbc03fb7");
    expect(getClientId()).toBe("80c8b904-1b64-443b-a651-7548764d534d");
  });

  it("should return PROD ids when env is 'PROD'", () => {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        hostname: "fmo-mfe.gdc.standardchartered.com"
      },
      writable: true
    });
    
    expect(getTenantId()).toBe("b44900f1-2def-4c3b-9ec6-9020d604e19e");
    expect(getClientId()).toBe("fd99d1e8-e543-4345-b5f0-208c94ffd39a");
  });
});

describe("getEntraSSOLink", () => {
  it("should return correct SSO link for NON-LOCAL env", () => {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        hostname: "fmo-mfe-prod.pi.dev.net",
        origin: "https://fmo-mfe-prod.pi.dev.net:8453"
      },
      writable: true
    });

    const callback = "https://fmo-mfe-prod.pi.dev.net:8453/mfa/callback";
    const expected = `https://login.microsoftonline.com/b44900f1-2def-4c3b-9ec6-9020d604e19e/oauth2/v2.0/authorize?client_id=fd99d1e8-e543-4345-b5f0-208c94ffd39a&response_type=code&redirect_uri=${callback}&response_mode=query&scope=openid+profile+offline_access+email`;
    expect(getEntraSSOLink()).toBe(expected);
  });

  it("should return correct SSO link for PROD env", () => {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        hostname: "fmo-mfe.gdc.standardchartered.com",
        origin: "https://fmo-mfe.gdc.standardchartered.com:8453"
      },
      writable: true
    });

    const expected = `https://login.microsoftonline.com/b44900f1-2def-4c3b-9ec6-9020d604e19e/oauth2/v2.0/authorize?client_id=fd99d1e8-e543-4345-b5f0-208c94ffd39a&response_type=code&redirect_uri=https://fmo-mfe.gdc.standardchartered.com:8453/mfa/callback&response_mode=query&scope=openid+profile+offline_access+email`;
    expect(getEntraSSOLink()).toBe(expected);
  });
});

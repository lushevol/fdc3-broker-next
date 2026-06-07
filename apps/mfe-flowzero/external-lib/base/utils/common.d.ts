import { Entity } from "../hooks/model/root";
import { ActionType, IAction } from "../hooks/reducer/util/ActionType";
export declare const getLocalStorage: () => Storage;
export declare const getWindowOpen: () => Window["open"];
export declare const getSessionStorage: () => Storage;
export interface JWTPayload {
  exp?: number;
  iat?: number;
  entitlements?: string;
  sub?: string;
  date?: unknown;
}
export declare const getJWTPayload: (token: string) => JWTPayload | "";
export declare const storeData: (key: string, data: string) => void;
export declare const clearLocalStorage: (
  dispacth?: any,
  actionTypes?: ActionType[]
) => void;
export declare const clearStorageWhenLogout: (
  dispacth: React.Dispatch<IAction>
) => void;
export declare const uuidv4: () => string;
export declare const showErrorMsg: (errorMsg: string) => void;
export declare const show_error_msg: (errorMsg: string) => void;
export declare const getHostName: () => string;
export declare const getLocation: () => Location;
export declare const getSurveyLink: () => string;
export declare const getEnv: () =>
  | "PROD"
  | "PRE-PROD"
  | "LOCAL"
  | "DEV"
  | "UAT"
  | "EKS"
  | "SIT";
export declare const getSSOLink: () =>
  | "https://sitigmfa.hk.standardchartered.com:8443/openam/oauth2/realms/root/realms/sso/authorize?client_id=51358ratan&redirect_uri=https://fmo-mfe-dev.uk.dev.net:8453/mfa/callback&response_type=code"
  | "https://sitigmfa.hk.standardchartered.com:8443/openam/oauth2/realms/root/realms/sso/authorize?client_id=51358ratanuat&redirect_uri=https://fmo-mfe.uk.dev.net:8453/mfa/callback&response_type=code"
  | "https://mfaig.global.standardchartered.com/openam/oauth2/realms/root/realms/sso/authorize?client_id=51358ratan&redirect_uri=https://fmo-mfe.gdc.standardchartered.com:8453/mfa/callback&response_type=code";
export declare const isNumber: (val: any) => any;
export declare const isDate: (val: any) => boolean;
export declare const isValidationToFormateDate: (val: any) => boolean;
export declare const formatDate: (time: any, isAccurateToDay: boolean) => any;
export declare const formatDateToISO: (
  time: any,
  isAccurateToDay: boolean
) => any;
export declare const isEmpty: (value: any) => boolean;
export declare const getDate: (date: any) => any;
export declare const validateTile: (
  entities: Entity[] | [] | undefined,
  entity: string | string[] | undefined,
  subject: string | undefined
) => boolean;
export declare const validateWorkspace: (
  workspaces: any,
  entities: any,
  drawers: any
) => any;
export declare const waitFor: (time?: number) => Promise<unknown>;
export declare const aOrb: (a: any, b: any) => any;

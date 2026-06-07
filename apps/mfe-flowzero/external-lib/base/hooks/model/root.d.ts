/// <reference types="react" />
import { Workspace } from "./workspaces";
export interface ErrorProps extends ComponentPropsDefault {
  emailSupport?: string;
}
export interface ComponentPropsDefault {
  children?: React.ReactNode;
}
export interface ErrorState {
  hasError: boolean;
  error?: Error;
  emailSupport?: string;
}
export interface OUD {
  userId?: string;
  emailId?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  fullName?: string;
  description?: string;
  title?: string;
  cn?: string;
}
export interface User {
  sub?: string;
  id?: string;
  name?: string;
  userId?: string;
  emailId?: string;
  entitlements?: Record<string, Record<string, string[]>>;
  entitlement?:  Record<string, unknown>;
  firstName?: string;
  lastName?: string;
  country?: string;
  fullName?: string;
  oud?: OUD;
  auth_time?: number;
}
export interface Action {
  name: string;
  id: number;
  entitlementId: number;
}
export interface Subject {
  name: string;
  id: number;
  actions: Action[];
  longName?: string;
}
export interface Entity {
  id: number;
  name: string;
  applicationName: string;
  roleId: number;
  roleName: string;
  subjects: Subject[];
}
export interface Tile {
  title: string;
  subtitle?: string;
  pinImage?: string;
  imageDarkTheme: string;
  imageLightTheme?: string;
  disabled?: boolean;
  pinned?: boolean;
  container: string;
  module: string;
  tile: string;
  parameters?: Object;
  emailSupport: string;
  entity?: string[];
  subject?: string;
  isTemplate?: boolean;
  leftPosition?: string;
  topPossition?: string;
  id?: number;
}
export interface Tiles {
  id: number;
  label: string;
  tiles: Tile[] | [];
}
export interface SsePayload {
  id: string;
  topic: string;
  data: string;
  comment: string;
}
export interface RootModel {
  user?: User;
  token?: string;
  refreshToken?: string;
  errorMsg?: string;
  isLoading?: boolean;
  theme?: string;
  isOpenFin?: boolean;
  expiredIn?: number;
  iat?: number;
  userLoginTime?: Date;
  clientBus?: any;
  workspaces?: Workspace[] | [];
  currentWorkspace?: Workspace;
  drawer?: boolean;
  timeType?: string;
  entities?: Entity[] | [];
  refreshTab?: object;
  sseCallback?: object;
  ssePayload?: SsePayload[];
  entitlementsToken?: string;
  workspace?: Workspace;
  isOnLogout?: boolean;
  drawers?: Tiles[] | [];
  rootVersion?: string;
}
export interface ProviderPropsDefault extends ComponentPropsDefault {
  data?: RootModel;
}
export declare const initialData: RootModel;

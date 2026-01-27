import { getLocalStorage } from '../../utils/common';
import { ActionType } from '../reducer/util/ActionType';
import { firstWorkspace, type Workspace } from './workspaces';

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
  entitlements?: object;
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
  tiles: Tile[];
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
  workspaces?: Workspace[];
  currentWorkspace?: Workspace;
  drawer?: boolean;
  timeType?: string;
  entities?: Entity[];
  refreshTab?: object;
  sseCallback?: object;
  ssePayload?: SsePayload[];
  entitlementsToken?: string;
  workspace?: Workspace;
  isOnLogout?: boolean;
  drawers?: Tiles[];
  rootVersion?: string;
}

export interface ProviderPropsDefault extends ComponentPropsDefault {
  data?: RootModel;
}

const workspacesDefault = getLocalStorage().getItem(ActionType.SET_WORKSPACES)
  ? JSON.parse(getLocalStorage().getItem(ActionType.SET_WORKSPACES) || 'null')
  : [firstWorkspace()];

const entities: Entity[] = getLocalStorage().getItem(ActionType.SET_ENTITIES)
  ? JSON.parse(getLocalStorage().getItem(ActionType.SET_ENTITIES) || 'null')
  : [];

export const initialData: RootModel = {
  user: getLocalStorage().getItem(ActionType.SET_USER)
    ? JSON.parse(getLocalStorage().getItem(ActionType.SET_USER) || 'null')
    : undefined,
  token: getLocalStorage().getItem(ActionType.SET_TOKEN) ?? undefined,
  errorMsg: undefined,
  isLoading: true,
  theme: getLocalStorage().getItem(ActionType.SET_THEME) ?? 'dark',
  isOpenFin: false,
  expiredIn: 0,
  userLoginTime: undefined,
  iat: 0,
  clientBus: undefined,
  workspaces: workspacesDefault,
  currentWorkspace: workspacesDefault[0],
  drawer: false,
  timeType: getLocalStorage().getItem(ActionType.SET_TIME_TYPE) ?? 'utc',
  entities: entities,
  refreshTab: {},
  refreshToken: undefined,
  sseCallback: {},
  ssePayload: [],
  entitlementsToken: undefined,
  isOnLogout: false,
  drawers: [],
  rootVersion: '',
};

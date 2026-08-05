
export interface FORM_DATA_TYPE {
  [key: string]: any;
}

export interface INVALID_COMPONENT {
  label: string;
  type: string;
  id: string;
  stepId?: string;
}

export interface ERROR_MESSAGES {
  [key: string]: string;
}

enum COMPONENT_TYPES {
  'input' = 'input', 
  'selection' = 'selection', 
  'presentation' = 'presentation', 
  'containers' = 'containers', 
  'action' = 'action', 
  'custom' = 'custom',
}

export type ELEMENT = {
  name?: string;
  path?: string;
  properties?: object;
}

export type SETTING_ITEM = {
  type: string;
  options?: OPTION_ITEM[];
  label?: string;
  category?: string;
  className?: string;
  conditions?: {
    arg: string;
    eq: string;
  },
  bindingKey?: string; 
  opposite?: boolean;
  optionsLabel?: OPTION_ITEM[];
  placeholder?: string;
}

type OPTION_ITEM = {
  label: string;
  value: string;
}

export type SETTINGS = {
  [key: string]: any;
}

export type STYLES = {
  [key: string]: string;
}

export type EDIT_PROPERTIES = {
  [key: string]: string[];
}

export type CUSTOM_COMPONENT = {
  type?: string;
  id: string;
  element?: ELEMENT;
  icon?: string;
  label?: string;
  settings?: object;
  origin?: string;
  path?: string;
  name?: string;
}

export type CUSTOM_RULE = {
  type: string;
  dataSource?: string;
}

export interface COMMENT_USER {
  bankdid: string;
  name: string;
  avatarUrl?: string;
}
export interface COMMENT_REPLIES {
  id: string;
  text: string;
  createdAt: string;
  user: COMMENT_USER;
  parentID: string;
  likes: number;
  likedByCurrentUser: boolean;
  replies: any[];
}
export interface COMMENT_DATA {
  cid: string;
  id: string;
  text: string;
  createdAt: string;
  user: COMMENT_USER;
  replies: COMMENT_REPLIES;
}
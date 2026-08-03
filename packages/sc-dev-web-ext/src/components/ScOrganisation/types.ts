
export type TEAM_CONNECTION_TYPE = {
  open: boolean;
  label: string;
}

export type ORG_ROLE_TYPE = {
  type: string;
  id?: string;
  name?: string;
  title?: string;
  location?: string;
  connection?: TEAM_CONNECTION_TYPE;
  roles: ORG_ROLE_TYPE[];
  department?: string;
  customCard?: any;
  customFields?: any;
  email?: string;
  phone?: string;
  icon?: string;
}

export type CUSTOM_FIELD_TYPE = {
  icon?: string;
  text: any;
}
import { ApiStatus } from "src/@types/apiStatus";

export interface RootModel {
  apiStatus?: {
    displayStatusIds?: string[];
    data?: ApiStatus;
  };
  versionState?: VersionType;
  refreshState?: number;
}
export const initApiStatus = {
  SSI_PLUS_QUERY: undefined,
  Ratan_Exception_Query: undefined,
  TDS3_Cashflow_Query: undefined,
  TDS3_Trade_Query: undefined,
  DQSL_Counterparty_Query_V2: undefined,
};

const initVersion = {
  version: undefined,
  env: undefined,
};

export interface VersionType {
  version?: string;
  env?: string;
}
export const initialData: RootModel = {
  apiStatus: {
    displayStatusIds: [],
    data: { ...initApiStatus },
  },
  versionState: { ...initVersion },
  refreshState: 0,
};
export interface ComponentPropsDefault {
  children?: React.ReactNode;
}
export interface ProviderPropsDefault extends ComponentPropsDefault {
  data?: RootModel;
}

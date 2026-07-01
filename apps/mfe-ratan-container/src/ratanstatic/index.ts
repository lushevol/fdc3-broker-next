import cashflowConfig from "./ratanConfig/local/cashflowConfig.json";
import cashflowDetailsConfig from "./ratanConfig/local/cashflowDetailsConfig.json";
import cashflowQuickSearchConfig from "./ratanConfig/local/cashflowQuickSearchConfig.json";
import exceptionConfig from "./ratanConfig/local/exceptionConfig.json";
import tradesConfig from "./ratanConfig/local/tradesConfig.json";
import tradesDetailsConfig from "./ratanConfig/local/tradeDetailsConfig.json";
import tradesQuickSearchConfig from "./ratanConfig/local/tradesQuickSearchConfig.json";
import cashflowConfig_PROD from "./ratanConfig/production/cashflowConfig.json";
import cashflowDetailsConfig_PROD from "./ratanConfig/production/cashflowDetailsConfig.json";
import cashflowQuickSearchConfig_PROD from "./ratanConfig/production/cashflowQuickSearchConfig.json";
import exceptionConfig_PROD from "./ratanConfig/production/exceptionConfig.json";
import tradesConfig_PROD from "./ratanConfig/production/tradesConfig.json";
import tradesDetailsConfig_PROD from "./ratanConfig/production/tradeDetailsConfig.json";
import tradesQuickSearchConfig_PROD from "./ratanConfig/production/tradesQuickSearchConfig.json";
import serverConfig_LOCAL from "./ratanConfig/local/ratanConfig.json";
import serverConfig_DEV from "./ratanConfig/dev/ratanConfig.json";
import serverConfig_UAT from "./ratanConfig/uat/ratanConfig.json";
import serverConfig_PROD from "./ratanConfig/production/ratanConfig.json";
import { CommonUtil } from "../Root/import";

declare global {
  export interface Window {
    ratanConfig: any;
  }
}
export const getHost = () => {
  const { location } = window;
  const { host } = location;
  return host;
};
export const geProtocol = () => {
  const { location } = window;
  const { protocol } = location;
  return protocol;
};
export const getProtocolWs = () => {
  return geProtocol() === "http:" ? "ws:" : "wss:";
};

const dynamicSetServerConfig = () => {
  const env = CommonUtil.getEnv();
  switch (env?.toLowerCase()) {
    case "local":
      return serverConfig_LOCAL;

    case "dev":
      return serverConfig_DEV;

    case "uat":
      return serverConfig_UAT;

    case "pre-prod":
      return serverConfig_PROD;

    case "prod":
      return serverConfig_PROD;

    case "sit":
      return serverConfig_UAT;

    case "eks":
      return serverConfig_UAT;
    default:
      return {};
  }
};

const dynamicSetFieldConfig = () => {
  const env = CommonUtil.getEnv();
  let config = {
    cashflow: {
      ...cashflowConfig_PROD,
      ...cashflowDetailsConfig_PROD,
      ...cashflowQuickSearchConfig_PROD,
    },
    exception: {
      ...exceptionConfig_PROD,
    },
    trades: {
      ...tradesConfig_PROD,
      ...tradesDetailsConfig_PROD,
      ...tradesQuickSearchConfig_PROD,
    },
  };
  if (!["PROD", "PRE-PROD"].includes(CommonUtil.getEnv())) {
    config = Object.assign({}, config, {
      cashflow: {
        ...cashflowConfig,
        ...cashflowDetailsConfig,
        ...cashflowQuickSearchConfig,
      },
      exception: {
        ...exceptionConfig,
      },
      trades: {
        ...tradesConfig,
        ...tradesDetailsConfig,
        ...tradesQuickSearchConfig,
      },
    });
  }
  return config;
};

const wsprotocol = getProtocolWs();
const host_ = getHost();
const serverConfig = {
  REACT_APP_SERVER_ENV: "production",
  REACT_APP_API_URL_MOCK: `${getProtocolWs()}//${host_}`,
  REACT_APP_SOCKET_URL_TRADES: `${wsprotocol}//${host_}`,
  REACT_APP_SOCKET_URL_EXCEPTIONS: `${wsprotocol}//${host_}`,
  REACT_APP_SOCKET_URL_CASHFLOW: `${wsprotocol}//${host_}`,
  REACT_APP_SOCKET_URL_SUB_STATUS: `${wsprotocol}//${host_}`,
  disabledFeature: [],
  ...dynamicSetServerConfig(),
};

window.ratanConfig = {
  ...serverConfig,
  ...dynamicSetFieldConfig(),
};

export default window.ratanConfig;

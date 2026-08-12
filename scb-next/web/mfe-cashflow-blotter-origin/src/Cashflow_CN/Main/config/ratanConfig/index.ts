/**
 * This whole ratanConfig folder is moved from ratan-container to cn cashflow to reduce the dependence on container.
 */
import { CommonUtil } from "src/Root/import";

import cashflowConfig from "./local/cashflowConfig";
import cashflowDetailsConfig from "./local/cashflowDetailsConfig";
import cashflowQuickSearchConfig from "./local/cashflowQuickSearchConfig";
import cashflowConfig_PROD from "./production/cashflowConfig";
import cashflowDetailsConfig_PROD from "./production/cashflowDetailsConfig";
import cashflowQuickSearchConfig_PROD from "./production/cashflowQuickSearchConfig";

const dynamicSetFieldConfig = () => {
  const env = CommonUtil.getEnv();
  let config = {
    cashflow: {
      ...cashflowConfig,
      ...cashflowDetailsConfig,
      ...cashflowQuickSearchConfig,
    },
  };
  if (["PROD", "PRE-PROD"].includes(env)) {
    config = {
      ...config,
      cashflow: {
        ...cashflowConfig_PROD,
        ...cashflowDetailsConfig_PROD,
        ...cashflowQuickSearchConfig_PROD,
      },
    };
  }
  return config;
};

const ratanConfig = {
  ...dynamicSetFieldConfig(),
};

export default ratanConfig;

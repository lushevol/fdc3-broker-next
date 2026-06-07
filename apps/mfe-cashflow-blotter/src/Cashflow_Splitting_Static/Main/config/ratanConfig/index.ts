/**
 * This whole ratanConfig folder is moved from ratan-container to cn cashflow to reduce the dependence on container.
 */
import { CommonUtil } from "src/Root/import";

import cashflowQuickSearchConfig from "./local/cashflowQuickSearchConfig";
import cashflowQuickSearchConfig_PROD from "./production/cashflowQuickSearchConfig";

const dynamicSetFieldConfig = () => {
  const env = CommonUtil.getEnv();
  let config = {
    cashflow: {
      ...cashflowQuickSearchConfig,
    },
  };
  if (["PROD", "PRE-PROD"].includes(env)) {
    config = {
      ...config,
      cashflow: {
        ...cashflowQuickSearchConfig_PROD,
      },
    };
  }
  return config;
};

const splittingConfig = {
  ...dynamicSetFieldConfig(),
};

export default splittingConfig;

import { getUser } from "src/Root/import/ratanutils";

import { getEnv } from "./index";

type Env =
  | "local"
  | "dev"
  | "uat"
  | "uat2"
  | "sit"
  | "eks"
  | "pre-prod"
  | "prod";

// env:
// if no env present, then feature is enable for all. Recommend to remove it as it's always return true.
// env allows single Env or multiple, e.g. "dev, uat, prod"
// NOT ALLOW to conflict with each other, otherwise will failed
// users:
// entitlements:
// if users and entitlements are both present, then have to match them both.
// if either one present, then have to match the one.
// if neither present, then feature is enable for all entitlements and all users.
type PilotFeaturesType<T extends string> = {
  [feature in T]?: {
    [env in Env]:
      | boolean
      | {
          users?: string[];
          entitlements?: string[];
        };
  };
};

const ScopePilotFeatures = {
  // 4558856
  Manual_Settle: {
    local: true,
    dev: true,
    uat: true,
    uat2: true,
    eks: false,
    sit: false,
    "pre-prod": false,
    prod: false,
  },
  Axios_GraphQL_Monitor_Wrapper: {
    local: true,
    dev: true,
    uat: true,
    uat2: true,
    eks: false,
    sit: false,
    "pre-prod": false,
    prod: false,
  },
  Version_Guard: {
    local: false,
    dev: true,
    uat: true,
    uat2: true,
    eks: false,
    sit: false,
    "pre-prod": false,
    prod: false,
  },
  LoanIQ_Netting_Validation: {
    local: true,
    dev: true,
    uat: true,
    uat2: true,
    eks: true,
    sit: true,
    "pre-prod": true,
    prod: true,
  },
  VD_Default_Query: {
    local: true,
    dev: true,
    uat: true,
    uat2: true,
    eks: true,
    sit: true,
    "pre-prod": true,
    prod: true,
  },
  Manual_Splitting: {
    local: true,
    dev: true,
    uat: true,
    uat2: true,
    eks: true,
    sit: true,
    "pre-prod": true,
    prod: true,
  },
  Enable_Search_Bar: {
    local: false,
    dev: false,
    uat: false,
    uat2: false,
    eks: false,
    sit: false,
    "pre-prod": false,
    prod: false,
  },
};

const cachedFeatureFlagMap = new Map<string, boolean>();

export const featureScopedEnabledFactor = <T extends string>(
  PilotFeatures: PilotFeaturesType<T>
) => {
  cachedFeatureFlagMap.clear();
  return (f: T): boolean => {
    if (cachedFeatureFlagMap.has(f)) return cachedFeatureFlagMap.get(f)!;
    const hasFeatureFlag = Object.keys(PilotFeatures).includes(f);
    if (!hasFeatureFlag) {
      cachedFeatureFlagMap.set(f, false);
      return false;
    }
    const featureConfig = PilotFeatures[f];
    // feature: {} means enable all
    if (!Object.keys(featureConfig!).length) {
      cachedFeatureFlagMap.set(f, true);
      return true;
    }
    const curUser = getUser();
    const curEnv = getEnv()?.toLowerCase();
    const settingsOfCurrentEnv = featureConfig![curEnv];
    if (typeof settingsOfCurrentEnv === "boolean") {
      cachedFeatureFlagMap.set(f, settingsOfCurrentEnv);
      return settingsOfCurrentEnv;
    }
    const { users, entitlements } = settingsOfCurrentEnv || {};
    const userPassed = users?.length ? users.includes(curUser.id) : true;
    const entitlementPassed = entitlements?.length
      ? entitlements.every((et) => curUser.entitlements.includes(et))
      : true;
    const enabled = userPassed && entitlementPassed;
    cachedFeatureFlagMap.set(f, enabled);
    return enabled;
  };
};

export const featureScopedEnabled =
  featureScopedEnabledFactor(ScopePilotFeatures);

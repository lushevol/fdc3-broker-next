import { getEnv } from "./common";
import featureflags from "./feature-flags.json";

type Env = "local" | "dev" | "uat" | "pre-prod" | "prod";

type PilotFeaturesType<T extends string> = {
  [feature in T]?: {
    [env in Env]: boolean;
  };
};

const ScopePilotFeatures = featureflags;

export const featureScopedEnabledFactor = <T extends string>(
  PilotFeatures: PilotFeaturesType<T>
) => {
  return (f: T): boolean => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchValue = searchParams.get(f);
    const hasFeatureFlag = PilotFeatures.hasOwnProperty(f);
    if (searchValue !== null && hasFeatureFlag) {
      const enabled = ["true", "1", "yes", "y"].includes(
        searchValue.toLowerCase()
      );
      return enabled;
    }

    if (!hasFeatureFlag) {
      return false;
    }

    const featureConfig = PilotFeatures[f];
    const curEnv = getEnv()?.toLowerCase();
    const settingsOfCurrentEnv = featureConfig?.hasOwnProperty(curEnv)
      ? featureConfig[curEnv]
      : false;
    return settingsOfCurrentEnv;
  };
};

export const featureScopedEnabled =
  featureScopedEnabledFactor(ScopePilotFeatures);

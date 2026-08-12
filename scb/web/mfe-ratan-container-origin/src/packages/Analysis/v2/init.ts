import { featureScopedEnabled } from "../../FeatureFlag/controller";
import { Station } from "./Station";

export const init = () => {
  return new Station();
};

if (featureScopedEnabled("PM_Client_SDK_V2")) {
  init();
}

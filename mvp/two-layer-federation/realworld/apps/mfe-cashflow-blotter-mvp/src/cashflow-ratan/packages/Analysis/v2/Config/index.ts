import { featureScopedEnabled } from "../import";
import { ServiceConfig } from "./type";

export const defaultServicePath = "/api/ratan/v1/ratan-analytic";
export const legacyServicePath = "/api/analytics/v1/fmo/print?extend=false";

export const defaultServiceConfig: ServiceConfig = {
  url: featureScopedEnabled("PM_Client_SDK_V2_Sender_v2")
    ? defaultServicePath
    : legacyServicePath,
  maxGroupCount: featureScopedEnabled("PM_Client_SDK_V2_Sender_v2") ? 10 : 1,
};

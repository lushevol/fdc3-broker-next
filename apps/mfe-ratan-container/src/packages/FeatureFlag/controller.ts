import { featureScopedEnabledFactor } from "./index";

const ScopePilotFeatures = {
  PM_Client_SDK_V2: {
    local: true,
    dev: true,
    uat: true,
    sit: true,
    "pre-prod": true,
    prod: true,
  },
  PM_Client_SDK_V2_Sender_v2: {
    local: true,
    dev: true,
    uat: false,
    sit: false,
    "pre-prod": false,
    prod: false,
  },
  PM_Client_SDK_V2_Enable_Check_KP: {
    local: true,
    dev: true,
    uat: true,
    sit: false,
    "pre-prod": false,
    prod: false,
  },
};

export const featureScopedEnabled =
  featureScopedEnabledFactor(ScopePilotFeatures);

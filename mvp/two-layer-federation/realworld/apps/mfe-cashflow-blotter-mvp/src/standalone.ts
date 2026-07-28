import {
  APPEARANCE_CONTRACT_VERSION,
  IDENTITY_CONTRACT_VERSION,
  type PlatformCapabilities,
} from '@fm/platform-contracts';
import { createAppearanceController, createIdentityController } from '@fm/platform-sdk';

const appearance = createAppearanceController({
  scheme: 'light',
  preference: 'light',
  density: 'compact',
  locale: 'en-SG',
  direction: 'ltr',
  contractVersion: APPEARANCE_CONTRACT_VERSION,
});
const identity = createIdentityController({
  state: 'authenticated',
  userId: 'cashflow.verifier',
  permissions: ['cashflow:view'],
  contractVersion: IDENTITY_CONTRACT_VERSION,
});

export const standaloneCapabilities: PlatformCapabilities = {
  navigation: { navigate: (path) => window.history.pushState({}, '', path) },
  notifications: { show: (message) => window.alert(message) },
  telemetry: { track: (event, data) => console.info('cashflow-blotter-event', { event, data }) },
  workspace: { closeCurrent: () => console.info('close Cashflow Blotter preview') },
  appearance: appearance.capability,
  identity: identity.capability,
};

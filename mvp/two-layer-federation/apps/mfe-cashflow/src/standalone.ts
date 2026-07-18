import {
  APPEARANCE_CONTRACT_VERSION,
  IDENTITY_CONTRACT_VERSION,
  type AppearanceSnapshot,
  type PlatformCapabilities,
} from '@fm/platform-contracts';
import { createAppearanceController, createIdentityController } from '@fm/platform-sdk';

export const STANDALONE_APPEARANCE: AppearanceSnapshot = {
  scheme: 'dark',
  preference: 'dark',
  density: 'compact',
  locale: 'en-US',
  direction: 'ltr',
  contractVersion: APPEARANCE_CONTRACT_VERSION,
};

const appearanceController = createAppearanceController(STANDALONE_APPEARANCE);
const identityController = createIdentityController({
  state: 'anonymous',
  contractVersion: IDENTITY_CONTRACT_VERSION,
});

export const standaloneCapabilities: PlatformCapabilities = {
  navigation: {
    navigate(path) {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    },
  },
  notifications: { show: (message) => window.alert(message) },
  telemetry: { track: (event, data) => console.info('cashflow-event', { event, data }) },
  workspace: { closeCurrent: () => console.info('close cashflow preview') },
  appearance: appearanceController.capability,
  identity: identityController.capability,
};

import {
  APPEARANCE_CONTRACT_VERSION,
  IDENTITY_CONTRACT_VERSION,
  type PlatformCapabilities,
} from '@fm/platform-contracts';
import { createAppearanceController, createIdentityController } from '@fm/platform-sdk';

const appearance = createAppearanceController({ scheme: 'dark', preference: 'dark', density: 'comfortable', locale: 'en-SG', direction: 'ltr', contractVersion: APPEARANCE_CONTRACT_VERSION });
const identity = createIdentityController({ state: 'authenticated', userId: 'fdc3.verifier', permissions: ['fdc3:admin'], contractVersion: IDENTITY_CONTRACT_VERSION });
export const standaloneCapabilities: PlatformCapabilities = {
  navigation: { navigate: (path) => window.history.pushState({}, '', path) },
  notifications: { show: (message) => window.alert(message) },
  telemetry: { track: (event, data) => console.info('fdc3-event', { event, data }) },
  workspace: { closeCurrent: () => console.info('close fdc3 preview') },
  appearance: appearance.capability,
  identity: identity.capability,
};

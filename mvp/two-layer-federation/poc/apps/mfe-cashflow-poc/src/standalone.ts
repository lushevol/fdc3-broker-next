import {
  APPEARANCE_CONTRACT_VERSION,
  type AppearanceSnapshot,
} from '@fm/platform-contracts-poc';
import { createAppearanceController } from '@fm/platform-sdk-poc';

export const STANDALONE_APPEARANCE: AppearanceSnapshot = {
  scheme: 'dark',
  preference: 'dark',
  density: 'compact',
  locale: 'en-US',
  direction: 'ltr',
  contractVersion: APPEARANCE_CONTRACT_VERSION,
};

export const standaloneAppearanceCapability = createAppearanceController(
  STANDALONE_APPEARANCE,
).capability;

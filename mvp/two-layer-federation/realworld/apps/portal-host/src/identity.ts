import {
  IDENTITY_CONTRACT_VERSION,
  type IdentityCapability,
  type IdentitySnapshot,
} from '@fm/platform-contracts';

export const ANONYMOUS_IDENTITY_SNAPSHOT: IdentitySnapshot = Object.freeze({
  state: 'anonymous',
  contractVersion: IDENTITY_CONTRACT_VERSION,
});

export const ANONYMOUS_IDENTITY_CAPABILITY: IdentityCapability = Object.freeze({
  getSnapshot: () => ANONYMOUS_IDENTITY_SNAPSHOT,
  subscribe: () => () => undefined,
});

import {
  APPLICATION_CONTRACT_VERSION,
  APPEARANCE_CONTRACT_VERSION,
  IDENTITY_CONTRACT_VERSION,
  type ApplicationRegistryEntry,
} from '@fm/platform-contracts';

export const entry: ApplicationRegistryEntry = {
  id: 'cashflow', displayName: 'Cashflow', remoteName: 'mfe_cashflow',
  manifestUrl: 'http://127.0.0.1:9201/mf-manifest.json', exposedModule: './application',
  basePath: '/cashflow', contractVersion: APPLICATION_CONTRACT_VERSION,
  appearanceContractVersion: APPEARANCE_CONTRACT_VERSION,
  identityContractVersion: IDENTITY_CONTRACT_VERSION,
  capabilities: ['navigation', 'notifications', 'telemetry', 'workspace', 'appearance', 'identity'],
};

import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

export default createModuleFederationConfig({
  name: 'mfe_cashflow_poc',
  filename: 'remoteEntry.js',
  exposes: {
    './application': './src/application.tsx',
    './positions': './src/positions.tsx',
  },
  dts: false,
});

import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';

export default createModuleFederationConfig({
  name: 'mfe_cashflow',
  filename: 'remoteEntry.js',
  exposes: { './application': './src/application.tsx' },
  dts: false,
  // An independently deployed application owns its React runtime. It must not
  // consume the portal's React singleton, because host and application may be
  // on different supported React major versions.
  shared: {},
});

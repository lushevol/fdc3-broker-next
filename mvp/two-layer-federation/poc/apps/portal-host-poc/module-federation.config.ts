import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';
import pkg from './package.json';

export default createModuleFederationConfig({
  name: 'portal_host_poc',
  dts: false,
  shared: {
    react: { singleton: true, requiredVersion: pkg.dependencies.react },
    'react-dom': { singleton: true, requiredVersion: pkg.dependencies['react-dom'] },
  },
});

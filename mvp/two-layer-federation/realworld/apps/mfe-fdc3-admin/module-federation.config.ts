import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';
import pkg from './package.json';

export default createModuleFederationConfig({
  name: 'mfe_fdc3_admin',
  filename: 'remoteEntry.js',
  exposes: { './application': './src/application.tsx' },
  dts: false,
  shared: {
    react: { singleton: true, eager: true, requiredVersion: pkg.dependencies.react },
    'react-dom': { singleton: true, eager: true, requiredVersion: pkg.dependencies['react-dom'] },
  },
});

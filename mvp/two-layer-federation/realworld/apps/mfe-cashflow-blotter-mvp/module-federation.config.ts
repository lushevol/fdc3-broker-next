import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';
import pkg from './package.json';

export default createModuleFederationConfig({
  name: 'mfe_cashflow_blotter',
  filename: 'remoteEntry.js',
  exposes: { './application': './src/application.tsx' },
  dts: false,
  shared: {
    react: {
      singleton: true,
      requiredVersion: pkg.dependencies.react,
    },
    'react-dom': {
      singleton: true,
      requiredVersion: pkg.dependencies['react-dom'],
    },
    'react/': {
      singleton: true,
      requiredVersion: pkg.dependencies.react,
    },
    'react-dom/': {
      singleton: true,
      requiredVersion: pkg.dependencies['react-dom'],
    },
  },
});

import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';
import pkg from './package.json';

export default createModuleFederationConfig({
  name: 'ratan_cashflow_blotter',
  filename: 'ratan_cashflow_blotter.js',
  dts: false,
  exposes: {
    '.': './src/root.tsx',
  },
  remotes: {
    '@fm/ratan_container': 'ratan_container@http://localhost:8009/mf-manifest.json',
  },
  shared: {
    react: {
      singleton: true,
      requiredVersion: pkg.dependencies.react,
    },
    'react-dom': {
      singleton: true,
      requiredVersion: pkg.dependencies['react-dom'],
    },
  },
});

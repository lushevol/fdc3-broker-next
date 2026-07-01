import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';
import pkg from './package.json';

export default createModuleFederationConfig({
  name: 'ratan_container',
  filename: 'ratan_container.js',
  dts: false,
  exposes: {
    '.': './src/root.tsx',
  },
  remotes: {
    '@fm/ratan_cashflow_blotter': 'ratan_cashflow_blotter@http://localhost:8015/mf-manifest.json',
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

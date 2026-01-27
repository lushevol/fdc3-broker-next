import { createModuleFederationConfig } from '@module-federation/rsbuild-plugin';
import pkg from './package.json';

export default createModuleFederationConfig({
  name: pkg.name,
  filename: `${pkg.name}.js`,
  exposes: {
    '.': './src/index.tsx',
  },
  remotes: {
    mf_tile: 'mf_tile@http://localhost:3001/mf-manifest.json',
  },
  shared: {
    react: {
      singleton: true,
      eager: true,
      requiredVersion: pkg.dependencies.react,
    },
    'react-dom': {
      singleton: true,
      eager: true,
      requiredVersion: pkg.dependencies['react-dom'],
    },
  },
});
